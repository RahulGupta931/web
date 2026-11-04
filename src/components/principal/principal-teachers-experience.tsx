"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import {
  PrincipalStudentsMobileSheet,
} from "@/components/principal-students-mobile";
import {
  PrincipalTeachersMobileFilters,
  PrincipalTeachersMobileList,
  teacherDisplayName,
  type PrincipalTeacherRow,
} from "@/components/principal-teachers-mobile";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import { principalNavLabel } from "@/config/nav";
import { TeacherDetailPanel, type TeacherDetail } from "@/components/teacher-detail-panel";
import { TeacherRegistrationForm } from "@/components/teacher-registration-form";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";
import { useMediaQuery } from "@/lib/use-media-query";

type Teacher = PrincipalTeacherRow;
type WorkflowTab = "roster" | "add";
type ClassRow = { id: string; name: string; sections: { id: string; name: string }[] };

export function PrincipalTeachersExperience() {
  const { loading: authLoading } = useAuth();
  const { get, patch, isReady } = useApi();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const [rows, setRows] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [detail, setDetail] = useState<TeacherDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [assignSaving, setAssignSaving] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);
  const [assignMessage, setAssignMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [classTeacherOnly, setClassTeacherOnly] = useState(false);
  const [tab, setTab] = useState<WorkflowTab>("roster");

  const load = useCallback(() => {
    if (!isReady) {
      setRows([]);
      setListLoading(false);
      return;
    }
    setListLoading(true);
    setError(null);
    get<Teacher[]>("/api/principal/teachers")
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch((e) => {
        setRows([]);
        setError(getApiErrorMessage(e));
      })
      .finally(() => setListLoading(false));
  }, [get, isReady]);

  useEffect(() => {
    if (!isReady) return;
    get<ClassRow[]>("/api/principal/classes")
      .then((c) => setClasses(Array.isArray(c) ? c : []))
      .catch(() => setClasses([]));
    get<{ id: string; name: string }[]>("/api/principal/subjects")
      .then((s) => setSubjects(Array.isArray(s) ? s : []))
      .catch(() => setSubjects([]));
  }, [get, isReady]);

  useEffect(() => {
    if (authLoading) return;
    load();
  }, [authLoading, load]);

  const departments = useMemo(() => {
    const set = new Set<string>();
    for (const t of rows) {
      if (t.department?.trim()) set.add(t.department.trim());
    }
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [rows]);

  const filteredRows = useMemo(() => {
    let list = rows;
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((t) => {
        const hay = [
          t.employeeId,
          t.firstName,
          t.middleName,
          t.lastName,
          t.department,
          t.designation,
          t.user?.email,
          t.phone,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
    }
    if (filterDepartment) {
      list = list.filter((t) => t.department === filterDepartment);
    }
    if (classTeacherOnly) {
      list = list.filter((t) => t.classAssignments.some((a) => a.isClassTeacher));
    }
    return list;
  }, [rows, searchQuery, filterDepartment, classTeacherOnly]);

  const classTeacherCount = useMemo(
    () => rows.filter((t) => t.classAssignments.some((a) => a.isClassTeacher)).length,
    [rows]
  );

  function closeTeacherDetail() {
    setSelectedTeacherId(null);
    setDetail(null);
    setAssignError(null);
    setAssignMessage(null);
  }

  function loadDetail(teacherId: string) {
    setDetailLoading(true);
    setDetail(null);
    setAssignError(null);
    setAssignMessage(null);
    get<TeacherDetail>(`/api/principal/teachers/${teacherId}/detail`)
      .then(setDetail)
      .catch((e) => setError(getApiErrorMessage(e)))
      .finally(() => setDetailLoading(false));
  }

  function selectTeacherById(id: string) {
    setSelectedTeacherId(id);
    loadDetail(id);
  }

  async function saveAssignments(
    assignments: { sectionId: string; isClassTeacher: boolean }[]
  ): Promise<boolean> {
    if (!selectedTeacherId) return false;
    setAssignSaving(true);
    setAssignError(null);
    setAssignMessage(null);
    try {
      const updated = await patch<TeacherDetail>(
        `/api/principal/teachers/${selectedTeacherId}/class-assignments`,
        { assignments }
      );
      setDetail(updated);
      setAssignMessage("Assigned classes updated.");
      load();
      return true;
    } catch (e) {
      setAssignError(getApiErrorMessage(e));
      return false;
    } finally {
      setAssignSaving(false);
    }
  }

  function onWorkflowTabChange(next: WorkflowTab) {
    setTab(next);
    if (next !== "roster") closeTeacherDetail();
  }

  const selectedRow = rows.find((r) => r.id === selectedTeacherId) ?? null;

  const detailPanel = (embedded?: boolean) => (
    <TeacherDetailPanel
      detail={detail}
      loading={detailLoading}
      embedded={embedded}
      assignmentClasses={classes}
      onSaveAssignments={saveAssignments}
      assignmentSaveState={{
        submitting: assignSaving,
        error: assignError,
        message: assignMessage,
      }}
      onClose={closeTeacherDetail}
    />
  );

  return (
    <>
      <PanelAlerts error={error} message={message} />

      <PageHeader
        title={principalNavLabel("/principal/teachers")}
        description="Faculty roster, class and subject assignments, and new registrations."
        actions={
          <Link href="/principal/bulk-import" className="btn-secondary shrink-0 text-sm">
            {principalNavLabel("/principal/bulk-import")}
          </Link>
        }
      />

      <section
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand-light px-5 py-6 text-white shadow-[var(--shadow-card)]"
        aria-label="Faculty roster summary"
      >
        <div className="pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-full bg-brand-gold/25 blur-2xl" />
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">Faculty roster</p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
          {listLoading ? "Loading…" : `${rows.length} on staff`}
        </h2>
        <p className="mt-2 text-sm text-white/85">
          {classTeacherCount} class teacher{classTeacherCount === 1 ? "" : "s"} · search and open a profile to manage assignments
        </p>
      </section>

      <nav
        className="flex gap-1 rounded-xl border border-border bg-surface p-1 shadow-[var(--shadow-card)]"
        aria-label="Teacher workflow"
      >
        {(
          [
            ["roster", "Staff roster"],
            ["add", "Register teacher"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => onWorkflowTabChange(id)}
            className={`flex flex-1 items-center justify-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              tab === id ? "bg-brand text-white shadow-sm" : "text-muted hover:bg-surface-muted hover:text-heading"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {tab === "roster" ? (
        <>
          <div className="card-panel form-shell">
            <PrincipalTeachersMobileFilters
              departments={departments}
              searchQuery={searchQuery}
              filterDepartment={filterDepartment}
              classTeacherOnly={classTeacherOnly}
              onSearchChange={setSearchQuery}
              onDepartmentChange={setFilterDepartment}
              onClassTeacherOnlyChange={setClassTeacherOnly}
              onClear={() => {
                setSearchQuery("");
                setFilterDepartment("");
                setClassTeacherOnly(false);
                closeTeacherDetail();
              }}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div className={selectedTeacherId ? "hidden lg:block" : ""}>
              <PrincipalTeachersMobileList
                rows={filteredRows}
                loading={listLoading}
                selectedId={selectedTeacherId}
                onSelect={(t) => selectTeacherById(t.id)}
                layout="stack"
              />
            </div>

            <div className="hidden lg:block">
              {!selectedTeacherId ? (
                <div className="empty-state lg:min-h-[20rem] lg:flex lg:flex-col lg:items-center lg:justify-center">
                  <p className="font-medium text-heading">Select a teacher</p>
                  <p className="mt-1 max-w-sm text-sm text-muted">
                    View profile, subjects, and class-teacher assignments.
                  </p>
                </div>
              ) : isDesktop ? (
                detailPanel()
              ) : null}
            </div>
          </div>
        </>
      ) : (
        <TeacherRegistrationForm
          classes={classes}
          subjects={subjects}
          onCreated={() => {
            setMessage("Teacher registered successfully.");
            setTab("roster");
            load();
          }}
        />
      )}

      {!isDesktop && selectedTeacherId && tab === "roster" && (
        <PrincipalStudentsMobileSheet
          open
          title={selectedRow ? teacherDisplayName(selectedRow) : "Teacher profile"}
          onClose={closeTeacherDetail}
        >
          {detailLoading && !detail ? (
            <p className="text-sm text-muted">Loading teacher…</p>
          ) : (
            detailPanel(true)
          )}
        </PrincipalStudentsMobileSheet>
      )}
    </>
  );
}
