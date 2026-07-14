"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { APPLICATIONS_STORAGE_KEY } from "@/data/recruit";

const schema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  city: z.string().min(2, "Informe a cidade"),
  age: z.coerce
    .number({ invalid_type_error: "Informe a idade" })
    .int()
    .min(18, "É necessário ter 18 anos ou mais"),
  contact: z.string().min(5, "Informe e-mail ou telefone"),
  social: z.string().optional(),
  message: z.string().min(10, "Conte um pouco mais (mín. 10 caracteres)"),
  adultConfirm: z.boolean().refine((v) => v === true, {
    message: "Confirme que você tem 18 anos ou mais",
  }),
});

type FormValues = z.infer<typeof schema>;

interface StoredApplication extends FormValues {
  id: string;
  submittedAt: string;
}

export function RecruitForm() {
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      city: "Goiânia",
      social: "",
      message: "",
      adultConfirm: false,
    },
  });

  const onSubmit = (values: FormValues) => {
    const entry: StoredApplication = {
      ...values,
      id: `app_${Date.now().toString(36)}`,
      submittedAt: new Date().toISOString(),
    };

    try {
      const raw = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
      const list: StoredApplication[] = raw ? (JSON.parse(raw) as StoredApplication[]) : [];
      list.unshift(entry);
      localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(list.slice(0, 50)));
    } catch {
      /* ignore storage errors in prototype */
    }

    setDone(true);
    reset({
      city: "Goiânia",
      social: "",
      message: "",
      name: "",
      contact: "",
      age: undefined,
      adultConfirm: false,
    });
    toast.success("Candidatura registrada no protótipo.");
  };

  return (
    <section
      id="candidatura"
      className="scroll-mt-8 border-t border-[var(--border)] bg-[var(--carbon)] px-6 py-20 md:py-28"
      aria-labelledby="form-heading"
    >
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1fr_1.1fr] md:gap-16">
        <div className="space-y-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
            Candidatura
          </p>
          <h2
            id="form-heading"
            className="text-3xl font-semibold tracking-tight text-[var(--ivory)] md:text-4xl"
          >
            Quero fazer parte.
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-[var(--muted)]">
            No protótipo, os dados ficam só no seu navegador. Em produção, a
            curadoria entraria em contato com discrição.
          </p>
          {done ? (
            <p className="rounded-[16px] border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-3 text-sm text-[var(--ivory)]" role="status">
              Recebemos sua intenção. Obrigado — a VORA valoriza presença e
              critérios.
            </p>
          ) : null}
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 rounded-[24px] border border-[var(--border)] bg-[var(--graphite)] p-5 sm:p-7"
          noValidate
        >
          <div className="space-y-2">
            <label htmlFor="name" className="text-xs text-[var(--silver)]">
              Nome artístico / primeiro nome
            </label>
            <Input id="name" autoComplete="name" {...register("name")} />
            {errors.name ? (
              <p className="text-xs text-[var(--accent)]">{errors.name.message}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="city" className="text-xs text-[var(--silver)]">
                Cidade
              </label>
              <Input id="city" {...register("city")} />
              {errors.city ? (
                <p className="text-xs text-[var(--accent)]">{errors.city.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <label htmlFor="age" className="text-xs text-[var(--silver)]">
                Idade
              </label>
              <Input
                id="age"
                type="number"
                min={18}
                inputMode="numeric"
                {...register("age")}
              />
              {errors.age ? (
                <p className="text-xs text-[var(--accent)]">{errors.age.message}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="contact" className="text-xs text-[var(--silver)]">
              Contato (e-mail ou telefone)
            </label>
            <Input id="contact" autoComplete="email" {...register("contact")} />
            {errors.contact ? (
              <p className="text-xs text-[var(--accent)]">{errors.contact.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="social" className="text-xs text-[var(--silver)]">
              Instagram ou link (opcional)
            </label>
            <Input id="social" placeholder="@…" {...register("social")} />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-xs text-[var(--silver)]">
              Por que a VORA
            </label>
            <Textarea id="message" rows={4} {...register("message")} />
            {errors.message ? (
              <p className="text-xs text-[var(--accent)]">{errors.message.message}</p>
            ) : null}
          </div>

          <label className="flex items-start gap-3 text-sm text-[var(--silver)]">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-[var(--accent)]"
              {...register("adultConfirm")}
            />
            <span>Confirmo que tenho 18 anos ou mais.</span>
          </label>
          {errors.adultConfirm ? (
            <p className="text-xs text-[var(--accent)]">
              {errors.adultConfirm.message}
            </p>
          ) : null}

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            Enviar candidatura
          </Button>
          <p className="text-center text-[11px] text-[var(--muted)]">
            Sem envio real · dados fictícios de protótipo
          </p>
        </form>
      </div>
    </section>
  );
}
