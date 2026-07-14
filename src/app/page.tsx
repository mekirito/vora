import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";

export const metadata: Metadata = {
  title: "VORA — Desejo com curadoria",
  description:
    "Você descreve. A VORA encontra. Companhia adulta com curadoria em Goiânia. Protótipo.",
};

export default function HomePage() {
  return <LandingPage />;
}
