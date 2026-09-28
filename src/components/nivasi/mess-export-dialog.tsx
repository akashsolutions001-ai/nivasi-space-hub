import { useState, useMemo } from "react";
import {
  Download,
  FileSpreadsheet,
  Calendar,
  Users,
  Loader2,
  UtensilsCrossed,
  CheckCircle2,
  CalendarRange,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  exportMessStudentRegister,
  getStudentMessJoiningDate,
  formatToDDMMYYYY,
  resolveVegNonVeg,
} from "@/lib/mess-export";
import type { Mess, Admission } from "@/lib/types";

interface MessExportDialogProps {
  open: boolean;
  onClose: () => void;
  mess: Mess | null;
  admissions: Admission[];
}

export function MessExportDialog({
  open,
  onClose,
  mess,
  admissions,
}: MessExportDialogProps) {
  const [exporting, setExporting] = useState(false);
  const [filterMode, setFilterMode] = useState<"all" | "range">("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Only students belonging to this mess
  const messStudents = useMemo(() => {
    if (!mess) return [];
    return admissions.filter((a) => (a as any).messId === mess.id);
  }, [admissions, mess]);

  // Evaluated student rows for preview
  const previewData = useMemo(() => {
    let list = messStudents;
    if (filterMode === "range" && (fromDate || toDate)) {
      list = list.filter((s) => {
        const d = getStudentMessJoiningDate(s);
        if (!d) return false;
        if (fromDate && d < fromDate) return false;
        if (toDate && d > toDate) return false;
        return true;
      });
    }

    const vegCount = list.filter((s) => resolveVegNonVeg(s) === "Veg").length;
    const nonVegCount = list.filter((s) => resolveVegNonVeg(s) === "Non-Veg").length;

    const dates = list
      .map((s) => getStudentMessJoiningDate(s))
      .filter(Boolean)
      .sort();

    const firstDate = dates[0] ? formatToDDMMYYYY(dates[0]) : "N/A";
    const lastDate = dates[dates.length - 1] ? formatToDDMMYYYY(dates[dates.length - 1]) : "N/A";

    return {
      count: list.length,
      vegCount,
      nonVegCount,
      firstDate,
      lastDate,
    };
  }, [messStudents, filterMode, fromDate, toDate]);

  async function handleExport() {
    if (!mess) return;
    if (messStudents.length === 0) {
      toast.warning(`No students currently assigned to ${mess.messName}.`);
      return;
    }
    if (filterMode === "range" && fromDate && toDate && toDate < fromDate) {
      toast.error("To Date cannot be before From Date.");
      return;
    }

    setExporting(true);
    try {
      const dateRange =
        filterMode === "range" && (fromDate || toDate)
          ? {
              startDate: fromDate || undefined,
              endDate: toDate || undefined,
            }
          : undefined;

      const { count, fileName } = await exportMessStudentRegister({
        mess,
        students: admissions,
        dateRange,
      });

      toast.success(
        `Successfully exported ${count} student record(s) for ${mess.messName}!`,
      );
      onClose();
    } catch (err) {
      console.error("[export-mess] error", err);
      toast.error(
        err instanceof Error ? err.message : "Export failed. Please try again.",
      );
    } finally {
      setExporting(false);
    }
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen && !exporting) {
      setFilterMode("all");
      setFromDate("");
      setToDate("");
      onClose();
    }
  }

  if (!mess) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="space-y-1.5">
          <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
            <div className="flex size-9 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20">
              <FileSpreadsheet className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">
                Export Student Register
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Official NIVASI SPACE Excel register for {mess.messName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Mess Info Card */}
          <div className="rounded-xl border border-border bg-card p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="font-semibold text-sm text-foreground">
                {mess.messName}
              </span>
              <Badge
                variant="outline"
                className="border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-300 text-[11px]"
              >
                {messStudents.length} Students Enrolled
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-muted-foreground pt-1">
              <div>
                <p className="text-[10px] uppercase font-semibold text-muted-foreground/80">
                  Mess Owner
                </p>
                <p className="font-medium text-foreground">
                  {mess.ownerName || "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-muted-foreground/80">
                  Owner Mobile
                </p>
                <p className="font-medium text-foreground">
                  {mess.ownerPhone || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Filter Mode Switcher */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Joining Date Filter</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFilterMode("all")}
                className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition-all ${
                  filterMode === "all"
                    ? "border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 shadow-soft"
                    : "border-border bg-card text-muted-foreground hover:bg-muted/40"
                }`}
              >
                <Users className="size-4" />
                All Students ({messStudents.length})
              </button>

              <button
                type="button"
                onClick={() => setFilterMode("range")}
                className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition-all ${
                  filterMode === "range"
                    ? "border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 shadow-soft"
                    : "border-border bg-card text-muted-foreground hover:bg-muted/40"
                }`}
              >
                <CalendarRange className="size-4" />
                Filter by Date
              </button>
            </div>
          </div>

          {/* Custom Date Range Inputs */}
          {filterMode === "range" && (
            <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-3 space-y-2.5 animate-in fade-in-50 duration-200">
              <p className="text-xs text-orange-900 dark:text-orange-200 font-medium">
                Filter students who joined {mess.messName} between:
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <Label htmlFor="from-date" className="text-[11px] text-muted-foreground">
                    From Joining Date
                  </Label>
                  <Input
                    id="from-date"
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="h-8 text-xs bg-background"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="to-date" className="text-[11px] text-muted-foreground">
                    To Joining Date
                  </Label>
                  <Input
                    id="to-date"
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="h-8 text-xs bg-background"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Live Register Preview Breakdown */}
          <div className="rounded-xl border border-border/80 bg-muted/30 p-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-muted-foreground">Register Breakdown:</span>
              <span className="text-foreground font-bold">
                {previewData.count} student(s) to export
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 py-1.5 px-1">
                <p className="text-[10px] text-emerald-800 dark:text-emerald-300 font-medium">
                  🟢 Veg
                </p>
                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                  {previewData.vegCount}
                </p>
              </div>

              <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 py-1.5 px-1">
                <p className="text-[10px] text-amber-800 dark:text-amber-300 font-medium">
                  🍗 Non-Veg
                </p>
                <p className="text-sm font-bold text-amber-700 dark:text-amber-400">
                  {previewData.nonVegCount}
                </p>
              </div>

              <div className="rounded-lg bg-card border border-border py-1.5 px-1">
                <p className="text-[10px] text-muted-foreground font-medium">
                  Total
                </p>
                <p className="text-sm font-bold text-foreground">
                  {previewData.count}
                </p>
              </div>
            </div>

            {previewData.count > 0 && (
              <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
                <span>Earliest: {previewData.firstDate}</span>
                <span>Latest: {previewData.lastDate}</span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2">
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
            disabled={exporting || previewData.count === 0}
            className="text-xs font-semibold gap-1.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-soft"
          >
            {exporting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Generating Excel Register…
              </>
            ) : (
              <>
                <Download className="size-3.5" />
                Export to Excel (.xlsx)
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
