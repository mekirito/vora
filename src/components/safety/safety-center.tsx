"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  EMERGENCY_NUMBERS,
  SAFETY_OPTIONS,
  getSafetyDisclaimer,
  notifySupport,
} from "@/services/safety";
import { HoldToConfirm } from "@/components/safety/hold-to-confirm";
import type { CheckInState } from "@/types";
import { CheckCircle2, Circle } from "lucide-react";

interface SafetyCenterProps {
  bookingId: string;
  checkIn?: CheckInState;
}

export function SafetyCenter({ bookingId, checkIn }: SafetyCenterProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleNotify = async (type: "help" | "risk") => {
    setLoading(type);
    const res = await notifySupport(bookingId, type);
    setLoading(null);
    if (res.ok) toast.message(res.message);
  };

  const checklist = checkIn
    ? [
        { label: "Horário confirmado", done: checkIn.timeConfirmed },
        { label: "Região confirmada", done: checkIn.regionConfirmed },
        { label: "Código de segurança", done: checkIn.safetyCodeCreated },
        { label: "Regras aceitas", done: checkIn.rulesAccepted },
        { label: "Suporte conhecido", done: checkIn.supportAware },
      ]
    : [];

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-[var(--ivory)]">Como podemos ajudar?</h2>
        {SAFETY_OPTIONS.map((opt) =>
          opt.id === "risk" ? (
            <HoldToConfirm
              key={opt.id}
              label={loading === "risk" ? "Registrando…" : opt.title}
              tone="urgent"
              onConfirm={() => void handleNotify("risk")}
            />
          ) : (
            <button
              key={opt.id}
              type="button"
              disabled={loading === "help"}
              onClick={() => void handleNotify("help")}
              className="touch-target w-full rounded-[16px] border border-[var(--border)] bg-[var(--card-elevated)] px-4 py-3 text-left text-sm transition hover:bg-[#292929] disabled:opacity-50"
            >
              <span className="font-medium">{opt.title}</span>
              <p className="mt-1 text-xs text-[var(--muted)]">{opt.description}</p>
            </button>
          ),
        )}
      </section>

      <section className="rounded-[20px] border border-[var(--border)] bg-[var(--graphite)] p-4">
        <h3 className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
          Emergência
        </h3>
        <div className="mt-3 flex flex-wrap gap-3">
          {EMERGENCY_NUMBERS.map((e) => (
            <a
              key={e.id}
              href={`tel:${e.number}`}
              className="touch-target inline-flex items-center gap-2 rounded-[16px] border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-2 text-sm font-medium text-[var(--accent)]"
            >
              {e.label}: {e.number}
            </a>
          ))}
        </div>
      </section>

      {checklist.length > 0 ? (
        <section className="rounded-[20px] border border-[var(--border)] bg-[var(--graphite)] p-4">
          <h3 className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
            Checklist de segurança
          </h3>
          <ul className="mt-3 space-y-2">
            {checklist.map((item) => (
              <li key={item.label} className="flex items-center gap-2 text-sm">
                {item.done ? (
                  <CheckCircle2 className="h-4 w-4 text-[var(--accent)]" />
                ) : (
                  <Circle className="h-4 w-4 text-[var(--muted)]" />
                )}
                <span className={item.done ? "text-[var(--ivory)]" : "text-[var(--muted)]"}>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="text-xs text-[var(--muted)]">{getSafetyDisclaimer()}</p>
    </div>
  );
}
