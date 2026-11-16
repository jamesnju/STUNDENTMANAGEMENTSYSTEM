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
      <div className="flex min-h-screen bg-[var(--bg-base)]">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar user={{ email, role, departmentId }} />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
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

// // src/app/(dashboard)/layout.tsx
// import { Suspense } from "react";
// import { Sidebar } from "@/components/layout/Sidebar";
// import { Topbar } from "@/components/layout/Topbar";
// import { ThemeProvider } from "@/components/providers/ThemeProvider";
// import { auth } from "@/lib/auth";
// import { redirect } from "next/navigation";
// import Script from "next/script";
// import { Loader2 } from "lucide-react";

// async function DashboardShell({ children }: { children: React.ReactNode }) {
//   const session = await auth();
//   if (!session?.user) redirect("/login");

//   const { role, departmentId } = session.user;
//   const email = session.user.email ?? "";

//   return (
//     <ThemeProvider settable defaultTheme="light">
//       {/* Shell: full viewport, no outer scroll */}
//       <div className="flex h-screen overflow-hidden bg-base">
//         <Sidebar />
//         {/* Right column: topbar (fixed height) + scrolling main */}
//         <div className="flex flex-1 flex-col overflow-hidden">
//           <Topbar user={{ email, role, departmentId }} />
//           <main className="flex-1 overflow-y-auto p-6">{children}</main>
//         </div>
//       </div>
//     </ThemeProvider>
//   );
// }

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <>
//       <Script id="enable-theme-toggle" strategy="beforeInteractive">
//         {`
//           (function(){
//             document.documentElement.setAttribute("data-theme-settable", "true");
//             try {
//               var t = localStorage.getItem("theme");
//               if (t === "dark") document.documentElement.classList.add("dark");
//               else document.documentElement.classList.remove("dark");
//             } catch (_) {}
//           })();
//         `}
//       </Script>

//       <Suspense
//         fallback={
//           <div className="flex h-screen items-center justify-center bg-base">
//             <Loader2 className="h-8 w-8 animate-spin text-brand" />
//           </div>
//         }
//       >
//         <DashboardShell>{children}</DashboardShell>
//       </Suspense>
//     </>
//   );
// }