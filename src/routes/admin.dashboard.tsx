import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BedDouble,
  Briefcase,
  Eye,
  EyeOff,
  IndianRupee,
  Plus,
  TrendingUp,
  Users,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";

import { AdminShell } from "@/components/nivasi/admin-shell";
import { EmptyState, StatCard } from "@/components/nivasi/stat-card";
import { ProfileAvatar } from "@/components/nivasi/profile-avatar";
import { PaymentBadge } from "@/components/nivasi/badges";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { computeStats, filterByPeriod, useAdmissions, useAllPayouts } from "@/lib/hooks";
import { useIsGlobalAdmin, useAuth } from "@/lib/auth";
import { formatDate, formatINR } from "@/lib/format";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — NivasiSpace Admin" },
      { name: "description", content: "Live admission, payment and inventory analytics for NivasiSpace." },
      { property: "og:title", content: "Dashboard — NivasiSpace Admin" },
      {
        property: "og:description",
        content: "Live admission, payment and inventory analytics for NivasiSpace.",
      },
    ],
  }),
  component: DashboardPage,
});

const PERIODS = [
  { value: "today",  label: "Today" },
  { value: "week",   label: "This Week" },
  { value: "month",  label: "This Month" },
  { value: "all",    label: "All Time" },
];

function DashboardPage() {
  const { data: admissions = [], isLoading } = useAdmissions();
  const { data: allPayouts = [], isLoading: payoutsLoading } = useAllPayouts();
  const isGlobalAdmin = useIsGlobalAdmin();
  const { collegeFilter } = useAuth();
  const [period, setPeriod] = useState("all");
  // Global admin gets an eye toggle; normal admin never sees the money section
  const [showMoney, setShowMoney] = useState(false);

  // For global admin: filter data to the selected college only
  const filteredAdmissions = useMemo(() => {
    if (!isGlobalAdmin || !collegeFilter.college) return admissions;
    return admissions.filter((a) => a.collegeName === collegeFilter.college);
  }, [admissions, isGlobalAdmin, collegeFilter.college]);

  const scoped  = useMemo(() => filterByPeriod(filteredAdmissions, period), [filteredAdmissions, period]);
  const stats   = useMemo(() => computeStats(scoped), [scoped]);
  const recent  = useMemo(() => filteredAdmissions.slice(0, 6), [filteredAdmissions]);

  // Payouts filtered by period (payouts don't have a college field, filter by date only)
  const scopedPayouts = useMemo(() => {
    if (period === "all") return allPayouts;
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    if (period === "week") start.setDate(start.getDate() - start.getDay());
    if (period === "month") start.setDate(1);
    return allPayouts.filter((p) => {
      const d = p.createdAt ?? p.processedAt ?? null;
      return d ? d.getTime() >= start.getTime() : false;
    });
  }, [allPayouts, period]);

  const totalPayouts = useMemo(
    () => scopedPayouts.filter((p) => p.status === "PAID").reduce((sum, p) => sum + p.amount, 0),
    [scopedPayouts],
  );

  // Net collected = amount collected from students minus what was paid out
  const netAfterPayouts = Math.max(0, stats.collected - totalPayouts);

  return (
    <AdminShell
      title="Dashboard"
      subtitle={
        isGlobalAdmin && collegeFilter.college
          ? `Showing data for: ${collegeFilter.college}`
          : "A live view of admissions, payments and provided items."
      }
      action={
        <Button asChild>
          <Link to="/admin/admissions/new">
            <Plus className="size-4" />
            New Admission
          </Link>
        </Button>
      }
    >
      <Tabs value={period} onValueChange={setPeriod} className="mb-6">
        <TabsList>
          {PERIODS.map((p) => (
            <TabsTrigger key={p.value} value={p.value}>{p.label}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading || payoutsLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      ) : (
        <>
          {/* ── Stat grid ── */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Admissions"    value={stats.total}          icon={Users}          tone="brand" />
            <StatCard label="Added This Week"     value={stats.recent}         icon={TrendingUp} />
            <StatCard label="Payments Completed"  value={stats.paid}           icon={Wallet}         tone="success" />
            <StatCard label="Payments Pending"    value={stats.paymentPending} icon={IndianRupee}    tone="warning" />
            <StatCard label="Bags Pending"        value={stats.bagsPending}    icon={Briefcase}      tone="warning" />
            <StatCard label="Tiffins Pending"     value={stats.tiffinPending}  icon={UtensilsCrossed} tone="warning" />
            <StatCard label="Mattress Required"   value={stats.mattressRequired} icon={BedDouble} />
            {/* Outstanding Balance — global admin always, normal admin never */}
            {isGlobalAdmin && (
              <StatCard
                label="Outstanding Balance"
                value={formatINR(stats.outstanding)}
                icon={IndianRupee}
                tone="warning"
              />
            )}
          </div>

          {/* ── Money section — global admin only ── */}
          {isGlobalAdmin && (
            <div className="mt-6">
              <div className="mb-3 flex items-center gap-2">
                <h2 className="font-display text-base font-semibold">Financials</h2>
                <button
                  type="button"
                  onClick={() => setShowMoney((v) => !v)}
                  className="ml-1 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label={showMoney ? "Hide financials" : "Show financials"}
                >
                  {showMoney ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>

              {showMoney ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <MoneyCard
                    label="Total Package Value"
                    value={formatINR(stats.totalValue)}
                    hint="Sum of all admission packages"
                  />
                  <MoneyCard
                    label="Amount Collected"
                    value={formatINR(stats.collected)}
                    accent
                    hint="Payments received from students"
                  />
                  <MoneyCard
                    label="Total Payouts"
                    value={formatINR(totalPayouts)}
                    tone="warning"
                    hint="Completed payouts in this period"
                  />
                  <MoneyCard
                    label="Net Balance"
                    value={formatINR(netAfterPayouts)}
                    hint="Collected minus total payouts"
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-5 py-4 text-sm text-muted-foreground">
                  Financial data is hidden. Click the eye icon to reveal.
                </div>
              )}
            </div>
          )}

          {/* ── Recent Admissions ── */}
          <section className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">Recent Admissions</h2>
              <Button asChild variant="ghost" size="sm">
                <Link to="/admin/admissions">View all</Link>
              </Button>
            </div>

            {recent.length === 0 ? (
              <EmptyState
                title="No admissions yet"
                description="Add your first student to see live analytics here."
                action={
                  <Button asChild>
                    <Link to="/admin/admissions/new">
                      <Plus className="size-4" />
                      New Admission
                    </Link>
                  </Button>
                }
              />
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {recent.map((a) => (
                  <Link
                    key={a.id}
                    to="/admin/admissions/$admissionId"
                    params={{ admissionId: a.admissionId }}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
                  >
                    <ProfileAvatar path={a.profileImagePath} name={a.fullName} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{a.fullName}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {a.admissionId} · {a.collegeName || "College not set"}
                      </p>
                    </div>
                    <div className="text-right">
                      <PaymentBadge status={a.paymentStatus} />
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {formatDate(a.admissionDate)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </AdminShell>
  );
}

function MoneyCard({
  label,
  value,
  hint,
  accent,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
  tone?: "warning";
}) {
  const base = "rounded-2xl p-5 shadow-soft";
  let className: string;
  if (accent) {
    className = `${base} gradient-brand text-primary-foreground shadow-lift`;
  } else if (tone === "warning") {
    className = `${base} border border-warning/30 bg-warning/10`;
  } else {
    className = `${base} border border-border bg-card`;
  }

  return (
    <div className={className}>
      <p className="text-[11px] font-semibold tracking-wide uppercase opacity-70">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold tabular-nums">{value}</p>
      {hint && (
        <p className={`mt-1.5 text-[11px] ${accent ? "opacity-70" : "text-muted-foreground"}`}>
          {hint}
        </p>
      )}
    </div>
  );
}
