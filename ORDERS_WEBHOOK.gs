/**
 * Lara Beauty — Google Apps Script Web App
 *
 * INSTALL (ضروري — مرّة وحدة):
 * 1. افتح الشيت → Extensions → Apps Script
 * 2. امسح الكود القديم كامل → الصق هاد الملف
 * 3. Deploy → Manage deployments → Edit → New version → Deploy
 * 4. Who has access: Anyone
 *
 * Sheet: Tabellenblatt1
 */

const SCRIPT_SECRET = 'lara-beauty-secret-2026';
const SPREADSHEET_ID = '1n_vZl2t3X_KV0Rkpj6dR9TZRRm3OETv3IjIdzcH-diU';
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

function isJavaObjectRef(value) {
  return /^\[L[a-zA-Z0-9./]+;@[0-9a-f]+$/i.test(String(value || ''));
}

/** Scalar text only — never Java arrays or objects in cells. */
function cell(value) {
  if (value === null || value === undefined) return '';

  if (typeof value === 'string') {
    var s = value.trim();
    return isJavaObjectRef(s) ? '' : s;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return '';
}

function cellNumber(value) {
  var n = Number(value);
  if (!isFinite(n) || n < 0) return 0;
  return n;
}

/**
 * Full customer name — customer_name BEFORE name.
 * Old store payloads sometimes put a product/short token in `name`.
 */
function resolveCustomerName(body) {
  return cell(
    body.customer_name ||
      body.customerName ||
      body.full_name ||
      body.fullName ||
      body.name,
  );
}

/** Always +971XXXXXXXXX in sheet column phone */
function formatPhoneUae(value) {
  var raw = cell(value);
  var digits = String(raw || '').replace(/\D/g, '');
  if (!digits) return '';

  var national = digits;
  if (national.indexOf('971') === 0) national = national.substring(3);
  if (national.indexOf('0') === 0) national = national.substring(1);

  var formatted = '';
  if (/^5\d{8}$/.test(national)) formatted = '+971' + national;
  else if (digits.indexOf('971') === 0) formatted = '+' + digits;
  else if (raw.indexOf('+') === 0) formatted = '+' + digits;
  else formatted = national ? '+971' + national : '';

  if (formatted && formatted.indexOf('+') !== 0) {
    formatted = '+' + formatted.replace(/^\+/, '');
  }
  return formatted;
}

/** Build flat product/qty/total from legacy items[] payloads */
function flattenItems(body) {
  var items = body.items || body.line_items || body.products;
  if (!items || !items.length) return {};

  var productParts = [];
  var skuParts = [];
  var quantite = 0;
  var totalprice = 0;

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (!item || typeof item !== 'object') continue;

    var label = cell(
      item.product || item.productName || item.name || item.title || item.label,
    );
    if (label && !isJavaObjectRef(label)) {
      var q = cellNumber(item.quantity || item.quantite) || 1;
      productParts.push(q > 1 ? label + ' x' + q : label);
    }

    var sku = cell(item.sku);
    if (sku) skuParts.push(sku);

    quantite += cellNumber(item.quantity || item.quantite) || 1;
    totalprice += cellNumber(
      item.totalPrice || item.lineTotal || item.totalprice || item.price || item.lineTotalAed,
    );
  }

  var out = {};
  if (productParts.length) out.product = productParts.join('\n');
  if (skuParts.length) out.sku = skuParts.join(', ');
  if (quantite) out.quantite = quantite;
  if (totalprice) out.totalprice = totalprice;
  return out;
}

function resolveOrderId(body) {
  var ids = body.order_ids || body.orderIds;
  if (ids && ids.length) {
    var first = cell(ids[0]);
    if (first) return first;
  }
  return cell(body['order id'] || body.order_id || body.order_number || body.orderId);
}

function doGet() {
  return jsonResponse({ ok: true, service: 'lara-orders-webhook', version: '2026-07-28-v2' });
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, error: 'empty_body' }, 400);
    }

    var body = JSON.parse(e.postData.contents);

    if (body.secret !== SCRIPT_SECRET) {
      return jsonResponse({ ok: false, error: 'unauthorized' }, 401);
    }

    var fromItems = flattenItems(body);

    var orderId = resolveOrderId(body);
    var name = resolveCustomerName(body);
    var phone = formatPhoneUae(
      body.phone || body.phone_e164 || body.phoneE164 || body.phone_raw,
    );
    var product = cell(body.product) || fromItems.product || '';
    var url = cell(body.url || body.source_url || body.sourceUrl);
    var sku = cell(body.sku) || fromItems.sku || '';
    var country = cell(body.country) || 'AE';
    var currency = cell(body.currency) || 'AED';
    var date =
      cell(body.date) ||
      Utilities.formatDate(new Date(), 'Asia/Dubai', 'yyyy-MM-dd HH:mm');
    var quantite = cellNumber(body.quantite || body.quantity) || fromItems.quantite || 0;
    var totalprice = cellNumber(
      body.totalprice ||
        body['total price'] ||
        body.total_aed ||
        body.total_amount ||
        body.total,
    );
    if (!totalprice && fromItems.totalprice) totalprice = fromItems.totalprice;

    if (!orderId || !name || !phone) {
      return jsonResponse(
        {
          ok: false,
          error: 'incomplete_row',
          orderId: orderId,
          name: Boolean(name),
          phone: Boolean(phone),
        },
        400,
      );
    }

    if (!product || isJavaObjectRef(product)) {
      return jsonResponse({ ok: false, error: 'invalid_product', product: product }, 400);
    }

    if (!totalprice) {
      return jsonResponse({ ok: false, error: 'invalid_total', totalprice: totalprice }, 400);
    }

    if (!quantite) quantite = 1;

    var ss = getSpreadsheet_();
    if (!ss) {
      return jsonResponse(
        {
          ok: false,
          error: 'spreadsheet_not_linked',
          hint: 'Set SPREADSHEET_ID or bind script via Extensions → Apps Script',
        },
        500,
      );
    }

    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
    if (!sheet) {
      return jsonResponse({ ok: false, error: 'sheet_not_found' }, 500);
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
    }

    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][1]) === orderId) {
        return jsonResponse({ ok: true, success: true, duplicate: true, order_id: orderId });
      }
    }

    sheet.appendRow([
      date,
      orderId,
      country,
      name,
      phone,
      product,
      url,
      sku,
      quantite,
      totalprice,
      currency,
    ]);

    return jsonResponse({ ok: true, success: true, sheet: sheet.getName(), order_id: orderId });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500);
  }
}

function getSpreadsheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss) return ss;

  var id = String(SPREADSHEET_ID || '').trim();
  if (id && id !== 'PASTE_YOUR_SHEET_ID_HERE') {
    return SpreadsheetApp.openById(id);
  }

  return null;
}

function jsonResponse(obj, code) {
  if (code && code !== 200) {
    obj._httpStatus = code;
  }
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
