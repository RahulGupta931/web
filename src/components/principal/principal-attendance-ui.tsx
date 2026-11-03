"use client";

import type { ReactNode } from "react";
import { MobileSummaryStats } from "@/components/mobile/mobile-primitives";
import { statusTone } from "@/components/mobile/mobile-primitives";

export const PRINCIPAL_ATTENDANCE_STATUSES = [
  "PRESENT",
  "ABSENT",
  "LATE",
  "HALF_DAY",
  "LEAVE_APPROVED",
] as const;

export type PrincipalAttendanceStatus = (typeof PRINCIPAL_ATTENDANCE_STATUSES)[number];

export function formatAttendanceStatus(status: string): string {
  return status.replace(/_/g, " ");
}

export function summarizeAttendance(
  ids: string[],
  statusById: Record<string, PrincipalAttendanceStatus>
): { present: number; absent: number; late: number; halfDay: number; leave: number; total: number } {
  let present = 0;
  let absent = 0;
  let late = 0;
  let halfDay = 0;
  let leave = 0;
  for (const id of ids) {
    const s = statusById[id] ?? "PRESENT";
    if (s === "PRESENT") present += 1;
    else if (s === "ABSENT") absent += 1;
    else if (s === "LATE") late += 1;
    else if (s === "HALF_DAY") halfDay += 1;
    else if (s === "LEAVE_APPROVED") leave += 1;
  }
  return { present, absent, late, halfDay, leave, total: ids.length };
}

export function AttendanceTabSwitch({
  tab,
  onTabChange,
  variant = "default",
}: {
  tab: "students" | "teachers";
  onTabChange: (t: "students" | "teachers") => void;
  variant?: "default" | "onBrand" | "workflow";
}) {
  if (variant === "workflow") {
    const tabs: { id: "students" | "teachers"; title: string; hint: string }[] = [
      { id: "students", title: "Student roster", hint: "Mark by class section" },
      { id: "teachers", title: "Teaching staff", hint: "Sign-in defaults & overrides" },
    ];
    return (
      <div className="grid gap-2 sm:grid-cols-2" role="tablist" aria-label="Attendance type">
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onTabChange(t.id)}
              className={`rounded-2xl border px-4 py-3 text-left transition shadow-sm ${
                active
                  ? "border-brand bg-gradient-to-br from-brand/10 to-brand/5 ring-2 ring-brand/25"
                  : "border-border bg-surface hover:border-brand/30"
              }`}
            >
              <p className={`text-sm font-semibold ${active ? "text-brand" : "text-heading"}`}>{t.title}</p>
              <p className="mt-0.5 text-xs text-muted">{t.hint}</p>
            </button>
          );
        })}
      </div>
    );
  }

  const base =
    variant === "onBrand"
      ? "flex gap-2"
      : "inline-flex rounded-xl border border-border bg-surface-muted/80 p-1";
  const activeStudent =
    variant === "onBrand"
      ? tab === "students"
        ? "bg-brand-gold text-brand-dark"
        : "bg-white/10 text-white"
      : tab === "students"
        ? "bg-brand text-white shadow-sm"
        : "text-muted hover:text-heading";
  const activeTeacher =
    variant === "onBrand"
      ? tab === "teachers"
        ? "bg-brand-gold text-brand-dark"
        : "bg-white/10 text-white"
      : tab === "teachers"
        ? "bg-brand text-white shadow-sm"
        : "text-muted hover:text-heading";

  const btnClass =
    variant === "onBrand"
      ? "flex-1 rounded-xl py-2 text-xs font-bold transition"
      : "rounded-lg px-4 py-2 text-sm font-semibold transition";

  return (
    <div className={base} role="tablist" aria-label="Attendance type">
      <button
        type="button"
        role="tab"
        aria-selected={tab === "students"}
        onClick={() => onTabChange("students")}
        className={`${btnClass} ${activeStudent}`}
      >
        Students
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={tab === "teachers"}
        onClick={() => onTabChange("teachers")}
        className={`${btnClass} ${activeTeacher}`}
      >
        Teachers
      </button>
    </div>
  );
}

export function AttendanceSummaryStats({
  ids,
  statusById,
}: {
  ids: string[];
  statusById: Record<string, PrincipalAttendanceStatus>;
}) {
  const s = summarizeAttendance(ids, statusById);
  if (s.total === 0) return null;
  return (
    <MobileSummaryStats
      items={[
        { label: "Present", value: s.present },
        { label: "Absent", value: s.absent },
        { label: "Late", value: s.late },
        { label: "Half day", value: s.halfDay + s.leave },
      ]}
    />
  );
}

export function AttendanceStatusChips({
  value,
  onChange,
  compact,
}: {
  value: PrincipalAttendanceStatus;
  onChange: (status: PrincipalAttendanceStatus) => void;
  compact?: boolean;
}) {
  return (
    <div className={`flex flex-wrap gap-1.5 ${compact ? "" : "mt-3"}`}>
      {PRINCIPAL_ATTENDANCE_STATUSES.map((st) => (
        <button
          key={st}
          type="button"
          aria-pressed={value === st}
          onClick={() => onChange(st)}
          className={`rounded-full px-2.5 py-1 font-semibold transition active:scale-95 ${
            compact ? "text-[0.6rem]" : "text-[0.65rem]"
          } ${value === st ? "bg-brand text-white shadow-sm" : "bg-surface-muted text-muted hover:bg-brand/10"}`}
        >
          {formatAttendanceStatus(st)}
        </button>
      ))}
    </div>
  );
}

function initials(first: string, last: string): string {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

export function AttendanceRosterCard({
  primary,
  secondary,
  status,
  onStatusChange,
  meta,
}: {
  primary: string;
  secondary: string;
  status: PrincipalAttendanceStatus;
  onStatusChange: (status: PrincipalAttendanceStatus) => void;
  /** e.g. auto sign-in note from the server */
  meta?: string | null;
}) {
  const [first, ...rest] = primary.split(" ");
  const last = rest.join(" ") || first;
  return (
    <li className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)]">
      <div className="flex gap-3 border-b border-border bg-gradient-to-r from-brand/5 to-transparent p-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-sm font-bold text-brand">
          {initials(first, last)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-heading">{primary}</p>
          <p className="text-xs text-muted">{secondary}</p>
          {meta && <p className="mt-0.5 text-[0.65rem] font-medium text-brand">{meta}</p>}
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold ${statusTone(status)}`}>
          {formatAttendanceStatus(status)}
        </span>
      </div>
      <div className="p-4 pt-3">
        <AttendanceStatusChips value={status} onChange={onStatusChange} compact />
      </div>
    </li>
  );
}

export function AttendanceToolbarCard({
  date,
  onDateChange,
  sectionLabel,
  children,
}: {
  date: string;
  onDateChange: (d: string) => void;
  sectionLabel?: string;
  children?: ReactNode;
}) {
  const formatted = new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="card-panel flex flex-wrap items-end justify-between gap-4 border-brand/15 bg-gradient-to-br from-brand/[0.04] to-surface">
      <div className="min-w-[12rem] flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Selected day</p>
        <p className="mt-1 text-sm font-semibold text-heading">{formatted}</p>
        {sectionLabel && <p className="mt-0.5 text-xs text-brand">{sectionLabel}</p>}
      </div>
      <label className="block text-sm">
        <span className="text-muted">Change date</span>
        <input
          type="date"
          className="mt-1 input-field"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </label>
      {children}
    </div>
  );
}
