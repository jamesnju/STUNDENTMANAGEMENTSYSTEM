"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Loader2, ArrowLeft, Archive, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useArchiveUser, useRestoreUser, useUser } from "@/hooks/useUsers";

export default function UserDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { data: user, isLoading, isError } = useUser(id);
  
  const { mutate: archive, isPending: isArchiving } = useArchiveUser(id);
  const { mutate: restore, isPending: isRestoring } = useRestoreUser(id);

  if (isLoading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;
  if (isError || !user) return <div className="p-8 text-red-500">User not found.</div>;

  const profile = user.teacherProfile || user.studentProfile || user.parentProfile;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/users" className="rounded-full p-2 hover:bg-[var(--bg-muted)]">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">User Details</h1>
      </div>

      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">{user.email}</h2>
            <div className="mt-2 flex gap-2">
              <Badge>{user.role}</Badge>
              <Badge variant={user.isActive ? "success" : "danger"}>
                {user.isActive ? "Active" : "Archived"}
              </Badge>
            </div>
          </div>
          
          {user.deletedAt ? (
            <Button 
              variant="secondary" 
              onClick={() => restore()} 
              loading={isRestoring}
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Restore User
            </Button>
          ) : (
            <Button 
              variant="danger" 
              onClick={() => {
                if (confirm("Are you sure you want to archive this user?")) archive();
              }} 
              loading={isArchiving}
            >
              <Archive className="mr-2 h-4 w-4" /> Archive User
            </Button>
          )}
        </div>

        {profile && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm text-[var(--fg-muted)]">First Name</p>
              <p className="font-medium">{profile.firstName}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--fg-muted)]">Last Name</p>
              <p className="font-medium">{profile.lastName}</p>
            </div>
            {"employeeCode" in profile && (
              <div>
                <p className="text-sm text-[var(--fg-muted)]">Employee Code</p>
                <p className="font-medium">{profile.employeeCode}</p>
              </div>
            )}
            {"admissionNo" in profile && (
              <div>
                <p className="text-sm text-[var(--fg-muted)]">Admission No</p>
                <p className="font-medium">{profile.admissionNo}</p>
              </div>
            )}
            {"phone" in profile && (
              <div>
                <p className="text-sm text-[var(--fg-muted)]">Phone</p>
                <p className="font-medium">{profile.phone}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}