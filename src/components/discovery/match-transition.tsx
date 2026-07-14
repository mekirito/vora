"use client";

import { OrbitLoader } from "@/components/brand/vora-logo";
import { useReducedMotion } from "motion/react";

export function MatchTransition() {
  const reduce = useReducedMotion();

  return (
    <div
      className="flex min-h-[420px] flex-col items-center justify-center rounded-[24px] border border-[var(--border)] bg-[var(--graphite)] px-6 py-16 text-center"
      role="status"
      aria-live="polite"
    >
      {!reduce ? <OrbitLoader /> : <div className="h-4 w-4 rounded-full bg-[var(--accent)]" />}
      <h2 className="mt-8 text-xl font-medium tracking-tight">Criando sua seleção</h2>
      <p className="mt-2 max-w-sm text-sm text-[var(--muted)]">
        Cruzando disponibilidade, distância e preferências.
      </p>
    </div>
  );
}
