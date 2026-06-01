import Link from 'next/link';
import { getFinalCta } from '@/lib/marketing';

export function FinalCTA() {
  const copy = getFinalCta();

  return (
    <section className="mx-4 mb-10 overflow-hidden rounded-2xl bg-primary px-6 py-10 text-center text-white shadow-soft">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-accent">
        {copy.eyebrow}
      </p>
      <h2 className="mt-3 font-arabic text-xl font-bold leading-snug">{copy.title}</h2>
      <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-white/85">
        {copy.subtitle}
      </p>
      <Link
        href="#products"
        className="mt-6 inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-accent px-6 py-4 font-arabic text-sm font-bold text-primary-dark transition hover:opacity-95"
      >
        {copy.cta}
        <span aria-hidden>←</span>
      </Link>
      <div className="mt-6 flex flex-wrap justify-center gap-3 text-[10px] text-white/80">
        <span>دفع عند الاستلام</span>
        <span>•</span>
        <span>شحن الكويت</span>
        <span>•</span>
        <span>ضمان 30 يوم</span>
      </div>
    </section>
  );
}
