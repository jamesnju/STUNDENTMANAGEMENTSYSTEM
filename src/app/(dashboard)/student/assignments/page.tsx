"use client";

import Link from "next/link";
import { useAssignments } from "@/hooks/useContent";
import { Table, THead, TR, TH, TD, TBody } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Loader2, ClipboardList, Eye } from "lucide-react";

export default function StudentAssignmentsPage() {
  const { data, isLoading } = useAssignments({ limit: 50 });

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-[var(--brand)]" /></div>;

  const statusBadge = (asg: any) => {
    if (asg.status === "CLOSED") return <Badge>Closed</Badge>;
    if (asg.dueAt && new Date(asg.dueAt) < new Date()) return <Badge variant="danger">Overdue</Badge>;
    return <Badge variant="success">Open</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-[var(--brand)]" /> My Assignments
        </h1>
        <p className="text-sm text-[var(--fg-muted)]">View and submit your work.</p>
      </div>

      {data?.data?.length === 0 ? (
        <div className="text-center p-12 border border-dashed border-[var(--border-color)] rounded-xl text-[var(--fg-muted)]">
          No assignments have been assigned to your class yet.
        </div>
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Assignment</TH>
              <TH>Subject</TH>
              <TH>Due</TH>
              <TH>Status</TH>
              <TH className="text-right">Actions</TH>
            </TR>
          </THead>
          <TBody>
            {data?.data.map((asg: any) => (
              <TR key={asg.id}>
                <TD className="font-medium">{asg.title}</TD>
                <TD>{asg.subject?.name}</TD>
                <TD className="text-sm text-[var(--fg-muted)]">{asg.dueAt ? new Date(asg.dueAt).toLocaleString() : "—"}</TD>
                <TD>{statusBadge(asg)}</TD>
                <TD className="text-right">
                  <Link href={`/student/assignments/${asg.id}`}>
                    <Button variant="secondary" className="h-8 px-3 text-xs"><Eye className="mr-1 h-3 w-3" /> View</Button>
                  </Link>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}