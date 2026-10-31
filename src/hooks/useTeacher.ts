import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useTeacherStudents(params: Record<string, any>) {
  return useQuery({
    queryKey: ["teacher", "students", params],
    queryFn: async () => {
      const { data } = await api.get("/teachers/me/students", { params });
      return data;
    },
    placeholderData: (prev) => prev,
  });
}