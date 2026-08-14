type TrackPayload = Record<string, string | number | boolean | undefined>;

type Ttq = {
  track: (event: string, payload?: TrackPayload, options?: { event_id?: string }) => void;
  page: () => void;
};

type Snaptr = (command: string, event?: string, payload?: TrackPayload) => void;

function getWindow() {
  if (typeof window === 'undefined') return null;
  return window as Window & {
    fbq?: (...args: unknown[]) => void;
    ttq?: Ttq;
    snaptr?: Snaptr;
  };
}

export function purchaseEventId(orderId: string): string {
  return `purchase_${orderId}`;
}

export function trackEvent(name: string, payload?: TrackPayload, eventId?: string) {
  const w = getWindow();
  if (!w) return;

  try {
    w.fbq?.('track', name, payload, eventId ? { eventID: eventId } : undefined);
  } catch {
    /* optional */
  }

  try {
    if (name === 'Purchase' || name === 'CompletePayment') {
      w.ttq?.track(
        'CompletePayment',
        {
          value: payload?.value,
          currency: payload?.currency,
          content_ids: payload?.content_ids,
        },
        eventId ? { event_id: eventId } : undefined,
      );
    } else {
      w.ttq?.track(name, payload, eventId ? { event_id: eventId } : undefined);
    }
  } catch {
    /* optional */
  }

  try {
    if (name === 'Purchase' || name === 'CompletePayment') {
      w.snaptr?.('track', 'PURCHASE', {
        price: payload?.value,
        currency: payload?.currency,
        transaction_id: payload?.order_id ?? payload?.transaction_id,
        item_ids: payload?.content_ids,
      });
    } else if (name === 'InitiateCheckout' || name === 'START_CHECKOUT') {
      w.snaptr?.('track', 'START_CHECKOUT', payload);
    } else if (name === 'AddToCart' || name === 'ADD_CART') {
      w.snaptr?.('track', 'ADD_CART', payload);
    } else if (name === 'ViewContent' || name === 'VIEW_CONTENT') {
      w.snaptr?.('track', 'VIEW_CONTENT', payload);
    } else if (name === 'Lead') {
      w.snaptr?.('track', 'SIGN_UP', payload);
    }
  } catch {
    /* optional */
  }

  if (process.env.NODE_ENV === 'development') {
    console.debug('[track]', name, payload, eventId);
  }
}

export function trackViewContent(product: {
  id: string;
  sku: string;
  name: string;
  price: number;
  currency: string;
}) {
  trackEvent('ViewContent', {
    content_ids: product.sku,
    content_name: product.name,
    value: product.price,
    currency: product.currency,
  });
}

export function trackAddToCart(payload: TrackPayload) {
  trackEvent('AddToCart', payload);
}

export function trackInitiateCheckout(payload: TrackPayload) {
  trackEvent('InitiateCheckout', payload);
  trackEvent('Lead', payload);
}

export function trackPurchase(payload: TrackPayload & { orderId: string }) {
  const eventId = purchaseEventId(payload.orderId);
  trackEvent(
    'Purchase',
    {
      value: payload.value,
      currency: payload.currency,
      content_ids: payload.content_ids,
      order_id: payload.orderId,
    },
    eventId,
  );
}
