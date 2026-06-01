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
import { AnnouncementBar } from '../AnnouncementBar';
import { BrandLogo } from '../PremiumImagePlaceholder';
import { Stars } from '../Stars';
import { IconArrowLeft } from '../icons';
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
      <AnnouncementBar />

      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card/95 px-4 py-3 backdrop-blur-md">
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-primary"
          aria-label="رجوع"
        >
          <IconArrowLeft />
        </Link>
        <div className="flex items-center gap-2">
          <BrandLogo size="sm" />
          <span className="font-arabic text-xs font-bold text-primary">
            {businessConfig.brand.nameLocal}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-primary"
          aria-label="السلة"
        >
          🛒
        </button>
      </header>

      <div className="px-4 pt-4">
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
