import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/nivasi/admin-shell";
import { AdmissionForm } from "@/components/nivasi/admission-form";

export const Route = createFileRoute("/admin/admissions/new")({
  head: () => ({
    meta: [
      { title: "New Admission — NivasiSpace Admin" },
      { name: "description", content: "Record a new NivasiSpace student admission end to end." },
      { property: "og:title", content: "New Admission — NivasiSpace Admin" },
      {
        property: "og:description",
        content: "Record a new NivasiSpace student admission end to end.",
      },
    ],
  }),
  component: NewAdmissionPage,
});

function NewAdmissionPage() {
  return (
    <AdminShell
      title="New Admission"
      subtitle="A unique NS-ADM ID is generated automatically when you save."
    >
      <AdmissionForm />
    </AdminShell>
  );
}
