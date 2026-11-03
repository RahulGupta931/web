"use client";

import { useEffect, useState, type ReactNode } from "react";

/** True when viewport is lg (1024px) and up — desktop panel layout. */
export function useIsDesktopPanel(): boolean {
  const [desktop, setDesktop] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(min-width: 1024px)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return desktop;
}

export type PrincipalStudentRow = {
  id: string;
  studentId: string;
  admissionNumber: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  guardianName: string | null;
  guardianPhone: string | null;
  admissionType: string;
  enrollments: { rollNumber: string; class: { name: string }; section: { name: string } }[];
  user: { email: string; status: string } | null;
};

export function studentDisplayName(s: PrincipalStudentRow): string {
  return [s.firstName, s.middleName, s.lastName].filter(Boolean).join(" ");
}

function initials(s: PrincipalStudentRow): string {
  const a = s.firstName?.[0] ?? "";
  const b = s.lastName?.[0] ?? "";
  return (a + b).toUpperCase() || "?";
}

function statusTone(status: string | undefined): string {
  if (status === "ACTIVE") return "bg-emerald-500/15 text-emerald-800";
  if (status === "INACTIVE" || status === "SUSPENDED") return "bg-red-500/15 text-red-800";
  return "bg-surface-muted text-muted";
}

type ClassRow = { id: string; name: string; sections: { id: string; name: string }[] };

export function PrincipalStudentsMobileHero({
  count,
  loading,
}: {
  count: number;
  loading: boolean;
}) {
  return (
    <section
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand-light px-4 py-5 text-white shadow-[var(--shadow-card)]"
      aria-label="Roster summary"
    >
      <div className="pointer-events-none absolute -right-6 top-0 h-28 w-28 rounded-full bg-brand-gold/25 blur-2xl" />
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">Student roster</p>
      <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight">
        {loading ? "—" : count}
      </p>
      <p className="mt-1 text-sm text-white/85">
        {loading ? "Loading…" : `enrolled student${count === 1 ? "" : "s"}`}
      </p>
    </section>
  );
}

export function PrincipalStudentsMobileFilters({
  classes,
  filterClassId,
  filterSectionId,
  searchQuery,
  onSearchChange,
  onClassChange,
  onSectionChange,
  onClear,
}: {
  classes: ClassRow[];
  filterClassId: string;
  filterSectionId: string;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  onClassChange: (classId: string) => void;
  onSectionChange: (sectionId: string) => void;
  onClear: () => void;
}) {
  const sections = filterClassId
    ? classes.find((c) => c.id === filterClassId)?.sections ?? []
    : [];

  const hasFilters = filterClassId || filterSectionId || searchQuery.trim();

  return (
    <div className="space-y-3">
      <label className="relative block">
        <span className="sr-only">Search students</span>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search name, ID, admission…"
          className="w-full rounded-2xl border border-border bg-surface py-3 pl-11 pr-4 text-sm shadow-[var(--shadow-card)] outline-none ring-brand/0 transition focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
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

      <div>
        <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-wide text-muted">Class</p>
        <div className="flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
          <button
            type="button"
            onClick={() => onClassChange("")}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
              !filterClassId
                ? "bg-brand text-white shadow-sm"
                : "border border-border bg-surface text-heading"
            }`}
          >
            All
          </button>
          {classes.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onClassChange(c.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
                filterClassId === c.id
                  ? "bg-brand text-white shadow-sm"
                  : "border border-border bg-surface text-heading"
              }`}
            >
              Class {c.name}
            </button>
          ))}
        </div>
      </div>

      {sections.length > 0 && (
        <div>
          <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-wide text-muted">Section</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onSectionChange("")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                !filterSectionId ? "bg-brand-gold/20 text-brand-dark" : "bg-surface-muted text-muted"
              }`}
            >
              All sections
            </button>
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onSectionChange(s.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  filterSectionId === s.id ? "bg-brand-gold/20 text-brand-dark" : "bg-surface-muted text-muted"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {hasFilters && (
        <button type="button" onClick={onClear} className="text-xs font-semibold text-brand">
          Clear all filters
        </button>
      )}
    </div>
  );
}

export function PrincipalStudentsMobileList({
  rows,
  loading,
  selectedId,
  onSelect,
  layout = "stack",
}: {
  rows: PrincipalStudentRow[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (student: PrincipalStudentRow, index: number) => void;
  layout?: "stack" | "grid";
}) {
  const listClass =
    layout === "grid"
      ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      : "space-y-3";
  if (loading) {
    return (
      <ul className="space-y-3" aria-busy="true">
        {[1, 2, 3, 4].map((i) => (
          <li key={i} className="h-24 animate-pulse rounded-2xl bg-surface-muted" />
        ))}
      </ul>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center">
        <p className="text-sm font-medium text-heading">No students found</p>
        <p className="mt-1 text-xs text-muted">Try another class or search term.</p>
      </div>
    );
  }

  return (
    <ul className={listClass}>
      {rows.map((s, index) => {
        const e = s.enrollments[0];
        const classLabel = e ? `${e.class.name}-${e.section.name}` : "—";
        const active = selectedId === s.id;
        return (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => onSelect(s, index)}
              className={`flex w-full gap-3 rounded-2xl border p-3.5 text-left shadow-[var(--shadow-card)] transition active:scale-[0.99] ${
                active
                  ? "border-brand/40 bg-brand/5 ring-2 ring-brand/20"
                  : "border-border bg-surface hover:border-brand/25"
              }`}
            >
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand/15 to-brand-gold/20 text-sm font-bold text-brand"
                aria-hidden
              >
                {initials(s)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-start justify-between gap-2">
                  <span className="truncate font-semibold text-heading">{studentDisplayName(s)}</span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[0.6rem] font-semibold uppercase ${statusTone(s.user?.status)}`}
                  >
                    {s.user?.status ?? "—"}
                  </span>
                </span>
                <span className="mt-0.5 block truncate text-xs text-muted">{s.studentId}</span>
                <span className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-brand/10 px-2 py-0.5 text-[0.65rem] font-semibold text-brand">
                    {classLabel}
                  </span>
                  {e?.rollNumber && (
                    <span className="text-[0.65rem] text-muted">Roll {e.rollNumber}</span>
                  )}
                </span>
                {s.guardianPhone && (
                  <span className="mt-1 block text-[0.65rem] text-muted truncate">
                    {s.guardianName ? `${s.guardianName} · ` : ""}
                    {s.guardianPhone}
                  </span>
                )}
              </span>
              <svg className="mt-3 h-4 w-4 shrink-0 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function PrincipalStudentsAddFab({
  onClick,
  ariaLabel = "Add new record",
}: {
  onClick: () => void;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-[5.75rem] right-4 z-20 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gold text-brand-dark shadow-[0_8px_24px_rgb(201_162_39/0.45)] transition active:scale-95 lg:hidden"
      aria-label={ariaLabel}
    >
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
        <path d="M12 5v14M5 12h14" />
      </svg>
    </button>
  );
}

export function PrincipalStudentsMobileSheet({
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
  if (!open) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Close"
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] lg:hidden"
        onClick={onClose}
      />
      <div
        className="fixed inset-x-0 bottom-0 z-50 flex max-h-[min(92vh,900px)] flex-col rounded-t-3xl border-t border-border bg-surface shadow-[0_-16px_48px_rgb(15_23_42/0.15)] lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-base font-semibold text-heading">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-1.5 text-sm font-semibold text-brand">
            Close
          </button>
        </div>
        <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-3 py-4 pb-[max(2rem,env(safe-area-inset-bottom))]">
          {children}
        </div>
      </div>
    </>
  );
}
