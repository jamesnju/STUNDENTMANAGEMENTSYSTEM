"use client";

import { useState } from "react";
import { useArchivedUsers, useRestoreUser } from "@/hooks/useUsers";
import { Table, THead, TR, TH, TD, TBody } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Loader2, RotateCcw, ArchiveX } from "lucide-react";

export default function ArchivedUsersPage() {
  const { data, isLoading } = useArchivedUsers({ limit: 50 });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--fg-base)] flex items-center gap-2">
            <ArchiveX className="h-6 w-6 text-[var(--fg-muted)]" /> Archived Users
          </h1>
          <p className="text-sm text-[var(--fg-muted)]">
            Former teachers, students, and parents. Their data is preserved.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[var(--brand)]" /></div>
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>User</TH>
              <TH>Role</TH>
              <TH>Archived On</TH>
              <TH>Actions</TH>
            </TR>
          </THead>
          <TBody>
            {data?.data.length === 0 && (
              <TR><TD colSpan={4} className="py-12 text-center text-[var(--fg-muted)]">No archived users found.</TD></TR>
            )}
            {data?.data.map((user: any) => (
              <ArchivedRow key={user.id} user={user} />
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}

// Separate component to handle the restore mutation per row
function ArchivedRow({ user }: { user: any }) {
  const { mutate: restore, isPending } = useRestoreUser(user.id);

  return (
    <TR>
      <TD>
        <p className="font-medium text-[var(--fg-base)]">{user.email}</p>
        {/* Show name if profile exists */}
        {(user.teacherProfile || user.studentProfile || user.parentProfile) && (
          <p className="text-xs text-[var(--fg-muted)]">
            {user.teacherProfile?.firstName || user.studentProfile?.firstName || user.parentProfile?.firstName}{" "}
            {user.teacherProfile?.lastName || user.studentProfile?.lastName || user.parentProfile?.lastName}
          </p>
        )}
      </TD>
      <TD>
        <Badge>{user.role}</Badge>
      </TD>
      <TD className="text-[var(--fg-muted)]">
        {user.deletedAt ? new Date(user.deletedAt).toLocaleDateString() : "—"}
      </TD>
      <TD>
        <Button 
          variant="secondary" 
          onClick={() => {
            if(confirm("Restore this user to active status?")) restore();
          }}
          loading={isPending}
          className="h-8 px-3 text-xs"
        >
          <RotateCcw className="mr-2 h-3 w-3" /> Restore
        </Button>
      </TD>
    </TR>
  );
}