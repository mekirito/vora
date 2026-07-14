export type VerificationLevel = "none" | "identity" | "photos" | "full";

export type HairColor =
  | "preto"
  | "castanho"
  | "loiro"
  | "ruivo"
  | "colorido"
  | "grisalho";

export type HairLength = "curto" | "medio" | "longo";

export type StyleTag =
  | "discreta"
  | "fashion"
  | "classica"
  | "alternativa"
  | "esportiva"
  | "elegante"
  | "casual";

export type PersonalityTag =
  | "boa-conversacao"
  | "extrovertida"
  | "reservada"
  | "elegante"
  | "espontanea"
  | "cultural"
  | "aventureira"
  | "calorosa";

export type ExperienceType =
  | "jantar"
  | "evento"
  | "nightlife"
  | "conversacao"
  | "danca"
  | "musica"
  | "arte-cultura"
  | "fotografia"
  | "viagem"
  | "gastronomia";

export type Language =
  | "portugues"
  | "ingles"
  | "frances"
  | "espanhol"
  | "italiano"
  | "alemao";

export type DurationMinutes = 30 | 60 | 90 | 120;

export type CompatibilityLabel =
  | "Combinação excelente"
  | "Muito compatível"
  | "Boa opção para agora";

export type BookingStatus =
  | "DRAFT"
  | "REQUESTED"
  | "VIEWED"
  | "ACCEPTED"
  | "REJECTED"
  | "EXPIRED"
  | "AWAITING_PAYMENT"
  | "PAYMENT_PROCESSING"
  | "CONFIRMED"
  | "CHECK_IN_REQUIRED"
  | "IN_PROGRESS"
  | "CLIENT_FINISHED"
  | "PROVIDER_FINISHED"
  | "COMPLETION_PENDING"
  | "COMPLETED"
  | "CANCELED"
  | "DISPUTED"
  | "UNDER_REVIEW";

export interface ReviewSummary {
  communication: number;
  punctuality: number;
  respect: number;
  overall: number;
  safety: number;
  count: number;
  highlight?: string;
}

export interface ProfileAvailability {
  now: boolean;
  nextSlots: string[];
  updatedAt: string;
}

export interface Profile {
  id: string;
  slug: string;
  firstName: string;
  age: number;
  heightCm: number;
  hairColor: HairColor;
  hairLength: HairLength;
  styleTags: StyleTag[];
  personalityTags: PersonalityTag[];
  languages: Language[];
  experiences: ExperienceType[];
  interests: string[];
  distanceKm: number;
  isAvailableNow: boolean;
  verificationLevel: VerificationLevel;
  startingPrice30Min: number;
  availableDurations: DurationMinutes[];
  bio: string;
  tagline: string;
  compatibilityReasons: string[];
  images: string[];
  reviewSummary: ReviewSummary;
  availability: ProfileAvailability;
  region: string;
  tattoos: boolean;
}

export interface DiscoveryFilters {
  availability: "agora" | "hoje" | "agendar" | null;
  scheduledAt: string | null;
  duration: DurationMinutes;
  radiusKm: number;
  budgetMax: number;
  heightMin: number | null;
  heightMax: number | null;
  hairColors: HairColor[];
  hairLengths: HairLength[];
  styleTags: StyleTag[];
  personalityTags: PersonalityTag[];
  languages: Language[];
  experiences: ExperienceType[];
  interests: string[];
  identityVerified: boolean;
  photosVerified: boolean;
  availableNow: boolean;
  recentlyUpdated: boolean;
  queryText: string;
}

export interface FilterChip {
  id: string;
  label: string;
  category: string;
  removable: boolean;
}

export interface ParseResult {
  filters: Partial<DiscoveryFilters>;
  chips: FilterChip[];
  racialMentionWarning: boolean;
}

export interface MatchResult {
  profile: Profile;
  label: CompatibilityLabel;
  reasons: string[];
  score: number;
}

export interface BookingRequestInput {
  profileId: string;
  date: string;
  time: string;
  duration: DurationMinutes;
  experience: ExperienceType;
  region: string;
  message?: string;
  notes?: string;
}

export interface Booking {
  id: string;
  profileId: string;
  profileSlug: string;
  profileName: string;
  profileImage: string;
  status: BookingStatus;
  date: string;
  time: string;
  duration: DurationMinutes;
  experience: ExperienceType;
  region: string;
  message?: string;
  notes?: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  viewedAt?: string;
  acceptedAt?: string;
  paidAt?: string;
  startedAt?: string;
  clientFinishedAt?: string;
  providerFinishedAt?: string;
  completedAt?: string;
  responseDeadline?: string;
  paymentDeadline?: string;
  safetyCode?: string;
  checkIn: CheckInState;
  hasDispute?: boolean;
  disputeReason?: string;
}

export interface CheckInState {
  timeConfirmed: boolean;
  regionConfirmed: boolean;
  trustedContact: boolean;
  safetyCodeCreated: boolean;
  rulesAccepted: boolean;
  supportAware: boolean;
}

export interface ChatMessage {
  id: string;
  bookingId: string;
  sender: "system" | "client" | "provider";
  text: string;
  createdAt: string;
  blocked?: boolean;
}

export interface PaymentSimulation {
  bookingId: string;
  amount: number;
  pixCode: string;
  qrSeed: string;
  receiver: string;
  expiresAt: string;
  status: "pending" | "processing" | "approved" | "expired";
}

export interface PrivateReview {
  bookingId: string;
  communication: number;
  punctuality: number;
  respect: number;
  overall: number;
  safety: number;
  comment: string;
  reportMisconduct: boolean;
  submittedAt: string;
}

export interface FavoriteEntry {
  profileId: string;
  addedAt: string;
}

export interface UserSession {
  ageVerified: boolean;
  onboardingComplete: boolean;
  identityStatus: "pending" | "verified";
  privacyMode: "discreet" | "standard";
  city: string;
  displayName: string;
}

export const MINIMUM_PRICE: Record<DurationMinutes, number> = {
  30: 500,
  60: 1000,
  90: 1500,
  120: 2000,
};
