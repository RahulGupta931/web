"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  TeacherAssignmentsMobile,
  type TeacherAssignmentRow,
} from "@/components/mobile/teacher-content-mobile";
import { PanelResponsive } from "@/components/panel/panel-responsive";
import { DataTable } from "@/components/data-table";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader, PageSection } from "@/components/page-header";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

type SubjectOpt = { subjectId: string; name: string };

export default function TeacherAssignmentsPage() {
  const { get, post, patch } = useApi();
  const [rows, setRows] = useState<TeacherAssignmentRow[]>([]);
  const [gradeMarks, setGradeMarks] = useState<Record<string, string>>({});
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<SubjectOpt[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [subjectId, setSubjectId] = useState("");
  const [title, setTitle] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function load() {
    get<TeacherAssignmentRow[]>("/api/teacher/assignments")
      .then(setRows)
      .catch((e) => {
        setRows([]);
        setError(getApiErrorMessage(e));
      });
  }

  useEffect(() => {
    load();
    get<{ profile: { subjectAssignments: { subjectId: string; subject: { name: string } }[] } }>(
      "/api/teacher/dashboard"
    )
      .then((d) => {
        const opts = d.profile.subjectAssignments.map((a) => ({
          subjectId: a.subjectId,
          name: a.subject.name,
        }));
        setSubjects(opts);
        if (opts[0]) setSubjectId(opts[0].subjectId);
      })
      .catch(() => {});
  }, [get]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!subjectId || !title || !dueAt) return;
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      await post("/api/teacher/assignments", {
        subjectId,
        title,
        description: description || undefined,
        dueAt: new Date(dueAt).toISOString(),
      });
      setTitle("");
      setDescription("");
      setDueAt("");
      setMessage("Assignment created.");
      load();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function saveGrade(submissionId: string, fallbackMarks: number | null) {
    const marks = Number(gradeMarks[submissionId] ?? fallbackMarks);
    if (Number.isNaN(marks)) {
      setError("Enter valid marks.");
      return;
    }
    setGradingId(submissionId);
    setError(null);
    setMessage(null);
    try {
      await patch(`/api/teacher/assignments/submissions/${submissionId}`, {
        marks,
        status: "GRADED",
      });
      setMessage("Submission graded.");
      load();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setGradingId(null);
    }
  }

  const desktop = (
    <>
      <PageHeader title="Assignments" description="Create tasks and grade student submissions." />
      <PageSection title="Create assignment">
        <form onSubmit={onSubmit} className="card-panel form-shell flex flex-wrap items-end gap-4">
          <label className="block text-sm">
            <span className="text-muted">Subject</span>
            <select
              className="mt-1 block input-field"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              required
            >
              {subjects.length === 0 && <option value="">No subjects assigned</option>}
              {subjects.map((s) => (
                <option key={s.subjectId} value={s.subjectId}>{s.name}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-muted">Title</span>
            <input
              required
              className="mt-1 block input-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="text-muted">Due</span>
            <input
              type="datetime-local"
              required
              className="mt-1 block input-field"
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
            />
          </label>
          <label className="block min-w-[200px] flex-1 text-sm">
            <span className="text-muted">Description</span>
            <input
              className="mt-1 w-full input-field"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional"
            />
          </label>
          <button
            type="submit"
            disabled={submitting || !subjectId}
            className="btn-primary text-sm disabled:opacity-50"
          >
            {submitting ? "Creating…" : "Create assignment"}
          </button>
        </form>
      </PageSection>
      <PageSection title="Your assignments">
        <DataTable
          columns={["Title", "Subject", "Due", "Submissions"]}
          rows={rows.map((a) => [
            a.title,
            a.subject.name,
            new Date(a.dueAt).toLocaleDateString(),
            a.submissions.length,
          ])}
        />
        {rows.some((a) => a.submissions.length > 0) && (
          <section className="card-panel form-shell mt-4 space-y-4">
            <h3 className="text-sm font-semibold text-heading">Grade submissions</h3>
            {rows.flatMap((a) =>
              a.submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="flex flex-wrap items-end gap-2 border-t border-[var(--border)] pt-3 first:border-0 first:pt-0"
                >
                  <p className="min-w-[200px] flex-1 text-sm">
                    <span className="font-medium">{a.title}</span>
                    <span className="text-muted">
                      {" "}
                      — {sub.student.firstName} {sub.student.lastName}
                    </span>
                    <span className="ml-2 text-xs text-muted">({sub.status})</span>
                  </p>
                  <input
                    type="number"
                    min={0}
                    className="input-field !mt-0 max-w-[100px]"
                    placeholder="Marks"
                    value={gradeMarks[sub.id] ?? (sub.marks != null ? String(sub.marks) : "")}
                    onChange={(e) => setGradeMarks((g) => ({ ...g, [sub.id]: e.target.value }))}
                  />
                  <button
                    type="button"
                    disabled={gradingId === sub.id}
                    className="btn-secondary text-sm disabled:opacity-50"
                    onClick={() => saveGrade(sub.id, sub.marks)}
                  >
                    {gradingId === sub.id ? "Saving…" : "Save grade"}
                  </button>
                </div>
              ))
            )}
          </section>
        )}
      </PageSection>
    </>
  );

  return (
    <>
      <PanelAlerts error={error} message={message} />
      <PanelResponsive
        desktop={desktop}
        mobile={
          <TeacherAssignmentsMobile
          rows={rows}
          error={error}
          message={message}
          subjects={subjects}
          subjectId={subjectId}
          onSubjectId={setSubjectId}
          title={title}
          onTitle={setTitle}
          dueAt={dueAt}
          onDueAt={setDueAt}
          description={description}
          onDescription={setDescription}
          submitting={submitting}
          onCreate={onSubmit}
          gradeMarks={gradeMarks}
          onGradeMarksChange={(id, value) => setGradeMarks((g) => ({ ...g, [id]: value }))}
          onSaveGrade={saveGrade}
          gradingId={gradingId}
          />
        }
      />
    </>
  );
}
