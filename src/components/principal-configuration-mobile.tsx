"use client";

import {
  formatBellScheduleTimeRange,
  formatTime12,
  titleCaseDay,
  type BellSlot,
} from "@/lib/school-config-display";

export function ConfigurationMobileHero({
  classCount,
  teachingPeriods,
  periodMinutes,
  kicker = "School setup",
  title = "Classes 1–12 · Mon–Sat",
  dayRange,
  academicLevels = 12,
}: {
  classCount: number;
  teachingPeriods: number;
  periodMinutes: number;
  kicker?: string;
  title?: string;
  dayRange?: string;
  academicLevels?: number;
}) {
  const range =
    dayRange ?? `${formatTime12("08:30")} – ${formatTime12("14:45")}`;
  return (
    <section
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand-light px-4 py-5 text-white shadow-[var(--shadow-card)]"
      aria-label="School configuration"
    >
      <div className="pointer-events-none absolute -right-8 top-0 h-32 w-32 rounded-full bg-brand-gold/25 blur-2xl" />
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">{kicker}</p>
      <h2 className="mt-1 text-xl font-bold tracking-tight">
        {title === "Classes 1–12 · Mon–Sat"
          ? `Classes 1–${academicLevels} · Mon–Sat`
          : title}
      </h2>
      <p className="mt-2 text-sm text-white/85">
        {teachingPeriods} teaching periods × {periodMinutes} min · {classCount} class levels configured
      </p>
      <p className="mt-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
        School day {range}
      </p>
    </section>
  );
}

export function ConfigurationStatGrid({
  items,
}: {
  items: { label: string; value: string }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-border bg-surface px-3 py-3 shadow-[var(--shadow-card)]"
        >
          <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted">{item.label}</p>
          <p className="mt-1 text-sm font-semibold text-heading leading-snug">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

export function WorkingDaysPills({ days }: { days: string[] }) {
  return (
    <section aria-label="Working days">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Working week</h3>
      <div className="flex flex-wrap gap-2">
        {days.map((d) => (
          <span
            key={d}
            className="rounded-full bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand"
          >
            {titleCaseDay(d)}
          </span>
        ))}
      </div>
    </section>
  );
}

function slotAccent(slot: BellSlot): string {
  if (slot.name.toLowerCase().includes("dispersal")) return "border-brand-gold/50 bg-brand-gold/10";
  if (slot.isBreak) return "border-brand-gold/30 bg-brand-gold/5";
  return "border-brand/25 bg-brand/5";
}

function dotAccent(slot: BellSlot): string {
  if (slot.isBreak) return "border-brand-gold bg-brand-gold/30";
  return "border-brand bg-brand/20";
}

export function BellScheduleTimeline({
  slots,
  title = "Standard bell schedule",
}: {
  slots: BellSlot[];
  title?: string;
}) {
  return (
    <section className="card-panel overflow-hidden p-0" aria-label={title}>
      <div className="border-b border-border bg-gradient-to-r from-brand/5 to-transparent px-4 py-3">
        <h3 className="text-sm font-semibold text-heading">{title}</h3>
        <p className="text-xs text-muted">7 × 40-minute periods · fixed breaks</p>
      </div>
      <ul className="divide-y divide-border">
        {slots.map((slot, i) => (
          <li key={slot.periodNo} className="relative flex gap-3 px-4 py-3.5">
            {i < slots.length - 1 && (
              <span
                className="absolute left-[1.35rem] top-10 bottom-0 w-px bg-border"
                aria-hidden
              />
            )}
            <span
              className={`relative z-[1] mt-1 flex h-3 w-3 shrink-0 rounded-full border-2 ${dotAccent(slot)}`}
              aria-hidden
            />
            <div className={`min-w-0 flex-1 rounded-xl border px-3 py-2.5 ${slotAccent(slot)}`}>
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-heading leading-snug">{slot.name}</p>
                <p className="shrink-0 text-right text-xs font-semibold tabular-nums text-brand-dark">
                  {formatBellScheduleTimeRange(slot.startTime, slot.endTime)}
                </p>
              </div>
              <p className="mt-1 text-[0.65rem] font-medium uppercase tracking-wide text-muted">
                {slot.isBreak ? "Non-teaching" : "Teaching period"}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function BreakHighlights({
  morningBreak,
  supervised,
  lunch,
}: {
  morningBreak: string;
  supervised: string;
  lunch: string;
}) {
  return (
    <section aria-label="Fixed breaks">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Fixed breaks</h3>
      <div className="grid gap-2">
        {[
          { label: "Morning break", time: morningBreak },
          { label: "Supervised reading / diary", time: supervised },
          { label: "Lunch", time: lunch },
        ].map((b) => (
          <div
            key={b.label}
            className="flex items-center justify-between rounded-xl border border-border bg-surface px-3 py-2.5 shadow-sm"
          >
            <span className="text-sm text-heading">{b.label}</span>
            <span className="text-xs font-semibold tabular-nums text-brand">{b.time}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
