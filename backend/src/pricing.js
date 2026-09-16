export const PRICES_AED = {
  b1: 189,
  b2: 239,
  b3: 339,
  UPSELL: 49,
};

export const COD_DELIVERY_FEE_AED = 20;

/** Units per bundle offer (one=1 box, two=2 boxes, three=3 boxes). */
export const BUNDLE_PACK = { b1: 1, b2: 2, b3: 3, UPSELL: 1 };

/** Frontend sends offer ids one|two|three; legacy clients may send b1|b2|b3 */
const BUNDLE_ALIASES = {
  one: 'b1',
  two: 'b2',
  three: 'b3',
  b1: 'b1',
  b2: 'b2',
  b3: 'b3',
};

export function normalizeBundleId(bundleId) {
  const key = String(bundleId || 'b1').toLowerCase();
  return BUNDLE_ALIASES[key] || key;
}

export function resolveBundleCount(item) {
  const pack = BUNDLE_PACK[normalizeBundleId(item.bundleId)] ?? 1;
  const raw = Number(item.quantity) || 1;
  if (raw <= 1) return 1;
  if (raw === pack) return 1;
  if (raw > pack && raw % pack === 0) return raw / pack;
  return raw;
}

/** Total physical units for sheets — e.g. "two" bundle → 2 even if quantity field is 1. */
export function resolveUnitCount(item) {
  const pack = BUNDLE_PACK[normalizeBundleId(item.bundleId)] ?? 1;
  const raw = Number(item.quantity) || 1;
  if (raw === 1 && pack > 1) return pack;
  if (raw >= pack) return Math.round(raw);
  return Math.round(raw * pack);
}

export function lineUnitPrice(item) {
  const bundle = normalizeBundleId(item.bundleId);
  return (
    PRICES_AED[bundle] ??
    Number(item.unitPrice ?? item.unitPriceAed ?? item.unitPriceKwd) ??
    PRICES_AED.b1
  );
}

export function calcSubtotal(items, upsell) {
  let subtotal = 0;
  for (const item of items) {
    const unit = lineUnitPrice(item);
    subtotal += unit * resolveBundleCount(item);
  }
  if (upsell?.accepted) {
    subtotal += PRICES_AED.UPSELL;
  }
  return Math.round(subtotal * 1000) / 1000;
}

export function normalizePaymentMethod(raw) {
  const value = String(raw || 'COD').trim().toUpperCase();
  if (value === 'CARD' || value === 'STRIPE') return 'CARD';
  return 'COD';
}

export function calcDeliveryFee(paymentMethod) {
  return normalizePaymentMethod(paymentMethod) === 'COD' ? COD_DELIVERY_FEE_AED : 0;
}

export function calcOrderTotals(items, upsell, paymentMethod) {
  const subtotalAmount = calcSubtotal(items, upsell);
  const deliveryFee = calcDeliveryFee(paymentMethod);
  const totalAmount = Math.round((subtotalAmount + deliveryFee) * 1000) / 1000;
  return { subtotalAmount, deliveryFee, totalAmount };
}

export function buildDbItems(items, upsell) {
  const dbItems = items.map((i) => {
    const bundle = normalizeBundleId(i.bundleId);
    const unit = lineUnitPrice(i);
    const bundles = resolveBundleCount(i);
    const units = resolveUnitCount(i);
    const productName = String(i.name || i.productName || '').trim();
    return {
      productId: i.productId || i.id,
      sku: String(i.sku || '').trim(),
      productName: productName || String(i.sku || '').trim(),
      bundleId: bundle,
      quantity: units,
      unitPrice: unit,
      lineTotal: unit * bundles,
    };
  });

  if (upsell?.accepted && upsell.sku) {
    dbItems.push({
      productId: upsell.productId,
      sku: upsell.sku,
      productName: upsell.name || 'Upsell',
      bundleId: 'UPSELL',
      quantity: 1,
      unitPrice: PRICES_AED.UPSELL,
      lineTotal: PRICES_AED.UPSELL,
    });
  }

  return dbItems;
}
