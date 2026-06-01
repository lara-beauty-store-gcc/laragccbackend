import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { config, isConfigured } from './config.js';
import { closeDb, getPool, initDb } from './db.js';
import { log } from './logger.js';
import eventsRouter from './routes/events.js';
import ordersRouter from './routes/orders.js';

const app = express();

app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '1mb' }));

function buildAllowedOrigins() {
  const list = [...config.corsOrigins];
  if (config.frontendUrl) list.push(config.frontendUrl);
  list.push('https://larabeauty.store', 'https://www.larabeauty.store');
  return [...new Set(list.filter(Boolean))];
}

const allowedOrigins = buildAllowedOrigins();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || config.appEnv !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('CORS blocked'));
    },
    credentials: true,
  }),
);

app.get('/health', async (_req, res) => {
  let db = false;
  const p = getPool();
  if (p) {
    try {
      await p.query('SELECT 1');
      db = true;
    } catch {
      db = false;
    }
  }
  res.json({
    status: 'ok',
    app: config.appName,
    env: config.appEnv,
    db,
    configured: isConfigured(),
  });
});

app.get('/', (_req, res) => {
  res.json({
    service: config.appName,
    version: '1.0.0',
    endpoints: {
      health: '/health',
      orders: 'POST /api/v1/orders',
      events: 'POST /api/events',
    },
  });
});

app.use('/api/v1/orders', ordersRouter);
app.use('/api/events', eventsRouter);

app.use((err, _req, res, _next) => {
  if (err.message === 'CORS blocked') {
    return res.status(403).json({ error: 'cors_blocked' });
  }
  log.error(err);
  return res.status(500).json({ error: 'internal_error' });
});

function startServer() {
  const server = app.listen(config.port, '0.0.0.0', () => {
    log.info('========================================');
    log.info(`${config.appName} READY on 0.0.0.0:${config.port}`);
    log.info('Health: GET /health');
    log.info('Orders: POST /api/v1/orders');
    log.info('CORS origins:', allowedOrigins.join(', ') || '(none)');
    log.info('Configured:', JSON.stringify(isConfigured()));
    log.info('========================================');
  });

  server.on('error', (err) => {
    log.error('Server listen error:', err);
    process.exit(1);
  });
}

async function start() {
  log.info('Starting API...', { port: config.port, env: config.appEnv });

  try {
    const ok = await initDb();
    if (ok) log.info('Database migrations complete');
  } catch (err) {
    log.error('Database init failed — API continues without DB:', err.message);
  }

  startServer();
}

process.on('uncaughtException', (err) => {
  log.error('uncaughtException:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  log.error('unhandledRejection:', err);
});

start().catch((err) => {
  log.error('Startup failed', err);
  process.exit(1);
});

process.on('SIGTERM', async () => {
  await closeDb();
  process.exit(0);
});
