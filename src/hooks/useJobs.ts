import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface JobHistoryParams {
  page?: number;
  limit?: number;
}

// 1. List available jobs
export function useAvailableJobs() {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const { data } = await api.get("/admin/jobs");
      return data.data as string[];
    },
  });
}

// 2. Get Job History
export function useJobHistory(params: JobHistoryParams = {}) {
  return useQuery({
    queryKey: ["jobs", "history", params],
    queryFn: async () => {
      const { data } = await api.get("/admin/jobs/history", { params });
      return data; // { success, data: [], meta }
    },
    placeholderData: (prev) => prev,
  });
}

// 3. Run a Job
export function useRunJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ jobName, payload }: { jobName: string; payload: any }) => {
      const { data } = await api.post(`/admin/jobs/${jobName}/run`, payload);
      return data.data;
    },
    onSuccess: () => {
      // Invalidate history so the new run appears instantly
      queryClient.invalidateQueries({ queryKey: ["jobs", "history"] });
    },
  });
}