import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Download, Plus, Search } from "lucide-react";

import { AdminShell } from "@/components/nivasi/admin-shell";
import { EmptyState } from "@/components/nivasi/stat-card";
import { ProfileAvatar } from "@/components/nivasi/profile-avatar";
import { MattressBadge, PaymentBadge, StatusPill } from "@/components/nivasi/badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdmissions } from "@/lib/hooks";
import { formatDate, formatINR } from "@/lib/format";
import type { Admission } from "@/lib/types";

// ---------------------------------------------------------------------------
// Excel export — no external dependency needed.
// Builds a UTF-8 CSV with a BOM so Excel auto-detects the encoding and opens
// Indian names / characters correctly.
// ---------------------------------------------------------------------------
function exportToExcel(data: Admission[]) {
  const headers = [
    "Sr No",
    "Student Name",
    "Phone No",
    "Email",
    "Gender",
    "Date of Birth",
    "Year",
    "Branch",
    "College",
  ];

  const escape = (val: string | number | undefined | null) => {
    const s = String(val ?? "");
    // Wrap in quotes if the value contains a comma, quote, or newline
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };

  const rows = data.map((a, idx) => [
    idx + 1,
    a.fullName,
    a.phoneNumber,
    a.email ?? "",
    a.gender ?? "",
    a.dateOfBirth ? formatDate(a.dateOfBirth) : "",
    a.year ?? "",
    a.course ?? "",
    a.collegeName ?? "",
  ]);

  const csv =
    "\uFEFF" + // UTF-8 BOM — tells Excel to use UTF-8
    [headers, ...rows]
      .map((row) => row.map(escape).join(","))
      .join("\r\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `admissions_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export const Route = createFileRoute("/admin/admissions/")({
  head: () => ({
    meta: [
      { title: "Admissions — NivasiSpace Admin" },
      { name: "description", content: "Search, filter and manage every NivasiSpace student admission." },
      { property: "og:title", content: "Admissions — NivasiSpace Admin" },
      {
        property: "og:description",
        content: "Search, filter and manage every NivasiSpace student admission.",
      },
    ],
  }),
  component: AdmissionsListPage,
});

function AdmissionsListPage() {
  const { data: admissions = [], isLoading } = useAdmissions();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [payment, setPayment] = useState("all");
  const [items, setItems] = useState("all");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return admissions.filter((a) => {
      if (
        q &&
        !`${a.fullName} ${a.admissionId} ${a.phoneNumber} ${a.collegeName} ${a.roomNumber}`
          .toLowerCase()
          .includes(q)
      )
        return false;
      if (payment !== "all" && a.paymentStatus !== payment) return false;
      if (items === "bag-pending" && a.bagProvided) return false;
      if (items === "tiffin-pending" && a.tiffinProvided) return false;
      if (items === "mattress-required" && !a.mattressRequired) return false;
      return true;
    });
  }, [admissions, query, payment, items]);

  return (
    <AdminShell
      title="Admissions"
      subtitle={`${admissions.length} student${admissions.length === 1 ? "" : "s"} on record`}
      action={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => exportToExcel(rows)}
            disabled={rows.length === 0}
          >
            <Download className="size-4" />
            Export Excel
          </Button>
          <Button asChild>
            <Link to="/admin/admissions/new">
              <Plus className="size-4" />
              New Admission
            </Link>
          </Button>
        </div>
      }
    >
      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative min-w-56 flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, admission ID, phone, college…"
            className="pl-9"
          />
        </div>
        <Select value={payment} onValueChange={setPayment}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All payments</SelectItem>
            <SelectItem value="completed">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Select value={items} onValueChange={setItems}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All items</SelectItem>
            <SelectItem value="bag-pending">Bag pending</SelectItem>
            <SelectItem value="tiffin-pending">Tiffin pending</SelectItem>
            <SelectItem value="mattress-required">Mattress required</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-2xl" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          title={admissions.length === 0 ? "No admissions yet" : "No matching admissions"}
          description={
            admissions.length === 0
              ? "Create your first admission to get started."
              : "Try adjusting your search or filters."
          }
          action={
            admissions.length === 0 ? (
              <Button asChild>
                <Link to="/admin/admissions/new">
                  <Plus className="size-4" />
                  New Admission
                </Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-soft lg:block">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Admission ID</th>
                  <th className="px-4 py-3">College</th>
                  <th className="px-4 py-3">Package</th>
                  <th className="px-4 py-3 text-success">Paid</th>
                  <th className="px-4 py-3 text-destructive">Pending</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((a) => (
                  <tr
                    key={a.id}
                    className="border-t border-border transition-colors hover:bg-muted/40 cursor-pointer"
                    onClick={() => navigate({ to: "/admin/admissions/$admissionId", params: { admissionId: a.admissionId } })}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <ProfileAvatar path={a.profileImagePath} name={a.fullName} className="size-9" />
                        <span>
                          <span className="block font-semibold">{a.fullName}</span>
                          <span className="block text-xs text-muted-foreground">
                            {a.phoneNumber}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-primary">{a.admissionId}</td>
                    <td className="px-4 py-3 text-muted-foreground">{a.collegeName || "—"}</td>
                    <td className="px-4 py-3">
                      <span className="block">{a.packageName || "—"}</span>
                      <span className="block text-xs text-muted-foreground">
                        {formatINR(a.packageAmount)}
                      </span>
                    </td>
                    {/* Paid column */}
                    <td className="px-4 py-3">
                      <span className="block font-semibold text-success">
                        {formatINR(a.amountPaid)}
                      </span>
                      {a.paymentStatus === "completed" && (
                        <span className="mt-0.5 block text-[10px] font-medium text-success">
                          ✓ Paid
                        </span>
                      )}
                    </td>
                    {/* Pending column */}
                    <td className="px-4 py-3">
                      {a.balanceAmount > 0 ? (
                        <>
                          <span className="block font-semibold text-destructive">
                            {formatINR(a.balanceAmount)}
                          </span>
                          <span className="mt-0.5 block text-[10px] font-medium text-destructive">
                            ⚠ Due
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        <StatusPill ok={a.bagProvided} okLabel="Bag" pendingLabel="Bag" />
                        <StatusPill ok={a.tiffinProvided} okLabel="Tiffin" pendingLabel="Tiffin" />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {formatDate(a.admissionDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="grid gap-3 lg:hidden">
            {rows.map((a) => (
              <Link
                key={a.id}
                to="/admin/admissions/$admissionId"
                params={{ admissionId: a.admissionId }}
                className="rounded-2xl border border-border bg-card p-4 shadow-soft"
              >
                <div className="flex items-center gap-3">
                  <ProfileAvatar path={a.profileImagePath} name={a.fullName} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{a.fullName}</p>
                    <p className="truncate font-mono text-xs text-primary">{a.admissionId}</p>
                  </div>
                  <PaymentBadge status={a.paymentStatus} />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <span>{a.collegeName || "College not set"}</span>
                  <span className="text-right">{a.packageName || "No package"}</span>
                  <span className="font-semibold text-success">
                    Paid: {formatINR(a.amountPaid)}
                  </span>
                  <span className={`text-right font-semibold ${a.balanceAmount > 0 ? "text-destructive" : "text-muted-foreground"}`}>
                    {a.balanceAmount > 0 ? `Due: ${formatINR(a.balanceAmount)}` : "✓ Cleared"}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <StatusPill ok={a.bagProvided} okLabel="Bag given" pendingLabel="Bag pending" />
                  <StatusPill
                    ok={a.tiffinProvided}
                    okLabel="Tiffin given"
                    pendingLabel="Tiffin pending"
                  />
                  <MattressBadge required={a.mattressRequired} />
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </AdminShell>
  );
}
