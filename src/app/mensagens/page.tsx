"use client";

import Link from "next/link";
import Image from "next/image";
import { useVoraStore } from "@/stores/vora-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { hasChatAccess } from "@/lib/booking-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export default function MensagensPage() {
  const hydrated = useHydrated();
  const bookings = useVoraStore((s) => s.bookings);
  const chats = useVoraStore((s) => s.chats);

  if (!hydrated) {
    return <div className="mx-auto max-w-2xl px-4 py-12 skeleton h-40 rounded-[24px]" />;
  }

  const withChat = bookings.filter((b) => hasChatAccess(b.status));

  if (!withChat.length) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-semibold">Mensagens</h1>
        <EmptyState
          title="Nenhuma conversa"
          description="O chat é liberado após a confirmação do pagamento."
          action={
            <Link href="/reservas">
              <Button variant="secondary">Ver reservas</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Mensagens</h1>
      <ul className="mt-6 space-y-3">
        {withChat.map((b) => {
          const msgs = chats[b.id] ?? [];
          const last = msgs[msgs.length - 1];
          return (
            <li key={b.id}>
              <Link
                href={`/reserva/${b.id}/chat`}
                className="flex items-center gap-4 rounded-[20px] border border-[var(--border)] bg-[var(--graphite)] p-4 transition hover:bg-[var(--card-elevated)]"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[12px]">
                  <Image
                    src={b.profileImage}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{b.profileName}</p>
                  <p className="truncate text-xs text-[var(--muted)]">
                    {last?.text ?? "Chat liberado"}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
