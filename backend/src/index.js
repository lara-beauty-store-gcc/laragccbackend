import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { config, isConfigured } from './config.js';
import { closeDb, initDb } from './db.js';
import { log } from './logger.js';
import eventsRouter from './routes/events.js';

const app = express();

app.use(helmet());
app.use(express.json({ limit: '1mb' }));

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    const allowed = config.corsOrigins.length
      ? config.corsOrigins
      : config.frontendUrl
        ? [config.frontendUrl]
        : [];
    if (allowed.length === 0 || allowed.includes(origin) || allowed.includes('*')) {
      return callback(null, true);
    }
    return callback(new Error('CORS blocked'));
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: config.appName,
    env: config.appEnv,
    gitSha: config.gitSha || undefined,
    configured: isConfigured(),
  });
});

app.get('/', (_req, res) => {
  res.json({
    service: config.appName,
    version: '1.0.0',
    endpoints: {
      health: '/health',
      events: 'POST /api/events/:eventName (Purchase, Lead, …)',
      checkout: 'POST /api/events',
    },
  });
});

app.use('/api/events', eventsRouter);

app.use((err, _req, res, _next) => {
  if (err.message === 'CORS blocked') {
    return res.status(403).json({ error: 'cors_blocked' });
  }
  log.error(err);
  return res.status(500).json({ error: 'internal_error' });
});

async function start() {
  try {
    await initDb();
  } catch (err) {
    log.error('Database init failed — API continues without DB', err.message);
  }

  app.listen(config.port, '0.0.0.0', () => {
    log.info(`${config.appName} listening on 0.0.0.0:${config.port}`);
    log.info('Configured:', isConfigured());
  });
}

start().catch((err) => {
  log.error('Startup failed', err);
  process.exit(1);
});

process.on('SIGTERM', async () => {
  await closeDb();
  process.exit(0);
});
