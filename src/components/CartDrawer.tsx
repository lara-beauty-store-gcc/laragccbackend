'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Plus, ShoppingBag, Star, X } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { businessConfig } from '@/config/business';
import { getDefaultOffer, getProductBySlug, products } from '@/config/products';
import type { CartLine } from '@/lib/cart';
import { useCart } from '@/lib/cart';
import { formatPrice, formatPriceFrom } from '@/lib/pricing';

const { cod } = businessConfig;

function getRecommendations(cartItems: CartLine[], limit = 2) {
  const inCart = new Set(cartItems.map((i) => i.slug));
  const relatedSlugs = new Set<string>();
  for (const item of cartItems) {
    const p = getProductBySlug(item.slug);
    p?.relatedSlugs?.forEach((s) => relatedSlugs.add(s));
  }
  const fromRelated = products.filter((p) => relatedSlugs.has(p.slug) && !inCart.has(p.slug));
  if (fromRelated.length >= limit) return fromRelated.slice(0, limit);
  const extras = products.filter((p) => !inCart.has(p.slug) && !fromRelated.includes(p));
  return [...fromRelated, ...extras].slice(0, limit);
}

function lineQuantityLabel(line: CartLine) {
  const units = line.offerQuantity * line.qty;
  if (units === 1) return 'علبة واحدة';
  if (units === 2) return 'علبتين';
  return `${units} علب`;
}

export function CartDrawer() {
  const { items, total, panel, closePanel, openCheckout, remove, addOffer } = useCart();

  const recommendations = useMemo(() => getRecommendations(items), [items]);

  useEffect(() => {
    document.body.style.overflow = panel === 'cart' ? 'hidden' : '';
    return () => {
      if (panel === 'cart') document.body.style.overflow = '';
    };
  }, [panel]);

  if (panel !== 'cart') return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/45"
        aria-label="إغلاق السلة"
        onClick={closePanel}
      />

      <aside
        className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        role="dialog"
        aria-labelledby="cart-drawer-title"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-border px-4 py-4">
          <button
            type="button"
            onClick={closePanel}
            className="rounded-full p-2 text-muted transition hover:bg-surface-rose"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" aria-hidden />
            <h2 id="cart-drawer-title" className="font-arabic text-base font-extrabold text-foreground">
              سلة التسوق
            </h2>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="py-12 text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-muted/40" aria-hidden />
              <p className="mt-4 font-arabic text-sm font-bold text-foreground">السلة فاضية</p>
              <p className="mt-1 text-xs text-muted">اختاري علكتك المفضّلة وابدئي الروتين</p>
              <Link
                href="/#products"
                onClick={closePanel}
                className="mt-6 inline-block rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white"
              >
                تصفّحي العلكات
              </Link>
            </div>
          ) : (
            <>
              <ul className="space-y-3">
                {items.map((line) => {
                  const product = getProductBySlug(line.slug);
                  const img = product?.collectionImage;
                  return (
                    <li
                      key={`${line.productId}-${line.offerId}`}
                      className="rounded-2xl bg-surface-rose p-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl bg-white">
                          {img ? (
                            <Image
                              src={img}
                              alt={line.name}
                              fill
                              className="object-cover object-center"
                              sizes="72px"
                              unoptimized
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-primary/5 text-[10px] text-muted">
                              لارا
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="font-arabic text-sm font-bold leading-snug text-foreground">
                            {line.name}
                          </p>
                          <p className="mt-0.5 text-xs text-muted">{lineQuantityLabel(line)}</p>
                        </div>

                        <div className="shrink-0 text-left">
                          <p className="font-arabic text-sm font-extrabold text-foreground">
                            {formatPrice(line.price * line.qty)}
                          </p>
                          <button
                            type="button"
                            onClick={() => remove(line.productId, line.offerId)}
                            className="mt-1 text-[11px] font-medium text-muted underline-offset-2 hover:text-red-600 hover:underline"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {recommendations.length > 0 ? (
                <section className="mt-6">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <h3 className="font-arabic text-sm font-extrabold text-foreground">ينصحون بها معك</h3>
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">
                      +200 طلبت
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {recommendations.map((product) => {
                      const offer = getDefaultOffer(product);
                      return (
                        <li
                          key={product.id}
                          className="rounded-2xl border border-border bg-white p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-rose">
                              {product.collectionImage ? (
                                <Image
                                  src={product.collectionImage}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                  unoptimized
                                />
                              ) : null}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="line-clamp-2 font-arabic text-xs font-bold leading-snug text-foreground">
                                {product.name}
                              </p>
                              <div className="mt-1 flex items-center gap-1">
                                <div className="flex text-secondary" aria-hidden>
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${i < Math.round(product.rating) ? 'fill-secondary' : 'fill-none'}`}
                                    />
                                  ))}
                                </div>
                                <span className="text-[10px] font-bold text-foreground">
                                  {product.rating}
                                </span>
                                <span className="text-[10px] text-muted">({product.reviewsCount})</span>
                              </div>
                              <p className="mt-0.5 text-[11px] font-bold text-primary">
                                {formatPriceFrom(offer.price)}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => addOffer(product, offer)}
                              className="flex shrink-0 items-center gap-1 rounded-xl bg-primary px-3 py-2.5 text-[11px] font-bold text-white"
                            >
                              <Plus className="h-3.5 w-3.5" aria-hidden />
                              أضيفي
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ) : null}
            </>
          )}
        </div>

        {items.length > 0 ? (
          <footer className="shrink-0 border-t border-border bg-surface-rose px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-arabic text-sm font-bold text-foreground">الإجمالي:</span>
              <span className="font-arabic text-lg font-extrabold text-foreground">{formatPrice(total)}</span>
            </div>
            <p className="mb-3 text-center text-[11px] font-medium text-muted">{cod.paymentLabel}</p>
            <button
              type="button"
              onClick={openCheckout}
              className="w-full rounded-2xl bg-primary py-4 font-arabic text-sm font-bold text-white shadow-soft transition hover:bg-primary/90"
            >
              إتمام الطلب
            </button>
          </footer>
        ) : null}
      </aside>
    </div>
  );
}
