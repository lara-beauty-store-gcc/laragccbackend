import { getWhyBrandCards } from '@/lib/marketing';
import { TrustIcon } from './icons';

export function WhyBrand() {
  const cards = getWhyBrandCards();
  const icons = ['shield', 'microscope', 'handshake'] as const;

  return (
    <section className="bg-surface px-4 py-10">
      <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-accent">
        WHY LARA BEAUTY
      </p>
      <h2 className="mt-2 text-center font-arabic text-xl font-bold text-primary">
        لارا مو متجر عادي — روتين يومي واضح
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-center text-sm text-muted">
        تركيبة، جرعة، ودفع عند الاستلام — كل شي مبين من البداية.
      </p>

      <div className="mt-8 space-y-4">
        {cards.map((card, i) => (
          <div
            key={card.title}
            className="rounded-2xl border border-border bg-card p-5 shadow-card"
          >
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-accent">
              <TrustIcon name={icons[i]} className="h-5 w-5" />
            </div>
            <h3 className="font-arabic text-base font-bold text-primary">{card.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{card.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
