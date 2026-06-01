import { getTestimonials } from '@/lib/marketing';
import type { ProductConfig } from '@/config/products';
import { Stars } from './Stars';

export function Testimonials({ product }: { product?: ProductConfig }) {
  const items = getTestimonials(product);

  return (
    <section className="px-4 py-10">
      <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-accent">
        VERIFIED REVIEWS
      </p>
      <h2 className="mt-2 text-center font-arabic text-xl font-bold text-primary">
        عميلات جرّبن لارا داخل الكويت
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-center text-sm text-muted">
        تقييمات حقيقية من مشتريات مؤكدة — دفع عند الاستلام.
      </p>

      <div className="mt-8 space-y-4">
        {items.map((t) => (
          <blockquote
            key={t.name}
            className="rounded-2xl border border-border bg-[#F5F0E8] p-5"
          >
            <div className="mb-3 flex items-start justify-between">
              <span className="text-2xl text-primary/20">&ldquo;</span>
              <Stars rating={t.rating} />
            </div>
            <p className="text-center text-sm leading-relaxed text-ink">{t.text}</p>
            <footer className="mt-4 flex items-center justify-end gap-3">
              <div className="text-right">
                <p className="font-arabic text-sm font-bold text-primary">{t.name}</p>
                <p className="text-[11px] text-muted">{t.meta}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-arabic text-sm font-bold text-accent">
                {t.initial}
              </div>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
