"use client";

import { useState } from "react";
import { useSubjects, useCreateSubject, useDeleteSubject } from "@/hooks/useAcademic";
import { useDepartments } from "@/hooks/useDepartments";
import { Table, THead, TR, TH, TD, TBody } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, Plus, Trash2, BookOpen } from "lucide-react";
import toast from "react-hot-toast";

export default function SubjectsPage() {
  const { data, isLoading } = useSubjects();
  const { data: departments } = useDepartments({ limit: 50 });
  const { mutate: createSubject, isPending: isCreating } = useCreateSubject();
  const { mutate: deleteSubject } = useDeleteSubject();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", code: "", departmentId: "" });

 const handleCreate = (e: React.FormEvent) => {
  e.preventDefault();
  createSubject(form, {
    onSuccess: () => {
      toast.success("Subject created");
      setIsModalOpen(false);
    },
    onError: (err: any) => toast.error(err.response?.data?.error?.message || "Failed to create subject")
  });
};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><BookOpen className="h-6 w-6 text-[var(--brand)]" /> Subjects</h1>
          <p className="text-sm text-[var(--fg-muted)]">Manage subjects offered.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Subject</Button>
      </div>

      {isLoading ? <Loader2 className="animate-spin" /> : (
        <Table>
          <THead><TR><TH>Name</TH><TH>Code</TH><TH>Department</TH><TH>Classes</TH><TH>Actions</TH></TR></THead>
          <TBody>
            {data?.data.map((sub: any) => (
              <TR key={sub.id}>
                <TD className="font-medium">{sub.name}</TD>
                <TD><Badge>{sub.code}</Badge></TD>
                <TD className="text-sm text-[var(--fg-muted)]">{sub.department?.name}</TD>
                <TD>{sub._count?.classes || 0}</TD>
                <TD><Button variant="ghost" onClick={() => deleteSubject(sub.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button></TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={handleCreate} className="w-full max-w-md bg-[var(--bg-surface)] p-6 rounded-xl space-y-4">
            <h2 className="font-bold text-lg">Create Subject</h2>
            <Input placeholder="Subject Name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <Input placeholder="Code (e.g. MATH)" required value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} />
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