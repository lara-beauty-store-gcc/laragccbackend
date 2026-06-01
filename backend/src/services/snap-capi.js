import { config } from '../config.js';
import { log } from '../logger.js';
import { normalizePhone, sha256 } from '../utils/hash.js';

export async function sendSnapEvent(eventName, payload, context) {
  if (!config.enableCapi || !config.enableSnapCapi) {
    return { ok: true, skipped: true };
  }

  const { pixelId, accessToken } = config.snap;
  if (!pixelId || !accessToken) {
    return { ok: true, skipped: true, reason: 'snap_not_configured' };
  }

  const snapEvent = mapEventName(eventName);
  if (!snapEvent) {
    return { ok: true, skipped: true, reason: 'unsupported_event' };
  }

  const body = {
    pixel_id: pixelId,
    event_type: snapEvent,
    event_conversion_type: 'WEB',
    event_tag: payload.eventId || `${snapEvent}_${Date.now()}`,
    timestamp_micros: Date.now() * 1000,
    user_agent: context.userAgent,
    ip_address: context.ip,
    page_url: payload.sourceUrl || config.frontendUrl,
    hashed_email: payload.email ? sha256(payload.email) : undefined,
    hashed_phone_number: payload.phone
      ? sha256(normalizePhone(payload.phone))
      : undefined,
    price: payload.value,
    currency: payload.currency || 'KWD',
    transaction_id: payload.orderId,
    item_ids: payload.contentIds,
  };

  const url = 'https://tr.snapchat.com/v2/conversion';

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    let json = {};
    try {
      json = JSON.parse(text);
    } catch {
      json = { raw: text };
    }
    if (!res.ok) {
      log.warn('Snap CAPI error', res.status, json);
      return { ok: false, status: res.status, body: json };
    }
    return { ok: true, body: json };
  } catch (err) {
    log.error('Snap CAPI request failed', err.message);
    return { ok: false, error: err.message };
  }
}

function mapEventName(name) {
  const map = {
    Purchase: 'PURCHASE',
    Lead: 'SIGN_UP',
    AddToCart: 'ADD_CART',
    InitiateCheckout: 'START_CHECKOUT',
    ViewContent: 'VIEW_CONTENT',
  };
  return map[name] || name.toUpperCase();
}
