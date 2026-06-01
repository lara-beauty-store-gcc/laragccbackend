/**
 * Lara Beauty — Google Apps Script Web App
 * Deploy: Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone
 * Set URL in backend GOOGLE_SHEETS_WEBHOOK_URL
 * Set same secret in SHEETS_WEBHOOK_SECRET (backend) and SCRIPT_SECRET below
 */

const SCRIPT_SECRET = 'CHANGE_ME_SAME_AS_BACKEND';
const SHEET_NAME = 'Orders';

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    if (body.secret !== SCRIPT_SECRET) {
      return jsonResponse({ ok: false, error: 'unauthorized' }, 401);
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      return jsonResponse({ ok: false, error: 'sheet_not_found' }, 500);
    }

    // Header row if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'order_number',
        'created_at',
        'customer_name',
        'phone_e164',
        'area_notes',
        'items_json',
        'subtotal_kwd',
        'total_kwd',
        'currency',
        'payment_method',
        'upsell_accepted',
        'upsell_product',
        'upsell_amount_kwd',
        'event_id',
        'source_url',
        'status',
      ]);
    }

    sheet.appendRow([
      body.order_number || '',
      body.created_at || new Date().toISOString(),
      body.customer_name || '',
      body.phone_e164 || '',
      body.area_notes || '',
      JSON.stringify(body.items || []),
      body.subtotal_kwd || 0,
      body.total_kwd || 0,
      body.currency || 'KWD',
      body.payment_method || 'COD',
      body.upsell_accepted ? 'YES' : 'NO',
      body.upsell_product || '',
      body.upsell_amount_kwd || '',
      body.event_id || '',
      body.source_url || '',
      body.status || 'pending_confirmation',
    ]);

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500);
  }
}

function jsonResponse(obj, code) {
  const output = ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
  // Apps Script doesn't set HTTP code easily in all contexts; log code in body
  if (code && code !== 200) {
    obj._httpStatus = code;
  }
  return output;
}
