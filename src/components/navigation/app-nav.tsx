"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Heart,
  CalendarDays,
  MessageCircle,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useVoraStore } from "@/stores/vora-store";
import { hasChatAccess } from "@/lib/booking-state";

const items = [
  { href: "/descobrir", label: "Descobrir", icon: Compass },
  { href: "/favoritos", label: "Favoritos", icon: Heart },
  { href: "/reservas", label: "Reservas", icon: CalendarDays },
  { href: "/mensagens", label: "Mensagens", icon: MessageCircle },
  { href: "/conta", label: "Conta", icon: User },
] as const;

export function MobileNav() {
  const pathname = usePathname();
  const bookings = useVoraStore((s) => s.bookings);
  const unreadChats = bookings.filter((b) => hasChatAccess(b.status)).length;

  const hide =
    pathname === "/" ||
    pathname.startsWith("/reserva/") ||
    pathname.startsWith("/perfil/");

  if (hide) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border)] bg-[var(--carbon)]/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "var(--safe-bottom)" }}
      aria-label="Navegação principal"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "relative flex touch-target flex-col items-center justify-center gap-0.5 py-2 text-[10px] transition-colors",
                  active
                    ? "text-[var(--accent)]"
                    : "text-[var(--muted)] hover:text-[var(--ivory)]",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span>{label}</span>
                {href === "/mensagens" && unreadChats > 0 ? (
                  <span className="absolute right-1/4 top-1 h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function DesktopHeader() {
  const pathname = usePathname();
  const session = useVoraStore((s) => s.session);

  if (pathname === "/" || !session.onboardingComplete) return null;

  return (
    <header className="sticky top-0 z-40 hidden border-b border-[var(--border)] bg-[var(--carbon)]/90 backdrop-blur-md md:block">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/descobrir" className="text-sm font-semibold tracking-[0.12em]">
          VORA
        </Link>
        <nav className="flex items-center gap-6" aria-label="Principal">
          {items.map(({ href, label }) => {
            const active =
              pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-sm transition-colors",
                  active
                    ? "text-[var(--ivory)]"
                    : "text-[var(--muted)] hover:text-[var(--ivory)]",
                )}
                aria-current={active ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
          <span>{session.city}</span>
          <span className="h-1 w-1 rounded-full bg-[var(--accent)]" aria-hidden />
          <span>Identidade verificada</span>
        </div>
      </div>
    </header>
  );
}
