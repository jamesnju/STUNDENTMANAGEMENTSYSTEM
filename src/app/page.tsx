// src/app/page.tsx
import Link from "next/link";
import {
  Users,
  BookOpen,
  ShieldCheck,
  Building2,
  GraduationCap,
  BarChart3,
  ArrowRight,
} from "lucide-react";

const FEATURES = [
  {
    icon: Users,
    title: "For every role",
    body: "Admins, teachers, students, and parents each get a dedicated portal with the tools they need — nothing they don't.",
  },
  {
    icon: Building2,
    title: "Department-aware",
    body: "Teachers and students are grouped by department. Teachers only see students in their own department — enforced at the API.",
  },
  {
    icon: BookOpen,
    title: "Classes & enrollment",
    body: "Organize students into classes, assign a teacher to each, and see enrollment counts in real time.",
  },
  {
    icon: GraduationCap,
    title: "Grades & attendance",
    body: "Students and parents track academic progress and attendance history from one place.",
  },
  {
    icon: ShieldCheck,
    title: "Data that stays",
    body: "When a teacher or student leaves, their record is archived — never deleted. Restore any time, historical data intact.",
  },
  {
    icon: BarChart3,
    title: "Configurable",
    body: "Pass marks, terms, grade scales, and feature toggles live in a system settings store. Change them without a deploy.",
  },
];

const ROLES = [
  {
    role: "Administrators",
    desc: "Manage users, departments, and system configuration.",
    points: ["Create & archive users", "Manage departments", "System parameters"],
  },
  {
    role: "Teachers",
    desc: "See your classes and the students in your department.",
    points: ["Class roster", "Student profiles", "Department-scoped data"],
  },
  {
    role: "Students",
    desc: "Check your classes, grades, and attendance.",
    points: ["Enrollment details", "Grade history", "Attendance log"],
  },
  {
    role: "Parents",
    desc: "Follow your child's academic progress.",
    points: ["Linked students", "Grade visibility", "Attendance alerts"],
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--fg-base)]">
      {/* ---------------- Navbar ---------------- */}
      <header className="sticky top-0 z-30 border-b border-[var(--border-color)] bg-[var(--bg-surface)]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--brand)] text-white">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span>School MS</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm sm:flex">
            <a href="#features" className="text-[var(--fg-muted)] hover:text-[var(--fg-base)]">
              Features
            </a>
            <a href="#roles" className="text-[var(--fg-muted)] hover:text-[var(--fg-base)]">
              Roles
            </a>
            <a href="#about" className="text-[var(--fg-muted)] hover:text-[var(--fg-base)]">
              About
            </a>
          </nav>
          <Link
            href="/login"
            className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--brand-hover)]"
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* ---------------- Hero ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-1 text-xs text-[var(--fg-muted)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
              Built for one school, ready to grow
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              One platform for your
              <span className="text-[var(--brand)]"> entire school</span>.
            </h1>
            <p className="mt-4 text-lg text-[var(--fg-muted)]">
              Teachers, students, parents, and admins — together in one place.
              Role-based access, department scoping, and a configurable core
              that scales with you.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--brand-hover)]"
              >
                Sign in to your account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-5 py-2.5 text-sm font-medium hover:bg-[var(--bg-muted)]"
              >
                Explore features
              </a>
            </div>
          </div>

          {/* Hero visual — lightweight, CSS-only "dashboard preview" */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[var(--primary-200)]/40 via-[var(--accent-200)]/30 to-[var(--secondary-200)]/40 blur-2xl" />
            <div className="relative rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary-400)]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent-400)]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--secondary-400)]" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-[var(--bg-muted)] p-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-[var(--primary-300)]" />
                    <div>
                      <div className="h-2.5 w-24 rounded bg-[var(--fg-muted)]/40" />
                      <div className="mt-1 h-2 w-16 rounded bg-[var(--fg-muted)]/20" />
                    </div>
                  </div>
                  <span className="rounded-full bg-[var(--primary-200)] px-2 py-0.5 text-[10px] font-medium text-[var(--primary-900)]">
                    Teacher
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-[var(--bg-muted)] p-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-[var(--accent-300)]" />
                    <div>
                      <div className="h-2.5 w-28 rounded bg-[var(--fg-muted)]/40" />
                      <div className="mt-1 h-2 w-20 rounded bg-[var(--fg-muted)]/20" />
                    </div>
                  </div>
                  <span className="rounded-full bg-[var(--accent-200)] px-2 py-0.5 text-[10px] font-medium text-[var(--accent-900)]">
                    Student
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-[var(--bg-muted)] p-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-[var(--secondary-300)]" />
                    <div>
                      <div className="h-2.5 w-20 rounded bg-[var(--fg-muted)]/40" />
                      <div className="mt-1 h-2 w-16 rounded bg-[var(--fg-muted)]/20" />
                    </div>
                  </div>
                  <span className="rounded-full bg-[var(--secondary-200)] px-2 py-0.5 text-[10px] font-medium text-[var(--secondary-900)]">
                    Parent
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Features ---------------- */}
      <section id="features" className="border-t border-[var(--border-color)] bg-[var(--bg-surface)] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight">Everything the school needs</h2>
            <p className="mt-3 text-[var(--fg-muted)]">
              Not a pile of features — a coherent system where each role sees exactly what they need
              and nothing more.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] p-6"
                >
                  <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-[var(--primary-100)] text-[var(--primary-700)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-[var(--fg-muted)]">{f.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- Roles ---------------- */}
      <section id="roles" className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight">Built for every seat in the school</h2>
            <p className="mt-3 text-[var(--fg-muted)]">
              Role-based access enforced in middleware and on the API. Each role gets its own
              dashboard — no clutter, no confusion.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ROLES.map((r) => (
              <div
                key={r.role}
                className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6"
              >
                <h3 className="font-semibold">{r.role}</h3>
                <p className="mt-1.5 text-sm text-[var(--fg-muted)]">{r.desc}</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {r.points.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand)]" />
                      <span className="text-[var(--fg-base)]">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section id="about" className="border-t border-[var(--border-color)] bg-[var(--bg-surface)] py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight">Ready to get started?</h2>
          <p className="mt-3 text-[var(--fg-muted)]">
            Sign in with the credentials from your administrator. Don't have them? Reach out to your
            school's admin office.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[var(--brand)] px-6 py-3 text-sm font-medium text-white hover:bg-[var(--brand-hover)]"
          >
            Sign in to your account
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="border-t border-[var(--border-color)] py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-[var(--fg-muted)] sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            <span>School MS</span>
          </div>
          <span>© {new Date().getFullYear()} School MS. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}