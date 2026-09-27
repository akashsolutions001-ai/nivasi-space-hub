import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Menu, LayoutDashboard, UtensilsCrossed, WashingMachine,
  LogOut, ArrowLeft, ChevronRight, Home,
} from "lucide-react";

import { NivasiLogo } from "./logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useStudentAuth } from "@/lib/studentAuth";
import { cn } from "@/lib/utils";

// ── Nav items ─────────────────────────────────────────────────────────────────

const STUDENT_NAV = [
  { label: "Dashboard",  to: "/student/dashboard", icon: LayoutDashboard },
  { label: "My Mess",    to: "/student/mess",       icon: UtensilsCrossed },
  { label: "My Laundry", to: "/student/laundry",    icon: WashingMachine },
] as const;

// ── Sidebar inner content ─────────────────────────────────────────────────────

function SidebarInner({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { session, admission, logoutStudent } = useStudentAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    onNavigate?.();
    logoutStudent();
    navigate({ to: "/student/login", replace: true });
  }

  const tiffinStatus = admission?.tiffinStatus || "not set";
  const laundryStatus = admission?.laundryStatus || "not set";

  return (
    <div className="flex h-full flex-col">
      {/* Brand header */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
        <NivasiLogo />
      </div>

      {/* Student Profile Card */}
      {admission && (
        <div className="mx-4 mt-4 rounded-2xl border border-border bg-muted/40 p-3.5 space-y-2">
          <div className="min-w-0">
            <p className="text-sm font-bold font-display truncate text-foreground">{admission.fullName}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{admission.admissionId}</p>
          </div>
          {admission.propertyName && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1 border-t border-border/60">
              <Home className="size-3.5 shrink-0 text-primary" />
              <span className="truncate">
                {admission.propertyName}
                {admission.roomNumber ? ` · Rm ${admission.roomNumber}` : ""}
              </span>
            </div>
          )}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <Badge
              variant="outline"
              className={`text-[10px] capitalize px-1.5 py-0.5 ${
                tiffinStatus === "active"
                  ? "border-success/30 bg-success/10 text-success"
                  : tiffinStatus === "paused"
                  ? "border-warning/30 bg-warning/10 text-warning-foreground"
                  : "border-border text-muted-foreground"
              }`}
            >
              Mess: {tiffinStatus}
            </Badge>
            {admission.packageServices?.some((s) => s.toLowerCase().includes("laundry")) && (
              <Badge
                variant="outline"
                className={`text-[10px] capitalize px-1.5 py-0.5 ${
                  laundryStatus === "active"
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                Laundry: {laundryStatus}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex-1 px-3 mt-4 space-y-1">
        {STUDENT_NAV.map(({ label, to, icon: Icon }) => {
          const active = pathname === to || pathname.startsWith(to + "/");
          return (
            <Link
              key={to}
              to={to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all",
                active
                  ? "gradient-brand text-white shadow-soft"
                  : "text-foreground hover:bg-muted",
              )}
            >
              <Icon className="size-[18px] shrink-0" />
              <span className="flex-1">{label}</span>
              {!active && <ChevronRight className="size-3.5 text-muted-foreground/60" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer — session info + logout */}
      <div className="p-4 border-t border-border mt-auto">
        <div className="rounded-2xl border border-border bg-card p-3 shadow-soft space-y-2">
          {session?.email && (
            <p className="text-[11px] text-muted-foreground truncate font-mono">{session.email}</p>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive h-8 px-2"
          >
            <LogOut className="size-3.5 mr-2 shrink-0" />
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── StudentShell ──────────────────────────────────────────────────────────────

interface StudentShellProps {
  /** Page title shown in the top bar */
  title: string;
  /** Subtitle description shown on desktop header */
  subtitle?: string;
  /** If provided, shows a back arrow linking to this route */
  backTo?: string;
  /** Custom icon shown on mobile top bar */
  icon?: React.ComponentType<{ className?: string }>;
  /** Optional action element rendered in the header */
  action?: ReactNode;
  /** Page content */
  children: ReactNode;
}

export function StudentShell({ title, subtitle, backTo, icon: CustomIcon, action, children }: StudentShellProps) {
  const [open, setOpen] = useState(false);
  const { admission } = useStudentAuth();

  const ResolvedIcon =
    CustomIcon ??
    (title.toLowerCase().includes("laundry")
      ? WashingMachine
      : title.toLowerCase().includes("mess")
      ? UtensilsCrossed
      : LayoutDashboard);

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* ── Desktop Sidebar (matches staff AdminShell) ── */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border bg-card lg:block">
        <SidebarInner />
      </aside>

      {/* ── Main content area ── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile Header (< lg) */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center gap-2.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(true)}
              className="size-9 rounded-xl"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg gradient-brand text-white shadow-soft">
                <ResolvedIcon className="size-3.5" />
              </div>
              <span className="font-display font-bold text-base">{title}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {backTo && (
              <Button asChild variant="ghost" size="icon" className="size-9 rounded-xl" aria-label="Back">
                <Link to={backTo}>
                  <ArrowLeft className="size-4" />
                </Link>
              </Button>
            )}
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent side="left" className="w-72 p-0 bg-card border-r border-border">
              <SheetTitle className="sr-only">Student Navigation</SheetTitle>
              <SidebarInner onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </header>

        {/* Desktop Top Bar (>= lg) */}
        <div className="hidden lg:flex items-center justify-between border-b border-border bg-card/60 px-8 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            {backTo && (
              <Button asChild variant="outline" size="sm" className="rounded-xl h-9 gap-1.5 text-xs font-semibold">
                <Link to={backTo}>
                  <ArrowLeft className="size-3.5" />
                  Back
                </Link>
              </Button>
            )}
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">{title}</h1>
              {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {action}
            {admission && (
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-1.5 text-xs shadow-soft">
                <span className="inline-block size-2 rounded-full bg-success animate-pulse" />
                <span className="font-medium text-foreground">{admission.fullName}</span>
                {admission.roomNumber && (
                  <span className="text-muted-foreground">· Rm {admission.roomNumber}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Page Content Container — fluid and fully responsive */}
        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
