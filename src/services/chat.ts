import type { ChatMessage } from "@/types";
import { generateId } from "@/lib/utils";

const EXTERNAL_LINK =
  /(https?:\/\/|www\.|whatsapp|wa\.me|t\.me|telegram)/i;

export function createSystemMessage(
  bookingId: string,
  text: string,
): ChatMessage {
  return {
    id: generateId("msg"),
    bookingId,
    sender: "system",
    text,
    createdAt: new Date().toISOString(),
  };
}

export function createInitialChat(bookingId: string): ChatMessage[] {
  return [
    createSystemMessage(
      bookingId,
      "Reserva confirmada. O chat privado está liberado.",
    ),
    {
      id: generateId("msg"),
      bookingId,
      sender: "provider",
      text: "Olá! Recebi a confirmação. Vamos alinhar os detalhes com calma.",
      createdAt: new Date(Date.now() + 1000).toISOString(),
    },
  ];
}

export function sanitizeOutboundMessage(text: string): {
  text: string;
  blocked: boolean;
} {
  if (EXTERNAL_LINK.test(text)) {
    return {
      text: "Links externos não são permitidos neste chat por privacidade e segurança.",
      blocked: true,
    };
  }
  return { text: text.trim(), blocked: false };
}

export function createClientMessage(
  bookingId: string,
  text: string,
): ChatMessage {
  const { text: safe, blocked } = sanitizeOutboundMessage(text);
  return {
    id: generateId("msg"),
    bookingId,
    sender: blocked ? "system" : "client",
    text: safe,
    createdAt: new Date().toISOString(),
    blocked,
  };
}

export const CHAT_SHORTCUTS = [
  { id: "horario", label: "Confirmar horário", text: "Confirmo o horário combinado." },
  { id: "regiao", label: "Compartilhar região", text: "Posso compartilhar a região aproximada do encontro." },
  { id: "chegada", label: "Informar chegada", text: "Estou a caminho / chegando na região." },
  { id: "reagendar", label: "Preciso reagendar", text: "Preciso reagendar. Podemos alinhar outro horário?" },
  { id: "suporte", label: "Falar com o suporte", text: "Gostaria de falar com o suporte da VORA." },
] as const;
