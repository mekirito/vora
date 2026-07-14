"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  side?: "bottom" | "right";
  className?: string;
}

export function Sheet({
  open,
  onClose,
  title,
  children,
  side = "bottom",
  className,
}: SheetProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    panel?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus();
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  const isBottom = side === "bottom";

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[80]" role="presentation">
          <motion.button
            type="button"
            aria-label="Fechar"
            className="absolute inset-0 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            tabIndex={-1}
            className={cn(
              "absolute glass outline-none",
              isBottom
                ? "inset-x-0 bottom-0 max-h-[88dvh] rounded-t-[24px] md:inset-y-0 md:right-0 md:left-auto md:max-h-none md:w-full md:max-w-md md:rounded-none md:rounded-l-[24px]"
                : "inset-y-0 right-0 w-full max-w-md rounded-l-[24px]",
              className,
            )}
            initial={
              reduce
                ? false
                : isBottom
                  ? { y: "100%" }
                  : { x: "100%" }
            }
            animate={isBottom ? { y: 0 } : { x: 0 }}
            exit={
              reduce
                ? undefined
                : isBottom
                  ? { y: "100%" }
                  : { x: "100%" }
            }
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
              <h2 id={titleId} className="text-base font-medium tracking-tight">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="touch-target inline-flex items-center justify-center rounded-full hover:bg-white/5"
                aria-label="Fechar painel"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-4" style={{ maxHeight: "calc(88dvh - 64px)" }}>
              {children}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
