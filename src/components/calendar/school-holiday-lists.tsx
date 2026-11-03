"use client";

import {
  collectSchoolHolidayList,
  formatCalendarListDate,
  toDateKey,
  type SchoolHolidayListItem,
} from "@/lib/calendar-day-status";

function HolidayRows({
  items,
  emptyMessage,
  maxHeightClass,
}: {
  items: SchoolHolidayListItem[];
  emptyMessage: string;
  maxHeightClass?: string;
}) {
  if (items.length === 0) {
    return <p className="mt-2 text-sm text-muted">{emptyMessage}</p>;
  }
  return (
    <ul
      className={`mt-2 space-y-2 text-sm ${maxHeightClass ?? ""} ${maxHeightClass ? "overflow-y-auto pr-1" : ""}`}
    >
      {items.map((h) => (
        <li
          key={h.id}
          className="flex gap-2 rounded-lg border border-border/80 bg-surface-muted/40 px-3 py-2"
        >
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-violet-600" aria-hidden />
          <div className="min-w-0">
            <p className="font-medium text-heading">{h.title}</p>
            <p className="text-xs text-muted">{formatCalendarListDate(h.dateKey)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function SchoolHolidayLists({
  calendar,
  compact = false,
}: {
  calendar: {
    holidays?: { id?: string; title: string; date: string }[];
    entries?: { id?: string; title: string; category: string; startDate: string; endDate: string | null }[];
  } | null;
  /** Single column for sidebar layout beside month grid */
  compact?: boolean;
}) {
  const todayKey = toDateKey(new Date());
  const all = collectSchoolHolidayList(calendar ?? {});
  const upcoming = all.filter((h) => h.dateKey >= todayKey);

  return (
    <div
      className={
        compact
          ? "flex flex-col gap-5"
          : "mt-4 grid gap-4 border-t border-border pt-4 sm:grid-cols-2"
      }
    >
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wide text-brand">Upcoming holidays</h4>
        <p className="mt-0.5 text-[0.65rem] text-muted">From today ({upcoming.length})</p>
        <HolidayRows
          items={upcoming.slice(0, compact ? 6 : undefined)}
          emptyMessage="No upcoming holidays on the calendar."
          maxHeightClass={compact ? "max-h-40" : undefined}
        />
      </div>
      {!compact ? (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wide text-muted">All holidays</h4>
          <p className="mt-0.5 text-[0.65rem] text-muted">Full school year list ({all.length})</p>
          <HolidayRows
            items={all}
            emptyMessage="No holidays configured yet."
            maxHeightClass="max-h-52"
          />
        </div>
      ) : (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wide text-muted">All holidays</h4>
          <p className="mt-0.5 text-[0.65rem] text-muted">{all.length} in calendar</p>
          <HolidayRows
            items={all}
            emptyMessage="No holidays configured yet."
            maxHeightClass="max-h-36"
          />
        </div>
      )}
    </div>
  );
}
