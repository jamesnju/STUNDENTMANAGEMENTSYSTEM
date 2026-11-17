// src/components/layout/DashboardShellClient.tsx
"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import type { Role } from "@/types/user";

interface DashboardShellClientProps {
  user: {
    email: string;
    role: Role;
    departmentId: string | null;
  };
  children: React.ReactNode;
}

export function DashboardShellClient({
  user,
  children,
}: DashboardShellClientProps) {
  // Restore last preference; default open on first visit / SSR.
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem("sidebar-collapsed") === "true";
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("sidebar-collapsed", String(next));
      } catch {
        /* ignore quota / private-mode errors */
      }
      return next;
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-base)]">
      <Sidebar collapsed={collapsed} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar
          user={user}
          sidebarCollapsed={collapsed}
          onToggleSidebar={toggleSidebar}
        />

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}