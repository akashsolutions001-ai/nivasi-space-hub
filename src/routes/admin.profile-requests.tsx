import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  UserCheck,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Home,
  Mail,
  Phone,
  ArrowRight,
  Check,
  X,
  Loader2,
  AlertCircle,
  FileText,
  User,
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
import { useAllProfileUpdateRequests } from "@/lib/hooks";
import { useAuth } from "@/lib/auth";
import {
  approveProfileUpdateRequest,
  rejectProfileUpdateRequest,
} from "@/lib/db";
import { formatDate } from "@/lib/format";
import type { ProfileUpdateRequest, ProfileUpdateStatus } from "@/lib/types";

export const Route = createFileRoute("/admin/profile-requests")({
  head: () => ({
    meta: [
      { title: "Profile Update Requests — NivasiSpace Admin" },
      { name: "description", content: "Review and approve student profile update requests." },
    ],
  }),
  component: AdminProfileRequestsPage,
});

const FIELD_LABELS: Record<string, string> = {
  fullName: "Full Name",
  phoneNumber: "Student Phone",
  email: "Email Address",
  dateOfBirth: "Date of Birth",
  gender: "Gender",
  address: "Permanent Address",
  parentName: "Parent / Guardian Name",
  parentPhone: "Parent / Guardian Phone",
  parentRelation: "Parent Relationship",
  collegeName: "College Name",
  course: "Course / Branch",
  year: "Academic Year",
  mealPreference: "Meal Preference",
};

const STATUS_CONFIG: Record<
  ProfileUpdateStatus,
  { label: string; icon: React.ComponentType<{ className?: string }>; badgeCls: string }
> = {
  pending: {
    label: "Pending Review",
    icon: Clock,
    badgeCls: "bg-warning/15 text-warning-foreground border-warning/30",
  },
  approved: {
    label: "Approved & Updated",
    icon: CheckCircle2,
    badgeCls: "bg-success/15 text-success border-success/30",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    badgeCls: "bg-destructive/15 text-destructive border-destructive/30",
  },
  cancelled: {
    label: "Cancelled by Student",
    icon: AlertCircle,
    badgeCls: "bg-muted text-muted-foreground border-border",
  },
};

function AdminProfileRequestsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: requests = [], isLoading } = useAllProfileUpdateRequests();

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("pending");

  // Review modal state
  const [reviewDialog, setReviewDialog] = useState<{
    open: boolean;
    request: ProfileUpdateRequest | null;
    action: "approve" | "reject";
  }>({
    open: false,
    request: null,
    action: "approve",
  });
  const [adminNotes, setAdminNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Filtered requests
  const filteredRequests = useMemo(() => {
    const q = query.trim().toLowerCase();
    return requests.filter((req) => {
      // Search
      if (q) {
        const matchesName = req.studentName?.toLowerCase().includes(q);
        const matchesAdmId = req.admissionId?.toLowerCase().includes(q);
        const matchesProp = req.propertyName?.toLowerCase().includes(q);
        const matchesRoom = req.roomNumber?.toLowerCase().includes(q);
        const matchesField = req.changedFields?.some((f) =>
          (FIELD_LABELS[f] || f).toLowerCase().includes(q),
        );
        if (!matchesName && !matchesAdmId && !matchesProp && !matchesRoom && !matchesField) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== "all" && req.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [requests, query, statusFilter]);

  // Counts
  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const rejectedCount = requests.filter((r) => r.status === "rejected").length;

  const handleOpenReview = (request: ProfileUpdateRequest, action: "approve" | "reject") => {
    setReviewDialog({ open: true, request, action });
    setAdminNotes("");
  };

  const handleConfirmReview = async () => {
    const { request, action } = reviewDialog;
    if (!request) return;

    setActionLoading(true);
    try {
      const adminName = user?.displayName || user?.email || "Admin";

      if (action === "approve") {
        await approveProfileUpdateRequest(
          request.id,
          request.studentId,
          request.requestedData,
          adminName,
          adminNotes.trim() || undefined,
        );
        toast.success("Profile update approved! Student admission record has been updated.");
      } else {
        await rejectProfileUpdateRequest(
          request.id,
          adminName,
          adminNotes.trim() || undefined,
        );
        toast.success("Profile update request rejected.");
      }

      queryClient.invalidateQueries({ queryKey: ["profileUpdateRequests"] });
      queryClient.invalidateQueries({ queryKey: ["admissions"] });
      setReviewDialog({ open: false, request: null, action: "approve" });
    } catch (err: any) {
      toast.error(err?.message || "Failed to process profile update request.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminShell
      title="Profile Requests"
      subtitle="Review and confirm student profile update requests before changes apply to admission records"
    >
      <div className="space-y-6">
        {/* KPI stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-warning-foreground">Pending Review</p>
            <p className="text-2xl font-bold font-display text-warning mt-1">{pendingCount}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Awaiting confirmation</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-success">Approved Updates</p>
            <p className="text-2xl font-bold font-display text-success mt-1">{approvedCount}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Applied to admissions</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-destructive">Rejected</p>
            <p className="text-2xl font-bold font-display text-destructive mt-1">{rejectedCount}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Declined requests</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Total Requests</p>
            <p className="text-2xl font-bold font-display text-foreground mt-1">{requests.length}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">All time submissions</p>
          </div>
        </div>

        {/* Search and status filter row */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by student, admission ID, property, field..."
              className="pl-9 rounded-xl text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] rounded-xl text-xs h-9">
                <SelectValue placeholder="Status filter" />
              </SelectTrigger>
              <SelectContent className="rounded-xl text-xs">
                <SelectItem value="pending">Pending Review ({pendingCount})</SelectItem>
                <SelectItem value="all">All Requests ({requests.length})</SelectItem>
                <SelectItem value="approved">Approved ({approvedCount})</SelectItem>
                <SelectItem value="rejected">Rejected ({rejectedCount})</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Requests List */}
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center shadow-soft">
            <UserCheck className="mx-auto mb-3 size-10 text-muted-foreground/40" />
            <h3 className="font-semibold text-base text-foreground">No profile update requests found</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
              {query || statusFilter !== "all"
                ? "No requests match the selected search or status filters."
                : "No student profile update requests have been submitted yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((req) => {
              const statusCfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
              const StatusIcon = statusCfg.icon;

              return (
                <div
                  key={req.id}
                  className="rounded-2xl border border-border bg-card p-5 shadow-soft hover:border-primary/30 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Header: Student & submission meta */}
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-base text-foreground font-display">
                          {req.studentName}
                        </span>
                        <Badge variant="outline" className="text-xs font-mono bg-muted/60">
                          {req.admissionId}
                        </Badge>
                        <Badge variant="outline" className={`text-xs gap-1.5 px-2.5 py-0.5 ${statusCfg.badgeCls}`}>
                          <StatusIcon className="size-3" />
                          {statusCfg.label}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        {req.propertyName && (
                          <span className="flex items-center gap-1">
                            <Home className="size-3.5 text-primary" />
                            {req.propertyName}
                            {req.roomNumber ? ` · Room ${req.roomNumber}` : ""}
                          </span>
                        )}
                        {req.studentEmail && (
                          <span className="flex items-center gap-1">
                            <Mail className="size-3.5 text-primary" />
                            {req.studentEmail}
                          </span>
                        )}
                        <span>
                          Submitted: {formatDate(req.createdAt?.toISOString().slice(0, 10))}
                        </span>
                      </div>

                      {req.reason && (
                        <p className="text-xs text-foreground italic pt-1">
                          <span className="font-semibold text-muted-foreground not-italic">Student Remark:</span>{" "}
                          "{req.reason}"
                        </p>
                      )}
                    </div>

                    {/* Action buttons */}
                    {req.status === "pending" && (
                      <div className="flex items-center gap-2 pt-2 lg:pt-0 shrink-0">
                        <Button
                          size="sm"
                          onClick={() => handleOpenReview(req, "approve")}
                          className="bg-success text-white hover:bg-success/90 rounded-xl text-xs h-8 shadow-soft"
                        >
                          <Check className="size-3.5 mr-1" />
                          Approve & Update
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenReview(req, "reject")}
                          className="border-destructive/40 text-destructive hover:bg-destructive/10 rounded-xl text-xs h-8"
                        >
                          <X className="size-3.5 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Changes Diff Table */}
                  <div className="mt-4 rounded-xl border border-border bg-muted/30 overflow-hidden text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 bg-muted/70 px-4 py-2 font-semibold text-muted-foreground border-b border-border">
                      <span>Field Requested to Change</span>
                      <span>Current Official Record</span>
                      <span>Proposed New Value</span>
                    </div>
                    <div className="divide-y divide-border">
                      {req.changedFields.map((field) => (
                        <div
                          key={field}
                          className="grid grid-cols-1 sm:grid-cols-3 px-4 py-2.5 items-center gap-1 sm:gap-2"
                        >
                          <span className="font-semibold text-foreground">
                            {FIELD_LABELS[field] || field}
                          </span>
                          <span className="text-muted-foreground truncate">
                            {String((req.currentData as any)?.[field] || "—")}
                          </span>
                          <div className="flex items-center gap-1.5 font-bold text-primary">
                            <ArrowRight className="size-3 text-muted-foreground hidden sm:inline" />
                            <span className="bg-primary/10 px-2 py-0.5 rounded text-primary">
                              {String((req.requestedData as any)?.[field] || "—")}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Review audit notes */}
                  {req.adminNotes && (
                    <div className="mt-3 rounded-xl bg-muted/60 p-2.5 text-xs text-foreground border border-border">
                      <span className="font-semibold text-muted-foreground">Admin Feedback:</span> {req.adminNotes}
                      {req.reviewedBy && (
                        <span className="text-muted-foreground ml-2">
                          (Reviewed by {req.reviewedBy} on {formatDate(req.reviewedAt?.toISOString().slice(0, 10))})
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Dialog: Confirm Approval / Rejection ── */}
      <Dialog
        open={reviewDialog.open}
        onOpenChange={(open) => !open && setReviewDialog({ open: false, request: null, action: "approve" })}
      >
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              {reviewDialog.action === "approve"
                ? "Approve Profile Update"
                : "Reject Profile Update"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {reviewDialog.request?.studentName} ({reviewDialog.request?.admissionId})
            </DialogDescription>
          </DialogHeader>

          {reviewDialog.request && (
            <div className="space-y-3 py-2 text-xs">
              {reviewDialog.action === "approve" ? (
                <div className="rounded-xl bg-success/10 border border-success/30 p-3 text-success space-y-1">
                  <p className="font-semibold">Confirm profile update:</p>
                  <p className="text-[11px] text-foreground">
                    Approving will automatically update the student's admission record with all requested changes (
                    {reviewDialog.request.changedFields.map((f) => FIELD_LABELS[f] || f).join(", ")}).
                  </p>
                </div>
              ) : (
                <div className="rounded-xl bg-destructive/10 border border-destructive/30 p-3 text-destructive space-y-1">
                  <p className="font-semibold">Reject profile update:</p>
                  <p className="text-[11px] text-foreground">
                    The requested changes will be declined and will not affect the official admission record.
                  </p>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="reqAdminNotes" className="text-xs font-semibold">
                  {reviewDialog.action === "reject" ? "Reason for Rejection *" : "Admin Remarks (Optional)"}
                </Label>
                <Textarea
                  id="reqAdminNotes"
                  rows={3}
                  placeholder={
                    reviewDialog.action === "reject"
                      ? "Explain why the changes were rejected..."
                      : "Optional note for records..."
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
                  onClick={() => setReviewDialog({ open: false, request: null, action: "approve" })}
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
                      : "bg-destructive text-white hover:bg-destructive/90"
                  }`}
                >
                  {actionLoading && <Loader2 className="size-3.5 animate-spin mr-1.5" />}
                  {reviewDialog.action === "approve"
                    ? "Confirm & Apply Changes"
                    : "Confirm Rejection"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
