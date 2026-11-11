"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTeacherStudents } from "@/hooks/useTeacher";
import { Table, THead, TR, TH, TD, TBody } from "@/components/ui/Table";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Search, Loader2, UserCircle2 } from "lucide-react";
import Link from "next/link";

export default function TeacherStudentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(search);

  const { data, isLoading } = useTeacherStudents({ page, limit: 10, search });

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const params = new URLSearchParams(searchParams.toString());
      if (searchInput) params.set("search", searchInput);
      else params.delete("search");
      params.set("page", "1");
      router.push(`/teacher/students?${params.toString()}`);
    },
    [searchInput, searchParams, router]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--fg-base)]">My Students</h1>
          <p className="text-sm text-[var(--fg-muted)]">
            Directory of students in your department.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 max-w-md">
        <form onSubmit={handleSearch} className="flex w-full items-center gap-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fg-muted)]" />
            <Input
              placeholder="Search by name or admission no..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--brand)]" />
        </div>
      ) : (
        <>
          <Table>
            <THead>
              <TR>
                <TH>Student Name</TH>
                <TH>Admission No</TH>
                <TH>Email Address</TH>
                <TH>Class</TH>
                <TH>Action</TH>
              </TR>
            </THead>
            <TBody>
              {data?.data.length === 0 && (
                <TR>
                  <TD colSpan={5} className="py-12 text-center text-[var(--fg-muted)]">
                    No students found matching your search.
                  </TD>
                </TR>
              )}
              {data?.data.map((student: any) => (
                <TR key={student.id}>
                  <TD className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-muted)] text-[var(--fg-muted)]">
                        <UserCircle2 className="h-5 w-5" />
                      </div>
                      {student.firstName} {student.lastName}
                    </div>
                  </TD>
                  <TD>
                    <span className="rounded-md bg-[var(--secondary-100)] px-2 py-1 text-xs font-medium text-[var(--secondary-800)] dark:bg-[var(--secondary-900)] dark:text-[var(--secondary-200)]">
                      {student.admissionNo}
                    </span>
                  </TD>
                  <TD className="text-[var(--fg-muted)]">{student.user.email}</TD>
                  <TD>
                    {student.enrollments?.map((e: any) => e.class.name).join(", ") || (
                      <span className="text-[var(--fg-muted)] italic">Not enrolled</span>
                    )}
                  </TD>
                  <TD>
                    <Link
                      href={`/teacher/students/${student.id}`}
                      className="text-sm font-medium text-[var(--brand)] hover:underline"
                    >
                      View Profile
                    </Link>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>

          {/* Pagination Controls */}
          {data?.meta && data.meta.total > data.meta.limit && (
            <div className="flex items-center justify-between border-t border-[var(--border-color)] pt-4">
              <span className="text-sm text-[var(--fg-muted)]">
                Showing page {data.meta.page} of {Math.ceil(data.meta.total / data.meta.limit)}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  disabled={page <= 1}
                  onClick={() => {
                    const p = new URLSearchParams(searchParams.toString());
                    p.set("page", (page - 1).toString());
                    router.push(`/teacher/students?${p.toString()}`);
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
                    router.push(`/teacher/students?${p.toString()}`);
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