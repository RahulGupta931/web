"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import { studentNavLabel } from "@/config/nav";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

type QueryRow = {
  id: string;
  subject: string;
  body: string;
  status: string;
  teacherReply: string | null;
  createdAt: string;
  assignedTeacher: { firstName: string; lastName: string; employeeId: string } | null;
};

type QueryStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

type PageTab = "compose" | "inbox";
type FilterTab = "all" | "active" | "done";

const STATUS_META: Record<QueryStatus, { label: string; tone: string; hint: string }> = {
  OPEN: {
    label: "Open",
    tone: "bg-sky-500/12 text-sky-900 ring-sky-500/20",
    hint: "Sent — your teacher will review soon",
  },
  IN_PROGRESS: {
    label: "In progress",
    tone: "bg-violet-500/12 text-violet-900 ring-violet-500/20",
    hint: "Your teacher is working on a reply",
  },
  RESOLVED: {
    label: "Resolved",
    tone: "bg-emerald-500/12 text-emerald-900 ring-emerald-500/20",
    hint: "Reply available below",
  },
  CLOSED: {
    label: "Closed",
    tone: "bg-slate-500/12 text-slate-700 ring-slate-500/15",
    hint: "No further updates expected",
  },
};

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

function teacherLabel(t: QueryRow["assignedTeacher"]) {
  if (!t) return "Class teacher";
  return `${t.firstName} ${t.lastName}`;
}

function StatCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-2.5 shadow-[var(--shadow-card)] sm:px-4 sm:py-3">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-xl font-bold tabular-nums text-heading sm:text-2xl">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-muted">{sub}</p> : null}
    </div>
  );
}

function QueriesSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-28 animate-pulse rounded-2xl bg-surface-muted" />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-surface-muted" />
        ))}
      </div>
      <div className="h-48 animate-pulse rounded-2xl bg-surface-muted" />
    </div>
  );
}

export function StudentQueriesExperience() {
  const { loading: authLoading } = useAuth();
  const { get, post, isReady } = useApi();

  const [rows, setRows] = useState<QueryRow[]>([]);
  const [pageTab, setPageTab] = useState<PageTab>("inbox");
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    if (!isReady) {
      setLoading(false);
      return Promise.resolve();
    }
    setLoading(true);
    setError(null);
    return get<QueryRow[]>("/api/student/queries")
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setRows(list);
        setSelectedId((prev) => (prev && list.some((r) => r.id === prev) ? prev : null));
      })
      .catch((e) => {
        setRows([]);
        setError(getApiErrorMessage(e));
      })
      .finally(() => setLoading(false));
  }, [get, isReady]);

  useEffect(() => {
    if (authLoading) return;
    load();
  }, [authLoading, load]);

  const stats = useMemo(() => {
    const active = rows.filter((r) => r.status === "OPEN" || r.status === "IN_PROGRESS").length;
    const withReply = rows.filter((r) => r.teacherReply).length;
    const awaiting = rows.filter((r) => !r.teacherReply && r.status !== "CLOSED").length;
    return { total: rows.length, active, withReply, awaiting };
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
        (r.teacherReply?.toLowerCase().includes(q) ?? false)
    );
  }, [rows, filterTab, search]);

  const selected =
    filteredRows.find((r) => r.id === selectedId) ?? rows.find((r) => r.id === selectedId) ?? null;

  const classTeacherName = useMemo(() => {
    const fromRow = rows.find((r) => r.assignedTeacher)?.assignedTeacher;
    return fromRow ? teacherLabel(fromRow) : "your class teacher";
  }, [rows]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      const created = await post<QueryRow>("/api/student/queries", { subject, body });
      setMessage("Your message was sent to your class teacher.");
      setSubject("");
      setBody("");
      await load();
      if (created?.id) {
        setSelectedId(created.id);
        setPageTab("inbox");
      } else {
        setPageTab("inbox");
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  const filterTabs: { id: FilterTab; label: string; count?: number }[] = [
    { id: "all", label: "All", count: stats.total },
    { id: "active", label: "Waiting", count: stats.active },
    { id: "done", label: "Answered", count: stats.withReply },
  ];

  return (
    <>
      <PanelAlerts error={error} message={message} messageTitle="Message sent" />
      <PageHeader
        title={studentNavLabel("/student/queries")}
        description="Submit a question or request. Your class teacher can reply here."
        actions={
          <Link href="/student" className="btn-secondary shrink-0 text-sm">
            Dashboard
          </Link>
        }
      />

      {loading && rows.length === 0 && !error ? (
        <QueriesSkeleton />
      ) : (
        <div className="space-y-6">
          <section
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand-light px-5 py-6 text-white shadow-[var(--shadow-card)]"
            aria-label="Messages summary"
          >
            <div className="pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-full bg-brand-gold/25 blur-2xl" />
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">
              Class teacher inbox
            </p>
            <h2 className="mt-0.5 text-xl font-bold tracking-tight sm:text-2xl">
              Message {classTeacherName}
            </h2>
            <p className="mt-2 text-sm text-white/85">
              {stats.awaiting > 0
                ? `${stats.awaiting} thread${stats.awaiting === 1 ? "" : "s"} awaiting a reply`
                : "Questions about homework, leave, or school — send a note anytime."}
            </p>
          </section>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
            <StatCard label="Messages" value={stats.total} sub="You have sent" />
            <StatCard label="Waiting" value={stats.active} sub="Open or in progress" />
            <StatCard label="With reply" value={stats.withReply} sub="Teacher responded" />
          </div>

          <nav
            className="flex gap-1 rounded-xl border border-border bg-surface p-1 shadow-[var(--shadow-card)]"
            aria-label="Ask teacher sections"
          >
            {(
              [
                ["inbox", `Inbox (${stats.total})`],
                ["compose", "New message"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setPageTab(id)}
                className={`flex flex-1 items-center justify-center rounded-lg px-2 py-2.5 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
                  pageTab === id
                    ? "bg-brand text-white shadow-sm"
                    : "text-muted hover:bg-surface-muted hover:text-heading"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {pageTab === "compose" ? (
            <form onSubmit={onSubmit} className="card-panel form-shell max-w-2xl space-y-4">
              <p className="form-section-title">New message</p>
              <p className="text-sm text-muted">
                This goes to <span className="font-medium text-heading">{classTeacherName}</span> for your
                current class section.
              </p>
              <label className="block text-sm">
                <span className="text-muted">Subject</span>
                <input
                  required
                  minLength={3}
                  className="input-field mt-1"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Leave for sports day"
                />
              </label>
              <label className="block text-sm">
                <span className="text-muted">Message</span>
                <textarea
                  required
                  minLength={10}
                  rows={5}
                  className="input-field mt-1"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write your question or request…"
                />
              </label>
              <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
                {submitting ? "Sending…" : "Send to class teacher"}
              </button>
            </form>
          ) : (
            <>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
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
                  placeholder="Search subject or message…"
                />
              </div>

              <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                <div className={`space-y-2 ${selected && selectedId ? "hidden lg:block" : ""}`}>
                  {filteredRows.length === 0 ? (
                    <div className="empty-state">
                      {rows.length === 0
                        ? "No messages yet. Use New message to ask your class teacher a question."
                        : "No messages match this filter or search."}
                    </div>
                  ) : (
                    filteredRows.map((q) => {
                      const active = q.id === selectedId;
                      const meta = STATUS_META[q.status as QueryStatus] ?? STATUS_META.OPEN;
                      const preview = q.body.length > 100 ? `${q.body.slice(0, 100)}…` : q.body;
                      return (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => setSelectedId(q.id)}
                          className={`flex w-full flex-col rounded-xl border px-3 py-3 text-left transition-shadow sm:px-4 ${
                            active
                              ? "border-brand/45 bg-brand/[0.04] shadow-[var(--shadow-card-hover)]"
                              : "border-border bg-surface hover:border-brand/25 hover:shadow-[var(--shadow-card)]"
                          }`}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <span className="line-clamp-1 font-semibold text-heading">{q.subject}</span>
                            <span className="shrink-0 text-xs tabular-nums text-muted">{formatWhen(q.createdAt)}</span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-sm text-foreground/85">{preview}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide ring-1 ring-inset ${meta.tone}`}
                            >
                              {meta.label}
                            </span>
                            {q.teacherReply ? (
                              <span className="text-[0.625rem] font-semibold uppercase tracking-wide text-emerald-800">
                                Reply received
                              </span>
                            ) : q.status !== "CLOSED" ? (
                              <span className="text-[0.625rem] font-semibold uppercase tracking-wide text-amber-800">
                                Awaiting reply
                              </span>
                            ) : null}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

                <div className={!selected ? "hidden lg:block" : ""}>
                  {!selected ? (
                    <div className="empty-state lg:min-h-[16rem] lg:flex lg:flex-col lg:items-center lg:justify-center">
                      <p className="font-medium text-heading">Select a message</p>
                      <p className="mt-1 max-w-sm text-sm text-muted">
                        Read your question and any reply from your class teacher.
                      </p>
                      <button
                        type="button"
                        className="btn-secondary mt-4 text-sm"
                        onClick={() => setPageTab("compose")}
                      >
                        New message
                      </button>
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
                        <h2 className="text-lg font-bold leading-snug text-heading">{selected.subject}</h2>
                        <p className="mt-1 text-xs text-muted">
                          Sent {new Date(selected.createdAt).toLocaleString("en-IN")} · To{" "}
                          {teacherLabel(selected.assignedTeacher)}
                        </p>
                        <div className="mt-2">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide ring-1 ring-inset ${
                              (STATUS_META[selected.status as QueryStatus] ?? STATUS_META.OPEN).tone
                            }`}
                          >
                            {(STATUS_META[selected.status as QueryStatus] ?? STATUS_META.OPEN).label}
                          </span>
                          <p className="mt-1 text-xs text-muted">
                            {(STATUS_META[selected.status as QueryStatus] ?? STATUS_META.OPEN).hint}
                          </p>
                        </div>
                      </div>

                      <div className="form-shell space-y-4">
                        <div className="rounded-xl border border-border bg-[color-mix(in_srgb,var(--surface-muted)_45%,transparent)] p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Your message</p>
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                            {selected.body}
                          </p>
                        </div>

                        {selected.teacherReply ? (
                          <div className="rounded-xl border border-brand/20 bg-brand/[0.04] p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-brand">Teacher reply</p>
                            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{selected.teacherReply}</p>
                          </div>
                        ) : selected.status !== "CLOSED" ? (
                          <p className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted">
                            No reply yet. Your teacher will respond here when available.
                          </p>
                        ) : null}
                      </div>
                    </article>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
