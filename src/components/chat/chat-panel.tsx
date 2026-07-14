"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CHAT_SHORTCUTS } from "@/services/chat";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import type { ChatMessage } from "@/types";
import { useVoraStore } from "@/stores/vora-store";
import { Shield } from "lucide-react";

interface ChatPanelProps {
  bookingId: string;
  messages: ChatMessage[];
}

export function ChatPanel({ bookingId, messages }: ChatPanelProps) {
  const sendChatMessage = useVoraStore((s) => s.sendChatMessage);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const send = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    sendChatMessage(bookingId, trimmed);
    setText("");
  };

  return (
    <div className="flex min-h-[60dvh] flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto pb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={
              msg.sender === "client"
                ? "ml-auto max-w-[85%] rounded-[16px] bg-[var(--accent)]/15 px-4 py-2 text-sm"
                : msg.sender === "system"
                  ? "mx-auto max-w-[90%] rounded-[16px] border border-[var(--border)] bg-[var(--graphite)] px-4 py-2 text-center text-xs text-[var(--muted)]"
                  : "mr-auto max-w-[85%] rounded-[16px] bg-[var(--card-elevated)] px-4 py-2 text-sm"
            }
          >
            {msg.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-[var(--border)] pt-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {CHAT_SHORTCUTS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => send(s.text)}
              className="touch-target rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--silver)] hover:border-white/20"
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Mensagem…"
            className="min-h-[48px] flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(text);
              }
            }}
          />
          <Button onClick={() => send(text)} className="self-end">
            Enviar
          </Button>
        </div>
        <Link
          href={`/reserva/${bookingId}/seguranca`}
          className="mt-3 inline-flex touch-target items-center gap-2 text-xs text-[var(--muted)] hover:text-[var(--ivory)]"
        >
          <Shield className="h-4 w-4" />
          Central de segurança
        </Link>
        <p className="mt-2 text-[10px] text-[var(--muted)]">
          Links externos são bloqueados por privacidade.
        </p>
      </div>
    </div>
  );
}
