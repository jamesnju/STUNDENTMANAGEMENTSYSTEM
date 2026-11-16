"use client";

import { useState, Suspense, type FormEvent } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

import {
  Loader2,
  GraduationCap,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";

import { ROLE_HOME } from "@/lib/constants";

// We separate the logic into a child component so we can wrap it in Suspense
// (required for useSearchParams in Next.js 16)
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Handle login submission
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
        const session = await getSession();

        if (session?.user?.role) {
          const destination = ROLE_HOME[session.user.role];

          if (!destination) {
            setError("No dashboard is configured for your role.");
            return;
          }

          // Show success toast
          toast.success(`Welcome back, ${session.user.email?.split("@")[0]}!`, {
            icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
          });

          router.push(destination);
          router.refresh();
        } else {
          setError("Failed to load user role. Please contact admin.");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-base text-fg">
      {/* Left — brand panel (hidden on mobile) */}
      <aside className="relative hidden w-1/2 overflow-hidden bg-brand lg:block">
        <div className="flex h-full flex-col justify-between p-10 text-on-brand">
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
              Sign in to access your dashboard. Admins manage users and settings,
              teachers see their classes, students and parents track progress —
              each in their own view.
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

      {/* Right — login form */}
      <main className="flex w-full items-center justify-center px-4 py-10 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <Link
            href="/"
            className="mb-8 flex items-center gap-2 text-lg font-semibold lg:hidden"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-on-brand">
              <GraduationCap className="h-5 w-5" />
            </span>
            School MS
          </Link>

          <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>

          <p className="mt-1.5 text-sm text-fg-muted">
            Enter your credentials to access your dashboard.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            {/* Session Timeout Banner */}
            {reason === "timeout" && (
              <div className="flex items-start gap-2 rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800 dark:border-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>You were logged out due to inactivity. Please sign in again.</span>
              </div>
            )}

            {reason === "expired" && (
              <div className="flex items-start gap-2 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-700 dark:bg-red-900/30 dark:text-red-400">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Your session has expired. Please sign in again.</span>
              </div>
            )}

            {/* Error banner */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger-soft p-3 text-sm text-danger-soft-fg"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-fg">
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
                className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-fg placeholder:text-fg-muted/70 transition-colors hover:border-line-strong focus:border-brand focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-fg">
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
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 pr-10 text-sm text-fg placeholder:text-fg-muted/70 transition-colors hover:border-line-strong focus:border-brand focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-fg-muted transition-colors hover:text-fg"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || !email || !password}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-on-brand transition-colors hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-base disabled:cursor-not-allowed disabled:opacity-60"
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

          {/* Forgot password */}
          <p className="mt-6 text-xs text-fg-muted">
            Forgot your password? Contact your school administrator.
          </p>

          {/* Back to home */}
          <div className="mt-8 border-t border-line pt-6 text-center text-sm text-fg-muted">
            <Link href="/" className="transition-colors hover:text-fg">
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

// Wrap the form in Suspense to satisfy Next.js 16's static rendering
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-base"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>}>
      <LoginForm />
    </Suspense>
  );
}

// "use client";

// import { useState, type FormEvent } from "react";
// import { signIn, getSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// import {
//   Loader2,
//   GraduationCap,
//   AlertCircle,
//   Eye,
//   EyeOff,
// } from "lucide-react";

// import { ROLE_HOME } from "@/lib/constants";

// export default function LoginPage() {
//   const router = useRouter();

//   // Form state
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [submitting, setSubmitting] = useState(false);

//   // Handle login submission
//   async function handleSubmit(e: FormEvent<HTMLFormElement>) {
//     e.preventDefault();

//     setError(null);
//     setSubmitting(true);

//     try {
//       const result = await signIn("credentials", {
//         email,
//         password,
//         redirect: false,
//       });

//       if (!result) {
//         setError("Unexpected error. Please try again.");
//         return;
//       }

//       if (result.error) {
//         setError("Invalid email or password.");
//         return;
//       }

//       if (result.ok) {
//         const session = await getSession();

//         if (session?.user?.role) {
//           const destination = ROLE_HOME[session.user.role];

//           if (!destination) {
//             setError("No dashboard is configured for your role.");
//             return;
//           }

//           router.push(destination);
//           router.refresh();
//         } else {
//           setError("Failed to load user role. Please contact admin.");
//         }
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       setError("Something went wrong. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   return (
//     <div className="flex min-h-screen bg-base text-fg">

//       {/* Left — brand panel (hidden on mobile) */}
//       <aside className="relative hidden w-1/2 overflow-hidden bg-brand lg:block">
//         <div className="flex h-full flex-col justify-between p-10 text-on-brand">

//           <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
//             <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/15">
//               <GraduationCap className="h-5 w-5" />
//             </span>
//             School MS
//           </Link>

//           <div className="max-w-md">
//             <h2 className="text-3xl font-bold leading-tight">
//               Welcome back to your school platform.
//             </h2>

//             <p className="mt-4 text-sm text-white/80">
//               Sign in to access your dashboard. Admins manage users and settings,
//               teachers see their classes, students and parents track progress —
//               each in their own view.
//             </p>

//             <ul className="mt-8 space-y-3 text-sm text-white/90">
//               <li className="flex items-center gap-2">
//                 <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
//                 Role-based dashboards
//               </li>
//               <li className="flex items-center gap-2">
//                 <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
//                 Department-scoped access
//               </li>
//               <li className="flex items-center gap-2">
//                 <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
//                 Archived records, always preserved
//               </li>
//             </ul>
//           </div>

//           <p className="text-xs text-white/60">
//             © 2026 School MS. All rights reserved.
//           </p>

//         </div>
//       </aside>

//       {/* Right — login form */}
//       <main className="flex w-full items-center justify-center px-4 py-10 lg:w-1/2">
//         <div className="w-full max-w-md">

//           {/* Mobile brand */}
//           <Link
//             href="/"
//             className="mb-8 flex items-center gap-2 text-lg font-semibold lg:hidden"
//           >
//             <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-on-brand">
//               <GraduationCap className="h-5 w-5" />
//             </span>
//             School MS
//           </Link>

//           <h1 className="text-2xl font-bold tracking-tight">
//             Sign in
//           </h1>

//           <p className="mt-1.5 text-sm text-fg-muted">
//             Enter your credentials to access your dashboard.
//           </p>

//           <form
//             onSubmit={handleSubmit}
//             className="mt-8 space-y-5"
//             noValidate
//           >

//             {/* Error banner */}
//             {error && (
//               <div
//                 role="alert"
//                 className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger-soft p-3 text-sm text-danger-soft-fg"
//               >
//                 <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
//                 <span>{error}</span>
//               </div>
//             )}

//             {/* Email */}
//             <div>
//               <label
//                 htmlFor="email"
//                 className="mb-1.5 block text-sm font-medium text-fg"
//               >
//                 Email
//               </label>

//               <input
//                 id="email"
//                 type="email"
//                 autoComplete="email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 disabled={submitting}
//                 placeholder="you@school.local"
//                 className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-fg placeholder:text-fg-muted/70 transition-colors hover:border-line-strong focus:border-brand focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
//               />
//             </div>

//             {/* Password */}
//             <div>
//               <label
//                 htmlFor="password"
//                 className="mb-1.5 block text-sm font-medium text-fg"
//               >
//                 Password
//               </label>

//               <div className="relative">
//                 <input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   autoComplete="current-password"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   disabled={submitting}
//                   placeholder="••••••••"
//                   className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 pr-10 text-sm text-fg placeholder:text-fg-muted/70 transition-colors hover:border-line-strong focus:border-brand focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
//                 />

//                 <button
//                   type="button"
//                   onClick={() => setShowPassword((v) => !v)}
//                   aria-label={showPassword ? "Hide password" : "Show password"}
//                   className="absolute inset-y-0 right-0 flex items-center px-3 text-fg-muted transition-colors hover:text-fg"
//                   tabIndex={-1}
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-4 w-4" />
//                   ) : (
//                     <Eye className="h-4 w-4" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={submitting || !email || !password}
//               className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-on-brand transition-colors hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-base disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               {submitting ? (
//                 <>
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                   Signing in…
//                 </>
//               ) : (
//                 "Sign in"
//               )}
//             </button>

//           </form>

//           {/* Forgot password */}
//           <p className="mt-6 text-xs text-fg-muted">
//             Forgot your password? Contact your school administrator.
//           </p>

//           {/* Back to home */}
//           <div className="mt-8 border-t border-line pt-6 text-center text-sm text-fg-muted">
//             <Link href="/" className="transition-colors hover:text-fg">
//               ← Back to home
//             </Link>
//           </div>

//         </div>
//       </main>
//     </div>
//   );
// }