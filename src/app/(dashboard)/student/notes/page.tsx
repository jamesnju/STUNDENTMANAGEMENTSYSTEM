"use client";

import { useNotes } from "@/hooks/useContent";
import { Table, THead, TR, TH, TD, TBody } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Loader2, FileText, Download, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function StudentNotesPage() {
  const { data, isLoading } = useNotes({ limit: 50 });

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-[var(--brand)]" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6 text-[var(--brand)]" /> Class Notes
        </h1>
        <p className="text-sm text-[var(--fg-muted)]">Study materials from your teachers.</p>
      </div>

      {data?.data?.length === 0 ? (
        <div className="text-center p-12 border border-dashed border-[var(--border-color)] rounded-xl text-[var(--fg-muted)]">
          No notes have been shared with your class yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.data?.map((note: any) => (
            <Link key={note.id} href={`/student/notes/${note.id}`} className="block group">
              <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl group-hover:border-[var(--brand)] transition-colors shadow-sm h-full">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="success">{note.subject?.name || "General"}</Badge>
                  <FileText className="h-5 w-5 text-[var(--fg-muted)]" />
                </div>
                <h3 className="font-bold text-[var(--fg-base)] mb-1">{note.title}</h3>
                <p className="text-sm text-[var(--fg-muted)] line-clamp-2">{note.description || "No description."}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-[var(--fg-muted)]">
                  <span>By {note.teacher?.firstName} {note.teacher?.lastName}</span>
                  <span>{note.files?.length || 0} file(s)</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}