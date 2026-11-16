"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
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
  LayoutDashboard,
  Terminal,
  HelpCircle,FileText,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/types/user";
import { cn } from "@/app/utils/utils";

export interface NavItem {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
}

export interface NavSection {
  label: string;
  items: NavItem[];
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
  LayoutDashboard,
  Terminal,
  FileText,
};

const NAVIGATION: Record<Role, NavSection[]> = {
  ADMIN: [
    {
      label: "Management",
      items: [
        { href: "/admin/users", label: "Users", icon: "Users" },
        { href: "/admin/users/archived", label: "Archived Users", icon: "Archive" },
        { href: "/admin/notifications", label: "Notifications", icon: "Bell" }, 
        
  { href: "/admin/academic/terms", label: "Academic Terms", icon: "Calendar" }, 
  { href: "/admin/academic/subjects", label: "Subjects", icon: "BookOpen" }, 
  { href: "/admin/academic/classes", label: "Classes", icon: "Users" }, 
{ href: "/admin/academic/rooms", label: "Rooms", icon: "Building2" },
{ href: "/admin/academic/class-subjects", label: "Teacher Assignments", icon: "Link2" },
{ href: "/admin/academic/enrollments", label: "Enrollments", icon: "UserPlus" },
        { href: "/admin/departments", label: "Departments", icon: "Building2" },
        { href: "/admin/jobs", label: "Jobs", icon: "Terminal" },
      ],
    },
    {
      label: "System",
      items: [{ href: "/admin/settings", label: "Settings", icon: "Settings" }],
    },
  ],
  TEACHER: [
    {
      label: "Teaching",
      items: [
        { href: "/teacher/dashboard", label: "Overview", icon: "LayoutDashboard" },
        
    { href: "/teacher/inbox", label: "Inbox", icon: "Bell" }, // <-- Added
    { href: "/teacher/files", label: "My Files", icon: "FileText" }, // <-- Added
        { href: "/teacher/classes", label: "My Classes", icon: "BookOpen" },
        { href: "/teacher/students", label: "My Students", icon: "Users" },
      ],
    },
    {
      label: "Account",
      items: [{ href: "/teacher/profile", label: "My Profile", icon: "User" }],
    },
  ],
  STUDENT: [
    {
      label: "Learning",
      items: [
        { href: "/student/dashboard", label: "Overview", icon: "LayoutDashboard" },
        { href: "/student/classes", label: "My Classes", icon: "BookOpen" },
        { href: "/student/grades", label: "Grades", icon: "GraduationCap" },
            { href: "/student/inbox", label: "Inbox", icon: "Bell" }, // <-- Added

        { href: "/student/attendance", label: "Attendance", icon: "CalendarCheck" },
      ],
    },
    {
      label: "Account",
      items: [{ href: "/student/profile", label: "My Profile", icon: "User" }],
    },
  ],
  PARENT: [
    {
      label: "Family",
      items: [
        { href: "/parent/dashboard", label: "Overview", icon: "LayoutDashboard" },
            { href: "/parent/inbox", label: "Inbox", icon: "Bell" }, // <-- Added

        { href: "/parent", label: "My Children", icon: "Users" },
      ],
    },
  ],
};

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const role = session?.user?.role as Role | undefined;
  const sections = role ? NAVIGATION[role] : [];

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function toggleSidebar() {
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches) {
      setCollapsed((v) => !v);
    } else {
      setOpen((v) => !v);
    }
  }

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar: fixed-height flex child on desktop, fixed drawer on mobile */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen flex-col overflow-hidden border-r border-line bg-inset transition-[transform,width] duration-300 ease-in-out",
          // Mobile drawer
          "w-64 -translate-x-full",
          open && "translate-x-0",
          // Desktop: participates in flex layout, never scrolls with page
          "lg:static lg:h-full lg:translate-x-0",
          collapsed ? "lg:w-[4.75rem]" : "lg:w-64"
        )}
        aria-label="Primary navigation"
      >
        {/* Header */}
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b border-line",
            collapsed ? "lg:justify-center lg:px-2" : "justify-between px-4"
          )}
        >
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2.5 font-bold text-fg",
              collapsed && "lg:hidden"
            )}
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-on-brand">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="whitespace-nowrap text-sm">School MS</span>
              <span className="whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.14em] text-fg-muted">
                Management
              </span>
            </span>
          </Link>

          <Link
            href="/"
            className={cn(
              "hidden h-9 w-9 items-center justify-center rounded-xl bg-brand text-on-brand",
              collapsed && "lg:flex"
            )}
            aria-label="School MS home"
          >
            <GraduationCap className="h-5 w-5" />
          </Link>

          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={open || !collapsed ? "Collapse menu" : "Expand menu"}
            aria-expanded={!collapsed}
            className="grid h-8 w-8 place-items-center rounded-lg text-fg-muted transition-colors hover:bg-muted hover:text-fg"
          >
            {open ? (
              <X className="h-5 w-5 lg:hidden" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Navigation — the ONLY scrollable region inside the sidebar */}
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          {sections.map((section, sIdx) => (
            <div
              key={section.label}
              className={cn(sIdx > 0 && "mt-3 border-t border-line pt-3")}
            >
              <p
                className={cn(
                  "px-3 pb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-fg-subtle",
                  collapsed && "lg:hidden"
                )}
              >
                {section.label}
              </p>

              <div className="flex flex-col gap-1">
                {section.items.map((item) => {
                  const Icon = ICONS[item.icon] ?? Users;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      title={collapsed ? item.label : undefined}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        collapsed && "lg:justify-center lg:px-0",
                        active
                          ? "bg-brand-soft text-brand-soft-fg"
                          : "text-fg-muted hover:bg-muted hover:text-fg"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-brand opacity-0 transition-opacity",
                          active && "opacity-100",
                          collapsed && "lg:hidden"
                        )}
                        aria-hidden="true"
                      />
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          active ? "text-brand" : "text-fg-muted group-hover:text-fg"
                        )}
                      />
                      <span className={cn("truncate", collapsed && "lg:hidden")}>
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer — pinned to the bottom */}
        <div
          className={cn(
            "shrink-0 border-t border-line p-3",
            collapsed && "lg:px-2"
          )}
        >
          <Link
            href="/help"
            title={collapsed ? "Help & support" : undefined}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-fg-muted transition-colors hover:bg-muted hover:text-fg",
              collapsed && "lg:justify-center lg:px-0"
            )}
          >
            <HelpCircle className="h-4 w-4 shrink-0" />
            <span className={cn(collapsed && "lg:hidden")}>Help & support</span>
          </Link>

          <p
            className={cn(
              "mt-1 px-3 text-[10px] text-fg-subtle",
              collapsed && "lg:hidden"
            )}
          >
            v1.0.0
          </p>
        </div>
      </aside>
    </>
  );
}