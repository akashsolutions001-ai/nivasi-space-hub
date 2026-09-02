import { useState, useEffect, useMemo } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  Loader2, LogOut, MapPin, Phone, UtensilsCrossed, Home,
  CheckCircle2, Clock, XCircle, SkipForward, CalendarDays,
  WashingMachine, ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useStudentAuth } from "@/lib/studentAuth";
import { useDeliveriesForStudent, useMesses } from "@/lib/hooks";
import type { DeliveryStatus } from "@/lib/types";

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

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function getMapUrl(propertyName?: string): string | null {
  if (!propertyName) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(propertyName)}`;
}

// ── page ──────────────────────────────────────────────────────────────────────

function StudentDashboardPage() {
  const { session, admission, loading, logoutStudent } = useStudentAuth();
  const navigate = useNavigate();
  const { data: messes = [] } = useMesses();
  const { data: deliveries = [], isLoading: delLoading } = useDeliveriesForStudent(
    admission?.id ?? null,
  );

  // Guard — redirect to login if no session
  useEffect(() => {
    if (!loading && !session) {
      navigate({ to: "/student/login", replace: true });
    }
  }, [loading, session, navigate]);

  function handleLogout() {
    logoutStudent();
    navigate({ to: "/student/login", replace: true });
  }

  // Group deliveries by date descending
  const deliveriesByDate = useMemo(() => {
    const map: Record<string, typeof deliveries> = {};
    for (const d of deliveries) {
      if (!map[d.date]) map[d.date] = [];
      map[d.date]!.push(d);
    }
    return Object.entries(map).sort(([a], [b]) => b.localeCompare(a));
  }, [deliveries]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const messId: string = (admission as any)?.messId ?? "";
  const mess = messes.find((m) => m.id === messId);
  const tiffin: string = (admission as any)?.tiffinStatus ?? "not set";
  const mapUrl = getMapUrl(admission?.propertyName);

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-xl gradient-brand">
              <UtensilsCrossed className="size-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">My Dashboard</span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Log out">
            <LogOut className="size-4" />
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-lg space-y-4 px-4 pt-4">

        {!admission ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center shadow-soft">
            <UtensilsCrossed className="mx-auto mb-3 size-10 text-muted-foreground/40" />
            <p className="font-semibold">No admission found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              We couldn't find an admission record linked to <strong>{session?.email}</strong>.
              Please contact your hostel administrator.
            </p>
          </div>
        ) : (
          <>
            {/* Student info */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-display text-lg font-bold">{admission.fullName}</h2>
                  <p className="text-sm text-muted-foreground">{admission.admissionId}</p>
                </div>
                <Badge
                  variant="outline"
                  className={`capitalize text-[11px] ${
                    tiffin === "active"
                      ? "border-success/30 bg-success/10 text-success"
                      : tiffin === "paused"
                      ? "border-warning/30 bg-warning/10 text-warning-foreground"
                      : "border-destructive/20 bg-destructive/10 text-destructive"
                  }`}
                >
                  Tiffin: {tiffin}
                </Badge>
              </div>

              {admission.phoneNumber && (
                <a href={`tel:${admission.phoneNumber}`} className="mt-2 flex items-center gap-2 text-sm text-primary hover:underline">
                  <Phone className="size-3.5" />{admission.phoneNumber}
                </a>
              )}

              <div className="mt-3 space-y-1.5 border-t border-border pt-3">
                {admission.propertyName && (
                  <div className="flex items-center gap-2 text-sm">
                    <Home className="size-3.5 shrink-0 text-muted-foreground" />
                    <span>
                      {admission.propertyName}
                      {admission.roomNumber ? ` · Room ${admission.roomNumber}` : ""}
                    </span>
                  </div>
                )}
                {mess ? (
                  <div className="flex items-center gap-2 text-sm">
                    <UtensilsCrossed className="size-3.5 shrink-0 text-muted-foreground" />
                    <span>{mess.messName}{mess.ownerName ? ` · ${mess.ownerName}` : ""}</span>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Not assigned to a mess yet.</p>
                )}
              </div>

              {mapUrl && (
                <Button asChild variant="outline" size="sm" className="mt-3 w-full">
                  <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                    <MapPin className="mr-1.5 size-3.5" /> Open Map
                  </a>
                </Button>
              )}
            </div>

            {/* Quick navigation cards */}
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/student/mess"
                className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 shadow-soft hover:border-primary/40 hover:bg-primary/5 transition-colors"
              >
                <div className="flex size-10 items-center justify-center rounded-xl gradient-brand">
                  <UtensilsCrossed className="size-5 text-primary-foreground" />
                </div>
                <span className="font-semibold text-sm">My Mess</span>
                <p className="text-[11px] text-muted-foreground text-center">Tiffin &amp; requests</p>
                <ChevronRight className="size-3.5 text-muted-foreground" />
              </Link>
              <Link
                to="/student/laundry"
                className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 shadow-soft hover:border-primary/40 hover:bg-primary/5 transition-colors"
              >
                <div className="flex size-10 items-center justify-center rounded-xl gradient-brand">
                  <WashingMachine className="size-5 text-primary-foreground" />
                </div>
                <span className="font-semibold text-sm">My Laundry</span>
                <p className="text-[11px] text-muted-foreground text-center">Weekly service</p>
                <ChevronRight className="size-3.5 text-muted-foreground" />
              </Link>
            </div>

            {/* Today's delivery */}
            <TodayDeliveryCard deliveries={deliveries} />

            {/* Delivery history */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <h3 className="mb-3 flex items-center gap-2 font-display text-base font-bold">
                <CalendarDays className="size-4 text-primary" />
                Tiffin History
              </h3>
              {delLoading ? (
                <Skeleton className="h-32 rounded-xl" />
              ) : deliveriesByDate.length === 0 ? (
                <p className="text-sm text-muted-foreground">No delivery records yet.</p>
              ) : (
                <div className="space-y-4">
                  {deliveriesByDate.map(([date, records]) => (
                    <div key={date}>
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {formatDate(date)}
                      </p>
                      <div className="space-y-1">
                        {records.map((r) => (
                          <div key={r.id} className="flex items-center justify-between gap-2 rounded-xl border border-border px-3 py-2">
                            <span className="capitalize text-sm">{r.meal}</span>
                            <Badge variant="outline" className={`flex items-center gap-1 text-[11px] ${STATUS_COLORS[r.status]}`}>
                              {STATUS_ICONS[r.status]}
                              {r.status === "not_available" ? "N/A" : r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Today's delivery card ─────────────────────────────────────────────────────

function TodayDeliveryCard({ deliveries }: { deliveries: { date: string; meal: string; status: DeliveryStatus; id: string }[] }) {
  const today = new Date().toISOString().slice(0, 10);
  const todayRecords = deliveries.filter((d) => d.date === today);
  const lunch = todayRecords.find((d) => d.meal === "lunch");
  const dinner = todayRecords.find((d) => d.meal === "dinner");

  const dateLabel = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long",
  });

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <h3 className="mb-1 font-display text-base font-bold">Today's Delivery</h3>
      <p className="mb-3 text-xs text-muted-foreground">{dateLabel}</p>
      <div className="grid grid-cols-2 gap-3">
        {(["lunch", "dinner"] as const).map((meal) => {
          const rec = meal === "lunch" ? lunch : dinner;
          const status: DeliveryStatus = rec?.status ?? "pending";
          return (
            <div key={meal} className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 ${STATUS_COLORS[status]}`}>
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
