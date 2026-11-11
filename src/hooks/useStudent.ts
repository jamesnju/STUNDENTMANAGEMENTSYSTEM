import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useStudentProfile() {
  return useQuery({
    queryKey: ["student", "me"],
    queryFn: async () => {
      const { data } = await api.get("/students/me");
      return data.data;
    },
  });
}

export function useStudentClasses() {
  return useQuery({
    queryKey: ["student", "classes"],
    queryFn: async () => {
      const { data } = await api.get("/students/me/classes");
      return data.data;
    },
  });
}

export function useStudentTimetable() {
  return useQuery({
    queryKey: ["student", "timetable"],
    queryFn: async () => {
      const { data } = await api.get("/students/me/timetable");
      return data.data;
    },
  });
}


export function useStudentGrades() {
  return useQuery({
    queryKey: ["student", "grades"],
    queryFn: async () => {
      const { data } = await api.get("/students/me/grades");
      return data.data; // { grades: [], studentId: "..." }
    },
  });
}

export function useStudentAttendance() {
  return useQuery({
    queryKey: ["student", "attendance"],
    queryFn: async () => {
      const { data } = await api.get("/students/me/attendance");
      return data.data; // { attendance: [], studentId: "..." }
    },
  });
}