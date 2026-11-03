"use client";

import { FormEvent, useEffect, useState } from "react";
import { TeacherMaterialsMobile } from "@/components/mobile/teacher-content-mobile";
import { PanelResponsive } from "@/components/panel/panel-responsive";
import { DataTable } from "@/components/data-table";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader, PageSection } from "@/components/page-header";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

type SubjectOpt = { subjectId: string; name: string };

export default function TeacherMaterialsPage() {
  const { get, post } = useApi();
  const [rows, setRows] = useState<{ title: string; subject: { name: string }; classLabel: string | null }[]>([]);
  const [subjects, setSubjects] = useState<SubjectOpt[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [subjectId, setSubjectId] = useState("");
  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [classLabel, setClassLabel] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function loadMaterials() {
    get<typeof rows>("/api/teacher/materials")
      .then(setRows)
      .catch((e) => {
        setRows([]);
        setError(getApiErrorMessage(e));
      });
  }

  useEffect(() => {
    loadMaterials();
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
    if (!subjectId || !title || !fileUrl) return;
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      await post("/api/teacher/materials", {
        subjectId,
        title,
        fileUrl,
        classLabel: classLabel || undefined,
      });
      setTitle("");
      setFileUrl("");
      setClassLabel("");
      setMessage("Material added.");
      loadMaterials();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  const desktop = (
    <>
      <PageHeader title="Study materials" description="Share notes and files with your classes." />
      <PageSection title="Upload material">
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
        <label className="block min-w-[220px] text-sm">
          <span className="text-muted">File URL</span>
          <input
            required
            type="url"
            placeholder="https://…"
            className="mt-1 block w-full input-field"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="text-muted">Class label</span>
          <input
            className="mt-1 block input-field"
            value={classLabel}
            onChange={(e) => setClassLabel(e.target.value)}
            placeholder="e.g. 10-A"
          />
        </label>
        <button
          type="submit"
          disabled={submitting || !subjectId}
          className="btn-primary text-sm disabled:opacity-50"
        >
          {submitting ? "Adding…" : "Add material"}
        </button>
      </form>
      </PageSection>
      <PageSection title="Your uploads">
      <DataTable
        columns={["Title", "Subject", "Class"]}
        rows={rows.map((m) => [m.title, m.subject.name, m.classLabel])}
      />
      </PageSection>
    </>
  );

  return (
    <>
      <PanelAlerts error={error} message={message} messageTitle="Material added" />
      <PanelResponsive
        desktop={desktop}
        mobile={
          <TeacherMaterialsMobile
          rows={rows}
          error={error}
          message={message}
          subjects={subjects}
          subjectId={subjectId}
          onSubjectId={setSubjectId}
          title={title}
          onTitle={setTitle}
          fileUrl={fileUrl}
          onFileUrl={setFileUrl}
          classLabel={classLabel}
          onClassLabel={setClassLabel}
          submitting={submitting}
          onSubmit={onSubmit}
          />
        }
      />
    </>
  );
}
