"use client";

import Link from "next/link";
import { SchoolMonthCalendarCard } from "@/components/calendar/school-month-calendar-card";
import {
  DashboardInsightsPanel,
  mapStudentSlotToClassItem,
  TodayClassesCard,
} from "@/components/dashboard/dashboard-panel-primitives";
import { NoticeFeed, QuickActionGrid, timeGreeting } from "@/components/dashboard-mobile";
import { PageHeader } from "@/components/page-header";
import { studentNavLabel } from "@/config/nav";
import type { StudentDashboardData } from "@/lib/student-dashboard-types";

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3 shadow-[var(--shadow-card)]">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-2xl font-bold tabular-nums text-heading">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-muted">{sub}</p> : null}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-36 animate-pulse rounded-2xl bg-surface-muted" />
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-surface-muted" />
        ))}
      </div>
      <div className="h-48 animate-pulse rounded-2xl bg-surface-muted" />
    </div>
  );
}

function AttendanceSummaryCard({ data }: { data: StudentDashboardData }) {
  const att = data.attendanceThisMonth;
  const max = Math.max(1, att.present + att.absent + att.late);
  const segments = [
    { label: "Present", value: att.present, tone: "bg-emerald-500" },
    { label: "Absent", value: att.absent, tone: "bg-red-400" },
    { label: "Late", value: att.late, tone: "bg-amber-400" },
  ];
  return (
    <Link
      href="/student/attendance"
      className="block rounded-xl border border-border bg-surface p-4 shadow-[var(--shadow-card)] transition hover:border-brand/30 hover:shadow-[var(--shadow-card-hover)]"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Attendance this month</p>
          <p className="mt-1 text-3xl font-bold tabular-nums text-brand">
            {data.attendancePercentage != null ? `${data.attendancePercentage}%` : "—"}
          </p>
          <p className="mt-1 text-xs text-muted">
            {att.total > 0 ? `${att.total} school day${att.total === 1 ? "" : "s"} marked` : "No marks yet"}
          </p>
        </div>
        <span className="text-xs font-semibold text-brand">Details →</span>
      </div>
      {att.total > 0 && (
        <>
          <div className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-surface-muted">
            {segments.map((s) =>
              s.value > 0 ? (
                <span
                  key={s.label}
                  className={s.tone}
                  style={{ width: `${(s.value / max) * 100}%` }}
                  title={`${s.label}: ${s.value}`}
                />
              ) : null
            )}
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[0.65rem] text-muted">
            {segments.map((s) => (
              <li key={s.label}>
                <span className="font-semibold text-heading">{s.value}</span> {s.label}
              </li>
            ))}
          </ul>
        </>
      )}
    </Link>
  );
}

export function StudentDashboardExperience({ data }: { data: StudentDashboardData | null }) {
  const profile = data?.profile;
  const name = profile ? `${profile.firstName} ${profile.lastName}` : "Student";
  const initials = profile
    ? `${profile.firstName[0] ?? ""}${profile.lastName[0] ?? ""}`.toUpperCase()
    : "S";

  const todayItems = (data?.todayTimetable ?? []).map(mapStudentSlotToClassItem);

  const quickActions = [
    { href: "/student/timetable", label: studentNavLabel("/student/timetable"), icon: "calendar" as const },
    {
      href: "/student/attendance",
      label: studentNavLabel("/student/attendance"),
      icon: "check" as const,
      hint: data?.attendancePercentage != null ? `${data.attendancePercentage}%` : undefined,
    },
    { href: "/student/assignments", label: "Homework", icon: "clipboard" as const, hint: data?.pendingAssignments ? `${data.pendingAssignments} pending` : undefined },
    { href: "/student/report-cards", label: studentNavLabel("/student/report-cards"), icon: "file" as const },
    { href: "/student/datesheets", label: studentNavLabel("/student/datesheets"), icon: "file" as const },
    { href: "/student/examinations", label: "Upcoming exams", icon: "file" as const },
    { href: "/student/materials", label: "Study notes", icon: "file" as const },
    { href: "/student/notices", label: studentNavLabel("/student/notices"), icon: "bell" as const },
    { href: "/student/queries", label: studentNavLabel("/student/queries"), icon: "clipboard" as const },
    { href: "/student/discipline", label: studentNavLabel("/student/discipline"), icon: "clipboard" as const },
  ];

  return (
    <div className="space-y-6">
      {!data ? (
        <DashboardSkeleton />
      ) : (
        <>
          <PageHeader
            title={studentNavLabel("/student")}
            description="Your classes, attendance, and school updates in one place."
            actions={
              <Link href="/student/profile" className="btn-secondary shrink-0 text-sm">
                {studentNavLabel("/student/profile")}
              </Link>
            }
          />

          <section
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand-light px-5 py-6 text-white shadow-[var(--shadow-card)]"
            aria-label="Welcome"
          >
            <div className="pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-full bg-brand-gold/25 blur-2xl" />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 gap-4">
                <span
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-2xl font-bold"
                  aria-hidden
                >
                  {initials}
                </span>
                <div className="min-w-0">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">
                    {timeGreeting()}
                  </p>
                  <h2 className="mt-0.5 text-xl font-bold tracking-tight sm:text-2xl">{name}</h2>
                  <p className="mt-1 text-sm text-white/85">{data.todayLabel}</p>
                  <p className="mt-1 text-sm text-white/80">
                    {data.school.name} · {profile?.studentId}
                  </p>
                  {data.classLabel && (
                    <p className="mt-2 text-xs font-medium text-brand-gold">
                      Class {data.classLabel}
                      {data.enrollment?.rollNumber ? ` · Roll ${data.enrollment.rollNumber}` : ""}
                      {data.enrollment?.academicSession?.name
                        ? ` · ${data.enrollment.academicSession.name}`
                        : ""}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col sm:items-end">
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                  {data.todayTimetable.length} period{data.todayTimetable.length === 1 ? "" : "s"} today
                </span>
                {data.pendingAssignments > 0 && (
                  <span className="rounded-full bg-amber-400/25 px-3 py-1 text-xs font-semibold text-white">
                    {data.pendingAssignments} assignment{data.pendingAssignments === 1 ? "" : "s"} due
                  </span>
                )}
                {data.upcomingExams.length > 0 && (
                  <span className="rounded-full bg-sky-400/25 px-3 py-1 text-xs font-semibold text-white">
                    {data.upcomingExams.length} upcoming exam{data.upcomingExams.length === 1 ? "" : "s"}
                  </span>
                )}
              </div>
            </div>
          </section>

          <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
            <StatCard
              label="Attendance"
              value={data.attendancePercentage != null ? `${data.attendancePercentage}%` : "—"}
              sub="This month"
            />
            <StatCard label="Today" value={data.todayTimetable.length} sub="On timetable" />
            <StatCard label="Exams" value={data.upcomingExams.length} sub="Upcoming" />
            <StatCard label="Work" value={data.pendingAssignments} sub="Pending submissions" />
          </div>

          {data.insights.length > 0 && (
            <DashboardInsightsPanel title="Your school day" insights={data.insights} />
          )}

          <QuickActionGrid actions={quickActions} />

          <div className="grid gap-4 sm:grid-cols-2">
            <AttendanceSummaryCard data={data} />
            <Link
              href="/student/report-cards"
              className="flex flex-col justify-between rounded-xl border border-border bg-surface p-4 shadow-[var(--shadow-card)] transition hover:border-brand/30 hover:shadow-[var(--shadow-card-hover)]"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Academic session</p>
                <p className="mt-1 text-lg font-bold text-heading">
                  {data.enrollment?.academicSession?.name ?? "—"}
                </p>
                <p className="mt-1 text-xs text-muted">Report cards and published results</p>
              </div>
              <p className="mt-4 text-xs font-semibold text-brand">Open report cards →</p>
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <TodayClassesCard
              title="Today's classes"
              items={todayItems}
              emptyMessage="No classes scheduled today — enjoy the break or check the weekly timetable."
              footerHref="/student/timetable"
              footerLabel="Weekly timetable →"
            />
            <div className="space-y-6">
              <SchoolMonthCalendarCard role="student" title="School calendar" />
              <NoticeFeed items={data.recentNotices} href="/student/notices" />
            </div>
          </div>

          {data.upcomingExams.length > 0 && (
            <section className="card-panel overflow-hidden">
              <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
                <p className="form-section-title">Upcoming examinations</p>
                <Link href="/student/examinations" className="text-xs font-semibold text-brand hover:underline">
                  View all
                </Link>
              </div>
              <ul className="divide-y divide-border">
                {data.upcomingExams.map((ex) => (
                  <li
                    key={ex.id}
                    className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm sm:px-5"
                  >
                    <span className="font-semibold text-heading">{ex.name}</span>
                    <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase text-brand">
                      {ex.status.replace(/_/g, " ")}
                    </span>
                    <span className="w-full text-xs text-muted sm:w-auto sm:text-right">
                      {new Date(ex.startDate).toLocaleDateString()}
                      {ex.endDate !== ex.startDate
                        ? ` – ${new Date(ex.endDate).toLocaleDateString()}`
                        : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
