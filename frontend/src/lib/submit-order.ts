import { businessConfig } from '@/config/business';
import type { PaymentMethod } from '@/lib/pricing';

export type OrderLinePayload = {
  sku: string;
  name: string;
  slug: string;
  bundleId?: string;
  quantity: number;
  lineTotal: number;
};

export type SubmitOrderPayload = {
  customerName: string;
  phone: string;
  area?: string;
  items: OrderLinePayload[];
  sourceUrl?: string;
  paymentMethod?: PaymentMethod;
};

export type SubmitOrderResult = {
  success: boolean;
  orderId: string;
  orderIds: string[];
  paymentMethod: PaymentMethod;
  subtotalAed?: number;
  deliveryFeeAed?: number;
  totalAed?: number;
  checkoutUrl?: string;
};

export async function submitOrder(payload: SubmitOrderPayload): Promise<SubmitOrderResult> {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (data.error === 'sheet_sync_failed') {
      throw new Error(data.message || 'sheet_sync_failed');
    }
    throw new Error(data.message || data.error || 'order_failed');
  }

  const paymentMethod = (data.paymentMethod || payload.paymentMethod || 'COD') as PaymentMethod;

  if (paymentMethod === 'CARD') {
    const checkoutUrl = String(data.checkoutUrl || '');
    const orderId = String(data.orderId || data.orderNumber || '');
    if (!checkoutUrl || !orderId) {
      throw new Error('stripe_checkout_failed');
    }
    return {
      success: true,
      orderId,
      orderIds: [orderId],
      paymentMethod,
      subtotalAed: Number(data.subtotalAed ?? 0),
      deliveryFeeAed: Number(data.deliveryFeeAed ?? 0),
      totalAed: Number(data.totalAed ?? data.total ?? 0),
      checkoutUrl,
    };
  }

  if (data.sheetSynced === false) {
    throw new Error(data.message || 'sheet_sync_failed');
  }

  const orderIds: string[] = Array.isArray(data.orderIds) ? data.orderIds : [];
  const orderId = String(data.orderId || orderIds[0] || '');

  if (!orderId) {
    throw new Error('order_failed');
  }

  return {
    success: true,
    orderId,
    orderIds,
    paymentMethod: 'COD',
    subtotalAed: Number(data.subtotalAed ?? 0),
    deliveryFeeAed: Number(data.deliveryFeeAed ?? 0),
    totalAed: Number(data.totalAed ?? data.total ?? 0),
  };
}

export function formatOrderIdLabel(orderIds: string[]): string {
  if (orderIds.length <= 1) return orderIds[0] ?? '';
  return orderIds.join(' · ');
}

export function buildProductUrl(slug: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://larabeauty.store';
  return `${base.replace(/\/$/, '')}/products/${slug}`;
}

export const orderCurrency = businessConfig.market.currency;
