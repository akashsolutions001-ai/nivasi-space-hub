import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  Users,
  Building2,
  ShieldAlert,
  UtensilsCrossed,
  WashingMachine,
  ArrowDownCircle,
} from "lucide-react";

import { NivasiLogo } from "./logo";
import { CollegeFilterChip, CollegeFilterDialog } from "./college-filter-dialog";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth, useIsGlobalAdmin, useIsMessEmployee, useIsLaundryEmployee } from "@/lib/auth";
import { hasStudentSession } from "@/lib/studentAuth";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard",  to: "/admin/dashboard",  icon: LayoutDashboard },
  { label: "Admissions", to: "/admin/admissions",  icon: Users },
  { label: "Properties", to: "/admin/properties",  icon: Building2 },
  { label: "Packages",   to: "/admin/packages",    icon: Package },
  { label: "Mess",       to: "/admin/mess",        icon: UtensilsCrossed },
  { label: "Laundry",    to: "/admin/laundry",     icon: WashingMachine },
  { label: "Payouts",    to: "/admin/payouts",     icon: ArrowDownCircle },
  { label: "Settings",   to: "/admin/settings",    icon: Settings },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isMessEmployee = useIsMessEmployee();
  const isLaundryEmployee = useIsLaundryEmployee();
  const isEmployee = isMessEmployee || isLaundryEmployee;

  // Define employee-specific navigation items
  const employeeNav = [
    // Mess employees see Mess tab, Laundry employees see Laundry tab
    ...(isMessEmployee ? [{ label: "Mess", to: "/admin/mess", icon: UtensilsCrossed }] : []),
    ...(isLaundryEmployee ? [{ label: "Laundry", to: "/admin/laundry", icon: WashingMachine }] : []),
    // Both employee types see "My Payout" tab
    { label: "My Payout", to: isMessEmployee ? "/employee/mess/payouts" : "/employee/laundry/payouts", icon: ArrowDownCircle },
  ] as const;

  const visibleNav = isEmployee ? employeeNav : NAV;

  return (
    <nav className="flex flex-col gap-1">
      {visibleNav.map((item) => {
        const active = pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "gradient-brand text-primary-foreground shadow-soft"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <item.icon className="size-[18px]" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function AccountBlock({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    onNavigate?.();
    await logout();
    navigate({ to: "/admin/login", replace: true });
  }

  return (
    <div className="rounded-2xl border border-sidebar-border bg-brand-soft/60 p-3">
      <p className="truncate text-xs font-semibold text-foreground">
        {user?.displayName || "NivasiSpace Admin"}
      </p>
      <p className="truncate text-[11px] text-muted-foreground">{user?.email}</p>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        className="mt-2 h-8 w-full justify-start gap-2 px-2 text-xs text-muted-foreground hover:text-destructive"
      >
        <LogOut className="size-3.5" />
        Log out
      </Button>
    </div>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const isGlobalAdmin = useIsGlobalAdmin();
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <NivasiLogo className="px-1" />
      {/* College filter chip — global admin only */}
      {isGlobalAdmin && <CollegeFilterChip />}
      <div className="flex-1">
        <NavLinks onNavigate={onNavigate} />
      </div>
      <AccountBlock onNavigate={onNavigate} />
    </div>
  );
}

export function AdminShell({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string | undefined;
  action?: ReactNode;
  children: ReactNode;
}) {
  const { user, loading, configured, needsCollegeFilter, userRole } = useAuth();
  const isGlobalAdmin = useIsGlobalAdmin();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  // Show the college filter popup as soon as global admin lands on any protected page
  useEffect(() => {
    if (isGlobalAdmin && needsCollegeFilter) {
      setFilterOpen(true);
    }
  }, [isGlobalAdmin, needsCollegeFilter]);

  // Redirect to login if not authenticated or not a recognized staff role.
  // We wait for loading to finish AND for userRole to be resolved (not "unknown")
  // before deciding whether to redirect, to avoid a race condition during role resolution.
  useEffect(() => {
    if (loading || !configured) return;
    if (!user) {
      navigate({ to: "/admin/login", replace: true });
      return;
    }
    // If role is "unknown" after loading, the signed-in user is a student
    // (no users doc) — send them to the student portal.
    if (userRole === "unknown") {
      navigate({ to: "/student/dashboard", replace: true });
      return;
    }
    // Explicitly non-staff role
    if (userRole !== "admin" && userRole !== "mess_employee" && userRole !== "laundry_employee") {
      navigate({ to: "/admin/login", replace: true });
    }
  }, [loading, configured, user, userRole, navigate]);

  if (!configured) {
    return <SetupNotice />;
  }

  if (loading) {
    return (
      <div className="min-h-screen space-y-4 p-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!user || hasStudentSession()) {
    return (
      <div className="min-h-screen space-y-4 p-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarInner />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-sidebar p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SidebarInner onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <NivasiLogo />
        </header>

        <main className="flex-1 px-3 py-5 sm:px-5 lg:px-6 lg:py-7">
          <div className="w-full">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h1 className="truncate text-xl font-bold sm:text-2xl lg:text-[28px]">{title}</h1>
                {subtitle && <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{subtitle}</p>}
              </div>
              {action && (
                <div className="flex flex-wrap gap-2">
                  {action}
                </div>
              )}
            </div>
            {children}
          </div>
        </main>
      </div>

      {/* College filter dialog — global admin only */}
      {isGlobalAdmin && (
        <CollegeFilterDialog open={filterOpen} onOpenChange={setFilterOpen} />
      )}
    </div>
  );
}

export function SetupNotice() {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="max-w-lg rounded-2xl border border-border bg-card p-8 shadow-soft">
        <div className="mb-4 grid size-11 place-items-center rounded-xl bg-accent text-accent-foreground">
          <ShieldAlert className="size-5" />
        </div>
        <h1 className="text-xl font-bold">Connect your Firebase project</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The NivasiSpace Admission Management System is ready, but it still needs your Firebase
          project details before staff can sign in and admissions can be saved.
        </p>
        <p className="mt-4 rounded-xl bg-muted p-3 font-mono text-xs text-muted-foreground">
          src/lib/firebase-config.ts
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Paste the web app config from Firebase Console → Project settings → Your apps, and the
          whole system comes online.
        </p>
      </div>
    </div>
  );
}
