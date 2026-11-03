"use client";

import {
  ATTENDANCE_CALENDAR_LEGEND,
  calendarStatusClass,
  calendarStatusClassOverview,
  calendarStatusLabel,
  SCHOOL_OVERVIEW_CALENDAR_LEGEND,
  type CalendarDayStatus,
  toDateKey,
} from "@/lib/calendar-day-status";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function MonthStatusCalendar({
  month,
  onMonthChange,
  statusByDate,
  selectedDate,
  onSelectDate,
  embedded,
  variant = "attendance",
}: {
  month: Date;
  onMonthChange: (next: Date) => void;
  statusByDate: Record<string, CalendarDayStatus>;
  selectedDate?: string;
  onSelectDate?: (dateKey: string) => void;
  /** Omit outer card chrome when nested inside another panel */
  embedded?: boolean;
  /** overview = softer school calendar; attendance = bold status colors */
  variant?: "attendance" | "overview";
}) {
  const year = month.getFullYear();
  const mon = month.getMonth();
  const first = new Date(year, mon, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, mon + 1, 0).getDate();
  const todayKey = toDateKey(new Date());

  const cells: { key: string | null; day: number | null }[] = [];
  for (let i = 0; i < startPad; i++) cells.push({ key: null, day: null });
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ key: toDateKey(new Date(year, mon, d)), day: d });
  }

  const monthLabel = month.toLocaleString(undefined, { month: "long", year: "numeric" });
  const isOverview = variant === "overview";
  const statusClass = isOverview ? calendarStatusClassOverview : calendarStatusClass;
  const legend = isOverview ? SCHOOL_OVERVIEW_CALENDAR_LEGEND : ATTENDANCE_CALENDAR_LEGEND;

  function shiftMonth(delta: number) {
    onMonthChange(new Date(year, mon + delta, 1));
  }

  function goToday() {
    const now = new Date();
    onMonthChange(new Date(now.getFullYear(), now.getMonth(), 1));
    onSelectDate?.(toDateKey(now));
  }

  return (
    <div className={embedded ? "" : "rounded-2xl border border-border bg-surface p-4 shadow-sm"}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 rounded-xl border border-border bg-surface-muted/50 p-0.5">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-lg font-semibold text-brand transition hover:bg-surface"
            aria-label="Previous month"
          >
            ‹
          </button>
          <p className="min-w-[9.5rem] px-1 text-center text-sm font-semibold text-heading">{monthLabel}</p>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-lg font-semibold text-brand transition hover:bg-surface"
            aria-label="Next month"
          >
            ›
          </button>
        </div>
        <button
          type="button"
          onClick={goToday}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-brand transition hover:border-brand/30 hover:bg-brand/5"
        >
          Today
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {WEEKDAYS.map((w) => (
          <span
            key={w}
            className="py-1 text-center text-[0.6875rem] font-semibold uppercase tracking-wide text-muted"
          >
            {w}
          </span>
        ))}
      </div>

      <div className="mt-0.5 grid grid-cols-7 gap-1.5">
        {cells.map((cell, i) => {
          if (!cell.key || cell.day === null) {
            return <div key={`e-${i}`} className="h-10 sm:h-11" aria-hidden />;
          }
          const status = statusByDate[cell.key] ?? "none";
          const selected = selectedDate === cell.key;
          const isToday = cell.key === todayKey;
          return (
            <button
              key={cell.key}
              type="button"
              onClick={() => cell.key && onSelectDate?.(cell.key)}
              className={`flex h-10 sm:h-11 items-center justify-center rounded-lg text-sm font-semibold tabular-nums transition ${statusClass(status)} ${
                selected ? "ring-2 ring-brand ring-offset-1" : ""
              } ${isToday && !selected ? "ring-2 ring-brand-gold/80 ring-offset-1" : ""} ${
                onSelectDate ? "hover:brightness-[0.98] active:scale-[0.98]" : ""
              }`}
              title={`${cell.day} — ${calendarStatusLabel(status)}`}
            >
              {cell.day}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-3">
        {legend.map((s) => (
          <span
            key={s}
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[0.6875rem] font-medium ${statusClass(s)}`}
          >
            {calendarStatusLabel(s)}
          </span>
        ))}
      </div>
    </div>
  );
}
