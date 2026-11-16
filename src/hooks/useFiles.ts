import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useFiles(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: ["files", params],
    queryFn: async () => {
      const { data } = await api.get("/files", { params });
      return data;
    },
  });
}

export function useSignFile() {
  return useMutation({
    mutationFn: async (category: string) => {
      const { data } = await api.get(`/files/sign?category=${category}`);
      return data.data;
    },
  });
}

export function useUploadFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, category }: { file: File, category: string }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);
      
      const { data } = await api.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["files"] }),
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/files/${id}`);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["files"] }),
  });
}