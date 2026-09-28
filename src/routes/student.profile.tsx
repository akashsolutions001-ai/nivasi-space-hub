import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Home,
  GraduationCap,
  Users,
  Utensils,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Pencil,
  FileText,
  Loader2,
  ShieldAlert,
  ArrowRight,
  Info,
  Building,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { useProfileUpdateRequestsForStudent } from "@/lib/hooks";
import { createProfileUpdateRequest, cancelProfileUpdateRequest } from "@/lib/db";
import { formatDate } from "@/lib/format";
import type { Admission, ProfileUpdateRequest } from "@/lib/types";

export const Route = createFileRoute("/student/profile")({
  head: () => ({ meta: [{ title: "My Profile — NivasiSpace" }] }),
  component: StudentProfilePage,
});

const FIELD_LABELS: Record<string, string> = {
  fullName: "Full Name",
  phoneNumber: "Student Phone Number",
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

function StudentProfilePage() {
  const { session, admission, loading } = useStudentAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: updateRequests = [], isLoading: reqLoading } =
    useProfileUpdateRequestsForStudent(admission?.id ?? null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [parentRelation, setParentRelation] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [mealPreference, setMealPreference] = useState<"veg" | "non-veg">("veg");
  const [updateReason, setUpdateReason] = useState("");

  useEffect(() => {
    if (!loading && !session) {
      navigate({ to: "/student/login", replace: true });
    }
  }, [loading, session, navigate]);

  // Populate form with current admission values
  const openEditModal = () => {
    if (!admission) return;
    setFullName(admission.fullName || "");
    setPhoneNumber(admission.phoneNumber || "");
    setEmail(admission.email || session?.email || "");
    setDateOfBirth(admission.dateOfBirth || "");
    setGender(admission.gender || "");
    setAddress(admission.address || "");
    setParentName(admission.parentName || "");
    setParentPhone(admission.parentPhone || "");
    setParentRelation(admission.parentRelation || "");
    setCollegeName(admission.collegeName || "");
    setCourse(admission.course || "");
    setYear(admission.year || "");
    setMealPreference(admission.mealPreference === "non-veg" ? "non-veg" : "veg");
    setUpdateReason("");
    setEditDialogOpen(true);
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admission) return;

    // Detect changed fields
    const proposed: Record<string, any> = {
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email.trim(),
      dateOfBirth: dateOfBirth.trim(),
      gender: gender.trim(),
      address: address.trim(),
      parentName: parentName.trim(),
      parentPhone: parentPhone.trim(),
      parentRelation: parentRelation.trim(),
      collegeName: collegeName.trim(),
      course: course.trim(),
      year: year.trim(),
      mealPreference,
    };

    const currentData: Record<string, any> = {};
    const requestedData: Record<string, any> = {};
    const changedFields: string[] = [];

    for (const [key, val] of Object.entries(proposed)) {
      const origVal = (admission as any)[key] ?? "";
      if (String(val).trim() !== String(origVal).trim()) {
        changedFields.push(key);
        currentData[key] = origVal;
        requestedData[key] = val;
      }
    }

    if (changedFields.length === 0) {
      toast.info("No profile changes detected.");
      return;
    }

    setSubmitting(true);
    try {
      await createProfileUpdateRequest({
        studentId: admission.id,
        admissionId: admission.admissionId,
        studentName: admission.fullName,
        studentEmail: admission.email || session?.email || "",
        propertyName: admission.propertyName,
        roomNumber: admission.roomNumber,
        currentData,
        requestedData,
        changedFields,
        reason: updateReason.trim(),
        status: "pending",
      });

      queryClient.invalidateQueries({ queryKey: ["profileUpdateRequests"] });
      toast.success("Profile update request submitted! Awaiting administrator approval.");
      setEditDialogOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit profile update request.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    if (!confirm("Are you sure you want to cancel this pending update request?")) return;
    try {
      await cancelProfileUpdateRequest(requestId);
      queryClient.invalidateQueries({ queryKey: ["profileUpdateRequests"] });
      toast.success("Profile update request cancelled.");
    } catch (err: any) {
      toast.error(err?.message || "Failed to cancel request.");
    }
  };

  const pendingRequest = updateRequests.find((r) => r.status === "pending");
  const pastRequests = updateRequests.filter((r) => r.status !== "pending");

  if (!admission) {
    return (
      <StudentShell title="My Profile" icon={User}>
        <div className="flex justify-center p-12">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      </StudentShell>
    );
  }

  return (
    <StudentShell
      title="My Profile"
      subtitle="View your complete hostel admission records and submit profile updates for admin confirmation"
      icon={User}
      action={
        <Button
          onClick={openEditModal}
          disabled={Boolean(pendingRequest)}
          className="gradient-brand text-white shadow-soft font-semibold text-xs sm:text-sm gap-2"
        >
          <Pencil className="size-3.5" />
          {pendingRequest ? "Update Pending Approval" : "Request Profile Update"}
        </Button>
      }
    >
      <div className="space-y-4 sm:space-y-6 max-w-5xl">
        {/* Mobile Quick Action Button (< sm) */}
        <div className="sm:hidden">
          <Button
            onClick={openEditModal}
            disabled={Boolean(pendingRequest)}
            className="w-full gradient-brand text-white shadow-soft font-semibold text-sm gap-2 h-11 rounded-xl active:scale-[0.98] transition-transform"
          >
            <Pencil className="size-4" />
            {pendingRequest ? "Profile Update Pending Approval" : "Request Profile Update"}
          </Button>
        </div>

        {/* Pending Request Notice Banner */}
        {pendingRequest && (
          <div className="rounded-2xl border border-warning/40 bg-warning/10 p-4 sm:p-5 shadow-soft">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
              <div className="flex items-start gap-3">
                <Clock className="size-5 text-warning shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-foreground">
                    Profile Update Request Pending Admin Approval
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    You submitted changes on {formatDate(pendingRequest.createdAt?.toISOString().slice(0, 10))}.
                    They will be applied to your admission record once verified by the administrator.
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCancelRequest(pendingRequest.id)}
                className="text-xs rounded-xl border-warning/40 text-foreground hover:bg-warning/20 shrink-0 self-start"
              >
                Cancel Request
              </Button>
            </div>

            {/* Changed Fields Diff — Desktop Table (>= sm) */}
            <div className="mt-4 hidden sm:block rounded-xl border border-warning/30 bg-background/80 overflow-hidden text-xs">
              <div className="grid grid-cols-3 bg-muted/60 px-3 py-2 font-semibold text-muted-foreground border-b border-border">
                <span>Field</span>
                <span>Current Value</span>
                <span>Requested Value</span>
              </div>
              <div className="divide-y divide-border">
                {pendingRequest.changedFields.map((field) => (
                  <div key={field} className="grid grid-cols-3 px-3 py-2 items-center">
                    <span className="font-medium text-foreground">
                      {FIELD_LABELS[field] || field}
                    </span>
                    <span className="text-muted-foreground truncate pr-2">
                      {String((pendingRequest.currentData as any)?.[field] || "—")}
                    </span>
                    <span className="font-semibold text-primary truncate pr-2">
                      {String((pendingRequest.requestedData as any)?.[field] || "—")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Changed Fields Diff — Mobile Cards (< sm) */}
            <div className="mt-3.5 space-y-2 sm:hidden text-xs">
              {pendingRequest.changedFields.map((field) => (
                <div key={field} className="rounded-xl border border-warning/30 bg-background/90 p-3 space-y-1.5">
                  <span className="font-semibold text-foreground text-xs block">
                    {FIELD_LABELS[field] || field}
                  </span>
                  <div className="flex items-center justify-between text-[11px] gap-2">
                    <span className="text-muted-foreground line-through truncate max-w-[45%]">
                      {String((pendingRequest.currentData as any)?.[field] || "—")}
                    </span>
                    <span className="font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-lg truncate max-w-[50%]">
                      {String((pendingRequest.requestedData as any)?.[field] || "—")}
                    </span>
                  </div>
                </div>
              ))}
            </div>


            {pendingRequest.reason && (
              <p className="mt-2.5 text-xs text-muted-foreground italic">
                Reason given: "{pendingRequest.reason}"
              </p>
            )}
          </div>
        )}

        {/* Student Profile Header Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="size-20 rounded-2xl gradient-brand text-white flex items-center justify-center font-display text-2xl font-bold shadow-soft shrink-0">
              {admission.fullName
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase() || "ST"}
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground">
                  {admission.fullName}
                </h2>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs font-mono">
                  {admission.admissionId}
                </Badge>
                <Badge variant="outline" className="bg-success/10 text-success border-success/30 text-xs">
                  Active Student
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1.5">
                  <Mail className="size-3.5 text-primary" />
                  {admission.email || "No email on file"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="size-3.5 text-primary" />
                  {admission.phoneNumber || "No phone on file"}
                </span>
                {admission.gender && (
                  <span className="flex items-center gap-1.5 capitalize">
                    <User className="size-3.5 text-primary" />
                    {admission.gender}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Admission Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Personal & Contact */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <User className="size-4 text-primary" />
              <h3 className="font-bold text-sm text-foreground">Personal & Contact Info</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Full Name</span>
                <span className="text-foreground font-semibold">{admission.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Contact Phone</span>
                <span className="text-foreground font-semibold">{admission.phoneNumber || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Email Address</span>
                <span className="text-foreground font-semibold">{admission.email || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Date of Birth</span>
                <span className="text-foreground font-semibold">
                  {admission.dateOfBirth ? formatDate(admission.dateOfBirth) : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Gender</span>
                <span className="text-foreground font-semibold capitalize">{admission.gender || "—"}</span>
              </div>
              <div className="pt-1">
                <span className="text-muted-foreground font-medium block">Permanent Address</span>
                <p className="text-foreground font-semibold mt-0.5 leading-relaxed">
                  {admission.address || "No address specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Parent / Guardian Info */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <Users className="size-4 text-primary" />
              <h3 className="font-bold text-sm text-foreground">Parent / Guardian Details</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Guardian Name</span>
                <span className="text-foreground font-semibold">{admission.parentName || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Relationship</span>
                <span className="text-foreground font-semibold capitalize">{admission.parentRelation || "Parent"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Guardian Phone</span>
                <span className="text-foreground font-semibold">{admission.parentPhone || "—"}</span>
              </div>
              <div className="rounded-xl bg-brand-soft/60 p-3 text-[11px] text-muted-foreground space-y-1 border border-border">
                <p className="font-semibold text-foreground flex items-center gap-1.5">
                  <Info className="size-3.5 text-primary" />
                  Student Portal Login Note:
                </p>
                <p>
                  Your parent/guardian phone number is also configured as your student portal account password.
                  Updating it will keep hostel contact records accurate.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Academic Information */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <GraduationCap className="size-4 text-primary" />
              <h3 className="font-bold text-sm text-foreground">Academic Information</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">College Name</span>
                <span className="text-foreground font-semibold text-right max-w-[60%]">
                  {admission.collegeName || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Course / Branch</span>
                <span className="text-foreground font-semibold">{admission.course || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Academic Year</span>
                <span className="text-foreground font-semibold">{admission.year || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Admission Date</span>
                <span className="text-foreground font-semibold">
                  {admission.admissionDate ? formatDate(admission.admissionDate) : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Hostel & Services */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <Home className="size-4 text-primary" />
              <h3 className="font-bold text-sm text-foreground">Accommodation & Services</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Hostel Property</span>
                <span className="text-foreground font-semibold">{admission.propertyName || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Room & Bed</span>
                <span className="text-foreground font-semibold">
                  {admission.roomNumber ? `Room ${admission.roomNumber}` : "—"}
                  {admission.bedNumber ? ` · Bed ${admission.bedNumber}` : ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Package Plan</span>
                <span className="text-foreground font-semibold">{admission.packageName || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Meal Preference</span>
                <span className="text-foreground font-semibold capitalize">
                  {admission.mealPreference || "Veg"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block pb-1">Included Services</span>
                <div className="flex flex-wrap gap-1.5">
                  {admission.packageServices && admission.packageServices.length > 0 ? (
                    admission.packageServices.map((svc) => (
                      <Badge key={svc} variant="outline" className="text-[10px] bg-muted/60 border-border">
                        {svc}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground">Standard Package Services</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Request History Section */}
        {pastRequests.length > 0 && (
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-sm text-foreground">Profile Update History</h3>
            <div className="space-y-3">
              {pastRequests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-2xl border border-border bg-card p-4 shadow-soft text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {req.status === "approved" ? (
                        <Badge variant="outline" className="bg-success/15 text-success border-success/30 text-xs gap-1">
                          <CheckCircle2 className="size-3" />
                          Approved
                        </Badge>
                      ) : req.status === "rejected" ? (
                        <Badge variant="outline" className="bg-destructive/15 text-destructive border-destructive/30 text-xs gap-1">
                          <XCircle className="size-3" />
                          Rejected
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-muted text-muted-foreground text-xs">
                          {req.status}
                        </Badge>
                      )}
                      <span className="text-muted-foreground">
                        Submitted {formatDate(req.createdAt?.toISOString().slice(0, 10))}
                      </span>
                    </div>

                    {req.reviewedAt && (
                      <span className="text-[11px] text-muted-foreground">
                        Reviewed {formatDate(req.reviewedAt.toISOString().slice(0, 10))}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-muted-foreground">Fields updated:</span>
                    {req.changedFields.map((f) => (
                      <span key={f} className="font-semibold text-foreground bg-muted px-2 py-0.5 rounded-md">
                        {FIELD_LABELS[f] || f}
                      </span>
                    ))}
                  </div>

                  {req.adminNotes && (
                    <p className="rounded-xl bg-muted/50 p-2 text-foreground">
                      <span className="font-semibold text-muted-foreground">Admin Feedback:</span> {req.adminNotes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Dialog: Request Profile Update ── */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl w-[calc(100vw-1.5rem)] max-h-[88vh] overflow-y-auto rounded-2xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">Request Profile Update</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Submit changes to your admission details. To safeguard official records, changes will be sent to the administrator for review before taking effect.
            </DialogDescription>
          </DialogHeader>

          {/* Alert notice */}
          <div className="rounded-xl bg-brand-soft/70 border border-brand-soft p-3 flex items-start gap-2.5 text-xs text-brand-dark">
            <ShieldAlert className="size-4 text-primary shrink-0 mt-0.5" />
            <p>
              Your requested updates will not directly change your profile until confirmed and approved by your hostel administrator.
            </p>
          </div>

          <form onSubmit={handleCreateRequest} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-xs font-semibold">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="rounded-xl text-sm"
                />
              </div>

              {/* Contact Phone */}
              <div className="space-y-1.5">
                <Label htmlFor="phoneNumber" className="text-xs font-semibold">
                  Student Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  required
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="rounded-xl text-sm"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl text-sm"
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-1.5">
                <Label htmlFor="dob" className="text-xs font-semibold">
                  Date of Birth
                </Label>
                <Input
                  id="dob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="rounded-xl text-sm"
                />
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <Label htmlFor="gender" className="text-xs font-semibold">
                  Gender
                </Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger id="gender" className="rounded-xl text-sm">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Meal Preference */}
              <div className="space-y-1.5">
                <Label htmlFor="mealPref" className="text-xs font-semibold">
                  Meal Preference
                </Label>
                <Select
                  value={mealPreference}
                  onValueChange={(val: "veg" | "non-veg") => setMealPreference(val)}
                >
                  <SelectTrigger id="mealPref" className="rounded-xl text-sm">
                    <SelectValue placeholder="Meal preference" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="veg">Vegetarian</SelectItem>
                    <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Parent Name */}
              <div className="space-y-1.5">
                <Label htmlFor="parentName" className="text-xs font-semibold">
                  Parent / Guardian Name
                </Label>
                <Input
                  id="parentName"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="rounded-xl text-sm"
                />
              </div>

              {/* Parent Phone */}
              <div className="space-y-1.5">
                <Label htmlFor="parentPhone" className="text-xs font-semibold">
                  Parent / Guardian Phone
                </Label>
                <Input
                  id="parentPhone"
                  type="tel"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="rounded-xl text-sm"
                />
              </div>

              {/* Parent Relation */}
              <div className="space-y-1.5">
                <Label htmlFor="parentRel" className="text-xs font-semibold">
                  Parent Relationship
                </Label>
                <Input
                  id="parentRel"
                  placeholder="Father / Mother / Guardian"
                  value={parentRelation}
                  onChange={(e) => setParentRelation(e.target.value)}
                  className="rounded-xl text-sm"
                />
              </div>

              {/* College */}
              <div className="space-y-1.5">
                <Label htmlFor="college" className="text-xs font-semibold">
                  College Name
                </Label>
                <Input
                  id="college"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="rounded-xl text-sm"
                />
              </div>

              {/* Course */}
              <div className="space-y-1.5">
                <Label htmlFor="course" className="text-xs font-semibold">
                  Course / Branch
                </Label>
                <Input
                  id="course"
                  placeholder="e.g. B.Tech Computer Engineering"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="rounded-xl text-sm"
                />
              </div>

              {/* Academic Year */}
              <div className="space-y-1.5">
                <Label htmlFor="year" className="text-xs font-semibold">
                  Year of Study
                </Label>
                <Input
                  id="year"
                  placeholder="e.g. 1st Year, 2nd Year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="rounded-xl text-sm"
                />
              </div>
            </div>

            {/* Permanent Address */}
            <div className="space-y-1.5">
              <Label htmlFor="address" className="text-xs font-semibold">
                Permanent Residential Address
              </Label>
              <Textarea
                id="address"
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="rounded-xl text-sm resize-none"
              />
            </div>

            {/* Reason for change */}
            <div className="space-y-1.5">
              <Label htmlFor="reason" className="text-xs font-semibold">
                Reason for Update (Optional)
              </Label>
              <Textarea
                id="reason"
                rows={2}
                placeholder="Why are you requesting this update? (e.g. Changed contact number, typo in name)"
                value={updateReason}
                onChange={(e) => setUpdateReason(e.target.value)}
                className="rounded-xl text-sm resize-none"
              />
            </div>

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
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
                Submit Request for Admin Approval
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </StudentShell>
  );
}
