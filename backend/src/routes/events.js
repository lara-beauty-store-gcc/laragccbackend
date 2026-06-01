import { Router } from 'express';
import { config } from '../config.js';
import { logEvent } from '../db.js';
import { log } from '../logger.js';
import { checkIpRisk } from '../services/maxmind.js';
import { sendMetaEvent } from '../services/meta-capi.js';
import { forwardToGoogleSheets } from '../services/sheets.js';
import { sendSnapEvent } from '../services/snap-capi.js';
import { sendTiktokEvent } from '../services/tiktok-capi.js';
import { normalizePhone } from '../utils/hash.js';

const router = Router();

const ALLOWED_EVENTS = new Set([
  'Purchase',
  'Lead',
  'AddToCart',
  'InitiateCheckout',
  'ViewContent',
]);

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return String(forwarded).split(',')[0].trim();
  return req.socket.remoteAddress || '';
}

async function dispatchEvent(eventName, payload, context) {
  const phoneDigits = normalizePhone(payload.phone);

  const fraud = await checkIpRisk(context.ip, phoneDigits);
  if (!fraud.allowed) {
    return {
      ok: false,
      status: 403,
      body: { error: 'blocked', reason: fraud.reason, risk: fraud.risk },
    };
  }

  const [meta, tiktok, snap, sheets] = await Promise.all([
    sendMetaEvent(eventName, payload, context),
    sendTiktokEvent(eventName, payload, context),
    sendSnapEvent(eventName, payload, context),
    forwardToGoogleSheets(eventName, payload),
  ]);

  const results = { meta, tiktok, snap, sheets, fraud };

  await logEvent(eventName, payload, results, context.ip);

  const failures = [meta, tiktok, snap, sheets].filter((r) => r && r.ok === false);
  if (failures.length > 0) {
    log.warn('Partial CAPI failure', eventName, failures.length);
  }

  return {
    ok: true,
    status: 200,
    body: { success: true, event: eventName, results },
  };
}

async function handleEventRequest(req, res, eventName) {
  if (!ALLOWED_EVENTS.has(eventName)) {
    return res.status(400).json({
      error: 'invalid_event',
      allowed: [...ALLOWED_EVENTS],
    });
  }

  const payload = req.body || {};
  const context = {
    ip: clientIp(req),
    userAgent: req.headers['user-agent'] || '',
  };

  try {
    const result = await dispatchEvent(eventName, payload, context);
    return res.status(result.status).json(result.body);
  } catch (err) {
    log.error('Event handler error', err);
    return res.status(500).json({ error: 'internal_error' });
  }
}

/** Storefront checkout — body: { eventName?, orderId, value, ... } */
router.post('/', (req, res) => {
  const eventName = req.body?.eventName || req.body?.event || 'Purchase';
  return handleEventRequest(req, res, eventName);
});

router.post('/:eventName', (req, res) => {
  return handleEventRequest(req, res, req.params.eventName);
});

export default router;
