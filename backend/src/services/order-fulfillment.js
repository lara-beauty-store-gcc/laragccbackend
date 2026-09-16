import { config } from '../config.js';
import {
  getOrderByNumber,
  getOrderItems,
  logEvent,
  markOrderPaid,
  markSheetSynced,
} from '../db.js';
import { log } from '../logger.js';
import { sendMetaEvent } from './meta-capi.js';
import { forwardToGoogleSheets } from './sheets.js';
import { sendSnapEvent } from './snap-capi.js';
import { sendTiktokEvent } from './tiktok-capi.js';

export async function sendPurchaseIntegrations({
  orderNumber,
  totalAmount,
  subtotalAmount,
  deliveryFee,
  currency,
  paymentMethod,
  paymentStatus,
  name,
  phoneAsEntered,
  phoneE164,
  areaNotes,
  sourceUrl,
  dbItems,
  upsellAccepted,
  eventId,
  clientIpValue,
  userAgent,
}) {
  const capiPayload = {
    orderId: orderNumber,
    value: totalAmount,
    currency,
    phone: phoneE164,
    sourceUrl,
    contentIds: dbItems.map((i) => i.sku).filter(Boolean),
  };
  const ctx = { ip: clientIpValue, userAgent };

  const [meta, tiktok, snap, sheets] = await Promise.all([
    sendMetaEvent('Purchase', capiPayload, ctx),
    sendTiktokEvent('Purchase', capiPayload, ctx),
    sendSnapEvent('Purchase', capiPayload, ctx),
    forwardToGoogleSheets('Purchase', {
      order_number: orderNumber,
      order_id: orderNumber,
      customer_name: name,
      phone_raw: phoneAsEntered,
      phone: phoneAsEntered.replace(/[\s\-()]/g, ''),
      phone_e164: phoneE164,
      country: 'AE',
      area_notes: areaNotes,
      items: dbItems,
      subtotal_aed: subtotalAmount,
      delivery_fee_aed: deliveryFee,
      total_aed: totalAmount,
      total: totalAmount,
      totalprice: totalAmount,
      currency,
      source_url: sourceUrl,
      url: sourceUrl,
      upsell_accepted: upsellAccepted,
      payment_method: paymentMethod,
      payment_status: paymentStatus,
    }),
  ]);

  await logEvent(
    'Purchase',
    { orderNumber, ...capiPayload, paymentMethod, paymentStatus },
    { meta, tiktok, snap, sheets },
    clientIpValue,
  );

  if (!sheets.ok) {
    await markSheetSynced(orderNumber, String(sheets.error || sheets.body));
  } else {
    await markSheetSynced(orderNumber, null);
  }

  return { meta, tiktok, snap, sheets };
}

export async function finalizePaidCardOrder(orderNumber, stripeMeta = {}) {
  const existing = await getOrderByNumber(orderNumber);
  if (!existing) {
    log.warn('Stripe webhook: order not found', orderNumber);
    return null;
  }

  if (existing.payment_status === 'paid') {
    return existing;
  }

  const updated = await markOrderPaid(orderNumber, stripeMeta);
  if (!updated) return existing;

  const dbItems = await getOrderItems(updated.id);
  const sheetItems = dbItems.map((row) => ({
    productId: row.product_id,
    sku: row.sku,
    productName: row.product_name,
    bundleId: row.bundle_id,
    quantity: row.quantity,
    unitPrice: row.unit_price,
    lineTotal: row.line_total,
  }));

  await sendPurchaseIntegrations({
    orderNumber: updated.order_number,
    totalAmount: Number(updated.total_amount),
    subtotalAmount: Number(updated.subtotal_amount),
    deliveryFee: Number(updated.delivery_fee || 0),
    currency: updated.currency,
    paymentMethod: 'CARD',
    paymentStatus: 'paid',
    name: updated.customer_name,
    phoneAsEntered: updated.phone_e164,
    phoneE164: updated.phone_e164,
    areaNotes: updated.area_notes,
    sourceUrl: updated.source_url || config.frontendUrl,
    dbItems: sheetItems,
    upsellAccepted: updated.upsell_accepted,
    eventId: updated.event_id,
    clientIpValue: updated.client_ip,
    userAgent: '',
  });

  return updated;
}
