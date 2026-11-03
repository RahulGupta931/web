"use client";

import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/data-table";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader, PageSection } from "@/components/page-header";
import {
  BellScheduleTimeline,
  BreakHighlights,
  ConfigurationMobileHero,
  ConfigurationStatGrid,
  WorkingDaysPills,
} from "@/components/principal-configuration-mobile";
import {
  formatBellScheduleTimeRange,
  formatTime12,
  formatTimeRange,
  STANDARD_BELL_SCHEDULE,
  titleCaseDay,
  type BellSlot,
} from "@/lib/school-config-display";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

export type SchoolConfigResponse = {
  standards: {
    academicLevels: number;
    workingDays: string[];
    timings: {
      schoolOpening: string;
      schoolDispersal: string;
      prayerAssembly: { start: string; end: string };
      morningBreak: { start: string; end: string };
      supervisedClassworkTransition: { start: string; end: string };
      lunch: { start: string; end: string };
      dispersalWindow: { start: string; end: string };
      teachingPeriodMinutes: number;
      teachingPeriodsPerDay: number;
    };
    bellScheduleTemplate: BellSlot[];
    attendanceRules?: {
      fullDay: string[];
      halfDay: string[];
      absent: string[];
      approvedLeave: string[];
      description: string;
    };
    curriculum?: {
      sourceWorkbook: string;
      subjectLearningAreasByBand: Record<string, readonly string[]>;
    };
  };
  school: {
    classCount: number;
    teachingPeriodsPerDay: number;
    workingDays: string[];
    bellSchedule: BellSlot[];
    attendanceRules?: SchoolConfigResponse["standards"]["attendanceRules"];
  };
};

type SchoolConfigurationViewProps = {
  apiPath: string;
};

export function SchoolConfigurationView({ apiPath }: SchoolConfigurationViewProps) {
  const { get } = useApi();
  const [config, setConfig] = useState<SchoolConfigResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  const standardBellSlots = useMemo(() => {
    return config?.standards.bellScheduleTemplate ?? STANDARD_BELL_SCHEDULE;
  }, [config]);

  const workingDays = config?.school.workingDays?.length
    ? config.school.workingDays
    : config?.standards.workingDays ?? [];

  return (
    <>
      <PanelAlerts error={error} />

      {loading && !config && (
        <div className="space-y-3 lg:hidden">
          <div className="h-28 animate-pulse rounded-2xl bg-surface-muted" />
          <div className="h-64 animate-pulse rounded-2xl bg-surface-muted" />
        </div>
      )}

      {config && timings && (
        <>
          <div className="space-y-5 lg:hidden">
            <ConfigurationMobileHero
              classCount={config.school.classCount}
              teachingPeriods={config.school.teachingPeriodsPerDay || timings.teachingPeriodsPerDay}
              periodMinutes={timings.teachingPeriodMinutes}
            />

            <ConfigurationStatGrid
              items={[
                {
                  label: "Opening",
                  value: formatTime12(timings.schoolOpening),
                },
                {
                  label: "Prayer",
                  value: formatTimeRange(timings.prayerAssembly.start, timings.prayerAssembly.end),
                },
                {
                  label: "Dispersal",
                  value: formatTime12(timings.schoolDispersal),
                },
                {
                  label: "Periods",
                  value: `${timings.teachingPeriodsPerDay} × ${timings.teachingPeriodMinutes}m`,
                },
              ]}
            />

            <WorkingDaysPills days={workingDays} />

            <BreakHighlights
              morningBreak={formatTimeRange(timings.morningBreak.start, timings.morningBreak.end)}
              supervised={formatTimeRange(
                timings.supervisedClassworkTransition.start,
                timings.supervisedClassworkTransition.end
              )}
              lunch={formatTimeRange(timings.lunch.start, timings.lunch.end)}
            />

            <BellScheduleTimeline slots={standardBellSlots} />

            <section aria-label="Attendance rules">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                Attendance rules
              </h3>
              <p className="mb-3 text-sm text-muted">
                {config.school.attendanceRules?.description ??
                  config.standards.attendanceRules?.description ??
                  "How present, absent, and leave are counted."}
              </p>
              <ConfigurationStatGrid
                items={[
                  {
                    label: "Full day",
                    value: (config.school.attendanceRules?.fullDay ?? ["PRESENT", "LATE"]).join(", "),
                  },
                  {
                    label: "Half day",
                    value: (config.school.attendanceRules?.halfDay ?? ["HALF_DAY"]).join(", "),
                  },
                  {
                    label: "Absent",
                    value: (config.school.attendanceRules?.absent ?? ["ABSENT"]).join(", "),
                  },
                  {
                    label: "Approved leave",
                    value: (config.school.attendanceRules?.approvedLeave ?? ["LEAVE_APPROVED"]).join(
                      ", "
                    ),
                  },
                ]}
              />
            </section>
          </div>

          <div className="hidden space-y-8 lg:block">
            <PageHeader
              title="School configuration"
              description="Working week, daily timings, and bell schedule for your school."
            />

            <PageSection title="Overview">
              <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                <div className="card-panel">
                  <dt className="text-muted">Academic levels</dt>
                  <dd className="mt-1 text-lg font-semibold text-heading">
                    Classes 1–{config.standards.academicLevels}
                    <span className="ml-2 text-sm font-normal text-muted">
                      ({config.school.classCount} configured)
                    </span>
                  </dd>
                </div>
                <div className="card-panel">
                  <dt className="text-muted">Working days</dt>
                  <dd className="mt-1 font-medium text-heading">
                    {workingDays.map(titleCaseDay).join(", ")}
                  </dd>
                </div>
                <div className="card-panel">
                  <dt className="text-muted">Teaching periods</dt>
                  <dd className="mt-1 font-medium text-heading">
                    {config.school.teachingPeriodsPerDay} per day × {timings.teachingPeriodMinutes} minutes
                  </dd>
                </div>
                <div className="card-panel">
                  <dt className="text-muted">School opening</dt>
                  <dd className="mt-1 font-medium text-heading">{formatTime12(timings.schoolOpening)}</dd>
                </div>
                <div className="card-panel">
                  <dt className="text-muted">Prayer assembly</dt>
                  <dd className="mt-1 font-medium text-heading">
                    {formatTimeRange(timings.prayerAssembly.start, timings.prayerAssembly.end)}
                  </dd>
                </div>
                <div className="card-panel">
                  <dt className="text-muted">Dispersal</dt>
                  <dd className="mt-1 font-medium text-heading">
                    {formatTime12(timings.schoolDispersal)} (
                    {formatTimeRange(timings.dispersalWindow.start, timings.dispersalWindow.end)})
                  </dd>
                </div>
              </dl>
            </PageSection>

            <PageSection title="Fixed breaks">
              <ul className="grid gap-3 sm:grid-cols-2 text-sm">
                <li className="card-panel">
                  <span className="text-muted">Morning break</span>
                  <p className="font-medium text-heading">
                    {formatTimeRange(timings.morningBreak.start, timings.morningBreak.end)}
                  </p>
                </li>
                <li className="card-panel">
                  <span className="text-muted">Supervised classwork & transition</span>
                  <p className="font-medium text-heading">
                    {formatTimeRange(
                      timings.supervisedClassworkTransition.start,
                      timings.supervisedClassworkTransition.end
                    )}
                  </p>
                </li>
                <li className="card-panel">
                  <span className="text-muted">Lunch</span>
                  <p className="font-medium text-heading">
                    {formatTimeRange(timings.lunch.start, timings.lunch.end)}
                  </p>
                </li>
              </ul>
            </PageSection>

            <PageSection title="Attendance rules">
              <p className="text-sm text-muted">
                {config.school.attendanceRules?.description ??
                  config.standards.attendanceRules?.description ??
                  "Full day, half day, and leave statuses are applied when marking attendance."}
              </p>
              <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                <div className="card-panel">
                  <dt className="text-muted">Counts as full day</dt>
                  <dd className="mt-1 font-medium text-heading">
                    {(config.school.attendanceRules?.fullDay ?? ["PRESENT", "LATE"]).join(", ")}
                  </dd>
                </div>
                <div className="card-panel">
                  <dt className="text-muted">Half day</dt>
                  <dd className="mt-1 font-medium text-heading">
                    {(config.school.attendanceRules?.halfDay ?? ["HALF_DAY"]).join(", ")}
                  </dd>
                </div>
                <div className="card-panel">
                  <dt className="text-muted">Absent</dt>
                  <dd className="mt-1 font-medium text-heading">
                    {(config.school.attendanceRules?.absent ?? ["ABSENT"]).join(", ")}
                  </dd>
                </div>
                <div className="card-panel">
                  <dt className="text-muted">Approved leave</dt>
                  <dd className="mt-1 font-medium text-heading">
                    {(config.school.attendanceRules?.approvedLeave ?? ["LEAVE_APPROVED"]).join(", ")}
                  </dd>
                </div>
              </dl>
            </PageSection>

            <PageSection title="Standard bell schedule">
              <p className="mb-3 text-sm text-muted">
                7 teaching periods (40 minutes each) · school day {formatTime12("08:30")} –{" "}
                {formatTime12("14:45")}
              </p>
              <DataTable
                columns={["Activity", "Time"]}
                rows={standardBellSlots.map((slot) => [
                  slot.name,
                  formatBellScheduleTimeRange(slot.startTime, slot.endTime),
                ])}
              />
            </PageSection>

            {config.standards.curriculum && (
              <PageSection title="Subjects by class / stream">
                <p className="mb-3 text-sm text-muted">
                  Hard-coded from {config.standards.curriculum.sourceWorkbook}. Class timetables in
                  the system use the matching weekly grids from the same workbook.
                </p>
                <DataTable
                  columns={["Class / stream", "Subjects & learning areas"]}
                  rows={Object.entries(config.standards.curriculum.subjectLearningAreasByBand).map(
                    ([band, areas]) => [band, areas.join(" · ")]
                  )}
                />
              </PageSection>
            )}
          </div>
        </>
      )}
    </>
  );
}
