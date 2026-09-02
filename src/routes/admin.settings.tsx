import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  GraduationCap,
  Loader2,
  Lock,
  MapPin,
  Plus,
  Stethoscope,
  UserPlus,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

import { AdminShell } from "@/components/nivasi/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth, useIsGlobalAdmin } from "@/lib/auth";
import { useColleges, useCities } from "@/lib/hooks";
import { isValidEmail } from "@/lib/format";
import {
  addCollege,
  addCity,
  createAdminUser,
  ensureStudentAuthAccount,
  fetchAdmissions,
  setCollegeActive,
  setCityActive,
  updateCollege,
} from "@/lib/db";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Settings — NivasiSpace Admin" },
      { name: "description", content: "Manage colleges, admins and workspace defaults." },
      { property: "og:title", content: "Settings — NivasiSpace Admin" },
      {
        property: "og:description",
        content: "Manage colleges, admins and workspace defaults.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useAuth();
  const isGlobalAdmin = useIsGlobalAdmin();
  const queryClient = useQueryClient();

  return (
    <AdminShell title="Settings" subtitle="Workspace configuration for the NivasiSpace team.">
      <div className="grid gap-4 lg:grid-cols-2">

        {/* Signed-in account */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-soft lg:col-span-2">
          <h2 className="font-display text-base font-bold">Signed-in Account</h2>
          <p className="mt-2 text-sm font-medium">{user?.displayName || "—"}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{user?.email}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Staff accounts are created by an administrator in Firebase Authentication. Self sign-up
            is disabled for this workspace.
          </p>
        </section>

        {/* Global admin-only banner for regular admins */}
        {!isGlobalAdmin && (
          <section className="rounded-2xl border border-dashed border-border bg-muted/30 p-5 lg:col-span-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Lock className="size-4" />
              Some settings below are managed by the Global Admin only.
            </div>
          </section>
        )}



        {/* Cities — global admin only */}
        {isGlobalAdmin && <CitiesCard />}

        {/* Engineering Colleges — global admin only */}
        {isGlobalAdmin && <EngineeringCollegesCard />}

        {/* Medical Colleges — global admin only */}
        {isGlobalAdmin && <MedicalCollegesCard />}

        {/* All Colleges */}
        <CollegesCard isGlobalAdmin={isGlobalAdmin} />

        {/* Add Admin for College — global admin only */}
        {isGlobalAdmin && <AdminUsersCard />}

        {/* Backfill Firebase Auth accounts for existing students — global admin only */}
        {isGlobalAdmin && <BackfillStudentAuthCard />}
      </div>
    </AdminShell>
  );
}

/* ------------------------------------------------------------------ */
/*  Cities card                                                        */
/* ------------------------------------------------------------------ */
function CitiesCard() {
  const { data: cities = [], isLoading } = useCities();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await addCity(name.trim());
      await queryClient.invalidateQueries({ queryKey: ["cities"] });
      setName("");
      toast.success("City added");
    } catch {
      toast.error("Could not add the city.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <h2 className="flex items-center gap-2 font-display text-base font-bold">
        <MapPin className="size-4 text-primary" />
        Cities
      </h2>
      <form onSubmit={add} className="mt-3 flex gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Add a city" />
        <Button type="submit" size="icon" disabled={saving} aria-label="Add city">
          <Plus className="size-4" />
        </Button>
      </form>
      <div className="mt-4 space-y-2">
        {isLoading ? (
          <Skeleton className="h-24 rounded-xl" />
        ) : cities.length === 0 ? (
          <p className="text-xs text-muted-foreground">No cities yet.</p>
        ) : (
          cities.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2"
            >
              <span className="truncate text-sm">{c.cityName}</span>
              <Switch
                checked={c.active}
                aria-label="City active"
                onCheckedChange={async (v) => {
                  await setCityActive(c.id, v);
                  await queryClient.invalidateQueries({ queryKey: ["cities"] });
                }}
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Add Admin for College card                                         */
/* ------------------------------------------------------------------ */
function AdminUsersCard() {
  const { data: colleges = [] } = useColleges();
  const { data: cities = [] } = useCities();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const [saving, setSaving] = useState(false);

  const activeCities = cities.filter((c) => c.active);
  // Filter colleges by selected city; if no city selected show all active
  const filteredColleges = colleges.filter(
    (c) => c.active && (cityFilter === "" || c.city === cityFilter),
  );
  const selectedCollege = colleges.find((c) => c.id === collegeId);

  // When city changes, reset college if it no longer belongs to the new city
  function handleCityChange(val: string) {
    setCityFilter(val);
    const still = colleges.find(
      (c) => c.id === collegeId && (val === "" || c.city === val),
    );
    if (!still) setCollegeId("");
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!displayName.trim() || !email.trim() || !password || !collegeId) {
      toast.error("Please fill in all fields and select a college.");
      return;
    }
    if (!isValidEmail(email)) {
      toast.error("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setSaving(true);
    try {
      await createAdminUser({
        email: email.trim(),
        password,
        displayName: displayName.trim(),
        collegeId,
        collegeName: selectedCollege?.collegeName ?? "",
      });
      setDisplayName("");
      setEmail("");
      setPassword("");
      setCityFilter("");
      setCollegeId("");
      toast.success(`Admin account created for ${displayName.trim()}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create admin account.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <h2 className="flex items-center gap-2 font-display text-base font-bold">
        <UserPlus className="size-4 text-primary" />
        Add Admin for College
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Creates a Firebase Auth account and saves the admin to the users collection.
      </p>
      <form onSubmit={add} className="mt-3 space-y-2">
        <Input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Display name"
          autoComplete="off"
        />
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          type="email"
          autoComplete="off"
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (min 6 characters)"
          type="password"
          autoComplete="new-password"
        />
        {/* City filter — narrows college list */}
        <Select value={cityFilter} onValueChange={handleCityChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by city (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All cities</SelectItem>
            {activeCities.map((c) => (
              <SelectItem key={c.id} value={c.cityName}>
                {c.cityName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* College selector — filtered by city */}
        <div className="flex gap-2">
          <Select value={collegeId} onValueChange={setCollegeId}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder={filteredColleges.length === 0 ? "No colleges for this city" : "Select college"} />
            </SelectTrigger>
            <SelectContent>
              {filteredColleges.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  <span className="flex flex-col">
                    <span>{c.collegeName}</span>
                    {c.city && (
                      <span className="text-[11px] text-muted-foreground">{c.city}</span>
                    )}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" size="icon" disabled={saving} aria-label="Create admin">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          </Button>
        </div>
      </form>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Backfill Firebase Auth accounts for existing students              */
/* ------------------------------------------------------------------ */
function BackfillStudentAuthCard() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{ created: number; exists: number; skipped: number } | null>(null);

  async function run() {
    setRunning(true);
    setResult(null);
    try {
      const admissions = await fetchAdmissions();
      let created = 0, exists = 0, skipped = 0;
      for (const a of admissions) {
        const status = await ensureStudentAuthAccount(a.email ?? "", a.parentPhone ?? "", a.fullName);
        if (status === "created") created++;
        else if (status === "exists") exists++;
        else skipped++;
      }
      setResult({ created, exists, skipped });
      toast.success(`Done — ${created} created, ${exists} already existed, ${skipped} skipped.`);
    } catch {
      toast.error("Failed to backfill student auth accounts.");
    } finally {
      setRunning(false);
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <h2 className="flex items-center gap-2 font-display text-base font-bold">
        <Wrench className="size-4 text-primary" />
        Backfill Student Login Accounts
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Creates Firebase Auth accounts for existing students who don't have one yet.
        Password = parent phone number (digits only). Safe to run multiple times.
      </p>
      <Button size="sm" className="mt-3" onClick={run} disabled={running}>
        {running && <Loader2 className="mr-1.5 size-4 animate-spin" />}
        {running ? "Running…" : "Run Backfill"}
      </Button>
      {result && (
        <p className="mt-2 text-xs text-muted-foreground">
          Created: {result.created} · Already existed: {result.exists} · Skipped: {result.skipped}
        </p>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Engineering colleges card                                          */
/* ------------------------------------------------------------------ */
function EngineeringCollegesCard() {
  const { data: allColleges = [], isLoading } = useColleges();
  const queryClient = useQueryClient();
  const { data: cities = [] } = useCities();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [saving, setSaving] = useState(false);

  const engineering = allColleges.filter((c) => c.collegeType === "engineering");

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await addCollege(name.trim(), "engineering", city);
      await queryClient.invalidateQueries({ queryKey: ["colleges"] });
      setName("");
      setCity("");
      toast.success("Engineering college added");
    } catch {
      toast.error("Could not add the college.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <h2 className="flex items-center gap-2 font-display text-base font-bold">
        <Wrench className="size-4 text-primary" />
        Engineering Colleges
      </h2>
      <form onSubmit={add} className="mt-3 space-y-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="College name" />
        <div className="flex gap-2">
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {cities.filter((c) => c.active).map((c) => (
                <SelectItem key={c.id} value={c.cityName}>{c.cityName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" size="icon" disabled={saving} aria-label="Add engineering college">
            <Plus className="size-4" />
          </Button>
        </div>
      </form>
      <div className="mt-4 space-y-2">
        {isLoading ? (
          <Skeleton className="h-24 rounded-xl" />
        ) : engineering.length === 0 ? (
          <p className="text-xs text-muted-foreground">No engineering colleges yet.</p>
        ) : (
          engineering.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2"
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm">{c.collegeName}</span>
                {c.city && <span className="text-[11px] text-muted-foreground">{c.city}</span>}
              </span>
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

/* ------------------------------------------------------------------ */
/*  Medical colleges card                                              */
/* ------------------------------------------------------------------ */
function MedicalCollegesCard() {
  const { data: allColleges = [], isLoading } = useColleges();
  const queryClient = useQueryClient();
  const { data: cities = [] } = useCities();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [saving, setSaving] = useState(false);

  const medical = allColleges.filter((c) => c.collegeType === "medical");

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await addCollege(name.trim(), "medical", city);
      await queryClient.invalidateQueries({ queryKey: ["colleges"] });
      setName("");
      setCity("");
      toast.success("Medical college added");
    } catch {
      toast.error("Could not add the college.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <h2 className="flex items-center gap-2 font-display text-base font-bold">
        <Stethoscope className="size-4 text-primary" />
        Medical Colleges
      </h2>
      <form onSubmit={add} className="mt-3 space-y-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="College name" />
        <div className="flex gap-2">
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {cities.filter((c) => c.active).map((c) => (
                <SelectItem key={c.id} value={c.cityName}>{c.cityName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" size="icon" disabled={saving} aria-label="Add medical college">
            <Plus className="size-4" />
          </Button>
        </div>
      </form>
      <div className="mt-4 space-y-2">
        {isLoading ? (
          <Skeleton className="h-24 rounded-xl" />
        ) : medical.length === 0 ? (
          <p className="text-xs text-muted-foreground">No medical colleges yet.</p>
        ) : (
          medical.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2"
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm">{c.collegeName}</span>
                {c.city && <span className="text-[11px] text-muted-foreground">{c.city}</span>}
              </span>
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

/* ------------------------------------------------------------------ */
/*  All colleges card                                                  */
/* ------------------------------------------------------------------ */
function CollegesCard({ isGlobalAdmin }: { isGlobalAdmin: boolean }) {
  const { data: colleges = [], isLoading } = useColleges();
  const { data: cities = [] } = useCities();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [collegeType, setCollegeType] = useState<"engineering" | "medical" | "other">("other");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editType, setEditType] = useState<"engineering" | "medical" | "other">("other");
  const [editCity, setEditCity] = useState("");

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await addCollege(name.trim(), collegeType, city);
      await queryClient.invalidateQueries({ queryKey: ["colleges"] });
      setName("");
      setCity("");
      setCollegeType("other");
      toast.success("College added");
    } catch {
      toast.error("Could not add the college.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(c: { id: string; collegeType?: string; city?: string }) {
    setEditingId(c.id);
    setEditType((c.collegeType as "engineering" | "medical" | "other") || "other");
    setEditCity(c.city || "");
  }

  async function saveEdit(id: string) {
    try {
      await updateCollege(id, { collegeType: editType, city: editCity });
      await queryClient.invalidateQueries({ queryKey: ["colleges"] });
      setEditingId(null);
      toast.success("College updated");
    } catch {
      toast.error("Could not update the college.");
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-soft lg:col-span-2">
      <h2 className="flex items-center gap-2 font-display text-base font-bold">
        <GraduationCap className="size-4 text-primary" />
        All Colleges
        {isGlobalAdmin && (
          <span className="ml-auto text-[11px] font-normal text-muted-foreground">
            Click Edit to set type &amp; city on existing colleges
          </span>
        )}
      </h2>

      {isGlobalAdmin && (
        <form onSubmit={add} className="mt-3 space-y-2">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="College name" />
          <div className="flex flex-wrap gap-2">
            <Select value={collegeType} onValueChange={(v) => setCollegeType(v as typeof collegeType)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="flex-1 min-w-32">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {cities.filter((c) => c.active).map((c) => (
                  <SelectItem key={c.id} value={c.cityName}>{c.cityName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit" size="icon" disabled={saving} aria-label="Add college">
              <Plus className="size-4" />
            </Button>
          </div>
        </form>
      )}

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {isLoading ? (
          <Skeleton className="h-24 rounded-xl sm:col-span-2" />
        ) : colleges.length === 0 ? (
          <p className="text-xs text-muted-foreground">No colleges yet.</p>
        ) : (
          colleges.map((c) => (
            <div key={c.id} className="rounded-xl border border-border px-3 py-2">
              {editingId === c.id ? (
                <div className="space-y-2">
                  <p className="truncate text-sm font-semibold">{c.collegeName}</p>
                  <div className="flex flex-wrap gap-2">
                    <Select value={editType} onValueChange={(v) => setEditType(v as typeof editType)}>
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="medical">Medical</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={editCity} onValueChange={setEditCity}>
                      <SelectTrigger className="flex-1 min-w-24 h-9 text-sm">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.filter((c) => c.active).map((c) => (
                          <SelectItem key={c.id} value={c.cityName}>{c.cityName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="h-7 text-xs" onClick={() => saveEdit(c.id)}>Save</Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setEditingId(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm">{c.collegeName}</span>
                    <span className="text-[11px] text-muted-foreground capitalize">
                      {c.collegeType && c.collegeType !== "other" ? c.collegeType : "—"}
                      {c.city ? ` · ${c.city}` : ""}
                    </span>
                  </span>
                  <div className="flex shrink-0 items-center gap-2">
                    {isGlobalAdmin && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs text-muted-foreground"
                        onClick={() => startEdit(c)}
                      >
                        Edit
                      </Button>
                    )}
                    {isGlobalAdmin ? (
                      <Switch
                        checked={c.active}
                        aria-label="College active"
                        onCheckedChange={async (v) => {
                          await setCollegeActive(c.id, v);
                          await queryClient.invalidateQueries({ queryKey: ["colleges"] });
                        }}
                      />
                    ) : (
                      <span className={`text-[11px] font-medium ${c.active ? "text-green-600" : "text-muted-foreground"}`}>
                        {c.active ? "Active" : "Inactive"}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
