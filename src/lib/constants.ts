import type { Role } from "@/types/user";

export const ROLE_HOME: Record<Role, string> = {
  ADMIN: "/admin/users",
  TEACHER: "/teacher", // <-- Updated to point to the new dashboard
  STUDENT: "/student/grades",
  PARENT: "/parent",
};