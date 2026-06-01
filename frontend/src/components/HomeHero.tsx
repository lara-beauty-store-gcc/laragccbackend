import Link from 'next/link';
import { getHeroCopy } from '@/lib/marketing';
import { PremiumImagePlaceholder } from './PremiumImagePlaceholder';
import { TrustBadgesRow } from './TrustBadges';

export function HomeHero() {
  const copy = getHeroCopy();

  return (
    <section className="px-4 pb-8 pt-6">
      <div className="relative">
        <PremiumImagePlaceholder variant="hero" className="min-h-[280px]" />
        <div className="absolute bottom-4 right-4 rounded-xl border border-border bg-card/95 px-3 py-2 shadow-soft">
          <p className="text-xs font-bold text-primary">{copy.proofTitle}</p>
          <p className="text-[10px] text-muted">{copy.proofSubtitle}</p>
        </div>
      </div>

      <p className="mt-6 text-center text-[11px] font-semibold uppercase tracking-widest text-accent">
        {copy.eyebrow}
      </p>
      <h1 className="mt-2 text-center font-arabic text-2xl font-bold leading-snug text-primary md:text-3xl">
        {copy.title}
      </h1>
      <p className="mx-auto mt-3 max-w-md text-center text-sm leading-relaxed text-muted">
        {copy.subtitle}
      </p>

      <TrustBadgesRow className="mt-6" compact />

      <Link
        href="#products"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-center font-arabic text-sm font-semibold text-white shadow-soft transition hover:bg-primary-dark"
      >
        {copy.cta}
        <span aria-hidden>←</span>
      </Link>

      <div className="mt-4 rounded-xl border border-accent/40 bg-card px-4 py-3 text-center">
        <p className="font-arabic text-xs font-semibold text-primary">ضمان استرجاع 30 يوم</p>
      </div>
    </section>
  );
}
