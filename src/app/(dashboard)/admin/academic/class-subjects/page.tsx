"use client";

import { useState } from "react";
import { useClassSubjects, useCreateClassSubject, useDeleteClassSubject, useClasses, useSubjects, useTeachers } from "@/hooks/useAcademic";
import { Table, THead, TR, TH, TD, TBody } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Loader2, Plus, Trash2, Link2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ClassSubjectsPage() {
  const { data, isLoading } = useClassSubjects();
  const { data: classes } = useClasses({ limit: 100 });
  const { data: subjects } = useSubjects({ limit: 100 });
  const { data: teachers } = useTeachers();
  
  const { mutate: assign, isPending: isAssigning } = useCreateClassSubject();
  const { mutate: remove } = useDeleteClassSubject();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ classId: "", subjectId: "", teacherId: "" });

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
 assign(form, { 
      onSuccess: () => {
        toast.success("Teacher assigned to class successfully");
        setIsModalOpen(false);
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.error?.message || "Failed to assign teacher");
      }
    });  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Link2 className="h-6 w-6 text-[var(--brand)]" /> Teacher Assignments
          </h1>
          <p className="text-sm text-[var(--fg-muted)]">Assign teachers to teach specific subjects in specific classes.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}><Plus className="mr-2 h-4 w-4" /> Assign Teacher</Button>
      </div>

      {isLoading ? <Loader2 className="animate-spin text-[var(--brand)]" /> : (
        <Table>
          <THead><TR><TH>Class</TH><TH>Subject</TH><TH>Teacher</TH><TH>Actions</TH></TR></THead>
          <TBody>
            {data?.data.map((link: any) => (
              <TR key={link.id}>
                <TD className="font-medium">{link.class.name} ({link.class.code})</TD>
                <TD>{link.subject.name} ({link.subject.code})</TD>
                <TD>{link.teacher.firstName} {link.teacher.lastName}</TD>
                <TD><Button variant="ghost" onClick={() => remove(link.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button></TD>
              </TR>
            ))}
            {data?.data.length === 0 && <TR><TD colSpan={4} className="text-center py-8 text-[var(--fg-muted)]">No teacher assignments yet. This is required before adding timetable slots.</TD></TR>}
          </TBody>
        </Table>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={handleAssign} className="w-full max-w-md bg-[var(--bg-surface)] p-6 rounded-xl space-y-4">
            <h2 className="font-bold text-lg">Assign Teacher to Subject</h2>
            
            <div>
              <label className="text-xs font-medium mb-1 block">Class</label>
              <select className="w-full h-10 rounded-lg border px-3 bg-[var(--bg-base)]" required value={form.classId} onChange={e => setForm({...form, classId: e.target.value})}>
                <option value="">Select Class...</option>
                {classes?.data.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium mb-1 block">Subject</label>
              <select className="w-full h-10 rounded-lg border px-3 bg-[var(--bg-base)]" required value={form.subjectId} onChange={e => setForm({...form, subjectId: e.target.value})}>
                <option value="">Select Subject...</option>
                {subjects?.data.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium mb-1 block">Teacher</label>
              <select className="w-full h-10 rounded-lg border px-3 bg-[var(--bg-base)]" required value={form.teacherId} onChange={e => setForm({...form, teacherId: e.target.value})}>
                <option value="">Select Teacher...</option>
                {teachers?.map((t: any) => (
                  <option key={t.id} value={t.teacherProfile?.id}>
                    {t.teacherProfile?.firstName} {t.teacherProfile?.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" loading={isAssigning}>Assign</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}