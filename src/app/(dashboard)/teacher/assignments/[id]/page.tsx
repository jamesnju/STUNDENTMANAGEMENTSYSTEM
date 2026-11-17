"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAssignment, useSubmissions, useGradeSubmission } from "@/hooks/useContent";
import { Table, THead, TR, TH, TD, TBody } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, ArrowLeft, X, CheckCircle2 } from "lucide-react";

export default function AssignmentDetailPage() {
  const { id } = useParams() as { id: string };
  const { data: assignment, isLoading: loadingAsg } = useAssignment(id);
  const { data: submissions, isLoading: loadingSubs } = useSubmissions(id, { limit: 100 });
  const { mutate: gradeSubmission, isPending: isGrading } = useGradeSubmission();

  const [gradingId, setGradingId] = useState<string | null>(null);
  const [gradeForm, setGradeForm] = useState({ grade: "", feedback: "" });

  const handleGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingId) return;
    gradeSubmission({ id: gradingId, payload: { grade: Number(gradeForm.grade), feedback: gradeForm.feedback } }, {
      onSuccess: () => { setGradingId(null); setGradeForm({ grade: "", feedback: "" }); }
    });
  };

  if (loadingAsg) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[var(--brand)]" /></div>;
  if (!assignment) return <div className="p-8 text-red-500">Assignment not found.</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/teacher/assignments" className="p-2 rounded-full hover:bg-[var(--bg-muted)]"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-2xl font-bold text-[var(--fg-base)]">{assignment.title}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-2 p-6 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl">
          <h2 className="font-bold text-lg text-[var(--fg-base)]">Instructions</h2>
          <p className="text-sm text-[var(--fg-muted)] whitespace-pre-wrap">{assignment.instructions || "No instructions provided."}</p>
        </div>
        <div className="space-y-4 p-6 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--fg-muted)]">Status</span>
            <Badge variant={assignment.status === "PUBLISHED" ? "success" : "warning"}>{assignment.status}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--fg-muted)]">Due</span>
            <span className="text-sm">{assignment.dueAt ? new Date(assignment.dueAt).toLocaleString() : "—"}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[var(--fg-base)]">Submissions ({submissions?.data?.length || 0})</h2>
        {loadingSubs ? <Loader2 className="animate-spin text-[var(--brand)]" /> : (
          <Table>
            <THead>
              <TR>
                <TH>Student</TH>
                <TH>Submitted</TH>
                <TH>Grade</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {submissions?.data?.map((sub: any) => (
                <TR key={sub.id}>
                  <TD className="font-medium">{sub.student.firstName} {sub.student.lastName}</TD>
                  <TD className="text-sm text-[var(--fg-muted)]">{new Date(sub.submittedAt).toLocaleString()}</TD>
                  <TD>
                    {sub.grade !== null ? <Badge variant="success">{sub.grade}</Badge> : <Badge variant="warning">Ungraded</Badge>}
                  </TD>
                  <TD className="text-right">
                    <Button variant="secondary" className="h-8 px-3 text-xs" onClick={() => { setGradingId(sub.id); setGradeForm({ grade: sub.grade?.toString() || "", feedback: sub.feedback || "" }); }}>
                      {sub.grade !== null ? "Re-grade" : "Grade"}
                    </Button>
                  </TD>
                </TR>
              ))}
              {submissions?.data?.length === 0 && (
                <TR><TD colSpan={4} className="text-center py-8 text-[var(--fg-muted)]">No submissions yet.</TD></TR>
              )}
            </TBody>
          </Table>
        )}
      </div>

      {gradingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={handleGrade} className="w-full max-w-md bg-[var(--bg-surface)] rounded-xl shadow-xl">
            <div className="flex justify-between items-center p-4 border-b border-[var(--border-color)]">
              <h2 className="font-bold text-lg">Grade Submission</h2>
              <button type="button" onClick={() => setGradingId(null)}><X className="h-5 w-5" /></button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-xs font-medium mb-1 block">Grade (0-100)</label>
                <Input type="number" min="0" required value={gradeForm.grade} onChange={e => setGradeForm({...gradeForm, grade: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">Feedback</label>
                <textarea className="w-full h-24 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] p-3 text-sm" value={gradeForm.feedback} onChange={e => setGradeForm({...gradeForm, feedback: e.target.value})} />
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-[var(--border-color)]">
              <Button type="button" variant="secondary" onClick={() => setGradingId(null)}>Cancel</Button>
              <Button type="submit" loading={isGrading}><CheckCircle2 className="mr-2 h-4 w-4" /> Save Grade</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}