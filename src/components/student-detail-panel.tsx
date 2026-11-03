"use client";

import { useState } from "react";
import { PanelAlerts } from "@/components/panel-alerts";
import { MobilePageHero, statusTone } from "@/components/mobile/mobile-primitives";
import { StudentEditForm } from "@/components/student-edit-form";
import {
  StudentEnrollmentForm,
  type ClassOption,
  type EnrollmentFormValues,
  type SessionOption,
} from "@/components/student-enrollment-form";
import type { studentEditFormToPayload } from "@/config/student-form";

export type StudentDetail = {
  profile: {
    id: string;
    studentId: string;
    admissionNumber: string;
    firstName: string;
    middleName: string | null;
    lastName: string;
    phone: string | null;
    gender: string;
    dateOfBirth: string | null;
    bloodGroup: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    fatherName: string | null;
    motherName: string | null;
    guardianName: string | null;
    guardianPhone: string | null;
    guardianEmail: string | null;
    admissionType: string;
    user: { email: string; status: string } | null;
    enrollments: {
      isActive: boolean;
      rollNumber: string;
      class: { name: string };
      section: { name: string };
      academicSession: { name: string };
    }[];
  };
  activeEnrollment: {
    classId: string;
    sectionId: string;
    academicSessionId: string;
    rollNumber: string;
    class: { id: string; name: string };
    section: { id: string; name: string };
    academicSession: { id: string; name: string };
  } | null;
  attendance: {
    percentage: number | null;
    records: { date: string; status: string }[];
  };
  examMarks: {
    marksObtained: unknown;
    isPass: boolean | null;
    grade: string | null;
    examSubject: {
      maxMarks: unknown;
      subject: { name: string };
      examination: { name: string; publicationStatus: string };
    };
  }[];
  assignments: {
    title: string;
    dueAt: string;
    subject: { name: string };
    teacher: { firstName: string; lastName: string };
    submissions: { status: string; marks: unknown; feedback: string | null; fileUrl: string | null }[];
  }[];
  timetable: {
    slots: {
      day: string;
      period: { name: string; periodNo: number };
      subject: { name: string };
      teacher: { firstName: string; lastName: string } | null;
      classroom: { name: string } | null;
    }[];
  };
};

type DetailTab = "overview" | "attendance" | "academics" | "timetable" | "assignments";

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString();
}

function displayName(p: StudentDetail["profile"]) {
  return [p.firstName, p.middleName, p.lastName].filter(Boolean).join(" ");
}

function initials(p: StudentDetail["profile"]) {
  return `${p.firstName.charAt(0)}${p.lastName.charAt(0)}`.toUpperCase();
}

function fmtDay(day: string) {
  return day.charAt(0) + day.slice(1).toLowerCase();
}

function fmtEnum(v: string) {
  return v.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (x) => x.toUpperCase());
}

const DAY_ORDER = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-2.5 shadow-[var(--shadow-card)] sm:px-4 sm:py-3">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-xl font-bold tabular-nums text-heading sm:text-2xl">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-muted">{sub}</p> : null}
    </div>
  );
}

function FieldBlock({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-surface-muted/40 px-3 py-2.5">
      <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className={`mt-0.5 text-sm font-medium text-heading ${mono ? "font-mono text-xs" : ""}`}>
        {value === "—" ? <span className="text-muted">—</span> : value}
      </p>
    </div>
  );
}

function passTone(isPass: boolean | null) {
  if (isPass === true) return "bg-emerald-500/12 text-emerald-900";
  if (isPass === false) return "bg-red-500/12 text-red-900";
  return "bg-surface-muted text-muted";
}

export function StudentDetailPanel({
  detail,
  loading,
  onClose,
  embedded,
  allowEdit,
  onSaveEdit,
  saveEditState,
  allowEnrollmentEdit,
  enrollmentClasses,
  enrollmentSessions,
  onSaveEnrollment,
  enrollmentSaveState,
}: {
  detail: StudentDetail | null;
  loading?: boolean;
  onClose?: () => void;
  /** Mobile sheet — hide duplicate close chrome, flatter shell */
  embedded?: boolean;
  allowEdit?: boolean;
  onSaveEdit?: (payload: ReturnType<typeof studentEditFormToPayload>) => Promise<boolean> | boolean;
  saveEditState?: { submitting?: boolean; error?: string | null; message?: string | null };
  allowEnrollmentEdit?: boolean;
  enrollmentClasses?: ClassOption[];
  enrollmentSessions?: SessionOption[];
  onSaveEnrollment?: (values: EnrollmentFormValues) => Promise<boolean> | boolean;
  enrollmentSaveState?: { submitting?: boolean; error?: string | null; message?: string | null };
}) {
  const [editing, setEditing] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState(false);
  const [tab, setTab] = useState<DetailTab>("overview");

  const shellClass = embedded
    ? "min-w-0 space-y-4"
    : "card-panel form-shell space-y-5 border-brand/20 ring-1 ring-brand/10";

  if (loading) {
    return (
      <div className={embedded ? "space-y-3 py-1" : "card-panel form-shell"} aria-busy="true">
        <div className="h-28 animate-pulse rounded-2xl bg-surface-muted" />
        <div className="grid gap-2 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-surface-muted" />
          ))}
        </div>
        <p className="text-sm text-muted">Loading student record…</p>
      </div>
    );
  }
  if (!detail) return null;

  const p = detail.profile;
  const en = detail.activeEnrollment;
  const inFormMode = editing || editingEnrollment;

  const slotsByDay = DAY_ORDER.map((day) => ({
    day,
    items: detail.timetable.slots.filter((s) => s.day === day),
  })).filter((g) => g.items.length > 0);

  const submittedAssignments = detail.assignments.filter((a) => a.submissions[0]?.status === "SUBMITTED").length;
  const attendancePct =
    detail.attendance.percentage != null ? `${Math.round(detail.attendance.percentage)}%` : "—";

  const tabOptions: readonly [DetailTab, string][] = [
    ["overview", "Overview"],
    ["attendance", `Attendance (${detail.attendance.records.length})`],
    ["academics", `Academics (${detail.examMarks.length})`],
    ["timetable", "Timetable"],
    ["assignments", `Work (${detail.assignments.length})`],
  ];

  const classSubtitle = en
    ? `Class ${en.class.name}-${en.section.name} · Roll ${en.rollNumber} · ${en.academicSession.name}`
    : "No active enrollment";

  return (
    <div className={shellClass}>
      <div className="relative">
        <MobilePageHero
          kicker="Student record"
          title={displayName(p)}
          subtitle={`${p.studentId} · Adm ${p.admissionNumber}`}
        >
          <p className="text-sm text-white/90">{classSubtitle}</p>
          {p.user?.email && <p className="mt-1 truncate text-xs text-white/75">{p.user.email}</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            {allowEnrollmentEdit && onSaveEnrollment && !editingEnrollment && enrollmentClasses?.length && (
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setEditingEnrollment(true);
                }}
                className="rounded-lg bg-white/15 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/25"
              >
                Change class
              </button>
            )}
            {allowEdit && onSaveEdit && !editing && (
              <button
                type="button"
                onClick={() => {
                  setEditingEnrollment(false);
                  setEditing(true);
                }}
                className="rounded-lg bg-brand-gold px-3 py-1.5 text-sm font-semibold text-brand-dark shadow-sm hover:brightness-105"
              >
                Edit profile
              </button>
            )}
            {onClose && !embedded && (
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary text-sm !border-white/30 !bg-white/10 !text-white"
              >
                Close
              </button>
            )}
          </div>
        </MobilePageHero>
        <span
          className="pointer-events-none absolute right-4 top-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-lg font-bold text-white backdrop-blur-sm"
          aria-hidden
        >
          {initials(p)}
        </span>
      </div>

      {!inFormMode && (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Attendance" value={attendancePct} sub="Session to date" />
          <StatCard label="Exam entries" value={detail.examMarks.length} />
          <StatCard
            label="Assignments"
            value={detail.assignments.length}
            sub={submittedAssignments > 0 ? `${submittedAssignments} submitted` : undefined}
          />
          <StatCard
            label="Portal"
            value={p.user?.status ? fmtEnum(p.user.status) : "—"}
            sub={p.admissionType ? fmtEnum(p.admissionType) : undefined}
          />
        </div>
      )}

      <PanelAlerts
        error={saveEditState?.error ?? enrollmentSaveState?.error}
        message={saveEditState?.message ?? enrollmentSaveState?.message}
      />

      {editingEnrollment && allowEnrollmentEdit && onSaveEnrollment && enrollmentClasses && enrollmentSessions && (
        <section className="card-panel form-shell space-y-3">
          <p className="form-section-title">Change class assignment</p>
          <StudentEnrollmentForm
            activeEnrollment={detail.activeEnrollment}
            classes={enrollmentClasses}
            sessions={enrollmentSessions}
            submitting={enrollmentSaveState?.submitting}
            onCancel={() => setEditingEnrollment(false)}
            onSubmit={async (values) => {
              const ok = await onSaveEnrollment(values);
              if (ok) setEditingEnrollment(false);
            }}
          />
        </section>
      )}

      {editing && allowEdit && onSaveEdit && (
        <section className="card-panel form-shell space-y-3">
          <p className="form-section-title">Edit student profile</p>
          <StudentEditForm
            profile={p}
            submitting={saveEditState?.submitting}
            onCancel={() => setEditing(false)}
            onSubmit={async (payload) => {
              const ok = await onSaveEdit(payload);
              if (ok) setEditing(false);
            }}
          />
        </section>
      )}

      {!inFormMode && (
        <>
          <nav
            className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-surface p-1 shadow-[var(--shadow-card)] scrollbar-none"
            aria-label="Student record sections"
          >
            {tabOptions.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition-colors sm:flex-1 sm:py-2.5 sm:text-sm ${
                  tab === id
                    ? "bg-brand text-white shadow-sm"
                    : "text-muted hover:bg-surface-muted hover:text-heading"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {tab === "overview" && (
            <div className="space-y-4">
              <section className="card-panel form-shell space-y-3">
                <p className="form-section-title">Personal</p>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  <FieldBlock label="Gender" value={fmtEnum(p.gender)} />
                  <FieldBlock label="Date of birth" value={fmtDate(p.dateOfBirth)} />
                  <FieldBlock label="Blood group" value={p.bloodGroup ?? "—"} />
                  <FieldBlock label="Phone" value={p.phone ?? "—"} />
                  <FieldBlock label="Admission type" value={fmtEnum(p.admissionType)} />
                  <FieldBlock label="Login email" value={p.user?.email ?? "—"} mono />
                </div>
              </section>

              <section className="card-panel form-shell space-y-3">
                <p className="form-section-title">Family & guardian</p>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  <FieldBlock label="Father" value={p.fatherName ?? "—"} />
                  <FieldBlock label="Mother" value={p.motherName ?? "—"} />
                  <FieldBlock label="Guardian" value={p.guardianName ?? "—"} />
                  <FieldBlock label="Guardian phone" value={p.guardianPhone ?? "—"} />
                  <FieldBlock label="Guardian email" value={p.guardianEmail ?? "—"} />
                </div>
              </section>

              <section className="card-panel form-shell space-y-3">
                <p className="form-section-title">Address</p>
                <p className="text-sm font-medium text-heading">
                  {[p.address, p.city, p.state].filter(Boolean).join(", ") || "—"}
                </p>
              </section>

              {p.enrollments.length > 1 && (
                <section className="card-panel form-shell space-y-3">
                  <p className="form-section-title">Enrollment history</p>
                  <ul className="space-y-2">
                    {p.enrollments.map((e, i) => (
                      <li
                        key={i}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-surface-muted/30 px-3 py-2.5 text-sm"
                      >
                        <span className="font-medium text-heading">
                          {e.class.name}-{e.section.name}
                        </span>
                        <span className="text-xs text-muted">
                          {e.academicSession.name} · Roll {e.rollNumber}
                          {e.isActive ? (
                            <span className="ml-2 rounded-full bg-brand/10 px-2 py-0.5 font-semibold text-brand">
                              Current
                            </span>
                          ) : null}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}

          {tab === "attendance" && (
            <section className="card-panel form-shell space-y-3">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <p className="form-section-title">Recent attendance</p>
                  <p className="text-sm text-muted">
                    {detail.attendance.percentage != null
                      ? `${Math.round(detail.attendance.percentage)}% overall · last ${detail.attendance.records.length} days`
                      : "Daily status from class attendance"}
                  </p>
                </div>
              </div>
              {detail.attendance.records.length === 0 ? (
                <p className="empty-state !py-10">No attendance records yet.</p>
              ) : (
                <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
                  {detail.attendance.records.slice(0, 30).map((r, i) => (
                    <li key={i} className="flex items-center justify-between gap-3 px-3 py-2.5 sm:px-4">
                      <span className="text-sm font-medium text-heading">{fmtDate(r.date)}</span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide ${statusTone(r.status)}`}
                      >
                        {fmtEnum(r.status)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {tab === "academics" && (
            <section className="card-panel form-shell space-y-3">
              <p className="form-section-title">Exam marks</p>
              {detail.examMarks.length === 0 ? (
                <p className="empty-state !py-10">No marks recorded yet.</p>
              ) : (
                <ul className="space-y-2">
                  {detail.examMarks.map((m, i) => (
                    <li
                      key={i}
                      className="rounded-xl border border-border bg-surface px-3 py-3 shadow-[var(--shadow-card)] sm:px-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-heading">{m.examSubject.subject.name}</p>
                          <p className="text-xs text-muted">{m.examSubject.examination.name}</p>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase ${passTone(m.isPass)}`}
                        >
                          {m.isPass ? "Pass" : m.isPass === false ? "Fail" : "Pending"}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm">
                        <span>
                          <span className="text-muted">Marks </span>
                          <span className="font-semibold tabular-nums text-heading">
                            {String(m.marksObtained ?? "—")}
                          </span>
                          <span className="text-muted"> / {String(m.examSubject.maxMarks ?? "—")}</span>
                        </span>
                        {m.grade && (
                          <span>
                            <span className="text-muted">Grade </span>
                            <span className="font-semibold text-heading">{m.grade}</span>
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {tab === "timetable" && (
            <section className="card-panel form-shell space-y-3">
              <p className="form-section-title">Weekly schedule</p>
              {slotsByDay.length === 0 ? (
                <p className="empty-state !py-10">No published timetable for this class.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {slotsByDay.map((g) => (
                    <div
                      key={g.day}
                      className="rounded-xl border border-border bg-gradient-to-br from-brand/[0.04] to-transparent p-3"
                    >
                      <p className="text-xs font-bold uppercase tracking-wide text-brand">{fmtDay(g.day)}</p>
                      <ul className="mt-2 space-y-2">
                        {g.items.map((s, i) => (
                          <li key={i} className="rounded-lg border border-border/80 bg-surface px-2.5 py-2 text-sm">
                            <span className="font-semibold text-heading">{s.period.name}</span>
                            <span className="text-muted"> · {s.subject.name}</span>
                            {s.teacher && (
                              <span className="mt-0.5 block text-xs text-muted">
                                {s.teacher.firstName} {s.teacher.lastName}
                                {s.classroom ? ` · ${s.classroom.name}` : ""}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {tab === "assignments" && (
            <section className="card-panel form-shell space-y-3">
              <p className="form-section-title">Assignments</p>
              {detail.assignments.length === 0 ? (
                <p className="empty-state !py-10">No assignments.</p>
              ) : (
                <ul className="space-y-2">
                  {detail.assignments.map((a, i) => {
                    const sub = a.submissions[0];
                    const status = sub?.status ?? "PENDING";
                    return (
                      <li
                        key={i}
                        className="rounded-xl border border-border bg-surface px-3 py-3 shadow-[var(--shadow-card)] sm:px-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-semibold text-heading">{a.title}</p>
                            <p className="text-xs text-muted">
                              {a.subject.name} · Due {fmtDate(a.dueAt)}
                            </p>
                            <p className="text-xs text-muted">
                              {a.teacher.firstName} {a.teacher.lastName}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase ${statusTone(status)}`}
                          >
                            {fmtEnum(status)}
                          </span>
                        </div>
                        {(sub?.marks != null || sub?.feedback) && (
                          <div className="mt-2 border-t border-border pt-2 text-sm">
                            {sub.marks != null && (
                              <p>
                                <span className="text-muted">Marks </span>
                                <span className="font-semibold tabular-nums">{String(sub.marks)}</span>
                              </p>
                            )}
                            {sub.feedback && (
                              <p className="mt-1 text-muted">
                                <span className="font-medium text-heading">Feedback </span>
                                {sub.feedback}
                              </p>
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}
