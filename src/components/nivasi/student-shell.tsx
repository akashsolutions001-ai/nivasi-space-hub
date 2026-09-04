import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Menu, X, LayoutDashboard, UtensilsCrossed, WashingMachine,
  LogOut, ArrowLeft, ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
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

  return (
    <div className="flex h-full flex-col">
      {/* Brand header */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
        <div className="flex size-9 items-center justify-center rounded-xl gradient-brand shadow-sm">
          <UtensilsCrossed className="size-4 text-white" />
        </div>
        <div className="min-w-0">
          <p className="font-display font-bold text-sm leading-tight truncate">NivasiSpace</p>
          <p className="text-[11px] text-muted-foreground">Student Portal</p>
        </div>
      </div>

      {/* Student info chip */}
      {admission && (
        <div className="mx-4 mt-4 rounded-xl bg-muted/60 px-3 py-2.5">
          <p className="text-sm font-semibold truncate">{admission.fullName}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{admission.admissionId}</p>
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
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "gradient-brand text-white shadow-sm"
                  : "text-foreground hover:bg-muted",
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {!active && <ChevronRight className="size-3.5 text-muted-foreground" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer — session info + logout */}
      <div className="px-3 pb-6 pt-3 border-t border-border mt-4">
        {session?.email && (
          <p className="px-3 mb-2 text-[11px] text-muted-foreground truncate">{session.email}</p>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="size-4 shrink-0" />
          Log Out
        </button>
      </div>
    </div>
  );
}

// ── StudentShell ──────────────────────────────────────────────────────────────

interface StudentShellProps {
  /** Page title shown in the top bar */
  title: string;
  /** If provided, shows a back arrow linking to this route instead of a hamburger */
  backTo?: string;
  /** Page content */
  children: ReactNode;
}

export function StudentShell({ title, backTo, children }: StudentShellProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* ── Top header ── */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          {backTo ? (
            /* Back arrow on detail pages */
            <Button asChild variant="ghost" size="icon" aria-label="Back">
              <Link to={backTo}><ArrowLeft className="size-4" /></Link>
            </Button>
          ) : (
            /* Hamburger on dashboard */
            <Sheet open={open} onOpenChange={setOpen}>
              <button
                onClick={() => setOpen(true)}
                className="flex size-9 items-center justify-center rounded-xl hover:bg-muted transition-colors"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </button>
              <SheetContent side="left" className="w-72 p-0 bg-card border-r border-border">
                <SheetTitle className="sr-only">Student Navigation</SheetTitle>
                <SidebarInner onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>
          )}

          {/* Title + icon */}
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg gradient-brand">
              <UtensilsCrossed className="size-3.5 text-white" />
            </div>
            <span className="font-display font-bold">{title}</span>
          </div>

          {/* On detail pages put hamburger on the right so it's still accessible */}
          {backTo && (
            <div className="ml-auto">
              <Sheet open={open} onOpenChange={setOpen}>
                <button
                  onClick={() => setOpen(true)}
                  className="flex size-9 items-center justify-center rounded-xl hover:bg-muted transition-colors"
                  aria-label="Open menu"
                >
                  <Menu className="size-5" />
                </button>
                <SheetContent side="left" className="w-72 p-0 bg-card border-r border-border">
                  <SheetTitle className="sr-only">Student Navigation</SheetTitle>
                  <SidebarInner onNavigate={() => setOpen(false)} />
                </SheetContent>
              </Sheet>
            </div>
          )}
        </div>
      </header>

      {/* Page content */}
      <div className="mx-auto max-w-lg space-y-4 px-4 pt-4">
        {children}
      </div>
    </div>
  );
}
