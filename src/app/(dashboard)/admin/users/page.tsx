"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useUsers } from "@/hooks/useUsers";
import { Table, THead, TR, TH, TD } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { Loader2, Search, Plus } from "lucide-react";
import { useState, useCallback } from "react";

export default function AdminUsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const page = Number(searchParams.get("page")) || 1;
  const role = searchParams.get("role") || undefined;
  const search = searchParams.get("search") || undefined;

  const [searchInput, setSearchInput] = useState(search || "");

  const { data, isLoading, isError } = useUsers({ page, limit: 10, role, search });

  // Handle search debounce
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput) params.set("search", searchInput);
    else params.delete("search");
    params.set("page", "1");
    router.push(`/admin/users?${params.toString()}`);
  }, [searchInput, searchParams, router]);

  const setRole = (newRole: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newRole) params.set("role", newRole);
    else params.delete("role");
    params.set("page", "1");
    router.push(`/admin/users?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-[var(--fg-muted)]">Manage all staff, students, and parents.</p>
        </div>
        <Link href="/admin/users/new">
          <Button><Plus className="mr-2 h-4 w-4" /> Add User</Button>
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <Input 
            placeholder="Search by email..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-64"
          />
          <Button type="submit" variant="secondary" className="h-10 w-10 p-0"><Search className="h-4 w-4" /></Button>
        </form>
        
        <div className="flex gap-2">
          {["", "ADMIN", "TEACHER", "STUDENT", "PARENT"].map((r) => (
            <Button
              key={r}
              variant={role === r || (!role && r === "") ? "primary" : "secondary"}
              onClick={() => setRole(r)}
              className="rounded-full px-3 py-1 text-xs"
            >
              {r || "All"}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[var(--fg-muted)]" /></div>
      ) : isError ? (
        <div className="text-red-500">Failed to load users.</div>
      ) : (
        <>
          <Table>
            <THead>
              <TR>
                <TH>Email</TH>
                <TH>Role</TH>
                <TH>Department</TH>
                <TH>Status</TH>
                <TH>Actions</TH>
              </TR>
            </THead>
            <tbody>
              {data?.data.length === 0 && (
                <TR><td colSpan={5} className="text-center py-8 text-[var(--fg-muted)]">No users found.</td></TR>
              )}
              {data?.data.map((user: any) => (
                <TR key={user.id}>
                  <TD className="font-medium">{user.email}</TD>
                  <TD><Badge>{user.role}</Badge></TD>
                  <TD className="text-[var(--fg-muted)]">
                    {user.teacherProfile?.departmentId || user.studentProfile?.departmentId || "—"}
                  </TD>
                  <TD>
                    <Badge variant={user.isActive ? "success" : "danger"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TD>
                  <TD>
                    <Link href={`/admin/users/${user.id}`} className="text-[var(--brand)] hover:underline">Edit</Link>
                  </TD>
                </TR>
              ))}
            </tbody>
          </Table>
          
          {/* Pagination */}
          {data?.meta && data.meta.total > data.meta.limit && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--fg-muted)]">
                Page {data.meta.page} of {Math.ceil(data.meta.total / data.meta.limit)}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  disabled={page <= 1}
                  onClick={() => {
                    const p = new URLSearchParams(searchParams.toString());
                    p.set("page", (page - 1).toString());
                    router.push(`/admin/users?${p.toString()}`);
                  }}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  disabled={page >= Math.ceil(data.meta.total / data.meta.limit)}
                  onClick={() => {
                    const p = new URLSearchParams(searchParams.toString());
                    p.set("page", (page + 1).toString());
                    router.push(`/admin/users?${p.toString()}`);
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}