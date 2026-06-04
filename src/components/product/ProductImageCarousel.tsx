import type { ProductConfig } from '@/config/products';
import { MediaFrame } from '@/components/ui/MediaFrame';

/** Product hero image — fits inside parent card on mobile. */
export function ProductImageCarousel({ product }: { product: ProductConfig }) {
  const src = product.images.heroBeforeAfter;
  const alt = product.imageAlts.heroBeforeAfter ?? product.name;

  if (!src) {
    return (
      <div className="mx-auto aspect-square w-full max-w-[420px] rounded-2xl bg-surface-rose" />
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <MediaFrame src={src} alt={alt} layout="productHero" priority />
    </div>
  );
}
