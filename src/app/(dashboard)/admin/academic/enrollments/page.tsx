"use client";

import { useState, useMemo } from "react";
import { 
  useEnrollments, 
  useClasses, 
  useSingleEnroll, 
  useBulkEnroll, 
  useWithdrawEnrollment,
  useTerms // <-- Added
} from "@/hooks/useAcademic";
import { useStudents } from "@/hooks/useUsers";
import { Table, THead, TR, TH, TD, TBody } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { 
  Loader2, 
  UserPlus, 
  Search, 
  Trash2, 
  UploadCloud,
  X,
  Check
} from "lucide-react";
import { confirmToast } from "@/components/ui/ConfirmToast";
import toast from "react-hot-toast";

export default function EnrollmentsPage() {
  const [classFilter, setClassFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  // Queries
  const { data: classes } = useClasses({ limit: 100 });
  const { data: termsData } = useTerms({ limit: 100 }); // <-- Fetch real terms
  const { data: students, isLoading: isLoadingStudents } = useStudents();
  
  const { data, isLoading } = useEnrollments({ 
    classId: classFilter || undefined, 
    isActive: statusFilter || undefined,
    limit: 100 
  });

  // Get active terms for the dropdown
  const activeTerms = useMemo(() => {
    if (!termsData?.data) return [];
    return termsData.data.filter((t: any) => t.isActive);
  }, [termsData]);

  // Mutations
  const { mutate: singleEnroll, isPending: isEnrollingSingle } = useSingleEnroll();
  const { mutate: bulkEnroll, isPending: isEnrollingBulk } = useBulkEnroll();
  const { mutate: withdraw } = useWithdrawEnrollment();

  // Modal States
  const [modalType, setModalType] = useState<"single" | "bulk" | null>(null);
  
  // Single Enroll Form State
  const [singleForm, setSingleForm] = useState({ classId: "", studentId: "", term: "" });
  const [singleSearch, setSingleSearch] = useState("");

  // Bulk Enroll Form State
  const [bulkForm, setBulkForm] = useState({ classId: "", term: "" });
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Filter enrollments by search
  const filteredData = useMemo(() => {
    if (!data?.data) return [];
    if (!search) return data.data;
    const s = search.toLowerCase();
    return data.data.filter((enr: any) => 
      enr.student.firstName.toLowerCase().includes(s) || 
      enr.student.lastName.toLowerCase().includes(s) ||
      enr.student.admissionNo.toLowerCase().includes(s)
    );
  }, [data, search]);

  // Filter students for single enroll dropdown
  const filteredStudents = useMemo(() => {
    if (!students) return [];
    if (!singleSearch) return students;
    const s = singleSearch.toLowerCase();
    return students.filter((u: any) => {
      const p = u.studentProfile;
      return (
        p.firstName?.toLowerCase().includes(s) ||
        p.lastName?.toLowerCase().includes(s) ||
        p.admissionNo?.toLowerCase().includes(s) ||
        u.email?.toLowerCase().includes(s)
      );
    });
  }, [students, singleSearch]);

  const handleSingleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleForm.studentId || !singleForm.term || !singleForm.classId) {
      toast.error("Please fill in all fields");
      return;
    }

    console.log("📤 Single enroll payload:", singleForm);

    singleEnroll(singleForm, { 
      onSuccess: () => {
        setModalType(null);
        setSingleForm({ classId: "", studentId: "", term: "" });
        setSingleSearch("");
      },
      onError: (err: any) => {
        console.error("❌ Single enroll error:", err.response?.data);
      }
    });
  };

  const handleBulkEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudentIds.length === 0) {
      toast.error("Please select at least one student");
      return;
    }
    if (!bulkForm.classId || !bulkForm.term) {
      toast.error("Please select a class and term");
      return;
    }

    const payload = { 
      classId: bulkForm.classId, 
      term: bulkForm.term, 
      studentIds: selectedStudentIds 
    };

    console.log("📤 Bulk enroll payload:", payload);

    bulkEnroll(payload, { 
      onSuccess: () => {
        setModalType(null);
        setBulkForm({ classId: "", term: "" });
        setSelectedStudentIds([]);
      },
      onError: (err: any) => {
        console.error("❌ Bulk enroll error:", err.response?.data);
      }
    });
  };

  const toggleStudentSelection = (id: string) => {
    setSelectedStudentIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleWithdraw = (id: string, studentName: string) => {
    confirmToast(
      "Withdraw Student", 
      `Are you sure you want to withdraw ${studentName} from this class?`,
      () => withdraw(id)
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-[var(--fg-base)]">
            <UserPlus className="h-6 w-6 text-[var(--brand)]" /> Enrollments
          </h1>
          <p className="text-sm text-[var(--fg-muted)]">Manage student class enrollments.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setModalType("bulk")}>
            <UploadCloud className="mr-2 h-4 w-4" /> Bulk Enroll
          </Button>
          <Button onClick={() => setModalType("single")}>
            <UserPlus className="mr-2 h-4 w-4" /> Enroll Student
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid gap-3 sm:grid-cols-3 max-w-3xl">
        <select 
          className="h-10 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 text-sm"
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
        >
          <option value="">All Classes</option>
          {classes?.data.map((cls: any) => (
            <option key={cls.id} value={cls.id}>{cls.name} ({cls.academicYear})</option>
          ))}
        </select>

        <select 
          className="h-10 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="true">Active Only</option>
          <option value="false">Withdrawn Only</option>
        </select>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fg-muted)]" />
          <Input 
            placeholder="Search student..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      {isLoading ? <div className="flex justify-center p-8"><Loader2 className="animate-spin text-[var(--brand)]" /></div> : (
        <Table>
          <THead>
            <TR>
              <TH>Student</TH>
              <TH>Admission No</TH>
              <TH>Class</TH>
              <TH>Term</TH>
              <TH>Status</TH>
              <TH>Enrolled At</TH>
              <TH className="text-right">Actions</TH>
            </TR>
          </THead>
          <TBody>
            {filteredData.map((enr: any) => (
              <TR key={enr.id}>
                <TD className="font-medium">{enr.student.firstName} {enr.student.lastName}</TD>
                <TD><Badge>{enr.student.admissionNo || "—"}</Badge></TD>
                <TD>{enr.class.name} ({enr.class.code})</TD>
                <TD>{enr.term}</TD>
                <TD><Badge variant={enr.isActive ? "success" : "danger"}>{enr.isActive ? "Active" : "Withdrawn"}</Badge></TD>
                <TD className="text-sm text-[var(--fg-muted)]">{new Date(enr.enrolledAt).toLocaleDateString()}</TD>
                <TD className="text-right">
                  {enr.isActive && (
                    <Button 
                      variant="secondary" 
                      className="h-8 px-3 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleWithdraw(enr.id, `${enr.student.firstName} ${enr.student.lastName}`)}
                    >
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Withdraw
                    </Button>
                  )}
                </TD>
              </TR>
            ))}
            {filteredData.length === 0 && (
              <TR><TD colSpan={7} className="text-center py-12 text-[var(--fg-muted)]">No enrollments found.</TD></TR>
            )}
          </TBody>
        </Table>
      )}

      {/* SINGLE ENROLL MODAL */}
      {modalType === "single" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={handleSingleEnroll} className="w-full max-w-md bg-[var(--bg-surface)] rounded-xl shadow-xl">
            <div className="flex justify-between items-center p-4 border-b border-[var(--border-color)]">
              <h2 className="font-bold text-lg">Enroll Single Student</h2>
              <button type="button" onClick={() => setModalType(null)}><X className="h-5 w-5" /></button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-xs font-medium mb-1 block">Class</label>
                <select 
                  className="w-full h-10 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] px-3"
                  required
                  value={singleForm.classId}
                  onChange={e => setSingleForm({...singleForm, classId: e.target.value})}
                >
                  <option value="">Select Class...</option>
                  {classes?.data.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block">Term</label>
                <select 
                  className="w-full h-10 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] px-3"
                  required
                  value={singleForm.term}
                  onChange={e => setSingleForm({...singleForm, term: e.target.value})}
                >
                  <option value="">Select Term...</option>
                  {activeTerms.map((t: any) => (
                    <option key={t.id} value={t.name}>{t.name} ({t.academicYear})</option>
                  ))}
                </select>
                {activeTerms.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">No active terms found. Create one first.</p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block">
                  Student ({students?.length || 0} available)
                </label>
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fg-muted)] z-10" />
                  <Input 
                    placeholder="Search by name, email, or admission no..." 
                    className="pl-9"
                    value={singleSearch}
                    onChange={(e) => setSingleSearch(e.target.value)}
                  />
                </div>
                
                {isLoadingStudents ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-5 w-5 animate-spin text-[var(--brand)]" />
                  </div>
                ) : (
                  <div className="max-h-64 overflow-y-auto border border-[var(--border-color)] rounded-lg bg-[var(--bg-base)]">
                    {filteredStudents.length === 0 ? (
                      <div className="p-4 text-center text-sm text-[var(--fg-muted)]">
                        {students?.length === 0 
                          ? "No students found. Create students first." 
                          : "No students match your search."}
                      </div>
                    ) : (
                      filteredStudents.map((u: any) => {
                        const p = u.studentProfile;
                        const isSelected = singleForm.studentId === p.id;
                        return (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => setSingleForm({...singleForm, studentId: p.id})}
                            className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm hover:bg-[var(--bg-muted)] border-b border-[var(--border-color)] last:border-0 ${isSelected ? 'bg-[var(--primary-50)] dark:bg-[var(--primary-900)]/30' : ''}`}
                          >
                            <div>
                              <p className="font-medium text-[var(--fg-base)]">{p.firstName} {p.lastName}</p>
                              <p className="text-xs text-[var(--fg-muted)]">
                                {p.admissionNo || "—"} • {u.email}
                              </p>
                            </div>
                            {isSelected && <Check className="h-4 w-4 text-[var(--brand)]" />}
                          </button>
                        );
                      })
                    )}
                  </div>
                )}

                {singleForm.studentId && (
                  <p className="text-xs text-[var(--brand)] mt-1">✓ Student selected</p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-[var(--border-color)]">
              <Button type="button" variant="secondary" onClick={() => setModalType(null)}>Cancel</Button>
              <Button type="submit" loading={isEnrollingSingle} disabled={!singleForm.studentId || !singleForm.term || !singleForm.classId}>
                Enroll Student
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* BULK ENROLL MODAL */}
      {modalType === "bulk" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={handleBulkEnroll} className="w-full max-w-lg bg-[var(--bg-surface)] rounded-xl shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-[var(--border-color)]">
              <h2 className="font-bold text-lg">Bulk Enroll Students</h2>
              <button type="button" onClick={() => setModalType(null)}><X className="h-5 w-5" /></button>
            </div>
            
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1 block">Class</label>
                  <select 
                    className="w-full h-10 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] px-3"
                    required
                    value={bulkForm.classId}
                    onChange={e => setBulkForm({...bulkForm, classId: e.target.value})}
                  >
                    <option value="">Select Class...</option>
                    {classes?.data.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block">Term</label>
                  <select 
                    className="w-full h-10 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] px-3"
                    required
                    value={bulkForm.term}
                    onChange={e => setBulkForm({...bulkForm, term: e.target.value})}
                  >
                    <option value="">Select Term...</option>
                    {activeTerms.map((t: any) => (
                      <option key={t.id} value={t.name}>{t.name} ({t.academicYear})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-medium">
                    Students ({students?.length || 0})
                  </label>
                  <Badge>{selectedStudentIds.length} Selected</Badge>
                </div>

                {isLoadingStudents ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-5 w-5 animate-spin text-[var(--brand)]" />
                  </div>
                ) : students?.length === 0 ? (
                  <div className="text-center p-4 text-sm text-[var(--fg-muted)]">
                    No students found. Create students first.
                  </div>
                ) : (
                  <div className="max-h-72 overflow-y-auto border border-[var(--border-color)] rounded-lg bg-[var(--bg-surface)]">
                    {students?.map((u: any) => {
                      const p = u.studentProfile;
                      const isSelected = selectedStudentIds.includes(p.id);
                      return (
                        <label 
                          key={u.id}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-[var(--bg-muted)] cursor-pointer border-b border-[var(--border-color)] last:border-0"
                        >
                          <input 
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-[var(--brand)] focus:ring-[var(--brand)]"
                            checked={isSelected}
                            onChange={() => toggleStudentSelection(p.id)}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-[var(--fg-base)]">{p.firstName} {p.lastName}</p>
                            <p className="text-xs text-[var(--fg-muted)]">
                              {p.admissionNo || "—"} • {u.email}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center p-4 border-t border-[var(--border-color)] bg-[var(--bg-muted)]/30">
              <span className="text-sm text-[var(--fg-muted)]">
                {selectedStudentIds.length} student(s) selected
              </span>
              <div className="flex gap-2">
                <Button type="button" variant="secondary" onClick={() => setModalType(null)}>Cancel</Button>
                <Button type="submit" loading={isEnrollingBulk} disabled={selectedStudentIds.length === 0 || !bulkForm.term || !bulkForm.classId}>
                  Bulk Enroll
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}