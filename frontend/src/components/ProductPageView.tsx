'use client';

import Link from 'next/link';
import type { Product } from '@/config/products';
import { useCart } from '@/lib/cart';
import { formatPriceFrom, getProductPageCopy } from '@/lib/marketing';
import { FAQAccordion } from './FAQAccordion';
import { PremiumImagePlaceholder } from './PremiumImagePlaceholder';
import { Stars } from './Stars';
import { Testimonials } from './Testimonials';
import { IconArrowLeft } from './icons';

export function ProductPageView({ product }: { product: Product }) {
  const { add } = useCart();
  const copy = getProductPageCopy(product);

  return (
    <div className="pb-8">
      <div className="sticky top-[57px] z-40 flex items-center justify-between border-b border-border bg-card/95 px-4 py-3 backdrop-blur-md">
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-primary"
          aria-label="رجوع"
        >
          <IconArrowLeft />
        </Link>
        <p className="font-arabic text-sm font-bold text-primary">
          {formatPriceFrom(product.priceFrom)}
        </p>
      </div>

      <div className="px-4 pt-4">
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
          {product.badgeText}
        </span>

        <div className="mt-4">
          <PremiumImagePlaceholder product={product} className="min-h-[300px]" />
        </div>

        <h1 className="mt-6 font-arabic text-xl font-bold leading-snug text-primary">
          {product.name}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">{copy.description}</p>

        <div className="mt-4">
          <Stars rating={product.rating} count={product.reviewsCount} />
        </div>

        <ul className="mt-6 space-y-2">
          {copy.benefits.map((b) => (
            <li
              key={b}
              className="flex items-start gap-2 rounded-lg bg-surface px-3 py-2 text-sm text-muted"
            >
              <span className="text-accent">✓</span>
              {b}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => add(product)}
          className="mt-8 w-full rounded-xl bg-primary py-4 font-arabic text-sm font-bold text-white shadow-soft transition hover:bg-primary-dark"
        >
          أضيفي للسلة — {formatPriceFrom(product.priceFrom)}
        </button>

        <p className="mt-3 text-center text-[11px] text-muted">
          دفع عند الاستلام • شحن داخل الكويت • ضمان 30 يوم
        </p>
      </div>

      <Testimonials product={product} />
      <FAQAccordion product={product} />
    </div>
  );
}
