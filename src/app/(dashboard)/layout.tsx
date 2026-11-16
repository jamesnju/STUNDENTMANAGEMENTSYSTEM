// src/app/(dashboard)/layout.tsx
import { Suspense } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { InactivityProvider } from "@/components/providers/InactivityProvider";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";

async function DashboardShell({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { role, departmentId } = session.user;
  const email = session.user.email ?? "";

  return (
    <ThemeProvider settable defaultTheme="light">
      {/* 1. Change to h-screen to lock the viewport height */}
      <div className="flex h-screen overflow-hidden bg-[var(--bg-base)]">
        
        {/* 2. Sidebar is now fixed height due to parent flex */}
        <Sidebar />
        
        {/* 3. Right side container takes remaining space */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar user={{ email, role, departmentId }} />
          
          {/* 4. Main content scrolls independently */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
        
      </div>
    </ThemeProvider>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[var(--bg-base)]">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--brand)]" />
        </div>
      }
    >
      <InactivityProvider>
        <DashboardShell>{children}</DashboardShell>
      </InactivityProvider>
    </Suspense>
  );
}