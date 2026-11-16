import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

// ==========================================
// 1. TERMS
// ==========================================
export function useTerms(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: ["academic", "terms", params],
    queryFn: async () => {
      const { data } = await api.get("/admin/academic/terms", { params });
      return data;
    },
    placeholderData: (prev) => prev,
  });
}

export function useCreateTerm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => (await api.post("/admin/academic/terms", payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["academic", "terms"] }),
  });
}

export function useUpdateTerm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => (await api.patch(`/admin/academic/terms/${id}`, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["academic", "terms"] }),
  });
}

export function useDeleteTerm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/admin/academic/terms/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["academic", "terms"] }),
  });
}

// ==========================================
// 2. SUBJECTS
// ==========================================
export function useSubjects(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: ["academic", "subjects", params],
    queryFn: async () => {
      const { data } = await api.get("/admin/academic/subjects", { params });
      return data;
    },
    placeholderData: (prev) => prev,
  });
}

export function useCreateSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => (await api.post("/admin/academic/subjects", payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["academic", "subjects"] }),
  });
}

export function useDeleteSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/admin/academic/subjects/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["academic", "subjects"] }),
  });
}

// ==========================================
// 3. CLASSES
// ==========================================
export function useClasses(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: ["academic", "classes", params],
    queryFn: async () => {
      const { data } = await api.get("/admin/academic/classes", { params });
      return data;
    },
    placeholderData: (prev) => prev,
  });
}

export function useCreateClass() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => (await api.post("/admin/academic/classes", payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["academic", "classes"] }),
  });
}

export function useDeleteClass() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/admin/academic/classes/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["academic", "classes"] }),
  });
}

// ==========================================
// 4. ENROLLMENTS
// ==========================================
// export function useEnrollments(params: Record<string, any> = {}) {
//   return useQuery({
//     queryKey: ["academic", "enrollments", params],
//     queryFn: async () => {
//       const { data } = await api.get("/admin/academic/enrollments", { params });
//       return data;
//     },
//     placeholderData: (prev) => prev,
//   });
// }

// export function useBulkEnroll() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: async (payload: any) => (await api.post("/admin/academic/enrollments/bulk", payload)).data,
//     onSuccess: () => qc.invalidateQueries({ queryKey: ["academic", "enrollments"] }),
//   });
// }

// ==========================================
// 5. TIMETABLE
// ==========================================
export function useTimetable(params: Record<string, any> = {}, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ["academic", "timetable", params],
    queryFn: async () => {
      const { data } = await api.get("/timetable", { params });
      return data;
    },
    placeholderData: (prev) => prev,
    enabled: options.enabled ?? true,
  });
}
// export function useTimetable(params: Record<string, any> = {}) {
//   return useQuery({
//     queryKey: ["academic", "timetable", params],
//     queryFn: async () => {
//       const { data } = await api.get("/timetable", { params });
//       return data;
//     },
//     placeholderData: (prev) => prev,
//   });
// }

export function useCreateTimetableSlot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => (await api.post("/timetable", payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["academic", "timetable"] }),
  });
}



// ==========================================
// 6. ROOMS  (NEW)
// ==========================================
export type Room = {
  id: string;
  name: string;
  code: string | null;
  capacity: number | null;
  building: string | null;
  floor: number | null;
  description: string | null;
  isActive: boolean;
};

export function useRooms(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: ["academic", "rooms", params],
    queryFn: async () => {
      const { data } = await api.get("/admin/rooms", { params });
      return data as { data: Room[]; meta: { page: number; limit: number; total: number } };
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useCreateRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      name: string;
      code?: string;
      capacity?: number;
      building?: string;
      floor?: number;
      description?: string;
    }) => (await api.post("/admin/rooms", payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["academic", "rooms"] }),
  });
}

export function useDeleteRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/admin/rooms/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["academic", "rooms"] }),
  });
}

// ==========================================
// 7. TEACHERS  (fixed to expose Teacher.id)
// ==========================================
export type TeacherUser = {
  id: string;                       // User.id
  email: string;
  role: "TEACHER";
  teacherProfile: {
    id: string;                     // Teacher.id  ← use this in /timetable
    firstName: string;
    lastName: string;
    departmentId: string;
    employeeCode: string;
  } | null;
};

export function useTeachers() {
  return useQuery({
    queryKey: ["users", "teachers"],
    queryFn: async () => {
      const { data } = await api.get("/admin/users", {
        params: { role: "TEACHER", limit: 100 },
      });
      return (data.data as TeacherUser[]).filter((u) => u.teacherProfile !== null);
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ==========================================
// 8. CLASS-SUBJECTS (The missing link)
// ==========================================
export function useClassSubjects(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: ["academic", "class-subjects", params],
    queryFn: async () => {
      const { data } = await api.get("/admin/academic/class-subjects", { params });
      return data;
    },
    placeholderData: (prev) => prev,
  });
}

export function useCreateClassSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { classId: string; subjectId: string; teacherId: string }) => 
      (await api.post("/admin/academic/class-subjects", payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["academic", "class-subjects"] }),
  });
}

export function useDeleteClassSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/admin/academic/class-subjects/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["academic", "class-subjects"] }),
  });
}

// ==========================================
// 4. ENROLLMENTS
// ==========================================
export function useEnrollments(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: ["academic", "enrollments", params],
    queryFn: async () => {
      const { data } = await api.get("/admin/academic/enrollments", { params });
      return data;
    },
    placeholderData: (prev) => prev,
  });
}

// NEW: Single Enrollment
export function useSingleEnroll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { classId: string; studentId: string; term: string }) => 
      (await api.post("/admin/academic/enrollments", payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["academic", "enrollments"] });
      toast.success("Student enrolled successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || "Failed to enroll student");
    },
  });
}

// Existing: Bulk Enrollment
export function useBulkEnroll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => (await api.post("/admin/academic/enrollments/bulk", payload)).data,
    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: ["academic", "enrollments"] });
      toast.success(`Enrolled ${data.created} students (${data.skipped} skipped)`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || "Failed to enroll students");
    },
  });
}

// NEW: Withdraw Student (Soft Delete)
export function useWithdrawEnrollment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/admin/academic/enrollments/${id}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["academic", "enrollments"] });
      toast.success("Student withdrawn from class");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || "Failed to withdraw student");
    },
  });
}