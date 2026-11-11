"use client";

import { useStudentProfile, useStudentClasses, useStudentTimetable } from "@/hooks/useStudent";
import { Loader2, BookOpen, Clock, GraduationCap, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default function StudentDashboardPage() {
  const { data: profile, isLoading: loadingProfile } = useStudentProfile();
  const { data: classes, isLoading: loadingClasses } = useStudentClasses();
  const { data: timetable, isLoading: loadingTimetable } = useStudentTimetable();

  if (loadingProfile || loadingClasses || loadingTimetable) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[var(--brand)]" /></div>;
  }

  // Get current day's schedule (1-5 for Mon-Fri)
  const currentDay = new Date().getDay() === 0 ? 7 : new Date().getDay(); 
  const todaysSchedule = timetable?.filter((t: any) => t.dayOfWeek === currentDay) || [];

  return (
    <div className="space-y-8">
      {/* Header Profile Section */}
      <div className="relative overflow-hidden rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] p-8 shadow-sm">
        <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-[var(--secondary-100)] opacity-50 blur-2xl dark:bg-[var(--secondary-900)]" />
        <div className="relative z-10 flex items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--secondary-500)] text-2xl font-bold text-white shadow-lg">
            {profile?.firstName?.[0]}{profile?.lastName?.[0]}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--fg-base)]">
              Hello, {profile?.firstName}!
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[var(--fg-muted)]">
              <span className="flex items-center gap-1">
                <Badge className="bg-[var(--accent-100)] text-[var(--accent-800)]">{profile?.admissionNo}</Badge>
              </span>
              <span className="flex items-center gap-1">
                <GraduationCap className="h-4 w-4" /> {profile?.department?.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Enrolled Classes */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2 text-[var(--fg-base)]">
            <BookOpen className="h-5 w-5 text-[var(--brand)]" /> My Classes
          </h3>
          <div className="space-y-3">
            {classes?.map((cls: any) => (
              <div key={cls.class.id} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 shadow-sm hover:border-[var(--brand)] transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-lg text-[var(--fg-base)]">{cls.class.name}</h4>
                    <p className="text-sm text-[var(--fg-muted)]">{cls.class.code}</p>
                  </div>
                  <Badge variant="success">Enrolled</Badge>
                </div>
                <div className="text-sm text-[var(--fg-muted)] space-y-1 mt-4 border-t border-[var(--border-color)] pt-4">
                  <p><strong className="text-[var(--fg-base)]">Class Teacher:</strong> {cls.class.classTeacher?.firstName} {cls.class.classTeacher?.lastName}</p>
                </div>
              </div>
            ))}
            {classes?.length === 0 && <p className="text-[var(--fg-muted)] italic">Not enrolled in any classes yet.</p>}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2 text-[var(--fg-base)]">
            <Clock className="h-5 w-5 text-[var(--brand)]" /> Today's Schedule
          </h3>
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-2 shadow-sm">
            {todaysSchedule.length === 0 ? (
               <div className="p-6 text-center text-[var(--fg-muted)] italic">No classes scheduled for today. Enjoy your day!</div>
            ) : (
              <div className="divide-y divide-[var(--border-color)]">
                {todaysSchedule.map((slot: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4 p-4 hover:bg-[var(--bg-muted)]/30 transition-colors">
                    <div className="flex flex-col items-center justify-center bg-[var(--bg-muted)] px-3 py-2 rounded-lg min-w-[70px]">
                      <span className="text-xs font-bold text-[var(--fg-base)]">{slot.startTime}</span>
                      <span className="text-[10px] text-[var(--fg-muted)]">{slot.endTime}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[var(--fg-base)]">{slot.subject.name}</h4>
                      <p className="text-xs text-[var(--fg-muted)]">{slot.teacher.firstName} {slot.teacher.lastName}</p>
                    </div>
                    <div className="text-sm text-[var(--fg-muted)] flex items-center gap-1 bg-[var(--bg-base)] px-2 py-1 rounded">
                      <MapPin className="h-3 w-3" /> {slot.room}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}