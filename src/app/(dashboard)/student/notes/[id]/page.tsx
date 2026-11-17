"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useNote } from "@/hooks/useContent";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Loader2, ArrowLeft, Download, ExternalLink } from "lucide-react";

export default function StudentNoteDetailPage() {
  const { id } = useParams() as { id: string };
  const { data: note, isLoading } = useNote(id);

  if (isLoading) return <div className="p-8"><Loader2 className="animate-spin text-[var(--brand)]" /></div>;
  if (!note) return <div className="p-8 text-red-500">Note not found.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/student/notes" className="p-2 rounded-full hover:bg-[var(--bg-muted)]"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-2xl font-bold text-[var(--fg-base)]">{note.title}</h1>
      </div>

      <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-sm space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge>{note.subject?.name}</Badge>
          <Badge>{note.class?.name}</Badge>
          <Badge variant="success">{note.teacher?.firstName} {note.teacher?.lastName}</Badge>
        </div>
        <div>
          <h2 className="font-semibold text-sm text-[var(--fg-muted)] mb-1">Description</h2>
          <p className="text-sm text-[var(--fg-base)] whitespace-pre-wrap">{note.description || "No description provided."}</p>
        </div>
        <div>
          <h2 className="font-semibold text-sm text-[var(--fg-muted)] mb-2">Attachments</h2>
          {note.files?.length === 0 ? (
            <p className="text-sm text-[var(--fg-muted)]">No files attached.</p>
          ) : (
            <div className="space-y-2">
              {note.files?.map((file: any) => (
                <a key={file.id} href={file.url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-[var(--bg-muted)] rounded-lg hover:bg-[var(--bg-muted)]/70">
                  <span className="text-sm font-medium">{file.originalName}</span>
                  <ExternalLink className="h-4 w-4 text-[var(--fg-muted)]" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}