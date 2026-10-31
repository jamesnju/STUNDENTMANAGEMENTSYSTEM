// src/app/403/page.tsx
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-base)] px-4 text-[var(--fg-base)]">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-[var(--accent-100)] text-[var(--accent-700)]">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold">Access denied</h1>
        <p className="mt-2 text-sm text-[var(--fg-muted)]">
          Your role doesn't have permission to view this page. If you believe this is a mistake,
          contact your administrator.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--brand-hover)]"
          >
            Go to dashboard
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-2 text-sm font-medium hover:bg-[var(--bg-muted)]"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}