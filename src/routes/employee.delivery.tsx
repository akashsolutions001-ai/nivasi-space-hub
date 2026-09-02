import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft, Phone, MapPin, ChevronLeft, ChevronRight,
  CheckCircle2, Clock, XCircle, SkipForward, UtensilsCrossed,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useEmployeeByUid, useAdmissions, useDeliveriesForDate, useMesses } from "@/lib/hooks";
import { upsertDelivery, todayDateString } from "@/lib/db";
import type { Admission, DeliveryStatus } from "@/lib/types";

export const Route = createFileRoute("/employee/delivery")({
  head: () => ({ meta: [{ title: "Quick Delivery — NivasiSpace" }] }),
  component: EmployeeDeliveryPage,
});

// ── helpers ───────────────────────────────────────────────────────────────────

function getMapUrl(student: Admission): string | null {
  const s = student as any;
  if (s.mapLink) return s.mapLink;
  const addr = s.address ?? s.location;
  if (addr) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`;
  if (student.propertyName)
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(student.propertyName)}`;
  return null;
}

const DELIVERY_OPTIONS: {
  status: DeliveryStatus;
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  { status: "delivered",     label: "Delivered",     icon: <CheckCircle2 className="size-5" />, color: "border-success bg-success/15 text-success hover:bg-success/25" },
  { status: "not_available", label: "Not Available", icon: <XCircle className="size-5" />,      color: "border-border bg-muted/50 text-muted-foreground hover:bg-muted" },
  { status: "skipped",       label: "Skipped",       icon: <SkipForward className="size-5" />,  color: "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20" },
  { status: "pending",       label: "Pending",       icon: <Clock className="size-5" />,        color: "border-warning/30 bg-warning/10 text-warning-foreground hover:bg-warning/20" },
];

// ── page ──────────────────────────────────────────────────────────────────────

function EmployeeDeliveryPage() {
  const { user, userRole, employeeMessIds, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const today = todayDateString();

  const { data: employee } = useEmployeeByUid(user?.uid);
  const { data: allMesses = [] } = useMesses();

  // Resolve assigned mess IDs (employee doc is authoritative, auth is fallback)
  const assignedMessIds: string[] = employee?.messIds?.length
    ? employee.messIds
    : employeeMessIds;

  // Active mess for delivery — default to first
  const [activeMessId, setActiveMessId] = useState("");
  const resolvedMessId = activeMessId || assignedMessIds[0] || "";

  // Reset when employee loads
  useEffect(() => {
    if (!activeMessId && assignedMessIds.length > 0) {
      setActiveMessId(assignedMessIds[0]);
    }
  }, [assignedMessIds, activeMessId]);

  const { data: admissions = [] } = useAdmissions();
  const { data: deliveries = [] } = useDeliveriesForDate(resolvedMessId || null, today);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);

  // Guard: only mess employees
  useEffect(() => {
    if (!authLoading && (!user || userRole === "admin")) {
      navigate({ to: "/employee/login", replace: true });
    }
  }, [authLoading, user, userRole, navigate]);

  // Reset index when mess switches
  useEffect(() => { setCurrentIndex(0); }, [resolvedMessId]);

  // Only students of the active mess with active tiffin
  const students = useMemo(
    () =>
      resolvedMessId
        ? admissions.filter(
            (a) =>
              (a as any).messId === resolvedMessId &&
              (a as any).tiffinStatus !== "cancelled",
          )
        : [],
    [admissions, resolvedMessId],
  );

  const student = students[currentIndex] ?? null;
  const total   = students.length;

  function getDelivery(studentId: string, meal: "lunch" | "dinner") {
    return deliveries.find((d) => d.studentId === studentId && d.meal === meal);
  }

  async function setStatus(meal: "lunch" | "dinner", status: DeliveryStatus) {
    if (!student || !resolvedMessId || !employee) return;
    const key = `${student.id}-${meal}`;
    setUpdatingKey(key);
    try {
      await upsertDelivery({
        studentId:   student.id,
        admissionId: student.admissionId,
        messId:      resolvedMessId,
        employeeId:  employee.id,
        date:        today,
        meal,
        status,
      });
      await qc.invalidateQueries({ queryKey: ["deliveries", resolvedMessId, today] });
      await qc.invalidateQueries({ queryKey: ["deliverySummary", resolvedMessId, today] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save delivery.");
    } finally {
      setUpdatingKey(null);
    }
  }

  function prev() { if (currentIndex > 0) setCurrentIndex((i) => i - 1); }
  function next() { if (currentIndex < total - 1) setCurrentIndex((i) => i + 1); }

  if (authLoading) return null;

  const activeMessName = allMesses.find((m) => m.id === resolvedMessId)?.messName
    ?? employee?.messNames?.[0] ?? "";

  // Empty state
  if (!resolvedMessId || (students.length === 0 && !authLoading)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <UtensilsCrossed className="size-12 text-muted-foreground/40" />
        <p className="font-semibold">
          {!resolvedMessId ? "No mess assigned to your account." : "No students in this mess."}
        </p>
        <Button asChild variant="outline">
          <Link to="/employee/dashboard">
            <ArrowLeft className="mr-1.5 size-4" />Back to Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  const mapUrl  = student ? getMapUrl(student) : null;
  const lunch   = student ? getDelivery(student.id, "lunch")  : undefined;
  const dinner  = student ? getDelivery(student.id, "dinner") : undefined;
  const tiffin  = student ? ((student as any).tiffinStatus ?? "active") : "active";

  return (
    <div className="flex min-h-screen flex-col bg-background">

      {/* ── Top nav ── */}
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <Button asChild variant="ghost" size="sm">
          <Link to="/employee/dashboard">
            <ArrowLeft className="mr-1.5 size-4" /> Dashboard
          </Link>
        </Button>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-sm font-medium text-muted-foreground">
            {currentIndex + 1} / {total}
          </span>
          {activeMessName && (
            <span className="text-[11px] text-muted-foreground">{activeMessName}</span>
          )}
        </div>
        <div className="w-24" />
      </header>

      {/* ── Mess tab switcher (multi-mess only) ── */}
      {assignedMessIds.length > 1 && (
        <div className="flex gap-2 overflow-x-auto border-b border-border px-4 py-2 scrollbar-none">
          {assignedMessIds.map((id, i) => {
            const name = allMesses.find((m) => m.id === id)?.messName
              ?? employee?.messNames?.[i] ?? id;
            return (
              <button
                key={id}
                onClick={() => setActiveMessId(id)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  resolvedMessId === id
                    ? "gradient-brand text-primary-foreground shadow-soft"
                    : "border border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Progress bar ── */}
      <div className="h-1.5 w-full bg-muted">
        <div
          className="h-full gradient-brand transition-all duration-300"
          style={{ width: total > 0 ? `${((currentIndex + 1) / total) * 100}%` : "0%" }}
        />
      </div>

      {/* ── Student content ── */}
      {student && (
        <div className="flex flex-1 flex-col px-4 py-6">

          {/* Student card — delivery-relevant fields only */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="text-xl font-bold">{student.fullName}</h2>
                {/* Property + room — needed for navigation to door */}
                {student.propertyName && (
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {student.propertyName}
                    {student.roomNumber ? ` · Room ${student.roomNumber}` : ""}
                  </p>
                )}
              </div>
              <Badge
                variant="outline"
                className={`shrink-0 capitalize text-[11px] ${
                  tiffin === "active"
                    ? "border-success/30 bg-success/10 text-success"
                    : "border-warning/30 bg-warning/10 text-warning-foreground"
                }`}
              >
                {tiffin}
              </Badge>
            </div>

            {/* Call + Navigate — only contact/map info exposed */}
            <div className="mt-4 flex gap-2">
              {student.phoneNumber && (
                <Button asChild variant="outline" size="sm" className="flex-1 text-sm">
                  <a href={`tel:${student.phoneNumber}`}>
                    <Phone className="mr-1.5 size-4" />
                    {student.phoneNumber}
                  </a>
                </Button>
              )}
              {mapUrl && (
                <Button asChild variant="outline" size="sm" className="shrink-0">
                  <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                    <MapPin className="mr-1.5 size-4" />
                    Navigate
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Meal sections */}
          <MealSection
            meal="lunch"
            currentStatus={lunch?.status ?? "pending"}
            disabled={tiffin === "cancelled"}
            updating={updatingKey === `${student.id}-lunch`}
            onSelect={(s) => setStatus("lunch", s)}
          />
          <MealSection
            meal="dinner"
            currentStatus={dinner?.status ?? "pending"}
            disabled={tiffin === "cancelled"}
            updating={updatingKey === `${student.id}-dinner`}
            onSelect={(s) => setStatus("dinner", s)}
          />
        </div>
      )}

      {/* ── Bottom navigation ── */}
      <div className="sticky bottom-0 flex gap-3 border-t border-border bg-background p-4">
        <Button
          variant="outline"
          size="lg"
          className="flex-1 text-base"
          onClick={prev}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="mr-1 size-5" /> Prev
        </Button>
        <Button
          size="lg"
          className="flex-1 text-base gradient-brand text-primary-foreground shadow-soft"
          onClick={next}
          disabled={currentIndex === total - 1}
        >
          Next <ChevronRight className="ml-1 size-5" />
        </Button>
      </div>
    </div>
  );
}

// ── MealSection ───────────────────────────────────────────────────────────────

function MealSection({
  meal, currentStatus, disabled, updating, onSelect,
}: {
  meal: "lunch" | "dinner";
  currentStatus: DeliveryStatus;
  disabled: boolean;
  updating: boolean;
  onSelect: (s: DeliveryStatus) => void;
}) {
  return (
    <div className="mt-5">
      <h3 className="mb-2 text-base font-semibold capitalize">{meal}</h3>
      <div className="grid grid-cols-2 gap-2">
        {DELIVERY_OPTIONS.map((opt) => (
          <button
            key={opt.status}
            disabled={disabled || updating}
            onClick={() => onSelect(opt.status)}
            className={`flex items-center gap-2 rounded-xl border px-3 py-3.5 text-sm font-medium transition-all active:scale-95 ${
              currentStatus === opt.status
                ? opt.color + " ring-2 ring-current/20"
                : "border-border bg-card text-muted-foreground hover:bg-muted/60"
            } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
          >
            {opt.icon}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
