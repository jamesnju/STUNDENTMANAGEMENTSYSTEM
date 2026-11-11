"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCreateUser, useParents } from "@/hooks/useUsers";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Loader2, Search, UserPlus, X, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function NewUserPage() {
  const router = useRouter();
  const { mutate: createUser, isPending } = useCreateUser();
  
  const [role, setRole] = useState("TEACHER");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  // Parent Search State
  const [parentSearch, setParentSearch] = useState("");
  const [selectedParent, setSelectedParent] = useState<any>(null);
  
  // Fetch ALL parents once
  const { data: allParents, isLoading: isLoadingParents } = useParents();

  // Filter locally based on search input
  const filteredParents = useMemo(() => {
    if (!parentSearch) return [];
    const searchLower = parentSearch.toLowerCase();
    
    return allParents?.filter((p: any) => {
      const firstName = p.parentProfile?.firstName?.toLowerCase() || "";
      const lastName = p.parentProfile?.lastName?.toLowerCase() || "";
      const email = p.email?.toLowerCase() || "";
      
      return (
        firstName.includes(searchLower) || 
        lastName.includes(searchLower) || 
        email.includes(searchLower)
      );
    });
  }, [allParents, parentSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload: any = {
      email: formData.email,
      password: formData.password,
      role: role,
    };

    if (role !== "ADMIN") {
      payload.firstName = formData.firstName;
      payload.lastName = formData.lastName;
    }

    if (role === "TEACHER") {
      payload.employeeCode = formData.employeeCode;
      payload.hireDate = formData.hireDate || undefined;
    } else if (role === "STUDENT") {
      payload.admissionNo = formData.admissionNo;
      payload.dateOfBirth = formData.dateOfBirth || undefined;
      if (selectedParent) {
        payload.parentId = selectedParent.id;
      }
    } else if (role === "PARENT") {
      payload.phone = formData.phone;
    }

    createUser(payload, {
      onSuccess: () => router.push("/admin/users"),
      onError: (err: any) => setError(err.response?.data?.error?.message || "Failed to create user."),
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/users" className="p-2 rounded-full hover:bg-[var(--bg-muted)]"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-2xl font-bold text-[var(--fg-base)]">Create New User</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-sm">
        {error && <div className="p-3 bg-red-100 text-red-800 rounded-lg text-sm">{error}</div>}

        {/* Role Selector Tabs */}
        <div className="flex bg-[var(--bg-muted)] p-1 rounded-lg">
          {["TEACHER", "STUDENT", "PARENT", "ADMIN"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => { setRole(r); setSelectedParent(null); setParentSearch(""); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${role === r ? "bg-[var(--bg-surface)] text-[var(--brand)] shadow-sm" : "text-[var(--fg-muted)] hover:text-[var(--fg-base)]"}`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Base Fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm mb-1 font-medium text-[var(--fg-base)]">Email</label>
            <Input type="email" required onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium text-[var(--fg-base)]">Temporary Password</label>
            <Input type="password" required onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          </div>
        </div>

        {/* Dynamic Fields based on Role */}
        {role !== "ADMIN" && (
          <div className="grid gap-4 sm:grid-cols-2 border-t border-[var(--border-color)] pt-6">
            <div>
              <label className="block text-sm mb-1 font-medium text-[var(--fg-base)]">First Name</label>
              <Input required onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium text-[var(--fg-base)]">Last Name</label>
              <Input required onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
            </div>

            {role === "TEACHER" && (
              <div>
                <label className="block text-sm mb-1 font-medium text-[var(--fg-base)]">Employee Code</label>
                <Input required onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })} />
              </div>
            )}

            {role === "STUDENT" && (
              <>
                <div>
                  <label className="block text-sm mb-1 font-medium text-[var(--fg-base)]">Admission No</label>
                  <Input required onChange={(e) => setFormData({ ...formData, admissionNo: e.target.value })} />
                </div>
                
                {/* --- PARENT SEARCH & SELECT --- */}
                <div className="sm:col-span-2">
                  <label className="block text-sm mb-1 font-medium text-[var(--fg-base)]">Link to Parent (Optional)</label>
                  
                  {selectedParent ? (
                    // Selected Parent Display
                    <div className="flex items-center justify-between p-3 border border-[var(--brand)] bg-[var(--primary-50)] dark:bg-[var(--primary-900)]/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[var(--brand)] text-white flex items-center justify-center font-bold">
                          {selectedParent.parentProfile?.firstName?.[0]}{selectedParent.parentProfile?.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[var(--fg-base)]">
                            {selectedParent.parentProfile?.firstName} {selectedParent.parentProfile?.lastName}
                          </p>
                          <p className="text-xs text-[var(--fg-muted)]">
                            {selectedParent.email} • {selectedParent.parentProfile?.phone || "No phone"}
                          </p>
                        </div>
                      </div>
                      <Button type="button" variant="ghost" onClick={() => setSelectedParent(null)} className="h-8 px-3 text-red-500 hover:text-red-700 hover:bg-red-50">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    // Search Input & Dropdown
                    <div className="relative">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fg-muted)]" />
                          <Input 
                            placeholder="Type parent name or email..." 
                            className="pl-9"
                            value={parentSearch}
                            onChange={(e) => setParentSearch(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Results Dropdown (Locally Filtered) */}
                      {parentSearch.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg shadow-xl max-h-60 overflow-y-auto">
                          {isLoadingParents ? (
                            <div className="p-4 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-[var(--fg-muted)]" /></div>
                          ) : filteredParents?.length === 0 ? (
                            <div className="p-4 text-center text-sm text-[var(--fg-muted)]">No parents found matching "{parentSearch}"</div>
                          ) : (
                            filteredParents?.map((p: any) => (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => { setSelectedParent(p); setParentSearch(""); }}
                                className="group w-full flex items-start gap-3 text-left px-4 py-3 hover:bg-[var(--bg-muted)] border-b border-[var(--border-color)] last:border-0 transition-colors"
                              >
                                <div className="h-8 w-8 rounded-full bg-[var(--bg-muted)] flex items-center justify-center shrink-0 mt-0.5">
                                  <UserPlus className="h-4 w-4 text-[var(--fg-muted)]" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-sm text-[var(--fg-base)]">
                                    {p.parentProfile?.firstName} {p.parentProfile?.lastName}
                                  </p>
                                  <p className="text-xs text-[var(--fg-muted)]">{p.email}</p>
                                  {p.parentProfile?.phone && (
                                    <p className="text-xs text-[var(--fg-muted)] mt-0.5">📞 {p.parentProfile.phone}</p>
                                  )}
                                </div>
                                <CheckCircle2 className="h-4 w-4 text-transparent group-hover:text-[var(--brand)]" />
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {/* --- END PARENT SEARCH --- */}
              </>
            )}

            {role === "PARENT" && (
              <div>
                <label className="block text-sm mb-1 font-medium text-[var(--fg-base)]">Phone Number</label>
                <Input required onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-[var(--border-color)]">
          <Button type="submit" loading={isPending} className="w-full sm:w-auto">
            <UserPlus className="mr-2 h-4 w-4" /> Create {role}
          </Button>
        </div>
      </form>
    </div>
  );
}