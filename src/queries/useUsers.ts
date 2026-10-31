// hooks/queries/useUsers.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { User, Role } from "@/types/user";
import type { ApiSuccess } from "@/types/api";
import { qk } from "./queryKeys";

export interface UserListParams { page?: number; limit?: number; role?: Role; departmentId?: string; isActive?: boolean; search?: string; sortBy?: string; sortDir?: "asc" | "desc"; }

export function useUsers(params: UserListParams = {}) {
  return useQuery({
    queryKey: qk.users(params),
    queryFn: async () => {
      const { data } = await api.get<ApiSuccess<User[]>>("/admin/users", { params });
      return data;
    },
    placeholderData: (prev) => prev,   // keeps previous page visible while fetching
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: qk.user(id),
    queryFn: async () => {
      const { data } = await api.get<ApiSuccess<User>>(`/admin/users/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}