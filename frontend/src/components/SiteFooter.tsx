import Link from 'next/link';
import { businessInputs } from '@/config/business';
import { products } from '@/config/products';
import { BrandLogo } from './PremiumImagePlaceholder';

const { brand, market } = businessInputs;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card px-4 py-10 pb-12">
      <div className="flex flex-col items-center text-center">
        <BrandLogo />
        <p className="mt-2 font-arabic text-sm font-bold text-primary">{brand.nameLocal}</p>
        <p className="mt-2 max-w-xs text-xs leading-relaxed text-muted">{brand.description}</p>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {['جودة GMP', 'حلال 100%', 'دفع عند الاستلام'].map((chip) => (
          <span
            key={chip}
            className="rounded-full border border-border bg-surface px-3 py-1 text-[10px] font-medium text-primary"
          >
            {chip}
          </span>
        ))}
      </div>

      <div className="mt-8 space-y-2 font-arabic text-sm text-muted">
        <p className="font-semibold text-primary">العلكات</p>
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.slug}`}
            className="block hover:text-primary"
          >
            {p.shortName}
          </Link>
        ))}
      </div>

      <p className="mt-8 text-center text-[11px] text-muted">
        © {new Date().getFullYear()} {brand.nameLocal}. جميع الحقوق محفوظة — {market.countryName}
      </p>
    </footer>
  );
}
