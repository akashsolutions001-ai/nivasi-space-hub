import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Loader2, User } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useColleges, usePackages, useProperties, useRooms } from "@/lib/hooks";
import { createAdmission, generateAdmissionId, updateAdmission } from "@/lib/db";
import { addDays, formatINR, isValidIndianMobile, todayISO } from "@/lib/format";
import { SERVICE_OPTIONS, type Admission, type AdmissionInput } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FormState {
  profileImagePath: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  collegeId: string;
  collegeName: string;
  course: string;
  year: string;
  propertyId: string;
  propertyName: string;
  roomNumber: string;
  bedNumber: string;
  admissionDate: string;
  moveInDate: string;
  packageId: string;
  packageName: string;
  packageServices: string[];
  packageAmount: string;
  packageStartDate: string;
  packageEndDate: string;
  amountPaid: string;
  bagProvided: boolean;
  tiffinProvided: boolean;
  mattressRequired: boolean;
  notes: string;
}

function toForm(a?: Admission | null): FormState {
  return {
    profileImagePath: a?.profileImagePath ?? "",
    fullName: a?.fullName ?? "",
    phoneNumber: a?.phoneNumber ?? "",
    email: a?.email ?? "",
    gender: a?.gender ?? "",
    dateOfBirth: a?.dateOfBirth ?? "",
    collegeId: a?.collegeId ?? "",
    collegeName: a?.collegeName ?? "",
    course: a?.course ?? "",
    year: a?.year ?? "",
    propertyId: a?.propertyId ?? "",
    propertyName: a?.propertyName ?? "",
    roomNumber: a?.roomNumber ?? "",
    bedNumber: a?.bedNumber ?? "",
    admissionDate: a?.admissionDate || todayISO(),
    moveInDate: a?.moveInDate ?? "",
    packageId: a?.packageId ?? "",
    packageName: a?.packageName ?? "",
    packageServices: a?.packageServices ?? [],
    packageAmount: a ? String(a.packageAmount) : "",
    packageStartDate: a?.packageStartDate ?? "",
    packageEndDate: a?.packageEndDate ?? "",
    amountPaid: a ? String(a.amountPaid) : "0",
    bagProvided: a?.bagProvided ?? false,
    tiffinProvided: a?.tiffinProvided ?? false,
    mattressRequired: a?.mattressRequired ?? false,
    notes: a?.notes ?? "",
  };
}

function Section({
  title,
  description,
  children,
  highlight,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border p-5 shadow-soft sm:p-6",
        highlight ? "border-primary/30 bg-brand-soft/70" : "border-border bg-card",
      )}
    >
      <h2 className="font-display text-base font-bold">{title}</h2>
      {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-foreground">
        {label} {required && <span className="text-primary">*</span>}
      </Label>
      {children}
      {error && <p className="text-[11px] font-medium text-destructive">{error}</p>}
    </div>
  );
}

const grid = "grid gap-4 sm:grid-cols-2";

export function AdmissionForm({ existing }: { existing?: Admission | null }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: packages = [] } = usePackages();
  const { data: colleges = [] } = useColleges();
  const { data: properties = [] } = useProperties();
  const { data: rooms = [] } = useRooms();

  const [form, setForm] = useState<FormState>(() => toForm(existing));
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);

  // Preview the photo from the public path entered by the user
  const previewSrc = form.profileImagePath.trim() || null;

  const activePackages = useMemo(() => packages.filter((p) => p.active), [packages]);
  const selectedPackage = activePackages.find((p) => p.packageId === form.packageId);
  const isCustom = (selectedPackage?.packageName ?? form.packageName)
    .toLowerCase()
    .includes("custom");

  /**
   * Filter rooms by the selected student gender.
   *
   * Match logic (case-insensitive):
   *  1. If room has a `gender` field — match "male"/"boys" for Male students,
   *     "female"/"girls" for Female, and always show "any"/"co-ed"/"mixed".
   *  2. If no `gender` field — fall back to title keyword matching.
   *  3. If student gender is not set — show all rooms.
   */
  const filteredRooms = useMemo(() => {
    const g = form.gender.toLowerCase();
    if (!g) return rooms; // no gender selected → show all

    return rooms.filter((room) => {
      const roomGender = (room.gender ?? "").toLowerCase();
      const titleLower = room.title.toLowerCase();

      // Always include gender-neutral / co-ed rooms
      const isNeutral = ["any", "co-ed", "mixed", "coed", "unisex"].some(
        (tag) => roomGender === tag || titleLower.includes(tag),
      );
      if (isNeutral) return true;

      if (g === "male") {
        if (roomGender) return ["male", "boys", "boy", "gents", "men"].includes(roomGender);
        // fallback: title keywords
        return (
          titleLower.includes("boy") ||
          titleLower.includes("male") ||
          titleLower.includes("gents") ||
          titleLower.includes("men")
        );
      }

      if (g === "female") {
        if (roomGender) return ["female", "girls", "girl", "ladies", "women"].includes(roomGender);
        // fallback: title keywords
        return (
          titleLower.includes("girl") ||
          titleLower.includes("female") ||
          titleLower.includes("ladies") ||
          titleLower.includes("women")
        );
      }

      // "Other" gender → show all rooms
      return true;
    });
  }, [rooms, form.gender]);

  const amount = Number(form.packageAmount || 0);
  const paid = Number(form.amountPaid || 0);
  const balance = Math.max(0, amount - paid);
  const paymentStatus = amount - paid <= 0 && amount > 0 ? "completed" : "pending";

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onSelectPackage(packageId: string) {
    const pkg = activePackages.find((p) => p.packageId === packageId);
    setForm((prev) => ({
      ...prev,
      packageId,
      packageName: pkg?.packageName ?? "",
      packageServices: pkg?.services ?? [],
      packageAmount: pkg && pkg.price > 0 ? String(pkg.price) : prev.packageAmount,
      packageEndDate:
        prev.packageStartDate && pkg?.duration
          ? addDays(prev.packageStartDate, pkg.duration)
          : prev.packageEndDate,
    }));
  }

  function onStartDate(value: string) {
    setForm((prev) => ({
      ...prev,
      packageStartDate: value,
      packageEndDate:
        value && selectedPackage?.duration
          ? addDays(value, selectedPackage.duration)
          : prev.packageEndDate,
    }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!form.phoneNumber.trim()) next.phoneNumber = "Phone number is required.";
    else if (!isValidIndianMobile(form.phoneNumber))
      next.phoneNumber = "Please enter a valid 10-digit Indian mobile number.";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email.";
    if (!form.collegeName) next.collegeName = "College is required.";
    if (!form.admissionDate) next.admissionDate = "Admission date is required.";
    if (paid < 0) next.amountPaid = "Amount paid cannot be negative.";
    setErrors(next);
    if (Object.keys(next).length) toast.error("Please fix the highlighted fields.");
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    if (!validate()) return;

    setSaving(true);
    try {
      const admissionId = existing?.admissionId ?? (await generateAdmissionId());

      // Use the public path typed by the user (e.g. /Akash/profile.jpg)
      const profileImagePath = form.profileImagePath.trim() || null;
      const profileImageUrl = profileImagePath; // same value — served from /public

      const payload: AdmissionInput = {
        admissionId,
        profileImagePath,
        profileImageUrl,
        fullName: form.fullName.trim(),
        phoneNumber: form.phoneNumber.replace(/\D/g, ""),
        email: form.email.trim(),
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,
        collegeId: form.collegeId,
        collegeName: form.collegeName,
        course: form.course.trim(),
        year: form.year,
        propertyId: form.propertyId,
        propertyName: form.propertyName,
        roomNumber: form.roomNumber.trim(),
        bedNumber: form.bedNumber.trim(),
        admissionDate: form.admissionDate,
        moveInDate: form.moveInDate,
        packageId: form.packageId,
        packageName: form.packageName,
        packageServices: form.packageServices,
        packageAmount: amount,
        packageStartDate: form.packageStartDate,
        packageEndDate: form.packageEndDate,
        amountPaid: paid,
        balanceAmount: balance,
        paymentStatus,
        bagProvided: form.bagProvided,
        tiffinProvided: form.tiffinProvided,
        mattressRequired: form.mattressRequired,
        notes: form.notes.trim(),
      };

      if (existing) {
        await updateAdmission(existing.id, payload);
        await queryClient.invalidateQueries({ queryKey: ["admissions"] });
        toast.success("Admission updated");
        navigate({ to: "/admin/admissions/$admissionId", params: { admissionId } });
        return;
      }

      await createAdmission(payload);
      await queryClient.invalidateQueries({ queryKey: ["admissions"] });
      setSaved(admissionId);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save admission.");
    } finally {
      setSaving(false);
    }
  }

  function resetForNext() {
    setForm(toForm(null));
    setErrors({});
    setSaved(null);
  }

  if (saved) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-success/30 bg-card p-8 text-center shadow-soft">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-success/12 text-success">
          ✓
        </div>
        <h2 className="mt-4 font-display text-xl font-bold">Admission Saved Successfully</h2>
        <p className="mt-1 text-sm text-muted-foreground">Admission ID</p>
        <p className="mt-1 font-mono text-lg font-bold text-primary">{saved}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button
            onClick={() =>
              navigate({ to: "/admin/admissions/$admissionId", params: { admissionId: saved } })
            }
          >
            View Student
          </Button>
          <Button variant="outline" onClick={resetForNext}>
            Add Another Admission
          </Button>
          <Button variant="ghost" onClick={() => navigate({ to: "/admin/dashboard" })}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 pb-4">
      <Section title="Profile Photo" description="Enter the public path to the student's photo (e.g. /Akash/profile.jpg). Place the image inside the public folder.">
        <div className="flex flex-wrap items-center gap-5">
          {/* Live preview */}
          <span className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-full bg-brand-soft ring-1 ring-border">
            {previewSrc ? (
              <img
                src={previewSrc}
                alt="Profile preview"
                className="size-full object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            ) : (
              <User className="size-9 text-primary/50" />
            )}
          </span>
          {/* Path input */}
          <div className="flex-1 min-w-48 space-y-1.5">
            <Label className="text-xs font-semibold">Photo Path</Label>
            <Input
              value={form.profileImagePath}
              onChange={(e) => set("profileImagePath", e.target.value)}
              placeholder="/Akash/profile.jpg"
              className="font-mono text-sm"
            />
            <p className="text-[11px] text-muted-foreground">
              Path is relative to the <code className="font-mono">public/</code> folder.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Student Details">
        <div className={grid}>
          <Field label="Full Name" required error={errors.fullName}>
            <Input
              value={form.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              placeholder="Rahul Sharma"
            />
          </Field>
          <Field label="Phone Number" required error={errors.phoneNumber}>
            <Input
              value={form.phoneNumber}
              inputMode="numeric"
              maxLength={10}
              onChange={(e) => set("phoneNumber", e.target.value.replace(/\D/g, ""))}
              placeholder="9876543210"
            />
          </Field>
          <Field label="Email" error={errors.email}>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="student@example.com"
            />
          </Field>
          <Field label="Gender">
            <Select
              value={form.gender}
              onValueChange={(v) => {
                // Reset property when gender changes — old room may not match new gender
                setForm((prev) => ({
                  ...prev,
                  gender: v,
                  propertyId: "",
                  propertyName: "",
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Date of Birth">
            <DobPicker
              value={form.dateOfBirth}
              onChange={(v) => set("dateOfBirth", v)}
            />
          </Field>
        </div>
      </Section>

      <Section title="College Details">
        <div className={grid}>
          <Field label="College / Institution" required error={errors.collegeName}>
            <Select
              value={form.collegeId || form.collegeName}
              onValueChange={(v) => {
                const c = colleges.find((x) => x.collegeId === v);
                setForm((prev) => ({
                  ...prev,
                  collegeId: c?.collegeId ?? "",
                  collegeName: c?.collegeName ?? v,
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select college" />
              </SelectTrigger>
              <SelectContent>
                {colleges
                  .filter((c) => c.active)
                  .map((c) => (
                    <SelectItem key={c.collegeId} value={c.collegeId}>
                      {c.collegeName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Course">
            <Select value={form.course} onValueChange={(v) => set("course", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="B.Tech Computer Science Engineering">B.Tech Computer Science Engineering</SelectItem>
                <SelectItem value="B.Tech Computer Science & Engineering (AI & ML)">B.Tech CSE (AI &amp; ML)</SelectItem>
                <SelectItem value="B.Tech Computer Science & Engineering (Data Science)">B.Tech CSE (Data Science)</SelectItem>
                <SelectItem value="B.Tech Computer Science & Engineering (Cyber Security)">B.Tech CSE (Cyber Security)</SelectItem>
                <SelectItem value="B.Tech Computer Science & Engineering (IoT)">B.Tech CSE (IoT)</SelectItem>
                <SelectItem value="B.Tech Information Technology">B.Tech Information Technology</SelectItem>
                <SelectItem value="B.Tech Electronics & Communication Engineering">B.Tech Electronics &amp; Communication Engg.</SelectItem>
                <SelectItem value="B.Tech Electronics & Telecommunication Engineering">B.Tech Electronics &amp; Telecom Engg.</SelectItem>
                <SelectItem value="B.Tech Electrical Engineering">B.Tech Electrical Engineering</SelectItem>
                <SelectItem value="B.Tech Electrical & Electronics Engineering">B.Tech Electrical &amp; Electronics Engg.</SelectItem>
                <SelectItem value="B.Tech Mechanical Engineering">B.Tech Mechanical Engineering</SelectItem>
                <SelectItem value="B.Tech Civil Engineering">B.Tech Civil Engineering</SelectItem>
                <SelectItem value="B.Tech Chemical Engineering">B.Tech Chemical Engineering</SelectItem>
                <SelectItem value="B.Tech Biotechnology">B.Tech Biotechnology</SelectItem>
                <SelectItem value="B.Tech Automobile Engineering">B.Tech Automobile Engineering</SelectItem>
                <SelectItem value="B.Tech Aeronautical Engineering">B.Tech Aeronautical Engineering</SelectItem>
                <SelectItem value="B.Tech Agricultural Engineering">B.Tech Agricultural Engineering</SelectItem>
                <SelectItem value="B.Tech Environmental Engineering">B.Tech Environmental Engineering</SelectItem>
                <SelectItem value="B.Tech Production Engineering">B.Tech Production Engineering</SelectItem>
                <SelectItem value="B.Tech Industrial Engineering">B.Tech Industrial Engineering</SelectItem>
                <SelectItem value="B.Tech Mining Engineering">B.Tech Mining Engineering</SelectItem>
                <SelectItem value="B.Tech Metallurgical Engineering">B.Tech Metallurgical Engineering</SelectItem>
                <SelectItem value="B.Tech Instrumentation Engineering">B.Tech Instrumentation Engineering</SelectItem>
                <SelectItem value="B.Tech Textile Engineering">B.Tech Textile Engineering</SelectItem>
                <SelectItem value="B.Tech Petroleum Engineering">B.Tech Petroleum Engineering</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Year">
            <Select value={form.year} onValueChange={(v) => set("year", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"].map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </Section>

      <Section title="Stay Details">
        <div className={grid}>
          <Field label="Property / PG">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  disabled={!form.gender}
                  className="w-full justify-between font-normal"
                >
                  <span className="truncate">
                    {form.propertyId
                      ? (filteredRooms.find((r) => r.id === form.propertyId)?.title ?? form.propertyName)
                      : !form.gender
                        ? "Select gender first"
                        : filteredRooms.length === 0
                          ? "No rooms for this gender"
                          : "Search property / PG…"}
                  </span>
                  <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Type to search rooms…" />
                  <CommandList>
                    <CommandEmpty>No rooms found.</CommandEmpty>
                    <CommandGroup>
                      {filteredRooms.map((r) => (
                        <CommandItem
                          key={r.id}
                          value={`${r.title}${r.rooms ? ` ${r.rooms}` : ""}`}
                          onSelect={() => {
                            setForm((prev) => ({
                              ...prev,
                              propertyId: prev.propertyId === r.id ? "" : r.id,
                              propertyName: prev.propertyId === r.id ? "" : r.title,
                            }));
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 size-4",
                              form.propertyId === r.id ? "opacity-100" : "opacity-0",
                            )}
                          />
                          <span className="flex-1">
                            {r.title}
                            {r.rooms && (
                              <span className="ml-1 text-xs text-muted-foreground">
                                — {r.rooms}
                              </span>
                            )}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {!form.gender && (
              <p className="text-[11px] text-muted-foreground">
                Select a gender above to see matching rooms.
              </p>
            )}
          </Field>
          <Field label="Room Number">
            <Input
              value={form.roomNumber}
              onChange={(e) => set("roomNumber", e.target.value)}
              placeholder="A-204"
            />
          </Field>
          <Field label="Bed Number">
            <Input
              value={form.bedNumber}
              onChange={(e) => set("bedNumber", e.target.value)}
              placeholder="2"
            />
          </Field>
          <Field label="Admission Date" required error={errors.admissionDate}>
            <Input
              type="date"
              value={form.admissionDate}
              onChange={(e) => set("admissionDate", e.target.value)}
            />
          </Field>
          <Field label="Move-in Date">
            <Input
              type="date"
              value={form.moveInDate}
              onChange={(e) => set("moveInDate", e.target.value)}
            />
          </Field>
        </div>
      </Section>

      <Section title="Package Allotted">
        <div className={grid}>
          <Field label="Package" error={errors.packageName}>
            <Select value={form.packageId} onValueChange={onSelectPackage}>
              <SelectTrigger>
                <SelectValue placeholder="Select package" />
              </SelectTrigger>
              <SelectContent>
                {activePackages.map((p) => (
                  <SelectItem key={p.packageId} value={p.packageId}>
                    {p.packageName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Package Start Date">
            <Input
              type="date"
              value={form.packageStartDate}
              onChange={(e) => onStartDate(e.target.value)}
            />
          </Field>
          <Field label="Package End Date">
            <Input
              type="date"
              value={form.packageEndDate}
              onChange={(e) => set("packageEndDate", e.target.value)}
            />
          </Field>
        </div>

        {selectedPackage && (
          <div className="mt-4 rounded-xl border border-border bg-muted/50 p-3 text-xs">
            <p className="font-semibold">{selectedPackage.packageName}</p>
            <p className="mt-1 text-muted-foreground">
              {selectedPackage.services.join(" · ") || "No services listed"}
            </p>
            <p className="mt-1 text-muted-foreground">
              {formatINR(selectedPackage.price)} · {selectedPackage.duration} days
            </p>
          </div>
        )}

        {isCustom && (
          <div className="mt-4 rounded-xl border border-primary/25 bg-brand-soft/60 p-4">
            <p className="text-xs font-semibold">Select Included Services</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {SERVICE_OPTIONS.map((service) => (
                <label key={service} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={form.packageServices.includes(service)}
                    onCheckedChange={(checked) =>
                      set(
                        "packageServices",
                        checked
                          ? [...form.packageServices, service]
                          : form.packageServices.filter((s) => s !== service),
                      )
                    }
                  />
                  {service}
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Selected: {form.packageServices.join(", ") || "None"}
            </p>
          </div>
        )}
      </Section>

      <Section title="Payment Details" highlight>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Total Package Amount ₹" error={errors.packageAmount}>
            <Input
              inputMode="numeric"
              value={form.packageAmount}
              onChange={(e) => set("packageAmount", e.target.value.replace(/[^\d]/g, ""))}
              placeholder="15000"
            />
          </Field>
          <Field label="Amount Paid ₹" error={errors.amountPaid}>
            <Input
              inputMode="numeric"
              value={form.amountPaid}
              onChange={(e) => set("amountPaid", e.target.value.replace(/[^\d]/g, ""))}
              placeholder="0"
            />
          </Field>
          <Field label="Balance Amount ₹">
            <Input value={formatINR(balance)} readOnly className="bg-muted font-semibold" />
          </Field>
        </div>
        <p
          className={cn(
            "mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold",
            paymentStatus === "completed"
              ? "bg-success/12 text-success"
              : "bg-warning/20 text-warning-foreground",
          )}
        >
          {paymentStatus === "completed" ? "✓ Payment Completed" : "⚠ Payment Pending"}
        </p>
      </Section>

      <Section title="Provided Items">
        <div className="grid gap-3 sm:grid-cols-3">
          <ToggleRow
            label="Bag Provided?"
            value={form.bagProvided}
            onChange={(v) => set("bagProvided", v)}
          />
          <ToggleRow
            label="Tiffin Provided?"
            value={form.tiffinProvided}
            onChange={(v) => set("tiffinProvided", v)}
          />
          <ToggleRow
            label="Mattress Required?"
            value={form.mattressRequired}
            onChange={(v) => set("mattressRequired", v)}
          />
        </div>
      </Section>

      <Section title="Additional Notes">
        <Textarea
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          rows={3}
          maxLength={1000}
          placeholder="Student requested mattress before move-in."
        />
      </Section>

      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" variant="ghost" onClick={() => navigate({ to: "/admin/admissions" })}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving} className="min-w-52">
          {saving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving Admission…
            </>
          ) : existing ? (
            "Save Changes →"
          ) : (
            "Save Admission →"
          )}
        </Button>
      </div>
    </form>
  );
}

/* ----------------------------- DobPicker ----------------------------- */

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function DobPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  // value is YYYY-MM-DD or ""
  const parts = value ? value.split("-") : ["", "", ""];
  const year  = parts[0] ?? "";
  const month = parts[1] ?? "";
  const day   = parts[2] ?? "";

  function update(y: string, m: string, d: string) {
    if (y && m && d) onChange(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
    else onChange("");
  }

  const daysInMonth = year && month
    ? new Date(Number(year), Number(month), 0).getDate()
    : 31;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 60 }, (_, i) => currentYear - 5 - i);

  return (
    <div className="grid grid-cols-3 gap-2">
      {/* Day */}
      <Select value={day} onValueChange={(v) => update(year, month, v)}>
        <SelectTrigger><SelectValue placeholder="Day" /></SelectTrigger>
        <SelectContent>
          {Array.from({ length: daysInMonth }, (_, i) => String(i + 1)).map((d) => (
            <SelectItem key={d} value={d}>{d}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Month */}
      <Select value={month} onValueChange={(v) => update(year, v, day)}>
        <SelectTrigger><SelectValue placeholder="Month" /></SelectTrigger>
        <SelectContent>
          {MONTHS.map((m, i) => (
            <SelectItem key={m} value={String(i + 1).padStart(2, "0")}>{m}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Year */}
      <Select value={year} onValueChange={(v) => update(v, month, day)}>
        <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={String(y)}>{y}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <p className="text-xs font-semibold">{label}</p>
      <div className="mt-2 flex gap-2">
        {[true, false].map((option) => (
          <button
            key={String(option)}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
              value === option
                ? "gradient-brand text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent",
            )}
          >
            {option ? "Yes" : "No"}
          </button>
        ))}
      </div>
    </div>
  );
}
