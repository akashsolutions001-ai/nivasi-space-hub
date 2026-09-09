import { useState, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Calendar, Clock, CheckCircle2, XCircle, SkipForward,
  Loader2, Scale, StickyNote, History, ChevronLeft,
  ChevronRight, Sparkles, Check,
} from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { useLaundryPickupsForStudent } from "@/lib/hooks";
import { upsertLaundryPickup, todayDateString } from "@/lib/db";
import type { Admission, LaundryPickup, LaundryPickupStatus } from "@/lib/types";

interface StudentLaundryDialogProps {
  open: boolean;
  onClose: () => void;
  student: Admission | null;
  laundryId: string;
  laundryName?: string | undefined;
  employeeId?: string | undefined;
  initialDate?: string | undefined;
}

const STATUS_COLORS: Record<LaundryPickupStatus, string> = {
  pending: "bg-warning/15 text-warning-foreground border-warning/30",
  picked_up: "bg-success/15 text-success border-success/30",
  not_available: "bg-muted text-muted-foreground border-border",
  skipped: "bg-destructive/10 text-destructive border-destructive/20",
};

export function StudentLaundryDialog({
  open,
  onClose,
  student,
  laundryId,
  laundryName,
  employeeId = "admin",
  initialDate,
}: StudentLaundryDialogProps) {
  const qc = useQueryClient();
  const today = todayDateString();

  const [date, setDate] = useState<string>(initialDate || today);
  const [activeTab, setActiveTab] = useState<"pickup" | "delivery">("pickup");

  // Form state per type
  const [pickupStatus, setPickupStatus] = useState<LaundryPickupStatus>("pending");
  const [pickupWeight, setPickupWeight] = useState("");
  const [pickupNotes, setPickupNotes] = useState("");

  const [deliveryStatus, setDeliveryStatus] = useState<LaundryPickupStatus>("pending");
  const [deliveryWeight, setDeliveryWeight] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");

  const [saving, setSaving] = useState(false);

  // Fetch all pickups for this student across all dates
  const { data: studentPickups = [], isLoading: pickupsLoading } = useLaundryPickupsForStudent(
    student?.id ?? null,
  );

  // Reset date when initialDate changes or dialog opens
  useEffect(() => {
    if (open) {
      setDate(initialDate || today);
    }
  }, [open, initialDate, today]);

  // Load existing data for the selected date whenever date or studentPickups change
  useEffect(() => {
    if (!studentPickups) return;
    const p = studentPickups.find((r) => r.date === date && r.type === "pickup");
    const d = studentPickups.find((r) => r.date === date && r.type === "delivery");

    if (p) {
      setPickupStatus(p.status);
      setPickupWeight(p.clothesWeight ?? "");
      setPickupNotes(p.notes ?? "");
    } else {
      setPickupStatus("pending");
      setPickupWeight("");
      setPickupNotes("");
    }

    if (d) {
      setDeliveryStatus(d.status);
      setDeliveryWeight(d.clothesWeight ?? "");
      setDeliveryNotes(d.notes ?? "");
    } else {
      setDeliveryStatus("pending");
      setDeliveryWeight("");
      setDeliveryNotes("");
    }
  }, [date, studentPickups]);

  // Group history by date (excluding current chosen date for clear overview)
  const historyRecords = useMemo(() => {
    return studentPickups.slice().sort((a, b) => b.date.localeCompare(a.date));
  }, [studentPickups]);

  async function handleSave(typeToSave?: "pickup" | "delivery" | "both") {
    if (!student || !laundryId) return;
    const targets = typeToSave === "pickup" ? ["pickup" as const]
      : typeToSave === "delivery" ? ["delivery" as const]
      : ["pickup" as const, "delivery" as const];

    setSaving(true);
    try {
      for (const type of targets) {
        const isPickup = type === "pickup";
        const status = isPickup ? pickupStatus : deliveryStatus;
        const clothesWeight = isPickup ? pickupWeight.trim() : deliveryWeight.trim();
        const notes = isPickup ? pickupNotes.trim() : deliveryNotes.trim();

        await upsertLaundryPickup({
          studentId: student.id,
          admissionId: student.admissionId,
          laundryId,
          employeeId,
          date,
          type,
          status,
          clothesWeight,
          notes,
        });
      }

      await qc.invalidateQueries({ queryKey: ["laundryPickups"] });
      await qc.invalidateQueries({ queryKey: ["laundryPickupSummary"] });
      toast.success(`Saved laundry details for ${student.fullName} on ${date}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save laundry details.");
    } finally {
      setSaving(false);
    }
  }

  function shiftDate(days: number) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    setDate(d.toISOString().slice(0, 10));
  }

  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="size-5 text-primary" />
            <span>Laundry Record — {student.fullName}</span>
          </DialogTitle>
          <DialogDescription>
            {student.phoneNumber && `Phone: ${student.phoneNumber}`}
            {student.propertyName ? ` · ${student.propertyName}` : ""}
            {student.roomNumber ? ` · Room ${student.roomNumber}` : ""}
            {laundryName ? ` · ${laundryName}` : ""}
          </DialogDescription>
        </DialogHeader>

        {/* ── Date Picker Bar ── */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Calendar className="size-3.5 text-primary" />
              Calendar Laundry Date
            </Label>
            {date === today && (
              <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30">
                Today
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-8 shrink-0"
              onClick={() => shiftDate(-1)}
              aria-label="Previous day"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-8 font-medium text-sm text-center bg-background"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-8 shrink-0"
              onClick={() => shiftDate(1)}
              aria-label="Next day"
            >
              <ChevronRight className="size-4" />
            </Button>
            {date !== today && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 text-xs shrink-0"
                onClick={() => setDate(today)}
              >
                Today
              </Button>
            )}
          </div>
        </div>

        {/* ── Tab Switcher between Pickup & Delivery ── */}
        <div className="flex rounded-xl border border-border p-1 bg-muted/30">
          <button
            type="button"
            onClick={() => setActiveTab("pickup")}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
              activeTab === "pickup"
                ? "bg-background shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Pickup Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("delivery")}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
              activeTab === "delivery"
                ? "bg-background shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Delivery Details
          </button>
        </div>

        {/* ── Tab Content: Pickup ── */}
        {activeTab === "pickup" && (
          <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold flex items-center gap-1.5">
                <Clock className="size-4 text-warning-foreground" />
                Pickup Record
              </span>
              <Select value={pickupStatus} onValueChange={(v) => setPickupStatus(v as LaundryPickupStatus)}>
                <SelectTrigger className={`h-7 w-32 text-xs font-medium capitalize ${STATUS_COLORS[pickupStatus]}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="picked_up">Picked Up</SelectItem>
                  <SelectItem value="not_available">Not Available</SelectItem>
                  <SelectItem value="skipped">Skipped</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="pickupWeight" className="text-xs font-medium flex items-center gap-1.5">
                <Scale className="size-3.5 text-muted-foreground" />
                Weight of Clothes
              </Label>
              <Input
                id="pickupWeight"
                placeholder="e.g. 2.5 kg, 3.2 kg"
                value={pickupWeight}
                onChange={(e) => setPickupWeight(e.target.value)}
                className="h-8 text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="pickupNotes" className="text-xs font-medium flex items-center gap-1.5">
                <StickyNote className="size-3.5 text-muted-foreground" />
                Description / Clothes Details
              </Label>
              <textarea
                id="pickupNotes"
                rows={2}
                placeholder="e.g. 3 shirts, 2 pants, 1 bedsheet (white shirt separate)"
                value={pickupNotes}
                onChange={(e) => setPickupNotes(e.target.value)}
                className="w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <Button
              type="button"
              size="sm"
              disabled={saving}
              onClick={() => handleSave("pickup")}
              className="w-full"
            >
              {saving ? <Loader2 className="mr-1.5 size-4 animate-spin" /> : <Check className="mr-1.5 size-4" />}
              Save Pickup Details for {date}
            </Button>
          </div>
        )}

        {/* ── Tab Content: Delivery ── */}
        {activeTab === "delivery" && (
          <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-success" />
                Delivery Record
              </span>
              <Select value={deliveryStatus} onValueChange={(v) => setDeliveryStatus(v as LaundryPickupStatus)}>
                <SelectTrigger className={`h-7 w-32 text-xs font-medium capitalize ${STATUS_COLORS[deliveryStatus]}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="picked_up">Delivered</SelectItem>
                  <SelectItem value="not_available">Not Available</SelectItem>
                  <SelectItem value="skipped">Skipped</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="deliveryWeight" className="text-xs font-medium flex items-center gap-1.5">
                <Scale className="size-3.5 text-muted-foreground" />
                Weight of Clothes (Delivered)
              </Label>
              <Input
                id="deliveryWeight"
                placeholder="e.g. 2.5 kg"
                value={deliveryWeight}
                onChange={(e) => setDeliveryWeight(e.target.value)}
                className="h-8 text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="deliveryNotes" className="text-xs font-medium flex items-center gap-1.5">
                <StickyNote className="size-3.5 text-muted-foreground" />
                Description / Delivery Notes
              </Label>
              <textarea
                id="deliveryNotes"
                rows={2}
                placeholder="e.g. Delivered folded to student in Room 102"
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                className="w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <Button
              type="button"
              size="sm"
              disabled={saving}
              onClick={() => handleSave("delivery")}
              className="w-full"
            >
              {saving ? <Loader2 className="mr-1.5 size-4 animate-spin" /> : <Check className="mr-1.5 size-4" />}
              Save Delivery Details for {date}
            </Button>
          </div>
        )}

        {/* ── Student Laundry Date History ── */}
        <div className="space-y-2 border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <History className="size-3.5 text-primary" />
              Laundry Date History ({student.fullName})
            </h4>
            <span className="text-[11px] text-muted-foreground">Click date to edit</span>
          </div>

          {pickupsLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : historyRecords.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4 italic border border-dashed rounded-xl">
              No laundry records recorded yet for this student.
            </p>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 divide-y divide-border">
              {historyRecords.map((rec) => (
                <button
                  key={rec.id}
                  type="button"
                  onClick={() => setDate(rec.date)}
                  className={`w-full text-left p-2 rounded-xl transition-colors flex flex-col gap-1 ${
                    rec.date === date ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-foreground">{rec.date}</span>
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {rec.type}
                      </Badge>
                      <Badge variant="outline" className={`text-[10px] capitalize ${STATUS_COLORS[rec.status]}`}>
                        {rec.status === "picked_up" && rec.type === "delivery" ? "Delivered" : rec.status}
                      </Badge>
                    </div>
                    {rec.clothesWeight && (
                      <span className="text-xs font-bold text-primary flex items-center gap-1">
                        <Scale className="size-3" />
                        {rec.clothesWeight}
                      </span>
                    )}
                  </div>
                  {rec.notes && (
                    <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
                      <StickyNote className="size-3 shrink-0" />
                      {rec.notes}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
