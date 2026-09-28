import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  CalendarOff,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  CalendarDays,
  CalendarCheck,
  User,
  Home,
  Phone,
  FileText,
  AlertCircle,
  Check,
  X,
  Filter,
  ArrowRight,
  Loader2,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

import { AdminShell } from "@/components/nivasi/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { useAllLeaveRequests } from "@/lib/hooks";
import { useAuth } from "@/lib/auth";
import {
  updateLeaveRequestStatus,
  updateLeaveReturnDate,
  todayISTDateString,
} from "@/lib/db";
import { formatDate } from "@/lib/format";
import type { LeaveRequest, LeaveStatus } from "@/lib/types";

export const Route = createFileRoute("/admin/leaves")({
  head: () => ({
    meta: [
      { title: "Leave Requests — NivasiSpace Admin" },
      { name: "description", content: "Review and approve student hostel leave requests." },
    ],
  }),
  component: AdminLeavesPage,
});

function calculateDuration(from?: string, to?: string | null): string {
  if (!from) return "—";
  if (!to) return "Open Duration";
  try {
    const d1 = new Date(from);
    const d2 = new Date(to);
    const diff = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (diff <= 0) return "1 day";
    return `${diff} ${diff === 1 ? "day" : "days"}`;
  } catch {
    return "—";
  }
}

function isCurrentlyActive(leave: LeaveRequest, today: string): boolean {
  if (leave.status !== "approved") return false;
  if (!leave.fromDate) return false;
  if (leave.fromDate > today) return false; // In future
  if (leave.toDate && leave.toDate < today) return false; // Expired
  return true;
}

const STATUS_CONFIG: Record<
  LeaveStatus,
  { label: string; icon: React.ComponentType<{ className?: string }>; badgeCls: string }
> = {
  pending: {
    label: "Pending Review",
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

function AdminLeavesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: leaves = [], isLoading } = useAllLeaveRequests();

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [propertyFilter, setPropertyFilter] = useState<string>("all");

  // Approval / Rejection dialog state
  const [reviewDialog, setReviewDialog] = useState<{
    open: boolean;
    leave: LeaveRequest | null;
    action: "approve" | "reject" | "complete";
  }>({
    open: false,
    leave: null,
    action: "approve",
  });
  const [adminNotes, setAdminNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Return date edit dialog state
  const [returnDialog, setReturnDialog] = useState<{
    open: boolean;
    leave: LeaveRequest | null;
  }>({
    open: false,
    leave: null,
  });
  const [newReturnDate, setNewReturnDate] = useState("");
  const [savingReturnDate, setSavingReturnDate] = useState(false);

  const today = todayISTDateString();

  // Extract unique properties for filter
  const uniqueProperties = useMemo(() => {
    const set = new Set<string>();
    leaves.forEach((l) => {
      if (l.propertyName) set.add(l.propertyName);
    });
    return Array.from(set).sort();
  }, [leaves]);

  // Filtered leaves
  const filteredLeaves = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leaves.filter((leave) => {
      // Search
      if (q) {
        const matchesName = leave.studentName?.toLowerCase().includes(q);
        const matchesAdmId = leave.admissionId?.toLowerCase().includes(q);
        const matchesProp = leave.propertyName?.toLowerCase().includes(q);
        const matchesRoom = leave.roomNumber?.toLowerCase().includes(q);
        const matchesReason = leave.reason?.toLowerCase().includes(q);
        if (!matchesName && !matchesAdmId && !matchesProp && !matchesRoom && !matchesReason) {
          return false;
        }
      }

      // Status
      if (statusFilter === "currently_on_leave") {
        if (!isCurrentlyActive(leave, today)) return false;
      } else if (statusFilter !== "all" && leave.status !== statusFilter) {
        return false;
      }

      // Property
      if (propertyFilter !== "all" && leave.propertyName !== propertyFilter) {
        return false;
      }

      return true;
    });
  }, [leaves, query, statusFilter, propertyFilter, today]);

  // Counts
  const pendingCount = leaves.filter((l) => l.status === "pending").length;
  const approvedCount = leaves.filter((l) => l.status === "approved").length;
  const currentlyOnLeaveCount = leaves.filter((l) => isCurrentlyActive(l, today)).length;
  const openReturnCount = leaves.filter((l) => l.hasOpenReturn && l.status === "approved").length;

  const handleOpenReview = (leave: LeaveRequest, action: "approve" | "reject" | "complete") => {
    setReviewDialog({ open: true, leave, action });
    setAdminNotes("");
  };

  const handleConfirmReview = async () => {
    const { leave, action } = reviewDialog;
    if (!leave) return;

    setActionLoading(true);
    try {
      const newStatus: LeaveStatus =
        action === "approve" ? "approved" : action === "reject" ? "rejected" : "completed";

      const reviewerName = user?.displayName || user?.email || "Admin";

      await updateLeaveRequestStatus(leave.id, newStatus, adminNotes.trim(), reviewerName);
      queryClient.invalidateQueries({ queryKey: ["leaveRequests"] });
      toast.success(
        action === "approve"
          ? "Leave request approved!"
          : action === "reject"
          ? "Leave request rejected."
          : "Leave marked as completed / returned.",
      );
      setReviewDialog({ open: false, leave: null, action: "approve" });
    } catch (err: any) {
      toast.error(err?.message || "Failed to update leave status.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenReturnModal = (leave: LeaveRequest) => {
    setReturnDialog({ open: true, leave });
    setNewReturnDate(leave.toDate || today);
  };

  const handleSaveReturnDate = async () => {
    const { leave } = returnDialog;
    if (!leave || !newReturnDate) return;

    setSavingReturnDate(true);
    try {
      await updateLeaveReturnDate(leave.id, newReturnDate);
      queryClient.invalidateQueries({ queryKey: ["leaveRequests"] });
      toast.success("Return date updated successfully!");
      setReturnDialog({ open: false, leave: null });
    } catch (err: any) {
      toast.error(err?.message || "Failed to update return date.");
    } finally {
      setSavingReturnDate(false);
    }
  };

  return (
    <AdminShell
      title="Leave Requests"
      subtitle="Review, approve, and track student hostel leave applications"
    >
      <div className="space-y-6">
        {/* KPI stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-warning-foreground">Pending Approval</p>
            <p className="text-2xl font-bold font-display text-warning mt-1">{pendingCount}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Awaiting admin review</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">Currently on Leave</p>
            <p className="text-2xl font-bold font-display text-primary mt-1">{currentlyOnLeaveCount}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Students out today</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-success">Approved Leaves</p>
            <p className="text-2xl font-bold font-display text-success mt-1">{approvedCount}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Total approved leaves</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Open Return Leaves</p>
            <p className="text-2xl font-bold font-display text-foreground mt-1">{openReturnCount}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Approved without end date</p>
          </div>
        </div>

        {/* Filters and search row */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by student name, admission ID, property, room..."
              className="pl-9 rounded-xl text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status select */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[170px] rounded-xl text-xs h-9">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="rounded-xl text-xs">
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="pending">Pending Approval ({pendingCount})</SelectItem>
                <SelectItem value="currently_on_leave">Currently On Leave ({currentlyOnLeaveCount})</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="completed">Completed / Returned</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* Property select */}
            {uniqueProperties.length > 0 && (
              <Select value={propertyFilter} onValueChange={setPropertyFilter}>
                <SelectTrigger className="w-[160px] rounded-xl text-xs h-9">
                  <SelectValue placeholder="All Properties" />
                </SelectTrigger>
                <SelectContent className="rounded-xl text-xs">
                  <SelectItem value="all">All Properties</SelectItem>
                  {uniqueProperties.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Requests Table / Cards */}
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredLeaves.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center shadow-soft">
            <CalendarOff className="mx-auto mb-3 size-10 text-muted-foreground/40" />
            <h3 className="font-semibold text-base text-foreground">No leave requests found</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
              {query || statusFilter !== "all" || propertyFilter !== "all"
                ? "Try adjusting your search criteria or status filters."
                : "No student leave requests have been submitted yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLeaves.map((leave) => {
              const statusCfg = STATUS_CONFIG[leave.status] || STATUS_CONFIG.pending;
              const StatusIcon = statusCfg.icon;
              const duration = calculateDuration(leave.fromDate, leave.toDate);
              const activeNow = isCurrentlyActive(leave, today);

              return (
                <div
                  key={leave.id}
                  className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-soft hover:border-primary/30 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Student Info & Dates */}
                    <div className="space-y-2 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-base text-foreground font-display">
                          {leave.studentName}
                        </span>
                        <Badge variant="outline" className="text-xs font-mono bg-muted/60">
                          {leave.admissionId}
                        </Badge>
                        <Badge variant="outline" className={`text-xs gap-1.5 px-2.5 py-0.5 ${statusCfg.badgeCls}`}>
                          <StatusIcon className="size-3" />
                          {statusCfg.label}
                        </Badge>
                        {activeNow && (
                          <Badge variant="outline" className="text-xs bg-primary/15 text-primary border-primary/30 font-semibold">
                            Currently Away Today
                          </Badge>
                        )}
                        {leave.hasOpenReturn && (
                          <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 border-amber-500/20">
                            Return Date Open (TBD)
                          </Badge>
                        )}
                      </div>

                      {/* Property & Room details */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        {leave.propertyName && (
                          <span className="flex items-center gap-1">
                            <Home className="size-3.5 text-primary" />
                            {leave.propertyName}
                            {leave.roomNumber ? ` · Room ${leave.roomNumber}` : ""}
                            {leave.bedNumber ? ` (Bed ${leave.bedNumber})` : ""}
                          </span>
                        )}
                        {leave.studentPhone && (
                          <span className="flex items-center gap-1">
                            <Phone className="size-3.5 text-primary" />
                            {leave.studentPhone}
                          </span>
                        )}
                        <span className="text-muted-foreground/80">
                          Submitted: {formatDate(leave.createdAt?.toISOString().slice(0, 10))}
                        </span>
                      </div>

                      {/* Leave Dates Range */}
                      <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base font-bold font-display text-foreground pt-1">
                        <CalendarDays className="size-4 text-primary shrink-0" />
                        <span>{formatDate(leave.fromDate)}</span>
                        <ArrowRight className="size-3.5 text-muted-foreground" />
                        <span className={leave.toDate ? "text-foreground" : "text-amber-600 italic font-semibold"}>
                          {leave.toDate ? formatDate(leave.toDate) : "TBD (Return Date to be filled)"}
                        </span>
                        <span className="text-xs font-normal text-muted-foreground px-2 py-0.5 rounded-full bg-muted">
                          {duration}
                        </span>
                      </div>

                      {/* Reason & Emergency contact */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                        <p className="text-foreground">
                          <span className="font-semibold text-muted-foreground">Reason:</span>{" "}
                          {leave.reason || "Not specified"}
                        </p>
                        {leave.emergencyContact && (
                          <p className="text-foreground">
                            <span className="font-semibold text-muted-foreground">Emergency Contact:</span>{" "}
                            {leave.emergencyContact}
                          </p>
                        )}
                      </div>

                      {/* Admin feedback / review note */}
                      {leave.adminNotes && (
                        <div className="rounded-xl bg-muted/60 p-2.5 text-xs text-foreground mt-2 border border-border">
                          <span className="font-semibold text-muted-foreground">Admin Note:</span> {leave.adminNotes}
                          {leave.reviewedBy && (
                            <span className="text-muted-foreground ml-2">({leave.reviewedBy})</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 shrink-0">
                      {leave.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleOpenReview(leave, "approve")}
                            className="bg-success text-white hover:bg-success/90 rounded-xl text-xs h-8 shadow-soft"
                          >
                            <Check className="size-3.5 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenReview(leave, "reject")}
                            className="border-destructive/40 text-destructive hover:bg-destructive/10 rounded-xl text-xs h-8"
                          >
                            <X className="size-3.5 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}

                      {leave.status === "approved" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenReturnModal(leave)}
                            className="text-xs rounded-xl h-8"
                          >
                            <Calendar className="size-3.5 mr-1 text-primary" />
                            {leave.toDate ? "Change Return Date" : "Set Return Date"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenReview(leave, "complete")}
                            className="text-xs rounded-xl h-8 border-success/30 text-success hover:bg-success/10"
                          >
                            <CalendarCheck className="size-3.5 mr-1" />
                            Mark Returned
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Dialog: Approve / Reject / Complete Confirmation ── */}
      <Dialog
        open={reviewDialog.open}
        onOpenChange={(open) => !open && setReviewDialog({ open: false, leave: null, action: "approve" })}
      >
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              {reviewDialog.action === "approve"
                ? "Approve Leave Request"
                : reviewDialog.action === "reject"
                ? "Reject Leave Request"
                : "Mark Leave as Returned / Completed"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {reviewDialog.leave?.studentName} ({reviewDialog.leave?.admissionId}) · {reviewDialog.leave?.propertyName}
            </DialogDescription>
          </DialogHeader>

          {reviewDialog.leave && (
            <div className="space-y-3 py-2 text-xs">
              <div className="rounded-xl bg-muted/60 p-3 space-y-1">
                <p>
                  <span className="font-semibold text-muted-foreground">Leave Duration:</span>{" "}
                  {formatDate(reviewDialog.leave.fromDate)} →{" "}
                  {reviewDialog.leave.toDate ? formatDate(reviewDialog.leave.toDate) : "Open Return (TBD)"}
                </p>
                <p>
                  <span className="font-semibold text-muted-foreground">Reason:</span>{" "}
                  {reviewDialog.leave.reason}
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="adminNotes" className="text-xs font-semibold">
                  {reviewDialog.action === "reject" ? "Reason for Rejection *" : "Remarks / Admin Note (Optional)"}
                </Label>
                <Textarea
                  id="adminNotes"
                  rows={3}
                  placeholder={
                    reviewDialog.action === "reject"
                      ? "Explain why the leave request is rejected..."
                      : "Optional remarks for the student records..."
                  }
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="rounded-xl text-xs resize-none"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setReviewDialog({ open: false, leave: null, action: "approve" })}
                  className="rounded-xl text-xs"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  disabled={actionLoading || (reviewDialog.action === "reject" && !adminNotes.trim())}
                  onClick={handleConfirmReview}
                  className={`rounded-xl text-xs font-semibold ${
                    reviewDialog.action === "approve"
                      ? "bg-success text-white hover:bg-success/90"
                      : reviewDialog.action === "reject"
                      ? "bg-destructive text-white hover:bg-destructive/90"
                      : "gradient-brand text-white shadow-soft"
                  }`}
                >
                  {actionLoading && <Loader2 className="size-3.5 animate-spin mr-1.5" />}
                  {reviewDialog.action === "approve"
                    ? "Confirm Approval"
                    : reviewDialog.action === "reject"
                    ? "Confirm Rejection"
                    : "Confirm Return"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Dialog: Update Return Date (Admin) ── */}
      <Dialog
        open={returnDialog.open}
        onOpenChange={(open) => !open && setReturnDialog({ open: false, leave: null })}
      >
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">Update Student Return Date</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Record the student's return date for {returnDialog.leave?.studentName}.
            </DialogDescription>
          </DialogHeader>

          {returnDialog.leave && (
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="adminReturnDate" className="text-xs font-semibold">
                  Return Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="adminReturnDate"
                  type="date"
                  required
                  min={returnDialog.leave.fromDate}
                  value={newReturnDate}
                  onChange={(e) => setNewReturnDate(e.target.value)}
                  className="rounded-xl text-sm"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setReturnDialog({ open: false, leave: null })}
                  className="rounded-xl text-xs"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
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
    </AdminShell>
  );
}
