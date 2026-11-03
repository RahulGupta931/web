"use client";

import Link from "next/link";
import { formatBellScheduleTimeRange } from "@/lib/school-config-display";
import { formatClassSection } from "@/lib/class-section-display";

function parseTimeToMinutes(t: string): number {
  const [hStr, mStr] = t.split(":");
  const h = Number(hStr);
  const m = Number(mStr ?? 0);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return NaN;
  return h * 60 + m;
}

export function isPeriodHappeningNow(startTime?: string, endTime?: string): boolean {
  if (!startTime || !endTime) return false;
  const start = parseTimeToMinutes(startTime);
  const end = parseTimeToMinutes(endTime);
  if (!Number.isFinite(start) || !Number.isFinite(end)) return false;
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  return cur >= start && cur < end;
}

export function DashboardInsightsPanel({ title = "Today's focus", insights }: { title?: string; insights: string[] }) {
  if (insights.length === 0) return null;
  return (
    <section className="rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/[0.06] to-surface p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-heading">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-foreground">
        {insights.map((line, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
            {line}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function DashboardAttendanceCard({
  label,
  value,
  detail,
  href,
}: {
  label: string;
  value: string;
  detail: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-border bg-surface p-4 shadow-sm transition hover:border-brand/30"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-3xl font-bold tabular-nums text-brand">{value}</p>
      <p className="mt-1 text-xs text-muted">{detail}</p>
      <p className="mt-2 text-xs font-semibold text-brand">View details →</p>
    </Link>
  );
}

export type TodayClassItem = {
  id?: string;
  subject: string;
  sectionLabel?: string;
  periodName: string;
  periodNo?: number;
  timeRange?: string | null;
  meta?: string;
  isSubstitute?: boolean;
  isNow?: boolean;
};

export function TodayClassesCard({
  title,
  items,
  emptyMessage,
  footerHref,
  footerLabel,
}: {
  title: string;
  items: TodayClassItem[];
  emptyMessage: string;
  footerHref?: string;
  footerLabel?: string;
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-heading">{title}</h3>
        <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand">
          {items.length}
        </span>
      </div>
      {items.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-muted">{emptyMessage}</p>
      ) : (
        <ul className="divide-y divide-border">
          {items.map((s, i) => (
            <li
              key={s.id ?? `${s.periodNo ?? i}-${s.subject}-${s.sectionLabel ?? ""}`}
              className={`flex gap-3 px-4 py-3 ${s.isNow ? "bg-brand/[0.06]" : ""}`}
            >
              <div
                className={`flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl text-brand ${
                  s.isNow ? "bg-brand text-white" : "bg-brand/10"
                }`}
              >
                <span className={`text-[0.55rem] font-bold uppercase ${s.isNow ? "text-white/90" : ""}`}>P</span>
                <span className="text-sm font-bold tabular-nums">{s.periodNo ?? i + 1}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-heading">{s.subject}</p>
                  {s.isNow && (
                    <span className="rounded-full bg-brand px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-white">
                      Now
                    </span>
                  )}
                  {s.isSubstitute && (
                    <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-sky-800">
                      Substitute
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted">
                  {[s.sectionLabel, s.timeRange ?? s.periodName].filter(Boolean).join(" · ")}
                </p>
                {s.meta && <p className="mt-0.5 text-xs text-muted">{s.meta}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
      {footerHref && (
        <div className="border-t border-border px-4 py-2.5 text-center">
          <Link href={footerHref} className="text-xs font-semibold text-brand">{footerLabel ?? "View all →"}</Link>
        </div>
      )}
    </section>
  );
}

export function mapTeacherSlotToClassItem(
  s: {
    id?: string;
    period: { name: string; periodNo?: number; startTime?: string; endTime?: string };
    subject: { name: string };
    section: { class: { name: string }; name: string };
    classroom?: { name: string } | null;
  },
  opts?: { isSubstitute?: boolean }
): TodayClassItem {
  const time =
    s.period.startTime && s.period.endTime
      ? formatBellScheduleTimeRange(s.period.startTime, s.period.endTime)
      : null;
  const room = s.classroom?.name;
  return {
    id: s.id,
    subject: s.subject.name,
    sectionLabel: formatClassSection(s.section.class.name, s.section.name),
    periodName: s.period.name,
    periodNo: s.period.periodNo,
    timeRange: time,
    meta: room ? `Room ${room}` : undefined,
    isSubstitute: opts?.isSubstitute,
    isNow: isPeriodHappeningNow(s.period.startTime, s.period.endTime),
  };
}

export function mapStudentSlotToClassItem(s: {
  period: { name: string; periodNo?: number; startTime?: string; endTime?: string };
  subject: { name: string };
  teacher?: { firstName: string; lastName: string } | null;
}): TodayClassItem {
  const time =
    s.period.startTime && s.period.endTime
      ? formatBellScheduleTimeRange(s.period.startTime, s.period.endTime)
      : null;
  return {
    subject: s.subject.name,
    periodName: s.period.name,
    periodNo: s.period.periodNo,
    timeRange: time,
    meta: s.teacher ? `${s.teacher.firstName} ${s.teacher.lastName}` : undefined,
  };
}
