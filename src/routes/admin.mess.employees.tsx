import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft, Plus, Loader2, Search, Users, Pencil, ToggleLeft, ToggleRight, X,
} from "lucide-react";
import { toast } from "sonner";

import { AdminShell } from "@/components/nivasi/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useEmployees, useMesses } from "@/lib/hooks";
import { createMessEmployee, updateMessEmployee } from "@/lib/db";
import { isValidIndianMobile, isValidEmail } from "@/lib/format";
import type { MessEmployee } from "@/lib/types";

export const Route = createFileRoute("/admin/mess/employees")({
  head: () => ({ meta: [{ title: "Mess Employees — NivasiSpace Admin" }] }),
  component: MessEmployeesPage,
});

// ── Multi-mess picker ─────────────────────────────────────────────────────────

function MessMultiPicker({
  allMesses,
  selectedIds,
  onChange,
}: {
  allMesses: { id: string; messName: string }[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  function toggle(id: string) {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id],
    );
  }

  return (
    <div className="space-y-2">
      {/* Selected tags */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedIds.map((id) => {
            const m = allMesses.find((x) => x.id === id);
            if (!m) return null;
            return (
              <span
                key={id}
                className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
              >
                {m.messName}
                <button
                  type="button"
                  onClick={() => toggle(id)}
                  className="ml-0.5 rounded-full hover:text-destructive"
                  aria-label={`Remove ${m.messName}`}
                >
                  <X className="size-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}
      {/* Dropdown to add */}
      <Select
        value=""
        onValueChange={(v) => { if (v) toggle(v); }}
      >
        <SelectTrigger>
          <SelectValue placeholder={selectedIds.length === 0 ? "Select mess(es)…" : "Add another mess…"} />
        </SelectTrigger>
        <SelectContent>
          {allMesses
            .filter((m) => !selectedIds.includes(m.id))
            .map((m) => (
              <SelectItem key={m.id} value={m.id}>{m.messName}</SelectItem>
            ))}
          {allMesses.every((m) => selectedIds.includes(m.id)) && (
            <div className="px-3 py-2 text-xs text-muted-foreground">All messes selected</div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

// ── Form dialog ───────────────────────────────────────────────────────────────

interface EmployeeFormProps {
  open: boolean;
  onClose: () => void;
  existing?: MessEmployee;
  messes: { id: string; messName: string }[];
}

function EmployeeFormDialog({ open, onClose, existing, messes }: EmployeeFormProps) {
  const qc = useQueryClient();
  const [name, setName] = useState(existing?.name ?? "");
  const [email, setEmail] = useState(existing?.email ?? "");
  const [phone, setPhone] = useState(existing?.phone ?? "");
  const [password, setPassword] = useState("");
  const [selectedMessIds, setSelectedMessIds] = useState<string[]>(existing?.messIds ?? []);
  const [role, setRole] = useState<"MESS_EMPLOYEE" | "MESS_MANAGER">(existing?.role ?? "MESS_EMPLOYEE");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; password?: string }>({});

  function getMessNames(ids: string[]) {
    return ids.map((id) => messes.find((m) => m.id === id)?.messName ?? "").filter(Boolean);
  }

  function validate() {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Full name is required.";
    else if (name.trim().length < 2) e.name = "Name must be at least 2 characters.";
    if (!existing) {
      if (!email.trim()) e.email = "Email is required.";
      else if (!isValidEmail(email)) e.email = "Enter a valid email address.";
    }
    if (phone.trim() && !isValidIndianMobile(phone))
      e.phone = "Enter a valid 10-digit Indian mobile number.";
    if (!existing) {
      if (!password) e.password = "Password is required.";
      else if (password.length < 6) e.password = "Password must be at least 6 characters.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    if (selectedMessIds.length === 0) {
      toast.error("Assign at least one mess.");
      return;
    }
    setSaving(true);
    try {
      const messNames = getMessNames(selectedMessIds);
      if (existing) {
        await updateMessEmployee(existing.id, {
          name: name.trim(),
          phone: phone.replace(/\D/g, ""),
          messIds: selectedMessIds,
          messNames,
          role,
        });
        toast.success("Employee updated.");
      } else {
        await createMessEmployee({
          name: name.trim(),
          email: email.trim(),
          password,
          phone: phone.replace(/\D/g, ""),
          messIds: selectedMessIds,
          messNames,
          role,
        });
        toast.success(`Employee account created for ${name.trim()}.`);
      }
      await qc.invalidateQueries({ queryKey: ["employees"] });
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save employee.");
    } finally {
      setSaving(false);
    }
  }

  function clearErr(field: keyof typeof errors) {
    setErrors((p) => ({ ...p, [field]: undefined }));
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { setErrors({}); onClose(); } }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{existing ? "Edit Employee" : "Add Employee"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="emp-name">Full Name *</Label>
            <Input id="emp-name" value={name} onChange={(e) => { setName(e.target.value); clearErr("name"); }} placeholder="Rahul Patil" className={errors.name ? "border-destructive" : ""} />
            {errors.name && <p className="text-[11px] text-destructive">{errors.name}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="emp-email">Email *</Label>
            <Input
              id="emp-email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearErr("email"); }}
              placeholder="rahul@example.com"
              disabled={!!existing}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-[11px] text-destructive">{errors.email}</p>}
          </div>
          {!existing && (
            <div className="space-y-1">
              <Label htmlFor="emp-password">Password * (min 6 chars)</Label>
              <Input
                id="emp-password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearErr("password"); }}
                autoComplete="new-password"
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && <p className="text-[11px] text-destructive">{errors.password}</p>}
            </div>
          )}
          <div className="space-y-1">
            <Label htmlFor="emp-phone">Phone</Label>
            <Input
              id="emp-phone"
              value={phone}
              onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); clearErr("phone"); }}
              placeholder="9876543210"
              inputMode="numeric"
              maxLength={10}
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && <p className="text-[11px] text-destructive">{errors.phone}</p>}
          </div>
          <div className="space-y-1">
            <Label>Assigned Mess(es) *</Label>
            <MessMultiPicker
              allMesses={messes}
              selectedIds={selectedMessIds}
              onChange={setSelectedMessIds}
            />
          </div>
          <div className="space-y-1">
            <Label>Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MESS_EMPLOYEE">Mess Employee</SelectItem>
                <SelectItem value="MESS_MANAGER">Mess Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
              {existing ? "Save Changes" : "Create Employee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

function MessEmployeesPage() {
  const qc = useQueryClient();
  const { data: employees = [], isLoading } = useEmployees();
  const { data: messes = [] } = useMesses();

  const [search, setSearch] = useState("");
  const [messFilter, setMessFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<MessEmployee | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const filtered = employees.filter((e) => {
    const matchSearch =
      !search ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.phone.includes(search);
    const matchMess = messFilter === "all" || e.messIds.includes(messFilter);
    return matchSearch && matchMess;
  });

  async function toggleStatus(emp: MessEmployee) {
    setTogglingId(emp.id);
    try {
      await updateMessEmployee(emp.id, { status: emp.status === "active" ? "inactive" : "active" });
      await qc.invalidateQueries({ queryKey: ["employees"] });
      toast.success(`Employee ${emp.status === "active" ? "deactivated" : "activated"}.`);
    } catch {
      toast.error("Could not update status.");
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <AdminShell
      title="Mess Employees"
      subtitle="Manage delivery staff. Each employee can be assigned to multiple messes."
      action={
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/mess">
              <ArrowLeft className="mr-1.5 size-4" /> Back to Messes
            </Link>
          </Button>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="mr-1.5 size-4" /> Add Employee
          </Button>
        </div>
      }
    >
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search name, email, phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={messFilter} onValueChange={setMessFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Filter by mess" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Messes</SelectItem>
            {messes.map((m) => (
              <SelectItem key={m.id} value={m.id}>{m.messName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      <div className="mt-4 space-y-2">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
            <Users className="size-10 text-muted-foreground/40" />
            <p className="text-sm font-medium">
              {search || messFilter !== "all"
                ? "No employees match your filters."
                : "No employees yet."}
            </p>
            {!search && messFilter === "all" && (
              <Button size="sm" onClick={() => setCreateOpen(true)}>
                <Plus className="mr-1.5 size-4" /> Add First Employee
              </Button>
            )}
          </div>
        ) : (
          filtered.map((emp) => (
            <div
              key={emp.id}
              className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-soft"
            >
              <div className="min-w-0 flex-1">
                {/* Name + role + status */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{emp.name}</span>
                  <Badge variant="outline" className="text-[11px]">
                    {emp.role === "MESS_MANAGER" ? "Manager" : "Employee"}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-[11px] ${emp.status === "active" ? "border-success/30 bg-success/10 text-success" : "text-muted-foreground"}`}
                  >
                    {emp.status}
                  </Badge>
                </div>

                {/* Contact */}
                <p className="mt-0.5 text-sm text-muted-foreground">{emp.email}</p>
                {emp.phone && (
                  <p className="text-xs text-muted-foreground">{emp.phone}</p>
                )}

                {/* Assigned messes — pill badges */}
                {emp.messIds.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {emp.messIds.map((id, i) => {
                      const name = emp.messNames[i] ?? messes.find((m) => m.id === id)?.messName ?? id;
                      return (
                        <span
                          key={id}
                          className="rounded-full border border-primary/25 bg-primary/8 px-2 py-0.5 text-[11px] font-medium text-primary"
                        >
                          {name}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex shrink-0 gap-1 pt-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => setEditTarget(emp)}
                  aria-label="Edit"
                >
                  <Pencil className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => toggleStatus(emp)}
                  disabled={togglingId === emp.id}
                  aria-label={emp.status === "active" ? "Deactivate" : "Activate"}
                >
                  {togglingId === emp.id ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : emp.status === "active" ? (
                    <ToggleRight className="size-4 text-success" />
                  ) : (
                    <ToggleLeft className="size-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Dialogs */}
      <EmployeeFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        messes={messes}
      />
      {editTarget && (
        <EmployeeFormDialog
          open={!!editTarget}
          onClose={() => setEditTarget(null)}
          existing={editTarget}
          messes={messes}
        />
      )}
    </AdminShell>
  );
}
