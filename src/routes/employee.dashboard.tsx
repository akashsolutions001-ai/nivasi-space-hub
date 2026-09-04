import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  LogOut, Phone, MapPin, UtensilsCrossed, Loader2, Search,
  CheckCircle2, Clock, XCircle, SkipForward, Zap, Receipt,
  RotateCcw, AlertCircle, MessageSquare, ChevronDown, ChevronUp,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import {
  useEmployeeByUid, useAdmissions, useDeliveriesForDate, useDeliverySummary,
  useMesses, useRooms, useProperties, useMessRecordsForDate, useMessRequestsForMess,
} from "@/lib/hooks";
import { upsertDelivery, todayDateString, todayISTDateString } from "@/lib/db";
import type { Admission, DeliveryStatus, MessRecord, MessRequest } from "@/lib/types";

export const Route = createFileRoute("/employee/dashboard")({
  head: () => ({ meta: [{ title: "Delivery Dashboard — NivasiSpace" }] }),
  component: EmployeeDashboardPage,
});

// ── helpers ───────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<DeliveryStatus, string> = {
  pending:       "bg-warning/15 text-warning-foreground border-warning/30",
  delivered:     "bg-success/15 text-success border-success/30",
  not_available: "bg-muted text-muted-foreground border-border",
  skipped:       "bg-destructive/10 text-destructive border-destructive/20",
};

const STATUS_ICONS: Record<DeliveryStatus, React.ReactNode> = {
  pending:       <Clock className="size-3.5" />,
  delivered:     <CheckCircle2 className="size-3.5" />,
  not_available: <XCircle className="size-3.5" />,
  skipped:       <SkipForward className="size-3.5" />,
};

// ── Tiffin record helpers ─────────────────────────────────────────────────────

const TIFFIN_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  received: "Received",
  do_not_want: "Do Not Want",
  other: "Other",
};

const TIFFIN_STATUS_COLORS: Record<string, string> = {
  pending:      "bg-warning/15 text-warning-foreground border-warning/30",
  received:     "bg-success/15 text-success border-success/30",
  do_not_want:  "bg-muted text-muted-foreground border-border",
  other:        "bg-primary/10 text-primary border-primary/20",
};

const RETURN_STATUS_LABELS: Record<string, string> = {
  pending: "Return Pending",
  returned: "Returned ✓",
  not_required: "Not Required",
};

const RETURN_STATUS_COLORS: Record<string, string> = {
  pending:      "bg-warning/15 text-warning-foreground border-warning/30",
  returned:     "bg-success/15 text-success border-success/30",
  not_required: "bg-muted text-muted-foreground border-border",
};

const REQUEST_TYPE_LABELS: Record<string, string> = {
  less_quantity: "Less Quantity",
  more_quantity: "More Quantity",
  other: "Other",
};

function TiffinBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={`text-[10px] ${TIFFIN_STATUS_COLORS[status] ?? ""}`}>
      {TIFFIN_STATUS_LABELS[status] ?? status}
    </Badge>
  );
}

function ReturnBadge({ status }: { status: string | undefined }) {
  const s = status ?? "pending";
  return (
    <Badge variant="outline" className={`text-[10px] ${RETURN_STATUS_COLORS[s] ?? ""}`}>
      {RETURN_STATUS_LABELS[s] ?? s}
    </Badge>
  );
}

// ── Per-student tiffin+request detail panel ───────────────────────────────────

interface StudentDetailPanelProps {
  student: Admission;
  record: MessRecord | undefined;
  requests: MessRequest[];
}

function StudentDetailPanel({ student, record, requests }: StudentDetailPanelProps) {
  const [open, setOpen] = useState(false);
  const activeRequest = requests.find((r) => r.studentId === student.id && r.status === "active");
  const hasOther =
    record?.lunchStatus === "other" || record?.dinnerStatus === "other";
  const hasActivity =
    hasOther ||
    activeRequest ||
    record?.lunchStatus === "received" ||
    record?.dinnerStatus === "received";

  return (
    <div className="border-t border-border mt-2 pt-2">
      <button
        className="flex w-full items-center justify-between text-xs text-muted-foreground py-1"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="flex items-center gap-1.5 flex-wrap">
          <MessageSquare className="size-3 shrink-0" />
          {activeRequest ? (
            <>
              <span className="font-medium text-foreground">
                {REQUEST_TYPE_LABELS[activeRequest.requestType] ?? activeRequest.requestType}
              </span>
              {activeRequest.description && (
                <span className="text-muted-foreground truncate max-w-[180px]">"{activeRequest.description}"</span>
              )}
              <span className="inline-flex size-1.5 rounded-full bg-primary shrink-0" />
            </>
          ) : (
            <>
              <span>Tiffin Detail & Requests</span>
              {hasActivity && <span className="inline-flex size-1.5 rounded-full bg-primary shrink-0" />}
            </>
          )}
        </span>
        {open ? <ChevronUp className="size-3 shrink-0" /> : <ChevronDown className="size-3 shrink-0" />}
      </button>

      {open && (
        <div className="mt-2 space-y-3">
          {/* Lunch detail */}
          <div className="rounded-lg bg-muted/30 px-3 py-2 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Lunch</p>
            <div className="flex flex-wrap gap-1.5 items-center">
              <TiffinBadge status={record?.lunchStatus ?? "pending"} />
              {record?.lunchStatus === "received" && (
                <>
                  <RotateCcw className="size-3 text-muted-foreground" />
                  <ReturnBadge status={record.lunchReturnStatus} />
                  {record.lunchReturnedTo && (
                    <span className="text-[10px] text-muted-foreground">→ {record.lunchReturnedTo}</span>
                  )}
                </>
              )}
              {record?.lunchStatus === "other" && (
                <span className="text-[10px] text-muted-foreground italic">
                  "{record.lunchOtherReason}"
                </span>
              )}
            </div>
          </div>

          {/* Dinner detail */}
          <div className="rounded-lg bg-muted/30 px-3 py-2 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Dinner</p>
            <div className="flex flex-wrap gap-1.5 items-center">
              <TiffinBadge status={record?.dinnerStatus ?? "pending"} />
              {record?.dinnerStatus === "received" && (
                <>
                  <RotateCcw className="size-3 text-muted-foreground" />
                  <ReturnBadge status={record.dinnerReturnStatus} />
                  {record.dinnerReturnedTo && (
                    <span className="text-[10px] text-muted-foreground">→ {record.dinnerReturnedTo}</span>
                  )}
                </>
              )}
              {record?.dinnerStatus === "other" && (
                <span className="text-[10px] text-muted-foreground italic">
                  "{record.dinnerOtherReason}"
                </span>
              )}
            </div>
          </div>

          {/* Active special request */}
          {activeRequest && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-primary flex items-center gap-1">
                <AlertCircle className="size-3" /> Special Request
              </p>
              <Badge variant="outline" className="text-[10px]">
                {REQUEST_TYPE_LABELS[activeRequest.requestType] ?? activeRequest.requestType}
              </Badge>
              {activeRequest.description && (
                <p className="text-xs text-foreground mt-0.5">"{activeRequest.description}"</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Build a Google Maps URL by looking up the student's assigned room/property from Firestore */
function getMapUrl(
  student: Admission,
  rooms: { title: string; mapLink?: string; address?: string; location?: string }[],
  properties: { propertyId: string; propertyName: string; address?: string }[],
): string | null {
  const s = student as any;
  // 1. Room matched by propertyId
  if (s.propertyId) {
    const room = rooms.find((r) => (r as any).id === s.propertyId);
    if (room?.mapLink) return room.mapLink;
    if (room?.address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.address)}`;
    if (room?.location) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.location)}`;
  }
  // 2. Room matched by propertyName = room title
  if (student.propertyName) {
    const room = rooms.find((r) => r.title?.toLowerCase() === student.propertyName!.toLowerCase());
    if (room?.mapLink) return room.mapLink;
    if (room?.address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.address)}`;
    if (room?.location) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.location)}`;
  }
  // 3. Property matched by propertyId
  if (s.propertyId) {
    const prop = properties.find((p) => p.propertyId === s.propertyId);
    if (prop?.address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(prop.address)}`;
  }
  // 4. Property matched by propertyName
  if (student.propertyName) {
    const prop = properties.find((p) => p.propertyName?.toLowerCase() === student.propertyName!.toLowerCase());
    if (prop?.address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(prop.address)}`;
  }
  // 5. Last resort: search by propertyName
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

function EmployeeDashboardPage() {
  const { user, userRole, employeeMessIds, employeeMessNames, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const today = todayDateString();

  // Resolve full employee doc for the name
  const { data: employee } = useEmployeeByUid(user?.uid);

  // Merge messIds from auth (fast) with employee doc (authoritative)
  const assignedMessIds: string[] = employee?.messIds?.length
    ? employee.messIds
    : employeeMessIds;

  // Active mess selection — default to first assigned mess
  const [activeMessId, setActiveMessId] = useState<string>("");
  const resolvedMessId = activeMessId || assignedMessIds[0] || "";

  // Load all messes to get names
  const { data: allMesses = [] } = useMesses();
  const { data: rooms = [] } = useRooms();
  const { data: properties = [] } = useProperties();

  // Fetch data scoped to the currently selected mess
  const { data: admissions = [], isLoading: admLoading } = useAdmissions();
  const { data: deliveries = [] } = useDeliveriesForDate(resolvedMessId || null, today);
  const { data: summary } = useDeliverySummary(resolvedMessId || null, today);
  const todayIST = todayISTDateString();
  const { data: messRecords = [] } = useMessRecordsForDate(resolvedMessId || null, todayIST);
  const { data: messRequests = [] } = useMessRequestsForMess(resolvedMessId || null);

  const [search, setSearch] = useState("");
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);

  // Guard: only mess employees may view this page
  useEffect(() => {
    if (!authLoading && (!user || userRole === "admin")) {
      navigate({ to: "/employee/login", replace: true });
    }
  }, [authLoading, user, userRole, navigate]);

  // Reset mess selection when assigned messes load
  useEffect(() => {
    if (!activeMessId && assignedMessIds.length > 0) {
      setActiveMessId(assignedMessIds[0] ?? "");
    }
  }, [assignedMessIds, activeMessId]);

  // Students for the active mess — only delivery-relevant fields shown in UI
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

  const filtered = students.filter((s) => {
    if (!search) return true;
    return (
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.phoneNumber.includes(search) ||
      (s.propertyName ?? "").toLowerCase().includes(search.toLowerCase())
    );
  });

  function getDelivery(studentId: string, meal: "lunch" | "dinner") {
    return deliveries.find((d) => d.studentId === studentId && d.meal === meal);
  }

  async function setStatus(student: Admission, meal: "lunch" | "dinner", status: DeliveryStatus) {
    if (!resolvedMessId || !employee) return;
    const key = `${student.id}-${meal}`;
    setUpdatingKey(key);
    try {
      await upsertDelivery({
        studentId: student.id,
        admissionId: student.admissionId,
        messId: resolvedMessId,
        employeeId: employee.id,
        date: today,
        meal,
        status,
      });
      await qc.invalidateQueries({ queryKey: ["deliveries", resolvedMessId, today] });
      await qc.invalidateQueries({ queryKey: ["deliverySummary", resolvedMessId, today] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update delivery.");
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
  const activeMessName = allMesses.find((m) => m.id === resolvedMessId)?.messName
    ?? employee?.messNames?.[0]
    ?? employeeMessNames[0]
    ?? "";

  const lunchPending  = summary ? (summary.lunch["pending"]  ?? 0) : students.length;
  const dinnerPending = summary ? (summary.dinner["pending"] ?? 0) : students.length;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* ── Header ── */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{greeting}</p>
            {/* Mess switcher — shown only when employee has multiple messes */}
            {assignedMessIds.length > 1 ? (
              <div className="flex flex-wrap gap-1 mt-1">
                {assignedMessIds.map((id, i) => {
                  const name = allMesses.find((m) => m.id === id)?.messName
                    ?? employee?.messNames?.[i]
                    ?? id;
                  return (
                    <button
                      key={id}
                      onClick={() => setActiveMessId(id)}
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
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
            ) : (
              <p className="truncate text-xs text-muted-foreground">{activeMessName}</p>
            )}
          </div>
          <div className="flex shrink-0 gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/employee/mess/payouts">
                <Receipt className="mr-1.5 size-4" />
                Payouts
              </Link>
            </Button>
            <Button asChild size="sm" className="gradient-brand text-primary-foreground shadow-soft">
              <Link to="/employee/delivery">
                <Zap className="mr-1.5 size-4" />
                Start Delivery
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
            <p className="text-[11px] text-warning-foreground">Lunch Pending</p>
            <p className="text-xl font-bold text-warning-foreground">{lunchPending}</p>
          </div>
          <div className="rounded-2xl border border-primary/30 bg-primary/10 p-3 text-center">
            <p className="text-[11px] text-primary">Dinner Pending</p>
            <p className="text-xl font-bold text-primary">{dinnerPending}</p>
          </div>
        </div>

        {/* ── Date ── */}
        <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Today —{" "}
          {new Date().toLocaleDateString("en-IN", {
            day: "numeric", month: "long", year: "numeric",
          })}
        </p>

        {/* ── Mess description ── */}
        {(() => {
          const activeMess = allMesses.find((m) => m.id === resolvedMessId);
          const desc = (activeMess as any)?.messDescription as string | undefined;
          if (!desc) return null;
          return (
            <div className="rounded-2xl border border-border bg-card px-4 py-3 shadow-soft text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground mb-1">Mess Description</p>
              {desc}
            </div>
          );
        })()}

        {/* ── Search ── */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search student name or property…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ── Student cards ── */}
        {admLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-2xl" />
          ))
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
            <UtensilsCrossed className="size-10 text-muted-foreground/40" />
            <p className="text-sm font-medium">
              {search
                ? "No students match your search."
                : resolvedMessId
                ? "No students assigned to this mess."
                : "No mess assigned to your account."}
            </p>
          </div>
        ) : (
          filtered.map((student) => {
            const mapUrl    = getMapUrl(student, rooms, properties);
            const lunch     = getDelivery(student.id, "lunch");
            const dinner    = getDelivery(student.id, "dinner");
            const tiffin    = (student as any).tiffinStatus ?? "active";

            return (
              <div key={student.id} className="rounded-2xl border border-border bg-card p-4 shadow-soft">

                {/* ── Delivery-relevant info only ── */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    {/* Name */}
                    <p className="truncate font-semibold">{student.fullName}</p>
                    {/* Property & room — needed for navigation */}
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
                        tiffin === "active"
                          ? "border-success/30 bg-success/10 text-success"
                          : tiffin === "paused"
                          ? "border-warning/30 bg-warning/10 text-warning-foreground"
                          : "border-destructive/20 bg-destructive/10 text-destructive"
                      }`}
                    >
                      {tiffin}
                    </Badge>
                  </div>
                </div>

                {/* ── Delivery status buttons ── */}
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3">
                  {(["lunch", "dinner"] as const).map((meal) => {
                    const delivery  = meal === "lunch" ? lunch : dinner;
                    const current: DeliveryStatus = delivery?.status ?? "pending";
                    const key       = `${student.id}-${meal}`;
                    const isUpdating = updatingKey === key;

                    return (
                      <div key={meal} className="space-y-1.5">
                        <p className="text-xs font-medium capitalize text-muted-foreground">{meal}</p>
                        <div className="grid grid-cols-2 gap-1">
                          {(["delivered", "pending", "not_available", "skipped"] as DeliveryStatus[]).map((s) => (
                            <button
                              key={s}
                              disabled={isUpdating || tiffin === "cancelled"}
                              onClick={() => setStatus(student, meal, s)}
                              className={`flex items-center justify-center gap-1 rounded-lg border px-1 py-1.5 text-[11px] font-medium transition-all active:scale-95 ${
                                current === s
                                  ? STATUS_COLORS[s] + " ring-1 ring-current/30"
                                  : "border-border bg-muted/30 text-muted-foreground hover:bg-muted"
                              } ${tiffin === "cancelled" ? "cursor-not-allowed opacity-40" : ""}`}
                            >
                              {STATUS_ICONS[s]}
                              <span className="truncate">
                                {s === "not_available" ? "N/A" : s.charAt(0).toUpperCase() + s.slice(1)}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ── Student tiffin record + special requests ── */}
                <StudentDetailPanel
                  student={student}
                  record={messRecords.find((r) => r.studentId === student.id)}
                  requests={messRequests}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
