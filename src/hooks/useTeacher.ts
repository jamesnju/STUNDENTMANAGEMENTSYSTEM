import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useTeacherProfile() {
  return useQuery({
    queryKey: ["teacher", "me"],
    queryFn: async () => {
      const { data } = await api.get("/teachers/me");
      return data.data;
    },
  });
}

export function useTeacherClasses() {
  return useQuery({
    queryKey: ["teacher", "classes"],
    queryFn: async () => {
      const { data } = await api.get("/teachers/me/classes");
      return data.data;
    },
  });
}

export function useTeacherStudents(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: ["teacher", "students", params],
    queryFn: async () => {
      const { data } = await api.get("/teachers/me/students", { params });
      return data; // returns { success, data, meta }
    },
    placeholderData: (prev) => prev,
  });
}