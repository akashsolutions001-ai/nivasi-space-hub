import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { AdminShell } from "@/components/nivasi/admin-shell";
import { AdmissionForm } from "@/components/nivasi/admission-form";
import { EmptyState } from "@/components/nivasi/stat-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAdmission } from "@/lib/db";
import { isFirebaseConfigured } from "@/lib/firebase";

export const Route = createFileRoute("/admin/admissions/$admissionId/edit")({
  head: () => ({
    meta: [
      { title: "Edit Admission — NivasiSpace Admin" },
      { name: "description", content: "Update student, package, payment and item details." },
      { property: "og:title", content: "Edit Admission — NivasiSpace Admin" },
      {
        property: "og:description",
        content: "Update student, package, payment and item details.",
      },
    ],
  }),
  component: EditAdmissionPage,
});

function EditAdmissionPage() {
  const { admissionId } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["admission", admissionId],
    queryFn: () => fetchAdmission(admissionId),
    enabled: isFirebaseConfigured,
  });

  return (
    <AdminShell title="Edit Admission" subtitle={admissionId}>
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-2xl" />
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
        <AdmissionForm existing={data} />
      )}
    </AdminShell>
  );
}
