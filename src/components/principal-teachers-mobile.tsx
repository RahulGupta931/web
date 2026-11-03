"use client";

export type PrincipalTeacherRow = {
  id: string;
  employeeId: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  phone: string | null;
  designation: string | null;
  department: string | null;
  employmentType: string;
  qualification: string | null;
  user: { email: string; status: string } | null;
  classAssignments: { section: { name: string; class: { name: string } }; isClassTeacher: boolean }[];
  subjectAssignments: { sectionId: string | null; subject: { name: string } }[];
};

export function teacherDisplayName(t: PrincipalTeacherRow): string {
  return [t.firstName, t.middleName, t.lastName].filter(Boolean).join(" ");
}

function initials(t: PrincipalTeacherRow): string {
  const a = t.firstName?.[0] ?? "";
  const b = t.lastName?.[0] ?? "";
  return (a + b).toUpperCase() || "?";
}

function statusTone(status: string | undefined): string {
  if (status === "ACTIVE") return "bg-emerald-500/15 text-emerald-800";
  if (status === "INACTIVE" || status === "SUSPENDED") return "bg-red-500/15 text-red-800";
  return "bg-surface-muted text-muted";
}

export function formatClassTeacherLabel(t: PrincipalTeacherRow): string {
  const ct = t.classAssignments.filter((a) => a.isClassTeacher);
  if (ct.length === 0) return "";
  return ct.map((a) => `${a.section.class.name}-${a.section.name}`).join(", ");
}

export function uniqueSubjectLabels(t: PrincipalTeacherRow): string[] {
  return [...new Set(t.subjectAssignments.map((a) => a.subject.name))].sort((a, b) =>
    a.localeCompare(b)
  );
}

export function formatEmploymentType(value: string): string {
  return value.replace(/_/g, " ");
}

export function PrincipalTeachersMobileHero({
  count,
  loading,
}: {
  count: number;
  loading: boolean;
}) {
  return (
    <section
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand-light px-4 py-5 text-white shadow-[var(--shadow-card)]"
      aria-label="Faculty summary"
    >
      <div className="pointer-events-none absolute -right-6 top-0 h-28 w-28 rounded-full bg-brand-gold/25 blur-2xl" />
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">Faculty roster</p>
      <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight">{loading ? "—" : count}</p>
      <p className="mt-1 text-sm text-white/85">
        {loading ? "Loading…" : `teacher${count === 1 ? "" : "s"} on record`}
      </p>
    </section>
  );
}

export function PrincipalTeachersMobileFilters({
  departments,
  searchQuery,
  filterDepartment,
  classTeacherOnly,
  onSearchChange,
  onDepartmentChange,
  onClassTeacherOnlyChange,
  onClear,
}: {
  departments: string[];
  searchQuery: string;
  filterDepartment: string;
  classTeacherOnly: boolean;
  onSearchChange: (v: string) => void;
  onDepartmentChange: (v: string) => void;
  onClassTeacherOnlyChange: (v: boolean) => void;
  onClear: () => void;
}) {
  const hasFilters = searchQuery.trim() || filterDepartment || classTeacherOnly;

  return (
    <div className="space-y-3">
      <label className="relative block">
        <span className="sr-only">Search teachers</span>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search name, ID, email, department…"
          className="w-full rounded-2xl border border-border bg-surface py-3 pl-11 pr-4 text-sm shadow-[var(--shadow-card)] outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
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
        <button
          type="button"
          onClick={() => onClassTeacherOnlyChange(!classTeacherOnly)}
          className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
            classTeacherOnly
              ? "bg-brand-gold text-brand-dark shadow-sm"
              : "border border-border bg-surface text-heading"
          }`}
        >
          Class teachers only
        </button>
      </div>

      {departments.length > 0 && (
        <div>
          <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-wide text-muted">Department</p>
          <div className="flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
            <button
              type="button"
              onClick={() => onDepartmentChange("")}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
                !filterDepartment
                  ? "bg-brand text-white shadow-sm"
                  : "border border-border bg-surface text-heading"
              }`}
            >
              All
            </button>
            {departments.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => onDepartmentChange(d)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
                  filterDepartment === d
                    ? "bg-brand text-white shadow-sm"
                    : "border border-border bg-surface text-heading"
                }`}
              >
                {d}
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

export function PrincipalTeachersMobileList({
  rows,
  loading,
  selectedId,
  onSelect,
  layout = "stack",
}: {
  rows: PrincipalTeacherRow[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (teacher: PrincipalTeacherRow) => void;
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
          <li key={i} className="h-28 animate-pulse rounded-2xl bg-surface-muted" />
        ))}
      </ul>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center">
        <p className="text-sm font-medium text-heading">No teachers found</p>
        <p className="mt-1 text-xs text-muted">Try another filter or add a new teacher.</p>
      </div>
    );
  }

  return (
    <ul className={listClass}>
      {rows.map((t) => {
        const classTeacher = formatClassTeacherLabel(t);
        const subjects = uniqueSubjectLabels(t);
        const active = selectedId === t.id;
        return (
          <li key={t.id}>
            <button
              type="button"
              onClick={() => onSelect(t)}
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
                {initials(t)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-start justify-between gap-2">
                  <span className="truncate font-semibold text-heading">{teacherDisplayName(t)}</span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[0.6rem] font-semibold uppercase ${statusTone(t.user?.status)}`}
                  >
                    {t.user?.status ?? "—"}
                  </span>
                </span>
                <span className="mt-0.5 block truncate font-mono text-xs text-muted">{t.employeeId}</span>
                {t.designation && (
                  <span className="mt-1 block truncate text-xs text-muted">
                    {t.designation}
                    {t.department ? ` · ${t.department}` : ""}
                  </span>
                )}
                <span className="mt-2 flex flex-wrap items-center gap-2">
                  {classTeacher && (
                    <span className="rounded-md bg-brand-gold/20 px-2 py-0.5 text-[0.65rem] font-semibold text-brand-dark">
                      CT {classTeacher}
                    </span>
                  )}
                  {subjects.slice(0, 2).map((s) => (
                    <span
                      key={s}
                      className="rounded-md bg-brand/10 px-2 py-0.5 text-[0.65rem] font-medium text-brand"
                    >
                      {s}
                    </span>
                  ))}
                  {subjects.length > 2 && (
                    <span className="text-[0.65rem] text-muted">+{subjects.length - 2}</span>
                  )}
                </span>
                {t.user?.email && (
                  <span className="mt-1 block truncate text-[0.65rem] text-muted">{t.user.email}</span>
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
