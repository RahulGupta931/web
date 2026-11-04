"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { TeacherStudentDetailSheet } from "@/components/mobile/teacher-workflow-mobile";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import { teacherNavLabel } from "@/config/nav";
import { StudentDetailPanel, type StudentDetail } from "@/components/student-detail-panel";
import { useMediaQuery } from "@/lib/use-media-query";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

type StudentRow = {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  enrollments: { rollNumber: string; class: { name: string }; section: { name: string } }[];
};

type SectionOption = {
  sectionId: string;
  label: string;
  classId: string;
};

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3 shadow-[var(--shadow-card)]">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-2xl font-bold tabular-nums text-heading">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-muted">{sub}</p> : null}
    </div>
  );
}

function initials(first: string, last: string) {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

export function TeacherStudentsExperience() {
  const { loading: authLoading } = useAuth();
  const { get, patch, isReady } = useApi();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const [rows, setRows] = useState<StudentRow[]>([]);
  const [sections, setSections] = useState<SectionOption[]>([]);
  const [filterClassId, setFilterClassId] = useState("");
  const [filterSectionId, setFilterSectionId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<StudentDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [listLoading, setListLoading] = useState(false);

  const classOptions = useMemo(() => {
    const byId = new Map<string, string>();
    for (const s of sections) {
      const className = s.label.split("-")[0] ?? s.label;
      if (!byId.has(s.classId)) byId.set(s.classId, className);
    }
    return [...byId.entries()].map(([id, name]) => ({ id, name }));
  }, [sections]);

  const sectionOptions = useMemo(() => {
    if (!filterClassId) return sections;
    return sections.filter((s) => s.classId === filterClassId);
  }, [sections, filterClassId]);

  useEffect(() => {
    if (!isReady) return;
    get<SectionOption[]>("/api/teacher/sections")
      .then((data) => setSections(Array.isArray(data) ? data : []))
      .catch(() => setSections([]));
  }, [get, isReady]);

  const load = useCallback(() => {
    if (!isReady) {
      setRows([]);
      return;
    }
    setListLoading(true);
    const params = new URLSearchParams();
    if (filterClassId) params.set("classId", filterClassId);
    if (filterSectionId) params.set("sectionId", filterSectionId);
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    const qs = params.toString();
    get<StudentRow[]>(`/api/teacher/students${qs ? `?${qs}` : ""}`)
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch((e) => {
        setRows([]);
        setError(getApiErrorMessage(e));
      })
      .finally(() => setListLoading(false));
  }, [get, isReady, filterClassId, filterSectionId, searchQuery]);

  useEffect(() => {
    if (authLoading) return;
    load();
  }, [authLoading, load]);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }
    if (!rows.some((r) => r.id === selectedId)) {
      setSelectedId(null);
      setDetail(null);
      return;
    }
    setDetailLoading(true);
    setSaveMessage(null);
    setSaveError(null);
    get<StudentDetail>(`/api/teacher/students/${selectedId}`)
      .then(setDetail)
      .catch((e) => setError(getApiErrorMessage(e)))
      .finally(() => setDetailLoading(false));
  }, [get, selectedId, rows]);

  async function saveStudentEdit(payload: Record<string, unknown>): Promise<boolean> {
    if (!selectedId) return false;
    setSaveLoading(true);
    setSaveError(null);
    setSaveMessage(null);
    try {
      const updated = await patch<StudentDetail>(`/api/teacher/students/${selectedId}`, payload);
      setDetail(updated);
      setSaveMessage("Student profile updated.");
      load();
      return true;
    } catch (e) {
      setSaveError(getApiErrorMessage(e));
      return false;
    } finally {
      setSaveLoading(false);
    }
  }

  function clearFilters() {
    setFilterClassId("");
    setFilterSectionId("");
    setSearchQuery("");
    setSelectedId(null);
  }

  const selectedStudent = rows.find((r) => r.id === selectedId) ?? null;

  const detailPanel = (embedded?: boolean) => (
    <StudentDetailPanel
      detail={detail}
      loading={detailLoading}
      embedded={embedded}
      allowEdit
      onSaveEdit={saveStudentEdit}
      saveEditState={{ submitting: saveLoading, error: saveError, message: saveMessage }}
      onClose={() => {
        setSelectedId(null);
        setDetail(null);
        setSaveMessage(null);
        setSaveError(null);
      }}
    />
  );

  return (
    <>
      <PanelAlerts error={error} />
      <PageHeader
        title={teacherNavLabel("/teacher/students")}
        description="Students in your class and teaching sections. Select a student to view or update permitted profile fields."
      />

      <section
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand-light px-5 py-6 text-white shadow-[var(--shadow-card)]"
        aria-label="Student roster summary"
      >
        <div className="pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-full bg-brand-gold/25 blur-2xl" />
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">
          Class roster
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
          {listLoading ? "Loading…" : `${rows.length} student${rows.length === 1 ? "" : "s"}`}
        </h2>
        <p className="mt-2 text-sm text-white/85">
          {sections.length} section{sections.length === 1 ? "" : "s"} you can access · filter by class or search by name or ID
        </p>
      </section>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <StatCard label="Showing" value={listLoading ? "—" : rows.length} sub="After filters" />
        <StatCard label="Classes" value={classOptions.length} />
        <StatCard label="Sections" value={sections.length} />
      </div>

      <div className="mt-6 card-panel form-shell space-y-4">
        <input
          type="search"
          className="input-field w-full"
          placeholder="Search name or student ID…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setFilterClassId("");
              setFilterSectionId("");
            }}
            className={`rounded-full border px-3 py-1 text-sm font-medium ${
              !filterClassId ? "border-brand bg-brand text-white" : "border-border text-muted"
            }`}
          >
            All classes
          </button>
          {classOptions.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setFilterClassId(c.id);
                setFilterSectionId("");
              }}
              className={`rounded-full border px-3 py-1 text-sm font-medium ${
                filterClassId === c.id
                  ? "border-brand bg-brand text-white"
                  : "border-border text-muted hover:border-brand/30"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
        {sectionOptions.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t border-border pt-3">
            <button
              type="button"
              onClick={() => setFilterSectionId("")}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                !filterSectionId ? "border-brand/50 bg-brand/10 text-brand" : "border-border text-muted"
              }`}
            >
              All sections
            </button>
            {sectionOptions.map((s) => (
              <button
                key={s.sectionId}
                type="button"
                onClick={() => setFilterSectionId(s.sectionId)}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  filterSectionId === s.sectionId
                    ? "border-brand bg-brand text-white"
                    : "border-border text-muted"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
        {(filterClassId || filterSectionId || searchQuery) && (
          <button type="button" onClick={clearFilters} className="btn-secondary text-xs">
            Clear all filters
          </button>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className={`space-y-2 ${selectedId ? "hidden lg:block" : ""}`}>
          {listLoading ? (
            <p className="empty-state">Loading students…</p>
          ) : rows.length === 0 ? (
            <p className="empty-state">No students match your filters.</p>
          ) : (
            rows.map((s) => {
              const e = s.enrollments[0];
              const active = s.id === selectedId;
              const classLabel = e ? `${e.class.name}-${e.section.name}` : "—";
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedId(s.id)}
                  className={`flex w-full gap-3 rounded-xl border px-3 py-3 text-left transition-shadow sm:px-4 ${
                    active
                      ? "border-brand/45 bg-brand/[0.04] shadow-[var(--shadow-card-hover)]"
                      : "border-border bg-surface hover:border-brand/25 hover:shadow-[var(--shadow-card)]"
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      active ? "bg-brand text-white" : "bg-brand/10 text-brand"
                    }`}
                  >
                    {initials(s.firstName, s.lastName)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-semibold text-heading">
                      {s.firstName} {s.lastName}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted">
                      {s.studentId} · {classLabel}
                      {e?.rollNumber ? ` · Roll ${e.rollNumber}` : ""}
                    </span>
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className="hidden lg:block">
          {!selectedId ? (
            <div className="empty-state lg:min-h-[20rem] lg:flex lg:flex-col lg:items-center lg:justify-center">
              <p className="font-medium text-heading">Select a student</p>
              <p className="mt-1 max-w-sm text-sm text-muted">View profile, contact details, and permitted edits.</p>
            </div>
          ) : isDesktop ? (
            <div id="teacher-student-detail">{detailPanel()}</div>
          ) : null}
        </div>
      </div>

      {!isDesktop && (
        <TeacherStudentDetailSheet
          open={selectedId != null}
          title={
            selectedStudent
              ? `${selectedStudent.firstName} ${selectedStudent.lastName}`
              : "Student"
          }
          onClose={() => {
            setSelectedId(null);
            setDetail(null);
            setSaveMessage(null);
            setSaveError(null);
          }}
        >
          {detailLoading && !detail ? (
            <p className="text-sm text-muted">Loading student…</p>
          ) : (
            detailPanel(true)
          )}
        </TeacherStudentDetailSheet>
      )}
    </>
  );
}
