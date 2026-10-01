import { useState, useMemo, useEffect } from "react";
import {
  Download,
  FileSpreadsheet,
  Calendar,
  Users,
  Loader2,
  UtensilsCrossed,
  Info,
  CheckCircle2,
  Building2,
  BadgePercent,
} from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  exportMessMonthlyAccountingReport,
  computeDailyTiffinRecordsForMonth,
} from "@/lib/mess-export";
import { useMesses, useAllLeaveRequests, useMessDailyRecordsForMonth, useMessBillingSettings } from "@/lib/hooks";
import type { Mess, Admission, LeaveBillingPolicy } from "@/lib/types";

interface MessExportDialogProps {
  open: boolean;
  onClose: () => void;
  mess: Mess | null | "all";
  admissions: Admission[];
  allMesses?: Mess[];
}

const MONTH_OPTIONS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const YEAR_OPTIONS = ["2025", "2026", "2027"];

export function MessExportDialog({
  open,
  onClose,
  mess,
  admissions,
  allMesses: passedMesses,
}: MessExportDialogProps) {
  const { data: fetchedMesses = [] } = useMesses();
  const messesList = passedMesses || fetchedMesses;
  const { data: leaves = [] } = useAllLeaveRequests();
  const { data: billingSettings } = useMessBillingSettings();

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<string>(
    String(currentDate.getMonth() + 1)
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    String(currentDate.getFullYear())
  );
  const [selectedMessId, setSelectedMessId] = useState<string>("all");
  const [leavePolicy, setLeavePolicy] = useState<LeaveBillingPolicy>("no_adjustment");
  const [exporting, setExporting] = useState(false);

  // Sync selected mess from prop
  useEffect(() => {
    if (mess && mess !== "all") {
      setSelectedMessId(mess.id);
    } else {
      setSelectedMessId("all");
    }
  }, [mess, open]);

  // Sync default billing policy if available
  useEffect(() => {
    if (billingSettings?.leaveBillingPolicy) {
      setLeavePolicy(billingSettings.leaveBillingPolicy);
    }
  }, [billingSettings]);

  const monthNum = parseInt(selectedMonth, 10);
  const yearNum = parseInt(selectedYear, 10);

  // Fetch stored daily records for this month
  const { data: storedDailyRecords = [] } = useMessDailyRecordsForMonth(
    selectedMessId,
    yearNum,
    monthNum
  );

  // Target messes to report on
  const activeMesses = useMemo(() => {
    if (selectedMessId === "all") {
      return messesList;
    }
    const found = messesList.find((m) => m.id === selectedMessId);
    return found ? [found] : messesList;
  }, [selectedMessId, messesList]);

  // Compute live breakdown
  const computation = useMemo(() => {
    return computeDailyTiffinRecordsForMonth(
      activeMesses,
      admissions,
      leaves,
      storedDailyRecords,
      yearNum,
      monthNum
    );
  }, [activeMesses, admissions, leaves, storedDailyRecords, yearNum, monthNum]);

  // Summary stats
  const totalAssignedStudents = computation.studentBillingRows.length;
  const totalExpLunch = computation.dailyRows.reduce((acc, r) => acc + r.expectedLunch, 0);
  const totalFinalLunch = computation.dailyRows.reduce((acc, r) => acc + r.finalLunch, 0);
  const totalExpDinner = computation.dailyRows.reduce((acc, r) => acc + r.expectedDinner, 0);
  const totalFinalDinner = computation.dailyRows.reduce((acc, r) => acc + r.finalDinner, 0);
  const totalOperationalTiffins = totalFinalLunch + totalFinalDinner;
  const totalLeaveStudentDays = computation.dailyRows.reduce((acc, r) => acc + r.studentsOnLeave, 0);

  // Billing (₹2,300 package)
  const monthlyRate = 2300;
  const totalMonthlyAmount = totalAssignedStudents * monthlyRate;
  const totalLunchShare = totalAssignedStudents * 1150;
  const totalDinnerShare = totalAssignedStudents * 1150;

  async function handleExport() {
    if (activeMesses.length === 0) {
      toast.warning("No messes available to export.");
      return;
    }

    setExporting(true);
    try {
      const selectedMessObj =
        selectedMessId === "all"
          ? ("all" as const)
          : activeMesses[0] || ("all" as const);

      const { count, fileName } = await exportMessMonthlyAccountingReport({
        mess: selectedMessObj,
        allMesses: activeMesses,
        admissions,
        leaveRequests: leaves,
        dailyRecords: storedDailyRecords,
        month: monthNum,
        year: yearNum,
        leaveBillingPolicy: leavePolicy,
      });

      toast.success(`Successfully exported monthly report: ${fileName} (${count} student billing records)`);
      onClose();
    } catch (err) {
      console.error("[export-mess] error", err);
      toast.error(err instanceof Error ? err.message : "Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !exporting && !v && onClose()}>
      <DialogContent className="max-w-xl max-h-[92vh] overflow-y-auto">
        <DialogHeader className="space-y-1.5 pb-2 border-b border-border">
          <div className="flex items-center gap-2.5 text-orange-600 dark:text-orange-400">
            <div className="flex size-10 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20">
              <FileSpreadsheet className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                Mess Accounting & Tiffin Report Export
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Official NIVASI SPACE Monthly Mess Accounting & Operational Tiffin Workbook (6 Sheets)
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Selectors Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Mess Selector */}
            <div className="space-y-1 sm:col-span-1">
              <Label className="text-xs font-semibold flex items-center gap-1">
                <Building2 className="size-3 text-muted-foreground" />
                Target Mess
              </Label>
              <Select value={selectedMessId} onValueChange={setSelectedMessId}>
                <SelectTrigger className="h-8 text-xs bg-background">
                  <SelectValue placeholder="Select Mess" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Messes (Consolidated)</SelectItem>
                  {messesList.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.messName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Month Selector */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold flex items-center gap-1">
                <Calendar className="size-3 text-muted-foreground" />
                Month
              </Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="h-8 text-xs bg-background">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTH_OPTIONS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Year Selector */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold flex items-center gap-1">
                <Calendar className="size-3 text-muted-foreground" />
                Year
              </Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="h-8 text-xs bg-background">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {YEAR_OPTIONS.map((y) => (
                    <SelectItem key={y} value={y}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Leave Billing Policy Selector */}
          <div className="rounded-xl border border-border bg-muted/20 p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <BadgePercent className="size-3.5 text-primary" />
                Monthly Leave Billing Policy
              </Label>
              <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                ₹2,300 Base Package
              </Badge>
            </div>
            <Select
              value={leavePolicy}
              onValueChange={(val) => setLeavePolicy(val as LeaveBillingPolicy)}
            >
              <SelectTrigger className="h-8 text-xs bg-background">
                <SelectValue placeholder="Leave Billing Policy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no_adjustment">
                  1. No billing adjustment (Default: leave reduces tiffins, package stays ₹2,300)
                </SelectItem>
                <SelectItem value="prorated">
                  2. Per-day prorated adjustment (deduct leave days from monthly package)
                </SelectItem>
                <SelectItem value="custom">
                  3. Custom adjustment (as configured in workspace)
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">
              Students taking leave automatically reduce daily operational tiffins. Monthly ₹2,300 package adjustment follows this policy.
            </p>
          </div>

          {/* Critical Distinction Notice */}
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-900 dark:text-amber-200">
            <Info className="size-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold">Important Accounting Distinction</p>
              <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
                Operational Tiffins ({totalOperationalTiffins.toLocaleString("en-IN")} meals) track kitchen preparation and delivery. Monthly billing is strictly calculated at ₹2,300/student (₹1,150 lunch + ₹1,150 dinner), never by multiplying daily tiffins.
              </p>
            </div>
          </div>

          {/* Live Preview Cards */}
          <div className="grid grid-cols-2 gap-3">
            {/* Operational Tiffin Summary */}
            <div className="rounded-xl border border-border bg-card p-3 space-y-2">
              <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <UtensilsCrossed className="size-3.5 text-primary" />
                  Operational Tiffins
                </span>
                <span className="text-[10px] text-muted-foreground">Kitchen Headcount</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Final Lunch Tiffins:</span>
                  <span className="font-semibold">{totalFinalLunch.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Final Dinner Tiffins:</span>
                  <span className="font-semibold">{totalFinalDinner.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Student Leave Days:</span>
                  <span className="text-sky-600 dark:text-sky-400 font-semibold">
                    -{totalLeaveStudentDays} days
                  </span>
                </div>
                <div className="flex justify-between border-t border-border/60 pt-1 font-bold text-foreground">
                  <span>Grand Total Tiffins:</span>
                  <span className="text-primary">{totalOperationalTiffins.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* Monthly Package Billing Summary */}
            <div className="rounded-xl border border-border bg-card p-3 space-y-2">
              <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <Users className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  Monthly Package Billing
                </span>
                <span className="text-[10px] text-muted-foreground">₹2,300 Package</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Applicable Students:</span>
                  <span className="font-semibold">{totalAssignedStudents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lunch Share (₹1,150):</span>
                  <span className="font-semibold">₹{totalLunchShare.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dinner Share (₹1,150):</span>
                  <span className="font-semibold">₹{totalDinnerShare.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between border-t border-border/60 pt-1 font-bold text-emerald-700 dark:text-emerald-400">
                  <span>Total Monthly Billing:</span>
                  <span>₹{totalMonthlyAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Included Sheets Preview */}
          <div className="rounded-xl border border-border bg-muted/30 p-2.5">
            <p className="text-[11px] font-semibold text-foreground mb-1.5">
              Workbook Sheets Included in Export:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="size-3 text-emerald-600" /> 1. Monthly Mess Report
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="size-3 text-emerald-600" /> 2. Daily Tiffin Record
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="size-3 text-emerald-600" /> 3. Student Leave Record
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="size-3 text-emerald-600" /> 4. Student Monthly Billing
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="size-3 text-emerald-600" /> 5. Mess Summary
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="size-3 text-emerald-600" /> 6. Student Register
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-3 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={exporting}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleExport}
            disabled={exporting || activeMesses.length === 0}
            className="text-xs font-semibold gap-1.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-soft"
          >
            {exporting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Generating Excel Report…
              </>
            ) : (
              <>
                <Download className="size-3.5" />
                Export Monthly Report (.xlsx)
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
