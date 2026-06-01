import { config } from '../config.js';
import { log } from '../logger.js';
import { normalizePhone, sha256 } from '../utils/hash.js';

export async function sendMetaEvent(eventName, payload, context) {
  if (!config.enableCapi || !config.enableMetaCapi) {
    return { ok: true, skipped: true };
  }

  const { pixelId, accessToken, apiVersion } = config.meta;
  if (!pixelId || !accessToken) {
    return { ok: true, skipped: true, reason: 'meta_not_configured' };
  }

  const userData = {
    client_ip_address: context.ip,
    client_user_agent: context.userAgent,
    fbc: payload.fbc,
    fbp: payload.fbp,
  };

  if (payload.email) userData.em = sha256(payload.email);
  if (payload.phone) userData.ph = sha256(normalizePhone(payload.phone));

  const body = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: payload.eventId || `${eventName}_${Date.now()}`,
        event_source_url: payload.sourceUrl || config.frontendUrl,
        action_source: 'website',
        user_data: Object.fromEntries(
          Object.entries(userData).filter(([, v]) => v != null && v !== ''),
        ),
        custom_data: {
          currency: payload.currency || 'KWD',
          value: payload.value,
          content_ids: payload.contentIds,
          content_type: payload.contentType || 'product',
          order_id: payload.orderId,
        },
      },
    ],
    access_token: accessToken,
  };

  const url = `https://graph.facebook.com/${apiVersion}/${pixelId}/events`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      log.warn('Meta CAPI error', res.status, json);
      return { ok: false, status: res.status, body: json };
    }
    return { ok: true, body: json };
  } catch (err) {
    log.error('Meta CAPI request failed', err.message);
    return { ok: false, error: err.message };
  }
}
