"use client";

import { useState, useRef } from "react";
import { useSignFile, useUploadFile } from "@/hooks/useFiles";
import { Button } from "@/components/ui/Button";
import { Loader2, UploadCloud, CheckCircle2 } from "lucide-react";

export function FileUploader({ category, onUploadSuccess }: { category: string, onUploadSuccess: (file: any) => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: signFile } = useSignFile();
  const { mutateAsync: uploadServer } = useUploadFile();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      // Rule: If file > 4.5MB, use Cloudinary Direct. Else, use Server.
      if (file.size > 4.5 * 1024 * 1024) {
        // DIRECT CLOUDINARY UPLOAD
        const signed = await signFile(category);
        
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", signed.apiKey);
        formData.append("timestamp", signed.timestamp);
        formData.append("folder", signed.folder);
        formData.append("signature", signed.signature);

        const cloudRes = await fetch(signed.uploadUrl, { method: "POST", body: formData });
        const cloudData = await cloudRes.json();

        if (!cloudRes.ok) throw new Error(cloudData.error?.message || "Cloudinary upload failed");

        // TODO: Post the public_id to your backend if needed by the specific feature.
        // For now, we return the Cloudinary data.
        onUploadSuccess({
          url: cloudData.secure_url,
          publicId: cloudData.public_id,
          originalName: file.name,
          bytes: cloudData.bytes,
        });
      } else {
        // SERVER UPLOAD
        const res = await uploadServer({ file, category });
        onUploadSuccess(res);
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.message || "Upload failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
      <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="w-full">
        {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
        {isUploading ? "Uploading..." : "Select File"}
      </Button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}