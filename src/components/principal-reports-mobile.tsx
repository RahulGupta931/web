"use client";

import { formatTime12 } from "@/lib/school-config-display";

export type WorkHoursTeacherRow = {
  employeeId: string;
  name: string;
  email: string;
  attendanceStatus: string | null;
  loginAt: string | null;
  logoutAt: string | null;
  scheduledHours: string;
  teachingPeriods: number;
};

function formatClock(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function statusChip(status: string | null): string {
  if (status === "PRESENT") return "bg-emerald-500/15 text-emerald-800";
  if (status === "ABSENT") return "bg-red-500/15 text-red-800";
  if (status === "LATE" || status === "HALF_DAY") return "bg-brand-gold/20 text-brand-dark";
  return "bg-surface-muted text-muted";
}

export function ReportsMobileHero({
  date,
  dayLabel,
  schoolLogoutTime,
  onDateChange,
}: {
  date: string;
  dayLabel?: string;
  schoolLogoutTime?: string;
  onDateChange: (date: string) => void;
}) {
  return (
    <section
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand-light px-4 py-5 text-white shadow-[var(--shadow-card)]"
    >
      <div className="pointer-events-none absolute -right-6 top-0 h-24 w-24 rounded-full bg-brand-gold/25 blur-2xl" />
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">Daily reports</p>
      <h2 className="mt-1 text-lg font-bold">Teacher work hours</h2>
      {dayLabel && <p className="mt-1 text-sm text-white/85">{dayLabel}</p>}
      {schoolLogoutTime && (
        <p className="mt-2 text-xs text-white/80">
          School logout (dispersal): <span className="font-semibold text-brand-gold">{formatTime12(schoolLogoutTime)}</span>
        </p>
      )}
      <label className="mt-4 block">
        <span className="text-xs text-white/75">Report date</span>
        <input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white [color-scheme:dark]"
        />
      </label>
    </section>
  );
}

export function ReportsSummaryChips({
  total,
  present,
  withLogin,
  withLogout,
}: {
  total: number;
  present: number;
  withLogin: number;
  withLogout: number;
}) {
  const items = [
    { label: "Teachers", value: String(total) },
    { label: "Present", value: String(present) },
    { label: "Checked in", value: String(withLogin) },
    { label: "Checked out", value: String(withLogout) },
  ];
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-border bg-surface px-3 py-2.5 text-center shadow-sm">
          <p className="text-lg font-bold tabular-nums text-heading">{item.value}</p>
          <p className="text-[0.65rem] font-medium uppercase tracking-wide text-muted">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

export function TeacherWorkHoursMobileList({
  teachers,
  schoolLogoutTime,
  loading,
}: {
  teachers: WorkHoursTeacherRow[];
  schoolLogoutTime?: string;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <ul className="space-y-3">
        {[1, 2, 3].map((i) => (
          <li key={i} className="h-28 animate-pulse rounded-2xl bg-surface-muted" />
        ))}
      </ul>
    );
  }

  if (teachers.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted">
        No teachers on record.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {teachers.map((t) => {
        const initials = t.name
          .split(" ")
          .map((p) => p[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();
        return (
          <li key={t.employeeId} className="rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-card)]">
            <div className="flex gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-sm font-bold text-brand">
                {initials}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-heading">{t.name}</p>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[0.6rem] font-semibold uppercase ${statusChip(t.attendanceStatus)}`}>
                    {t.attendanceStatus ?? "—"}
                  </span>
                </div>
                <p className="text-xs text-muted font-mono">{t.employeeId}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-surface-muted px-2 py-1.5">
                    <p className="text-[0.6rem] uppercase text-muted">Check-in</p>
                    <p className="font-semibold tabular-nums text-heading">{formatClock(t.loginAt)}</p>
                  </div>
                  <div className="rounded-lg bg-surface-muted px-2 py-1.5">
                    <p className="text-[0.6rem] uppercase text-muted">Check-out</p>
                    <p className="font-semibold tabular-nums text-heading">{formatClock(t.logoutAt)}</p>
                  </div>
                </div>
                <p className="mt-2 text-[0.65rem] text-muted">
                  Scheduled {t.scheduledHours} · {t.teachingPeriods} period{t.teachingPeriods === 1 ? "" : "s"}
                  {schoolLogoutTime && !t.logoutAt && (
                    <span> · Expected out {formatTime12(schoolLogoutTime)}</span>
                  )}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function AuditLogMobileList({
  logs,
}: {
  logs: { action: string; entityType: string; createdAt: string; actor: { email: string } | null }[];
}) {
  if (logs.length === 0) {
    return <p className="text-sm text-muted">No recent activity.</p>;
  }
  return (
    <ul className="space-y-2">
      {logs.slice(0, 20).map((l, i) => (
        <li key={i} className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm">
          <p className="font-medium text-heading">{l.action} · {l.entityType}</p>
          <p className="text-xs text-muted truncate">{l.actor?.email ?? "System"}</p>
          <p className="text-[0.65rem] text-muted">{new Date(l.createdAt).toLocaleString()}</p>
        </li>
      ))}
    </ul>
  );
}
