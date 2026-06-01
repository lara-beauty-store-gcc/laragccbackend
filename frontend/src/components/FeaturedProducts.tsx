import Link from 'next/link';
import { products, getLowestOfferPrice } from '@/config/products';
import { formatPriceFrom } from '@/lib/pricing';
import { PremiumImagePlaceholder } from './PremiumImagePlaceholder';
import { Stars } from './Stars';

export function FeaturedProducts() {
  return (
    <section id="products" className="scroll-mt-20 px-4 py-10">
      <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-accent">
        OUR FORMULATIONS
      </p>
      <h2 className="mt-2 text-center font-arabic text-xl font-bold text-primary">
        ثلاث علكات. ثلاث احتياجات.
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-center text-sm text-muted">
        نوم، طاقة، وتركيز — عروض من 16 د.ك مع دفع عند الاستلام.
      </p>

      <div className="mt-8 space-y-8">
        {products.map((product) => (
          <article
            key={product.id}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-card"
          >
            <Link href={`/products/${product.slug}`} className="block">
              <div className="relative p-4 pb-0">
                <span className="absolute left-4 top-4 z-10 rounded-full bg-card/90 px-3 py-1 text-[10px] font-medium text-primary shadow-sm">
                  {product.routineNameLocal}
                </span>
                <PremiumImagePlaceholder product={product} className="min-h-[240px]" />
              </div>
              <div className="p-5 text-center">
                <h3 className="font-arabic text-lg font-bold leading-snug text-primary">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {product.cardSubheadline}
                </p>
                <div className="mt-3 flex justify-center">
                  <Stars rating={product.rating} count={product.reviewsCount} />
                </div>
                <p className="mt-3 font-arabic text-sm font-bold text-primary">
                  {formatPriceFrom(getLowestOfferPrice(product))}
                </p>
                <span className="mt-4 inline-block w-full rounded-xl border border-primary py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white">
                  شوفي التفاصيل
                </span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
