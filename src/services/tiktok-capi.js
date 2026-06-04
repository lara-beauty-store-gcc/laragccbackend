import { config } from '../config.js';
import { log } from '../logger.js';
import { normalizePhone, sha256 } from '../utils/hash.js';

export async function sendTiktokEvent(eventName, payload, context) {
  if (!config.enableCapi || !config.enableTiktokCapi) {
    return { ok: true, skipped: true };
  }

  const { pixelCode, accessToken, apiVersion } = config.tiktok;
  if (!pixelCode || !accessToken) {
    return { ok: true, skipped: true, reason: 'tiktok_not_configured' };
  }

  const tiktokEvent = mapEventName(eventName);
  if (!tiktokEvent) {
    return { ok: true, skipped: true, reason: 'unsupported_event' };
  }

  const body = {
    event_source: 'web',
    event_source_id: pixelCode,
    data: [
      {
        event: tiktokEvent,
        event_time: Math.floor(Date.now() / 1000),
        event_id: payload.eventId || `${tiktokEvent}_${Date.now()}`,
        user: {
          ip: context.ip,
          user_agent: context.userAgent,
          email: payload.email ? sha256(payload.email) : undefined,
          phone: payload.phone ? sha256(normalizePhone(payload.phone)) : undefined,
        },
        properties: {
          currency: payload.currency || 'KWD',
          value: payload.value,
          content_type: payload.contentType || 'product',
          content_ids: payload.contentIds,
          order_id: payload.orderId,
        },
        page: {
          url: payload.sourceUrl || config.frontendUrl,
        },
      },
    ],
  };

  const url = `https://business-api.tiktok.com/open_api/${apiVersion}/event/track/`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': accessToken,
      },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.code !== 0) {
      log.warn('TikTok CAPI error', res.status, json);
      return { ok: false, status: res.status, body: json };
    }
    return { ok: true, body: json };
  } catch (err) {
    log.error('TikTok CAPI request failed', err.message);
    return { ok: false, error: err.message };
  }
}

function mapEventName(name) {
  const map = {
    Purchase: 'CompletePayment',
    Lead: 'SubmitForm',
    AddToCart: 'AddToCart',
    InitiateCheckout: 'InitiateCheckout',
    ViewContent: 'ViewContent',
  };
  return map[name] || name;
}
