"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import { teacherNavLabel } from "@/config/nav";
import { TeacherCheckInActions } from "@/components/teacher/teacher-check-in-actions";
import {
  checkInStateLabel,
  formatCheckDate,
  formatCheckTime,
  formatDuration,
  type CheckInRecord,
} from "@/lib/check-in-display";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

type TodayResponse = {
  today: string;
  canCheckIn: boolean;
  canCheckOut: boolean;
  record: CheckInRecord;
};

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3 shadow-[var(--shadow-card)]">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-2xl font-bold tabular-nums text-heading">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-muted">{sub}</p> : null}
    </div>
  );
}

function statusTone(status: string | null): string {
  switch (status) {
    case "PRESENT":
      return "bg-emerald-500/12 text-emerald-900";
    case "LATE":
      return "bg-amber-500/15 text-amber-950";
    case "HALF_DAY":
      return "bg-violet-500/12 text-violet-900";
    case "ABSENT":
      return "bg-red-500/12 text-red-900";
    case "LEAVE_APPROVED":
      return "bg-sky-500/12 text-sky-900";
    default:
      return "bg-surface-muted text-muted";
  }
}

export function TeacherCheckInExperience() {
  const { get } = useApi();
  const [todayPayload, setTodayPayload] = useState<TodayResponse | null>(null);
  const [history, setHistory] = useState<CheckInRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [today, hist] = await Promise.all([
        get<TodayResponse>("/api/teacher/check-in"),
        get<{ records: CheckInRecord[] }>("/api/teacher/check-in/history"),
      ]);
      setTodayPayload(today);
      setHistory(hist.records ?? []);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [get]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const record = todayPayload?.record ?? null;
  const stateLabel = checkInStateLabel(record);

  const stats = useMemo(() => {
    const withCheckIn = history.filter((r) => r.checkInAt).length;
    const complete = history.filter((r) => r.checkInAt && r.checkOutAt).length;
    const openToday = record?.checkInAt && !record?.checkOutAt ? 1 : 0;
    return { days: withCheckIn, complete, openToday };
  }, [history, record]);

  return (
    <>
      <PanelAlerts error={error} message={message} messageTitle="Recorded" />
      <PageHeader
        title={teacherNavLabel("/teacher/check-in")}
        description="Record arrival and departure using server time. The principal can review staff attendance reports."
      />

      <section
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand-light px-5 py-6 text-white shadow-[var(--shadow-card)]"
        aria-label="Today's attendance"
      >
        <div className="pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-full bg-brand-gold/25 blur-2xl" />
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">
          {loading ? "Loading…" : todayPayload ? formatCheckDate(todayPayload.today) : "Today"}
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">{stateLabel}</h2>
        <p className="mt-2 text-sm text-white/85">
          {record?.checkInAt ? (
            <>
              In at <span className="font-semibold">{formatCheckTime(record.checkInAt)}</span>
              {record.checkOutAt ? (
                <>
                  {" "}
                  · Out at <span className="font-semibold">{formatCheckTime(record.checkOutAt)}</span>
                  {" "}
                  · <span className="font-semibold">{formatDuration(record.durationMinutes)}</span> on campus
                </>
              ) : (
                <> — check out when you leave for the day.</>
              )}
            </>
          ) : (
            "Tap check in when you arrive at school."
          )}
        </p>
        {todayPayload?.canCheckIn && (
          <p className="mt-3 inline-flex rounded-full bg-brand-gold/90 px-3 py-1 text-xs font-bold text-brand-dark">
            Ready to check in
          </p>
        )}
        {todayPayload?.canCheckOut && (
          <p className="mt-3 inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
            Remember to check out before leaving
          </p>
        )}
      </section>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <StatCard label="Days (30 days)" value={loading ? "—" : stats.days} sub="With a check-in recorded" />
        <StatCard label="Complete days" value={loading ? "—" : stats.complete} sub="Check-in and check-out" />
        <StatCard
          label="Today"
          value={loading ? "—" : record?.durationMinutes != null ? formatDuration(record.durationMinutes) : stateLabel}
          sub={record?.status ? record.status.replace(/_/g, " ") : "Attendance status"}
        />
      </div>

      <section className="mt-6 card-panel overflow-hidden">
        <div className="border-b border-border bg-gradient-to-r from-brand/8 via-transparent to-transparent px-4 py-3 sm:px-5">
          <p className="form-section-title">Today&apos;s actions</p>
          <p className="mt-1 text-sm text-muted">Times are stored on the server, not from your device clock.</p>
        </div>
        <div className="form-shell">
          <TeacherCheckInActions
            variant="card"
            embedded
            onMessage={(m) => {
              setMessage(m);
              if (m) refresh();
            }}
            onError={setError}
          />
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-end justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-heading">Recent history</h2>
            <p className="text-xs text-muted">Last 30 days of check-in and check-out</p>
          </div>
        </div>
        {loading ? (
          <p className="empty-state">Loading history…</p>
        ) : history.length === 0 ? (
          <p className="empty-state">No check-in records yet.</p>
        ) : (
          <ul className="space-y-2">
            {history.map((r) => {
              const complete = r.checkInAt && r.checkOutAt;
              return (
                <li
                  key={r.date}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-surface px-4 py-3 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-heading">{formatCheckDate(r.date)}</p>
                    <p className="mt-0.5 text-sm text-muted">
                      In {formatCheckTime(r.checkInAt)} · Out {formatCheckTime(r.checkOutAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-bold tabular-nums text-brand">
                      {formatDuration(r.durationMinutes)}
                    </span>
                    {r.status && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide ${statusTone(r.status)}`}
                      >
                        {r.status.replace(/_/g, " ")}
                      </span>
                    )}
                    {!complete && r.checkInAt && (
                      <span className="text-[0.625rem] font-semibold uppercase tracking-wide text-amber-800">
                        Open
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
