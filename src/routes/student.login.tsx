import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
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

function StudentLoginPage() {
  const { session, loading, loginStudent } = useStudentAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      // Navigation handled by the useEffect above once session is set
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
            <BookOpen className="size-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Student Portal</h1>
            <p className="mt-1 text-sm text-muted-foreground">NivasiSpace · Mess, Laundry &amp; Tiffin</p>
          </div>
        </div>

        {/* Login form */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <form onSubmit={handleLogin} className="space-y-4">
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
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
              Sign In
            </Button>
          </form>
        </div>

        {/* Hint */}
        <div className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-center text-xs text-muted-foreground space-y-1">
          <p>Use the email address from your admission form.</p>
          <p className="font-medium text-foreground">Password = Parent / Guardian contact number</p>
          <p className="text-[11px]">Example: if your parent's number is 9876543210, use that as your password.</p>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Staff?{" "}
          <Link to="/admin/login" className="font-medium text-foreground underline underline-offset-2">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
