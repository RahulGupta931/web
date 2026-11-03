"use client";

import { FormEvent, useMemo } from "react";
import { MobileEmptyState, MobilePageHero, statusTone } from "@/components/mobile/mobile-primitives";
import { examMarksSummary } from "@/lib/exam-marks-summary";

export type TeacherExamRow = {
  id: string;
  name: string;
  status: string;
  subjects: {
    id: string;
    subjectId: string;
    subject: { name: string };
    maxMarks: unknown;
    passingMarks: unknown;
  }[];
};

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  studentId: string;
};

type SectionOption = {
  sectionId: string;
  label: string;
};

function markStatus(
  raw: string | undefined,
  maxMarks: number | null,
  passingMarks: number | null
): "empty" | "pass" | "fail" | "invalid" {
  if (raw === undefined || raw === "") return "empty";
  const n = Number(raw);
  if (!Number.isFinite(n)) return "invalid";
  const threshold =
    passingMarks != null && Number.isFinite(passingMarks)
      ? passingMarks
      : maxMarks != null && Number.isFinite(maxMarks)
        ? maxMarks * 0.33
        : null;
  if (threshold == null) return "empty";
  return n >= threshold ? "pass" : "fail";
}

function MarkStatusPill({ status }: { status: ReturnType<typeof markStatus> }) {
  if (status === "empty") return <span className="text-xs text-muted">—</span>;
  if (status === "invalid") return <span className="text-xs text-red-600">Check</span>;
  if (status === "pass") {
    return (
      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[0.65rem] font-semibold text-emerald-800">
        Pass
      </span>
    );
  }
  return (
    <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[0.65rem] font-semibold text-red-800">
      Below pass
    </span>
  );
}

export function TeacherSubjectMarksWorkspace({
  layout,
  embedded = false,
  exams,
  examId,
  onExamChange,
  examSubjectId,
  onSubjectChange,
  sectionId,
  onSectionChange,
  sections,
  students,
  marks,
  onMarkChange,
  loadingStudents,
  submitting,
  onSubmit,
}: {
  layout: "desktop" | "mobile";
  /** When true (e.g. inside PanelMobileShell), skip the inner gradient hero. */
  embedded?: boolean;
  exams: TeacherExamRow[];
  examId: string;
  onExamChange: (id: string) => void;
  examSubjectId: string;
  onSubjectChange: (id: string) => void;
  sectionId: string;
  onSectionChange: (id: string) => void;
  sections: SectionOption[];
  students: Student[];
  marks: Record<string, string>;
  onMarkChange: (id: string, value: string) => void;
  loadingStudents: boolean;
  submitting: boolean;
  onSubmit: (e: FormEvent) => void;
}) {
  const selectedExam = exams.find((e) => e.id === examId);
  const subjects = selectedExam?.subjects ?? [];
  const selectedSubject = subjects.find((s) => s.id === examSubjectId);
  const maxMarks =
    selectedSubject?.maxMarks != null ? Number(selectedSubject.maxMarks) : null;
  const passingMarks =
    selectedSubject?.passingMarks != null ? Number(selectedSubject.passingMarks) : null;

  const markStats = useMemo(
    () =>
      examMarksSummary({
        studentIds: students.map((s) => s.id),
        marks,
        maxMarks,
        passingMarks,
      }),
    [students, marks, maxMarks, passingMarks]
  );

  const progressPct =
    markStats.total > 0 ? Math.round((markStats.entered / markStats.total) * 100) : 0;

  const contextTitle = selectedExam
    ? `${selectedExam.name}${selectedSubject ? ` · ${selectedSubject.subject.name}` : ""}`
    : "Examinations";

  const sectionLabel = sections.find((s) => s.sectionId === sectionId)?.label;

  if (exams.length === 0) {
    return layout === "mobile" ? (
      <div className="space-y-4">
        <MobilePageHero
          kicker="Teacher"
          title="Examinations"
          subtitle="No papers assigned yet — check back when the principal publishes an exam."
        />
        <MobileEmptyState message="No examinations available for your subjects." />
      </div>
    ) : (
      <div className="card-panel rounded-2xl border border-dashed border-border px-6 py-12 text-center">
        <p className="text-lg font-semibold text-heading">No examinations yet</p>
        <p className="mt-2 text-sm text-muted max-w-md mx-auto">
          When the school publishes an exam that includes your subject, it will appear here for mark entry.
        </p>
      </div>
    );
  }

  const examPicker = (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">Choose exam</p>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none">
        {exams.map((ex) => {
          const active = ex.id === examId;
          return (
            <button
              key={ex.id}
              type="button"
              onClick={() => onExamChange(ex.id)}
              className={`shrink-0 min-w-[9.5rem] max-w-[11rem] rounded-2xl border px-3 py-2.5 text-left transition active:scale-[0.98] ${
                active
                  ? "border-brand bg-brand/5 shadow-[var(--shadow-card)] ring-2 ring-brand/20"
                  : "border-border bg-surface hover:border-brand/35"
              }`}
            >
              <p className="truncate text-sm font-semibold text-heading">{ex.name}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <span
                  className={`rounded-full px-2 py-0.5 text-[0.6rem] font-semibold uppercase ${statusTone(ex.status)}`}
                >
                  {ex.status}
                </span>
                <span className="text-[0.65rem] text-muted">{ex.subjects.length} paper(s)</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const filters = (
    <div className="grid gap-3 sm:grid-cols-3">
      <label className="block text-sm">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Paper</span>
        <select
          className="input-field mt-1"
          value={examSubjectId}
          onChange={(e) => onSubjectChange(e.target.value)}
        >
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.subject.name}</option>
          ))}
        </select>
      </label>
      <label className="block text-sm sm:col-span-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Class / section</span>
        <select
          className="input-field mt-1"
          value={sectionId}
          onChange={(e) => onSectionChange(e.target.value)}
          disabled={sections.length === 0}
        >
          {sections.length === 0 ? (
            <option value="">No class assigned for this subject</option>
          ) : (
            sections.map((sec) => (
              <option key={sec.sectionId} value={sec.sectionId}>{sec.label}</option>
            ))
          )}
        </select>
      </label>
    </div>
  );

  const statsBlock = students.length > 0 && (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Entry progress</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-brand">
            {markStats.entered}
            <span className="text-base font-medium text-muted"> / {markStats.total}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted">Class average</p>
          <p className="text-lg font-semibold tabular-nums text-heading">{markStats.average}</p>
        </div>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand to-brand-light transition-[width] duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-muted">
        <span>
          <strong className="text-foreground">{markStats.pending}</strong> pending
        </span>
        {markStats.passed + markStats.failed > 0 && (
          <>
            <span>
              <strong className="text-emerald-700">{markStats.passed}</strong> at/above pass
            </span>
            <span>
              <strong className="text-red-700">{markStats.failed}</strong> below pass
            </span>
          </>
        )}
        {maxMarks != null && Number.isFinite(maxMarks) && (
          <span className="ml-auto">
            Max <strong className="text-foreground">{maxMarks}</strong>
            {passingMarks != null && (
              <> · Pass <strong className="text-foreground">{passingMarks}</strong></>
            )}
          </span>
        )}
      </div>
    </div>
  );

  const rosterEmpty = loadingStudents
    ? <p className="text-sm text-muted py-6 text-center">Loading students…</p>
    : students.length === 0
      ? layout === "mobile"
        ? (
          <MobileEmptyState
            message={
              sections.length === 0
                ? "You are not assigned to teach this subject in any class."
                : "No students in this section."
            }
          />
        )
        : (
          <p className="text-sm text-muted py-8 text-center">
            {sections.length === 0
              ? "You are not assigned to teach this subject in any class."
              : "No students in this class section."}
          </p>
        )
      : null;

  const desktopTable = students.length > 0 && layout === "desktop" && (
    <div className="overflow-hidden rounded-2xl border border-border">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-[var(--surface-muted)] text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3 font-semibold w-12">#</th>
            <th className="px-4 py-3 font-semibold">Student</th>
            <th className="px-4 py-3 font-semibold w-28">Marks</th>
            <th className="px-4 py-3 font-semibold w-24">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-surface">
          {students.map((s, i) => {
            const st = markStatus(marks[s.id], maxMarks, passingMarks);
            return (
              <tr key={s.id} className="hover:bg-brand/[0.03]">
                <td className="px-4 py-2.5 tabular-nums text-muted">{i + 1}</td>
                <td className="px-4 py-2.5">
                  <p className="font-medium text-foreground">{s.firstName} {s.lastName}</p>
                  <p className="text-xs text-muted">{s.studentId}</p>
                </td>
                <td className="px-4 py-2.5">
                  <input
                    type="number"
                    min={0}
                    max={maxMarks ?? undefined}
                    aria-label={`Marks for ${s.firstName} ${s.lastName}`}
                    className="input-field !mt-0 !w-24 tabular-nums text-center font-semibold"
                    placeholder="—"
                    value={marks[s.id] ?? ""}
                    onChange={(e) => onMarkChange(s.id, e.target.value)}
                  />
                </td>
                <td className="px-4 py-2.5">
                  <MarkStatusPill status={st} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const mobileList = students.length > 0 && layout === "mobile" && (
    <ul className="space-y-2 pb-24">
      {students.map((s) => {
        const st = markStatus(marks[s.id], maxMarks, passingMarks);
        return (
          <li
            key={s.id}
            className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-3 py-2.5 shadow-sm"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground leading-snug">
                {s.firstName} {s.lastName}
              </p>
              <p className="truncate text-xs text-muted">{s.studentId}</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <input
                type="number"
                min={0}
                max={maxMarks ?? undefined}
                inputMode="decimal"
                aria-label={`Marks for ${s.firstName} ${s.lastName}`}
                className="input-field !mt-0 !w-[4.5rem] !py-2 text-center text-sm font-bold tabular-nums"
                placeholder="—"
                value={marks[s.id] ?? ""}
                onChange={(e) => onMarkChange(s.id, e.target.value)}
              />
              <MarkStatusPill status={st} />
            </div>
          </li>
        );
      })}
    </ul>
  );

  const saveButton = (
    <button
      type="submit"
      disabled={submitting || students.length === 0 || !sectionId}
      className={`btn-primary disabled:opacity-50 ${
        layout === "mobile"
          ? "w-full !rounded-2xl !py-3.5 shadow-lg"
          : "text-sm"
      }`}
    >
      {submitting ? "Saving…" : "Save marks"}
    </button>
  );

  const formInner = (
    <>
      {examPicker}
      <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border pb-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Mark entry</p>
            <h3 className="text-base font-semibold text-heading">{contextTitle}</h3>
            {sectionLabel && <p className="text-sm text-muted">{sectionLabel}</p>}
          </div>
          {selectedExam && (
            <span
              className={`rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase ${statusTone(selectedExam.status)}`}
            >
              {selectedExam.status}
            </span>
          )}
        </div>
        {filters}
      </div>
      {statsBlock}
      {rosterEmpty}
      {desktopTable}
      {mobileList}
      {layout === "desktop" && saveButton}
    </>
  );

  if (layout === "mobile") {
    return (
      <div className="space-y-4">
        {!embedded && (
          <MobilePageHero
            kicker="Teacher"
            title="Examinations"
            subtitle={
              sectionLabel
                ? `${contextTitle} — ${sectionLabel}`
                : "Enter marks for your classes and papers."
            }
          />
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          {formInner}
          <div className="fixed inset-x-0 bottom-[5.75rem] z-20 border-t border-border bg-surface/95 px-4 py-3 shadow-[0_-8px_24px_rgb(15_23_42/0.08)] backdrop-blur-md lg:hidden">
            {saveButton}
          </div>
        </form>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {formInner}
    </form>
  );
}
