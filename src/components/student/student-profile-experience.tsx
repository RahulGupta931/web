"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AccountChangePasswordForm } from "@/components/account-change-password-form";
import { useAuth } from "@/components/auth-provider";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import { studentNavLabel } from "@/config/nav";
import { navIcons } from "@/components/nav-icons";
import type { StudentProfileData } from "@/components/student-profile-mobile";
import { StudentProfileSections } from "@/components/student-profile-sections";
import { formatClassSection } from "@/lib/class-section-display";
import type { StudentProfileRecord } from "@/lib/student-profile-display";
import { resolveApiAssetUrl } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

type ProfileTab = "details" | "enrollment" | "security";

type ProfileApi = {
  profile: StudentProfileRecord & Record<string, unknown>;
  enrollmentHistory: StudentProfileData["enrollmentHistory"];
};

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-2.5 shadow-[var(--shadow-card)] sm:px-4 sm:py-3">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-xl font-bold tabular-nums text-heading sm:text-2xl">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-muted">{sub}</p> : null}
    </div>
  );
}

function initials(first: string, last: string) {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-36 animate-pulse rounded-2xl bg-surface-muted" />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-surface-muted" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-2xl bg-surface-muted" />
    </div>
  );
}

export function StudentProfileExperience() {
  const { loading: authLoading } = useAuth();
  const { get, isReady } = useApi();
  const [data, setData] = useState<StudentProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<ProfileTab>("details");

  const load = useCallback(() => {
    if (!isReady) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    Promise.all([
      get<ProfileApi>("/api/student/profile"),
      get<{ percentage: number | null }>("/api/student/attendance").catch(() => ({
        percentage: null as number | null,
      })),
      get<{ enrollment?: StudentProfileData["enrollment"] }>("/api/student/dashboard").catch(() => ({
        enrollment: undefined,
      })),
    ])
      .then(([profileRes, attendanceRes, dashboardRes]) => {
        const activeEnrollment =
          dashboardRes.enrollment ??
          (profileRes.enrollmentHistory[0]
            ? {
                rollNumber: profileRes.enrollmentHistory[0].rollNumber,
                class: profileRes.enrollmentHistory[0].class,
                section: profileRes.enrollmentHistory[0].section,
                academicSession: profileRes.enrollmentHistory[0].academicSession,
              }
            : null);

        setData({
          profile: profileRes.profile as StudentProfileRecord,
          enrollment: activeEnrollment,
          enrollmentHistory: profileRes.enrollmentHistory,
          attendancePercentage: attendanceRes.percentage,
        });
      })
      .catch((e) => {
        setData(null);
        setError(getApiErrorMessage(e));
      })
      .finally(() => setLoading(false));
  }, [get, isReady]);

  useEffect(() => {
    if (authLoading) return;
    load();
  }, [authLoading, load]);

  const profile = data?.profile;
  const enrollment = data?.enrollment;
  const fullName = profile
    ? [profile.firstName, profile.middleName, profile.lastName].filter(Boolean).join(" ")
    : "";

  const classLabel =
    enrollment
      ? formatClassSection(enrollment.class.name, enrollment.section.name)
      : null;

  const CheckIcon = navIcons.check;
  const FileIcon = navIcons.file;

  return (
    <>
      <PanelAlerts error={error} />
      <PageHeader
        title={studentNavLabel("/student/profile")}
        description="Your school record, enrollment, and portal password."
        actions={
          <Link href="/student" className="btn-secondary shrink-0 text-sm">
            Dashboard
          </Link>
        }
      />

      {loading && !data ? (
        <ProfileSkeleton />
      ) : !data || !profile ? (
        <p className="text-sm text-muted">Could not load your profile.</p>
      ) : (
        <div className="space-y-6">
          <section
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand-light px-5 py-6 text-white shadow-[var(--shadow-card)]"
            aria-label="Profile summary"
          >
            <div className="pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-full bg-brand-gold/25 blur-2xl" />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex shrink-0 justify-center sm:justify-start">
                {profile.photoUrl ? (
                  <img
                    src={resolveApiAssetUrl(profile.photoUrl)}
                    alt=""
                    className="h-20 w-20 rounded-2xl object-cover ring-2 ring-white/30 sm:h-24 sm:w-24"
                  />
                ) : (
                  <span
                    className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 text-2xl font-bold sm:h-24 sm:w-24"
                    aria-hidden
                  >
                    {initials(profile.firstName, profile.lastName)}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1 text-center sm:text-left">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">
                  Student profile
                </p>
                <h2 className="mt-0.5 text-xl font-bold tracking-tight sm:text-2xl">{fullName}</h2>
                <p className="mt-1 font-mono text-sm text-white/90">{profile.studentId}</p>
                {classLabel && (
                  <p className="mt-2 text-sm text-white/85">
                    Class {classLabel}
                    {enrollment?.rollNumber ? ` · Roll ${enrollment.rollNumber}` : ""}
                  </p>
                )}
                {enrollment?.academicSession?.name && (
                  <p className="mt-0.5 text-xs text-white/75">{enrollment.academicSession.name}</p>
                )}
              </div>
            </div>
          </section>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            <StatCard
              label="Attendance"
              value={data.attendancePercentage != null ? `${data.attendancePercentage}%` : "—"}
              sub="This month"
            />
            <StatCard label="Admission" value={profile.admissionNumber} sub="Admission no." />
            <Link href="/student/attendance" className="block">
              <div className="flex h-full flex-col justify-center rounded-xl border border-border bg-surface px-3 py-2.5 shadow-[var(--shadow-card)] transition hover:border-brand/30 sm:px-4 sm:py-3">
                <CheckIcon className="h-5 w-5 text-brand" />
                <p className="mt-1 text-sm font-semibold text-heading">Attendance</p>
                <p className="text-[0.65rem] text-muted">View history</p>
              </div>
            </Link>
            <Link href="/student/report-cards" className="block">
              <div className="flex h-full flex-col justify-center rounded-xl border border-border bg-surface px-3 py-2.5 shadow-[var(--shadow-card)] transition hover:border-brand/30 sm:px-4 sm:py-3">
                <FileIcon className="h-5 w-5 text-brand-gold" />
                <p className="mt-1 text-sm font-semibold text-heading">Report cards</p>
                <p className="text-[0.65rem] text-muted">Published results</p>
              </div>
            </Link>
          </div>

          <article
            className="overflow-hidden rounded-2xl border-2 border-brand-gold/40 bg-surface shadow-[var(--shadow-card)]"
            aria-label="Student ID pass"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 bg-brand px-4 py-2.5">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-gold">Digital student pass</p>
              {enrollment && (
                <p className="text-[0.65rem] font-medium text-white/90">
                  {formatClassSection(enrollment.class.name, enrollment.section.name)} · Roll{" "}
                  {enrollment.rollNumber}
                </p>
              )}
            </div>
            <div className="grid gap-3 p-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-surface-muted/50 px-3 py-2.5">
                <p className="text-[0.65rem] font-bold uppercase tracking-wide text-muted">Student ID</p>
                <p className="mt-1 break-all font-mono text-base font-bold text-brand">{profile.studentId}</p>
              </div>
              <div className="rounded-xl border border-border bg-surface-muted/50 px-3 py-2.5">
                <p className="text-[0.65rem] font-bold uppercase tracking-wide text-muted">Admission number</p>
                <p className="mt-1 break-all font-mono text-base font-bold text-brand">{profile.admissionNumber}</p>
              </div>
            </div>
          </article>

          <nav
            className="flex gap-1 rounded-xl border border-border bg-surface p-1 shadow-[var(--shadow-card)]"
            aria-label="Profile sections"
          >
            {(
              [
                ["details", "Personal details"],
                ["enrollment", `Enrollment (${data.enrollmentHistory.length})`],
                ["security", "Password"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`flex flex-1 items-center justify-center rounded-lg px-2 py-2.5 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
                  tab === id
                    ? "bg-brand text-white shadow-sm"
                    : "text-muted hover:bg-surface-muted hover:text-heading"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {tab === "details" && <StudentProfileSections profile={profile} variant="mobile" />}

          {tab === "enrollment" && (
            <section className="card-panel form-shell" aria-label="Enrollment history">
              <p className="form-section-title mb-4">Academic journey</p>
              {data.enrollmentHistory.length === 0 ? (
                <p className="text-sm text-muted">No enrollment history yet.</p>
              ) : (
                <ol className="relative space-y-0 border-l-2 border-brand/20 pl-5">
                  {data.enrollmentHistory.map((e, i) => {
                    const isCurrent = enrollment
                      ? e.academicSession.name === enrollment.academicSession.name &&
                        e.class.name === enrollment.class.name &&
                        e.section.name === enrollment.section.name
                      : i === 0;
                    return (
                      <li key={`${e.academicSession.name}-${e.class.name}-${i}`} className="relative pb-6 last:pb-0">
                        <span
                          className={`absolute -left-[1.35rem] top-1 flex h-3 w-3 rounded-full border-2 ${
                            isCurrent ? "border-brand bg-brand" : "border-border bg-surface"
                          }`}
                          aria-hidden
                        />
                        <div
                          className={`rounded-xl border px-3 py-3 ${
                            isCurrent
                              ? "border-brand/30 bg-brand/5 shadow-sm"
                              : "border-border bg-surface"
                          }`}
                        >
                          <p className="text-xs font-semibold text-brand">{e.academicSession.name}</p>
                          <p className="mt-0.5 text-sm font-medium text-heading">
                            {formatClassSection(e.class.name, e.section.name)}
                          </p>
                          <p className="mt-1 text-xs text-muted">Roll {e.rollNumber}</p>
                          {isCurrent && (
                            <span className="mt-2 inline-block rounded-full bg-brand/15 px-2 py-0.5 text-[0.65rem] font-semibold text-brand">
                              Current
                            </span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </section>
          )}

          {tab === "security" && (
            <section className="card-panel form-shell">
              <AccountChangePasswordForm
                description="Change the password you use to sign in to the student portal."
              />
            </section>
          )}
        </div>
      )}
    </>
  );
}
