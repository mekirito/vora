"use client";

import { useVoraStore } from "@/stores/vora-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ContaPage() {
  const hydrated = useHydrated();
  const session = useVoraStore((s) => s.session);

  const resetPrototype = () => {
    localStorage.removeItem("vora-client-v1");
    toast.message("Protótipo reiniciado");
    window.location.href = "/";
  };

  if (!hydrated) {
    return <div className="mx-auto max-w-2xl px-4 py-12 skeleton h-40 rounded-[24px]" />;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-semibold">Conta</h1>

      <section className="rounded-[20px] border border-[var(--border)] bg-[var(--graphite)] p-5 space-y-4">
        <div>
          <p className="text-xs text-[var(--muted)]">Privacidade</p>
          <p className="font-medium capitalize">{session.privacyMode}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--muted)]">Identidade</p>
          <p className="font-medium">
            {session.identityStatus === "verified"
              ? "Verificada (simulada)"
              : "Pendente"}
          </p>
        </div>
        <div>
          <p className="text-xs text-[var(--muted)]">Cidade</p>
          <p className="font-medium">{session.city}</p>
        </div>
      </section>

      <section className="rounded-[20px] border border-[var(--border)] bg-[var(--graphite)] p-5">
        <h2 className="text-sm font-medium">Segurança</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Durante uma reserva ativa, acesse a central de segurança pelo fluxo da
          reserva. Emergências: 190 (Polícia) e 192 (SAMU).
        </p>
      </section>

      <section className="rounded-[20px] border border-dashed border-[var(--border)] p-5">
        <h2 className="text-sm font-medium">Reiniciar protótipo</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Apaga reservas, favoritos e preferências locais deste dispositivo.
        </p>
        <Button variant="danger" className="mt-4" onClick={resetPrototype}>
          Limpar dados e recarregar
        </Button>
      </section>
    </div>
  );
}
