"use client";

import Link from "next/link";
import Image from "next/image";
import { useVoraStore } from "@/stores/vora-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { isActiveBooking } from "@/lib/booking-state";
import { statusLabel } from "@/lib/booking-state";
import { formatCurrency } from "@/lib/utils";

export default function ReservasPage() {
  const hydrated = useHydrated();
  const bookings = useVoraStore((s) => s.bookings);

  if (!hydrated) {
    return <div className="mx-auto max-w-2xl px-4 py-12 skeleton h-40 rounded-[24px]" />;
  }

  const active = bookings.filter((b) => isActiveBooking(b.status));
  const history = bookings.filter((b) => !isActiveBooking(b.status));

  if (!bookings.length) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-semibold">Reservas</h1>
        <EmptyState
          title="Nenhuma reserva ainda"
          description="Quando você solicitar um encontro, ele aparecerá aqui."
          action={
            <Link href="/descobrir">
              <Button>Descobrir</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-8">
      <h1 className="text-2xl font-semibold">Reservas</h1>

      {active.length > 0 ? (
        <section>
          <h2 className="mb-3 text-sm font-medium text-[var(--muted)]">Ativas</h2>
          <ul className="space-y-3">
            {active.map((b) => (
              <BookingRow key={b.id} {...b} />
            ))}
          </ul>
        </section>
      ) : null}

      {history.length > 0 ? (
        <section>
          <h2 className="mb-3 text-sm font-medium text-[var(--muted)]">Histórico</h2>
          <ul className="space-y-3">
            {history.map((b) => (
              <BookingRow key={b.id} {...b} muted />
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function BookingRow({
  id,
  profileName,
  profileImage,
  status,
  date,
  time,
  price,
  muted,
}: {
  id: string;
  profileName: string;
  profileImage: string;
  status: Parameters<typeof statusLabel>[0];
  date: string;
  time: string;
  price: number;
  muted?: boolean;
}) {
  return (
    <li>
      <Link
        href={`/reserva/${id}`}
        className={`flex items-center gap-4 rounded-[20px] border border-[var(--border)] p-4 transition hover:bg-[var(--graphite)] ${
          muted ? "opacity-70" : "bg-[var(--graphite)]"
        }`}
      >
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[12px]">
          <Image src={profileImage} alt="" fill className="object-cover" sizes="56px" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium">{profileName}</p>
          <p className="text-xs text-[var(--muted)]">
            {date} · {time} · {statusLabel(status)}
          </p>
        </div>
        <span className="text-sm">{formatCurrency(price)}</span>
      </Link>
    </li>
  );
}
