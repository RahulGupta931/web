"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { StudentAssignmentsMobile } from "@/components/mobile/student-content-mobile";
import { PanelResponsive } from "@/components/panel/panel-responsive";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader, PageSection } from "@/components/page-header";
import { useAuth } from "@/components/auth-provider";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

type Assignment = {
  id: string;
  title: string;
  description: string | null;
  dueAt: string;
  subject: { name: string };
  submissions: { status: string; feedback: string | null; fileUrl: string | null }[];
};

export default function StudentAssignmentsPage() {
  const { loading: authLoading } = useAuth();
  const { get, post, isReady } = useApi();
  const [rows, setRows] = useState<Assignment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [draftUrls, setDraftUrls] = useState<Record<string, string>>({});

  const load = useCallback(() => {
    if (!isReady) {
      setRows([]);
      return;
    }
    get<Assignment[]>("/api/student/assignments")
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch((e) => {
        setRows([]);
        setError(getApiErrorMessage(e));
      });
  }, [get, isReady]);

  useEffect(() => {
    if (authLoading) return;
    load();
  }, [authLoading, load]);

  async function onSubmit(e: FormEvent, assignmentId: string) {
    e.preventDefault();
    const url = (draftUrls[assignmentId] ?? "").trim();
    if (!url) {
      setError("Enter a file URL or link to your work.");
      return;
    }
    setSubmittingId(assignmentId);
    setError(null);
    setMessage(null);
    try {
      await post(`/api/student/assignments/${assignmentId}/submit`, { fileUrl: url });
      setMessage("Assignment submitted.");
      setDraftUrls((d) => ({ ...d, [assignmentId]: "" }));
      load();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmittingId(null);
    }
  }

  const assignmentList = (
    <>
      <PageSection title="Your tasks">
      {rows.length === 0 && <p className="empty-state">No assignments yet.</p>}
      <ul className="space-y-4">
        {rows.map((a) => {
          const sub = a.submissions[0];
          const done = sub?.status === "SUBMITTED" || sub?.status === "GRADED";
          return (
            <li key={a.id} className="card-panel p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-medium text-heading">{a.title}</h3>
                  <p className="text-sm text-muted">
                    {a.subject.name} · Due {new Date(a.dueAt).toLocaleDateString()}
                  </p>
                  {a.description && <p className="mt-2 text-sm">{a.description}</p>}
                </div>
                <span className="badge-role">{sub?.status ?? "PENDING"}</span>
              </div>
              {sub?.feedback && (
                <p className="mt-2 text-sm text-muted">Feedback: {sub.feedback}</p>
              )}
              {sub?.fileUrl && (
                <p className="mt-1 text-sm">
                  <a href={sub.fileUrl} className="text-brand hover:underline" target="_blank" rel="noreferrer">
                    View submission
                  </a>
                </p>
              )}
              {!done && (
                <form onSubmit={(e) => onSubmit(e, a.id)} className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end">
                  <label className="block flex-1 text-sm">
                    <span className="text-muted">Submission link (URL)</span>
                    <input
                      type="url"
                      required
                      className="input-field"
                      placeholder="https://…"
                      value={draftUrls[a.id] ?? ""}
                      onChange={(e) =>
                        setDraftUrls((d) => ({ ...d, [a.id]: e.target.value }))
                      }
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={submittingId === a.id}
                    className="btn-primary shrink-0 text-sm disabled:opacity-50"
                  >
                    {submittingId === a.id ? "Submitting…" : "Submit"}
                  </button>
                </form>
              )}
            </li>
          );
        })}
      </ul>
      </PageSection>
    </>
  );

  return (
    <>
      <PanelAlerts error={error} message={message} messageTitle="Assignment submitted" />
      <PanelResponsive
        desktop={
          <>
            <PageHeader title="Assignments" description="Submit work before the due date." />
            {assignmentList}
          </>
        }
        mobile={
          <StudentAssignmentsMobile
          rows={rows}
          error={error}
          message={message}
          draftUrls={draftUrls}
          onDraftChange={(id, url) => setDraftUrls((d) => ({ ...d, [id]: url }))}
          submittingId={submittingId}
          onSubmit={onSubmit}
          />
        }
      />
    </>
  );
}
