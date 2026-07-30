'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { IconWhatsApp } from '@/components/icons';
import { businessInputs } from '@/config/business';
import { formatPrice } from '@/lib/pricing';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

const { brand } = businessInputs;

type SavedOrder = {
  orderId: string;
  customerName?: string;
  phone?: string;
  area?: string;
  items?: { label: string; qty: number; price: number }[];
  total?: number;
  currency?: string;
};

function ThankYouContent() {
  const params = useSearchParams();
  const queryOrderId = params.get('order') ?? '';
  const [order, setOrder] = useState<SavedOrder | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('lara-last-order');
      if (raw) setOrder(JSON.parse(raw) as SavedOrder);
    } catch {
      /* ignore */
    }
  }, []);

  const orderId = order?.orderId || queryOrderId;

  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl text-accent">
          ✓
        </div>
        <h1 className="font-arabic text-2xl font-bold text-primary">تم استلام طلبك!</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          شكراً لك. فريق {brand.nameLocal} بيتصل فيك قريب يأكد العنوان. الدفع عند الاستلام.
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
                تم التسجيل
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
                المجموع (COD): {formatPrice(order.total)}
              </p>
            ) : null}
          </div>
        ) : null}

        <p className="mt-4 text-[11px] text-muted">
          خلي جوالك مفتوح — فريقنا يتصل فيك خلال ساعات عمل لتأكيد العنوان.
        </p>

        <a
          href={buildWhatsAppUrl(
            orderId ? `مرحباً، عندي سؤال عن طلبي رقم ${orderId}` : undefined,
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] px-6 py-3 font-arabic text-sm font-bold text-white shadow-lg shadow-[#25D366]/30 transition hover:brightness-105"
        >
          <IconWhatsApp className="h-5 w-5" />
          تواصلي على واتساب
        </a>

        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-primary px-8 py-3 font-arabic text-sm font-semibold text-white"
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
