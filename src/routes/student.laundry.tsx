import { useState, useEffect, useCallback } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  WashingMachine, Loader2, CheckCircle2,
  Clock, Package, ChevronDown, ChevronUp, CalendarDays,
  Scale, StickyNote,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StudentShell } from "@/components/nivasi/student-shell";
import { useStudentAuth } from "@/lib/studentAuth";
import { useLaundries, useStudentLaundryRecords, useLaundryPickupsForStudent } from "@/lib/hooks";
import {
  getOrCreateStudentLaundryRecord,
  updateStudentLaundryRecord,
  todayISTDateString,
  getWeekId,
  getWeekBounds,
} from "@/lib/db";
import type { StudentLaundryRecord, LaundryPickup } from "@/lib/types";

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

  if (loading) return <Skeleton className="h-56 rounded-2xl" />;

  const pickup = record?.pickupStatus ?? "pending";
  const received = record?.receivedStatus ?? "pending";
  const pickupDone = pickup === "completed";
  const receivedDone = received === "completed";

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft space-y-5">
      {/* Week header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Weekly Cycle</span>
            <Badge variant="outline" className="text-[10px] font-mono">{weekId}</Badge>
          </div>
          <p className="mt-1 font-display font-bold text-lg sm:text-xl text-foreground">
            {formatDateRange(weekStart, weekEnd)}
          </p>
        </div>
        <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <WashingMachine className="size-6" />
        </div>
      </div>

      {/* Two action cards side by side on sm+ screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Step 1: Pickup / Handover */}
        <div className="rounded-xl border border-border/80 bg-muted/20 p-4 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Package className="size-4 text-primary" />
                <span className="text-sm font-bold">1. Clothes Handover</span>
              </div>
              <PickupBadge status={pickup} />
            </div>
            <p className="text-xs text-muted-foreground">
              {pickupDone
                ? `Handed over on ${formatISTTimestamp(record?.pickupAt)}`
                : "Hand over your laundry bag to the staff when collected."}
            </p>
          </div>
          {!pickupDone && (
            <Button
              onClick={onMarkPickup}
              disabled={saving === "pickup"}
              className="w-full h-10 gradient-brand text-primary-foreground shadow-soft text-xs font-semibold"
            >
              {saving === "pickup"
                ? <Loader2 className="mr-2 size-3.5 animate-spin" />
                : <CheckCircle2 className="mr-2 size-3.5" />}
              Mark as Picked Up
            </Button>
          )}
        </div>

        {/* Step 2: Return / Clean Received */}
        <div className="rounded-xl border border-border/80 bg-muted/20 p-4 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <WashingMachine className="size-4 text-primary" />
                <span className="text-sm font-bold">2. Laundry Received</span>
              </div>
              {pickupDone
                ? <ReceivedBadge status={received} />
                : <Badge variant="outline" className="text-[11px] bg-muted text-muted-foreground border-border">Awaiting Pickup</Badge>}
            </div>
            <p className="text-xs text-muted-foreground">
              {receivedDone
                ? `Received back on ${formatISTTimestamp(record?.receivedAt)}`
                : pickupDone
                ? "Your clothes are being processed. Mark received once returned."
                : "Available after laundry handover is confirmed."}
            </p>
          </div>
          {pickupDone && !receivedDone && (
            <Button
              variant="outline"
              onClick={onMarkReceived}
              disabled={saving === "received"}
              className="w-full h-10 border-success/40 text-success hover:bg-success/10 text-xs font-semibold"
            >
              {saving === "received"
                ? <Loader2 className="mr-2 size-3.5 animate-spin" />
                : <CheckCircle2 className="mr-2 size-3.5" />}
              Confirm Received
            </Button>
          )}
        </div>
      </div>

      {/* Visual Progress Stepper */}
      <div className="rounded-xl bg-muted/30 p-3">
        <div className="flex items-center justify-between text-xs font-medium">
          <div className={`flex items-center gap-1.5 ${pickupDone ? "text-success font-semibold" : "text-foreground"}`}>
            <span className={`flex size-5 items-center justify-center rounded-full text-[10px] ${pickupDone ? "bg-success text-success-foreground" : "bg-muted-foreground/20 text-muted-foreground"}`}>1</span>
            <span>Handed Over</span>
          </div>
          <div className="h-0.5 flex-1 mx-3 bg-border" />
          <div className={`flex items-center gap-1.5 ${pickupDone && !receivedDone ? "text-warning-foreground font-semibold" : receivedDone ? "text-success font-semibold" : "text-muted-foreground"}`}>
            <span className={`flex size-5 items-center justify-center rounded-full text-[10px] ${receivedDone ? "bg-success text-success-foreground" : pickupDone ? "bg-warning text-warning-foreground" : "bg-muted-foreground/20 text-muted-foreground"}`}>2</span>
            <span>Processing</span>
          </div>
          <div className="h-0.5 flex-1 mx-3 bg-border" />
          <div className={`flex items-center gap-1.5 ${receivedDone ? "text-success font-semibold" : "text-muted-foreground"}`}>
            <span className={`flex size-5 items-center justify-center rounded-full text-[10px] ${receivedDone ? "bg-success text-success-foreground" : "bg-muted-foreground/20 text-muted-foreground"}`}>3</span>
            <span>Returned</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── History card ──────────────────────────────────────────────────────────────

function LaundryHistoryCard({ records }: { records: StudentLaundryRecord[] }) {
  const [open, setOpen] = useState(true);
  // Exclude current week from history display
  const today = todayISTDateString();
  const currentWeekId = getWeekId(today);
  const past = records.filter((r) => r.weekId !== currentWeekId);

  return (
    <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
      <button
        className="flex w-full items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-primary" />
          <span className="text-sm font-bold">Past Cycles History</span>
          {past.length > 0 && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {past.length}
            </Badge>
          )}
        </div>
        {open ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
      </button>
      {open && (
        <div className="border-t border-border divide-y divide-border max-h-72 overflow-y-auto">
          {past.length === 0 ? (
            <div className="px-5 py-6 text-center text-xs text-muted-foreground">
              No previous week cycles found.
            </div>
          ) : (
            past.map((r) => (
              <div key={r.id} className="px-5 py-3 space-y-1.5 hover:bg-muted/20 transition-colors">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-foreground">
                    {formatDateRange(r.weekStart, r.weekEnd)}
                  </p>
                  <span className="text-[10px] font-mono text-muted-foreground">{r.weekId}</span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  <PickupBadge status={r.pickupStatus} />
                  <ReceivedBadge status={r.receivedStatus} />
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ── Daily Laundry Logs & Clothes Weight card ───────────────────────────────────

function DailyLaundryLogsCard({ pickups }: { pickups: LaundryPickup[] }) {
  const [open, setOpen] = useState(true);

  // Group pickups by date
  const byDate = pickups.reduce<Record<string, { pickup?: LaundryPickup; delivery?: LaundryPickup }>>((acc, p) => {
    const entry = acc[p.date] ?? {};
    if (p.type === "pickup") entry.pickup = p;
    else entry.delivery = p;
    acc[p.date] = entry;
    return acc;
  }, {});

  const dates = Object.keys(byDate).sort((a, b) => b.localeCompare(a));

  return (
    <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
      <button
        className="flex w-full items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <Scale className="size-4 text-primary" />
          <span className="text-sm font-bold">Staff Clothes Weight & Pickup Logs</span>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20">
            {dates.length} Logged
          </Badge>
        </div>
        {open ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
      </button>
      {open && (
        <div className="border-t border-border">
          {dates.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm space-y-1">
              <Scale className="size-8 mx-auto text-muted-foreground/30 mb-2" />
              <p className="font-semibold text-foreground">No staff entries logged yet</p>
              <p className="text-xs">When laundry staff weighs or logs your clothes pickup, the details appear here in real-time.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {dates.map((d) => {
                const row = byDate[d];
                const p = row?.pickup;
                const del = row?.delivery;
                const weight = p?.clothesWeight || del?.clothesWeight;
                const notes = p?.notes || del?.notes;

                return (
                  <div key={d} className="px-5 py-3.5 space-y-2 hover:bg-muted/15 transition-colors">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-foreground">{d}</span>
                        {weight && (
                          <span className="inline-flex items-center gap-1 rounded-lg border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                            <Scale className="size-3" />
                            {weight}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {p && (
                          <Badge variant="outline" className={`text-[10px] capitalize ${p.status === "picked_up" ? "bg-success/10 text-success border-success/30" : "bg-warning/10 text-warning-foreground border-warning/30"}`}>
                            Pickup: {p.status === "picked_up" ? "Picked Up" : "Pending"}
                          </Badge>
                        )}
                        {del && (
                          <Badge variant="outline" className={`text-[10px] capitalize ${del.status === "picked_up" ? "bg-success/10 text-success border-success/30" : "bg-muted text-muted-foreground"}`}>
                            Delivery: {del.status === "picked_up" ? "Delivered" : "Pending"}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {notes && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 bg-muted/40 rounded-lg px-2.5 py-1.5">
                        <StickyNote className="size-3.5 shrink-0 text-muted-foreground" />
                        <span>Staff Note: {notes}</span>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Guidelines & Info Card ───────────────────────────────────────────────────

function LaundryGuidelinesCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft space-y-3">
      <div className="flex items-center gap-2">
        <Package className="size-4 text-primary" />
        <h3 className="font-display font-bold text-sm">Hostel Laundry Guidelines</h3>
      </div>
      <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside leading-relaxed">
        <li>Please put all clothes in your designated laundry bag before handover.</li>
        <li>Empty all pockets and tag delicate or woolen garments.</li>
        <li>Weight is recorded by the laundry team upon collection.</li>
        <li>Inspect clean clothes promptly when returned and confirm in portal.</li>
      </ul>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

function StudentLaundryPage() {
  const { session, admission: myAdmission, loading } = useStudentAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: laundries = [] } = useLaundries();

  const laundryId: string = myAdmission?.laundryId || "";
  const laundry = laundries.find((l) => l.id === laundryId);
  const resolvedLaundryName = laundry?.laundryName || myAdmission?.laundryName || "Assigned Laundry Provider";

  const hasLaundryInPackage =
    myAdmission?.packageServices?.some((s) => s.toLowerCase().includes("laundry")) || !!laundryId;

  const today = todayISTDateString();
  const weekId = getWeekId(today);
  const { weekStart, weekEnd } = getWeekBounds(today);

  const [record, setRecord] = useState<StudentLaundryRecord | null>(null);
  const [recordLoading, setRecordLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);

  const { data: allRecords = [] } = useStudentLaundryRecords(myAdmission?.id ?? null);
  const { data: dailyPickups = [] } = useLaundryPickupsForStudent(
    myAdmission?.id ?? null,
    myAdmission?.admissionId,
  );

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
        laundryName: resolvedLaundryName,
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
  }, [myAdmission, laundryId, resolvedLaundryName, weekId, weekStart, weekEnd]);

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

  const latestWeight = dailyPickups.find((p) => p.clothesWeight)?.clothesWeight;

  return (
    <StudentShell
      title="My Laundry"
      subtitle="Track your weekly laundry schedule, pickup status, and recorded clothes weight"
      backTo="/student/dashboard"
    >
      <div className="space-y-6">
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
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center space-y-2">
            <WashingMachine className="mx-auto mb-2 size-10 text-muted-foreground/40" />
            <p className="font-semibold text-base">
              {hasLaundryInPackage ? "Laundry Included in Package" : "Laundry Not Assigned"}
            </p>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              {hasLaundryInPackage
                ? "Your admission package includes laundry services. Your manager or administrator will assign a laundry provider shortly."
                : "No laundry service has been assigned to your account. Please contact your hostel administrator."}
            </p>
          </div>
        )}

        {myAdmission && laundryId && (
          <>
            {/* Top KPI stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
              <div className="rounded-2xl border border-border bg-card p-3.5 sm:p-4 shadow-soft">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted-foreground truncate">Provider</p>
                <p className="text-sm sm:text-base font-bold truncate mt-1">{resolvedLaundryName}</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="inline-block size-1.5 rounded-full bg-success" />
                  <span className="text-[10px] sm:text-[11px] text-success capitalize truncate">{myAdmission.laundryStatus || "Active"}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-3.5 sm:p-4 shadow-soft">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted-foreground truncate">Current Cycle</p>
                <p className="text-sm sm:text-base font-bold truncate mt-1">{formatDateRange(weekStart, weekEnd)}</p>
                <p className="text-[10px] sm:text-[11px] font-mono text-muted-foreground mt-1.5 truncate">{weekId}</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-3.5 sm:p-4 shadow-soft">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted-foreground truncate">Pickup Status</p>
                <div className="mt-1.5">
                  <PickupBadge status={record?.pickupStatus ?? "pending"} />
                </div>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-1.5 truncate">
                  {record?.pickupAt ? formatISTTimestamp(record.pickupAt) : "Awaiting handover"}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-3.5 sm:p-4 shadow-soft">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted-foreground truncate">Latest Weight</p>
                <p className="text-sm sm:text-base font-bold text-primary mt-1 flex items-center gap-1.5 truncate">
                  <Scale className="size-3.5 sm:size-4 shrink-0" />
                  {latestWeight || "—"}
                </p>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-1.5 truncate">
                  {dailyPickups.length} logged records
                </p>
              </div>
            </div>

            {/* Main responsive grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (8 cols on lg) */}
              <div className="lg:col-span-8 space-y-6">
                <CurrentWeekCard
                  record={record}
                  loading={recordLoading}
                  onMarkPickup={handleMarkPickup}
                  onMarkReceived={handleMarkReceived}
                  saving={saving}
                />

                <DailyLaundryLogsCard pickups={dailyPickups} />
              </div>

              {/* Right Column (4 cols on lg) */}
              <div className="lg:col-span-4 space-y-6">
                {/* Laundry Provider Card */}
                <div className="rounded-2xl border border-border bg-card p-5 shadow-soft space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Laundry Service</p>
                    <Badge variant="outline" className="border-success/30 bg-success/10 text-success text-[11px] capitalize">
                      {myAdmission.laundryStatus || "active"}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base">{resolvedLaundryName}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Weekly collection & delivery</p>
                  </div>
                </div>

                <LaundryGuidelinesCard />

                <LaundryHistoryCard records={allRecords} />
              </div>
            </div>
          </>
        )}
      </div>
    </StudentShell>
  );
}
