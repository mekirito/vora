"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { QUICK_SUGGESTIONS, defaultFilters, parseNaturalQuery } from "@/lib/parser";
import { useVoraStore } from "@/stores/vora-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Chip } from "@/components/ui/badge";
import { FilterPanel } from "@/components/discovery/filter-panel";
import { MatchTransition } from "@/components/discovery/match-transition";
import { DiscoveryCard } from "@/components/discovery/discovery-card";
import { ProfileCatalog } from "@/components/discovery/profile-catalog";
import { findMatches } from "@/services/matching";
import { SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import type { DiscoveryFilters } from "@/types";

export function ConciergeExperience() {
  const reduce = useReducedMotion();
  const {
    filters,
    chips,
    racialWarning,
    matches,
    matchIndex,
    isSearching,
    setFilters,
    setChips,
    removeChip,
    setRacialWarning,
    setMatches,
    setSearching,
    passCurrent,
    undoPass,
    lastPassed,
  } = useVoraStore();

  const [query, setQuery] = useState(filters.queryText || "");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [phase, setPhase] = useState<"compose" | "results">(
    matches.length ? "results" : "compose",
  );

  const remaining = Math.max(0, matches.length - matchIndex);
  const current = matches[matchIndex];

  const applyParsed = (text: string) => {
    const parsed = parseNaturalQuery(text);
    const next: DiscoveryFilters = {
      ...defaultFilters(),
      ...filters,
      ...parsed.filters,
      queryText: text,
    };
    setFilters(next);
    setChips(parsed.chips);
    setRacialWarning(parsed.racialMentionWarning);
    if (parsed.racialMentionWarning) {
      toast.message(
        "A VORA utiliza preferências de estilo e apresentação, não filtros raciais.",
      );
    }
  };

  const onSubmit = async () => {
    applyParsed(query);
    setSearching(true);
    setPhase("results");
    const nextFilters = {
      ...defaultFilters(),
      ...filters,
      ...parseNaturalQuery(query).filters,
      queryText: query,
    };
    setFilters(nextFilters);
    await new Promise((r) => setTimeout(r, reduce ? 200 : 1400));
    const results = await findMatches(nextFilters);
    setMatches(results);
    setSearching(false);
    if (!results.length) {
      toast.message("Nenhuma opção compatível. Ajuste os filtros.");
    } else if (results.length <= 2) {
      toast.message("Poucas opções nesta seleção. Você pode ampliar o raio.");
    }
  };

  const appendSuggestion = (insert: string) => {
    const next = query.trim()
      ? `${query.trim()}, ${insert}`
      : `Quero alguém ${insert}`;
    setQuery(next);
  };

  const refineAndSearch = async (nextFilters: DiscoveryFilters) => {
    setFilters(nextFilters);
    setFiltersOpen(false);
    setSearching(true);
    setPhase("results");
    await new Promise((r) => setTimeout(r, reduce ? 200 : 1400));
    const results = await findMatches(nextFilters);
    setMatches(results);
    setSearching(false);
  };

  const hero = useMemo(
    () => (
      <motion.section
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="space-y-6"
      >
        <div className="space-y-3">
          <h1 className="max-w-xl text-3xl font-semibold tracking-tight text-[var(--ivory)] sm:text-4xl">
            O que combina com a sua noite?
          </h1>
          <p className="max-w-lg text-sm text-[var(--muted)] sm:text-base">
            Descreva o momento. A VORA encontra alguém compatível.
          </p>
        </div>

        <div className="rounded-[24px] border border-[var(--border)] bg-[var(--graphite)] p-4 sm:p-5">
          <label htmlFor="concierge-query" className="sr-only">
            Descreva o que você procura
          </label>
          <Textarea
            id="concierge-query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex.: disponível agora, até 2 km, fala francês e gosta de dançar…"
            className="min-h-[110px] border-0 bg-transparent px-1 py-1 text-base focus-visible:ring-0"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                void onSubmit();
              }
            }}
          />
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[var(--muted)]">
              Você descreve. A VORA encontra.
            </p>
            <Button onClick={() => void onSubmit()} className="w-full sm:w-auto">
              Encontrar alguém
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2" role="list" aria-label="Sugestões rápidas">
          {QUICK_SUGGESTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              role="listitem"
              onClick={() => appendSuggestion(s.insert)}
              className="touch-target rounded-full border border-[var(--border)] px-3 py-2 text-xs text-[var(--silver)] transition hover:border-white/20 hover:text-[var(--ivory)]"
            >
              {s.label}
            </button>
          ))}
        </div>
      </motion.section>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query, reduce],
  );

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
      {phase === "compose" || (!matches.length && !isSearching) ? hero : null}

      {(chips.length > 0 || racialWarning) && (
        <div className="mt-6 space-y-3">
          <AnimatePresence mode="popLayout">
            <div className="flex flex-wrap gap-2">
              {chips.map((chip) => (
                <motion.div
                  key={chip.id}
                  initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                >
                  <Chip onRemove={() => removeChip(chip.id)}>{chip.label}</Chip>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
          {racialWarning ? (
            <p className="text-xs text-[var(--muted)]" role="status">
              A VORA utiliza preferências de estilo e apresentação, não filtros
              raciais.
            </p>
          ) : null}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setFiltersOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Ajustar filtros
          </Button>
        </div>
      )}

      {phase === "results" ? (
        <div className="mt-8">
          {isSearching ? (
            <MatchTransition />
          ) : current ? (
            <DiscoveryCard
              match={current}
              remaining={remaining}
              onPass={passCurrent}
              onUndo={lastPassed ? undoPass : undefined}
              onAdjust={() => setFiltersOpen(true)}
              onRestart={() => {
                setPhase("compose");
                setMatches([]);
              }}
            />
          ) : (
            <div className="rounded-[24px] border border-[var(--border)] bg-[var(--graphite)] px-6 py-16 text-center">
              <h2 className="text-lg font-medium">Sem mais opções nesta seleção</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Ajuste os filtros, descreva de novo ou explore a seleção abaixo.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
                <Button variant="secondary" onClick={() => setFiltersOpen(true)}>
                  Ajustar filtros
                </Button>
                <Button
                  onClick={() => {
                    setPhase("compose");
                    setMatches([]);
                  }}
                >
                  Nova descrição
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {phase === "compose" && chips.length === 0 ? (
        <div className="mt-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFiltersOpen(true)}
            className="text-[var(--muted)]"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Ou avançar pelos filtros
          </Button>
        </div>
      ) : null}

      {!isSearching ? (
        <ProfileCatalog
          excludeIds={
            phase === "results" && current
              ? [current.profile.id]
              : []
          }
        />
      ) : null}

      <FilterPanel
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onApply={(f) => void refineAndSearch(f)}
      />
    </div>
  );
}
