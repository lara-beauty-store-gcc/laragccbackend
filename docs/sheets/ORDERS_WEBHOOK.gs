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

const SKU_PRODUCT_NAMES = {
  'LARA-MG-01': 'Magnesium Glycinate Gummies',
  'LARA-EP-01': 'Epimedium Energy Gummies',
  'LARA-FC-01': 'Brain Memory Gummies',
};

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

function asArray(value) {
  if (value === null || value === undefined) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'object' && typeof value.length === 'number') {
    var out = [];
    for (var i = 0; i < value.length; i++) out.push(value[i]);
    return out;
  }
  return [value];
}

function asText(value) {
  if (value === null || value === undefined) return '';

  if (typeof value === 'string') {
    var trimmed = value.trim();
    return isJavaObjectRef(trimmed) ? '' : trimmed;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value
      .map(function (entry) {
        return asText(entry);
      })
      .filter(Boolean)
      .join('\n');
  }

  if (typeof value === 'object') {
    if (typeof value.length === 'number') {
      return asArray(value)
        .map(function (entry) {
          return asText(entry);
        })
        .filter(Boolean)
        .join('\n');
    }

    if (value.productName || value.name || value.title) {
      return asText(value.productName || value.name || value.title);
    }

    if (value.sku) {
      var sku = asText(value.sku);
      return SKU_PRODUCT_NAMES[sku] || sku;
    }

    return '';
  }

  var str = String(value).trim();
  return isJavaObjectRef(str) ? '' : str;
}

function lineQuantity(item) {
  var qty = Number(item.quantity || item.qty || item.quantite);
  if (isFinite(qty) && qty > 0) return Math.round(qty);
  return 1;
}

function formatItemsProduct(items) {
  return items
    .map(function (item) {
      var name = asText(item.productName || item.name || item.title);
      if (!name && item.sku) {
        var sku = asText(item.sku);
        name = SKU_PRODUCT_NAMES[sku] || sku;
      }
      if (!name) return '';
      var qty = lineQuantity(item);
      return qty > 1 ? name + ' x' + qty : name;
    })
    .filter(Boolean)
    .join('\n');
}

function formatItemsSku(items) {
  return items
    .map(function (item) {
      return asText(item.sku);
    })
    .filter(Boolean)
    .join(', ');
}

function resolveProduct(body) {
  var product = asText(body.product);
  if (product && !isJavaObjectRef(product)) return product;

  var fromItems = formatItemsProduct(asArray(body.items));
  if (fromItems) return fromItems;

  return 'طلب لارا';
}

function resolveSku(body, items) {
  var sku = asText(body.sku);
  if (sku && !isJavaObjectRef(sku)) return sku;
  return formatItemsSku(items);
}

function asNumber(value) {
  var n = Number(value);
  return isFinite(n) ? n : 0;
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);

    if (body.secret !== SCRIPT_SECRET) {
      return jsonResponse({ ok: false, error: 'unauthorized' }, 401);
    }

    var orderId = asText(body['order id'] || body.order_id || body.order_number).trim();
    var name = asText(body.name || body.customer_name).trim();
    var phone = asText(body.phone || body.phone_e164).trim();

    if (!orderId || !name || !phone) {
      return jsonResponse({ ok: false, error: 'incomplete_row' }, 400);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
    if (!sheet) {
      return jsonResponse({ ok: false, error: 'sheet_not_found' }, 500);
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
    }

    var items = asArray(body.items);
    var product = resolveProduct(body);
    var sku = resolveSku(body, items);
    var quantite = asNumber(body.quantite || body.quantity);
    if (!quantite && items.length) {
      quantite = items.reduce(function (sum, item) {
        return sum + lineQuantity(item);
      }, 0);
    }
    if (!quantite) quantite = 1;

    var row = [
      asText(body.date || body.timestamp || Utilities.formatDate(new Date(), 'Asia/Dubai', 'yyyy-MM-dd HH:mm')),
      orderId,
      asText(body.country || 'AE'),
      name,
      phone,
      product,
      asText(body.url || body.source_url),
      sku,
      quantite,
      asNumber(body.totalprice || body['total price'] || body.total_kwd || body.total),
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
