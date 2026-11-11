"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useDepartment, useDepartmentMembers } from "@/hooks/useDepartments";
import { Table, THead, TR, TH, TD, TBody } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Loader2, ArrowLeft, Users, GraduationCap, Mail } from "lucide-react";

export default function DepartmentDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [roleFilter, setRoleFilter] = useState<"" | "TEACHER" | "STUDENT">("");

  const { data: dept, isLoading: loadingDept } = useDepartment(id);
  const { data: members, isLoading: loadingMembers } = useDepartmentMembers(id, { role: roleFilter || undefined, limit: 50 });

  if (loadingDept) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[var(--brand)]" /></div>;
  if (!dept) return <div className="p-8 text-red-500">Department not found.</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/departments" className="p-2 rounded-full hover:bg-[var(--bg-muted)]">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--fg-base)]">{dept.name}</h1>
          <p className="text-sm text-[var(--fg-muted)]">Department Code: {dept.code}</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-sm">
          <p className="text-sm font-medium text-[var(--fg-muted)]">Total Members</p>
          <p className="text-3xl font-bold text-[var(--fg-base)]">{dept.memberCounts?.total || 0}</p>
        </div>
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-sm">
          <p className="text-sm font-medium text-[var(--fg-muted)]">Teachers</p>
          <p className="text-3xl font-bold text-[var(--fg-base)]">{dept.memberCounts?.teacherCount || 0}</p>
        </div>
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-sm">
          <p className="text-sm font-medium text-[var(--fg-muted)]">Students</p>
          <p className="text-3xl font-bold text-[var(--fg-base)]">{dept.memberCounts?.studentCount || 0}</p>
        </div>
      </div>

      {/* Members Table */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-[var(--fg-base)]">Department Members</h3>
          
          {/* Role Filter Tabs */}
          <div className="flex gap-2">
            {[
              { label: "All", value: "" },
              { label: "Teachers", value: "TEACHER" },
              { label: "Students", value: "STUDENT" },
            ].map((f) => (
              <Button
                key={f.value}
                variant={roleFilter === f.value ? "primary" : "secondary"}
                onClick={() => setRoleFilter(f.value as any)}
                className="rounded-full px-4 py-1.5 text-xs h-8"
              >
                {f.label}
              </Button>
            ))}
          </div>
        </div>

        {loadingMembers ? (
          <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[var(--brand)]" /></div>
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Name</TH>
                <TH>Identifier</TH>
                <TH>Email</TH>
                <TH>Status</TH>
              </TR>
            </THead>
            <TBody>
              {/* Render Teachers */}
              {(roleFilter === "" || roleFilter === "TEACHER") && members?.data.teachers?.map((t: any) => (
                <TR key={t.id}>
                  <TD className="font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-[var(--brand)]" /> {t.firstName} {t.lastName}
                  </TD>
                  <TD className="text-sm text-[var(--fg-muted)]">{t.employeeCode}</TD>
                  <TD className="text-sm text-[var(--fg-muted)]">{t.user?.email}</TD>
                  <TD>
                    <Badge variant={t.user?.isActive ? "success" : "danger"}>
                      {t.user?.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TD>
                </TR>
              ))}

              {/* Render Students */}
              {(roleFilter === "" || roleFilter === "STUDENT") && members?.data.students?.map((s: any) => (
                <TR key={s.id}>
                  <TD className="font-medium flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-[var(--secondary-500)]" /> {s.firstName} {s.lastName}
                  </TD>
                  <TD className="text-sm text-[var(--fg-muted)]">{s.admissionNo}</TD>
                  <TD className="text-sm text-[var(--fg-muted)]">{s.user?.email}</TD>
                  <TD>
                    <Badge variant="success">Enrolled</Badge>
                  </TD>
                </TR>
              ))}

              {/* Empty State */}
              {((roleFilter === "TEACHER" && members?.data.teachers?.length === 0) ||
                (roleFilter === "STUDENT" && members?.data.students?.length === 0) ||
                (roleFilter === "" && (members?.data.teachers?.length || 0) + (members?.data.students?.length || 0) === 0)) && (
                <TR>
                  <TD colSpan={4} className="py-12 text-center text-[var(--fg-muted)]">
                    No members found in this department.
                  </TD>
                </TR>
              )}
            </TBody>
          </Table>
        )}
      </div>
    </div>
  );
}