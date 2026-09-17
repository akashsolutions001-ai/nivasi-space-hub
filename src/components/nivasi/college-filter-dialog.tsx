import { useEffect, useState } from "react";
import { GraduationCap, Loader2, RefreshCw, Stethoscope, Wrench, X } from "lucide-react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { useColleges } from "@/lib/hooks";
import type { College } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// CollegeFilterDialog
//
// Single unified layout — centered modal that works on every screen size.
// Pure inline styles + createPortal. Zero Tailwind animation utilities.
// colleges are fetched at CollegeFilterDialog level (always mounted with
// AdminShell) so data is ready before the user even opens it.
// ─────────────────────────────────────────────────────────────────────────────

// ── Inner form ────────────────────────────────────────────────────────────────

function FilterForm({
  colleges,
  collegesLoading,
  canClose,
  onClose,
}: {
  colleges: College[];
  collegesLoading: boolean;
  canClose: boolean;
  onClose: () => void;
}) {
  const { setCollegeFilter, collegeFilter } = useAuth();

  const [type, setType] = useState<"engineering" | "medical" | "">(collegeFilter.type);
  const [city, setCity] = useState(collegeFilter.city);
  const [college, setCollege] = useState(collegeFilter.college);

  // Keep state in sync if collegeFilter updates
  useEffect(() => {
    if (collegeFilter.type) setType(collegeFilter.type);
    if (collegeFilter.city) setCity(collegeFilter.city);
    if (collegeFilter.college) setCollege(collegeFilter.college);
  }, [collegeFilter.type, collegeFilter.city, collegeFilter.college]);

  const activeColleges = colleges.filter((c) => c.active !== false && Boolean(c.collegeName?.trim()));

  const typeMatchedColleges = activeColleges.filter((c) => {
    if (!type) return true;
    const ct = (c.collegeType ?? "").toLowerCase().trim();
    return !ct || ct === "other" || ct === type;
  });

  const relevantCities: string[] = Array.from(
    new Set(typeMatchedColleges.map((c) => (c.city?.trim() || "Kolhapur"))),
  ).sort((a, b) => a.localeCompare(b));

  const effectiveCity = city || relevantCities[0] || "";

  const filteredColleges = typeMatchedColleges.filter(
    (c) =>
      !effectiveCity ||
      (c.city?.trim() || "Kolhapur").toLowerCase() === effectiveCity.toLowerCase(),
  );

  // Auto-select college when filtered list changes if none is selected or current selection is no longer valid
  useEffect(() => {
    if (filteredColleges.length > 0) {
      const exists = filteredColleges.some((c) => c.collegeName === college);
      const first = filteredColleges[0];
      if ((!college || !exists) && first) {
        setCollege(first.collegeName);
      }
    } else {
      setCollege("");
    }
  }, [filteredColleges, college]);

  function handleTypeChange(v: "engineering" | "medical") {
    setType(v);
    setCity("");
    setCollege("");
  }

  function handleConfirm() {
    if (!type || !college) return;
    setCollegeFilter({ type, city: effectiveCity, college });
    onClose();
  }

  const cityOk = relevantCities.length >= 1;
  const canConfirm = Boolean(type && cityOk && college);

  return (
    <>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        padding: "20px 20px 0", flexShrink: 0,
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <GraduationCap style={{ width: 18, height: 18, color: "#c2692a", flexShrink: 0 }} />
            <span style={{ fontSize: 17, fontWeight: 700, color: "#2d1f0e", fontFamily: "Outfit, sans-serif" }}>
              Select College View
            </span>
          </div>
          <p style={{ fontSize: 13, color: "#7a5c3a", lineHeight: 1.45, margin: 0 }}>
            Choose the college whose admissions you want to manage.
          </p>
        </div>
        {canClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              marginLeft: 12, padding: 6, border: "none", borderRadius: 8,
              background: "rgba(0,0,0,0.06)", cursor: "pointer", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <X style={{ width: 16, height: 16, color: "#7a5c3a" }} />
          </button>
        )}
      </div>

      {/* Scrollable body */}
      <div style={{
        overflowY: "auto", overscrollBehavior: "contain",
        padding: "16px 20px 24px",
        display: "flex", flexDirection: "column", gap: 20,
        flex: 1, minHeight: 0,
      }}>

        {/* Step 1 — College Type */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "#9a7a5a", marginBottom: 10 }}>
            1. College Type
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {(["engineering", "medical"] as const).map((t) => {
              const active = type === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleTypeChange(t)}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    justifyContent: "center", gap: 8, padding: "14px 10px",
                    borderRadius: 14,
                    border: `2px solid ${active ? "#c2692a" : "#e0d8ce"}`,
                    background: active ? "#fdf1e8" : "#ffffff",
                    color: active ? "#c2692a" : "#3d2e1a",
                    fontSize: 13, fontWeight: 600, cursor: "pointer",
                    transition: "border-color 0.15s, background 0.15s",
                    minHeight: 80,
                  }}
                >
                  {t === "engineering"
                    ? <Wrench style={{ width: 22, height: 22 }} />
                    : <Stethoscope style={{ width: 22, height: 22 }} />}
                  {t === "engineering" ? "Engineering" : "Medical"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading indicator — only while fetching */}
        {collegesLoading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#9a7a5a", fontSize: 13 }}>
            <Loader2 style={{ width: 16, height: 16, flexShrink: 0, animation: "spin 1s linear infinite" }} />
            Loading colleges…
          </div>
        )}

        {/* Step 2 — City (show even during loading so type selection is visible) */}
        {type && !collegesLoading && (
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "#9a7a5a", marginBottom: 10 }}>
              2. City
            </p>
            {relevantCities.length === 0 ? (
              <p style={{ fontSize: 13, color: "#9a7a5a", padding: "10px 14px", border: "1px dashed #d0c8be", borderRadius: 10, margin: 0 }}>
                No {type} colleges found. Add them in Settings → Colleges.
              </p>
            ) : (
              <Select value={effectiveCity} onValueChange={(v) => { setCity(v); setCollege(""); }}>
                <SelectTrigger style={{ width: "100%", height: 48, fontSize: 14 }}>
                  <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent className="z-[100005]">
                  {relevantCities.map((c) => (
                    <SelectItem key={c} value={c} style={{ fontSize: 14 }}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        {/* Step 3 — College */}
        {type && cityOk && !collegesLoading && (
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "#9a7a5a", marginBottom: 10 }}>
              3. College
            </p>
            {filteredColleges.length === 0 ? (
              <p style={{ fontSize: 13, color: "#9a7a5a", padding: "10px 14px", border: "1px dashed #d0c8be", borderRadius: 10, margin: 0 }}>
                No colleges for {effectiveCity}. Add them in Settings.
              </p>
            ) : (
              <Select value={college || ""} onValueChange={setCollege}>
                <SelectTrigger style={{ width: "100%", height: "auto", minHeight: 48, fontSize: 13, textAlign: "left", whiteSpace: "normal", padding: "10px 14px", overflow: "hidden" }}>
                  <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0 }}>
                    <SelectValue placeholder="Select a college">
                      {college || undefined}
                    </SelectValue>
                  </span>
                </SelectTrigger>
                <SelectContent className="z-[100005]" style={{ maxHeight: 260, width: "var(--radix-select-trigger-width)", maxWidth: "var(--radix-select-trigger-width)" }}>
                  {filteredColleges.map((c) => (
                    <SelectItem
                      key={c.id}
                      value={c.collegeName}
                      style={{ fontSize: 13, whiteSpace: "normal", wordBreak: "break-word", lineHeight: 1.4, padding: "10px 12px" }}
                    >
                      {c.collegeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        <button
          type="button"
          disabled={!canConfirm}
          onClick={handleConfirm}
          style={{
            width: "100%", padding: "14px 0", borderRadius: 14, border: "none", cursor: canConfirm ? "pointer" : "not-allowed",
            background: canConfirm
              ? "linear-gradient(135deg, #9b4a18 0%, #c2692a 52%, #d4963e 100%)"
              : "#e0d8ce",
            color: canConfirm ? "#fff" : "#a89880",
            fontSize: 15, fontWeight: 700, letterSpacing: "0.01em",
            transition: "opacity 0.15s",
            marginTop: 4,
          }}
        >
          View Admissions
        </button>

      </div>
    </>
  );
}

// ── Portal ────────────────────────────────────────────────────────────────────
// Creates a fresh <div> appended to <body> ONCE and keeps it for the lifetime
// of FilterPortal. We inject a <style> tag that positions it with CSS so no
// inline transform on any ancestor can interfere with the fixed layout.

const STYLE_ID = "__cf_dialog_styles__";

function ensureStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement("style");
  s.id = STYLE_ID;
  s.textContent = `
    #__cf_dialog_host__ {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      width: 100dvw !important;
      height: 100dvh !important;
      z-index: 10001 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      padding: 16px !important;
      box-sizing: border-box !important;
      pointer-events: none !important;
      transform: none !important;
      translate: none !important;
      rotate: none !important;
      scale: none !important;
      filter: none !important;
      perspective: none !important;
      will-change: auto !important;
      contain: none !important;
      isolation: isolate !important;
    }
    #__cf_dialog_host__[data-open="true"] {
      pointer-events: auto !important;
    }
  `;
  document.head.appendChild(s);
}

function getOrCreateHost(): HTMLDivElement {
  let host = document.getElementById("__cf_dialog_host__") as HTMLDivElement | null;
  if (!host) {
    host = document.createElement("div");
    host.id = "__cf_dialog_host__";
    // Insert as LAST child of body — after any transformed wrappers
    document.body.appendChild(host);
  }
  return host;
}

function FilterPortal({
  open,
  colleges,
  collegesLoading,
  canClose,
  onClose,
}: {
  open: boolean;
  colleges: College[];
  collegesLoading: boolean;
  canClose: boolean;
  onClose: () => void;
}) {
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const D = 260;

  // Create the host node once on mount
  useEffect(() => {
    ensureStyles();
    const h = getOrCreateHost();
    setHost(h);
    return () => {
      // Leave the host node in DOM for reuse; just hide it
      h.dataset["open"] = "false";
    };
  }, []);

  // Drive visibility
  useEffect(() => {
    if (!host) return;
    if (open) {
      host.dataset["open"] = "true";
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      return undefined;
    } else {
      setVisible(false);
      const t = setTimeout(() => {
        if (host) host.dataset["open"] = "false";
      }, D + 40);
      return () => clearTimeout(t);
    }
  }, [open, host]);

  if (!host || typeof document === "undefined") return null;
  if (!open && !visible) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={canClose ? onClose : undefined}
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.55)",
          opacity: visible ? 1 : 0,
          transition: `opacity ${D}ms ease`,
        }}
      />

      {/* Panel — flex child, centered by host's flexbox */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Select College View"
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "420px",
          maxHeight: "calc(100dvh - 48px)",
          display: "flex",
          flexDirection: "column",
          background: "#faf8f4",
          borderRadius: 20,
          boxShadow: "0 12px 60px rgba(0,0,0,0.28)",
          overflow: "hidden",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.94)",
          transition: `opacity ${D}ms ease, transform ${D}ms cubic-bezier(0.34,1.56,0.64,1)`,
        }}
      >
        <FilterForm
          colleges={colleges}
          collegesLoading={collegesLoading}
          canClose={canClose}
          onClose={onClose}
        />
      </div>
    </>,
    host,
  );
}

// ── Public export ─────────────────────────────────────────────────────────────

export function CollegeFilterDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { collegeFilter } = useAuth();
  // Fetch at this level — always mounted with AdminShell, data ready before open
  const { data: colleges = [], isLoading: collegesLoading } = useColleges();
  const canClose = Boolean(collegeFilter.college);

  return (
    <FilterPortal
      open={open}
      colleges={colleges}
      collegesLoading={collegesLoading}
      canClose={canClose}
      onClose={() => { if (canClose) onOpenChange(false); }}
    />
  );
}

// ── Sidebar chip ──────────────────────────────────────────────────────────────

export function CollegeFilterChip({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const { collegeFilter, setFilterDialogOpen } = useAuth();

  if (!collegeFilter.college) return null;

  function handleTap() {
    // Close the sidebar Sheet first, then open the dialog
    onNavigate?.();
    setTimeout(() => setFilterDialogOpen(true), 160);
  }

  return (
    <button
      type="button"
      onClick={handleTap}
      className="w-full rounded-xl border border-primary/30 bg-brand-soft/60 px-3 py-2 text-left transition-colors hover:bg-brand-soft"
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-primary/70">Viewing</p>
      <p className="mt-0.5 text-xs font-semibold text-primary break-words leading-snug">
        {collegeFilter.college}
      </p>
      {collegeFilter.city && (
        <p className="text-[10px] text-muted-foreground">{collegeFilter.city}</p>
      )}
      <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
        <RefreshCw className="size-2.5" />
        Tap to change
      </p>
    </button>
  );
}
