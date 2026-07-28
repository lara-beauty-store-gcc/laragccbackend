import { config } from '../config.js';
import { log } from '../logger.js';

/** GAS web app URLs sometimes include /u/1/ — strip for server-to-server POST. */
export function normalizeAppsScriptUrl(url) {
  return String(url || '').replace('/macros/u/1/', '/macros/').trim();
}

function countryFromPhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.startsWith('971')) return 'AE';
  if (digits.startsWith('965')) return 'KW';
  return 'AE';
}

function buildSheetBody(eventName, payload) {
  const items = Array.isArray(payload.items) ? payload.items : [];
  const orderId = payload.order_number || payload.orderId || '';
  const phone = payload.phone_e164 || payload.phone || '';
  const total = payload.total_kwd ?? payload.total ?? payload.value ?? 0;
  const currency = payload.currency || 'AED';
  const now = new Date().toISOString();

  return {
    secret: config.sheetsWebhookSecret || undefined,
    event: eventName,
    timestamp: now,
    // User sheet columns (Tabellenblatt1)
    date: now,
    'order id': orderId,
    order_id: orderId,
    order_number: orderId,
    country: payload.country || countryFromPhone(phone),
    name: payload.customer_name || payload.customerName || '',
    customer_name: payload.customer_name || payload.customerName || '',
    phone,
    phone_e164: phone,
    product: items.map((i) => i.productName || i.name).filter(Boolean).join(' + '),
    url: payload.source_url || payload.sourceUrl || '',
    source_url: payload.source_url || payload.sourceUrl || '',
    sku: items.map((i) => i.sku).filter(Boolean).join(', '),
    quantite: items.reduce((sum, i) => sum + (Number(i.quantity) || 1), 0) || 1,
    totalprice: total,
    total_kwd: total,
    subtotal_kwd: payload.subtotal_kwd ?? total,
    currency,
    area_notes: payload.area_notes || payload.area || '',
    items,
    payment_method: payload.payment_method || 'COD',
    upsell_accepted: payload.upsell_accepted ?? false,
    event_id: payload.eventId,
    status: 'pending_confirmation',
  };
}

/**
 * Google Apps Script returns 302 → script.googleusercontent.com echo URL.
 * fetch() with redirect:'follow' turns POST into GET and breaks the webhook.
 */
export async function postToAppsScript(url, body) {
  const target = normalizeAppsScriptUrl(url);
  const init = await fetch(target, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  });

  if (init.status === 301 || init.status === 302) {
    const location = init.headers.get('location');
    if (!location) {
      return { ok: false, status: init.status, error: 'missing_redirect_location' };
    }
    const follow = await fetch(location, { method: 'GET' });
    const text = await follow.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
    const success = data?.success === true || data?.ok === true;
    if (!success && !follow.ok) {
      return { ok: false, status: follow.status, body: text, data };
    }
    return { ok: true, status: follow.status, data, body: text };
  }

  const text = await init.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = null;
  }
  const success = data?.success === true || data?.ok === true;
  if (!init.ok && !success) {
    return { ok: false, status: init.status, body: text, data };
  }
  return { ok: true, status: init.status, data, body: text };
}

export async function forwardToGoogleSheets(eventName, payload) {
  if (!config.sheetsWebhookUrl) {
    return { ok: true, skipped: true, reason: 'sheets_not_configured' };
  }

  const body = buildSheetBody(eventName, payload);

  try {
    const result = await postToAppsScript(config.sheetsWebhookUrl, body);
    if (!result.ok) {
      log.warn('Google Sheets webhook failed', result.status, result.body || result.error);
      return result;
    }
    log.info('Google Sheets webhook ok', result.data?.sheet || 'ok');
    return { ok: true, ...result };
  } catch (err) {
    log.error('Google Sheets webhook error', err.message);
    return { ok: false, error: err.message };
  }
}
