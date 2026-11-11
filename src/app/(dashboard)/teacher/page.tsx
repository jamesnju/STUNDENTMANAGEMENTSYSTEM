"use client";

import { useTeacherProfile, useTeacherClasses } from "@/hooks/useTeacher";
import { Loader2, BookOpen, Users, GraduationCap, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default function TeacherDashboardPage() {
  const { data: profile, isLoading: loadingProfile } = useTeacherProfile();
  const { data: classes, isLoading: loadingClasses } = useTeacherClasses();

  if (loadingProfile || loadingClasses) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--brand)]" />
      </div>
    );
  }

  const totalStudents = classes?.reduce((sum: number, cls: any) => sum + (cls._count?.enrollments || 0), 0) || 0;

  return (
    <div className="space-y-8">
      {/* Header Profile Section */}
      <div className="relative overflow-hidden rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] p-8 shadow-sm">
        <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-[var(--primary-100)] opacity-50 blur-2xl dark:bg-[var(--primary-900)]" />
        <div className="relative z-10 flex items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--brand)] text-2xl font-bold text-white shadow-lg">
            {profile?.firstName?.[0]}{profile?.lastName?.[0]}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--fg-base)]">
              Welcome back, {profile?.firstName}!
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[var(--fg-muted)]">
              <span className="flex items-center gap-1">
                <Badge className="bg-[var(--secondary-100)] text-[var(--secondary-800)]">
                  {profile?.employeeCode}
                </Badge>
              </span>
              <span className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                {profile?.department?.name} Department
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-[var(--accent-100)] p-3 text-[var(--accent-600)] dark:bg-[var(--accent-900)] dark:text-[var(--accent-300)]">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--fg-muted)]">My Classes</p>
              <h2 className="text-2xl font-bold text-[var(--fg-base)]">{classes?.length || 0}</h2>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-[var(--primary-100)] p-3 text-[var(--primary-600)] dark:bg-[var(--primary-900)] dark:text-[var(--primary-300)]">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--fg-muted)]">Total Students</p>
              <h2 className="text-2xl font-bold text-[var(--fg-base)]">{totalStudents}</h2>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-[var(--secondary-100)] p-3 text-[var(--secondary-600)] dark:bg-[var(--secondary-900)] dark:text-[var(--secondary-300)]">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--fg-muted)]">Department</p>
              <h2 className="text-lg font-bold text-[var(--fg-base)]">{profile?.department?.code || "—"}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Classes List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-[var(--fg-base)]">My Assigned Classes</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes?.length === 0 ? (
            <div className="col-span-full rounded-xl border border-dashed border-[var(--border-color)] p-8 text-center text-[var(--fg-muted)]">
              No classes assigned yet.
            </div>
          ) : (
            classes?.map((cls: any) => (
              <div key={cls.id} className="group rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-sm transition-all hover:shadow-md hover:border-[var(--brand)]">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-[var(--fg-base)] group-hover:text-[var(--brand)] transition-colors">{cls.name}</h4>
                    <p className="text-sm text-[var(--fg-muted)]">{cls.code} • {cls.academicYear}</p>
                  </div>
                  <Badge className="bg-[var(--bg-muted)] text-[var(--fg-base)]">
                    {cls._count?.enrollments} Students
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}