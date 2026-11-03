"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BellScheduleTimeline,
  BreakHighlights,
  ConfigurationMobileHero,
  WorkingDaysPills,
} from "@/components/principal-configuration-mobile";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import { studentNavLabel } from "@/config/nav";
import type { SchoolConfigResponse } from "@/components/school-configuration-view";
import {
  AttendanceRulesCard,
  ConfigurationSkeleton,
  CurriculumBands,
} from "@/components/school-configuration-experience";
import {
  formatTime12,
  formatTimeRange,
  STANDARD_BELL_SCHEDULE,
} from "@/lib/school-config-display";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

type ConfigTab = "overview" | "bell" | "attendance" | "curriculum";

const TABS: { id: ConfigTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "bell", label: "Bell schedule" },
  { id: "attendance", label: "Attendance" },
  { id: "curriculum", label: "Subjects" },
];

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-2.5 shadow-[var(--shadow-card)] sm:px-4 sm:py-3">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-lg font-bold leading-snug text-heading sm:text-xl">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-muted">{sub}</p> : null}
    </div>
  );
}

export function StudentConfigurationExperience() {
  const { get } = useApi();
  const [config, setConfig] = useState<SchoolConfigResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<ConfigTab>("overview");

  useEffect(() => {
    setLoading(true);
    get<SchoolConfigResponse>("/api/student/school-configuration")
      .then(setConfig)
      .catch((e) => {
        setConfig(null);
        setError(getApiErrorMessage(e));
      })
      .finally(() => setLoading(false));
  }, [get]);

  const timings = config?.standards.timings;
  const workingDays = useMemo(() => {
    if (!config) return [];
    return config.school.workingDays?.length
      ? config.school.workingDays
      : config.standards.workingDays ?? [];
  }, [config]);

  const standardBellSlots = useMemo(
    () => config?.standards.bellScheduleTemplate ?? STANDARD_BELL_SCHEDULE,
    [config]
  );

  const dayRange =
    timings
      ? `${formatTime12(timings.schoolOpening)} – ${formatTime12(timings.schoolDispersal)}`
      : undefined;

  return (
    <>
      <PanelAlerts error={error} />
      <PageHeader
        title={studentNavLabel("/student/configuration")}
        description="When school starts and ends, breaks, how attendance is counted, and subject areas by class — for your reference."
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/student/timetable" className="btn-secondary shrink-0 text-sm">
              My timetable
            </Link>
            <Link href="/student" className="btn-secondary shrink-0 text-sm">
              Dashboard
            </Link>
          </div>
        }
      />

      {loading && !config ? (
        <ConfigurationSkeleton />
      ) : config && timings ? (
        <div className="space-y-6">
          <ConfigurationMobileHero
            classCount={config.school.classCount}
            teachingPeriods={config.school.teachingPeriodsPerDay || timings.teachingPeriodsPerDay}
            periodMinutes={timings.teachingPeriodMinutes}
            kicker="Your school day"
            title={`Nursery · LKG · UKG · Classes 1–${config.standards.academicLevels}`}
            dayRange={dayRange}
            academicLevels={config.standards.academicLevels}
          />

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            <StatCard label="School opens" value={formatTime12(timings.schoolOpening)} />
            <StatCard
              label="Prayer"
              value={formatTimeRange(timings.prayerAssembly.start, timings.prayerAssembly.end)}
            />
            <StatCard label="Lunch" value={formatTimeRange(timings.lunch.start, timings.lunch.end)} />
            <StatCard
              label="Dispersal"
              value={formatTime12(timings.schoolDispersal)}
              sub={`${timings.teachingPeriodsPerDay} × ${timings.teachingPeriodMinutes} min`}
            />
          </div>

          <nav
            className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-surface p-1 shadow-[var(--shadow-card)] scrollbar-none"
            aria-label="School information sections"
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`shrink-0 flex-1 rounded-lg px-2 py-2.5 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
                  tab === t.id
                    ? "bg-brand text-white shadow-sm"
                    : "text-muted hover:bg-surface-muted hover:text-heading"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          {tab === "overview" && (
            <div className="space-y-6">
              <section className="card-panel overflow-hidden">
                <div className="border-b border-border bg-gradient-to-r from-brand/8 via-transparent to-transparent px-4 py-3 sm:px-5">
                  <p className="form-section-title">Typical school day</p>
                  <p className="mt-1 text-sm text-muted">
                    {workingDays.length} working days per week · classes Nursery through{" "}
                    {config.standards.academicLevels} (including Science, Commerce & Arts streams in 11–12)
                  </p>
                </div>
                <div className="form-shell space-y-6">
                  <WorkingDaysPills days={workingDays} />
                  <BreakHighlights
                    morningBreak={formatTimeRange(timings.morningBreak.start, timings.morningBreak.end)}
                    supervised={formatTimeRange(
                      timings.supervisedClassworkTransition.start,
                      timings.supervisedClassworkTransition.end
                    )}
                    lunch={formatTimeRange(timings.lunch.start, timings.lunch.end)}
                  />
                </div>
              </section>

              <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    label: "Grades offered",
                    value: `Up to class ${config.standards.academicLevels}`,
                    hint: `${config.school.classCount} class levels configured`,
                  },
                  {
                    label: "Class periods",
                    value: `${config.school.teachingPeriodsPerDay} per day`,
                    hint: `${timings.teachingPeriodMinutes} minutes each`,
                  },
                  {
                    label: "End of day",
                    value: formatTimeRange(timings.dispersalWindow.start, timings.dispersalWindow.end),
                    hint: "Dispersal window",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-border bg-surface p-4 shadow-[var(--shadow-card)]"
                  >
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{item.label}</dt>
                    <dd className="mt-1.5 font-semibold text-heading">{item.value}</dd>
                    {item.hint && <dd className="mt-1 text-xs text-muted">{item.hint}</dd>}
                  </div>
                ))}
              </dl>
            </div>
          )}

          {tab === "bell" && (
            <section className="card-panel overflow-hidden p-3 sm:p-5">
              <div className="mb-4 rounded-xl border border-brand/20 bg-brand/[0.04] px-4 py-3 text-sm text-heading">
                <strong className="text-brand">Bell timings</strong> — {dayRange} ·{" "}
                {timings.teachingPeriodsPerDay} teaching periods of {timings.teachingPeriodMinutes} minutes
              </div>
              <BellScheduleTimeline slots={standardBellSlots} title="Full day schedule" />
            </section>
          )}

          {tab === "attendance" && (
            <div className="space-y-3">
              <p className="text-sm text-muted px-1">
                These rules explain how your attendance is recorded in the student portal.
              </p>
              <AttendanceRulesCard config={config} />
            </div>
          )}

          {tab === "curriculum" && (
            <section className="card-panel form-shell">
              <p className="mb-4 text-sm text-muted">
                Subject areas taught at each stage of school. Your personal timetable shows your actual periods.
              </p>
              <CurriculumBands config={config} />
            </section>
          )}
        </div>
      ) : null}
    </>
  );
}
