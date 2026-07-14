"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { VoraLogo } from "@/components/brand/vora-logo";

interface LandingHeroProps {
  primaryHref: string;
  primaryLabel: string;
}

export function LandingHero({ primaryHref, primaryLabel }: LandingHeroProps) {
  const reduce = useReducedMotion();

  const scrollToHow = () => {
    document.getElementById("como-funciona")?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <section
      className="relative isolate min-h-[calc(100dvh-2.25rem)] overflow-hidden"
      aria-labelledby="landing-hero-title"
    >
      <div className="absolute inset-0">
        <Image
          src="/profiles/brand-model.png"
          alt="Modelo oficial VORA — campanha editorial"
          fill
          priority
          className="object-cover object-[center_20%] md:object-[70%_center]"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[var(--carbon)] via-[var(--carbon)]/75 to-[var(--carbon)]/35 md:bg-gradient-to-r md:from-[var(--carbon)] md:via-[var(--carbon)]/80 md:to-transparent"
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-2.25rem)] w-full max-w-6xl flex-col justify-end px-6 pb-12 pt-10 md:justify-center md:pb-20 md:pt-16">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl space-y-6 md:space-y-8"
        >
          <div className="space-y-4">
            <VoraLogo className="origin-left scale-110 md:scale-125" />
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--silver)]">
              Goiânia
            </p>
          </div>

          <div className="space-y-3">
            <h1
              id="landing-hero-title"
              className="text-4xl font-semibold tracking-tight text-[var(--ivory)] sm:text-5xl md:text-6xl"
            >
              Desejo com curadoria.
            </h1>
            <p className="max-w-md text-base text-[var(--silver)] sm:text-lg">
              Você descreve. A VORA encontra.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={primaryHref}
              className="inline-flex h-12 w-full items-center justify-center rounded-[16px] bg-[var(--accent)] px-5 text-base font-medium text-white transition-colors touch-target hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] sm:w-auto"
            >
              {primaryLabel}
            </Link>
            <button
              type="button"
              onClick={scrollToHow}
              className="inline-flex h-12 w-full items-center justify-center rounded-[16px] px-5 text-base font-medium text-[var(--ivory)] transition-colors touch-target hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:w-auto"
            >
              Como funciona
            </button>
          </div>

          <p className="text-xs text-[var(--muted)]">
            +18 · Protótipo com dados fictícios ·{" "}
            <Link
              href="/trabalhe-conosco"
              className="underline-offset-2 hover:text-[var(--ivory)] hover:underline"
            >
              Trabalhe conosco
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
