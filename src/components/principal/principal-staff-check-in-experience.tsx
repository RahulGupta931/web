"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import { principalNavLabel } from "@/config/nav";
import {
  checkInStateLabel,
  formatCheckDate,
  formatCheckTime,
  formatDuration,
  type CheckInRecord,
} from "@/lib/check-in-display";
import { ScrollableSelect } from "@/components/scrollable-select";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

type StaffRow = CheckInRecord & {
  teacherProfileId: string;
  employeeId: string;
  name: string;
};

type CheckInPayload = {
  from: string;
  to: string;
  teachers: { id: string; employeeId: string; name: string }[];
  today: StaffRow[];
  records: StaffRow[];
};

type ViewTab = "day" | "history";

function defaultFrom(): string {
  const d = new Date();
  d.setDate(d.getDate() - 14);
  return d.toISOString().slice(0, 10);
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3 shadow-[var(--shadow-card)]">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-2xl font-bold tabular-nums text-heading">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-muted">{sub}</p> : null}
    </div>
  );
}

function staffInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

function rowStateTone(row: StaffRow): string {
  if (!row.checkInAt) return "bg-slate-500/12 text-slate-700";
  if (!row.checkOutAt) return "bg-emerald-500/12 text-emerald-900";
  return "bg-brand/10 text-brand";
}

function StaffCheckInRow({ row }: { row: StaffRow }) {
  const state = checkInStateLabel(row);
  return (
    <li className="flex flex-col gap-3 rounded-xl border border-border bg-surface px-4 py-3 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand"
          aria-hidden
        >
          {staffInitials(row.name)}
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-heading">{row.name}</p>
          <p className="text-xs text-muted">{row.employeeId}</p>
          <p className="mt-1 text-sm text-muted">
            In {formatCheckTime(row.checkInAt)} · Out {formatCheckTime(row.checkOutAt)}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-bold tabular-nums text-brand">
          {formatDuration(row.durationMinutes)}
        </span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide ${rowStateTone(row)}`}
        >
          {state}
        </span>
      </div>
    </li>
  );
}

function HistoryRow({ row }: { row: StaffRow }) {
  return (
    <li className="flex flex-col gap-3 rounded-xl border border-border bg-surface px-4 py-3 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-semibold text-heading">{row.name}</p>
        <p className="text-xs text-muted">
          {formatCheckDate(row.date)} · {row.employeeId}
        </p>
        <p className="mt-1 text-sm text-muted">
          In {formatCheckTime(row.checkInAt)} · Out {formatCheckTime(row.checkOutAt)}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-bold tabular-nums text-brand">
          {formatDuration(row.durationMinutes)}
        </span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide ${rowStateTone(row)}`}
        >
          {checkInStateLabel(row)}
        </span>
      </div>
    </li>
  );
}

export function PrincipalStaffCheckInExperience() {
  const { get } = useApi();
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [teacherId, setTeacherId] = useState("");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<ViewTab>("day");
  const [data, setData] = useState<CheckInPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ from, to });
    if (teacherId) params.set("teacherId", teacherId);
    get<CheckInPayload>(`/api/principal/teacher-check-ins?${params}`)
      .then(setData)
      .catch((e) => {
        setData(null);
        setError(getApiErrorMessage(e));
      })
      .finally(() => setLoading(false));
  }, [get, from, to, teacherId]);

  useEffect(() => {
    load();
  }, [load]);

  const todayRows = data?.today ?? [];
  const historyRows = useMemo(
    () => (data?.records ?? []).filter((r) => r.date !== to),
    [data?.records, to]
  );

  const todaySummary = useMemo(() => {
    return {
      onCampus: todayRows.filter((r) => r.checkInAt && !r.checkOutAt).length,
      checkedOut: todayRows.filter((r) => r.checkOutAt).length,
      notIn: todayRows.filter((r) => !r.checkInAt).length,
      total: todayRows.length,
    };
  }, [todayRows]);

  const filterBySearch = useCallback(
    (rows: StaffRow[]) => {
      const q = search.trim().toLowerCase();
      if (!q) return rows;
      return rows.filter((r) => `${r.name} ${r.employeeId}`.toLowerCase().includes(q));
    },
    [search]
  );

  const filteredToday = useMemo(() => filterBySearch(todayRows), [todayRows, filterBySearch]);
  const filteredHistory = useMemo(() => filterBySearch(historyRows), [historyRows, filterBySearch]);

  return (
    <>
      <PanelAlerts error={error} />

      <PageHeader
        title={principalNavLabel("/principal/staff-check-in")}
        description="Review teacher arrival and departure times for any day, and browse earlier records in your date range."
        actions={
          <Link href="/principal/attendance" className="btn-secondary shrink-0 text-sm">
            Attendance
          </Link>
        }
      />

      <section
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand-light px-5 py-6 text-white shadow-[var(--shadow-card)]"
        aria-label="Check-in summary"
      >
        <div className="pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-full bg-brand-gold/25 blur-2xl" />
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">Focus day</p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">{formatCheckDate(to)}</h2>
        <p className="mt-2 text-sm text-white/85">
          {loading
            ? "Loading staff records…"
            : `${todaySummary.onCampus} on campus · ${todaySummary.checkedOut} checked out · ${todaySummary.notIn} not checked in`}
        </p>
      </section>

      <div className="grid gap-3 sm:grid-cols-4">
        <StatCard label="On campus" value={loading ? "—" : todaySummary.onCampus} sub="Checked in, not out" />
        <StatCard label="Checked out" value={loading ? "—" : todaySummary.checkedOut} />
        <StatCard label="Not checked in" value={loading ? "—" : todaySummary.notIn} />
        <StatCard label="Staff in view" value={loading ? "—" : todaySummary.total} sub="For focus day" />
      </div>

      <div className="card-panel grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block text-sm">
          <span className="text-muted">From</span>
          <input type="date" className="input-field mt-1 w-full" value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="text-muted">To (focus day)</span>
          <input type="date" className="input-field mt-1 w-full" value={to} onChange={(e) => setTo(e.target.value)} />
        </label>
        <div className="text-sm sm:col-span-2">
          <ScrollableSelect
            label="Teacher"
            value={teacherId}
            onChange={setTeacherId}
            placeholder="All teachers"
            options={[
              { value: "", label: "All teachers" },
              ...(data?.teachers ?? []).map((t) => ({
                value: t.id,
                label: `${t.name} (${t.employeeId})`,
              })),
            ]}
          />
        </div>
        <label className="block text-sm sm:col-span-2 lg:col-span-4">
          <span className="text-muted">Search</span>
          <input
            type="search"
            className="input-field mt-1 w-full"
            placeholder="Name or employee ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>

      <nav
        className="flex gap-1 rounded-xl border border-border bg-surface p-1 shadow-[var(--shadow-card)]"
        aria-label="Check-in views"
      >
        {(
          [
            ["day", `Focus day (${filteredToday.length})`],
            ["history", `Earlier (${filteredHistory.length})`],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex flex-1 items-center justify-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              tab === id ? "bg-brand text-white shadow-sm" : "text-muted hover:bg-surface-muted hover:text-heading"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {tab === "day" ? (
        <section className="card-panel overflow-hidden">
          <div className="border-b border-border bg-gradient-to-r from-brand/8 via-transparent to-transparent px-4 py-3 sm:px-5">
            <p className="form-section-title">{formatCheckDate(to)}</p>
            <p className="mt-1 text-sm text-muted">Check-in and check-out times for each teacher on the focus day.</p>
          </div>
          <div className="p-4 sm:p-5">
            {loading ? (
              <p className="empty-state">Loading…</p>
            ) : filteredToday.length === 0 ? (
              <p className="empty-state">No staff records for this day and filter.</p>
            ) : (
              <ul className="space-y-2">
                {filteredToday.map((r) => (
                  <StaffCheckInRow key={r.teacherProfileId} row={r} />
                ))}
              </ul>
            )}
          </div>
        </section>
      ) : (
        <section className="card-panel overflow-hidden">
          <div className="border-b border-border px-4 py-3 sm:px-5">
            <p className="form-section-title">Earlier in range</p>
            <p className="mt-1 text-sm text-muted">
              Records between {formatCheckDate(from)} and {formatCheckDate(to)}, excluding the focus day.
            </p>
          </div>
          <div className="p-4 sm:p-5">
            {loading ? (
              <p className="empty-state">Loading…</p>
            ) : filteredHistory.length === 0 ? (
              <p className="empty-state">No earlier check-ins in this range.</p>
            ) : (
              <ul className="space-y-2">
                {filteredHistory.map((r) => (
                  <HistoryRow key={`${r.teacherProfileId}-${r.date}`} row={r} />
                ))}
              </ul>
            )}
          </div>
        </section>
      )}
    </>
  );
}
