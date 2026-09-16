import { Router } from 'express';
import { log } from '../logger.js';
import { finalizePaidCardOrder } from '../services/order-fulfillment.js';
import { verifyWebhookSignature } from '../services/stripe.js';

const router = Router();

router.post('/webhook', async (req, res) => {
  const signature = req.headers['stripe-signature'];
  if (!signature) {
    return res.status(400).json({ error: 'missing_signature' });
  }

  try {
    const event = verifyWebhookSignature(req.body, signature);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const orderNumber =
        session.metadata?.order_number || session.client_reference_id || '';

      if (!orderNumber) {
        log.warn('Stripe webhook: missing order_number', session.id);
        return res.json({ received: true, skipped: 'missing_order_number' });
      }

      await finalizePaidCardOrder(orderNumber, {
        sessionId: session.id,
        paymentIntentId:
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id,
      });
    }

    return res.json({ received: true });
  } catch (err) {
    log.error('Stripe webhook error', err.message);
    return res.status(400).json({ error: 'webhook_error', message: err.message });
  }
});

export default router;
