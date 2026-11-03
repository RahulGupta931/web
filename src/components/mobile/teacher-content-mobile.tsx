"use client";

import type { FormEvent, ReactNode } from "react";
import { PanelListPageMobile } from "@/components/mobile/panel-list-page-mobile";
import { PanelAlerts } from "@/components/panel-alerts";
import { PanelMobileShell } from "@/components/panel/panel-mobile-shell";
import { MobileEmptyState } from "@/components/mobile/mobile-primitives";
import { resolveApiAssetUrl } from "@/lib/api";

export function TeacherMaterialsListMobile({
  rows,
}: {
  rows: { title: string; subject: { name: string }; classLabel: string | null }[];
}) {
  return (
    <PanelListPageMobile
      role="teacher"
      kicker="Teacher"
      title="Study materials"
      subtitle="Files you have shared with classes."
      showCalendar={false}
      items={rows.map((m) => ({
        title: m.title,
        subtitle: m.subject.name,
        meta: m.classLabel ?? undefined,
      }))}
      emptyMessage="No uploads yet."
    />
  );
}

export function TeacherMaterialsMobile({
  rows,
  error,
  message,
  subjects,
  subjectId,
  onSubjectId,
  title,
  onTitle,
  fileUrl,
  onFileUrl,
  classLabel,
  onClassLabel,
  submitting,
  onSubmit,
}: {
  rows: { title: string; subject: { name: string }; classLabel: string | null }[];
  error: string | null;
  message: string | null;
  subjects: { subjectId: string; name: string }[];
  subjectId: string;
  onSubjectId: (id: string) => void;
  title: string;
  onTitle: (t: string) => void;
  fileUrl: string;
  onFileUrl: (u: string) => void;
  classLabel: string;
  onClassLabel: (l: string) => void;
  submitting: boolean;
  onSubmit: (e: FormEvent) => void;
}) {
  return (
    <PanelMobileShell
      role="teacher"
      kicker="Teacher"
      title="Study materials"
      subtitle="Upload and manage class resources."
      showCalendar={false}
    >
      <PanelAlerts error={error} message={message} />
      <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-border bg-surface p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">New upload</p>
        <select className="input-field" value={subjectId} onChange={(e) => onSubjectId(e.target.value)} required>
          {subjects.map((s) => (
            <option key={s.subjectId} value={s.subjectId}>{s.name}</option>
          ))}
        </select>
        <input className="input-field" placeholder="Title" value={title} onChange={(e) => onTitle(e.target.value)} required />
        <input className="input-field" type="url" placeholder="File URL" value={fileUrl} onChange={(e) => onFileUrl(e.target.value)} required />
        <input className="input-field" placeholder="Class label (optional)" value={classLabel} onChange={(e) => onClassLabel(e.target.value)} />
        <button type="submit" disabled={submitting || !subjectId} className="w-full rounded-xl bg-brand py-2.5 text-sm font-semibold text-white disabled:opacity-50">
          {submitting ? "Adding…" : "Add material"}
        </button>
      </form>
      {rows.length === 0 ? (
        <MobileEmptyState message="No uploads yet." />
      ) : (
        <ul className="space-y-2">
          {rows.map((m, i) => (
            <li key={i} className="rounded-2xl border border-border bg-surface px-4 py-3 shadow-sm">
              <p className="font-semibold text-heading">{m.title}</p>
              <p className="text-sm text-muted">{m.subject.name}{m.classLabel ? ` · ${m.classLabel}` : ""}</p>
            </li>
          ))}
        </ul>
      )}
    </PanelMobileShell>
  );
}

export function SimplePanelMobile({
  role,
  kicker,
  title,
  subtitle,
  showCalendar,
  children,
}: {
  role: "teacher" | "principal";
  kicker: string;
  title: string;
  subtitle?: string;
  showCalendar?: boolean;
  children: ReactNode;
}) {
  return (
    <PanelMobileShell role={role} kicker={kicker} title={title} subtitle={subtitle} showCalendar={showCalendar ?? true}>
      {children}
    </PanelMobileShell>
  );
}

export type TeacherAssignmentRow = {
  id: string;
  title: string;
  dueAt: string;
  subject: { name: string };
  submissions: {
    id: string;
    status: string;
    marks: number | null;
    student: { firstName: string; lastName: string };
  }[];
};

export function TeacherAssignmentsMobile({
  rows,
  error,
  message,
  subjects,
  subjectId,
  onSubjectId,
  title,
  onTitle,
  dueAt,
  onDueAt,
  description,
  onDescription,
  submitting,
  onCreate,
  gradeMarks,
  onGradeMarksChange,
  onSaveGrade,
  gradingId,
}: {
  rows: TeacherAssignmentRow[];
  error: string | null;
  message: string | null;
  subjects: { subjectId: string; name: string }[];
  subjectId: string;
  onSubjectId: (id: string) => void;
  title: string;
  onTitle: (t: string) => void;
  dueAt: string;
  onDueAt: (d: string) => void;
  description: string;
  onDescription: (d: string) => void;
  submitting: boolean;
  onCreate: (e: FormEvent) => void;
  gradeMarks: Record<string, string>;
  onGradeMarksChange: (submissionId: string, value: string) => void;
  onSaveGrade: (submissionId: string, fallbackMarks: number | null) => void;
  gradingId: string | null;
}) {
  const hasSubmissions = rows.some((a) => a.submissions.length > 0);

  return (
    <PanelMobileShell
      role="teacher"
      kicker="Teacher"
      title="Assignments"
      subtitle="Create tasks and grade student work."
      calendarTitle="Due dates & holidays"
    >
      <PanelAlerts error={error} message={message} />

      <form onSubmit={onCreate} className="space-y-3 rounded-2xl border border-border bg-surface p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">New assignment</p>
        <select className="input-field" value={subjectId} onChange={(e) => onSubjectId(e.target.value)} required>
          {subjects.length === 0 && <option value="">No subjects assigned</option>}
          {subjects.map((s) => (
            <option key={s.subjectId} value={s.subjectId}>{s.name}</option>
          ))}
        </select>
        <input className="input-field" placeholder="Title" value={title} onChange={(e) => onTitle(e.target.value)} required />
        <input
          className="input-field"
          type="datetime-local"
          value={dueAt}
          onChange={(e) => onDueAt(e.target.value)}
          required
        />
        <input
          className="input-field"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => onDescription(e.target.value)}
        />
        <button
          type="submit"
          disabled={submitting || !subjectId}
          className="w-full rounded-xl bg-brand py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {submitting ? "Creating…" : "Create assignment"}
        </button>
      </form>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Your assignments</p>
        {rows.length === 0 ? (
          <MobileEmptyState message="No assignments yet." />
        ) : (
          rows.map((a) => (
            <div key={a.id} className="rounded-2xl border border-border bg-surface px-4 py-3 shadow-sm">
              <p className="font-semibold text-heading">{a.title}</p>
              <p className="text-xs text-muted">
                {a.subject.name} · Due {new Date(a.dueAt).toLocaleDateString()} · {a.submissions.length} submission
                {a.submissions.length === 1 ? "" : "s"}
              </p>
            </div>
          ))
        )}
      </div>

      {hasSubmissions && (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Grade submissions</p>
          {rows.flatMap((a) =>
            a.submissions.map((sub) => (
              <div key={sub.id} className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
                <p className="text-sm font-semibold text-heading">{a.title}</p>
                <p className="text-xs text-muted">
                  {sub.student.firstName} {sub.student.lastName} · {sub.status}
                </p>
                <div className="mt-3 flex gap-2">
                  <input
                    type="number"
                    min={0}
                    className="input-field !mt-0 flex-1"
                    placeholder="Marks"
                    value={gradeMarks[sub.id] ?? (sub.marks != null ? String(sub.marks) : "")}
                    onChange={(e) => onGradeMarksChange(sub.id, e.target.value)}
                  />
                  <button
                    type="button"
                    disabled={gradingId === sub.id}
                    onClick={() => onSaveGrade(sub.id, sub.marks)}
                    className="shrink-0 rounded-xl bg-brand-gold px-4 py-2 text-xs font-bold text-brand-dark disabled:opacity-50"
                  >
                    {gradingId === sub.id ? "…" : "Save"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </PanelMobileShell>
  );
}

export type TeacherDatesheetRow = {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: string;
  examination: { name: string } | null;
  section: { name: string; class: { name: string } };
};

export function TeacherDatesheetsMobile({
  rows,
  sections,
  sectionId,
  onSectionId,
  exams,
  examinationId,
  onExaminationId,
  title,
  onTitle,
  onFileChange,
  preview,
  submitting,
  onSubmit,
  error,
  message,
  selectedId,
  onSelect,
}: {
  rows: TeacherDatesheetRow[];
  sections: { sectionId: string; label: string }[];
  sectionId: string;
  onSectionId: (id: string) => void;
  exams: { id: string; name: string }[];
  examinationId: string;
  onExaminationId: (id: string) => void;
  title: string;
  onTitle: (t: string) => void;
  onFileChange: (file: File | null) => void;
  preview: string | null;
  submitting: boolean;
  onSubmit: (e: FormEvent) => void;
  error: string | null;
  message: string | null;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const selected = rows.find((r) => r.id === selectedId) ?? rows[0];

  return (
    <PanelMobileShell
      role="teacher"
      kicker="Teacher"
      title="Exam date sheets"
      subtitle="Upload schedules for your class sections."
      showCalendar={true}
      calendarTitle="Exam days & holidays"
    >
      <PanelAlerts error={error} message={message} />

      {sections.length === 0 && (
        <p className="text-sm text-muted">
          You are not assigned as class teacher for any section. Ask the principal to mark you as class teacher.
        </p>
      )}

      <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-border bg-surface p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Upload</p>
        <select className="input-field" value={sectionId} onChange={(e) => onSectionId(e.target.value)} required>
          {sections.length === 0 && <option value="">No sections</option>}
          {sections.map((s) => (
            <option key={s.sectionId} value={s.sectionId}>{s.label}</option>
          ))}
        </select>
        <select className="input-field" value={examinationId} onChange={(e) => onExaminationId(e.target.value)}>
          <option value="">Exam (optional)</option>
          {exams.map((ex) => (
            <option key={ex.id} value={ex.id}>{ex.name}</option>
          ))}
        </select>
        <input
          className="input-field"
          placeholder="Title (e.g. Term 1 date sheet)"
          value={title}
          onChange={(e) => onTitle(e.target.value)}
        />
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="input-field !py-2 text-sm"
          onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
          required
        />
        {preview && (
          <img src={preview} alt="Preview" className="max-h-48 w-full rounded-xl border border-border object-contain" />
        )}
        <button
          type="submit"
          disabled={submitting || !sectionId}
          className="w-full rounded-xl bg-brand py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {submitting ? "Uploading…" : "Upload date sheet"}
        </button>
      </form>

      {rows.length === 0 ? (
        <MobileEmptyState message="No date sheets uploaded yet." />
      ) : (
        <>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {rows.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => onSelect(r.id)}
                className={`shrink-0 rounded-xl border px-3 py-2 text-left text-xs ${
                  selected?.id === r.id ? "border-brand bg-brand/5" : "border-border"
                }`}
              >
                <span className="font-semibold text-heading">{r.title}</span>
                <span className="mt-0.5 block text-muted">
                  {r.section.class.name}-{r.section.name}
                </span>
              </button>
            ))}
          </div>
          {selected && (
            <div className="overflow-hidden rounded-2xl border border-border bg-surface p-2">
              <a href={resolveApiAssetUrl(selected.imageUrl)} target="_blank" rel="noreferrer">
                <img
                  src={resolveApiAssetUrl(selected.imageUrl)}
                  alt={selected.title}
                  className="w-full object-contain"
                />
              </a>
              <p className="px-2 py-2 text-xs text-muted">Tap image to open full size.</p>
            </div>
          )}
        </>
      )}
    </PanelMobileShell>
  );
}

export function PrincipalLeaveMobile({
  rows,
  error,
  message,
  busyId,
  onApprove,
  onReject,
}: {
  rows: {
    id: string;
    type: string;
    status: string;
    startDate: string;
    endDate: string;
    teacher: { firstName: string; lastName: string };
  }[];
  error: string | null;
  message: string | null;
  busyId: string | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  return (
    <PanelMobileShell role="principal" kicker="Principal" title="Leave requests" subtitle="Review teacher leave by date.">
      <PanelAlerts error={error} message={message} />
      {rows.length === 0 ? (
        <MobileEmptyState message="No pending leave requests." />
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li key={r.id} className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
              <p className="font-semibold text-heading">{r.teacher.firstName} {r.teacher.lastName}</p>
              <p className="text-xs text-muted">
                {r.type} · {new Date(r.startDate).toLocaleDateString()} – {new Date(r.endDate).toLocaleDateString()}
              </p>
              <p className="mt-1 text-sm font-medium text-brand">{r.status}</p>
              {r.status === "PENDING" && (
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    disabled={busyId === r.id}
                    onClick={() => onApprove(r.id)}
                    className="flex-1 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={busyId === r.id}
                    onClick={() => onReject(r.id)}
                    className="flex-1 rounded-xl bg-red-600 py-2 text-xs font-bold text-white disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </PanelMobileShell>
  );
}
