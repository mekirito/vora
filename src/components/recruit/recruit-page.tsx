import { RecruitHero } from "@/components/recruit/recruit-hero";
import { RecruitBenefits } from "@/components/recruit/recruit-benefits";
import { RecruitSeason } from "@/components/recruit/recruit-season";
import { RecruitBillboards } from "@/components/recruit/recruit-billboards";
import { RecruitSteps } from "@/components/recruit/recruit-steps";
import { RecruitForm } from "@/components/recruit/recruit-form";
import { RecruitCta } from "@/components/recruit/recruit-cta";

export function RecruitPage() {
  return (
    <>
      <RecruitHero />
      <RecruitBenefits />
      <RecruitSeason />
      <RecruitBillboards />
      <RecruitSteps />
      <RecruitForm />
      <RecruitCta />
    </>
  );
}
