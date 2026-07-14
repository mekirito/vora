"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { statusLabel } from "@/lib/booking-state";
import type { Booking, BookingStatus } from "@/types";
import { formatCurrency } from "@/lib/utils";

const STEPS: BookingStatus[] = [
  "REQUESTED",
  "ACCEPTED",
  "AWAITING_PAYMENT",
  "CONFIRMED",
  "CHECK_IN_REQUIRED",
  "IN_PROGRESS",
  "COMPLETED",
];

function stepIndex(status: BookingStatus): number {
  const map: Partial<Record<BookingStatus, number>> = {
    DRAFT: 0,
    REQUESTED: 0,
    VIEWED: 0,
    ACCEPTED: 1,
    REJECTED: -1,
    EXPIRED: -1,
    AWAITING_PAYMENT: 2,
    PAYMENT_PROCESSING: 2,
    CONFIRMED: 3,
    CHECK_IN_REQUIRED: 4,
    IN_PROGRESS: 5,
    CLIENT_FINISHED: 5,
    PROVIDER_FINISHED: 5,
    COMPLETION_PENDING: 5,
    COMPLETED: 6,
    CANCELED: -1,
    DISPUTED: 5,
    UNDER_REVIEW: 5,
  };
  return map[status] ?? 0;
}

interface BookingStatusTrackerProps {
  booking: Booking;
  className?: string;
}

export function BookingStatusTracker({ booking, className }: BookingStatusTrackerProps) {
  const current = stepIndex(booking.status);
  const terminal = ["REJECTED", "EXPIRED", "CANCELED"].includes(booking.status);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[var(--muted)]">Status</p>
          <p className="text-lg font-medium">{statusLabel(booking.status)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--muted)]">Valor</p>
          <p className="font-medium">{formatCurrency(booking.price)}</p>
        </div>
      </div>

      {!terminal && current >= 0 ? (
        <ol className="flex items-center gap-1" aria-label="Progresso da reserva">
          {STEPS.map((step, i) => (
            <li
              key={step}
              className={cn(
                "h-1.5 flex-1 rounded-full",
                i <= current ? "bg-[var(--accent)]" : "bg-[var(--border)]",
              )}
              aria-hidden="true"
            />
          ))}
        </ol>
      ) : null}

      {booking.responseDeadline &&
      ["REQUESTED", "VIEWED"].includes(booking.status) ? (
        <ResponseTimer deadline={booking.responseDeadline} label="Resposta da profissional" />
      ) : null}

      {booking.paymentDeadline && booking.status === "AWAITING_PAYMENT" ? (
        <ResponseTimer deadline={booking.paymentDeadline} label="Prazo para pagamento" />
      ) : null}
    </div>
  );
}

function ResponseTimer({ deadline, label }: { deadline: string; label: string }) {
  const [remaining, setRemaining] = useState(() =>
    new Date(deadline).getTime() - Date.now(),
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      setRemaining(new Date(deadline).getTime() - Date.now());
    }, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  const mins = Math.max(0, Math.floor(remaining / 60000));
  const secs = Math.max(0, Math.floor((remaining % 60000) / 1000));

  return (
    <p className="text-sm text-[var(--muted)]" role="timer">
      {label}:{" "}
      <span className="font-mono text-[var(--ivory)]">
        {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
      </span>
    </p>
  );
}
