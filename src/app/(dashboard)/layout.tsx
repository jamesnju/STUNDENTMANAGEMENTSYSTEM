// src/app/(dashboard)/layout.tsx
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Script from "next/script";

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
          {/* The Sidebar now handles its own navigation based on session */}
          <Sidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <Topbar user={{ email, role, departmentId }} />
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
          </div>
        </div>
      </ThemeProvider>
    </>
  );
}

// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useState } from "react";
// import {
//   Users,
//   Archive,
//   Building2,
//   Settings,
//   User,
//   BookOpen,
//   GraduationCap,
//   CalendarCheck,
//   LayoutDashboard, // <-- Added this
//   Menu,
//   X,
//   type LucideIcon,
// } from "lucide-react";
// import { cn } from "../utils/utils";

// // 1. Define the exact shape of a NavItem
// export interface NavItem {
//   href: string;
//   label: string;
//   icon: string;
// }

// // 2. Map the string names to the actual Lucide components
// const ICONS: Record<string, LucideIcon> = {
//   Users,
//   Archive,
//   Building2,
//   Settings,
//   User,
//   BookOpen,
//   GraduationCap,
//   CalendarCheck,
//   LayoutDashboard, // <-- Added this
// };

// // 3. Strictly type the props
// interface SidebarProps {
//   items: readonly NavItem[];
// }

// export function Sidebar({ items }: SidebarProps) {
//   const pathname = usePathname();
//   const [open, setOpen] = useState(false);

//   const Nav = (
//     <nav className="flex flex-col gap-1 p-3">
//       {items.map((item) => {
//         const Icon = ICONS[item.icon] || Users; // fallback to Users if icon not found
        
//         // Active when pathname equals or is nested under href
//         const active =
//           pathname === item.href || 
//           (item.href !== "/admin" && item.href !== "/teacher" && item.href !== "/student" && pathname.startsWith(item.href + "/"));

//         return (
//           <Link
//             key={item.href}
//             href={item.href}
//             onClick={() => setOpen(false)}
//             className={cn(
//               "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
//               active
//                 ? "bg-[var(--primary-900)] text-[var(--primary-100)]"
//                 : "text-[var(--fg-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--fg-base)]"
//             )}
//           >
//             <Icon className="h-4 w-4 shrink-0" />
//             <span>{item.label}</span>
//           </Link>
//         );
//       })}
//     </nav>
//   );

//   return (
//     <>
//       {/* Mobile trigger */}
//       <button
//         type="button"
//         aria-label="Open menu"
//         onClick={() => setOpen(true)}
//         className="fixed left-4 top-4 z-30 rounded-md bg-[var(--bg-surface)] p-2 border border-[var(--border-color)] text-[var(--fg-base)] lg:hidden"
//       >
//         <Menu className="h-5 w-5" />
//       </button>

//       {/* Mobile overlay */}
//       {open && (
//         <div
//           className="fixed inset-0 z-40 bg-black/40 lg:hidden"
//           onClick={() => setOpen(false)}
//         />
//       )}

//       {/* Sidebar panel */}
//       <aside
//         className={cn(
//           "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-[var(--border-color)] bg-[var(--bg-surface)] transition-transform duration-200 lg:static lg:translate-x-0",
//           open ? "translate-x-0" : "-translate-x-full"
//         )}
//       >
//         <div className="flex h-14 items-center justify-between border-b border-[var(--border-color)] px-4">
//           <span className="text-sm font-semibold text-[var(--fg-base)]">
//             School MS
//           </span>
//           <button
//             type="button"
//             aria-label="Close menu"
//             onClick={() => setOpen(false)}
//             className="rounded-md p-1 text-[var(--fg-muted)] hover:text-[var(--fg-base)] lg:hidden"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>
//         {Nav}
//       </aside>
//     </>
//   );
// }