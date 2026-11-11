"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Users, Archive, Building2, Settings, User, 
  BookOpen, GraduationCap, CalendarCheck, Menu, X, LayoutDashboard, type LucideIcon,
} from "lucide-react";
import type { Role } from "@/types/user";
import { cn } from "@/app/utils/utils";

export interface NavItem {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
}

const ICONS: Record<string, LucideIcon> = {
  Users, Archive, Building2, Settings, User, 
  BookOpen, GraduationCap, CalendarCheck, LayoutDashboard,
};

const NAVIGATION: Record<Role, NavItem[]> = {
  ADMIN: [
    { href: "/admin/users", label: "Users", icon: "Users" },
    { href: "/admin/users/archived", label: "Archived Users", icon: "Archive" },
    { href: "/admin/departments", label: "Departments", icon: "Building2" },
    { href: "/admin/settings", label: "Settings", icon: "Settings" },
  ],
  TEACHER: [
    { href: "/teacher/dashboard", label: "Overview", icon: "LayoutDashboard" },
    { href: "/teacher/profile", label: "My Profile", icon: "User" },
    { href: "/teacher/classes", label: "My Classes", icon: "BookOpen" },
    { href: "/teacher/students", label: "My Students", icon: "Users" },
  ],
  STUDENT: [
    { href: "/student/dashboard", label: "Overview", icon: "LayoutDashboard" },
    { href: "/student/profile", label: "My Profile", icon: "User" },
    { href: "/student/classes", label: "My Classes", icon: "BookOpen" },
    { href: "/student/grades", label: "Grades", icon: "GraduationCap" },
    { href: "/student/attendance", label: "Attendance", icon: "CalendarCheck" },
  ],
  PARENT: [
    { href: "/parent/dashboard", label: "Overview", icon: "LayoutDashboard" },
    { href: "/parent", label: "My Children", icon: "Users" },
  ],
};

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  // Fallback to empty if session isn't loaded yet
  const role = session?.user?.role as Role | undefined;
  const items = role ? NAVIGATION[role] : [];

  const Nav = (
    <nav className="flex flex-col gap-1 p-3 mt-4">
      {items.map((item) => {
        const Icon = ICONS[item.icon] ?? Users;
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              active
                ? "bg-[var(--brand)] text-white shadow-md shadow-[var(--brand)]/20"
                : "text-[var(--fg-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--fg-base)] hover:translate-x-1"
            )}
          >
            <Icon className={cn("h-4 w-4 shrink-0", active ? "text-white" : "text-[var(--fg-muted)]")} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-30 rounded-md bg-[var(--bg-surface)] p-2 border border-[var(--border-color)] text-[var(--fg-base)] lg:hidden shadow-sm"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-[var(--border-color)] bg-[var(--bg-surface)] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-[var(--border-color)] px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-[var(--fg-base)]">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand)] text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span>School MS</span>
          </Link>
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