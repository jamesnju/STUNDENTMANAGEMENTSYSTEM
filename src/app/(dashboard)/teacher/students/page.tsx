"use client";

import { useTeacherStudents } from "@/hooks/useTeacher";
import { Table, THead, TR, TH, TD } from "@/components/ui/Table";
import { Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function TeacherStudentsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get("page")) || 1;

  const { data, isLoading } = useTeacherStudents({ page, limit: 10 });

  if (isLoading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Students</h1>
        <p className="text-sm text-[var(--fg-muted)]">Students in your department.</p>
      </div>

      <Table>
        <THead>
          <TR>
            <TH>Name</TH>
            <TH>Admission No</TH>
            <TH>Email</TH>
            <TH>Classes</TH>
          </TR>
        </THead>
        <tbody>
          {data?.data.map((student: any) => (
            <TR key={student.id}>
              <TD className="font-medium">{student.firstName} {student.lastName}</TD>
              <TD>{student.admissionNo}</TD>
              <TD className="text-[var(--fg-muted)]">{student.user.email}</TD>
              <TD>
                {student.enrollments.map((e: any) => e.class.name).join(", ") || "—"}
              </TD>
            </TR>
          ))}
          {data?.data.length === 0 && (
            <TR><TD colSpan={4} className="text-center py-8">No students found.</TD></TR>
          )}
        </tbody>
      </Table>
      
      {/* Add pagination controls here similar to Admin Users */}
    </div>
  );
}