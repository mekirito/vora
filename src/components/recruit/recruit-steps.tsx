import { RECRUIT_STEPS } from "@/data/recruit";

export function RecruitSteps() {
  return (
    <section
      className="border-t border-[var(--border)] bg-[var(--graphite)] px-6 py-20 md:py-28"
      aria-labelledby="steps-heading"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
          Como entrar
        </p>
        <h2
          id="steps-heading"
          className="mt-3 max-w-lg text-3xl font-semibold tracking-tight text-[var(--ivory)] md:text-4xl"
        >
          Da candidatura à temporada.
        </h2>

        <ol className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {RECRUIT_STEPS.map((step) => (
            <li key={step.n} className="space-y-3">
              <span className="text-xs tracking-[0.2em] text-[var(--accent)]">
                {step.n}
              </span>
              <h3 className="text-xl font-medium tracking-tight text-[var(--ivory)]">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--muted)]">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
