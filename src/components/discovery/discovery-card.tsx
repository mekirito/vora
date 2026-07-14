"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
  type PanInfo,
} from "motion/react";
import { Heart, RotateCcw, Eye, Send, X } from "lucide-react";
import type { MatchResult } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDistance, verificationLabel } from "@/lib/utils";
import { useVoraStore } from "@/stores/vora-store";
import { RequestDrawer } from "@/components/booking/request-drawer";
import { toast } from "sonner";

interface Props {
  match: MatchResult;
  remaining: number;
  onPass: () => void;
  onUndo?: () => void;
  onAdjust?: () => void;
  onRestart?: () => void;
}

export function DiscoveryCard({
  match,
  remaining,
  onPass,
  onUndo,
}: Props) {
  const { profile, label, reasons } = match;
  const reduce = useReducedMotion();
  const toggleFavorite = useVoraStore((s) => s.toggleFavorite);
  const favorited = useVoraStore((s) => s.isFavorite(profile.id));
  const [requestOpen, setRequestOpen] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-8, 8]);
  const opacity = useTransform(x, [-200, -80, 0, 80, 200], [0.4, 1, 1, 1, 0.85]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -120) {
      onPass();
      toast.message(`Você passou por ${profile.firstName}`);
    } else if (info.offset.x > 120) {
      setRequestOpen(true);
    }
  };

  return (
    <div className="relative">
      <div className="mb-3 flex items-center justify-between text-xs text-[var(--muted)]">
        <span>
          {remaining} {remaining === 1 ? "opção restante" : "opções restantes"}
        </span>
        <span className="text-[var(--silver)]">{label}</span>
      </div>

      <motion.article
        layoutId={`profile-${profile.slug}`}
        style={reduce ? undefined : { x, rotate, opacity }}
        drag={reduce ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.9}
        onDragEnd={onDragEnd}
        className="overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--graphite)]"
      >
        <div className="relative aspect-[3/4] w-full sm:aspect-[4/5]">
          <Image
            src={profile.images[0]}
            alt={`Retrato editorial fictício de ${profile.firstName}`}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 640px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <Badge className="border-[var(--accent)]/40 bg-black/40 text-[var(--ivory)]">
              {verificationLabel(profile.verificationLevel)}
            </Badge>
            {profile.isAvailableNow ? (
              <Badge className="bg-[var(--accent)]/20 text-[var(--ivory)]">
                Disponível agora
              </Badge>
            ) : null}
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5">
            <h2 className="text-3xl font-semibold tracking-tight">
              {profile.firstName}, {profile.age}
            </h2>
            <p className="mt-1 text-sm text-[var(--silver)]">
              {formatDistance(profile.distanceKm)} · {profile.region}
            </p>
            <p className="mt-3 text-sm text-[var(--ivory)]/90">{profile.tagline}</p>
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex flex-wrap gap-2">
            {profile.styleTags.slice(0, 3).map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
            {profile.languages.slice(0, 2).map((l) => (
              <Badge key={l}>{l}</Badge>
            ))}
          </div>

          <p className="text-sm text-[var(--muted)]">
            {reasons.join(" · ")}
          </p>

          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs text-[var(--muted)]">A partir de</p>
              <p className="text-lg font-medium">
                {formatCurrency(profile.startingPrice30Min)}
                <span className="text-sm font-normal text-[var(--muted)]">
                  {" "}
                  / 30 min
                </span>
              </p>
            </div>
            <p className="text-[11px] text-[var(--muted)]">
              Protótipo — perfil fictício
            </p>
          </div>
        </div>
      </motion.article>

      <div className="mt-5 grid grid-cols-4 gap-2">
        <Button
          variant="secondary"
          aria-label="Passar"
          onClick={() => {
            onPass();
            toast.message(`Você passou por ${profile.firstName}`);
          }}
        >
          <X className="h-5 w-5" />
        </Button>
        <Button
          variant="secondary"
          aria-label={favorited ? "Remover dos favoritos" : "Favoritar"}
          onClick={() => {
            toggleFavorite(profile.id);
            toast.message(
              favorited ? "Removido dos favoritos" : "Salvo nos favoritos",
            );
          }}
        >
          <Heart
            className="h-5 w-5"
            fill={favorited ? "currentColor" : "none"}
          />
        </Button>
        <Link
          href={`/perfil/${profile.slug}`}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[16px] border border-[var(--border)] bg-[var(--card-elevated)] text-sm hover:bg-[#292929]"
        >
          <Eye className="h-5 w-5" />
          <span className="sr-only">Ver perfil</span>
        </Link>
        <Button
          onClick={() => setRequestOpen(true)}
          aria-label="Solicitar encontro"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>

      <div className="mt-3 flex items-center justify-between">
        {onUndo ? (
          <Button variant="ghost" size="sm" onClick={onUndo}>
            <RotateCcw className="h-4 w-4" />
            Desfazer
          </Button>
        ) : (
          <span />
        )}
        <p className="text-[11px] text-[var(--muted)]">
          Arraste: esquerda passa · direita solicita
        </p>
      </div>

      <RequestDrawer
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        profile={profile}
      />
    </div>
  );
}
