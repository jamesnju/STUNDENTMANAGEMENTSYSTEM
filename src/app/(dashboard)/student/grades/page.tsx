"use client";

import { useStudentGrades } from "@/hooks/useStudent";
import { Loader2, GraduationCap } from "lucide-react";
import { Table, THead, TR, TH, TD, TBody } from "@/components/ui/Table";

export default function StudentGradesPage() {
  const { data, isLoading } = useStudentGrades();

  if (isLoading) return <div className="p-8"><Loader2 className="animate-spin text-[var(--brand)]" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--fg-base)]">My Grades</h1>
        <p className="text-sm text-[var(--fg-muted)]">Your academic performance across terms.</p>
      </div>

      {data?.grades?.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-16 text-center shadow-sm">
          <div className="mb-6 rounded-full bg-[var(--bg-muted)] p-5">
            <GraduationCap className="h-10 w-10 text-[var(--fg-muted)]" />
          </div>
          <h3 className="text-xl font-bold text-[var(--fg-base)]">No grades recorded yet</h3>
          <p className="mt-2 text-sm text-[var(--fg-muted)] max-w-sm">
            Your grades will appear here once your teachers publish them for the current term.
          </p>
        </div>
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Subject</TH>
              <TH>Assessment</TH>
              <TH>Score</TH>
              <TH>Grade</TH>
            </TR>
          </THead>
          <TBody>
            {/* Data mapping will go here when backend is ready */}
             <TR>
    <TD colSpan={3} className="py-8 text-center text-[var(--fg-muted)]">
      Detailed grade records will appear here once available.
    </TD>
  </TR>
          </TBody>
        </Table>
      )}
    </div>
  );
}