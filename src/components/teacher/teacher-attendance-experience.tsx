"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SchoolMonthCalendarCard } from "@/components/calendar/school-month-calendar-card";
import { statusTone } from "@/components/mobile/mobile-primitives";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import { teacherNavLabel } from "@/config/nav";
import { useMediaQuery } from "@/lib/use-media-query";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

type SectionOption = {
  sectionId: string;
  label: string;
};

type StudentRow = {
  id: string;
  firstName: string;
  lastName: string;
  enrollments: { sectionId: string; rollNumber: string }[];
};

const STATUSES = ["PRESENT", "ABSENT", "LATE", "HALF_DAY", "LEAVE_APPROVED"] as const;
type AttendanceStatus = (typeof STATUSES)[number];

const STATUS_LABEL: Record<AttendanceStatus, string> = {
  PRESENT: "Present",
  ABSENT: "Absent",
  LATE: "Late",
  HALF_DAY: "Half day",
  LEAVE_APPROVED: "Leave",
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

function formatHeroDate(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function TeacherAttendanceExperience() {
  const { get, post } = useApi();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const [sections, setSections] = useState<SectionOption[]>([]);
  const [sectionId, setSectionId] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [statusByStudent, setStatusByStudent] = useState<Record<string, AttendanceStatus>>({});
  const [loadingSections, setLoadingSections] = useState(true);
  const [loadingRoster, setLoadingRoster] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    get<{
      profile: {
        classAssignments: {
          sectionId: string;
          section: { name: string; class: { name: string } };
        }[];
      };
    }>("/api/teacher/dashboard")
      .then((d) => {
        const opts = d.profile.classAssignments.map((a) => ({
          sectionId: a.sectionId,
          label: `${a.section.class.name}-${a.section.name}`,
        }));
        setSections(opts);
        if (opts[0]) setSectionId(opts[0].sectionId);
      })
      .catch((e) => setError(getApiErrorMessage(e)))
      .finally(() => setLoadingSections(false));
  }, [get]);

  const loadRoster = useCallback(async () => {
    if (!sectionId) {
      setStudents([]);
      setStatusByStudent({});
      return;
    }
    setLoadingRoster(true);
    setError(null);
    setMessage(null);
    try {
      const inSection = await get<StudentRow[]>(
        `/api/teacher/students?sectionId=${encodeURIComponent(sectionId)}`
      );
      setStudents(inSection);
      const existing = await get<{ studentProfileId: string; status: AttendanceStatus }[]>(
        `/api/teacher/attendance?sectionId=${sectionId}&date=${date}`
      );
      const map: Record<string, AttendanceStatus> = {};
      for (const s of inSection) {
        const rec = existing.find((r) => r.studentProfileId === s.id);
        map[s.id] = rec?.status ?? "PRESENT";
      }
      setStatusByStudent(map);
    } catch (e) {
      setError(getApiErrorMessage(e));
      setStudents([]);
      setStatusByStudent({});
    } finally {
      setLoadingRoster(false);
    }
  }, [get, sectionId, date]);

  useEffect(() => {
    if (sectionId) loadRoster();
  }, [sectionId, date, loadRoster]);

  const sectionLabel = sections.find((s) => s.sectionId === sectionId)?.label ?? "Class";

  const counts = useMemo(() => {
    const c: Record<AttendanceStatus, number> = {
      PRESENT: 0,
      ABSENT: 0,
      LATE: 0,
      HALF_DAY: 0,
      LEAVE_APPROVED: 0,
    };
    for (const s of students) {
      const st = statusByStudent[s.id] ?? "PRESENT";
      c[st] += 1;
    }
    return c;
  }, [students, statusByStudent]);

  function setAllPresent() {
    const next: Record<string, AttendanceStatus> = {};
    for (const s of students) next[s.id] = "PRESENT";
    setStatusByStudent(next);
  }

  async function save() {
    if (!sectionId || students.length === 0) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await post("/api/teacher/attendance", {
        date,
        sectionId,
        records: students.map((s) => ({
          studentProfileId: s.id,
          status: statusByStudent[s.id] ?? "PRESENT",
        })),
      });
      setMessage("Attendance saved.");
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  const rosterContent = loadingRoster ? (
    <p className="empty-state py-8">Loading roster…</p>
  ) : students.length === 0 ? (
    <p className="empty-state py-8">
      {sections.length === 0
        ? "You are not assigned as class teacher for any section."
        : "No students in this section."}
    </p>
  ) : isDesktop ? (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-surface-muted text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3 font-semibold w-12">#</th>
            <th className="px-4 py-3 font-semibold">Student</th>
            <th className="px-4 py-3 font-semibold w-20">Roll</th>
            <th className="px-4 py-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-surface">
          {students.map((s, i) => {
            const roll = s.enrollments.find((e) => e.sectionId === sectionId)?.rollNumber ?? "—";
            const status = statusByStudent[s.id] ?? "PRESENT";
            return (
              <tr key={s.id} className="hover:bg-brand/[0.03]">
                <td className="px-4 py-2.5 tabular-nums text-muted">{i + 1}</td>
                <td className="px-4 py-2.5 font-medium text-heading">
                  {s.firstName} {s.lastName}
                </td>
                <td className="px-4 py-2.5 tabular-nums">{roll}</td>
                <td className="px-4 py-2.5">
                  <div className="flex flex-wrap gap-1">
                    {STATUSES.map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() =>
                          setStatusByStudent((prev) => ({ ...prev, [s.id]: st }))
                        }
                        className={`rounded-full px-2 py-0.5 text-[0.625rem] font-semibold transition ${
                          status === st
                            ? "bg-brand text-white"
                            : "bg-surface-muted text-muted hover:text-heading"
                        }`}
                      >
                        {STATUS_LABEL[st]}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  ) : (
    <ul className="space-y-3 pb-24">
      {students.map((s) => {
        const roll = s.enrollments.find((e) => e.sectionId === sectionId)?.rollNumber ?? "—";
        const status = statusByStudent[s.id] ?? "PRESENT";
        return (
          <li key={s.id} className="rounded-xl border border-border bg-surface p-4 shadow-[var(--shadow-card)]">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-heading">{s.firstName} {s.lastName}</p>
                <p className="text-xs text-muted">Roll {roll}</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[0.65rem] font-semibold ${statusTone(status)}`}>
                {STATUS_LABEL[status]}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {STATUSES.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusByStudent((prev) => ({ ...prev, [s.id]: st }))}
                  className={`rounded-full px-2.5 py-1 text-[0.65rem] font-semibold transition ${
                    status === st ? "bg-brand text-white" : "bg-surface-muted text-muted"
                  }`}
                >
                  {STATUS_LABEL[st]}
                </button>
              ))}
            </div>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <PanelAlerts error={error} message={message} messageTitle="Attendance saved" />
      <PageHeader
        title={teacherNavLabel("/teacher/attendance")}
        description="Mark daily attendance for sections where you are the class teacher."
      />

      <section
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand-light px-5 py-6 text-white shadow-[var(--shadow-card)]"
        aria-label="Attendance session"
      >
        <div className="pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-full bg-brand-gold/25 blur-2xl" />
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">
          {sectionLabel}
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">{formatHeroDate(date)}</h2>
        <p className="mt-2 text-sm text-white/85">
          {students.length > 0
            ? `${counts.PRESENT} present · ${counts.ABSENT} absent · ${counts.LATE} late`
            : "Choose a section and date, then mark each student."}
        </p>
      </section>

      {students.length > 0 && (
        <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-5">
          <StatCard label="Roster" value={students.length} />
          <StatCard label="Present" value={counts.PRESENT} />
          <StatCard label="Absent" value={counts.ABSENT} />
          <StatCard label="Late" value={counts.LATE} />
          <StatCard label="Half / leave" value={counts.HALF_DAY + counts.LEAVE_APPROVED} />
        </div>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <section className="space-y-4">
          <div className="card-panel form-shell space-y-4">
            <p className="form-section-title">Class section</p>
            {loadingSections ? (
              <p className="text-sm text-muted">Loading sections…</p>
            ) : sections.length === 0 ? (
              <p className="text-sm text-muted">No class-teacher sections assigned.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {sections.map((s) => (
                  <button
                    key={s.sectionId}
                    type="button"
                    onClick={() => setSectionId(s.sectionId)}
                    className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
                      s.sectionId === sectionId
                        ? "border-brand bg-brand text-white"
                        : "border-border hover:border-brand/40"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
            <label className="block text-sm">
              <span className="font-medium text-heading">Attendance date</span>
              <input
                type="date"
                className="input-field mt-1.5 w-full max-w-xs"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
          </div>
          <SchoolMonthCalendarCard
            role="teacher"
            selectedDate={date}
            onSelectDate={setDate}
            title="School calendar"
            showHolidayLists={false}
          />
        </section>

        <section className="card-panel overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
            <div>
              <p className="form-section-title">Roster</p>
              <p className="mt-0.5 text-xs text-muted">{sectionLabel}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-secondary text-xs"
                disabled={students.length === 0}
                onClick={setAllPresent}
              >
                All present
              </button>
              {isDesktop && (
                <button
                  type="button"
                  onClick={save}
                  disabled={saving || !sectionId || students.length === 0}
                  className="btn-primary text-sm disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save attendance"}
                </button>
              )}
            </div>
          </div>
          <div className="form-shell">{rosterContent}</div>
        </section>
      </div>

      {!isDesktop && (
        <button
          type="button"
          onClick={save}
          disabled={saving || !sectionId || students.length === 0}
          className="fixed bottom-[5.75rem] left-4 right-4 z-20 rounded-2xl bg-brand-gold py-3.5 text-center text-sm font-bold text-brand-dark shadow-[0_8px_24px_rgb(201_162_39/0.45)] disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save attendance"}
        </button>
      )}
    </>
  );
}
