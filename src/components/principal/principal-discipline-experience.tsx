"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import { principalNavLabel } from "@/config/nav";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

type ComplaintRow = {
  id: string;
  complaintNumber: string;
  incidentDate: string;
  incidentTime?: string | null;
  category: string;
  severity: string;
  status: string;
  description: string;
  classTeacherComment: string | null;
  principalReview: string | null;
  actionTaken: string | null;
  resolutionNotes: string | null;
  followUpDate: string | null;
  student: { firstName: string; lastName: string; studentId: string };
  section: { name: string; class: { name: string } };
  reportingTeacher: { firstName: string; lastName: string; employeeId: string };
};

const STATUSES = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "ACTION_REQUIRED",
  "RESOLVED",
  "CLOSED",
] as const;

const SEVERITY_OPTIONS = [
  { id: "LOW", label: "Low", tone: "bg-emerald-500/15 text-emerald-800 ring-emerald-500/25" },
  { id: "MEDIUM", label: "Medium", tone: "bg-amber-500/15 text-amber-900 ring-amber-500/30" },
  { id: "HIGH", label: "High", tone: "bg-orange-500/15 text-orange-900 ring-orange-500/30" },
  { id: "CRITICAL", label: "Critical", tone: "bg-red-500/15 text-red-900 ring-red-500/35" },
] as const;

const OPEN_STATUSES = new Set(["SUBMITTED", "UNDER_REVIEW", "ACTION_REQUIRED"]);

type StatusFilter = "all" | (typeof STATUSES)[number];

function labelCategory(c: string) {
  return c.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (x) => x.toUpperCase());
}

function formatStatus(s: string) {
  return s.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (x) => x.toUpperCase());
}

function statusTone(status: string): string {
  switch (status) {
    case "SUBMITTED":
      return "bg-sky-500/12 text-sky-900";
    case "UNDER_REVIEW":
      return "bg-violet-500/12 text-violet-900";
    case "ACTION_REQUIRED":
      return "bg-amber-500/15 text-amber-950";
    case "RESOLVED":
      return "bg-emerald-500/12 text-emerald-900";
    case "CLOSED":
      return "bg-slate-500/12 text-slate-700";
    default:
      return "bg-surface-muted text-muted";
  }
}

function severityTone(sev: string): string {
  return SEVERITY_OPTIONS.find((s) => s.id === sev)?.tone ?? "bg-surface-muted text-muted";
}

function studentInitials(first: string, last: string) {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
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

export function PrincipalDisciplineExperience() {
  const { get, patch } = useApi();
  const [rows, setRows] = useState<ComplaintRow[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("SUBMITTED");
  const [severity, setSeverity] = useState<(typeof SEVERITY_OPTIONS)[number]["id"]>("MEDIUM");
  const [principalReview, setPrincipalReview] = useState("");
  const [actionTaken, setActionTaken] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    get<ComplaintRow[]>("/api/principal/discipline")
      .then((data) => setRows(Array.isArray(data) ? data : []))
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
    const open = rows.filter((r) => OPEN_STATUSES.has(r.status)).length;
    const actionRequired = rows.filter((r) => r.status === "ACTION_REQUIRED").length;
    const resolved = rows.filter((r) => r.status === "RESOLVED" || r.status === "CLOSED").length;
    return { total: rows.length, open, actionRequired, resolved };
  }, [rows]);

  const filtered = useMemo(() => {
    let list = rows;
    if (statusFilter !== "all") list = list.filter((r) => r.status === statusFilter);
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (c) =>
        c.complaintNumber.toLowerCase().includes(q) ||
        `${c.student.firstName} ${c.student.lastName}`.toLowerCase().includes(q) ||
        c.student.studentId.toLowerCase().includes(q) ||
        `${c.reportingTeacher.firstName} ${c.reportingTeacher.lastName}`.toLowerCase().includes(q)
    );
  }, [rows, statusFilter, search]);

  const selected =
    filtered.find((r) => r.id === selectedId) ?? rows.find((r) => r.id === selectedId) ?? null;

  useEffect(() => {
    if (!selected) return;
    setStatus(selected.status as (typeof STATUSES)[number]);
    setSeverity(selected.severity as (typeof SEVERITY_OPTIONS)[number]["id"]);
    setPrincipalReview(selected.principalReview ?? "");
    setActionTaken(selected.actionTaken ?? "");
    setResolutionNotes(selected.resolutionNotes ?? "");
    setFollowUpDate(selected.followUpDate?.slice(0, 10) ?? "");
  }, [selected?.id]);

  async function save() {
    if (!selectedId) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await patch(`/api/principal/discipline/${selectedId}`, {
        status,
        severity,
        principalReview,
        actionTaken,
        resolutionNotes,
        followUpDate: followUpDate || null,
      });
      setMessage("Complaint updated.");
      load();
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  const filters: { id: StatusFilter; label: string; count?: number }[] = [
    { id: "all", label: "All", count: stats.total },
    { id: "SUBMITTED", label: "Submitted", count: rows.filter((r) => r.status === "SUBMITTED").length },
    { id: "UNDER_REVIEW", label: "Under review", count: rows.filter((r) => r.status === "UNDER_REVIEW").length },
    {
      id: "ACTION_REQUIRED",
      label: "Action required",
      count: rows.filter((r) => r.status === "ACTION_REQUIRED").length,
    },
    { id: "RESOLVED", label: "Resolved", count: rows.filter((r) => r.status === "RESOLVED").length },
    { id: "CLOSED", label: "Closed", count: rows.filter((r) => r.status === "CLOSED").length },
  ];

  const reviewPanel = selected ? (
    <article className="card-panel overflow-hidden">
      <div className="border-b border-border bg-gradient-to-r from-brand/8 via-transparent to-transparent px-4 py-4 sm:px-5">
        <button
          type="button"
          className="mb-3 text-sm font-medium text-brand lg:hidden"
          onClick={() => setSelectedId(null)}
        >
          ← Back to list
        </button>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-lg font-bold text-brand">{selected.complaintNumber}</p>
            <p className="mt-1 text-sm text-muted">
              Incident{" "}
              {new Date(selected.incidentDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              {selected.incidentTime ? ` · ${selected.incidentTime}` : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide ${statusTone(selected.status)}`}
            >
              {formatStatus(selected.status)}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[0.625rem] font-semibold ring-1 ring-inset ${severityTone(selected.severity)}`}
            >
              {selected.severity}
            </span>
          </div>
        </div>
      </div>

      <div className="form-shell space-y-4 text-sm">
        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Student</dt>
            <dd className="mt-0.5 font-medium text-heading">
              {selected.student.firstName} {selected.student.lastName} ({selected.student.studentId})
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Class</dt>
            <dd className="mt-0.5 font-medium text-heading">
              {selected.section.class.name}-{selected.section.name}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Reported by</dt>
            <dd className="mt-0.5 font-medium text-heading">
              {selected.reportingTeacher.firstName} {selected.reportingTeacher.lastName} (
              {selected.reportingTeacher.employeeId})
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Category</dt>
            <dd className="mt-0.5 font-medium text-heading">{labelCategory(selected.category)}</dd>
          </div>
        </dl>

        {selected.classTeacherComment && (
          <div className="rounded-xl border border-violet-500/25 bg-violet-500/8 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-900">Class teacher note</p>
            <p className="mt-2 whitespace-pre-wrap text-foreground">{selected.classTeacherComment}</p>
          </div>
        )}

        <div className="rounded-xl border border-border bg-surface-muted/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Incident description</p>
          <p className="mt-2 whitespace-pre-wrap text-heading">{selected.description}</p>
        </div>

        <div className="space-y-4 border-t border-border pt-4">
          <label className="block text-sm">
            <span className="font-medium text-heading">Status</span>
            <select
              className="input-field mt-1.5 w-full"
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{formatStatus(s)}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-medium text-heading">Severity</span>
            <select
              className="input-field mt-1.5 w-full"
              value={severity}
              onChange={(e) => setSeverity(e.target.value as typeof severity)}
            >
              {SEVERITY_OPTIONS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-medium text-heading">Principal review</span>
            <textarea
              className="input-field mt-1.5 w-full min-h-[5rem]"
              rows={3}
              value={principalReview}
              onChange={(e) => setPrincipalReview(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-heading">Action taken</span>
            <textarea
              className="input-field mt-1.5 w-full"
              rows={2}
              value={actionTaken}
              onChange={(e) => setActionTaken(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-heading">Resolution notes</span>
            <textarea
              className="input-field mt-1.5 w-full"
              rows={2}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-heading">Follow-up date</span>
            <input
              type="date"
              className="input-field mt-1.5 w-full"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
            />
          </label>
          <button type="button" className="btn-primary" disabled={saving} onClick={save}>
            {saving ? "Saving…" : "Save review"}
          </button>
        </div>
      </div>
    </article>
  ) : null;

  return (
    <>
      <PanelAlerts error={error} message={message} messageTitle="Saved" />

      <PageHeader
        title={principalNavLabel("/principal/discipline")}
        description="Review incident reports from teachers, record decisions, and close cases."
      />

      <section
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand-light px-5 py-6 text-white shadow-[var(--shadow-card)]"
        aria-label="Discipline queue"
      >
        <div className="pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-full bg-brand-gold/25 blur-2xl" />
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">Incidents</p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
          {loading ? "Loading…" : `${stats.open} open case${stats.open === 1 ? "" : "s"}`}
        </h2>
        <p className="mt-2 text-sm text-white/85">
          {stats.actionRequired} need action · teachers file from Teacher → Incidents
        </p>
      </section>

      <div className="grid gap-3 sm:grid-cols-4">
        <StatCard label="Open" value={loading ? "—" : stats.open} sub="Submitted / in review" />
        <StatCard label="Action required" value={loading ? "—" : stats.actionRequired} />
        <StatCard label="Resolved / closed" value={loading ? "—" : stats.resolved} />
        <StatCard label="Total" value={loading ? "—" : stats.total} />
      </div>

      <div className="card-panel form-shell space-y-4">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                setStatusFilter(f.id);
                setSelectedId(null);
              }}
              className={`rounded-full border px-3 py-1 text-sm font-medium ${
                statusFilter === f.id
                  ? "border-brand bg-brand text-white"
                  : "border-border text-muted hover:border-brand/30"
              }`}
            >
              {f.label}
              {f.count != null && f.count > 0 ? ` (${f.count})` : ""}
            </button>
          ))}
        </div>
        <input
          type="search"
          className="input-field w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search reference, student, or teacher…"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className={`space-y-2 ${selected ? "hidden lg:block" : ""}`}>
          {loading ? (
            <p className="empty-state">Loading complaints…</p>
          ) : filtered.length === 0 ? (
            <p className="empty-state">
              {rows.length === 0 ? "No complaints yet." : "No complaints match your filter or search."}
            </p>
          ) : (
            filtered.map((c) => {
              const active = c.id === selectedId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedId(c.id)}
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
                    {studentInitials(c.student.firstName, c.student.lastName)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <span className="font-mono text-sm font-semibold text-brand">{c.complaintNumber}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide ${statusTone(c.status)}`}
                      >
                        {formatStatus(c.status)}
                      </span>
                    </div>
                    <p className="mt-1 font-medium text-heading">
                      {c.student.firstName} {c.student.lastName}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {c.section.class.name}-{c.section.name} · {labelCategory(c.category)} ·{" "}
                      {c.incidentDate.slice(0, 10)}
                    </p>
                    <span
                      className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[0.625rem] font-semibold ring-1 ring-inset ${severityTone(c.severity)}`}
                    >
                      {c.severity}
                    </span>
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className={!selected ? "hidden lg:block" : ""}>
          {!selected ? (
            <div className="empty-state lg:min-h-[18rem] lg:flex lg:flex-col lg:items-center lg:justify-center">
              <p className="font-medium text-heading">Select a complaint</p>
              <p className="mt-1 max-w-sm text-sm text-muted">
                Read the incident, class teacher notes, and record your review.
              </p>
            </div>
          ) : (
            reviewPanel
          )}
        </div>
      </div>
    </>
  );
}
