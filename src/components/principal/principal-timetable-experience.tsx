"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MobileEmptyState, MobileFilterChips } from "@/components/mobile/mobile-primitives";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import { principalNavLabel } from "@/config/nav";
import { TimetableWeekTable } from "@/components/timetable-week-table";
import type { TimetableSlotRow } from "@/components/timetable-week-grid";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

type TimetableListItem = { id: string; name: string; status: string; _count: { slots: number } };
type ClassRow = { id: string; name: string; sections: { id: string; name: string }[] };
type TimetableDetail = {
  id: string;
  name: string;
  status: string;
  slots: {
    day: string;
    period: { name: string; periodNo: number; startTime: string; endTime: string };
    subject: { name: string };
    teacher: { id: string; firstName: string; lastName: string };
    section: { id: string; name: string; class: { id: string; name: string } };
    classroom: { name: string } | null;
  }[];
};

function mapSlots(detail: TimetableDetail | null, sectionId: string): TimetableSlotRow[] {
  if (!detail) return [];
  const slots = sectionId ? detail.slots.filter((s) => s.section.id === sectionId) : detail.slots;
  return slots.map((s) => ({
    day: s.day,
    period: s.period,
    subject: s.subject,
    teacher: s.teacher,
    section: s.section,
    classroom: s.classroom,
  }));
}

function preferredTimetableId(list: TimetableListItem[]): string {
  if (list.length === 0) return "";
  const published = list.find((t) => t.status === "PUBLISHED");
  if (published) return published.id;
  const locked = list.find((t) => t.status === "LOCKED");
  if (locked) return locked.id;
  return list[0].id;
}

function statusBadgeClass(status: string): string {
  if (status === "PUBLISHED") return "bg-emerald-500/15 text-emerald-900";
  if (status === "LOCKED") return "bg-slate-500/15 text-slate-800";
  if (status === "DRAFT") return "bg-amber-500/15 text-amber-950";
  return "bg-surface-muted text-muted";
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3 shadow-[var(--shadow-card)]">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-2xl font-bold tabular-nums text-heading">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-muted">{sub}</p> : null}
    </div>
  );
}

function ClassSectionPicker({
  classes,
  selectedClassId,
  selectedSectionId,
  onClassChange,
  onSectionChange,
}: {
  classes: ClassRow[];
  selectedClassId: string;
  selectedSectionId: string;
  onClassChange: (id: string) => void;
  onSectionChange: (id: string) => void;
}) {
  const sections = classes.find((c) => c.id === selectedClassId)?.sections ?? [];
  const classOptions = classes.map((c) => ({ value: c.id, label: `Class ${c.name}` }));
  const sectionOptions = sections.map((s) => ({ value: s.id, label: `Sec ${s.name}` }));

  if (classes.length === 0) {
    return <p className="text-sm text-muted">No classes configured.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        {classOptions.length <= 6 ? (
          <MobileFilterChips options={classOptions} value={selectedClassId} onChange={onClassChange} />
        ) : (
          <select
            className="input-field w-full text-sm"
            value={selectedClassId}
            onChange={(e) => onClassChange(e.target.value)}
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>Class {c.name}</option>
            ))}
          </select>
        )}
        {sectionOptions.length > 0 && (
          sectionOptions.length <= 8 ? (
            <MobileFilterChips options={sectionOptions} value={selectedSectionId} onChange={onSectionChange} />
          ) : (
            <select
              className="input-field w-full text-sm"
              value={selectedSectionId}
              onChange={(e) => onSectionChange(e.target.value)}
            >
              {sections.map((s) => (
                <option key={s.id} value={s.id}>Section {s.name}</option>
              ))}
            </select>
          )
        )}
      </div>
    </div>
  );
}

export function PrincipalTimetableExperience() {
  const { get } = useApi();
  const [list, setList] = useState<TimetableListItem[]>([]);
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [detail, setDetail] = useState<TimetableDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadList = useCallback(() => {
    get<TimetableListItem[]>("/api/principal/timetables")
      .then((rows) => setList(Array.isArray(rows) ? rows : []))
      .catch((e) => {
        setList([]);
        setError(getApiErrorMessage(e));
      });
  }, [get]);

  const loadDetail = useCallback(
    (id: string) => {
      if (!id) {
        setDetail(null);
        return;
      }
      setDetailLoading(true);
      get<TimetableDetail>(`/api/principal/timetables/${id}`)
        .then(setDetail)
        .catch(() => setDetail(null))
        .finally(() => setDetailLoading(false));
    },
    [get]
  );

  useEffect(() => {
    loadList();
    get<ClassRow[]>("/api/principal/classes")
      .then((c) => setClasses(Array.isArray(c) ? c : []))
      .catch(() => setClasses([]));
  }, [get, loadList]);

  useEffect(() => {
    if (list.length === 0) return;
    if (!selectedId || !list.some((t) => t.id === selectedId)) {
      setSelectedId(preferredTimetableId(list));
    }
  }, [list, selectedId]);

  useEffect(() => {
    if (selectedId) loadDetail(selectedId);
  }, [selectedId, loadDetail]);

  useEffect(() => {
    if (classes.length === 0) return;
    if (!selectedClassId || !classes.some((c) => c.id === selectedClassId)) {
      const first = classes[0];
      setSelectedClassId(first.id);
      setSelectedSectionId(first.sections[0]?.id ?? "");
    }
  }, [classes, selectedClassId]);

  const sectionsForClass = useMemo(
    () => classes.find((c) => c.id === selectedClassId)?.sections ?? [],
    [classes, selectedClassId]
  );

  useEffect(() => {
    if (sectionsForClass.length === 0) {
      setSelectedSectionId("");
      return;
    }
    if (!selectedSectionId || !sectionsForClass.some((s) => s.id === selectedSectionId)) {
      setSelectedSectionId(sectionsForClass[0].id);
    }
  }, [sectionsForClass, selectedSectionId]);

  const selectedClass = classes.find((c) => c.id === selectedClassId);
  const selectedSection = sectionsForClass.find((s) => s.id === selectedSectionId);
  const classLabel =
    selectedClass && selectedSection
      ? `${selectedClass.name}-${selectedSection.name}`
      : selectedClass?.name ?? "—";

  const displayedSlots = useMemo(
    () => mapSlots(detail, selectedSectionId),
    [detail, selectedSectionId]
  );

  const activeTimetable = list.find((t) => t.id === selectedId);

  const scheduleOptions = list.map((t) => ({
    value: t.id,
    label:
      t.status === "PUBLISHED"
        ? `Published · ${t.name}`
        : `${t.name} (${t.status.replace(/_/g, " ")})`,
  }));

  function onClassChange(classId: string) {
    setSelectedClassId(classId);
    const cls = classes.find((c) => c.id === classId);
    setSelectedSectionId(cls?.sections[0]?.id ?? "");
  }

  const stats = useMemo(() => {
    const subjects = new Set(displayedSlots.map((s) => s.subject.name));
    const days = new Set(displayedSlots.map((s) => s.day));
    const published = list.filter((t) => t.status === "PUBLISHED").length;
    return {
      periods: displayedSlots.length,
      subjects: subjects.size,
      days: days.size,
      versions: list.length,
      published,
    };
  }, [displayedSlots, list]);

  const loading = list.length > 0 && detailLoading && !detail;

  return (
    <>
      <PanelAlerts error={error} />
      <div className="space-y-6">
        <PageHeader
          title={principalNavLabel("/principal/timetable")}
          description="Weekly teaching schedule by class and section — view published and draft versions."
          actions={
            <div className="flex shrink-0 flex-wrap gap-2">
              <Link href="/principal/configuration" className="btn-secondary text-sm">
                {principalNavLabel("/principal/configuration")}
              </Link>
              <Link href="/principal/calendar" className="btn-secondary text-sm">
                {principalNavLabel("/principal/calendar")}
              </Link>
            </div>
          }
        />

        <section
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand-light px-5 py-6 text-white shadow-[var(--shadow-card)]"
          aria-label="Timetable summary"
        >
          <div className="pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-full bg-brand-gold/25 blur-2xl" />
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">
            {activeTimetable ? activeTimetable.name : "School timetable"}
          </p>
          <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
            {loading
              ? "Loading…"
              : list.length === 0
                ? "No timetable yet"
                : `Class ${classLabel}`}
          </h2>
          <p className="mt-2 text-sm text-white/85">
            {list.length === 0
              ? "Publish a timetable version to show the weekly grid here."
              : `${stats.published} published version${stats.published === 1 ? "" : "s"} · ${stats.periods} period${stats.periods === 1 ? "" : "s"} in this section view`}
          </p>
          {activeTimetable && (
            <span
              className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${statusBadgeClass(activeTimetable.status)}`}
            >
              {activeTimetable.status.replace(/_/g, " ")}
            </span>
          )}
        </section>

        {list.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-4">
            <StatCard label="Periods" value={loading ? "—" : stats.periods} sub="Selected section" />
            <StatCard label="Subjects" value={loading ? "—" : stats.subjects} />
            <StatCard label="Days" value={loading ? "—" : stats.days} sub="With lessons" />
            <StatCard label="Versions" value={stats.versions} sub={`${stats.published} published`} />
          </div>
        )}

        {list.length > 0 && (
          <section className="card-panel form-shell space-y-4">
            <p className="form-section-title">Filters</p>
            {list.length > 1 && (
              <label className="block text-sm">
                <span className="text-muted">Timetable version</span>
                <select
                  className="input-field mt-1.5 w-full max-w-md text-sm"
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                >
                  {scheduleOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </label>
            )}
            <ClassSectionPicker
              classes={classes}
              selectedClassId={selectedClassId}
              selectedSectionId={selectedSectionId}
              onClassChange={onClassChange}
              onSectionChange={setSelectedSectionId}
            />
          </section>
        )}

        {list.length === 0 && (
          <MobileEmptyState message="No timetable is available yet for this school." />
        )}

        {loading && <p className="empty-state">Loading timetable…</p>}

        {detail && displayedSlots.length === 0 && !loading && (
          <MobileEmptyState message={`No periods assigned for ${classLabel}. Try another section.`} />
        )}

        {detail && displayedSlots.length > 0 && (
          <section className="card-panel min-w-0 overflow-hidden p-3 sm:p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
              <p className="form-section-title">Weekly grid · {classLabel}</p>
              {activeTimetable && (
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide ${statusBadgeClass(activeTimetable.status)}`}
                >
                  {activeTimetable.status.replace(/_/g, " ")}
                </span>
              )}
            </div>
            <TimetableWeekTable slots={displayedSlots} mode="student" />
          </section>
        )}
      </div>
    </>
  );
}
