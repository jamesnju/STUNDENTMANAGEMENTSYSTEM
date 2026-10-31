// lib/queryKeys.ts
export const qk = {
  users: (p?: object) => ["users", p] as const,
  user: (id: string) => ["users", id] as const,
  archivedUsers: (p?: object) => ["users", "archived", p] as const,
  departments: (p?: object) => ["departments", p] as const,
  department: (id: string) => ["departments", id] as const,
  departmentMembers: (id: string, p?: object) => ["departments", id, "members", p] as const,
  settings: (p?: object) => ["settings", p] as const,
  setting: (param: string) => ["settings", param] as const,
  teacherMe: () => ["teacher", "me"] as const,
  teacherClasses: () => ["teacher", "classes"] as const,
  teacherStudents: (p?: object) => ["teacher", "students", p] as const,
  teacherStudent: (id: string) => ["teacher", "student", id] as const,
  studentMe: () => ["student", "me"] as const,
  studentClasses: () => ["student", "classes"] as const,
  studentGrades: () => ["student", "grades"] as const,
  studentAttendance: () => ["student", "attendance"] as const,
};