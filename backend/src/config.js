function env(key, fallback = '') {
  return (process.env[key] ?? fallback).trim();
}

function envBool(key, fallback = false) {
  const raw = env(key);
  if (!raw) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(raw.toLowerCase());
}

/** EasyPanel may pass ENABLE_IP_FRAUD-CHECK (hyphen). */
function fraudCheckEnabled() {
  return (
    envBool('ENABLE_IP_FRAUD_CHECK') ||
    envBool('ENABLE_IP_FRAUD-CHECK')
  );
}

export const config = {
  appEnv: env('APP_ENV', 'production'),
  appName: env('APP_NAME', 'Lara GCC Backend'),
  port: Number(env('PORT', '8000')),
  apiBaseUrl: env('API_BASE_URL'),
  frontendUrl: env('FRONTEND_URL'),
  databaseUrl: env('DATABASE_URL'),
  corsOrigins: env('CORS_ORIGINS')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  gitSha: env('GIT_SHA'),

  sheetsWebhookUrl: env('GOOGLE_SHEETS_WEBHOOK_URL'),
  sheetsWebhookSecret: env('SHEETS_WEBHOOK_SECRET'),

  meta: {
    pixelId: env('META_PIXEL_ID'),
    accessToken: env('META_ACCESS_TOKEN'),
    apiVersion: env('META_API_VERSION', 'v21.0'),
  },
  tiktok: {
    pixelCode: env('TIKTOK_PIXEL_CODE'),
    accessToken: env('TIKTOK_ACCESS_TOKEN'),
    apiVersion: env('TIKTOK_API_VERSION', 'v1.3'),
  },
  snap: {
    pixelId: env('SNAP_PIXEL_ID'),
    accessToken: env('SNAP_ACCESS_TOKEN'),
  },

  enableCapi: envBool('ENABLE_CAPI', true),
  enableMetaCapi: envBool('ENABLE_META_CAPI', true),
  enableTiktokCapi: envBool('ENABLE_TIKTOK_CAPI', true),
  enableSnapCapi: envBool('ENABLE_SNAP_CAPI', true),

  maxmind: {
    accountId: env('MAXMIND_ACCOUNT_ID'),
    licenseKey: env('MAXMIND_LICENSE_KEY'),
  },
  enableIpFraudCheck: fraudCheckEnabled(),

  whitelistedPhones: env('WHITELISTED_PHONES')
    .split(',')
    .map((p) => p.replace(/\D/g, ''))
    .filter(Boolean),

  logLevel: env('LOG_LEVEL', 'INFO').toUpperCase(),
};

export function isConfigured() {
  return {
    meta: Boolean(config.meta.pixelId && config.meta.accessToken),
    tiktok: Boolean(config.tiktok.pixelCode && config.tiktok.accessToken),
    snap: Boolean(config.snap.pixelId && config.snap.accessToken),
    sheets: Boolean(config.sheetsWebhookUrl),
    database: Boolean(config.databaseUrl),
    maxmind: Boolean(config.maxmind.accountId && config.maxmind.licenseKey),
  };
}
