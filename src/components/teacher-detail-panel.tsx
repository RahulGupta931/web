"use client";

import { useState } from "react";
import { PanelAlerts } from "@/components/panel-alerts";
import { MobilePageHero, statusTone } from "@/components/mobile/mobile-primitives";
import {
  TeacherClassAssignmentForm,
  type ClassOption,
} from "@/components/teacher-class-assignment-form";

export type TeacherDetail = {
  profile: {
    id: string;
    employeeId: string;
    firstName: string;
    middleName: string | null;
    lastName: string;
    phone: string | null;
    alternatePhone: string | null;
    personalEmail: string | null;
    gender: string;
    dateOfBirth: string | null;
    bloodGroup: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    joinDate: string | null;
    designation: string | null;
    department: string | null;
    employmentType: string;
    qualification: string | null;
    specialization: string | null;
    experienceYears: number | null;
    emergencyContactName: string | null;
    emergencyContactPhone: string | null;
    emergencyContactRelation: string | null;
    internalNotes: string | null;
    user: { email: string; status: string } | null;
    classAssignments: {
      isClassTeacher: boolean;
      section: { id: string; name: string; class: { name: string } };
    }[];
  };
  uniqueSubjects: string[];
  teachingAssignments: { subject: { name: string }; sectionLabel: string }[];
  attendance: {
    percentage: number | null;
    records: { date: string; status: string; notes: string | null }[];
  };
  leaveRequests: {
    type: string;
    status: string;
    startDate: string;
    endDate: string;
    reason: string | null;
  }[];
  assignments: {
    title: string;
    dueAt: string;
    maxMarks: unknown;
    subject: { name: string };
  }[];
  studyMaterials: {
    title: string;
    classLabel: string | null;
    fileUrl: string | null;
    subject: { name: string };
  }[];
  substitutes: {
    absent: {
      date: string;
      status: string;
      substituteTeacher: { firstName: string; lastName: string } | null;
      slot: {
        day: string;
        period: { name: string };
        subject: { name: string };
        section: { name: string; class: { name: string } };
      };
    }[];
    covering: {
      date: string;
      status: string;
      absentTeacher: { firstName: string; lastName: string };
      slot: {
        day: string;
        period: { name: string };
        subject: { name: string };
        section: { name: string; class: { name: string } };
      };
    }[];
  };
  timetable: {
    slots: {
      day: string;
      period: { name: string; periodNo: number };
      subject: { name: string };
      section: { name: string; class: { name: string } };
      classroom: { name: string } | null;
    }[];
  };
};

type DetailTab = "overview" | "teaching" | "attendance" | "leave" | "schedule" | "resources";

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString();
}

function displayName(p: TeacherDetail["profile"]) {
  return [p.firstName, p.middleName, p.lastName].filter(Boolean).join(" ");
}

function initials(p: TeacherDetail["profile"]) {
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

export function TeacherDetailPanel({
  detail,
  loading,
  onClose,
  embedded,
  assignmentClasses,
  onSaveAssignments,
  assignmentSaveState,
}: {
  detail: TeacherDetail | null;
  loading?: boolean;
  onClose?: () => void;
  /** Mobile bottom sheet — flat layout, no duplicate close chrome */
  embedded?: boolean;
  assignmentClasses?: ClassOption[];
  onSaveAssignments?: (
    assignments: { sectionId: string; isClassTeacher: boolean }[]
  ) => Promise<boolean> | boolean;
  assignmentSaveState?: { submitting?: boolean; error?: string | null; message?: string | null };
}) {
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
        <p className="text-sm text-muted">Loading teacher record…</p>
      </div>
    );
  }
  if (!detail) return null;

  const p = detail.profile;
  const classTeacherLabels = p.classAssignments
    .filter((a) => a.isClassTeacher)
    .map((a) => `${a.section.class.name}-${a.section.name}`);

  const slotsByDay = DAY_ORDER.map((day) => ({
    day,
    items: detail.timetable.slots.filter((s) => s.day === day),
  })).filter((g) => g.items.length > 0);

  const attendancePct =
    detail.attendance.percentage != null ? `${Math.round(detail.attendance.percentage)}%` : "—";

  const pendingLeave = detail.leaveRequests.filter(
    (l) => l.status === "PENDING" || l.status === "SUBMITTED"
  ).length;

  const substituteCount = detail.substitutes.absent.length + detail.substitutes.covering.length;

  const tabOptions: readonly [DetailTab, string][] = [
    ["overview", "Overview"],
    ["teaching", `Teaching (${detail.teachingAssignments.length})`],
    ["attendance", `Attendance (${detail.attendance.records.length})`],
    ["leave", `Leave (${detail.leaveRequests.length})`],
    ["schedule", `Schedule (${detail.timetable.slots.length})`],
    ["resources", `Resources (${detail.assignments.length + detail.studyMaterials.length})`],
  ];

  const roleSubtitle = [p.department, p.designation].filter(Boolean).join(" · ") || "Faculty";

  return (
    <div className={shellClass}>
      <div className="relative">
        <MobilePageHero
          kicker="Teacher record"
          title={displayName(p)}
          subtitle={`${p.employeeId} · ${roleSubtitle}`}
        >
          <p className="text-sm text-white/90">{p.user?.email ?? "No portal email"}</p>
          {classTeacherLabels.length > 0 && (
            <p className="mt-1 text-xs font-semibold text-brand-gold">
              Class teacher · {classTeacherLabels.join(", ")}
            </p>
          )}
          {detail.uniqueSubjects.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {detail.uniqueSubjects.slice(0, 6).map((s) => (
                <span
                  key={s}
                  className="rounded-md bg-white/15 px-2 py-0.5 text-[0.65rem] font-semibold text-white"
                >
                  {s}
                </span>
              ))}
              {detail.uniqueSubjects.length > 6 && (
                <span className="text-[0.65rem] text-white/75">+{detail.uniqueSubjects.length - 6} more</span>
              )}
            </div>
          )}
          {onClose && !embedded && (
            <div className="mt-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary text-sm !border-white/30 !bg-white/10 !text-white"
              >
                Close
              </button>
            </div>
          )}
        </MobilePageHero>
        <span
          className="pointer-events-none absolute right-4 top-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-lg font-bold text-white backdrop-blur-sm"
          aria-hidden
        >
          {initials(p)}
        </span>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Attendance" value={attendancePct} sub="Staff check-in" />
        <StatCard
          label="Sections"
          value={detail.teachingAssignments.length}
          sub={`${detail.uniqueSubjects.length} subject${detail.uniqueSubjects.length === 1 ? "" : "s"}`}
        />
        <StatCard
          label="Leave"
          value={detail.leaveRequests.length}
          sub={pendingLeave > 0 ? `${pendingLeave} open` : undefined}
        />
        <StatCard
          label="Portal"
          value={p.user?.status ? fmtEnum(p.user.status) : "—"}
          sub={fmtEnum(p.employmentType)}
        />
      </div>

      <PanelAlerts error={assignmentSaveState?.error} message={assignmentSaveState?.message} />

      <nav
        className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-surface p-1 shadow-[var(--shadow-card)] scrollbar-none"
        aria-label="Teacher record sections"
      >
        {tabOptions.map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition-colors sm:flex-1 sm:py-2.5 sm:text-sm ${
              tab === id ? "bg-brand text-white shadow-sm" : "text-muted hover:bg-surface-muted hover:text-heading"
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
              <FieldBlock label="Alternate phone" value={p.alternatePhone ?? "—"} />
              <FieldBlock label="Personal email" value={p.personalEmail ?? "—"} />
            </div>
          </section>

          <section className="card-panel form-shell space-y-3">
            <p className="form-section-title">Employment</p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <FieldBlock label="Join date" value={fmtDate(p.joinDate)} />
              <FieldBlock label="Department" value={p.department ?? "—"} />
              <FieldBlock label="Designation" value={p.designation ?? "—"} />
              <FieldBlock label="Employment type" value={fmtEnum(p.employmentType)} />
              <FieldBlock label="Qualification" value={p.qualification ?? "—"} />
              <FieldBlock label="Specialization" value={p.specialization ?? "—"} />
              <FieldBlock
                label="Experience"
                value={p.experienceYears != null ? `${p.experienceYears} years` : "—"}
              />
              <FieldBlock label="Login email" value={p.user?.email ?? "—"} mono />
            </div>
          </section>

          <section className="card-panel form-shell space-y-3">
            <p className="form-section-title">Address</p>
            <p className="text-sm font-medium text-heading">
              {[p.address, p.city, p.state, p.postalCode].filter(Boolean).join(", ") || "—"}
            </p>
          </section>

          <section className="card-panel form-shell space-y-3">
            <p className="form-section-title">Emergency contact</p>
            {p.emergencyContactName ? (
              <div className="grid gap-2 sm:grid-cols-3">
                <FieldBlock label="Name" value={p.emergencyContactName} />
                <FieldBlock label="Relation" value={p.emergencyContactRelation ?? "—"} />
                <FieldBlock label="Phone" value={p.emergencyContactPhone ?? "—"} />
              </div>
            ) : (
              <p className="text-sm text-muted">—</p>
            )}
          </section>

          {p.internalNotes && (
            <section className="card-panel form-shell space-y-3">
              <p className="form-section-title">Internal notes</p>
              <p className="whitespace-pre-wrap text-sm text-heading">{p.internalNotes}</p>
            </section>
          )}

          {p.classAssignments.length > 0 && (
            <section className="card-panel form-shell space-y-3">
              <p className="form-section-title">Section assignments</p>
              <ul className="flex flex-wrap gap-2">
                {p.classAssignments.map((a, i) => (
                  <li
                    key={i}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      a.isClassTeacher
                        ? "bg-brand text-white"
                        : "bg-brand/10 text-brand ring-1 ring-brand/20"
                    }`}
                  >
                    {a.section.class.name}-{a.section.name}
                    {a.isClassTeacher ? " · CT" : ""}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      {tab === "teaching" && (
        <div className="space-y-4">
          {assignmentClasses && onSaveAssignments && (
            <section className="card-panel form-shell space-y-3">
              <p className="form-section-title">Assigned classes</p>
              <p className="text-sm text-muted">
                Mark sections this teacher is linked to and who is class teacher.
              </p>
              <TeacherClassAssignmentForm
                classes={assignmentClasses}
                current={p.classAssignments}
                submitting={assignmentSaveState?.submitting}
                onSubmit={async (assignments) => {
                  await onSaveAssignments(assignments);
                }}
              />
            </section>
          )}

          <section className="card-panel form-shell space-y-3">
            <p className="form-section-title">Teaching load</p>
            {detail.teachingAssignments.length === 0 ? (
              <p className="empty-state !py-10">No section–subject assignments from timetable.</p>
            ) : (
              <ul className="space-y-2">
                {detail.teachingAssignments.slice(0, 40).map((a, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-3 py-2.5 sm:px-4"
                  >
                    <span className="font-medium text-heading">{a.sectionLabel}</span>
                    <span className="rounded-md bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
                      {a.subject.name}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {detail.teachingAssignments.length > 40 && (
              <p className="text-xs text-muted">Showing 40 of {detail.teachingAssignments.length} rows.</p>
            )}
          </section>
        </div>
      )}

      {tab === "attendance" && (
        <section className="card-panel form-shell space-y-3">
          <p className="form-section-title">Recent attendance</p>
          <p className="text-sm text-muted">
            {detail.attendance.percentage != null
              ? `${Math.round(detail.attendance.percentage)}% overall · last ${detail.attendance.records.length} days`
              : "Staff portal check-in and attendance marks"}
          </p>
          {detail.attendance.records.length === 0 ? (
            <p className="empty-state !py-10">No attendance marked yet.</p>
          ) : (
            <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
              {detail.attendance.records.slice(0, 30).map((r, i) => (
                <li key={i} className="px-3 py-2.5 sm:px-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-medium text-heading">{fmtDate(r.date)}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide ${statusTone(r.status)}`}
                    >
                      {fmtEnum(r.status)}
                    </span>
                  </div>
                  {r.notes && <p className="mt-1 text-xs text-muted">{r.notes}</p>}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {tab === "leave" && (
        <section className="card-panel form-shell space-y-3">
          <p className="form-section-title">Leave requests</p>
          {detail.leaveRequests.length === 0 ? (
            <p className="empty-state !py-10">No leave requests.</p>
          ) : (
            <ul className="space-y-2">
              {detail.leaveRequests.map((l, i) => (
                <li
                  key={i}
                  className="rounded-xl border border-border bg-surface px-3 py-3 shadow-[var(--shadow-card)] sm:px-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-heading">{fmtEnum(l.type)}</p>
                      <p className="text-xs text-muted">
                        {fmtDate(l.startDate)} → {fmtDate(l.endDate)}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase ${statusTone(l.status)}`}
                    >
                      {fmtEnum(l.status)}
                    </span>
                  </div>
                  {l.reason && <p className="mt-2 text-sm text-muted">{l.reason}</p>}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {tab === "schedule" && (
        <div className="space-y-4">
          <section className="card-panel form-shell space-y-3">
            <p className="form-section-title">Weekly timetable</p>
            {slotsByDay.length === 0 ? (
              <p className="empty-state !py-10">No published timetable slots for this teacher.</p>
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
                          <span className="mt-0.5 block text-xs text-muted">
                            Class {s.section.class.name}-{s.section.name}
                            {s.classroom ? ` · ${s.classroom.name}` : ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="card-panel form-shell space-y-3">
            <p className="form-section-title">Substitutes ({substituteCount})</p>
            {substituteCount === 0 ? (
              <p className="empty-state !py-8">No substitute assignments.</p>
            ) : (
              <div className="space-y-4">
                {detail.substitutes.absent.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">When absent</p>
                    <ul className="space-y-2">
                      {detail.substitutes.absent.map((s, i) => (
                        <li
                          key={i}
                          className="rounded-xl border border-border bg-surface-muted/30 px-3 py-2.5 text-sm"
                        >
                          <div className="flex flex-wrap justify-between gap-2">
                            <span className="font-medium text-heading">{fmtDate(s.date)}</span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase ${statusTone(s.status)}`}
                            >
                              {fmtEnum(s.status)}
                            </span>
                          </div>
                          <p className="mt-1 text-muted">
                            {s.slot.period.name} · {s.slot.subject.name} · {s.slot.section.class.name}-
                            {s.slot.section.name}
                          </p>
                          <p className="text-xs text-heading">
                            Covered by{" "}
                            {s.substituteTeacher
                              ? `${s.substituteTeacher.firstName} ${s.substituteTeacher.lastName}`
                              : "—"}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {detail.substitutes.covering.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Covering for others</p>
                    <ul className="space-y-2">
                      {detail.substitutes.covering.map((s, i) => (
                        <li
                          key={i}
                          className="rounded-xl border border-border bg-surface-muted/30 px-3 py-2.5 text-sm"
                        >
                          <div className="flex flex-wrap justify-between gap-2">
                            <span className="font-medium text-heading">{fmtDate(s.date)}</span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase ${statusTone(s.status)}`}
                            >
                              {fmtEnum(s.status)}
                            </span>
                          </div>
                          <p className="mt-1 text-muted">
                            {s.slot.period.name} · {s.slot.subject.name} · {s.slot.section.class.name}-
                            {s.slot.section.name}
                          </p>
                          <p className="text-xs text-heading">
                            For {s.absentTeacher.firstName} {s.absentTeacher.lastName}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      )}

      {tab === "resources" && (
        <div className="space-y-4">
          <section className="card-panel form-shell space-y-3">
            <p className="form-section-title">Assignments created</p>
            {detail.assignments.length === 0 ? (
              <p className="empty-state !py-8">No assignments posted.</p>
            ) : (
              <ul className="space-y-2">
                {detail.assignments.map((a, i) => (
                  <li
                    key={i}
                    className="rounded-xl border border-border bg-surface px-3 py-3 shadow-[var(--shadow-card)] sm:px-4"
                  >
                    <p className="font-semibold text-heading">{a.title}</p>
                    <p className="text-xs text-muted">
                      {a.subject.name} · Due {fmtDate(a.dueAt)}
                      {a.maxMarks != null ? ` · Max ${String(a.maxMarks)}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card-panel form-shell space-y-3">
            <p className="form-section-title">Study materials</p>
            {detail.studyMaterials.length === 0 ? (
              <p className="empty-state !py-8">No study materials uploaded.</p>
            ) : (
              <ul className="space-y-2">
                {detail.studyMaterials.map((m, i) => (
                  <li
                    key={i}
                    className="rounded-xl border border-border bg-surface px-3 py-3 shadow-[var(--shadow-card)] sm:px-4"
                  >
                    <p className="font-semibold text-heading">{m.title}</p>
                    <p className="text-xs text-muted">
                      {m.subject.name}
                      {m.classLabel ? ` · ${m.classLabel}` : ""}
                    </p>
                    {m.fileUrl && (
                      <a
                        href={m.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-sm font-medium text-brand hover:underline"
                      >
                        Open file
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
