import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface SettingParams {
  page?: number;
  limit?: number;
  search?: string;
}

export function useSettings(params?: SettingParams) {
  return useQuery({
    queryKey: ["settings", params],
    queryFn: async () => {
      const { data } = await api.get("/admin/settings", { params });
      return data; // { success, data: [], meta }
    },
    placeholderData: (prev) => prev,
  });
}

export function useCreateSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post("/admin/settings", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}

export function useUpdateSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ param, payload }: { param: string; payload: any }) => {
      const { data } = await api.patch(`/admin/settings/${param}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}

export function useDeleteSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (param: string) => {
      const { data } = await api.delete(`/admin/settings/${param}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}