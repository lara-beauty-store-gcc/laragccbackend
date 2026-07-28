/**
 * Lara Beauty — Google Apps Script Web App
 * Sheet: https://docs.google.com/spreadsheets/d/1n_vZl2t3X_KV0Rkpj6dR9TZRRm3OETv3IjIdzcH-diU
 *
 * 1. Extensions → Apps Script → REPLACE all code with this file
 * 2. Deploy → Manage deployments → Edit → New version → Deploy
 * 3. Who has access: Anyone
 */

const SCRIPT_SECRET = 'lara-beauty-secret-2026';
const SHEET_NAME = 'Tabellenblatt1';

const HEADERS = [
  'date',
  'order id',
  'country',
  'name',
  'phone',
  'product',
  'url',
  'sku',
  'quantite',
  'totalprice',
  'currency',
];

function asText(value) {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) return value.map(asText).filter(Boolean).join(' + ');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function asNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    if (body.secret !== SCRIPT_SECRET) {
      return jsonResponse({ ok: false, error: 'unauthorized' }, 401);
    }

    const orderId = asText(body['order id'] || body.order_id || body.order_number).trim();
    const name = asText(body.name || body.customer_name).trim();
    const phone = asText(body.phone || body.phone_e164).trim();

    if (!orderId || !name || !phone) {
      return jsonResponse({ ok: false, error: 'incomplete_row' }, 400);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
    if (!sheet) {
      return jsonResponse({ ok: false, error: 'sheet_not_found' }, 500);
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
    }

    const row = [
      asText(body.date || body.timestamp || Utilities.formatDate(new Date(), 'Asia/Dubai', 'yyyy-MM-dd HH:mm')),
      orderId,
      asText(body.country || 'AE'),
      name,
      phone,
      asText(body.product || 'طلب لارا'),
      asText(body.url || body.source_url),
      asText(body.sku),
      asNumber(body.quantite || body.quantity || 1),
      asNumber(body.totalprice || body.total_kwd || body.total),
      asText(body.currency || 'AED'),
    ];

    sheet.appendRow(row);

    return jsonResponse({ ok: true, success: true, sheet: sheet.getName(), order_id: orderId });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500);
  }
}

function jsonResponse(obj, code) {
  if (code && code !== 200) {
    obj._httpStatus = code;
  }
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
