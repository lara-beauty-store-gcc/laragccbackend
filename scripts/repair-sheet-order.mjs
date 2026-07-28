#!/usr/bin/env node
/**
 * Re-post a real order to Google Sheet with correct flat fields.
 * Use when a row exists but has broken date / product / missing order id.
 *
 * Usage:
 *   node scripts/repair-sheet-order.mjs
 *   WEBHOOK_URL=... SECRET=... node scripts/repair-sheet-order.mjs
 */

const WEBHOOK_URL =
  process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
  'https://script.google.com/macros/s/AKfycbz9pzO6lTU_C1hKmlHDnIq6SbvQiVE2_Hny0Em5sJ_-yFhfvu0PCmFi8-0N9rI4-bHpsQ/exec';
const SECRET = process.env.SHEETS_WEBHOOK_SECRET || 'lara-beauty-secret-2026';

/** Edit this list — your real orders from thank-you page */
const ORDERS = [
  {
    orderId: 'LARA-MS4YT5SU',
    customerName: 'LISM LKAMIL',
    phone: '888888888',
    product: 'Epimedium Energy',
    url: 'https://larabeauty.store/products/epimedium-energy',
    sku: 'LARA-EP-01',
    quantite: 1,
    totalprice: 239,
    date: '2026-07-28 18:10',
  },
];

function sheetPhone(raw) {
  const digits = String(raw).replace(/\D/g, '');
  let national = digits;
  if (national.startsWith('971')) national = national.slice(3);
  if (national.startsWith('0')) national = national.slice(1);
  return national ? `+971${national}` : '';
}

async function postToAppsScript(body) {
  const target = WEBHOOK_URL.replace('/macros/u/1/', '/macros/');
  const init = await fetch(target, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  });

  if (init.status === 301 || init.status === 302) {
    const location = init.headers.get('location');
    if (!location) throw new Error('missing_redirect_location');
    const follow = await fetch(location);
    return follow.text();
  }
  return init.text();
}

for (const row of ORDERS) {
  const payload = {
    secret: SECRET,
    date: row.date,
    'order id': row.orderId,
    order_id: row.orderId,
    order_number: row.orderId,
    customer_name: row.customerName,
    customerName: row.customerName,
    name: row.customerName,
    phone: sheetPhone(row.phone),
    product: row.product,
    url: row.url,
    sku: row.sku,
    quantite: row.quantite,
    totalprice: row.totalprice,
    currency: 'AED',
    country: 'AE',
  };

  const text = await postToAppsScript(payload);
  console.log(row.orderId, text);
}
