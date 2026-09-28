import { useState, useEffect, useMemo } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  Loader2, MapPin, Phone, UtensilsCrossed, Home,
  CheckCircle2, Clock, XCircle, SkipForward, CalendarDays,
  WashingMachine, Scale, ChevronRight, Package, CalendarOff, User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StudentShell } from "@/components/nivasi/student-shell";
import { useStudentAuth } from "@/lib/studentAuth";
import {
  useDeliveriesForStudent,
  useMesses,
  useMessRequestsForStudent,
  useLaundries,
  useLaundryPickupsForStudent,
  useLeaveRequestsForStudent,
  useProfileUpdateRequestsForStudent,
} from "@/lib/hooks";
import { todayISTDateString, todayDateString } from "@/lib/db";
import type { DeliveryStatus, LaundryPickup } from "@/lib/types";

export const Route = createFileRoute("/student/dashboard")({
  head: () => ({ meta: [{ title: "My Dashboard — NivasiSpace" }] }),
  component: StudentDashboardPage,
});

// ── helpers ───────────────────────────────────────────────────────────────────

const STATUS_ICONS: Record<DeliveryStatus, React.ReactNode> = {
  pending:       <Clock className="size-3.5" />,
  delivered:     <CheckCircle2 className="size-3.5" />,
  not_available: <XCircle className="size-3.5" />,
  skipped:       <SkipForward className="size-3.5" />,
};

const STATUS_COLORS: Record<DeliveryStatus, string> = {
  pending:       "bg-warning/15 text-warning-foreground border-warning/30",
  delivered:     "bg-success/15 text-success border-success/30",
  not_available: "bg-muted text-muted-foreground border-border",
  skipped:       "bg-destructive/10 text-destructive border-destructive/20",
};

function getMapUrl(propertyName?: string): string | null {
  if (!propertyName) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(propertyName)}`;
}

// ── page ──────────────────────────────────────────────────────────────────────

function StudentDashboardPage() {
  const { session, admission, loading } = useStudentAuth();
  const navigate = useNavigate();

  const { data: messes = [] } = useMesses();
  const { data: laundries = [] } = useLaundries();

  const { data: deliveries = [] } = useDeliveriesForStudent(
    admission?.id ?? null,
    admission?.admissionId,
  );
  const { data: messRequests = [], isLoading: reqLoading } = useMessRequestsForStudent(
    admission?.id ?? null,
  );
  const { data: laundryPickups = [] } = useLaundryPickupsForStudent(
    admission?.id ?? null,
    admission?.admissionId,
  );
  const { data: leaveRequests = [] } = useLeaveRequestsForStudent(admission?.id ?? null);
  const { data: profileReqs = [] } = useProfileUpdateRequestsForStudent(admission?.id ?? null);

  // Guard — redirect to login if no session
  useEffect(() => {
    if (!loading && !session) {
      navigate({ to: "/student/login", replace: true });
    }
  }, [loading, session, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const messId: string = admission?.messId || "";
  const mess = messes.find((m) => m.id === messId);
  const tiffin: string = admission?.tiffinStatus || "not set";

  const laundryId: string = admission?.laundryId || "";
  const laundry = laundries.find((l) => l.id === laundryId);
  const laundryStatus: string = admission?.laundryStatus || "not set";

  const mapUrl = getMapUrl(admission?.propertyName);

  // Has package services
  const hasMessInPackage =
    admission?.packageServices?.some((s) => s.toLowerCase().includes("mess")) || !!messId;
  const hasLaundryInPackage =
    admission?.packageServices?.some((s) => s.toLowerCase().includes("laundry")) || !!laundryId;

  // Latest laundry pickup or delivery
  const latestLaundryPickup: LaundryPickup | undefined = laundryPickups[0];

  const resolvedMessName = mess?.serialNumber != null ? `Mess #${mess.serialNumber}` : mess?.messName || "Assigned Mess";
  const resolvedLaundryName = laundry?.laundryName || "Assigned Laundry Provider";

  return (
    <StudentShell
      title="My Dashboard"
      subtitle="Overview of your hostel mess, laundry schedule, and daily updates"
    >
      {!admission ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center shadow-soft">
          <UtensilsCrossed className="mx-auto mb-3 size-10 text-muted-foreground/40" />
          <p className="font-semibold text-base">No admission record found</p>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
            We couldn't find an active admission record linked to <strong>{session?.email}</strong>.
            Please contact your hostel administrator.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top KPI stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Mess Plan</p>
              <p className="text-base font-bold truncate mt-1">{mess ? resolvedMessName : "Not Assigned"}</p>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className={`inline-block size-1.5 rounded-full ${tiffin === "active" ? "bg-success" : "bg-warning"}`} />
                <span className="text-[11px] capitalize text-muted-foreground">Tiffin: {tiffin}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Laundry Plan</p>
              <p className="text-base font-bold truncate mt-1">{laundry ? resolvedLaundryName : "Not Assigned"}</p>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className={`inline-block size-1.5 rounded-full ${laundryStatus === "active" ? "bg-success" : "bg-muted-foreground"}`} />
                <span className="text-[11px] capitalize text-muted-foreground">Laundry: {laundryStatus}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Room Assignment</p>
              <p className="text-base font-bold truncate mt-1">
                {admission.roomNumber ? `Room ${admission.roomNumber}` : "Room Assigned"}
              </p>
              <p className="text-[11px] text-muted-foreground truncate mt-1.5">
                {admission.propertyName || "Hostel Residence"}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Latest Laundry</p>
              <p className="text-base font-bold text-primary mt-1 flex items-center gap-1.5">
                <Scale className="size-4 shrink-0" />
                {latestLaundryPickup?.clothesWeight || (latestLaundryPickup ? "Logged" : "No logs yet")}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1.5 capitalize">
                {latestLaundryPickup ? latestLaundryPickup.status.replace("_", " ") : "Awaiting cycle"}
              </p>
            </div>
          </div>

          {/* Main 12-column responsive layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Main Column (8 cols on lg) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Quick Access Grid: My Mess, My Laundry, Leave Requests & Profile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  to="/student/mess"
                  className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                        <UtensilsCrossed className="size-5" />
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[10px] capitalize ${
                          tiffin === "active"
                            ? "border-success/30 bg-success/10 text-success"
                            : "border-warning/30 bg-warning/10 text-warning-foreground"
                        }`}
                      >
                        {tiffin}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold text-foreground">My Mess Service</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {mess ? mess.messName : hasMessInPackage ? "Included in Package" : "View Mess Status"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary pt-3 border-t border-border/60">
                    <span>Open Mess Portal</span>
                    <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>

                <Link
                  to="/student/laundry"
                  className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                        <WashingMachine className="size-5" />
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[10px] capitalize ${
                          laundryStatus === "active"
                            ? "border-primary/30 bg-primary/10 text-primary"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        {laundryStatus}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold text-foreground">My Laundry Service</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {laundry ? laundry.laundryName : hasLaundryInPackage ? "Included in Package" : "View Laundry Status"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary pt-3 border-t border-border/60">
                    <span>Open Laundry Portal</span>
                    <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>

                {/* Leave Requests Card */}
                <Link
                  to="/student/leaves"
                  className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 transition-transform group-hover:scale-105">
                        <CalendarOff className="size-5" />
                      </div>
                      {leaveRequests.some((l) => l.status === "pending") ? (
                        <Badge variant="outline" className="text-[10px] border-warning/30 bg-warning/10 text-warning-foreground font-semibold">
                          Pending Approval
                        </Badge>
                      ) : leaveRequests.some((l) => l.status === "approved" && (!l.toDate || l.toDate >= todayISTDateString())) ? (
                        <Badge variant="outline" className="text-[10px] border-success/30 bg-success/10 text-success font-semibold">
                          Approved Leave
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">
                          {leaveRequests.length} Recorded
                        </Badge>
                      )}
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold text-foreground">Hostel Leave Requests</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Apply for leave, open return dates & view approval
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary pt-3 border-t border-border/60">
                    <span>Manage Leaves</span>
                    <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>

                {/* Profile Card */}
                <Link
                  to="/student/profile"
                  className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                        <User className="size-5" />
                      </div>
                      {profileReqs.some((p) => p.status === "pending") ? (
                        <Badge variant="outline" className="text-[10px] border-warning/30 bg-warning/10 text-warning-foreground font-semibold">
                          Update Pending
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">
                          View & Edit
                        </Badge>
                      )}
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold text-foreground">Admission Profile</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        View official records & request profile updates
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary pt-3 border-t border-border/60">
                    <span>View Profile</span>
                    <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </div>

              {/* Today's Tiffin Delivery */}
              <TodayDeliveryCard deliveries={deliveries} />

              {/* Recent Laundry Activity logged by Laundry Employee */}
              {latestLaundryPickup && (
                <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <WashingMachine className="size-4 text-primary" />
                      <h3 className="font-display text-base font-bold">Latest Laundry Update</h3>
                    </div>
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-semibold">
                      {latestLaundryPickup.type === "pickup" ? "Pickup Log" : "Delivery Log"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-muted/30 p-3.5 text-sm border border-border/60">
                    <div>
                      <p className="font-medium text-xs text-muted-foreground font-mono">
                        {new Date(latestLaundryPickup.date).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                      <p className="font-semibold capitalize text-foreground mt-0.5">
                        Status: {latestLaundryPickup.status.replace("_", " ")}
                      </p>
                    </div>
                    {latestLaundryPickup.clothesWeight && (
                      <div className="flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
                        <Scale className="size-3.5" />
                        <span>Weight: {latestLaundryPickup.clothesWeight}</span>
                      </div>
                    )}
                  </div>
                  {latestLaundryPickup.notes && (
                    <p className="text-xs text-muted-foreground bg-muted/20 rounded-lg p-2.5">
                      <strong>Staff Note:</strong> {latestLaundryPickup.notes}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Right Sidebar Column (4 cols on lg) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Student Profile Info Card */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-soft space-y-4">
                <div className="flex items-start justify-between gap-2 border-b border-border pb-3">
                  <div>
                    <h2 className="font-display text-lg font-bold">{admission.fullName}</h2>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">{admission.admissionId}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] capitalize bg-muted/40">
                    Student
                  </Badge>
                </div>

                <div className="space-y-2.5 text-xs">
                  {admission.phoneNumber && (
                    <a
                      href={`tel:${admission.phoneNumber}`}
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Phone className="size-3.5 shrink-0" />
                      <span>{admission.phoneNumber}</span>
                    </a>
                  )}

                  {admission.propertyName && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Home className="size-3.5 shrink-0 text-foreground" />
                      <span>
                        {admission.propertyName}
                        {admission.roomNumber ? ` · Room ${admission.roomNumber}` : ""}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <UtensilsCrossed className="size-3.5 shrink-0 text-foreground" />
                    <span>{mess ? resolvedMessName : "No mess assigned"}</span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <WashingMachine className="size-3.5 shrink-0 text-foreground" />
                    <span>{laundry ? resolvedLaundryName : "No laundry assigned"}</span>
                  </div>
                </div>

                {mapUrl && (
                  <Button asChild variant="outline" size="sm" className="w-full text-xs font-semibold h-9">
                    <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                      <MapPin className="mr-1.5 size-3.5 text-primary" /> Open Location Map
                    </a>
                  </Button>
                )}
              </div>

              {/* Request History — mess requests */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-soft space-y-3">
                <h3 className="flex items-center gap-2 font-display text-sm font-bold">
                  <CalendarDays className="size-4 text-primary" />
                  Mess Requests History
                </h3>
                {reqLoading ? (
                  <Skeleton className="h-32 rounded-xl" />
                ) : messRequests.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No special mess requests yet.</p>
                ) : (
                  <div className="divide-y divide-border max-h-64 overflow-y-auto">
                    {messRequests.map((req) => (
                      <div key={req.id} className="py-2.5 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {req.requestType === "less_quantity" ? "Less Quantity"
                              : req.requestType === "more_quantity" ? "More Quantity"
                              : "Other"}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-[9px] ${
                              req.status === "active"
                                ? "border-success/30 bg-success/10 text-success"
                                : "text-muted-foreground"
                            }`}
                          >
                            {req.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        {req.description && (
                          <p className="text-xs text-muted-foreground">"{req.description}"</p>
                        )}
                        <p className="text-[10px] text-muted-foreground font-mono">
                          {req.createdAt
                            ? req.createdAt.toLocaleDateString("en-IN", {
                                day: "numeric", month: "short",
                              })
                            : "—"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </StudentShell>
  );
}

// ── Today's delivery card ─────────────────────────────────────────────────────

function TodayDeliveryCard({
  deliveries,
}: {
  deliveries: { date: string; meal: string; status: DeliveryStatus; id: string }[];
}) {
  const todayIST = todayISTDateString();
  const todayLocal = todayDateString();

  // Match either IST date string or local YYYY-MM-DD
  const todayRecords = deliveries.filter(
    (d) => d.date === todayIST || d.date === todayLocal,
  );
  const lunch = todayRecords.find((d) => d.meal === "lunch");
  const dinner = todayRecords.find((d) => d.meal === "dinner");

  const dateLabel = new Date().toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "long", day: "numeric", month: "long",
  });

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-display text-base font-bold">Today's Delivery</h3>
        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="inline-block size-2 rounded-full bg-success animate-pulse" />
          Live
        </span>
      </div>
      <p className="mb-3 text-xs text-muted-foreground">{dateLabel}</p>
      <div className="grid grid-cols-2 gap-3">
        {(["lunch", "dinner"] as const).map((meal) => {
          const rec = meal === "lunch" ? lunch : dinner;
          const status: DeliveryStatus = rec?.status ?? "pending";
          return (
            <div
              key={meal}
              className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 ${STATUS_COLORS[status]}`}
            >
              <p className="text-xs font-medium capitalize text-muted-foreground">{meal}</p>
              <div className="flex items-center gap-1.5 font-semibold">
                {STATUS_ICONS[status]}
                <span className="text-sm">
                  {status === "not_available" ? "N/A" : status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
