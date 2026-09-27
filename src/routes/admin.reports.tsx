import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileSpreadsheet,
  Filter,
  IndianRupee,
  Layers,
  Package,
  Phone,
  Printer,
  Search,
  ShieldAlert,
  Sparkles,
  UserCheck,
  Users,
  UtensilsCrossed,
  WashingMachine,
  XCircle,
} from "lucide-react";

import { AdminShell } from "@/components/nivasi/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAdmissions,
  useMesses,
  useLaundries,
  useProperties,
  usePackages,
} from "@/lib/hooks";
import { useAuth, useIsGlobalAdmin } from "@/lib/auth";
import { formatDate, formatINR } from "@/lib/format";
import type { Admission } from "@/lib/types";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({
    meta: [
      { title: "Reports & Analytics — NivasiSpace Admin" },
      { name: "description", content: "Comprehensive system reports for Mess, Laundry, Students, and Financial data." },
    ],
  }),
  component: ReportsPage,
});

/* -------------------------------------------------------------------------- */
/*                               CSV HELPERS                                  */
/* -------------------------------------------------------------------------- */

function escapeCsv(cell: unknown): string {
  const str = cell == null ? "" : String(cell);
  return `"${str.replace(/"/g, '""')}"`;
}

function downloadCsv(filename: string, headers: string[], rows: (string | number | null | undefined)[][]) {
  const csv =
    "\uFEFF" +
    [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* -------------------------------------------------------------------------- */
/*                             MAIN REPORTS PAGE                              */
/* -------------------------------------------------------------------------- */

function ReportsPage() {
  const { data: rawAdmissions = [], isLoading: admissionsLoading } = useAdmissions();
  const { data: messes = [], isLoading: messesLoading } = useMesses();
  const { data: laundries = [], isLoading: laundriesLoading } = useLaundries();
  const { data: properties = [], isLoading: propertiesLoading } = useProperties();
  const { data: packages = [] } = usePackages();

  const isGlobalAdmin = useIsGlobalAdmin();
  const { collegeFilter } = useAuth();

  // Active tab state
  const [activeTab, setActiveTab] = useState("all-students");

  // Filter states
  const [search, setSearch] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all");
  const [selectedMess, setSelectedMess] = useState("all");
  const [selectedLaundry, setSelectedLaundry] = useState("all");
  const [selectedTiffinStatus, setSelectedTiffinStatus] = useState("all");

  // Global admin college filter
  const admissions = useMemo(() => {
    if (!isGlobalAdmin || !collegeFilter.college) return rawAdmissions;
    return rawAdmissions.filter((a) => a.collegeName === collegeFilter.college);
  }, [rawAdmissions, isGlobalAdmin, collegeFilter.college]);

  // Overall statistics
  const stats = useMemo(() => {
    const total = admissions.length;
    let paidCount = 0;
    let pendingCount = 0;
    let totalRevenue = 0;
    let collectedAmount = 0;
    let balanceDue = 0;

    let activeMessCount = 0;
    let vegCount = 0;
    let nonVegCount = 0;

    let activeLaundryCount = 0;

    let bagsDelivered = 0;
    let tiffinsDelivered = 0;
    let mattressesRequired = 0;

    for (const a of admissions) {
      if (a.paymentStatus === "completed") paidCount++;
      else pendingCount++;

      totalRevenue += a.packageAmount || 0;
      collectedAmount += a.amountPaid || 0;
      balanceDue += Math.max(0, a.balanceAmount || 0);

      if (a.messId || a.messName) {
        if (a.tiffinStatus === "active") activeMessCount++;
        const pref = (a.mealPreference || "").toLowerCase();
        if (pref.includes("non")) nonVegCount++;
        else if (pref.includes("veg")) vegCount++;
      }

      if ((a.laundryId || a.laundryName) && a.laundryStatus === "active") {
        activeLaundryCount++;
      }

      if (a.bagProvided) bagsDelivered++;
      if (a.tiffinProvided) tiffinsDelivered++;
      if (a.mattressRequired) mattressesRequired++;
    }

    const collectionPercentage = totalRevenue > 0 ? Math.round((collectedAmount / totalRevenue) * 100) : 0;

    return {
      total,
      paidCount,
      pendingCount,
      totalRevenue,
      collectedAmount,
      balanceDue,
      collectionPercentage,
      activeMessCount,
      vegCount,
      nonVegCount,
      activeLaundryCount,
      bagsDelivered,
      tiffinsDelivered,
      mattressesRequired,
    };
  }, [admissions]);

  // Filtered admissions for general drill-down
  const filteredStudents = useMemo(() => {
    return admissions.filter((a) => {
      // Search text
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = a.fullName?.toLowerCase().includes(q);
        const matchesId = a.admissionId?.toLowerCase().includes(q);
        const matchesPhone = a.phoneNumber?.includes(q) || a.parentPhone?.includes(q);
        const matchesEmail = a.email?.toLowerCase().includes(q);
        const matchesRoom = a.roomNumber?.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesPhone && !matchesEmail && !matchesRoom) return false;
      }

      // Property
      if (selectedProperty !== "all" && a.propertyId !== selectedProperty) {
        return false;
      }

      // Payment Status
      if (selectedPaymentStatus !== "all" && a.paymentStatus !== selectedPaymentStatus) {
        return false;
      }

      // Mess
      if (selectedMess !== "all" && a.messId !== selectedMess) {
        return false;
      }

      // Laundry
      if (selectedLaundry !== "all" && a.laundryId !== selectedLaundry) {
        return false;
      }

      // Tiffin Status
      if (selectedTiffinStatus !== "all" && a.tiffinStatus !== selectedTiffinStatus) {
        return false;
      }

      return true;
    });
  }, [admissions, search, selectedProperty, selectedPaymentStatus, selectedMess, selectedLaundry, selectedTiffinStatus]);

  /* -------------------------- CSV EXPORT HANDLERS ------------------------- */

  // 1. Master Export (All data combined)
  const exportMasterCsv = () => {
    const headers = [
      "Sr No",
      "Admission ID",
      "Full Name",
      "Student Mobile",
      "Parent Mobile",
      "Parent Name",
      "Relation",
      "Email",
      "Gender",
      "Date of Birth",
      "College Name",
      "Course",
      "Year",
      "Property / PG",
      "Room Number",
      "Bed Number",
      "Admission Date",
      "Move In Date",
      "Package Name",
      ...(isGlobalAdmin
        ? ["Package Fee (INR)", "Amount Paid (INR)", "Balance Due (INR)"]
        : []),
      "Payment Status",
      "Payment Mode",
      "Mess Provider",
      "Tiffin Status",
      "Meal Preference",
      "Laundry Provider",
      "Laundry Status",
      "Bag Provided",
      "Tiffin Box Provided",
      "Mattress Required",
    ];

    const rows = admissions.map((a, i) => [
      i + 1,
      a.admissionId || a.id,
      a.fullName || "",
      a.phoneNumber || "",
      a.parentPhone || "",
      a.parentName || "",
      a.parentRelation || "",
      a.email || "",
      a.gender || "",
      a.dateOfBirth ? formatDate(a.dateOfBirth) : "",
      a.collegeName || "",
      a.course || "",
      a.year || "",
      a.propertyName || "",
      a.roomNumber || "",
      a.bedNumber || "",
      a.admissionDate ? formatDate(a.admissionDate) : "",
      a.moveInDate ? formatDate(a.moveInDate) : "",
      a.packageName || "",
      ...(isGlobalAdmin
        ? [a.packageAmount || 0, a.amountPaid || 0, a.balanceAmount || 0]
        : []),
      a.paymentStatus || "pending",
      a.paymentMode || "",
      a.messName || "Unassigned",
      a.tiffinStatus || "none",
      a.mealPreference || "",
      a.laundryName || "Unassigned",
      a.laundryStatus || "none",
      a.bagProvided ? "Yes" : "No",
      a.tiffinProvided ? "Yes" : "No",
      a.mattressRequired ? "Yes" : "No",
    ]);

    downloadCsv(`nivasispace_master_report_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  // 2. Mess & Tiffin CSV
  const exportMessCsv = () => {
    const headers = [
      "Sr No",
      "Admission ID",
      "Student Name",
      "Student Phone",
      "Property",
      "Room",
      "Mess Provider",
      "Tiffin Status",
      "Meal Preference",
      "Tiffin Box Provided",
      "Admission Date",
    ];

    const rows = admissions
      .filter((a) => a.messId || a.messName)
      .map((a, i) => [
        i + 1,
        a.admissionId,
        a.fullName,
        a.phoneNumber,
        a.propertyName || "",
        a.roomNumber || "",
        a.messName || "",
        a.tiffinStatus || "none",
        a.mealPreference || "Veg",
        a.tiffinProvided ? "Yes" : "No",
        a.admissionDate ? formatDate(a.admissionDate) : "",
      ]);

    downloadCsv(`nivasispace_mess_report_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  // 3. Laundry CSV
  const exportLaundryCsv = () => {
    const headers = [
      "Sr No",
      "Admission ID",
      "Student Name",
      "Student Phone",
      "Property",
      "Room",
      "Laundry Provider",
      "Subscription Status",
      "Package Allotted",
      "Laundry Bag Provided",
      "Admission Date",
    ];

    const rows = admissions
      .filter((a) => a.laundryId || a.laundryName)
      .map((a, i) => [
        i + 1,
        a.admissionId,
        a.fullName,
        a.phoneNumber,
        a.propertyName || "",
        a.roomNumber || "",
        a.laundryName || "",
        a.laundryStatus || "none",
        a.packageName || "",
        a.bagProvided ? "Yes" : "No",
        a.admissionDate ? formatDate(a.admissionDate) : "",
      ]);

    downloadCsv(`nivasispace_laundry_report_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  // 4. Financial & Fee Dues CSV
  const exportFinancialCsv = () => {
    const headers = [
      "Sr No",
      "Admission ID",
      "Student Name",
      "Student Phone",
      "Parent Phone",
      "Property / PG",
      "Room",
      "Package Name",
      "Total Package (INR)",
      "Amount Paid (INR)",
      "Balance Due (INR)",
      "Payment Status",
      "Payment Mode",
    ];

    const rows = admissions.map((a, i) => [
      i + 1,
      a.admissionId,
      a.fullName,
      a.phoneNumber,
      a.parentPhone,
      a.propertyName || "",
      a.roomNumber || "",
      a.packageName || "",
      a.packageAmount || 0,
      a.amountPaid || 0,
      a.balanceAmount || 0,
      a.paymentStatus || "pending",
      a.paymentMode || "",
    ]);

    downloadCsv(`nivasispace_financial_report_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  const isLoading = admissionsLoading || messesLoading || laundriesLoading || propertiesLoading;

  if (isLoading) {
    return (
      <AdminShell title="Reports & Analytics" subtitle="Loading system reports...">
        <div className="space-y-4 p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <Skeleton key={n} className="h-28 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Reports & Analytics"
      subtitle={`Complete system data across ${stats.total} student admissions, mess, laundry, and financial operations.`}
      action={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="hidden sm:inline-flex items-center gap-1.5"
          >
            <Printer className="size-4" />
            Print
          </Button>
          <Button
            onClick={exportMasterCsv}
            size="sm"
            className="gradient-brand text-primary-foreground shadow-soft inline-flex items-center gap-1.5"
          >
            <Download className="size-4" />
            Export All Data (CSV)
          </Button>
        </div>
      }
    >
      <div className="space-y-6 pb-12">
        {/* Top KPI Summary Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: Total Students */}
          <Card className="border border-border/80 bg-card/60 backdrop-blur-sm shadow-soft">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
              <span className="text-xs font-medium text-muted-foreground">Total Enrolled</span>
              <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Users className="size-4" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                <span className="text-emerald-600 font-semibold">{stats.paidCount} paid</span> • {stats.pendingCount} pending fee
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Financials (Global Admin only) */}
          {isGlobalAdmin ? (
            <Card className="border border-border/80 bg-card/60 backdrop-blur-sm shadow-soft">
              <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                <span className="text-xs font-medium text-muted-foreground">Total Collected</span>
                <div className="size-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <IndianRupee className="size-4" />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold text-emerald-600">{formatINR(stats.collectedAmount)}</div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1">
                  <span>Due: {formatINR(stats.balanceDue)}</span>
                  <span className="font-semibold text-foreground">{stats.collectionPercentage}%</span>
                </div>
                <Progress value={stats.collectionPercentage} className="h-1 mt-1 bg-muted" />
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-border/80 bg-card/60 backdrop-blur-sm shadow-soft">
              <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                <span className="text-xs font-medium text-muted-foreground">Fee Status</span>
                <div className="size-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="size-4" />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold text-emerald-600">{stats.paidCount} Paid</div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {stats.pendingCount} students have pending fees
                </p>
              </CardContent>
            </Card>
          )}

          {/* Card 3: Mess & Tiffin */}
          <Card className="border border-border/80 bg-card/60 backdrop-blur-sm shadow-soft">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
              <span className="text-xs font-medium text-muted-foreground">Mess & Tiffins</span>
              <div className="size-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
                <UtensilsCrossed className="size-4" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold text-amber-600">{stats.activeMessCount}</div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Active tiffins ({stats.vegCount} Veg, {stats.nonVegCount} Non-Veg)
              </p>
            </CardContent>
          </Card>

          {/* Card 4: Laundry */}
          <Card className="border border-border/80 bg-card/60 backdrop-blur-sm shadow-soft">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
              <span className="text-xs font-medium text-muted-foreground">Active Laundry</span>
              <div className="size-7 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-600">
                <WashingMachine className="size-4" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold text-sky-600">{stats.activeLaundryCount}</div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Active student laundry subscriptions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Filter Bar */}
        <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-soft space-y-3">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by student name, ID, phone, email, or room..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 rounded-xl"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Property filter */}
              <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                <SelectTrigger className="w-[160px] h-10 rounded-xl text-xs">
                  <Building2 className="size-3.5 mr-1.5 text-muted-foreground" />
                  <SelectValue placeholder="Property" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  {properties.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.propertyName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Payment filter */}
              <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
                <SelectTrigger className="w-[140px] h-10 rounded-xl text-xs">
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="completed">Paid in Full</SelectItem>
                  <SelectItem value="pending">Pending Dues</SelectItem>
                </SelectContent>
              </Select>

              {/* Reset filter button */}
              {(search || selectedProperty !== "all" || selectedPaymentStatus !== "all" || selectedMess !== "all" || selectedLaundry !== "all" || selectedTiffinStatus !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearch("");
                    setSelectedProperty("all");
                    setSelectedPaymentStatus("all");
                    setSelectedMess("all");
                    setSelectedLaundry("all");
                    setSelectedTiffinStatus("all");
                  }}
                  className="h-10 text-xs px-2.5 text-muted-foreground hover:text-foreground"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Report Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 overflow-x-auto pb-1">
            <TabsList className="bg-muted/70 p-1 rounded-xl h-auto flex flex-wrap">
              <TabsTrigger value="all-students" className="rounded-lg text-xs gap-1.5 py-1.5 px-3 data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Users className="size-3.5" />
                Students & Admissions ({filteredStudents.length})
              </TabsTrigger>
              <TabsTrigger value="mess-report" className="rounded-lg text-xs gap-1.5 py-1.5 px-3 data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <UtensilsCrossed className="size-3.5" />
                Mess & Tiffins
              </TabsTrigger>
              <TabsTrigger value="laundry-report" className="rounded-lg text-xs gap-1.5 py-1.5 px-3 data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <WashingMachine className="size-3.5" />
                Laundry Operations
              </TabsTrigger>
              {isGlobalAdmin && (
                <TabsTrigger value="financial-report" className="rounded-lg text-xs gap-1.5 py-1.5 px-3 data-[state=active]:bg-card data-[state=active]:shadow-sm">
                  <IndianRupee className="size-3.5" />
                  Fee & Dues Collection
                </TabsTrigger>
              )}
              <TabsTrigger value="property-report" className="rounded-lg text-xs gap-1.5 py-1.5 px-3 data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Building2 className="size-3.5" />
                Property Occupancy
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: ALL STUDENTS & ADMISSIONS */}
          <TabsContent value="all-students" className="space-y-4 m-0">
            <Card className="border border-border/80 shadow-soft">
              <CardHeader className="p-4 border-b border-border/60 flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-base font-semibold">Student Admissions Directory</CardTitle>
                  <CardDescription className="text-xs">
                    Showing {filteredStudents.length} of {admissions.length} registered students
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={exportMasterCsv} className="gap-1.5 text-xs h-8">
                  <Download className="size-3.5" />
                  Download CSV
                </Button>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 text-muted-foreground border-b border-border/60">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Student / ID</th>
                      <th className="py-2.5 px-3 font-semibold">Contact Info</th>
                      <th className="py-2.5 px-3 font-semibold">Stay / Property</th>
                      <th className="py-2.5 px-3 font-semibold">College & Course</th>
                      <th className="py-2.5 px-3 font-semibold">{isGlobalAdmin ? "Package & Fee" : "Package & Status"}</th>
                      <th className="py-2.5 px-3 font-semibold">Mess Status</th>
                      <th className="py-2.5 px-3 font-semibold">Laundry Status</th>
                      <th className="py-2.5 px-3 font-semibold">Items Given</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-muted-foreground">
                          No students matched your search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((a) => (
                        <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-2.5 px-4">
                            <Link
                              to="/admin/admissions/$admissionId"
                              params={{ admissionId: a.id }}
                              className="font-medium text-foreground hover:text-primary transition-colors block"
                            >
                              {a.fullName}
                            </Link>
                            <span className="text-[10px] text-muted-foreground font-mono">{a.admissionId}</span>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-1 text-foreground">
                              <Phone className="size-3 text-muted-foreground" />
                              <span>{a.phoneNumber || "—"}</span>
                            </div>
                            <span className="text-[10px] text-muted-foreground truncate block max-w-[130px]">
                              {a.email || "No email"}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-medium text-foreground block truncate max-w-[120px]">
                              {a.propertyName || "—"}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              Room: {a.roomNumber || "—"} {a.bedNumber ? `• Bed ${a.bedNumber}` : ""}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 max-w-[150px]">
                            <span className="truncate block font-medium text-foreground">{a.collegeName || "—"}</span>
                            <span className="text-[10px] text-muted-foreground truncate block">{a.course || "—"}</span>
                          </td>
                          <td className="py-2.5 px-3">
                            {isGlobalAdmin ? (
                              <>
                                <div className="font-semibold text-foreground">{formatINR(a.packageAmount || 0)}</div>
                                {a.paymentStatus === "completed" ? (
                                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] py-0 h-4">
                                    Paid
                                  </Badge>
                                ) : (
                                  <span className="text-[10px] text-rose-600 font-medium">
                                    Due: {formatINR(a.balanceAmount || 0)}
                                  </span>
                                )}
                              </>
                            ) : (
                              <>
                                <div className="font-medium text-foreground">{a.packageName || "Standard"}</div>
                                {a.paymentStatus === "completed" ? (
                                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] py-0 h-4">
                                    Paid
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] py-0 h-4">
                                    Pending
                                  </Badge>
                                )}
                              </>
                            )}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-medium block truncate max-w-[100px]">{a.messName || "Unassigned"}</span>
                            <span className="text-[10px] text-muted-foreground">
                              {a.tiffinStatus === "active" ? (
                                <span className="text-emerald-600 font-medium">Tiffin Active ({a.mealPreference || "Veg"})</span>
                              ) : (
                                "Inactive"
                              )}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-medium block truncate max-w-[100px]">{a.laundryName || "Unassigned"}</span>
                            <span className="text-[10px] text-muted-foreground">
                              {a.laundryStatus === "active" ? (
                                <span className="text-sky-600 font-medium">Active</span>
                              ) : (
                                "Inactive"
                              )}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex gap-1">
                              <span
                                title="Laundry Bag"
                                className={`size-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                                  a.bagProvided ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
                                }`}
                              >
                                B
                              </span>
                              <span
                                title="Tiffin Box"
                                className={`size-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                                  a.tiffinProvided ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
                                }`}
                              >
                                T
                              </span>
                              <span
                                title="Mattress"
                                className={`size-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                                  a.mattressRequired ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"
                                }`}
                              >
                                M
                              </span>
                            </div>
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <Link
                              to="/admin/admissions/$admissionId"
                              params={{ admissionId: a.id }}
                              className="text-xs font-medium text-primary hover:underline"
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* TAB 2: MESS & TIFFIN OPERATIONS */}
          <TabsContent value="mess-report" className="space-y-4 m-0">
            {/* Mess Providers Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {messes.map((m) => {
                const assigned = admissions.filter((a) => a.messId === m.id || a.messName?.toLowerCase() === m.messName?.toLowerCase());
                const activeTiffins = assigned.filter((a) => a.tiffinStatus === "active").length;
                const veg = assigned.filter((a) => (a.mealPreference || "").toLowerCase() === "veg").length;
                const nonVeg = assigned.filter((a) => (a.mealPreference || "").toLowerCase().includes("non")).length;

                return (
                  <Card key={m.id} className="border border-border/80 shadow-soft">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold">{m.messName}</CardTitle>
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          {activeTiffins} Active Tiffins
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">
                        Owner: {m.ownerName || "—"} • {m.ownerPhone || "—"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="grid grid-cols-3 gap-2 text-center bg-muted/40 p-2.5 rounded-xl text-xs">
                        <div>
                          <p className="text-muted-foreground text-[10px]">Total Enrolled</p>
                          <p className="font-bold text-foreground text-sm">{assigned.length}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-[10px]">Pure Veg</p>
                          <p className="font-bold text-emerald-600 text-sm">{veg}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-[10px]">Non-Veg</p>
                          <p className="font-bold text-amber-600 text-sm">{nonVeg}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Students Mess Allocation Table */}
            <Card className="border border-border/80 shadow-soft">
              <CardHeader className="p-4 border-b border-border/60 flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-base font-semibold">Mess & Tiffin Subscriber Register</CardTitle>
                  <CardDescription className="text-xs">
                    List of students assigned to messes with current delivery and meal choices
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={exportMessCsv} className="gap-1.5 text-xs h-8">
                  <Download className="size-3.5" />
                  Export Mess CSV
                </Button>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 text-muted-foreground border-b border-border/60">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Student Name</th>
                      <th className="py-2.5 px-3 font-semibold">Admission ID</th>
                      <th className="py-2.5 px-3 font-semibold">Phone</th>
                      <th className="py-2.5 px-3 font-semibold">Property & Room</th>
                      <th className="py-2.5 px-3 font-semibold">Assigned Mess</th>
                      <th className="py-2.5 px-3 font-semibold">Tiffin Status</th>
                      <th className="py-2.5 px-3 font-semibold">Meal Preference</th>
                      <th className="py-2.5 px-4 font-semibold">Tiffin Box</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {admissions
                      .filter((a) => (selectedMess === "all" ? true : a.messId === selectedMess))
                      .map((a) => (
                        <tr key={a.id} className="hover:bg-muted/30">
                          <td className="py-2.5 px-4 font-medium text-foreground">{a.fullName}</td>
                          <td className="py-2.5 px-3 font-mono text-muted-foreground">{a.admissionId}</td>
                          <td className="py-2.5 px-3">{a.phoneNumber || "—"}</td>
                          <td className="py-2.5 px-3">
                            {a.propertyName || "—"} {a.roomNumber ? `(Rm ${a.roomNumber})` : ""}
                          </td>
                          <td className="py-2.5 px-3 font-medium">{a.messName || "—"}</td>
                          <td className="py-2.5 px-3">
                            {a.tiffinStatus === "active" ? (
                              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-muted text-muted-foreground text-[10px]">
                                {a.tiffinStatus || "None"}
                              </Badge>
                            )}
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                                (a.mealPreference || "").toLowerCase().includes("non")
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-emerald-100 text-emerald-800"
                              }`}
                            >
                              {a.mealPreference || "Veg"}
                            </span>
                          </td>
                          <td className="py-2.5 px-4">
                            {a.tiffinProvided ? (
                              <span className="text-emerald-600 font-medium">Provided</span>
                            ) : (
                              <span className="text-amber-600">Pending</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* TAB 3: LAUNDRY SERVICE OPERATIONS */}
          <TabsContent value="laundry-report" className="space-y-4 m-0">
            {/* Laundry Vendors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {laundries.map((l) => {
                const assigned = admissions.filter((a) => a.laundryId === l.id || a.laundryName?.toLowerCase() === l.laundryName?.toLowerCase());
                const active = assigned.filter((a) => a.laundryStatus === "active").length;

                return (
                  <Card key={l.id} className="border border-border/80 shadow-soft">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold">{l.laundryName}</CardTitle>
                        <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200">
                          {active} Active Subscriptions
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">
                        Owner: {l.ownerName || "—"} • {l.ownerPhone || "—"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="grid grid-cols-2 gap-2 text-center bg-muted/40 p-2.5 rounded-xl text-xs">
                        <div>
                          <p className="text-muted-foreground text-[10px]">Total Assigned</p>
                          <p className="font-bold text-foreground text-sm">{assigned.length}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-[10px]">Active Status</p>
                          <p className="font-bold text-sky-600 text-sm">{active}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Students Laundry Register Table */}
            <Card className="border border-border/80 shadow-soft">
              <CardHeader className="p-4 border-b border-border/60 flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-base font-semibold">Student Laundry Allocation Register</CardTitle>
                  <CardDescription className="text-xs">
                    Assigned students, active subscription status, and laundry bag handovers
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={exportLaundryCsv} className="gap-1.5 text-xs h-8">
                  <Download className="size-3.5" />
                  Export Laundry CSV
                </Button>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 text-muted-foreground border-b border-border/60">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Student Name</th>
                      <th className="py-2.5 px-3 font-semibold">Admission ID</th>
                      <th className="py-2.5 px-3 font-semibold">Phone</th>
                      <th className="py-2.5 px-3 font-semibold">Property & Room</th>
                      <th className="py-2.5 px-3 font-semibold">Laundry Vendor</th>
                      <th className="py-2.5 px-3 font-semibold">Subscription Status</th>
                      <th className="py-2.5 px-3 font-semibold">Package Allotted</th>
                      <th className="py-2.5 px-4 font-semibold">Laundry Bag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {admissions.map((a) => (
                      <tr key={a.id} className="hover:bg-muted/30">
                        <td className="py-2.5 px-4 font-medium text-foreground">{a.fullName}</td>
                        <td className="py-2.5 px-3 font-mono text-muted-foreground">{a.admissionId}</td>
                        <td className="py-2.5 px-3">{a.phoneNumber || "—"}</td>
                        <td className="py-2.5 px-3">
                          {a.propertyName || "—"} {a.roomNumber ? `(Rm ${a.roomNumber})` : ""}
                        </td>
                        <td className="py-2.5 px-3 font-medium">{a.laundryName || "—"}</td>
                        <td className="py-2.5 px-3">
                          {a.laundryStatus === "active" ? (
                            <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200 text-[10px]">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-muted text-muted-foreground text-[10px]">
                              {a.laundryStatus || "None"}
                            </Badge>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground">{a.packageName || "Standard"}</td>
                        <td className="py-2.5 px-4">
                          {a.bagProvided ? (
                            <span className="text-emerald-600 font-medium">Provided</span>
                          ) : (
                            <span className="text-amber-600">Pending</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* TAB 4: FINANCIAL & DUES REPORT (Global Admin Only) */}
          {isGlobalAdmin && (
            <TabsContent value="financial-report" className="space-y-4 m-0">
            {/* Property-wise Revenue Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {properties.map((p) => {
                const residents = admissions.filter((a) => a.propertyId === p.id);
                const propertyTotal = residents.reduce((sum, r) => sum + (r.packageAmount || 0), 0);
                const propertyPaid = residents.reduce((sum, r) => sum + (r.amountPaid || 0), 0);
                const propertyDue = residents.reduce((sum, r) => sum + Math.max(0, r.balanceAmount || 0), 0);
                const rate = propertyTotal > 0 ? Math.round((propertyPaid / propertyTotal) * 100) : 0;

                return (
                  <Card key={p.id} className="border border-border/80 shadow-soft">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold">{p.propertyName}</CardTitle>
                        <span className="text-xs font-semibold text-foreground">{rate}% Collected</span>
                      </div>
                      <CardDescription className="text-xs">{residents.length} Enrolled Students</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Collected:</span>
                        <span className="font-semibold text-emerald-600">{formatINR(propertyPaid)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Outstanding Dues:</span>
                        <span className="font-semibold text-rose-600">{formatINR(propertyDue)}</span>
                      </div>
                      <Progress value={rate} className="h-1.5 bg-muted" />
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Outstanding Balances Table */}
            <Card className="border border-border/80 shadow-soft">
              <CardHeader className="p-4 border-b border-border/60 flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-base font-semibold">Outstanding Dues & Follow-up List</CardTitle>
                  <CardDescription className="text-xs">
                    Students with balance payments pending, sorted by balance amount
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={exportFinancialCsv} className="gap-1.5 text-xs h-8">
                  <Download className="size-3.5" />
                  Export Dues CSV
                </Button>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 text-muted-foreground border-b border-border/60">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Student Name</th>
                      <th className="py-2.5 px-3 font-semibold">Admission ID</th>
                      <th className="py-2.5 px-3 font-semibold">Student Contact</th>
                      <th className="py-2.5 px-3 font-semibold">Parent Contact</th>
                      <th className="py-2.5 px-3 font-semibold">Property & Room</th>
                      <th className="py-2.5 px-3 font-semibold">Total Fee</th>
                      <th className="py-2.5 px-3 font-semibold">Amount Paid</th>
                      <th className="py-2.5 px-3 font-semibold">Balance Due</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Quick Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {admissions
                      .filter((a) => (a.balanceAmount || 0) > 0)
                      .sort((a, b) => (b.balanceAmount || 0) - (a.balanceAmount || 0))
                      .map((a) => (
                        <tr key={a.id} className="hover:bg-muted/30">
                          <td className="py-2.5 px-4 font-medium text-foreground">{a.fullName}</td>
                          <td className="py-2.5 px-3 font-mono text-muted-foreground">{a.admissionId}</td>
                          <td className="py-2.5 px-3">{a.phoneNumber || "—"}</td>
                          <td className="py-2.5 px-3 font-medium text-foreground">
                            {a.parentPhone ? `${a.parentPhone} (${a.parentRelation || "Parent"})` : "—"}
                          </td>
                          <td className="py-2.5 px-3">
                            {a.propertyName || "—"} {a.roomNumber ? `• Rm ${a.roomNumber}` : ""}
                          </td>
                          <td className="py-2.5 px-3">{formatINR(a.packageAmount || 0)}</td>
                          <td className="py-2.5 px-3 text-emerald-600 font-medium">{formatINR(a.amountPaid || 0)}</td>
                          <td className="py-2.5 px-3 text-rose-600 font-bold">{formatINR(a.balanceAmount || 0)}</td>
                          <td className="py-2.5 px-4 text-right">
                            {a.phoneNumber && (
                              <a
                                href={`tel:${a.phoneNumber}`}
                                className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-medium"
                              >
                                <Phone className="size-3" /> Call
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
          )}

          {/* TAB 5: PROPERTY & ROOM OCCUPANCY */}
          <TabsContent value="property-report" className="space-y-4 m-0">
            <Card className="border border-border/80 shadow-soft">
              <CardHeader className="p-4 border-b border-border/60">
                <CardTitle className="text-base font-semibold">Property Bed Allocation & Residency Roster</CardTitle>
                <CardDescription className="text-xs">
                  Active room and bed assignments for all residents across properties
                </CardDescription>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 text-muted-foreground border-b border-border/60">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Student Resident</th>
                      <th className="py-2.5 px-3 font-semibold">Admission ID</th>
                      <th className="py-2.5 px-3 font-semibold">Property / PG</th>
                      <th className="py-2.5 px-3 font-semibold">Room Number</th>
                      <th className="py-2.5 px-3 font-semibold">Bed Number</th>
                      <th className="py-2.5 px-3 font-semibold">Admission Date</th>
                      <th className="py-2.5 px-3 font-semibold">Move In Date</th>
                      <th className="py-2.5 px-4 font-semibold">Mattress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {admissions.map((a) => (
                      <tr key={a.id} className="hover:bg-muted/30">
                        <td className="py-2.5 px-4 font-medium text-foreground">{a.fullName}</td>
                        <td className="py-2.5 px-3 font-mono text-muted-foreground">{a.admissionId}</td>
                        <td className="py-2.5 px-3 font-medium">{a.propertyName || "—"}</td>
                        <td className="py-2.5 px-3 font-semibold">{a.roomNumber || "—"}</td>
                        <td className="py-2.5 px-3">{a.bedNumber || "—"}</td>
                        <td className="py-2.5 px-3 text-muted-foreground">
                          {a.admissionDate ? formatDate(a.admissionDate) : "—"}
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground">
                          {a.moveInDate ? formatDate(a.moveInDate) : "—"}
                        </td>
                        <td className="py-2.5 px-4">
                          {a.mattressRequired ? (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px]">
                              Required
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">Not needed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminShell>
  );
}
