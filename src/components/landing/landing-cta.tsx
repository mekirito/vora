import Link from "next/link";

interface LandingCtaProps {
  primaryHref: string;
  primaryLabel: string;
}

export function LandingCta({ primaryHref, primaryLabel }: LandingCtaProps) {
  return (
    <section
      className="border-t border-[var(--border)] bg-[var(--carbon)] px-6 py-20 md:py-28"
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-lg space-y-3">
          <h2
            id="cta-heading"
            className="text-3xl font-semibold tracking-tight text-[var(--ivory)] md:text-4xl"
          >
            Pronto para a sua noite em Goiânia?
          </h2>
          <p className="text-sm text-[var(--muted)] md:text-base">
            Entre na experiência. Descreva o momento. A VORA encontra.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:items-end">
          <Link
            href={primaryHref}
            className="inline-flex h-12 w-full items-center justify-center rounded-[16px] bg-[var(--accent)] px-6 text-base font-medium text-white transition-colors touch-target hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] sm:w-auto"
          >
            {primaryLabel}
          </Link>
          <Link
            href="/trabalhe-conosco"
            className="text-center text-xs text-[var(--muted)] underline-offset-2 hover:text-[var(--ivory)] hover:underline sm:text-right"
          >
            Trabalhe conosco
          </Link>
          <p className="text-xs text-[var(--muted)] sm:text-right">
            Exclusivo para maiores de 18 anos.
          </p>
        </div>
      </div>
    </section>
  );
}
