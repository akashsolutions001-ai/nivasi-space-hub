import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  Plus, WashingMachine, Users, User, Phone, Pencil,
  ToggleLeft, ToggleRight, Loader2, Search, UserCheck, Trash2, ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";

import { AdminShell } from "@/components/nivasi/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { useLaundries, useLaundryEmployees, useAdmissions } from "@/lib/hooks";
import { createLaundry, updateLaundry, setLaundryStatus, deleteLaundry } from "@/lib/db";
import { useIsGlobalAdmin } from "@/lib/auth";
import { isValidIndianMobile } from "@/lib/format";
import type { Laundry } from "@/lib/types";

export const Route = createFileRoute("/admin/laundry/")({
  head: () => ({ meta: [{ title: "Laundry Management — NivasiSpace Admin" }] }),
  component: LaundryIndexPage,
});

// ── helpers ───────────────────────────────────────────────────────────────────

function useLaundryStats(
  laundries: Laundry[],
  employees: ReturnType<typeof useLaundryEmployees>["data"],
  admissions: ReturnType<typeof useAdmissions>["data"],
) {
  const empList = employees ?? [];
  const admList = admissions ?? [];
  return laundries.map((l) => ({
    ...l,
    employeeCount: empList.filter((e) => e.laundryIds.includes(l.id)).length,
    studentCount: admList.filter((a) => (a as any).laundryId === l.id).length,
  }));
}

// ── form dialog ───────────────────────────────────────────────────────────────

interface LaundryFormProps { open: boolean; onClose: () => void; existing?: Laundry; }

function LaundryFormDialog({ open, onClose, existing }: LaundryFormProps) {
  const qc = useQueryClient();
  const [laundryName, setLaundryName] = useState(existing?.laundryName ?? "");
  const [ownerName, setOwnerName] = useState(existing?.ownerName ?? "");
  const [ownerPhone, setOwnerPhone] = useState(existing?.ownerPhone ?? "");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ laundryName?: string; ownerPhone?: string }>({});

  function validate() {
    const e: typeof errors = {};
    if (!laundryName.trim()) e.laundryName = "Laundry name is required.";
    if (ownerPhone.trim() && !isValidIndianMobile(ownerPhone))
      e.ownerPhone = "Enter a valid 10-digit Indian mobile number.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const phone = ownerPhone.replace(/\D/g, "");
      if (existing) {
        await updateLaundry(existing.id, { laundryName: laundryName.trim(), ownerName: ownerName.trim(), ownerPhone: phone });
        toast.success("Laundry updated.");
      } else {
        await createLaundry({ laundryId: "", laundryName: laundryName.trim(), ownerName: ownerName.trim(), ownerPhone: phone, status: "active" });
        toast.success("Laundry created.");
      }
      await qc.invalidateQueries({ queryKey: ["laundries"] });
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save laundry.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { setErrors({}); onClose(); } }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{existing ? "Edit Laundry" : "Create Laundry"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="laundryName">Laundry Name *</Label>
            <Input id="laundryName" value={laundryName} onChange={(e) => { setLaundryName(e.target.value); setErrors((p) => ({ ...p, laundryName: undefined })); }} placeholder="e.g. Clean Zone Laundry" className={errors.laundryName ? "border-destructive" : ""} />
            {errors.laundryName && <p className="text-[11px] text-destructive">{errors.laundryName}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="lOwnerName">Owner Name</Label>
            <Input id="lOwnerName" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="e.g. Suresh Patil" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="lOwnerPhone">Owner Phone</Label>
            <Input
              id="lOwnerPhone"
              value={ownerPhone}
              onChange={(e) => { setOwnerPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setErrors((p) => ({ ...p, ownerPhone: undefined })); }}
              placeholder="e.g. 9876543210"
              inputMode="numeric"
              maxLength={10}
              className={errors.ownerPhone ? "border-destructive" : ""}
            />
            {errors.ownerPhone && <p className="text-[11px] text-destructive">{errors.ownerPhone}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
              {existing ? "Save Changes" : "Create Laundry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

function LaundryIndexPage() {
  const qc = useQueryClient();
  const isGlobalAdmin = useIsGlobalAdmin();
  const { data: laundries = [], isLoading } = useLaundries();
  const { data: employees } = useLaundryEmployees();
  const { data: admissions } = useAdmissions();
  const laundryStats = useLaundryStats(laundries, employees, admissions);

  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Laundry | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Laundry | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = laundryStats.filter((l) =>
    !search ||
    l.laundryName.toLowerCase().includes(search.toLowerCase()) ||
    l.ownerName.toLowerCase().includes(search.toLowerCase()),
  );

  async function toggleStatus(l: Laundry) {
    setTogglingId(l.id);
    try {
      await setLaundryStatus(l.id, l.status === "active" ? "inactive" : "active");
      await qc.invalidateQueries({ queryKey: ["laundries"] });
      toast.success(`Laundry ${l.status === "active" ? "deactivated" : "activated"}.`);
    } catch {
      toast.error("Could not update status.");
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteLaundry(deleteTarget.id);
      await qc.invalidateQueries({ queryKey: ["laundries"] });
      toast.success(`"${deleteTarget.laundryName}" deleted.`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete laundry.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AdminShell
      title="Laundry Management"
      subtitle="Manage laundry services, owners, employees and student assignments."
      action={
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/laundry/employees">
              <Users className="mr-1.5 size-4" />
              Employees
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/laundry/assign">
              <UserCheck className="mr-1.5 size-4" />
              Assign Students
            </Link>
          </Button>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="mr-1.5 size-4" />
            New Laundry
          </Button>
        </div>
      }
    >
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search by laundry or owner name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Summary cards */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <p className="text-xs text-muted-foreground">Total Laundries</p>
          <p className="mt-1 text-2xl font-bold">{laundries.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <p className="text-xs text-muted-foreground">Active Laundries</p>
          <p className="mt-1 text-2xl font-bold text-success">{laundries.filter((l) => l.status === "active").length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <p className="text-xs text-muted-foreground">Total Employees</p>
          <p className="mt-1 text-2xl font-bold">{(employees ?? []).length}</p>
        </div>
      </div>

      {/* Laundry cards */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)
        ) : filtered.length === 0 ? (
          <div className="sm:col-span-2 xl:col-span-3">
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
              <WashingMachine className="size-10 text-muted-foreground/40" />
              <p className="text-sm font-medium">
                {search ? "No laundries match your search." : "No laundries yet."}
              </p>
              {!search && (
                <Button size="sm" onClick={() => setCreateOpen(true)}>
                  <Plus className="mr-1.5 size-4" /> Create First Laundry
                </Button>
              )}
            </div>
          </div>
        ) : (
          filtered.map((l) => (
            <div key={l.id} className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-display text-base font-bold">{l.laundryName}</h3>
                  <Badge
                    variant={l.status === "active" ? "default" : "secondary"}
                    className={`mt-1 text-[11px] ${l.status === "active" ? "bg-success/15 text-success border-success/30" : ""}`}
                  >
                    {l.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button variant="ghost" size="icon" className="size-8" onClick={() => setEditTarget(l)} aria-label="Edit laundry">
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost" size="icon" className="size-8"
                    onClick={() => toggleStatus(l)} disabled={togglingId === l.id}
                    aria-label={l.status === "active" ? "Deactivate" : "Activate"}
                  >
                    {togglingId === l.id
                      ? <Loader2 className="size-3.5 animate-spin" />
                      : l.status === "active"
                        ? <ToggleRight className="size-4 text-success" />
                        : <ToggleLeft className="size-4 text-muted-foreground" />}
                  </Button>
                  {isGlobalAdmin && (
                    <Button
                      variant="ghost" size="icon"
                      className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setDeleteTarget(l)} aria-label="Delete laundry"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Owner */}
              <div className="mt-3 space-y-1.5 border-t border-border pt-3">
                {l.ownerName && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate">{l.ownerName}</span>
                  </div>
                )}
                {l.ownerPhone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="size-3.5 shrink-0 text-muted-foreground" />
                    <a href={`tel:${l.ownerPhone}`} className="text-primary hover:underline">{l.ownerPhone}</a>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3">
                <div className="rounded-xl bg-muted/40 px-3 py-2 text-center">
                  <p className="text-xs text-muted-foreground">Students</p>
                  <p className="text-lg font-bold">{l.studentCount}</p>
                </div>
                <div className="rounded-xl bg-muted/40 px-3 py-2 text-center">
                  <p className="text-xs text-muted-foreground">Employees</p>
                  <p className="text-lg font-bold">{l.employeeCount}</p>
                </div>
              </div>

              {/* Action */}
              <Button asChild variant="outline" size="sm" className="mt-3 w-full">
                <Link to="/admin/laundry/$laundryId" params={{ laundryId: l.id }}>
                  View Students
                </Link>
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Dialogs */}
      <LaundryFormDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      {editTarget && (
        <LaundryFormDialog open={!!editTarget} onClose={() => setEditTarget(null)} existing={editTarget} />
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => { if (!v) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ShieldAlert className="size-5 text-destructive" />
              Delete &ldquo;{deleteTarget?.laundryName}&rdquo;?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <span className="block">
                This will permanently delete the laundry from the system. This action{" "}
                <strong>cannot be undone</strong>.
              </span>
              {((deleteTarget as any)?.studentCount ?? 0) > 0 && (
                <span className="block rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  ⚠ This laundry has{" "}
                  <strong>{(deleteTarget as any).studentCount} student(s)</strong> assigned.
                  Consider reassigning them first.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete} disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="mr-2 size-4 animate-spin" />}
              Yes, Delete Laundry
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  );
}
