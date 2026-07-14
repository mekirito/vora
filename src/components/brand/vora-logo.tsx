import { cn } from "@/lib/utils";

type Variant = "full" | "symbol" | "monochrome" | "compact";

interface VoraLogoProps {
  variant?: Variant;
  className?: string;
  symbolClassName?: string;
}

function OrbitSymbol({
  className,
  monochrome,
}: {
  className?: string;
  monochrome?: boolean;
}) {
  const stroke = monochrome ? "currentColor" : "#FF2A16";
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-8", className)}
      aria-hidden="true"
    >
      <path
        d="M26.5 16c0 2.4-.8 4.6-2.2 6.4"
        stroke={stroke}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M22.8 24.8A10.5 10.5 0 0 1 8.4 23"
        stroke={stroke}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M5.5 16c0-2.4.8-4.6 2.2-6.4"
        stroke={stroke}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M9.2 7.2A10.5 10.5 0 0 1 23.6 9"
        stroke={stroke}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="16" cy="16" r="2.2" fill={monochrome ? "currentColor" : "#F3F2EE"} />
    </svg>
  );
}

export function VoraLogo({
  variant = "full",
  className,
  symbolClassName,
}: VoraLogoProps) {
  const monochrome = variant === "monochrome";
  const compact = variant === "compact";

  if (variant === "symbol") {
    return (
      <span className={cn("inline-flex", className)} aria-label="VORA">
        <OrbitSymbol className={symbolClassName} monochrome={monochrome} />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center text-[var(--ivory)]",
        className,
      )}
      aria-label="VORA"
    >
      <span
        className={cn(
          "inline-flex items-center font-semibold tracking-[0.06em]",
          compact ? "text-base gap-0" : "text-xl gap-0",
          monochrome && "text-current",
        )}
      >
        <span>V</span>
        <span className="sr-only">O</span>
        <OrbitSymbol
          className={cn(
            compact ? "mx-0.5 h-[0.95em] w-[0.95em]" : "mx-0.5 h-[1em] w-[1em]",
            symbolClassName,
          )}
          monochrome={monochrome}
        />
        <span>RA</span>
      </span>
    </span>
  );
}

export function OrbitLoader({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-16 w-16", className)} aria-hidden="true">
      <svg viewBox="0 0 64 64" className="h-full w-full orbit-spin">
        <path
          d="M53 32c0 4.8-1.6 9.2-4.4 12.8"
          stroke="#FF2A16"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M45.6 49.6A21 21 0 0 1 16.8 46"
          stroke="#FF2A16"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M11 32c0-4.8 1.6-9.2 4.4-12.8"
          stroke="#C7C9CC"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M18.4 14.4A21 21 0 0 1 47.2 18"
          stroke="#C7C9CC"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-2.5 w-2.5 rounded-full bg-[var(--ivory)]" />
      </div>
    </div>
  );
}
