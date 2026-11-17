"use client";

import { useState } from "react";
import { useNotes, useCreateNote, useDeleteNote, usePublishNote } from "@/hooks/useContent";
import { useClasses, useSubjects } from "@/hooks/useAcademic";
import { useUploadFile } from "@/hooks/useFiles";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, Plus, Trash2, Send, FileText, X, Paperclip, BookOpen } from "lucide-react";
import { confirmToast } from "@/components/ui/ConfirmToast";
import { UploadedFile } from "@/types/files";

export default function TeacherNotesPage() {
  const { data, isLoading } = useNotes({ limit: 50 });
  const { data: classes } = useClasses({ limit: 100 });
  const { data: subjects } = useSubjects({ limit: 100 });
  
  const { mutate: createNote, isPending: isCreating } = useCreateNote();
  const { mutate: deleteNote } = useDeleteNote();
  const { mutate: publishNote } = usePublishNote();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", classId: "", subjectId: "" });
  const [attachedFiles, setAttachedFiles] = useState<any[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createNote({
      ...form,
      fileIds: attachedFiles.map(f => f.id),
      isPublished: false,
    }, { onSuccess: () => { setIsModalOpen(false); setForm({ title: "", description: "", classId: "", subjectId: "" }); setAttachedFiles([]); } });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-[var(--fg-base)]">
            <FileText className="h-6 w-6 text-[var(--brand)]" /> Class Notes
          </h1>
          <p className="text-sm text-[var(--fg-muted)]">Create and share study materials.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}><Plus className="mr-2 h-4 w-4" /> New Note</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-[var(--brand)]" /></div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.data.map((note: any) => (
            <div key={note.id} className="p-5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-sm flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <Badge variant={note.isPublished ? "success" : "warning"}>{note.isPublished ? "Published" : "Draft"}</Badge>
                  <span className="text-xs text-[var(--fg-muted)]">{note.files?.length || 0} files</span>
                </div>
                <h3 className="font-bold text-[var(--fg-base)] mb-1">{note.title}</h3>
                <p className="text-xs text-[var(--fg-muted)] mb-3">{note.class?.name} • {note.subject?.name}</p>
                <p className="text-sm text-[var(--fg-muted)] line-clamp-2">{note.description || "No description."}</p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-[var(--border-color)] flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {!note.isPublished && (
                  <Button variant="secondary" className="h-8 px-3 text-xs" onClick={() => confirmToast("Publish Note", "Publish this note to students?", () => publishNote(note.id))}>
                    <Send className="mr-1 h-3 w-3" /> Publish
                  </Button>
                )}
                <Button variant="ghost" onClick={() => confirmToast("Delete", "Delete this note?", () => deleteNote(note.id))}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
          {data?.data.length === 0 && (
            <div className="col-span-full text-center p-12 border border-dashed border-[var(--border-color)] rounded-xl text-[var(--fg-muted)]">
              No notes yet. Click "New Note" to create one.
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <NoteFormModal
          classes={classes?.data || []}
          subjects={subjects?.data || []}
          form={form} setForm={setForm}
          attachedFiles={attachedFiles} setAttachedFiles={setAttachedFiles}
          onSubmit={handleSubmit} onClose={() => setIsModalOpen(false)} isPending={isCreating}
        />
      )}
    </div>
  );
}

function NoteFormModal({ classes, subjects, form, setForm, attachedFiles, setAttachedFiles, onSubmit, onClose, isPending }: any) {
  const { mutate: uploadFile, isPending: isUploading } = useUploadFile();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadFile({ file, category: "NOTE" }, { onSuccess: (res: any) => setAttachedFiles([...attachedFiles, res]) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-lg bg-[var(--bg-surface)] rounded-xl shadow-xl">
        <div className="flex justify-between items-center p-4 border-b border-[var(--border-color)]">
          <h2 className="font-bold text-lg">New Note</h2>
          <button type="button" onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs font-medium mb-1 block">Title</label>
            <Input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Description</label>
            <textarea className="w-full h-24 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] p-3 text-sm" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block">Class</label>
              <select required className="w-full h-10 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] px-3" value={form.classId} onChange={e => setForm({...form, classId: e.target.value})}>
                <option value="">Select...</option>
                {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Subject</label>
              <select required className="w-full h-10 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] px-3" value={form.subjectId} onChange={e => setForm({...form, subjectId: e.target.value})}>
                <option value="">Select...</option>
                {subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Attachments</label>
            <label className="cursor-pointer block">
              <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
              <div className="border border-dashed border-[var(--border-color)] rounded-lg p-4 text-center hover:bg-[var(--bg-muted)]/30">
                {isUploading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : <Paperclip className="h-5 w-5 mx-auto text-[var(--fg-muted)]" />}
                <p className="text-xs text-[var(--fg-muted)] mt-1">Click to upload</p>
              </div>
            </label>
            {attachedFiles.length > 0 && (
              <div className="mt-2 space-y-1">
                {attachedFiles.map((f: UploadedFile, i: number) => (
                  <div key={i} className="flex items-center justify-between text-xs bg-[var(--bg-muted)] rounded px-2 py-1">
                    <span>{f.originalName}</span>
                    <button type="button" onClick={() => setAttachedFiles(attachedFiles.filter((_: any, idx: number) => idx !== i))}><X className="h-3 w-3" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t border-[var(--border-color)]">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isPending}>Save Draft</Button>
        </div>
      </form>
    </div>
  );
}

// // src/app/(dashboard)/teacher/notes/page.tsx
// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useNotes, useCreateNote, useDeleteNote, usePublishNote } from "@/hooks/useContent";
// import { useClasses, useSubjects } from "@/hooks/useAcademic";
// import { useFiles, useUploadFile } from "@/hooks/useFiles";
// import { Table, THead, TR, TH, TD, TBody } from "@/components/ui/Table";
// import { Badge } from "@/components/ui/Badge";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input";
// import { Loader2, Plus, Trash2, Send, FileText, X, Paperclip } from "lucide-react";
// import { confirmToast } from "@/components/ui/ConfirmToast";
// import toast from "react-hot-toast";
// import { UploadedFile } from "@/types/files";

// interface NoteFormState {
//   title: string;
//   description: string;
//   classId: string;
//   subjectId: string;
// }

// interface ClassOption {
//   id: string;
//   name: string;
// }

// interface SubjectOption {
//   id: string;
//   name: string;
// }

// export default function TeacherNotesPage() {
//   const { data, isLoading } = useNotes({ limit: 50 });
//   const { data: classes } = useClasses({ limit: 100 });
//   const { data: subjects } = useSubjects({ limit: 100 });
//   const { mutate: createNote, isPending: isCreating } = useCreateNote();
//   const { mutate: deleteNote } = useDeleteNote();
//   const { mutate: publishNote } = usePublishNote();

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [form, setForm] = useState<NoteFormState>({
//     title: "",
//     description: "",
//     classId: "",
//     subjectId: "",
//   });
//   const [attachedFiles, setAttachedFiles] = useState<UploadedFile[]>([]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     createNote(
//       {
//         ...form,
//         fileIds: attachedFiles.map((f) => f.id),
//         isPublished: false,
//       },
//       {
//         onSuccess: () => {
//           setIsModalOpen(false);
//           setForm({ title: "", description: "", classId: "", subjectId: "" });
//           setAttachedFiles([]);
//         },
//       }
//     );
//   };

//   const handlePublish = (id: string) => {
//     confirmToast("Publish Note", "Publish this note so students can see it?", () =>
//       publishNote(id)
//     );
//   };

//   const handleDelete = (id: string) => {
//     confirmToast("Delete Note", "Delete this note?", () => deleteNote(id));
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold flex items-center gap-2">
//             <FileText className="h-6 w-6 text-[var(--brand)]" /> My Notes
//           </h1>
//           <p className="text-sm text-[var(--fg-muted)]">Study materials for your classes.</p>
//         </div>
//         <Button onClick={() => setIsModalOpen(true)}>
//           <Plus className="mr-2 h-4 w-4" /> New Note
//         </Button>
//       </div>

//       {isLoading ? (
//         <div className="flex justify-center p-8">
//           <Loader2 className="animate-spin text-[var(--brand)]" />
//         </div>
//       ) : (
//         <Table>
//           <THead>
//             <TR>
//               <TH>Title</TH>
//               <TH>Class</TH>
//               <TH>Subject</TH>
//               <TH>Files</TH>
//               <TH>Status</TH>
//               <TH className="text-right">Actions</TH>
//             </TR>
//           </THead>
//           <TBody>
//             {data?.data.map((note: any) => (
//               <TR key={note.id}>
//                 <TD className="font-medium">{note.title}</TD>
//                 <TD>{note.class?.name || "—"}</TD>
//                 <TD>{note.subject?.name || "—"}</TD>
//                 <TD>{note.files?.length || 0}</TD>
//                 <TD>
//                   <Badge variant={note.isPublished ? "success" : "warning"}>
//                     {note.isPublished ? "Published" : "Draft"}
//                   </Badge>
//                 </TD>
//                 <TD className="text-right">
//                   <div className="flex justify-end gap-2">
//                     {!note.isPublished && (
//                       <Button
//                         variant="secondary"
//                         className="h-8 px-3 text-xs"
//                         onClick={() => handlePublish(note.id)}
//                       >
//                         <Send className="mr-1 h-3 w-3" /> Publish
//                       </Button>
//                     )}
//                     <Button variant="ghost" onClick={() => handleDelete(note.id)}>
//                       <Trash2 className="h-4 w-4 text-red-500" />
//                     </Button>
//                   </div>
//                 </TD>
//               </TR>
//             ))}
//             {data?.data.length === 0 && (
//               <TR>
//                 <TD colSpan={6} className="text-center py-12 text-[var(--fg-muted)]">
//                   No notes yet.
//                 </TD>
//               </TR>
//             )}
//           </TBody>
//         </Table>
//       )}

//       {isModalOpen && (
//         <NoteFormModal
//           classes={classes?.data ?? []}
//           subjects={subjects?.data ?? []}
//           form={form}
//           setForm={setForm}
//           attachedFiles={attachedFiles}
//           setAttachedFiles={setAttachedFiles}
//           onSubmit={handleSubmit}
//           onClose={() => setIsModalOpen(false)}
//           isPending={isCreating}
//         />
//       )}
//     </div>
//   );
// }

// interface NoteFormModalProps {
//   classes: ClassOption[];
//   subjects: SubjectOption[];
//   form: NoteFormState;
//   setForm: React.Dispatch<React.SetStateAction<NoteFormState>>;
//   attachedFiles: UploadedFile[];
//   setAttachedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
//   onSubmit: (e: React.FormEvent) => void;
//   onClose: () => void;
//   isPending: boolean;
// }

// function NoteFormModal({
//   classes,
//   subjects,
//   form,
//   setForm,
//   attachedFiles,
//   setAttachedFiles,
//   onSubmit,
//   onClose,
//   isPending,
// }: NoteFormModalProps) {
//   const { mutate: uploadFile, isPending: isUploading } = useUploadFile();

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     uploadFile(
//       { file, category: "NOTE" },
//       {
//         onSuccess: (res: UploadedFile) =>
//           setAttachedFiles((prev) => [...prev, res]),
//       }
//     );
//     // reset input so the same file can be re-uploaded if removed
//     e.target.value = "";
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//       <form
//         onSubmit={onSubmit}
//         className="w-full max-w-lg bg-[var(--bg-surface)] rounded-xl shadow-xl"
//       >
//         <div className="flex justify-between items-center p-4 border-b border-[var(--border-color)]">
//           <h2 className="font-bold text-lg">New Note</h2>
//           <button type="button" onClick={onClose}>
//             <X className="h-5 w-5" />
//           </button>
//         </div>
//         <div className="p-4 space-y-4">
//           <div>
//             <label className="text-xs font-medium mb-1 block">Title</label>
//             <Input
//               required
//               value={form.title}
//               onChange={(e) => setForm({ ...form, title: e.target.value })}
//             />
//           </div>
//           <div>
//             <label className="text-xs font-medium mb-1 block">Description</label>
//             <textarea
//               className="w-full h-24 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] p-3 text-sm"
//               value={form.description}
//               onChange={(e) => setForm({ ...form, description: e.target.value })}
//             />
//           </div>
//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="text-xs font-medium mb-1 block">Class</label>
//               <select
//                 className="w-full h-10 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] px-3"
//                 value={form.classId}
//                 onChange={(e) => setForm({ ...form, classId: e.target.value })}
//               >
//                 <option value="">Select Class...</option>
//                 {classes.map((c) => (
//                   <option key={c.id} value={c.id}>
//                     {c.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="text-xs font-medium mb-1 block">Subject</label>
//               <select
//                 className="w-full h-10 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] px-3"
//                 value={form.subjectId}
//                 onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
//               >
//                 <option value="">Select Subject...</option>
//                 {subjects.map((s) => (
//                   <option key={s.id} value={s.id}>
//                     {s.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           <div>
//             <label className="text-xs font-medium mb-1 block">Attachments</label>
//             <label className="cursor-pointer block">
//               <input
//                 type="file"
//                 className="hidden"
//                 onChange={handleFileUpload}
//                 disabled={isUploading}
//               />
//               <div className="border border-dashed border-[var(--border-color)] rounded-lg p-4 text-center hover:bg-[var(--bg-muted)]/30">
//                 {isUploading ? (
//                   <Loader2 className="h-5 w-5 animate-spin mx-auto" />
//                 ) : (
//                   <Paperclip className="h-5 w-5 mx-auto text-[var(--fg-muted)]" />
//                 )}
//                 <p className="text-xs text-[var(--fg-muted)] mt-1">Click to upload</p>
//               </div>
//             </label>
//             {attachedFiles.length > 0 && (
//               <div className="mt-2 space-y-1">
//                 {attachedFiles.map((f) => (
//                   <div
//                     key={f.id}
//                     className="flex items-center justify-between text-xs bg-[var(--bg-muted)] rounded px-2 py-1"
//                   >
//                     <span>{f.originalName}</span>
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setAttachedFiles((prev) => prev.filter((x) => x.id !== f.id))
//                       }
//                     >
//                       <X className="h-3 w-3" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//         <div className="flex justify-end gap-2 p-4 border-t border-[var(--border-color)]">
//           <Button type="button" variant="secondary" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button type="submit" loading={isPending}>
//             Save Draft
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }