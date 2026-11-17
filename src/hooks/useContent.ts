import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

// ==========================================
// 1. NOTES
// ==========================================
export function useNotes(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: ["notes", params],
    queryFn: async () => {
      const { data } = await api.get("/notes", { params });
      return data;
    },
    placeholderData: (prev) => prev,
  });
}

export function useNote(id: string) {
  return useQuery({
    queryKey: ["notes", id],
    queryFn: async () => (await api.get(`/notes/${id}`)).data.data,
    enabled: !!id,
  });
}

export function useCreateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => (await api.post("/notes", payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note created");
    },
    onError: (err: any) => toast.error(err.response?.data?.error?.message || "Failed to create note"),
  });
}

export function useUpdateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) =>
      (await api.patch(`/notes/${id}`, payload)).data,
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      qc.invalidateQueries({ queryKey: ["notes", v.id] });
      toast.success("Note updated");
    },
    onError: (err: any) => toast.error(err.response?.data?.error?.message || "Failed to update note"),
  });
}

export function usePublishNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.post(`/notes/${id}/publish`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note published");
    },
    onError: (err: any) => toast.error(err.response?.data?.error?.message || "Failed to publish"),
  });
}

export function useDeleteNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/notes/${id}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note deleted");
    },
    onError: (err: any) => toast.error(err.response?.data?.error?.message || "Failed to delete"),
  });
}

// ==========================================
// 2. ASSIGNMENTS
// ==========================================
export function useAssignments(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: ["assignments", params],
    queryFn: async () => {
      const { data } = await api.get("/assignments", { params });
      return data;
    },
    placeholderData: (prev) => prev,
  });
}

export function useAssignment(id: string) {
  return useQuery({
    queryKey: ["assignments", id],
    queryFn: async () => (await api.get(`/assignments/${id}`)).data.data,
    enabled: !!id,
  });
}

export function useCreateAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => (await api.post("/assignments", payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assignments"] });
      toast.success("Assignment created");
    },
    onError: (err: any) => toast.error(err.response?.data?.error?.message || "Failed to create assignment"),
  });
}

export function useUpdateAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) =>
      (await api.patch(`/assignments/${id}`, payload)).data,
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["assignments"] });
      qc.invalidateQueries({ queryKey: ["assignments", v.id] });
      toast.success("Assignment updated");
    },
    onError: (err: any) => toast.error(err.response?.data?.error?.message || "Failed to update"),
  });
}

export function usePublishAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.post(`/assignments/${id}/publish`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assignments"] });
      toast.success("Assignment published");
    },
    onError: (err: any) => toast.error(err.response?.data?.error?.message || "Failed to publish"),
  });
}

export function useCloseAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.post(`/assignments/${id}/close`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assignments"] });
      toast.success("Assignment closed");
    },
    onError: (err: any) => toast.error(err.response?.data?.error?.message || "Failed to close"),
  });
}

export function useDeleteAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/assignments/${id}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assignments"] });
      toast.success("Assignment deleted");
    },
    onError: (err: any) => toast.error(err.response?.data?.error?.message || "Failed to delete"),
  });
}

// ==========================================
// 3. SUBMISSIONS
// ==========================================
export function useSubmissions(assignmentId: string, params: Record<string, any> = {}) {
  return useQuery({
    queryKey: ["submissions", assignmentId, params],
    queryFn: async () => {
      const { data } = await api.get(`/assignments/${assignmentId}/submissions`, { params });
      return data;
    },
    enabled: !!assignmentId,
    placeholderData: (prev) => prev,
  });
}

export function useSubmission(id: string) {
  return useQuery({
    queryKey: ["submissions", id],
    queryFn: async () => (await api.get(`/submissions/${id}`)).data.data,
    enabled: !!id,
  });
}

export function useMySubmission(assignmentId: string) {
  return useQuery({
    queryKey: ["submissions", "me", assignmentId],
    queryFn: async () => {
      try {
        const { data } = await api.get(`/assignments/${assignmentId}/submissions/me`);
        return data.data;
      } catch (err: any) {
        if (err.response?.status === 404) return null;
        throw err;
      }
    },
    enabled: !!assignmentId,
  });
}

export function useSubmitAssignment(assignmentId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { content?: string; fileIds?: string[] }) =>
      (await api.post(`/assignments/${assignmentId}/submit`, payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["submissions"] });
      qc.invalidateQueries({ queryKey: ["submissions", "me", assignmentId] });
      toast.success("Assignment submitted");
    },
    onError: (err: any) => toast.error(err.response?.data?.error?.message || "Failed to submit"),
  });
}

export function useGradeSubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: { grade: number; feedback?: string } }) =>
      (await api.patch(`/submissions/${id}/grade`, payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["submissions"] });
      toast.success("Submission graded");
    },
    onError: (err: any) => toast.error(err.response?.data?.error?.message || "Failed to grade"),
  });
}