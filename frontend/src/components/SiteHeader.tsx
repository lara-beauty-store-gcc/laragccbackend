'use client';

import Link from 'next/link';
import { useState } from 'react';
import { businessInputs } from '@/config/business';
import { products } from '@/config/products';
import { useCart } from '@/lib/cart';
import { BrandLogo } from './PremiumImagePlaceholder';
import { IconBag, IconMenu } from './icons';

const { brand } = businessInputs;

export function SiteHeader() {
  const { count, setOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-card/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-lg p-2 text-primary hover:bg-surface"
            aria-label="القائمة"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <IconMenu />
          </button>
          <button
            type="button"
            className="relative rounded-lg p-2 text-primary hover:bg-surface"
            aria-label="السلة"
            onClick={() => setOpen(true)}
          >
            <IconBag />
            {count > 0 && (
              <span className="absolute -left-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-primary-dark">
                {count}
              </span>
            )}
          </button>
        </div>

        <Link href="/" className="flex items-center gap-2">
          <BrandLogo size="sm" />
          <div className="text-right leading-tight">
            <p className="font-arabic text-sm font-bold text-primary">{brand.nameLocal}</p>
            <p className="text-[10px] tracking-wider text-muted">{brand.nameEnglish}</p>
          </div>
        </Link>
      </div>

      {menuOpen && (
        <nav className="border-t border-border bg-card px-4 py-3">
          <ul className="space-y-2 font-arabic text-sm">
            <li>
              <Link href="/" className="block py-2 text-primary" onClick={() => setMenuOpen(false)}>
                الرئيسية
              </Link>
            </li>
            {products.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/products/${p.slug}`}
                  className="block py-2 text-muted hover:text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  {p.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
