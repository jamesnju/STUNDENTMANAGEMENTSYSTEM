"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useDepartments, useCreateDepartment, useUpdateDepartment, useDeleteDepartment } from "@/hooks/useDepartments";
import { Table, THead, TR, TH, TD, TBody } from "@/components/ui/Table";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Loader2, Building2, Search, Plus, Edit2, Trash2, Users, GraduationCap, Eye } from "lucide-react";
import { DepartmentModal } from "@/components/admin/departments/DepartmentModal";

export default function DepartmentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(search);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<any>(null);

  const { data, isLoading } = useDepartments({ page, limit: 10, search });
  const { mutate: createDept, isPending: isCreating } = useCreateDepartment();
  const { mutate: updateDept, isPending: isUpdating } = useUpdateDepartment();
  const { mutate: deleteDept } = useDeleteDepartment();

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput) params.set("search", searchInput);
    else params.delete("search");
    params.set("page", "1");
    router.push(`/admin/departments?${params.toString()}`);
  }, [searchInput, searchParams, router]);

  const handleSave = (payload: any) => {
    if (editingDept) {
      updateDept({ id: editingDept.id, payload }, {
        onSuccess: () => setIsModalOpen(false),
        onError: (err: any) => alert(err.response?.data?.error?.message || "Failed to update."),
      });
    } else {
      createDept(payload, {
        onSuccess: () => setIsModalOpen(false),
        onError: (err: any) => alert(err.response?.data?.error?.message || "Failed to create."),
      });
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the department "${name}"?`)) {
      deleteDept(id, {
        onError: (err: any) => {
          // Handle the specific 409 error from the API
          const msg = err.response?.data?.error?.message || "Failed to delete department.";
          alert(msg);
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-[var(--fg-base)]">
            <Building2 className="h-6 w-6 text-[var(--brand)]" /> Departments
          </h1>
          <p className="text-sm text-[var(--fg-muted)]">Manage academic and administrative departments.</p>
        </div>
        <Button onClick={() => { setEditingDept(null); setIsModalOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Department
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 max-w-md">
        <form onSubmit={handleSearch} className="flex w-full items-center gap-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fg-muted)]" />
            <Input
              placeholder="Search departments..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="secondary">Search</Button>
        </form>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[var(--brand)]" /></div>
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Name</TH>
              <TH>Code</TH>
              <TH>Teachers</TH>
              <TH>Students</TH>
              <TH>Created</TH>
              <TH className="text-right">Actions</TH>
            </TR>
          </THead>
          <TBody>
            {data?.data.length === 0 && (
              <TR><TD colSpan={6} className="py-12 text-center text-[var(--fg-muted)]">No departments found.</TD></TR>
            )}
            {data?.data.map((dept: any) => (
              <TR key={dept.id}>
                <TD className="font-medium text-[var(--fg-base)]">{dept.name}</TD>
                <TD>
                  <Badge className="bg-[var(--bg-muted)] text-[var(--fg-base)]">{dept.code}</Badge>
                </TD>
                <TD>
                  <span className="flex items-center gap-1.5 text-sm text-[var(--fg-muted)]">
                    <Users className="h-4 w-4" /> {dept._count?.teachers || 0}
                  </span>
                </TD>
                <TD>
                  <span className="flex items-center gap-1.5 text-sm text-[var(--fg-muted)]">
                    <GraduationCap className="h-4 w-4" /> {dept._count?.students || 0}
                  </span>
                </TD>
                <TD className="text-[var(--fg-muted)] text-sm">
                  {new Date(dept.createdAt).toLocaleDateString()}
                </TD>
                <TD className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/departments/${dept.id}`}>
                      <Button variant="secondary" className="h-8 px-3 text-xs">
                        <Eye className="mr-1.5 h-3.5 w-3.5" /> View
                      </Button>
                    </Link>
                    <Button 
                      variant="secondary" 
                      className="h-8 px-3 text-xs"
                      onClick={() => { setEditingDept(dept); setIsModalOpen(true); }}
                    >
                      <Edit2 className="mr-1.5 h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="h-8 px-3 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30" 
                      onClick={() => handleDelete(dept.id, dept.name)}
                    >
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                    </Button>
                  </div>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}

      {/* Pagination */}
      {data?.meta && data.meta.total > data.meta.limit && (
        <div className="flex items-center justify-between border-t border-[var(--border-color)] pt-4">
          <span className="text-sm text-[var(--fg-muted)]">
            Showing page {data.meta.page} of {Math.ceil(data.meta.total / data.meta.limit)}
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" disabled={page <= 1} onClick={() => {
              const p = new URLSearchParams(searchParams.toString());
              p.set("page", (page - 1).toString());
              router.push(`/admin/departments?${p.toString()}`);
            }}>Previous</Button>
            <Button variant="secondary" disabled={page >= Math.ceil(data.meta.total / data.meta.limit)} onClick={() => {
              const p = new URLSearchParams(searchParams.toString());
              p.set("page", (page + 1).toString());
              router.push(`/admin/departments?${p.toString()}`);
            }}>Next</Button>
          </div>
        </div>
      )}

      <DepartmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editingDept}
        onSave={handleSave}
        isSaving={isCreating || isUpdating}
      />
    </div>
  );
}