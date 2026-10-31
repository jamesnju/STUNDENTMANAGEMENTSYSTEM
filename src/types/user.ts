// types/user.ts
export type Role = "ADMIN" | "TEACHER" | "STUDENT" | "PARENT";

export interface TeacherProfile {
  id: string; userId: string; departmentId: string;
  firstName: string; lastName: string; employeeCode: string;
  hireDate: string; isActive: boolean; deletedAt: string | null;
}
export interface StudentProfile {
  id: string; userId: string; departmentId: string;
  firstName: string; lastName: string; admissionNo: string;
  dateOfBirth: string; parentId: string | null;
  isActive: boolean; deletedAt: string | null;
}
export interface ParentProfile {
  id: string; userId: string; firstName: string; lastName: string; phone: string;
}
export interface User {
  id: string; email: string; role: Role; isActive: boolean;
  deletedAt: string | null; createdAt: string; updatedAt: string;
  teacherProfile: TeacherProfile | null;
  studentProfile: StudentProfile | null;
  parentProfile: ParentProfile | null;
}