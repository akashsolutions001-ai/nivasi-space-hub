import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Receipt, ChevronDown, Clock, CheckCircle2, XCircle, RefreshCw } from "lucide-react";

import { AdminShell } from "@/components/nivasi/admin-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { useLaundryEmployeeByUid, usePayoutsByLaundry, useLaundries } from "@/lib/hooks";
import { formatINR, formatDate } from "@/lib/format";
import type { Payout, PayoutStatus, PayoutType } from "@/lib/types";

export const Route = createFileRoute("/employee/laundry/payouts")({
  head: () => ({ meta: [{ title: "My Laundry Payouts — NivasiSpace" }] }),
  component: LaundryEmployeePayoutsPage,
});

// ── helpers ───────────────────────────────────────────────────────────────────

const PAYOUT_TYPES: Record<PayoutType, string> = {
  MESS: "Mess", TIFFIN: "Tiffin", LAUNDRY: "Laundry",
  CLEANING_STAFF: "Cleaning Staff", SERVICE_PROVIDER: "Service Provider",
  REFUND: "Refund", OTHER: "Other",
};

const STATUS_COLORS: Record<PayoutStatus, string> = {
  PENDING:    "border-warning/30 bg-warning/10 text-warning-foreground",
  PROCESSING: "border-primary/30 bg-primary/10 text-primary",
  PAID:       "border-success/30 bg-success/10 text-success",
  FAILED:     "border-destructive/30 bg-destructive/10 text-destructive",
  CANCELLED:  "border-border bg-muted text-muted-foreground",
};

const STATUS_ICONS: Record<PayoutStatus, React.ReactNode> = {
  PENDING:    <Clock className="size-3.5" />,
  PROCESSING: <RefreshCw className="size-3.5" />,
  PAID:       <CheckCircle2 className="size-3.5" />,
  FAILED:     <XCircle className="size-3.5" />,
  CANCELLED:  <XCircle className="size-3.5" />,
};

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}

function ReceiptCard({ payout }: { payout: Payout }) {
  const [expanded, setExpanded] = useState(false);
  const p = payout as any;

  return (
    <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
      <button
        className="flex w-full items-start justify-between gap-3 p-4 text-left"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-primary">{payout.payoutId}</span>
            <Badge variant="outline" className={`text-[11px] font-semibold ${STATUS_COLORS[payout.status]}`}>
              {STATUS_ICONS[payout.status]}
              <span className="ml-1">{payout.status}</span>
            </Badge>
          </div>
          <p className="mt-1 truncate text-sm font-semibold">{payout.purpose}</p>
          <p className="text-xs text-muted-foreground">{formatDate(payout.createdAt)} · {PAYOUT_TYPES[payout.payoutType]}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="text-lg font-bold">{formatINR(payout.amount)}</span>
          <ChevronDown className={`size-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border bg-muted/20 px-4 py-3">
          <div className="rounded-xl border border-border bg-card p-4 space-y-2 font-mono text-xs">
            <div className="flex justify-between gap-2 border-b border-dashed border-border pb-2 mb-2">
              <span className="font-display text-sm font-bold not-italic">PAYOUT RECEIPT</span>
              <span className="text-muted-foreground">{payout.payoutId}</span>
            </div>
            <Row label="Date"           value={formatDate(payout.createdAt)} />
            <Row label="Recipient"      value={payout.recipientName} />
            {payout.recipientPhone && <Row label="Phone"  value={payout.recipientPhone} />}
            {payout.recipientEmail && <Row label="Email"  value={payout.recipientEmail} />}
            <div className="border-t border-dashed border-border my-1" />
            <Row label="Type"           value={PAYOUT_TYPES[payout.payoutType]} />
            <Row label="Purpose"        value={payout.purpose} />
            {p.laundryName   && <Row label="Laundry"  value={p.laundryName} />}
            {payout.servicePeriod && <Row label="Period" value={payout.servicePeriod} />}
            {payout.service  && <Row label="Service"  value={payout.service} />}
            {payout.relatedItem && <Row label="Item"   value={payout.relatedItem} />}
            {payout.description && <Row label="Note"   value={payout.description} />}
            <div className="border-t border-dashed border-border my-1" />
            <Row label="Payment Method" value={payout.paymentMethod} />
            {payout.referenceId && <Row label="Ref ID" value={payout.referenceId} />}
            <div className="border-t border-border mt-2 pt-2 flex justify-between font-bold text-sm not-italic">
              <span>TOTAL</span>
              <span>{formatINR(payout.amount)}</span>
            </div>
            <div className="border-t border-dashed border-border pt-2 text-center text-[10px] text-muted-foreground not-italic">
              Issued by NivasiSpace · {payout.createdBy}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

function LaundryEmployeePayoutsPage() {
  const { user, userRole, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const { data: employee } = useLaundryEmployeeByUid(user?.uid);
  const assignedLaundryIds: string[] = employee?.laundryIds ?? [];

  const { data: allLaundries = [] } = useLaundries();
  const { data: payouts = [], isLoading } = usePayoutsByLaundry(assignedLaundryIds);

  const [laundryFilter, setLaundryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!authLoading && (!user || userRole === "admin")) {
      navigate({ to: "/employee/login", replace: true });
    }
  }, [authLoading, user, userRole, navigate]);

  const filtered = useMemo(
    () => payouts.filter((p) => {
      const pAny = p as any;
      if (laundryFilter !== "all" && pAny.laundryId !== laundryFilter) return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      return true;
    }),
    [payouts, laundryFilter, statusFilter],
  );

  const totalPaid    = filtered.filter((p) => p.status === "PAID").reduce((s, p) => s + p.amount, 0);
  const totalPending = filtered.filter((p) => p.status === "PENDING" || p.status === "PROCESSING").reduce((s, p) => s + p.amount, 0);

  return (
    <AdminShell
      title="My Payouts"
      subtitle={assignedLaundryIds.map((id) => allLaundries.find((l) => l.id === id)?.laundryName ?? id).join(", ")}
    >
      <div className="mx-auto max-w-2xl space-y-4">

        {/* Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-success/30 bg-success/10 p-3 text-center">
            <p className="text-[11px] text-success">Total Paid</p>
            <p className="mt-0.5 text-xl font-bold text-success">{formatINR(totalPaid)}</p>
          </div>
          <div className="rounded-2xl border border-warning/30 bg-warning/10 p-3 text-center">
            <p className="text-[11px] text-warning-foreground">Pending / Processing</p>
            <p className="mt-0.5 text-xl font-bold text-warning-foreground">{formatINR(totalPending)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {assignedLaundryIds.length > 1 && (
            <Select value={laundryFilter} onValueChange={setLaundryFilter}>
              <SelectTrigger className="flex-1"><SelectValue placeholder="All Laundries" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Laundries</SelectItem>
                {assignedLaundryIds.map((id) => (
                  <SelectItem key={id} value={id}>
                    {allLaundries.find((l) => l.id === id)?.laundryName ?? id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="flex-1"><SelectValue placeholder="All Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* List */}
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
            <Receipt className="size-10 text-muted-foreground/40" />
            <p className="text-sm font-medium">No payouts found.</p>
          </div>
        ) : (
          filtered.map((p) => <ReceiptCard key={p.id} payout={p} />)
        )}
      </div>
    </AdminShell>
  );
}
