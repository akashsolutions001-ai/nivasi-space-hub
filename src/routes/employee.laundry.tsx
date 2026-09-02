import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  LogOut, Phone, MapPin, WashingMachine, Loader2, Search,
  CheckCircle2, Clock, XCircle, SkipForward, ChevronDown, Receipt,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import {
  useLaundryEmployeeByUid, useAdmissions, useLaundryPickupsForDate,
  useLaundryPickupSummary, useLaundries, useRooms, useProperties,
} from "@/lib/hooks";
import { upsertLaundryPickup, todayDateString } from "@/lib/db";
import type { Admission, LaundryPickupStatus } from "@/lib/types";

export const Route = createFileRoute("/employee/laundry")({
  head: () => ({ meta: [{ title: "Laundry Dashboard — NivasiSpace" }] }),
  component: LaundryEmployeeDashboardPage,
});

// ── helpers ───────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<LaundryPickupStatus, string> = {
  pending:       "bg-warning/15 text-warning-foreground border-warning/30",
  picked_up:     "bg-success/15 text-success border-success/30",
  not_available: "bg-muted text-muted-foreground border-border",
  skipped:       "bg-destructive/10 text-destructive border-destructive/20",
};

const STATUS_ICONS: Record<LaundryPickupStatus, React.ReactNode> = {
  pending:       <Clock className="size-3.5" />,
  picked_up:     <CheckCircle2 className="size-3.5" />,
  not_available: <XCircle className="size-3.5" />,
  skipped:       <SkipForward className="size-3.5" />,
};

const STATUS_LABELS: Record<LaundryPickupStatus, string> = {
  pending: "Pending",
  picked_up: "Picked Up",
  not_available: "N/A",
  skipped: "Skipped",
};

function getMapUrl(
  student: Admission,
  rooms: { title: string; mapLink?: string; address?: string; location?: string }[],
  properties: { propertyId: string; propertyName: string; address?: string }[],
): string | null {
  const s = student as any;
  if (s.propertyId) {
    const room = rooms.find((r) => (r as any).id === s.propertyId);
    if (room?.mapLink) return room.mapLink;
    if (room?.address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.address)}`;
    if (room?.location) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.location)}`;
  }
  if (student.propertyName) {
    const room = rooms.find((r) => r.title?.toLowerCase() === student.propertyName!.toLowerCase());
    if (room?.mapLink) return room.mapLink;
    if (room?.address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.address)}`;
    if (room?.location) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.location)}`;
  }
  if (s.propertyId) {
    const prop = properties.find((p) => p.propertyId === s.propertyId);
    if (prop?.address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(prop.address)}`;
  }
  if (student.propertyName) {
    const prop = properties.find((p) => p.propertyName?.toLowerCase() === student.propertyName!.toLowerCase());
    if (prop?.address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(prop.address)}`;
  }
  if (student.propertyName) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(student.propertyName)}`;
  return null;
}

function greetingByHour() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// ── page ──────────────────────────────────────────────────────────────────────

function LaundryEmployeeDashboardPage() {
  const { user, userRole, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const today = todayDateString();

  const { data: employee } = useLaundryEmployeeByUid(user?.uid);

  const assignedLaundryIds: string[] = employee?.laundryIds ?? [];

  const [activeLaundryId, setActiveLaundryId] = useState<string>("");
  const resolvedLaundryId = activeLaundryId || assignedLaundryIds[0] || "";

  const { data: allLaundries = [] } = useLaundries();
  const { data: rooms = [] } = useRooms();
  const { data: properties = [] } = useProperties();

  const { data: admissions = [], isLoading: admLoading } = useAdmissions();
  const { data: pickups = [] } = useLaundryPickupsForDate(resolvedLaundryId || null, today);
  const { data: summary } = useLaundryPickupSummary(resolvedLaundryId || null, today);

  const [search, setSearch] = useState("");
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);

  // Guard: only laundry employees may view this page
  useEffect(() => {
    if (!authLoading && (!user || userRole === "admin")) {
      navigate({ to: "/employee/login", replace: true });
    }
  }, [authLoading, user, userRole, navigate]);

  useEffect(() => {
    if (!activeLaundryId && assignedLaundryIds.length > 0) {
      setActiveLaundryId(assignedLaundryIds[0]);
    }
  }, [assignedLaundryIds, activeLaundryId]);

  const students = useMemo(
    () =>
      resolvedLaundryId
        ? admissions.filter(
            (a) =>
              (a as any).laundryId === resolvedLaundryId &&
              (a as any).laundryStatus !== "cancelled",
          )
        : [],
    [admissions, resolvedLaundryId],
  );

  const filtered = students.filter((s) => {
    if (!search) return true;
    return (
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.phoneNumber.includes(search) ||
      (s.propertyName ?? "").toLowerCase().includes(search.toLowerCase())
    );
  });

  function getPickup(studentId: string, type: "pickup" | "delivery") {
    return pickups.find((p) => p.studentId === studentId && p.type === type);
  }

  async function setStatus(student: Admission, type: "pickup" | "delivery", status: LaundryPickupStatus) {
    if (!resolvedLaundryId || !employee) return;
    const key = `${student.id}-${type}`;
    setUpdatingKey(key);
    try {
      await upsertLaundryPickup({
        studentId: student.id,
        admissionId: student.admissionId,
        laundryId: resolvedLaundryId,
        employeeId: employee.id,
        date: today,
        type,
        status,
      });
      await qc.invalidateQueries({ queryKey: ["laundryPickups", resolvedLaundryId, today] });
      await qc.invalidateQueries({ queryKey: ["laundryPickupSummary", resolvedLaundryId, today] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update status.");
    } finally {
      setUpdatingKey(null);
    }
  }

  async function handleLogout() {
    await logout();
    navigate({ to: "/employee/login", replace: true });
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const greeting = `${greetingByHour()}, ${employee?.name?.split(" ")[0] ?? "there"} 👋`;
  const activeLaundryName = allLaundries.find((l) => l.id === resolvedLaundryId)?.laundryName
    ?? employee?.laundryNames?.[0]
    ?? "";

  const pickupPending  = summary ? (summary.pickup["pending"]  ?? 0) : students.length;
  const deliveryPending = summary ? (summary.delivery["pending"] ?? 0) : students.length;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* ── Header ── */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{greeting}</p>
            {assignedLaundryIds.length > 1 ? (
              <div className="mt-1 flex flex-wrap gap-1">
                {assignedLaundryIds.map((id, i) => {
                  const name = allLaundries.find((l) => l.id === id)?.laundryName
                    ?? employee?.laundryNames?.[i]
                    ?? id;
                  return (
                    <button
                      key={id}
                      onClick={() => setActiveLaundryId(id)}
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                        resolvedLaundryId === id
                          ? "gradient-brand text-primary-foreground shadow-soft"
                          : "border border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="truncate text-xs text-muted-foreground">{activeLaundryName}</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/employee/laundry/payouts">
                <Receipt className="mr-1.5 size-4" />
                Payouts
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Log out">
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl space-y-4 px-4 pt-4">

        {/* ── Summary stats ── */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-2xl border border-border bg-card p-3 shadow-soft text-center">
            <p className="text-[11px] text-muted-foreground">Students</p>
            <p className="text-xl font-bold">{students.length}</p>
          </div>
          <div className="rounded-2xl border border-warning/30 bg-warning/10 p-3 text-center">
            <p className="text-[11px] text-warning-foreground">Pickup Pending</p>
            <p className="text-xl font-bold text-warning-foreground">{pickupPending}</p>
          </div>
          <div className="rounded-2xl border border-primary/30 bg-primary/10 p-3 text-center">
            <p className="text-[11px] text-primary">Delivery Pending</p>
            <p className="text-xl font-bold text-primary">{deliveryPending}</p>
          </div>
        </div>

        {/* ── Date ── */}
        <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Today —{" "}
          {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </p>

        {/* ── Search ── */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search student, phone, property…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ── Student cards ── */}
        {admLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-2xl" />)
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
            <WashingMachine className="size-10 text-muted-foreground/40" />
            <p className="text-sm font-medium">
              {search
                ? "No students match your search."
                : resolvedLaundryId
                ? "No students assigned to this laundry."
                : "No laundry assigned to your account."}
            </p>
          </div>
        ) : (
          filtered.map((student) => {
            const mapUrl      = getMapUrl(student, rooms, properties);
            const pickupRec   = getPickup(student.id, "pickup");
            const deliveryRec = getPickup(student.id, "delivery");
            const lStatus     = (student as any).laundryStatus ?? "active";

            return (
              <div key={student.id} className="rounded-2xl border border-border bg-card p-4 shadow-soft">

                {/* ── Student info header ── */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{student.fullName}</p>
                    {student.propertyName && (
                      <p className="mt-0.5 truncate text-sm text-muted-foreground">
                        {student.propertyName}
                        {student.roomNumber ? ` · Room ${student.roomNumber}` : ""}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {student.phoneNumber && (
                      <Button asChild variant="outline" size="sm" className="shrink-0 border-green-500 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700">
                        <a href={`tel:${student.phoneNumber}`} aria-label={`Call ${student.fullName}`}>
                          <Phone className="mr-1.5 size-3.5" />
                          Call
                        </a>
                      </Button>
                    )}
                    {mapUrl && (
                      <Button asChild variant="outline" size="sm" className="shrink-0">
                        <a href={mapUrl} target="_blank" rel="noopener noreferrer" aria-label="Open in Maps">
                          <MapPin className="mr-1.5 size-3.5" />
                          Map
                        </a>
                      </Button>
                    )}
                    <Badge
                      variant="outline"
                      className={`shrink-0 text-[11px] capitalize ${
                        lStatus === "active"
                          ? "border-success/30 bg-success/10 text-success"
                          : lStatus === "paused"
                          ? "border-warning/30 bg-warning/10 text-warning-foreground"
                          : "border-destructive/20 bg-destructive/10 text-destructive"
                      }`}
                    >
                      {lStatus}
                    </Badge>
                  </div>
                </div>

                {/* ── Pickup / Delivery status buttons ── */}
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3">
                  {(["pickup", "delivery"] as const).map((type) => {
                    const record  = type === "pickup" ? pickupRec : deliveryRec;
                    const current: LaundryPickupStatus = record?.status ?? "pending";
                    const key     = `${student.id}-${type}`;
                    const isUpdating = updatingKey === key;

                    return (
                      <div key={type} className="space-y-1.5">
                        <p className="text-xs font-medium capitalize text-muted-foreground">{type}</p>
                        <div className="grid grid-cols-2 gap-1">
                          {(["picked_up", "pending", "not_available", "skipped"] as LaundryPickupStatus[]).map((s) => (
                            <button
                              key={s}
                              disabled={isUpdating || lStatus === "cancelled"}
                              onClick={() => setStatus(student, type, s)}
                              className={`flex items-center justify-center gap-1 rounded-lg border px-1 py-1.5 text-[11px] font-medium transition-all active:scale-95 ${
                                current === s
                                  ? STATUS_COLORS[s] + " ring-1 ring-current/30"
                                  : "border-border bg-muted/30 text-muted-foreground hover:bg-muted"
                              } ${lStatus === "cancelled" ? "cursor-not-allowed opacity-40" : ""}`}
                            >
                              {STATUS_ICONS[s]}
                              <span className="truncate">{STATUS_LABELS[s]}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
