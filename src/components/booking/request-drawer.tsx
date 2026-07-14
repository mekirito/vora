"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useVoraStore } from "@/stores/vora-store";
import { formatCurrency, priceForDuration } from "@/lib/utils";
import type { DurationMinutes, ExperienceType, Profile } from "@/types";
import { toast } from "sonner";

const EXPERIENCE_LABELS: Record<ExperienceType, string> = {
  jantar: "Jantar",
  evento: "Evento",
  nightlife: "Nightlife",
  conversacao: "Conversação",
  danca: "Dança",
  musica: "Música",
  "arte-cultura": "Arte e cultura",
  fotografia: "Fotografia",
  viagem: "Viagem",
  gastronomia: "Gastronomia",
};

const schema = z.object({
  date: z.string().min(1, "Informe a data"),
  time: z.string().min(1, "Informe o horário"),
  duration: z.coerce
    .number()
    .pipe(z.union([z.literal(30), z.literal(60), z.literal(90), z.literal(120)])),
  experience: z.string().min(1, "Selecione a experiência"),
  region: z.string().min(1, "Informe a região"),
  message: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface RequestDrawerProps {
  open: boolean;
  onClose: () => void;
  profile: Profile;
}

export function RequestDrawer({ open, onClose, profile }: RequestDrawerProps) {
  const router = useRouter();
  const requestBooking = useVoraStore((s) => s.requestBooking);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      time: "20:00",
      duration: profile.availableDurations.includes(60) ? 60 : profile.availableDurations[0],
      experience: profile.experiences[0],
      region: profile.region,
      message: "",
      notes: "",
    },
  });

  const duration = watch("duration") as DurationMinutes;
  const price = priceForDuration(profile.startingPrice30Min, duration);

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const booking = await requestBooking({
        profileId: profile.id,
        date: values.date,
        time: values.time,
        duration: values.duration as DurationMinutes,
        experience: values.experience as ExperienceType,
        region: values.region,
        message: values.message,
        notes: values.notes,
      });
      toast.success("Solicitação enviada");
      onClose();
      router.push(`/reserva/${booking.id}`);
    } catch {
      toast.error("Não foi possível enviar a solicitação");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Sheet open={open} onClose={onClose} title={`Solicitar encontro · ${profile.firstName}`}>
      <form onSubmit={(e) => void onSubmit(e)} className="space-y-4 pb-6">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="req-date" className="text-xs text-[var(--muted)]">
              Data
            </label>
            <Input id="req-date" type="date" {...register("date")} className="mt-1" />
            {errors.date ? (
              <p className="mt-1 text-xs text-[var(--accent)]">{errors.date.message}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="req-time" className="text-xs text-[var(--muted)]">
              Horário
            </label>
            <Input id="req-time" type="time" {...register("time")} className="mt-1" />
            {errors.time ? (
              <p className="mt-1 text-xs text-[var(--accent)]">{errors.time.message}</p>
            ) : null}
          </div>
        </div>

        <div>
          <label htmlFor="req-duration" className="text-xs text-[var(--muted)]">
            Duração
          </label>
          <select
            id="req-duration"
            {...register("duration")}
            className="mt-1 flex h-12 w-full rounded-[16px] border border-[var(--border)] bg-[var(--card)] px-4 text-sm"
          >
            {profile.availableDurations.map((d) => (
              <option key={d} value={d}>
                {d} min
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="req-exp" className="text-xs text-[var(--muted)]">
            Experiência
          </label>
          <select
            id="req-exp"
            {...register("experience")}
            className="mt-1 flex h-12 w-full rounded-[16px] border border-[var(--border)] bg-[var(--card)] px-4 text-sm"
          >
            {profile.experiences.map((e) => (
              <option key={e} value={e}>
                {EXPERIENCE_LABELS[e]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="req-region" className="text-xs text-[var(--muted)]">
            Região
          </label>
          <Input id="req-region" {...register("region")} className="mt-1" />
          {errors.region ? (
            <p className="mt-1 text-xs text-[var(--accent)]">{errors.region.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="req-message" className="text-xs text-[var(--muted)]">
            Mensagem
          </label>
          <Textarea
            id="req-message"
            {...register("message")}
            placeholder="Conte brevemente o que você imagina para o encontro…"
            className="mt-1 min-h-[80px]"
          />
        </div>

        <div>
          <label htmlFor="req-notes" className="text-xs text-[var(--muted)]">
            Observações (opcional)
          </label>
          <Textarea id="req-notes" {...register("notes")} className="mt-1 min-h-[60px]" />
        </div>

        <div className="rounded-[16px] border border-[var(--border)] bg-[var(--card)] p-4">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--muted)]">Estimativa</span>
            <span className="font-medium">{formatCurrency(price)}</span>
          </div>
          <p className="mt-2 text-[11px] text-[var(--muted)]">
            Pagamento só após aceite. Dados protegidos — identidade verificada.
          </p>
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Enviando…" : "Enviar solicitação"}
        </Button>
      </form>
    </Sheet>
  );
}
