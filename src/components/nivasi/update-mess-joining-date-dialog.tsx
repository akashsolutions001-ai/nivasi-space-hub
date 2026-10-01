import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Calendar, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { updateStudentMessJoiningDate, todayDateString } from "@/lib/db";
import { getStudentMessJoiningDate, formatToDDMMYYYY } from "@/lib/mess-export";
import type { Admission } from "@/lib/types";

export interface UpdateMessJoiningDateDialogProps {
  open: boolean;
  onClose: () => void;
  student: Admission | null;
  messName?: string;
}

export function UpdateMessJoiningDateDialog({
  open,
  onClose,
  student,
  messName,
}: UpdateMessJoiningDateDialogProps) {
  const qc = useQueryClient();
  const currentEffectiveDate = student ? getStudentMessJoiningDate(student) : "";
  const [dateValue, setDateValue] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (student) {
      setDateValue(student.messJoiningDate || currentEffectiveDate || todayDateString());
    }
  }, [student, currentEffectiveDate]);

  if (!student) return null;

  const targetMessName = messName || (student as any).messName || "Mess";

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!dateValue.trim()) {
      toast.error("Please select a valid joining date.");
      return;
    }
    setSaving(true);
    try {
      await updateStudentMessJoiningDate(student!.id, dateValue.trim());
      await qc.invalidateQueries({ queryKey: ["admissions"] });
      toast.success(
        `Mess joining date updated to ${formatToDDMMYYYY(dateValue.trim())} for ${student!.fullName}.`,
      );
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update mess joining date.");
    } finally {
      setSaving(false);
    }
  }

  const todayStr = todayDateString();
  const now = new Date();
  const firstOfMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const admissionDateStr = student.admissionDate || student.moveInDate || "";

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <Calendar className="size-5 text-primary" />
            Update Mess Joining Date
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Update when <span className="font-semibold text-foreground">{student.fullName}</span> joined{" "}
            <span className="font-semibold text-foreground">{targetMessName}</span>.
          </p>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="rounded-xl border bg-muted/40 p-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Student ID:</span>
              <span className="font-mono font-medium text-foreground">
                {student.admissionId || student.id}
              </span>
            </div>
            {student.propertyName && (
              <div className="flex justify-between text-muted-foreground">
                <span>Room / Property:</span>
                <span className="font-medium text-foreground">
                  {student.propertyName}
                  {student.roomNumber ? ` · Room ${student.roomNumber}` : ""}
                </span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>Current Joining Date:</span>
              <span className="font-semibold text-primary">
                {currentEffectiveDate ? formatToDDMMYYYY(currentEffectiveDate) : "Not recorded"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mess-joining-date-input" className="text-xs font-medium">
              Mess Joining Date
            </Label>
            <Input
              id="mess-joining-date-input"
              type="date"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              className="w-full"
              required
            />
            {/* Quick shortcuts */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-muted-foreground mr-1">Quick pick:</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-6 px-2 text-[11px]"
                onClick={() => setDateValue(todayStr)}
              >
                Today
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-6 px-2 text-[11px]"
                onClick={() => setDateValue(firstOfMonthStr)}
              >
                1st of Month
              </Button>
              {admissionDateStr && admissionDateStr !== dateValue && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-[11px]"
                  onClick={() => setDateValue(admissionDateStr)}
                  title={`Use Admission Date (${formatToDDMMYYYY(admissionDateStr)})`}
                >
                  Admission Date
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-3 text-[11px] text-sky-800 dark:text-sky-300 leading-relaxed space-y-1">
            <p className="font-semibold flex items-center gap-1">
              <AlertCircle className="size-3.5 shrink-0" /> Why this date matters:
            </p>
            <ul className="list-disc pl-4 space-y-0.5 opacity-90">
              <li>Prorates the ₹2,300 monthly package if the student joined mid-month.</li>
              <li>Controls which dates appear as active in the Nivasi Space monthly mess Excel export.</li>
              <li>Ensures accurate headcount in daily tiffin kitchen delivery records.</li>
            </ul>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-1.5 size-4 animate-spin" />}
              Save Joining Date
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
