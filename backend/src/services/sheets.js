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

function formatSheetDate(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function bundleLabel(item) {
  const bundle = String(item.bundleId || item.offerId || '').toLowerCase();
  if (bundle === 'b1' || bundle === 'one') return 'علبة وحدة';
  if (bundle === 'b2' || bundle === 'two') return 'علبتين';
  if (bundle === 'b3' || bundle === 'three') return '3 علب';
  return '';
}

function lineProductName(item) {
  const base = String(item.productName || item.name || '').trim();
  const bundle = bundleLabel(item);
  if (base && bundle) return `${base} (${bundle})`;
  return base || bundle || '';
}

function lineQuantity(item) {
  const bundle = String(item.bundleId || item.offerId || '').toLowerCase();
  if (bundle === 'b1' || bundle === 'one') return Number(item.qty) || 1;
  if (bundle === 'b2' || bundle === 'two') return Number(item.qty) || 1;
  if (bundle === 'b3' || bundle === 'three') return Number(item.qty) || 1;
  const q = Number(item.quantity);
  if (q > 0 && q <= 10) return q;
  return Number(item.qty) || 1;
}

function buildSheetBody(eventName, payload) {
  const items = Array.isArray(payload.items) ? payload.items : [];
  const orderId = String(payload.order_number || payload.orderId || '').trim();
  const phone = String(payload.phone_e164 || payload.phone || '').trim();
  const total = Number(payload.total_kwd ?? payload.total ?? payload.value ?? 0) || 0;
  const currency = String(payload.currency || 'AED');
  const now = formatSheetDate();

  const product = items
    .map(lineProductName)
    .filter(Boolean)
    .join(' + ');
  const sku = items
    .map((i) => String(i.sku || '').trim())
    .filter(Boolean)
    .join(', ');
  const quantite =
    items.reduce((sum, i) => sum + lineQuantity(i), 0) || (items.length > 0 ? items.length : 1);

  return {
    secret: config.sheetsWebhookSecret || undefined,
    event: eventName,
    date: now,
    'order id': orderId,
    order_id: orderId,
    order_number: orderId,
    country: String(payload.country || countryFromPhone(phone)),
    name: String(payload.customer_name || payload.customerName || '').trim(),
    phone,
    product: product || 'طلب لارا',
    url: String(payload.source_url || payload.sourceUrl || '').trim(),
    sku,
    quantite,
    totalprice: total,
    currency,
    area: String(payload.area_notes || payload.area || '').trim(),
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

  const orderId = String(payload.order_number || payload.orderId || '').trim();
  if (!orderId) {
    return { ok: false, error: 'missing_order_id' };
  }

  const body = buildSheetBody(eventName, payload);

  if (!body.name || !body.phone) {
    log.warn('Sheets skip — incomplete order row', { orderId, name: Boolean(body.name), phone: Boolean(body.phone) });
    return { ok: false, error: 'incomplete_order_row' };
  }

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
