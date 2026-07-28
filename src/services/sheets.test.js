import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  buildSheetBody,
  formatProductColumn,
  formatProductLine,
  lineQuantity,
  normalizeOrderItems,
  serializeSheetValue,
} from './sheets.js';

describe('serializeSheetValue', () => {
  it('rejects Java object reference strings', () => {
    assert.equal(serializeSheetValue('[Ljava.lang.Object;@28e90748'), '');
  });

  it('flattens arrays to comma-separated text', () => {
    assert.equal(serializeSheetValue(['A', 'B']), 'A, B');
  });

  it('extracts name from objects', () => {
    assert.equal(serializeSheetValue({ productName: 'Magnesium Glycinate Gummies' }), 'Magnesium Glycinate Gummies');
  });
});

describe('formatProductLine', () => {
  it('formats single product without quantity suffix', () => {
    assert.equal(
      formatProductLine({ productName: 'Magnesium Glycinate Gummies', quantity: 1 }),
      'Magnesium Glycinate Gummies',
    );
  });

  it('formats product with quantity suffix', () => {
    assert.equal(
      formatProductLine({ productName: 'Magnesium Glycinate Gummies', quantity: 2 }),
      'Magnesium Glycinate Gummies x2',
    );
  });

  it('falls back to SKU export name', () => {
    assert.equal(formatProductLine({ sku: 'LARA-MG-01', quantity: 1 }), 'Magnesium Glycinate Gummies');
  });
});

describe('formatProductColumn', () => {
  it('joins multiple products with newlines', () => {
    const text = formatProductColumn([
      { productName: 'Magnesium Glycinate Gummies', quantity: 2 },
      { productName: 'Brain Memory Gummies', quantity: 1 },
    ]);
    assert.equal(text, 'Magnesium Glycinate Gummies x2\nBrain Memory Gummies');
  });
});

describe('buildSheetBody', () => {
  it('populates every exported column from order items', () => {
    const body = buildSheetBody('Purchase', {
      order_number: 'LARA-TEST123',
      customer_name: 'Sara',
      phone_e164: '+971501234567',
      source_url: 'https://larabeauty.store/products/magnesium-sleep',
      currency: 'AED',
      total_aed: 239,
      items: [
        {
          sku: 'LARA-MG-01',
          productName: 'Magnesium Glycinate Gummies',
          bundleId: 'b2',
          quantity: 2,
          unitPrice: 239,
        },
      ],
    });

    assert.equal(body.date.length > 0, true);
    assert.equal(body['order id'], 'LARA-TEST123');
    assert.equal(body.country, 'AE');
    assert.equal(body.name, 'Sara');
    assert.equal(body.phone, '971501234567');
    assert.equal(body.product, 'Magnesium Glycinate Gummies x2');
    assert.equal(body.url, 'https://larabeauty.store/products/magnesium-sleep');
    assert.equal(body.sku, 'LARA-MG-01');
    assert.equal(body.quantite, 2);
    assert.equal(body.quantity, 2);
    assert.equal(body.totalprice, 239);
    assert.equal(body.currency, 'AED');

    for (const value of Object.values(body)) {
      assert.notEqual(typeof value, 'object');
      if (typeof value === 'string') {
        assert.equal(JAVA_REF.test(value), false, `Java ref leaked: ${value}`);
      }
    }
  });

  it('uses bundle pack size when legacy quantity is 1 for a two-pack', () => {
    assert.equal(lineQuantity({ bundleId: 'b2', quantity: 1 }), 2);
    assert.equal(lineQuantity({ bundleId: 'two', quantity: 1 }), 2);
  });

  it('keeps customer phone as entered without forcing +971', () => {
    const body = buildSheetBody('Purchase', {
      order_number: 'LARA-PHONE',
      customer_name: 'Sara',
      phone_raw: '0501234567',
      phone_e164: '+971501234567',
      total_aed: 239,
      product: 'Magnesium Glycinate Gummies x2',
      quantite: 2,
    });
    assert.equal(body.name, 'Sara');
    assert.equal(body.phone, '0501234567');
  });

  it('never includes items array in webhook payload', () => {
    const body = buildSheetBody('Purchase', {
      order_number: 'LARA-NOITEMS',
      customer_name: 'Sara',
      phone_e164: '+971501234567',
      total_aed: 239,
      items: [{ sku: 'LARA-MG-01', productName: 'Magnesium Glycinate Gummies', quantity: 2 }],
    });

    assert.equal(body.items, undefined);
    assert.equal(body.product, 'Magnesium Glycinate Gummies x2');
    assert.equal(body['order id'], 'LARA-NOITEMS');
    assert.equal(body.totalprice, 239);
  });

  it('never forwards arrays in product or sku fields', () => {
    const body = buildSheetBody('Purchase', {
      order_number: 'LARA-ARR',
      customer_name: 'Nora',
      phone: '+971509998877',
      product: [{ name: 'Magnesium Glycinate Gummies', quantity: 1 }],
      sku: ['LARA-MG-01'],
      total: 189,
      currency: 'AED',
    });

    assert.equal(typeof body.product, 'string');
    assert.equal(typeof body.sku, 'string');
    assert.equal(body.product.includes('java.lang.Object'), false);
  });

  it('resolves quantite=2 for two-pack bundle with quantity 1', () => {
    const body = buildSheetBody('Purchase', {
      order_number: 'LARA-QTY',
      customer_name: 'Sara',
      phone_raw: '501234567',
      total_aed: 239,
      items: [
        {
          sku: 'LARA-MG-01',
          productName: 'Magnesium Glycinate Gummies',
          bundleId: 'b2',
          quantity: 1,
          unitPrice: 239,
        },
      ],
    });
    assert.equal(body.quantite, 2);
    assert.equal(body.product, 'Magnesium Glycinate Gummies x2');
  });
});

describe('normalizeOrderItems', () => {
  it('parses items_json string payloads', () => {
    const items = normalizeOrderItems({
      items: JSON.stringify([{ sku: 'LARA-FC-01', productName: 'Brain Memory Gummies', quantity: 1 }]),
    });
    assert.equal(items.length, 1);
    assert.equal(lineQuantity(items[0]), 1);
  });
});

const JAVA_REF = /^\[L[a-zA-Z0-9./]+;@[0-9a-f]+$/i;
