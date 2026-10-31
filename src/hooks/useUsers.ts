import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

// 1. Hook to fetch a list of users
export function useUsers(params: Record<string, any>) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: async () => {
      const { data } = await api.get("/admin/users", { params });
      return data; // { success: true, data: [...], meta: { page, limit, total } }
    },
    placeholderData: (prev) => prev,
  });
}

// 2. Hook to fetch a single user by ID (THIS WAS MISSING)
export function useUser(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const { data } = await api.get(`/admin/users/${id}`);
      return data.data;
    },
    enabled: !!id, // Only run the query if we have an ID
  });
}

// 3. Hook to archive a user
export function useArchiveUser(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => api.delete(`/admin/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
    },
  });
}

// 4. Hook to restore a user
export function useRestoreUser(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => api.post(`/admin/users/${id}/restore`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
    },
  });
}