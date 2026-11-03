import {
  formatBellScheduleTimeRange,
  STANDARD_BELL_SCHEDULE,
  titleCaseDay,
  type BellSlot,
} from "@/lib/school-config-display";
import type { TimetableSlotRow } from "@/components/timetable-week-grid";

const WORKING_DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"] as const;

const DAY_SHORT: Record<(typeof WORKING_DAYS)[number], string> = {
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
  SATURDAY: "Sat",
};

function slotMapKey(day: string, periodNo: number) {
  return `${day}:${periodNo}`;
}

function buildSlotMap(slots: TimetableSlotRow[]) {
  const map = new Map<string, TimetableSlotRow[]>();
  for (const slot of slots) {
    const periodNo = slot.period.periodNo;
    if (periodNo == null) continue;
    const key = slotMapKey(slot.day, periodNo);
    const list = map.get(key) ?? [];
    list.push(slot);
    map.set(key, list);
  }
  return map;
}

function formatTeacherCell(slot: TimetableSlotRow): string {
  const parts = [slot.subject.name];
  if (slot.section) {
    parts.push(`${slot.section.class.name}-${slot.section.name}`);
  }
  return parts.join(" · ");
}

function formatStudentCell(slot: TimetableSlotRow): string {
  const parts = [slot.subject.name];
  if (slot.teacher) {
    parts.push(`${slot.teacher.firstName} ${slot.teacher.lastName}`);
  }
  return parts.join(" · ");
}

function TimetableCellContent({
  items,
  mode,
}: {
  items: TimetableSlotRow[];
  mode: "student" | "teacher";
}) {
  if (items.length === 0) {
    return <span className="text-muted">—</span>;
  }
  return (
    <ul className="space-y-1">
      {items.map((slot, i) => (
        <li key={i} className="leading-snug">
          <span className="font-medium text-heading">
            {mode === "teacher" ? formatTeacherCell(slot) : formatStudentCell(slot)}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function StudentDayTimetableTable({
  slots,
  day,
  bellSchedule = STANDARD_BELL_SCHEDULE,
}: {
  slots: TimetableSlotRow[];
  day: string;
  bellSchedule?: BellSlot[];
}) {
  const slotMap = buildSlotMap(slots);
  const teachingRows = bellSchedule.filter((r) => !r.isBreak);

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-heading">{titleCaseDay(day)}</p>
      <div className="-mx-1 overflow-x-auto rounded-xl border border-[var(--border)] shadow-sm sm:mx-0">
        <table className="w-full min-w-[20rem] border-collapse text-left text-xs sm:text-sm">
          <thead>
            <tr className="bg-[var(--surface-muted)] text-muted">
              <th scope="col" className="border-b border-[var(--border)] px-2 py-2 font-semibold text-heading sm:px-3">
                Period
              </th>
              <th scope="col" className="border-b border-[var(--border)] px-2 py-2 font-semibold text-heading sm:px-3">
                Time
              </th>
              <th scope="col" className="border-b border-[var(--border)] px-2 py-2 font-semibold text-heading sm:px-3">
                Subject & teacher
              </th>
            </tr>
          </thead>
          <tbody>
            {teachingRows.map((row) => {
              const items = slotMap.get(slotMapKey(day, row.periodNo)) ?? [];
              return (
                <tr key={row.periodNo} className="bg-[var(--surface)]">
                  <th
                    scope="row"
                    className="border-t border-[var(--border)] px-2 py-2 font-medium text-heading sm:px-3"
                  >
                    {row.name}
                  </th>
                  <td className="border-t border-[var(--border)] px-2 py-2 whitespace-nowrap tabular-nums text-muted sm:px-3">
                    {formatBellScheduleTimeRange(row.startTime, row.endTime)}
                  </td>
                  <td className="border-t border-[var(--border)] px-2 py-2 align-top sm:px-3">
                    <TimetableCellContent items={items} mode="student" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TimetableWeekTable({
  slots,
  mode = "student",
  bellSchedule = STANDARD_BELL_SCHEDULE,
}: {
  slots: TimetableSlotRow[];
  mode?: "student" | "teacher";
  bellSchedule?: BellSlot[];
}) {
  const slotMap = buildSlotMap(slots);
  const hasAnyTeaching = slots.length > 0;

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted sm:text-sm">
        Seven 40-minute teaching periods each day (Mon–Sat). Assembly, breaks, and dispersal are shown for reference.
      </p>
      {!hasAnyTeaching && (
        <p className="text-sm text-muted">No published teaching periods assigned yet.</p>
      )}
      <p className="text-center text-[0.65rem] font-medium text-brand sm:hidden" aria-hidden>
        Swipe sideways for all days →
      </p>
      <div className="-mx-1 overflow-x-auto rounded-xl border border-[var(--border)] shadow-sm sm:mx-0 [scrollbar-width:thin]">
        <table className="min-w-[44rem] w-full border-collapse text-left text-[0.6875rem] sm:min-w-[52rem] sm:text-sm">
          <thead>
            <tr className="bg-[var(--surface-muted)] text-muted">
              <th
                scope="col"
                className="sticky left-0 z-10 min-w-[7.5rem] border-b border-[var(--border)] bg-[var(--surface-muted)] px-2 py-2 font-semibold text-heading shadow-[4px_0_8px_-4px_rgb(0_0_0/0.12)] sm:min-w-[11rem] sm:px-3 sm:py-2.5"
              >
                Activity
              </th>
              <th
                scope="col"
                className="min-w-[5.5rem] border-b border-[var(--border)] px-2 py-2 font-semibold text-heading sm:min-w-[8.5rem] sm:px-3 sm:py-2.5"
              >
                Time
              </th>
              {WORKING_DAYS.map((day) => (
                <th
                  key={day}
                  scope="col"
                  className="min-w-[5rem] border-b border-[var(--border)] px-1.5 py-2 text-center font-semibold text-heading sm:min-w-[6.5rem] sm:px-2 sm:py-2.5"
                >
                  <span className="hidden sm:inline">{titleCaseDay(day)}</span>
                  <span className="sm:hidden">{DAY_SHORT[day]}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bellSchedule.map((row) => (
              <tr
                key={row.periodNo}
                className={row.isBreak ? "bg-[var(--surface-muted)]/60" : "bg-[var(--surface)]"}
              >
                <th
                  scope="row"
                  className={`sticky left-0 z-[1] border-t border-[var(--border)] px-2 py-1.5 text-left font-medium shadow-[4px_0_8px_-4px_rgb(0_0_0/0.08)] sm:px-3 sm:py-2 ${
                    row.isBreak ? "text-muted" : "text-heading"
                  } ${row.isBreak ? "bg-[var(--surface-muted)]/90" : "bg-[var(--surface)]"}`}
                >
                  {row.name}
                </th>
                <td className="border-t border-[var(--border)] px-2 py-1.5 whitespace-nowrap text-[0.65rem] text-muted tabular-nums sm:px-3 sm:py-2 sm:text-xs">
                  {formatBellScheduleTimeRange(row.startTime, row.endTime)}
                </td>
                {row.isBreak
                  ? WORKING_DAYS.map((day) => (
                      <td
                        key={day}
                        className="border-t border-[var(--border)] px-1.5 py-1.5 text-center text-[0.65rem] text-muted sm:px-2 sm:py-2 sm:text-xs"
                      >
                        —
                      </td>
                    ))
                  : WORKING_DAYS.map((day) => (
                      <td
                        key={day}
                        className="border-t border-[var(--border)] px-1.5 py-1.5 align-top text-[0.65rem] sm:px-2 sm:py-2 sm:text-xs"
                      >
                        <TimetableCellContent
                          items={slotMap.get(slotMapKey(day, row.periodNo)) ?? []}
                          mode={mode}
                        />
                      </td>
                    ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
