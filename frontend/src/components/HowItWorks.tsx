import { getHowItWorksSteps } from '@/lib/marketing';

export function HowItWorks() {
  const steps = getHowItWorksSteps();

  return (
    <section className="bg-surface px-4 py-10">
      <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-accent">
        HOW IT WORKS
      </p>
      <h2 className="mt-2 text-center font-arabic text-xl font-bold text-primary">
        من الطلب لباب بيتك — 3 خطوات
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-center text-sm text-muted">
        بدون دفع أونلاين. بدون التزام. بدون مخاطرة.
      </p>

      <div className="mt-8 space-y-4">
        {steps.map((step) => (
          <div
            key={step.n}
            className="rounded-2xl border border-border bg-card p-5 shadow-card"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent bg-primary font-arabic text-lg font-bold text-accent">
              {step.n}
            </div>
            <h3 className="font-arabic text-base font-bold text-primary">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
