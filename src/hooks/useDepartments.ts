import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useDepartments(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["departments", params],
    queryFn: async () => {
      const { data } = await api.get("/admin/departments", { params });
      return data;
    },
  });
}