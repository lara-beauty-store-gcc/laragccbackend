import Stripe from 'stripe';
import { config } from '../config.js';
import { log } from '../logger.js';

let stripeClient;

export function getStripe() {
  if (!config.stripe.secretKey) return null;
  if (!stripeClient) {
    stripeClient = new Stripe(config.stripe.secretKey);
  }
  return stripeClient;
}

export function isStripeEnabled() {
  return Boolean(config.stripe.secretKey);
}

export async function createCheckoutSession({
  orderNumber,
  eventId,
  customerName,
  phoneE164,
  areaNotes,
  dbItems,
  subtotalAmount,
  deliveryFee,
  totalAmount,
  currency,
  sourceUrl,
}) {
  const stripe = getStripe();
  if (!stripe) {
    throw new Error('stripe_not_configured');
  }

  const lineItems = dbItems.map((item) => ({
    price_data: {
      currency: currency.toLowerCase(),
      unit_amount: Math.round(Number(item.lineTotal) * 100),
      product_data: {
        name: item.productName || item.sku || 'Lara Beauty',
        metadata: {
          sku: item.sku || '',
          bundle_id: item.bundleId || '',
        },
      },
    },
    quantity: 1,
  }));

  if (deliveryFee > 0) {
    lineItems.push({
      price_data: {
        currency: currency.toLowerCase(),
        unit_amount: Math.round(Number(deliveryFee) * 100),
        product_data: {
          name: 'رسوم التوصيل',
        },
      },
      quantity: 1,
    });
  }

  const successUrl = `${config.frontendUrl.replace(/\/$/, '')}/thank-you?order=${encodeURIComponent(orderNumber)}&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${config.frontendUrl.replace(/\/$/, '')}/?checkout=cancelled`;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: lineItems,
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: orderNumber,
    customer_email: undefined,
    metadata: {
      order_number: orderNumber,
      event_id: eventId,
      customer_name: customerName,
      phone_e164: phoneE164,
      area_notes: areaNotes || '',
      source_url: sourceUrl || '',
      subtotal_amount: String(subtotalAmount),
      delivery_fee: String(deliveryFee),
      total_amount: String(totalAmount),
    },
    payment_intent_data: {
      metadata: {
        order_number: orderNumber,
        event_id: eventId,
      },
    },
  });

  log.info('Stripe checkout session created', {
    orderNumber,
    sessionId: session.id,
  });

  return session;
}

export function verifyWebhookSignature(rawBody, signature) {
  const stripe = getStripe();
  if (!stripe || !config.stripe.webhookSecret) {
    throw new Error('stripe_webhook_not_configured');
  }
  return stripe.webhooks.constructEvent(
    rawBody,
    signature,
    config.stripe.webhookSecret,
  );
}
