// src/components/files/types.ts  (or add to src/types/file.ts)
export interface UploadedFile {
  id: string;
  originalName: string;
  category?: string;
  mimeType?: string;
  size?: number;
  url?: string;
  createdAt?: string;
}