import { BedDouble, Check, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap";

export function StatusPill({
  ok,
  okLabel,
  pendingLabel,
  className,
}: {
  ok: boolean;
  okLabel: string;
  pendingLabel: string;
  className?: string | undefined;
}) {
  return (
    <span
      className={cn(
        base,
        ok
          ? "bg-success/12 text-success"
          : "bg-warning/18 text-warning-foreground",
        className,
      )}
    >
      {ok ? <Check className="size-3" /> : <TriangleAlert className="size-3" />}
      {ok ? okLabel : pendingLabel}
    </span>
  );
}

export function PaymentBadge({ status, className }: { status: string; className?: string }) {
  return (
    <StatusPill
      ok={status === "completed"}
      okLabel="Paid"
      pendingLabel="Pending"
      className={className}
    />
  );
}

export function MattressBadge({ required, className }: { required: boolean; className?: string }) {
  return (
    <span
      className={cn(
        base,
        required ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground",
        className,
      )}
    >
      {required && <BedDouble className="size-3" />}
      {required ? "Required" : "Not required"}
    </span>
  );
}
