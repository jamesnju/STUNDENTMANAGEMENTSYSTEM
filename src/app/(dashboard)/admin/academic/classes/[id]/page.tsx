"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  useEnrollments,
  useBulkEnroll,
  useTimetable,
  useCreateTimetableSlot,
  useSubjects,
  useTeachers,
  useClasses,
  useRooms,
} from "@/hooks/useAcademic";
import { Table, THead, TR, TH, TD, TBody } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, UserPlus, CalendarClock } from "lucide-react";
import toast from "react-hot-toast";

function useClassDetail(id: string) {
  return useQuery({
    queryKey: ["academic", "class", id],
    queryFn: async () => (await api.get(`/admin/academic/classes/${id}`)).data.data,
    enabled: !!id,
  });
}

export default function ClassDetailPage() {
  const { id } = useParams() as { id: string };

  const { data: cls, isLoading: loadingClass } = useClassDetail(id);
  const { data: enrollments, isLoading: loadingEnroll } = useEnrollments({ classId: id });
  const { data: timetable, isLoading: loadingTime } = useTimetable({ classId: id });

  const { data: subjectsData } = useSubjects({ departmentId: cls?.departmentId, limit: 100 });
  const { data: teachersData } = useTeachers();
  const { data: roomsData } = useRooms({ isActive: true, limit: 100 });

  const { mutate: bulkEnroll, isPending: isEnrolling } = useBulkEnroll();
  const { mutate: addSlot, isPending: isAddingSlot } = useCreateTimetableSlot();

  // Enrollment state
  const [studentIds, setStudentIds] = useState("");
  const handleEnroll = () => {
    const ids = studentIds.split(",").map((s) => s.trim()).filter(Boolean);
    bulkEnroll(
      { classId: id, term: "Term 1", studentIds: ids },
      { onSuccess: () => setStudentIds("") },
    );
  };

  // Timetable form state — roomId instead of room
  const [slotForm, setSlotForm] = useState({
    subjectId: "",
    teacherId: "",
    dayOfWeek: "1",
    period: "1",
    startTime: "08:00",
    endTime: "08:40",
    roomId: "",
  });

  // Default to first room when rooms load
  useEffect(() => {
    if (!slotForm.roomId && roomsData?.data?.length) {
      setSlotForm((f) => ({ ...f, roomId: roomsData.data[0].id }));
    }
  }, [roomsData, slotForm.roomId]);

 
  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (slotForm.teacherId.length > 30 || !slotForm.teacherId) {
      toast.error("Please select a valid teacher from the dropdown.");
      return;
    }

    addSlot({ 
      ...slotForm, 
      classId: id, 
      dayOfWeek: Number(slotForm.dayOfWeek), 
      period: Number(slotForm.period) 
    }, {
      onSuccess: () => toast.success("Timetable slot added"),
      onError: (err: any) => toast.error(err.response?.data?.error?.message || "Failed to add slot")
    });
  };

  if (loadingClass)
    return (
      <div className="p-8">
        <Loader2 className="animate-spin text-[var(--brand)]" />
      </div>
    );
  if (!cls) return <div className="p-8 text-red-500">Class not found.</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--fg-base)]">
          {cls.name} ({cls.code})
        </h1>
        <p className="text-sm text-[var(--fg-muted)]">
          {cls.academicYear} • {cls.department?.name} Department
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Enrollments Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-[var(--brand)]" /> Enrolled Students
          </h2>
          <div className="flex gap-2">
            <Input
              placeholder="Paste student IDs (comma separated)"
              value={studentIds}
              onChange={(e) => setStudentIds(e.target.value)}
            />
            <Button onClick={handleEnroll} loading={isEnrolling}>
              Enroll
            </Button>
          </div>
          <Table>
            <THead>
              <TR>
                <TH>Student</TH>
                <TH>Admission No</TH>
                <TH>Status</TH>
              </TR>
            </THead>
            <TBody>
              {enrollments?.data.map((e: any) => (
                <TR key={e.id}>
                  <TD className="font-medium">
                    {e.student.firstName} {e.student.lastName}
                  </TD>
                  <TD>{e.student.admissionNo}</TD>
                  <TD>
                    <Badge variant={e.isActive ? "success" : "danger"}>
                      {e.isActive ? "Active" : "Withdrawn"}
                    </Badge>
                  </TD>
                </TR>
              ))}
              {enrollments?.data.length === 0 && (
                <TR>
                  <TD colSpan={3} className="text-center py-4 text-[var(--fg-muted)]">
                    No students enrolled yet.
                  </TD>
                </TR>
              )}
            </TBody>
          </Table>
        </div>

        {/* Timetable Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-[var(--brand)]" /> Timetable
          </h2>

          <form
            onSubmit={handleAddSlot}
            className="grid grid-cols-2 gap-3 p-4 border border-[var(--border-color)] bg-[var(--bg-surface)] rounded-xl shadow-sm"
          >
            <div className="col-span-2">
              <label className="text-xs font-medium text-[var(--fg-muted)] mb-1 block">
                Subject
              </label>
              <select
                className="w-full h-10 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] px-3 text-sm focus:ring-2 focus:ring-[var(--ring)]"
                required
                value={slotForm.subjectId}
                onChange={(e) => setSlotForm({ ...slotForm, subjectId: e.target.value })}
              >
                <option value="">Select Subject...</option>
                {subjectsData?.data.map((sub: any) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} ({sub.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="text-xs font-medium text-[var(--fg-muted)] mb-1 block">
                Teacher
              </label>
              <select
                className="w-full h-10 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] px-3 text-sm focus:ring-2 focus:ring-[var(--ring)]"
                required
                value={slotForm.teacherId}
                onChange={(e) => setSlotForm({ ...slotForm, teacherId: e.target.value })}
              >
                <option value="">Select Teacher...</option>
                {teachersData?.map((t) => (
                  <option key={t.teacherProfile!.id} value={t.teacherProfile!.id}>
                    {t.teacherProfile!.firstName} {t.teacherProfile!.lastName} ({t.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-[var(--fg-muted)] mb-1 block">
                Day
              </label>
              <select
                className="w-full h-10 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] px-3 text-sm"
                value={slotForm.dayOfWeek}
                onChange={(e) => setSlotForm({ ...slotForm, dayOfWeek: e.target.value })}
              >
                <option value="1">Monday</option>
                <option value="2">Tuesday</option>
                <option value="3">Wednesday</option>
                <option value="4">Thursday</option>
                <option value="5">Friday</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-[var(--fg-muted)] mb-1 block">
                Period
              </label>
              <Input
                type="number"
                required
                value={slotForm.period}
                onChange={(e) => setSlotForm({ ...slotForm, period: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[var(--fg-muted)] mb-1 block">
                Start Time
              </label>
              <Input
                type="time"
                required
                value={slotForm.startTime}
                onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[var(--fg-muted)] mb-1 block">
                End Time
              </label>
              <Input
                type="time"
                required
                value={slotForm.endTime}
                onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })}
              />
            </div>

            <div className="col-span-2">
              <label className="text-xs font-medium text-[var(--fg-muted)] mb-1 block">
                Room
              </label>
              <select
                className="w-full h-10 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] px-3 text-sm"
                required
                value={slotForm.roomId}
                onChange={(e) => setSlotForm({ ...slotForm, roomId: e.target.value })}
              >
                <option value="">Select Room...</option>
                {roomsData?.data?.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                    {r.building ? ` — ${r.building}` : ""}
                    {r.capacity ? ` (cap ${r.capacity})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit" loading={isAddingSlot} className="col-span-2 mt-2">
              Add Slot to Timetable
            </Button>
          </form>

          <Table>
            <THead>
              <TR>
                <TH>Day</TH>
                <TH>Period</TH>
                <TH>Subject</TH>
                <TH>Teacher</TH>
                <TH>Room</TH>
              </TR>
            </THead>
            <TBody>
              {timetable?.data.map((slot: any) => (
                <TR key={slot.id}>
                  <TD>{["Mon", "Tue", "Wed", "Thu", "Fri"][slot.dayOfWeek - 1]}</TD>
                  <TD>
                    <div className="flex flex-col">
                      <span className="font-semibold text-[var(--fg-base)]">
                        Period {slot.period}
                      </span>
                      <span className="text-xs text-[var(--fg-muted)]">
                        {slot.startTime} - {slot.endTime}
                      </span>
                    </div>
                  </TD>
                  <TD className="font-medium">{slot.subject?.name}</TD>
                  <TD className="text-sm text-[var(--fg-muted)]">
                    {slot.teacher?.firstName} {slot.teacher?.lastName}
                  </TD>
                  <TD>
                    <Badge>{slot.roomRel?.name ?? slot.room ?? "—"}</Badge>
                  </TD>
                </TR>
              ))}
              {timetable?.data.length === 0 && (
                <TR>
                  <TD colSpan={5} className="text-center py-4 text-[var(--fg-muted)]">
                    No slots added yet.
                  </TD>
                </TR>
              )}
            </TBody>
          </Table>
        </div>
      </div>
    </div>
  );
}