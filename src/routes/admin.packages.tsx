import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Package, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";

import { AdminShell } from "@/components/nivasi/admin-shell";
import { EmptyState } from "@/components/nivasi/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePackages } from "@/lib/hooks";
import { savePackage, setPackageActive } from "@/lib/db";
import { formatINR } from "@/lib/format";
import { SERVICE_OPTIONS, type PackagePlan } from "@/lib/types";

export const Route = createFileRoute("/admin/packages")({
  head: () => ({
    meta: [
      { title: "Packages — NivasiSpace Admin" },
      { name: "description", content: "Create and manage NivasiSpace stay and service packages." },
      { property: "og:title", content: "Packages — NivasiSpace Admin" },
      {
        property: "og:description",
        content: "Create and manage NivasiSpace stay and service packages.",
      },
    ],
  }),
  component: PackagesPage,
});

function PackagesPage() {
  const { data: packages = [], isLoading } = usePackages();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<PackagePlan | null>(null);
  const [open, setOpen] = useState(false);

  async function toggle(pkg: PackagePlan, active: boolean) {
    try {
      await setPackageActive(pkg.id, active);
      await queryClient.invalidateQueries({ queryKey: ["packages"] });
    } catch {
      toast.error("Could not update the package.");
    }
  }

  return (
    <AdminShell
      title="Packages"
      subtitle="Define the stay and service plans staff can assign to students."
      action={
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="size-4" />
          New Package
        </Button>
      }
    >
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-2xl" />
          ))}
        </div>
      ) : packages.length === 0 ? (
        <EmptyState title="No packages yet" description="Create your first package to assign it during admissions." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {packages.map((pkg) => (
            <article
              key={pkg.id}
              className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-brand-soft text-primary">
                  <Package className="size-[18px]" />
                </span>
                <Switch
                  checked={pkg.active}
                  onCheckedChange={(v) => toggle(pkg, v)}
                  aria-label="Package active"
                />
              </div>
              <h2 className="mt-3 font-display text-base font-bold">{pkg.packageName}</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {pkg.services.join(" · ") || "No services listed"}
              </p>
              <p className="mt-3 font-display text-xl font-bold text-primary">
                {pkg.price > 0 ? formatINR(pkg.price) : "Custom pricing"}
              </p>
              <p className="text-xs text-muted-foreground">{pkg.duration} days</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setEditing(pkg);
                  setOpen(true);
                }}
              >
                <Pencil className="size-3.5" />
                Edit
              </Button>
            </article>
          ))}
        </div>
      )}

      <PackageDialog open={open} onOpenChange={setOpen} editing={editing} />
    </AdminShell>
  );
}

function PackageDialog({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: PackagePlan | null;
}) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("30");
  const [services, setServices] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [key, setKey] = useState("");

  const editKey = editing?.id ?? "new";
  if (open && key !== editKey) {
    setKey(editKey);
    setName(editing?.packageName ?? "");
    setPrice(editing ? String(editing.price) : "");
    setDuration(editing ? String(editing.duration) : "30");
    setServices(editing?.services ?? []);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Package name is required.");
      return;
    }
    setSaving(true);
    try {
      await savePackage(
        {
          packageName: name.trim(),
          price: Number(price || 0),
          duration: Number(duration || 30),
          services,
          active: editing?.active ?? true,
        },
        editing?.id,
      );
      await queryClient.invalidateQueries({ queryKey: ["packages"] });
      toast.success(editing ? "Package updated" : "Package created");
      setKey("");
      onOpenChange(false);
    } catch {
      toast.error("Could not save the package.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) setKey("");
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Package" : "New Package"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Package Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Stay + Food" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Price ₹</Label>
              <Input
                inputMode="numeric"
                value={price}
                onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ""))}
                placeholder="0 for custom"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Duration (days)</Label>
              <Input
                inputMode="numeric"
                value={duration}
                onChange={(e) => setDuration(e.target.value.replace(/[^\d]/g, ""))}
              />
            </div>
          </div>
          <div>
            <Label className="text-xs font-semibold">Included Services</Label>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {SERVICE_OPTIONS.map((service) => (
                <label key={service} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={services.includes(service)}
                    onCheckedChange={(checked) =>
                      setServices((prev) =>
                        checked ? [...prev, service] : prev.filter((s) => s !== service),
                      )
                    }
                  />
                  {service}
                </label>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" />}
              {editing ? "Save Changes" : "Create Package"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

