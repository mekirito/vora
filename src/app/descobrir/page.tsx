import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { VoraLogo } from "@/components/brand/vora-logo";
import { ConciergeExperience } from "@/components/discovery/concierge";
import { Badge } from "@/components/ui/badge";

export default function DescobrirPage() {
  return (
    <div className="min-h-[100dvh]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--carbon)]/90 backdrop-blur-md md:hidden">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <VoraLogo variant="compact" />
          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--muted)]">Goiânia</span>
            <Badge className="gap-1 normal-case tracking-normal">
              <ShieldCheck className="h-3 w-3" />
              Verificado
            </Badge>
            <Link
              href="/conta"
              className="touch-target text-xs text-[var(--muted)] hover:text-[var(--ivory)]"
            >
              Conta
            </Link>
            <Link
              href="/conta"
              className="touch-target text-xs text-[var(--muted)] hover:text-[var(--ivory)]"
            >
              Segurança
            </Link>
          </div>
        </div>
      </header>
      <ConciergeExperience />
    </div>
  );
}
