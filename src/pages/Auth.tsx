import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import {
  clearAttempts,
  formatRemaining,
  getLockoutRemainingMs,
  recordFailedAttempt,
} from "@/lib/loginThrottle";
import { logAuditEvent } from "@/lib/auditLog";

const credentialsSchema = z.object({
  email: z.string().trim().email({ message: "Enter a valid email" }).max(255),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(72),
});

const GENERIC_ERROR = "Invalid email or password.";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (error) {
      errorRef.current?.focus();
    }
  }, [error]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = credentialsSchema.safeParse({ email, password });
    if (!parsed.success) {
      // Use generic error to avoid revealing which field is "wrong" in
      // a way that could be probed. Validation messages are still shown
      // for clearly user-side issues like format.
      setError(parsed.error.issues[0]?.message ?? GENERIC_ERROR);
      return;
    }

    const remaining = getLockoutRemainingMs(parsed.data.email);
    if (remaining > 0) {
      setError(
        `Too many failed attempts. Please try again in ${formatRemaining(remaining)}.`,
      );
      return;
    }

    setSubmitting(true);
    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      parsed.data,
    );
    setSubmitting(false);

    if (signInError) {
      const result = recordFailedAttempt(parsed.data.email);
      void logAuditEvent("login_failed", {
        email: parsed.data.email,
        metadata: { reason: signInError.message },
      });
      if (result.locked) {
        setError(
          `Too many failed attempts. Please try again in ${formatRemaining(result.remainingMs)}.`,
        );
      } else {
        setError(GENERIC_ERROR);
      }
      return;
    }

    clearAttempts(parsed.data.email);
    void logAuditEvent("login_success", {
      email: parsed.data.email,
      user_id: data.user?.id ?? null,
    });
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main id="main" className="container py-10">
        <div className="mx-auto max-w-md">
          <header className="mb-6">
            <div className="mb-2 h-1 w-16 rounded bg-accent" aria-hidden="true" />
            <h1 className="text-3xl font-bold">Staff Sign In</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to manage directory entries and other site content. Contact
              an administrator if you need an account.
            </p>
          </header>

          <form onSubmit={onSubmit} noValidate aria-describedby={error ? "auth-error" : undefined} className="space-y-4 rounded-lg border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">
              Fields marked with <span aria-hidden="true">*</span> are required.
            </p>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Email <span aria-hidden="true" className="text-destructive">*</span></span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full rounded border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Password <span aria-hidden="true" className="text-destructive">*</span></span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                minLength={8}
                className="w-full rounded border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              />
              <span className="mt-1 block text-xs text-muted-foreground">
                Minimum 8 characters. Strong, unique passwords required for staff accounts.
              </span>
            </label>

            {error && (
              <p ref={errorRef} id="auth-error" tabIndex={-1} role="alert" className="text-sm text-destructive">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center rounded bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60"
            >
              {submitting ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm">
            <Link to="/" className="text-primary underline-offset-2 hover:underline">
              Back to home
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Auth;
