import Image from 'next/image';
import type { ProductConfig } from '@/config/products';

/** Single before/after hero — top of product page only (no carousel). */
export function ProductImageCarousel({ product }: { product: ProductConfig }) {
  const src = product.images.heroBeforeAfter;
  const alt = product.imageAlts.heroBeforeAfter ?? product.name;

  return (
    <div className="relative w-full max-w-lg">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border-8 border-white bg-surface-rose shadow-2xl">
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover object-center"
            sizes="(max-width: 512px) 100vw, 512px"
            priority
            unoptimized
          />
        ) : null}
      </div>
    </div>
  );
}
