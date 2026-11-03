"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MonthStatusCalendar } from "@/components/calendar/month-status-calendar";
import { SchoolHolidayLists } from "@/components/calendar/school-holiday-lists";
import {
  buildMonthStatusMap,
  expandDateRange,
  HOLIDAY_CATEGORIES,
  toDateKey,
} from "@/lib/calendar-day-status";
import { useApi } from "@/lib/use-api";

type CalendarApi = {
  holidays?: { id?: string; title: string; date: string }[];
  events?: { startsAt: string }[];
  workingDays?: { day: string; isWorking: boolean }[];
  entries?: {
    id?: string;
    title: string;
    category: string;
    startDate: string;
    endDate: string | null;
  }[];
};

export function SchoolMonthCalendarCard({
  role,
  attendanceRecords = [],
  selectedDate,
  onSelectDate,
  title = "School calendar",
  showHolidayLists = true,
  layout = "stacked",
  manageHref,
}: {
  role: "student" | "teacher" | "principal";
  attendanceRecords?: { date: string; status: string }[];
  selectedDate?: string;
  onSelectDate?: (dateKey: string) => void;
  title?: string;
  /** Show upcoming + full holiday lists below the month grid */
  showHolidayLists?: boolean;
  /** split = month grid + holiday lists side-by-side on large screens */
  layout?: "stacked" | "split";
  manageHref?: string;
}) {
  const { get } = useApi();
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [calendarMonth, setCalendarMonth] = useState<CalendarApi | null>(null);
  const [calendarAll, setCalendarAll] = useState<CalendarApi | null>(null);
  const [pickedDate, setPickedDate] = useState<string | undefined>(selectedDate);

  const path =
    role === "student" ? "/api/student/calendar" : role === "teacher" ? "/api/teacher/calendar" : "/api/principal/calendar";

  const calendarVariant =
    attendanceRecords.length > 0 ? "attendance" : "overview";

  const editLink =
    manageHref ?? (role === "principal" ? "/principal/calendar" : undefined);

  useEffect(() => {
    get<CalendarApi>(path)
      .then(setCalendarAll)
      .catch(() => setCalendarAll(null));
  }, [get, path]);

  useEffect(() => {
    const from = new Date(month.getFullYear(), month.getMonth(), 1).toISOString().slice(0, 10);
    const to = new Date(month.getFullYear(), month.getMonth() + 1, 0).toISOString().slice(0, 10);
    get<CalendarApi>(`${path}?from=${from}&to=${to}`)
      .then(setCalendarMonth)
      .catch(() => setCalendarMonth(null));
  }, [get, path, month]);

  useEffect(() => {
    setPickedDate(selectedDate);
  }, [selectedDate]);

  const calendarForLists = calendarAll ?? calendarMonth;

  const statusByDate = useMemo(() => {
    const holidayKeys = new Set<string>();
    const holidays = calendarAll?.holidays ?? calendarMonth?.holidays ?? [];
    const entriesForHolidays = calendarAll?.entries ?? calendarMonth?.entries ?? [];

    for (const h of holidays) {
      holidayKeys.add(h.date.slice(0, 10));
    }
    for (const e of entriesForHolidays) {
      if (HOLIDAY_CATEGORIES.has(e.category)) {
        for (const k of expandDateRange(e.startDate, e.endDate)) holidayKeys.add(k);
      }
    }

    const eventKeys = new Set<string>();
    for (const ev of calendarMonth?.events ?? []) {
      eventKeys.add(ev.startsAt.slice(0, 10));
    }
    for (const e of calendarMonth?.entries ?? []) {
      if (!HOLIDAY_CATEGORIES.has(e.category)) {
        for (const k of expandDateRange(e.startDate, e.endDate)) eventKeys.add(k);
      }
    }
    return buildMonthStatusMap({
      month,
      attendance: attendanceRecords,
      holidayDateKeys: holidayKeys,
      eventDateKeys: eventKeys,
      workingDays: calendarMonth?.workingDays ?? calendarAll?.workingDays,
    });
  }, [month, attendanceRecords, calendarMonth, calendarAll]);

  const todayKey = toDateKey(new Date());
  const activeDate = pickedDate ?? selectedDate ?? todayKey;

  function handleSelectDate(dateKey: string) {
    setPickedDate(dateKey);
    onSelectDate?.(dateKey);
  }

  const split = layout === "split" && showHolidayLists;

  return (
    <section className="min-w-0">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-heading">{title}</h3>
          <p className="mt-0.5 text-xs text-muted">Holidays, events, and non-working days</p>
        </div>
        {editLink ? (
          <Link
            href={editLink}
            className="text-xs font-semibold text-brand hover:underline"
          >
            Manage calendar →
          </Link>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)]">
        <div className={split ? "lg:flex lg:items-stretch" : ""}>
          <div className={split ? "min-w-0 flex-1 p-4 lg:border-r lg:border-border" : "p-4"}>
            <MonthStatusCalendar
              month={month}
              onMonthChange={setMonth}
              statusByDate={statusByDate}
              selectedDate={activeDate}
              onSelectDate={handleSelectDate}
              embedded
              variant={calendarVariant}
            />
          </div>
          {showHolidayLists ? (
            <div
              className={
                split
                  ? "min-w-0 bg-surface-muted/30 p-4 lg:w-[min(100%,22rem)] lg:shrink-0"
                  : "border-t border-border px-4 pb-4"
              }
            >
              <SchoolHolidayLists calendar={calendarForLists} compact={split} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
