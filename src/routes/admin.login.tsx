import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

import { NivasiLogo } from "@/components/nivasi/logo";
import { SetupNotice } from "@/components/nivasi/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Staff Login — NivasiSpace Admin" },
      { name: "description", content: "Secure staff sign-in for the NivasiSpace admission system." },
      { property: "og:title", content: "Staff Login — NivasiSpace Admin" },
      {
        property: "og:description",
        content: "Secure staff sign-in for the NivasiSpace admission system.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, user, loading, configured } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/admin/dashboard", replace: true });
  }, [loading, user, navigate]);

  if (!configured) return <SetupNotice />;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setSubmitting(true);
    try {
      await login(email, password);
      navigate({ to: "/admin/dashboard", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <div className="gradient-brand relative hidden flex-col justify-between p-12 text-primary-foreground lg:flex">
        <NivasiLogo compact />
        <div className="max-w-md">
          <h2 className="font-display text-4xl leading-tight font-extrabold">
            Every admission,
            <br />
            beautifully organised.
          </h2>
          <p className="mt-4 text-sm/6 text-primary-foreground/85">
            Record student details, assign packages, track payments and provided items — all from
            one warm, fast admin workspace built for the NivasiSpace team.
          </p>
          <ul className="mt-8 space-y-2 text-sm text-primary-foreground/90">
            <li>• Unique NS-ADM admission IDs</li>
            <li>• Live payment and item tracking</li>
            <li>• Secure staff-only access</li>
          </ul>
        </div>
        <p className="text-xs text-primary-foreground/70">
          NivasiSpace · Internal use only
        </p>
      </div>

      <div className="flex items-center justify-center bg-background px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden">
            <NivasiLogo />
          </div>
          <h1 className="mt-8 font-display text-2xl font-bold lg:mt-0">Staff Sign In</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Use the credentials issued by your administrator.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nivasispace.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Accounts are created by your administrator. Self sign-up is disabled.
          </p>
        </div>
      </div>
    </div>
  );
}
