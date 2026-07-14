"use client";

import { Button } from "@/components/ui/button";
import { useVoraStore } from "@/stores/vora-store";
import { isCheckInComplete } from "@/services/bookings";
import type { Booking } from "@/types";
import { CheckCircle2, Circle } from "lucide-react";

const ITEMS = [
  { key: "timeConfirmed" as const, label: "Horário e duração confirmados" },
  { key: "regionConfirmed" as const, label: "Região do encontro confirmada" },
  { key: "trustedContact" as const, label: "Contato de confiança informado (opcional)" },
  { key: "safetyCodeCreated" as const, label: "Código de segurança criado" },
  { key: "rulesAccepted" as const, label: "Regras da plataforma aceitas" },
  { key: "supportAware" as const, label: "Sei como acionar o suporte" },
];

interface CheckInPanelProps {
  booking: Booking;
}

export function CheckInPanel({ booking }: CheckInPanelProps) {
  const updateBookingCheckIn = useVoraStore((s) => s.updateBookingCheckIn);
  const startEncounter = useVoraStore((s) => s.startEncounter);
  const complete = isCheckInComplete(booking.checkIn);

  const toggle = (key: keyof typeof booking.checkIn) => {
    updateBookingCheckIn(booking.id, { [key]: !booking.checkIn[key] });
  };

  return (
    <div className="space-y-4 rounded-[20px] border border-[var(--border)] bg-[var(--graphite)] p-5">
      <div>
        <h2 className="text-base font-medium">Check-in de segurança</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Confirme os itens antes de iniciar o encontro.
        </p>
      </div>

      <ul className="space-y-2">
        {ITEMS.map((item) => {
          const done = booking.checkIn[item.key];
          return (
            <li key={item.key}>
              <button
                type="button"
                onClick={() => toggle(item.key)}
                className="touch-target flex w-full items-center gap-3 rounded-[16px] border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-left text-sm transition hover:bg-[var(--card-elevated)]"
              >
                {done ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--accent)]" />
                ) : (
                  <Circle className="h-5 w-5 shrink-0 text-[var(--muted)]" />
                )}
                <span className={done ? "text-[var(--ivory)]" : "text-[var(--muted)]"}>
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {booking.safetyCode ? (
        <div className="rounded-[16px] border border-[var(--accent)]/30 bg-[var(--accent)]/10 p-4 text-center">
          <p className="text-xs text-[var(--muted)]">Seu código de segurança</p>
          <p className="mt-1 font-mono text-2xl tracking-[0.3em]">{booking.safetyCode}</p>
        </div>
      ) : null}

      <Button
        className="w-full"
        disabled={!complete}
        onClick={() => startEncounter(booking.id)}
      >
        Iniciar encontro
      </Button>
    </div>
  );
}
