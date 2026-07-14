"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { ArrowLeft, MessageCircle, CreditCard, Shield } from "lucide-react";
import { useVoraStore } from "@/stores/vora-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { BookingStatusTracker } from "@/components/booking/booking-status";
import { CheckInPanel } from "@/components/booking/check-in";
import { ReviewForm } from "@/components/booking/review-form";
import { DemoPanel } from "@/components/booking/demo-panel";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  hasChatAccess,
  hasSafetyCenter,
} from "@/lib/booking-state";
import { formatTimeRemaining } from "@/lib/utils";
import { toast } from "sonner";

export default function ReservaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const hydrated = useHydrated();
  const [id, setId] = useState<string | null>(null);
  const [finishOpen, setFinishOpen] = useState(false);
  const [problemOpen, setProblemOpen] = useState(false);
  const [problemReason, setProblemReason] = useState("");
  const getBooking = useVoraStore((s) => s.getBooking);
  const clientFinish = useVoraStore((s) => s.clientFinish);
  const cancelBooking = useVoraStore((s) => s.cancelBooking);

  useEffect(() => {
    void params.then((p) => setId(p.id));
  }, [params]);

  const booking = id ? getBooking(id) : undefined;
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!booking?.startedAt || booking.status !== "IN_PROGRESS") return;
    const start = new Date(booking.startedAt).getTime();
    const tick = () => setElapsed(Date.now() - start);
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [booking?.startedAt, booking?.status]);

  if (!hydrated || !id) {
    return <div className="mx-auto max-w-2xl px-4 py-12 skeleton h-64 rounded-[24px]" />;
  }

  if (!booking) notFound();

  const showPayment = ["AWAITING_PAYMENT", "PAYMENT_PROCESSING"].includes(
    booking.status,
  );
  const showChat = hasChatAccess(booking.status);
  const showSafety = hasSafetyCenter(booking.status);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 pb-12">
      <Link
        href="/reservas"
        className="mb-6 inline-flex touch-target items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--ivory)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Reservas
      </Link>

      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-[16px]">
          <Image
            src={booking.profileImage}
            alt=""
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
        <div>
          <h1 className="text-xl font-semibold">{booking.profileName}</h1>
          <p className="text-sm text-[var(--muted)]">
            {booking.date} · {booking.time} · {booking.duration} min
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-[20px] border border-[var(--border)] bg-[var(--graphite)] p-5">
        <BookingStatusTracker booking={booking} />
      </div>

      {booking.status === "IN_PROGRESS" && booking.startedAt ? (
        <div className="mt-4 rounded-[16px] border border-[var(--accent)]/30 bg-[var(--accent)]/10 p-4 text-center">
          <p className="text-xs text-[var(--muted)]">Encontro em andamento</p>
          <p className="mt-1 font-mono text-2xl">{formatTimeRemaining(elapsed)}</p>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {showPayment ? (
          <Link href={`/reserva/${booking.id}/pagamento`}>
            <Button variant="primary" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Pagamento
            </Button>
          </Link>
        ) : null}
        {showChat ? (
          <Link href={`/reserva/${booking.id}/chat`}>
            <Button variant="secondary" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat
            </Button>
          </Link>
        ) : null}
        {showSafety ? (
          <Link href={`/reserva/${booking.id}/seguranca`}>
            <Button variant="secondary" className="gap-2">
              <Shield className="h-4 w-4" />
              Segurança
            </Button>
          </Link>
        ) : null}
      </div>

      {booking.status === "CHECK_IN_REQUIRED" ? (
        <div className="mt-6">
          <CheckInPanel booking={booking} />
        </div>
      ) : null}

      {["IN_PROGRESS", "PROVIDER_FINISHED"].includes(booking.status) ? (
        <div className="mt-6 space-y-2">
          <Button className="w-full" onClick={() => setFinishOpen(true)}>
            Encerrar encontro
          </Button>
          <Button
            variant="ghost"
            className="w-full text-[var(--accent)]"
            onClick={() => setProblemOpen(true)}
          >
            Reportar problema
          </Button>
        </div>
      ) : null}

      {booking.status === "CLIENT_FINISHED" ? (
        <p className="mt-6 text-sm text-[var(--muted)]" role="status">
          Você confirmou o encerramento. Aguardando confirmação da outra parte.
        </p>
      ) : null}

      {booking.status === "COMPLETED" ? (
        <div className="mt-6">
          <ReviewForm bookingId={booking.id} />
        </div>
      ) : null}

      {["REQUESTED", "VIEWED"].includes(booking.status) ? (
        <Button
          variant="ghost"
          className="mt-6 w-full"
          onClick={() => {
            cancelBooking(booking.id);
            toast.message("Reserva cancelada");
            router.push("/reservas");
          }}
        >
          Cancelar solicitação
        </Button>
      ) : null}

      <DemoPanel bookingId={booking.id} />

      <Dialog
        open={finishOpen}
        onClose={() => setFinishOpen(false)}
        title="Encerrar encontro?"
        description="Confirme que o encontro foi concluído conforme combinado."
        confirmLabel="Confirmar encerramento"
        onConfirm={() => {
          clientFinish(booking.id, false);
          toast.success("Encerramento registrado");
        }}
      />

      <Dialog
        open={problemOpen}
        onClose={() => setProblemOpen(false)}
        title="Reportar problema"
        description="Descreva brevemente o que ocorreu. O suporte será acionado na simulação."
        confirmLabel="Enviar"
        tone="danger"
        onConfirm={() => {
          clientFinish(booking.id, true, problemReason || "Problema reportado");
          toast.message("Divergência registrada");
        }}
      >
        <textarea
          value={problemReason}
          onChange={(e) => setProblemReason(e.target.value)}
          className="mt-4 w-full rounded-[16px] border border-[var(--border)] bg-[var(--card)] p-3 text-sm"
          placeholder="O que aconteceu?"
          rows={3}
        />
      </Dialog>
    </div>
  );
}
