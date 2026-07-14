import Link from "next/link";

export function RecruitCta() {
  return (
    <section
      className="border-t border-[var(--border)] bg-[var(--graphite)] px-6 py-20 md:py-24"
      aria-labelledby="recruit-close-heading"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-lg space-y-3">
          <h2
            id="recruit-close-heading"
            className="text-3xl font-semibold tracking-tight text-[var(--ivory)] md:text-4xl"
          >
            A vitrine certa espera a presença certa.
          </h2>
          <p className="text-sm text-[var(--muted)] md:text-base">
            Você no controle. Curadoria. Temporada que recompensa o topo.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:items-end">
          <a
            href="#candidatura"
            className="inline-flex h-12 w-full items-center justify-center rounded-[16px] bg-[var(--accent)] px-6 text-base font-medium text-white transition-colors touch-target hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:w-auto"
          >
            Quero fazer parte
          </a>
          <Link
            href="/"
            className="text-center text-xs text-[var(--muted)] underline-offset-2 hover:underline sm:text-right"
          >
            Voltar à landing
          </Link>
        </div>
      </div>
    </section>
  );
}
