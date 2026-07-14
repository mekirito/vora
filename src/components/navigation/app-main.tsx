"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function AppMain({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const bare =
    pathname === "/" ||
    pathname === "/entrar" ||
    pathname === "/trabalhe-conosco" ||
    pathname.startsWith("/reserva/") ||
    pathname.startsWith("/perfil/");

  return (
    <main className={cn(!bare && "pb-nav", "md:pb-0")}>{children}</main>
  );
}
