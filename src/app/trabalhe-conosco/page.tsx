import type { Metadata } from "next";
import { RecruitPage } from "@/components/recruit/recruit-page";

export const metadata: Metadata = {
  title: "Trabalhe conosco — VORA",
  description:
    "Entre na vitrine certa. Clientes verificados, pagamento antes e temporada de 6 meses que recompensa o topo do faturamento.",
};

export default function TrabalheConoscoPage() {
  return <RecruitPage />;
}
