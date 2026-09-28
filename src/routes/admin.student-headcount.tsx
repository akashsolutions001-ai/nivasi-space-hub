import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  UtensilsCrossed,
  Search,
  Calendar,
  CalendarOff,
  UserCheck,
  UserX,
  Users,
  Building2,
  Copy,
  Download,
  Printer,
  Phone,
  Home,
  Check,
  ArrowRight,
  Info,
  Clock,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { AdminShell } from "@/components/nivasi/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdmissions, useMesses, useProperties, useAllLeaveRequests } from "@/lib/hooks";
import { todayISTDateString } from "@/lib/db";
import { formatDate } from "@/lib/format";
import type { Admission, LeaveRequest } from "@/lib/types";

export const Route = createFileRoute("/admin/student-headcount")({
  head: () => ({
    meta: [
      { title: "Mess Headcount & Attendance — NivasiSpace Admin" },
      {
        name: "description",
        content: "Live student attendance, approved leave exclusions, and Veg vs Non-Veg kitchen headcounts.",
      },
    ],
  }),
  component: StudentHeadcountPage,
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
/*                              LEAVE HELPER                                  */
/* -------------------------------------------------------------------------- */

function getActiveLeaveForDate(
  studentId: string,
  date: string,
  leaves: LeaveRequest[],
): LeaveRequest | undefined {
  return leaves.find((l) => {
    if (l.studentId !== studentId) return false;
    if (l.status !== "approved") return false;
    if (!l.fromDate || l.fromDate > date) return false;
    // If toDate is specified, check date <= toDate. If open return, still away!
    if (l.toDate && l.toDate < date) return false;
    return true;
  });
}

function StudentHeadcountPage() {
  const { data: rawAdmissions = [], isLoading: admLoading } = useAdmissions();
  const { data: messes = [], isLoading: messLoading } = useMesses();
  const { data: properties = [] } = useProperties();
  const { data: leaves = [], isLoading: leavesLoading } = useAllLeaveRequests();

  // Filters
  const [selectedDate, setSelectedDate] = useState<string>(todayISTDateString());
  const [selectedMess, setSelectedMess] = useState<string>("all");
  const [selectedProperty, setSelectedProperty] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"present" | "on-leave" | "all">("present");

  // Only consider students with active mess subscriptions or mess assigned
  const messStudents = useMemo(() => {
    return rawAdmissions.filter((a) => {
      const hasMess = a.messId || a.messName;
      const isSubscribed = a.tiffinStatus === "active" || a.packageServices?.some((s) => s.toLowerCase().includes("mess"));
      return hasMess && isSubscribed;
    });
  }, [rawAdmissions]);

  // Compute student attendance status on selectedDate
  const evaluatedStudents = useMemo(() => {
    return messStudents.map((student) => {
      const activeLeave = getActiveLeaveForDate(student.id, selectedDate, leaves);
      const isPresent = !activeLeave;
      const pref = (student.mealPreference || "veg").toLowerCase().includes("non") ? "non-veg" : "veg";

      return {
        ...student,
        isPresent,
        activeLeave,
        resolvedPref: pref as "veg" | "non-veg",
      };
    });
  }, [messStudents, selectedDate, leaves]);

  // Filter by mess, property, search
  const filteredStudents = useMemo(() => {
    return evaluatedStudents.filter((s) => {
      if (selectedMess !== "all" && s.messId !== selectedMess) return false;
      if (selectedProperty !== "all" && s.propertyId !== selectedProperty) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = s.fullName?.toLowerCase().includes(q);
        const matchesAdm = s.admissionId?.toLowerCase().includes(q);
        const matchesRoom = s.roomNumber?.toLowerCase().includes(q);
        const matchesProp = s.propertyName?.toLowerCase().includes(q);
        const matchesMess = s.messName?.toLowerCase().includes(q);
        if (!matchesName && !matchesAdm && !matchesRoom && !matchesProp && !matchesMess) return false;
      }

      return true;
    });
  }, [evaluatedStudents, selectedMess, selectedProperty, search]);

  // Separate Present vs On Leave
  const presentStudents = useMemo(() => filteredStudents.filter((s) => s.isPresent), [filteredStudents]);
  const onLeaveStudents = useMemo(() => filteredStudents.filter((s) => !s.isPresent), [filteredStudents]);

  // Headcounts
  const totalEnrolled = filteredStudents.length;
  const totalPresent = presentStudents.length;
  const totalOnLeave = onLeaveStudents.length;
  const vegCount = presentStudents.filter((s) => s.resolvedPref === "veg").length;
  const nonVegCount = presentStudents.filter((s) => s.resolvedPref === "non-veg").length;

  // Copy kitchen summary for WhatsApp
  const handleCopyKitchenSummary = (messName?: string) => {
    let summaryText = "";
    const dateFormatted = formatDate(selectedDate);

    if (messName) {
      const messObj = messes.find((m) => m.messName === messName || m.id === messName);
      const mStudents = evaluatedStudents.filter((s) => (messObj ? s.messId === messObj.id : true));
      const mPresent = mStudents.filter((s) => s.isPresent);
      const mLeave = mStudents.filter((s) => !s.isPresent);
      const mVeg = mPresent.filter((s) => s.resolvedPref === "veg").length;
      const mNonVeg = mPresent.filter((s) => s.resolvedPref === "non-veg").length;

      summaryText = `📋 *NIVASISPACE MESS MEAL COUNT*\n📅 *Date:* ${dateFormatted}\n🍽️ *Mess:* ${messObj?.messName || messName}\n-----------------------------------\n🟢 *Veg Meals to Cook:* ${mVeg}\n🍗 *Non-Veg Meals to Cook:* ${mNonVeg}\n👥 *Total Present:* ${mPresent.length}\n✈️ *Students on Leave:* ${mLeave.length}\n📊 *Total Enrolled:* ${mStudents.length}`;
    } else {
      summaryText = `📋 *NIVASISPACE ALL MESSES MEAL COUNT*\n📅 *Date:* ${dateFormatted}\n-----------------------------------\n🟢 *Total Veg Meals:* ${vegCount}\n🍗 *Total Non-Veg Meals:* ${nonVegCount}\n👥 *Total Students Present:* ${totalPresent}\n✈️ *Total On Leave (Skip Meals):* ${totalOnLeave}\n📊 *Total Active Mess Subscriptions:* ${totalEnrolled}`;
    }

    navigator.clipboard.writeText(summaryText);
    toast.success("Kitchen meal summary copied to clipboard! Ready to paste into WhatsApp.");
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = [
      "Sr No",
      "Admission ID",
      "Student Name",
      "Phone",
      "Property",
      "Room",
      "Assigned Mess",
      "Attendance Status",
      "Meal Preference",
      "Leave Start Date",
      "Leave Return Date",
      "Leave Reason",
    ];

    const rows = filteredStudents.map((s, idx) => [
      idx + 1,
      s.admissionId,
      s.fullName,
      s.phoneNumber || "",
      s.propertyName || "",
      s.roomNumber || "",
      s.messName || "",
      s.isPresent ? "Present (Eating in Mess)" : "On Approved Leave",
      s.resolvedPref === "veg" ? "Pure Veg" : "Non-Veg",
      s.activeLeave?.fromDate ? formatDate(s.activeLeave.fromDate) : "—",
      s.activeLeave?.toDate ? formatDate(s.activeLeave.toDate) : s.activeLeave ? "Open Return (TBD)" : "—",
      s.activeLeave?.reason || "—",
    ]);

    downloadCsv(`nivasispace_mess_headcount_${selectedDate}.csv`, headers, rows);
  };

  return (
    <AdminShell
      title="Mess Headcount & Attendance"
      subtitle="Live student meal count for mess kitchens, excluding students on approved leaves, with pure Veg and Non-Veg breakdowns."
      action={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopyKitchenSummary()}
            className="gap-1.5 text-xs h-8"
          >
            <Copy className="size-3.5" />
            Copy Kitchen Count
          </Button>
          <Button
            size="sm"
            onClick={handleExportCsv}
            className="gradient-brand text-white shadow-soft gap-1.5 text-xs h-8"
          >
            <Download className="size-3.5" />
            Export Headcount CSV
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Date Selector & Primary Filters Bar */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft space-y-3">
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
            {/* Date Input */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap flex items-center gap-1.5">
                <Calendar className="size-4 text-primary" />
                Selected Date:
              </span>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-44 rounded-xl text-xs h-9 font-semibold"
              />
              {selectedDate === todayISTDateString() ? (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                  Today
                </Badge>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDate(todayISTDateString())}
                  className="text-xs h-7 px-2 text-primary"
                >
                  Set to Today
                </Button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Mess Selector */}
              <Select value={selectedMess} onValueChange={setSelectedMess}>
                <SelectTrigger className="w-[180px] rounded-xl text-xs h-9">
                  <UtensilsCrossed className="size-3.5 mr-1.5 text-primary" />
                  <SelectValue placeholder="All Messes" />
                </SelectTrigger>
                <SelectContent className="rounded-xl text-xs">
                  <SelectItem value="all">All Mess Providers</SelectItem>
                  {messes.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.messName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Property Selector */}
              <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                <SelectTrigger className="w-[170px] rounded-xl text-xs h-9">
                  <Building2 className="size-3.5 mr-1.5 text-muted-foreground" />
                  <SelectValue placeholder="All Properties" />
                </SelectTrigger>
                <SelectContent className="rounded-xl text-xs">
                  <SelectItem value="all">All Properties</SelectItem>
                  {properties.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.propertyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Search input */}
              <div className="relative min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search student, room..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 rounded-xl text-xs h-9"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Headcount KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Card 1: Total Meals to Prepare (Present) */}
          <div className="rounded-2xl border-2 border-primary/40 bg-card p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Total Meals to Cook
              </span>
              <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <UtensilsCrossed className="size-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-foreground font-display mt-2">
              {totalPresent}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Present students eating today
            </p>
          </div>

          {/* Card 2: Pure Veg Meals */}
          <div className="rounded-2xl border border-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/20 p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                🟢 Veg Meals
              </span>
              <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 font-display mt-2">
              {vegCount}
            </div>
            <p className="text-[11px] text-emerald-800/80 dark:text-emerald-400/80 mt-0.5">
              Pure Vegetarian portions
            </p>
          </div>

          {/* Card 3: Non-Veg Meals */}
          <div className="rounded-2xl border border-amber-300 bg-amber-50/60 dark:bg-amber-950/20 p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                🍗 Non-Veg Meals
              </span>
              <span className="size-2.5 rounded-full bg-amber-500" />
            </div>
            <div className="text-3xl font-extrabold text-amber-700 dark:text-amber-400 font-display mt-2">
              {nonVegCount}
            </div>
            <p className="text-[11px] text-amber-800/80 dark:text-amber-400/80 mt-0.5">
              Non-Vegetarian portions
            </p>
          </div>

          {/* Card 4: Students On Leave (Deducted) */}
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-destructive">
                ✈️ On Leave (Skipped)
              </span>
              <div className="size-7 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive">
                <CalendarOff className="size-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-destructive font-display mt-2">
              {totalOnLeave}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Meals not needed today
            </p>
          </div>

          {/* Card 5: Total Enrolled */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Total Enrolled
              </span>
              <div className="size-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                <Users className="size-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-foreground font-display mt-2">
              {totalEnrolled}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Active mess subscribers
            </p>
          </div>
        </div>

        {/* Per-Mess Breakdown Cards (when All Messes is selected) */}
        {selectedMess === "all" && messes.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <UtensilsCrossed className="size-4 text-primary" />
                Kitchen Headcount per Mess ({formatDate(selectedDate)})
              </h3>
              <span className="text-xs text-muted-foreground">
                Click copy button on any mess to send meal numbers to the cook
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {messes.map((m) => {
                const mStudents = evaluatedStudents.filter((s) => s.messId === m.id);
                const mPresent = mStudents.filter((s) => s.isPresent);
                const mLeave = mStudents.filter((s) => !s.isPresent);
                const mVeg = mPresent.filter((s) => s.resolvedPref === "veg").length;
                const mNonVeg = mPresent.filter((s) => s.resolvedPref === "non-veg").length;

                return (
                  <Card key={m.id} className="border border-border shadow-soft hover:border-primary/40 transition-colors">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-bold truncate">{m.messName}</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyKitchenSummary(m.messName)}
                          className="h-7 px-2 text-xs gap-1 text-primary hover:bg-primary/10"
                        >
                          <Copy className="size-3" />
                          Copy Count
                        </Button>
                      </div>
                      <CardDescription className="text-xs">
                        Owner: {m.ownerName || "—"} {m.ownerPhone ? `• ${m.ownerPhone}` : ""}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 space-y-3">
                      <div className="grid grid-cols-4 gap-2 text-center bg-muted/40 p-2.5 rounded-xl text-xs">
                        <div>
                          <p className="text-muted-foreground text-[10px]">To Cook</p>
                          <p className="font-extrabold text-foreground text-base">{mPresent.length}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-[10px]">🟢 Veg</p>
                          <p className="font-extrabold text-emerald-600 text-base">{mVeg}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-[10px]">🍗 Non-Veg</p>
                          <p className="font-extrabold text-amber-600 text-base">{mNonVeg}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-[10px]">✈️ Leave</p>
                          <p className="font-extrabold text-destructive text-base">{mLeave.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Student Register Tables */}
        <Card className="border border-border/80 shadow-soft">
          <CardHeader className="p-4 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 space-y-0">
            <div>
              <CardTitle className="text-base font-bold">
                Student Attendance & Mess Roster for {formatDate(selectedDate)}
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Present students are counted for meal preparation. Students on leave are automatically excused and deducted.
              </CardDescription>
            </div>

            {/* Sub-tabs */}
            <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)}>
              <TabsList className="bg-muted p-1 rounded-xl h-auto">
                <TabsTrigger value="present" className="rounded-lg text-xs gap-1.5 py-1 px-3">
                  <UserCheck className="size-3.5 text-emerald-600" />
                  Present ({totalPresent})
                </TabsTrigger>
                <TabsTrigger value="on-leave" className="rounded-lg text-xs gap-1.5 py-1 px-3">
                  <CalendarOff className="size-3.5 text-destructive" />
                  On Leave ({totalOnLeave})
                </TabsTrigger>
                <TabsTrigger value="all" className="rounded-lg text-xs py-1 px-3">
                  All ({filteredStudents.length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 text-muted-foreground border-b border-border/60">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Student / ID</th>
                  <th className="py-2.5 px-3 font-semibold">Property & Room</th>
                  <th className="py-2.5 px-3 font-semibold">Mess Provider</th>
                  <th className="py-2.5 px-3 font-semibold">Meal Preference</th>
                  <th className="py-2.5 px-3 font-semibold">Attendance Status</th>
                  <th className="py-2.5 px-3 font-semibold">Leave Details</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {(activeTab === "present"
                  ? presentStudents
                  : activeTab === "on-leave"
                  ? onLeaveStudents
                  : filteredStudents
                ).length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                      No students found in this category for {formatDate(selectedDate)}.
                    </td>
                  </tr>
                ) : (
                  (activeTab === "present"
                    ? presentStudents
                    : activeTab === "on-leave"
                    ? onLeaveStudents
                    : filteredStudents
                  ).map((s) => (
                    <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 px-4">
                        <span className="font-semibold text-foreground block">{s.fullName}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{s.admissionId}</span>
                      </td>

                      <td className="py-2.5 px-3">
                        <span className="font-medium text-foreground">{s.propertyName || "—"}</span>
                        {s.roomNumber && (
                          <span className="text-[10px] text-muted-foreground block">
                            Room {s.roomNumber}
                          </span>
                        )}
                      </td>

                      <td className="py-2.5 px-3 font-medium text-foreground">
                        {s.messName || "Unassigned"}
                      </td>

                      {/* Meal Preference */}
                      <td className="py-2.5 px-3">
                        {s.resolvedPref === "veg" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            🟢 Pure Veg
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            🍗 Non-Veg
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3">
                        {s.isPresent ? (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] gap-1">
                            <Check className="size-3" />
                            Present (Cooking)
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] gap-1">
                            <CalendarOff className="size-3" />
                            On Leave
                          </Badge>
                        )}
                      </td>

                      {/* Leave details */}
                      <td className="py-2.5 px-3">
                        {s.activeLeave ? (
                          <div className="space-y-0.5">
                            <span className="text-[11px] font-medium text-destructive block">
                              {formatDate(s.activeLeave.fromDate)} →{" "}
                              {s.activeLeave.toDate ? formatDate(s.activeLeave.toDate) : "TBD (Open Return)"}
                            </span>
                            <span className="text-[10px] text-muted-foreground truncate block max-w-[200px]" title={s.activeLeave.reason}>
                              {s.activeLeave.reason}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>

                      <td className="py-2.5 px-4 text-right font-mono text-muted-foreground">
                        {s.phoneNumber || "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
