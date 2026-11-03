"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import { principalNavLabel } from "@/config/nav";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

export type PrincipalLeaveRow = {
  id: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  reason: string | null;
  teacher: { firstName: string; lastName: string; employeeId: string };
};

type StatusFilter = "all" | "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

const STATUS_META: Record<string, { label: string; tone: string; hint: string }> = {
  PENDING: {
    label: "Pending",
    tone: "bg-amber-500/15 text-amber-950 ring-amber-500/25",
    hint: "Approve or reject this request",
  },
  APPROVED: {
    label: "Approved",
    tone: "bg-emerald-500/12 text-emerald-900 ring-emerald-500/20",
    hint: "Leave confirmed — reflected in staff attendance",
  },
  REJECTED: {
    label: "Rejected",
    tone: "bg-red-500/12 text-red-900 ring-red-500/25",
    hint: "Request was not approved",
  },
  CANCELLED: {
    label: "Cancelled",
    tone: "bg-slate-500/12 text-slate-700 ring-slate-500/15",
    hint: "Withdrawn by the teacher",
  },
};

function leaveTypeLabel(type: string) {
  return type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function inclusiveDays(start: string, end: string): number | null {
  const a = new Date(start);
  const b = new Date(end);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime()) || b < a) return null;
  return Math.floor((b.getTime() - a.getTime()) / (24 * 60 * 60 * 1000)) + 1;
}

function teacherInitials(first: string, last: string) {
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

export function PrincipalLeaveExperience() {
  const { loading: authLoading } = useAuth();
  const { get, patch, isReady } = useApi();
  const [rows, setRows] = useState<PrincipalLeaveRow[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("PENDING");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!isReady) {
      setRows([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    get<PrincipalLeaveRow[]>("/api/principal/leave-requests")
      .then((data) => setRows(Array.isArray(data) ? data : []))
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
    const pending = rows.filter((r) => r.status === "PENDING").length;
    const approved = rows.filter((r) => r.status === "APPROVED").length;
    const rejected = rows.filter((r) => r.status === "REJECTED").length;
    const cancelled = rows.filter((r) => r.status === "CANCELLED").length;
    return { total: rows.length, pending, approved, rejected, cancelled };
  }, [rows]);

  const filtered = useMemo(() => {
    let list = rows;
    if (statusFilter !== "all") list = list.filter((r) => r.status === statusFilter);
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((r) => {
      const hay = [
        r.teacher.firstName,
        r.teacher.lastName,
        r.teacher.employeeId,
        r.type,
        r.reason,
        r.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [rows, statusFilter, search]);

  const selected =
    filtered.find((r) => r.id === selectedId) ?? rows.find((r) => r.id === selectedId) ?? null;

  const selectedMeta = selected ? STATUS_META[selected.status] ?? STATUS_META.PENDING : null;
  const days = selected ? inclusiveDays(selected.startDate, selected.endDate) : null;

  async function review(id: string, status: "APPROVED" | "REJECTED") {
    setBusyId(id);
    setError(null);
    setMessage(null);
    try {
      await patch(`/api/principal/leave-requests/${id}`, { status });
      setMessage(status === "APPROVED" ? "Leave approved." : "Leave rejected.");
      if (selectedId === id) setSelectedId(null);
      load();
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setBusyId(null);
    }
  }

  const filters: { id: StatusFilter; label: string; count?: number }[] = [
    { id: "PENDING", label: "Pending", count: stats.pending },
    { id: "APPROVED", label: "Approved", count: stats.approved },
    { id: "REJECTED", label: "Rejected", count: stats.rejected },
    { id: "CANCELLED", label: "Cancelled", count: stats.cancelled },
    { id: "all", label: "All", count: stats.total },
  ];

  const detailPanel = selected ? (
    <article className="card-panel overflow-hidden">
      <div className="border-b border-border bg-gradient-to-r from-brand/8 via-transparent to-transparent px-4 py-4 sm:px-5">
        <button
          type="button"
          className="mb-3 text-sm font-medium text-brand lg:hidden"
          onClick={() => setSelectedId(null)}
        >
          ← Back to list
        </button>
        <div className="flex gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
            {teacherInitials(selected.teacher.firstName, selected.teacher.lastName)}
          </span>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-heading">
              {selected.teacher.firstName} {selected.teacher.lastName}
            </h2>
            <p className="mt-0.5 text-sm text-muted">{selected.teacher.employeeId}</p>
            {selectedMeta && (
              <span
                className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide ring-1 ring-inset ${selectedMeta.tone}`}
              >
                {selectedMeta.label}
              </span>
            )}
          </div>
        </div>
        {selectedMeta && <p className="mt-3 text-sm text-muted">{selectedMeta.hint}</p>}
      </div>

      <div className="form-shell space-y-4">
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Leave type</dt>
            <dd className="mt-0.5 font-medium text-heading">{leaveTypeLabel(selected.type)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Duration</dt>
            <dd className="mt-0.5 font-medium text-heading">
              {days != null ? `${days} day${days === 1 ? "" : "s"}` : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">From</dt>
            <dd className="mt-0.5 font-medium text-heading">{formatDate(selected.startDate)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">To</dt>
            <dd className="mt-0.5 font-medium text-heading">{formatDate(selected.endDate)}</dd>
          </div>
        </dl>

        {selected.reason ? (
          <div className="rounded-xl border border-border bg-surface-muted/50 p-4 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Reason</p>
            <p className="mt-2 whitespace-pre-wrap text-heading">{selected.reason}</p>
          </div>
        ) : (
          <p className="text-sm text-muted">No reason provided.</p>
        )}

        {selected.status === "PENDING" && (
          <div className="flex flex-wrap gap-2 border-t border-border pt-4">
            <button
              type="button"
              disabled={busyId === selected.id}
              onClick={() => review(selected.id, "APPROVED")}
              className="btn-primary text-sm disabled:opacity-50"
            >
              {busyId === selected.id ? "Working…" : "Approve"}
            </button>
            <button
              type="button"
              disabled={busyId === selected.id}
              onClick={() => review(selected.id, "REJECTED")}
              className="btn-secondary text-sm disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </article>
  ) : null;

  return (
    <>
      <PanelAlerts error={error} message={message} messageTitle="Leave" />

      <PageHeader
        title={principalNavLabel("/principal/leave")}
        description="Review teacher time-off requests and approve or reject pending items."
        actions={
          <Link href="/principal/attendance" className="btn-secondary shrink-0 text-sm">
            Attendance
          </Link>
        }
      />

      <section
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand-light px-5 py-6 text-white shadow-[var(--shadow-card)]"
        aria-label="Leave queue"
      >
        <div className="pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-full bg-brand-gold/25 blur-2xl" />
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">Leave queue</p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
          {loading ? "Loading…" : `${stats.pending} pending`}
        </h2>
        <p className="mt-2 text-sm text-white/85">
          {stats.approved} approved · {stats.rejected} rejected · teachers submit from Teacher → Leave
        </p>
      </section>

      <div className="grid gap-3 sm:grid-cols-4">
        <StatCard label="Pending" value={loading ? "—" : stats.pending} sub="Needs decision" />
        <StatCard label="Approved" value={loading ? "—" : stats.approved} />
        <StatCard label="Rejected" value={loading ? "—" : stats.rejected} />
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
          placeholder="Search teacher, ID, type, or reason…"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className={`space-y-2 ${selected ? "hidden lg:block" : ""}`}>
          {loading ? (
            <p className="empty-state">Loading requests…</p>
          ) : filtered.length === 0 ? (
            <p className="empty-state">
              {statusFilter === "PENDING"
                ? "No pending leave requests."
                : "No requests match your filter or search."}
            </p>
          ) : (
            filtered.map((r) => {
              const active = r.id === selectedId;
              const meta = STATUS_META[r.status] ?? STATUS_META.PENDING;
              const span = inclusiveDays(r.startDate, r.endDate);
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedId(r.id)}
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
                    {teacherInitials(r.teacher.firstName, r.teacher.lastName)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <span className="font-semibold text-heading">
                        {r.teacher.firstName} {r.teacher.lastName}
                      </span>
                      <span className="text-xs text-muted">{formatDate(r.startDate)}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted">
                      {leaveTypeLabel(r.type)}
                      {span != null ? ` · ${span} day${span === 1 ? "" : "s"}` : ""}
                    </p>
                    <span
                      className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide ring-1 ring-inset ${meta.tone}`}
                    >
                      {meta.label}
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
              <p className="font-medium text-heading">Select a request</p>
              <p className="mt-1 max-w-sm text-sm text-muted">
                View dates, reason, and approve or reject pending leave.
              </p>
            </div>
          ) : (
            detailPanel
          )}
        </div>
      </div>
    </>
  );
}
