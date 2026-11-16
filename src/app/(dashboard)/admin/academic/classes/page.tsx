"use client";

import { useState } from "react";
import Link from "next/link";
import { useClasses, useCreateClass, useDeleteClass } from "@/hooks/useAcademic";
import { useDepartments } from "@/hooks/useDepartments";
import { Table, THead, TR, TH, TD, TBody } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, Plus, Trash2, Users, Eye } from "lucide-react";

export default function ClassesPage() {
  const { data, isLoading } = useClasses();
  const { data: departments } = useDepartments({ limit: 50 });
  const { mutate: createClass, isPending: isCreating } = useCreateClass();
  const { mutate: deleteClass } = useDeleteClass();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", code: "", academicYear: new Date().getFullYear().toString(), departmentId: "" });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createClass(form, { onSuccess: () => setIsModalOpen(false) });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Users className="h-6 w-6 text-[var(--brand)]" /> Classes</h1>
          <p className="text-sm text-[var(--fg-muted)]">Manage school classes and their teachers.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Class</Button>
      </div>

      {isLoading ? <Loader2 className="animate-spin" /> : (
        <Table>
          <THead><TR><TH>Name</TH><TH>Code</TH><TH>Year</TH><TH>Teacher</TH><TH>Students</TH><TH>Actions</TH></TR></THead>
          <TBody>
            {data?.data.map((cls: any) => (
              <TR key={cls.id}>
                <TD className="font-medium">{cls.name}</TD>
                <TD><Badge>{cls.code}</Badge></TD>
                <TD>{cls.academicYear}</TD>
                <TD className="text-sm text-[var(--fg-muted)]">{cls.classTeacher ? `${cls.classTeacher.firstName} ${cls.classTeacher.lastName}` : "Unassigned"}</TD>
                <TD>{cls._count?.enrollments || 0}</TD>
                <TD>
                  <div className="flex gap-2">
                    <Link href={`/admin/academic/classes/${cls.id}`}>
                      <Button variant="secondary" className="h-8 px-2"><Eye className="h-4 w-4" /></Button>
                    </Link>
                    <Button variant="ghost" onClick={() => deleteClass(cls.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </div>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={handleCreate} className="w-full max-w-md bg-[var(--bg-surface)] p-6 rounded-xl space-y-4">
            <h2 className="font-bold text-lg">Create Class</h2>
            <Input placeholder="Class Name (e.g. Form 1A)" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <Input placeholder="Code (e.g. F1A)" required value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} />
            <Input placeholder="Academic Year" required value={form.academicYear} onChange={e => setForm({...form, academicYear: e.target.value})} />
            <select className="w-full h-10 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] px-3" required value={form.departmentId} onChange={e => setForm({...form, departmentId: e.target.value})}>
              <option value="">Select Department...</option>
              {departments?.data.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" loading={isCreating}>Save</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}