"use client";

import { useState } from "react";
import { useEnrollments, useClasses } from "@/hooks/useAcademic";
import { Table, THead, TR, TH, TD, TBody } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Loader2, UserPlus, Search } from "lucide-react";
import { Input } from "@/components/ui/Input";

export default function EnrollmentsPage() {
  const [classFilter, setClassFilter] = useState("");
  const { data: classes } = useClasses({ limit: 100 });
  const { data, isLoading } = useEnrollments({ classId: classFilter || undefined, limit: 50 });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-[var(--brand)]" /> Enrollments
          </h1>
          <p className="text-sm text-[var(--fg-muted)]">Global view of student class enrollments.</p>
        </div>
      </div>

      <div className="flex gap-2 max-w-sm">
        <select 
          className="w-full h-10 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 text-sm"
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
        >
          <option value="">All Classes</option>
          {classes?.data.map((cls: any) => (
            <option key={cls.id} value={cls.id}>{cls.name} ({cls.academicYear})</option>
          ))}
        </select>
      </div>

      {isLoading ? <Loader2 className="animate-spin text-[var(--brand)]" /> : (
        <Table>
          <THead><TR><TH>Student</TH><TH>Admission No</TH><TH>Class</TH><TH>Term</TH><TH>Status</TH><TH>Enrolled At</TH></TR></THead>
          <TBody>
            {data?.data.map((enr: any) => (
              <TR key={enr.id}>
                <TD className="font-medium">{enr.student.firstName} {enr.student.lastName}</TD>
                <TD><Badge>{enr.student.admissionNo}</Badge></TD>
                <TD>{enr.class.name} ({enr.class.code})</TD>
                <TD>{enr.term}</TD>
                <TD><Badge variant={enr.isActive ? "success" : "danger"}>{enr.isActive ? "Active" : "Withdrawn"}</Badge></TD>
                <TD className="text-sm text-[var(--fg-muted)]">{new Date(enr.enrolledAt).toLocaleDateString()}</TD>
              </TR>
            ))}
            {data?.data.length === 0 && <TR><TD colSpan={6} className="text-center py-8 text-[var(--fg-muted)]">No enrollments found.</TD></TR>}
          </TBody>
        </Table>
      )}
    </div>
  );
}