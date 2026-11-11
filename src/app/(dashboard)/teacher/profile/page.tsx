"use client";

import { useTeacherProfile } from "@/hooks/useTeacher";
import { Loader2, Mail, Building2, BadgeCheck, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default function TeacherProfilePage() {
  const { data: profile, isLoading } = useTeacherProfile();

  if (isLoading) return <div className="p-8"><Loader2 className="animate-spin text-[var(--brand)]" /></div>;
  if (!profile) return <div className="p-8 text-red-500">Profile not found.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--fg-base)]">My Profile</h1>
        <p className="text-sm text-[var(--fg-muted)]">Your personal and employment details.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-sm">
        {/* Header Banner */}
        <div className="h-32 bg-gradient-to-r from-[var(--primary-500)] to-[var(--accent-500)]" />
        
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[var(--bg-surface)] bg-[var(--bg-muted)] text-3xl font-bold text-[var(--brand)] shadow-md">
              {profile.firstName?.[0]}{profile.lastName?.[0]}
            </div>
            <Badge variant="success" className="mb-2 flex items-center gap-1">
              <BadgeCheck className="h-3.5 w-3.5" /> Active Staff
            </Badge>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-[var(--fg-base)]">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-sm font-medium text-[var(--fg-muted)] mt-1">
              {profile.employeeCode}
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 border-t border-[var(--border-color)] pt-8">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-[var(--bg-muted)] p-2">
                <Mail className="h-5 w-5 text-[var(--fg-muted)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--fg-muted)]">Email Address</p>
                <p className="font-medium text-[var(--fg-base)]">{profile.user?.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-[var(--bg-muted)] p-2">
                <Building2 className="h-5 w-5 text-[var(--fg-muted)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--fg-muted)]">Department</p>
                <p className="font-medium text-[var(--fg-base)]">{profile.department?.name} ({profile.department?.code})</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-[var(--bg-muted)] p-2">
                <CalendarDays className="h-5 w-5 text-[var(--fg-muted)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--fg-muted)]">Hire Date</p>
                <p className="font-medium text-[var(--fg-base)]">
                  {profile.hireDate ? new Date(profile.hireDate).toLocaleDateString() : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}