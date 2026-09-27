import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, BookOpen } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStudentAuth } from "@/lib/studentAuth";

export const Route = createFileRoute("/student/login")({
  head: () => ({ meta: [{ title: "Student Login — NivasiSpace" }] }),
  component: StudentLoginPage,
});

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function StudentLoginPage() {
  const { session, loading, loginStudent, loginStudentWithGoogle, logoutStudent } = useStudentAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [signingOutForStaff, setSigningOutForStaff] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && session) {
      navigate({ to: "/student/dashboard", replace: true });
    }
  }, [loading, session, navigate]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setSubmitting(true);
    try {
      await loginStudent(email.trim(), password.trim());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleLogin() {
    setGoogleSubmitting(true);
    try {
      await loginStudentWithGoogle();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign in failed. Please try again.");
    } finally {
      setGoogleSubmitting(false);
    }
  }

  async function handleGoToStaffLogin() {
    setSigningOutForStaff(true);
    try {
      await logoutStudent();
    } finally {
      setSigningOutForStaff(false);
      navigate({ to: "/admin/login" });
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-sm space-y-6">

        {/* Logo */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl gradient-brand shadow-soft">
            <BookOpen className="size-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Student Portal</h1>
            <p className="mt-1 text-sm text-muted-foreground">NivasiSpace · Mess, Laundry &amp; Tiffin</p>
          </div>
        </div>

        {/* Login form container */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
          {/* Quick Sign-In with Google */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={googleSubmitting || submitting}
            className="w-full h-11 gap-2.5 font-semibold text-sm border-border hover:bg-muted"
          >
            {googleSubmitting ? (
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            ) : (
              <GoogleIcon />
            )}
            Continue with Google
          </Button>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-border" />
            <span className="bg-card px-2 text-[11px] uppercase tracking-wider text-muted-foreground absolute font-medium">
              or with password
            </span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="st-email">Admission Email</Label>
              <Input
                id="st-email"
                type="email"
                autoComplete="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="st-password">
                Password
                <span className="ml-1 text-[11px] font-normal text-muted-foreground">(parent contact number)</span>
              </Label>
              <Input
                id="st-password"
                type="password"
                autoComplete="current-password"
                inputMode="numeric"
                placeholder="e.g. 9876543210"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full h-10 font-semibold" disabled={submitting || googleSubmitting}>
              {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
              Sign In with Password
            </Button>
          </form>
        </div>

        {/* Hint */}
        <div className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-center text-xs text-muted-foreground space-y-1">
          <p className="font-semibold text-foreground">Password = Parent / Guardian Contact Number</p>
          <p className="text-[11px]">If your admission was created with Google, you can sign in directly using "Continue with Google".</p>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Staff?{" "}
          <button
            type="button"
            onClick={handleGoToStaffLogin}
            disabled={signingOutForStaff}
            className="font-medium text-foreground underline underline-offset-2 disabled:opacity-50"
          >
            {signingOutForStaff ? "Signing out…" : "Sign in here"}
          </button>
        </p>
      </div>
    </div>
  );
}
