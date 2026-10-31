"use client";

import { useStudentGrades } from "@/hooks/useStudent";
import { Loader2, GraduationCap } from "lucide-react";

export default function StudentGradesPage() {
  const { data, isLoading } = useStudentGrades();

  if (isLoading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Grades</h1>
        <p className="text-sm text-[var(--fg-muted)]">Your academic performance across terms.</p>
      </div>

      {data?.grades.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-12 text-center">
          <div className="mb-4 rounded-full bg-[var(--bg-muted)] p-4">
            <GraduationCap className="h-8 w-8 text-[var(--fg-muted)]" />
          </div>
          <h3 className="text-lg font-medium">No grades recorded yet</h3>
          <p className="mt-1 text-sm text-[var(--fg-muted)]">
            Your grades will appear here once your teachers publish them.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Render actual grades here when the API is populated */}
        </div>
      )}
    </div>
  );
}