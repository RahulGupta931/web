"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MobileEmptyState, statusTone } from "@/components/mobile/mobile-primitives";
import { PanelAlerts } from "@/components/panel-alerts";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

type SectionOption = { sectionId: string; label: string };

type ExamRow = {
  id: string;
  name: string;
  status: string;
  publicationStatus: string;
  subjects: { id: string; subject: { name: string } }[];
};

type Matrix = {
  exam: {
    id: string;
    name: string;
    publicationStatus: string;
    academicSession: string | null;
  };
  students: { id: string; firstName: string; lastName: string; studentId: string }[];
  subjects: {
    examSubjectId: string;
    name: string;
    maxMarks: number;
    passingMarks: number;
  }[];
  marks: Record<
    string,
    Record<string, { marksObtained: number | null; enteredByName: string | null }>
  >;
  missingSubjects: { id: string; name: string }[];
};

type CellKey = `${string}:${string}`;

function cellKey(studentId: string, examSubjectId: string): CellKey {
  return `${studentId}:${examSubjectId}`;
}

function studentFilledCount(
  studentId: string,
  subjects: Matrix["subjects"],
  draft: Record<CellKey, string>
) {
  let n = 0;
  for (const sub of subjects) {
    const v = draft[cellKey(studentId, sub.examSubjectId)];
    if (v !== undefined && v !== "") n += 1;
  }
  return n;
}

function draftFromMatrix(data: Matrix): Record<CellKey, string> {
  const next: Record<CellKey, string> = {};
  if (!data?.students || !data.subjects || !data.marks) return next;
  for (const st of data.students) {
    for (const sub of data.subjects) {
      const val = data.marks[st.id]?.[sub.examSubjectId]?.marksObtained;
      if (val != null) next[cellKey(st.id, sub.examSubjectId)] = String(val);
    }
  }
  return next;
}

export function ClassTeacherReportCards({ embedded = false }: { embedded?: boolean }) {
  const { get, post, isReady } = useApi();
  const [sections, setSections] = useState<SectionOption[]>([]);
  const [sectionId, setSectionId] = useState("");
  const [exams, setExams] = useState<ExamRow[]>([]);
  const [examId, setExamId] = useState("");
  const [matrix, setMatrix] = useState<Matrix | null>(null);
  const [draft, setDraft] = useState<Record<CellKey, string>>({});
  const [newExamName, setNewExamName] = useState("");
  const [showCreateExam, setShowCreateExam] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingMatrix, setLoadingMatrix] = useState(false);
  const matrixScopeRef = useRef("");
  const draftDirtyRef = useRef(false);

  function updateDraftCell(key: CellKey, value: string) {
    draftDirtyRef.current = true;
    setDraft((d) => ({ ...d, [key]: value }));
  }

  useEffect(() => {
    if (!isReady) return;
    get<SectionOption[]>("/api/teacher/class-teacher/sections")
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setSections(list);
        setSectionId((prev) =>
          prev && list.some((s) => s.sectionId === prev) ? prev : list[0]?.sectionId ?? ""
        );
      })
      .catch(() => setSections([]));
  }, [get, isReady]);

  const loadExams = useCallback(() => {
    if (!isReady || !sectionId) {
      setExams([]);
      return;
    }
    get<ExamRow[]>(`/api/teacher/class-teacher/examinations?sectionId=${sectionId}`)
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setExams(list);
        setExamId((prev) =>
          prev && list.some((e) => e.id === prev) ? prev : list[0]?.id ?? ""
        );
      })
      .catch((e) => {
        setExams([]);
        setError(getApiErrorMessage(e));
      });
  }, [get, isReady, sectionId]);

  useEffect(() => {
    loadExams();
  }, [loadExams]);

  const loadMatrix = useCallback(
    (opts?: { resetDraft?: boolean }) => {
      if (!isReady || !sectionId || !examId) {
        matrixScopeRef.current = "";
        draftDirtyRef.current = false;
        setMatrix(null);
        setDraft({});
        return;
      }
      const scope = `${sectionId}:${examId}`;
      const scopeChanged = scope !== matrixScopeRef.current;
      if (scopeChanged) {
        matrixScopeRef.current = scope;
        draftDirtyRef.current = false;
        setMatrix(null);
        setLoadingMatrix(true);
      }

      get<Matrix>(
        `/api/teacher/class-teacher/examinations/${examId}/matrix?sectionId=${sectionId}`
      )
        .then((data) => {
          setMatrix(data);
          const serverDraft = draftFromMatrix(data);
          const resetDraft = opts?.resetDraft === true || scopeChanged;
          if (resetDraft || !draftDirtyRef.current) {
            setDraft(serverDraft);
            draftDirtyRef.current = false;
          } else {
            setDraft((prev) => ({ ...serverDraft, ...prev }));
          }
        })
        .catch((e) => {
          setMatrix(null);
          setError(getApiErrorMessage(e));
        })
        .finally(() => setLoadingMatrix(false));
    },
    [get, isReady, sectionId, examId]
  );

  useEffect(() => {
    loadMatrix();
  }, [loadMatrix]);

  const stats = useMemo(() => {
    if (!matrix) return null;
    const cells = matrix.students.length * matrix.subjects.length;
    let filled = 0;
    for (const st of matrix.students) {
      for (const sub of matrix.subjects) {
        const v = draft[cellKey(st.id, sub.examSubjectId)];
        if (v !== undefined && v !== "") filled += 1;
      }
    }
    return {
      students: matrix.students.length,
      subjects: matrix.subjects.length,
      cells,
      filled,
      pending: cells - filled,
      pct: cells > 0 ? Math.round((filled / cells) * 100) : 0,
    };
  }, [matrix, draft]);

  const selectedExam = exams.find((e) => e.id === examId);
  const sectionLabel = sections.find((s) => s.sectionId === sectionId)?.label;
  const isPublished =
    matrix?.exam.publicationStatus === "PUBLISHED" ||
    selectedExam?.publicationStatus === "PUBLISHED";

  async function onCreateExam(e: FormEvent) {
    e.preventDefault();
    if (!sectionId || !newExamName.trim()) return;
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      await post("/api/teacher/class-teacher/examinations", {
        sectionId,
        name: newExamName.trim(),
      });
      setNewExamName("");
      setShowCreateExam(false);
      setMessage("Examination created with all subjects for your class.");
      loadExams();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function onUnpublish() {
    if (!sectionId || !examId) return;
    if (
      !window.confirm(
        "Unpublish report cards? Students will no longer see this exam until you publish again."
      )
    ) {
      return;
    }
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      await post(`/api/teacher/class-teacher/examinations/${examId}/unpublish`, { sectionId });
      setMessage("Report cards unlocked for editing.");
      loadExams();
      loadMatrix({ resetDraft: true });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function onSaveMarks(e: FormEvent) {
    e.preventDefault();
    if (!sectionId || !examId || !matrix) return;
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      const marks: {
        studentProfileId: string;
        examSubjectId: string;
        marksObtained: number;
      }[] = [];
      for (const st of matrix.students) {
        for (const sub of matrix.subjects) {
          const raw = draft[cellKey(st.id, sub.examSubjectId)];
          if (raw === undefined || raw.trim() === "") continue;
          const marksObtained = Number(raw);
          if (!Number.isFinite(marksObtained)) {
            throw new Error(`Invalid mark for ${st.firstName} ${st.lastName} (${sub.name}).`);
          }
          if (marksObtained < 0 || marksObtained > sub.maxMarks) {
            throw new Error(
              `${sub.name} for ${st.firstName}: enter a mark between 0 and ${sub.maxMarks}.`
            );
          }
          marks.push({
            studentProfileId: st.id,
            examSubjectId: sub.examSubjectId,
            marksObtained,
          });
        }
      }
      if (marks.length === 0) {
        setError("Enter at least one mark before saving.");
        return;
      }
      if (isPublished) {
        await post(`/api/teacher/class-teacher/examinations/${examId}/unpublish`, { sectionId });
      }
      await post(`/api/teacher/class-teacher/examinations/${examId}/marks`, {
        sectionId,
        marks,
      });
      setMessage(
        isPublished
          ? "Exam unlocked and marks saved. Publish again when the grid is complete."
          : "Report card marks saved."
      );
      draftDirtyRef.current = false;
      loadExams();
      loadMatrix({ resetDraft: true });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function onPublish() {
    if (!sectionId || !examId) return;
    if (stats && stats.pending > 0) {
      setError(
        `Enter marks for all subjects (${stats.pending} cell${stats.pending === 1 ? "" : "s"} still empty).`
      );
      return;
    }
    if (
      !window.confirm(
        "Publish report cards for this examination? Students will see results after publish."
      )
    ) {
      return;
    }
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      await post(`/api/teacher/class-teacher/examinations/${examId}/publish`, { sectionId });
      setMessage("Report cards published for students.");
      loadMatrix({ resetDraft: true });
      loadExams();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (sections.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border px-6 py-10 text-center">
        <p className="text-base font-semibold text-heading">Class teacher access required</p>
        <p className="mt-2 text-sm text-muted max-w-md mx-auto">
          Report cards are available when you are assigned as class teacher of a section.
        </p>
      </div>
    );
  }

  const actionButtons = (
    <>
      <button
        type="submit"
        form="report-card-grid-form"
        disabled={submitting || !matrix}
        className="btn-primary text-sm disabled:opacity-50 lg:flex-1"
      >
        {submitting ? "Saving…" : "Save all marks"}
      </button>
      {!isPublished && matrix && (
        <button
          type="button"
          disabled={submitting}
          onClick={onPublish}
          className="btn-secondary text-sm disabled:opacity-50 lg:flex-initial"
        >
          Publish report cards
        </button>
      )}
    </>
  );

  return (
    <div className={`space-y-5 ${embedded ? "pb-36" : ""}`}>
      <PanelAlerts error={error} message={message} messageTitle="Saved" />

      {!embedded && (
        <div>
          <h2 className="text-lg font-semibold text-heading">Class report cards</h2>
          <p className="mt-1 text-sm text-muted max-w-2xl">
            As class teacher you can enter marks for every subject on this grid (not only the subjects you teach).
            Subject teachers&apos; entries appear automatically — review, fill gaps, save, then publish for students.
          </p>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Your class</p>
            <p className="text-base font-semibold text-heading">{sectionLabel ?? "Section"}</p>
          </div>
          <label className="block min-w-[10rem] flex-1 sm:max-w-xs text-sm">
            <span className="sr-only">Class section</span>
            <select
              className="input-field"
              value={sectionId}
              onChange={(e) => {
                draftDirtyRef.current = false;
                setSectionId(e.target.value);
              }}
            >
              {sections.map((s) => (
                <option key={s.sectionId} value={s.sectionId}>{s.label}</option>
              ))}
            </select>
          </label>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateExam((v) => !v)}
          className="flex w-full items-center justify-between rounded-xl border border-dashed border-brand/40 bg-brand/5 px-3 py-2.5 text-left text-sm font-medium text-brand transition hover:bg-brand/10"
        >
          <span>{showCreateExam ? "Hide new exam form" : "Create examination for this class"}</span>
          <span className="text-lg leading-none">{showCreateExam ? "−" : "+"}</span>
        </button>

        {showCreateExam && (
          <form onSubmit={onCreateExam} className="flex flex-wrap items-end gap-3 border-t border-border pt-4">
            <label className="block min-w-[12rem] flex-1 text-sm">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">Exam title</span>
              <input
                className="input-field mt-1"
                value={newExamName}
                onChange={(e) => setNewExamName(e.target.value)}
                placeholder="e.g. Unit Test 1"
              />
            </label>
            <button
              type="submit"
              disabled={submitting || !newExamName.trim()}
              className="btn-primary text-sm disabled:opacity-50"
            >
              Create
            </button>
          </form>
        )}
      </div>

      {exams.length === 0 ? (
        embedded ? (
          <MobileEmptyState message="No examinations for this class yet. Create one above." />
        ) : (
          <p className="text-sm text-muted text-center py-6">
            No examinations for this class yet. Create one to start the report card grid.
          </p>
        )
      ) : (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Choose examination</p>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none">
            {exams.map((ex) => {
              const active = ex.id === examId;
              const published = ex.publicationStatus === "PUBLISHED";
              return (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => {
                    draftDirtyRef.current = false;
                    setExamId(ex.id);
                  }}
                  className={`shrink-0 min-w-[9.5rem] max-w-[12rem] rounded-2xl border px-3 py-2.5 text-left transition active:scale-[0.98] ${
                    active
                      ? "border-brand bg-brand/5 shadow-[var(--shadow-card)] ring-2 ring-brand/20"
                      : "border-border bg-surface hover:border-brand/35"
                  }`}
                >
                  <p className="truncate text-sm font-semibold text-heading">{ex.name}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[0.6rem] font-semibold uppercase ${
                        published ? "bg-emerald-500/15 text-emerald-800" : statusTone(ex.status)
                      }`}
                    >
                      {published ? "Published" : ex.status.replace(/_/g, " ")}
                    </span>
                    <span className="text-[0.65rem] text-muted">{ex.subjects.length} papers</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {matrix?.missingSubjects && matrix.missingSubjects.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Could not add papers for:{" "}
          <strong>{matrix.missingSubjects.map((s) => s.name).join(", ")}</strong>.
          Check class subjects in school configuration.
        </div>
      )}

      {isPublished && (
        <div className="flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <strong>Published.</strong> You can still type marks here; saving will unlock the exam, update marks, then
            you can publish again when ready. Or use Unlock without saving first.
          </p>
          <button
            type="button"
            disabled={submitting}
            onClick={onUnpublish}
            className="btn-secondary shrink-0 border-emerald-300 bg-white text-sm text-emerald-900 disabled:opacity-50"
          >
            Unlock for editing
          </button>
        </div>
      )}

      {stats && matrix && (
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Grid completion</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-brand">
                {stats.filled}
                <span className="text-base font-medium text-muted"> / {stats.cells}</span>
              </p>
            </div>
            <div className="text-right text-xs text-muted">
              <p>{stats.students} students · {stats.subjects} subjects</p>
              {matrix.exam.academicSession && (
                <p className="mt-0.5">{matrix.exam.academicSession}</p>
              )}
            </div>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand to-brand-light transition-[width] duration-300"
              style={{ width: `${stats.pct}%` }}
            />
          </div>
          {stats.pending > 0 && (
            <p className="text-xs text-muted">
              <strong className="text-foreground">{stats.pending}</strong> cells still empty — publish is blocked until
              the grid is complete.
            </p>
          )}
        </div>
      )}

      {loadingMatrix && !matrix ? (
        <p className="text-sm text-muted py-8 text-center">Loading report card grid…</p>
      ) : matrix && matrix.students.length > 0 && matrix.subjects.length > 0 ? (
        <form id="report-card-grid-form" onSubmit={onSaveMarks} className="space-y-4">
          {/* Desktop grid */}
          <div className="hidden lg:block overflow-hidden rounded-2xl border border-border">
            <div className="max-h-[min(70vh,720px)] overflow-auto">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead className="sticky top-0 z-10 bg-[var(--surface-muted)] text-xs uppercase tracking-wide text-muted shadow-sm">
                  <tr>
                    <th className="sticky left-0 z-20 bg-[var(--surface-muted)] px-4 py-3 font-semibold min-w-[11rem]">
                      Student
                    </th>
                    {matrix.subjects.map((sub) => (
                      <th
                        key={sub.examSubjectId}
                        className="px-2 py-3 font-semibold whitespace-nowrap text-center"
                      >
                        <span className="block max-w-[6rem] truncate mx-auto" title={sub.name}>
                          {sub.name}
                        </span>
                        <span className="block text-[0.65rem] font-normal normal-case">
                          / {sub.maxMarks}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-surface">
                  {matrix.students.map((st) => {
                    const filled = studentFilledCount(st.id, matrix.subjects, draft);
                    const complete = filled === matrix.subjects.length;
                    return (
                      <tr key={st.id} className="hover:bg-brand/[0.03]">
                        <td className="sticky left-0 z-[1] bg-surface px-4 py-2.5 shadow-[4px_0_8px_-4px_rgb(0_0_0/0.08)]">
                          <p className="font-medium text-foreground">{st.firstName} {st.lastName}</p>
                          <p className="text-xs text-muted">{st.studentId}</p>
                          <p className="mt-1 text-[0.65rem] font-medium text-muted">
                            {complete ? (
                              <span className="text-emerald-700">Complete</span>
                            ) : (
                              <span>{filled}/{matrix.subjects.length} papers</span>
                            )}
                          </p>
                        </td>
                        {matrix.subjects.map((sub) => {
                          const key = cellKey(st.id, sub.examSubjectId);
                          const meta = matrix.marks[st.id]?.[sub.examSubjectId];
                          return (
                            <td key={sub.examSubjectId} className="px-2 py-2 align-top text-center">
                              <input
                                type="text"
                                inputMode="decimal"
                                autoComplete="off"
                                className="input-field !mt-0 !w-[4.25rem] !px-1 text-center tabular-nums font-semibold"
                                value={draft[key] ?? ""}
                                onChange={(e) => updateDraftCell(key, e.target.value)}
                                aria-label={`${sub.name} for ${st.firstName}`}
                              />
                              {meta?.enteredByName && (
                                <span
                                  className="mt-0.5 block max-w-[5rem] truncate text-[10px] text-muted leading-tight mx-auto"
                                  title={`Entered by ${meta.enteredByName}`}
                                >
                                  {meta.enteredByName.split(" ")[0]}
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile: one card per student */}
          <ul className="space-y-3 lg:hidden">
            {matrix.students.map((st) => {
              const filled = studentFilledCount(st.id, matrix.subjects, draft);
              return (
                <li
                  key={st.id}
                  className="rounded-2xl border border-border bg-surface p-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-border pb-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-heading">{st.firstName} {st.lastName}</p>
                      <p className="text-xs text-muted">{st.studentId}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold ${
                        filled === matrix.subjects.length
                          ? "bg-emerald-500/15 text-emerald-800"
                          : "bg-brand-gold/20 text-brand-dark"
                      }`}
                    >
                      {filled}/{matrix.subjects.length}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-3">
                    {matrix.subjects.map((sub) => {
                      const key = cellKey(st.id, sub.examSubjectId);
                      const meta = matrix.marks[st.id]?.[sub.examSubjectId];
                      return (
                        <label key={sub.examSubjectId} className="block text-xs">
                          <span className="font-semibold text-muted line-clamp-1" title={sub.name}>
                            {sub.name}
                          </span>
                          <span className="text-[0.65rem] text-muted"> / {sub.maxMarks}</span>
                          <input
                            type="text"
                            inputMode="decimal"
                            autoComplete="off"
                            className="input-field !mt-1 !py-2 text-center text-sm font-bold tabular-nums"
                            value={draft[key] ?? ""}
                            onChange={(e) => updateDraftCell(key, e.target.value)}
                          />
                          {meta?.enteredByName && (
                            <span className="mt-0.5 block truncate text-[10px] text-muted">
                              via {meta.enteredByName.split(" ")[0]}
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="hidden lg:flex flex-wrap gap-3">{actionButtons}</div>
        </form>
      ) : examId && selectedExam ? (
        <p className="text-sm text-muted text-center py-6">
          No students or subjects to show for {selectedExam.name}.
        </p>
      ) : exams.length > 0 ? (
        <p className="text-sm text-muted text-center py-6">Select an examination to open the grid.</p>
      ) : null}

      {embedded && matrix && matrix.students.length > 0 && (
        <div className="fixed inset-x-0 bottom-[5.75rem] z-20 flex gap-2 border-t border-border bg-surface/95 px-4 py-3 shadow-[0_-8px_24px_rgb(15_23_42/0.08)] backdrop-blur-md lg:hidden">
          {actionButtons}
        </div>
      )}
    </div>
  );
}
