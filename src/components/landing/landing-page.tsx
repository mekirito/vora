"use client";

import { useHydrated } from "@/hooks/use-hydrated";
import { useVoraStore } from "@/stores/vora-store";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingHow } from "@/components/landing/landing-how";
import { LandingTrust } from "@/components/landing/landing-trust";
import { LandingCta } from "@/components/landing/landing-cta";

export function LandingPage() {
  const hydrated = useHydrated();
  const onboarded = useVoraStore((s) => s.session.onboardingComplete);

  const primaryHref = hydrated && onboarded ? "/descobrir" : "/entrar";
  const primaryLabel = hydrated && onboarded ? "Ir para Descobrir" : "Entrar";

  return (
    <>
      <LandingHero primaryHref={primaryHref} primaryLabel={primaryLabel} />
      <LandingHow />
      <LandingTrust />
      <LandingCta primaryHref={primaryHref} primaryLabel={primaryLabel} />
    </>
  );
}
