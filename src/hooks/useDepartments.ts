import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface DepartmentParams {
  page?: number;
  limit?: number;
  search?: string;
}

// 1. List Departments
export function useDepartments(params: DepartmentParams = {}) {
  return useQuery({
    queryKey: ["departments", params],
    queryFn: async () => {
      const { data } = await api.get("/admin/departments", { params });
      return data; // { success, data: [], meta }
    },
    placeholderData: (prev) => prev,
  });
}

// 2. Get Single Department (with member counts)
export function useDepartment(id: string) {
  return useQuery({
    queryKey: ["departments", id],
    queryFn: async () => {
      const { data } = await api.get(`/admin/departments/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

// 3. Get Department Members
export function useDepartmentMembers(id: string, params: Record<string, any> = {}) {
  return useQuery({
    queryKey: ["departments", id, "members", params],
    queryFn: async () => {
      const { data } = await api.get(`/admin/departments/${id}/members`, { params });
      return data; // { success, data: { department, teachers, students, ... }, meta }
    },
    enabled: !!id,
    placeholderData: (prev) => prev,
  });
}

// 4. Create Department
export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; code: string }) => {
      const { data } = await api.post("/admin/departments", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}

// 5. Update Department
export function useUpdateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: { name?: string; code?: string } }) => {
      const { data } = await api.patch(`/admin/departments/${id}`, payload);
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["departments", variables.id] });
    },
  });
}

// 6. Delete Department
export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/admin/departments/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}