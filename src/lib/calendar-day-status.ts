export type CalendarDayStatus =
  | "present"
  | "absent"
  | "late"
  | "half_day"
  | "leave"
  | "holiday"
  | "event"
  | "weekend"
  | "none"
  | "future";

export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const HOLIDAY_CATEGORIES = new Set([
  "PUBLIC_HOLIDAY",
  "SCHOOL_HOLIDAY",
  "VACATION_TERM_BREAK",
  "REGIONAL_HOLIDAY",
]);

export function attendanceToStatus(status: string): CalendarDayStatus {
  const s = status.toUpperCase();
  if (s === "PRESENT") return "present";
  if (s === "ABSENT") return "absent";
  if (s === "LATE") return "late";
  if (s === "HALF_DAY") return "half_day";
  if (s === "LEAVE_APPROVED") return "leave";
  return "none";
}

export type SchoolHolidayListItem = {
  id: string;
  title: string;
  dateKey: string;
};

/** Flatten legacy Holiday rows and published calendar entries into sortable day rows. */
export function collectSchoolHolidayList(calendar: {
  holidays?: { id?: string; title: string; date: string }[];
  entries?: { id?: string; title: string; category: string; startDate: string; endDate: string | null }[];
}): SchoolHolidayListItem[] {
  const seen = new Set<string>();
  const rows: SchoolHolidayListItem[] = [];

  for (const h of calendar.holidays ?? []) {
    const dateKey = h.date.slice(0, 10);
    const dedupe = `${dateKey}\0${h.title}`;
    if (seen.has(dedupe)) continue;
    seen.add(dedupe);
    rows.push({
      id: h.id ?? `holiday-${dateKey}-${h.title}`,
      title: h.title,
      dateKey,
    });
  }

  for (const e of calendar.entries ?? []) {
    if (!HOLIDAY_CATEGORIES.has(e.category)) continue;
    for (const dateKey of expandDateRange(e.startDate, e.endDate)) {
      const dedupe = `${dateKey}\0${e.title}`;
      if (seen.has(dedupe)) continue;
      seen.add(dedupe);
      rows.push({
        id: `${e.id ?? "entry"}-${dateKey}`,
        title: e.title,
        dateKey,
      });
    }
  }

  rows.sort((a, b) => a.dateKey.localeCompare(b.dateKey) || a.title.localeCompare(b.title));
  return rows;
}

export function formatCalendarListDate(dateKey: string): string {
  const d = new Date(`${dateKey}T12:00:00`);
  if (Number.isNaN(d.getTime())) return dateKey;
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function expandDateRange(startIso: string, endIso?: string | null): string[] {
  const keys: string[] = [];
  const start = new Date(startIso);
  const end = new Date(endIso ?? startIso);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return keys;
  const cur = new Date(start);
  cur.setHours(0, 0, 0, 0);
  const last = new Date(end);
  last.setHours(0, 0, 0, 0);
  while (cur <= last) {
    keys.push(toDateKey(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return keys;
}

type WorkingDayRow = { day: string; isWorking: boolean };

const DAY_INDEX: Record<string, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

export function buildMonthStatusMap(params: {
  month: Date;
  attendance?: { date: string; status: string }[];
  holidayDateKeys?: Set<string>;
  eventDateKeys?: Set<string>;
  workingDays?: WorkingDayRow[];
}): Record<string, CalendarDayStatus> {
  const { month, attendance = [], holidayDateKeys, eventDateKeys, workingDays } = params;
  const map: Record<string, CalendarDayStatus> = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nonWorking = new Set<number>();
  if (workingDays?.length) {
    for (const w of workingDays) {
      if (!w.isWorking && DAY_INDEX[w.day] !== undefined) {
        nonWorking.add(DAY_INDEX[w.day]);
      }
    }
  } else {
    nonWorking.add(0);
  }

  const attByKey = new Map<string, string>();
  for (const r of attendance) {
    const key = r.date.slice(0, 10);
    attByKey.set(key, r.status);
  }

  const year = month.getFullYear();
  const mon = month.getMonth();
  const daysInMonth = new Date(year, mon + 1, 0).getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, mon, d);
    const key = toDateKey(date);
    if (holidayDateKeys?.has(key)) {
      map[key] = "holiday";
      continue;
    }
    if (nonWorking.has(date.getDay())) {
      map[key] = "weekend";
      continue;
    }
    const att = attByKey.get(key);
    if (att) {
      map[key] = attendanceToStatus(att);
      continue;
    }
    if (eventDateKeys?.has(key)) {
      map[key] = "event";
      continue;
    }
    if (date > today) {
      map[key] = "future";
      continue;
    }
    map[key] = "none";
  }
  return map;
}

export function calendarStatusLabel(status: CalendarDayStatus): string {
  switch (status) {
    case "present":
      return "Present";
    case "absent":
      return "Absent";
    case "late":
      return "Late";
    case "half_day":
      return "Half day";
    case "leave":
      return "Leave";
    case "holiday":
      return "Holiday";
    case "event":
      return "Event";
    case "weekend":
      return "Off";
    case "future":
      return "Upcoming";
    default:
      return "No record";
  }
}

export function calendarStatusClass(status: CalendarDayStatus): string {
  switch (status) {
    case "present":
      return "bg-emerald-500 text-white";
    case "absent":
      return "bg-red-500 text-white";
    case "late":
      return "bg-amber-500 text-brand-dark";
    case "half_day":
      return "bg-amber-400/90 text-brand-dark";
    case "leave":
      return "bg-sky-500 text-white";
    case "holiday":
      return "bg-violet-600 text-white";
    case "event":
      return "bg-brand text-white";
    case "weekend":
      return "bg-surface-muted text-muted";
    case "future":
      return "bg-surface text-muted border border-dashed border-border";
    default:
      return "bg-surface border border-border text-muted";
  }
}

/** Softer day styling for school-wide calendar (principal dashboard, notices). */
export function calendarStatusClassOverview(status: CalendarDayStatus): string {
  switch (status) {
    case "holiday":
      return "bg-violet-50 text-violet-900 ring-1 ring-inset ring-violet-200";
    case "event":
      return "bg-brand/[0.07] text-brand ring-1 ring-inset ring-brand/20";
    case "weekend":
      return "bg-surface-muted/80 text-muted";
    case "future":
      return "bg-surface text-muted ring-1 ring-inset ring-border";
    case "present":
    case "absent":
    case "late":
    case "half_day":
    case "leave":
      return calendarStatusClass(status);
    default:
      return "bg-surface text-heading ring-1 ring-inset ring-border/80";
  }
}

export const ATTENDANCE_CALENDAR_LEGEND: CalendarDayStatus[] = [
  "present",
  "absent",
  "late",
  "holiday",
  "weekend",
  "none",
];

export const SCHOOL_OVERVIEW_CALENDAR_LEGEND: CalendarDayStatus[] = [
  "holiday",
  "event",
  "weekend",
  "future",
  "none",
];
