import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "neutral",
  onClick,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "neutral" | "brand" | "success" | "warning";
  onClick?: (() => void) | undefined;
}) {
  const tones = {
    neutral: "bg-muted text-muted-foreground",
    brand: "gradient-brand text-primary-foreground",
    success: "bg-success/12 text-success",
    warning: "bg-warning/20 text-warning-foreground",
  } as const;

  const Comp = onClick ? "button" : "div";

  return (
    <Comp
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-soft transition-all",
        onClick && "hover:-translate-y-0.5 hover:shadow-lift",
      )}
    >
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", tones[tone])}>
        <Icon className="size-[18px]" />
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          {label}
        </span>
        <span className="block text-xl font-bold tabular-nums">{value}</span>
      </span>
    </Comp>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string | undefined;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-14 text-center">
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
