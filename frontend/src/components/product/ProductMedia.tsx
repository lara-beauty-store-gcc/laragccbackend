import Image from 'next/image';
import type { ProductConfig } from '@/config/products';
import type { ProductImages } from '@/config/types';

const hues: Record<ProductConfig['placeholderHue'], string> = {
  teal: 'from-teal-100 via-emerald-50 to-teal-200',
  amber: 'from-amber-100 via-orange-50 to-amber-200',
  indigo: 'from-indigo-100 via-violet-50 to-indigo-200',
};

type MediaKey = keyof ProductImages;

export function ProductMedia({
  product,
  imageKey,
  alt,
  className = '',
  variant = 'card',
}: {
  product: ProductConfig;
  imageKey: MediaKey;
  alt: string;
  className?: string;
  variant?: 'hero' | 'card' | 'square';
}) {
  // Product page only — never fall back to homepage collectionImage
  const src = product.images[imageKey] || '';
  const hue = product.placeholderHue;

  const minH =
    variant === 'hero'
      ? 'min-h-[320px] aspect-[4/5] max-h-[480px]'
      : variant === 'square'
        ? 'min-h-[200px] aspect-square'
        : 'min-h-[220px] aspect-[4/3]';

  if (src) {
    return (
      <div
        className={`relative w-full overflow-hidden rounded-2xl border border-border bg-white ${minH} ${className}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain p-1"
          sizes="(max-width: 480px) 100vw"
          unoptimized
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${hues[hue]} ${minH} ${className}`}
      role="img"
      aria-label={alt}
    >
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_70%_30%,white,transparent_55%)]" />
      {variant === 'hero' ? (
        <div className="relative flex h-full flex-col">
          <div className="grid flex-1 grid-cols-2 gap-1 p-3">
            <div className="rounded-xl bg-white/50 p-2 text-center">
              <p className="text-[10px] font-medium text-primary/70">قبل</p>
              <div className="mt-2 h-20 rounded-lg bg-gradient-to-br from-stone-200 to-stone-300" />
            </div>
            <div className="rounded-xl bg-white/60 p-2 text-center">
              <p className="text-[10px] font-medium text-primary/70">بعد الروتين</p>
              <div className="mt-2 h-20 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-200" />
            </div>
          </div>
          <div className="relative z-10 -mt-8 mx-auto mb-4 flex h-28 w-20 flex-col items-center justify-center rounded-2xl border-2 border-accent/40 bg-gradient-to-b from-white to-white/80 shadow-card">
            <span className="text-[9px] font-bold text-primary">{product.shortName}</span>
            <span className="mt-1 text-[8px] text-muted">60 علكة</span>
          </div>
        </div>
      ) : (
        <div className="relative flex h-full flex-col items-center justify-center p-6 text-center">
          <div
            className={`mb-3 h-32 w-20 rounded-2xl border-2 border-white/70 bg-gradient-to-b ${hues[hue]} shadow-card`}
          />
          <p className="text-sm font-semibold text-primary">{product.shortName}</p>
          <p className="mt-1 text-xs text-muted">صورة قريباً</p>
        </div>
      )}
    </div>
  );
}
