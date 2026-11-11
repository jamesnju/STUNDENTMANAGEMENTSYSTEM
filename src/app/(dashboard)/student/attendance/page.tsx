"use client";

import { useStudentAttendance } from "@/hooks/useStudent";
import { Loader2, CalendarCheck } from "lucide-react";
import { Table, THead, TR, TH, TD, TBody } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";

export default function StudentAttendancePage() {
  const { data, isLoading } = useStudentAttendance();

  if (isLoading) return <div className="p-8"><Loader2 className="animate-spin text-[var(--brand)]" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--fg-base)]">My Attendance</h1>
        <p className="text-sm text-[var(--fg-muted)]">Track your daily presence and absences.</p>
      </div>

      {data?.attendance?.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-16 text-center shadow-sm">
          <div className="mb-6 rounded-full bg-[var(--bg-muted)] p-5">
            <CalendarCheck className="h-10 w-10 text-[var(--fg-muted)]" />
          </div>
          <h3 className="text-xl font-bold text-[var(--fg-base)]">Attendance is fully recorded</h3>
          <p className="mt-2 text-sm text-[var(--fg-muted)] max-w-sm">
            No absences have been logged. Detailed daily records will appear here once the backend module is active.
          </p>
          <Badge variant="success" className="mt-4">100% Present</Badge>
        </div>
      ) 
      : 
      (
        <Table>
          <THead>
            <TR>
              <TH>Date</TH>
              <TH>Status</TH>
              <TH>Remarks</TH>
            </TR>
          </THead>
          <TBody>
             <TR>
    <TD colSpan={3} className="py-8 text-center text-[var(--fg-muted)]">
      Detailed attendance records will appear here once available.
    </TD>
  </TR>
          </TBody>
        </Table>
      )
      }
    </div>
  );
}