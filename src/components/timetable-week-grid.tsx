import { formatBellScheduleTimeRange } from "@/lib/school-config-display";

const DAY_ORDER = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

export type TimetableSlotRow = {
  day: string;
  period: { name: string; periodNo?: number; startTime?: string; endTime?: string };
  subject: { name: string };
  teacher?: { firstName: string; lastName: string } | null;
  section?: { name: string; class: { name: string } };
  classroom?: { name: string } | null;
};

export function TimetableWeekGrid({
  slots,
  mode = "student",
}: {
  slots: TimetableSlotRow[];
  mode?: "student" | "teacher";
}) {
  const groups = DAY_ORDER.map((day) => ({
    day,
    items: slots.filter((s) => s.day === day),
  })).filter((g) => g.items.length > 0);

  if (groups.length === 0) {
    return <p className="empty-state">No timetable published yet.</p>;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {groups.map((g) => (
        <div key={g.day} className="dash-card">
          <p className="dash-card-title">{g.day}</p>
          <ul className="mt-3 space-y-2.5">
            {g.items.map((s, i) => (
              <li key={i} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm">
                <p className="font-medium text-heading">{s.subject.name}</p>
                <p className="text-xs text-muted">
                  {s.period.name}
                  {s.period.startTime && s.period.endTime
                    ? ` · ${formatBellScheduleTimeRange(s.period.startTime, s.period.endTime)}`
                    : ""}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {mode === "teacher"
                    ? [
                        s.section ? `Class ${s.section.class.name}-${s.section.name}` : null,
                      ]
                        .filter(Boolean)
                        .join(" · ")
                    : [
                        s.section ? `Class ${s.section.class.name}-${s.section.name}` : null,
                        s.teacher ? `${s.teacher.firstName} ${s.teacher.lastName}` : null,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
