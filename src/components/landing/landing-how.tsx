const STEPS = [
  {
    n: "01",
    title: "Descreva o momento",
    body: "Diga o que você procura em linguagem natural. A VORA transforma isso em preferências claras.",
  },
  {
    n: "02",
    title: "Curadoria silenciosa",
    body: "Cruzamos disponibilidade, distância e compatibilidade — sem catálogo infinito.",
  },
  {
    n: "03",
    title: "Uma opção por vez",
    body: "Solicite o encontro, confirme o Pix simulado e converse com privacidade.",
  },
] as const;

export function LandingHow() {
  return (
    <section
      id="como-funciona"
      className="scroll-mt-8 border-t border-[var(--border)] bg-[var(--carbon)] px-6 py-20 md:py-28"
      aria-labelledby="how-heading"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
          Concierge
        </p>
        <h2
          id="how-heading"
          className="mt-3 max-w-lg text-3xl font-semibold tracking-tight text-[var(--ivory)] md:text-4xl"
        >
          Uma opção por vez. Sem catálogo, sem ruído.
        </h2>

        <ol className="mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
          {STEPS.map((step) => (
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
