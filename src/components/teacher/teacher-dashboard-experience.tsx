"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PanelAlerts } from "@/components/panel-alerts";
import { SchoolMonthCalendarCard } from "@/components/calendar/school-month-calendar-card";
import {
  DashboardInsightsPanel,
  mapTeacherSlotToClassItem,
  TodayClassesCard,
} from "@/components/dashboard/dashboard-panel-primitives";
import { NoticeFeed, QuickActionGrid, timeGreeting } from "@/components/dashboard-mobile";
import { PageHeader } from "@/components/page-header";
import { teacherNavLabel } from "@/config/nav";
import { navIcons } from "@/components/nav-icons";
import type { TeacherDashboardData } from "@/lib/teacher-dashboard-types";
import { TeacherCheckInActions } from "@/components/teacher/teacher-check-in-actions";

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
      <div className="grid gap-3 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-surface-muted" />
        ))}
      </div>
      <div className="h-48 animate-pulse rounded-2xl bg-surface-muted" />
    </div>
  );
}

export function TeacherDashboardExperience({ data }: { data: TeacherDashboardData | null }) {
  const [checkInMessage, setCheckInMessage] = useState<string | null>(null);
  const [checkInError, setCheckInError] = useState<string | null>(null);

  const profile = data?.profile;
  const name = profile ? `${profile.firstName} ${profile.lastName}` : "Teacher";
  const initials = profile
    ? `${profile.firstName[0] ?? ""}${profile.lastName[0] ?? ""}`.toUpperCase()
    : "T";

  const todayItems = useMemo(() => {
    if (!data) return [];
    const items = data.todayTimetable.map((s) => mapTeacherSlotToClassItem(s));
    for (const sub of data.substituteAssignments) {
      if (!sub.slot.period) continue;
      items.push(
        mapTeacherSlotToClassItem(
          {
            id: `substitute-${sub.id}`,
            period: sub.slot.period,
            subject: sub.slot.subject,
            section: sub.slot.section,
            classroom: sub.slot.classroom ?? null,
          },
          { isSubstitute: true }
        )
      );
    }
    return items.sort((a, b) => (a.periodNo ?? 99) - (b.periodNo ?? 99));
  }, [data]);

  const quickActions = [
    { href: "/teacher/attendance", label: teacherNavLabel("/teacher/attendance"), icon: "check" as const },
    { href: "/teacher/check-in", label: teacherNavLabel("/teacher/check-in"), icon: "clock" as const },
    {
      href: "/teacher/students",
      label: teacherNavLabel("/teacher/students"),
      icon: "users" as const,
      hint: data ? String(data.studentCount) : undefined,
    },
    { href: "/teacher/examinations", label: teacherNavLabel("/teacher/examinations"), icon: "file" as const },
    { href: "/teacher/timetable", label: teacherNavLabel("/teacher/timetable"), icon: "calendar" as const },
    {
      href: "/teacher/admissions",
      label: teacherNavLabel("/teacher/admissions"),
      icon: "clipboard" as const,
      hint: data && data.pendingAdmissions > 0 ? `${data.pendingAdmissions} pending` : undefined,
    },
    { href: "/teacher/discipline", label: teacherNavLabel("/teacher/discipline"), icon: "clipboard" as const },
    { href: "/teacher/queries", label: teacherNavLabel("/teacher/queries"), icon: "clipboard" as const },
  ];

  return (
    <div className="space-y-6">
      <PanelAlerts error={checkInError} message={checkInMessage} messageTitle="Check-in" />

      {!data ? (
        <DashboardSkeleton />
      ) : (
        <>
          <PageHeader
            title={teacherNavLabel("/teacher")}
            description="Your teaching day at a glance."
            actions={
              <Link href="/teacher/admissions/new" className="btn-primary shrink-0 text-sm">
                Register student
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
                    {data.school.name} · ID {profile?.employeeId}
                  </p>
                  {data.classTeacherSections.length > 0 && (
                    <p className="mt-2 text-xs font-medium text-brand-gold">
                      Class teacher · {data.classTeacherSections.join(", ")}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col sm:items-end">
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                  {todayItems.length} period{todayItems.length === 1 ? "" : "s"} today
                </span>
                {data.substituteAssignments.length > 0 && (
                  <span className="rounded-full bg-sky-400/25 px-3 py-1 text-xs font-semibold text-white">
                    {data.substituteAssignments.length} substitute duty
                  </span>
                )}
              </div>
            </div>
          </section>

          <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
            <StatCard label="Students" value={data.studentCount} sub="In your sections" />
            <StatCard label="Classes today" value={todayItems.length} />
            <StatCard
              label="Admissions"
              value={data.pendingAdmissions}
              sub={data.pendingAdmissions ? "Pending principal" : "None pending"}
            />
            <StatCard label="Alerts" value={data.notifications.length} sub="Unread" />
          </div>

          <section className="card-panel overflow-hidden">
            <div className="border-b border-border bg-gradient-to-r from-brand/8 via-transparent to-transparent px-4 py-3 sm:px-5">
              <p className="form-section-title">Staff check-in</p>
              <p className="mt-1 text-sm text-muted">Record arrival and departure for today.</p>
            </div>
            <div className="form-shell">
              <TeacherCheckInActions
                variant="bar"
                onMessage={setCheckInMessage}
                onError={setCheckInError}
              />
            </div>
          </section>

          <Link
            href="/teacher/attendance"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand/25 bg-brand/[0.04] py-3 text-sm font-bold text-brand transition hover:bg-brand/10 sm:hidden"
          >
            <navIcons.check className="h-5 w-5" />
            Mark attendance
          </Link>

          {data.insights.length > 0 && <DashboardInsightsPanel insights={data.insights} />}

          <QuickActionGrid actions={quickActions} />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Subjects" value={data.subjects.length} />
            <StatCard label="Assignments" value={data.pendingAssignments} sub="You created" />
            <StatCard label="Notices" value={data.recentNotices.length} sub="Recent" />
            <StatCard label="Substitute" value={data.substituteAssignments.length} sub="Today" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <TodayClassesCard
              title="Today's teaching schedule"
              items={todayItems}
              emptyMessage="No teaching periods on your published timetable today. Check My schedule for the full week."
              footerHref="/teacher/timetable"
              footerLabel="Full weekly timetable →"
            />
            <div className="space-y-6">
              <SchoolMonthCalendarCard role="teacher" title="School calendar" showHolidayLists={false} />
              <NoticeFeed items={data.recentNotices} href="/teacher/notices" />
            </div>
          </div>

          {data.substituteAssignments.length > 0 && (
            <section className="card-panel overflow-hidden">
              <div className="border-b border-border px-4 py-3 sm:px-5">
                <p className="form-section-title">Substitute duty today</p>
              </div>
              <ul className="divide-y divide-border px-4 py-2 sm:px-5">
                {data.substituteAssignments.map((sub, i) => (
                  <li key={i} className="py-3 text-sm">
                    <p className="font-semibold text-heading">{sub.slot.subject.name}</p>
                    <p className="text-xs text-muted">
                      {sub.slot.section.class.name}-{sub.slot.section.name}
                      {sub.slot.period?.name ? ` · ${sub.slot.period.name}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {data.notifications.length > 0 && (
            <section className="card-panel overflow-hidden">
              <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
                <p className="form-section-title">Notifications</p>
                <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-bold text-brand">
                  {data.notifications.length}
                </span>
              </div>
              <ul className="divide-y divide-border">
                {data.notifications.slice(0, 5).map((n) => (
                  <li key={n.id} className="px-4 py-3 text-sm sm:px-5">
                    <p className="font-medium text-heading">{n.title}</p>
                    {n.body && <p className="mt-1 line-clamp-2 text-muted">{n.body}</p>}
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
