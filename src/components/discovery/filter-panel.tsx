"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { estimateResultCount } from "@/services/matching";
import type {
  DiscoveryFilters,
  DurationMinutes,
  ExperienceType,
  HairColor,
  HairLength,
  Language,
  PersonalityTag,
  StyleTag,
} from "@/types";
import { MINIMUM_PRICE } from "@/types";
import { cn } from "@/lib/utils";

const HAIR_COLORS: { value: HairColor; label: string }[] = [
  { value: "preto", label: "Preto" },
  { value: "castanho", label: "Castanho" },
  { value: "loiro", label: "Loiro" },
  { value: "ruivo", label: "Ruivo" },
  { value: "colorido", label: "Colorido" },
  { value: "grisalho", label: "Grisalho" },
];

const HAIR_LENGTHS: { value: HairLength; label: string }[] = [
  { value: "curto", label: "Curto" },
  { value: "medio", label: "Médio" },
  { value: "longo", label: "Longo" },
];

const STYLE_TAGS: { value: StyleTag; label: string }[] = [
  { value: "discreta", label: "Discreta" },
  { value: "fashion", label: "Fashion" },
  { value: "classica", label: "Clássica" },
  { value: "alternativa", label: "Alternativa" },
  { value: "esportiva", label: "Esportiva" },
  { value: "elegante", label: "Elegante" },
  { value: "casual", label: "Casual" },
];

const PERSONALITY: { value: PersonalityTag; label: string }[] = [
  { value: "boa-conversacao", label: "Boa conversação" },
  { value: "extrovertida", label: "Extrovertida" },
  { value: "reservada", label: "Reservada" },
  { value: "elegante", label: "Elegante" },
  { value: "espontanea", label: "Espontânea" },
  { value: "cultural", label: "Cultural" },
  { value: "aventureira", label: "Aventureira" },
  { value: "calorosa", label: "Calorosa" },
];

const LANGUAGES: { value: Language; label: string }[] = [
  { value: "portugues", label: "Português" },
  { value: "ingles", label: "Inglês" },
  { value: "frances", label: "Francês" },
  { value: "espanhol", label: "Espanhol" },
  { value: "italiano", label: "Italiano" },
  { value: "alemao", label: "Alemão" },
];

const EXPERIENCES: { value: ExperienceType; label: string }[] = [
  { value: "jantar", label: "Jantar" },
  { value: "evento", label: "Evento" },
  { value: "nightlife", label: "Nightlife" },
  { value: "conversacao", label: "Conversação" },
  { value: "danca", label: "Dança" },
  { value: "musica", label: "Música" },
  { value: "arte-cultura", label: "Arte e cultura" },
  { value: "fotografia", label: "Fotografia" },
  { value: "viagem", label: "Viagem" },
  { value: "gastronomia", label: "Gastronomia" },
];

const DURATIONS: DurationMinutes[] = [30, 60, 90, 120];

interface FilterPanelProps {
  open: boolean;
  onClose: () => void;
  filters: DiscoveryFilters;
  onApply: (filters: DiscoveryFilters) => void;
}

function Group({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="border-b border-[var(--border)] py-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="touch-target flex w-full items-center justify-between text-left text-sm font-medium"
      >
        {title}
        <ChevronDown
          className={cn("h-4 w-4 transition", open && "rotate-180")}
        />
      </button>
      {open ? <div className="mt-4 space-y-4">{children}</div> : null}
    </section>
  );
}

function ToggleChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "touch-target rounded-full border px-3 py-2 text-xs transition",
        active
          ? "border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--ivory)]"
          : "border-[var(--border)] text-[var(--muted)] hover:border-white/20",
      )}
    >
      {children}
    </button>
  );
}

export function FilterPanel({ open, onClose, filters, onApply }: FilterPanelProps) {
  const [local, setLocal] = useState(filters);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (open) setLocal(filters);
  }, [open, filters]);

  useEffect(() => {
    let cancelled = false;
    void estimateResultCount(local).then((n) => {
      if (!cancelled) setCount(n);
    });
    return () => {
      cancelled = true;
    };
  }, [local]);

  const patch = (partial: Partial<DiscoveryFilters>) =>
    setLocal((prev) => ({ ...prev, ...partial }));

  const toggleArray = <T extends string>(key: keyof DiscoveryFilters, value: T) => {
    setLocal((prev) => {
      const arr = (prev[key] as T[]) ?? [];
      const next = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value];
      return { ...prev, [key]: next };
    });
  };

  const minBudget = MINIMUM_PRICE[local.duration];

  return (
    <Sheet open={open} onClose={onClose} title="Filtros" side="bottom">
      <div className="space-y-1 pb-24">
        <Group title="Momento" defaultOpen>
          <div>
            <p className="mb-2 text-xs text-[var(--muted)]">Disponibilidade</p>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { v: "agora" as const, l: "Agora" },
                  { v: "hoje" as const, l: "Hoje" },
                  { v: "agendar" as const, l: "Agendar" },
                ] as const
              ).map(({ v, l }) => (
                <ToggleChip
                  key={v}
                  active={local.availability === v}
                  onClick={() =>
                    patch({
                      availability: local.availability === v ? null : v,
                      availableNow: v === "agora" ? local.availability !== v : local.availableNow,
                    })
                  }
                >
                  {l}
                </ToggleChip>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs text-[var(--muted)]">Duração</p>
            <div className="flex flex-wrap gap-2">
              {DURATIONS.map((d) => (
                <ToggleChip
                  key={d}
                  active={local.duration === d}
                  onClick={() => {
                    const nextBudget = Math.max(local.budgetMax, MINIMUM_PRICE[d]);
                    patch({ duration: d, budgetMax: nextBudget });
                  }}
                >
                  {d} min
                </ToggleChip>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="filter-radius" className="text-xs text-[var(--muted)]">
              Raio ({local.radiusKm} km)
            </label>
            <input
              id="filter-radius"
              type="range"
              min={1}
              max={30}
              value={local.radiusKm}
              onChange={(e) => patch({ radiusKm: Number(e.target.value) })}
              className="mt-2 w-full accent-[var(--accent)]"
            />
          </div>

          <div>
            <label htmlFor="filter-budget" className="text-xs text-[var(--muted)]">
              Orçamento máximo (mín. {minBudget})
            </label>
            <Input
              id="filter-budget"
              type="number"
              min={minBudget}
              step={100}
              value={local.budgetMax}
              onChange={(e) =>
                patch({
                  budgetMax: Math.max(minBudget, Number(e.target.value) || minBudget),
                })
              }
              className="mt-2"
            />
          </div>
        </Group>

        <Group title="Estilo">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="height-min" className="text-xs text-[var(--muted)]">
                Altura mín. (cm)
              </label>
              <Input
                id="height-min"
                type="number"
                placeholder="—"
                value={local.heightMin ?? ""}
                onChange={(e) =>
                  patch({
                    heightMin: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="height-max" className="text-xs text-[var(--muted)]">
                Altura máx. (cm)
              </label>
              <Input
                id="height-max"
                type="number"
                placeholder="—"
                value={local.heightMax ?? ""}
                onChange={(e) =>
                  patch({
                    heightMax: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs text-[var(--muted)]">Cor do cabelo</p>
            <div className="flex flex-wrap gap-2">
              {HAIR_COLORS.map(({ value, label }) => (
                <ToggleChip
                  key={value}
                  active={local.hairColors.includes(value)}
                  onClick={() => toggleArray("hairColors", value)}
                >
                  {label}
                </ToggleChip>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs text-[var(--muted)]">Comprimento</p>
            <div className="flex flex-wrap gap-2">
              {HAIR_LENGTHS.map(({ value, label }) => (
                <ToggleChip
                  key={value}
                  active={local.hairLengths.includes(value)}
                  onClick={() => toggleArray("hairLengths", value)}
                >
                  {label}
                </ToggleChip>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs text-[var(--muted)]">Estilo</p>
            <div className="flex flex-wrap gap-2">
              {STYLE_TAGS.map(({ value, label }) => (
                <ToggleChip
                  key={value}
                  active={local.styleTags.includes(value)}
                  onClick={() => toggleArray("styleTags", value)}
                >
                  {label}
                </ToggleChip>
              ))}
            </div>
          </div>
        </Group>

        <Group title="Conexão">
          <div>
            <p className="mb-2 text-xs text-[var(--muted)]">Idiomas</p>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map(({ value, label }) => (
                <ToggleChip
                  key={value}
                  active={local.languages.includes(value)}
                  onClick={() => toggleArray("languages", value)}
                >
                  {label}
                </ToggleChip>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs text-[var(--muted)]">Personalidade</p>
            <div className="flex flex-wrap gap-2">
              {PERSONALITY.map(({ value, label }) => (
                <ToggleChip
                  key={value}
                  active={local.personalityTags.includes(value)}
                  onClick={() => toggleArray("personalityTags", value)}
                >
                  {label}
                </ToggleChip>
              ))}
            </div>
          </div>
        </Group>

        <Group title="Experiência">
          <div className="flex flex-wrap gap-2">
            {EXPERIENCES.map(({ value, label }) => (
              <ToggleChip
                key={value}
                active={local.experiences.includes(value)}
                onClick={() => toggleArray("experiences", value)}
              >
                {label}
              </ToggleChip>
            ))}
          </div>
        </Group>

        <Group title="Confiança">
          <div className="flex flex-col gap-2">
            <ToggleChip
              active={local.identityVerified}
              onClick={() => patch({ identityVerified: !local.identityVerified })}
            >
              Identidade verificada
            </ToggleChip>
            <ToggleChip
              active={local.photosVerified}
              onClick={() => patch({ photosVerified: !local.photosVerified })}
            >
              Fotos verificadas
            </ToggleChip>
            <ToggleChip
              active={local.availableNow}
              onClick={() => patch({ availableNow: !local.availableNow })}
            >
              Disponível agora
            </ToggleChip>
            <ToggleChip
              active={local.recentlyUpdated}
              onClick={() => patch({ recentlyUpdated: !local.recentlyUpdated })}
            >
              Atualizado recentemente
            </ToggleChip>
          </div>
        </Group>
      </div>

      <div className="sticky bottom-0 -mx-5 border-t border-[var(--border)] bg-[var(--graphite)] px-5 py-4">
        <p className="mb-3 text-center text-sm text-[var(--muted)]">
          {count === null
            ? "Calculando…"
            : count === 0
              ? "Nenhum resultado estimado"
              : `~${count} ${count === 1 ? "resultado" : "resultados"} estimados`}
        </p>
        <Button
          className="w-full"
          onClick={() => {
            onApply(local);
            onClose();
          }}
        >
          Aplicar filtros
        </Button>
      </div>
    </Sheet>
  );
}
