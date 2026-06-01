'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { businessInputs } from '@/config/business';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/marketing';

const { market } = businessInputs;

export function CheckoutModal() {
  const router = useRouter();
  const { items, isOpen, setOpen, clear } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const total = items.reduce(
    (s, i) => s + i.product.priceFrom * i.qty,
    0,
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!name.trim() || !phone.trim()) {
      setError('الاسم ورقم الجوال مطلوبين');
      return;
    }

    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const payload = {
        eventName: 'Purchase',
        customerName: name.trim(),
        phone: `${market.phoneCountryCode}${phone.replace(/\D/g, '')}`,
        area: area.trim(),
        items: items.map((i) => ({
          sku: i.product.sku,
          name: i.product.name,
          qty: i.qty,
          price: i.product.priceFrom,
        })),
        total,
        currency: market.currency,
        paymentMethod: 'COD',
      };

      if (apiUrl) {
        await fetch(`${apiUrl}/api/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const orderId = `LARA-${Date.now()}`;
      sessionStorage.setItem('lara-last-order', JSON.stringify({ ...payload, orderId }));
      clear();
      setOpen(false);
      router.push(`/thank-you?order=${orderId}`);
    } catch {
      setError('صار خطأ — حاولي مرة ثانية أو تواصلي واتساب');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-card p-6 shadow-2xl sm:rounded-2xl"
        role="dialog"
        aria-labelledby="checkout-title"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="checkout-title" className="font-arabic text-lg font-bold text-primary">
            تأكيد الطلب — دفع عند الاستلام
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg px-2 py-1 text-muted hover:bg-surface"
            aria-label="إغلاق"
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-center text-sm text-muted">السلة فاضية</p>
        ) : (
          <>
            <ul className="mb-4 space-y-2 border-b border-border pb-4 text-sm">
              {items.map((i) => (
                <li key={i.product.id} className="flex justify-between gap-2">
                  <span className="font-arabic text-primary">{i.product.shortName} × {i.qty}</span>
                  <span className="font-semibold text-primary">
                    {formatPrice(i.product.priceFrom * i.qty)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mb-4 text-left font-arabic text-base font-bold text-primary">
              المجموع: {formatPrice(total)}
            </p>

            <form onSubmit={submit} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted">الاسم الكامل</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                  placeholder="مثال: نورة العتيبي"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted">رقم الجوال</label>
                <div className="flex gap-2" dir="ltr">
                  <span className="flex items-center rounded-xl border border-border bg-surface px-3 text-sm text-muted">
                    {market.phoneCountryCode}
                  </span>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                    placeholder={market.phoneExample}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted">المنطقة / العنوان</label>
                <input
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                  placeholder="مثال: حولي، السالمية..."
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <p className="text-[11px] leading-relaxed text-muted">
                ما في دفع أونلاين. فريقنا يتصل فيك يأكد الطلب والعنوان. تدفعين كاش أو كي نت وقت الاستلام.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-primary py-4 font-arabic text-sm font-bold text-white transition hover:bg-primary-dark disabled:opacity-60"
              >
                {loading ? 'جاري الإرسال...' : 'أكّدي الطلب — COD'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
