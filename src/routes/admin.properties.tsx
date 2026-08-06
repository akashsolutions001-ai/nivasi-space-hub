import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  BedDouble,
  Phone,
  MapPin,
  User,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";

import { AdminShell } from "@/components/nivasi/admin-shell";
import { ProfileAvatar } from "@/components/nivasi/profile-avatar";
import { PaymentBadge } from "@/components/nivasi/badges";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAdmissions, useRooms } from "@/lib/hooks";
import { useAuth, useIsGlobalAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import type { Room } from "@/lib/db";

export const Route = createFileRoute("/admin/properties")({
  head: () => ({
    meta: [
      { title: "Properties — NivasiSpace Admin" },
      { name: "description", content: "View all properties, occupancy and student details." },
      { property: "og:title", content: "Properties — NivasiSpace Admin" },
      { property: "og:description", content: "View all properties, occupancy and student details." },
    ],
  }),
  component: PropertiesPage,
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function normalizeGender(g?: string): "boys" | "girls" | "coed" | null {
  if (!g) return null;
  const v = g.toLowerCase();
  if (["boy", "boys", "male"].includes(v)) return "boys";
  if (["girl", "girls", "female"].includes(v)) return "girls";
  if (["co-ed", "coed", "any"].includes(v)) return "coed";
  return null;
}

function genderLabel(g?: string) {
  const n = normalizeGender(g);
  if (n === "boys")  return "Boys";
  if (n === "girls") return "Girls";
  if (n === "coed")  return "Co-ed";
  return null;
}

/** Extract required student count from note text e.g. "2 Boys Required", "4 GIRLS needed" */
function parseCapacity(note?: string): number | null {
  if (!note) return null;
  const m = (note as string).match(/(\d+)\s*(boy|girl|student|boys|girls|students|required|needed)/i);
  return m && m[1] ? parseInt(m[1], 10) : null;
}

// ─────────────────────────────────────────────────────────────────────────────

function PropertyCard({ room }: { room: Room }) {
  const { data: admissions = [] } = useAdmissions();
  const [expanded, setExpanded] = useState(false);

  const students = useMemo(
    () => admissions.filter((a) => a.propertyId === room.id),
    [admissions, room.id],
  );

  const occupied = students.length;
  const capacity = parseCapacity(room.note);
  const gl       = genderLabel(room.gender);

  return (
    <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
      {/* Header */}
      <div className="p-4">
        {/* Top row: title + badges */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building2 className="size-4" />
          </div>
          <div className="min-w-0">
            <h3 className="font-display font-bold leading-tight">{room.title}</h3>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
              {room.roomType && (
                <Badge variant="secondary" className="text-[10px] h-5">{room.roomType}</Badge>
              )}
              {gl && (
                <Badge
                  variant="outline"
                  className={`text-[10px] h-5 font-semibold
                    ${gl === "Boys"  ? "border-blue-300 text-blue-700 bg-blue-50"  : ""}
                    ${gl === "Girls" ? "border-pink-300 text-pink-700 bg-pink-50"  : ""}
                    ${gl === "Co-ed" ? "border-purple-300 text-purple-700 bg-purple-50" : ""}`}
                >
                  {gl === "Boys" ? "👦" : gl === "Girls" ? "👧" : "👫"} {gl}
                </Badge>
              )}
              {room.rent ? (
                <span className="text-[11px] font-medium text-primary">
                  ₹{room.rent.toLocaleString("en-IN")}/mo
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* 3 stat boxes — full width grid */}
        {(() => {
          const needed    = capacity !== null ? Math.max(0, capacity - occupied) : null;
          const available = capacity !== null ? Math.max(0, capacity - occupied) : null;
          const full      = capacity !== null && occupied >= capacity;
          return (
            <div className="mt-3 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-amber-200 bg-amber-50 py-3 text-center">
                <p className="text-3xl font-black text-amber-600 leading-none">{occupied}</p>
                <p className="mt-1 text-[11px] font-semibold text-amber-700/80 uppercase tracking-wide">Filled</p>
              </div>
              <div className={`rounded-xl border py-3 text-center
                ${capacity === null ? "border-border bg-muted/40" : full ? "border-destructive/30 bg-destructive/10" : "border-emerald-200 bg-emerald-50"}`}>
                <p className={`text-3xl font-black leading-none
                  ${capacity === null ? "text-muted-foreground" : full ? "text-destructive" : "text-emerald-600"}`}>
                  {capacity !== null ? available : "—"}
                </p>
                <p className={`mt-1 text-[11px] font-semibold uppercase tracking-wide
                  ${capacity === null ? "text-muted-foreground" : full ? "text-destructive/70" : "text-emerald-700/80"}`}>
                  {full ? "Full" : "Vacant"}
                </p>
              </div>
              <div className={`rounded-xl border py-3 text-center
                ${needed === null ? "border-border bg-muted/40" : needed === 0 ? "border-destructive/30 bg-destructive/10" : "border-blue-200 bg-blue-50"}`}>
                <p className={`text-3xl font-black leading-none
                  ${needed === null ? "text-muted-foreground" : needed === 0 ? "text-destructive" : "text-blue-600"}`}>
                  {needed ?? "—"}
                </p>
                <p className={`mt-1 text-[11px] font-semibold uppercase tracking-wide
                  ${needed === null ? "text-muted-foreground" : needed === 0 ? "text-destructive/70" : "text-blue-700/80"}`}>
                  Need More
                </p>
              </div>
            </div>
          );
        })()}

        {/* Location & contact */}
        <div className="mt-3 grid gap-1">
          {(room.address || room.city) && (
            <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3.5 mt-0.5 shrink-0 text-primary" />
              <span>{[room.address, room.city].filter(Boolean).join(", ")}</span>
            </div>
          )}
          {room.location && (
            <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3.5 mt-0.5 shrink-0" />
              <span>{room.location}</span>
            </div>
          )}
          {room.contact && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Phone className="size-3.5 shrink-0 text-primary" />
              <a href={`tel:${room.contact}`} className="hover:underline">{room.contact}</a>
            </div>
          )}
          {room.college && (
            <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <User className="size-3.5 mt-0.5 shrink-0" />
              <span>{room.college}</span>
            </div>
          )}
        </div>

        {/* Map link */}
        {room.mapLink && (
          <a
            href={room.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
          >
            <ExternalLink className="size-3" />
            View on Google Maps
          </a>
        )}

        {/* Features */}
        {room.features && room.features.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {room.features.map((f) => (
              <span
                key={f}
                className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wide"
              >
                {f}
              </span>
            ))}
          </div>
        )}

        {/* Note */}
        {room.note && (
          <p className="mt-2 text-[11px] text-muted-foreground italic">{room.note}</p>
        )}
      </div>

      {/* Student list toggle */}
      <div className="border-t border-border">
        <button
          className="flex w-full items-center justify-between px-5 py-3 text-sm font-medium hover:bg-muted/40 transition-colors"
          onClick={() => setExpanded((v) => !v)}
        >
          <span>Students ({students.length}){capacity !== null ? ` / ${capacity} capacity` : ""}</span>
          {expanded
            ? <ChevronUp className="size-4 text-muted-foreground" />
            : <ChevronDown className="size-4 text-muted-foreground" />}
        </button>

        {expanded && (
          <div className="px-5 pb-5">
            {students.length === 0 ? (
              <p className="py-3 text-sm text-muted-foreground">No students assigned to this property.</p>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border">
                {/* Desktop table */}
                <table className="hidden w-full text-sm lg:table">
                  <thead className="bg-muted/60 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 w-8">Sr</th>
                      <th className="px-3 py-2">Student</th>
                      <th className="px-3 py-2">Admission ID</th>
                      <th className="px-3 py-2">Room / Bed</th>
                      <th className="px-3 py-2">Year</th>
                      <th className="px-3 py-2">College</th>
                      <th className="px-3 py-2">Contact</th>
                      <th className="px-3 py-2">Payment</th>
                      <th className="px-3 py-2">Move-in</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s, idx) => (
                      <tr key={s.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                        <td className="px-3 py-2 text-xs text-muted-foreground">{idx + 1}</td>
                        <td className="px-3 py-2">
                          <Link
                            to="/admin/admissions/$admissionId"
                            params={{ admissionId: s.admissionId }}
                            className="flex items-center gap-2 hover:underline"
                          >
                            <ProfileAvatar path={s.profileImagePath} name={s.fullName} className="size-7 shrink-0" />
                            <div>
                              <p className="font-semibold leading-tight">{s.fullName}</p>
                              {s.email && <p className="text-[11px] text-muted-foreground">{s.email}</p>}
                            </div>
                          </Link>
                        </td>
                        <td className="px-3 py-2 font-mono text-xs text-primary">{s.admissionId}</td>
                        <td className="px-3 py-2 text-xs">
                          {s.roomNumber ? `Room ${s.roomNumber}` : "—"}
                          {s.bedNumber ? ` · Bed ${s.bedNumber}` : ""}
                        </td>
                        <td className="px-3 py-2 text-xs">{s.year || "—"}</td>
                        <td className="px-3 py-2 text-xs text-muted-foreground max-w-[160px] truncate">{s.collegeName || "—"}</td>
                        <td className="px-3 py-2 text-xs">{s.phoneNumber || "—"}</td>
                        <td className="px-3 py-2"><PaymentBadge status={s.paymentStatus} /></td>
                        <td className="px-3 py-2 text-xs text-muted-foreground">
                          {formatDate(s.moveInDate ?? s.admissionDate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Mobile cards */}
                <div className="lg:hidden divide-y divide-border">
                  {students.map((s, idx) => (
                    <Link
                      key={s.id}
                      to="/admin/admissions/$admissionId"
                      params={{ admissionId: s.admissionId }}
                      className="flex gap-3 p-3 hover:bg-muted/30 transition-colors"
                    >
                      <span className="mt-1 w-5 shrink-0 text-xs font-semibold text-muted-foreground">{idx + 1}</span>
                      <ProfileAvatar path={s.profileImagePath} name={s.fullName} className="size-9 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold truncate">{s.fullName}</p>
                        <p className="font-mono text-[11px] text-primary">{s.admissionId}</p>
                        {s.email && <p className="text-[11px] text-muted-foreground truncate">{s.email}</p>}
                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
                          {s.phoneNumber && <span>📞 {s.phoneNumber}</span>}
                          {s.year && <span>Year {s.year}</span>}
                          {s.roomNumber && <span>Room {s.roomNumber}{s.bedNumber ? ` · Bed ${s.bedNumber}` : ""}</span>}
                        </div>
                        <div className="mt-1.5">
                          <PaymentBadge status={s.paymentStatus} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function PropertiesPage() {
  const { data: allRooms = [], isLoading } = useRooms();
  const { data: admissions = [] } = useAdmissions();
  const isGlobalAdmin = useIsGlobalAdmin();
  const { user, collegeFilter } = useAuth();
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState<"all" | "boys" | "girls" | "coed">("all");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // ── Step 1: verified + paid rooms only ────────────────────────────────────
  const verifiedRooms = useMemo(
    () => allRooms.filter(
      (r) => r.verificationStatus === "verified" && r.paymentStatus === "paid",
    ),
    [allRooms],
  );

  // ── Step 2: college-scoped rooms ──────────────────────────────────────────
  const adminCollege = useMemo(() => {
    if (isGlobalAdmin) return collegeFilter.college ?? "";
    return user?.displayName ?? "";
  }, [isGlobalAdmin, collegeFilter.college, user?.displayName]);

  const rooms = useMemo(() => {
    if (!adminCollege) return verifiedRooms;
    const col = adminCollege.trim().toLowerCase();
    return verifiedRooms.filter((r) =>
      (r.college ?? "").trim().toLowerCase() === col,
    );
  }, [verifiedRooms, adminCollege]);

  // Helper: student count per room
  function studentCount(r: Room) {
    return admissions.filter((a) => a.propertyId === r.id).length;
  }

  // ── Derived counts ────────────────────────────────────────────────────────
  const genderCounts = useMemo(() => ({
    all:   rooms.length,
    boys:  rooms.filter((r) => normalizeGender(r.gender) === "boys").length,
    girls: rooms.filter((r) => normalizeGender(r.gender) === "girls").length,
    coed:  rooms.filter((r) => normalizeGender(r.gender) === "coed").length,
  }), [rooms]);

  const genderFiltered = useMemo(() => {
    if (genderFilter === "all") return rooms;
    return rooms.filter((r) => normalizeGender(r.gender) === genderFilter);
  }, [rooms, genderFilter]);

  const statusTypeCounts = useMemo(() => {
    const vacant   = genderFiltered.filter((r) => studentCount(r) === 0).length;
    const occupied = genderFiltered.filter((r) => studentCount(r) > 0).length;
    const types    = [...new Set(genderFiltered.map((r) => r.roomType).filter(Boolean))] as string[];
    return { vacant, occupied, types };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genderFiltered, admissions]);

  const totalStudentsAssigned = useMemo(
    () => admissions.filter((a) => a.propertyId && a.propertyId !== "").length,
    [admissions],
  );

  // ── Final filtered list ───────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = genderFiltered;

    if (activeFilter === "vacant")        list = list.filter((r) => studentCount(r) === 0);
    else if (activeFilter === "occupied") list = list.filter((r) => studentCount(r) > 0);
    else if (activeFilter.startsWith("type:")) {
      const t = activeFilter.slice(5);
      list = list.filter((r) => r.roomType === t);
    }

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          (r.city ?? "").toLowerCase().includes(q) ||
          (r.contact ?? "").toLowerCase().includes(q) ||
          (r.college ?? "").toLowerCase().includes(q),
      );
    }

    // Sort: vacant first, then by title
    return [...list].sort((a, b) => {
      const aOcc = studentCount(a);
      const bOcc = studentCount(b);
      if (aOcc === 0 && bOcc > 0) return -1;
      if (aOcc > 0 && bOcc === 0) return 1;
      return a.title.localeCompare(b.title);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genderFiltered, admissions, search, activeFilter]);

  const GENDER_TABS: { key: "all" | "boys" | "girls" | "coed"; label: string; emoji: string; cls: string }[] = [
    { key: "all",   label: "All",    emoji: "🏠", cls: "border-primary/40 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground" },
    { key: "boys",  label: "Boys",   emoji: "👦", cls: "border-blue-300  data-[active=true]:bg-blue-500  data-[active=true]:text-white" },
    { key: "girls", label: "Girls",  emoji: "👧", cls: "border-pink-300  data-[active=true]:bg-pink-500  data-[active=true]:text-white" },
    { key: "coed",  label: "Co-ed",  emoji: "👫", cls: "border-purple-300 data-[active=true]:bg-purple-500 data-[active=true]:text-white" },
  ];

  return (
    <AdminShell
      title="Properties"
      subtitle={adminCollege ? `Verified rooms · ${adminCollege}` : "Verified rooms — occupancy overview."}
    >
      {/* Summary strip */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          { label: "Total Properties", value: rooms.length,           icon: Building2 },
          { label: "Students Placed",  value: totalStudentsAssigned,   icon: User },
          { label: "Total Admissions", value: admissions.length,       icon: BedDouble },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon className="size-3.5" />
              {label}
            </div>
            <p className="mt-1 text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* ── Gender toggle — primary filter ── */}
      <div className="mb-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Gender</p>
        <div className="flex flex-wrap gap-2">
          {GENDER_TABS.map((tab) => (
            <button
              key={tab.key}
              data-active={genderFilter === tab.key}
              onClick={() => { setGenderFilter(tab.key); setActiveFilter("all"); }}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all shadow-sm
                ${tab.cls}
                ${genderFilter === tab.key ? "shadow-md scale-105" : "bg-card text-foreground hover:bg-muted"}`}
            >
              <span className="text-base">{tab.emoji}</span>
              <span>{tab.label}</span>
              <span className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold
                ${genderFilter === tab.key ? "bg-white/25" : "bg-muted text-muted-foreground"}`}>
                {genderCounts[tab.key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Status + room type filters ── */}
      <div className="mb-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Filter</p>
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all",      label: "All",      count: genderFiltered.length, emoji: "🔍", cls: "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground" },
            { key: "vacant",   label: "Vacant",   count: statusTypeCounts.vacant,   emoji: "🟢", cls: "data-[active=true]:bg-emerald-500 data-[active=true]:text-white" },
            { key: "occupied", label: "Occupied", count: statusTypeCounts.occupied, emoji: "🟡", cls: "data-[active=true]:bg-amber-500 data-[active=true]:text-white" },
            ...statusTypeCounts.types.map((t) => ({
              key: `type:${t}`, label: t,
              count: genderFiltered.filter((r) => r.roomType === t).length,
              emoji: "🛏️",
              cls: "data-[active=true]:bg-secondary data-[active=true]:text-secondary-foreground",
            })),
          ].map((card) => {
            const isActive = activeFilter === card.key;
            return (
              <button
                key={card.key}
                data-active={isActive}
                onClick={() => setActiveFilter(isActive ? "all" : card.key)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all shadow-sm
                  ${card.cls}
                  ${isActive ? "border-transparent shadow-md scale-105" : "border-border bg-card text-foreground hover:bg-muted"}`}
              >
                <span>{card.emoji}</span>
                <span>{card.label}</span>
                <span className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold
                  ${isActive ? "bg-white/25" : "bg-muted text-muted-foreground"}`}>
                  {card.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by property name, city, college or contact…"
          className="max-w-sm"
        />
      </div>

      {/* Results label */}
      {!isLoading && filtered.length > 0 && (
        <p className="mb-3 text-xs text-muted-foreground">
          Showing {filtered.length} propert{filtered.length !== 1 ? "ies" : "y"} — sorted by vacancy
        </p>
      )}

      {/* Property cards */}
      {isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
          {rooms.length === 0
            ? "No verified rooms found for this college."
            : "No properties match your filter."}
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((r) => (
            <PropertyCard key={r.id} room={r} />
          ))}
        </div>
      )}
    </AdminShell>
  );
}
