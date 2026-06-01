import { config } from '../config.js';
import { log } from '../logger.js';

export async function forwardToGoogleSheets(eventName, payload) {
  if (!config.sheetsWebhookUrl) {
    return { ok: true, skipped: true, reason: 'sheets_not_configured' };
  }

  const body = {
    secret: config.sheetsWebhookSecret || undefined,
    event: eventName,
    timestamp: new Date().toISOString(),
    orderId: payload.orderId,
    value: payload.value,
    currency: payload.currency,
    email: payload.email,
    phone: payload.phone,
    products: payload.products,
    raw: payload,
  };

  try {
    const res = await fetch(config.sheetsWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      log.warn('Google Sheets webhook failed', res.status, text);
      return { ok: false, status: res.status, body: text };
    }
    return { ok: true };
  } catch (err) {
    log.error('Google Sheets webhook error', err.message);
    return { ok: false, error: err.message };
  }
}
