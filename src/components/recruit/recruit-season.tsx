import Image from "next/image";
import { SEASON_PRIZES, SEASON_RULES } from "@/data/recruit";

export function RecruitSeason() {
  return (
    <section
      id="temporada"
      className="scroll-mt-8 border-t border-[var(--border)] bg-[var(--graphite)] px-6 py-20 md:py-28"
      aria-labelledby="season-heading"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
          {SEASON_RULES.periodLabel}
        </p>
        <h2
          id="season-heading"
          className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-[var(--ivory)] md:text-4xl"
        >
          O topo do faturamento leva a temporada.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--muted)] md:text-base">
          {SEASON_RULES.summary}
        </p>
        <p className="mt-2 text-xs text-[var(--silver)]">
          Métrica: {SEASON_RULES.metricLabel} · Ranking 1º · 2º · 3º
        </p>

        <ol className="mt-14 space-y-8 md:space-y-10">
          {SEASON_PRIZES.map((prize) => (
            <li
              key={prize.place}
              className="group relative overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--carbon)]"
            >
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[320px]">
                  <Image
                    src={prize.image}
                    alt={prize.imageAlt}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/20"
                    aria-hidden
                  />
                </div>
                <div className="flex flex-col justify-center space-y-4 p-6 sm:p-8 md:p-10">
                  <span className="text-xs tracking-[0.2em] text-[var(--accent)]">
                    {prize.label}
                  </span>
                  <h3 className="text-2xl font-semibold tracking-tight text-[var(--ivory)] md:text-3xl">
                    {prize.title}
                  </h3>
                  <p className="max-w-md text-sm leading-relaxed text-[var(--muted)]">
                    {prize.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-10 text-xs leading-relaxed text-[var(--muted)]">
          {SEASON_RULES.disclaimer}
        </p>
      </div>
    </section>
  );
}
