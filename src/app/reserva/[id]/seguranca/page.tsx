"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useVoraStore } from "@/stores/vora-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { SafetyCenter } from "@/components/safety/safety-center";
import { hasSafetyCenter } from "@/lib/booking-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export default function SegurancaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const hydrated = useHydrated();
  const [id, setId] = useState<string | null>(null);
  const getBooking = useVoraStore((s) => s.getBooking);

  useEffect(() => {
    void params.then((p) => setId(p.id));
  }, [params]);

  const booking = id ? getBooking(id) : undefined;

  if (!hydrated || !id) {
    return <div className="mx-auto max-w-2xl px-4 py-12 skeleton h-64 rounded-[24px]" />;
  }

  if (!booking) notFound();

  if (!hasSafetyCenter(booking.status)) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <EmptyState
          title="Central indisponível"
          description="A central de segurança abre após a confirmação da reserva."
          action={
            <Link href={`/reserva/${id}`}>
              <Button variant="secondary">Voltar</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Link
        href={`/reserva/${id}`}
        className="mb-6 inline-flex touch-target items-center gap-2 text-sm text-[var(--muted)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Reserva
      </Link>
      <h1 className="text-xl font-semibold">Central de segurança</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Suporte e ferramentas para o encontro com {booking.profileName}.
      </p>
      <div className="mt-6">
        <SafetyCenter bookingId={id} checkIn={booking.checkIn} />
      </div>
    </div>
  );
}
