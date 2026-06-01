import pg from 'pg';
import { config } from './config.js';
import { log } from './logger.js';

let pool;

export async function initDb() {
  if (!config.databaseUrl) {
    log.info('DATABASE_URL not set — database disabled');
    return false;
  }

  pool = new pg.Pool({
    connectionString: config.databaseUrl,
    ssl: config.databaseUrl.includes('sslmode=require')
      ? { rejectUnauthorized: false }
      : undefined,
    max: 10,
    connectionTimeoutMillis: 8000,
  });

  try {
    await pool.query('SELECT 1');
  } catch (err) {
    pool = undefined;
    throw err;
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id BIGSERIAL PRIMARY KEY,
      order_number VARCHAR(32) UNIQUE NOT NULL,
      customer_name VARCHAR(255) NOT NULL,
      phone_e164 VARCHAR(20) NOT NULL,
      area_notes TEXT,
      subtotal_kwd DECIMAL(10,3) NOT NULL,
      total_kwd DECIMAL(10,3) NOT NULL,
      currency CHAR(3) DEFAULT 'KWD',
      payment_method VARCHAR(10) DEFAULT 'COD',
      status VARCHAR(30) DEFAULT 'pending_confirmation',
      upsell_accepted BOOLEAN DEFAULT false,
      upsell_product_id VARCHAR(50),
      upsell_amount_kwd DECIMAL(10,3),
      event_id VARCHAR(64),
      source_url TEXT,
      client_ip TEXT,
      sheet_synced BOOLEAN DEFAULT false,
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
      unit_price_kwd DECIMAL(10,3),
      line_total_kwd DECIMAL(10,3)
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
        subtotal_kwd, total_kwd, currency, payment_method, status,
        upsell_accepted, upsell_product_id, upsell_amount_kwd,
        event_id, source_url, client_ip
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      RETURNING id`,
      [
        order.orderNumber,
        order.customerName,
        order.phoneE164,
        order.areaNotes || null,
        order.subtotalKwd,
        order.totalKwd,
        order.currency || 'KWD',
        order.paymentMethod || 'COD',
        order.status || 'pending_confirmation',
        order.upsellAccepted || false,
        order.upsellProductId || null,
        order.upsellAmountKwd || null,
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
          quantity, unit_price_kwd, line_total_kwd
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          orderId,
          item.productId,
          item.sku,
          item.productName,
          item.bundleId || null,
          item.quantity || 1,
          item.unitPriceKwd,
          item.lineTotalKwd,
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
  await pool.query(
    `UPDATE orders SET sheet_synced = $2, sheet_sync_error = $3 WHERE order_number = $1`,
    [orderNumber, !error, error || null],
  );
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
