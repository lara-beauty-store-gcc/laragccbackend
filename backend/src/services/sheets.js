import { config } from '../config.js';
import { log } from '../logger.js';

/** GAS web app URLs sometimes include /u/1/ — strip for server-to-server POST. */
export function normalizeAppsScriptUrl(url) {
  return String(url || '').replace('/macros/u/1/', '/macros/').trim();
}

/** Fallback English export names when line items omit a readable product name. */
const SKU_PRODUCT_NAMES = {
  'LARA-MG-01': 'Magnesium Glycinate Gummies',
  'LARA-EP-01': 'Epimedium Energy Gummies',
  'LARA-FC-01': 'Brain Memory Gummies',
};

const JAVA_OBJECT_REF = /^\[L[a-zA-Z0-9./]+;@[0-9a-f]+$/i;

const BUNDLE_PACK = { b1: 1, b2: 2, b3: 3, UPSELL: 1, one: 1, two: 2, three: 3 };

function normalizeBundleId(bundleId) {
  const aliases = { one: 'b1', two: 'b2', three: 'b3' };
  const key = String(bundleId || 'b1').toLowerCase();
  return aliases[key] || key;
}

/** Always write UAE phone as +971XXXXXXXXX in the sheet. */
export function formatSheetPhone(payload = {}) {
  const raw = serializeSheetValue(
    payload.phone_raw ?? payload.phone_as_entered ?? payload.phone_e164 ?? payload.phone ?? '',
  );
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';

  let national = digits;
  if (national.startsWith('971')) national = national.slice(3);
  else if (national.startsWith('965')) return `+${digits}`;
  if (national.startsWith('0')) national = national.slice(1);

  if (/^5\d{8}$/.test(national)) return `+971${national}`;
  if (digits.startsWith('971')) return `+${digits}`;
  if (raw.startsWith('+')) return `+${digits}`;

  return national ? `+971${national}` : '';
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

/** Coerce any value to a plain string — never Java/Rhino object references. */
export function serializeSheetValue(value) {
  if (value === null || value === undefined) return '';

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return JAVA_OBJECT_REF.test(trimmed) ? '' : trimmed;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value
      .map((entry) => serializeSheetValue(entry))
      .filter(Boolean)
      .join(', ');
  }

  if (typeof value === 'object') {
    const nested =
      value.productName ?? value.name ?? value.title ?? value.label ?? value.product;
    if (nested !== undefined && nested !== null) {
      return serializeSheetValue(nested);
    }
    const sku = serializeSheetValue(value.sku);
    if (sku && SKU_PRODUCT_NAMES[sku]) return SKU_PRODUCT_NAMES[sku];
    if (sku) return sku;
    try {
      return JSON.stringify(value);
    } catch {
      return '';
    }
  }

  const asString = String(value).trim();
  return JAVA_OBJECT_REF.test(asString) ? '' : asString;
}

/** Normalize order line items from several possible payload shapes. */
export function normalizeOrderItems(payload = {}) {
  const raw = payload.items ?? payload.line_items ?? payload.products ?? payload.lineItems;

  if (Array.isArray(raw)) {
    return raw.filter((item) => item && typeof item === 'object');
  }

  if (typeof raw === 'string' && raw.trim()) {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((item) => item && typeof item === 'object') : [];
    } catch {
      return [];
    }
  }

  return [];
}

function resolveLineProductName(item) {
  const direct = serializeSheetValue(item.productName ?? item.name ?? item.title);
  if (direct) return direct;

  const sku = serializeSheetValue(item.sku);
  if (sku && SKU_PRODUCT_NAMES[sku]) return SKU_PRODUCT_NAMES[sku];
  return sku;
}

export function lineQuantity(item) {
  const bundle = normalizeBundleId(item.bundleId);
  const pack = BUNDLE_PACK[bundle] ?? 1;
  const raw = Number(item.quantity ?? item.qty ?? item.quantite);
  if (!Number.isFinite(raw) || raw <= 0) return pack > 1 ? pack : 1;
  if (raw === 1 && pack > 1) return pack;
  if (raw >= pack) return Math.round(raw);
  return Math.round(raw * pack);
}

/** Format one line: "Product Name" or "Product Name x2". */
export function formatProductLine(item) {
  const name = resolveLineProductName(item);
  if (!name) return '';

  const qty = lineQuantity(item);
  return qty > 1 ? `${name} x${qty}` : name;
}

/** Join multiple products with newlines for the sheet "product" column. */
export function formatProductColumn(items) {
  return items.map(formatProductLine).filter(Boolean).join('\n');
}

function formatSkuColumn(items) {
  return items
    .map((item) => serializeSheetValue(item.sku))
    .filter(Boolean)
    .join(', ');
}

function totalQuantity(items) {
  if (!items.length) return 1;
  const sum = items.reduce((acc, item) => acc + lineQuantity(item), 0);
  return sum > 0 ? sum : 1;
}

function resolveTotal(payload, items) {
  const direct = Number(
    payload.totalprice ??
      payload.total_aed ??
      payload.total_amount ??
      payload.total ??
      payload.value,
  );
  if (Number.isFinite(direct) && direct > 0) return direct;

  const fromItems = items.reduce((sum, item) => {
    const lineTotal = Number(item.lineTotal ?? item.line_total ?? item.lineTotalAed);
    if (Number.isFinite(lineTotal) && lineTotal > 0) return sum + lineTotal;
    const unit = Number(item.unitPrice ?? item.unit_price ?? item.price);
    const qty = lineQuantity(item);
    if (Number.isFinite(unit) && unit > 0) return sum + unit * qty;
    return sum;
  }, 0);

  return fromItems > 0 ? Math.round(fromItems * 1000) / 1000 : 0;
}

/**
 * Build a flat JSON body for Google Apps Script.
 * Every exported column is a scalar string/number — never arrays or nested objects.
 */
export function buildSheetBody(eventName, payload = {}) {
  const items = normalizeOrderItems(payload);
  const orderId = serializeSheetValue(
    payload['order id'] ?? payload.order_id ?? payload.order_number ?? payload.orderId,
  );
  const phone = formatSheetPhone(payload);
  const currency = serializeSheetValue(payload.currency || 'AED') || 'AED';
  const now = serializeSheetValue(payload.date) || formatSheetDate();

  let product = serializeSheetValue(payload.product);
  if (!product && items.length > 0) {
    product = formatProductColumn(items);
  }
  if (!product) product = 'طلب لارا';

  let sku = serializeSheetValue(payload.sku);
  if (!sku && items.length > 0) {
    sku = formatSkuColumn(items);
  }

  const quantite = items.length > 0 ? totalQuantity(items) : Number(payload.quantite ?? payload.quantity) || 1;
  const total = resolveTotal(payload, items);

  const body = {
    secret: config.sheetsWebhookSecret || undefined,
    event: eventName,
    date: now,
    'order id': orderId,
    order_id: orderId,
    order_number: orderId,
    country: serializeSheetValue(payload.country) || countryFromPhone(phone),
    name: serializeSheetValue(payload.customer_name ?? payload.customerName ?? payload.name),
    phone,
    product,
    url: serializeSheetValue(payload.url ?? payload.source_url ?? payload.sourceUrl),
    sku,
    quantite,
    quantity: quantite,
    totalprice: total,
    'total price': total,
    currency,
    area: serializeSheetValue(payload.area_notes ?? payload.area),
  };

  // Never send items[] or nested objects — Apps Script turns arrays into [Ljava.lang.Object;@…]
  const ALLOWED = new Set([
    'secret',
    'event',
    'date',
    'order id',
    'order_id',
    'order_number',
    'country',
    'name',
    'phone',
    'product',
    'url',
    'sku',
    'quantite',
    'quantity',
    'totalprice',
    'total price',
    'currency',
    'area',
  ]);

  const flat = {};
  for (const [key, value] of Object.entries(body)) {
    if (!ALLOWED.has(key)) continue;
    if (value !== null && typeof value === 'object') {
      flat[key] = serializeSheetValue(value);
    } else {
      flat[key] = value;
    }
  }

  return flat;
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
    const success = data?.success === true || (data?.ok === true && !data?.error);
    if (!success) {
      return { ok: false, status: follow.status, body: text, data, error: data?.error || 'sheets_rejected' };
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
  const success = data?.success === true || (data?.ok === true && !data?.error);
  if (!success) {
    return { ok: false, status: init.status, body: text, data, error: data?.error || 'sheets_rejected' };
  }
  return { ok: true, status: init.status, data, body: text };
}

export async function forwardToGoogleSheets(eventName, payload) {
  if (eventName !== 'Purchase') {
    return { ok: true, skipped: true, reason: 'sheets_purchase_only' };
  }

  if (!config.sheetsWebhookUrl) {
    return { ok: true, skipped: true, reason: 'sheets_not_configured' };
  }

  const orderId = serializeSheetValue(
    payload.order_number ?? payload.orderId ?? payload.order_id ?? payload['order id'],
  );
  if (!orderId) {
    return { ok: false, error: 'missing_order_id' };
  }

  const body = buildSheetBody(eventName, payload);

  if (!body.name || !body.phone) {
    log.warn('Sheets skip — incomplete order row', {
      orderId,
      name: Boolean(body.name),
      phone: Boolean(body.phone),
    });
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
