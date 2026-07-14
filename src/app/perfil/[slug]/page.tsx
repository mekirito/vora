"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Heart, Star } from "lucide-react";
import { getProfileBySlug } from "@/services/matching";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RequestDrawer } from "@/components/booking/request-drawer";
import {
  formatCurrency,
  formatHeight,
  priceForDuration,
  verificationLabel,
} from "@/lib/utils";
import { useVoraStore } from "@/stores/vora-store";
import type { Profile } from "@/types";
import { toast } from "sonner";

const EXP_LABELS: Record<string, string> = {
  jantar: "Jantar",
  evento: "Evento",
  nightlife: "Nightlife",
  conversacao: "Conversação",
  danca: "Dança",
  musica: "Música",
  "arte-cultura": "Arte e cultura",
  fotografia: "Fotografia",
  viagem: "Viagem",
  gastronomia: "Gastronomia",
};

export default function ProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [slug, setSlug] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestOpen, setRequestOpen] = useState(false);
  const toggleFavorite = useVoraStore((s) => s.toggleFavorite);
  const favorited = useVoraStore((s) =>
    profile ? s.isFavorite(profile.id) : false,
  );

  useEffect(() => {
    void params.then((p) => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    void getProfileBySlug(slug).then((p) => {
      setProfile(p);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="skeleton h-96 rounded-[24px]" />
      </div>
    );
  }

  if (!profile) notFound();

  const rs = profile.reviewSummary;

  return (
    <div className="mx-auto max-w-2xl pb-32">
      <div className="relative aspect-[3/4] w-full">
        <Image
          src={profile.images[0]}
          alt={`Perfil fictício de ${profile.firstName}`}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 640px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        <Link
          href="/descobrir"
          className="absolute left-4 top-4 touch-target inline-flex items-center justify-center rounded-full bg-black/40 p-2"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h1 className="text-3xl font-semibold">
            {profile.firstName}, {profile.age}
          </h1>
          <p className="mt-1 text-sm text-[var(--silver)]">
            {profile.region} · {formatHeight(profile.heightCm)}
          </p>
        </div>
      </div>

      <div className="space-y-6 px-4 py-6">
        <div className="flex flex-wrap gap-2">
          <Badge>{verificationLabel(profile.verificationLevel)}</Badge>
          {profile.isAvailableNow ? (
            <Badge className="border-[var(--accent)]/40">Disponível agora</Badge>
          ) : null}
        </div>

        <p className="text-lg text-[var(--ivory)]">{profile.tagline}</p>
        <p className="text-sm text-[var(--muted)]">{profile.bio}</p>

        {profile.images.length > 1 ? (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {profile.images.slice(1).map((img) => (
              <div
                key={img}
                className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[12px]"
              >
                <Image src={img} alt="" fill className="object-cover" sizes="80px" />
              </div>
            ))}
          </div>
        ) : null}

        <section>
          <h2 className="text-sm font-medium text-[var(--muted)]">Idiomas</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {profile.languages.map((l) => (
              <Badge key={l}>{l}</Badge>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium text-[var(--muted)]">Estilo</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {profile.styleTags.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium text-[var(--muted)]">Interesses</h2>
          <p className="mt-2 text-sm">{profile.interests.join(" · ")}</p>
        </section>

        <section>
          <h2 className="text-sm font-medium text-[var(--muted)]">Experiências</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {profile.experiences.map((e) => (
              <Badge key={e}>{EXP_LABELS[e] ?? e}</Badge>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium text-[var(--muted)]">Disponibilidade</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {profile.availability.nextSlots.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-sm font-medium text-[var(--muted)]">Valores</h2>
          <div className="mt-2 space-y-1 text-sm">
            {profile.availableDurations.map((d) => (
              <p key={d}>
                {d} min — {formatCurrency(priceForDuration(profile.startingPrice30Min, d))}
              </p>
            ))}
          </div>
        </section>

        <section className="rounded-[20px] border border-[var(--border)] bg-[var(--graphite)] p-4">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-[var(--accent)]" />
            <h2 className="text-sm font-medium">Avaliações privadas</h2>
            <span className="text-xs text-[var(--muted)]">({rs.count})</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <span>Comunicação: {rs.communication}</span>
            <span>Pontualidade: {rs.punctuality}</span>
            <span>Respeito: {rs.respect}</span>
            <span>Geral: {rs.overall}</span>
            <span>Segurança: {rs.safety}</span>
          </div>
          {rs.highlight ? (
            <p className="mt-3 text-sm text-[var(--muted)]">&ldquo;{rs.highlight}&rdquo;</p>
          ) : null}
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-[var(--carbon)]/95 p-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl gap-2">
          <Button
            variant="secondary"
            size="icon"
            aria-label="Favoritar"
            onClick={() => {
              toggleFavorite(profile.id);
              toast.message(favorited ? "Removido dos favoritos" : "Salvo nos favoritos");
            }}
          >
            <Heart fill={favorited ? "currentColor" : "none"} className="h-5 w-5" />
          </Button>
          <Button className="flex-1" onClick={() => setRequestOpen(true)}>
            Solicitar encontro
          </Button>
        </div>
      </div>

      <RequestDrawer
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        profile={profile}
      />
    </div>
  );
}
