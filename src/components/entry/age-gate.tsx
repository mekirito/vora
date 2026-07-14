"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { VoraLogo } from "@/components/brand/vora-logo";
import { Button } from "@/components/ui/button";
import { useVoraStore } from "@/stores/vora-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { motion, useReducedMotion } from "motion/react";

type Step = "welcome" | "age" | "identity" | "privacy" | "ready";

export function AgeGate() {
  const router = useRouter();
  const hydrated = useHydrated();
  const reduce = useReducedMotion();
  const session = useVoraStore((s) => s.session);
  const setAgeVerified = useVoraStore((s) => s.setAgeVerified);
  const completeOnboarding = useVoraStore((s) => s.completeOnboarding);
  const [step, setStep] = useState<Step>("welcome");
  const [privacy, setPrivacy] = useState<"discreet" | "standard">("discreet");

  useEffect(() => {
    if (!hydrated) return;
    if (session.onboardingComplete) {
      router.replace("/descobrir");
    } else if (session.ageVerified) {
      setStep("identity");
    }
  }, [hydrated, session.onboardingComplete, session.ageVerified, router]);

  if (!hydrated) {
    return (
      <div className="flex min-h-[80dvh] items-center justify-center">
        <div className="h-8 w-8 animate-pulse rounded-full bg-[var(--card-elevated)]" />
      </div>
    );
  }

  if (session.onboardingComplete) return null;

  const wrap = (children: ReactNode) => (
    <motion.div
      key={step}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto flex min-h-[80dvh] max-w-md flex-col justify-center px-6 py-12"
    >
      {children}
    </motion.div>
  );

  if (step === "welcome") {
    return wrap(
      <>
        <VoraLogo className="mb-10" />
        <h1 className="text-3xl font-semibold tracking-tight">Desejo com curadoria.</h1>
        <p className="mt-4 text-sm text-[var(--muted)]">
          Companhia adulta com discrição, verificação e clareza nos combinados.
          Protótipo com perfis fictícios em Goiânia.
        </p>
        <ul className="mt-6 space-y-2 text-sm text-[var(--silver)]">
          <li>· Dados e identidades simuladas</li>
          <li>· Privacidade em primeiro lugar</li>
          <li>· Experiências sociais, não sexuais</li>
        </ul>
        <Button className="mt-10 w-full" onClick={() => setStep("age")}>
          Continuar
        </Button>
      </>,
    );
  }

  if (step === "age") {
    return wrap(
      <>
        <h1 className="text-2xl font-semibold">Confirmação de idade</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          A VORA é exclusiva para maiores de 18 anos. Ao continuar, você confirma
          ter idade legal para usar a plataforma.
        </p>
        <Button
          className="mt-10 w-full"
          onClick={() => {
            setAgeVerified();
            setStep("identity");
          }}
        >
          Confirmo que tenho 18 anos ou mais
        </Button>
      </>,
    );
  }

  if (step === "identity") {
    return wrap(
      <>
        <h1 className="text-2xl font-semibold">Identidade verificada</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          No protótipo, sua identidade aparece como verificada. Em produção, a
          VORA solicitaria documento e selfie de forma segura.
        </p>
        <div className="mt-6 rounded-[20px] border border-[var(--accent)]/30 bg-[var(--accent)]/10 p-4 text-sm">
          Status: verificado · Goiânia
        </div>
        <Button className="mt-10 w-full" onClick={() => setStep("privacy")}>
          Continuar
        </Button>
      </>,
    );
  }

  if (step === "privacy") {
    return wrap(
      <>
        <h1 className="text-2xl font-semibold">Preferências de privacidade</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Escolha como prefere navegar. Você pode alterar depois em Conta.
        </p>
        <div className="mt-6 space-y-3">
          {(
            [
              {
                v: "discreet" as const,
                t: "Discreto",
                d: "Menos detalhes visíveis, máxima discrição.",
              },
              {
                v: "standard" as const,
                t: "Padrão",
                d: "Experiência completa com informações visíveis.",
              },
            ] as const
          ).map((opt) => (
            <button
              key={opt.v}
              type="button"
              onClick={() => setPrivacy(opt.v)}
              className={`touch-target w-full rounded-[16px] border px-4 py-3 text-left transition ${
                privacy === opt.v
                  ? "border-[var(--accent)] bg-[var(--accent)]/10"
                  : "border-[var(--border)] bg-[var(--graphite)]"
              }`}
            >
              <span className="font-medium">{opt.t}</span>
              <p className="mt-1 text-xs text-[var(--muted)]">{opt.d}</p>
            </button>
          ))}
        </div>
        <Button
          className="mt-10 w-full"
          onClick={() => {
            completeOnboarding(privacy);
            setStep("ready");
          }}
        >
          Salvar e continuar
        </Button>
      </>,
    );
  }

  return wrap(
    <>
      <h1 className="text-2xl font-semibold">Tudo pronto</h1>
      <p className="mt-3 text-sm text-[var(--muted)]">
        Descreva o momento. A VORA encontra alguém compatível — uma opção por vez.
      </p>
      <Button className="mt-10 w-full" onClick={() => router.push("/descobrir")}>
        Entrar na descoberta
      </Button>
    </>,
  );
}
