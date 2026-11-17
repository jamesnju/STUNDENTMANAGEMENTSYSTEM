"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAssignment, useMySubmission, useSubmitAssignment } from "@/hooks/useContent";
import { useUploadFile } from "@/hooks/useFiles";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Loader2, ArrowLeft, UploadCloud, CheckCircle2, Paperclip, X } from "lucide-react";

export default function StudentAssignmentDetailPage() {
  const { id } = useParams() as { id: string };
  const { data: assignment, isLoading } = useAssignment(id);
  const { data: mySub, isLoading: loadingSub } = useMySubmission(id);
  const { mutate: submit, isPending: isSubmitting } = useSubmitAssignment(id);
  const { mutate: uploadFile, isPending: isUploading } = useUploadFile();

  const [content, setContent] = useState("");
  const [files, setFiles] = useState<any[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadFile({ file, category: "SUBMISSION_ATTACHMENT" }, {
      onSuccess: (res: any) => setFiles([...files, res]),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit({ content, fileIds: files.map(f => f.id) });
  };

  if (isLoading || loadingSub) return <div className="p-8"><Loader2 className="animate-spin text-[var(--brand)]" /></div>;
  if (!assignment) return <div className="p-8 text-red-500">Assignment not found.</div>;

  const isPastDue = assignment.dueAt && new Date(assignment.dueAt) < new Date();
  const canSubmit = assignment.status === "PUBLISHED" && !isPastDue && !mySub;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/student/assignments" className="p-2 rounded-full hover:bg-[var(--bg-muted)]"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-2xl font-bold text-[var(--fg-base)]">{assignment.title}</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-2 p-6 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl">
          <h2 className="font-bold text-lg">Instructions</h2>
          <p className="text-sm text-[var(--fg-muted)] whitespace-pre-wrap">{assignment.instructions || "No instructions provided."}</p>
        </div>
        <div className="space-y-3 p-6 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            {canSubmit ? <Badge variant="success">Open</Badge> : isPastDue ? <Badge variant="danger">Overdue</Badge> : <Badge>Closed</Badge>}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Due</span>
            <span className="text-sm">{assignment.dueAt ? new Date(assignment.dueAt).toLocaleString() : "—"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Attachments</span>
            <span className="text-sm">{assignment.files?.length || 0}</span>
          </div>
        </div>
      </div>

      {mySub ? (
        <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl space-y-4">
          <h2 className="font-bold text-lg flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-green-500" /> Your Submission</h2>
          <p className="text-sm text-[var(--fg-muted)]">Submitted on {new Date(mySub.submittedAt).toLocaleString()}</p>
          {mySub.content && (
            <div>
              <p className="text-xs font-medium text-[var(--fg-muted)] mb-1">Content</p>
              <p className="text-sm whitespace-pre-wrap">{mySub.content}</p>
            </div>
          )}
          {mySub.files?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-[var(--fg-muted)] mb-2">Files</p>
              <div className="space-y-1">
                {mySub.files.map((f: any) => (
                  <a key={f.id} href={f.url} target="_blank" rel="noreferrer" className="text-sm text-[var(--brand)] hover:underline block">
                    {f.originalName}
                  </a>
                ))}
              </div>
            </div>
          )}
          {mySub.grade !== null && (
            <div className="pt-3 border-t border-[var(--border-color)]">
              <p className="text-xs font-medium text-[var(--fg-muted)] mb-1">Grade</p>
              <p className="text-2xl font-bold text-[var(--brand)]">{mySub.grade}</p>
              {mySub.feedback && <p className="text-sm text-[var(--fg-muted)] mt-2">{mySub.feedback}</p>}
            </div>
          )}
        </div>
      ) : canSubmit ? (
        <form onSubmit={handleSubmit} className="p-6 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl space-y-4">
          <h2 className="font-bold text-lg">Submit Your Work</h2>
          <div>
            <label className="text-xs font-medium mb-1 block">Content (Optional)</label>
            <textarea className="w-full h-32 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] p-3 text-sm" value={content} onChange={e => setContent(e.target.value)} placeholder="Add notes or comments..." />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Attach Files</label>
            <label className="cursor-pointer block">
              <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
              <div className="border border-dashed border-[var(--border-color)] rounded-lg p-4 text-center hover:bg-[var(--bg-muted)]/30">
                {isUploading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : <Paperclip className="h-5 w-5 mx-auto text-[var(--fg-muted)]" />}
                <p className="text-xs text-[var(--fg-muted)] mt-1">Click to upload</p>
              </div>
            </label>
            {files.length > 0 && (
              <div className="mt-2 space-y-1">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center justify-between text-xs bg-[var(--bg-muted)] rounded px-2 py-1">
                    <span>{f.originalName}</span>
                    <button type="button" onClick={() => setFiles(files.filter((_: any, idx: number) => idx !== i))}><X className="h-3 w-3" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button type="submit" loading={isSubmitting} className="w-full"><UploadCloud className="mr-2 h-4 w-4" /> Submit Assignment</Button>
        </form>
      ) : (
        <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl text-center text-[var(--fg-muted)]">
          {isPastDue ? "This assignment is past due and can no longer be submitted." : "This assignment is closed."}
        </div>
      )}
    </div>
  );
}