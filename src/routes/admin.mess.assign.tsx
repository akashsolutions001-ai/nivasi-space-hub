import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft, Search, UserCheck, Loader2, CheckSquare, Square,
} from "lucide-react";
import { toast } from "sonner";

import { AdminShell } from "@/components/nivasi/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useAdmissions, useMesses } from "@/lib/hooks";
import { assignStudentToMess, updateStudentTiffinStatus } from "@/lib/db";
import type { TiffinStatus } from "@/lib/types";

export const Route = createFileRoute("/admin/mess/assign")({
  head: () => ({ meta: [{ title: "Assign Students to Mess — NivasiSpace Admin" }] }),
  component: MessAssignPage,
});

function MessAssignPage() {
  const qc = useQueryClient();
  const { data: admissions = [], isLoading: admLoading } = useAdmissions();
  const { data: messes = [], isLoading: messLoading } = useMesses();

  const [search, setSearch] = useState("");
  const [messFilter, setMessFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkMessId, setBulkMessId] = useState("");
  const [bulkTiffin, setBulkTiffin] = useState<TiffinStatus>("active");
  const [assigning, setAssigning] = useState(false);
  const [singleAssigning, setSingleAssigning] = useState<string | null>(null);

  const activeMesses = messes.filter((m) => m.status === "active");

  const filtered = useMemo(
    () =>
      admissions.filter((a) => {
        const matchSearch =
          !search ||
          a.fullName.toLowerCase().includes(search.toLowerCase()) ||
          a.phoneNumber.includes(search) ||
          (a.propertyName ?? "").toLowerCase().includes(search.toLowerCase());
        const currentMessId = (a as any).messId ?? "";
        const matchMess =
          messFilter === "all"
            ? true
            : messFilter === "unassigned"
            ? !currentMessId
            : currentMessId === messFilter;
        return matchSearch && matchMess;
      }),
    [admissions, search, messFilter],
  );

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelectedIds(new Set(filtered.map((a) => a.id)));
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  async function assignSingle(studentId: string, messId: string, messName: string, tiffinStatus: TiffinStatus = "active") {
    setSingleAssigning(studentId);
    try {
      await assignStudentToMess(studentId, messId, messName, tiffinStatus);
      await qc.invalidateQueries({ queryKey: ["admissions"] });
      toast.success("Student assigned.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not assign student.");
    } finally {
      setSingleAssigning(null);
    }
  }

  async function assignBulk() {
    if (!bulkMessId) { toast.error("Select a mess to assign to."); return; }
    if (selectedIds.size === 0) { toast.error("Select at least one student."); return; }
    const mess = messes.find((m) => m.id === bulkMessId);
    if (!mess) return;
    setAssigning(true);
    try {
      await Promise.all(
        [...selectedIds].map((id) =>
          assignStudentToMess(id, bulkMessId, mess.messName, bulkTiffin),
        ),
      );
      await qc.invalidateQueries({ queryKey: ["admissions"] });
      toast.success(`${selectedIds.size} student${selectedIds.size > 1 ? "s" : ""} assigned to ${mess.messName}.`);
      setSelectedIds(new Set());
      setBulkMessId("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not complete bulk assignment.");
    } finally {
      setAssigning(false);
    }
  }

  const isLoading = admLoading || messLoading;

  return (
    <AdminShell
      title="Assign Students to Mess"
      subtitle="Link students to a mess and set their tiffin status."
      action={
        <Button asChild variant="outline" size="sm">
          <Link to="/admin/mess">
            <ArrowLeft className="mr-1.5 size-4" /> Back to Messes
          </Link>
        </Button>
      }
    >
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search student name, phone, property…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={messFilter} onValueChange={setMessFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by mess" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Students</SelectItem>
            <SelectItem value="unassigned">Not Assigned</SelectItem>
            {messes.map((m) => (
              <SelectItem key={m.id} value={m.id}>{m.messName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bulk assign bar */}
      {selectedIds.size > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3">
          <span className="text-sm font-medium">{selectedIds.size} selected</span>
          <Select value={bulkMessId} onValueChange={setBulkMessId}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Choose mess" />
            </SelectTrigger>
            <SelectContent>
              {activeMesses.map((m) => (
                <SelectItem key={m.id} value={m.id}>{m.messName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={bulkTiffin} onValueChange={(v) => setBulkTiffin(v as TiffinStatus)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" onClick={assignBulk} disabled={assigning}>
            {assigning && <Loader2 className="mr-1.5 size-4 animate-spin" />}
            <UserCheck className="mr-1.5 size-4" />
            Assign All
          </Button>
          <Button size="sm" variant="ghost" onClick={clearSelection}>Clear</Button>
        </div>
      )}

      {/* Select all row */}
      {filtered.length > 0 && (
        <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
          <button onClick={selectedIds.size === filtered.length ? clearSelection : selectAll} className="flex items-center gap-1.5 hover:text-foreground">
            {selectedIds.size === filtered.length && filtered.length > 0
              ? <CheckSquare className="size-4 text-primary" />
              : <Square className="size-4" />}
            {selectedIds.size === filtered.length && filtered.length > 0 ? "Deselect all" : "Select all"}
          </button>
          <span>·</span>
          <span>{filtered.length} student{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      )}

      {/* Student list */}
      <div className="mt-2 space-y-2">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border py-12 text-center">
            <UserCheck className="size-10 text-muted-foreground/40" />
            <p className="text-sm font-medium">No students found.</p>
          </div>
        ) : (
          filtered.map((student) => {
            const currentMessId = (student as any).messId ?? "";
            const currentMessName = (student as any).messName ?? "";
            const tiffin: TiffinStatus = (student as any).tiffinStatus ?? "active";
            const currentMess = messes.find((m) => m.id === currentMessId);
            const isSelected = selectedIds.has(student.id);

            return (
              <div
                key={student.id}
                className={`flex flex-wrap items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${isSelected ? "border-primary/50 bg-primary/5" : "border-border bg-card"} shadow-soft`}
              >
                {/* Checkbox */}
                <button onClick={() => toggleSelect(student.id)} className="shrink-0" aria-label="Select student">
                  {isSelected
                    ? <CheckSquare className="size-5 text-primary" />
                    : <Square className="size-5 text-muted-foreground" />}
                </button>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{student.fullName}</span>
                    {currentMess ? (
                      <Badge variant="outline" className="text-[11px] border-success/30 bg-success/10 text-success">
                        {currentMess.messName}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[11px] text-muted-foreground">Not Assigned</Badge>
                    )}
                    {currentMessId && (
                      <Badge variant="outline" className={`text-[11px] capitalize ${tiffin === "active" ? "border-success/30 text-success" : tiffin === "paused" ? "border-warning/30 text-warning-foreground" : "border-destructive/20 text-destructive"}`}>
                        Tiffin: {tiffin}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {student.phoneNumber}{student.propertyName ? ` · ${student.propertyName}` : ""}
                  </p>
                </div>

                {/* Quick assign */}
                <div className="flex shrink-0 flex-wrap gap-1.5">
                  {activeMesses.map((m) => (
                    <Button
                      key={m.id}
                      variant={m.id === currentMessId ? "default" : "outline"}
                      size="sm"
                      className="h-7 text-xs"
                      disabled={singleAssigning === student.id}
                      onClick={() => assignSingle(student.id, m.id, m.messName)}
                    >
                      {singleAssigning === student.id && m.id !== currentMessId
                        ? <Loader2 className="size-3 animate-spin" />
                        : null}
                      {m.messName}
                    </Button>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </AdminShell>
  );
}
