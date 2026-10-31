// src/app/(dashboard)/dashboard/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const ROLE_HOME = {
  ADMIN: "/admin/users",
  TEACHER: "/teacher/profile",
  STUDENT: "/student/profile",
  PARENT: "/parent",
} as const;

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  redirect(ROLE_HOME[session.user.role]);
}