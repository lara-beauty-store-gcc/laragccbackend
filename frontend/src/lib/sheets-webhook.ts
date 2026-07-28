import { businessConfig } from '@/config/business';
import { buildSheetRows, type RawSheetItem, type SheetsOrderItem } from '@/lib/sheets-export';
import { generateLaraOrderId } from '@/lib/order-ids';

export type { SheetsOrderItem };

export type SheetsOrderPayload = {
  customerName: string;
  phone: string;
  phoneAsEntered?: string;
  country: string;
  currency: string;
  area?: string;
  sourceUrl?: string;
  items: SheetsOrderItem[] | RawSheetItem[];
  orderIds?: string[];
  date?: string;
};

export type SheetsForwardResult =
  | { ok: true; orderIds: string[] }
  | { ok: false; reason: string; status?: number; detail?: string };

const { market } = businessConfig;

export function sheetsWebhookUrl() {
  return (
    process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
    process.env.ORDERS_SHEETS_WEBHOOK_URL ||
    ''
  );
}

export function sheetsWebhookConfigured() {
  return Boolean(sheetsWebhookUrl());
}

function siteBaseUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://larabeauty.store').replace(/\/$/, '');
}

function formatSheetDate(date?: string) {
  const d = date ? new Date(date) : new Date();
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function sheetPhone(payload: SheetsOrderPayload) {
  const raw = String(
    payload.phoneAsEntered || payload.phone || '',
  ).trim();
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';

  let national = digits;
  if (national.startsWith('971')) national = national.slice(3);
  if (national.startsWith('0')) national = national.slice(1);

  if (/^5\d{8}$/.test(national)) return `+971${national}`;
  if (digits.startsWith('971')) return `+${digits}`;
  if (raw.startsWith('+')) return `+${digits}`;

  return `+971${national}`;
}

/** Google Apps Script 302 — must not follow POST as GET. */
async function postToAppsScript(url: string, body: Record<string, unknown>) {
  const target = url.replace('/macros/u/1/', '/macros/').trim();
  const init = await fetch(target, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  });

  if (init.status === 301 || init.status === 302) {
    const location = init.headers.get('location');
    if (!location) {
      return { ok: false as const, status: init.status, text: 'missing_redirect_location' };
    }
    const follow = await fetch(location, { method: 'GET' });
    const text = await follow.text();
    return { ok: follow.ok, status: follow.status, text };
  }

  const text = await init.text();
  return { ok: init.ok, status: init.status, text };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function forwardOrderToSheets(payload: SheetsOrderPayload): Promise<SheetsForwardResult> {
  const webhookUrl = sheetsWebhookUrl();
  if (!webhookUrl) {
    return { ok: false, reason: 'sheets_not_configured' };
  }

  const presetIds = Array.isArray(payload.orderIds) ? payload.orderIds.map(String) : [];
  const orderId = presetIds[0] || generateLaraOrderId();

  const rows = buildSheetRows({
    siteBaseUrl: siteBaseUrl(),
    sourceUrl: payload.sourceUrl,
    customerName: payload.customerName,
    phone: payload.phone,
    country: payload.country,
    currency: payload.currency,
    date: payload.date,
    orderIds: presetIds.length ? presetIds : [orderId],
    items: payload.items,
  });

  if (rows.length === 0) {
    return { ok: false, reason: 'sheets_empty_items', detail: 'No valid line items after normalization' };
  }

  const product = rows
    .map((row) => (row.quantity > 1 ? `${row.product} x${row.quantity}` : row.product))
    .filter(Boolean)
    .join('\n');
  const quantite = rows.reduce((sum, row) => sum + row.quantity, 0);
  const totalprice = rows.reduce((sum, row) => sum + row.totalPrice, 0);
  const sku = rows.map((row) => row.sku).filter(Boolean).join(', ');
  const url = rows.map((row) => row.url).find(Boolean) || payload.sourceUrl || siteBaseUrl();

  const webhookSecret = process.env.SHEETS_WEBHOOK_SECRET || 'lara-beauty-secret-2026';

  const body = {
    secret: webhookSecret,
    event: 'Purchase',
    date: formatSheetDate(payload.date),
    'order id': orderId,
    order_id: orderId,
    order_number: orderId,
    country: String(payload.country || market.countryCode).trim() || market.countryCode,
    name: String(payload.customerName || '').trim(),
    customer_name: String(payload.customerName || '').trim(),
    phone: sheetPhone(payload),
    phone_e164: String(payload.phone || '').trim(),
    product,
    url,
    sku,
    quantite,
    quantity: quantite,
    totalprice,
    'total price': totalprice,
    currency: String(payload.currency || market.currency).trim() || market.currency,
    area: String(payload.area || '').trim(),
  };

  try {
    let lastResult: { ok: boolean; status: number; text: string } | null = null;

    for (let attempt = 1; attempt <= 3; attempt += 1) {
      lastResult = await postToAppsScript(webhookUrl, body);
      let data: Record<string, unknown> = {};
      try {
        data = JSON.parse(lastResult.text) as Record<string, unknown>;
      } catch {
        data = { raw: lastResult.text.slice(0, 500) };
      }

      const success = data.success === true || (data.ok === true && !data.error);
      if (success) {
        const returnedId = String(data.order_id || orderId);
        return { ok: true, orderIds: [returnedId] };
      }

      if (attempt < 3) await sleep(400 * attempt);
    }

    let data: Record<string, unknown> = {};
    try {
      data = JSON.parse(lastResult?.text || '') as Record<string, unknown>;
    } catch {
      data = { raw: String(lastResult?.text || '').slice(0, 500) };
    }

    const detail =
      typeof data.error === 'string'
        ? data.error
        : typeof data.raw === 'string'
          ? data.raw
          : String(lastResult?.text || '').slice(0, 500);

    console.warn('[sheets] webhook failed after retries', lastResult?.status, detail);
    return { ok: false, reason: 'sheets_rejected', status: lastResult?.status, detail };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[sheets] webhook error', message);
    return { ok: false, reason: 'sheets_network_error', detail: message };
  }
}
