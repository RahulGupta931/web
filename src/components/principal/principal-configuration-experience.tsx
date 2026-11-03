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
import { principalNavLabel } from "@/config/nav";
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
  titleCaseDay,
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
    <div className="rounded-xl border border-border bg-surface px-4 py-3 shadow-[var(--shadow-card)]">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-lg font-bold leading-snug text-heading sm:text-xl">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-muted">{sub}</p> : null}
    </div>
  );
}

export function PrincipalConfigurationExperience() {
  const { get } = useApi();
  const [config, setConfig] = useState<SchoolConfigResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<ConfigTab>("overview");

  useEffect(() => {
    setLoading(true);
    get<SchoolConfigResponse>("/api/principal/school-configuration")
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
        title={principalNavLabel("/principal/configuration")}
        description="School-wide standards: working week, bell schedule, attendance rules, and curriculum subject bands."
        actions={
          <Link href="/principal/timetable" className="btn-secondary shrink-0 text-sm">
            Timetable
          </Link>
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
            kicker="School standards"
            title={`Classes 1–${config.standards.academicLevels}`}
            dayRange={dayRange}
            academicLevels={config.standards.academicLevels}
          />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="School opens" value={formatTime12(timings.schoolOpening)} />
            <StatCard
              label="Prayer assembly"
              value={formatTimeRange(timings.prayerAssembly.start, timings.prayerAssembly.end)}
            />
            <StatCard label="Lunch" value={formatTimeRange(timings.lunch.start, timings.lunch.end)} />
            <StatCard
              label="Dispersal"
              value={formatTime12(timings.schoolDispersal)}
              sub={`${timings.teachingPeriodsPerDay} × ${timings.teachingPeriodMinutes} min periods`}
            />
          </div>

          <nav
            className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-surface p-1 shadow-[var(--shadow-card)]"
            aria-label="Configuration sections"
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`flex shrink-0 flex-1 rounded-lg px-2 py-2.5 text-sm font-medium transition-colors sm:px-3 ${
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
                  <p className="form-section-title">School day</p>
                  <p className="mt-1 text-sm text-muted">
                    Standards that drive timetables, attendance, and class setup · {config.school.classCount}{" "}
                    class levels · working week{" "}
                    {workingDays.map((d) => titleCaseDay(d).slice(0, 3)).join(" – ")}
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
                    label: "Academic structure",
                    value: `Through class ${config.standards.academicLevels}`,
                    hint: "Includes pre-primary and senior secondary",
                  },
                  {
                    label: "Teaching periods",
                    value: `${config.school.teachingPeriodsPerDay} per day`,
                    hint: `${timings.teachingPeriodMinutes} minutes each`,
                  },
                  {
                    label: "Dispersal window",
                    value: formatTimeRange(timings.dispersalWindow.start, timings.dispersalWindow.end),
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
            <section className="card-panel overflow-hidden p-4 sm:p-5">
              <div className="mb-4 rounded-xl border border-brand/20 bg-brand/[0.04] px-4 py-3 text-sm text-heading">
                <strong className="text-brand">Standard day</strong> — {dayRange} ·{" "}
                {timings.teachingPeriodsPerDay} teaching periods of {timings.teachingPeriodMinutes} minutes
              </div>
              <BellScheduleTimeline slots={standardBellSlots} title="Bell schedule" />
            </section>
          )}

          {tab === "attendance" && <AttendanceRulesCard config={config} />}

          {tab === "curriculum" && (
            <section className="card-panel form-shell">
              <CurriculumBands config={config} />
            </section>
          )}
        </div>
      ) : null}
    </>
  );
}
