'use client';

import { CircleCheckBig } from 'lucide-react';
import type { ProductConfig } from '@/config/products';
import type { ProductOffer } from '@/config/types';
import { formatPrice, formatSavings } from '@/lib/pricing';

export function ProductOfferSelector({
  product,
  selectedId,
  onSelect,
}: {
  product: ProductConfig;
  selectedId: string;
  onSelect: (offer: ProductOffer) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="font-arabic text-sm font-extrabold text-foreground">اختاري العرض:</p>
        <span className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[10px] font-bold text-primary">
          نتيجة من العلبة الأولى
        </span>
      </div>
      {product.offers.map((offer) => {
        const selected = offer.id === selectedId;
        const savings = formatSavings(offer);
        return (
          <button
            key={offer.id}
            type="button"
            onClick={() => onSelect(offer)}
            className={`relative flex w-full items-center justify-between gap-3 rounded-2xl border-2 p-4 text-right transition-all duration-200 ${
              selected
                ? 'border-primary bg-primary/5 shadow-soft'
                : 'border-border bg-white hover:border-primary/30'
            }`}
          >
            {offer.badge ? (
              <span className="absolute left-3 top-3 rounded-full bg-secondary px-2.5 py-0.5 text-[9px] font-bold text-primary-dark">
                {offer.badge}
              </span>
            ) : null}
            <div className="flex flex-1 items-start gap-3">
              <span
                className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  selected ? 'border-primary bg-primary text-white' : 'border-border bg-white'
                }`}
              >
                {selected ? <CircleCheckBig className="h-3 w-3" aria-hidden /> : null}
              </span>
              <div className="flex-1">
                <p className="font-arabic text-sm font-extrabold text-foreground">{offer.label}</p>
                <p className="mt-0.5 text-xs text-muted">{offer.subtitle}</p>
              </div>
            </div>
            <div className="shrink-0 text-left">
              <p className="font-arabic text-base font-extrabold text-primary">{formatPrice(offer.price)}</p>
              {savings ? (
                <p className="mt-0.5 text-[11px] font-bold text-emerald-700">{savings}</p>
              ) : null}
            </div>
          </button>
        );
      })}
    </div>
  );
}
