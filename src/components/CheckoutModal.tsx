'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { businessConfig } from '@/config/business';
import { getProductBySlug, products } from '@/config/products';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/pricing';
import { trackEvent } from '@/lib/tracking';
import { isValidMarketPhone, normalizePhone, uaePhoneErrorMessage } from '@/lib/phone';
import { orderCurrency, submitOrder } from '@/lib/submit-order';

const { market, delivery } = businessConfig;

export function CheckoutModal() {
  const router = useRouter();
  const { items, isOpen, setOpen, clear, total, addOffer } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [emirate, setEmirate] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [upsellVisible, setUpsellVisible] = useState(false);
  const [upsellProductSlug, setUpsellProductSlug] = useState<string | null>(null);

  const upsellProduct = useMemo(
    () => (upsellProductSlug ? getProductBySlug(upsellProductSlug) : undefined),
    [upsellProductSlug],
  );

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!name.trim() || !phone.trim()) {
      setError('الاسم ورقم الجوال مطلوبين');
      return;
    }
    if (!isValidMarketPhone(phone)) {
      setError(uaePhoneErrorMessage(phone) || `رقم جوال إماراتي غير صحيح — مثال: ${market.phoneExample}`);
      return;
    }
    if (!emirate) {
      setError('اختاري الإمارة');
      return;
    }

    const area = [emirate, address.trim()].filter(Boolean).join(' — ');

    setLoading(true);
    try {
      const phoneE164 = normalizePhone(phone);
      if (!phoneE164) {
        setError(uaePhoneErrorMessage(phone));
        return;
      }

      const { orderId, orderIds } = await submitOrder({
        customerName: name.trim(),
        phone: phone.trim(),
        phoneAsEntered: phone.trim(),
        area: area.trim(),
        sourceUrl: typeof window !== 'undefined' ? window.location.href : '',
        items: items.map((i) => ({
          sku: i.sku,
          name: i.offerLabel,
          slug: i.slug,
          quantity: i.offerQuantity * i.qty,
          lineTotal: i.price * i.qty,
        })),
      });

      sessionStorage.setItem(
        'lara-last-order',
        JSON.stringify({
          orderId,
          orderIds,
          customerName: name.trim(),
          phone: phoneE164,
          area: area.trim(),
          items: items.map((i) => ({
            label: i.offerLabel,
            qty: i.qty,
            price: i.price * i.qty,
          })),
          total,
          currency: orderCurrency,
        }),
      );

      const firstSlug = items[0]?.slug;
      const prod = firstSlug ? getProductBySlug(firstSlug) : products[0];
      if (prod?.upsell.enabled) {
        setUpsellProductSlug(prod.slug);
        setUpsellVisible(true);
        trackEvent('UpsellView', { product_id: prod.id, value: prod.upsell.price });
        setTimeout(() => {
          setUpsellVisible(false);
          clear();
          setOpen(false);
          router.push(`/thank-you?order=${orderId}`);
        }, 12000);
        return;
      }

      clear();
      setOpen(false);
      router.push(`/thank-you?order=${orderId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      if (message === 'invalid_phone' || message.includes('جوال')) {
        setError(message);
      } else if (message === 'order_failed' || message === 'sheet_sync_failed') {
        setError('ما قدرنا نسجّل الطلب ف الشيت — تأكدي من رقم الجوال (يبدأ بـ 5) وحاولي مرة ثانية');
      } else if (message) {
        setError(message);
      } else {
        setError('صار خطأ — حاولي مرة ثانية');
      }
    } finally {
      setLoading(false);
    }
  }

  function acceptUpsell() {
    if (!upsellProduct) return;
    const extra = upsellProduct.offers[0];
    if (extra) {
      addOffer(upsellProduct, { ...extra, price: upsellProduct.upsell.price, label: upsellProduct.upsell.label });
      trackEvent('UpsellAccepted', { value: upsellProduct.upsell.price });
    }
    finishAfterUpsell();
  }

  function skipUpsell() {
    trackEvent('UpsellSkipped');
    finishAfterUpsell();
  }

  function finishAfterUpsell() {
    const raw = sessionStorage.getItem('lara-last-order');
    const orderId = raw ? JSON.parse(raw).orderId : '';
    setUpsellVisible(false);
    clear();
    setOpen(false);
    router.push(`/thank-you?order=${orderId}`);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-card p-6 shadow-2xl sm:rounded-2xl"
        role="dialog"
        aria-labelledby="checkout-title"
      >
        {upsellVisible && upsellProduct ? (
          <div className="text-center">
            <h2 className="font-arabic text-lg font-bold text-primary">عرض خاص — ثواني بس!</h2>
            <p className="mt-2 text-sm text-muted">{upsellProduct.upsell.subtitle}</p>
            <p className="mt-4 font-arabic text-2xl font-bold text-accent">
              {formatPrice(upsellProduct.upsell.price)}
            </p>
            <p className="text-sm font-semibold text-primary">{upsellProduct.upsell.label}</p>
            <button
              type="button"
              onClick={acceptUpsell}
              className="mt-6 w-full rounded-xl bg-primary py-4 font-arabic text-sm font-bold text-white"
            >
              نعم، أضيفي العرض
            </button>
            <button
              type="button"
              onClick={skipUpsell}
              className="mt-3 w-full py-2 text-sm text-muted"
            >
              لا شكراً
            </button>
          </div>
        ) : (
          <>
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
                    <li key={`${i.productId}-${i.offerId}`} className="flex justify-between gap-2">
                      <span className="font-arabic text-primary">
                        {i.offerLabel} × {i.qty}
                      </span>
                      <span className="font-semibold text-primary">
                        {formatPrice(i.price * i.qty)}
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
                    <label className="mb-1 block text-xs font-medium text-muted">الإمارة</label>
                    <select
                      required
                      value={emirate}
                      onChange={(e) => setEmirate(e.target.value)}
                      className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                    >
                      <option value="">اختاري الإمارة</option>
                      {delivery.emirates.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted">العنوان التفصيلي</label>
                    <input
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                      placeholder="مثال: شارع الشيخ زايد، بناية 12"
                    />
                  </div>

                  {error && <p className="text-sm text-red-600">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-primary py-4 font-arabic text-sm font-bold text-white disabled:opacity-60"
                  >
                    {loading ? 'جاري الإرسال...' : 'أكّدي الطلب — COD'}
                  </button>
                </form>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
