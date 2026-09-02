import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft, Phone, MapPin, Search, WashingMachine,
  CheckCircle2, Clock, XCircle, SkipForward,
} from "lucide-react";
import { toast } from "sonner";

import { AdminShell } from "@/components/nivasi/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  useLaundries, useAdmissions, useLaundryPickupsForDate,
  useLaundryPickupSummary, useRooms, useProperties,
} from "@/lib/hooks";
import { upsertLaundryPickup, todayDateString } from "@/lib/db";
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

function LaundryStudentsPage() {
  const { laundryId } = Route.useParams();
  const qc = useQueryClient();
  const today = todayDateString();

  const { data: laundries = [], isLoading: laundryLoading } = useLaundries();
  const { data: admissions = [], isLoading: admLoading } = useAdmissions();
  const { data: pickups = [] } = useLaundryPickupsForDate(laundryId, today);
  const { data: summary } = useLaundryPickupSummary(laundryId, today);
  const { data: rooms = [] } = useRooms();
  const { data: properties = [] } = useProperties();

  const laundry = laundries.find((l) => l.id === laundryId);
  const students = useMemo(
    () => admissions.filter((a) => (a as any).laundryId === laundryId),
    [admissions, laundryId],
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);

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
    setUpdatingKey(key);
    try {
      await upsertLaundryPickup({
        studentId: student.id,
        admissionId: student.admissionId,
        laundryId,
        employeeId: "admin",
        date: today,
        type,
        status,
      });
      await qc.invalidateQueries({ queryKey: ["laundryPickups", laundryId, today] });
      await qc.invalidateQueries({ queryKey: ["laundryPickupSummary", laundryId, today] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update pickup status.");
    } finally {
      setUpdatingKey(null);
    }
  }

  const isLoading = laundryLoading || admLoading;

  return (
    <AdminShell
      title={laundry?.laundryName ?? "Laundry Students"}
      subtitle={laundry ? `Owner: ${laundry.ownerName || "—"}  ·  ${students.length} students` : ""}
      action={
        <Button asChild variant="outline" size="sm">
          <Link to="/admin/laundry"><ArrowLeft className="mr-1.5 size-4" /> Back to Laundry</Link>
        </Button>
      }
    >
      {/* Today's summary */}
      {summary && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(["picked_up", "pending", "skipped", "not_available"] as LaundryPickupStatus[]).map((s) => (
            <div key={s} className="rounded-2xl border border-border bg-card p-3 shadow-soft text-center">
              <p className="text-[11px] text-muted-foreground capitalize">{STATUS_LABELS[s]}</p>
              <p className="text-xl font-bold">
                {((summary.pickup[s] ?? 0) + (summary.delivery[s] ?? 0))}
              </p>
              <p className="text-[10px] text-muted-foreground">
                P:{summary.pickup[s] ?? 0} / D:{summary.delivery[s] ?? 0}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
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

      {/* Student list */}
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
            const lStatus = (student as any).laundryStatus ?? "active";

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

                {/* Pickup & Delivery status row */}
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3">
                  {(["pickup", "delivery"] as const).map((type) => {
                    const record = type === "pickup" ? pickupRecord : deliveryRecord;
                    const currentStatus: LaundryPickupStatus = record?.status ?? "pending";
                    const key = `${student.id}-${type}`;
                    const isUpdating = updatingKey === key;
                    return (
                      <div key={type} className="space-y-1.5">
                        <p className="text-xs font-medium capitalize text-muted-foreground">{type}</p>
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
                            <SelectItem value="picked_up">Picked Up</SelectItem>
                            <SelectItem value="not_available">Not Available</SelectItem>
                            <SelectItem value="skipped">Skipped</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </AdminShell>
  );
}
