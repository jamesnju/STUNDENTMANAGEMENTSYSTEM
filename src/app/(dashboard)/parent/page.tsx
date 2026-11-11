"use client";

import { Users, BookOpen, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default function ParentDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--fg-base)]">Parent Portal</h1>
        <p className="text-[var(--fg-muted)] mt-1">Monitor your child's academic progress and school activities.</p>
      </div>

      {/* Placeholder for Child's Overview */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary-100)] dark:bg-[var(--primary-900)]">
          <Users className="h-8 w-8 text-[var(--primary-600)] dark:text-[var(--primary-300)]" />
        </div>
        <h2 className="text-xl font-bold text-[var(--fg-base)]">Your Children</h2>
        <p className="mt-2 text-sm text-[var(--fg-muted)] max-w-md mx-auto">
          The API endpoint to link parents to students (`/parents/me/children`) is currently under development. 
          Once deployed, your child's profile, grades, and attendance will appear here.
        </p>
        
        <div className="mt-8 grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto opacity-50 pointer-events-none">
          {/* Mock cards showing what it will look like */}
          <div className="rounded-lg border border-[var(--border-color)] p-6 text-left">
            <h3 className="font-bold flex items-center gap-2"><GraduationCap className="h-5 w-5" /> Child Name</h3>
            <p className="text-sm text-[var(--fg-muted)] mt-2">Form 3A • ADM-001</p>
            <div className="mt-4 flex gap-2">
               <Badge>Active</Badge>
               <Badge variant="success">GPA: 3.8</Badge>
            </div>
          </div>
          
          <div className="rounded-lg border border-[var(--border-color)] p-6 text-left">
            <h3 className="font-bold flex items-center gap-2"><BookOpen className="h-5 w-5" /> Attendance</h3>
            <p className="text-sm text-[var(--fg-muted)] mt-2">Current Term</p>
            <div className="mt-4 h-2 w-full bg-[var(--bg-muted)] rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-[95%]" />
            </div>
            <p className="text-xs text-[var(--fg-muted)] mt-1">95% Present</p>
          </div>
        </div>
      </div>
    </div>
  );
}