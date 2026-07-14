"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { profiles } from "@/data/profiles";
import type { Profile } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDistance, verificationLabel } from "@/lib/utils";
import { useVoraStore } from "@/stores/vora-store";
import { getAllProfiles } from "@/services/matching";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function CatalogCard({ profile }: { profile: Profile }) {
  const toggleFavorite = useVoraStore((s) => s.toggleFavorite);
  const favorited = useVoraStore((s) => s.isFavorite(profile.id));

  return (
    <article className="group relative overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--graphite)]">
      <Link
        href={`/perfil/${profile.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <Image
            src={profile.images[0]}
            alt={`Retrato editorial fictício de ${profile.firstName}`}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {profile.isAvailableNow ? (
              <Badge className="bg-[var(--accent)]/25 text-[var(--ivory)] normal-case tracking-normal">
                Agora
              </Badge>
            ) : null}
            <Badge className="bg-black/40 normal-case tracking-normal">
              {verificationLabel(profile.verificationLevel)}
            </Badge>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="text-lg font-semibold tracking-tight">
              {profile.firstName}, {profile.age}
            </h3>
            <p className="mt-1 text-xs text-[var(--silver)]">
              {formatDistance(profile.distanceKm)} · {profile.region}
            </p>
            <p className="mt-2 line-clamp-2 text-sm text-[var(--ivory)]/85">
              {profile.tagline}
            </p>
            <p className="mt-3 text-sm font-medium">
              {formatCurrency(profile.startingPrice30Min)}
              <span className="font-normal text-[var(--muted)]"> / 30 min</span>
            </p>
          </div>
        </div>
      </Link>
      <button
        type="button"
        aria-label={favorited ? "Remover dos favoritos" : "Favoritar"}
        onClick={() => {
          toggleFavorite(profile.id);
          toast.message(
            favorited ? "Removido dos favoritos" : "Salvo nos favoritos",
          );
        }}
        className={cn(
          "absolute right-3 top-3 touch-target inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-black/45 text-[var(--ivory)] backdrop-blur-sm transition hover:bg-black/65",
          favorited && "text-[var(--accent)]",
        )}
      >
        <Heart className="h-5 w-5" fill={favorited ? "currentColor" : "none"} />
      </button>
    </article>
  );
}

export function ProfileCatalog({
  excludeIds = [],
}: {
  excludeIds?: string[];
}) {
  const [items, setItems] = useState<Profile[]>(profiles);

  useEffect(() => {
    void getAllProfiles().then(setItems);
  }, []);

  const visible = items.filter((p) => !excludeIds.includes(p.id));

  return (
    <section className="mt-14 border-t border-[var(--border)] pt-10" aria-labelledby="catalog-heading">
      <div className="mb-6 space-y-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
          Seleção em Goiânia
        </p>
        <h2 id="catalog-heading" className="text-2xl font-semibold tracking-tight">
          Explore no seu ritmo
        </h2>
        <p className="max-w-md text-sm text-[var(--muted)]">
          Prefere olhar com calma? Abaixo, uma seleção de perfis fictícios do
          protótipo — sem pressa, sem catálogo infinito.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        {visible.map((profile) => (
          <li key={profile.id}>
            <CatalogCard profile={profile} />
          </li>
        ))}
      </ul>

      <p className="mt-6 text-center text-[11px] text-[var(--muted)]">
        Protótipo — dados e perfis fictícios · {visible.length} na seleção
      </p>
    </section>
  );
}
