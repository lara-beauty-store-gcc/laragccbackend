'use client';

import Link from 'next/link';
import { businessConfig } from '@/config/business';
import type { ProductConfig } from '@/config/products';
import { getLowestOfferPrice, products } from '@/config/products';
import type { IngredientItem, ProductOffer } from '@/config/types';
import { formatPrice, formatPriceFrom } from '@/lib/pricing';
import { ProductMedia } from './ProductMedia';
import { SectionShell } from './SectionShell';

const { cod, market } = businessConfig;

function ingredientName(item: IngredientItem): string {
  return typeof item === 'string' ? item : item.name;
}

function ingredientDetail(item: IngredientItem): { benefit: string; proof: string; dosage?: string } {
  if (typeof item === 'string') {
    return { benefit: 'يدعم أهداف الروتين اليومي', proof: 'مكوّن مدروس' };
  }
  return {
    benefit: item.benefit ?? '',
    proof: item.proof ?? '',
    dosage: item.dosage,
  };
}

export function ProductTrustBadges({ product }: { product: ProductConfig }) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-2">
      {product.badges.map((badge) => (
        <div
          key={badge}
          className="rounded-xl border border-border bg-card px-2 py-2.5 text-center text-[10px] font-semibold leading-snug text-primary"
        >
          {badge}
        </div>
      ))}
    </div>
  );
}

export function ProductTrustStrip() {
  const items = [
    { icon: '✓', title: cod.paymentLabel, sub: 'بدون بطاقة' },
    { icon: '🚚', title: cod.deliveryPromise, sub: market.countryName },
    { icon: '🛡', title: 'جودة معتمدة', sub: 'GMP • حلال' },
    { icon: '♥', title: 'ضمان 30 يوم', sub: 'استرجاع' },
  ];
  return (
    <div className="mx-4 -mt-2 rounded-2xl bg-primary p-4 shadow-card">
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.title} className="text-center">
            <span className="text-lg text-accent">{item.icon}</span>
            <p className="mt-1 text-[11px] font-bold leading-snug text-white">{item.title}</p>
            <p className="text-[9px] text-white/70">{item.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProblemInsightSection({ product }: { product: ProductConfig }) {
  const stat = product.insightStat;
  return (
    <SectionShell title="ليش يصير هالشي؟" subtitle={product.problem}>
      <ProductMedia
        product={product}
        imageKey="problemImage"
        alt={product.imageAlts.problemImage}
        className="w-full"
      />
      {stat ? (
        <div className="mt-4 rounded-2xl bg-primary p-4 text-white">
          <p className="font-arabic text-3xl font-bold text-accent">{stat.value}</p>
          <p className="mt-2 text-sm leading-relaxed">{stat.label}</p>
          {stat.source ? <p className="mt-2 text-[10px] text-white/60">{stat.source}</p> : null}
        </div>
      ) : null}
    </SectionShell>
  );
}

export function ProblemAgitationSection({ product }: { product: ProductConfig }) {
  const cards = product.problemCards ?? [];
  return (
    <SectionShell
      eyebrow="هل تعرفين هالمشاكل؟"
      title="مشاكل تعرفينها — وحل من الداخل"
      subtitle="مو نخفّف الأعراض بس. ندعم الروتين اليومي."
    >
      <div className="space-y-4">
        {cards.map((card) => (
          <div key={card.pain} className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <div className="flex gap-2 border-b border-border bg-card p-4">
              <span className="text-red-500">✕</span>
              <p className="flex-1 text-sm italic text-primary">{card.pain}</p>
            </div>
            <div className="flex gap-2 bg-surface p-4">
              <span className="text-emerald-600">✓</span>
              <p className="flex-1 text-sm text-muted">{card.solution}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

export function FailureAlternativesSection({ product }: { product: ProductConfig }) {
  const alts = product.failureAlternatives ?? [];
  return (
    <SectionShell
      eyebrow="ليش لارا تختلف؟"
      title="قارني — وقرّري بنفسك"
      subtitle="بدائل ثانية غالباً ما تعطي نفس الاستمرار."
    >
      <div className="space-y-4">
        {alts.map((alt) => (
          <div key={alt.name} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <span className="text-red-500">⚠</span>
              <p className="font-arabic font-bold text-primary">{alt.name}</p>
            </div>
            <p className="mt-1 text-sm font-semibold text-red-700">{alt.priceNote}</p>
            <ul className="mt-3 space-y-2">
              {alt.points.map((pt) => (
                <li key={pt} className="flex gap-2 text-sm text-muted">
                  <span className="text-red-500">✕</span>
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

export function MechanismSection({ product }: { product: ProductConfig }) {
  return (
    <SectionShell title="كيف يشتغل الروتين؟" subtitle={product.mechanism}>
      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="text-sm font-semibold text-accent">{product.mainIngredient}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">{product.desiredOutcome}</p>
      </div>
    </SectionShell>
  );
}

export function ExclusionsSection({ product }: { product: ProductConfig }) {
  const list = product.exclusions ?? [];
  if (!list.length) return null;
  return (
    <SectionShell title="شنو ما راح تلقين داخل العلبة">
      <ul className="grid grid-cols-2 gap-2">
        {list.map((item) => (
          <li
            key={item}
            className="rounded-xl bg-surface px-3 py-2 text-center text-xs font-medium text-primary"
          >
            {item}
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

export function IngredientBreakdown({ product }: { product: ProductConfig }) {
  return (
    <SectionShell title="المكوّنات الأساسية" subtitle="كل مكوّن له دور واضح">
      <div className="space-y-3">
        {product.ingredientStack.map((item) => {
          const { benefit, proof, dosage } = ingredientDetail(item);
          return (
            <div key={ingredientName(item)} className="rounded-2xl border border-border bg-card p-4">
              <p className="font-arabic font-bold text-primary">{ingredientName(item)}</p>
              {dosage ? <p className="text-xs text-accent">{dosage}</p> : null}
              <p className="mt-2 text-sm text-muted">{benefit}</p>
              <p className="mt-1 text-[11px] text-muted/80">{proof}</p>
            </div>
          );
        })}
      </div>
      <ProductMedia
        product={product}
        imageKey="ingredientImage"
        alt={product.imageAlts.ingredientImage}
        className="mt-4 w-full"
        variant="square"
      />
    </SectionShell>
  );
}

export function AuthoritySection({ product }: { product: ProductConfig }) {
  const auth = product.authority;
  if (!auth) return null;
  return (
    <SectionShell eyebrow="ثقة وجودة" title="جودة وثقة">
      <div className="grid grid-cols-2 gap-2">
        {auth.certifications.map((c) => (
          <div
            key={c}
            className="rounded-xl border border-border bg-card py-3 text-center text-sm font-bold text-primary"
          >
            {c}
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl bg-primary p-5 text-white">
        <span className="rounded-full bg-accent/20 px-2 py-1 text-[10px] font-bold text-accent">
          رأي مختص
        </span>
        <p className="mt-4 text-sm leading-relaxed">{auth.expertQuote}</p>
        <p className="mt-4 text-sm font-bold text-accent">{auth.expertTitle}</p>
      </div>
    </SectionShell>
  );
}

export function ProofStats({ product }: { product: ProductConfig }) {
  const stats = [
    { value: String(product.rating), label: 'تقييم' },
    { value: String(product.reviewsCount), label: 'مراجعة' },
    { value: '30', label: 'يوم ضمان' },
    { value: '2', label: 'علكة / يوم' },
  ];
  return (
    <div className="grid grid-cols-2 gap-2 px-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-xl border border-border bg-card py-4 text-center">
          <p className="font-arabic text-2xl font-bold text-accent">{s.value}</p>
          <p className="text-xs text-muted">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

export function ResultsTimeline({ product }: { product: ProductConfig }) {
  const items = product.timeline ?? [];
  return (
    <SectionShell
      eyebrow="نتيجة من أول علبة"
      title="وش ممكن تشوفين خلال أول 30 يوم؟"
      subtitle="النتيجة تختلف — الاستمرار هو المفتاح."
    >
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={item.label} className="relative rounded-2xl border border-border bg-card p-5 pt-8">
            <span className="absolute -top-3 right-1/2 flex h-8 w-8 translate-x-1/2 items-center justify-center rounded-full bg-primary font-bold text-accent">
              {i + 1}
            </span>
            <p className="text-center font-arabic font-bold text-primary">{item.label}</p>
            <p className="mt-2 text-center text-sm leading-relaxed text-muted">{item.text}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

export function ProductTestimonials({ product }: { product: ProductConfig }) {
  const items = product.testimonials ?? [];
  return (
    <SectionShell title="وش تقول العميلات؟">
      <div className="space-y-4">
        {items.map((t) => (
          <div key={t.name} className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex justify-between">
              <span className="text-accent">★★★★★</span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] text-emerald-800">
                مؤكدة
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">{t.quote}</p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-accent">
                  {t.initial}
                </span>
                <div>
                  <p className="text-sm font-bold text-primary">{t.name}</p>
                  <p className="text-[11px] text-muted">{t.meta}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

export function ComparisonSection({ product }: { product: ProductConfig }) {
  const rows = product.comparisonRows ?? [
    { label: 'السعر', product: formatPrice(getLowestOfferPrice(product)), alternative: 'أغلى على المدى الطويل' },
    { label: 'السهولة', product: 'علكتين يومياً', alternative: 'روتين معقد' },
    { label: 'الدفع', product: 'عند الاستلام', alternative: 'أونلاين' },
    { label: 'الضمان', product: '30 يوم', alternative: 'محدود' },
  ];
  return (
    <SectionShell title="مقارنة سريعة">
      <div className="overflow-hidden rounded-2xl border border-border">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-3 border-b border-border text-xs last:border-0">
            <div className="bg-surface p-3 font-semibold text-primary">{row.label}</div>
            <div className="p-3 text-muted">{row.product}</div>
            <div className="p-3 text-muted">{row.alternative}</div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

export function OfferRecap({
  product,
  offer,
  onCta,
}: {
  product: ProductConfig;
  offer: ProductOffer;
  onCta: () => void;
}) {
  return (
    <SectionShell dark title={product.name}>
      <div className="rounded-2xl border border-accent/30 bg-primary-dark p-5">
        <p className="text-accent">{offer.badge || 'عرض مختار'}</p>
        <p className="mt-2 font-arabic text-lg font-bold">{offer.label}</p>
        <p className="mt-4 font-arabic text-2xl font-bold text-accent">{formatPrice(offer.price)}</p>
        <ul className="mt-4 space-y-2 text-sm text-white/85">
          <li>✓ {cod.paymentLabel}</li>
          <li>✓ {cod.deliveryPromise}</li>
          <li>✓ {cod.returnGuarantee}</li>
        </ul>
        <button
          type="button"
          onClick={onCta}
          className="mt-6 w-full rounded-2xl bg-accent py-4 font-arabic text-sm font-bold text-primary"
        >
          اطلبي الآن — {formatPrice(offer.price)}
        </button>
      </div>
    </SectionShell>
  );
}

export function GuaranteeSection() {
  return (
    <SectionShell title="ضمان 30 يوم" subtitle={cod.returnGuarantee}>
      <ol className="space-y-3 text-sm text-muted">
        <li className="rounded-xl bg-card p-3">١. تواصلي معنا</li>
        <li className="rounded-xl bg-card p-3">٢. نرتّب الاسترجاع إذا لزم</li>
        <li className="rounded-xl bg-card p-3">٣. نرجّع لك المبلغ</li>
      </ol>
    </SectionShell>
  );
}

export function HowToUseSection({ product }: { product: ProductConfig }) {
  const usage = product.usage ?? {
    headline: 'أبسط روتين جربتيه',
    steps: [
      'علكتين كل يوم — بعد الفطور أو العشا حسب نوع الروتين',
      'العلبة = شهر كامل (60 علكة)',
      'بدون ماء — طعم لذيذ',
    ],
  };
  return (
    <SectionShell eyebrow="طريقة الاستخدام" title={usage.headline}>
      <div className="space-y-3">
        {usage.steps.map((step, i) => (
          <div key={step} className="flex gap-3 rounded-2xl border border-border bg-card p-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-accent">
              {i + 1}
            </span>
            <p className="text-sm leading-relaxed text-muted">{step}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

export function CODDeliverySection() {
  const steps = [
    { title: 'اطلبي الآن', body: 'اختاري العرض، اكتبي اسمك ورقمك — بدون دفع أونلاين.' },
    { title: cod.confirmationPromise, body: 'عربي 100% — نأكد العنوان والكمية.' },
    { title: 'استلمي وادفعي', body: 'تدفعين كاش أو كي نت لما يوصلك الطلب.' },
  ];
  return (
    <SectionShell
      eyebrow="التوصيل والدفع"
      title="كيف يوصلك طلبك — بكل بساطة"
      subtitle={cod.paymentLabel}
    >
      <div className="space-y-3">
        {steps.map((s, i) => (
          <div key={s.title} className="relative rounded-2xl bg-surface p-5 pt-8">
            <span className="absolute -top-3 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              {i + 1}
            </span>
            <p className="font-arabic font-bold text-primary">{s.title}</p>
            <p className="mt-2 text-sm text-muted">{s.body}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

export function DeliveryCitiesSection({ product }: { product: ProductConfig }) {
  const cities = product.delivery?.cities ?? [market.countryName];
  const carriers = product.delivery?.carriers ?? [];
  return (
    <SectionShell title="نوصّل لكل مناطق الكويت">
      <div className="rounded-2xl border border-border bg-surface p-4">
        <p className="text-sm font-bold text-primary">📍 مدن التوصيل</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {cities.map((city) => (
            <span
              key={city}
              className="rounded-full border border-border bg-card px-3 py-1 text-[11px] text-primary"
            >
              ✓ {city}
            </span>
          ))}
        </div>
        {carriers.length ? (
          <p className="mt-4 text-[10px] text-muted">🚚 {carriers.join(' • ')}</p>
        ) : null}
      </div>
    </SectionShell>
  );
}

export function ProductFAQ({ product }: { product: ProductConfig }) {
  const base = product.faq ?? [
    {
      question: 'كم السعر والعروض؟',
      answer: `عروض من ${formatPrice(16)} لعلبة وحدة إلى ${formatPrice(29)} لثلاث علب. الدفع عند الاستلام.`,
    },
    {
      question: 'متى أشوف نتيجة؟',
      answer: 'تختلف من شخص لشخص. الاستمرار 2–4 أسابيع يساعد على تقييم الروتين.',
    },
    {
      question: 'هل آمن للاستخدام اليومي؟',
      answer: 'اتبعي التعليمات على العلبة. إذا عندك حالة صحية أو حامل — استشيري طبيبك.',
    },
    {
      question: 'كيف الدفع والتوصيل؟',
      answer: `${cod.paymentLabel}. ${cod.deliveryPromise}.`,
    },
  ];

  return (
    <SectionShell eyebrow="قبل ما تطلبين" title="كل اللي تحتاجين تعرفينه">
      <div className="space-y-2">
        {base.map((item) => (
          <details
            key={item.question}
            className="group rounded-2xl border border-border bg-card"
          >
            <summary className="cursor-pointer list-none p-4 font-arabic text-sm font-bold text-primary [&::-webkit-details-marker]:hidden">
              {item.question}
            </summary>
            <p className="border-t border-border px-4 pb-4 pt-2 text-sm leading-relaxed text-muted">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </SectionShell>
  );
}

export function RelatedProducts({
  product,
  onSelect,
}: {
  product: ProductConfig;
  onSelect?: (slug: string) => void;
}) {
  const slugs = product.relatedSlugs ?? [];
  const related = products.filter((p) => slugs.includes(p.slug));
  if (!related.length) return null;

  return (
    <SectionShell title="منتجات ثانية من لارا">
      <div className="space-y-4">
        {related.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.slug}`}
            onClick={() => onSelect?.(p.slug)}
            className="flex gap-4 rounded-2xl border border-border bg-card p-3"
          >
            <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl">
              <ProductMedia
                product={p}
                imageKey="heroProduct"
                alt={p.imageAlts.heroProduct}
                variant="square"
                className="h-full min-h-0"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-primary">{p.cardHeadline}</p>
              <p className="mt-1 text-xs text-muted">{p.cardSubheadline}</p>
              <p className="mt-2 text-sm font-bold text-accent">
                {formatPriceFrom(getLowestOfferPrice(p))}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </SectionShell>
  );
}
