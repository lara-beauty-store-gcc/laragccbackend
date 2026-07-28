/**
 * Lara Beauty — Google Apps Script Web App
 * Sheet: https://docs.google.com/spreadsheets/d/1n_vZl2t3X_KV0Rkpj6dR9TZRRm3OETv3IjIdzcH-diU
 *
 * Deploy: Deploy → New deployment → Web app
 *   Execute as: Me
 *   Who has access: Anyone
 * Copy URL → GOOGLE_SHEETS_WEBHOOK_URL (backend EasyPanel)
 * Set SCRIPT_SECRET = SHEETS_WEBHOOK_SECRET in backend
 */

const SCRIPT_SECRET = 'lara-beauty-secret-2026';
const SHEET_NAME = 'Tabellenblatt1'; // first tab — rename if needed

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

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    if (body.secret !== SCRIPT_SECRET) {
      return jsonResponse({ ok: false, error: 'unauthorized' }, 401);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
    if (!sheet) {
      return jsonResponse({ ok: false, error: 'sheet_not_found' }, 500);
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
    }

    const items = body.items || [];
    const product =
      body.product ||
      items
        .map(function (i) {
          return i.productName || i.name || '';
        })
        .filter(Boolean)
        .join(' + ');
    const sku =
      body.sku ||
      items
        .map(function (i) {
          return i.sku || '';
        })
        .filter(Boolean)
        .join(', ');
    const qty =
      body.quantite ||
      items.reduce(function (sum, i) {
        return sum + (Number(i.quantity) || 1);
      }, 0) ||
      1;

    sheet.appendRow([
      body.date || body.timestamp || new Date().toISOString(),
      body['order id'] || body.order_id || body.order_number || '',
      body.country || 'AE',
      body.name || body.customer_name || '',
      body.phone || body.phone_e164 || '',
      product,
      body.url || body.source_url || '',
      sku,
      qty,
      body.totalprice || body.total_kwd || body.total || 0,
      body.currency || 'AED',
    ]);

    return jsonResponse({ ok: true, success: true, sheet: sheet.getName() });
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
