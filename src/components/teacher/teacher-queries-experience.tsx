"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import { teacherNavLabel } from "@/config/nav";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

type QueryRow = {
  id: string;
  subject: string;
  body: string;
  status: string;
  teacherReply: string | null;
  createdAt: string;
  student: {
    firstName: string;
    lastName: string;
    studentId: string;
    enrollments: { class: { name: string }; section: { name: string }; rollNumber: string }[];
  };
};

const STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;
type QueryStatus = (typeof STATUSES)[number];

type FilterTab = "all" | "active" | "done";

const STATUS_META: Record<
  QueryStatus,
  { label: string; tone: string; description: string }
> = {
  OPEN: {
    label: "Open",
    tone: "bg-sky-500/12 text-sky-900 ring-sky-500/20",
    description: "New — not yet reviewed",
  },
  IN_PROGRESS: {
    label: "In progress",
    tone: "bg-violet-500/12 text-violet-900 ring-violet-500/20",
    description: "You are working on a reply",
  },
  RESOLVED: {
    label: "Resolved",
    tone: "bg-emerald-500/12 text-emerald-900 ring-emerald-500/20",
    description: "Answered; student can read your reply",
  },
  CLOSED: {
    label: "Closed",
    tone: "bg-slate-500/12 text-slate-700 ring-slate-500/15",
    description: "No further action needed",
  },
};

function studentInitials(first: string, last: string) {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

function formatWhen(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const sameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  if (sameDay) {
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function StatCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3 shadow-[var(--shadow-card)]">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-2xl font-bold tabular-nums text-heading">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-muted">{sub}</p> : null}
    </div>
  );
}

export function TeacherQueriesExperience() {
  const { get, patch } = useApi();
  const [rows, setRows] = useState<QueryRow[]>([]);
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState<QueryStatus>("OPEN");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    get<QueryRow[]>("/api/teacher/queries")
      .then(setRows)
      .catch((e) => {
        setRows([]);
        setError(getApiErrorMessage(e));
      })
      .finally(() => setLoading(false));
  }, [get]);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => {
    const active = rows.filter((r) => r.status === "OPEN" || r.status === "IN_PROGRESS").length;
    const done = rows.filter((r) => r.status === "RESOLVED" || r.status === "CLOSED").length;
    const needsReply = rows.filter((r) => !r.teacherReply && r.status !== "CLOSED").length;
    return { total: rows.length, active, done, needsReply };
  }, [rows]);

  const filteredRows = useMemo(() => {
    let list = rows;
    if (filterTab === "active") {
      list = list.filter((r) => r.status === "OPEN" || r.status === "IN_PROGRESS");
    } else if (filterTab === "done") {
      list = list.filter((r) => r.status === "RESOLVED" || r.status === "CLOSED");
    }
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (r) =>
        r.subject.toLowerCase().includes(q) ||
        r.body.toLowerCase().includes(q) ||
        `${r.student.firstName} ${r.student.lastName}`.toLowerCase().includes(q) ||
        r.student.studentId.toLowerCase().includes(q)
    );
  }, [rows, filterTab, search]);

  const selected = filteredRows.find((r) => r.id === selectedId) ?? rows.find((r) => r.id === selectedId) ?? null;

  useEffect(() => {
    if (selected) {
      setReply(selected.teacherReply ?? "");
      setStatus(selected.status as QueryStatus);
    }
  }, [selected]);

  async function save() {
    if (!selectedId) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await patch(`/api/teacher/queries/${selectedId}`, {
        status,
        teacherReply: reply,
      });
      setMessage("Reply saved. The student can see your response when status is resolved.");
      load();
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  const filterTabs: { id: FilterTab; label: string; count?: number }[] = [
    { id: "all", label: "All", count: stats.total },
    { id: "active", label: "Needs attention", count: stats.active },
    { id: "done", label: "Resolved / closed", count: stats.done },
  ];

  return (
    <>
      <PanelAlerts error={error} message={message} messageTitle="Saved" />
      <PageHeader
        title={teacherNavLabel("/teacher/queries")}
        description="Questions and requests from students in your class-teacher sections. Replies are visible to the student."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Inbox" value={stats.total} sub="All messages assigned to you" />
        <StatCard
          label="Active"
          value={stats.active}
          sub={stats.needsReply ? `${stats.needsReply} without a reply yet` : "Caught up on replies"}
        />
        <StatCard label="Completed" value={stats.done} sub="Resolved or closed" />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <nav
          className="flex gap-1 rounded-xl border border-border bg-surface p-1 shadow-[var(--shadow-card)]"
          aria-label="Filter messages"
        >
          {filterTabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setFilterTab(t.id);
                setSelectedId(null);
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                filterTab === t.id
                  ? "bg-brand text-white"
                  : "text-muted hover:bg-surface-muted hover:text-heading"
              }`}
            >
              {t.label}
              {t.count != null && t.count > 0 ? (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[0.625rem] font-bold tabular-nums ${
                    filterTab === t.id ? "bg-white/25" : "bg-brand/10 text-brand"
                  }`}
                >
                  {t.count}
                </span>
              ) : null}
            </button>
          ))}
        </nav>
        <input
          className="input-field w-full sm:max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search subject, student, or ID…"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className={`space-y-2 ${selected && selectedId ? "hidden lg:block" : ""}`}>
          {loading ? (
            <p className="empty-state">Loading messages…</p>
          ) : filteredRows.length === 0 ? (
            <div className="empty-state">
              {rows.length === 0
                ? "No student messages yet. Students message you from Ask teacher in their portal."
                : "No messages match this filter or search."}
            </div>
          ) : (
            filteredRows.map((q) => {
              const e = q.student.enrollments[0];
              const classLabel = e ? `${e.class.name}-${e.section.name}` : "";
              const active = q.id === selectedId;
              const meta = STATUS_META[q.status as QueryStatus] ?? STATUS_META.OPEN;
              const preview = q.body.length > 100 ? `${q.body.slice(0, 100)}…` : q.body;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setSelectedId(q.id)}
                  className={`flex w-full gap-3 rounded-xl border px-3 py-3 text-left transition-shadow sm:px-4 ${
                    active
                      ? "border-brand/45 bg-brand/[0.04] shadow-[var(--shadow-card-hover)]"
                      : "border-border bg-surface hover:border-brand/25 hover:shadow-[var(--shadow-card)]"
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      active ? "bg-brand text-white" : "bg-brand/10 text-brand"
                    }`}
                  >
                    {studentInitials(q.student.firstName, q.student.lastName)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <span className="line-clamp-1 font-semibold text-heading">{q.subject}</span>
                      <span className="shrink-0 text-xs tabular-nums text-muted">{formatWhen(q.createdAt)}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted">
                      {q.student.firstName} {q.student.lastName} · {q.student.studentId}
                      {classLabel ? ` · ${classLabel}` : ""}
                    </p>
                    <p className="mt-1.5 line-clamp-2 text-sm text-foreground/85">{preview}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide ring-1 ring-inset ${meta.tone}`}
                      >
                        {meta.label}
                      </span>
                      {!q.teacherReply && q.status !== "CLOSED" ? (
                        <span className="text-[0.625rem] font-semibold uppercase tracking-wide text-amber-800">
                          Reply pending
                        </span>
                      ) : null}
                    </div>
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className={!selected ? "hidden lg:block" : ""}>
          {!selected ? (
            <div className="empty-state lg:min-h-[18rem] lg:flex lg:flex-col lg:items-center lg:justify-center">
              <p className="font-medium text-heading">Select a message</p>
              <p className="mt-1 max-w-sm text-sm">Read the student&apos;s question and send a reply from here.</p>
            </div>
          ) : (
            <article className="card-panel overflow-hidden">
              <div className="border-b border-border bg-gradient-to-r from-brand/8 via-transparent to-transparent px-4 py-4 sm:px-5">
                <button
                  type="button"
                  className="mb-3 text-sm font-medium text-brand lg:hidden"
                  onClick={() => setSelectedId(null)}
                >
                  ← Back to inbox
                </button>
                <div className="flex gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
                    {studentInitials(selected.student.firstName, selected.student.lastName)}
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold leading-snug text-heading">{selected.subject}</h2>
                    <p className="mt-0.5 text-sm text-muted">
                      {selected.student.firstName} {selected.student.lastName} · {selected.student.studentId}
                      {selected.student.enrollments[0]
                        ? ` · ${selected.student.enrollments[0].class.name}-${selected.student.enrollments[0].section.name} · Roll ${selected.student.enrollments[0].rollNumber}`
                        : ""}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Received {new Date(selected.createdAt).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="form-shell space-y-5">
                <div className="rounded-xl border border-border bg-[color-mix(in_srgb,var(--surface-muted)_45%,transparent)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">Student message</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                    {selected.body}
                  </p>
                </div>

                {selected.teacherReply && (
                  <div className="rounded-xl border border-brand/20 bg-brand/[0.04] p-4">
                    <p className="text-xs font-semibold text-brand">Your previous reply</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{selected.teacherReply}</p>
                  </div>
                )}

                <div>
                  <p className="form-section-title">Update status</p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {STATUSES.map((s) => {
                      const meta = STATUS_META[s];
                      const active = status === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setStatus(s)}
                          className={`rounded-xl border px-3 py-2.5 text-left ring-1 ring-inset transition-colors ${
                            active
                              ? `${meta.tone} border-transparent ring-2`
                              : "border-border ring-transparent hover:border-brand/25"
                          }`}
                        >
                          <span className="block text-sm font-semibold text-heading">{meta.label}</span>
                          <span className="mt-0.5 block text-xs text-muted">{meta.description}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <label className="block text-sm">
                  <span className="font-medium text-heading">Reply to student</span>
                  <textarea
                    rows={5}
                    className="input-field mt-1.5 w-full min-h-[6rem]"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Write a clear, helpful response. The student will see this when you mark the thread resolved."
                  />
                </label>

                <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-muted">
                    Tip: set status to <strong className="font-semibold text-foreground">Resolved</strong> after
                    sending your reply so the student is notified in their portal.
                  </p>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={save}
                    className="btn-primary shrink-0 px-6 disabled:opacity-50"
                  >
                    {saving ? "Saving…" : "Save reply & status"}
                  </button>
                </div>
              </div>
            </article>
          )}
        </div>
      </div>
    </>
  );
}
