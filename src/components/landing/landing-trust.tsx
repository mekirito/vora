const POINTS = [
  {
    title: "Verificação",
    body: "Identidade e fotos verificadas como princípio da plataforma.",
  },
  {
    title: "Privacidade por padrão",
    body: "Você está no controle do que compartilha e de como navega.",
  },
  {
    title: "Segurança no encontro",
    body: "Central de suporte acessível durante a reserva confirmada.",
  },
  {
    title: "Respeito na curadoria",
    body: "Sem filtros raciais. Sem avaliações de aparência.",
  },
] as const;

export function LandingTrust() {
  return (
    <section
      className="border-t border-[var(--border)] bg-[var(--graphite)] px-6 py-20 md:py-28"
      aria-labelledby="trust-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
            Confiança
          </p>
          <h2
            id="trust-heading"
            className="text-3xl font-semibold tracking-tight text-[var(--ivory)] md:text-4xl"
          >
            Segurança sem burocracia.
          </h2>
          <p className="text-sm leading-relaxed text-[var(--muted)] md:text-base">
            A VORA fala de forma direta, discreta e humana. Tecnologia silenciosa
            a serviço da presença — não do ruído.
          </p>
        </div>

        <ul className="mt-14 grid gap-10 sm:grid-cols-2 lg:gap-x-16 lg:gap-y-12">
          {POINTS.map((point) => (
            <li key={point.title} className="space-y-2 border-t border-[var(--border)] pt-6">
              <h3 className="text-base font-medium text-[var(--ivory)]">
                {point.title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--muted)]">
                {point.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
