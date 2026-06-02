import { Router } from 'express';
import { config } from '../config.js';
import { createOrder, logEvent, markSheetSynced } from '../db.js';
import { log } from '../logger.js';
import { sendMetaEvent } from '../services/meta-capi.js';
import { forwardToGoogleSheets } from '../services/sheets.js';
import { sendSnapEvent } from '../services/snap-capi.js';
import { sendTiktokEvent } from '../services/tiktok-capi.js';
import { isValidKuwaitPhone, normalizeKuwaitPhone } from '../services/phone.js';

const router = Router();

const PRICES = {
  b1: 16,
  b2: 21,
  b3: 29,
  UPSELL: 9,
};

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return String(forwarded).split(',')[0].trim();
  return req.socket.remoteAddress || '';
}

function calcTotal(items, upsell) {
  let total = 0;
  for (const item of items) {
    const bundle = item.bundleId || 'b1';
    const unit = PRICES[bundle] ?? Number(item.unitPriceKwd) ?? 16;
    const qty = Number(item.quantity) || 1;
    total += unit * qty;
  }
  if (upsell?.accepted) {
    total += PRICES.UPSELL;
  }
  return Math.round(total * 1000) / 1000;
}

router.post('/', async (req, res) => {
  try {
    const body = req.body || {};
    const name = String(body.customerName || body.name || '').trim();
    const phoneRaw = body.phone || body.phoneNumber || '';
    const phoneE164 = normalizeKuwaitPhone(phoneRaw);

    if (!name || name.length < 2) {
      return res.status(400).json({ error: 'invalid_name' });
    }
    if (!isValidKuwaitPhone(phoneRaw)) {
      return res.status(400).json({
        error: 'invalid_phone',
        message: 'رقم جوال كويتي غير صحيح — مثال: 50001234',
      });
    }

    const items = Array.isArray(body.items) ? body.items : [];
    if (items.length === 0) {
      return res.status(400).json({ error: 'empty_cart' });
    }

    const upsell = body.upsell || {};
    const totalKwd = calcTotal(items, upsell);
    const orderNumber = `LARA-${Date.now().toString(36).toUpperCase()}`;
    const eventId = body.eventId || `purchase_${orderNumber}`;

    const order = {
      orderNumber,
      customerName: name,
      phoneE164,
      areaNotes: body.area || body.areaNotes || '',
      subtotalKwd: totalKwd,
      totalKwd,
      currency: 'KWD',
      paymentMethod: 'COD',
      upsellAccepted: Boolean(upsell.accepted),
      upsellProductId: upsell.productId || null,
      upsellAmountKwd: upsell.accepted ? PRICES.UPSELL : null,
      eventId,
      sourceUrl: body.sourceUrl || config.frontendUrl,
      clientIp: clientIp(req),
    };

    const dbItems = items.map((i) => {
      const bundle = i.bundleId || 'b1';
      const unit = PRICES[bundle] ?? 16;
      const qty = Number(i.quantity) || 1;
      return {
        productId: i.productId || i.id,
        sku: i.sku,
        productName: i.name || i.productName,
        bundleId: bundle,
        quantity: qty,
        unitPriceKwd: unit,
        lineTotalKwd: unit * qty,
      };
    });

    if (upsell.accepted && upsell.sku) {
      dbItems.push({
        productId: upsell.productId,
        sku: upsell.sku,
        productName: upsell.name || 'Upsell',
        bundleId: 'UPSELL',
        quantity: 1,
        unitPriceKwd: PRICES.UPSELL,
        lineTotalKwd: PRICES.UPSELL,
      });
    }

    let dbResult = null;
    try {
      dbResult = await createOrder(order, dbItems);
    } catch (dbErr) {
      log.error('DB order insert failed', dbErr.message);
    }

    const capiPayload = {
      orderId: orderNumber,
      value: totalKwd,
      currency: 'KWD',
      email: body.email,
      phone: phoneE164,
      sourceUrl: order.sourceUrl,
      contentIds: items.map((i) => i.sku).filter(Boolean),
    };
    const ctx = { ip: order.clientIp, userAgent: req.headers['user-agent'] || '' };

    const [meta, tiktok, snap, sheets] = await Promise.all([
      sendMetaEvent('Purchase', capiPayload, ctx),
      sendTiktokEvent('Purchase', capiPayload, ctx),
      sendSnapEvent('Purchase', capiPayload, ctx),
      forwardToGoogleSheets('Purchase', {
        ...capiPayload,
        order_number: orderNumber,
        customer_name: name,
        phone_e164: phoneE164,
        area_notes: order.areaNotes,
        items: dbItems,
        total_kwd: totalKwd,
        upsell_accepted: order.upsellAccepted,
        payment_method: 'COD',
      }),
    ]);

    await logEvent('Purchase', { orderNumber, ...capiPayload }, { meta, tiktok, snap, sheets }, order.clientIp);

    if (!sheets.ok) {
      await markSheetSynced(orderNumber, String(sheets.error || sheets.body));
    } else {
      await markSheetSynced(orderNumber, null);
    }

    return res.json({
      success: true,
      orderId: orderNumber,
      orderNumber,
      totalKwd,
      eventId,
      db: Boolean(dbResult),
    });
  } catch (err) {
    log.error('Order error', err);
    return res.status(500).json({ error: 'internal_error' });
  }
});

export default router;
