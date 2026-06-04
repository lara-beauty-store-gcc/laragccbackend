'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { businessConfig } from '@/config/business';
import type { ProductConfig } from '@/config/products';
import { getDefaultOffer } from '@/config/products';
import type { ProductOffer } from '@/config/types';
import { useCart } from '@/lib/cart';
import { ctaLabel, formatPrice, formatPriceFrom } from '@/lib/pricing';
import { trackAddToCart, trackViewContent } from '@/lib/tracking';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { BrandLogo } from '../PremiumImagePlaceholder';
import { Stars } from '../Stars';
import { ProductMedia } from './ProductMedia';
import { ProductOfferSelector } from './ProductOfferSelector';
import {
  AuthoritySection,
  CODDeliverySection,
  ComparisonSection,
  DeliveryCitiesSection,
  ExclusionsSection,
  FailureAlternativesSection,
  GuaranteeSection,
  HowToUseSection,
  IngredientBreakdown,
  MechanismSection,
  OfferRecap,
  ProblemAgitationSection,
  ProblemInsightSection,
  ProductFAQ,
  ProductTestimonials,
  ProductTrustBadges,
  ProductTrustStrip,
  ProofStats,
  RelatedProducts,
  ResultsTimeline,
} from './ProductSections';
import { ProductStickyCTA } from './ProductStickyCTA';

const { cod, market } = businessConfig;

export function ProductLandingPage({ product }: { product: ProductConfig }) {
  const { addOffer, setOpen } = useCart();
  const defaultOffer = useMemo(() => getDefaultOffer(product), [product]);
  const [selectedOffer, setSelectedOffer] = useState<ProductOffer>(defaultOffer);
  const [showSticky, setShowSticky] = useState(false);
  const heroCtaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackViewContent({
      id: product.id,
      sku: product.sku,
      name: product.name,
      price: selectedOffer.price,
      currency: market.currency,
    });
  }, [product.id, product.sku, product.name, selectedOffer.price]);

  useEffect(() => {
    const el = heroCtaRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleAddToCart = useCallback(() => {
    addOffer(product, selectedOffer);
    trackAddToCart({
      content_ids: product.sku,
      content_name: product.name,
      value: selectedOffer.price,
      currency: market.currency,
      quantity: selectedOffer.quantity,
    });
  }, [addOffer, product, selectedOffer]);

  return (
    <div className="pb-28">
      <header className="sticky top-0 z-40 border-b border-border bg-white shadow-sm">
        <div className="mx-auto flex h-14 max-w-container items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full p-2 transition-colors hover:bg-primary-soft"
            aria-label="رجوع"
          >
            <ArrowRight className="h-5 w-5 text-foreground" aria-hidden />
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <BrandLogo size="sm" />
            <span className="font-arabic text-xs font-extrabold text-foreground sm:text-sm">
              {businessConfig.brand.nameLocal}
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-full p-2 transition-colors hover:bg-primary-soft"
            aria-label="السلة"
          >
            <ShoppingBag className="h-6 w-6 text-foreground" aria-hidden />
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-container px-4 pt-4 sm:px-6 lg:px-8">
        <ProductMedia
          product={product}
          imageKey="heroBeforeAfter"
          alt={product.imageAlts.heroBeforeAfter}
          variant="hero"
          className="w-full"
        />
        <ProductTrustBadges product={product} />

        <h1 className="mt-6 font-arabic text-xl font-bold leading-snug text-primary">
          {product.heroHeadline}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">{product.heroSubheadline}</p>

        <div className="mt-4">
          <Stars rating={product.rating} count={product.reviewsCount} />
        </div>
        <p className="mt-2 font-arabic text-sm font-bold text-primary">
          {formatPriceFrom(selectedOffer.price)}
        </p>
        {product.scarcityLine ? (
          <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-center text-[11px] font-medium text-rose-800">
            ⏱ {product.scarcityLine}
          </p>
        ) : null}

        <div className="mt-6">
          <ProductOfferSelector
            product={product}
            selectedId={selectedOffer.id}
            onSelect={setSelectedOffer}
          />
        </div>

        <div ref={heroCtaRef} className="mt-6">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full rounded-2xl bg-primary py-4 font-arabic text-sm font-bold text-white shadow-card"
          >
            {ctaLabel(product, selectedOffer)}
          </button>
          <p className="mt-3 text-center text-[11px] text-muted">{cod.paymentLabel}</p>
        </div>
      </div>

      <ProductTrustStrip />

      <ProblemInsightSection product={product} />
      <ProblemAgitationSection product={product} />
      <FailureAlternativesSection product={product} />
      <MechanismSection product={product} />
      <ExclusionsSection product={product} />
      <IngredientBreakdown product={product} />
      <AuthoritySection product={product} />
      <ProofStats product={product} />
      <ResultsTimeline product={product} />
      <ProductTestimonials product={product} />
      <ComparisonSection product={product} />
      <OfferRecap product={product} offer={selectedOffer} onCta={handleAddToCart} />
      <GuaranteeSection />
      <HowToUseSection product={product} />
      <CODDeliverySection />
      <DeliveryCitiesSection product={product} />
      <ProductFAQ product={product} />
      <RelatedProducts product={product} />

      <ProductStickyCTA
        product={product}
        offer={selectedOffer}
        onClick={handleAddToCart}
        visible={showSticky}
      />
    </div>
  );
}
