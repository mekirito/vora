import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Badge({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--border)] bg-white/5 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-[var(--silver)]",
        className,
      )}
      {...props}
    />
  );
}

export function Chip({
  className,
  onRemove,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { onRemove?: () => void }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--card-elevated)] px-3 py-1.5 text-xs text-[var(--ivory)]",
        className,
      )}
      {...props}
    >
      {children}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className="touch-target -mr-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-[var(--muted)] hover:bg-white/10 hover:text-white"
          aria-label="Remover filtro"
        >
          ×
        </button>
      ) : null}
    </span>
  );
}
