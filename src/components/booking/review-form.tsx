"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import type { PrivateReview } from "@/types";
import { useVoraStore } from "@/stores/vora-store";
import { toast } from "sonner";

const CRITERIA = [
  { key: "communication" as const, label: "Comunicação" },
  { key: "punctuality" as const, label: "Pontualidade" },
  { key: "respect" as const, label: "Respeito" },
  { key: "overall" as const, label: "Experiência geral" },
  { key: "safety" as const, label: "Sensação de segurança" },
];

interface ReviewFormProps {
  bookingId: string;
  onSubmitted?: () => void;
}

export function ReviewForm({ bookingId, onSubmitted }: ReviewFormProps) {
  const submitReview = useVoraStore((s) => s.submitReview);
  const existing = useVoraStore((s) => s.reviews[bookingId]);
  const [scores, setScores] = useState<Record<string, number>>({
    communication: 5,
    punctuality: 5,
    respect: 5,
    overall: 5,
    safety: 5,
  });
  const [comment, setComment] = useState("");
  const [report, setReport] = useState(false);

  if (existing) {
    return (
      <div className="rounded-[20px] border border-[var(--border)] bg-[var(--graphite)] p-5 text-center">
        <p className="text-sm text-[var(--muted)]">Avaliação enviada. Obrigado pelo feedback privado.</p>
      </div>
    );
  }

  const submit = () => {
    const review: PrivateReview = {
      bookingId,
      communication: scores.communication,
      punctuality: scores.punctuality,
      respect: scores.respect,
      overall: scores.overall,
      safety: scores.safety,
      comment,
      reportMisconduct: report,
      submittedAt: new Date().toISOString(),
    };
    submitReview(review);
    toast.success("Avaliação registrada");
    onSubmitted?.();
  };

  return (
    <div className="space-y-5 rounded-[20px] border border-[var(--border)] bg-[var(--graphite)] p-5">
      <div>
        <h2 className="text-base font-medium">Avaliação privada</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Critérios de conduta e experiência — sem avaliação de aparência.
        </p>
      </div>

      {CRITERIA.map((c) => (
        <div key={c.key} className="space-y-2">
          <label className="text-sm">{c.label}</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setScores((s) => ({ ...s, [c.key]: n }))}
                className={`touch-target h-11 w-11 rounded-[12px] border text-sm ${
                  scores[c.key] >= n
                    ? "border-[var(--accent)] bg-[var(--accent)]/20 text-[var(--ivory)]"
                    : "border-[var(--border)] text-[var(--muted)]"
                }`}
                aria-label={`${n} de 5`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div>
        <label htmlFor="review-comment" className="text-sm">
          Comentário (opcional)
        </label>
        <Textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Como foi a experiência?"
          className="mt-2"
        />
      </div>

      <label className="flex touch-target items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={report}
          onChange={(e) => setReport(e.target.checked)}
          className="h-4 w-4 accent-[var(--accent)]"
        />
        Reportar conduta inadequada
      </label>

      <Button className="w-full" onClick={submit}>
        Enviar avaliação
      </Button>
    </div>
  );
}
