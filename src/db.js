import pg from 'pg';
import { config } from './config.js';
import { log } from './logger.js';

let pool;

export async function initDb() {
  if (!config.databaseUrl) {
    log.info('DATABASE_URL not set — event logging disabled');
    return;
  }

  pool = new pg.Pool({
    connectionString: config.databaseUrl,
    ssl: config.databaseUrl.includes('sslmode=require')
      ? { rejectUnauthorized: false }
      : undefined,
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS conversion_events (
      id BIGSERIAL PRIMARY KEY,
      event_name TEXT NOT NULL,
      order_id TEXT,
      payload JSONB,
      results JSONB,
      client_ip TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  log.info('Database ready');
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
    log.error('Failed to log event to DB', err.message);
  }
}

export async function closeDb() {
  if (pool) await pool.end();
}
