import { useState, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft, Phone, MapPin, Search, UtensilsCrossed,
  CheckCircle2, Clock, XCircle, SkipForward, Pencil,
  RotateCcw, AlertCircle, MessageSquare, ChevronDown, ChevronUp,
  Loader2, FileText,
} from "lucide-react";
import { toast } from "sonner";

import { AdminShell } from "@/components/nivasi/admin-shell";
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
} from "@/lib/hooks";
import { upsertDelivery, todayDateString, todayISTDateString, updateMess } from "@/lib/db";
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

  const mess = messes.find((m) => m.id === messId);
  const students = useMemo(
    () => admissions.filter((a) => (a as any).messId === messId),
    [admissions, messId],
  );

  const [search, setSearch] = useState("");
  const [tiffinFilter, setTiffinFilter] = useState("all");
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);
  const [descDialogOpen, setDescDialogOpen] = useState(false);

  const filtered = students.filter((s) => {
    const matchSearch = !search ||
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.phoneNumber.includes(search) ||
      (s.propertyName ?? "").toLowerCase().includes(search.toLowerCase());
    const matchTiffin = tiffinFilter === "all" || (s as any).tiffinStatus === tiffinFilter;
    return matchSearch && matchTiffin;
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
      subtitle={mess ? `Owner: ${mess.ownerName || "—"}  ·  ${students.length} students` : ""}
      action={
        <Button asChild variant="outline" size="sm">
          <Link to="/admin/mess">
            <ArrowLeft className="mr-1.5 size-4" /> Back to Messes
          </Link>
        </Button>
      }
    >
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
        <Select value={tiffinFilter} onValueChange={setTiffinFilter}>
          <SelectTrigger className="w-40">
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

            return (
              <div key={student.id} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  {/* Student info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{student.fullName}</h3>
                      <Badge
                        variant="outline"
                        className={`text-[11px] capitalize ${tiffin === "active" ? "border-success/30 bg-success/10 text-success" : tiffin === "paused" ? "border-warning/30 bg-warning/10 text-warning-foreground" : "border-destructive/20 bg-destructive/10 text-destructive"}`}
                      >
                        Tiffin: {tiffin}
                      </Badge>
                    </div>
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
    </AdminShell>
  );
}
