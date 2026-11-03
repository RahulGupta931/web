"use client";

import type { FormEvent, ReactNode } from "react";
import { PanelMobileShell } from "@/components/panel/panel-mobile-shell";
import {
  MobileBottomSheet,
  MobileEmptyState,
  MobilePageHero,
  statusTone,
} from "@/components/mobile/mobile-primitives";

const ATTENDANCE_STATUSES = ["PRESENT", "ABSENT", "LATE", "HALF_DAY", "LEAVE_APPROVED"] as const;
export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];

type SectionOption = { sectionId: string; label: string };

export function TeacherAttendanceMobile({
  sections,
  sectionId,
  onSectionChange,
  date,
  onDateChange,
  students,
  statusByStudent,
  onStatusChange,
  loading,
  saving,
  onSave,
}: {
  sections: SectionOption[];
  sectionId: string;
  onSectionChange: (id: string) => void;
  date: string;
  onDateChange: (d: string) => void;
  students: { id: string; firstName: string; lastName: string; enrollments: { sectionId: string; rollNumber: string }[] }[];
  statusByStudent: Record<string, AttendanceStatus>;
  onStatusChange: (studentId: string, status: AttendanceStatus) => void;
  loading: boolean;
  saving: boolean;
  onSave: () => void;
}) {
  const sectionLabel = sections.find((s) => s.sectionId === sectionId)?.label ?? "Class";

  return (
    <div className="space-y-4 pb-20">
      <PanelMobileShell
        role="teacher"
        kicker="Teacher"
        title="Mark attendance"
        subtitle={`${sectionLabel} — tap calendar for holidays`}
        selectedDate={date}
        onSelectDate={onDateChange}
        calendarTitle="School days & holidays"
        heroExtra={
          <label className="block text-xs text-white/80">
            Section
            <select
              className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white"
              value={sectionId}
              onChange={(e) => onSectionChange(e.target.value)}
              disabled={sections.length === 0}
            >
              {sections.length === 0 && <option value="">No class assigned</option>}
              {sections.map((s) => (
                <option key={s.sectionId} value={s.sectionId} className="text-foreground">
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        }
      >
      {loading ? (
        <p className="text-center text-sm text-muted">Loading roster…</p>
      ) : students.length === 0 ? (
        <MobileEmptyState message="No students in this section." />
      ) : (
        <ul className="space-y-3">
          {students.map((s) => {
            const roll = s.enrollments.find((e) => e.sectionId === sectionId)?.rollNumber ?? "—";
            const status = statusByStudent[s.id] ?? "PRESENT";
            return (
              <li key={s.id} className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-heading">{s.firstName} {s.lastName}</p>
                    <p className="text-xs text-muted">Roll {roll}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[0.65rem] font-semibold ${statusTone(status)}`}>
                    {status.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {ATTENDANCE_STATUSES.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => onStatusChange(s.id, st)}
                      className={`rounded-full px-2.5 py-1 text-[0.65rem] font-semibold transition ${
                        status === st ? "bg-brand text-white" : "bg-surface-muted text-muted"
                      }`}
                    >
                      {st.replace(/_/g, " ")}
                    </button>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      </PanelMobileShell>

      <button
        type="button"
        onClick={onSave}
        disabled={saving || !sectionId || students.length === 0}
        className="fixed bottom-[5.75rem] left-4 right-4 z-20 rounded-2xl bg-brand-gold py-3.5 text-center text-sm font-bold text-brand-dark shadow-[0_8px_24px_rgb(201_162_39/0.45)] disabled:opacity-50 lg:hidden"
      >
        {saving ? "Saving…" : "Save attendance"}
      </button>
    </div>
  );
}

export function TeacherStudentsMobile({
  count,
  loading,
  searchQuery,
  onSearchChange,
  classOptions,
  filterClassId,
  onClassChange,
  sectionOptions,
  filterSectionId,
  onSectionChange,
  onClear,
  rows,
  onSelect,
}: {
  count: number;
  loading: boolean;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  classOptions: { id: string; name: string }[];
  filterClassId: string;
  onClassChange: (v: string) => void;
  sectionOptions: SectionOption[];
  filterSectionId: string;
  onSectionChange: (v: string) => void;
  onClear: () => void;
  rows: {
    id: string;
    studentId: string;
    firstName: string;
    lastName: string;
    enrollments: { rollNumber: string; class: { name: string }; section: { name: string } }[];
  }[];
  onSelect: (index: number) => void;
}) {
  return (
    <div className="space-y-4">
      <MobilePageHero
        kicker="Teacher"
        title="My students"
        subtitle={
          loading
            ? "Loading…"
            : `${count} student${count === 1 ? "" : "s"} in your class — tap to view or edit`
        }
      />

      <label className="relative block">
        <span className="sr-only">Search</span>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Name or student ID"
          className="w-full rounded-2xl border border-border bg-surface py-3 pl-11 pr-4 text-sm shadow-sm outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
        />
        <svg
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3-3" />
        </svg>
      </label>

      <div className="flex flex-wrap gap-2">
        <select
          className="flex-1 min-w-[8rem] rounded-xl border border-border bg-surface px-3 py-2 text-sm"
          value={filterClassId}
          onChange={(e) => onClassChange(e.target.value)}
        >
          <option value="">All classes</option>
          {classOptions.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          className="flex-1 min-w-[8rem] rounded-xl border border-border bg-surface px-3 py-2 text-sm"
          value={filterSectionId}
          onChange={(e) => onSectionChange(e.target.value)}
        >
          <option value="">All sections</option>
          {sectionOptions.map((s) => (
            <option key={s.sectionId} value={s.sectionId}>{s.label}</option>
          ))}
        </select>
        <button type="button" onClick={onClear} className="btn-secondary !rounded-xl text-xs">
          Clear
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Loading students…</p>
      ) : rows.length === 0 ? (
        <MobileEmptyState message="No students match your filters." />
      ) : (
        <ul className="space-y-2">
          {rows.map((s, index) => {
            const e = s.enrollments[0];
            const initials = `${s.firstName[0] ?? ""}${s.lastName[0] ?? ""}`.toUpperCase();
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => onSelect(index)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-left shadow-sm transition active:scale-[0.99]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-light to-brand text-sm font-bold text-white">
                    {initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-heading">{s.firstName} {s.lastName}</p>
                    <p className="text-xs text-muted">
                      {s.studentId}
                      {e ? ` · ${e.class.name}-${e.section.name} · Roll ${e.rollNumber}` : ""}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

const LEAVE_TYPES = ["SICK", "CASUAL", "EMERGENCY", "OTHER"] as const;

export function TeacherLeaveMobile({
  rows,
  type,
  onTypeChange,
  startDate,
  onStartChange,
  endDate,
  onEndChange,
  reason,
  onReasonChange,
  submitting,
  onSubmit,
}: {
  rows: { type: string; status: string; startDate: string; endDate: string }[];
  type: (typeof LEAVE_TYPES)[number];
  onTypeChange: (t: (typeof LEAVE_TYPES)[number]) => void;
  startDate: string;
  onStartChange: (v: string) => void;
  endDate: string;
  onEndChange: (v: string) => void;
  reason: string;
  onReasonChange: (v: string) => void;
  submitting: boolean;
  onSubmit: (e: FormEvent) => void;
}) {
  return (
    <div className="space-y-4">
      <MobilePageHero kicker="Teacher" title="Leave requests" subtitle="Apply for leave and track approvals." />

      <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-border bg-surface p-4 shadow-sm">
        <p className="text-sm font-semibold text-heading">New request</p>
        <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
          Type
          <select
            className="input-field mt-1"
            value={type}
            onChange={(e) => onTypeChange(e.target.value as (typeof LEAVE_TYPES)[number])}
          >
            {LEAVE_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
            From
            <input
              type="date"
              required
              className="input-field mt-1"
              value={startDate}
              onChange={(e) => onStartChange(e.target.value)}
            />
          </label>
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
            To
            <input
              type="date"
              required
              className="input-field mt-1"
              value={endDate}
              onChange={(e) => onEndChange(e.target.value)}
            />
          </label>
        </div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
          Reason
          <input
            type="text"
            className="input-field mt-1"
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder="Optional"
          />
        </label>
        <button type="submit" disabled={submitting} className="btn-primary w-full !rounded-xl disabled:opacity-50">
          {submitting ? "Submitting…" : "Apply for leave"}
        </button>
      </form>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">History</p>
        {rows.length === 0 ? (
          <MobileEmptyState message="No leave requests yet." />
        ) : (
          rows.map((r, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface px-4 py-3 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusTone(r.type)}`}>
                  {r.type}
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusTone(r.status)}`}>
                  {r.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-heading">
                {new Date(r.startDate).toLocaleDateString()} → {new Date(r.endDate).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function TeacherStudentDetailSheet({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <MobileBottomSheet open={open} title={title} onClose={onClose}>
      {children}
    </MobileBottomSheet>
  );
}
