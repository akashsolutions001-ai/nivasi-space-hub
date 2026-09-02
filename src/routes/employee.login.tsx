import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/employee/login")({
  head: () => ({ meta: [{ title: "Employee Login — NivasiSpace" }] }),
  component: EmployeeLoginPage,
});

function EmployeeLoginPage() {
  const { login, user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in as employee
  useEffect(() => {
    if (!loading && user) {
      if (userRole === "mess_employee") {
        navigate({ to: "/employee/dashboard", replace: true });
      } else if (userRole === "admin") {
        navigate({ to: "/admin/dashboard", replace: true });
      }
    }
  }, [loading, user, userRole, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      // navigation handled by useEffect above after role resolves
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl gradient-brand shadow-soft">
            <UtensilsCrossed className="size-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Employee Login</h1>
            <p className="mt-1 text-sm text-muted-foreground">NivasiSpace Mess & Tiffin Delivery</p>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="rahul@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
              Sign In
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Employee accounts are created by the administrator. Contact your mess manager if you need
          access.
        </p>
      </div>
    </div>
  );
}
