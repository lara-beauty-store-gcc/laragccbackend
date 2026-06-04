'use client';

import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ProductConfig } from '@/config/products';
import type { ProductImages } from '@/config/types';

type SlideKey = 'heroBeforeAfter' | 'problemImage' | 'ingredientImage';

const SLIDE_ORDER: { key: SlideKey; label: string }[] = [
  { key: 'heroBeforeAfter', label: 'قبل وبعد' },
  { key: 'problemImage', label: 'المشكلة' },
  { key: 'ingredientImage', label: 'المكوّنات' },
];

function uniqueSlides(product: ProductConfig) {
  const seen = new Set<string>();
  return SLIDE_ORDER.filter(({ key }) => {
    const src = product.images[key];
    if (!src || seen.has(src)) return false;
    seen.add(src);
    return true;
  });
}

export function ProductImageCarousel({ product }: { product: ProductConfig }) {
  const slides = useMemo(() => uniqueSlides(product), [product]);
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const goTo = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(next, slides.length - 1));
      setIndex(clamped);
      const track = trackRef.current;
      if (!track) return;
      const slide = track.children[clamped] as HTMLElement | undefined;
      slide?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    },
    [slides.length],
  );

  useEffect(() => {
    setIndex(0);
    trackRef.current?.scrollTo({ left: 0, behavior: 'instant' as ScrollBehavior });
  }, [product.id]);

  const onScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || slides.length < 2) return;
    const { scrollLeft, offsetWidth } = track;
    const maxScroll = track.scrollWidth - offsetWidth;
    if (maxScroll <= 0) return;
    const ratio = scrollLeft / maxScroll;
    const i = Math.round(ratio * (slides.length - 1));
    setIndex(Math.max(0, Math.min(i, slides.length - 1)));
  }, [slides.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current || slides.length < 2) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    // RTL: swipe right (dx > 0) → next image; swipe left → previous
    if (dx > 0) goTo(index + 1);
    else goTo(index - 1);
  };

  if (!slides.length) {
    return (
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border-8 border-white bg-surface-rose shadow-2xl" />
    );
  }

  return (
    <div className="relative w-full max-w-lg">
      <div
        className="relative overflow-hidden rounded-3xl border-8 border-white bg-surface-rose shadow-2xl"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          ref={trackRef}
          dir="rtl"
          onScroll={onScroll}
          className="flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="معرض صور المنتج"
        >
          {slides.map(({ key, label }) => (
            <div
              key={key}
              className="relative w-full shrink-0 snap-center snap-always"
              style={{ scrollSnapAlign: 'center' }}
            >
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={product.images[key]!}
                  alt={product.imageAlts[key as keyof ProductImages] ?? label}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 512px) 100vw, 512px"
                  priority={key === 'heroBeforeAfter'}
                  unoptimized
                  draggable={false}
                />
              </div>
            </div>
          ))}
        </div>

        {slides.length > 1 ? (
          <div
            className="pointer-events-none absolute inset-y-0 left-0 flex w-14 items-center justify-center bg-gradient-to-r from-black/25 to-transparent pl-1"
            aria-hidden
          >
            <span className="flex items-center gap-0.5 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold text-foreground shadow-sm">
              <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
              اسحبي
            </span>
          </div>
        ) : null}
      </div>

      {slides.length > 1 ? (
        <>
          <div className="mt-4 flex justify-center gap-2">
            {slides.map(({ key, label }, i) => (
              <button
                key={key}
                type="button"
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? 'w-6 bg-primary' : 'w-2 bg-border'
                }`}
                aria-label={label}
                aria-current={i === index}
              />
            ))}
          </div>
          <p className="mt-2 text-center text-[11px] font-medium text-muted">
            اسحبي لليمين لمشاهدة صور أخرى ({index + 1}/{slides.length})
          </p>
        </>
      ) : null}
    </div>
  );
}
