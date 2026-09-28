import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  CalendarOff,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  CalendarDays,
  AlertCircle,
  Loader2,
  CalendarCheck,
  PhoneCall,
  FileText,
  Trash2,
  ArrowRight,
  Info,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StudentShell } from "@/components/nivasi/student-shell";
import { useStudentAuth } from "@/lib/studentAuth";
import { useLeaveRequestsForStudent } from "@/lib/hooks";
import {
  createLeaveRequest,
  updateLeaveReturnDate,
  cancelLeaveRequest,
  todayISTDateString,
} from "@/lib/db";
import type { LeaveRequest, LeaveStatus } from "@/lib/types";

export const Route = createFileRoute("/student/leaves")({
  head: () => ({ meta: [{ title: "My Leave Requests — NivasiSpace" }] }),
  component: StudentLeavesPage,
});

function formatDisplayDate(dateStr?: string | null): string {
  if (!dateStr) return "TBD (Open Return)";
  try {
    const parts = dateStr.split("-").map(Number);
    const y = parts[0] ?? new Date().getFullYear();
    const mo = parts[1] ?? 1;
    const d = parts[2] ?? 1;
    return new Date(y, mo - 1, d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function calculateDays(from?: string, to?: string | null): string {
  if (!from || !to) return "Open duration";
  try {
    const d1 = new Date(from);
    const d2 = new Date(to);
    const diff = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (diff <= 0) return "1 day";
    return `${diff} ${diff === 1 ? "day" : "days"}`;
  } catch {
    return "";
  }
}

const LEAVE_STATUS_CONFIG: Record<
  LeaveStatus,
  { label: string; icon: React.ComponentType<{ className?: string }>; badgeCls: string }
> = {
  pending: {
    label: "Pending Approval",
    icon: Clock,
    badgeCls: "bg-warning/15 text-warning-foreground border-warning/30",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    badgeCls: "bg-success/15 text-success border-success/30",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    badgeCls: "bg-destructive/15 text-destructive border-destructive/30",
  },
  cancelled: {
    label: "Cancelled",
    icon: AlertCircle,
    badgeCls: "bg-muted text-muted-foreground border-border",
  },
  completed: {
    label: "Completed",
    icon: CalendarCheck,
    badgeCls: "bg-primary/10 text-primary border-primary/20",
  },
};

function StudentLeavesPage() {
  const { session, admission, loading } = useStudentAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: leaves = [], isLoading } = useLeaveRequestsForStudent(admission?.id ?? null);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);

  // Form states
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fillToDateLater, setFillToDateLater] = useState(false);
  const [reasonCategory, setReasonCategory] = useState("Going Home");
  const [reasonDetails, setReasonDetails] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Return date modal state
  const [newReturnDate, setNewReturnDate] = useState("");
  const [savingReturnDate, setSavingReturnDate] = useState(false);

  // Tab filter
  const [tabFilter, setTabFilter] = useState<"all" | "pending" | "approved" | "history">("all");

  useEffect(() => {
    if (!loading && !session) {
      navigate({ to: "/student/login", replace: true });
    }
  }, [loading, session, navigate]);

  useEffect(() => {
    if (admission) {
      setEmergencyPhone(admission.parentPhone || admission.phoneNumber || "");
    }
  }, [admission]);

  const openNewLeaveModal = () => {
    const today = todayISTDateString();
    setFromDate(today);
    setToDate("");
    setFillToDateLater(false);
    setReasonCategory("Going Home");
    setReasonDetails("");
    setEmergencyPhone(admission?.parentPhone || admission?.phoneNumber || "");
    setCreateDialogOpen(true);
  };

  const handleCreateLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admission) return;

    if (!fromDate) {
      toast.error("From Date is mandatory.");
      return;
    }

    if (!fillToDateLater && toDate && toDate < fromDate) {
      toast.error("To Date cannot be earlier than From Date.");
      return;
    }

    const fullReason = reasonDetails.trim()
      ? `${reasonCategory}: ${reasonDetails.trim()}`
      : reasonCategory;

    setSubmitting(true);
    try {
      await createLeaveRequest({
        studentId: admission.id,
        admissionId: admission.admissionId,
        studentName: admission.fullName,
        studentEmail: admission.email || session?.email || "",
        studentPhone: admission.phoneNumber,
        propertyName: admission.propertyName,
        roomNumber: admission.roomNumber,
        bedNumber: admission.bedNumber,
        collegeName: admission.collegeName,
        fromDate,
        toDate: fillToDateLater || !toDate ? null : toDate,
        hasOpenReturn: fillToDateLater || !toDate,
        reason: fullReason,
        emergencyContact: emergencyPhone.trim(),
        status: "pending",
      });

      queryClient.invalidateQueries({ queryKey: ["leaveRequests"] });
      toast.success("Leave request submitted! Awaiting administrator approval.");
      setCreateDialogOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit leave request.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenSetReturnModal = (leave: LeaveRequest) => {
    setSelectedLeave(leave);
    setNewReturnDate(leave.toDate || todayISTDateString());
    setReturnDialogOpen(true);
  };

  const handleSaveReturnDate = async () => {
    if (!selectedLeave || !newReturnDate) return;
    if (newReturnDate < selectedLeave.fromDate) {
      toast.error("Return date cannot be earlier than From date.");
      return;
    }

    setSavingReturnDate(true);
    try {
      await updateLeaveReturnDate(selectedLeave.id, newReturnDate);
      queryClient.invalidateQueries({ queryKey: ["leaveRequests"] });
      toast.success("Return date updated successfully!");
      setReturnDialogOpen(false);
      setSelectedLeave(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update return date.");
    } finally {
      setSavingReturnDate(false);
    }
  };

  const handleCancelLeave = async (leaveId: string) => {
    if (!confirm("Are you sure you want to cancel this leave request?")) return;
    try {
      await cancelLeaveRequest(leaveId);
      queryClient.invalidateQueries({ queryKey: ["leaveRequests"] });
      toast.success("Leave request cancelled.");
    } catch (err: any) {
      toast.error(err?.message || "Failed to cancel leave request.");
    }
  };

  // Filtered leaves
  const filteredLeaves = leaves.filter((l) => {
    if (tabFilter === "pending") return l.status === "pending";
    if (tabFilter === "approved") return l.status === "approved";
    if (tabFilter === "history") return l.status === "rejected" || l.status === "completed" || l.status === "cancelled";
    return true;
  });

  const pendingCount = leaves.filter((l) => l.status === "pending").length;
  const approvedCount = leaves.filter((l) => l.status === "approved").length;

  return (
    <StudentShell
      title="Leave Requests"
      subtitle="Request permission for leaves, track approval status, and update your return date"
      icon={CalendarOff}
      action={
        <Button
          onClick={openNewLeaveModal}
          className="gradient-brand text-white shadow-soft font-semibold text-xs sm:text-sm gap-2"
        >
          <Plus className="size-4" />
          Apply for Leave
        </Button>
      }
    >
      <div className="space-y-6">
        {/* KPI / Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Total Requests</p>
            <p className="text-2xl font-bold font-display mt-1">{leaves.length}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">All time submissions</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-warning-foreground">Pending Approval</p>
            <p className="text-2xl font-bold font-display text-warning mt-1">{pendingCount}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Awaiting admin review</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-success">Approved Leaves</p>
            <p className="text-2xl font-bold font-display text-success mt-1">{approvedCount}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Confirmed by hostel admin</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Open Return Leaves</p>
            <p className="text-2xl font-bold font-display text-foreground mt-1">
              {leaves.filter((l) => l.hasOpenReturn && l.status !== "rejected" && l.status !== "cancelled").length}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Return date to be filled</p>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Button
            variant={tabFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setTabFilter("all")}
            className="rounded-xl text-xs h-8"
          >
            All Requests ({leaves.length})
          </Button>
          <Button
            variant={tabFilter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setTabFilter("pending")}
            className="rounded-xl text-xs h-8"
          >
            Pending ({pendingCount})
          </Button>
          <Button
            variant={tabFilter === "approved" ? "default" : "outline"}
            size="sm"
            onClick={() => setTabFilter("approved")}
            className="rounded-xl text-xs h-8"
          >
            Approved ({approvedCount})
          </Button>
          <Button
            variant={tabFilter === "history" ? "default" : "outline"}
            size="sm"
            onClick={() => setTabFilter("history")}
            className="rounded-xl text-xs h-8"
          >
            History & Other
          </Button>
        </div>

        {/* Leaves List */}
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredLeaves.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center shadow-soft">
            <CalendarOff className="mx-auto mb-3 size-10 text-muted-foreground/40" />
            <h3 className="font-semibold text-base text-foreground">No leave requests found</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
              {tabFilter === "all"
                ? "You haven't submitted any leave requests yet. Need to go home or take time off? Click 'Apply for Leave' above."
                : `No leave requests match the '${tabFilter}' filter.`}
            </p>
            {tabFilter === "all" && (
              <Button onClick={openNewLeaveModal} className="mt-4 gradient-brand text-white shadow-soft" size="sm">
                <Plus className="size-4 mr-1.5" />
                Apply for Leave
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLeaves.map((leave) => {
              const statusCfg = LEAVE_STATUS_CONFIG[leave.status] || LEAVE_STATUS_CONFIG.pending;
              const StatusIcon = statusCfg.icon;
              const duration = calculateDays(leave.fromDate, leave.toDate);

              return (
                <div
                  key={leave.id}
                  className="rounded-2xl border border-border bg-card p-5 shadow-soft hover:border-primary/30 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className={`text-xs gap-1.5 px-2.5 py-0.5 ${statusCfg.badgeCls}`}>
                          <StatusIcon className="size-3.5" />
                          {statusCfg.label}
                        </Badge>
                        {leave.hasOpenReturn && leave.status !== "rejected" && (
                          <Badge variant="outline" className="text-xs bg-brand-soft text-brand-dark border-brand-soft">
                            Return Date Open
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          Applied on {formatDisplayDate(leave.createdAt?.toISOString().slice(0, 10))}
                        </span>
                      </div>

                      {/* Date span */}
                      <div className="pt-2 flex items-center gap-2 text-base sm:text-lg font-bold font-display text-foreground">
                        <CalendarDays className="size-5 text-primary shrink-0" />
                        <span>{formatDisplayDate(leave.fromDate)}</span>
                        <ArrowRight className="size-4 text-muted-foreground" />
                        <span className={leave.toDate ? "text-foreground" : "text-primary italic"}>
                          {formatDisplayDate(leave.toDate)}
                        </span>
                        {duration && (
                          <span className="text-xs font-normal text-muted-foreground px-2 py-0.5 rounded-full bg-muted">
                            {duration}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 sm:pt-0">
                      {/* If toDate is open or student wants to update return date */}
                      {(leave.hasOpenReturn || !leave.toDate || leave.status === "approved" || leave.status === "pending") && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenSetReturnModal(leave)}
                          className="text-xs rounded-xl h-8"
                        >
                          <CalendarCheck className="size-3.5 mr-1.5 text-primary" />
                          {leave.toDate ? "Update Return Date" : "Set Return Date"}
                        </Button>
                      )}

                      {leave.status === "pending" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelLeave(leave.id)}
                          className="text-xs text-destructive hover:bg-destructive/10 h-8 rounded-xl px-2.5"
                        >
                          <Trash2 className="size-3.5 mr-1" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Reason & Emergency contact details */}
                  <div className="mt-4 pt-3 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-start gap-2">
                      <FileText className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">Reason for Leave</p>
                        <p className="text-foreground mt-0.5">{leave.reason || "Not specified"}</p>
                      </div>
                    </div>

                    {leave.emergencyContact && (
                      <div className="flex items-start gap-2">
                        <PhoneCall className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground">Emergency Contact</p>
                          <p className="text-foreground mt-0.5">{leave.emergencyContact}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Admin notes if reviewed */}
                  {leave.adminNotes && (
                    <div className="mt-3 rounded-xl bg-muted/60 p-3 text-xs text-foreground border border-border">
                      <p className="font-semibold text-muted-foreground">Admin Feedback:</p>
                      <p className="mt-0.5">{leave.adminNotes}</p>
                      {leave.reviewedBy && (
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Reviewed by {leave.reviewedBy}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Dialog: Apply For Leave ── */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-md sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">Apply for Leave</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Submit your hostel leave details. Your request will be sent to the administrator for confirmation.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateLeave} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* From Date (Mandatory) */}
              <div className="space-y-1.5">
                <Label htmlFor="fromDate" className="text-xs font-semibold">
                  From Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fromDate"
                  type="date"
                  required
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="rounded-xl text-sm"
                />
                <span className="text-[10px] text-muted-foreground">Mandatory start date of leave</span>
              </div>

              {/* To Date (Optional / Can be filled later) */}
              <div className="space-y-1.5">
                <Label htmlFor="toDate" className="text-xs font-semibold">
                  To Date (Return Date)
                </Label>
                <Input
                  id="toDate"
                  type="date"
                  disabled={fillToDateLater}
                  value={fillToDateLater ? "" : toDate}
                  min={fromDate || undefined}
                  onChange={(e) => setToDate(e.target.value)}
                  className="rounded-xl text-sm disabled:opacity-50"
                />
                <span className="text-[10px] text-muted-foreground">Optional, can be set later</span>
              </div>
            </div>

            {/* Checkbox: Fill return date later */}
            <div className="flex items-center space-x-2 rounded-xl border border-dashed border-border bg-muted/40 p-3">
              <Checkbox
                id="fillLater"
                checked={fillToDateLater}
                onCheckedChange={(checked) => {
                  setFillToDateLater(Boolean(checked));
                  if (checked) setToDate("");
                }}
              />
              <label
                htmlFor="fillLater"
                className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                I don't know my return date yet (I will fill it later)
              </label>
            </div>

            {/* Category / Reason */}
            <div className="space-y-1.5">
              <Label htmlFor="reasonCategory" className="text-xs font-semibold">
                Leave Reason / Category
              </Label>
              <Select value={reasonCategory} onValueChange={setReasonCategory}>
                <SelectTrigger id="reasonCategory" className="rounded-xl text-sm">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Going Home">Going Home / Family Visit</SelectItem>
                  <SelectItem value="Medical / Health Issue">Medical / Sick Leave</SelectItem>
                  <SelectItem value="College Exams / Event">Exams / Academic Event</SelectItem>
                  <SelectItem value="Family Function">Family Function / Festival</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                  <SelectItem value="Vacation / Trip">Vacation / Trip</SelectItem>
                  <SelectItem value="Other">Other Reason</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Additional details */}
            <div className="space-y-1.5">
              <Label htmlFor="reasonDetails" className="text-xs font-semibold">
                Reason Details / Remarks (Optional)
              </Label>
              <Textarea
                id="reasonDetails"
                rows={2}
                placeholder="Briefly describe your reason or destination..."
                value={reasonDetails}
                onChange={(e) => setReasonDetails(e.target.value)}
                className="rounded-xl text-sm resize-none"
              />
            </div>

            {/* Emergency Contact */}
            <div className="space-y-1.5">
              <Label htmlFor="emergencyPhone" className="text-xs font-semibold">
                Emergency Contact Number
              </Label>
              <Input
                id="emergencyPhone"
                type="tel"
                placeholder="Parent or local guardian contact number"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="rounded-xl text-sm"
              />
              <span className="text-[10px] text-muted-foreground">Contact number for emergencies while on leave</span>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="gradient-brand text-white shadow-soft rounded-xl text-xs font-semibold"
              >
                {submitting && <Loader2 className="size-3.5 animate-spin mr-1.5" />}
                Submit Leave Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Dialog: Set / Update Return Date ── */}
      <Dialog open={returnDialogOpen} onOpenChange={setReturnDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">Update Return Date</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Set or update your planned return date for this leave.
            </DialogDescription>
          </DialogHeader>

          {selectedLeave && (
            <div className="space-y-4 py-2">
              <div className="rounded-xl bg-muted/50 p-3 text-xs space-y-1">
                <p>
                  <span className="font-semibold text-muted-foreground">Leave Start Date:</span>{" "}
                  <strong>{formatDisplayDate(selectedLeave.fromDate)}</strong>
                </p>
                <p>
                  <span className="font-semibold text-muted-foreground">Reason:</span>{" "}
                  {selectedLeave.reason}
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="updateReturnDate" className="text-xs font-semibold">
                  New Return Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="updateReturnDate"
                  type="date"
                  required
                  min={selectedLeave.fromDate}
                  value={newReturnDate}
                  onChange={(e) => setNewReturnDate(e.target.value)}
                  className="rounded-xl text-sm"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setReturnDialogOpen(false)}
                  className="rounded-xl text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={savingReturnDate || !newReturnDate}
                  onClick={handleSaveReturnDate}
                  className="gradient-brand text-white shadow-soft rounded-xl text-xs font-semibold"
                >
                  {savingReturnDate && <Loader2 className="size-3.5 animate-spin mr-1.5" />}
                  Save Return Date
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </StudentShell>
  );
}
