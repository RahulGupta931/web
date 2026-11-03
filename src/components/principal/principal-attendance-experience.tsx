"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AttendanceRosterCard,
  summarizeAttendance,
  type PrincipalAttendanceStatus,
} from "@/components/principal/principal-attendance-ui";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import { principalNavLabel } from "@/config/nav";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

type SectionOption = { id: string; label: string };
type StudentRow = {
  id: string;
  firstName: string;
  lastName: string;
  studentId: string;
  enrollments: { sectionId: string; rollNumber: string }[];
};
type TeacherRow = {
  id: string;
  firstName: string;
  lastName: string;
  employeeId: string;
};

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3 shadow-[var(--shadow-card)]">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-2xl font-bold tabular-nums text-heading">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-muted">{sub}</p> : null}
    </div>
  );
}

function formatDayLabel(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PrincipalAttendanceExperience() {
  const { get, post, isReady } = useApi();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [sections, setSections] = useState<SectionOption[]>([]);
  const [sectionId, setSectionId] = useState("");
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [studentStatus, setStudentStatus] = useState<Record<string, PrincipalAttendanceStatus>>({});
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [teacherStatus, setTeacherStatus] = useState<Record<string, PrincipalAttendanceStatus>>({});
  const [teacherAttendanceMeta, setTeacherAttendanceMeta] = useState<Record<string, string | null>>({});
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState<"students" | "teachers" | null>(null);
  const [tab, setTab] = useState<"students" | "teachers">("students");
  const [search, setSearch] = useState("");

  const sectionLabel = sections.find((s) => s.id === sectionId)?.label;

  useEffect(() => {
    if (!isReady) return;
    let cancelled = false;
    (async () => {
      try {
        const classes = await get<{ id: string; name: string; sections: { id: string; name: string }[] }[]>(
          "/api/principal/classes"
        );
        const opts: SectionOption[] = [];
        for (const c of classes) {
          for (const s of c.sections) {
            opts.push({ id: s.id, label: `${c.name}-${s.name}` });
          }
        }
        if (cancelled) return;
        setSections(opts);

        let defaultSection = opts[0]?.id ?? "";
        for (const o of opts) {
          const roster = await get<StudentRow[]>(`/api/principal/students?sectionId=${o.id}`);
          if (roster.length > 0) {
            defaultSection = o.id;
            break;
          }
        }
        if (!cancelled && defaultSection) setSectionId(defaultSection);
      } catch (e) {
        if (!cancelled) setError(getApiErrorMessage(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [get, isReady]);

  const loadStudentRoster = useCallback(async () => {
    if (!sectionId || !isReady) return;
    try {
      const roster = await get<StudentRow[]>(`/api/principal/students?sectionId=${sectionId}`);
      setStudents(roster);
      const existing = await get<{ studentProfileId: string; status: PrincipalAttendanceStatus }[]>(
        `/api/principal/attendance/students?sectionId=${sectionId}&date=${date}`
      );
      const map: Record<string, PrincipalAttendanceStatus> = {};
      for (const s of roster) {
        const rec = existing.find((r) => r.studentProfileId === s.id);
        map[s.id] = rec?.status ?? "PRESENT";
      }
      setStudentStatus(map);
    } catch (e) {
      setError(getApiErrorMessage(e));
      setStudents([]);
      setStudentStatus({});
    }
  }, [get, sectionId, date, isReady]);

  const loadTeachers = useCallback(async () => {
    if (!isReady) return;
    try {
      const roster = await get<TeacherRow[]>("/api/principal/teachers");
      setTeachers(roster);
      const existing = await get<
        { teacherProfileId: string; status: PrincipalAttendanceStatus; notes?: string | null }[]
      >(`/api/principal/attendance/teachers?date=${date}`);
      const map: Record<string, PrincipalAttendanceStatus> = {};
      const meta: Record<string, string | null> = {};
      for (const t of roster) {
        const rec = existing.find((r) => r.teacherProfileId === t.id);
        map[t.id] = rec?.status ?? "ABSENT";
        if (rec?.notes?.includes("signed in")) {
          meta[t.id] = "Present — signed in to teacher portal";
        } else if (rec?.notes?.includes("absent until sign-in")) {
          meta[t.id] = "Absent — not signed in yet";
        } else if (rec?.notes) {
          meta[t.id] = rec.notes;
        }
      }
      setTeacherStatus(map);
      setTeacherAttendanceMeta(meta);
    } catch (e) {
      setError(getApiErrorMessage(e));
      setTeachers([]);
      setTeacherStatus({});
      setTeacherAttendanceMeta({});
    }
  }, [get, date, isReady]);

  useEffect(() => {
    loadStudentRoster();
  }, [loadStudentRoster]);

  useEffect(() => {
    loadTeachers();
  }, [loadTeachers]);

  const studentIds = useMemo(() => students.map((s) => s.id), [students]);
  const teacherIds = useMemo(() => teachers.map((t) => t.id), [teachers]);

  const studentSummary = useMemo(
    () => summarizeAttendance(studentIds, studentStatus),
    [studentIds, studentStatus]
  );
  const teacherSummary = useMemo(
    () => summarizeAttendance(teacherIds, teacherStatus),
    [teacherIds, teacherStatus]
  );

  const activeSummary = tab === "students" ? studentSummary : teacherSummary;

  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) =>
      `${s.firstName} ${s.lastName} ${s.studentId}`.toLowerCase().includes(q)
    );
  }, [students, search]);

  const filteredTeachers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return teachers;
    return teachers.filter((t) =>
      `${t.firstName} ${t.lastName} ${t.employeeId}`.toLowerCase().includes(q)
    );
  }, [teachers, search]);

  async function saveStudents() {
    if (!sectionId || students.length === 0) return;
    setSaving("students");
    setError(null);
    setMessage(null);
    try {
      await post("/api/principal/attendance/students", {
        date,
        sectionId,
        records: students.map((s) => ({
          studentProfileId: s.id,
          status: studentStatus[s.id] ?? "PRESENT",
        })),
      });
      setMessage("Student attendance saved.");
      await loadStudentRoster();
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setSaving(null);
    }
  }

  function setTeacherStatusFor(id: string, status: PrincipalAttendanceStatus) {
    setTeacherStatus((prev) => ({ ...prev, [id]: status }));
    setTeacherAttendanceMeta((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  async function saveTeachers() {
    if (teachers.length === 0) return;
    setSaving("teachers");
    setError(null);
    setMessage(null);
    try {
      await post("/api/principal/attendance/teachers", {
        date,
        records: teachers.map((t) => ({
          teacherProfileId: t.id,
          status: teacherStatus[t.id] ?? "ABSENT",
        })),
      });
      setMessage("Teacher attendance saved.");
      await loadTeachers();
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setSaving(null);
    }
  }

  function markAllPresent(kind: "students" | "teachers") {
    if (kind === "students") {
      setStudentStatus((prev) => {
        const next = { ...prev };
        for (const s of students) next[s.id] = "PRESENT";
        return next;
      });
    } else {
      setTeacherStatus((prev) => {
        const next = { ...prev };
        for (const t of teachers) next[t.id] = "PRESENT";
        return next;
      });
    }
  }

  const rosterEmpty =
    tab === "students"
      ? students.length === 0
      : teachers.length === 0;
  const filterEmpty =
    tab === "students"
      ? filteredStudents.length === 0
      : filteredTeachers.length === 0;

  return (
    <>
      <PanelAlerts error={error} message={message} messageTitle="Attendance" />

      <PageHeader
        title={principalNavLabel("/principal/attendance")}
        description="Mark student attendance by section and review or override teaching staff for any day."
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/principal/reports" className="btn-secondary shrink-0 text-sm">
              {principalNavLabel("/principal/reports")}
            </Link>
            <Link href="/principal/staff-check-in" className="btn-secondary shrink-0 text-sm">
              {principalNavLabel("/principal/staff-check-in")}
            </Link>
          </div>
        }
      />

      <nav
        className="flex gap-1 rounded-xl border border-border bg-surface p-1 shadow-[var(--shadow-card)]"
        aria-label="Attendance type"
      >
        {(
          [
            ["students", "Students"],
            ["teachers", "Teaching staff"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setTab(id);
              setSearch("");
            }}
            className={`flex flex-1 items-center justify-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              tab === id ? "bg-brand text-white shadow-sm" : "text-muted hover:bg-surface-muted hover:text-heading"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <section
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand-light px-5 py-6 text-white shadow-[var(--shadow-card)]"
        aria-label="Attendance summary"
      >
        <div className="pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-full bg-brand-gold/25 blur-2xl" />
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">
          {tab === "students" ? "Student attendance" : "Staff attendance"}
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">{formatDayLabel(date)}</h2>
        <p className="mt-2 text-sm text-white/85">
          {tab === "students"
            ? sectionLabel
              ? `Section ${sectionLabel} · ${studentSummary.total} student${studentSummary.total === 1 ? "" : "s"}`
              : "Select a section to load the roster"
            : `${teacherSummary.total} teacher${teacherSummary.total === 1 ? "" : "s"} on roster`}
        </p>
      </section>

      <div className="grid gap-3 sm:grid-cols-4">
        <StatCard label="Present" value={activeSummary.present} />
        <StatCard label="Absent" value={activeSummary.absent} />
        <StatCard label="Late" value={activeSummary.late} />
        <StatCard
          label="Half day / leave"
          value={activeSummary.halfDay + activeSummary.leave}
          sub={`${activeSummary.total} in roster`}
        />
      </div>

      <section className="card-panel form-shell space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <label className="block min-w-[10rem] text-sm">
            <span className="text-muted">Date</span>
            <input
              type="date"
              className="mt-1 input-field w-full"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn-secondary text-sm"
              onClick={() => markAllPresent(tab)}
              disabled={saving !== null || rosterEmpty}
            >
              Mark all present
            </button>
            <button
              type="button"
              className="btn-primary text-sm disabled:opacity-50"
              disabled={saving !== null || rosterEmpty}
              onClick={tab === "students" ? saveStudents : saveTeachers}
            >
              {saving === tab
                ? "Saving…"
                : tab === "students"
                  ? "Save students"
                  : "Save teachers"}
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="text-muted">Search roster</span>
            <input
              type="search"
              className="mt-1 input-field w-full"
              placeholder="Name or ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          {tab === "students" ? (
            <label className="block text-sm">
              <span className="text-muted">Section</span>
              <select
                className="mt-1 input-field w-full"
                value={sectionId}
                onChange={(e) => setSectionId(e.target.value)}
              >
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </label>
          ) : (
            <p className="flex items-end pb-2 text-sm text-muted">
              All teaching staff · defaults from portal sign-in until you save overrides
            </p>
          )}
        </div>
      </section>

      {tab === "teachers" && (
        <p className="rounded-xl border border-brand/20 bg-brand/5 px-4 py-3 text-sm text-muted">
          Staff default to <strong className="text-heading">Absent</strong> until they sign in on the teacher portal;
          sign-in sets <strong className="text-heading">Present</strong>. Override below if needed, then save.
        </p>
      )}

      {rosterEmpty ? (
        <p className="card-panel p-6 text-center text-sm text-muted">
          {tab === "students"
            ? "No students in this section. Choose another class/section from the dropdown."
            : "No teachers on file."}
        </p>
      ) : filterEmpty ? (
        <p className="card-panel p-6 text-center text-sm text-muted">No one matches your search.</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tab === "students"
            ? filteredStudents.map((s) => (
                <AttendanceRosterCard
                  key={s.id}
                  primary={`${s.firstName} ${s.lastName}`}
                  secondary={s.studentId}
                  status={studentStatus[s.id] ?? "PRESENT"}
                  onStatusChange={(status) =>
                    setStudentStatus((prev) => ({ ...prev, [s.id]: status }))
                  }
                />
              ))
            : filteredTeachers.map((t) => (
                <AttendanceRosterCard
                  key={t.id}
                  primary={`${t.firstName} ${t.lastName}`}
                  secondary={t.employeeId}
                  status={teacherStatus[t.id] ?? "ABSENT"}
                  meta={teacherAttendanceMeta[t.id]}
                  onStatusChange={(status) => setTeacherStatusFor(t.id, status)}
                />
              ))}
        </ul>
      )}
    </>
  );
}
