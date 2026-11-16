"use client";

import { signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, Sun, Moon, ChevronDown, Home } from "lucide-react";
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
  ADMIN: "bg-accent-soft text-accent-soft-fg",
  TEACHER: "bg-brand-soft text-brand-soft-fg",
  STUDENT: "bg-info-soft text-info-soft-fg",
  PARENT: "bg-success-soft text-success-soft-fg",
};

function getPageTitle(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const last = segments[segments.length - 1] ?? "";
  if (!last) return "Dashboard";
  return last.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function Topbar({ user }: TopbarProps) {
  const { theme, toggle } = useTheme();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const initials = (user.email ?? "?").split("@")[0].slice(0, 2).toUpperCase();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const pageTitle = getPageTitle(pathname);

  return (
    <header className="z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-line bg-muted px-4 lg:px-6">
      {/* Left — breadcrumb + page title */}
      <div className="flex min-w-0 items-center gap-2 text-sm">
        <Link
          href="/"
          className="flex items-center gap-1 text-fg-muted transition-colors hover:text-fg"
        >
          <Home className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Home</span>
        </Link>
        <span className="text-fg-subtle">/</span>
        <span className="truncate font-semibold text-fg">{pageTitle}</span>
      </div>

      {/* Right — theme toggle + user menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-label="Toggle theme"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-2.5 transition-colors hover:border-line-strong"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-brand text-[11px] font-bold text-on-brand">
              {initials}
            </span>
            <span className="hidden max-w-[180px] flex-col items-start leading-tight sm:flex">
              <span className="truncate text-xs font-semibold text-fg">
                {user.email?.split("@")[0] ?? "—"}
              </span>
              <span className="text-[10px] font-medium text-fg-muted">
                {ROLE_LABEL[user.role]}
              </span>
            </span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-fg-muted transition-transform",
                menuOpen && "rotate-180"
              )}
            />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-64 overflow-hidden rounded-xl border border-line bg-surface shadow-lg"
            >
              <div className="border-b border-line bg-inset px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-brand text-sm font-bold text-on-brand">
                    {initials}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-fg">
                      {user.email?.split("@")[0] ?? "—"}
                    </p>
                    <p className="truncate text-xs text-fg-muted">{user.email ?? "—"}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    "mt-3 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                    ROLE_STYLE[user.role]
                  )}
                >
                  {ROLE_LABEL[user.role]}
                </span>
              </div>

              <div className="p-1.5">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger-soft"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}