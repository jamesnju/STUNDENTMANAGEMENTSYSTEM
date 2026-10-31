"use client";

import { useDepartments } from "@/hooks/useDepartments";
import { Table, THead, TR, TH, TD } from "@/components/ui/Table";
import { Loader2 } from "lucide-react";

export default function DepartmentsPage() {
  const { data, isLoading } = useDepartments();

  if (isLoading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Departments</h1>
        <p className="text-sm text-[var(--fg-muted)]">Manage academic and administrative departments.</p>
      </div>

      <Table>
        <THead>
          <TR>
            <TH>Name</TH>
            <TH>Code</TH>
            <TH>Teachers</TH>
            <TH>Students</TH>
          </TR>
        </THead>
        <tbody>
          {data?.data.map((dept: any) => (
            <TR key={dept.id}>
              <TD className="font-medium">{dept.name}</TD>
              <TD>{dept.code}</TD>
              <TD>{dept._count?.teachers || 0}</TD>
              <TD>{dept._count?.students || 0}</TD>
            </TR>
          ))}
          {data?.data.length === 0 && (
            <TR><TD colSpan={4} className="text-center py-8">No departments found.</TD></TR>
          )}
        </tbody>
      </Table>
    </div>
  );
}