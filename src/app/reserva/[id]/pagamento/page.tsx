"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useVoraStore } from "@/stores/vora-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { PixPanel } from "@/components/payment/pix-panel";

export default function PagamentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const hydrated = useHydrated();
  const [id, setId] = useState<string | null>(null);
  const getBooking = useVoraStore((s) => s.getBooking);
  const payments = useVoraStore((s) => s.payments);

  useEffect(() => {
    void params.then((p) => setId(p.id));
  }, [params]);

  const booking = id ? getBooking(id) : undefined;
  const payment = id ? payments[id] : undefined;

  if (!hydrated || !id) {
    return <div className="mx-auto max-w-md px-4 py-12 skeleton h-64 rounded-[24px]" />;
  }

  if (!booking) notFound();

  if (!payment) {
    return (
      <div className="mx-auto max-w-md px-4 py-8 text-center">
        <p className="text-sm text-[var(--muted)]">
          Pagamento ainda não disponível. Aguarde a aceitação da solicitação.
        </p>
        <Link href={`/reserva/${id}`} className="mt-4 inline-block text-sm text-[var(--accent)]">
          Voltar à reserva
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <Link
        href={`/reserva/${id}`}
        className="mb-6 inline-flex touch-target items-center gap-2 text-sm text-[var(--muted)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Reserva
      </Link>
      <h1 className="text-xl font-semibold">Pagamento Pix</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Simulação — nenhum valor real será cobrado.
      </p>
      <div className="mt-6">
        <PixPanel
          payment={payment}
          onApproved={() => router.push(`/reserva/${id}`)}
        />
      </div>
    </div>
  );
}
