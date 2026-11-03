"use client";

import { useEffect, useMemo, useState } from "react";
import { AccountChangePasswordForm } from "@/components/account-change-password-form";
import { useAuth } from "@/components/auth-provider";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import { teacherNavLabel } from "@/config/nav";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

type DashboardPayload = {
  school: { name: string };
  profile: {
    employeeId: string;
    firstName: string;
    middleName: string | null;
    lastName: string;
    phone: string | null;
    department: string | null;
    designation: string | null;
    employmentType: string;
  };
  classTeacherSections: string[];
  subjects: string[];
};

type Tab = "profile" | "security";

function fullName(p: DashboardPayload["profile"]) {
  return [p.firstName, p.middleName, p.lastName].filter(Boolean).join(" ");
}

function initials(p: DashboardPayload["profile"]) {
  return `${p.firstName.charAt(0)}${p.lastName.charAt(0)}`.toUpperCase();
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3 shadow-[var(--shadow-card)]">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-lg font-bold leading-snug text-heading sm:text-xl">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-muted">{sub}</p> : null}
    </div>
  );
}

export function TeacherAccountExperience() {
  const { user, loading: authLoading } = useAuth();
  const { get } = useApi();
  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
  const [tab, setTab] = useState<Tab>("profile");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    setLoading(true);
    get<DashboardPayload>("/api/teacher/dashboard")
      .then((d) => setDashboard(d))
      .catch((e) => {
        setDashboard(null);
        setError(getApiErrorMessage(e));
      })
      .finally(() => setLoading(false));
  }, [get, authLoading]);

  const profile = dashboard?.profile;
  const displayName = profile ? fullName(profile) : user?.email ?? "Teacher";

  const employmentLabel = useMemo(() => {
    if (!profile) return "—";
    return profile.employmentType.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  }, [profile]);

  return (
    <>
      <PanelAlerts error={error} />
      <PageHeader
        title={teacherNavLabel("/teacher/account")}
        description="Your staff profile and portal sign-in. Contact the office to update official HR records."
      />

      <section
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand-light px-5 py-6 text-white shadow-[var(--shadow-card)]"
        aria-label="Account summary"
      >
        <div className="pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-full bg-brand-gold/25 blur-2xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
          <span
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-2xl font-bold"
            aria-hidden
          >
            {profile ? initials(profile) : "T"}
          </span>
          <div className="min-w-0">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">
              {dashboard?.school.name ?? "School portal"}
            </p>
            <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">{displayName}</h2>
            {profile && (
              <p className="mt-1 text-sm text-white/85">
                Employee ID <span className="font-mono font-semibold">{profile.employeeId}</span>
                {profile.designation ? ` · ${profile.designation}` : ""}
              </p>
            )}
            {user?.email && (
              <p className="mt-2 inline-flex max-w-full rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
                <span className="truncate font-mono">{user.email}</span>
              </p>
            )}
          </div>
        </div>
      </section>

      {!loading && profile && (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <StatCard label="Class teacher" value={dashboard?.classTeacherSections.length ?? 0} sub="Homeroom sections" />
          <StatCard label="Subjects" value={dashboard?.subjects.length ?? 0} sub="Assigned to teach" />
          <StatCard label="Employment" value={employmentLabel} sub={profile.department ?? "Department not set"} />
        </div>
      )}

      <nav
        className="mt-6 flex gap-1 rounded-xl border border-border bg-surface p-1 shadow-[var(--shadow-card)]"
        aria-label="Account sections"
      >
        {(
          [
            ["profile", "Profile"],
            ["security", "Password"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex flex-1 items-center justify-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              tab === id ? "bg-brand text-white shadow-sm" : "text-muted hover:bg-surface-muted hover:text-heading"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {loading ? (
        <p className="mt-6 empty-state">Loading profile…</p>
      ) : tab === "profile" ? (
        <div className="mt-6 space-y-6">
          <section className="card-panel overflow-hidden">
            <div className="border-b border-border bg-gradient-to-r from-brand/8 via-transparent to-transparent px-4 py-3 sm:px-5">
              <p className="form-section-title">Portal & contact</p>
              <p className="mt-1 text-sm text-muted">Sign-in email is managed by the principal.</p>
            </div>
            <dl className="form-shell grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Login email</dt>
                <dd className="mt-1 font-mono text-sm font-medium text-heading break-all">{user?.email ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Account status</dt>
                <dd className="mt-1 text-sm font-medium capitalize text-heading">{user?.status?.toLowerCase() ?? "—"}</dd>
              </div>
              {profile?.phone && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Phone</dt>
                  <dd className="mt-1 text-sm font-medium text-heading">{profile.phone}</dd>
                </div>
              )}
              {profile?.department && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Department</dt>
                  <dd className="mt-1 text-sm font-medium text-heading">{profile.department}</dd>
                </div>
              )}
            </dl>
          </section>

          {dashboard && (dashboard.classTeacherSections.length > 0 || dashboard.subjects.length > 0) && (
            <section className="card-panel form-shell space-y-5">
              {dashboard.classTeacherSections.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">Class teacher</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {dashboard.classTeacherSections.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {dashboard.subjects.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">Teaching subjects</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {dashboard.subjects.map((s) => (
                      <span
                        key={s}
                        className="rounded-lg border border-border bg-[color-mix(in_srgb,var(--surface-muted)_50%,transparent)] px-2.5 py-1 text-xs font-medium text-heading"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      ) : (
        <div className="mt-6 max-w-2xl">
          <section className="card-panel overflow-hidden">
            <div className="border-b border-border bg-gradient-to-r from-brand/8 via-transparent to-transparent px-4 py-3 sm:px-5">
              <p className="form-section-title">Security</p>
              <p className="mt-1 text-sm text-muted">Change your portal password. You will need your current password.</p>
            </div>
            <div className="form-shell">
              <AccountChangePasswordForm
                title=""
                description=""
                className="!rounded-none !border-0 !bg-transparent !p-0 !shadow-none"
              />
            </div>
          </section>
        </div>
      )}
    </>
  );
}
