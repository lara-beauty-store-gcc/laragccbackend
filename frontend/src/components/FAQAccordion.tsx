'use client';

import { useState } from 'react';
import { getFaqs } from '@/lib/marketing';
import type { ProductConfig } from '@/config/products';
import { IconPlus } from './icons';

export function FAQAccordion({ product }: { product?: ProductConfig }) {
  const faqs = getFaqs(product);
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="px-4 py-10">
      <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-accent">
        FAQ
      </p>
      <h2 className="mt-2 text-center font-arabic text-xl font-bold text-primary">
        أسئلة قبل الطلب
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-center text-sm text-muted">
        كل شي تحتاجين تعرفينه قبل الدفع عند الاستلام.
      </p>

      <div className="mt-8 space-y-2">
        {faqs.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div
              key={faq.q}
              className="overflow-hidden rounded-xl border border-border bg-card"
            >
              <button
                type="button"
                className="flex w-full items-center gap-3 px-4 py-4 text-right"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition ${
                    isOpen ? 'rotate-45' : ''
                  }`}
                >
                  <IconPlus className="h-4 w-4" />
                </span>
                <span className="flex-1 font-arabic text-sm font-semibold text-primary">
                  {faq.q}
                </span>
              </button>
              {isOpen && (
                <div className="border-t border-border px-4 pb-4 pt-2">
                  <p className="text-sm leading-relaxed text-muted">{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
