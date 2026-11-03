"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import { studentNavLabel } from "@/config/nav";
import type { TimetableSubstituteRow } from "@/components/mobile/student-timetable-mobile";
import {
  StudentDayTimetableTable,
  TimetableWeekTable,
} from "@/components/timetable-week-table";
import type { TimetableSlotRow } from "@/components/timetable-week-grid";
import { titleCaseDay } from "@/lib/school-config-display";

type Tab = "week" | "today" | "substitutes";

function todayWeekDay(): string {
  const idx = new Date().getDay();
  const map = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  return map[idx] ?? "MONDAY";
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-2.5 shadow-[var(--shadow-card)] sm:px-4 sm:py-3">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-xl font-bold tabular-nums text-heading sm:text-2xl">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-muted">{sub}</p> : null}
    </div>
  );
}

function formatSubDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export type StudentTimetableExperienceProps = {
  loading: boolean;
  error: string | null;
  slots: TimetableSlotRow[];
  substitutes: TimetableSubstituteRow[];
  section: {
    label: string;
    className: string;
    sectionName: string;
    rollNumber: string | null;
  } | null;
  timetableName: string | null;
  infoMessage: string | null;
};

export function StudentTimetableExperience({
  loading,
  error,
  slots,
  substitutes,
  section,
  timetableName,
  infoMessage,
}: StudentTimetableExperienceProps) {
  const [tab, setTab] = useState<Tab>("week");
  const today = todayWeekDay();
  const todayLabel = titleCaseDay(today);

  const stats = useMemo(() => {
    const subjects = new Set(slots.map((s) => s.subject.name));
    const todayCount = slots.filter((s) => s.day === today).length;
    const subsToday = substitutes.filter((s) => {
      const d = new Date(s.date);
      const now = new Date();
      return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
      );
    });
    return {
      weekly: slots.length,
      today: todayCount,
      subjects: subjects.size,
      substitutes: substitutes.length,
      subsToday: subsToday.length,
    };
  }, [slots, substitutes, today]);

  const subtitle = section
    ? `Class ${section.label}${section.rollNumber ? ` · Roll ${section.rollNumber}` : ""}${
        timetableName ? ` · ${timetableName}` : ""
      }`
    : "Your weekly class schedule";

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: "week", label: "Week table" },
    { id: "today", label: "Today table" },
    ...(stats.substitutes > 0
      ? [{ id: "substitutes" as Tab, label: "Substitutes", badge: stats.substitutes }]
      : []),
  ];

  const subsTodayList = substitutes.filter((s) => {
    const d = new Date(s.date);
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  });

  return (
    <>
      <PanelAlerts error={error} />

      <PageHeader
        title={studentNavLabel("/student/timetable")}
        description={subtitle}
        actions={
          <Link href="/student" className="btn-secondary shrink-0 text-sm">
            Dashboard
          </Link>
        }
      />

      <section
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand-light px-5 py-6 text-white shadow-[var(--shadow-card)]"
        aria-label="Timetable summary"
      >
        <div className="pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-full bg-brand-gold/25 blur-2xl" />
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">
          {loading ? "Loading…" : todayLabel}
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
          {loading
            ? "Your week"
            : stats.today > 0
              ? `${stats.today} period${stats.today === 1 ? "" : "s"} today`
              : "No classes scheduled today"}
        </h2>
        <p className="mt-2 text-sm text-white/85">
          {section
            ? `${section.className}-${section.sectionName}`
            : "Published schedule from your class section"}
        </p>
        {!loading && stats.weekly > 0 && (
          <p className="mt-2 text-xs text-white/75">
            {stats.weekly} periods per week · {stats.subjects} subject{stats.subjects === 1 ? "" : "s"}
          </p>
        )}
        {stats.subsToday > 0 && (
          <p className="mt-3 inline-flex rounded-full bg-brand-gold/90 px-3 py-1 text-xs font-bold text-brand-dark">
            {stats.subsToday} substitute teacher{stats.subsToday === 1 ? "" : "s"} today
          </p>
        )}
      </section>

      {!loading && slots.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          <StatCard label="Week" value={stats.weekly} sub="Teaching periods" />
          <StatCard label="Today" value={stats.today} sub={todayLabel} />
          <StatCard label="Subjects" value={stats.subjects} />
          <StatCard label="Substitutes" value={stats.substitutes} sub="Scheduled" />
        </div>
      )}

      {subsTodayList.length > 0 && (
        <div className="rounded-xl border border-brand-gold/40 bg-brand-gold/10 px-4 py-3 text-sm">
          <p className="font-semibold text-brand-dark">Substitute teachers today</p>
          <ul className="mt-1 space-y-1 text-xs text-heading">
            {subsTodayList.map((s, i) => (
              <li key={i}>
                {s.slot.subject.name} ({s.slot.period.name}): {s.substituteTeacher.firstName}{" "}
                {s.substituteTeacher.lastName}
              </li>
            ))}
          </ul>
        </div>
      )}

      <nav
        className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-surface p-1 shadow-[var(--shadow-card)] scrollbar-none"
        aria-label="Timetable views"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex shrink-0 flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
              tab === t.id ? "bg-brand text-white shadow-sm" : "text-muted hover:bg-surface-muted hover:text-heading"
            }`}
          >
            {t.label}
            {t.badge != null && t.badge > 0 ? (
              <span
                className={`min-w-[1.25rem] rounded-full px-1.5 py-0.5 text-[0.625rem] font-bold tabular-nums ${
                  tab === t.id ? "bg-white/25 text-white" : "bg-brand/10 text-brand"
                }`}
              >
                {t.badge}
              </span>
            ) : null}
          </button>
        ))}
      </nav>

      <section className="card-panel overflow-hidden p-2 sm:p-4">
        {loading ? (
          <p className="empty-state text-sm">Loading your timetable…</p>
        ) : infoMessage && slots.length === 0 ? (
          <p className="empty-state text-sm">{infoMessage}</p>
        ) : slots.length === 0 ? (
          <p className="empty-state text-sm">No published timetable yet. Check back after your school publishes the schedule.</p>
        ) : tab === "week" ? (
          <>
            <p className="form-section-title mb-2 px-1 sm:mb-3">Weekly grid</p>
            <TimetableWeekTable slots={slots} mode="student" />
          </>
        ) : tab === "today" ? (
          <>
            <p className="form-section-title mb-2 px-1 sm:mb-3">Today&apos;s schedule</p>
            {stats.today === 0 ? (
              <p className="text-sm text-muted">No classes on your timetable for {todayLabel}.</p>
            ) : (
              <StudentDayTimetableTable slots={slots} day={today} />
            )}
          </>
        ) : (
          <div className="space-y-3 px-1">
            <p className="form-section-title">Substitute teachers</p>
            {substitutes.length === 0 ? (
              <p className="text-sm text-muted">No substitute assignments on your schedule.</p>
            ) : (
              <div className="-mx-1 overflow-x-auto sm:mx-0">
                <table className="w-full min-w-[18rem] border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-surface-muted text-muted">
                      <th className="border-b border-border px-2 py-2 font-semibold text-heading sm:px-3">Date</th>
                      <th className="border-b border-border px-2 py-2 font-semibold text-heading sm:px-3">Period</th>
                      <th className="border-b border-border px-2 py-2 font-semibold text-heading sm:px-3">Subject</th>
                      <th className="border-b border-border px-2 py-2 font-semibold text-heading sm:px-3">Teacher</th>
                    </tr>
                  </thead>
                  <tbody>
                    {substitutes.map((s, i) => (
                      <tr key={`${s.date}-${i}`} className="border-t border-border">
                        <td className="px-2 py-2 whitespace-nowrap text-muted sm:px-3">{formatSubDate(s.date)}</td>
                        <td className="px-2 py-2 sm:px-3">{s.slot.period.name}</td>
                        <td className="px-2 py-2 font-medium text-heading sm:px-3">{s.slot.subject.name}</td>
                        <td className="px-2 py-2 sm:px-3">
                          {s.substituteTeacher.firstName} {s.substituteTeacher.lastName}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
}
