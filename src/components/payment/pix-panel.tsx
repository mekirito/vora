"use client";

import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatTimeRemaining } from "@/lib/utils";
import type { PaymentSimulation } from "@/types";
import { useVoraStore } from "@/stores/vora-store";
import { toast } from "sonner";
import { motion, useReducedMotion } from "motion/react";

interface PixPanelProps {
  payment: PaymentSimulation;
  onApproved?: () => void;
}

function QrPattern({ seed }: { seed: string }) {
  const size = 200;
  const cells = 21;
  const cellSize = size / cells;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  const rects = [];
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      const isCorner =
        (x < 7 && y < 7) ||
        (x >= cells - 7 && y < 7) ||
        (x < 7 && y >= cells - 7);
      const isFinder =
        isCorner &&
        (x === 0 ||
          x === 6 ||
          y === 0 ||
          y === 6 ||
          x === cells - 7 ||
          x === cells - 1 ||
          y === cells - 7 ||
          y === cells - 1 ||
          (x >= 2 && x <= 4 && y >= 2 && y <= 4) ||
          (x >= cells - 5 && x <= cells - 3 && y >= 2 && y <= 4) ||
          (x >= 2 && x <= 4 && y >= cells - 5 && y <= cells - 3));
      const pseudo = ((hash + x * 17 + y * 31) >>> 0) % 100;
      const filled = isFinder || pseudo > 42;
      if (filled) {
        rects.push(
          <rect
            key={`${x}-${y}`}
            x={x * cellSize}
            y={y * cellSize}
            width={cellSize}
            height={cellSize}
            fill="#0A0A0A"
          />,
        );
      }
    }
  }

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="h-48 w-48 rounded-[16px] bg-white p-2"
      aria-label="QR Code Pix simulado"
    >
      {rects}
    </svg>
  );
}

export function PixPanel({ payment, onApproved }: PixPanelProps) {
  const reduce = useReducedMotion();
  const demoPaymentApproved = useVoraStore((s) => s.demoPaymentApproved);
  const [copied, setCopied] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [celebrate, setCelebrate] = useState(payment.status === "approved");

  useEffect(() => {
    const tick = () => {
      setRemaining(new Date(payment.expiresAt).getTime() - Date.now());
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [payment.expiresAt]);

  const copyCode = async () => {
    await navigator.clipboard.writeText(payment.pixCode);
    setCopied(true);
    toast.message("Código Pix copiado");
    setTimeout(() => setCopied(false), 2000);
  };

  const approve = async () => {
    await demoPaymentApproved(payment.bookingId);
    setCelebrate(true);
    toast.success("Pagamento aprovado!");
    onApproved?.();
  };

  return (
    <div className="space-y-6">
      {celebrate ? (
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[20px] border border-[var(--accent)]/30 bg-[var(--accent)]/10 p-6 text-center"
        >
          <p className="text-lg font-medium text-[var(--ivory)]">Pagamento confirmado</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Reserva confirmada. Chat e check-in liberados.
          </p>
        </motion.div>
      ) : (
        <>
          <div className="flex flex-col items-center gap-4">
            <QrPattern seed={payment.qrSeed} />
            <p className="text-xs text-[var(--muted)]">Escaneie ou copie o código Pix</p>
          </div>

          <div className="rounded-[20px] border border-[var(--border)] bg-[var(--graphite)] p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted)]">Valor</span>
              <span className="font-medium">{formatCurrency(payment.amount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted)]">Recebedor</span>
              <span>{payment.receiver}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted)]">Expira em</span>
              <span className="font-mono">{formatTimeRemaining(remaining)}</span>
            </div>
          </div>

          <div className="rounded-[16px] border border-[var(--border)] bg-[var(--card)] p-3">
            <p className="break-all text-[11px] text-[var(--muted)] font-mono">
              {payment.pixCode}
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-3 w-full"
              onClick={() => void copyCode()}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              Copiar código Pix
            </Button>
          </div>

          {process.env.NODE_ENV === "development" ? (
            <Button onClick={() => void approve()} className="w-full">
              Simular pagamento aprovado
            </Button>
          ) : null}
        </>
      )}
    </div>
  );
}
