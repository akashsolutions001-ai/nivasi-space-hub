import { useState, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft, Phone, MapPin, Search, UtensilsCrossed,
  CheckCircle2, Clock, XCircle, SkipForward, Pencil,
  RotateCcw, AlertCircle, MessageSquare, ChevronDown, ChevronUp,
  Loader2, FileText, UserMinus, Copy, ArrowRight, CalendarOff,
  UserCheck, UserX, Download, Sliders,
} from "lucide-react";
import { toast } from "sonner";

import { useIsAdmin } from "@/lib/auth";

import { AdminShell } from "@/components/nivasi/admin-shell";
import { MessExportDialog } from "@/components/nivasi/mess-export-dialog";
import { MessDailyTiffinDialog } from "@/components/nivasi/mess-daily-tiffin-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  useMesses, useAdmissions, useDeliveriesForDate, useDeliverySummary,
  useRooms, useProperties, useMessRecordsForDate, useMessRequestsForMess,
  useAllLeaveRequests,
} from "@/lib/hooks";
import { upsertDelivery, todayDateString, todayISTDateString, updateMess, unassignStudentFromMess } from "@/lib/db";
import type { Admission, DeliveryStatus, MessRecord, MessRequest } from "@/lib/types";

export const Route = createFileRoute("/admin/mess/$messId")({
  head: () => ({ meta: [{ title: "Mess Students — NivasiSpace Admin" }] }),
  component: MessStudentsPage,
});

// ── helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<DeliveryStatus, string> = {
  pending: "Pending",
  delivered: "Delivered",
  not_available: "Not Available",
  skipped: "Skipped",
};

const STATUS_COLORS: Record<DeliveryStatus, string> = {
  pending: "bg-warning/15 text-warning-foreground border-warning/30",
  delivered: "bg-success/15 text-success border-success/30",
  not_available: "bg-muted text-muted-foreground border-border",
  skipped: "bg-destructive/10 text-destructive border-destructive/20",
};

function getMapUrl(
  admission: Admission,
  rooms: { title: string; mapLink?: string; address?: string; location?: string }[],
  properties: { propertyId: string; propertyName: string; address?: string }[],
): string | null {
  // 1. Try room matched by propertyId (Firestore room doc ID)
  const a = admission as any;
  if (a.propertyId) {
    const room = rooms.find((r) => r.title && (r as any).id === a.propertyId);
    if (room?.mapLink) return room.mapLink;
    if (room?.address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.address)}`;
    if (room?.location) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.location)}`;
  }
  // 2. Try room matched by propertyName = room title
  if (admission.propertyName) {
    const room = rooms.find((r) => r.title?.toLowerCase() === admission.propertyName!.toLowerCase());
    if (room?.mapLink) return room.mapLink;
    if (room?.address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.address)}`;
    if (room?.location) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.location)}`;
  }
  // 3. Try property matched by propertyId
  if (a.propertyId) {
    const prop = properties.find((p) => p.propertyId === a.propertyId);
    if (prop?.address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(prop.address)}`;
  }
  // 4. Try property matched by propertyName
  if (admission.propertyName) {
    const prop = properties.find((p) => p.propertyName?.toLowerCase() === admission.propertyName!.toLowerCase());
    if (prop?.address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(prop.address)}`;
  }
  // 5. Last resort: search by propertyName string
  if (admission.propertyName) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(admission.propertyName)}`;
  return null;
}

// ── Tiffin record helpers ─────────────────────────────────────────────────────

const TIFFIN_STATUS_COLORS: Record<string, string> = {
  pending:      "bg-warning/15 text-warning-foreground border-warning/30",
  received:     "bg-success/15 text-success border-success/30",
  do_not_want:  "bg-muted text-muted-foreground border-border",
  other:        "bg-primary/10 text-primary border-primary/20",
};
const TIFFIN_STATUS_LABELS: Record<string, string> = {
  pending: "Pending", received: "Received", do_not_want: "Do Not Want", other: "Other",
};
const RETURN_STATUS_COLORS: Record<string, string> = {
  pending:      "bg-warning/15 text-warning-foreground border-warning/30",
  returned:     "bg-success/15 text-success border-success/30",
  not_required: "bg-muted text-muted-foreground border-border",
};
const RETURN_STATUS_LABELS: Record<string, string> = {
  pending: "Return Pending", returned: "Returned ✓", not_required: "Not Required",
};
const REQUEST_TYPE_LABELS: Record<string, string> = {
  less_quantity: "Less Quantity", more_quantity: "More Quantity", other: "Other",
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

// ── Per-student tiffin+request detail panel (admin) ───────────────────────────

function StudentDetailPanel({
  student, record, requests,
}: { student: Admission; record: MessRecord | undefined; requests: MessRequest[] }) {
  const [open, setOpen] = useState(false);
  const activeRequest = requests.find((r) => r.studentId === student.id && r.status === "active");
  const hasActivity =
    record?.lunchStatus === "other" ||
    record?.dinnerStatus === "other" ||
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
              <span>Requests</span>
              {hasActivity && <span className="inline-flex size-1.5 rounded-full bg-primary shrink-0" />}
            </>
          )}
        </span>
        {open ? <ChevronUp className="size-3 shrink-0" /> : <ChevronDown className="size-3 shrink-0" />}
      </button>
      {open && (
        <div className="mt-2 space-y-2">
          {/* Lunch */}
          <div className="rounded-lg bg-muted/30 px-3 py-2 space-y-1">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Lunch</p>
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
              {record?.lunchStatus === "other" && record.lunchOtherReason && (
                <span className="text-[10px] text-muted-foreground italic">"{record.lunchOtherReason}"</span>
              )}
            </div>
          </div>
          {/* Dinner */}
          <div className="rounded-lg bg-muted/30 px-3 py-2 space-y-1">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Dinner</p>
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
              {record?.dinnerStatus === "other" && record.dinnerOtherReason && (
                <span className="text-[10px] text-muted-foreground italic">"{record.dinnerOtherReason}"</span>
              )}
            </div>
          </div>
          {/* Active special request */}
          {activeRequest && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 space-y-1">
              <p className="text-[11px] font-semibold text-primary flex items-center gap-1">
                <AlertCircle className="size-3" /> Special Request
              </p>
              <Badge variant="outline" className="text-[10px]">
                {REQUEST_TYPE_LABELS[activeRequest.requestType] ?? activeRequest.requestType}
              </Badge>
              {activeRequest.description && (
                <p className="text-xs text-foreground">"{activeRequest.description}"</p>
              )}
            </div>
          )}
          {/* No activity */}
          {!hasActivity && (
            <p className="text-xs text-muted-foreground px-1">No tiffin activity recorded today.</p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Mess Description editor dialog ────────────────────────────────────────────

interface DescriptionDialogProps {
  open: boolean;
  onClose: () => void;
  messId: string;
  currentDescription: string;
}

function DescriptionDialog({ open, onClose, messId, currentDescription }: DescriptionDialogProps) {
  const [value, setValue] = useState(currentDescription);
  const [saving, setSaving] = useState(false);
  const qc = useQueryClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateMess(messId, { messDescription: value.trim() } as any);
      await qc.invalidateQueries({ queryKey: ["messes"] });
      toast.success("Mess description updated.");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update description.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Mess Description</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="mess-desc">Description</Label>
            <Textarea
              id="mess-desc"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={5}
              placeholder="e.g. Lunch and dinner provided daily. Lunch: 1 PM – 2 PM. Dinner: 8 PM – 9 PM."
            />
            <p className="text-[11px] text-muted-foreground">
              This description is visible to all assigned students and mess employees.
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>Cancel</Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
              Save Description
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

function MessStudentsPage() {
  const { messId } = Route.useParams();
  const qc = useQueryClient();
  const today = todayDateString();
  const todayIST = todayISTDateString();

  const { data: messes = [], isLoading: messLoading } = useMesses();
  const { data: admissions = [], isLoading: admLoading } = useAdmissions();
  const { data: deliveries = [] } = useDeliveriesForDate(messId, today);
  const { data: summary } = useDeliverySummary(messId, today);
  const { data: rooms = [] } = useRooms();
  const { data: properties = [] } = useProperties();
  const { data: messRecords = [] } = useMessRecordsForDate(messId, todayIST);
  const { data: messRequests = [] } = useMessRequestsForMess(messId);
  const { data: allLeaves = [] } = useAllLeaveRequests();

  const mess = messes.find((m) => m.id === messId);
  const students = useMemo(
    () => admissions.filter((a) => (a as any).messId === messId),
    [admissions, messId],
  );

  // Active approved leaves covering today
  const studentLeaveMap = useMemo(() => {
    const map = new Map<string, typeof allLeaves[0]>();
    for (const l of allLeaves) {
      if (l.status === "approved") {
        const from = l.fromDate;
        const to = l.toDate;
        if (from <= todayIST && (!to || todayIST <= to)) {
          if (l.admissionId) map.set(l.admissionId, l);
          if (l.studentId) map.set(l.studentId, l);
        }
      }
    }
    return map;
  }, [allLeaves, todayIST]);

  // Headcount calculation for mess kitchen
  const kitchenCounts = useMemo(() => {
    let present = 0;
    let onLeave = 0;
    let veg = 0;
    let nonVeg = 0;

    for (const s of students) {
      const isCancelled = (s as any).tiffinStatus === "cancelled";
      if (isCancelled) continue;

      const leave = studentLeaveMap.get(s.admissionId) || studentLeaveMap.get(s.id);
      if (leave) {
        onLeave++;
      } else {
        present++;
        const isNonVeg = ((s.mealPreference || "veg").toLowerCase().includes("non"));
        if (isNonVeg) {
          nonVeg++;
        } else {
          veg++;
        }
      }
    }

    return { present, onLeave, veg, nonVeg, totalActive: present + onLeave };
  }, [students, studentLeaveMap]);

  const [search, setSearch] = useState("");
  const [tiffinFilter, setTiffinFilter] = useState("all");
  const [attendanceFilter, setAttendanceFilter] = useState("all");
  const [mealFilter, setMealFilter] = useState("all");
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);
  const [descDialogOpen, setDescDialogOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [dailyOpsOpen, setDailyOpsOpen] = useState(false);
  const [unassigningId, setUnassigningId] = useState<string | null>(null);

  const isAdmin = useIsAdmin();

  const handleCopyKitchenSummary = () => {
    const messTitle = mess?.messName || "MESS";
    const text = `📋 *${messTitle.toUpperCase()} KITCHEN COUNT*\n📅 *Date:* ${todayIST}\n-----------------------------------\n🟢 *Veg Meals to Cook:* ${kitchenCounts.veg}\n🍗 *Non-Veg Meals to Cook:* ${kitchenCounts.nonVeg}\n👥 *Total Students Present:* ${kitchenCounts.present}\n✈️ *Students on Leave (Skip):* ${kitchenCounts.onLeave}\n📊 *Total Active Subscriptions:* ${kitchenCounts.totalActive}`;
    navigator.clipboard.writeText(text);
    toast.success("Kitchen meal count copied! Ready to paste into WhatsApp.");
  };

  async function handleUnassign(student: Admission) {
    if (!window.confirm(`Are you sure you want to unassign ${student.fullName} from ${mess?.messName ?? "this mess"}?`)) {
      return;
    }
    setUnassigningId(student.id);
    try {
      await unassignStudentFromMess(student.id);
      await qc.invalidateQueries({ queryKey: ["admissions"] });
      toast.success(`${student.fullName} unassigned from mess.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not unassign student.");
    } finally {
      setUnassigningId(null);
    }
  }

  const filtered = students.filter((s) => {
    const matchSearch = !search ||
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.phoneNumber.includes(search) ||
      (s.propertyName ?? "").toLowerCase().includes(search.toLowerCase());
    const matchTiffin = tiffinFilter === "all" || (s as any).tiffinStatus === tiffinFilter;

    const leave = studentLeaveMap.get(s.admissionId) || studentLeaveMap.get(s.id);
    const isPresent = !leave;
    const matchAttendance =
      attendanceFilter === "all" ||
      (attendanceFilter === "present" && isPresent) ||
      (attendanceFilter === "on_leave" && !isPresent);

    const isNonVeg = ((s.mealPreference || "veg").toLowerCase().includes("non"));
    const matchMeal =
      mealFilter === "all" ||
      (mealFilter === "veg" && !isNonVeg) ||
      (mealFilter === "non_veg" && isNonVeg);

    return matchSearch && matchTiffin && matchAttendance && matchMeal;
  });

  function getDelivery(studentId: string, meal: "lunch" | "dinner") {
    return deliveries.find((d) => d.studentId === studentId && d.meal === meal);
  }

  async function setDeliveryStatus(student: Admission, meal: "lunch" | "dinner", status: DeliveryStatus) {
    const key = `${student.id}-${meal}`;
    setUpdatingKey(key);
    try {
      await upsertDelivery({
        studentId: student.id,
        admissionId: student.admissionId,
        messId,
        employeeId: "admin",
        date: today,
        meal,
        status,
      });
      await qc.invalidateQueries({ queryKey: ["deliveries", messId, today] });
      await qc.invalidateQueries({ queryKey: ["deliverySummary", messId, today] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update delivery.");
    } finally {
      setUpdatingKey(null);
    }
  }

  const isLoading = messLoading || admLoading;

  return (
    <AdminShell
      title={mess?.messName ?? "Mess Students"}
      subtitle={mess ? `Owner: ${mess.ownerName || "—"}  ·  ${students.length} students enrolled` : ""}
      action={
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExportOpen(true)}
            className="gap-1.5 text-xs h-8 border-orange-500/30 bg-orange-50/60 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/40 hover:text-orange-700 dark:hover:text-orange-300 font-medium shadow-soft"
            title="Export Student Register to Excel"
          >
            <Download className="size-3.5" /> Export Register
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyKitchenSummary}
            className="gap-1.5 text-xs h-8"
          >
            <Copy className="size-3.5" /> Copy Kitchen Count
          </Button>
          <Button asChild variant="outline" size="sm" className="h-8">
            <Link to="/admin/student-headcount">
              Full Headcount <ArrowRight className="ml-1 size-3.5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-8">
            <Link to="/admin/mess">
              <ArrowLeft className="mr-1.5 size-3.5" /> Back
            </Link>
          </Button>
        </div>
      }
    >
      {/* Live Kitchen Preparation Banner */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-card to-card p-4 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UtensilsCrossed className="size-4" />
            </div>
            <div>
              <p className="font-semibold text-sm">Today's Kitchen Preparation Headcount</p>
              <p className="text-xs text-muted-foreground">Excludes students currently away on approved leave</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs gap-1.5"
              onClick={() => setDailyOpsOpen(true)}
            >
              <Sliders className="size-3" /> Daily Operations & Mess-Off
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs gap-1.5 border-orange-500/30 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/40"
              onClick={() => setExportOpen(true)}
            >
              <Download className="size-3" /> Export Monthly Report (.xlsx)
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="h-7 text-xs gap-1.5"
              onClick={handleCopyKitchenSummary}
            >
              <Copy className="size-3" /> WhatsApp Kitchen Summary
            </Button>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-center">
            <p className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300">🟢 Pure Veg Meals</p>
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{kitchenCounts.veg}</p>
            <p className="text-[10px] text-muted-foreground">Cook for present students</p>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-center">
            <p className="text-[11px] font-medium text-amber-800 dark:text-amber-300">🍗 Non-Veg Meals</p>
            <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{kitchenCounts.nonVeg}</p>
            <p className="text-[10px] text-muted-foreground">Cook for present students</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 text-center">
            <p className="text-[11px] font-medium text-muted-foreground">👥 Present (Eating)</p>
            <p className="text-2xl font-bold text-foreground">{kitchenCounts.present}</p>
            <p className="text-[10px] text-muted-foreground">Total to serve today</p>
          </div>
          <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 p-3 text-center">
            <p className="text-[11px] font-medium text-sky-800 dark:text-sky-300">✈️ On Leave (Skip)</p>
            <p className="text-2xl font-bold text-sky-700 dark:text-sky-400">{kitchenCounts.onLeave}</p>
            <p className="text-[10px] text-muted-foreground">Approved leave away</p>
          </div>
        </div>
      </div>

      {/* Mess Description block */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-soft space-y-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
            <FileText className="size-3.5" /> Mess Description
          </p>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 gap-1 text-xs"
            onClick={() => setDescDialogOpen(true)}
          >
            <Pencil className="size-3" /> Edit
          </Button>
        </div>
        {(mess as any)?.messDescription ? (
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {(mess as any).messDescription}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No description set. Click Edit to add one.
          </p>
        )}
      </div>
      {/* Today's summary */}
      {summary && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(["delivered", "pending", "skipped", "not_available"] as DeliveryStatus[]).map((s) => (
            <div key={s} className="rounded-2xl border border-border bg-card p-3 shadow-soft text-center">
              <p className="text-[11px] text-muted-foreground capitalize">{STATUS_LABELS[s]}</p>
              <p className="text-xl font-bold">
                {((summary.lunch[s] ?? 0) + (summary.dinner[s] ?? 0))}
              </p>
              <p className="text-[10px] text-muted-foreground">
                L:{summary.lunch[s] ?? 0} / D:{summary.dinner[s] ?? 0}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="mt-4 flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search student, phone, property…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={attendanceFilter} onValueChange={setAttendanceFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Attendance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Attendance</SelectItem>
            <SelectItem value="present">Present (Eating)</SelectItem>
            <SelectItem value="on_leave">On Leave (Skip)</SelectItem>
          </SelectContent>
        </Select>
        <Select value={mealFilter} onValueChange={setMealFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Meal Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Meals</SelectItem>
            <SelectItem value="veg">Pure Veg</SelectItem>
            <SelectItem value="non_veg">Non-Veg</SelectItem>
          </SelectContent>
        </Select>
        <Select value={tiffinFilter} onValueChange={setTiffinFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Tiffin status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tiffin</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Student list */}
      <div className="mt-4 space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
            <UtensilsCrossed className="size-10 text-muted-foreground/40" />
            <p className="text-sm font-medium">
              {search || tiffinFilter !== "all" ? "No students match your filters." : "No students assigned to this mess yet."}
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/mess/assign">Assign Students</Link>
            </Button>
          </div>
        ) : (
          filtered.map((student) => {
            const mapUrl = getMapUrl(student as any, rooms, properties);
            const lunch = getDelivery(student.id, "lunch");
            const dinner = getDelivery(student.id, "dinner");
            const tiffin = (student as any).tiffinStatus ?? "active";
            const leave = studentLeaveMap.get(student.admissionId) || studentLeaveMap.get(student.id);
            const isNonVeg = ((student.mealPreference || "veg").toLowerCase().includes("non"));

            return (
              <div key={student.id} className={`rounded-2xl border bg-card p-4 shadow-soft transition-colors ${leave ? "border-sky-500/30 bg-sky-500/[0.02]" : "border-border"}`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  {/* Student info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{student.fullName}</h3>
                      {/* Meal Preference Badge */}
                      {isNonVeg ? (
                        <Badge variant="outline" className="text-[11px] border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400">
                          🍗 Non-Veg
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[11px] border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                          🥬 Pure Veg
                        </Badge>
                      )}
                      {/* Leave or Tiffin Status */}
                      {leave ? (
                        <Badge variant="outline" className="text-[11px] border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-400 font-medium">
                          ✈️ On Leave ({leave.fromDate}{leave.toDate ? ` → ${leave.toDate}` : " · Open"})
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className={`text-[11px] capitalize ${tiffin === "active" ? "border-success/30 bg-success/10 text-success" : tiffin === "paused" ? "border-warning/30 bg-warning/10 text-warning-foreground" : "border-destructive/20 bg-destructive/10 text-destructive"}`}
                        >
                          Tiffin: {tiffin}
                        </Badge>
                      )}
                    </div>
                    {leave && (
                      <p className="mt-1 text-xs text-sky-700 dark:text-sky-400 font-medium">
                        Student is on approved leave. Do not prepare meal.
                        {leave.reason ? ` Reason: "${leave.reason}"` : ""}
                      </p>
                    )}
                    {student.phoneNumber && (
                      <a href={`tel:${student.phoneNumber}`} className="mt-0.5 flex items-center gap-1.5 text-sm text-primary hover:underline">
                        <Phone className="size-3.5" />{student.phoneNumber}
                      </a>
                    )}
                    {student.propertyName && (
                      <p className="mt-0.5 text-sm text-muted-foreground">{student.propertyName}{student.roomNumber ? ` · Room ${student.roomNumber}` : ""}</p>
                    )}
                  </div>
                  {/* Call & Map */}
                  <div className="flex shrink-0 gap-1.5">
                    {student.phoneNumber && (
                      <Button asChild variant="outline" size="sm" className="shrink-0 border-green-500 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700">
                        <a href={`tel:${student.phoneNumber}`} aria-label={`Call ${student.fullName}`}>
                          <Phone className="mr-1.5 size-3.5" /> Call
                        </a>
                      </Button>
                    )}
                    {mapUrl && (
                      <Button asChild variant="outline" size="sm" className="shrink-0">
                        <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                          <MapPin className="mr-1.5 size-3.5" /> Map
                        </a>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Delivery status row */}
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3">
                  {leave && (
                    <div className="col-span-2 rounded-lg bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 text-[11px] text-sky-700 dark:text-sky-300 flex items-center justify-between">
                      <span className="font-medium">✈️ Meals paused · Student is on approved leave</span>
                      <span className="text-[10px] opacity-80">{leave.fromDate} to {leave.toDate || "Open"}</span>
                    </div>
                  )}
                  {(["lunch", "dinner"] as const).map((meal) => {
                    const delivery = meal === "lunch" ? lunch : dinner;
                    const currentStatus: DeliveryStatus = delivery?.status ?? "pending";
                    const key = `${student.id}-${meal}`;
                    const isUpdating = updatingKey === key;
                    return (
                      <div key={meal} className="space-y-1.5">
                        <p className="text-xs font-medium capitalize text-muted-foreground">{meal}</p>
                        <Select
                          value={currentStatus}
                          onValueChange={(v) => setDeliveryStatus(student, meal, v as DeliveryStatus)}
                          disabled={isUpdating || tiffin === "cancelled"}
                        >
                          <SelectTrigger className={`h-8 text-xs ${STATUS_COLORS[currentStatus]}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="not_available">Not Available</SelectItem>
                            <SelectItem value="skipped">Skipped</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    );
                  })}
                </div>

                {/* Student tiffin record + special requests */}
                <StudentDetailPanel
                  student={student}
                  record={messRecords.find((r) => r.studentId === student.id)}
                  requests={messRequests}
                />

                {/* Unassign Mess button — Only visible to Admins, not Employees */}
                {isAdmin && (
                  <div className="mt-2.5 pt-2.5 border-t border-dashed border-border/80 flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground font-medium">Mess Assignment</span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={unassigningId === student.id}
                      onClick={() => handleUnassign(student)}
                      className="h-7 px-2.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 gap-1.5"
                    >
                      {unassigningId === student.id ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <UserMinus className="size-3" />
                      )}
                      Unassign Mess
                    </Button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Description editor */}
      {mess && (
        <DescriptionDialog
          open={descDialogOpen}
          onClose={() => setDescDialogOpen(false)}
          messId={messId}
          currentDescription={(mess as any)?.messDescription ?? ""}
        />
      )}

      {/* Mess Student Register Export Dialog */}
      <MessExportDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        mess={mess ?? null}
        allMesses={messes}
        admissions={admissions}
      />

      {/* Daily Operations & Mess-Off Dialog */}
      {mess && (
        <MessDailyTiffinDialog
          open={dailyOpsOpen}
          onClose={() => setDailyOpsOpen(false)}
          mess={mess}
          admissions={admissions}
        />
      )}
    </AdminShell>
  );
}
