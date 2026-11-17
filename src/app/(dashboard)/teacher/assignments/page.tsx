"use client";

import { useState } from "react";
import Link from "next/link";
import { useAssignments, useCreateAssignment, useDeleteAssignment, usePublishAssignment, useCloseAssignment } from "@/hooks/useContent";
import { useClasses, useSubjects, useTerms } from "@/hooks/useAcademic";
import { Table, THead, TR, TH, TD, TBody } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, Plus, Trash2, Send, Lock, ClipboardList, Eye, X } from "lucide-react";
import { confirmToast } from "@/components/ui/ConfirmToast";

export default function TeacherAssignmentsPage() {
  const { data, isLoading } = useAssignments({ limit: 50 });
  const { data: classes } = useClasses({ limit: 100 });
  const { data: subjects } = useSubjects({ limit: 100 });
  const { data: terms } = useTerms({ limit: 100 });
  
  const { mutate: createAssignment, isPending: isCreating } = useCreateAssignment();
  const { mutate: deleteAssignment } = useDeleteAssignment();
  const { mutate: publishAssignment } = usePublishAssignment();
  const { mutate: closeAssignment } = useCloseAssignment();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", instructions: "", classId: "", subjectId: "", termId: "", dueAt: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAssignment({
      ...form,
      dueAt: form.dueAt ? new Date(form.dueAt).toISOString() : undefined,
      isPublished: false,
    }, { onSuccess: () => { setIsModalOpen(false); setForm({ title: "", instructions: "", classId: "", subjectId: "", termId: "", dueAt: "" }); } });
  };

  const statusBadge = (status: string) => {
    if (status === "DRAFT") return <Badge variant="warning">Draft</Badge>;
    if (status === "PUBLISHED") return <Badge variant="success">Published</Badge>;
    return <Badge>Closed</Badge>;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-[var(--fg-base)]">
            <ClipboardList className="h-6 w-6 text-[var(--brand)]" /> Assignments
          </h1>
          <p className="text-sm text-[var(--fg-muted)]">Create, publish, and grade assignments.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}><Plus className="mr-2 h-4 w-4" /> New Assignment</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-[var(--brand)]" /></div>
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Title</TH>
              <TH>Class</TH>
              <TH>Due Date</TH>
              <TH>Status</TH>
              <TH className="text-right">Actions</TH>
            </TR>
          </THead>
          <TBody>
            {data?.data.map((asg: any) => (
              <TR key={asg.id}>
                <TD className="font-medium">{asg.title}</TD>
                <TD>{asg.class?.name}</TD>
                <TD className="text-sm text-[var(--fg-muted)]">{asg.dueAt ? new Date(asg.dueAt).toLocaleDateString() : "—"}</TD>
                <TD>{statusBadge(asg.status)}</TD>
                <TD className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/teacher/assignments/${asg.id}`}>
                      <Button variant="secondary" className="h-8 px-3 text-xs" title="View Submissions">
                        <Eye className="mr-1 h-3 w-3" /> Submissions
                      </Button>
                    </Link>
                    {asg.status === "DRAFT" && (
                      <Button variant="secondary" className="h-8 px-3 text-xs" onClick={() => publishAssignment(asg.id)}>
                        <Send className="mr-1 h-3 w-3" /> Publish
                      </Button>
                    )}
                    {asg.status === "PUBLISHED" && (
                      <Button variant="secondary" className="h-8 px-3 text-xs" onClick={() => confirmToast("Close", "Close this assignment? Students can no longer submit.", () => closeAssignment(asg.id))}>
                        <Lock className="mr-1 h-3 w-3" /> Close
                      </Button>
                    )}
                    <Button variant="ghost" onClick={() => confirmToast("Delete", "Delete this assignment?", () => deleteAssignment(asg.id))}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TD>
              </TR>
            ))}
            {data?.data.length === 0 && (
              <TR><TD colSpan={5} className="text-center py-12 text-[var(--fg-muted)]">No assignments yet.</TD></TR>
            )}
          </TBody>
        </Table>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={handleSubmit} className="w-full max-w-lg bg-[var(--bg-surface)] rounded-xl shadow-xl">
            <div className="flex justify-between items-center p-4 border-b border-[var(--border-color)]">
              <h2 className="font-bold text-lg">New Assignment</h2>
              <button type="button" onClick={() => setIsModalOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="text-xs font-medium mb-1 block">Title</label>
                <Input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">Instructions</label>
                <textarea className="w-full h-24 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] p-3 text-sm" value={form.instructions} onChange={e => setForm({...form, instructions: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1 block">Class</label>
                  <select required className="w-full h-10 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] px-3" value={form.classId} onChange={e => setForm({...form, classId: e.target.value})}>
                    <option value="">Select...</option>
                    {classes?.data.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block">Subject</label>
                  <select required className="w-full h-10 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] px-3" value={form.subjectId} onChange={e => setForm({...form, subjectId: e.target.value})}>
                    <option value="">Select...</option>
                    {subjects?.data.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1 block">Term</label>
                  <select required className="w-full h-10 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] px-3" value={form.termId} onChange={e => setForm({...form, termId: e.target.value})}>
                    <option value="">Select...</option>
                    {terms?.data.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block">Due Date</label>
                  <Input type="datetime-local" value={form.dueAt} onChange={e => setForm({...form, dueAt: e.target.value})} />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-[var(--border-color)]">
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" loading={isCreating}>Create Draft</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useAssignments, useCreateAssignment, useDeleteAssignment, usePublishAssignment, useCloseAssignment } from "@/hooks/useContent";
// import { useClasses, useSubjects, useTerms } from "@/hooks/useAcademic";
// import { Table, THead, TR, TH, TD, TBody } from "@/components/ui/Table";
// import { Badge } from "@/components/ui/Badge";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input";
// import { Loader2, Plus, Trash2, Send, Lock, ClipboardList, Eye } from "lucide-react";
// import { confirmToast } from "@/components/ui/ConfirmToast";

// export default function TeacherAssignmentsPage() {
//   const { data, isLoading } = useAssignments({ limit: 50 });
//   const { data: classes } = useClasses({ limit: 100 });
//   const { data: subjects } = useSubjects({ limit: 100 });
//   const { data: terms } = useTerms({ limit: 100 });
  
//   const { mutate: createAssignment, isPending: isCreating } = useCreateAssignment();
//   const { mutate: deleteAssignment } = useDeleteAssignment();
//   const { mutate: publishAssignment } = usePublishAssignment();
//   const { mutate: closeAssignment } = useCloseAssignment();

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [form, setForm] = useState({ title: "", instructions: "", classId: "", subjectId: "", termId: "", dueAt: "" });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     createAssignment({
//       ...form,
//       dueAt: form.dueAt ? new Date(form.dueAt).toISOString() : undefined,
//       isPublished: false,
//     }, { onSuccess: () => { setIsModalOpen(false); setForm({ title: "", instructions: "", classId: "", subjectId: "", termId: "", dueAt: "" }); } });
//   };

//   const statusBadge = (status: string) => {
//     if (status === "DRAFT") return <Badge variant="warning">Draft</Badge>;
//     if (status === "PUBLISHED") return <Badge variant="success">Published</Badge>;
//     return <Badge>Closed</Badge>;
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold flex items-center gap-2">
//             <ClipboardList className="h-6 w-6 text-[var(--brand)]" /> Assignments
//           </h1>
//           <p className="text-sm text-[var(--fg-muted)]">Create, publish, and grade assignments.</p>
//         </div>
//         <Button onClick={() => setIsModalOpen(true)}><Plus className="mr-2 h-4 w-4" /> New Assignment</Button>
//       </div>

//       {isLoading ? (
//         <div className="flex justify-center p-8"><Loader2 className="animate-spin text-[var(--brand)]" /></div>
//       ) : (
//         <Table>
//           <THead>
//             <TR>
//               <TH>Title</TH>
//               <TH>Class</TH>
//               <TH>Term</TH>
//               <TH>Due</TH>
//               <TH>Status</TH>
//               <TH className="text-right">Actions</TH>
//             </TR>
//           </THead>
//           <TBody>
//             {data?.data.map((asg: any) => (
//               <TR key={asg.id}>
//                 <TD className="font-medium">{asg.title}</TD>
//                 <TD>{asg.class?.name} ({asg.class?.code})</TD>
//                 <TD>{asg.term?.name}</TD>
//                 <TD className="text-sm text-[var(--fg-muted)]">{asg.dueAt ? new Date(asg.dueAt).toLocaleDateString() : "—"}</TD>
//                 <TD>{statusBadge(asg.status)}</TD>
//                 <TD className="text-right">
//                   <div className="flex justify-end gap-2">
//                     <Link href={`/teacher/assignments/${asg.id}`}>
//                       <Button variant="secondary" className="h-8 px-2" title="View Submissions">
//                         <Eye className="h-4 w-4" />
//                       </Button>
//                     </Link>
//                     {asg.status === "DRAFT" && (
//                       <Button variant="secondary" className="h-8 px-3 text-xs" onClick={() => publishAssignment(asg.id)}>
//                         <Send className="mr-1 h-3 w-3" /> Publish
//                       </Button>
//                     )}
//                     {asg.status === "PUBLISHED" && (
//                       <Button variant="secondary" className="h-8 px-3 text-xs" onClick={() => confirmToast("Close", "Close this assignment? Students can no longer submit.", () => closeAssignment(asg.id))}>
//                         <Lock className="mr-1 h-3 w-3" /> Close
//                       </Button>
//                     )}
//                     <Button variant="ghost" onClick={() => confirmToast("Delete", "Delete this assignment?", () => deleteAssignment(asg.id))}>
//                       <Trash2 className="h-4 w-4 text-red-500" />
//                     </Button>
//                   </div>
//                 </TD>
//               </TR>
//             ))}
//             {data?.data.length === 0 && (
//               <TR><TD colSpan={6} className="text-center py-12 text-[var(--fg-muted)]">No assignments yet.</TD></TR>
//             )}
//           </TBody>
//         </Table>
//       )}

//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//           <form onSubmit={handleSubmit} className="w-full max-w-lg bg-[var(--bg-surface)] rounded-xl shadow-xl">
//             <div className="flex justify-between items-center p-4 border-b border-[var(--border-color)]">
//               <h2 className="font-bold text-lg">New Assignment</h2>
//               <button type="button" onClick={() => setIsModalOpen(false)}><Trash2 className="h-5 w-5" /></button>
//             </div>
//             <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
//               <div>
//                 <label className="text-xs font-medium mb-1 block">Title</label>
//                 <Input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
//               </div>
//               <div>
//                 <label className="text-xs font-medium mb-1 block">Instructions</label>
//                 <textarea className="w-full h-24 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] p-3 text-sm" value={form.instructions} onChange={e => setForm({...form, instructions: e.target.value})} />
//               </div>
//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="text-xs font-medium mb-1 block">Class</label>
//                   <select required className="w-full h-10 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] px-3" value={form.classId} onChange={e => setForm({...form, classId: e.target.value})}>
//                     <option value="">Select...</option>
//                     {classes?.data.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="text-xs font-medium mb-1 block">Subject</label>
//                   <select required className="w-full h-10 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] px-3" value={form.subjectId} onChange={e => setForm({...form, subjectId: e.target.value})}>
//                     <option value="">Select...</option>
//                     {subjects?.data.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
//                   </select>
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="text-xs font-medium mb-1 block">Term</label>
//                   <select required className="w-full h-10 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] px-3" value={form.termId} onChange={e => setForm({...form, termId: e.target.value})}>
//                     <option value="">Select...</option>
//                     {terms?.data.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="text-xs font-medium mb-1 block">Due Date</label>
//                   <Input type="datetime-local" value={form.dueAt} onChange={e => setForm({...form, dueAt: e.target.value})} />
//                 </div>
//               </div>
//             </div>
//             <div className="flex justify-end gap-2 p-4 border-t border-[var(--border-color)]">
//               <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
//               <Button type="submit" loading={isCreating}>Create Draft</Button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// }