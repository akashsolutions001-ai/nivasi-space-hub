import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  Plus, UtensilsCrossed, Users, User, Phone, Pencil,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { useMesses, useEmployees, useAdmissions } from "@/lib/hooks";
import { createMess, updateMess, setMessStatus, deleteMess } from "@/lib/db";
import { useAuth, useIsGlobalAdmin, useIsMessEmployee } from "@/lib/auth";
import { isValidIndianMobile, isValidEmail } from "@/lib/format";
import type { Mess } from "@/lib/types";

export const Route = createFileRoute("/admin/mess/")({
  head: () => ({
    meta: [{ title: "Mess Management — NivasiSpace Admin" }],
  }),
  component: MessIndexPage,
});

// ── helpers ──────────────────────────────────────────────────────────────────

function useMessStats(messes: Mess[], employees: ReturnType<typeof useEmployees>["data"], admissions: ReturnType<typeof useAdmissions>["data"]) {
  const employeeList = employees ?? [];
  const admissionList = admissions ?? [];
  return messes.map((m) => ({
    ...m,
    employeeCount: employeeList.filter((e) => e.messIds.includes(m.id)).length,
    studentCount: admissionList.filter((a) => (a as any).messId === m.id).length,
  }));
}

// ── form dialog ───────────────────────────────────────────────────────────────

interface MessFormProps {
  open: boolean;
  onClose: () => void;
  existing?: Mess;
}

function MessFormDialog({ open, onClose, existing }: MessFormProps) {
  const qc = useQueryClient();
  const [messName, setMessName] = useState(existing?.messName ?? "");
  const [ownerName, setOwnerName] = useState(existing?.ownerName ?? "");
  const [ownerPhone, setOwnerPhone] = useState(existing?.ownerPhone ?? "");
  const [messDescription, setMessDescription] = useState((existing as any)?.messDescription ?? "");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ messName?: string; ownerPhone?: string }>({});

  function validate() {
    const e: typeof errors = {};
    if (!messName.trim()) e.messName = "Mess name is required.";
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
        await updateMess(existing.id, { messName: messName.trim(), ownerName: ownerName.trim(), ownerPhone: phone, messDescription: messDescription.trim() } as any);
        toast.success("Mess updated.");
      } else {
        await createMess({ messId: "", messName: messName.trim(), ownerName: ownerName.trim(), ownerPhone: phone, status: "active", messDescription: messDescription.trim() } as any);
        toast.success("Mess created.");
      }
      await qc.invalidateQueries({ queryKey: ["messes"] });
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save mess.");
    } finally {
      setSaving(false);
    }
  }

  function handleOpenChange(v: boolean) {
    if (!v) { setErrors({}); onClose(); }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{existing ? "Edit Mess" : "Create Mess"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="messName">Mess Name *</Label>
            <Input id="messName" value={messName} onChange={(e) => { setMessName(e.target.value); setErrors((p) => ({ ...p, messName: undefined })); }} placeholder="e.g. Shree Ganesh Mess" className={errors.messName ? "border-destructive" : ""} />
            {errors.messName && <p className="text-[11px] text-destructive">{errors.messName}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="ownerName">Owner Name</Label>
            <Input id="ownerName" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="e.g. Amit Patil" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="ownerPhone">Owner Phone</Label>
            <Input
              id="ownerPhone"
              value={ownerPhone}
              onChange={(e) => { setOwnerPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setErrors((p) => ({ ...p, ownerPhone: undefined })); }}
              placeholder="e.g. 9876543210"
              inputMode="numeric"
              maxLength={10}
              className={errors.ownerPhone ? "border-destructive" : ""}
            />
            {errors.ownerPhone && <p className="text-[11px] text-destructive">{errors.ownerPhone}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="messDescription">Mess Description</Label>
            <textarea
              id="messDescription"
              value={messDescription}
              onChange={(e) => setMessDescription(e.target.value)}
              placeholder="e.g. Lunch and dinner provided daily. Lunch: 1 PM – 2 PM. Dinner: 8 PM – 9 PM."
              rows={4}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
            <p className="text-[11px] text-muted-foreground">Visible to assigned students and employees.</p>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
              {existing ? "Save Changes" : "Create Mess"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

function MessIndexPage() {
  const qc = useQueryClient();
  const isGlobalAdmin = useIsGlobalAdmin();
  const isMessEmployee = useIsMessEmployee();
  const { employeeMessIds } = useAuth();
  const { data: messes = [], isLoading } = useMesses();
  const { data: employees } = useEmployees();
  const { data: admissions } = useAdmissions();
  const messStats = useMessStats(messes, employees, admissions);

  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Mess | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Mess | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Mess employees only see their assigned messes
  const visibleStats = isMessEmployee
    ? messStats.filter((m) => employeeMessIds.includes(m.id))
    : messStats;

  const filtered = visibleStats.filter((m) =>
    !search || m.messName.toLowerCase().includes(search.toLowerCase()) ||
    m.ownerName.toLowerCase().includes(search.toLowerCase()),
  );

  async function toggleStatus(m: Mess) {
    setTogglingId(m.id);
    try {
      await setMessStatus(m.id, m.status === "active" ? "inactive" : "active");
      await qc.invalidateQueries({ queryKey: ["messes"] });
      toast.success(`Mess ${m.status === "active" ? "deactivated" : "activated"}.`);
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
      await deleteMess(deleteTarget.id);
      await qc.invalidateQueries({ queryKey: ["messes"] });
      toast.success(`"${deleteTarget.messName}" deleted.`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete mess.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AdminShell
      title={isMessEmployee ? "My Messes" : "Mess Management"}
      subtitle={isMessEmployee ? "Your assigned messes and their students." : "Manage messes, owners, employees and student assignments."}
      action={
        !isMessEmployee ? (
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/mess/employees">
                <Users className="mr-1.5 size-4" />
                Employees
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/mess/assign">
                <UserCheck className="mr-1.5 size-4" />
                Assign Students
              </Link>
            </Button>
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <Plus className="mr-1.5 size-4" />
              New Mess
            </Button>
          </div>
        ) : undefined
      }
    >
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search by mess or owner name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Summary cards — admin only */}
      {!isMessEmployee && (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <p className="text-xs text-muted-foreground">Total Messes</p>
            <p className="mt-1 text-2xl font-bold">{messes.length}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <p className="text-xs text-muted-foreground">Active Messes</p>
            <p className="mt-1 text-2xl font-bold text-success">{messes.filter(m => m.status === "active").length}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <p className="text-xs text-muted-foreground">Total Employees</p>
            <p className="mt-1 text-2xl font-bold">{(employees ?? []).length}</p>
          </div>
        </div>
      )}

      {/* Mess cards */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))
        ) : filtered.length === 0 ? (
          <div className="sm:col-span-2 xl:col-span-3">
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
              <UtensilsCrossed className="size-10 text-muted-foreground/40" />
              <p className="text-sm font-medium">
                {search ? "No messes match your search." : "No messes yet."}
              </p>
              {!search && (
                <Button size="sm" onClick={() => setCreateOpen(true)}>
                  <Plus className="mr-1.5 size-4" /> Create First Mess
                </Button>
              )}
            </div>
          </div>
        ) : (
          filtered.map((m) => (
            <div key={m.id} className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-display text-base font-bold">{m.messName}</h3>
                  <Badge
                    variant={m.status === "active" ? "default" : "secondary"}
                    className={`mt-1 text-[11px] ${m.status === "active" ? "bg-success/15 text-success border-success/30" : ""}`}
                  >
                    {m.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>
                {!isMessEmployee && (
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => setEditTarget(m)}
                      aria-label="Edit mess"
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => toggleStatus(m)}
                      disabled={togglingId === m.id}
                      aria-label={m.status === "active" ? "Deactivate" : "Activate"}
                    >
                      {togglingId === m.id
                        ? <Loader2 className="size-3.5 animate-spin" />
                        : m.status === "active"
                          ? <ToggleRight className="size-4 text-success" />
                          : <ToggleLeft className="size-4 text-muted-foreground" />}
                    </Button>
                    {isGlobalAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setDeleteTarget(m)}
                        aria-label="Delete mess"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Owner */}
              <div className="mt-3 space-y-1.5 border-t border-border pt-3">
                {m.ownerName && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate">{m.ownerName}</span>
                  </div>
                )}
                {m.ownerPhone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="size-3.5 shrink-0 text-muted-foreground" />
                    <a href={`tel:${m.ownerPhone}`} className="text-primary hover:underline">{m.ownerPhone}</a>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3">
                <div className="rounded-xl bg-muted/40 px-3 py-2 text-center">
                  <p className="text-xs text-muted-foreground">Students</p>
                  <p className="text-lg font-bold">{m.studentCount}</p>
                </div>
                <div className="rounded-xl bg-muted/40 px-3 py-2 text-center">
                  <p className="text-xs text-muted-foreground">Employees</p>
                  <p className="text-lg font-bold">{m.employeeCount}</p>
                </div>
              </div>

              {/* Action */}
              <Button asChild variant="outline" size="sm" className="mt-3 w-full">
                <Link to="/admin/mess/$messId" params={{ messId: m.id }}>
                  View Students
                </Link>
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Dialogs */}
      <MessFormDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      {editTarget && (
        <MessFormDialog
          open={!!editTarget}
          onClose={() => setEditTarget(null)}
          existing={editTarget}
        />
      )}

      {/* Delete confirmation — global admin only */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => { if (!v) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ShieldAlert className="size-5 text-destructive" />
              Delete &ldquo;{deleteTarget?.messName}&rdquo;?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <span className="block">
                This will permanently delete the mess from the system. This action{" "}
                <strong>cannot be undone</strong>.
              </span>
              {((deleteTarget as any)?.studentCount ?? 0) > 0 && (
                <span className="block rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  ⚠ This mess has{" "}
                  <strong>{(deleteTarget as any).studentCount} student(s)</strong> assigned.
                  Their mess assignment will be orphaned. Consider reassigning them first.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="mr-2 size-4 animate-spin" />}
              Yes, Delete Mess
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  );
}
