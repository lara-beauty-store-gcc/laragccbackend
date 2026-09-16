import { Router } from 'express';
import { config } from '../config.js';
import {
  createOrder,
  getOrderByNumber,
  updateOrderStripeSession,
} from '../db.js';
import { log } from '../logger.js';
import {
  buildDbItems,
  calcOrderTotals,
  normalizePaymentMethod,
} from '../pricing.js';
import { sendPurchaseIntegrations } from '../services/order-fulfillment.js';
import { isValidGccPhone, normalizeGccPhone } from '../services/phone.js';
import { createCheckoutSession, isStripeEnabled } from '../services/stripe.js';

const router = Router();

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return String(forwarded).split(',')[0].trim();
  return req.socket.remoteAddress || '';
}

router.post('/', async (req, res) => {
  try {
    const body = req.body || {};
    const name = String(body.customerName || body.name || '').trim();
    const phoneAsEntered = String(
      body.phoneAsEntered || body.phone || body.phoneNumber || '',
    ).trim();
    const phoneE164 = normalizeGccPhone(phoneAsEntered);

    if (!name || name.length < 2) {
      return res.status(400).json({ error: 'invalid_name' });
    }
    if (!isValidGccPhone(phoneAsEntered)) {
      return res.status(400).json({
        error: 'invalid_phone',
        message: 'رقم جوال إماراتي غير صحيح — مثال: 501234567',
      });
    }

    const items = Array.isArray(body.items) ? body.items : [];
    if (items.length === 0) {
      return res.status(400).json({ error: 'empty_cart' });
    }

    const upsell = body.upsell || {};
    const paymentMethod = normalizePaymentMethod(body.paymentMethod);
    const currency = 'AED';
    const { subtotalAmount, deliveryFee, totalAmount } = calcOrderTotals(
      items,
      upsell,
      paymentMethod,
    );
    const orderNumber = `LARA-${Date.now().toString(36).toUpperCase()}`;
    const eventId = body.eventId || `purchase_${orderNumber}`;
    const sourceUrl = body.sourceUrl || config.frontendUrl;
    const ip = clientIp(req);
    const userAgent = req.headers['user-agent'] || '';
    const dbItems = buildDbItems(items, upsell);

    const order = {
      orderNumber,
      customerName: name,
      phoneE164,
      areaNotes: body.area || body.areaNotes || '',
      subtotalAmount,
      deliveryFee,
      totalAmount,
      currency,
      paymentMethod,
      paymentStatus: paymentMethod === 'CARD' ? 'pending' : 'cod_pending',
      status: paymentMethod === 'CARD' ? 'pending_payment' : 'pending_confirmation',
      upsellAccepted: Boolean(upsell.accepted),
      upsellProductId: upsell.productId || null,
      upsellAmount: upsell.accepted ? 49 : null,
      eventId,
      sourceUrl,
      clientIp: ip,
    };

    let dbResult = null;
    try {
      dbResult = await createOrder(order, dbItems);
    } catch (dbErr) {
      log.error('DB order insert failed', dbErr.message);
    }

    if (paymentMethod === 'CARD') {
      if (!isStripeEnabled()) {
        return res.status(503).json({
          error: 'stripe_not_configured',
          message: 'الدفع بالبطاقة غير متاح حالياً — جربي الدفع عند الاستلام',
        });
      }

      const session = await createCheckoutSession({
        orderNumber,
        eventId,
        customerName: name,
        phoneE164,
        areaNotes: order.areaNotes,
        dbItems,
        subtotalAmount,
        deliveryFee,
        totalAmount,
        currency,
        sourceUrl,
      });

      if (dbResult) {
        await updateOrderStripeSession(orderNumber, session.id, session.payment_intent);
      }

      return res.json({
        success: true,
        orderId: orderNumber,
        orderNumber,
        paymentMethod: 'CARD',
        subtotalAed: subtotalAmount,
        deliveryFeeAed: deliveryFee,
        totalAed: totalAmount,
        total: totalAmount,
        currency,
        eventId,
        checkoutUrl: session.url,
        stripeSessionId: session.id,
        db: Boolean(dbResult),
        sheets: 'pending_payment',
      });
    }

    const integrations = await sendPurchaseIntegrations({
      orderNumber,
      totalAmount,
      subtotalAmount,
      deliveryFee,
      currency,
      paymentMethod: 'COD',
      paymentStatus: 'cod_pending',
      name,
      phoneAsEntered,
      phoneE164,
      areaNotes: order.areaNotes,
      sourceUrl,
      dbItems,
      upsellAccepted: order.upsellAccepted,
      eventId,
      clientIpValue: ip,
      userAgent,
    });

    return res.json({
      success: true,
      orderId: orderNumber,
      orderNumber,
      paymentMethod: 'COD',
      subtotalAed: subtotalAmount,
      deliveryFeeAed: deliveryFee,
      totalAed: totalAmount,
      total: totalAmount,
      currency,
      eventId,
      db: Boolean(dbResult),
      sheets: integrations.sheets.ok
        ? 'synced'
        : String(integrations.sheets.error || integrations.sheets.reason || 'failed'),
    });
  } catch (err) {
    log.error('Order error', err);
    return res.status(500).json({ error: 'internal_error' });
  }
});

router.get('/:orderNumber/status', async (req, res) => {
  try {
    const orderNumber = String(req.params.orderNumber || '').trim();
    if (!orderNumber) {
      return res.status(400).json({ error: 'invalid_order' });
    }

    const order = await getOrderByNumber(orderNumber);
    if (!order) {
      return res.status(404).json({ error: 'order_not_found' });
    }

    return res.json({
      orderNumber: order.order_number,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      status: order.status,
      subtotalAed: Number(order.subtotal_amount),
      deliveryFeeAed: Number(order.delivery_fee || 0),
      totalAed: Number(order.total_amount),
      currency: order.currency,
      paidAt: order.paid_at,
    });
  } catch (err) {
    log.error('Order status error', err);
    return res.status(500).json({ error: 'internal_error' });
  }
});

export default router;
