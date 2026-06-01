'use client';

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
      <div className="flex items-center justify-between">
        <p className="font-arabic text-sm font-bold text-primary">اختاري العرض:</p>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
          نتيجة من أول علبة
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
            className={`relative w-full rounded-2xl border-2 p-4 text-right transition ${
              selected
                ? 'border-primary bg-primary/5 shadow-soft'
                : 'border-border bg-card'
            }`}
          >
            {offer.badge ? (
              <span className="absolute left-3 top-3 rounded-full bg-accent px-2 py-0.5 text-[9px] font-bold text-primary">
                {offer.badge}
              </span>
            ) : null}
            <div className="flex items-start gap-3">
              <span
                className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  selected ? 'border-primary bg-primary' : 'border-border'
                }`}
              >
                {selected ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
              </span>
              <div className="flex-1">
                <p className="font-arabic text-sm font-bold text-primary">{offer.label}</p>
                <p className="mt-0.5 text-xs text-muted">{offer.subtitle}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="font-arabic text-base font-bold text-primary">
                    {formatPrice(offer.price)}
                  </span>
                  {savings ? (
                    <span className="text-xs font-semibold text-emerald-700">{savings}</span>
                  ) : null}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
