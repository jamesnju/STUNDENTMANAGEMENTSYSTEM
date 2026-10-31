"use client";

import { signOut } from "next-auth/react";
import { LogOut, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import type { Role } from "@/types/user";
import { cn } from "@/app/utils/utils";

interface TopbarProps {
  user: {
    email: string | null;
    role: Role;
    departmentId: string | null;
  };
}

const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "Administrator",
  TEACHER: "Teacher",
  STUDENT: "Student",
  PARENT: "Parent",
};

const ROLE_STYLE: Record<Role, string> = {
  ADMIN: "bg-[var(--accent-200)] text-[var(--accent-900)]",
  TEACHER: "bg-[var(--primary-200)] text-[var(--primary-900)]",
  STUDENT: "bg-[var(--secondary-200)] text-[var(--secondary-900)]",
  PARENT: "bg-[var(--background-300)] text-[var(--background-900)]",
};

export function Topbar({ user }: TopbarProps) {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-surface)] px-4 lg:px-6">
      <div className="w-10 lg:hidden" />

      <div className="ml-auto flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-label="Toggle theme"
          className="rounded-md p-2 text-[var(--fg-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--fg-base)]"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <div className="hidden items-center gap-2 sm:flex">
          <span className="max-w-[160px] truncate text-sm text-[var(--fg-base)]">
            {user.email ?? "—"}
          </span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium",
              ROLE_STYLE[user.role]
            )}
          >
            {ROLE_LABEL[user.role]}
          </span>
        </div>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-1 rounded-md border border-[var(--border-color)] px-3 py-1.5 text-sm text-[var(--fg-base)] hover:bg-[var(--bg-muted)]"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
}