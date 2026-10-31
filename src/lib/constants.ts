import type { Role } from "@/types/user";

export const ROLE_HOME: Record<Role, string> = {
  ADMIN: "/admin/users",
  TEACHER: "/teacher/students", // or /teacher/profile depending on preference
  STUDENT: "/student/grades",
  PARENT: "/parent",
};