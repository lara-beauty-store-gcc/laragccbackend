import pg from 'pg';
import { config } from './config.js';
import { log } from './logger.js';

let pool;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function renameColumnIfExists(table, from, to) {
  const check = await pool.query(
    `SELECT 1 FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = $1 AND column_name = $2`,
    [table, from],
  );
  if (check.rowCount === 0) return;
  await pool.query(`ALTER TABLE ${table} RENAME COLUMN ${from} TO ${to}`);
  log.info(`DB migration: ${table}.${from} → ${to}`);
}

export async function initDb() {
  if (!config.databaseUrl) {
    log.info('DATABASE_URL not set — database disabled');
    return false;
  }

  const maxAttempts = 3;
  let lastErr;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      pool = new pg.Pool({
        connectionString: config.databaseUrl,
        ssl: config.databaseUrl.includes('sslmode=require')
          ? { rejectUnauthorized: false }
          : undefined,
        max: 10,
        connectionTimeoutMillis: 8000,
      });
      await pool.query('SELECT 1');
      lastErr = null;
      log.info(`Database connected (attempt ${attempt}/${maxAttempts})`);
      break;
    } catch (err) {
      lastErr = err;
      pool = undefined;
      log.warn(
        `Database not ready (attempt ${attempt}/${maxAttempts}):`,
        err.message,
      );
      if (attempt < maxAttempts) await sleep(2000);
    }
  }

  if (lastErr) {
    log.warn(
      'Database unavailable after retries — API continues without Postgres:',
      lastErr.message,
    );
    pool = undefined;
    return false;
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id BIGSERIAL PRIMARY KEY,
      order_number VARCHAR(32) UNIQUE NOT NULL,
      customer_name VARCHAR(255) NOT NULL,
      phone_e164 VARCHAR(20) NOT NULL,
      area_notes TEXT,
      subtotal_amount DECIMAL(10,3) NOT NULL,
      total_amount DECIMAL(10,3) NOT NULL,
      currency CHAR(3) DEFAULT 'AED',
      payment_method VARCHAR(10) DEFAULT 'COD',
      status VARCHAR(30) DEFAULT 'pending_confirmation',
      upsell_accepted BOOLEAN DEFAULT false,
      upsell_product_id VARCHAR(50),
      upsell_amount DECIMAL(10,3),
      event_id VARCHAR(64),
      source_url TEXT,
      client_ip TEXT,
      sheet_synced BOOLEAN DEFAULT false,
      sheet_sync_error TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id BIGSERIAL PRIMARY KEY,
      order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
      product_id VARCHAR(50),
      sku VARCHAR(50),
      product_name VARCHAR(255),
      bundle_id VARCHAR(20),
      quantity INT DEFAULT 1,
      unit_price DECIMAL(10,3),
      line_total DECIMAL(10,3)
    );

    CREATE TABLE IF NOT EXISTS conversion_events (
      id BIGSERIAL PRIMARY KEY,
      event_name TEXT NOT NULL,
      order_id TEXT,
      payload JSONB,
      results JSONB,
      client_ip TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS sheet_sync_error TEXT`);

  await renameColumnIfExists('orders', 'subtotal_kwd', 'subtotal_amount');
  await renameColumnIfExists('orders', 'total_kwd', 'total_amount');
  await renameColumnIfExists('orders', 'upsell_amount_kwd', 'upsell_amount');
  await renameColumnIfExists('order_items', 'unit_price_kwd', 'unit_price');
  await renameColumnIfExists('order_items', 'line_total_kwd', 'line_total');

  await pool.query(`ALTER TABLE orders ALTER COLUMN currency SET DEFAULT 'AED'`);

  log.info('Database migrations OK');
  return true;
}

export function getPool() {
  return pool;
}

export async function createOrder(order, items) {
  if (!pool) throw new Error('database_unavailable');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const r = await client.query(
      `INSERT INTO orders (
        order_number, customer_name, phone_e164, area_notes,
        subtotal_amount, total_amount, currency, payment_method, status,
        upsell_accepted, upsell_product_id, upsell_amount,
        event_id, source_url, client_ip
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      RETURNING id`,
      [
        order.orderNumber,
        order.customerName,
        order.phoneE164,
        order.areaNotes || null,
        order.subtotalAmount,
        order.totalAmount,
        order.currency || 'AED',
        order.paymentMethod || 'COD',
        order.status || 'pending_confirmation',
        order.upsellAccepted || false,
        order.upsellProductId || null,
        order.upsellAmount || null,
        order.eventId || null,
        order.sourceUrl || null,
        order.clientIp || null,
      ],
    );
    const orderId = r.rows[0].id;

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (
          order_id, product_id, sku, product_name, bundle_id,
          quantity, unit_price, line_total
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          orderId,
          item.productId,
          item.sku,
          item.productName,
          item.bundleId || null,
          item.quantity || 1,
          item.unitPrice,
          item.lineTotal,
        ],
      );
    }

    await client.query('COMMIT');
    return { orderId, orderNumber: order.orderNumber };
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

export async function markSheetSynced(orderNumber, error) {
  if (!pool) return;
  try {
    await pool.query(
      `UPDATE orders SET sheet_synced = $2, sheet_sync_error = $3 WHERE order_number = $1`,
      [orderNumber, !error, error || null],
    );
  } catch (err) {
    log.warn('markSheetSynced failed', err.message);
  }
}

export async function logEvent(eventName, payload, results, clientIp) {
  if (!pool) return;
  try {
    await pool.query(
      `INSERT INTO conversion_events (event_name, order_id, payload, results, client_ip)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        eventName,
        payload.orderId || null,
        JSON.stringify(payload),
        JSON.stringify(results),
        clientIp || null,
      ],
    );
  } catch (err) {
    log.error('Failed to log event', err.message);
  }
}

export async function closeDb() {
  if (pool) await pool.end();
}
