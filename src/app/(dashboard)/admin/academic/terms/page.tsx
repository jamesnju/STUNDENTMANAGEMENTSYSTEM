"use client";

import { useState } from "react";
import { useTerms, useCreateTerm, useDeleteTerm } from "@/hooks/useAcademic";
import { Table, THead, TR, TH, TD, TBody } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, Plus, Trash2, Calendar } from "lucide-react";
import toast from "react-hot-toast";

export default function TermsPage() {
  const { data, isLoading } = useTerms();
  const { mutate: createTerm, isPending: isCreating } = useCreateTerm();
  const { mutate: deleteTerm } = useDeleteTerm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", academicYear: "", startsAt: "", endsAt: "" });

const handleCreate = (e: React.FormEvent) => {
  e.preventDefault();
  createTerm({ ...form, isActive: true }, {
    onSuccess: () => {
      toast.success("Term created");
      setIsModalOpen(false);
    },
    onError: (err: any) => toast.error(err.response?.data?.error?.message || "Failed to create term")
  });
};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Calendar className="h-6 w-6 text-[var(--brand)]" /> Academic Terms</h1>
          <p className="text-sm text-[var(--fg-muted)]">Manage school terms.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Term</Button>
      </div>

      {isLoading ? <Loader2 className="animate-spin" /> : (
        <Table>
          <THead><TR><TH>Name</TH><TH>Year</TH><TH>Starts</TH><TH>Ends</TH><TH>Status</TH><TH>Actions</TH></TR></THead>
          <TBody>
            {data?.data.map((term: any) => (
              <TR key={term.id}>
                <TD className="font-medium">{term.name}</TD>
                <TD>{term.academicYear}</TD>
                <TD className="text-sm text-[var(--fg-muted)]">{new Date(term.startsAt).toLocaleDateString()}</TD>
                <TD className="text-sm text-[var(--fg-muted)]">{new Date(term.endsAt).toLocaleDateString()}</TD>
                <TD><Badge variant={term.isActive ? "success" : "danger"}>{term.isActive ? "Active" : "Inactive"}</Badge></TD>
                <TD>
                  <Button variant="ghost" onClick={() => deleteTerm(term.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={handleCreate} className="w-full max-w-md bg-[var(--bg-surface)] p-6 rounded-xl space-y-4">
            <h2 className="font-bold text-lg">Create Term</h2>
            <Input placeholder="Term Name (e.g. Term 1)" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <Input placeholder="Academic Year (e.g. 2026)" required value={form.academicYear} onChange={e => setForm({...form, academicYear: e.target.value})} />
            <Input type="date" required value={form.startsAt} onChange={e => setForm({...form, startsAt: e.target.value})} />
            <Input type="date" required value={form.endsAt} onChange={e => setForm({...form, endsAt: e.target.value})} />
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