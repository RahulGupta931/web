"use client";

import { useEffect, useMemo, useState } from "react";
import { MobileEmptyState, MobileFilterChips, MobilePageHero } from "@/components/mobile/mobile-primitives";
import { formatBellScheduleTimeRange, titleCaseDay } from "@/lib/school-config-display";
import type { TimetableSlotRow } from "@/components/timetable-week-grid";

const WEEK_DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
] as const;

type WeekDay = (typeof WEEK_DAYS)[number];

const DAY_SHORT: Record<WeekDay, string> = {
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
  SATURDAY: "Sat",
};

function todayWeekDay(): WeekDay {
  const idx = new Date().getDay();
  const map: (WeekDay | null)[] = [
    null,
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  return map[idx] ?? "MONDAY";
}

function periodTimeLabel(period: TimetableSlotRow["period"]): string | null {
  const start = (period as { startTime?: string }).startTime;
  const end = (period as { endTime?: string }).endTime;
  if (!start || !end) return null;
  return formatBellScheduleTimeRange(start, end);
}

function isNowInRange(start: string, end: string): boolean {
  const now = new Date();
  const toMins = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + (m ?? 0);
  };
  const cur = now.getHours() * 60 + now.getMinutes();
  return cur >= toMins(start) && cur < toMins(end);
}

function subjectAccent(name: string): string {
  const hues = [
    "bg-brand/10 text-brand border-brand/20",
    "bg-emerald-500/10 text-emerald-800 border-emerald-500/20",
    "bg-sky-500/10 text-sky-900 border-sky-500/20",
    "bg-violet-500/10 text-violet-900 border-violet-500/20",
    "bg-amber-500/10 text-amber-900 border-amber-500/20",
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h + name.charCodeAt(i)) % hues.length;
  return hues[h];
}

export type TimetableSubstituteRow = {
  date: string;
  substituteTeacher: { firstName: string; lastName: string };
  slot: {
    day: string;
    period: { name: string };
    subject: { name: string };
    section?: { name: string; class: { name: string } };
  };
};

export function StudentTimetableMobile({
  slots,
  substitutes = [],
  heroKicker = "Student",
  heroTitle = "My timetable",
  mode = "student",
  showHero = true,
}: {
  slots: TimetableSlotRow[];
  substitutes?: TimetableSubstituteRow[];
  heroKicker?: string;
  heroTitle?: string;
  mode?: "student" | "teacher";
  /** When false, only day chips and period list (for embedding in a parent layout). */
  showHero?: boolean;
}) {
  const availableDays = useMemo(
    () => WEEK_DAYS.filter((d) => slots.some((s) => s.day === d)),
    [slots]
  );

  const [selectedDay, setSelectedDay] = useState<WeekDay>(todayWeekDay());

  useEffect(() => {
    if (availableDays.length > 0 && !availableDays.includes(selectedDay)) {
      setSelectedDay(availableDays[0]);
    }
  }, [availableDays, selectedDay]);

  const daySlots = useMemo(() => {
    return slots
      .filter((s) => s.day === selectedDay)
      .sort((a, b) => (a.period.periodNo ?? 0) - (b.period.periodNo ?? 0));
  }, [slots, selectedDay]);

  const sectionLabel =
    mode === "teacher"
      ? (() => {
          const sections = new Set(
            slots
              .filter((s) => s.section)
              .map((s) => `${s.section!.class.name}-${s.section!.name}`)
          );
          const subjects = new Set(slots.map((s) => s.subject.name));
          const subjectPart =
            subjects.size === 1 ? [...subjects][0] : `${subjects.size} subjects`;
          return `${subjectPart} · ${sections.size} class section${sections.size === 1 ? "" : "s"}`;
        })()
      : slots[0]?.section
        ? `Class ${slots[0].section.class.name}-${slots[0].section.name}`
        : "Your section";

  const isToday = selectedDay === todayWeekDay();
  const todayClassCount = useMemo(
    () => slots.filter((s) => s.day === todayWeekDay()).length,
    [slots]
  );
  const chipOptions = (availableDays.length > 0 ? availableDays : WEEK_DAYS).map((d) => ({
    value: d,
    label: DAY_SHORT[d],
  }));

  const subsToday = substitutes.filter((s) => {
    const slotDay = s.slot.day;
    if (slotDay !== selectedDay) return false;
    const d = new Date(s.date);
    const today = new Date();
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  });

  if (slots.length === 0) {
    return (
      <div className="space-y-4">
        {showHero ? (
          <MobilePageHero
            kicker={heroKicker}
            title={heroTitle}
            subtitle="Your weekly class schedule will appear here once published."
          />
        ) : null}
        <MobileEmptyState message="No timetable published yet." />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showHero ? (
        <MobilePageHero kicker={heroKicker} title={heroTitle} subtitle={sectionLabel}>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
              {slots.length} periods / week
            </span>
            {todayClassCount > 0 && (
              <span className="rounded-full bg-brand-gold/90 px-3 py-1 text-xs font-bold text-brand-dark">
                {todayClassCount} classes today
              </span>
            )}
          </div>
        </MobilePageHero>
      ) : null}

      <MobileFilterChips
        options={chipOptions}
        value={selectedDay}
        onChange={(d) => setSelectedDay(d as WeekDay)}
      />

      <p className="text-center text-sm font-semibold text-heading">{titleCaseDay(selectedDay)}</p>

      {subsToday.length > 0 && mode === "student" && (
        <div className="rounded-2xl border border-brand-gold/40 bg-brand-gold/10 px-4 py-3 text-sm">
          <p className="font-semibold text-brand-dark">Substitute teachers today</p>
          <ul className="mt-1 space-y-1 text-xs text-heading">
            {subsToday.map((s, i) => (
              <li key={i}>
                {s.slot.subject.name} ({s.slot.period.name}):{" "}
                {s.substituteTeacher.firstName} {s.substituteTeacher.lastName}
              </li>
            ))}
          </ul>
        </div>
      )}
      {subsToday.length > 0 && mode === "teacher" && (
        <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-sm">
          <p className="font-semibold text-sky-900">Substitute duty today</p>
          <ul className="mt-1 space-y-1 text-xs text-heading">
            {subsToday.map((s, i) => {
              const sec = s.slot.section;
              const classLabel = sec ? `Class ${sec.class.name}-${sec.name}` : "Class TBD";
              return (
                <li key={i}>
                  {s.slot.subject.name} ({s.slot.period.name}) · {classLabel}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {daySlots.length === 0 ? (
        <MobileEmptyState message="No classes on this day." />
      ) : (
        <ul className="space-y-3">
          {daySlots.map((s, i) => {
            const time = periodTimeLabel(s.period);
            const start = (s.period as { startTime?: string }).startTime;
            const end = (s.period as { endTime?: string }).endTime;
            const isLive = isToday && start && end && isNowInRange(start, end);
            const accent = subjectAccent(s.subject.name);
            const teacher = s.teacher
              ? `${s.teacher.firstName} ${s.teacher.lastName}`
              : null;
            const classLabel = s.section
              ? `Class ${s.section.class.name}-${s.section.name}`
              : null;
            const metaLine =
              mode === "teacher"
                ? [classLabel].filter(Boolean).join(" · ")
                : [teacher].filter(Boolean).join(" · ");

            return (
              <li
                key={`${s.day}-${s.period.periodNo ?? i}-${s.section?.class.name ?? ""}-${s.section?.name ?? ""}-${i}`}
                className={`relative flex overflow-hidden rounded-2xl border bg-surface shadow-[var(--shadow-card)] ${
                  isLive ? "border-brand-gold ring-2 ring-brand-gold/30" : "border-border"
                }`}
              >
                <span
                  className={`w-1 shrink-0 ${isLive ? "bg-brand-gold" : "bg-brand"}`}
                  aria-hidden
                />
                <div className="min-w-0 flex-1 p-4 pr-14">
                  {time && (
                    <p className="text-xs font-bold tabular-nums text-brand">{time}</p>
                  )}
                  <p className="mt-1 text-base font-bold leading-snug text-heading">{s.subject.name}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {s.period.name}
                    {s.period.periodNo != null ? ` · Period ${s.period.periodNo}` : ""}
                  </p>
                  {metaLine && (
                    <p className="mt-2 text-sm font-medium text-foreground/90">{metaLine}</p>
                  )}
                </div>
                {isLive && (
                  <span className="absolute right-3 top-3 rounded-full bg-brand-gold px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-brand-dark">
                    Now
                  </span>
                )}
                <span
                  className={`absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-lg border text-center text-xs font-bold tabular-nums ${accent}`}
                  aria-hidden
                >
                  {s.period.periodNo ?? i + 1}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
