"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Booking,
  ChatMessage,
  DiscoveryFilters,
  FavoriteEntry,
  FilterChip,
  MatchResult,
  PaymentSimulation,
  PrivateReview,
  UserSession,
} from "@/types";
import { defaultFilters } from "@/lib/parser";
import {
  acceptAndAwaitPayment,
  createBooking,
  createSafetyCode,
  isCheckInComplete,
  transitionBooking,
  updateCheckIn,
} from "@/services/bookings";
import { createInitialChat, createClientMessage } from "@/services/chat";
import { createPixPayment, simulatePaymentApproval } from "@/services/payments";
import type { BookingRequestInput, CheckInState } from "@/types";

interface VoraState {
  session: UserSession;
  filters: DiscoveryFilters;
  chips: FilterChip[];
  racialWarning: boolean;
  matches: MatchResult[];
  matchIndex: number;
  passedIds: string[];
  lastPassed: MatchResult | null;
  isSearching: boolean;
  favorites: FavoriteEntry[];
  bookings: Booking[];
  payments: Record<string, PaymentSimulation>;
  chats: Record<string, ChatMessage[]>;
  reviews: Record<string, PrivateReview>;

  setAgeVerified: () => void;
  completeOnboarding: (privacy: "discreet" | "standard") => void;
  setFilters: (filters: Partial<DiscoveryFilters>) => void;
  setChips: (chips: FilterChip[]) => void;
  removeChip: (id: string) => void;
  setRacialWarning: (v: boolean) => void;
  setMatches: (matches: MatchResult[]) => void;
  setMatchIndex: (i: number) => void;
  setSearching: (v: boolean) => void;
  passCurrent: () => void;
  undoPass: () => void;
  toggleFavorite: (profileId: string) => void;
  isFavorite: (profileId: string) => boolean;

  requestBooking: (input: BookingRequestInput) => Promise<Booking>;
  getBooking: (id: string) => Booking | undefined;
  demoProviderViewed: (id: string) => void;
  demoProviderAccepted: (id: string) => Promise<void>;
  demoProviderRejected: (id: string) => void;
  demoPaymentApproved: (id: string) => Promise<void>;
  demoProviderCheckIn: (id: string) => void;
  demoProviderFinished: (id: string) => void;
  demoOpenDispute: (id: string) => void;
  updateBookingCheckIn: (id: string, patch: Partial<CheckInState>) => void;
  startEncounter: (id: string) => void;
  clientFinish: (id: string, hadProblem: boolean, reason?: string) => void;
  sendChatMessage: (bookingId: string, text: string) => void;
  submitReview: (review: PrivateReview) => void;
  cancelBooking: (id: string) => void;
}

export const useVoraStore = create<VoraState>()(
  persist(
    (set, get) => ({
      session: {
        ageVerified: false,
        onboardingComplete: false,
        identityStatus: "verified",
        privacyMode: "discreet",
        city: "Goiânia",
        displayName: "Você",
      },
      filters: defaultFilters(),
      chips: [],
      racialWarning: false,
      matches: [],
      matchIndex: 0,
      passedIds: [],
      lastPassed: null,
      isSearching: false,
      favorites: [],
      bookings: [],
      payments: {},
      chats: {},
      reviews: {},

      setAgeVerified: () =>
        set((s) => ({
          session: { ...s.session, ageVerified: true },
        })),

      completeOnboarding: (privacy) =>
        set((s) => ({
          session: {
            ...s.session,
            onboardingComplete: true,
            privacyMode: privacy,
            identityStatus: "verified",
          },
        })),

      setFilters: (partial) =>
        set((s) => ({
          filters: { ...s.filters, ...partial },
        })),

      setChips: (chips) => set({ chips }),

      removeChip: (id) =>
        set((s) => ({
          chips: s.chips.filter((c) => c.id !== id),
        })),

      setRacialWarning: (v) => set({ racialWarning: v }),

      setMatches: (matches) =>
        set({ matches, matchIndex: 0, passedIds: [], lastPassed: null }),

      setMatchIndex: (i) => set({ matchIndex: i }),

      setSearching: (v) => set({ isSearching: v }),

      passCurrent: () => {
        const { matches, matchIndex } = get();
        const current = matches[matchIndex];
        if (!current) return;
        set({
          lastPassed: current,
          passedIds: [...get().passedIds, current.profile.id],
          matchIndex: matchIndex + 1,
        });
      },

      undoPass: () => {
        const { lastPassed, matchIndex, passedIds } = get();
        if (!lastPassed || matchIndex === 0) return;
        set({
          matchIndex: matchIndex - 1,
          passedIds: passedIds.slice(0, -1),
          lastPassed: null,
        });
      },

      toggleFavorite: (profileId) => {
        const { favorites } = get();
        const exists = favorites.some((f) => f.profileId === profileId);
        if (exists) {
          set({ favorites: favorites.filter((f) => f.profileId !== profileId) });
        } else {
          set({
            favorites: [
              ...favorites,
              { profileId, addedAt: new Date().toISOString() },
            ],
          });
        }
      },

      isFavorite: (profileId) =>
        get().favorites.some((f) => f.profileId === profileId),

      requestBooking: async (input) => {
        const booking = await createBooking(input);
        set((s) => ({ bookings: [booking, ...s.bookings] }));
        return booking;
      },

      getBooking: (id) => get().bookings.find((b) => b.id === id),

      demoProviderViewed: (id) => {
        const booking = get().getBooking(id);
        if (!booking || booking.status !== "REQUESTED") return;
        const next = transitionBooking(booking, "VIEWED");
        set((s) => ({
          bookings: s.bookings.map((b) => (b.id === id ? next : b)),
        }));
      },

      demoProviderAccepted: async (id) => {
        const booking = get().getBooking(id);
        if (!booking) return;
        const accepted = acceptAndAwaitPayment(booking);
        const payment = await createPixPayment(id, accepted.price);
        set((s) => ({
          bookings: s.bookings.map((b) => (b.id === id ? accepted : b)),
          payments: { ...s.payments, [id]: payment },
        }));
      },

      demoProviderRejected: (id) => {
        const booking = get().getBooking(id);
        if (!booking) return;
        if (!["REQUESTED", "VIEWED"].includes(booking.status)) return;
        const from =
          booking.status === "REQUESTED"
            ? transitionBooking(booking, "VIEWED")
            : booking;
        const next = transitionBooking(from, "REJECTED");
        set((s) => ({
          bookings: s.bookings.map((b) => (b.id === id ? next : b)),
        }));
      },

      demoPaymentApproved: async (id) => {
        const booking = get().getBooking(id);
        const payment = get().payments[id];
        if (!booking || !payment) return;

        const processing = transitionBooking(booking, "PAYMENT_PROCESSING");
        set((s) => ({
          bookings: s.bookings.map((b) => (b.id === id ? processing : b)),
          payments: {
            ...s.payments,
            [id]: { ...payment, status: "processing" },
          },
        }));

        const approved = await simulatePaymentApproval(payment);
        const confirmed = transitionBooking(processing, "CONFIRMED");
        const withCheckIn = transitionBooking(confirmed, "CHECK_IN_REQUIRED");
        const chat = createInitialChat(id);

        set((s) => ({
          bookings: s.bookings.map((b) => (b.id === id ? withCheckIn : b)),
          payments: { ...s.payments, [id]: approved },
          chats: { ...s.chats, [id]: chat },
        }));
      },

      demoProviderCheckIn: (id) => {
        // visual cue only in prototype
        void id;
      },

      demoProviderFinished: (id) => {
        const booking = get().getBooking(id);
        if (!booking) return;

        if (booking.status === "IN_PROGRESS") {
          const next = transitionBooking(booking, "PROVIDER_FINISHED");
          set((s) => ({
            bookings: s.bookings.map((b) => (b.id === id ? next : b)),
          }));
          return;
        }

        if (booking.status === "CLIENT_FINISHED") {
          const pending = transitionBooking(booking, "COMPLETION_PENDING");
          const completed = transitionBooking(pending, "COMPLETED");
          set((s) => ({
            bookings: s.bookings.map((b) => (b.id === id ? completed : b)),
          }));
        }
      },

      demoOpenDispute: (id) => {
        const booking = get().getBooking(id);
        if (!booking) return;
        try {
          const next = transitionBooking(booking, "UNDER_REVIEW", {
            hasDispute: true,
            disputeReason: "Divergência simulada no modo demo",
          });
          set((s) => ({
            bookings: s.bookings.map((b) => (b.id === id ? next : b)),
          }));
        } catch {
          try {
            const next = transitionBooking(booking, "DISPUTED", {
              hasDispute: true,
            });
            set((s) => ({
              bookings: s.bookings.map((b) => (b.id === id ? next : b)),
            }));
          } catch {
            /* ignore invalid */
          }
        }
      },

      updateBookingCheckIn: (id, patch) => {
        const booking = get().getBooking(id);
        if (!booking) return;
        let next = updateCheckIn(booking, patch);
        if (
          patch.safetyCodeCreated &&
          !booking.safetyCode &&
          !next.safetyCode
        ) {
          next = { ...next, safetyCode: createSafetyCode() };
        }
        set((s) => ({
          bookings: s.bookings.map((b) => (b.id === id ? next : b)),
        }));
      },

      startEncounter: (id) => {
        const booking = get().getBooking(id);
        if (!booking || booking.status !== "CHECK_IN_REQUIRED") return;
        if (!isCheckInComplete(booking.checkIn)) return;
        const next = transitionBooking(booking, "IN_PROGRESS");
        set((s) => ({
          bookings: s.bookings.map((b) => (b.id === id ? next : b)),
        }));
      },

      clientFinish: (id, hadProblem, reason) => {
        const booking = get().getBooking(id);
        if (!booking) return;

        if (hadProblem) {
          try {
            const next = transitionBooking(booking, "DISPUTED", {
              hasDispute: true,
              disputeReason: reason,
              clientFinishedAt: new Date().toISOString(),
            });
            set((s) => ({
              bookings: s.bookings.map((b) => (b.id === id ? next : b)),
            }));
          } catch {
            const next = transitionBooking(booking, "UNDER_REVIEW", {
              hasDispute: true,
              disputeReason: reason,
            });
            set((s) => ({
              bookings: s.bookings.map((b) => (b.id === id ? next : b)),
            }));
          }
          return;
        }

        if (booking.status === "IN_PROGRESS") {
          const next = transitionBooking(booking, "CLIENT_FINISHED");
          set((s) => ({
            bookings: s.bookings.map((b) => (b.id === id ? next : b)),
          }));
          return;
        }

        if (booking.status === "PROVIDER_FINISHED") {
          const pending = transitionBooking(booking, "COMPLETION_PENDING");
          const completed = transitionBooking(pending, "COMPLETED");
          set((s) => ({
            bookings: s.bookings.map((b) => (b.id === id ? completed : b)),
          }));
        }
      },

      sendChatMessage: (bookingId, text) => {
        const msg = createClientMessage(bookingId, text);
        set((s) => ({
          chats: {
            ...s.chats,
            [bookingId]: [...(s.chats[bookingId] ?? []), msg],
          },
        }));
      },

      submitReview: (review) =>
        set((s) => ({
          reviews: { ...s.reviews, [review.bookingId]: review },
        })),

      cancelBooking: (id) => {
        const booking = get().getBooking(id);
        if (!booking) return;
        try {
          const next = transitionBooking(booking, "CANCELED");
          set((s) => ({
            bookings: s.bookings.map((b) => (b.id === id ? next : b)),
          }));
        } catch {
          /* invalid */
        }
      },
    }),
    {
      name: "vora-client-v1",
      partialize: (s) => ({
        session: s.session,
        filters: s.filters,
        chips: s.chips,
        favorites: s.favorites,
        bookings: s.bookings,
        payments: s.payments,
        chats: s.chats,
        reviews: s.reviews,
        matches: s.matches,
        matchIndex: s.matchIndex,
        passedIds: s.passedIds,
      }),
    },
  ),
);
