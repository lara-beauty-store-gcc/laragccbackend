'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { businessInputs } from '@/config/business';
import { formatPrice } from '@/lib/pricing';

const { brand, cod, card } = businessInputs;

type SavedOrder = {
  orderId: string;
  customerName?: string;
  phone?: string;
  area?: string;
  items?: { label: string; qty: number; price: number }[];
  subtotal?: number;
  deliveryFee?: number;
  total?: number;
  paymentMethod?: 'COD' | 'CARD';
  currency?: string;
};

function ThankYouContent() {
  const params = useSearchParams();
  const queryOrderId = params.get('order') ?? '';
  const sessionId = params.get('session_id') ?? '';
  const [order, setOrder] = useState<SavedOrder | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>('');

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('lara-last-order');
      if (raw) setOrder(JSON.parse(raw) as SavedOrder);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const orderId = order?.orderId || queryOrderId;
    if (!orderId) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return;

    fetch(`${apiUrl.replace(/\/$/, '')}/api/v1/orders/${encodeURIComponent(orderId)}/status`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.paymentStatus) setPaymentStatus(String(data.paymentStatus));
      })
      .catch(() => {
        /* ignore */
      });
  }, [order?.orderId, queryOrderId, sessionId]);

  const orderId = order?.orderId || queryOrderId;
  const isCard = order?.paymentMethod === 'CARD' || Boolean(sessionId);
  const isPaid = paymentStatus === 'paid' || (isCard && sessionId);

  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl text-accent">
          ✓
        </div>
        <h1 className="font-arabic text-2xl font-bold text-primary">
          {isCard && !isPaid ? 'جاري تأكيد الدفع...' : 'تم استلام طلبك!'}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {isCard
            ? isPaid
              ? `شكراً لك. تم الدفع بنجاح — فريق ${brand.nameLocal} بيتواصل معك لتأكيد التوصيل.`
              : `تم تحويلك من Stripe. إذا اكتمل الدفع، طلبك قيد التأكيد الآن.`
            : `شكراً لك. فريق ${brand.nameLocal} بيتصل فيك قريب يأكد العنوان. ${cod.paymentLabel}.`}
        </p>

        {orderId && (
          <p className="mt-4 rounded-lg bg-surface px-4 py-2 text-xs text-muted">
            رقم الطلب: <span className="font-mono font-bold text-primary">{orderId}</span>
          </p>
        )}

        {order ? (
          <div className="mt-6 rounded-2xl border border-border bg-card p-5 text-right shadow-card">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-800">
                {isCard ? (isPaid ? 'مدفوع' : 'بطاقة') : 'COD'}
              </span>
              <h2 className="font-arabic text-sm font-extrabold text-primary">ملخص طلبك</h2>
            </div>

            {order.items?.map((item) => (
              <div
                key={`${item.label}-${item.qty}`}
                className="flex items-center justify-between gap-3 border-b border-border py-2 text-sm last:border-0"
              >
                <span className="font-semibold text-primary">{formatPrice(item.price)}</span>
                <span className="font-arabic text-foreground">
                  {item.label} × {item.qty}
                </span>
              </div>
            ))}

            {order.subtotal != null ? (
              <div className="mt-3 space-y-1 text-xs text-muted">
                <div className="flex justify-between">
                  <span>{formatPrice(order.subtotal)}</span>
                  <span>المجموع</span>
                </div>
                {order.paymentMethod === 'COD' && order.deliveryFee != null && order.deliveryFee > 0 ? (
                  <div className="flex justify-between">
                    <span>+{formatPrice(order.deliveryFee)}</span>
                    <span>{cod.deliveryFeeLabel}</span>
                  </div>
                ) : null}
                {order.paymentMethod === 'CARD' ? (
                  <div className="flex justify-between text-emerald-700">
                    <span>0 {businessInputs.market.currencySymbol}</span>
                    <span>{card.freeShippingLabel}</span>
                  </div>
                ) : null}
              </div>
            ) : null}

            {order.area ? (
              <p className="mt-3 text-xs text-muted">
                <span className="font-bold text-foreground">المنطقة:</span> {order.area}
              </p>
            ) : null}
            {order.phone ? (
              <p className="mt-1 text-xs text-muted" dir="ltr">
                <span className="font-bold text-foreground">الجوال:</span> {order.phone}
              </p>
            ) : null}
            {order.total != null ? (
              <p className="mt-3 font-arabic text-base font-extrabold text-primary">
                الإجمالي: {formatPrice(order.total)}
              </p>
            ) : null}
          </div>
        ) : null}

        <p className="mt-4 text-[11px] text-muted">
          {isCard
            ? 'إذا ما ظهر تأكيد الدفع خلال دقائق، تواصلي مع الدعم برقم الطلب.'
            : 'خلي جوالك مفتوح — فريقنا يتصل فيك خلال ساعات عمل لتأكيد العنوان.'}
        </p>

        <Link
          href="/"
          className="mt-8 inline-block rounded-xl bg-primary px-8 py-3 font-arabic text-sm font-semibold text-white"
        >
          رجوع للرئيسية
        </Link>
      </div>
    </section>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-muted">...</p>}>
      <ThankYouContent />
    </Suspense>
  );
}
