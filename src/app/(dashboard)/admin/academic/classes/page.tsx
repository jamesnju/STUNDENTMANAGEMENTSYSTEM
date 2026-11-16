"use client";

import { useState } from "react";
import Link from "next/link";
import { useClasses, useCreateClass, useDeleteClass, useTimetable } from "@/hooks/useAcademic";
import { useDepartments } from "@/hooks/useDepartments";
import { Table, THead, TR, TH, TD, TBody } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, Plus, Trash2, Users, Eye, ChevronDown, ChevronRight, CalendarClock } from "lucide-react";
import { confirmToast } from "@/components/ui/ConfirmToast";

export default function ClassesPage() {
  const { data, isLoading } = useClasses();
  const { data: departments } = useDepartments({ limit: 50 });
  const { mutate: createClass, isPending: isCreating } = useCreateClass();
  const { mutate: deleteClass } = useDeleteClass();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", code: "", academicYear: new Date().getFullYear().toString(), departmentId: "" });
  
  // Track which class rows are expanded to show the timetable
  const [expandedClassId, setExpandedClassId] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createClass(form, { onSuccess: () => setIsModalOpen(false) });
  };

  const handleDelete = (id: string, name: string) => {
    confirmToast("Delete Class", `Are you sure you want to delete ${name}?`, () => deleteClass(id));
  };

  const toggleExpand = (id: string) => {
    setExpandedClassId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-[var(--brand)]" /> Classes
          </h1>
          <p className="text-sm text-[var(--fg-muted)]">Manage school classes, teachers, and view timetables inline.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Class</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-[var(--brand)]" /></div>
      ) : (
        <Table>
          <THead>
            <TR>
              <TH className="w-10"></TH>
              <TH>Name</TH>
              <TH>Code</TH>
              <TH>Year</TH>
              <TH>Teacher</TH>
              <TH>Students</TH>
              <TH className="text-right">Actions</TH>
            </TR>
          </THead>
          <TBody>
            {data?.data.map((cls: any) => (
              <ClassRow 
                key={cls.id} 
                cls={cls} 
                isExpanded={expandedClassId === cls.id}
                onToggle={() => toggleExpand(cls.id)}
                onDelete={() => handleDelete(cls.id, cls.name)}
              />
            ))}
            {data?.data.length === 0 && (
              <TR>
                <TD colSpan={7} className="text-center py-12 text-[var(--fg-muted)]">No classes found.</TD>
              </TR>
            )}
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

// ==========================================
// Child Component: A single class row that can expand
// ==========================================
function ClassRow({ cls, isExpanded, onToggle, onDelete }: { cls: any, isExpanded: boolean, onToggle: () => void, onDelete: () => void }) {
  // Fetch timetable ONLY when expanded (saves bandwidth)
  const { data: timetable, isLoading: loadingTime } = useTimetable({ classId: cls.id }, { enabled: isExpanded });

  return (
    <>
      <TR className={isExpanded ? "bg-[var(--bg-muted)]/30" : ""}>
        <TD>
          <button onClick={onToggle} className="p-1 rounded hover:bg-[var(--bg-muted)] transition-colors">
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </TD>
        <TD className="font-medium cursor-pointer" onClick={onToggle}>{cls.name}</TD>
        <TD><Badge>{cls.code}</Badge></TD>
        <TD>{cls.academicYear}</TD>
        <TD className="text-sm text-[var(--fg-muted)]">
          {cls.classTeacher ? `${cls.classTeacher.firstName} ${cls.classTeacher.lastName}` : "Unassigned"}
        </TD>
        <TD>{cls._count?.enrollments || 0}</TD>
        <TD className="text-right">
          <div className="flex justify-end gap-2">
            <Link href={`/admin/academic/classes/${cls.id}`}>
              <Button variant="secondary" className="h-8 px-2" title="Manage Class">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" onClick={onDelete}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </TD>
      </TR>

      {/* Expanded Timetable Row */}
      {isExpanded && (
        <TR>
          <TD colSpan={7} className="bg-[var(--bg-base)] p-0">
            <div className="p-6 border-l-4 border-[var(--brand)]">
              <div className="flex items-center gap-2 mb-4">
                <CalendarClock className="h-5 w-5 text-[var(--brand)]" />
                <h3 className="font-semibold text-lg">Timetable — {cls.name}</h3>
                <Link href={`/admin/academic/classes/${cls.id}`} className="ml-auto text-sm text-[var(--brand)] hover:underline">
                  Edit Timetable →
                </Link>
              </div>

              {loadingTime ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-5 w-5 animate-spin text-[var(--brand)]" />
                </div>
              ) : !timetable?.data || timetable.data.length === 0 ? (
                <div className="text-center p-6 bg-[var(--bg-surface)] rounded-lg border border-dashed border-[var(--border-color)] text-[var(--fg-muted)]">
                  No timetable slots configured for this class yet. 
                  <Link href={`/admin/academic/classes/${cls.id}`} className="text-[var(--brand)] hover:underline ml-1">
                    Add slots →
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-3">
                  {[1, 2, 3, 4, 5].map((day) => {
                    const daySlots = timetable.data.filter((s: any) => s.dayOfWeek === day).sort((a: any, b: any) => a.period - b.period);
                    return (
                      <div key={day} className="space-y-2">
                        <div className="text-xs font-bold text-center text-[var(--fg-muted)] uppercase mb-2">
                          {["Mon", "Tue", "Wed", "Thu", "Fri"][day - 1]}
                        </div>
                        {daySlots.map((slot: any) => (
                          <div key={slot.id} className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg p-2 text-xs space-y-1 shadow-sm">
                            <div className="font-semibold text-[var(--fg-base)]">{slot.subject?.name}</div>
                            <div className="text-[var(--fg-muted)]">{slot.teacher?.firstName} {slot.teacher?.lastName}</div>
                            <div className="flex justify-between items-center mt-2 pt-1 border-t border-[var(--border-color)]">
                              <Badge className="text-[10px]">{slot.roomRel?.name || "—"}</Badge>
                              <span className="text-[10px] text-[var(--fg-muted)]">
                                {slot.startTime}–{slot.endTime}
                              </span>
                            </div>
                          </div>
                        ))}
                        {daySlots.length === 0 && (
                          <div className="text-center text-xs text-[var(--fg-muted)] italic opacity-50">—</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </TD>
        </TR>
      )}
    </>
  );
}

// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useClasses, useCreateClass, useDeleteClass } from "@/hooks/useAcademic";
// import { useDepartments } from "@/hooks/useDepartments";
// import { Table, THead, TR, TH, TD, TBody } from "@/components/ui/Table";
// import { Badge } from "@/components/ui/Badge";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input";
// import { Loader2, Plus, Trash2, Users, Eye } from "lucide-react";

// export default function ClassesPage() {
//   const { data, isLoading } = useClasses();
//   const { data: departments } = useDepartments({ limit: 50 });
//   const { mutate: createClass, isPending: isCreating } = useCreateClass();
//   const { mutate: deleteClass } = useDeleteClass();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [form, setForm] = useState({ name: "", code: "", academicYear: new Date().getFullYear().toString(), departmentId: "" });

//   const handleCreate = (e: React.FormEvent) => {
//     e.preventDefault();
//     createClass(form, { onSuccess: () => setIsModalOpen(false) });
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold flex items-center gap-2"><Users className="h-6 w-6 text-[var(--brand)]" /> Classes</h1>
//           <p className="text-sm text-[var(--fg-muted)]">Manage school classes and their teachers.</p>
//         </div>
//         <Button onClick={() => setIsModalOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Class</Button>
//       </div>

//       {isLoading ? <Loader2 className="animate-spin" /> : (
//         <Table>
//           <THead><TR><TH>Name</TH><TH>Code</TH><TH>Year</TH><TH>Teacher</TH><TH>Students</TH><TH>Actions</TH></TR></THead>
//           <TBody>
//             {data?.data.map((cls: any) => (
//               <TR key={cls.id}>
//                 <TD className="font-medium">{cls.name}</TD>
//                 <TD><Badge>{cls.code}</Badge></TD>
//                 <TD>{cls.academicYear}</TD>
//                 <TD className="text-sm text-[var(--fg-muted)]">{cls.classTeacher ? `${cls.classTeacher.firstName} ${cls.classTeacher.lastName}` : "Unassigned"}</TD>
//                 <TD>{cls._count?.enrollments || 0}</TD>
//                 <TD>
//                   <div className="flex gap-2">
//                     <Link href={`/admin/academic/classes/${cls.id}`}>
//                       <Button variant="secondary" className="h-8 px-2"><Eye className="h-4 w-4" /></Button>
//                     </Link>
//                     <Button variant="ghost" onClick={() => deleteClass(cls.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
//                   </div>
//                 </TD>
//               </TR>
//             ))}
//           </TBody>
//         </Table>
//       )}

//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//           <form onSubmit={handleCreate} className="w-full max-w-md bg-[var(--bg-surface)] p-6 rounded-xl space-y-4">
//             <h2 className="font-bold text-lg">Create Class</h2>
//             <Input placeholder="Class Name (e.g. Form 1A)" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
//             <Input placeholder="Code (e.g. F1A)" required value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} />
//             <Input placeholder="Academic Year" required value={form.academicYear} onChange={e => setForm({...form, academicYear: e.target.value})} />
//             <select className="w-full h-10 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] px-3" required value={form.departmentId} onChange={e => setForm({...form, departmentId: e.target.value})}>
//               <option value="">Select Department...</option>
//               {departments?.data.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
//             </select>
//             <div className="flex justify-end gap-2 pt-4">
//               <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
//               <Button type="submit" loading={isCreating}>Save</Button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// }