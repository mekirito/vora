import Image from "next/image";
import { BILLBOARDS } from "@/data/recruit";
import { formatCurrency } from "@/lib/utils";

export function RecruitBillboards() {
  return (
    <section
      id="billboards"
      className="scroll-mt-8 border-t border-[var(--border)] bg-[var(--carbon)] px-6 py-20 md:py-28"
      aria-labelledby="billboards-heading"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
          Billboards
        </p>
        <h2
          id="billboards-heading"
          className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-[var(--ivory)] md:text-4xl"
        >
          Marcos de faturamento acumulado.
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--muted)] md:text-base">
          Diferente do ranking semestral, os billboards acompanham a sua carreira
          na VORA. Cada patamar abre reconhecimento e status na vitrine.
        </p>

        <ol className="mt-14 space-y-0">
          {BILLBOARDS.map((bb, index) => (
            <li
              key={bb.id}
              className="relative grid gap-6 border-t border-[var(--border)] py-10 md:grid-cols-[140px_1fr_auto] md:items-center md:gap-10"
            >
              <div className="space-y-1">
                <span className="text-[11px] tracking-[0.16em] text-[var(--accent)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-sm font-medium text-[var(--silver)]">
                  {bb.title}
                </p>
                <p className="text-2xl font-semibold tracking-tight text-[var(--ivory)]">
                  {bb.amountLabel}
                </p>
                <p className="sr-only">{formatCurrency(bb.amount)}</p>
              </div>

              <div className="max-w-md space-y-2">
                <h3 className="text-lg font-medium text-[var(--ivory)]">
                  {bb.reward}
                </h3>
                <p className="text-sm text-[var(--muted)]">
                  Desbloqueado ao atingir {bb.amountLabel} de faturamento
                  acumulado na plataforma.
                </p>
              </div>

              {bb.image ? (
                <div className="relative h-28 w-28 overflow-hidden rounded-[20px] border border-[var(--border)] md:h-32 md:w-32">
                  <Image
                    src={bb.image}
                    alt={bb.imageAlt ?? bb.reward}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
              ) : (
                <div
                  className="hidden h-32 w-32 items-center justify-center rounded-[20px] border border-[var(--border)] bg-[var(--graphite)] text-xs tracking-[0.14em] text-[var(--muted)] md:flex"
                  aria-hidden
                >
                  VORA
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
