"use client";

import { useVoraStore } from "@/stores/vora-store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const isDev = process.env.NODE_ENV === "development";

export function DemoPanel({ bookingId }: { bookingId: string }) {
  const {
    demoProviderViewed,
    demoProviderAccepted,
    demoProviderRejected,
    demoPaymentApproved,
    demoProviderFinished,
    demoOpenDispute,
    getBooking,
  } = useVoraStore();

  if (!isDev) return null;

  const booking = getBooking(bookingId);
  if (!booking) return null;

  const actions = [
    {
      label: "Profissional visualizou",
      run: () => {
        demoProviderViewed(bookingId);
        toast.message("Profissional visualizou a solicitação");
      },
    },
    {
      label: "Profissional aceitou",
      run: async () => {
        await demoProviderAccepted(bookingId);
        toast.success("Solicitação aceita — Pix liberado");
      },
    },
    {
      label: "Profissional recusou",
      run: () => {
        demoProviderRejected(bookingId);
        toast.message("Solicitação recusada");
      },
    },
    {
      label: "Pagamento aprovado",
      run: async () => {
        await demoPaymentApproved(bookingId);
        toast.success("Pagamento aprovado — chat liberado");
      },
    },
    {
      label: "Profissional confirmou encerramento",
      run: () => {
        demoProviderFinished(bookingId);
        toast.message("Outra parte confirmou o encerramento");
      },
    },
    {
      label: "Abrir divergência",
      run: () => {
        demoOpenDispute(bookingId);
        toast.message("Reserva encaminhada para análise");
      },
    },
  ];

  return (
    <aside className="mt-8 rounded-[20px] border border-dashed border-[var(--border)] bg-[var(--graphite)] p-4">
      <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">
        Modo demo · apenas desenvolvimento
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {actions.map((a) => (
          <Button
            key={a.label}
            size="sm"
            variant="secondary"
            onClick={() => void a.run()}
          >
            {a.label}
          </Button>
        ))}
      </div>
    </aside>
  );
}
