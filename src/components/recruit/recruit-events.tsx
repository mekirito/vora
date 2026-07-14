import { EVENT_INTRO, EVENT_PERKS } from "@/data/recruit";

export function RecruitEvents() {
  return (
    <section
      id="eventos"
      className="scroll-mt-8 border-t border-[var(--border)] bg-[var(--graphite)] px-6 py-20 md:py-28"
      aria-labelledby="events-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16 lg:items-end">
          <div className="space-y-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
              {EVENT_INTRO.eyebrow}
            </p>
            <h2
              id="events-heading"
              className="max-w-xl text-3xl font-semibold tracking-tight text-[var(--ivory)] md:text-4xl"
            >
              {EVENT_INTRO.title}
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-[var(--muted)] md:text-base">
              {EVENT_INTRO.body}
            </p>
          </div>

          <aside className="rounded-[24px] border border-[var(--border)] bg-[var(--carbon)]/80 p-6 md:p-7">
            <p className="text-xs tracking-[0.14em] text-[var(--silver)] uppercase">
              Circuito VORA
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
              <li>Galas e noites formais</li>
              <li>Arte, estreias e cultura</li>
              <li>Corporativos com discrição</li>
              <li>Nightlife selecionado</li>
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-[var(--muted)]">
              Tudo com pagamento confirmado antes — inclusive em eventos.
            </p>
          </aside>
        </div>

        <ul className="mt-14 grid gap-10 sm:grid-cols-2 lg:gap-x-16 lg:gap-y-12">
          {EVENT_PERKS.map((perk) => (
            <li
              key={perk.title}
              className="space-y-2 border-t border-[var(--border)] pt-6"
            >
              <h3 className="text-base font-medium text-[var(--ivory)]">
                {perk.title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--muted)]">
                {perk.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
