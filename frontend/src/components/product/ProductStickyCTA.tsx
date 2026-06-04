'use client';

import type { ProductConfig } from '@/config/products';
import type { ProductOffer } from '@/config/types';
import { ctaLabel } from '@/lib/pricing';

export function ProductStickyCTA({
  product,
  offer,
  onClick,
  visible,
}: {
  product: ProductConfig;
  offer: ProductOffer;
  onClick: () => void;
  visible: boolean;
}) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md">
      <div className="mx-auto max-w-container px-4 sm:px-6">
        <button
          type="button"
          onClick={onClick}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-arabic text-sm font-bold text-white shadow-card"
        >
          <span aria-hidden>↑</span>
          {ctaLabel(product, offer)}
        </button>
        <p className="mt-2 text-center text-[10px] text-muted">
          دفع عند الاستلام • بدون دفع أونلاين
        </p>
      </div>
    </div>
  );
}
