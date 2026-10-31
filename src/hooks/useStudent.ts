import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useStudentGrades() {
  return useQuery({
    queryKey: ["student", "grades"],
    queryFn: async () => {
      const { data } = await api.get("/students/me/grades");
      return data.data; // returns { grades: [], studentId: "..." }
    },
  });
}