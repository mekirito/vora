"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useVoraStore } from "@/stores/vora-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { ChatPanel } from "@/components/chat/chat-panel";
import { hasChatAccess } from "@/lib/booking-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export default function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const hydrated = useHydrated();
  const [id, setId] = useState<string | null>(null);
  const getBooking = useVoraStore((s) => s.getBooking);
  const chats = useVoraStore((s) => s.chats);

  useEffect(() => {
    void params.then((p) => setId(p.id));
  }, [params]);

  const booking = id ? getBooking(id) : undefined;
  const messages = id ? chats[id] ?? [] : [];

  if (!hydrated || !id) {
    return <div className="mx-auto max-w-2xl px-4 py-12 skeleton h-64 rounded-[24px]" />;
  }

  if (!booking) notFound();

  if (!hasChatAccess(booking.status)) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <EmptyState
          title="Chat indisponível"
          description="O chat é liberado após a confirmação do pagamento."
          action={
            <Link href={`/reserva/${id}`}>
              <Button variant="secondary">Voltar à reserva</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-2xl flex-col px-4 py-6">
      <Link
        href={`/reserva/${id}`}
        className="mb-4 inline-flex touch-target items-center gap-2 text-sm text-[var(--muted)]"
      >
        <ArrowLeft className="h-4 w-4" />
        {booking.profileName}
      </Link>
      <h1 className="mb-4 text-lg font-medium">Chat privado</h1>
      <ChatPanel bookingId={id} messages={messages} />
    </div>
  );
}
