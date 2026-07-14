import { profiles } from "@/data/profiles";
import type {
  CompatibilityLabel,
  DiscoveryFilters,
  MatchResult,
  Profile,
} from "@/types";
import { priceForDuration } from "@/lib/utils";

function scoreProfile(profile: Profile, filters: DiscoveryFilters): number {
  let score = 50;

  if (filters.availableNow || filters.availability === "agora") {
    if (!profile.isAvailableNow) return -1;
    score += 25;
  }

  if (profile.distanceKm > filters.radiusKm) return -1;
  score += Math.max(0, 20 - profile.distanceKm * 2);

  if (filters.heightMax != null && profile.heightCm > filters.heightMax) {
    return -1;
  }
  if (filters.heightMin != null && profile.heightCm < filters.heightMin) {
    return -1;
  }
  if (filters.heightMax != null || filters.heightMin != null) score += 8;

  if (filters.hairColors.length) {
    if (!filters.hairColors.includes(profile.hairColor)) return -1;
    score += 10;
  }

  if (filters.hairLengths.length) {
    if (!filters.hairLengths.includes(profile.hairLength)) score -= 5;
    else score += 5;
  }

  if (filters.languages.length) {
    const langHits = filters.languages.filter((l) =>
      profile.languages.includes(l),
    ).length;
    if (langHits === 0) return -1;
    score += langHits * 12;
  }

  if (filters.experiences.length) {
    const expHits = filters.experiences.filter((e) =>
      profile.experiences.includes(e),
    ).length;
    if (expHits === 0) score -= 15;
    else score += expHits * 10;
  }

  if (filters.styleTags.length) {
    const styleHits = filters.styleTags.filter((s) =>
      profile.styleTags.includes(s),
    ).length;
    score += styleHits * 6;
  }

  if (filters.personalityTags.length) {
    const persHits = filters.personalityTags.filter((p) =>
      profile.personalityTags.includes(p),
    ).length;
    score += persHits * 6;
  }

  const price = priceForDuration(profile.startingPrice30Min, filters.duration);
  if (price > filters.budgetMax) return -1;
  score += Math.max(0, 10 - (price - 500) / 200);

  if (filters.identityVerified) {
    if (
      profile.verificationLevel !== "identity" &&
      profile.verificationLevel !== "full"
    ) {
      return -1;
    }
    score += 8;
  }

  if (filters.photosVerified) {
    if (
      profile.verificationLevel !== "photos" &&
      profile.verificationLevel !== "full"
    ) {
      return -1;
    }
    score += 8;
  }

  if (filters.recentlyUpdated) {
    const updated = new Date(profile.availability.updatedAt).getTime();
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
    if (updated < dayAgo) score -= 10;
    else score += 5;
  }

  if (profile.verificationLevel === "full") score += 5;

  return score;
}

function buildReasons(
  profile: Profile,
  filters: DiscoveryFilters,
): string[] {
  const reasons: string[] = [];

  if (profile.isAvailableNow && (filters.availableNow || filters.availability === "agora")) {
    reasons.push("Disponível agora");
  }

  reasons.push(`${profile.distanceKm.toFixed(1).replace(".", ",")} km`);

  for (const lang of filters.languages) {
    if (profile.languages.includes(lang)) {
      const labels: Record<string, string> = {
        frances: "Fala francês",
        ingles: "Fala inglês",
        espanhol: "Fala espanhol",
        italiano: "Fala italiano",
        alemao: "Fala alemão",
        portugues: "Português",
      };
      reasons.push(labels[lang] ?? lang);
    }
  }

  for (const exp of filters.experiences) {
    if (profile.experiences.includes(exp)) {
      const labels: Record<string, string> = {
        jantar: "Gosta de jantar",
        danca: "Gosta de dança",
        evento: "Companhia para evento",
        conversacao: "Boa conversação",
        nightlife: "Nightlife",
        musica: "Música",
        "arte-cultura": "Arte e cultura",
        gastronomia: "Gastronomia",
        viagem: "Viagem",
        fotografia: "Fotografia",
      };
      reasons.push(labels[exp] ?? exp);
    }
  }

  if (filters.heightMax && profile.heightCm <= filters.heightMax) {
    reasons.push(`Até ${(filters.heightMax / 100).toFixed(2).replace(".", ",")} m`);
  }

  if (
    filters.hairColors.includes("preto") ||
    filters.hairColors.includes("castanho")
  ) {
    if (profile.hairColor === "preto" || profile.hairColor === "castanho") {
      reasons.push("Cabelo escuro");
    }
  }

  const unique = [...new Set(reasons)];
  return unique.slice(0, 5);
}

function labelForScore(score: number): CompatibilityLabel {
  if (score >= 90) return "Combinação excelente";
  if (score >= 70) return "Muito compatível";
  return "Boa opção para agora";
}

export async function findMatches(
  filters: DiscoveryFilters,
): Promise<MatchResult[]> {
  await delay(200);

  const results: MatchResult[] = [];

  for (const profile of profiles) {
    const score = scoreProfile(profile, filters);
    if (score < 0) continue;

    const reasons =
      buildReasons(profile, filters).length > 0
        ? buildReasons(profile, filters)
        : profile.compatibilityReasons.slice(0, 4);

    results.push({
      profile,
      score,
      label: labelForScore(score),
      reasons,
    });
  }

  return results.sort((a, b) => b.score - a.score);
}

export async function estimateResultCount(
  filters: DiscoveryFilters,
): Promise<number> {
  const matches = await findMatches(filters);
  return matches.length;
}

export async function getProfileBySlug(
  slug: string,
): Promise<Profile | null> {
  await delay(80);
  return profiles.find((p) => p.slug === slug) ?? null;
}

export async function getProfileById(id: string): Promise<Profile | null> {
  await delay(50);
  return profiles.find((p) => p.id === id) ?? null;
}

export async function getAllProfiles(): Promise<Profile[]> {
  await delay(50);
  return profiles;
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
