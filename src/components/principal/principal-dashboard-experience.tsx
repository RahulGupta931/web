"use client";

import Link from "next/link";
import { SchoolMonthCalendarCard } from "@/components/calendar/school-month-calendar-card";
import { DashboardInsightsPanel } from "@/components/dashboard/dashboard-panel-primitives";
import { NoticeFeed, QuickActionGrid, timeGreeting } from "@/components/dashboard-mobile";
import { PageHeader } from "@/components/page-header";
import { navIcons } from "@/components/nav-icons";
import { principalNavLabel } from "@/config/nav";
import type { PrincipalDashboardData } from "@/lib/principal-dashboard-types";
import { formatPct } from "@/lib/principal-dashboard-types";

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

function AttendanceMeter({
  title,
  rate,
  subtitle,
  href,
  segments,
}: {
  title: string;
  rate: number | null;
  subtitle: string;
  href: string;
  segments: { label: string; value: number; tone: string }[];
}) {
  const max = Math.max(1, segments.reduce((s, x) => s + x.value, 0));
  return (
    <Link
      href={href}
      className="block rounded-xl border border-border bg-surface p-4 shadow-[var(--shadow-card)] transition hover:border-brand/30 hover:shadow-[var(--shadow-card-hover)]"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">{title}</p>
          <p className="mt-1 text-3xl font-bold tabular-nums text-brand">{formatPct(rate)}</p>
          <p className="mt-1 text-xs text-muted">{subtitle}</p>
        </div>
        <span className="text-xs font-semibold text-brand">Open →</span>
      </div>
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
    </Link>
  );
}

function TrendChart({ trend }: { trend: PrincipalDashboardData["attendanceTrend"] }) {
  if (trend.length === 0) return null;
  const max = 100;
  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-[var(--shadow-card)]">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">7-day present rate</p>
      <p className="mt-0.5 text-sm text-muted">Among students/teachers with a mark that day</p>
      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {trend.map((d) => {
          const day = new Date(`${d.date}T12:00:00`).toLocaleDateString(undefined, { weekday: "short" });
          const sPct = d.studentPresentRate ?? 0;
          const tPct = d.teacherPresentRate ?? 0;
          return (
            <div key={d.date} className="text-center">
              <div className="flex h-24 items-end justify-center gap-0.5">
                <span
                  className="w-2 rounded-t bg-brand/80"
                  style={{ height: `${(sPct / max) * 100}%`, minHeight: d.studentsMarked ? 4 : 0 }}
                  title={`Students ${formatPct(d.studentPresentRate)}`}
                />
                <span
                  className="w-2 rounded-t bg-brand-gold/90"
                  style={{ height: `${(tPct / max) * 100}%`, minHeight: d.teachersMarked ? 4 : 0 }}
                  title={`Staff ${formatPct(d.teacherPresentRate)}`}
                />
              </div>
              <p className="mt-1 text-[0.6rem] font-medium text-muted">{day}</p>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[0.65rem] text-muted">
        <span className="inline-block h-2 w-2 rounded-sm bg-brand/80 align-middle" /> Students
        <span className="mx-2">·</span>
        <span className="inline-block h-2 w-2 rounded-sm bg-brand-gold/90 align-middle" /> Staff
      </p>
    </div>
  );
}

function ClassStrengthSection({ rows }: { rows: PrincipalDashboardData["classStrength"] }) {
  const top = rows.slice(0, 8);
  const maxStudents = Math.max(1, ...top.map((r) => r.students));
  const topTotal = top.reduce((sum, r) => sum + r.students, 0);

  return (
    <section className="card-panel overflow-hidden">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border bg-gradient-to-r from-brand/[0.06] via-transparent to-transparent px-4 py-3.5 sm:px-5">
        <div className="min-w-0">
          <p className="form-section-title">Students per section</p>
          <p className="mt-1 text-sm text-muted">Top {top.length || 8} sections by enrollment</p>
        </div>
        {top.length > 0 ? (
          <div className="text-right">
            <p className="text-2xl font-bold tabular-nums text-heading">{topTotal}</p>
            <p className="text-xs text-muted">students listed</p>
          </div>
        ) : null}
      </div>

      <div className="p-4 sm:p-5">
        {top.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-surface-muted/40 px-4 py-8 text-center text-sm text-muted">
            No active enrollments yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {top.map((r, index) => {
              const pct = Math.round((r.students / maxStudents) * 100);
              const displayLabel = r.label?.trim() || `${r.className} · ${r.sectionName}`;
              return (
                <li
                  key={r.sectionId}
                  className="rounded-xl border border-border/80 bg-surface px-3 py-3 sm:px-4"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-xs font-bold text-brand"
                      aria-hidden
                    >
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="min-w-0 text-sm font-semibold leading-snug text-heading" title={displayLabel}>
                          {displayLabel}
                        </p>
                        <span className="shrink-0 rounded-lg bg-brand/10 px-2 py-0.5 text-sm font-bold tabular-nums text-brand">
                          {r.students}
                        </span>
                      </div>
                      <div className="mt-2.5 flex items-center gap-2">
                        <div
                          className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-surface-muted"
                          role="presentation"
                        >
                          <span
                            className="block h-full rounded-full bg-gradient-to-r from-brand to-brand-light transition-[width]"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-9 shrink-0 text-right text-[0.6875rem] font-medium tabular-nums text-muted">
                          {pct}%
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
          <p className="text-xs text-muted">Bars compare sections to the largest in this list.</p>
          <Link href="/principal/students" className="text-xs font-semibold text-brand hover:underline">
            {principalNavLabel("/principal/students")} →
          </Link>
        </div>
      </div>
    </section>
  );
}

export function PrincipalDashboardExperience({ data }: { data: PrincipalDashboardData | null }) {
  const s = data?.stats;
  const stu = data?.attendanceToday.students;
  const tea = data?.attendanceToday.teachers;

  const schoolInitials = data?.school.schoolCode
    ? data.school.schoolCode.slice(0, 2).toUpperCase()
    : data?.school.name
      ? data.school.name
          .split(/\s+/)
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "SC";

  const quickActions = [
    { href: "/principal/students", label: principalNavLabel("/principal/students"), icon: "users" as const },
    { href: "/principal/teachers", label: principalNavLabel("/principal/teachers"), icon: "user" as const },
    {
      href: "/principal/admissions",
      label: principalNavLabel("/principal/admissions"),
      icon: "clipboard" as const,
      hint: data ? `${data.pendingAdmissions} pending` : undefined,
    },
    { href: "/principal/attendance", label: principalNavLabel("/principal/attendance"), icon: "check" as const },
    {
      href: "/principal/staff-check-in",
      label: principalNavLabel("/principal/staff-check-in"),
      icon: "clock" as const,
    },
    {
      href: "/principal/leave",
      label: principalNavLabel("/principal/leave"),
      icon: "calendar" as const,
      hint: data ? `${data.pendingLeave} pending` : undefined,
    },
    {
      href: "/principal/discipline",
      label: principalNavLabel("/principal/discipline"),
      icon: "clipboard" as const,
      hint:
        data && data.pendingDisciplineComplaints > 0
          ? `${data.pendingDisciplineComplaints} open`
          : undefined,
    },
    { href: "/principal/calendar", label: principalNavLabel("/principal/calendar"), icon: "calendar" as const },
    { href: "/principal/timetable", label: principalNavLabel("/principal/timetable"), icon: "book" as const },
    { href: "/principal/notices", label: principalNavLabel("/principal/notices"), icon: "bell" as const },
    { href: "/principal/reports", label: principalNavLabel("/principal/reports"), icon: "chart" as const },
  ];

  return (
    <div className="space-y-6">
      {!data ? (
        <DashboardSkeleton />
      ) : (
        <>
          <PageHeader
            title={principalNavLabel("/principal")}
            description="School-wide overview and items that need attention."
            actions={
              <Link href="/principal/reports" className="btn-primary shrink-0 text-sm">
                {principalNavLabel("/principal/reports")}
              </Link>
            }
          />

          <section
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand-light px-5 py-6 text-white shadow-[var(--shadow-card)]"
            aria-label="School overview"
          >
            <div className="pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-full bg-brand-gold/25 blur-2xl" />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 gap-4">
                <span
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-2xl font-bold"
                  aria-hidden
                >
                  {schoolInitials}
                </span>
                <div className="min-w-0">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">
                    {timeGreeting()} · Principal
                  </p>
                  <h2 className="mt-0.5 text-xl font-bold tracking-tight sm:text-2xl">{data.school.name}</h2>
                  <p className="mt-1 text-sm text-white/85">{data.todayLabel}</p>
                  <p className="mt-1 text-sm text-white/80">
                    Code {data.school.schoolCode}
                    {data.academicSession ? ` · Session ${data.academicSession.name}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col sm:items-end">
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                  Students {formatPct(stu?.presentRate)} present
                </span>
                <span className="rounded-full bg-brand-gold/25 px-3 py-1 text-xs font-semibold text-white">
                  Staff {formatPct(tea?.presentRate)} present
                </span>
              </div>
            </div>
          </section>

          <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
            <StatCard label="Enrolled" value={s?.enrolledActive ?? "—"} sub="Active students" />
            <StatCard label="Teachers" value={s?.teachers ?? "—"} sub="On roster" />
            <StatCard
              label="Classes"
              value={s ? `${s.classes} / ${s.sections}` : "—"}
              sub="Classes / sections"
            />
            <StatCard label="New this month" value={data.newStudentsThisMonth} sub="Admissions" />
          </div>

          <Link
            href="/principal/attendance"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand/25 bg-brand/[0.04] py-3 text-sm font-bold text-brand transition hover:bg-brand/10 sm:hidden"
          >
            <navIcons.check className="h-5 w-5" />
            Review attendance
          </Link>

          <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
            <StatCard label="Student present" value={formatPct(stu?.presentRate)} sub={`${stu?.marked ?? 0} marked`} />
            <StatCard label="Staff present" value={formatPct(tea?.presentRate)} sub={`${tea?.marked ?? 0} marked`} />
            <StatCard
              label="Admissions"
              value={data.pendingAdmissions}
              sub={data.pendingAdmissions ? "Awaiting review" : "None pending"}
            />
            <StatCard
              label="Leave & discipline"
              value={data.pendingLeave + data.pendingDisciplineComplaints}
              sub={`${data.pendingLeave} leave · ${data.pendingDisciplineComplaints} incidents`}
            />
          </div>

          {data.insights.length > 0 && (
            <DashboardInsightsPanel title="Today's analysis" insights={data.insights} />
          )}

          <QuickActionGrid actions={quickActions} />

          {stu && tea && (
            <section className="card-panel overflow-hidden">
              <div className="border-b border-border bg-gradient-to-r from-brand/8 via-transparent to-transparent px-4 py-3 sm:px-5">
                <p className="form-section-title">Attendance intelligence — today</p>
                <p className="mt-1 text-sm text-muted">Tap a card for the full attendance workspace.</p>
              </div>
              <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
                <AttendanceMeter
                  title="Students"
                  rate={stu.presentRate}
                  subtitle={`${stu.marked} marked · ${stu.unmarked} not yet marked · ${s?.enrolledActive ?? 0} enrolled`}
                  href="/principal/attendance"
                  segments={[
                    { label: "present", value: stu.PRESENT, tone: "bg-emerald-500" },
                    { label: "late", value: stu.LATE, tone: "bg-amber-400" },
                    { label: "half day", value: stu.HALF_DAY, tone: "bg-sky-400" },
                    { label: "absent", value: stu.ABSENT, tone: "bg-red-500" },
                    { label: "leave", value: stu.LEAVE_APPROVED, tone: "bg-violet-400" },
                  ]}
                />
                <AttendanceMeter
                  title="Teaching staff"
                  rate={tea.presentRate}
                  subtitle={`${tea.marked} marked · ${tea.unmarked} awaiting sign-in/mark · ${s?.teachers ?? 0} on roster`}
                  href="/principal/attendance"
                  segments={[
                    { label: "present", value: tea.PRESENT, tone: "bg-emerald-500" },
                    { label: "late", value: tea.LATE, tone: "bg-amber-400" },
                    { label: "absent", value: tea.ABSENT, tone: "bg-red-500" },
                    { label: "leave", value: tea.LEAVE_APPROVED, tone: "bg-violet-400" },
                  ]}
                />
              </div>
            </section>
          )}

          <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
            {data.attendanceTrend.length > 0 && <TrendChart trend={data.attendanceTrend} />}
            <section className="card-panel overflow-hidden">
              <div className="border-b border-border px-4 py-3 sm:px-5">
                <p className="form-section-title">Pending actions</p>
              </div>
              <ul className="space-y-2 p-4 text-sm sm:p-5">
                <li>
                  <Link href="/principal/admissions" className="font-medium text-brand">
                    {data.pendingAdmissions} admissions
                  </Link>
                  <span className="text-muted"> to review</span>
                </li>
                <li>
                  <Link href="/principal/leave" className="font-medium text-brand">
                    {data.pendingLeave} leave
                  </Link>
                  <span className="text-muted"> requests</span>
                </li>
                <li>
                  <Link href="/principal/discipline" className="font-medium text-brand">
                    {data.pendingDisciplineComplaints} discipline
                  </Link>
                  <span className="text-muted"> complaints open</span>
                </li>
                <li>
                  <Link href="/principal/attendance" className="font-medium text-brand">
                    {stu?.unmarked ?? 0} students
                  </Link>
                  <span className="text-muted"> without today&apos;s mark</span>
                </li>
              </ul>
            </section>
          </div>

          <div className={`grid gap-6 ${data.absentStaff.length > 0 ? "lg:grid-cols-2" : ""}`}>
            <ClassStrengthSection rows={data.classStrength} />

            {data.absentStaff.length > 0 && (
              <section className="card-panel overflow-hidden">
                <div className="border-b border-border px-4 py-3 sm:px-5">
                  <p className="form-section-title">Absent / on leave — staff today</p>
                </div>
                <ul className="divide-y divide-border">
                  {data.absentStaff.map((a, i) => (
                    <li key={i} className="flex flex-wrap items-center gap-2 px-4 py-3 text-sm sm:px-5">
                      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[0.65rem] font-semibold uppercase text-amber-900">
                        {a.status.replace(/_/g, " ")}
                      </span>
                      <span className="font-medium text-heading">
                        {a.teacher.firstName} {a.teacher.lastName}
                      </span>
                      <span className="text-muted">
                        {a.teacher.employeeId}
                        {a.teacher.department ? ` · ${a.teacher.department}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <SchoolMonthCalendarCard role="principal" title="School calendar" layout="split" />

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="card-panel overflow-hidden">
              <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
                <p className="form-section-title">Upcoming events</p>
                <Link href="/principal/calendar" className="text-xs font-semibold text-brand">
                  Manage →
                </Link>
              </div>
              <ul className="divide-y divide-border text-sm">
                {(data.upcomingEvents ?? []).length === 0 ? (
                  <li className="px-4 py-4 text-muted sm:px-5">No events scheduled</li>
                ) : (
                  data.upcomingEvents.map((e) => (
                    <li key={e.id} className="px-4 py-3 text-heading sm:px-5">
                      {e.title}
                      <span className="block text-xs text-muted">
                        {new Date(e.startsAt).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                        {e.location ? ` · ${e.location}` : ""}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </section>
            <NoticeFeed
              items={(data.recentNotices ?? []).map((n) => ({ title: n.title }))}
              href="/principal/notices"
            />
          </div>
        </>
      )}
    </div>
  );
}
