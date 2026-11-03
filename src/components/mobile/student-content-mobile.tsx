"use client";

import type { FormEvent } from "react";
import { PanelAlerts } from "@/components/panel-alerts";
import { PanelMobileShell } from "@/components/panel/panel-mobile-shell";
import { MobileEmptyState } from "@/components/mobile/mobile-primitives";
import { PanelListPageMobile } from "@/components/mobile/panel-list-page-mobile";
import { resolveApiAssetUrl } from "@/lib/api";

export function StudentMaterialsMobile({
  rows,
}: {
  rows: { title: string; subject: { name: string }; fileUrl: string }[];
}) {
  return (
    <PanelListPageMobile
      role="student"
      kicker="Student"
      title="Study materials"
      subtitle="Notes and files from your teachers."
      showCalendar={false}
      items={rows.map((m) => ({
        title: m.title,
        subtitle: m.subject.name,
        meta: m.fileUrl,
        badge: "File",
      }))}
      emptyMessage="No materials available."
    />
  );
}

export function StudentAssignmentsMobile({
  rows,
  error,
  message,
  draftUrls,
  onDraftChange,
  submittingId,
  onSubmit,
}: {
  rows: {
    id: string;
    title: string;
    description: string | null;
    dueAt: string;
    subject: { name: string };
    submissions: { status: string; feedback: string | null; fileUrl: string | null }[];
  }[];
  error: string | null;
  message: string | null;
  draftUrls: Record<string, string>;
  onDraftChange: (id: string, url: string) => void;
  submittingId: string | null;
  onSubmit: (e: FormEvent, id: string) => void;
}) {
  return (
    <PanelMobileShell
      role="student"
      kicker="Student"
      title="Assignments"
      subtitle="Submit work before the due date."
      showCalendar={true}
      calendarTitle="Due dates & holidays"
    >
      <PanelAlerts error={error} message={message} />
      {rows.length === 0 ? (
        <MobileEmptyState message="No assignments yet." />
      ) : (
        <ul className="space-y-3">
          {rows.map((a) => {
            const sub = a.submissions[0];
            const done = sub?.status === "SUBMITTED" || sub?.status === "GRADED";
            return (
              <li key={a.id} className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-heading">{a.title}</p>
                    <p className="text-xs text-muted">
                      {a.subject.name} · Due {new Date(a.dueAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-brand/10 px-2 py-0.5 text-[0.65rem] font-semibold text-brand">
                    {sub?.status ?? "PENDING"}
                  </span>
                </div>
                {a.description && <p className="mt-2 text-sm text-muted">{a.description}</p>}
                {sub?.feedback && <p className="mt-2 text-sm text-muted">Feedback: {sub.feedback}</p>}
                {!done && (
                  <form onSubmit={(e) => onSubmit(e, a.id)} className="mt-3 space-y-2">
                    <input
                      type="url"
                      required
                      placeholder="Submission link (URL)"
                      className="input-field"
                      value={draftUrls[a.id] ?? ""}
                      onChange={(e) => onDraftChange(a.id, e.target.value)}
                    />
                    <button
                      type="submit"
                      disabled={submittingId === a.id}
                      className="w-full rounded-xl bg-brand py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      {submittingId === a.id ? "Submitting…" : "Submit"}
                    </button>
                  </form>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </PanelMobileShell>
  );
}

export function StudentDatesheetsMobile({
  rows,
  selectedId,
  onSelect,
}: {
  rows: {
    id: string;
    title: string;
    imageUrl: string;
    examination: { name: string } | null;
    section: { name: string; class: { name: string } };
  }[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const selected = rows.find((r) => r.id === selectedId) ?? rows[0];

  return (
    <PanelMobileShell
      role="student"
      kicker="Student"
      title="Exam date sheets"
      subtitle="Schedules shared for your section."
      showCalendar={true}
    >
      {rows.length === 0 ? (
        <MobileEmptyState message="No date sheets for your class yet." />
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
              </button>
            ))}
          </div>
          {selected && (
            <div className="overflow-hidden rounded-2xl border border-border bg-surface p-2">
              <img
                src={resolveApiAssetUrl(selected.imageUrl)}
                alt={selected.title}
                className="w-full object-contain"
              />
            </div>
          )}
        </>
      )}
    </PanelMobileShell>
  );
}
