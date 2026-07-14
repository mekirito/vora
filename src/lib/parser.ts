import type {
  DiscoveryFilters,
  DurationMinutes,
  ExperienceType,
  FilterChip,
  HairColor,
  Language,
  ParseResult,
  PersonalityTag,
} from "@/types";

const RACIAL_PATTERNS =
  /\b(raça|racial|etnia|étnic[oa]|negra|negro|branca|branco|parda|pardo|asiática|asiatico|indígena|morena?\b(?!\s*de\s*cabelo)|clara\s+de\s+pele|escura\s+de\s+pele)\b/i;

const HEIGHT_SHORT = /\b(baixinha|baixa|baixinho|petite)\b/i;
const HEIGHT_TALL = /\b(altinha|alta|alto|alta)\b/i;

function makeChip(
  id: string,
  label: string,
  category: string,
): FilterChip {
  return { id, label, category, removable: true };
}

export function parseNaturalQuery(text: string): ParseResult {
  const lower = text.toLowerCase();
  const chips: FilterChip[] = [];
  const filters: Partial<DiscoveryFilters> = {
    queryText: text,
  };
  const racialMentionWarning = RACIAL_PATTERNS.test(text);

  if (/\bagora\b|\bimediat[oa]\b|\bdispon[ií]vel\s+agora\b/i.test(lower)) {
    filters.availability = "agora";
    filters.availableNow = true;
    chips.push(makeChip("agora", "Agora", "momento"));
  } else if (/\bhoje\b/i.test(lower)) {
    filters.availability = "hoje";
    chips.push(makeChip("hoje", "Hoje", "momento"));
  }

  const kmMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*km/);
  if (kmMatch) {
    const radius = Math.min(30, Math.max(1, parseFloat(kmMatch[1].replace(",", "."))));
    filters.radiusKm = radius;
    chips.push(makeChip("radius", `Até ${radius.toString().replace(".", ",")} km`, "momento"));
  } else if (/\bperto\b|\bpróximo\b|\bproximo\b/i.test(lower)) {
    filters.radiusKm = 3;
    chips.push(makeChip("radius", "Até 3 km", "momento"));
  }

  if (HEIGHT_SHORT.test(lower)) {
    filters.heightMax = 162;
    chips.push(makeChip("height-max", "Até 1,62 m", "estilo"));
  } else if (HEIGHT_TALL.test(lower)) {
    filters.heightMin = 170;
    chips.push(makeChip("height-min", "A partir de 1,70 m", "estilo"));
  }

  const hairColors: HairColor[] = [];
  if (
    /\bcabelo\s+escuro\b|\bcabelos?\s+escuros?\b|\bcastanho\b|\bpreto\b|\bmorena?\b/i.test(
      lower,
    )
  ) {
    hairColors.push("castanho", "preto");
    chips.push(makeChip("hair-dark", "Cabelo escuro", "estilo"));
  }
  if (/\bloir[oa]\b|\bcabelo\s+claro\b/i.test(lower)) {
    hairColors.push("loiro");
    chips.push(makeChip("hair-blonde", "Loiro", "estilo"));
  }
  if (/\bruiv[oa]\b/i.test(lower)) {
    hairColors.push("ruivo");
    chips.push(makeChip("hair-red", "Ruivo", "estilo"));
  }
  if (hairColors.length) {
    filters.hairColors = [...new Set(hairColors)];
  }

  const languages: Language[] = [];
  if (/\bfranc[eê]s\b|\bfran[cç]ais\b/i.test(lower)) {
    languages.push("frances");
    chips.push(makeChip("lang-fr", "Francês", "conexao"));
  }
  if (/\bingl[eê]s\b|\benglish\b/i.test(lower)) {
    languages.push("ingles");
    chips.push(makeChip("lang-en", "Inglês", "conexao"));
  }
  if (/\bespanhol\b|\bspani/i.test(lower)) {
    languages.push("espanhol");
    chips.push(makeChip("lang-es", "Espanhol", "conexao"));
  }
  if (/\bitalian[oa]?\b/i.test(lower)) {
    languages.push("italiano");
    chips.push(makeChip("lang-it", "Italiano", "conexao"));
  }
  if (languages.length) filters.languages = languages;

  const experiences: ExperienceType[] = [];
  if (/\bjantar\b|\bgastronom/i.test(lower)) {
    experiences.push("jantar");
    chips.push(makeChip("exp-jantar", "Jantar", "experiencia"));
  }
  if (/\bevento\b/i.test(lower)) {
    experiences.push("evento");
    chips.push(makeChip("exp-evento", "Evento", "experiencia"));
  }
  if (/\bdan[cç]ar?\b|\bdance\b/i.test(lower)) {
    experiences.push("danca");
    chips.push(makeChip("exp-danca", "Dança", "experiencia"));
  }
  if (/\bconversar\b|\bconversa\b|\bboa\s+conversa/i.test(lower)) {
    experiences.push("conversacao");
    chips.push(makeChip("exp-conversa", "Conversa", "experiencia"));
  }
  if (/\bnightlife\b|\bbalada\b|\bnoite\s+animada\b/i.test(lower)) {
    experiences.push("nightlife");
    chips.push(makeChip("exp-night", "Nightlife", "experiencia"));
  }
  if (/\bm[uú]sica\b/i.test(lower)) {
    experiences.push("musica");
    chips.push(makeChip("exp-musica", "Música", "experiencia"));
  }
  if (experiences.length) filters.experiences = experiences;

  const personality: PersonalityTag[] = [];
  if (/\bnoite\s+tranquila\b|\bcalma\b|\breservada?\b/i.test(lower)) {
    personality.push("reservada");
    chips.push(makeChip("pers-reservada", "Noite tranquila", "conexao"));
  }
  if (/\belegante\b/i.test(lower)) {
    personality.push("elegante");
    chips.push(makeChip("pers-elegante", "Elegante", "conexao"));
  }
  if (personality.length) filters.personalityTags = personality;

  const durationMatch = lower.match(/(\d+)\s*(min|minuto)/);
  if (durationMatch) {
    const mins = parseInt(durationMatch[1], 10);
    const valid: DurationMinutes[] = [30, 60, 90, 120];
    const closest = valid.reduce((prev, curr) =>
      Math.abs(curr - mins) < Math.abs(prev - mins) ? curr : prev,
    );
    filters.duration = closest;
    chips.push(makeChip("duration", `${closest} min`, "momento"));
  }

  return { filters, chips, racialMentionWarning };
}

export const QUICK_SUGGESTIONS = [
  { id: "agora", label: "Disponível agora", insert: "disponível agora" },
  { id: "2km", label: "Até 2 km", insert: "até 2 km" },
  { id: "ingles", label: "Fala inglês", insert: "fala inglês" },
  { id: "jantar", label: "Jantar", insert: "gosta de jantar" },
  { id: "evento", label: "Evento", insert: "companheira para evento" },
  { id: "danca", label: "Dança", insert: "gosta de dançar" },
  { id: "conversa", label: "Conversa", insert: "boa conversação" },
  { id: "tranquila", label: "Noite tranquila", insert: "noite tranquila" },
] as const;

export function defaultFilters(): DiscoveryFilters {
  return {
    availability: null,
    scheduledAt: null,
    duration: 60,
    radiusKm: 10,
    budgetMax: 3000,
    heightMin: null,
    heightMax: null,
    hairColors: [],
    hairLengths: [],
    styleTags: [],
    personalityTags: [],
    languages: [],
    experiences: [],
    interests: [],
    identityVerified: false,
    photosVerified: false,
    availableNow: false,
    recentlyUpdated: false,
    queryText: "",
  };
}
