import { useState, useMemo, useEffect, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft, Phone, MapPin, Search, WashingMachine,
  CheckCircle2, Clock, XCircle, SkipForward, Calendar,
  Scale, StickyNote, Check, ChevronLeft, ChevronRight,
  UserCheck, Loader2, Download, FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";

import { AdminShell } from "@/components/nivasi/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StudentLaundryDialog } from "@/components/nivasi/student-laundry-dialog";
import {
  useLaundries, useAdmissions, useLaundryPickupsForDate,
  useLaundryPickupSummary, useRooms, useProperties,
  useLaundryPickupsForDateRange,
} from "@/lib/hooks";
import { upsertLaundryPickup, todayDateString, getWeekId, getWeekBounds } from "@/lib/db";
import { buildExportRows, exportLaundryBillingExcel } from "@/lib/laundry-export";
import type { Admission, LaundryPickupStatus } from "@/lib/types";

export const Route = createFileRoute("/admin/laundry/$laundryId")({
  head: () => ({ meta: [{ title: "Laundry Students — NivasiSpace Admin" }] }),
  component: LaundryStudentsPage,
});

// ── helpers ───────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<LaundryPickupStatus, string> = {
  pending: "Pending",
  picked_up: "Picked Up",
  not_available: "Not Available",
  skipped: "Skipped",
};

const STATUS_COLORS: Record<LaundryPickupStatus, string> = {
  pending: "bg-warning/15 text-warning-foreground border-warning/30",
  picked_up: "bg-success/15 text-success border-success/30",
  not_available: "bg-muted text-muted-foreground border-border",
  skipped: "bg-destructive/10 text-destructive border-destructive/20",
};

function getMapUrl(
  admission: Admission,
  rooms: { title: string; mapLink?: string; address?: string; location?: string }[],
  properties: { propertyId: string; propertyName: string; address?: string }[],
): string | null {
  const a = admission as any;
  if (a.propertyId) {
    const room = rooms.find((r) => (r as any).id === a.propertyId);
    if (room?.mapLink) return room.mapLink;
    if (room?.address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.address)}`;
    if (room?.location) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.location)}`;
  }
  if (admission.propertyName) {
    const room = rooms.find((r) => r.title?.toLowerCase() === admission.propertyName!.toLowerCase());
    if (room?.mapLink) return room.mapLink;
    if (room?.address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.address)}`;
    if (room?.location) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.location)}`;
  }
  if (a.propertyId) {
    const prop = properties.find((p) => p.propertyId === a.propertyId);
    if (prop?.address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(prop.address)}`;
  }
  if (admission.propertyName) {
    const prop = properties.find((p) => p.propertyName?.toLowerCase() === admission.propertyName!.toLowerCase());
    if (prop?.address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(prop.address)}`;
  }
  if (admission.propertyName) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(admission.propertyName)}`;
  return null;
}

// ── page ──────────────────────────────────────────────────────────────────────

// ── Export week helpers ────────────────────────────────────────────────────────

function formatWeekRange(start: string, end: string): string {
  try {
    const fmt = (d: string) => {
      const [y, m, day] = d.split("-").map(Number);
      return new Date(y!, (m ?? 1) - 1, day).toLocaleDateString("en-IN", {
        day: "numeric", month: "short",
      });
    };
    const endDate = new Date(end + "T00:00:00");
    const year = endDate.getFullYear();
    return `${fmt(start)} – ${fmt(end)} ${year}`;
  } catch {
    return `${start} – ${end}`;
  }
}

// ── page ──────────────────────────────────────────────────────────────────────

function LaundryStudentsPage() {
  const { laundryId } = Route.useParams();
  const qc = useQueryClient();
  const today = todayDateString();

  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);
  const [dialogStudent, setDialogStudent] = useState<Admission | null>(null);

  // Notes and weight maps keyed by `${studentId}-${type}`
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});
  const [weightMap, setWeightMap] = useState<Record<string, string>>({});

  // ── Export state ──
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [exporting, setExporting] = useState(false);
  // Export week selection defaults to the current week based on selectedDate
  const currentWeekBounds = useMemo(() => getWeekBounds(selectedDate), [selectedDate]);
  const [exportStart, setExportStart] = useState<string>(currentWeekBounds.weekStart);
  const [exportEnd, setExportEnd] = useState<string>(currentWeekBounds.weekEnd);

  // Auto-sync export range when selected date changes (only if panel is closed)
  useEffect(() => {
    if (!showExportPanel) {
      setExportStart(currentWeekBounds.weekStart);
      setExportEnd(currentWeekBounds.weekEnd);
    }
  }, [currentWeekBounds, showExportPanel]);

  const { data: exportPickups = [], isFetching: exportFetching } = useLaundryPickupsForDateRange(
    showExportPanel ? laundryId : null,
    exportStart,
    exportEnd,
  );

  const { data: laundries = [], isLoading: laundryLoading } = useLaundries();
  const { data: admissions = [], isLoading: admLoading } = useAdmissions();
  const { data: pickups = [] } = useLaundryPickupsForDate(laundryId, selectedDate);
  const { data: summary } = useLaundryPickupSummary(laundryId, selectedDate);
  const { data: rooms = [] } = useRooms();
  const { data: properties = [] } = useProperties();

  const laundry = laundries.find((l) => l.id === laundryId);
  const students = useMemo(
    () => admissions.filter((a) => (a as any).laundryId === laundryId),
    [admissions, laundryId],
  );

  // Sync existing pickup notes and clothesWeight into state when pickups load
  useEffect(() => {
    if (pickups.length === 0) return;
    setNotesMap((prev) => {
      const next = { ...prev };
      for (const p of pickups) {
        const key = `${p.studentId}-${p.type}`;
        if (p.notes !== undefined) next[key] = p.notes;
      }
      return next;
    });
    setWeightMap((prev) => {
      const next = { ...prev };
      for (const p of pickups) {
        const key = `${p.studentId}-${p.type}`;
        if (p.clothesWeight !== undefined) next[key] = p.clothesWeight;
      }
      return next;
    });
  }, [pickups]);

  const filtered = students.filter((s) => {
    const matchSearch = !search ||
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.phoneNumber.includes(search) ||
      (s.propertyName ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || (s as any).laundryStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  function getPickup(studentId: string, type: "pickup" | "delivery") {
    return pickups.find((p) => p.studentId === studentId && p.type === type);
  }

  async function setPickupStatus(student: Admission, type: "pickup" | "delivery", status: LaundryPickupStatus) {
    const key = `${student.id}-${type}`;
    const pickupKey = `${student.id}-pickup`;
    // Delivery weight always mirrors pickup weight
    const clothesWeight = type === "delivery"
      ? (weightMap[pickupKey] ?? "")
      : (weightMap[key] ?? "");
    setUpdatingKey(key);
    try {
      await upsertLaundryPickup({
        studentId: student.id,
        admissionId: student.admissionId,
        laundryId,
        employeeId: "admin",
        date: selectedDate,
        type,
        status,
        clothesWeight,
        notes: notesMap[key] ?? "",
      });
      await qc.invalidateQueries({ queryKey: ["laundryPickups"] });
      await qc.invalidateQueries({ queryKey: ["laundryPickupSummary"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update pickup status.");
    } finally {
      setUpdatingKey(null);
    }
  }

  async function saveDetails(student: Admission, type: "pickup" | "delivery") {
    const key = `${student.id}-${type}`;
    const pickupKey = `${student.id}-pickup`;
    const existingPickup = pickups.find((p) => p.studentId === student.id && p.type === type);
    const status = existingPickup?.status ?? "pending";
    // Delivery weight always mirrors pickup weight
    const clothesWeight = type === "delivery"
      ? (weightMap[pickupKey] ?? "")
      : (weightMap[key] ?? "");
    setUpdatingKey(key + "-details");
    try {
      await upsertLaundryPickup({
        studentId: student.id,
        admissionId: student.admissionId,
        laundryId,
        employeeId: "admin",
        date: selectedDate,
        type,
        status,
        clothesWeight,
        notes: notesMap[key] ?? "",
      });
      await qc.invalidateQueries({ queryKey: ["laundryPickups"] });
      await qc.invalidateQueries({ queryKey: ["laundryPickupSummary"] });
      toast.success(`${type === "pickup" ? "Pickup" : "Delivery"} details saved for ${student.fullName}.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save details.");
    } finally {
      setUpdatingKey(null);
    }
  }

  function shiftDate(days: number) {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().slice(0, 10));
  }

  const isLoading = laundryLoading || admLoading;

  // ── Export handler ────────────────────────────────────────────────────────────
  const handleExport = useCallback(async () => {
    if (exporting) return;
    if (exportPickups.length === 0 && !exportFetching) {
      toast.warning("No laundry records found for the selected period.");
      return;
    }
    setExporting(true);
    try {
      const studentNameMap: Record<string, string> = {};
      for (const a of admissions) {
        studentNameMap[a.id] = a.fullName;
      }
      const weekId = getWeekId(exportStart);
      const weekNum = weekId.split("-W")[1] ?? "";
      const weekLabel = `Week ${weekNum}`;
      const weekDateRange = formatWeekRange(exportStart, exportEnd);
      const rows = buildExportRows(exportPickups, studentNameMap, weekLabel);

      if (rows.length === 0) {
        toast.warning("No records with weight data found for the selected period. Enter weights first.");
        return;
      }

      await exportLaundryBillingExcel({
        rows,
        weekLabel,
        weekDateRange,
        laundryName: laundry?.laundryName ?? "Laundry",
      });
      toast.success(`Exported ${rows.length} record(s) to Excel successfully!`);
    } catch (err) {
      console.error("[export] laundry billing", err);
      toast.error(err instanceof Error ? err.message : "Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  }, [exporting, exportPickups, exportFetching, admissions, exportStart, exportEnd, laundry?.laundryName]);

  return (
    <AdminShell
      title={laundry?.laundryName ?? "Laundry Students"}
      subtitle={laundry ? `Owner: ${laundry.ownerName || "—"}  ·  ${students.length} students` : ""}
      action={
        <div className="flex flex-wrap gap-2">
          <Button
            variant={showExportPanel ? "default" : "outline"}
            size="sm"
            onClick={() => setShowExportPanel((v) => !v)}
          >
            <FileSpreadsheet className="mr-1.5 size-4" />
            {showExportPanel ? "Hide Export" : "Export Billing"}
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/laundry/assign">
              <UserCheck className="mr-1.5 size-4" /> Assign Students
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/laundry"><ArrowLeft className="mr-1.5 size-4" /> Back to Laundry</Link>
          </Button>
        </div>
      }
    >
      {/* ── Export Billing Panel ── */}
      {showExportPanel && (
        <div className="mb-4 rounded-2xl border border-border bg-card p-4 shadow-soft space-y-4">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="size-5 text-primary" />
            <div>
              <h3 className="font-semibold text-sm">Export Weekly Laundry Billing</h3>
              <p className="text-xs text-muted-foreground">Generates a formatted Excel sheet matching the NIVASI SPACE billing template. Rate is fixed at ₹80/Kg.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Week Start Date</label>
              <input
                type="date"
                value={exportStart}
                onChange={(e) => {
                  setExportStart(e.target.value);
                  // Auto-set end to 6 days after start
                  if (e.target.value) {
                    const d = new Date(e.target.value);
                    d.setDate(d.getDate() + 6);
                    setExportEnd(d.toISOString().slice(0, 10));
                  }
                }}
                className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm cursor-pointer outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Week End Date</label>
              <input
                type="date"
                value={exportEnd}
                min={exportStart}
                onChange={(e) => setExportEnd(e.target.value)}
                className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm cursor-pointer outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          {/* Week shortcuts */}
          <div className="flex flex-wrap gap-1.5">
            {[-2, -1, 0].map((offset) => {
              const d = new Date(today);
              d.setDate(d.getDate() + offset * 7);
              const { weekStart, weekEnd } = getWeekBounds(d.toISOString().slice(0, 10));
              const wId = getWeekId(weekStart);
              const wNum = wId.split("-W")[1] ?? "";
              const label = offset === 0 ? "This week" : offset === -1 ? "Last week" : `2 weeks ago`;
              const isActive = exportStart === weekStart && exportEnd === weekEnd;
              return (
                <button
                  key={offset}
                  onClick={() => { setExportStart(weekStart); setExportEnd(weekEnd); }}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold border transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/40 text-muted-foreground border-border hover:bg-muted"
                  }`}
                >
                  {label} (W{wNum})
                </button>
              );
            })}
          </div>

          {/* Export summary preview */}
          {exportFetching ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              Loading records...
            </div>
          ) : (
            <div className="rounded-xl bg-muted/30 border border-border/60 px-3 py-2.5 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Period:</span>
                <span className="font-semibold">{formatWeekRange(exportStart, exportEnd)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Records with weight data:</span>
                <span className="font-semibold">
                  {buildExportRows(exportPickups, Object.fromEntries(admissions.map((a) => [a.id, a.fullName])), "").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Fixed Rate:</span>
                <span className="font-semibold text-primary">₹80 / Kg</span>
              </div>
            </div>
          )}

          <Button
            id="export-laundry-billing-btn"
            onClick={handleExport}
            disabled={exporting || exportFetching}
            className="w-full"
          >
            {exporting ? (
              <><Loader2 className="mr-2 size-4 animate-spin" /> Generating Excel…</>
            ) : (
              <><Download className="mr-2 size-4" /> Download Excel Billing Sheet</>
            )}
          </Button>
        </div>
      )}

      {/* ── Date Picker Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-soft">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => shiftDate(-1)}
            aria-label="Previous day"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-primary" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="cursor-pointer bg-transparent text-sm font-semibold outline-none"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => shiftDate(1)}
            aria-label="Next day"
          >
            <ChevronRight className="size-4" />
          </Button>
          {selectedDate !== today && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 text-xs font-medium"
              onClick={() => setSelectedDate(today)}
            >
              Today
            </Button>
          )}
          {selectedDate === today && (
            <Badge variant="outline" className="text-[11px] bg-primary/10 text-primary border-primary/30">
              Today
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Showing status and clothes weights for <strong>{selectedDate}</strong>
        </p>
      </div>

      {/* ── Summary Stats for Selected Date ── */}
      {summary && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-3 shadow-soft text-center">
            <p className="text-[11px] text-muted-foreground">Picked Up</p>
            <p className="text-xl font-bold text-success">{summary.pickup["picked_up"] ?? 0}</p>
            <p className="text-[10px] text-muted-foreground">Pickups Done</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-3 shadow-soft text-center">
            <p className="text-[11px] text-muted-foreground">Delivered</p>
            <p className="text-xl font-bold text-success">{summary.delivery["picked_up"] ?? 0}</p>
            <p className="text-[10px] text-muted-foreground">Deliveries Done</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-3 shadow-soft text-center col-span-2 sm:col-span-1">
            <p className="text-[11px] text-muted-foreground">Pending / Default Skipped</p>
            <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
              {students.length > 0
                ? Math.max(0, students.length - (summary.pickup["picked_up"] ?? 0))
                : (summary.pickup["pending"] ?? 0)}
            </p>
            <p className="text-[10px] text-muted-foreground">Remaining Students</p>
          </div>
        </div>
      )}

      {/* ── Filters ── */}
      <div className="mt-4 flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search student, phone, property…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Laundry status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ── Student list ── */}
      <div className="mt-4 space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
            <WashingMachine className="size-10 text-muted-foreground/40" />
            <p className="text-sm font-medium">
              {search || statusFilter !== "all" ? "No students match your filters." : "No students assigned to this laundry yet."}
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/laundry/assign">Assign Students</Link>
            </Button>
          </div>
        ) : (
          filtered.map((student) => {
            const mapUrl = getMapUrl(student as any, rooms, properties);
            const pickupRecord = getPickup(student.id, "pickup");
            const deliveryRecord = getPickup(student.id, "delivery");
            const rawStatus = (student as any).laundryStatus;
            const lStatus = rawStatus === "paused" || rawStatus === "cancelled" ? rawStatus : "active";

            return (
              <div key={student.id} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  {/* Student info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{student.fullName}</h3>
                      <Badge
                        variant="outline"
                        className={`text-[11px] capitalize ${lStatus === "active" ? "border-success/30 bg-success/10 text-success" : lStatus === "paused" ? "border-warning/30 bg-warning/10 text-warning-foreground" : "border-destructive/20 bg-destructive/10 text-destructive"}`}
                      >
                        Laundry: {lStatus}
                      </Badge>
                    </div>
                    {student.phoneNumber && (
                      <a href={`tel:${student.phoneNumber}`} className="mt-0.5 flex items-center gap-1.5 text-sm text-primary hover:underline">
                        <Phone className="size-3.5" />{student.phoneNumber}
                      </a>
                    )}
                    {student.propertyName && (
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {student.propertyName}{student.roomNumber ? ` · Room ${student.roomNumber}` : ""}
                      </p>
                    )}
                  </div>

                  {/* Actions: Date History & Call & Map */}
                  <div className="flex shrink-0 items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 h-8 text-xs gap-1 border-primary/30 text-primary hover:bg-primary/10"
                      onClick={() => setDialogStudent(student)}
                    >
                      <Calendar className="size-3.5" />
                      <span>Date & History</span>
                    </Button>
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

                {/* ── Pickup & Delivery status row ── */}
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3">
                  {(["pickup", "delivery"] as const).map((type) => {
                    const record = type === "pickup" ? pickupRecord : deliveryRecord;
                    const rawStatus = record?.status ?? "pending";
                    const currentStatus: LaundryPickupStatus =
                      rawStatus === "picked_up" || (rawStatus as string) === "delivered"
                        ? "picked_up"
                        : "pending";
                    const key = `${student.id}-${type}`;
                    const isUpdating = updatingKey === key;
                    const isDelivery = type === "delivery";

                    return (
                      <div key={type} className="space-y-1.5">
                        <p className="text-xs font-medium capitalize text-muted-foreground">{type} Status</p>
                        <Select
                          value={currentStatus}
                          onValueChange={(v) => setPickupStatus(student, type, v as LaundryPickupStatus)}
                          disabled={isUpdating || lStatus === "cancelled"}
                        >
                          <SelectTrigger className={`h-8 text-xs ${STATUS_COLORS[currentStatus]}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="picked_up">
                              {isDelivery ? "Delivered" : "Picked Up"}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    );
                  })}
                </div>

                {/* ── Clothes Weight & Description per type ── */}
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3">
                  {(["pickup", "delivery"] as const).map((type) => {
                    const key = `${student.id}-${type}`;
                    const pickupKey = `${student.id}-pickup`;
                    const isSavingDetails = updatingKey === key + "-details";
                    const isDeliveryType = type === "delivery";
                    // Delivery weight is always mirrored from pickup weight
                    const displayWeight = isDeliveryType
                      ? (weightMap[pickupKey] ?? "")
                      : (weightMap[key] ?? "");

                    return (
                      <div key={type} className="space-y-2 rounded-xl border border-border/70 bg-muted/20 p-2.5">
                        <p className="text-xs font-semibold capitalize flex items-center gap-1 text-foreground">
                          {type === "pickup" ? <Clock className="size-3 text-warning-foreground" /> : <CheckCircle2 className="size-3 text-success" />}
                          {type} Details
                        </p>

                        <div className="space-y-1">
                          <label className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                            <Scale className="size-3 text-primary" /> Weight of Clothes
                          </label>
                          <div className="relative flex items-center">
                            <Input
                              type="number"
                              min="0"
                              step="0.1"
                              placeholder="2.5"
                              value={displayWeight}
                              readOnly={isDeliveryType}
                              onChange={isDeliveryType ? undefined : (e) =>
                                setWeightMap((prev) => ({ ...prev, [key]: e.target.value }))
                              }
                              className={`h-7 text-xs bg-background pr-8 ${isDeliveryType ? "opacity-70 cursor-not-allowed" : ""}`}
                            />
                            <span className="pointer-events-none absolute right-2.5 text-[11px] font-medium text-muted-foreground">kg</span>
                          </div>
                          {isDeliveryType && (
                            <p className="text-[10px] text-muted-foreground italic">Auto-filled from pickup weight</p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                            <StickyNote className="size-3 text-primary" /> Description / Notes
                          </label>
                          <textarea
                            rows={2}
                            value={notesMap[key] ?? ""}
                            onChange={(e) => setNotesMap((prev) => ({ ...prev, [key]: e.target.value }))}
                            placeholder={`e.g. ${type === "pickup" ? "3 shirts, 2 pants, wash & iron" : "delivered clean & folded"}`}
                            className="w-full resize-none rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                          />
                        </div>

                        <button
                          onClick={() => {
                            // Sync delivery weight from pickup before saving
                            if (isDeliveryType) {
                              const pickupWeight = weightMap[pickupKey] ?? "";
                              setWeightMap((prev) => ({ ...prev, [key]: pickupWeight }));
                            }
                            saveDetails(student, type);
                          }}
                          disabled={isSavingDetails}
                          className="flex items-center justify-center gap-1 rounded-lg bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 text-[11px] font-semibold hover:bg-primary/20 transition-colors disabled:opacity-50 w-full"
                        >
                          {isSavingDetails ? <Loader2 className="size-3 animate-spin mr-1" /> : <Check className="size-3 mr-1" />}
                          Save {type} details
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Student Calendar Date / History Dialog ── */}
      <StudentLaundryDialog
        open={!!dialogStudent}
        onClose={() => setDialogStudent(null)}
        student={dialogStudent}
        laundryId={laundryId}
        laundryName={laundry?.laundryName}
        employeeId="admin"
        initialDate={selectedDate}
      />
    </AdminShell>
  );
}
