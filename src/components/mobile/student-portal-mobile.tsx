"use client";

import { useMemo, useState } from "react";
import { PanelMobileShell } from "@/components/panel/panel-mobile-shell";
import { toDateKey } from "@/lib/calendar-day-status";
import {
  MobileEmptyState,
  MobileFilterChips,
  MobilePageHero,
  statusTone,
} from "@/components/mobile/mobile-primitives";

type Notice = { id?: string; title: string; body: string };
type Calendar = {
  holidays: { title: string; date: string }[];
  events: { title: string; startsAt: string }[];
};

export function StudentNoticesMobile({
  notices,
  calendar,
}: {
  notices: Notice[];
  calendar: Calendar | null;
}) {
  const tabs = useMemo(() => {
    const t: { value: "notices" | "holidays" | "events"; label: string }[] = [
      { value: "notices", label: `Notices (${notices.length})` },
    ];
    if (calendar) {
      t.push(
        { value: "holidays", label: `Holidays (${calendar.holidays.length})` },
        { value: "events", label: `Events (${calendar.events.length})` }
      );
    }
    return t;
  }, [notices.length, calendar]);

  const [tab, setTab] = useState<"notices" | "holidays" | "events">("notices");

  return (
    <PanelMobileShell
      role="student"
      kicker="Student"
      title="Notices & events"
      subtitle="Purple = holiday · tap a day on the calendar."
      calendarTitle="Holidays & events"
    >
      {tabs.length > 1 && (
        <MobileFilterChips options={tabs} value={tab} onChange={setTab} />
      )}

      {tab === "notices" && (
        <div className="space-y-3">
          {notices.length === 0 ? (
            <MobileEmptyState message="No notices right now." />
          ) : (
            notices.map((n, i) => (
              <article
                key={n.id ?? i}
                className="relative overflow-hidden rounded-2xl border border-border bg-surface p-4 shadow-sm"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-brand" aria-hidden />
                <h3 className="pl-2 text-base font-semibold text-heading">{n.title}</h3>
                <p className="mt-2 pl-2 text-sm leading-relaxed text-foreground whitespace-pre-wrap">{n.body}</p>
              </article>
            ))
          )}
        </div>
      )}

      {tab === "holidays" && calendar && (
        <ul className="space-y-2">
          {calendar.holidays.length === 0 ? (
            <MobileEmptyState message="No holidays listed." />
          ) : (
            calendar.holidays.map((h, i) => (
              <li
                key={i}
                className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 shadow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <span className="text-[0.6rem] font-bold uppercase">
                    {new Date(h.date).toLocaleString("en", { month: "short" })}
                  </span>
                  <span className="text-lg font-bold leading-none tabular-nums">
                    {new Date(h.date).getDate()}
                  </span>
                </div>
                <p className="text-sm font-medium text-heading">{h.title}</p>
              </li>
            ))
          )}
        </ul>
      )}

      {tab === "events" && calendar && (
        <ul className="space-y-2">
          {calendar.events.length === 0 ? (
            <MobileEmptyState message="No events scheduled." />
          ) : (
            calendar.events.map((e, i) => (
              <li
                key={i}
                className="rounded-2xl border border-border bg-surface px-4 py-3 shadow-sm"
              >
                <p className="font-semibold text-heading">{e.title}</p>
                <p className="mt-1 text-xs text-muted">
                  {new Date(e.startsAt).toLocaleString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </li>
            ))
          )}
        </ul>
      )}
    </PanelMobileShell>
  );
}

type ExamRow = {
  name: string;
  subjects: { subject: { name: string }; marks: { marksObtained: unknown; grade: string | null }[] }[];
};

export function StudentExamsMobile({ rows }: { rows: ExamRow[] }) {
  const hasResults = rows.some((e) => e.subjects.some((s) => s.marks.length > 0));

  return (
    <div className="space-y-4">
      <MobilePageHero
        kicker="Student"
        title="Exams & results"
        subtitle={hasResults ? "Published marks for your subjects." : "Results will appear when published."}
      />

      {!hasResults ? (
        <MobileEmptyState message="No published results yet." />
      ) : (
        <div className="space-y-3">
          {rows.map((exam) => {
            const entries = exam.subjects.flatMap((s) =>
              s.marks.map((m) => ({
                subject: s.subject.name,
                marks: String(m.marksObtained ?? "—"),
                grade: m.grade ?? "—",
              }))
            );
            if (entries.length === 0) return null;
            return (
              <section key={exam.name} className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
                <div className="bg-gradient-to-r from-brand/10 to-transparent px-4 py-3">
                  <h3 className="font-semibold text-heading">{exam.name}</h3>
                </div>
                <ul className="divide-y divide-border">
                  {entries.map((e, i) => (
                    <li key={i} className="flex items-center justify-between gap-3 px-4 py-3">
                      <span className="text-sm font-medium text-heading">{e.subject}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm tabular-nums text-muted">{e.marks} marks</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${statusTone("APPROVED")}`}>
                          {e.grade}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function StudentAttendanceMobile({
  pct,
  records,
}: {
  pct: number | null;
  records: { date: string; status: string }[];
}) {
  const ring = pct != null ? Math.min(100, Math.max(0, pct)) : null;
  const [selected, setSelected] = useState(() => toDateKey(new Date()));
  const dayRecord = records.find((r) => r.date.slice(0, 10) === selected);

  return (
    <PanelMobileShell
      role="student"
      kicker="Student"
      title="My attendance"
      subtitle="Tap a date — green present, red absent, purple holiday."
      attendanceRecords={records}
      selectedDate={selected}
      onSelectDate={setSelected}
      calendarTitle="Attendance & holidays"
      heroExtra={
        <div className="flex items-center gap-4 rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
          <div
            className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full"
            style={{
              background: ring != null
                ? `conic-gradient(var(--brand-gold) ${ring * 3.6}deg, rgba(255,255,255,0.2) 0)`
                : "rgba(255,255,255,0.15)",
            }}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-dark/80 text-lg font-bold tabular-nums">
              {ring != null ? `${ring}%` : "—"}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Overall attendance</p>
            <p className="text-xs text-white/75">{records.length} days on record</p>
          </div>
        </div>
      }
    >
      <div className="rounded-2xl border border-border bg-surface px-4 py-3 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Selected day</p>
        <p className="mt-1 text-sm font-medium text-heading">
          {new Date(selected).toLocaleDateString(undefined, {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </p>
        <p className="mt-2">
          {dayRecord ? (
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(dayRecord.status)}`}>
              {dayRecord.status.replace(/_/g, " ")}
            </span>
          ) : (
            <span className="text-sm text-muted">No attendance marked for this day.</span>
          )}
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Recent log</p>
        {records.length === 0 ? (
          <MobileEmptyState message="No attendance records yet." />
        ) : (
          records.slice(0, 12).map((r, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(r.date.slice(0, 10))}
              className="flex w-full items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3 text-left shadow-sm active:scale-[0.99]"
            >
              <p className="text-sm font-medium text-heading">
                {new Date(r.date).toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(r.status)}`}>
                {r.status.replace(/_/g, " ")}
              </span>
            </button>
          ))
        )}
      </div>
    </PanelMobileShell>
  );
}
