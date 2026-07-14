export interface SafetyOption {
  id: string;
  title: string;
  description: string;
  tone: "default" | "urgent";
}

export const SAFETY_OPTIONS: SafetyOption[] = [
  {
    id: "help",
    title: "Preciso de ajuda",
    description: "Fale com o suporte da VORA sobre a reserva.",
    tone: "default",
  },
  {
    id: "risk",
    title: "Estou em risco imediato",
    description: "Ação crítica. Pressione e segure por 2 segundos.",
    tone: "urgent",
  },
];

export const EMERGENCY_NUMBERS = [
  { id: "police", label: "Polícia", number: "190" },
  { id: "samu", label: "SAMU", number: "192" },
] as const;

export function getSafetyDisclaimer(): string {
  return "A VORA oferece suporte e ferramentas de segurança, mas não substitui os serviços públicos de emergência.";
}

export async function notifySupport(
  bookingId: string,
  type: "help" | "risk",
): Promise<{ ok: boolean; message: string }> {
  await new Promise((r) => setTimeout(r, 400));
  if (type === "risk") {
    return {
      ok: true,
      message:
        "Alerta registrado. Contate imediatamente a polícia (190) se estiver em perigo. O suporte VORA foi notificado na simulação.",
    };
  }
  return {
    ok: true,
    message: "Suporte notificado. Em um ambiente real, nossa equipe entraria em contato.",
  };
}
