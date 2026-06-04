import { config } from '../config.js';
import { log } from '../logger.js';

export async function forwardToGoogleSheets(eventName, payload) {
  if (!config.sheetsWebhookUrl) {
    return { ok: true, skipped: true, reason: 'sheets_not_configured' };
  }

  const body = {
    secret: config.sheetsWebhookSecret || undefined,
    event: eventName,
    timestamp: new Date().toISOString(),
    order_number: payload.order_number || payload.orderId,
    order_id: payload.orderId || payload.order_number,
    customer_name: payload.customer_name || payload.customerName,
    phone_e164: payload.phone_e164 || payload.phone,
    area_notes: payload.area_notes || payload.area,
    items: payload.items || payload.products,
    subtotal_kwd: payload.subtotal_kwd ?? payload.value,
    total_kwd: payload.total_kwd ?? payload.value,
    currency: payload.currency || 'KWD',
    payment_method: payload.payment_method || 'COD',
    upsell_accepted: payload.upsell_accepted ?? false,
    upsell_product: payload.upsell_product_id,
    upsell_amount_kwd: payload.upsell_amount_kwd,
    event_id: payload.eventId,
    source_url: payload.sourceUrl,
    status: 'pending_confirmation',
  };

  try {
    const res = await fetch(config.sheetsWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      log.warn('Google Sheets webhook failed', res.status, text);
      return { ok: false, status: res.status, body: text };
    }
    return { ok: true };
  } catch (err) {
    log.error('Google Sheets webhook error', err.message);
    return { ok: false, error: err.message };
  }
}
