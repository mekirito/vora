import type { BookingStatus } from "@/types";

const TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  DRAFT: ["REQUESTED", "CANCELED"],
  REQUESTED: ["VIEWED", "EXPIRED", "CANCELED", "ACCEPTED", "REJECTED"],
  VIEWED: ["ACCEPTED", "REJECTED", "EXPIRED", "CANCELED"],
  ACCEPTED: ["AWAITING_PAYMENT", "CANCELED"],
  REJECTED: [],
  EXPIRED: [],
  AWAITING_PAYMENT: ["PAYMENT_PROCESSING", "EXPIRED", "CANCELED"],
  PAYMENT_PROCESSING: ["CONFIRMED", "AWAITING_PAYMENT", "CANCELED"],
  CONFIRMED: ["CHECK_IN_REQUIRED", "CANCELED", "DISPUTED"],
  CHECK_IN_REQUIRED: ["IN_PROGRESS", "CANCELED", "DISPUTED"],
  IN_PROGRESS: [
    "CLIENT_FINISHED",
    "PROVIDER_FINISHED",
    "DISPUTED",
    "UNDER_REVIEW",
  ],
  CLIENT_FINISHED: [
    "COMPLETION_PENDING",
    "COMPLETED",
    "DISPUTED",
    "UNDER_REVIEW",
  ],
  PROVIDER_FINISHED: [
    "COMPLETION_PENDING",
    "COMPLETED",
    "DISPUTED",
    "UNDER_REVIEW",
  ],
  COMPLETION_PENDING: ["COMPLETED", "DISPUTED", "UNDER_REVIEW"],
  COMPLETED: [],
  CANCELED: [],
  DISPUTED: ["UNDER_REVIEW", "COMPLETED", "CANCELED"],
  UNDER_REVIEW: ["COMPLETED", "CANCELED", "DISPUTED"],
};

export function canTransition(
  from: BookingStatus,
  to: BookingStatus,
): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export function assertTransition(
  from: BookingStatus,
  to: BookingStatus,
): void {
  if (!canTransition(from, to)) {
    throw new Error(`Transição inválida: ${from} → ${to}`);
  }
}

export function statusLabel(status: BookingStatus): string {
  const labels: Record<BookingStatus, string> = {
    DRAFT: "Rascunho",
    REQUESTED: "Solicitada",
    VIEWED: "Visualizada",
    ACCEPTED: "Aceita",
    REJECTED: "Recusada",
    EXPIRED: "Expirada",
    AWAITING_PAYMENT: "Aguardando pagamento",
    PAYMENT_PROCESSING: "Confirmando pagamento",
    CONFIRMED: "Confirmada",
    CHECK_IN_REQUIRED: "Check-in pendente",
    IN_PROGRESS: "Em andamento",
    CLIENT_FINISHED: "Aguardando confirmação",
    PROVIDER_FINISHED: "Aguardando sua confirmação",
    COMPLETION_PENDING: "Confirmação pendente",
    COMPLETED: "Concluída",
    CANCELED: "Cancelada",
    DISPUTED: "Divergência",
    UNDER_REVIEW: "Em análise",
  };
  return labels[status];
}

export function isActiveBooking(status: BookingStatus): boolean {
  return ![
    "REJECTED",
    "EXPIRED",
    "COMPLETED",
    "CANCELED",
    "DRAFT",
  ].includes(status);
}

export function hasChatAccess(status: BookingStatus): boolean {
  return [
    "CONFIRMED",
    "CHECK_IN_REQUIRED",
    "IN_PROGRESS",
    "CLIENT_FINISHED",
    "PROVIDER_FINISHED",
    "COMPLETION_PENDING",
    "COMPLETED",
    "DISPUTED",
    "UNDER_REVIEW",
  ].includes(status);
}

export function hasSafetyCenter(status: BookingStatus): boolean {
  return [
    "CONFIRMED",
    "CHECK_IN_REQUIRED",
    "IN_PROGRESS",
    "CLIENT_FINISHED",
    "PROVIDER_FINISHED",
    "COMPLETION_PENDING",
    "DISPUTED",
    "UNDER_REVIEW",
  ].includes(status);
}
