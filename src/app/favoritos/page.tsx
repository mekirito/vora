"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { profiles } from "@/data/profiles";
import { useVoraStore } from "@/stores/vora-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export default function FavoritosPage() {
  const hydrated = useHydrated();
  const favorites = useVoraStore((s) => s.favorites);
  const toggleFavorite = useVoraStore((s) => s.toggleFavorite);

  if (!hydrated) {
    return <div className="mx-auto max-w-2xl px-4 py-12 skeleton h-40 rounded-[24px]" />;
  }

  const items = favorites
    .map((f) => {
      const profile = profiles.find((p) => p.id === f.profileId);
      return profile ? { profile, addedAt: f.addedAt } : null;
    })
    .filter(Boolean);

  if (!items.length) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-semibold">Favoritos</h1>
        <EmptyState
          title="Nenhum favorito"
          description="Salve perfis que chamarem atenção durante a descoberta."
          action={
            <Link href="/descobrir">
              <Button>Descobrir</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Favoritos</h1>
      <ul className="mt-6 space-y-3">
        {items.map((item) => {
          if (!item) return null;
          const { profile } = item;
          return (
            <li key={profile.id}>
              <div className="flex items-center gap-4 rounded-[20px] border border-[var(--border)] bg-[var(--graphite)] p-4">
                <Link
                  href={`/perfil/${profile.slug}`}
                  className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[12px]"
                >
                  <Image
                    src={profile.images[0]}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </Link>
                <Link href={`/perfil/${profile.slug}`} className="min-w-0 flex-1">
                  <p className="font-medium">
                    {profile.firstName}, {profile.age}
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    {profile.region} · a partir de{" "}
                    {formatCurrency(profile.startingPrice30Min)}
                  </p>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Remover favorito"
                  onClick={() => toggleFavorite(profile.id)}
                >
                  <Heart className="h-5 w-5" fill="currentColor" />
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
