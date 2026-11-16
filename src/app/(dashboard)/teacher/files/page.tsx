"use client";

import { useFiles, useDeleteFile } from "@/hooks/useFiles";
import { Table, THead, TR, TH, TD, TBody } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Loader2, FileText, Trash2, ExternalLink } from "lucide-react";
import { FileUploader } from "@/components/ui/FileUploader";

export default function TeacherFilesPage() {
  const { data, isLoading, refetch } = useFiles({ limit: 20 });
  const { mutate: deleteFile } = useDeleteFile();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-[var(--fg-base)]">
            <FileText className="h-6 w-6 text-[var(--brand)]" /> My Files
          </h1>
          <p className="text-sm text-[var(--fg-muted)]">Manage notes, assignments, and attachments.</p>
        </div>
        <div className="w-48">
          <FileUploader category="NOTE" onUploadSuccess={() => refetch()} />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[var(--brand)]" /></div>
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>File Name</TH>
              <TH>Category</TH>
              <TH>Size</TH>
              <TH>Date</TH>
              <TH className="text-right">Actions</TH>
            </TR>
          </THead>
          <TBody>
            {data?.data.map((file: any) => (
              <TR key={file.id}>
                <TD className="font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[var(--fg-muted)]" /> {file.originalName}
                </TD>
                <TD><Badge>{file.category}</Badge></TD>
                <TD className="text-[var(--fg-muted)] text-sm">{(file.bytes / 1024).toFixed(1)} KB</TD>
                <TD className="text-[var(--fg-muted)] text-sm">{new Date(file.createdAt).toLocaleDateString()}</TD>
                <TD className="text-right">
                  <div className="flex justify-end gap-2">
                    <a href={file.url} target="_blank" rel="noreferrer">
                      <Button variant="secondary" className="h-8 px-2"><ExternalLink className="h-4 w-4" /></Button>
                    </a>
                    <Button variant="secondary" className="h-8 px-2 text-red-500" onClick={() => {
                      if(confirm("Delete this file?")) deleteFile(file.id);
                    }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}