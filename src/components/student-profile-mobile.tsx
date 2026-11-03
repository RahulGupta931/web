"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { StudentProfileSections } from "@/components/student-profile-sections";
import { resolveApiAssetUrl } from "@/lib/api";
import { navIcons } from "@/components/nav-icons";
import type { StudentProfileRecord } from "@/lib/student-profile-display";

export type StudentProfileData = {
  profile: StudentProfileRecord;
  enrollment?: {
    rollNumber: string;
    class: { name: string };
    section: { name: string };
    academicSession: { name: string };
  } | null;
  enrollmentHistory: {
    rollNumber: string;
    class: { name: string };
    section: { name: string };
    academicSession: { name: string };
  }[];
  attendancePercentage?: number | null;
};

function initials(first: string, last: string) {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

function formatDob(dob?: string | null) {
  if (!dob) return null;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function formatGender(g?: string | null) {
  if (!g || g === "UNSPECIFIED") return null;
  return g.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function locationLine(profile: StudentProfileRecord): string | null {
  const parts = [profile.city, profile.state, profile.postalCode].filter(Boolean);
  if (parts.length > 0) return parts.join(", ");
  if (profile.address?.trim()) {
    const line = profile.address.trim().split("\n")[0];
    return line.length > 48 ? `${line.slice(0, 45)}…` : line;
  }
  return null;
}

function PassValue({ children, empty }: { children: ReactNode; empty?: boolean }) {
  return (
    <p
      className={`mt-0.5 text-sm font-semibold leading-snug ${
        empty ? "text-muted italic font-normal" : "text-heading"
      }`}
    >
      {children}
    </p>
  );
}

export function StudentProfileMobile({ data }: { data: StudentProfileData }) {
  const { profile, enrollment, enrollmentHistory, attendancePercentage } = data;
  const fullName = [profile.firstName, profile.middleName, profile.lastName].filter(Boolean).join(" ");
  const classLabel = enrollment
    ? `Class ${enrollment.class.name} · ${enrollment.section.name}`
    : "Not enrolled";
  const CheckIcon = navIcons.check;
  const FileIcon = navIcons.file;

  return (
    <div className="space-y-6 pb-4">
      {/* Hero + ID pass */}
      <section className="relative -mx-4 overflow-hidden px-4 pt-2 sm:-mx-6 sm:px-6">
        <div
          className="absolute inset-x-0 top-0 h-56 rounded-b-[2.5rem] bg-gradient-to-br from-indigo-950 via-brand-dark to-brand"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute right-0 top-8 h-40 w-40 rounded-full bg-brand-gold/25 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-6 top-24 h-28 w-28 rounded-full bg-cyan-400/15 blur-2xl"
          aria-hidden
        />

        <div className="relative pt-6 text-center">
          <div className="mx-auto inline-flex rounded-full p-1 ring-2 ring-brand-gold/50 ring-offset-2 ring-offset-transparent">
            {profile.photoUrl ? (
              <img
                src={resolveApiAssetUrl(profile.photoUrl)}
                alt=""
                className="h-24 w-24 rounded-full object-cover shadow-lg"
              />
            ) : (
              <div
                className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-light to-brand text-2xl font-bold text-white shadow-lg"
                aria-hidden
              >
                {initials(profile.firstName, profile.lastName)}
              </div>
            )}
          </div>
          <h1 className="mt-4 text-xl font-bold tracking-tight text-white">{fullName}</h1>
          <p className="mt-1 text-sm text-white/75">{classLabel}</p>
          {enrollment && (
            <p className="mt-0.5 text-xs text-brand-gold/90">
              Roll {enrollment.rollNumber} · {enrollment.academicSession.name}
            </p>
          )}
        </div>

        <article
          className="relative mt-6 overflow-hidden rounded-2xl border-2 border-brand-gold/50 bg-white shadow-[0_16px_40px_-8px_rgba(0,0,0,0.35)]"
          aria-label="Student pass"
        >
          <div className="flex items-center justify-between gap-2 bg-brand px-4 py-2.5">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-gold">Student pass</p>
            {enrollment && (
              <p className="text-right text-[0.65rem] font-medium text-white/90">
                Class {enrollment.class.name}-{enrollment.section.name} · Roll {enrollment.rollNumber}
              </p>
            )}
          </div>
          <div className="space-y-4 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="min-w-0 rounded-xl border border-border bg-[var(--surface-muted)]/80 px-3 py-2.5">
                <p className="text-[0.65rem] font-bold uppercase tracking-wide text-muted">Student ID</p>
                <p className="mt-1 break-all font-mono text-base font-bold text-brand-dark">
                  {profile.studentId}
                </p>
              </div>
              <div className="min-w-0 rounded-xl border border-border bg-[var(--surface-muted)]/80 px-3 py-2.5">
                <p className="text-[0.65rem] font-bold uppercase tracking-wide text-muted">Admission no.</p>
                <p className="mt-1 break-all font-mono text-base font-bold text-brand-dark">
                  {profile.admissionNumber}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-border pt-3">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-wide text-muted">Date of birth</p>
                <PassValue empty={!formatDob(profile.dateOfBirth)}>
                  {formatDob(profile.dateOfBirth) ?? "Not on file"}
                </PassValue>
              </div>
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-wide text-muted">Blood group</p>
                <PassValue empty={!profile.bloodGroup?.trim()}>
                  {profile.bloodGroup?.trim() || "Not on file"}
                </PassValue>
              </div>
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-wide text-muted">Gender</p>
                <PassValue empty={!formatGender(profile.gender)}>
                  {formatGender(profile.gender) ?? "Not on file"}
                </PassValue>
              </div>
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-wide text-muted">Location</p>
                <PassValue empty={!locationLine(profile)}>
                  {locationLine(profile) ?? "Not on file"}
                </PassValue>
              </div>
            </div>

            {enrollment && (
              <p className="border-t border-border pt-3 text-center text-xs font-medium text-muted">
                {enrollment.academicSession.name}
              </p>
            )}
          </div>
        </article>
      </section>

      {/* Bento stats */}
      <section className="grid grid-cols-2 gap-2.5" aria-label="Quick stats">
        <div className="col-span-2 flex items-center justify-between rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-card)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">This month</p>
            <p className="mt-1 text-2xl font-bold text-heading">
              {attendancePercentage != null ? `${attendancePercentage}%` : "—"}
            </p>
            <p className="text-xs text-muted">Attendance</p>
          </div>
          <div
            className="relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-brand/20"
            style={{
              background: `conic-gradient(var(--brand-maroon) ${attendancePercentage ?? 0}%, var(--surface-muted) 0)`,
            }}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-xs font-bold text-brand">
              {attendancePercentage != null ? attendancePercentage : "—"}
            </span>
          </div>
        </div>
        <Link
          href="/student/attendance"
          className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-3 shadow-[var(--shadow-card)] transition active:scale-[0.98]"
        >
          <CheckIcon className="h-5 w-5 text-brand" />
          <span className="text-sm font-semibold text-heading">Attendance</span>
          <span className="text-[0.65rem] text-muted">View history</span>
        </Link>
        <Link
          href="/student/report-cards"
          className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-3 shadow-[var(--shadow-card)] transition active:scale-[0.98]"
        >
          <FileIcon className="h-5 w-5 text-brand-gold" />
          <span className="text-sm font-semibold text-heading">Report cards</span>
          <span className="text-[0.65rem] text-muted">Published reports</span>
        </Link>
      </section>

      <StudentProfileSections profile={profile} variant="mobile" />

      {/* Academic journey */}
      <section aria-label="Academic history">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">My journey</h2>
        <ol className="relative space-y-0 border-l-2 border-brand/20 pl-5">
          {enrollmentHistory.map((e, i) => {
            const isCurrent = i === 0;
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
                    Class {e.class.name} – Section {e.section.name}
                  </p>
                  <p className="mt-1 text-xs text-muted">Roll no. {e.rollNumber}</p>
                  {isCurrent && (
                    <span className="mt-2 inline-block rounded-full bg-brand/15 px-2 py-0.5 text-[0.65rem] font-semibold text-brand">
                      Current
                    </span>
                  )}
                </div>
              </li>
            );
          })}
          {enrollmentHistory.length === 0 && (
            <li className="text-sm text-muted">No enrollment history yet.</li>
          )}
        </ol>
      </section>
    </div>
  );
}
