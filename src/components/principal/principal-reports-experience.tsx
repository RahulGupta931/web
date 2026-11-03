"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AuditLogMobileList,
  TeacherWorkHoursMobileList,
  type WorkHoursTeacherRow,
} from "@/components/principal-reports-mobile";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import { principalNavLabel } from "@/config/nav";
import { formatTime12 } from "@/lib/school-config-display";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type WorkHoursReport = {
  date: string;
  day: string;
  timetableName: string | null;
  schoolLogoutTime?: string;
  teachers: WorkHoursTeacherRow[];
};

type AuditLogRow = {
  action: string;
  entityType: string;
  createdAt: string;
  actor: { email: string } | null;
};

type ReportTab = "work-hours" | "audit";

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3 shadow-[var(--shadow-card)]">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-2xl font-bold tabular-nums text-heading">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-muted">{sub}</p> : null}
    </div>
  );
}

export function PrincipalReportsExperience() {
  const { get, token } = useApi();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [tab, setTab] = useState<ReportTab>("work-hours");
  const [workHours, setWorkHours] = useState<WorkHoursReport | null>(null);
  const [listLoading, setListLoading] = useState(true);
  const [logs, setLogs] = useState<AuditLogRow[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const loadWorkHours = useCallback(() => {
    setListLoading(true);
    get<WorkHoursReport>(`/api/principal/reports/teacher-work-hours?date=${date}`)
      .then(setWorkHours)
      .catch((e) => {
        setWorkHours(null);
        setError(getApiErrorMessage(e));
      })
      .finally(() => setListLoading(false));
  }, [get, date]);

  const loadLogs = useCallback(() => {
    setLogsLoading(true);
    get<AuditLogRow[]>("/api/principal/reports/audit-logs")
      .then((data) => setLogs(Array.isArray(data) ? data : []))
      .catch(() => setLogs([]))
      .finally(() => setLogsLoading(false));
  }, [get]);

  useEffect(() => {
    loadWorkHours();
  }, [loadWorkHours]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const teachers = workHours?.teachers ?? [];

  const summary = useMemo(() => {
    const present = teachers.filter((t) => t.attendanceStatus === "PRESENT").length;
    const withLogin = teachers.filter((t) => t.loginAt).length;
    const withLogout = teachers.filter((t) => t.logoutAt).length;
    return { total: teachers.length, present, withLogin, withLogout };
  }, [teachers]);

  const dayLabel = workHours
    ? `${workHours.day} · ${workHours.date}${workHours.timetableName ? ` · ${workHours.timetableName}` : ""}`
    : undefined;

  async function downloadAttendanceCsv() {
    if (!token) {
      setError("Sign in to download reports.");
      return;
    }
    setDownloading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/principal/reports/attendance?format=csv`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "attendance.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setDownloading(false);
    }
  }

  return (
    <>
      <PanelAlerts error={error} />

      <PageHeader
        title={principalNavLabel("/principal/reports")}
        description="Teacher work hours for any day, attendance exports, and audit activity."
        actions={
          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              type="button"
              onClick={downloadAttendanceCsv}
              disabled={downloading}
              className="btn-primary text-sm disabled:opacity-50"
            >
              {downloading ? "Downloading…" : "Attendance CSV"}
            </button>
            <Link href="/principal/staff-check-in" className="btn-secondary text-sm">
              {principalNavLabel("/principal/staff-check-in")}
            </Link>
          </div>
        }
      />

      <section
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand-light px-5 py-6 text-white shadow-[var(--shadow-card)]"
        aria-label="Reports summary"
      >
        <div className="pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-full bg-brand-gold/25 blur-2xl" />
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">Daily reports</p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">Teacher work hours</h2>
        <p className="mt-2 text-sm text-white/85">
          {listLoading
            ? "Loading…"
            : dayLabel ?? "Pick a date to view scheduled time, check-in, and check-out."}
        </p>
        {workHours?.schoolLogoutTime && (
          <p className="mt-2 text-xs text-white/80">
            School dispersal:{" "}
            <span className="font-semibold text-brand-gold">{formatTime12(workHours.schoolLogoutTime)}</span>
          </p>
        )}
      </section>

      <div className="grid gap-3 sm:grid-cols-4">
        <StatCard label="Teachers" value={listLoading ? "—" : summary.total} sub="On roster" />
        <StatCard label="Present" value={listLoading ? "—" : summary.present} />
        <StatCard label="Checked in" value={listLoading ? "—" : summary.withLogin} />
        <StatCard label="Checked out" value={listLoading ? "—" : summary.withLogout} />
      </div>

      <nav
        className="flex gap-1 rounded-xl border border-border bg-surface p-1 shadow-[var(--shadow-card)]"
        aria-label="Report sections"
      >
        {(
          [
            ["work-hours", "Work hours"],
            ["audit", `Audit log (${logs.length})`],
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

      {tab === "work-hours" && (
        <div className="space-y-4">
          <section className="card-panel form-shell space-y-3">
            <p className="form-section-title">Report date</p>
            <p className="text-sm text-muted">
              Scheduled hours come from the published timetable. Login and logout reflect staff portal check-in.
            </p>
            <label className="block max-w-xs text-sm">
              <span className="text-muted">Date</span>
              <input
                type="date"
                className="input-field mt-1 w-full"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            <Link href="/principal/attendance" className="inline-block text-xs font-semibold text-brand">
              Open attendance workspace →
            </Link>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Staff on this day</h3>
            <TeacherWorkHoursMobileList
              teachers={teachers}
              schoolLogoutTime={workHours?.schoolLogoutTime}
              loading={listLoading}
            />
          </section>
        </div>
      )}

      {tab === "audit" && (
        <section className="card-panel overflow-hidden">
          <div className="border-b border-border px-4 py-3 sm:px-5">
            <p className="form-section-title">Activity logs</p>
            <p className="mt-1 text-sm text-muted">Recent principal and system actions (newest first).</p>
          </div>
          <div className="p-4 sm:p-5">
            {logsLoading ? (
              <p className="text-sm text-muted">Loading activity…</p>
            ) : (
              <AuditLogMobileList logs={logs} />
            )}
          </div>
        </section>
      )}
    </>
  );
}
