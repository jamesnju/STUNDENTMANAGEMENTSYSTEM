// src/app/(dashboard)/layout.tsx
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Script from "next/script";

const NAV = {
  ADMIN: [
    { href: "/admin/users", label: "Users", icon: "Users" },
    { href: "/admin/users/archived", label: "Archived Users", icon: "Archive" },
    { href: "/admin/departments", label: "Departments", icon: "Building2" },
    { href: "/admin/settings", label: "Settings", icon: "Settings" },
  ],
  TEACHER: [
    { href: "/teacher/profile", label: "My Profile", icon: "User" },
    { href: "/teacher/classes", label: "My Classes", icon: "BookOpen" },
    { href: "/teacher/students", label: "Students", icon: "Users" },
  ],
  STUDENT: [
    { href: "/student/profile", label: "My Profile", icon: "User" },
    { href: "/student/classes", label: "My Classes", icon: "BookOpen" },
    { href: "/student/grades", label: "Grades", icon: "GraduationCap" },
    { href: "/student/attendance", label: "Attendance", icon: "CalendarCheck" },
  ],
  PARENT: [{ href: "/parent", label: "My Children", icon: "Users" }],
} as const;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { role, departmentId } = session.user;
  const email = session.user.email ?? "";

  return (
    <>
      {/*
        Runs on first paint inside the dashboard. Because the outer layout
        already rendered with no `dark` class, we sync here before React
        hydrates the rest of the tree.
        The dashboard is wrapped in a `settable` ThemeProvider below, so
        once hydrated the Topbar toggle works normally.
      */}
      <Script id="enable-theme-toggle" strategy="beforeInteractive">
        {`
          (function(){
            document.documentElement.setAttribute("data-theme-settable", "true");
            try {
              var t = localStorage.getItem("theme");
              if (t === "dark") document.documentElement.classList.add("dark");
              else document.documentElement.classList.remove("dark");
            } catch (_) {}
          })();
        `}
      </Script>

      <ThemeProvider settable defaultTheme="light">
        <div className="flex min-h-screen bg-[var(--bg-base)]">
          <Sidebar items={NAV[role]} />
          <div className="flex flex-1 flex-col">
            <Topbar user={{ email, role, departmentId }} />
            <main className="p-6">{children}</main>
          </div>
        </div>
      </ThemeProvider>
    </>
  );
}