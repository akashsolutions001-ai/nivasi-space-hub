import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff, Pencil, Share2, ShieldAlert, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AdminShell } from "@/components/nivasi/admin-shell";
import { EmptyState } from "@/components/nivasi/stat-card";
import { ProfileAvatar } from "@/components/nivasi/profile-avatar";
import { MattressBadge, PaymentBadge, StatusPill } from "@/components/nivasi/badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteAdmission, fetchAdmission } from "@/lib/db";
import { useIsGlobalAdmin } from "@/lib/auth";
import { isFirebaseConfigured } from "@/lib/firebase";
import { formatDate, formatINR } from "@/lib/format";
import type { Admission } from "@/lib/types";

// Global admin credentials for delete confirmation
const GLOBAL_EMAIL    = "Globaladmin@nivasispace.com";
const GLOBAL_PASSWORD = "16Dec@1980NivasiSpace";

export const Route = createFileRoute("/admin/admissions/$admissionId/")({
  head: () => ({
    meta: [
      { title: "Admission Details — NivasiSpace Admin" },
      { name: "description", content: "Full profile, package, payment and item record for a student." },
      { property: "og:title", content: "Admission Details — NivasiSpace Admin" },
      { property: "og:description", content: "Full profile, package, payment and item record for a student." },
    ],
  }),
  component: AdmissionDetailPage,
});

/* ─────────────────── Receipt builder for existing admissions ─────────────────── */

function buildReceiptFromAdmission(a: Admission): string {
  const balance = Math.max(0, a.balanceAmount);
  const status  = a.paymentStatus === "completed" ? "PAID ✅" : "PENDING ⚠️";

  return [
    "━━━━━━━━━━━━━━━━━━━━━━━━",
    "🏠 *NivasiSpace*",
    "   Admission Fee Receipt",
    "━━━━━━━━━━━━━━━━━━━━━━━━",
    `📋 Admission ID : ${a.admissionId}`,
    `📅 Date         : ${a.admissionDate}`,
    "",
    "👤 *Student Details*",
    `   Name    : ${a.fullName}`,
    `   Phone   : ${a.phoneNumber}`,
    ...(a.email  ? [`   Email   : ${a.email}`]  : []),
    ...(a.gender ? [`   Gender  : ${a.gender}`] : []),
    "",
    ...((a as any).parentName ? [
      "👨‍👩‍👧 *Parent / Guardian*",
      `   Name     : ${(a as any).parentName}`,
      ...((a as any).parentPhone    ? [`   Phone    : ${(a as any).parentPhone}`]    : []),
      ...((a as any).parentRelation ? [`   Relation : ${(a as any).parentRelation}`] : []),
      "",
    ] : []),
    "🎓 *College*",
    `   ${a.collegeName}`,
    ...(a.course ? [`   ${a.course}${a.year ? ` — ${a.year}` : ""}`] : []),
    "",
    "🏠 *Stay*",
    `   Property : ${a.propertyName || "—"}`,
    `   Room     : ${a.roomNumber   || "—"}`,
    `   Bed      : ${a.bedNumber    || "—"}`,
    ...(a.moveInDate ? [`   Move-in  : ${a.moveInDate}`] : []),
    "",
    "📦 *Package*",
    `   ${a.packageName || "—"}`,
    ...(a.packageServices.length ? [`   Services : ${a.packageServices.join(", ")}`] : []),
    ...(a.packageStartDate ? [`   Period   : ${a.packageStartDate} → ${a.packageEndDate || "—"}`] : []),
    "",
    "💰 *Payment Summary*",
    `   Total Amount  : ₹${a.packageAmount.toLocaleString("en-IN")}`,
    `   Amount Paid   : ₹${a.amountPaid.toLocaleString("en-IN")}`,
    `   Balance Due   : ₹${balance.toLocaleString("en-IN")}`,
    `   Status        : ${status}`,
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━",
    "Thank you for choosing NivasiSpace! 🙏",
    "━━━━━━━━━━━━━━━━━━━━━━━━",
  ].join("\n");
}

function ShareReceiptPopover({ admission }: { admission: Admission }) {
  const [open, setOpen] = useState(false);
  const text    = buildReceiptFromAdmission(admission);
  const encoded = encodeURIComponent(text);

  const studentPhone = (admission.phoneNumber ?? "").replace(/\D/g, "");
  const parentPhone  = ((admission as any).parentPhone ?? "").replace(/\D/g, "");
  const parentName   = (admission as any).parentName ?? "";

  function downloadPDF() {
    import("@/lib/receipt-pdf").then(({ downloadReceiptPDF }) =>
      downloadReceiptPDF(admission)
    );
    setOpen(false);
  }

  function shareGeneric() {
    if (navigator.share) {
      navigator.share({ title: `Fee Receipt — ${admission.admissionId}`, text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text)
        .then(() => toast.success("Receipt copied to clipboard!"))
        .catch(() => toast.error("Could not copy receipt."));
    }
    setOpen(false);
  }

  function openWhatsApp(phone: string) {
    const num = phone.length === 10 ? `91${phone}` : phone;
    window.open(`https://wa.me/${num}?text=${encoded}`, "_blank");
    setOpen(false);
  }

  return (
    <div className="relative">
      <Button variant="outline" size="sm" onClick={() => setOpen((v) => !v)}>
        <Share2 className="size-4" />
        Share Receipt
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border border-border bg-card p-3 shadow-lift space-y-2">
            <p className="px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Share Fee Receipt
            </p>

            {/* PDF Download */}
            <button
              className="flex w-full items-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              onClick={downloadPDF}
            >
              <span>📄</span> Download Receipt PDF
            </button>

            {/* Copy/Share */}
            <button
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
              onClick={shareGeneric}
            >
              <span>📋</span> Copy / Share Receipt
            </button>

            {studentPhone.length >= 10 && (
              <button
                className="flex w-full items-center gap-2 rounded-xl bg-[#25D366] px-3 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                onClick={() => openWhatsApp(studentPhone)}
              >
                <span>💬</span> WhatsApp Student
              </button>
            )}

            {parentPhone.length >= 10 && (
              <button
                className="flex w-full items-center gap-2 rounded-xl bg-[#128C7E] px-3 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                onClick={() => openWhatsApp(parentPhone)}
              >
                <span>💬</span> WhatsApp Parent{parentName ? ` (${parentName.split(" ")[0]})` : ""}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border/70 py-2.5 last:border-0">
      <span className="text-xs font-medium text-muted-foreground shrink-0">{label}</span>
      <span className="text-right text-sm font-medium break-words">{value || "—"}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <h2 className="font-display text-base font-bold mb-3">{title}</h2>
      {children}
    </section>
  );
}

/** Payment section — all admins see full payment details */
function PaymentSection({
  data,
  isGlobalAdmin,
}: {
  data: { packageAmount: number; amountPaid: number; balanceAmount: number; paymentStatus: "completed" | "pending" };
  isGlobalAdmin: boolean;
}) {
  const [show, setShow] = useState(true);

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-base font-bold">💰 Payment Details</h2>
        {isGlobalAdmin && (
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={show ? "Hide amounts" : "Show amounts"}
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>

      {show ? (
        <>
          <Row label="Total Package Amount" value={formatINR(data.packageAmount)} />
          <Row label="Amount Paid"          value={formatINR(data.amountPaid)} />
          <Row
            label="Balance Due"
            value={
              <span className={data.balanceAmount > 0 ? "text-destructive font-bold" : "text-success font-bold"}>
                {formatINR(data.balanceAmount)}
              </span>
            }
          />
          <Row label="Payment Status" value={<PaymentBadge status={data.paymentStatus} />} />
        </>
      ) : (
        <p className="text-sm text-muted-foreground py-2">Amounts hidden. Click 👁 to reveal.</p>
      )}
    </section>
  );
}

/* ── Global-admin confirmation dialog for delete ── */
function DeleteButton({
  isGlobalAdmin,
  deleting,
  onConfirmedDelete,
  studentName,
  admissionId,
}: {
  isGlobalAdmin: boolean;
  deleting: boolean;
  onConfirmedDelete: () => void;
  studentName: string;
  admissionId: string;
}) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [credError, setCredError] = useState("");

  function handleGlobalAdminConfirm() {
    if (
      email.trim().toLowerCase() === GLOBAL_EMAIL.toLowerCase() &&
      password === GLOBAL_PASSWORD
    ) {
      setCredError("");
      onConfirmedDelete();
    } else {
      setCredError("Incorrect Global Admin credentials. Delete not authorised.");
    }
  }

  if (isGlobalAdmin) {
    // Global admin — simple confirm dialog
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm" disabled={deleting}>
            <Trash2 className="size-4" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this admission?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <strong>{studentName}</strong> ({admissionId}) from the
              system. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmedDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // Normal admin — must enter Global Admin credentials to proceed
  return (
    <AlertDialog onOpenChange={(open) => { if (!open) { setEmail(""); setPassword(""); setCredError(""); } }}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={deleting}>
          <Trash2 className="size-4" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <ShieldAlert className="size-5 text-destructive" />
            Global Admin Approval Required
          </AlertDialogTitle>
          <AlertDialogDescription>
            Deleting <strong>{studentName}</strong> ({admissionId}) requires Global Admin
            authorisation. Enter the Global Admin credentials to proceed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3 py-1">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Global Admin Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Globaladmin@nivasispace.com"
              autoComplete="off"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Global Admin Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="off"
            />
          </div>
          {credError && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
              {credError}
            </p>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {/* Use a plain button — don't close until credentials are verified */}
          <Button
            variant="destructive"
            onClick={handleGlobalAdminConfirm}
            disabled={!email || !password}
          >
            Authorise & Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/* ---------------------------------- page --------------------------------- */

function AdmissionDetailPage() {
  const { admissionId } = Route.useParams();
  const navigate        = useNavigate();
  const queryClient     = useQueryClient();
  const isGlobalAdmin   = useIsGlobalAdmin();
  const [deleting, setDeleting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admission", admissionId],
    queryFn:  () => fetchAdmission(admissionId),
    enabled:  isFirebaseConfigured,
  });

  async function handleDelete() {
    if (!data) return;
    setDeleting(true);
    try {
      await deleteAdmission(data.id);
      await queryClient.invalidateQueries({ queryKey: ["admissions"] });
      toast.success("Admission deleted successfully.");
      navigate({ to: "/admin/admissions", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete admission.");
      setDeleting(false);
    }
  }

  return (
    <AdminShell
      title={data?.fullName ?? "Admission Details"}
      subtitle={admissionId}
      action={
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/admissions">
              <ArrowLeft className="size-4" />
              Back
            </Link>
          </Button>
          {data && (
            <>
              <ShareReceiptPopover admission={data} />

              <Button asChild size="sm">
                <Link to="/admin/admissions/$admissionId/edit" params={{ admissionId }}>
                  <Pencil className="size-4" />
                  Edit
                </Link>
              </Button>

              <DeleteButton
                isGlobalAdmin={isGlobalAdmin}
                deleting={deleting}
                onConfirmedDelete={handleDelete}
                studentName={data.fullName}
                admissionId={data.admissionId}
              />
            </>
          )}
        </div>
      }
    >
      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-52 rounded-2xl" />
          ))}
        </div>
      ) : !data ? (
        <EmptyState
          title="Admission not found"
          description="This admission ID doesn't exist or has been removed."
          action={
            <Button asChild>
              <Link to="/admin/admissions">Back to admissions</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">

          {/* Hero banner */}
          <section className="gradient-brand flex items-center gap-5 rounded-2xl p-6 text-primary-foreground shadow-lift lg:col-span-2">
            <ProfileAvatar
              path={data.profileImagePath}
              name={data.fullName}
              className="size-24 shrink-0 ring-2 ring-white/40"
            />
            <div className="min-w-0 flex-1">
              <p className="font-display text-2xl font-bold leading-tight">{data.fullName}</p>
              <p className="font-mono text-sm opacity-90 mt-0.5">{data.admissionId}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm opacity-90">
                {data.phoneNumber && <span>📞 {data.phoneNumber}</span>}
                {data.email       && <span>✉️ {data.email}</span>}
                {data.gender      && <span>👤 {data.gender}</span>}
              </div>
              <div className="mt-2">
                <PaymentBadge status={data.paymentStatus} />
              </div>
            </div>
          </section>

          <Section title="👤 Personal Details">
            <Row label="Full Name"    value={data.fullName} />
            <Row label="Phone Number" value={data.phoneNumber} />
            <Row label="Email"        value={data.email} />
            <Row label="Gender"       value={data.gender} />
            <Row label="Date of Birth" value={formatDate(data.dateOfBirth)} />
          </Section>

          {((data as any).parentName) && (
            <Section title="👨‍👩‍👧 Parent / Guardian">
              <Row label="Name"     value={(data as any).parentName} />
              <Row label="Phone"    value={(data as any).parentPhone} />
              <Row label="Relation" value={(data as any).parentRelation} />
            </Section>
          )}

          <Section title="🎓 College Details">
            <Row label="College" value={data.collegeName} />
            <Row label="Course"  value={data.course} />
            <Row label="Year"    value={data.year} />
          </Section>

          <Section title="🏠 Stay Details">
            <Row label="Property / PG"  value={data.propertyName} />
            <Row label="Room Number"    value={data.roomNumber} />
            <Row label="Bed Number"     value={data.bedNumber} />
            <Row label="Admission Date" value={formatDate(data.admissionDate)} />
            <Row label="Move-in Date"   value={formatDate(data.moveInDate)} />
          </Section>

          <Section title="📦 Package Allotted">
            <Row label="Package Name"      value={data.packageName} />
            <Row
              label="Services Included"
              value={data.packageServices.length ? data.packageServices.join(", ") : "—"}
            />
            <Row label="Package Start" value={formatDate(data.packageStartDate)} />
            <Row label="Package End"   value={formatDate(data.packageEndDate)} />
          </Section>

          {/* Payment — role-aware component */}
          <PaymentSection data={data} isGlobalAdmin={isGlobalAdmin} />

          <Section title="🎒 Provided Items">
            <div className="flex flex-wrap gap-2 mt-1">
              <StatusPill ok={data.bagProvided}    okLabel="Bag Provided"    pendingLabel="Bag Pending" />
              <StatusPill ok={data.tiffinProvided} okLabel="Tiffin Provided" pendingLabel="Tiffin Pending" />
              <MattressBadge required={data.mattressRequired} />
            </div>
          </Section>

          {data.notes && (
            <Section title="📝 Additional Notes">
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {data.notes}
              </p>
            </Section>
          )}

          <Section title="🕐 Record Info">
            <Row label="Created"      value={data.createdAt ? formatDate(data.createdAt.toISOString())  : "—"} />
            <Row label="Last Updated" value={data.updatedAt ? formatDate(data.updatedAt.toISOString()) : "—"} />
          </Section>

        </div>
      )}
    </AdminShell>
  );
}
