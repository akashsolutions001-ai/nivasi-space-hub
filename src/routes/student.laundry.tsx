import { useState, useEffect, useCallback } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  WashingMachine, Loader2, CheckCircle2,
  Clock, Package, ChevronDown, ChevronUp, CalendarDays,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StudentShell } from "@/components/nivasi/student-shell";
import { useStudentAuth } from "@/lib/studentAuth";
import { useLaundries, useStudentLaundryRecords } from "@/lib/hooks";
import {
  getOrCreateStudentLaundryRecord,
  updateStudentLaundryRecord,
  todayISTDateString,
  getWeekId,
  getWeekBounds,
} from "@/lib/db";
import type { StudentLaundryRecord } from "@/lib/types";

export const Route = createFileRoute("/student/laundry")({
  head: () => ({ meta: [{ title: "My Laundry — NivasiSpace" }] }),
  component: StudentLaundryPage,
});

// ── helpers ───────────────────────────────────────────────────────────────────

function formatDateRange(start: string, end: string): string {
  try {
    const fmt = (d: string) => {
      const parts = d.split("-").map(Number);
      const y = parts[0] ?? new Date().getFullYear();
      const mo = parts[1] ?? 1;
      const day = parts[2] ?? 1;
      return new Date(y, mo - 1, day).toLocaleDateString("en-IN", {
        day: "numeric", month: "short",
      });
    };
    return `${fmt(start)} – ${fmt(end)}`;
  } catch {
    return `${start} – ${end}`;
  }
}

function formatISTTimestamp(date: Date | null | undefined): string {
  if (!date) return "—";
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit",
    hour12: true,
  });
}

// ── Status badges ─────────────────────────────────────────────────────────────

function PickupBadge({ status }: { status: "pending" | "completed" }) {
  return status === "completed"
    ? <Badge variant="outline" className="text-[11px] bg-success/15 text-success border-success/30">Pickup Completed ✓</Badge>
    : <Badge variant="outline" className="text-[11px] bg-warning/15 text-warning-foreground border-warning/30">Pickup Pending</Badge>;
}

function ReceivedBadge({ status }: { status: "pending" | "completed" }) {
  return status === "completed"
    ? <Badge variant="outline" className="text-[11px] bg-success/15 text-success border-success/30">Received ✓</Badge>
    : <Badge variant="outline" className="text-[11px] bg-muted text-muted-foreground border-border">Return Pending</Badge>;
}

// ── Current week card ─────────────────────────────────────────────────────────

interface WeekCardProps {
  record: StudentLaundryRecord | null;
  loading: boolean;
  onMarkPickup: () => void;
  onMarkReceived: () => void;
  saving: string | null;
}

function CurrentWeekCard({ record, loading, onMarkPickup, onMarkReceived, saving }: WeekCardProps) {
  const today = todayISTDateString();
  const weekId = getWeekId(today);
  const { weekStart, weekEnd } = getWeekBounds(today);

  if (loading) return <Skeleton className="h-52 rounded-2xl" />;

  const pickup = record?.pickupStatus ?? "pending";
  const received = record?.receivedStatus ?? "pending";
  const pickupDone = pickup === "completed";
  const receivedDone = received === "completed";

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft space-y-4">
      {/* Week label */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Current Week</p>
          <p className="mt-0.5 font-display font-bold text-base">
            {formatDateRange(weekStart, weekEnd)}
          </p>
          <p className="text-[11px] text-muted-foreground">{weekId}</p>
        </div>
        <WashingMachine className="size-8 text-muted-foreground/30" />
      </div>

      {/* Pickup row */}
      <div className="rounded-xl bg-muted/30 p-4 space-y-3">
        <div className="flex items-center gap-1.5">
          <Package className="size-4 text-muted-foreground" />
          <p className="text-sm font-semibold">Laundry Pickup</p>
        </div>
        <div className="flex items-center gap-2">
          <PickupBadge status={pickup} />
          {pickupDone && record?.pickupAt && (
            <p className="text-[11px] text-muted-foreground">
              {formatISTTimestamp(record.pickupAt)}
            </p>
          )}
        </div>
        {!pickupDone && (
          <Button
            onClick={onMarkPickup}
            disabled={saving === "pickup"}
            className="w-full h-11 gradient-brand text-primary-foreground shadow-soft text-sm font-semibold"
          >
            {saving === "pickup"
              ? <Loader2 className="mr-2 size-4 animate-spin" />
              : <CheckCircle2 className="mr-2 size-4" />}
            Mark Pickup
          </Button>
        )}
      </div>

      {/* Received row */}
      <div className="rounded-xl bg-muted/30 p-4 space-y-3">
        <div className="flex items-center gap-1.5">
          <WashingMachine className="size-4 text-muted-foreground" />
          <p className="text-sm font-semibold">Laundry Received</p>
        </div>
        <div className="flex items-center gap-2">
          {pickupDone
            ? <ReceivedBadge status={received} />
            : <Badge variant="outline" className="text-[11px] bg-muted text-muted-foreground border-border">Awaiting Pickup</Badge>}
          {receivedDone && record?.receivedAt && (
            <p className="text-[11px] text-muted-foreground">
              {formatISTTimestamp(record.receivedAt)}
            </p>
          )}
        </div>
        {pickupDone && !receivedDone && (
          <Button
            variant="outline"
            onClick={onMarkReceived}
            disabled={saving === "received"}
            className="w-full h-11 border-success/40 text-success hover:bg-success/10 text-sm font-semibold"
          >
            {saving === "received"
              ? <Loader2 className="mr-2 size-4 animate-spin" />
              : <CheckCircle2 className="mr-2 size-4" />}
            Mark Received
          </Button>
        )}
      </div>

      {/* Flow hint */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
        <span className={pickup === "completed" ? "text-success font-medium" : ""}>Pickup</span>
        <span>→</span>
        <span className={pickup === "completed" && received === "pending" ? "text-warning-foreground font-medium" : received === "completed" ? "text-success font-medium" : ""}>
          Return Pending
        </span>
        <span>→</span>
        <span className={received === "completed" ? "text-success font-medium" : ""}>Received</span>
      </div>
    </div>
  );
}

// ── History card ──────────────────────────────────────────────────────────────

function LaundryHistoryCard({ records }: { records: StudentLaundryRecord[] }) {
  const [open, setOpen] = useState(false);
  // Exclude current week from history display
  const today = todayISTDateString();
  const currentWeekId = getWeekId(today);
  const past = records.filter((r) => r.weekId !== currentWeekId);

  if (past.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
      <button
        className="flex w-full items-center justify-between px-5 py-3.5"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-muted-foreground" />
          <span className="text-sm font-semibold">Laundry History</span>
        </div>
        {open ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
      </button>
      {open && (
        <div className="border-t border-border divide-y divide-border">
          {past.map((r) => (
            <div key={r.id} className="px-5 py-3 space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground">
                {formatDateRange(r.weekStart, r.weekEnd)}
                <span className="ml-1.5 text-[10px] font-normal">({r.weekId})</span>
              </p>
              <div className="flex gap-2 flex-wrap">
                <PickupBadge status={r.pickupStatus} />
                <ReceivedBadge status={r.receivedStatus} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

function StudentLaundryPage() {
  const { session, admission: myAdmission, loading } = useStudentAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: laundries = [] } = useLaundries();

  const laundryId: string = (myAdmission as any)?.laundryId ?? "";
  const laundry = laundries.find((l) => l.id === laundryId);

  const today = todayISTDateString();
  const weekId = getWeekId(today);
  const { weekStart, weekEnd } = getWeekBounds(today);

  const [record, setRecord] = useState<StudentLaundryRecord | null>(null);
  const [recordLoading, setRecordLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);

  const { data: allRecords = [] } = useStudentLaundryRecords(myAdmission?.id ?? null);

  // Auth guard
  useEffect(() => {
    if (!loading && !session) navigate({ to: "/student/login", replace: true });
  }, [loading, session, navigate]);

  // Load / create current week record
  const loadRecord = useCallback(async () => {
    if (!myAdmission || !laundryId) return;
    setRecordLoading(true);
    try {
      const r = await getOrCreateStudentLaundryRecord({
        studentId: myAdmission.id,
        studentName: myAdmission.fullName,
        studentEmail: myAdmission.email ?? "",
        admissionId: myAdmission.admissionId,
        laundryId,
        laundryName: laundry?.laundryName ?? "",
        weekId,
        weekStart,
        weekEnd,
        pickupStatus: "pending",
        pickupAt: null,
        receivedStatus: "pending",
        receivedAt: null,
      });
      setRecord(r);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to load laundry record.");
    } finally {
      setRecordLoading(false);
    }
  }, [myAdmission, laundryId, laundry, weekId, weekStart, weekEnd]);

  useEffect(() => { loadRecord(); }, [loadRecord]);

  async function handleMarkPickup() {
    if (!myAdmission || !record) return;
    if (record.pickupStatus === "completed") { toast.info("Already marked as picked up."); return; }
    setSaving("pickup");
    try {
      await updateStudentLaundryRecord(myAdmission.id, weekId, {
        pickupStatus: "completed",
        pickupAt: new Date(),
      });
      setRecord((r) => r ? { ...r, pickupStatus: "completed", pickupAt: new Date() } : r);
      toast.success("Laundry pickup marked.");
      await qc.invalidateQueries({ queryKey: ["studentLaundryRecords", myAdmission.id] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(null);
    }
  }

  async function handleMarkReceived() {
    if (!myAdmission || !record) return;
    if (record.pickupStatus !== "completed") {
      toast.error("Laundry must be picked up before it can be marked as received.");
      return;
    }
    if (record.receivedStatus === "completed") { toast.info("Already marked as received."); return; }
    setSaving("received");
    try {
      await updateStudentLaundryRecord(myAdmission.id, weekId, {
        receivedStatus: "completed",
        receivedAt: new Date(),
      });
      setRecord((r) => r ? { ...r, receivedStatus: "completed", receivedAt: new Date() } : r);
      toast.success("Laundry marked as received.");
      await qc.invalidateQueries({ queryKey: ["studentLaundryRecords", myAdmission.id] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(null);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <StudentShell title="My Laundry" backTo="/student/dashboard">
        {/* No admission */}
        {!myAdmission && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            <WashingMachine className="mx-auto mb-3 size-10 text-muted-foreground/40" />
            <p className="font-semibold">No admission found</p>
            <p className="mt-1 text-sm text-muted-foreground">Contact your administrator.</p>
          </div>
        )}
        {/* No laundry assigned */}
        {myAdmission && !laundryId && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            <WashingMachine className="mx-auto mb-3 size-10 text-muted-foreground/40" />
            <p className="font-semibold">Laundry Not Assigned</p>
            <p className="mt-1 text-sm text-muted-foreground">Please contact administration.</p>
          </div>
        )}
        {myAdmission && laundryId && (
          <>
            {/* Laundry service info */}
            <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Laundry Service</p>
              <p className="mt-1 font-display font-bold">{laundry?.laundryName ?? "—"}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Weekly service</p>
            </div>
            {/* Current week */}
            <CurrentWeekCard
              record={record}
              loading={recordLoading}
              onMarkPickup={handleMarkPickup}
              onMarkReceived={handleMarkReceived}
              saving={saving}
            />
            {/* History */}
            <LaundryHistoryCard records={allRecords} />
          </>
        )}
    </StudentShell>
  );
}
