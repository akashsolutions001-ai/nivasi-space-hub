import { cn } from "@/lib/utils";

export function NivasiLogo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="gradient-brand grid size-9 shrink-0 place-items-center rounded-xl shadow-soft">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
          <path
            d="M3.5 10.6 12 4l8.5 6.6"
            stroke="white"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.8 12.2V19a1 1 0 0 0 1 1h10.4a1 1 0 0 0 1-1v-6.8"
            stroke="white"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="14.6" r="1.7" fill="white" />
        </svg>
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block font-display text-[15px] font-bold tracking-tight text-foreground">
            Nivasi<span className="text-primary">Space</span>
          </span>
          <span className="mt-0.5 block text-[10px] font-medium tracking-wide text-muted-foreground">
            Admission Management
          </span>
        </span>
      )}
    </span>
  );
}
