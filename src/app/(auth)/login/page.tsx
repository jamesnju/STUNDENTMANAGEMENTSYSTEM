"use client";

import { useState, type FormEvent } from "react";
import { signIn, getSession } from "next-auth/react"; // Added getSession
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, GraduationCap, AlertCircle, Eye, EyeOff } from "lucide-react";
import { ROLE_HOME } from "@/lib/constants"; // Import the map

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result) {
        setError("Unexpected error. Please try again.");
        return;
      }
      if (result.error) {
        setError("Invalid email or password.");
        return;
      }
      
      if (result.ok) {
        // Fetch the session immediately to get the role
        const session = await getSession();
        
        if (session?.user?.role) {
          // Redirect based on role
          const destination = ROLE_HOME[session.user.role];
          router.push(destination);
          router.refresh(); // Force Next.js to re-render server components with new auth state
        } else {
          setError("Failed to load user role. Please contact admin.");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }



  return (
    <div className="flex min-h-screen bg-[var(--bg-base)] text-[var(--fg-base)]">
      {/* Left — brand panel (hidden on mobile) */}
      <aside className="relative hidden w-1/2 overflow-hidden bg-[var(--primary-900)] lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,var(--primary-800),transparent_60%),radial-gradient(circle_at_70%_80%,var(--accent-800),transparent_60%)] opacity-90" />
        <div className="relative flex h-full flex-col justify-between p-10 text-white">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/15">
              <GraduationCap className="h-5 w-5" />
            </span>
            School MS
          </Link>

          <div className="max-w-md">
            <h2 className="text-3xl font-bold leading-tight">
              Welcome back to your school platform.
            </h2>
            <p className="mt-4 text-sm text-white/80">
              Sign in to access your dashboard. Admins manage users and settings, teachers see
              their classes, students and parents track progress — each in their own view.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-white/90">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                Role-based dashboards
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                Department-scoped access
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                Archived records, always preserved
              </li>
            </ul>
          </div>

          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} School MS. All rights reserved.
          </p>
        </div>
      </aside>

      {/* Right — form */}
      <main className="flex w-full items-center justify-center px-4 py-10 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <Link
            href="/"
            className="mb-8 flex items-center gap-2 text-lg font-semibold lg:hidden"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--brand)] text-white">
              <GraduationCap className="h-5 w-5" />
            </span>
            School MS
          </Link>

          <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
          <p className="mt-1.5 text-sm text-[var(--fg-muted)]">
            Enter your credentials to access your dashboard.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            {/* Error banner */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-[var(--accent-300)] bg-[var(--accent-100)] p-3 text-sm text-[var(--accent-900)]"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-[var(--fg-base)]"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                placeholder="you@school.local"
                className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2.5 text-sm text-[var(--fg-base)] placeholder:text-[var(--fg-muted)]/70 focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-[var(--fg-base)]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={submitting}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2.5 pr-10 text-sm text-[var(--fg-base)] placeholder:text-[var(--fg-muted)]/70 focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-[var(--fg-muted)] hover:text-[var(--fg-base)]"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || !email || !password}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--brand-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="mt-6 text-xs text-[var(--fg-muted)]">
            Forgot your password? Contact your school administrator.
          </p>

          <div className="mt-8 border-t border-[var(--border-color)] pt-6 text-center text-sm text-[var(--fg-muted)]">
            <Link href="/" className="hover:text-[var(--fg-base)]">
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}