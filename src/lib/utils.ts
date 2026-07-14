import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { DurationMinutes } from "@/types";
import { MINIMUM_PRICE } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1).replace(".", ",")} km`;
}

export function formatHeight(cm: number): string {
  const meters = (cm / 100).toFixed(2).replace(".", ",");
  return `${meters} m`;
}

export function priceForDuration(
  startingPrice30Min: number,
  duration: DurationMinutes,
): number {
  const slots = duration / 30;
  const computed = Math.round(startingPrice30Min * slots);
  return Math.max(computed, MINIMUM_PRICE[duration]);
}

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return "00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function verificationLabel(
  level: "none" | "identity" | "photos" | "full",
): string {
  switch (level) {
    case "full":
      return "Verificado";
    case "photos":
      return "Fotos verificadas";
    case "identity":
      return "Identidade verificada";
    default:
      return "Não verificado";
  }
}
