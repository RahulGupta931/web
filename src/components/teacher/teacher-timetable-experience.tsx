"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  StudentTimetableMobile,
  type TimetableSubstituteRow,
} from "@/components/mobile/student-timetable-mobile";
import { useAuth } from "@/components/auth-provider";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import { teacherNavLabel } from "@/config/nav";
import { TimetableWeekTable } from "@/components/timetable-week-table";
import type { TimetableSlotRow } from "@/components/timetable-week-grid";
import { titleCaseDay } from "@/lib/school-config-display";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

type Tab = "week" | "day" | "substitutes";

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
    <div className="rounded-xl border border-border bg-surface px-4 py-3 shadow-[var(--shadow-card)]">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-2xl font-bold tabular-nums text-heading">{value}</p>
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

export function TeacherTimetableExperience() {
  const { loading: authLoading } = useAuth();
  const { get, isReady } = useApi();
  const [slots, setSlots] = useState<TimetableSlotRow[]>([]);
  const [substitutes, setSubstitutes] = useState<TimetableSubstituteRow[]>([]);
  const [tab, setTab] = useState<Tab>("week");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    if (!isReady) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    get<{ slots: TimetableSlotRow[]; substitutes?: TimetableSubstituteRow[] }>("/api/teacher/timetable")
      .then((d) => {
        setSlots(Array.isArray(d.slots) ? d.slots : []);
        setSubstitutes(Array.isArray(d.substitutes) ? d.substitutes : []);
      })
      .catch((e) => {
        setSlots([]);
        setSubstitutes([]);
        setError(getApiErrorMessage(e));
      })
      .finally(() => setLoading(false));
  }, [get, isReady]);

  useEffect(() => {
    if (authLoading) return;
    load();
  }, [authLoading, load]);

  const stats = useMemo(() => {
    const sections = new Set(
      slots.filter((s) => s.section).map((s) => `${s.section!.class.name}-${s.section!.name}`)
    );
    const subjects = new Set(slots.map((s) => s.subject.name));
    const today = todayWeekDay();
    const todayCount = slots.filter((s) => s.day === today).length;
    return {
      weekly: slots.length,
      today: todayCount,
      sections: sections.size,
      subjects: subjects.size,
      substitutes: substitutes.length,
    };
  }, [slots, substitutes]);

  const todayLabel = titleCaseDay(todayWeekDay());

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: "week", label: "Week grid" },
    { id: "day", label: "Day view" },
    { id: "substitutes", label: "Substitute duty", badge: stats.substitutes || undefined },
  ];

  return (
    <>
      <PanelAlerts error={error} />
      <PageHeader
        title={teacherNavLabel("/teacher/timetable")}
        description="Published weekly schedule from the school bell grid — your classes and substitute assignments."
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
          {loading ? "Your teaching week" : stats.today > 0 ? `${stats.today} class${stats.today === 1 ? "" : "es"} today` : "No classes scheduled today"}
        </h2>
        <p className="mt-2 text-sm text-white/85">
          {stats.weekly > 0
            ? `${stats.weekly} teaching periods per week across ${stats.sections} section${stats.sections === 1 ? "" : "s"} · ${stats.subjects} subject${stats.subjects === 1 ? "" : "s"}`
            : "Timetable appears here once the principal publishes it."}
        </p>
        {stats.substitutes > 0 && (
          <p className="mt-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
            {stats.substitutes} upcoming substitute assignment{stats.substitutes === 1 ? "" : "s"}
          </p>
        )}
      </section>

      {slots.length > 0 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <StatCard label="Periods / week" value={stats.weekly} />
          <StatCard label="Today" value={stats.today} sub={todayLabel} />
          <StatCard label="Class sections" value={stats.sections} />
          <StatCard label="Subjects" value={stats.subjects} />
        </div>
      )}

      <nav
        className="mt-6 flex gap-1 overflow-x-auto rounded-xl border border-border bg-surface p-1 shadow-[var(--shadow-card)]"
        aria-label="Timetable views"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex shrink-0 flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-sm font-medium transition-colors sm:px-3 ${
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

      <div className="mt-6">
        {loading ? (
          <p className="empty-state">Loading timetable…</p>
        ) : slots.length === 0 && substitutes.length === 0 ? (
          <div className="empty-state">
            No published timetable yet. Check back after the principal publishes the schedule.
          </div>
        ) : tab === "week" ? (
          <section className="card-panel overflow-hidden p-3 sm:p-4">
            <p className="form-section-title mb-3 px-1">Weekly grid</p>
            <TimetableWeekTable slots={slots} mode="teacher" />
          </section>
        ) : tab === "day" ? (
          <section className="card-panel form-shell">
            <StudentTimetableMobile
              slots={slots}
              substitutes={substitutes}
              mode="teacher"
              showHero={false}
            />
          </section>
        ) : (
          <section className="space-y-3">
            {substitutes.length === 0 ? (
              <div className="empty-state">No substitute duties assigned.</div>
            ) : (
              substitutes.map((s, i) => {
                const sec = s.slot.section;
                const classLabel = sec ? `${sec.class.name}-${sec.name}` : "—";
                return (
                  <article
                    key={`${s.date}-${i}`}
                    className="card-panel flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-heading">{s.slot.subject.name}</p>
                      <p className="mt-0.5 text-sm text-muted">
                        {titleCaseDay(s.slot.day)} · {s.slot.period.name} · Class {classLabel}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-sky-500/12 px-3 py-1 text-xs font-bold text-sky-900">
                      {formatSubDate(s.date)}
                    </span>
                  </article>
                );
              })
            )}
          </section>
        )}
      </div>
    </>
  );
}
