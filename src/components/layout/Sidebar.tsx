"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Users,
  Archive,
  Building2,
  Settings,
  User,
  BookOpen,
  GraduationCap,
  CalendarCheck,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/app/utils/utils";

export interface NavItem {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
}

const ICONS: Record<string, LucideIcon> = {
  Users,
  Archive,
  Building2,
  Settings,
  User,
  BookOpen,
  GraduationCap,
  CalendarCheck,
};

export function Sidebar({ items }: { items: readonly NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const Nav = (
    <nav className="flex flex-col gap-1 p-3">
      {items.map((item) => {
        const Icon = ICONS[item.icon] ?? Users;
        // Active when pathname equals or is nested under href
        const active =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-[var(--primary-900)] text-[var(--primary-100)]"
                : "text-[var(--fg-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--fg-base)]"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile trigger (inside Topbar area is fine too — placed here for self-containment) */}
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-30 rounded-md bg-[var(--bg-surface)] p-2 border border-[var(--border-color)] text-[var(--fg-base)] lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-[var(--border-color)] bg-[var(--bg-surface)] transition-transform duration-200 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-[var(--border-color)] px-4">
          <span className="text-sm font-semibold text-[var(--fg-base)]">
            School MS
          </span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="rounded-md p-1 text-[var(--fg-muted)] hover:text-[var(--fg-base)] lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {Nav}
      </aside>
    </>
  );
}