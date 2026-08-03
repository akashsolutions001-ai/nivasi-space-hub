import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  Users,
  ShieldAlert,
} from "lucide-react";

import { NivasiLogo } from "./logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Admissions", to: "/admin/admissions", icon: Users },
  { label: "Packages", to: "/admin/packages", icon: Package },
  { label: "Settings", to: "/admin/settings", icon: Settings },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
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
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <NivasiLogo className="px-1" />
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
  const { user, loading, configured } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

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

  if (!user) {
    navigate({ to: "/admin/login", replace: true });
    return null;
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarInner />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
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

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold sm:text-[28px]">{title}</h1>
                {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
              </div>
              {action}
            </div>
            {children}
          </div>
        </main>
      </div>
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
