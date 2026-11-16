import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export function useUsers(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: async () => {
      const { data } = await api.get("/admin/users", { params });
      return data;
    },
    placeholderData: (prev) => prev,
  });
}

// NEW: Fetch only Parents for the dropdown/search
// export function useParents(params: Record<string, any> = {}) {
//   return useQuery({
//     queryKey: ["users", "parents", params],
//     queryFn: async () => {
//       const { data } = await api.get("/admin/users", { params: { ...params, role: "PARENT", limit: 50 } });
//       return data.data;
//     },
//   });
// }

export function useUser(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const { data } = await api.get(`/admin/users/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

// UPDATE: Add payload type support
export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post("/admin/users", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", "parents"] });
      toast.success("User created successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || "Failed to create user");
    }
  });
}

export function useArchiveUser(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => api.delete(`/admin/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      toast.success("User archived successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || "Failed to archive user");
    }
  });
}

export function useRestoreUser(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => api.post(`/admin/users/${id}/restore`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      toast.success("User restored successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || "Failed to restore user");
    }
  });
}

export function useArchivedUsers(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: ["users", "archived", params],
    queryFn: async () => {
      const { data } = await api.get("/admin/users/archived", { params });
      return data;
    },
    placeholderData: (prev) => prev,
  });
}
// src/hooks/useUsers.ts

// Update this specific hook
export function useParents() {
  return useQuery({
    queryKey: ["users", "parents"],
    queryFn: async () => {
      // Fetch up to 100 parents once. 
      // If your school has more than 100 parents, you can increase this limit.
      const { data } = await api.get("/admin/users", { params: { role: "PARENT", limit: 100 } });
      return data.data; // Returns an array of parent users
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}
// Append to src/hooks/useUsers.ts

// NEW: Dedicated hook to fetch students for enrollment dropdowns
export function useStudents() {
  return useQuery({
    queryKey: ["users", "students"], // Unique key so it doesn't conflict with /admin/users
    queryFn: async () => {
      const { data } = await api.get("/admin/users", { 
        params: { role: "STUDENT", limit: 100 } 
      });
      
      // Log for debugging
      console.log("🎓 Students fetched from API:", data.data);
      
      // Filter out any users that don't have a student profile row
      return (data.data as any[]).filter(u => u.studentProfile !== null);
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 mins
  });
}