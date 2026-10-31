// types/api.ts
export interface ApiMeta { page: number; limit: number; total: number; [k: string]: unknown }
export interface ApiSuccess<T> { success: true; data: T; meta?: ApiMeta }
export interface ApiErrorPayload {
  code: "BAD_REQUEST" | "VALIDATION_ERROR" | "UNAUTHORIZED" | "FORBIDDEN"
      | "NOT_FOUND" | "CONFLICT" | "INTERNAL_ERROR";
  message: string;
  details?: { fieldErrors?: Record<string, string[]>; formErrors?: string[] };
}
export interface ApiFailure { success: false; error: ApiErrorPayload }
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;