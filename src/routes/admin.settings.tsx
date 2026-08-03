import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Building2, GraduationCap, Loader2, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { AdminShell } from "@/components/nivasi/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import { useColleges, useProperties } from "@/lib/hooks";
import {
  addCollege,
  addProperty,
  seedDefaults,
  setCollegeActive,
  setPropertyActive,
} from "@/lib/db";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Settings — NivasiSpace Admin" },
      { name: "description", content: "Manage colleges, properties and workspace defaults." },
      { property: "og:title", content: "Settings — NivasiSpace Admin" },
      {
        property: "og:description",
        content: "Manage colleges, properties and workspace defaults.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [seeding, setSeeding] = useState(false);

  async function runSeed() {
    setSeeding(true);
    try {
      await seedDefaults();
      await queryClient.invalidateQueries();
      toast.success("Default colleges and packages are ready.");
    } catch {
      toast.error("Could not load the default data.");
    } finally {
      setSeeding(false);
    }
  }

  return (
    <AdminShell title="Settings" subtitle="Workspace configuration for the NivasiSpace team.">
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-soft lg:col-span-2">
          <h2 className="font-display text-base font-bold">Signed-in Account</h2>
          <p className="mt-2 text-sm text-muted-foreground">{user?.email}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Staff accounts are created by an administrator in Firebase Authentication. Self sign-up
            is disabled for this workspace.
          </p>
        </section>

        <section className="rounded-2xl border border-primary/25 bg-brand-soft/60 p-5 shadow-soft lg:col-span-2">
          <h2 className="font-display text-base font-bold">Starter Data</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Load the default NivasiSpace packages and a starter college list. Existing records are
            never overwritten.
          </p>
          <Button className="mt-4" onClick={runSeed} disabled={seeding}>
            {seeding ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            Load Default Packages & Colleges
          </Button>
        </section>

        <CollegesCard />
        <PropertiesCard />
      </div>
    </AdminShell>
  );
}

function CollegesCard() {
  const { data: colleges = [], isLoading } = useColleges();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await addCollege(name.trim());
      await queryClient.invalidateQueries({ queryKey: ["colleges"] });
      setName("");
      toast.success("College added");
    } catch {
      toast.error("Could not add the college.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <h2 className="flex items-center gap-2 font-display text-base font-bold">
        <GraduationCap className="size-4 text-primary" />
        Colleges
      </h2>
      <form onSubmit={add} className="mt-3 flex gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Add a college" />
        <Button type="submit" size="icon" disabled={saving} aria-label="Add college">
          <Plus className="size-4" />
        </Button>
      </form>
      <div className="mt-4 space-y-2">
        {isLoading ? (
          <Skeleton className="h-24 rounded-xl" />
        ) : colleges.length === 0 ? (
          <p className="text-xs text-muted-foreground">No colleges yet.</p>
        ) : (
          colleges.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2"
            >
              <span className="truncate text-sm">{c.collegeName}</span>
              <Switch
                checked={c.active}
                aria-label="College active"
                onCheckedChange={async (v) => {
                  await setCollegeActive(c.id, v);
                  await queryClient.invalidateQueries({ queryKey: ["colleges"] });
                }}
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function PropertiesCard() {
  const { data: properties = [], isLoading } = useProperties();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await addProperty(name.trim());
      await queryClient.invalidateQueries({ queryKey: ["properties"] });
      setName("");
      toast.success("Property added");
    } catch {
      toast.error("Could not add the property.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <h2 className="flex items-center gap-2 font-display text-base font-bold">
        <Building2 className="size-4 text-primary" />
        Properties
      </h2>
      <form onSubmit={add} className="mt-3 flex gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Add a property" />
        <Button type="submit" size="icon" disabled={saving} aria-label="Add property">
          <Plus className="size-4" />
        </Button>
      </form>
      <div className="mt-4 space-y-2">
        {isLoading ? (
          <Skeleton className="h-24 rounded-xl" />
        ) : properties.length === 0 ? (
          <p className="text-xs text-muted-foreground">No properties yet.</p>
        ) : (
          properties.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2"
            >
              <span className="truncate text-sm">{p.propertyName}</span>
              <Switch
                checked={p.active}
                aria-label="Property active"
                onCheckedChange={async (v) => {
                  await setPropertyActive(p.id, v);
                  await queryClient.invalidateQueries({ queryKey: ["properties"] });
                }}
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
