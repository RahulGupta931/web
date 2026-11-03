"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SchoolMonthCalendarCard } from "@/components/calendar/school-month-calendar-card";
import { useAuth } from "@/components/auth-provider";
import { statusTone } from "@/components/mobile/mobile-primitives";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import { studentNavLabel } from "@/config/nav";
import type { StudentDashboardData } from "@/lib/student-dashboard-types";
import { toDateKey } from "@/lib/calendar-day-status";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

type AttendanceRecord = { date: string; status: string };
type Tab = "calendar" | "log";

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-2.5 shadow-[var(--shadow-card)] sm:px-4 sm:py-3">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-xl font-bold tabular-nums text-heading sm:text-2xl">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-muted">{sub}</p> : null}
    </div>
  );
}

function formatStatus(status: string) {
  return status.replace(/_/g, " ");
}

function formatDayLong(dateKey: string) {
  return new Date(`${dateKey}T12:00:00`).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDayShort(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function recordsInCurrentMonth(records: AttendanceRecord[]) {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  return records.filter((r) => {
    const d = new Date(r.date);
    return d.getFullYear() === y && d.getMonth() === m;
  });
}

function summarizeMonth(records: AttendanceRecord[], percentage: number | null) {
  let present = 0;
  let absent = 0;
  let late = 0;
  for (const r of records) {
    const s = r.status.toUpperCase();
    if (s === "LATE") late += 1;
    if (s === "PRESENT" || s === "LATE" || s === "HALF_DAY") present += 1;
    else if (s === "ABSENT") absent += 1;
  }
  const total = records.length;
  const pct = total > 0 ? Math.round((present / total) * 100) : percentage;
  return { present, absent, late, total, percentage: pct };
}

function AttendanceSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-32 animate-pulse rounded-2xl bg-surface-muted" />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-surface-muted" />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-2xl bg-surface-muted" />
    </div>
  );
}

const BREAKDOWN_SEGMENTS = [
  { key: "present", label: "Present", tone: "bg-emerald-500", dot: "bg-emerald-500" },
  { key: "absent", label: "Absent", tone: "bg-red-400", dot: "bg-red-400" },
  { key: "late", label: "Late", tone: "bg-amber-400", dot: "bg-amber-400" },
] as const;

function MonthBreakdownCard({
  monthPct,
  att,
}: {
  monthPct: number | null;
  att: { present: number; absent: number; late: number; total: number };
}) {
  const values = { present: att.present, absent: att.absent, late: att.late };
  const barTotal = Math.max(1, values.present + values.absent + values.late);

  return (
    <section
      className="rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-card)]"
      aria-label="This month breakdown"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="form-section-title">This month</p>
        {monthPct != null && (
          <span className="text-lg font-bold tabular-nums text-brand">{monthPct}%</span>
        )}
      </div>
      <p className="mt-1 text-xs text-muted">
        {att.total > 0 ? `${att.total} school day${att.total === 1 ? "" : "s"} marked` : "No marks yet"}
      </p>
      <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-surface-muted">
        {BREAKDOWN_SEGMENTS.map((s) => {
          const value = values[s.key];
          if (value <= 0) return null;
          return (
            <span
              key={s.key}
              className={s.tone}
              style={{ width: `${(value / barTotal) * 100}%` }}
              title={`${s.label}: ${value}`}
            />
          );
        })}
      </div>
      <ul className="mt-3 grid grid-cols-3 gap-2">
        {BREAKDOWN_SEGMENTS.map((s) => (
          <li
            key={s.key}
            className="rounded-lg border border-border/80 bg-surface-muted/40 px-2 py-2 text-center"
          >
            <span className={`mx-auto mb-1 block h-1.5 w-6 rounded-full ${s.dot}`} aria-hidden />
            <p className="text-base font-bold tabular-nums text-heading">{values[s.key]}</p>
            <p className="text-[0.65rem] font-medium text-muted">{s.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SelectedDayCard({
  selectedDate,
  dayRecord,
}: {
  selectedDate: string;
  dayRecord: AttendanceRecord | undefined;
}) {
  return (
    <section
      className="rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-card)]"
      aria-label="Selected day"
    >
      <p className="form-section-title">Selected day</p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-base font-semibold leading-snug text-heading">{formatDayLong(selectedDate)}</p>
          <p className="mt-1 text-xs text-muted">Choose another date on the calendar to compare.</p>
        </div>
        <div className="shrink-0 sm:text-right">
          {dayRecord ? (
            <span
              className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${statusTone(dayRecord.status)}`}
            >
              {formatStatus(dayRecord.status)}
            </span>
          ) : (
            <span className="inline-flex rounded-full border border-dashed border-border bg-surface-muted/50 px-4 py-2 text-sm font-medium text-muted">
              Not marked
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

export function StudentAttendanceExperience() {
  const { loading: authLoading } = useAuth();
  const { get, isReady } = useApi();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [percentage, setPercentage] = useState<number | null>(null);
  const [monthStats, setMonthStats] = useState<StudentDashboardData["attendanceThisMonth"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("calendar");
  const [selectedDate, setSelectedDate] = useState(() => toDateKey(new Date()));

  const load = useCallback(() => {
    if (!isReady) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    Promise.all([
      get<{ percentage: number | null; records: AttendanceRecord[] }>("/api/student/attendance"),
      get<StudentDashboardData>("/api/student/dashboard").catch(() => null),
    ])
      .then(([attendance, dashboard]) => {
        setRecords(attendance.records ?? []);
        setPercentage(attendance.percentage);
        setMonthStats(dashboard?.attendanceThisMonth ?? null);
      })
      .catch((e) => {
        setRecords([]);
        setPercentage(null);
        setMonthStats(null);
        setError(getApiErrorMessage(e));
      })
      .finally(() => setLoading(false));
  }, [get, isReady]);

  useEffect(() => {
    if (authLoading) return;
    load();
  }, [authLoading, load]);

  const dayRecord = useMemo(
    () => records.find((r) => r.date.slice(0, 10) === selectedDate),
    [records, selectedDate]
  );

  const ring = percentage != null ? Math.min(100, Math.max(0, percentage)) : null;
  const monthPct = monthStats?.percentage ?? summarizeMonth(recordsInCurrentMonth(records), percentage).percentage;
  const att =
    monthStats ?? summarizeMonth(recordsInCurrentMonth(records), percentage);

  return (
    <>
      <PanelAlerts error={error} />
      <PageHeader
        title={studentNavLabel("/student/attendance")}
        description="Calendar view with present, absent, leave, and school holidays."
        actions={
          <Link href="/student" className="btn-secondary shrink-0 text-sm">
            Dashboard
          </Link>
        }
      />

      {loading && records.length === 0 && !error ? (
        <AttendanceSkeleton />
      ) : (
        <div className="space-y-6">
          <section
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand-light px-5 py-6 text-white shadow-[var(--shadow-card)]"
            aria-label="Attendance summary"
          >
            <div className="pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-full bg-brand-gold/25 blur-2xl" />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">
                  Attendance
                </p>
                <h2 className="mt-0.5 text-xl font-bold tracking-tight sm:text-2xl">Your record</h2>
                <p className="mt-1 text-sm text-white/85">
                  Tap a date on the calendar — green present, red absent, purple holiday.
                </p>
              </div>
              <div className="flex items-center gap-4 rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <div
                  className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full sm:h-[4.5rem] sm:w-[4.5rem]"
                  style={{
                    background:
                      ring != null
                        ? `conic-gradient(var(--brand-gold) ${ring * 3.6}deg, rgba(255,255,255,0.2) 0)`
                        : "rgba(255,255,255,0.15)",
                  }}
                  aria-hidden
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-dark/80 text-lg font-bold tabular-nums sm:h-14 sm:w-14 sm:text-xl">
                    {ring != null ? `${ring}%` : "—"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Recent overall</p>
                  <p className="text-xs text-white/75">{records.length} days on record</p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            <StatCard
              label="This month"
              value={monthPct != null ? `${monthPct}%` : "—"}
              sub={att.total > 0 ? `${att.total} day${att.total === 1 ? "" : "s"} marked` : "No marks yet"}
            />
            <StatCard label="Present" value={att.present} sub="Counts toward %" />
            <StatCard label="Absent" value={att.absent} />
            <StatCard label="Late" value={att.late} />
          </div>

          <nav
            className="flex gap-1 rounded-xl border border-border bg-surface p-1 shadow-[var(--shadow-card)]"
            aria-label="Attendance views"
          >
            {(
              [
                ["calendar", "Calendar"],
                ["log", `Daily log (${records.length})`],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`flex flex-1 items-center justify-center rounded-lg px-2 py-2.5 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
                  tab === id
                    ? "bg-brand text-white shadow-sm"
                    : "text-muted hover:bg-surface-muted hover:text-heading"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {tab === "calendar" && (
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_min(17.5rem,100%)] lg:items-start">
              <SchoolMonthCalendarCard
                role="student"
                attendanceRecords={records}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                title="Monthly calendar"
                layout="stacked"
              />
              <aside
                className="flex flex-col-reverse gap-4 lg:sticky lg:top-4 lg:flex-col"
                aria-label="Month summary and selected day"
              >
                {att.total > 0 ? <MonthBreakdownCard monthPct={monthPct} att={att} /> : null}
                <SelectedDayCard selectedDate={selectedDate} dayRecord={dayRecord} />
              </aside>
            </div>
          )}

          {tab === "log" && (
            <section className="card-panel" aria-label="Daily log">
              <p className="form-section-title mb-4">Daily log</p>
              {records.length === 0 ? (
                <p className="text-sm text-muted">No attendance records yet.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {records.map((r, i) => {
                    const key = r.date.slice(0, 10);
                    return (
                      <li key={`${key}-${i}`}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDate(key);
                            setTab("calendar");
                          }}
                          className="flex w-full items-center justify-between gap-3 py-3 text-left transition hover:bg-surface-muted/60 sm:px-2 sm:rounded-lg"
                        >
                          <span className="text-sm font-medium text-heading">{formatDayShort(r.date)}</span>
                          <span
                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusTone(r.status)}`}
                          >
                            {formatStatus(r.status)}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          )}
        </div>
      )}
    </>
  );
}
