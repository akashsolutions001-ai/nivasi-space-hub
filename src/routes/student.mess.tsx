import { useState, useEffect, useCallback } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  UtensilsCrossed, Loader2, CheckCircle2,
  XCircle, AlertCircle, Clock, RotateCcw, CalendarDays,
  ChevronDown, ChevronUp, Pencil, History, Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { StudentShell } from "@/components/nivasi/student-shell";
import { useStudentAuth } from "@/lib/studentAuth";
import { useMesses, useMessRecordsForStudent, useMessRequestsForStudent } from "@/lib/hooks";
import {
  getOrCreateMessRecord,
  updateMessRecordField,
  createDoNotWantRecord,
  createMessRequest,
  updateMessRequest,
  deleteMessRequest,
  todayISTDateString,
  currentISTTime,
} from "@/lib/db";
import type { MessRecord, MessRequest, TiffinStudentStatus, ReturnStatus, Admission } from "@/lib/types";

export const Route = createFileRoute("/student/mess")({
  head: () => ({ meta: [{ title: "My Mess — NivasiSpace" }] }),
  component: StudentMessPage,
});

// ── helpers ───────────────────────────────────────────────────────────────────

type MealWindow = "before" | "during" | "after";

function getLunchWindow(h: number, m: number): MealWindow {
  const mins = h * 60 + m;
  if (mins < 13 * 60) return "before";
  if (mins < 14 * 60) return "during";
  return "after";
}

function getDinnerWindow(h: number, m: number): MealWindow {
  const mins = h * 60 + m;
  if (mins < 20 * 60) return "before";
  if (mins < 21 * 60) return "during";
  return "after";
}

function formatISTDate(dateStr: string): string {
  try {
    const parts = dateStr.split("-").map(Number);
    const y = parts[0] ?? new Date().getFullYear();
    const mo = parts[1] ?? 1;
    const d = parts[2] ?? 1;
    return new Date(y, mo - 1, d).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch {
    return dateStr;
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

const REQUEST_LABELS: Record<string, string> = {
  less_quantity: "Less Quantity",
  more_quantity: "More Quantity",
  other: "Other",
};

// ── Status pill ───────────────────────────────────────────────────────────────

function TiffinStatusBadge({ status }: { status: TiffinStudentStatus }) {
  const map: Record<TiffinStudentStatus, { cls: string; label: string }> = {
    pending:      { cls: "bg-warning/15 text-warning-foreground border-warning/30", label: "Pending" },
    received:     { cls: "bg-success/15 text-success border-success/30", label: "Received" },
    do_not_want:  { cls: "bg-muted text-muted-foreground border-border", label: "Do Not Want" },
    other:        { cls: "bg-primary/10 text-primary border-primary/20", label: "Other" },
  };
  const { cls, label } = map[status] ?? map.pending;
  return <Badge variant="outline" className={`text-[11px] ${cls}`}>{label}</Badge>;
}

function ReturnStatusBadge({ status }: { status: ReturnStatus | undefined }) {
  if (!status || status === "pending") {
    return <Badge variant="outline" className="text-[11px] bg-warning/15 text-warning-foreground border-warning/30">Return Pending</Badge>;
  }
  if (status === "returned") {
    return <Badge variant="outline" className="text-[11px] bg-success/15 text-success border-success/30">Returned ✓</Badge>;
  }
  return <Badge variant="outline" className="text-[11px] bg-muted text-muted-foreground border-border">Not Required</Badge>;
}

// ── Do Not Want dialog ────────────────────────────────────────────────────────

interface DoNotWantDialogProps {
  open: boolean;
  onClose: () => void;
  admission: Admission;
  messId: string;
  messName: string;
  initialMeal?: "lunch" | "dinner" | "both";
}

function DoNotWantDialog({ open, onClose, admission, messId, messName, initialMeal }: DoNotWantDialogProps) {
  const today = todayISTDateString();
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [lunchChecked, setLunchChecked] = useState(initialMeal === "lunch" || initialMeal === "both");
  const [dinnerChecked, setDinnerChecked] = useState(initialMeal === "dinner" || initialMeal === "both");
  const [saving, setSaving] = useState(false);
  const qc = useQueryClient();

  useEffect(() => {
    if (open) {
      setFromDate(today);
      setToDate(today);
      setLunchChecked(initialMeal === "lunch" || initialMeal === "both");
      setDinnerChecked(initialMeal === "dinner" || initialMeal === "both");
    }
  }, [open, today, initialMeal]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const meals: ("lunch" | "dinner")[] = [];
    if (lunchChecked) meals.push("lunch");
    if (dinnerChecked) meals.push("dinner");
    if (meals.length === 0) { toast.error("Select at least one meal."); return; }
    if (toDate < fromDate) { toast.error("End date cannot be before start date."); return; }
    if (fromDate < today) { toast.error("Cannot select past dates."); return; }
    setSaving(true);
    try {
      await createDoNotWantRecord({
        studentId: admission.id,
        studentName: admission.fullName,
        studentEmail: admission.email ?? "",
        admissionId: admission.admissionId,
        messId,
        messName,
        fromDate,
        toDate,
        meals,
      });
      // Apply do_not_want to each date in range that equals today
      // (only today's record exists; future records are created on-demand)
      const d = new Date(fromDate + "T00:00:00");
      const end = new Date(toDate + "T00:00:00");
      while (d <= end) {
        const dateStr = d.toLocaleDateString("en-CA");
        const patch: Partial<Omit<import("@/lib/types").MessRecord, "id" | "createdAt" | "updatedAt">> = {};
        if (lunchChecked) { patch["lunchStatus"] = "do_not_want"; patch["lunchReturnStatus"] = "not_required"; }
        if (dinnerChecked) { patch["dinnerStatus"] = "do_not_want"; patch["dinnerReturnStatus"] = "not_required"; }
        if (Object.keys(patch).length > 0) {
          await updateMessRecordField(admission.id, dateStr, patch);
        }
        d.setDate(d.getDate() + 1);
      }
      toast.success("Do Not Want saved.");
      await qc.invalidateQueries({ queryKey: ["messRecord", admission.id] });
      await qc.invalidateQueries({ queryKey: ["messRecords", "student", admission.id] });
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Do Not Want Tiffin</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="dnw-from">From Date</Label>
              <input
                id="dnw-from"
                type="date"
                min={today}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="dnw-to">To Date</Label>
              <input
                id="dnw-to"
                type="date"
                min={fromDate}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Meal</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox checked={lunchChecked} onCheckedChange={(v) => setLunchChecked(!!v)} />
                Lunch
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox checked={dinnerChecked} onCheckedChange={(v) => setDinnerChecked(!!v)} />
                Dinner
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>Cancel</Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
              Confirm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Other reason dialog ───────────────────────────────────────────────────────

interface OtherReasonDialogProps {
  open: boolean;
  onClose: () => void;
  meal: "lunch" | "dinner";
  admission: Admission;
  messId: string;
  messName: string;
  date: string;
  existingReason: string | undefined;
}

function OtherReasonDialog({ open, onClose, meal, admission, messId, messName, date, existingReason }: OtherReasonDialogProps) {
  const [reason, setReason] = useState(existingReason ?? "");
  const [saving, setSaving] = useState(false);
  const qc = useQueryClient();

  useEffect(() => {
    if (open) setReason(existingReason ?? "");
  }, [open, existingReason]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason.trim()) { toast.error("Please enter a reason."); return; }
    setSaving(true);
    try {
      const patch = meal === "lunch"
        ? { lunchStatus: "other" as const, lunchOtherReason: reason.trim(), lunchReturnStatus: "not_required" as const }
        : { dinnerStatus: "other" as const, dinnerOtherReason: reason.trim(), dinnerReturnStatus: "not_required" as const };
      // Ensure record exists first
      await getOrCreateMessRecord({
        studentId: admission.id,
        studentName: admission.fullName,
        studentEmail: admission.email ?? "",
        admissionId: admission.admissionId,
        messId,
        messName,
        date,
        lunchStatus: "pending",
        dinnerStatus: "pending",
        lunchReturnStatus: "pending",
        dinnerReturnStatus: "pending",
      });
      await updateMessRecordField(admission.id, date, patch);
      toast.success("Reason saved.");
      await qc.invalidateQueries({ queryKey: ["messRecord", admission.id, date] });
      await qc.invalidateQueries({ queryKey: ["messRecords", "student", admission.id] });
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Other Reason — {meal === "lunch" ? "Lunch" : "Dinner"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="other-reason">Description *</Label>
            <Textarea
              id="other-reason"
              placeholder="e.g. I am outside today and will collect food later."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>Cancel</Button>
            <Button type="submit" disabled={saving || !reason.trim()}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Mess Request dialog ───────────────────────────────────────────────────────

interface MessRequestDialogProps {
  open: boolean;
  onClose: () => void;
  admission: Admission;
  messId: string;
  messName: string;
  existing: MessRequest | undefined;
}

function MessRequestDialog({ open, onClose, admission, messId, messName, existing }: MessRequestDialogProps) {
  const [reqType, setReqType] = useState<"less_quantity" | "more_quantity" | "other">(existing?.requestType ?? "less_quantity");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [saving, setSaving] = useState(false);
  const qc = useQueryClient();

  useEffect(() => {
    if (open) {
      setReqType(existing?.requestType ?? "less_quantity");
      setDescription(existing?.description ?? "");
    }
  }, [open, existing]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (reqType === "other" && !description.trim()) {
      toast.error("Description is required for Other request type.");
      return;
    }
    setSaving(true);
    try {
      if (existing) {
        await updateMessRequest(existing.id, { requestType: reqType, description: description.trim() });
        toast.success("Request updated.");
      } else {
        await createMessRequest({
          studentId: admission.id,
          studentName: admission.fullName,
          studentEmail: admission.email ?? "",
          admissionId: admission.admissionId,
          messId,
          messName,
          requestType: reqType,
          description: description.trim(),
          status: "active",
        });
        toast.success("Request submitted.");
      }
      await qc.invalidateQueries({ queryKey: ["messRequests", "student", admission.id] });
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save request.");
    } finally {
      setSaving(false);
    }
  }

  const types = [
    { value: "less_quantity", label: "Less Quantity" },
    { value: "more_quantity", label: "More Quantity" },
    { value: "other", label: "Other" },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{existing ? "Edit Mess Request" : "Special Mess Request"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>What do you require?</Label>
            <div className="flex flex-wrap gap-2">
              {types.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setReqType(t.value)}
                  className={`rounded-xl border px-3 py-1.5 text-sm font-medium transition-colors ${
                    reqType === t.value
                      ? "gradient-brand text-primary-foreground border-transparent shadow-soft"
                      : "border-border bg-muted/30 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="req-desc">
              Description {reqType === "other" ? "*" : "(optional)"}
            </Label>
            <Textarea
              id="req-desc"
              placeholder={
                reqType === "less_quantity" ? "e.g. Please provide a smaller portion."
                : reqType === "more_quantity" ? "e.g. Please provide slightly more food."
                : "e.g. Please provide less spicy food."
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>Cancel</Button>
            <Button type="submit" disabled={saving || (reqType === "other" && !description.trim())}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
              {existing ? "Save Changes" : "Submit Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Meal card ─────────────────────────────────────────────────────────────────

interface MealCardProps {
  meal: "lunch" | "dinner";
  window: MealWindow;
  status: TiffinStudentStatus;
  returnStatus: ReturnStatus | undefined;
  returnedTo: string | undefined;
  returnedAt: Date | null | undefined;
  receivedAt: Date | null | undefined;
  otherReason: string | undefined;
  onReceived: () => void;
  onDoNotWant: () => void;
  onOther: () => void;
  onMarkReturned: () => void;
  saving: boolean;
}

function MealCard({
  meal, window: win, status, returnStatus, returnedTo, returnedAt, receivedAt,
  otherReason, onReceived, onDoNotWant, onOther, onMarkReturned, saving,
}: MealCardProps) {
  const isLunch = meal === "lunch";
  const timeLabel = isLunch ? "1:00 PM – 2:00 PM" : "8:00 PM – 9:00 PM";
  const returnTo = isLunch ? "Security Cabin" : "Tiffin Collector";
  const mealLabel = isLunch ? "🍱 LUNCH" : "🍽 DINNER";

  const canAct = win === "during";
  const isClosed = win === "after";
  const showReturnBlock = status === "received";
  const returnDone = returnStatus === "returned";
  const returnNotRequired = returnStatus === "not_required";

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display font-bold text-base">{mealLabel}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <Clock className="size-3" /> {timeLabel}
          </p>
        </div>
        <TiffinStatusBadge status={status} />
      </div>

      {/* Closed label */}
      {isClosed && status === "pending" && (
        <p className="rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground text-center">
          This meal window is now closed for today.
        </p>
      )}

      {/* Action buttons — only during window */}
      {canAct && status === "pending" && (
        <div className="grid grid-cols-3 gap-2">
          <Button size="sm" variant="outline" onClick={onReceived} disabled={saving}
            className="border-success/40 text-success hover:bg-success/10 text-xs">
            {saving ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCircle2 className="size-3.5 mr-1" />}
            Received
          </Button>
          <Button size="sm" variant="outline" onClick={onDoNotWant} disabled={saving}
            className="text-xs">
            <XCircle className="size-3.5 mr-1" />
            Don't Want
          </Button>
          <Button size="sm" variant="outline" onClick={onOther} disabled={saving}
            className="text-xs">
            <AlertCircle className="size-3.5 mr-1" />
            Other
          </Button>
        </div>
      )}

      {/* Before window — show buttons disabled to indicate they'll activate later */}
      {win === "before" && status === "pending" && (
        <p className="rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground text-center">
          Buttons will activate during the meal window.
        </p>
      )}

      {/* Do not want */}
      {status === "do_not_want" && (
        <p className="rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          You have marked this meal as Do Not Want. No return required.
        </p>
      )}

      {/* Other */}
      {status === "other" && otherReason && (
        <div className="rounded-lg bg-primary/5 border border-primary/20 px-3 py-2 text-xs space-y-0.5">
          <p className="font-medium text-primary">Other reason provided:</p>
          <p className="text-foreground">{otherReason}</p>
        </div>
      )}

      {/* Received timestamp */}
      {status === "received" && receivedAt && (
        <p className="text-xs text-muted-foreground">
          Received at {formatISTTimestamp(receivedAt)}
        </p>
      )}

      {/* Return block */}
      {showReturnBlock && (
        <div className="border-t border-border pt-3 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium">Return To: <span className="text-foreground">{returnTo}</span></p>
              <ReturnStatusBadge status={returnStatus} />
            </div>
            {!returnDone && !returnNotRequired && (
              <Button
                size="sm"
                variant="outline"
                onClick={onMarkReturned}
                disabled={saving}
                className="shrink-0 border-success/40 text-success hover:bg-success/10 text-xs"
              >
                {saving ? <Loader2 className="size-3.5 animate-spin" /> : <RotateCcw className="size-3.5 mr-1" />}
                Mark Returned
              </Button>
            )}
          </div>
          {returnDone && returnedAt && (
            <p className="text-xs text-muted-foreground">
              Returned to {returnedTo} at {formatISTTimestamp(returnedAt)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

function StudentMessPage() {
  const { session, admission: myAdmission, loading } = useStudentAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: messes = [] } = useMesses();

  const messId: string = myAdmission?.messId || "";
  const mess = messes.find((m) => m.id === messId);
  const resolvedMessName =
    mess?.serialNumber != null ? `Mess #${mess.serialNumber}` : mess?.messName || myAdmission?.messName || "Assigned Mess";

  const hasMessInPackage =
    myAdmission?.packageServices?.some((s) => s.toLowerCase().includes("mess")) || !!messId;

  const today = todayISTDateString();
  const { h, m } = currentISTTime();
  const lunchWin = getLunchWindow(h, m);
  const dinnerWin = getDinnerWindow(h, m);

  // Tiffin record for today
  const [record, setRecord] = useState<MessRecord | null>(null);
  const [recordLoading, setRecordLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);

  // Live clock — re-evaluate windows every minute
  const [, forceRender] = useState(0);
  useEffect(() => {
    const t = setInterval(() => forceRender((n) => n + 1), 60_000);
    return () => clearInterval(t);
  }, []);

  // History
  const { data: history = [], isLoading: histLoading } = useMessRecordsForStudent(myAdmission?.id ?? null);
  const { data: requests = [] } = useMessRequestsForStudent(myAdmission?.id ?? null);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [requestsOpen, setRequestsOpen] = useState(false);
  const [deletingRequestId, setDeletingRequestId] = useState<string | null>(null);

  // Dialogs
  const [dnwOpen, setDnwOpen] = useState<{ meal: "lunch" | "dinner" | "both" } | null>(null);
  const [otherOpen, setOtherOpen] = useState<{ meal: "lunch" | "dinner" } | null>(null);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<MessRequest | null>(null);

  // Auth guard
  useEffect(() => {
    if (!loading && !session) navigate({ to: "/student/login", replace: true });
  }, [loading, session, navigate]);

  // Load today's record
  const loadRecord = useCallback(async () => {
    if (!myAdmission || !messId) return;
    setRecordLoading(true);
    try {
      const r = await getOrCreateMessRecord({
        studentId: myAdmission.id,
        studentName: myAdmission.fullName,
        studentEmail: myAdmission.email ?? "",
        admissionId: myAdmission.admissionId,
        messId,
        messName: resolvedMessName,
        date: today,
        lunchStatus: "pending",
        dinnerStatus: "pending",
        lunchReturnStatus: "pending",
        dinnerReturnStatus: "pending",
      });
      setRecord(r);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to load today's tiffin.");
    } finally {
      setRecordLoading(false);
    }
  }, [myAdmission, messId, resolvedMessName, today]);

  useEffect(() => { loadRecord(); }, [loadRecord]);

  // ── Action handlers ──────────────────────────────────────────────────────

  async function handleReceived(meal: "lunch" | "dinner") {
    if (!myAdmission || !messId || !record) return;
    const win = meal === "lunch" ? lunchWin : dinnerWin;
    if (win !== "during") { toast.error("This meal window is not active right now."); return; }
    const currentStatus = meal === "lunch" ? record.lunchStatus : record.dinnerStatus;
    if (currentStatus === "received") { toast.info("Already marked as received."); return; }
    setSaving(`${meal}-received`);
    try {
      const patch = meal === "lunch"
        ? { lunchStatus: "received" as const, lunchReceivedAt: new Date(), lunchReturnStatus: "pending" as const }
        : { dinnerStatus: "received" as const, dinnerReceivedAt: new Date(), dinnerReturnStatus: "pending" as const };
      await updateMessRecordField(myAdmission.id, today, patch);
      setRecord((r) => r ? { ...r, ...patch } : r);
      toast.success(`${meal === "lunch" ? "Lunch" : "Dinner"} marked as received.`);
      await qc.invalidateQueries({ queryKey: ["messRecords", "student", myAdmission.id] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(null);
    }
  }

  async function handleMarkReturned(meal: "lunch" | "dinner") {
    if (!myAdmission || !record) return;
    const currentStatus = meal === "lunch" ? record.lunchStatus : record.dinnerStatus;
    if (currentStatus !== "received") {
      toast.error("You can only return a tiffin that was first marked as Received.");
      return;
    }
    const returnTo = meal === "lunch" ? "Security Cabin" : "Tiffin Collector";
    const currentReturn = meal === "lunch" ? record.lunchReturnStatus : record.dinnerReturnStatus;
    if (currentReturn === "returned") { toast.info("Already marked as returned."); return; }
    setSaving(`${meal}-return`);
    try {
      const patch = meal === "lunch"
        ? { lunchReturnStatus: "returned" as const, lunchReturnedTo: returnTo, lunchReturnedAt: new Date() }
        : { dinnerReturnStatus: "returned" as const, dinnerReturnedTo: returnTo, dinnerReturnedAt: new Date() };
      await updateMessRecordField(myAdmission.id, today, patch);
      setRecord((r) => r ? { ...r, ...patch } : r);
      toast.success(`Tiffin returned to ${returnTo}.`);
      await qc.invalidateQueries({ queryKey: ["messRecords", "student", myAdmission.id] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(null);
    }
  }

  async function handleDeleteRequest(id: string) {
    setDeletingRequestId(id);
    try {
      await deleteMessRequest(id);
      await qc.invalidateQueries({ queryKey: ["messRequests", "student", myAdmission?.id] });
      toast.success("Request deleted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete request.");
    } finally {
      setDeletingRequestId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const activeRequest = requests.find((r) => r.status === "active");
  const pastRequests = requests.filter((r) => r.status !== "active" || r.id !== activeRequest?.id);
  const dateLabel = new Date().toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "long", day: "numeric", month: "long",
  });

  return (
    <StudentShell
      title="My Mess"
      subtitle="Daily tiffin tracking, meal preferences, and special diet requests"
      backTo="/student/dashboard"
    >
      <div className="space-y-6">
        {/* No admission */}
        {!myAdmission && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            <UtensilsCrossed className="mx-auto mb-3 size-10 text-muted-foreground/40" />
            <p className="font-semibold">No admission found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Contact your administrator.
            </p>
          </div>
        )}

        {/* No mess assigned */}
        {myAdmission && !messId && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center space-y-2">
            <UtensilsCrossed className="mx-auto mb-2 size-10 text-muted-foreground/40" />
            <p className="font-semibold text-base">
              {hasMessInPackage ? "Mess Included in Package" : "Mess Not Assigned"}
            </p>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              {hasMessInPackage
                ? "Your admission package includes mess services. Your hostel manager or administrator will assign your mess shortly."
                : "Please contact administration."}
            </p>
          </div>
        )}

        {myAdmission && messId && (
          <>
            {/* Top KPI stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Assigned Mess</p>
                <p className="text-base font-bold truncate mt-1">{resolvedMessName}</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="inline-block size-1.5 rounded-full bg-success" />
                  <span className="text-[11px] text-success capitalize">{myAdmission.tiffinStatus || "Active"}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Today's Date</p>
                <p className="text-base font-bold truncate mt-1">{dateLabel}</p>
                <p className="text-[11px] font-mono text-muted-foreground mt-1.5">{today}</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Lunch Status</p>
                <div className="mt-2">
                  <TiffinStatusBadge status={record?.lunchStatus ?? "pending"} />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1.5">
                  1:00 PM – 2:00 PM
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Dinner Status</p>
                <div className="mt-2">
                  <TiffinStatusBadge status={record?.dinnerStatus ?? "pending"} />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1.5">
                  8:00 PM – 9:00 PM
                </p>
              </div>
            </div>

            {/* Main responsive layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (8 cols on lg) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Today's Tiffin Meals */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UtensilsCrossed className="size-4 text-primary" />
                      <h2 className="font-display font-bold text-base">Today's Meals Tracker</h2>
                    </div>
                    <span className="text-xs text-muted-foreground">{dateLabel}</span>
                  </div>

                  {recordLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Skeleton className="h-44 rounded-2xl" />
                      <Skeleton className="h-44 rounded-2xl" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <MealCard
                        meal="lunch"
                        window={lunchWin}
                        status={record?.lunchStatus ?? "pending"}
                        returnStatus={record?.lunchReturnStatus}
                        returnedTo={record?.lunchReturnedTo}
                        returnedAt={record?.lunchReturnedAt}
                        receivedAt={record?.lunchReceivedAt}
                        otherReason={record?.lunchOtherReason}
                        onReceived={() => handleReceived("lunch")}
                        onDoNotWant={() => setDnwOpen({ meal: "lunch" })}
                        onOther={() => setOtherOpen({ meal: "lunch" })}
                        onMarkReturned={() => handleMarkReturned("lunch")}
                        saving={saving === "lunch-received" || saving === "lunch-return"}
                      />
                      <MealCard
                        meal="dinner"
                        window={dinnerWin}
                        status={record?.dinnerStatus ?? "pending"}
                        returnStatus={record?.dinnerReturnStatus}
                        returnedTo={record?.dinnerReturnedTo}
                        returnedAt={record?.dinnerReturnedAt}
                        receivedAt={record?.dinnerReceivedAt}
                        otherReason={record?.dinnerOtherReason}
                        onReceived={() => handleReceived("dinner")}
                        onDoNotWant={() => setDnwOpen({ meal: "dinner" })}
                        onOther={() => setOtherOpen({ meal: "dinner" })}
                        onMarkReturned={() => handleMarkReturned("dinner")}
                        saving={saving === "dinner-received" || saving === "dinner-return"}
                      />
                    </div>
                  )}
                </div>

                {/* Special Mess Request */}
                <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-bold text-base">Special Meal Preference / Diet Request</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Customize portion sizes or dietary preferences</p>
                    </div>
                    {activeRequest && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 gap-1 text-xs"
                        onClick={() => { setEditingRequest(activeRequest); setRequestDialogOpen(true); }}
                      >
                        <Pencil className="size-3.5" /> Edit
                      </Button>
                    )}
                  </div>

                  {activeRequest ? (
                    <div className="rounded-xl bg-muted/40 p-3.5 space-y-1.5 border border-border/60">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-semibold">
                          {REQUEST_LABELS[activeRequest.requestType]}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] bg-success/10 text-success border-success/30">Active Preference</Badge>
                      </div>
                      {activeRequest.description && (
                        <p className="text-sm text-foreground">"{activeRequest.description}"</p>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-border/80 p-4 text-center">
                      <p className="text-xs text-muted-foreground">No custom diet or quantity request active.</p>
                    </div>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full h-10 text-xs font-semibold"
                    onClick={() => { setEditingRequest(null); setRequestDialogOpen(true); }}
                  >
                    {activeRequest ? "Change Request" : "Submit Special Meal Request"}
                  </Button>

                  {/* Request History */}
                  {requests.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-border">
                      <button
                        className="flex w-full items-center justify-between text-xs font-semibold text-muted-foreground hover:text-foreground py-1 transition-colors"
                        onClick={() => setRequestsOpen((v) => !v)}
                      >
                        <span className="flex items-center gap-1.5">
                          <History className="size-3.5 text-primary" />
                          Previous Requests ({requests.length})
                        </span>
                        {requestsOpen ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                      </button>
                      {requestsOpen && (
                        <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
                          {requests.map((req) => (
                            <div key={req.id} className="px-3.5 py-2.5 space-y-1 hover:bg-muted/15 transition-colors">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="text-xs text-muted-foreground font-mono">
                                    {req.createdAt ? formatISTTimestamp(req.createdAt) : "—"}
                                  </p>
                                  <Badge variant="outline" className="text-[10px]">
                                    {REQUEST_LABELS[req.requestType]}
                                  </Badge>
                                </div>
                                <button
                                  onClick={() => handleDeleteRequest(req.id)}
                                  disabled={deletingRequestId === req.id}
                                  className="shrink-0 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40"
                                  aria-label="Delete request"
                                >
                                  {deletingRequestId === req.id
                                    ? <Loader2 className="size-3.5 animate-spin" />
                                    : <Trash2 className="size-3.5" />}
                                </button>
                              </div>
                              {req.description && <p className="text-xs text-foreground italic">"{req.description}"</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column (4 cols on lg) */}
              <div className="lg:col-span-4 space-y-6">
                {/* Assigned Mess Details Card */}
                <div className="rounded-2xl border border-border bg-card p-5 shadow-soft space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mess Provider</p>
                    <Badge
                      variant="outline"
                      className={`text-[11px] capitalize ${
                        myAdmission.tiffinStatus === "active"
                          ? "border-success/30 bg-success/10 text-success"
                          : myAdmission.tiffinStatus === "paused"
                          ? "border-warning/30 bg-warning/10 text-warning-foreground"
                          : "border-destructive/20 bg-destructive/10 text-destructive"
                      }`}
                    >
                      {myAdmission.tiffinStatus || "active"}
                    </Badge>
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-bold">
                      {resolvedMessName}
                    </h2>
                    {mess?.messDescription && (
                      <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                        {mess.messDescription}
                      </p>
                    )}
                  </div>

                  {/* Meal Timings */}
                  <div className="rounded-xl bg-muted/30 p-3 space-y-2 border border-border/60">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Service Windows</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">🍱 Lunch</span>
                      <span className="text-muted-foreground font-mono">1:00 PM – 2:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">🍽 Dinner</span>
                      <span className="text-muted-foreground font-mono">8:00 PM – 9:00 PM</span>
                    </div>
                  </div>

                  {/* Leave / Do Not Want shortcut */}
                  <Button
                    variant="outline"
                    className="w-full text-xs font-semibold h-10 border-primary/30 text-primary hover:bg-primary/5"
                    onClick={() => setDnwOpen({ meal: "both" })}
                  >
                    <CalendarDays className="size-3.5 mr-1.5" />
                    Schedule Leave / Do Not Want
                  </Button>
                </div>

                {/* Tiffin History */}
                <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
                  <button
                    className="flex w-full items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors"
                    onClick={() => setHistoryOpen((v) => !v)}
                  >
                    <div className="flex items-center gap-2">
                      <CalendarDays className="size-4 text-primary" />
                      <span className="text-sm font-bold">Past Tiffin History</span>
                    </div>
                    {historyOpen ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
                  </button>
                  {historyOpen && (
                    <div className="border-t border-border divide-y divide-border max-h-80 overflow-y-auto">
                      {histLoading && <div className="px-5 py-4"><Skeleton className="h-16 rounded-xl" /></div>}
                      {!histLoading && history.length === 0 && (
                        <p className="px-5 py-4 text-xs text-muted-foreground text-center">No past meal logs yet.</p>
                      )}
                      {!histLoading && history.map((rec) => (
                        <div key={rec.id} className="px-5 py-3 space-y-2 hover:bg-muted/15 transition-colors">
                          <p className="text-xs font-semibold text-foreground">
                            {formatISTDate(rec.date)}
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {(["lunch", "dinner"] as const).map((m) => {
                              const st = m === "lunch" ? rec.lunchStatus : rec.dinnerStatus;
                              const ret = m === "lunch" ? rec.lunchReturnStatus : rec.dinnerReturnStatus;
                              return (
                                <div key={m} className="rounded-lg bg-muted/40 px-2.5 py-1.5 space-y-1">
                                  <p className="text-[10px] font-medium capitalize text-muted-foreground">{m}</p>
                                  <TiffinStatusBadge status={st} />
                                  {(st === "received") && <ReturnStatusBadge status={ret} />}
                                  {st === "other" && (
                                    <p className="text-[10px] text-muted-foreground truncate">
                                      {m === "lunch" ? rec.lunchOtherReason : rec.dinnerOtherReason}
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Dialogs */}
      {dnwOpen && myAdmission && (
        <DoNotWantDialog
          open
          onClose={() => setDnwOpen(null)}
          admission={myAdmission}
          messId={messId}
          messName={mess?.messName ?? ""}
          initialMeal={dnwOpen.meal}
        />
      )}
      {otherOpen && myAdmission && record && (
        <OtherReasonDialog
          open
          onClose={async () => {
            setOtherOpen(null);
            await loadRecord();
          }}
          meal={otherOpen.meal}
          admission={myAdmission}
          messId={messId}
          messName={mess?.messName ?? ""}
          date={today}
          existingReason={otherOpen.meal === "lunch" ? record.lunchOtherReason : record.dinnerOtherReason}
        />
      )}
      {requestDialogOpen && myAdmission && (
        <MessRequestDialog
          open
          onClose={() => { setRequestDialogOpen(false); setEditingRequest(null); }}
          admission={myAdmission}
          messId={messId}
          messName={mess?.messName ?? ""}
          existing={editingRequest ?? undefined}
        />
      )}
    </StudentShell>
  );
}
