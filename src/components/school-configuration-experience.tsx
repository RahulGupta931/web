"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BellScheduleTimeline,
  BreakHighlights,
  ConfigurationMobileHero,
  ConfigurationStatGrid,
  WorkingDaysPills,
} from "@/components/principal-configuration-mobile";
import { MobileFilterChips } from "@/components/mobile/mobile-primitives";
import { PanelMobileShell } from "@/components/panel/panel-mobile-shell";
import { PanelResponsive } from "@/components/panel/panel-responsive";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import type { SchoolConfigResponse } from "@/components/school-configuration-view";
import {
  formatTime12,
  formatTimeRange,
  STANDARD_BELL_SCHEDULE,
  titleCaseDay,
} from "@/lib/school-config-display";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

type ConfigTab = "overview" | "bell" | "attendance" | "curriculum";

const TABS: { value: ConfigTab; label: string }[] = [
  { value: "overview", label: "Overview" },
  { value: "bell", label: "Bell schedule" },
  { value: "attendance", label: "Attendance" },
  { value: "curriculum", label: "Subjects" },
];

function SchoolConfigTabBar({
  value,
  onChange,
}: {
  value: ConfigTab;
  onChange: (t: ConfigTab) => void;
}) {
  return <MobileFilterChips options={TABS} value={value} onChange={onChange} />;
}

export function AttendanceRulesCard({ config }: { config: SchoolConfigResponse }) {
  const rules = config.school.attendanceRules ?? config.standards.attendanceRules;
  const description =
    rules?.description ?? "How present, absent, and leave are counted when marking attendance.";

  const rows = [
    { label: "Full day", values: rules?.fullDay ?? ["PRESENT", "LATE"], tone: "emerald" },
    { label: "Half day", values: rules?.halfDay ?? ["HALF_DAY"], tone: "amber" },
    { label: "Absent", values: rules?.absent ?? ["ABSENT"], tone: "red" },
    { label: "Approved leave", values: rules?.approvedLeave ?? ["LEAVE_APPROVED"], tone: "sky" },
  ] as const;

  const chipClass: Record<string, string> = {
    emerald: "bg-emerald-500/15 text-emerald-900",
    amber: "bg-brand-gold/25 text-brand-dark",
    red: "bg-red-500/15 text-red-900",
    sky: "bg-sky-500/15 text-sky-900",
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-heading">Attendance rules</h3>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>
      <ul className="space-y-3">
        {rows.map((row) => (
          <li key={row.label} className="rounded-xl border border-border bg-[var(--surface-muted)]/50 px-3 py-2.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">{row.label}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {row.values.map((v) => (
                <span
                  key={v}
                  className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold ${chipClass[row.tone]}`}
                >
                  {v.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CurriculumBands({ config }: { config: SchoolConfigResponse }) {
  const curriculum = config.standards.curriculum;
  if (!curriculum) {
    return (
      <p className="text-sm text-muted py-6 text-center">Subject lists are not loaded for this school.</p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">
        Subjects and learning areas by class band — from{" "}
        <span className="font-medium text-foreground">{curriculum.sourceWorkbook}</span>. Timetables use
        the matching weekly grids.
      </p>
      <ul className="space-y-3">
        {Object.entries(curriculum.subjectLearningAreasByBand).map(([band, areas]) => (
          <li key={band} className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
            <h4 className="text-sm font-semibold text-brand">{band}</h4>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {areas.map((area) => (
                <span
                  key={area}
                  className="rounded-lg border border-border bg-[var(--surface-muted)]/60 px-2 py-1 text-xs font-medium text-heading"
                >
                  {area}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ConfigurationSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-28 animate-pulse rounded-2xl bg-surface-muted" />
      <div className="h-10 animate-pulse rounded-full bg-surface-muted" />
      <div className="h-48 animate-pulse rounded-2xl bg-surface-muted" />
    </div>
  );
}

function MobileConfigContent({
  config,
  tab,
  heroKicker,
}: {
  config: SchoolConfigResponse;
  tab: ConfigTab;
  heroKicker: string;
}) {
  const timings = config.standards.timings;
  const workingDays = config.school.workingDays?.length
    ? config.school.workingDays
    : config.standards.workingDays ?? [];
  const standardBellSlots = config.standards.bellScheduleTemplate ?? STANDARD_BELL_SCHEDULE;
  const dayRange = `${formatTime12(timings.schoolOpening)} – ${formatTime12(timings.schoolDispersal)}`;
  const workingShort = workingDays.map((d) => titleCaseDay(d).slice(0, 3)).join("–");

  if (tab === "overview") {
    return (
      <div className="space-y-5">
        <ConfigurationMobileHero
          classCount={config.school.classCount}
          teachingPeriods={config.school.teachingPeriodsPerDay || timings.teachingPeriodsPerDay}
          periodMinutes={timings.teachingPeriodMinutes}
          kicker={heroKicker}
          title={`Classes 1–${config.standards.academicLevels}`}
          dayRange={dayRange}
          academicLevels={config.standards.academicLevels}
        />
        <ConfigurationStatGrid
          items={[
            { label: "Opening", value: formatTime12(timings.schoolOpening) },
            {
              label: "Prayer",
              value: formatTimeRange(timings.prayerAssembly.start, timings.prayerAssembly.end),
            },
            { label: "Dispersal", value: formatTime12(timings.schoolDispersal) },
            {
              label: "Periods",
              value: `${timings.teachingPeriodsPerDay} × ${timings.teachingPeriodMinutes}m`,
            },
          ]}
        />
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <WorkingDaysPills days={workingDays} />
          <p className="mt-3 text-xs text-muted">
            {config.school.classCount} class levels configured · working week {workingShort}
          </p>
        </div>
        <BreakHighlights
          morningBreak={formatTimeRange(timings.morningBreak.start, timings.morningBreak.end)}
          supervised={formatTimeRange(
            timings.supervisedClassworkTransition.start,
            timings.supervisedClassworkTransition.end
          )}
          lunch={formatTimeRange(timings.lunch.start, timings.lunch.end)}
        />
      </div>
    );
  }

  if (tab === "bell") {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-brand/20 bg-brand/5 px-4 py-3 text-sm text-heading">
          <strong className="text-brand">Standard day</strong> — {dayRange} ·{" "}
          {timings.teachingPeriodsPerDay} teaching periods of {timings.teachingPeriodMinutes} minutes
        </div>
        <BellScheduleTimeline slots={standardBellSlots} title="Bell schedule" />
      </div>
    );
  }

  if (tab === "attendance") return <AttendanceRulesCard config={config} />;
  return <CurriculumBands config={config} />;
}

function DesktopOverviewGrid({ config }: { config: SchoolConfigResponse }) {
  const timings = config.standards.timings;
  const workingDays = config.school.workingDays?.length
    ? config.school.workingDays
    : config.standards.workingDays ?? [];

  return (
    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
      {[
        {
          label: "Academic levels",
          value: `Classes 1–${config.standards.academicLevels}`,
          hint: `${config.school.classCount} configured in system`,
        },
        {
          label: "Working days",
          value: workingDays.map(titleCaseDay).join(", "),
        },
        {
          label: "Teaching periods",
          value: `${config.school.teachingPeriodsPerDay} × ${timings.teachingPeriodMinutes} min`,
        },
        { label: "School opens", value: formatTime12(timings.schoolOpening) },
        {
          label: "Prayer assembly",
          value: formatTimeRange(timings.prayerAssembly.start, timings.prayerAssembly.end),
        },
        {
          label: "Dispersal",
          value: `${formatTime12(timings.schoolDispersal)} (${formatTimeRange(
            timings.dispersalWindow.start,
            timings.dispersalWindow.end
          )})`,
        },
      ].map((item) => (
        <div key={item.label} className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{item.label}</dt>
          <dd className="mt-1.5 font-semibold text-heading">{item.value}</dd>
          {item.hint && <dd className="mt-1 text-xs text-muted">{item.hint}</dd>}
        </div>
      ))}
    </dl>
  );
}

export function SchoolConfigurationExperience({
  apiPath,
  panelRole,
  pageTitle,
  pageDescription,
  mobileSubtitle,
  heroKicker,
}: {
  apiPath: string;
  panelRole: "teacher" | "principal";
  pageTitle: string;
  pageDescription: string;
  mobileSubtitle: string;
  heroKicker: string;
}) {
  const { get } = useApi();
  const [config, setConfig] = useState<SchoolConfigResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<ConfigTab>("overview");

  useEffect(() => {
    setLoading(true);
    get<SchoolConfigResponse>(apiPath)
      .then(setConfig)
      .catch((e) => {
        setConfig(null);
        setError(getApiErrorMessage(e));
      })
      .finally(() => setLoading(false));
  }, [get, apiPath]);

  const timings = config?.standards.timings;
  const standardBellSlots = useMemo(
    () => config?.standards.bellScheduleTemplate ?? STANDARD_BELL_SCHEDULE,
    [config]
  );

  const desktop = (
    <div className="space-y-6">
      <PageHeader title={pageTitle} description={pageDescription} />
      {loading && !config ? (
        <ConfigurationSkeleton />
      ) : config && timings ? (
        <>
          <SchoolConfigTabBar value={tab} onChange={setTab} />
          {tab === "overview" && (
            <div className="space-y-6">
              <DesktopOverviewGrid config={config} />
              <div className="grid gap-6 lg:grid-cols-2">
                <BreakHighlights
                  morningBreak={formatTimeRange(timings.morningBreak.start, timings.morningBreak.end)}
                  supervised={formatTimeRange(
                    timings.supervisedClassworkTransition.start,
                    timings.supervisedClassworkTransition.end
                  )}
                  lunch={formatTimeRange(timings.lunch.start, timings.lunch.end)}
                />
                <WorkingDaysPills
                  days={
                    config.school.workingDays?.length
                      ? config.school.workingDays
                      : config.standards.workingDays ?? []
                  }
                />
              </div>
            </div>
          )}
          {tab === "bell" && (
            <BellScheduleTimeline slots={standardBellSlots} title="Standard bell schedule" />
          )}
          {tab === "attendance" && <AttendanceRulesCard config={config} />}
          {tab === "curriculum" && <CurriculumBands config={config} />}
        </>
      ) : null}
    </div>
  );

  const mobile = (
    <PanelMobileShell
      role={panelRole}
      kicker={panelRole === "principal" ? "Principal" : "Teacher"}
      title="Configuration"
      subtitle={mobileSubtitle}
      showCalendar={false}
    >
      {loading && !config ? (
        <ConfigurationSkeleton />
      ) : config && timings ? (
        <div className="space-y-4 -mt-1">
          <SchoolConfigTabBar value={tab} onChange={setTab} />
          <MobileConfigContent config={config} tab={tab} heroKicker={heroKicker} />
        </div>
      ) : null}
    </PanelMobileShell>
  );

  return (
    <>
      <PanelAlerts error={error} />
      <PanelResponsive desktop={desktop} mobile={mobile} />
    </>
  );
}
