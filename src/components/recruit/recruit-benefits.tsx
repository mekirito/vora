import { RECRUIT_BENEFITS } from "@/data/recruit";

export function RecruitBenefits() {
  return (
    <section
      id="vantagens"
      className="scroll-mt-8 border-t border-[var(--border)] bg-[var(--carbon)] px-6 py-20 md:py-28"
      aria-labelledby="benefits-heading"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
          Por que a VORA
        </p>
        <h2
          id="benefits-heading"
          className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-[var(--ivory)] md:text-4xl"
        >
          Capricho, confiança e presença.
        </h2>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--muted)] md:text-base">
          A vitrine é o produto. Trabalhamos para atrair profissionais alinhadas a
          uma linha premium — e clientes que respeitam o ritmo da curadoria.
        </p>

        <ul className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-12">
          {RECRUIT_BENEFITS.map((item) => (
            <li
              key={item.title}
              className="space-y-2 border-t border-[var(--border)] pt-6"
            >
              <h3 className="text-base font-medium text-[var(--ivory)]">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--muted)]">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
