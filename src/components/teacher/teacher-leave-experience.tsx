"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import { teacherNavLabel } from "@/config/nav";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

const LEAVE_TYPES = [
  { id: "SICK", label: "Sick leave", hint: "Medical or health-related absence" },
  { id: "CASUAL", label: "Casual leave", hint: "Personal or planned time off" },
  { id: "EMERGENCY", label: "Emergency", hint: "Urgent, unforeseen circumstances" },
  { id: "OTHER", label: "Other", hint: "Describe clearly in the reason field" },
] as const;

type LeaveTypeId = (typeof LEAVE_TYPES)[number]["id"];

type LeaveRow = {
  id: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  reason: string | null;
  createdAt: string;
  reviewedAt: string | null;
};

type ViewTab = "apply" | "history";
type HistoryFilter = "all" | "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

const STATUS_META: Record<
  string,
  { label: string; tone: string; description: string }
> = {
  PENDING: {
    label: "Pending",
    tone: "bg-amber-500/15 text-amber-950 ring-amber-500/25",
    description: "Waiting for principal approval",
  },
  APPROVED: {
    label: "Approved",
    tone: "bg-emerald-500/12 text-emerald-900 ring-emerald-500/20",
    description: "Confirmed by administration",
  },
  REJECTED: {
    label: "Rejected",
    tone: "bg-red-500/12 text-red-900 ring-red-500/25",
    description: "Not approved — contact the office if needed",
  },
  CANCELLED: {
    label: "Cancelled",
    tone: "bg-slate-500/12 text-slate-700 ring-slate-500/15",
    description: "Withdrawn or cancelled",
  },
};

function leaveTypeLabel(type: string) {
  return LEAVE_TYPES.find((t) => t.id === type)?.label ?? type;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function inclusiveDays(start: string, end: string): number | null {
  if (!start || !end) return null;
  const a = new Date(start);
  const b = new Date(end);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime()) || b < a) return null;
  const ms = b.getTime() - a.getTime();
  return Math.floor(ms / (24 * 60 * 60 * 1000)) + 1;
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

export function TeacherLeaveExperience() {
  const { get, post } = useApi();
  const [rows, setRows] = useState<LeaveRow[]>([]);
  const [tab, setTab] = useState<ViewTab>("apply");
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<LeaveTypeId>("CASUAL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    get<LeaveRow[]>("/api/teacher/leave")
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
    const pending = rows.filter((r) => r.status === "PENDING").length;
    const approved = rows.filter((r) => r.status === "APPROVED").length;
    const rejected = rows.filter((r) => r.status === "REJECTED").length;
    return { total: rows.length, pending, approved, rejected };
  }, [rows]);

  const draftDays = inclusiveDays(startDate, endDate);

  const filteredHistory = useMemo(() => {
    if (historyFilter === "all") return rows;
    return rows.filter((r) => r.status === historyFilter);
  }, [rows, historyFilter]);

  const selected = filteredHistory.find((r) => r.id === selectedId) ?? rows.find((r) => r.id === selectedId) ?? null;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (draftDays === null) {
      setError("End date must be on or after the start date.");
      return;
    }
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      await post("/api/teacher/leave", { type, startDate, endDate, reason: reason.trim() || undefined });
      setMessage("Leave request submitted. The principal will review it.");
      setReason("");
      setStartDate("");
      setEndDate("");
      load();
      setTab("history");
      setHistoryFilter("PENDING");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  const historyFilters: { id: HistoryFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "PENDING", label: "Pending" },
    { id: "APPROVED", label: "Approved" },
    { id: "REJECTED", label: "Rejected" },
  ];

  return (
    <>
      <PanelAlerts error={error} message={message} messageTitle="Submitted" />
      <PageHeader
        title={teacherNavLabel("/teacher/leave")}
        description="Apply for time off and track approval from the principal. Submit early when possible."
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <StatCard label="Total requests" value={stats.total} />
        <StatCard
          label="Pending"
          value={stats.pending}
          sub={stats.pending ? "Awaiting decision" : "None waiting"}
        />
        <StatCard label="Approved" value={stats.approved} />
        <StatCard label="Rejected" value={stats.rejected} />
      </div>

      <nav
        className="mt-6 flex gap-1 rounded-xl border border-border bg-surface p-1 shadow-[var(--shadow-card)]"
        aria-label="Leave sections"
      >
        {(
          [
            ["apply", "New request"],
            ["history", "My requests", stats.pending],
          ] as const
        ).map(([id, label, badge]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setTab(id);
              setSelectedId(null);
            }}
            className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              tab === id ? "bg-brand text-white shadow-sm" : "text-muted hover:bg-surface-muted hover:text-heading"
            }`}
          >
            {label}
            {id === "history" && badge != null && badge > 0 ? (
              <span
                className={`min-w-[1.25rem] rounded-full px-1.5 py-0.5 text-[0.625rem] font-bold tabular-nums ${
                  tab === id ? "bg-white/25 text-white" : "bg-brand/10 text-brand"
                }`}
              >
                {badge}
              </span>
            ) : null}
          </button>
        ))}
      </nav>

      {tab === "apply" ? (
        <form onSubmit={onSubmit} className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
          <section className="card-panel overflow-hidden">
            <div className="border-b border-border bg-gradient-to-r from-brand/8 via-transparent to-transparent px-4 py-3 sm:px-5">
              <p className="form-section-title">Leave type</p>
              <p className="mt-1 text-sm text-muted">Choose the category that best matches your request.</p>
            </div>
            <div className="form-shell grid gap-2 sm:grid-cols-2">
              {LEAVE_TYPES.map((t) => {
                const active = type === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id)}
                    className={`rounded-xl border px-3 py-3 text-left transition-colors ${
                      active
                        ? "border-brand bg-brand/5 ring-1 ring-brand/25"
                        : "border-border hover:border-brand/30"
                    }`}
                  >
                    <span className="block text-sm font-semibold text-heading">{t.label}</span>
                    <span className="mt-0.5 block text-xs text-muted">{t.hint}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="card-panel overflow-hidden">
            <div className="border-b border-border bg-gradient-to-r from-brand/8 via-transparent to-transparent px-4 py-3 sm:px-5">
              <p className="form-section-title">Dates & reason</p>
              <p className="mt-1 text-sm text-muted">Include the full span of days you will be away.</p>
            </div>
            <div className="form-shell space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="font-medium text-heading">From</span>
                  <input
                    type="date"
                    required
                    className="input-field mt-1.5 w-full"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-heading">To</span>
                  <input
                    type="date"
                    required
                    className="input-field mt-1.5 w-full"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || undefined}
                  />
                </label>
              </div>

              {draftDays != null && startDate && endDate && (
                <p className="rounded-lg border border-brand/15 bg-brand/[0.04] px-3 py-2 text-sm text-heading">
                  <span className="font-semibold">{draftDays}</span> calendar day{draftDays === 1 ? "" : "s"} requested
                  <span className="text-muted"> ({formatDate(startDate)} – {formatDate(endDate)})</span>
                </p>
              )}
              {startDate && endDate && draftDays === null && (
                <p className="text-sm text-red-700">End date must not be before the start date.</p>
              )}

              <label className="block text-sm">
                <span className="font-medium text-heading">Reason (optional)</span>
                <textarea
                  className="input-field mt-1.5 w-full"
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Brief note for the principal — e.g. family event, medical appointment"
                />
              </label>

              <div className="border-t border-border pt-4">
                <button
                  type="submit"
                  disabled={submitting || draftDays === null}
                  className="btn-primary w-full px-6 sm:w-auto disabled:opacity-50"
                >
                  {submitting ? "Submitting…" : "Submit leave request"}
                </button>
              </div>
            </div>
          </section>
        </form>
      ) : (
        <div className="mt-6">
          <div className="mb-4 flex flex-wrap gap-2">
            {historyFilters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setHistoryFilter(f.id);
                  setSelectedId(null);
                }}
                className={`rounded-full border px-3 py-1 text-sm font-medium ${
                  historyFilter === f.id
                    ? "border-brand bg-brand text-white"
                    : "border-border text-muted hover:border-brand/30"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div className={`space-y-2 ${selected ? "hidden lg:block" : ""}`}>
              {loading ? (
                <p className="empty-state">Loading requests…</p>
              ) : filteredHistory.length === 0 ? (
                <div className="empty-state">
                  {rows.length === 0
                    ? "No leave requests yet. Submit one from the New request tab."
                    : "No requests in this filter."}
                </div>
              ) : (
                filteredHistory.map((r) => {
                  const active = r.id === selectedId;
                  const meta = STATUS_META[r.status] ?? STATUS_META.PENDING;
                  const days = inclusiveDays(r.startDate, r.endDate);
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedId(r.id)}
                      className={`w-full rounded-xl border px-4 py-3 text-left transition-shadow ${
                        active
                          ? "border-brand/45 bg-brand/[0.04] shadow-[var(--shadow-card-hover)]"
                          : "border-border bg-surface hover:border-brand/25 hover:shadow-[var(--shadow-card)]"
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <span className="font-semibold text-heading">{leaveTypeLabel(r.type)}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide ring-1 ring-inset ${meta.tone}`}
                        >
                          {meta.label}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-foreground">
                        {formatDate(r.startDate)} – {formatDate(r.endDate)}
                        {days != null ? (
                          <span className="text-muted"> · {days} day{days === 1 ? "" : "s"}</span>
                        ) : null}
                      </p>
                      {r.reason ? (
                        <p className="mt-1 line-clamp-1 text-xs text-muted">{r.reason}</p>
                      ) : null}
                      <p className="mt-1 text-xs text-muted">
                        Applied {formatDate(r.createdAt)}
                      </p>
                    </button>
                  );
                })
              )}
            </div>

            <div className={!selected ? "hidden lg:block" : ""}>
              {!selected ? (
                <div className="empty-state lg:min-h-[14rem] lg:flex lg:items-center lg:justify-center">
                  Select a request to view details
                </div>
              ) : (
                <article className="card-panel overflow-hidden">
                  <div className="border-b border-border bg-surface-muted/50 px-4 py-4 sm:px-5">
                    <button
                      type="button"
                      className="mb-3 text-sm font-medium text-brand lg:hidden"
                      onClick={() => setSelectedId(null)}
                    >
                      ← Back to list
                    </button>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-bold text-heading">{leaveTypeLabel(selected.type)}</p>
                        <p className="mt-1 text-sm text-muted">
                          Submitted {new Date(selected.createdAt).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${
                          (STATUS_META[selected.status] ?? STATUS_META.PENDING).tone
                        }`}
                      >
                        {(STATUS_META[selected.status] ?? STATUS_META.PENDING).label}
                      </span>
                    </div>
                  </div>
                  <div className="form-shell space-y-4 text-sm">
                    <dl className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-muted">From</dt>
                        <dd className="mt-0.5 font-medium text-heading">{formatDate(selected.startDate)}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-muted">To</dt>
                        <dd className="mt-0.5 font-medium text-heading">{formatDate(selected.endDate)}</dd>
                      </div>
                    </dl>
                    {inclusiveDays(selected.startDate, selected.endDate) != null && (
                      <p className="text-muted">
                        Duration:{" "}
                        <span className="font-semibold text-heading">
                          {inclusiveDays(selected.startDate, selected.endDate)} day(s)
                        </span>
                      </p>
                    )}
                    <p className="text-xs text-muted">
                      {(STATUS_META[selected.status] ?? STATUS_META.PENDING).description}
                    </p>
                    {selected.reason && (
                      <div className="rounded-xl border border-border bg-[color-mix(in_srgb,var(--surface-muted)_40%,transparent)] p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Your reason</p>
                        <p className="mt-2 whitespace-pre-wrap leading-relaxed">{selected.reason}</p>
                      </div>
                    )}
                    {selected.reviewedAt && (
                      <p className="text-xs text-muted">
                        Reviewed {new Date(selected.reviewedAt).toLocaleString("en-IN")}
                      </p>
                    )}
                  </div>
                </article>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
