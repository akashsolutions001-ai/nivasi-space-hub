import { useEffect, useState } from "react";
import { Check, GraduationCap, RefreshCw, Stethoscope, Wrench } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth, type CollegeFilter } from "@/lib/auth";
import { useColleges } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export function CollegeFilterDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { setCollegeFilter, collegeFilter } = useAuth();
  const { data: allColleges = [] } = useColleges();

  const [type, setType] = useState<"engineering" | "medical" | "">(collegeFilter.type);
  const [city, setCity] = useState(collegeFilter.city);
  const [college, setCollege] = useState(collegeFilter.college);

  useEffect(() => {
    if (open) {
      setType(collegeFilter.type);
      setCity(collegeFilter.city);
      setCollege(collegeFilter.college);
    }
  }, [open, collegeFilter]);

  const activeColleges = allColleges.filter((c) => c.active);

  const typeMatchedColleges = activeColleges.filter((c) => {
    if (!type) return true;
    return !c.collegeType || c.collegeType === "other" || c.collegeType === type;
  });

  const relevantCities: string[] = Array.from(
    new Set(typeMatchedColleges.map((c) => c.city?.trim() || "Kolhapur")),
  ).sort((a, b) => a.localeCompare(b));

  const effectiveCity = city || (relevantCities.length >= 1 ? relevantCities[0] : "") || "";

  const filteredColleges = typeMatchedColleges.filter((c) => {
    if (!effectiveCity) return true;
    return (c.city?.trim() || "Kolhapur") === effectiveCity;
  });

  function handleTypeChange(v: "engineering" | "medical") {
    setType(v);
    setCity("");
    setCollege("");
  }

  function handleConfirm() {
    if (!type || !college) return;
    setCollegeFilter({ type, city: effectiveCity, college });
    onOpenChange(false);
  }

  const cityOk = relevantCities.length >= 1;
  const canConfirm = Boolean(type && cityOk && college);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v && !collegeFilter.college) return;
        onOpenChange(v);
      }}
    >
      <DialogContent
        className="w-[90vw] max-w-md p-5 overflow-y-auto max-h-[90dvh]"
        hideCloseButton={!collegeFilter.college}
      >
        <DialogHeader className="text-left space-y-1">
          <DialogTitle className="flex items-center gap-2 text-base">
            <GraduationCap className="size-4 shrink-0 text-primary" />
            Select College View
          </DialogTitle>
          <p className="text-xs text-muted-foreground leading-snug">
            Choose the college whose admissions you want to manage.
          </p>
        </DialogHeader>

        <div className="space-y-4">

          {/* Step 1 — Type */}
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              1. College Type
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(["engineering", "medical"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleTypeChange(t)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border-2 py-3 text-xs font-medium transition-colors",
                    type === t
                      ? "border-primary bg-brand-soft text-primary"
                      : "border-border bg-card hover:bg-muted/50",
                  )}
                >
                  {t === "engineering"
                    ? <Wrench className="size-5" />
                    : <Stethoscope className="size-5" />}
                  {t === "engineering" ? "Engineering" : "Medical"}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2 — City */}
          {type && (
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                2. City
              </p>
              {relevantCities.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
                  No {type} colleges added yet. Go to Settings to add some.
                </p>
              ) : (
                <Select
                  value={effectiveCity || ""}
                  onValueChange={(v) => { setCity(v); setCollege(""); }}
                >
                  <SelectTrigger className="w-full h-11">
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    {relevantCities.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {/* Step 3 — College */}
          {type && cityOk && (
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                3. College
              </p>
              {filteredColleges.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
                  No colleges found for {effectiveCity}. Add them in Settings.
                </p>
              ) : (
                <Select
                  value={college || ""}
                  onValueChange={setCollege}
                >
                  <SelectTrigger className="w-full text-left whitespace-normal h-auto min-h-[44px] py-2 px-3 text-xs [&>span]:line-clamp-2 [&>span]:whitespace-normal">
                    <SelectValue placeholder="Select a college" />
                  </SelectTrigger>
                  <SelectContent className="w-[var(--radix-select-trigger-width)] max-h-60">
                    {filteredColleges.map((c) => (
                      <SelectItem 
                        key={c.id} 
                        value={c.collegeName}
                        className="py-2.5 text-xs whitespace-normal break-words pr-8 leading-snug"
                      >
                        {c.collegeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

        </div>

        <Button
          className="w-full mt-2"
          disabled={!canConfirm}
          onClick={handleConfirm}
        >
          View Admissions
        </Button>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Sidebar chip — shows the active college filter and lets global admin change it.
 */
export function CollegeFilterChip() {
  const { collegeFilter } = useAuth();
  const [open, setOpen] = useState(false);

  if (!collegeFilter.college) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
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
      <CollegeFilterDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
