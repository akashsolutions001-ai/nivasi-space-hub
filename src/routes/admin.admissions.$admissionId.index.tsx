import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AdminShell } from "@/components/nivasi/admin-shell";
import { EmptyState } from "@/components/nivasi/stat-card";
import { ProfileAvatar } from "@/components/nivasi/profile-avatar";
import { MattressBadge, PaymentBadge, StatusPill } from "@/components/nivasi/badges";
import { Button } from "@/components/ui/button";
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
import { isFirebaseConfigured } from "@/lib/firebase";
import { formatDate, formatINR } from "@/lib/format";

export const Route = createFileRoute("/admin/admissions/$admissionId/")({
  head: () => ({
    meta: [
      { title: "Admission Details — NivasiSpace Admin" },
      { name: "description", content: "Full profile, package, payment and item record for a student." },
      { property: "og:title", content: "Admission Details — NivasiSpace Admin" },
      {
        property: "og:description",
        content: "Full profile, package, payment and item record for a student.",
      },
    ],
  }),
  component: AdmissionDetailPage,
});

/* -------------------------------- helpers -------------------------------- */

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

/* ---------------------------------- page --------------------------------- */

function AdmissionDetailPage() {
  const { admissionId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admission", admissionId],
    queryFn: () => fetchAdmission(admissionId),
    enabled: isFirebaseConfigured,
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
              <Button asChild size="sm">
                <Link to="/admin/admissions/$admissionId/edit" params={{ admissionId }}>
                  <Pencil className="size-4" />
                  Edit
                </Link>
              </Button>

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
                      This will permanently remove <strong>{data.fullName}</strong> ({data.admissionId}) from the system. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Yes, Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
                {data.email && <span>✉️ {data.email}</span>}
                {data.gender && <span>👤 {data.gender}</span>}
              </div>
              <div className="mt-2">
                <PaymentBadge status={data.paymentStatus} />
              </div>
            </div>
          </section>

          {/* Personal Details */}
          <Section title="👤 Personal Details">
            <Row label="Full Name" value={data.fullName} />
            <Row label="Phone Number" value={data.phoneNumber} />
            <Row label="Email" value={data.email} />
            <Row label="Gender" value={data.gender} />
            <Row label="Date of Birth" value={formatDate(data.dateOfBirth)} />
          </Section>

          {/* College Details */}
          <Section title="🎓 College Details">
            <Row label="College" value={data.collegeName} />
            <Row label="Course" value={data.course} />
            <Row label="Year" value={data.year} />
          </Section>

          {/* Stay Details */}
          <Section title="🏠 Stay Details">
            <Row label="Property / PG" value={data.propertyName} />
            <Row label="Room Number" value={data.roomNumber} />
            <Row label="Bed Number" value={data.bedNumber} />
            <Row label="Admission Date" value={formatDate(data.admissionDate)} />
            <Row label="Move-in Date" value={formatDate(data.moveInDate)} />
          </Section>

          {/* Package Details */}
          <Section title="📦 Package Allotted">
            <Row label="Package Name" value={data.packageName} />
            <Row
              label="Services Included"
              value={data.packageServices.length ? data.packageServices.join(", ") : "—"}
            />
            <Row label="Package Start" value={formatDate(data.packageStartDate)} />
            <Row label="Package End" value={formatDate(data.packageEndDate)} />
          </Section>

          {/* Payment Details */}
          <Section title="💰 Payment Details">
            <Row label="Total Package Amount" value={formatINR(data.packageAmount)} />
            <Row label="Amount Paid" value={formatINR(data.amountPaid)} />
            <Row
              label="Balance Due"
              value={
                <span className={data.balanceAmount > 0 ? "text-destructive font-bold" : "text-success font-bold"}>
                  {formatINR(data.balanceAmount)}
                </span>
              }
            />
            <Row label="Payment Status" value={<PaymentBadge status={data.paymentStatus} />} />
          </Section>

          {/* Provided Items */}
          <Section title="🎒 Provided Items">
            <div className="flex flex-wrap gap-2 mt-1">
              <StatusPill ok={data.bagProvided} okLabel="Bag Provided" pendingLabel="Bag Pending" />
              <StatusPill ok={data.tiffinProvided} okLabel="Tiffin Provided" pendingLabel="Tiffin Pending" />
              <MattressBadge required={data.mattressRequired} />
            </div>
          </Section>

          {/* Notes */}
          {data.notes && (
            <Section title="📝 Additional Notes">
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {data.notes}
              </p>
            </Section>
          )}

          {/* Meta */}
          <Section title="🕐 Record Info">
            <Row
              label="Created"
              value={data.createdAt ? formatDate(data.createdAt.toISOString()) : "—"}
            />
            <Row
              label="Last Updated"
              value={data.updatedAt ? formatDate(data.updatedAt.toISOString()) : "—"}
            />
          </Section>

        </div>
      )}
    </AdminShell>
  );
}
