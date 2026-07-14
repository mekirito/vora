import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Toaster } from "sonner";
import { DesktopHeader, MobileNav } from "@/components/navigation/app-nav";
import { AppMain } from "@/components/navigation/app-main";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VORA — Protótipo",
  description: "Companhia adulta com curadoria. Protótipo com dados fictícios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={outfit.variable}>
      <body className="antialiased">
        <div className="border-b border-[var(--border)] bg-[var(--graphite)] px-4 py-2 text-center text-[11px] text-[var(--muted)]">
          Protótipo — dados e perfis fictícios
        </div>
        <DesktopHeader />
        <AppMain>{children}</AppMain>
        <MobileNav />
        <Toaster theme="dark" position="top-center" richColors />
      </body>
    </html>
  );
}
