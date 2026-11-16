import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

// Admin: List all notifications
export function useNotifications(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: async () => {
      const { data } = await api.get("/notifications", { params });
      return data;
    },
    placeholderData: (prev) => prev,
  });
}

// Admin: Get single notification detail
export function useNotification(id: string) {
  return useQuery({
    queryKey: ["notifications", id],
    queryFn: async () => {
      const { data } = await api.get(`/notifications/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

// Admin/Teacher: Create notification
export function useCreateNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post("/notifications", payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// Admin: Cancel pending notification
export function useCancelNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/notifications/${id}/cancel`);
      return data;
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", id] });
    },
  });
}

// All Users: Get own inbox
export function useInbox(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: ["notifications", "inbox", params],
    queryFn: async () => {
      const { data } = await api.get("/notifications/inbox", { params });
      return data; // { success, data: [], meta: { unread } }
    },
    placeholderData: (prev) => prev,
  });
}

// All Users: Mark inbox as read
export function useMarkRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (recipientIds?: string[]) => {
      const { data } = await api.post("/notifications/inbox/read", { recipientIds });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "inbox"] });
    },
  });
}