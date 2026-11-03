"use client";

import { useMemo } from "react";
import { PanelMobileShell } from "@/components/panel/panel-mobile-shell";
import { MobileEmptyState } from "@/components/mobile/mobile-primitives";
import {
  AttendanceRosterCard,
  AttendanceSummaryStats,
  AttendanceTabSwitch,
  AttendanceToolbarCard,
  type PrincipalAttendanceStatus,
} from "@/components/principal/principal-attendance-ui";

type SectionOption = { id: string; label: string };

export type { PrincipalAttendanceStatus };

export function PrincipalAttendanceMobile({
  date,
  onDateChange,
  tab,
  onTabChange,
  sections,
  sectionId,
  onSectionChange,
  students,
  studentStatus,
  onStudentStatusChange,
  teachers,
  teacherStatus,
  teacherAttendanceMeta,
  onTeacherStatusChange,
  saving,
  onSaveStudents,
  onSaveTeachers,
  search,
  onSearchChange,
  onMarkAllPresent,
}: {
  date: string;
  onDateChange: (d: string) => void;
  tab: "students" | "teachers";
  onTabChange: (t: "students" | "teachers") => void;
  sections: SectionOption[];
  sectionId: string;
  onSectionChange: (id: string) => void;
  students: { id: string; firstName: string; lastName: string; studentId: string }[];
  studentStatus: Record<string, PrincipalAttendanceStatus>;
  onStudentStatusChange: (id: string, status: PrincipalAttendanceStatus) => void;
  teachers: { id: string; firstName: string; lastName: string; employeeId: string }[];
  teacherStatus: Record<string, PrincipalAttendanceStatus>;
  teacherAttendanceMeta?: Record<string, string | null>;
  onTeacherStatusChange: (id: string, status: PrincipalAttendanceStatus) => void;
  saving: "students" | "teachers" | null;
  onSaveStudents: () => void;
  onSaveTeachers: () => void;
  search: string;
  onSearchChange: (q: string) => void;
  onMarkAllPresent: (kind: "students" | "teachers") => void;
}) {
  const sectionLabel = sections.find((s) => s.id === sectionId)?.label ?? "Section";
  const studentIds = useMemo(() => students.map((s) => s.id), [students]);
  const teacherIds = useMemo(() => teachers.map((t) => t.id), [teachers]);

  const q = search.trim().toLowerCase();
  const filteredStudents = useMemo(() => {
    if (!q) return students;
    return students.filter((s) =>
      `${s.firstName} ${s.lastName} ${s.studentId}`.toLowerCase().includes(q)
    );
  }, [students, q]);

  const filteredTeachers = useMemo(() => {
    if (!q) return teachers;
    return teachers.filter((t) =>
      `${t.firstName} ${t.lastName} ${t.employeeId}`.toLowerCase().includes(q)
    );
  }, [teachers, q]);

  return (
    <PanelMobileShell
      role="principal"
      kicker="Principal"
      title="Attendance"
      subtitle="Pick a date · mark roster · save when done."
      showCalendar={false}
      heroExtra={<AttendanceTabSwitch tab={tab} onTabChange={onTabChange} variant="workflow" />}
    >
      <AttendanceToolbarCard
        date={date}
        onDateChange={onDateChange}
        sectionLabel={tab === "students" ? sectionLabel : "All teaching staff"}
      />

      <label className="block text-sm">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Search</span>
        <input
          type="search"
          className="mt-1 w-full input-field"
          placeholder="Name or ID"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </label>

      {tab === "students" && (
        <>
          <label className="block text-sm">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">Section</span>
            <select
              className="mt-1 w-full input-field"
              value={sectionId}
              onChange={(e) => onSectionChange(e.target.value)}
            >
              {sections.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </label>
          <p className="text-xs text-muted">{sectionLabel}</p>

          <AttendanceSummaryStats ids={studentIds} statusById={studentStatus} />

          {students.length === 0 ? (
            <MobileEmptyState message="No students in this section." />
          ) : filteredStudents.length === 0 ? (
            <MobileEmptyState message="No students match your search." />
          ) : (
            <ul className="space-y-3">
              {filteredStudents.map((s) => (
                <AttendanceRosterCard
                  key={s.id}
                  primary={`${s.firstName} ${s.lastName}`}
                  secondary={s.studentId}
                  status={studentStatus[s.id] ?? "PRESENT"}
                  onStatusChange={(status) => onStudentStatusChange(s.id, status)}
                />
              ))}
            </ul>
          )}

          <div className="sticky bottom-0 -mx-1 flex gap-2 border-t border-border bg-[var(--surface)]/95 px-1 py-3 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => onMarkAllPresent("students")}
              disabled={saving !== null || students.length === 0}
              className="flex-1 rounded-2xl border border-border bg-surface py-3 text-sm font-semibold text-heading disabled:opacity-50"
            >
              All present
            </button>
            <button
              type="button"
              onClick={onSaveStudents}
              disabled={saving !== null || students.length === 0}
              className="flex-[1.4] rounded-2xl bg-brand-gold py-3 text-sm font-bold text-brand-dark disabled:opacity-50"
            >
              {saving === "students" ? "Saving…" : "Save students"}
            </button>
          </div>
        </>
      )}

      {tab === "teachers" && (
        <>
          <p className="text-xs text-muted rounded-xl border border-brand/20 bg-brand/5 px-3 py-2.5">
            Staff default to Absent until they sign in to the teacher portal (then Present). Edit and save if needed.
          </p>

          <AttendanceSummaryStats ids={teacherIds} statusById={teacherStatus} />

          {teachers.length === 0 ? (
            <MobileEmptyState message="No teachers on file." />
          ) : filteredTeachers.length === 0 ? (
            <MobileEmptyState message="No staff match your search." />
          ) : (
            <ul className="space-y-3">
              {filteredTeachers.map((t) => (
                <AttendanceRosterCard
                  key={t.id}
                  primary={`${t.firstName} ${t.lastName}`}
                  secondary={t.employeeId}
                  status={teacherStatus[t.id] ?? "ABSENT"}
                  meta={teacherAttendanceMeta?.[t.id]}
                  onStatusChange={(status) => onTeacherStatusChange(t.id, status)}
                />
              ))}
            </ul>
          )}

          <div className="sticky bottom-0 -mx-1 flex gap-2 border-t border-border bg-[var(--surface)]/95 px-1 py-3 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => onMarkAllPresent("teachers")}
              disabled={saving !== null || teachers.length === 0}
              className="flex-1 rounded-2xl border border-border bg-surface py-3 text-sm font-semibold text-heading disabled:opacity-50"
            >
              All present
            </button>
            <button
              type="button"
              onClick={onSaveTeachers}
              disabled={saving !== null || teachers.length === 0}
              className="flex-[1.4] rounded-2xl bg-brand-gold py-3 text-sm font-bold text-brand-dark disabled:opacity-50"
            >
              {saving === "teachers" ? "Saving…" : "Save teachers"}
            </button>
          </div>
        </>
      )}
    </PanelMobileShell>
  );
}
