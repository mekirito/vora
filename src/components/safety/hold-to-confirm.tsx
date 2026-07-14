"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "motion/react";

interface HoldToConfirmProps {
  label: string;
  onConfirm: () => void;
  holdMs?: number;
  className?: string;
  tone?: "default" | "urgent";
}

export function HoldToConfirm({
  label,
  onConfirm,
  holdMs = 2000,
  className,
  tone = "default",
}: HoldToConfirmProps) {
  const reduce = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const timerRef = useRef<number | null>(null);
  const startRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const clear = useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    timerRef.current = null;
    rafRef.current = null;
    setHolding(false);
    setProgress(0);
  }, []);

  const tick = useCallback(() => {
    const elapsed = Date.now() - startRef.current;
    const pct = Math.min(100, (elapsed / holdMs) * 100);
    setProgress(pct);
    if (pct < 100) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [holdMs]);

  const startHold = () => {
    if (reduce) {
      onConfirm();
      return;
    }
    setHolding(true);
    startRef.current = Date.now();
    rafRef.current = requestAnimationFrame(tick);
    timerRef.current = window.setTimeout(() => {
      clear();
      onConfirm();
    }, holdMs);
  };

  return (
    <button
      type="button"
      className={cn(
        "relative touch-target w-full overflow-hidden rounded-[16px] border px-4 py-3 text-sm font-medium transition-colors",
        tone === "urgent"
          ? "border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent)]"
          : "border-[var(--border)] bg-[var(--card-elevated)] text-[var(--ivory)]",
        className,
      )}
      onPointerDown={startHold}
      onPointerUp={clear}
      onPointerLeave={clear}
      onPointerCancel={clear}
      aria-label={reduce ? label : `${label}. Pressione e segure por 2 segundos.`}
    >
      <span
        className="absolute inset-y-0 left-0 bg-[var(--accent)]/25 transition-none"
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />
      <span className="relative">
        {holding && !reduce ? "Segure…" : label}
      </span>
    </button>
  );
}
