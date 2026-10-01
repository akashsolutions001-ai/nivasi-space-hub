import { useState, useMemo, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  UtensilsCrossed,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Coffee,
  Moon,
  Ban,
  Sliders,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { useAllLeaveRequests, useMessDailyRecordsForMonth } from "@/lib/hooks";
import {
  getOrCreateMessDailyRecord,
  updateMessDailyRecord,
  todayISTDateString,
} from "@/lib/db";
import { formatToDDMMYYYY, getStudentMessJoiningDate } from "@/lib/mess-export";
import type { Mess, Admission, MessOperationalStatus } from "@/lib/types";

interface MessDailyTiffinDialogProps {
  open: boolean;
  onClose: () => void;
  mess: Mess;
  admissions: Admission[];
}

export function MessDailyTiffinDialog({
  open,
  onClose,
  mess,
  admissions,
}: MessDailyTiffinDialogProps) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: leaves = [] } = useAllLeaveRequests();

  const [dateStr, setDateStr] = useState<string>(todayISTDateString());
  const [messStatus, setMessStatus] = useState<MessOperationalStatus>("OPEN");
  const [lunchAdj, setLunchAdj] = useState<number>(0);
  const [dinnerAdj, setDinnerAdj] = useState<number>(0);
  const [reason, setReason] = useState<string>("");
  const [saving, setSaving] = useState(false);

  // Parse year & month from dateStr
  const [yStr, mStr] = dateStr.split("-");
  const yearNum = parseInt(yStr || "2026", 10);
  const monthNum = parseInt(mStr || "9", 10);

  // Query records for this month
  const { data: monthRecords = [], isLoading: recordsLoading } =
    useMessDailyRecordsForMonth(mess.id, yearNum, monthNum);

  // Look for existing record for this date
  const existingRecord = useMemo(() => {
    return monthRecords.find((r) => (r.dateKey || r.date) === dateStr);
  }, [monthRecords, dateStr]);

  // When date changes or record loads, sync form state
  useEffect(() => {
    if (existingRecord) {
      setMessStatus(existingRecord.messStatus || "OPEN");
      setLunchAdj(existingRecord.lunchAdjustment || 0);
      setDinnerAdj(existingRecord.dinnerAdjustment || 0);
      setReason(existingRecord.reason || "");
    } else {
      setMessStatus("OPEN");
      setLunchAdj(0);
      setDinnerAdj(0);
      setReason("");
    }
  }, [existingRecord, dateStr]);

  // Compute live assigned and leave students for this mess and date
  const { assignedCount, leaveCount, onLeaveNames } = useMemo(() => {
    const assigned = admissions.filter((a) => {
      if ((a as any).messId !== mess.id) return false;
      const joining = getStudentMessJoiningDate(a);
      if (joining && joining > dateStr) return false;
      const end = a.packageEndDate || "";
      if (end && end < dateStr) return false;
      return true;
    });

    const approvedLeaves = leaves.filter(
      (l) => l.status === "approved" && Boolean(l.fromDate)
    );

    const onLeave = assigned.filter((student) => {
      return approvedLeaves.some((l) => {
        const isStudent =
          l.studentId === student.id || l.admissionId === student.admissionId;
        if (!isStudent) return false;
        if (l.fromDate > dateStr) return false;
        if (l.toDate && l.toDate < dateStr) return false;
        return true;
      });
    });

    return {
      assignedCount: assigned.length,
      leaveCount: onLeave.length,
      onLeaveNames: onLeave.map((s) => s.fullName || "Student"),
    };
  }, [admissions, mess.id, dateStr, leaves]);

  // Calculations
  const expectedLunch = Math.max(0, assignedCount - leaveCount);
  const expectedDinner = Math.max(0, assignedCount - leaveCount);

  const isLunchOff =
    messStatus === "LUNCH_OFF" ||
    messStatus === "FULL_DAY_OFF" ||
    messStatus === "HOLIDAY" ||
    messStatus === "SPECIAL_CLOSURE";

  const isDinnerOff =
    messStatus === "DINNER_OFF" ||
    messStatus === "FULL_DAY_OFF" ||
    messStatus === "HOLIDAY" ||
    messStatus === "SPECIAL_CLOSURE";

  const finalLunch = isLunchOff ? 0 : Math.max(0, expectedLunch + Number(lunchAdj || 0));
  const finalDinner = isDinnerOff ? 0 : Math.max(0, expectedDinner + Number(dinnerAdj || 0));
  const totalDailyTiffins = finalLunch + finalDinner;

  async function handleSave() {
    setSaving(true);
    try {
      const docId = `${mess.id}_${dateStr}`;
      const recordPayload = {
        date: dateStr,
        dateKey: dateStr,
        month: monthNum,
        year: yearNum,
        monthKey: `${yearNum}-${String(monthNum).padStart(2, "0")}`,
        messId: mess.id,
        messName: mess.messName,
        assignedStudentCount: assignedCount,
        leaveStudentCount: leaveCount,
        lunchExpected: expectedLunch,
        lunchAdjustment: Number(lunchAdj || 0),
        lunchFinal: finalLunch,
        dinnerExpected: expectedDinner,
        dinnerAdjustment: Number(dinnerAdj || 0),
        dinnerFinal: finalDinner,
        lunchStatus: isLunchOff ? ("OFF" as const) : ("OPEN" as const),
        dinnerStatus: isDinnerOff ? ("OFF" as const) : ("OPEN" as const),
        messStatus,
        reason: reason.trim(),
        monthlyApplicableStudents: assignedCount,
        monthlyRate: 2300,
        monthlyAmount: assignedCount * 2300,
        updatedBy: user?.displayName || user?.email || "Admin",
      };

      if (existingRecord) {
        await updateMessDailyRecord(docId, recordPayload);
      } else {
        await getOrCreateMessDailyRecord(recordPayload);
      }

      await qc.invalidateQueries({
        queryKey: ["messDailyRecords", mess.id, yearNum, monthNum],
      });
      await qc.invalidateQueries({
        queryKey: ["messDailyRecords", "all", yearNum, monthNum],
      });

      toast.success(
        `Saved daily record for ${mess.messName} on ${formatToDDMMYYYY(dateStr)}!`
      );
      onClose();
    } catch (err) {
      console.error("[daily-record-save] error", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to save daily tiffin record."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !saving && !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto">
        <DialogHeader className="space-y-1 pb-2 border-b border-border">
          <div className="flex items-center gap-2 text-primary">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <Sliders className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">
                Daily Tiffin & Mess-Off Operations
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Manage operational tiffins, leaves, holidays, and manual adjustments for {mess.messName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Date Selector */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-muted/30 p-3">
            <div className="space-y-0.5">
              <Label htmlFor="tiffin-date" className="text-xs font-semibold">
                Operational Date (IST)
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Select any date to view or adjust daily records
              </p>
            </div>
            <Input
              id="tiffin-date"
              type="date"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              className="h-8 text-xs w-40 bg-background"
            />
          </div>

          {/* Operational Headcount Breakdown */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl border border-border bg-card p-2.5">
              <p className="text-[10px] text-muted-foreground font-medium">Assigned</p>
              <p className="text-xl font-bold text-foreground">{assignedCount}</p>
              <p className="text-[10px] text-muted-foreground">Active in mess</p>
            </div>
            <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 p-2.5">
              <p className="text-[10px] text-sky-800 dark:text-sky-300 font-medium">On Leave</p>
              <p className="text-xl font-bold text-sky-700 dark:text-sky-400">{leaveCount}</p>
              <p className="text-[10px] text-muted-foreground">Meals reduced</p>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2.5">
              <p className="text-[10px] text-emerald-800 dark:text-emerald-300 font-medium">Expected</p>
              <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{expectedLunch}</p>
              <p className="text-[10px] text-muted-foreground">Per meal (L & D)</p>
            </div>
          </div>

          {leaveCount > 0 && (
            <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 px-3 py-2 text-xs text-sky-800 dark:text-sky-300">
              <span className="font-semibold">Students away on leave today:</span>{" "}
              {onLeaveNames.join(", ")}
            </div>
          )}

          {/* Mess Operational Status (Mess-Off / Holiday) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <Ban className="size-3.5 text-muted-foreground" />
              Mess Status / Schedule for {formatToDDMMYYYY(dateStr)}
            </Label>
            <Select
              value={messStatus}
              onValueChange={(val) => setMessStatus(val as MessOperationalStatus)}
            >
              <SelectTrigger className="h-8 text-xs bg-background">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPEN">🟢 Normal / OPEN (Both Meals Served)</SelectItem>
                <SelectItem value="LUNCH_OFF">🟡 Lunch OFF (Dinner Normal)</SelectItem>
                <SelectItem value="DINNER_OFF">🟡 Dinner OFF (Lunch Normal)</SelectItem>
                <SelectItem value="FULL_DAY_OFF">🔴 Full Day OFF (No Meals)</SelectItem>
                <SelectItem value="HOLIDAY">🏖️ Holiday Closure</SelectItem>
                <SelectItem value="SPECIAL_CLOSURE">🔒 Special Closure</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">
              Marking Lunch or Dinner OFF zeroes operational tiffins for that meal while preserving ₹2,300 package accounting.
            </p>
          </div>

          {/* Manual Adjustments */}
          <div className="rounded-xl border border-border bg-card p-3 space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Sliders className="size-3 text-primary" />
                Manual Kitchen Adjustments (+ / -)
              </span>
              <span className="text-[10px] text-muted-foreground">Overrides & Extra Guests</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Lunch Adjustment */}
              <div className="space-y-1">
                <Label htmlFor="lunch-adj" className="text-[11px] flex items-center gap-1 text-muted-foreground">
                  <Coffee className="size-3 text-amber-600" />
                  Lunch Adjustment
                </Label>
                <Input
                  id="lunch-adj"
                  type="number"
                  disabled={isLunchOff}
                  value={lunchAdj}
                  onChange={(e) => setLunchAdj(parseInt(e.target.value, 10) || 0)}
                  placeholder="0"
                  className="h-8 text-xs bg-background"
                />
                <p className="text-[10px] text-muted-foreground">
                  {isLunchOff ? "Lunch is OFF (Final: 0)" : `Final Lunch: ${finalLunch}`}
                </p>
              </div>

              {/* Dinner Adjustment */}
              <div className="space-y-1">
                <Label htmlFor="dinner-adj" className="text-[11px] flex items-center gap-1 text-muted-foreground">
                  <Moon className="size-3 text-indigo-600" />
                  Dinner Adjustment
                </Label>
                <Input
                  id="dinner-adj"
                  type="number"
                  disabled={isDinnerOff}
                  value={dinnerAdj}
                  onChange={(e) => setDinnerAdj(parseInt(e.target.value, 10) || 0)}
                  placeholder="0"
                  className="h-8 text-xs bg-background"
                />
                <p className="text-[10px] text-muted-foreground">
                  {isDinnerOff ? "Dinner is OFF (Final: 0)" : `Final Dinner: ${finalDinner}`}
                </p>
              </div>
            </div>

            {/* Remarks / Reason */}
            <div className="space-y-1 pt-1">
              <Label htmlFor="adj-reason" className="text-[11px] text-muted-foreground">
                Remarks / Reason for Adjustment or Closure
              </Label>
              <Input
                id="adj-reason"
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Festival holiday, Extra guest catering, Power cut..."
                className="h-8 text-xs bg-background"
              />
            </div>
          </div>

          {/* Final Calculated Summary Banner */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-primary">Final Tiffins for {formatToDDMMYYYY(dateStr)}:</p>
              <p className="text-[11px] text-muted-foreground">
                Lunch: <strong>{finalLunch}</strong> ({isLunchOff ? "OFF" : "Open"}) | Dinner: <strong>{finalDinner}</strong> ({isDinnerOff ? "OFF" : "Open"})
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground block">Total Daily Tiffins</span>
              <span className="text-xl font-bold text-foreground">{totalDailyTiffins}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-3 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={saving}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="text-xs font-semibold gap-1.5 shadow-soft"
          >
            {saving ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Saving Daily Record…
              </>
            ) : (
              <>
                <Save className="size-3.5" />
                Save Daily Tiffin Record
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
