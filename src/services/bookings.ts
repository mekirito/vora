import type {
  Booking,
  BookingRequestInput,
  BookingStatus,
  CheckInState,
} from "@/types";
import { assertTransition } from "@/lib/booking-state";
import { generateId, priceForDuration } from "@/lib/utils";
import { getProfileById } from "@/services/matching";

const defaultCheckIn = (): CheckInState => ({
  timeConfirmed: false,
  regionConfirmed: false,
  trustedContact: false,
  safetyCodeCreated: false,
  rulesAccepted: false,
  supportAware: false,
});

export async function createBooking(
  input: BookingRequestInput,
): Promise<Booking> {
  const profile = await getProfileById(input.profileId);
  if (!profile) throw new Error("Perfil não encontrado");

  const price = priceForDuration(profile.startingPrice30Min, input.duration);
  const now = new Date().toISOString();

  const booking: Booking = {
    id: generateId("bk"),
    profileId: profile.id,
    profileSlug: profile.slug,
    profileName: profile.firstName,
    profileImage: profile.images[0],
    status: "REQUESTED",
    date: input.date,
    time: input.time,
    duration: input.duration,
    experience: input.experience,
    region: input.region,
    message: input.message,
    notes: input.notes,
    price,
    createdAt: now,
    updatedAt: now,
    responseDeadline: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    checkIn: defaultCheckIn(),
  };

  return booking;
}

export function transitionBooking(
  booking: Booking,
  to: BookingStatus,
  extras: Partial<Booking> = {},
): Booking {
  assertTransition(booking.status, to);
  const now = new Date().toISOString();
  const next: Booking = {
    ...booking,
    ...extras,
    status: to,
    updatedAt: now,
  };

  if (to === "VIEWED") next.viewedAt = now;
  if (to === "ACCEPTED") {
    next.acceptedAt = now;
  }
  if (to === "AWAITING_PAYMENT") {
    next.paymentDeadline = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  }
  if (to === "CONFIRMED") next.paidAt = now;
  if (to === "IN_PROGRESS") next.startedAt = now;
  if (to === "CLIENT_FINISHED") next.clientFinishedAt = now;
  if (to === "PROVIDER_FINISHED") next.providerFinishedAt = now;
  if (to === "COMPLETED") next.completedAt = now;

  return next;
}

export function acceptAndAwaitPayment(booking: Booking): Booking {
  let next = booking;
  if (next.status === "REQUESTED") {
    next = transitionBooking(next, "VIEWED");
  }
  if (next.status === "VIEWED" || next.status === "REQUESTED") {
    next = transitionBooking(next, "ACCEPTED");
  }
  if (next.status === "ACCEPTED") {
    next = transitionBooking(next, "AWAITING_PAYMENT");
  }
  return next;
}

export function updateCheckIn(
  booking: Booking,
  patch: Partial<CheckInState>,
): Booking {
  return {
    ...booking,
    checkIn: { ...booking.checkIn, ...patch },
    updatedAt: new Date().toISOString(),
  };
}

export function isCheckInComplete(checkIn: CheckInState): boolean {
  return (
    checkIn.timeConfirmed &&
    checkIn.regionConfirmed &&
    checkIn.safetyCodeCreated &&
    checkIn.rulesAccepted &&
    checkIn.supportAware
  );
}

export function createSafetyCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}
