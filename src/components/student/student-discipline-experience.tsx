"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import { studentNavLabel } from "@/config/nav";
import { formatClassSection } from "@/lib/class-section-display";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

type ComplaintRow = {
  id: string;
  complaintNumber: string;
  incidentDate: string;
  incidentTime: string | null;
  category: string;
  description: string;
  severity: string;
  status: string;
  classTeacherComment: string | null;
  principalReview: string | null;
  actionTaken: string | null;
  resolutionNotes: string | null;
  followUpDate: string | null;
  resolvedAt: string | null;
  createdAt: string;
  studentResponse?: string | null;
  section: { name: string; class: { name: string } };
  reportingTeacher: { firstName: string; lastName: string; employeeId: string };
};

const OPEN_STATUSES = new Set(["SUBMITTED", "UNDER_REVIEW", "ACTION_REQUIRED"]);
type FilterTab = "all" | "open" | "closed";

const SEVERITY_TONE: Record<string, string> = {
  LOW: "bg-emerald-500/15 text-emerald-800 ring-emerald-500/25",
  MEDIUM: "bg-amber-500/15 text-amber-900 ring-amber-500/30",
  HIGH: "bg-orange-500/15 text-orange-900 ring-orange-500/30",
  CRITICAL: "bg-red-500/15 text-red-900 ring-red-500/35",
};

function labelCategory(c: string) {
  return c.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (x) => x.toUpperCase());
}

function formatStatus(s: string) {
  return s.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (x) => x.toUpperCase());
}

function statusTone(status: string): string {
  switch (status) {
    case "SUBMITTED":
      return "bg-sky-500/12 text-sky-900 ring-sky-500/20";
    case "UNDER_REVIEW":
      return "bg-violet-500/12 text-violet-900 ring-violet-500/20";
    case "ACTION_REQUIRED":
      return "bg-amber-500/15 text-amber-950 ring-amber-500/25";
    case "RESOLVED":
      return "bg-emerald-500/12 text-emerald-900 ring-emerald-500/20";
    case "CLOSED":
      return "bg-slate-500/12 text-slate-700 ring-slate-500/15";
    default:
      return "bg-surface-muted text-muted ring-border";
  }
}

function severityTone(sev: string) {
  return SEVERITY_TONE[sev] ?? "bg-surface-muted text-muted ring-border";
}

function formatIncidentDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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

function DisciplineSkeleton() {
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

export function StudentDisciplineExperience() {
  const { loading: authLoading } = useAuth();
  const { get, isReady } = useApi();
  const [rows, setRows] = useState<ComplaintRow[]>([]);
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!isReady) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    get<ComplaintRow[]>("/api/student/discipline")
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
    const open = rows.filter((r) => OPEN_STATUSES.has(r.status)).length;
    const closed = rows.filter((r) => r.status === "RESOLVED" || r.status === "CLOSED").length;
    const actionRequired = rows.filter((r) => r.status === "ACTION_REQUIRED").length;
    return { total: rows.length, open, closed, actionRequired };
  }, [rows]);

  const filteredRows = useMemo(() => {
    let list = rows;
    if (filterTab === "open") {
      list = list.filter((r) => OPEN_STATUSES.has(r.status));
    } else if (filterTab === "closed") {
      list = list.filter((r) => r.status === "RESOLVED" || r.status === "CLOSED");
    }
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (r) =>
        r.complaintNumber.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        labelCategory(r.category).toLowerCase().includes(q)
    );
  }, [rows, filterTab, search]);

  const selected =
    filteredRows.find((r) => r.id === selectedId) ?? rows.find((r) => r.id === selectedId) ?? null;

  const filterTabs: { id: FilterTab; label: string; count?: number }[] = [
    { id: "all", label: "All", count: stats.total },
    { id: "open", label: "In review", count: stats.open },
    { id: "closed", label: "Resolved", count: stats.closed },
  ];

  return (
    <>
      <PanelAlerts error={error} />
      <PageHeader
        title={studentNavLabel("/student/discipline")}
        description="Incidents concerning you and their review status. Official records are read-only here."
        actions={
          <Link href="/student" className="btn-secondary shrink-0 text-sm">
            Dashboard
          </Link>
        }
      />

      {loading && rows.length === 0 && !error ? (
        <DisciplineSkeleton />
      ) : (
        <div className="space-y-6">
          <section
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand-light px-5 py-6 text-white shadow-[var(--shadow-card)]"
            aria-label="Discipline summary"
          >
            <div className="pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-full bg-brand-gold/25 blur-2xl" />
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">
              Conduct record
            </p>
            <h2 className="mt-0.5 text-xl font-bold tracking-tight sm:text-2xl">
              {stats.total === 0
                ? "No incidents on file"
                : `${stats.total} record${stats.total === 1 ? "" : "s"}`}
            </h2>
            <p className="mt-2 text-sm text-white/85">
              {stats.actionRequired > 0
                ? `${stats.actionRequired} matter${stats.actionRequired === 1 ? "" : "s"} need your attention — check with your class teacher.`
                : stats.open > 0
                  ? `${stats.open} case${stats.open === 1 ? "" : "s"} still under school review.`
                  : "Keep up positive conduct. Speak to your class teacher if you have questions."}
            </p>
          </section>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
            <StatCard label="Total" value={stats.total} sub="On your record" />
            <StatCard label="In review" value={stats.open} sub="Submitted or active" />
            <StatCard label="Resolved" value={stats.closed} sub="Closed by school" />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <nav
              className="flex gap-1 rounded-xl border border-border bg-surface p-1 shadow-[var(--shadow-card)]"
              aria-label="Filter records"
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
              placeholder="Search number, category…"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div className={`space-y-2 ${selected && selectedId ? "hidden lg:block" : ""}`}>
              {filteredRows.length === 0 ? (
                <div className="empty-state">
                  {rows.length === 0
                    ? "No discipline records on file."
                    : "No records match this filter or search."}
                </div>
              ) : (
                filteredRows.map((c) => {
                  const active = c.id === selectedId;
                  const preview =
                    c.description.length > 90 ? `${c.description.slice(0, 90)}…` : c.description;
                  const classLabel = formatClassSection(c.section.class.name, c.section.name);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedId(c.id)}
                      className={`flex w-full flex-col rounded-xl border px-3 py-3 text-left transition-shadow sm:px-4 ${
                        active
                          ? "border-brand/45 bg-brand/[0.04] shadow-[var(--shadow-card-hover)]"
                          : "border-border bg-surface hover:border-brand/25 hover:shadow-[var(--shadow-card)]"
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <span className="font-mono text-sm font-semibold text-heading">{c.complaintNumber}</span>
                        <span className="text-xs tabular-nums text-muted">{formatIncidentDate(c.incidentDate)}</span>
                      </div>
                      <p className="mt-0.5 text-sm font-medium text-heading">{labelCategory(c.category)}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-foreground/85">{preview}</p>
                      <p className="mt-1 text-xs text-muted">{classLabel}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide ring-1 ring-inset ${statusTone(c.status)}`}
                        >
                          {formatStatus(c.status)}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide ring-1 ring-inset ${severityTone(c.severity)}`}
                        >
                          {c.severity}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <div className={!selected ? "hidden lg:block" : ""}>
              {!selected ? (
                <div className="empty-state lg:min-h-[16rem] lg:flex lg:flex-col lg:items-center lg:justify-center">
                  <p className="font-medium text-heading">Select a record</p>
                  <p className="mt-1 max-w-sm text-sm text-muted">
                    View incident details, school comments, and any action taken.
                  </p>
                </div>
              ) : (
                <article className="card-panel overflow-hidden">
                  <div className="border-b border-border bg-gradient-to-r from-brand/8 via-transparent to-transparent px-4 py-4 sm:px-5">
                    <button
                      type="button"
                      className="mb-3 text-sm font-medium text-brand lg:hidden"
                      onClick={() => setSelectedId(null)}
                    >
                      ← Back to list
                    </button>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-mono text-sm font-bold text-brand">{selected.complaintNumber}</p>
                        <h2 className="mt-1 text-lg font-bold text-heading">{labelCategory(selected.category)}</h2>
                        <p className="mt-1 text-xs text-muted">
                          Incident {formatIncidentDate(selected.incidentDate)}
                          {selected.incidentTime ? ` · ${selected.incidentTime}` : ""} ·{" "}
                          {formatClassSection(selected.section.class.name, selected.section.name)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide ring-1 ring-inset ${statusTone(selected.status)}`}
                        >
                          {formatStatus(selected.status)}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide ring-1 ring-inset ${severityTone(selected.severity)}`}
                        >
                          Severity {selected.severity}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="form-shell space-y-4 text-sm">
                    <div className="rounded-xl border border-border bg-[color-mix(in_srgb,var(--surface-muted)_45%,transparent)] p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted">What was reported</p>
                      <p className="mt-2 whitespace-pre-wrap leading-relaxed text-foreground">{selected.description}</p>
                      <p className="mt-3 text-xs text-muted">
                        Reported by {selected.reportingTeacher.firstName} {selected.reportingTeacher.lastName} (
                        {selected.reportingTeacher.employeeId})
                      </p>
                      <p className="text-xs text-muted">
                        Logged {new Date(selected.createdAt).toLocaleString("en-IN")}
                      </p>
                    </div>

                    {selected.classTeacherComment && (
                      <div className="rounded-xl border border-border bg-surface-muted/50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Class teacher</p>
                        <p className="mt-2 whitespace-pre-wrap">{selected.classTeacherComment}</p>
                      </div>
                    )}

                    {selected.principalReview && (
                      <div className="rounded-xl border border-brand/15 bg-brand/[0.04] p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-brand">Principal review</p>
                        <p className="mt-2 whitespace-pre-wrap">{selected.principalReview}</p>
                      </div>
                    )}

                    {selected.actionTaken && (
                      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-amber-950">Action taken</p>
                        <p className="mt-2 whitespace-pre-wrap">{selected.actionTaken}</p>
                      </div>
                    )}

                    {selected.resolutionNotes && (
                      <p className="text-xs text-muted">
                        <span className="font-semibold text-heading">Resolution notes:</span> {selected.resolutionNotes}
                      </p>
                    )}

                    {selected.followUpDate && (
                      <p className="text-xs text-muted">
                        <span className="font-semibold text-heading">Follow-up date:</span>{" "}
                        {formatIncidentDate(selected.followUpDate)}
                      </p>
                    )}

                    {selected.resolvedAt && (
                      <p className="text-xs text-muted">
                        <span className="font-semibold text-heading">Resolved:</span>{" "}
                        {formatIncidentDate(selected.resolvedAt)}
                      </p>
                    )}

                    {selected.studentResponse && (
                      <div className="rounded-xl border border-dashed border-border p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Your response on file</p>
                        <p className="mt-2 whitespace-pre-wrap">{selected.studentResponse}</p>
                      </div>
                    )}

                    <p className="border-t border-border pt-4 text-xs text-muted">
                      These records are maintained by your school. If something looks incorrect, speak with your class
                      teacher or the school office — you cannot edit entries here.
                    </p>
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
