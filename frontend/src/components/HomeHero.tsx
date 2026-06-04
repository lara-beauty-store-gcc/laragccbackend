import Link from 'next/link';
import { ArrowLeft, Award, FlaskConical, ShieldCheck } from 'lucide-react';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { homeHeroImagePath } from '@/config/product-images';
import { getHeroCopy, getTrustBadges } from '@/lib/marketing';

export function HomeHero() {
  const copy = getHeroCopy();
  const badges = getTrustBadges();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-surface-rose to-primary-soft">
      <div
        className="deco pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full border-2 border-secondary/15"
        aria-hidden
      />
      <div
        className="deco pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full border-2 border-secondary/15"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-container px-4 py-12 sm:px-6 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8 lg:py-20">
        <div className="order-2 space-y-6 lg:order-1 lg:space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5">
            <FlaskConical className="h-4 w-4 text-primary" aria-hidden />
            <span className="text-xs font-bold tracking-wide text-primary sm:text-sm">{copy.eyebrow}</span>
          </div>

          <h1 className="text-balance font-arabic text-3xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {copy.title}
            <span className="mt-2 block text-primary">{copy.titleAccent}</span>
          </h1>

          <p className="max-w-xl text-base font-medium leading-relaxed text-muted lg:text-lg">
            {copy.subtitle}
          </p>

          <div className="grid max-w-md grid-cols-4 gap-2">
            {badges.map((b) => (
              <div
                key={b.label}
                className="rounded-xl border border-border bg-white/70 px-2 py-2.5 text-center backdrop-blur-sm"
              >
                <p className="text-[11px] font-extrabold tracking-tight text-primary sm:text-xs">{b.label}</p>
                <p className="mt-0.5 text-[10px] font-medium leading-tight text-muted">{b.sub}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
            <Link
              href="#products"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-7 py-4 text-sm font-bold text-white transition hover:bg-primary/90"
            >
              {copy.cta}
              <ArrowLeft className="h-5 w-5" aria-hidden />
            </Link>
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-secondary/30 bg-secondary-soft px-5 py-3 text-sm font-bold text-foreground">
              <Award className="h-5 w-5 text-secondary" aria-hidden />
              <span>{copy.guarantee}</span>
            </div>
          </div>
        </div>

        <div className="relative order-1 mb-8 flex justify-center lg:order-2 lg:mb-0">
          <div className="absolute inset-0 scale-125 rounded-full bg-primary/15 blur-3xl" aria-hidden />
          <MediaFrame
            src={homeHeroImagePath}
            alt="لارا للجمال — روتين النوم والطاقة والتركيز"
            layout="homeHero"
            priority
          />
          <div className="absolute -bottom-4 -left-4 flex items-center gap-3 rounded-2xl border border-border bg-white p-4 shadow-xl sm:-bottom-6 sm:-left-6">
            <div className="rounded-full bg-primary p-3 text-secondary ring-2 ring-secondary/30">
              <ShieldCheck className="h-6 w-6" aria-hidden />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted">{copy.guaranteeSub}</p>
              <p className="text-sm font-extrabold text-foreground">{copy.guaranteeSubLocal}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
