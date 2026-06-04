import Image from 'next/image';
import type { ProductConfig } from '@/config/products';
import { PremiumImagePlaceholder } from './PremiumImagePlaceholder';

/** Homepage collection card — uses collectionImage only; product page hero stays separate */
export function ProductCollectionImage({
  product,
  className = '',
  priority = false,
}: {
  product: ProductConfig;
  className?: string;
  priority?: boolean;
}) {
  if (product.collectionImage) {
    return (
      <div
        className={`relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-white ${className}`}
      >
        <Image
          src={product.collectionImage}
          alt={product.collectionImageAlt ?? product.name}
          fill
          className="object-contain p-3"
          sizes="(max-width: 480px) 100vw, 420px"
          priority={priority}
        />
      </div>
    );
  }

  return <PremiumImagePlaceholder product={product} className={className} />;
}
