"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import {
  PrincipalStudentsMobileFilters,
  PrincipalStudentsMobileList,
  PrincipalStudentsMobileSheet,
  studentDisplayName,
  type PrincipalStudentRow,
} from "@/components/principal-students-mobile";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import { principalNavLabel } from "@/config/nav";
import { StudentDetailPanel, type StudentDetail } from "@/components/student-detail-panel";
import { StudentAdmissionRegistrationForm } from "@/components/student-admission-registration-form";
import { StudentLoginCredentialsCard } from "@/components/student-login-credentials-card";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";
import { useMediaQuery } from "@/lib/use-media-query";

type Student = PrincipalStudentRow;
type ClassRow = { id: string; name: string; sections: { id: string; name: string }[] };
type WorkflowTab = "roster" | "add";

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3 shadow-[var(--shadow-card)]">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-2xl font-bold tabular-nums text-heading">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-muted">{sub}</p> : null}
    </div>
  );
}

export function PrincipalStudentsExperience() {
  const { loading: authLoading } = useAuth();
  const { get, patch, isReady } = useApi();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const [rows, setRows] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [sessions, setSessions] = useState<{ id: string; name: string; isCurrent: boolean }[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [detail, setDetail] = useState<StudentDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [enrollmentSaving, setEnrollmentSaving] = useState(false);
  const [enrollmentMessage, setEnrollmentMessage] = useState<string | null>(null);
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [filterClassId, setFilterClassId] = useState("");
  const [filterSectionId, setFilterSectionId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState<WorkflowTab>("roster");
  const [enrollmentCredentials, setEnrollmentCredentials] = useState<{
    loginEmail: string;
    loginPassword: string;
    studentId: string;
    admissionNumber: string;
    rollNumber?: string;
  } | null>(null);

  const load = useCallback(() => {
    if (!isReady) {
      setRows([]);
      setListLoading(false);
      return;
    }
    setListLoading(true);
    const params = new URLSearchParams();
    if (filterClassId) params.set("classId", filterClassId);
    if (filterSectionId) params.set("sectionId", filterSectionId);
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    const qs = params.toString();
    get<Student[]>(`/api/principal/students${qs ? `?${qs}` : ""}`)
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch((e) => {
        setRows([]);
        setError(getApiErrorMessage(e));
      })
      .finally(() => setListLoading(false));
  }, [get, isReady, filterClassId, filterSectionId, searchQuery]);

  useEffect(() => {
    if (!isReady) return;
    get<ClassRow[]>("/api/principal/classes")
      .then((c) => setClasses(c))
      .catch(() => {});
    get<{ id: string; name: string; isCurrent: boolean }[]>("/api/principal/academic-sessions")
      .then((s) => setSessions(s))
      .catch(() => {});
  }, [get, isReady]);

  useEffect(() => {
    if (authLoading || !isReady) return;
    setSelectedStudentId(null);
    setDetail(null);
    load();
  }, [authLoading, isReady, filterClassId, filterSectionId, searchQuery, load]);

  function loadDetail(studentId: string) {
    setDetailLoading(true);
    setEnrollmentMessage(null);
    setEnrollmentError(null);
    setProfileMessage(null);
    setProfileError(null);
    get<StudentDetail>(`/api/principal/students/${studentId}/detail`)
      .then(setDetail)
      .catch((e) => setError(getApiErrorMessage(e)))
      .finally(() => setDetailLoading(false));
  }

  function closeStudentDetail() {
    setSelectedStudentId(null);
    setDetail(null);
    setEnrollmentMessage(null);
    setEnrollmentError(null);
    setProfileMessage(null);
    setProfileError(null);
  }

  async function saveStudentProfile(payload: Record<string, unknown>): Promise<boolean> {
    if (!selectedStudentId) return false;
    setProfileSaving(true);
    setProfileError(null);
    setProfileMessage(null);
    try {
      await patch(`/api/principal/students/${selectedStudentId}`, payload);
      setProfileMessage("Student profile updated.");
      loadDetail(selectedStudentId);
      load();
      return true;
    } catch (e) {
      setProfileError(getApiErrorMessage(e));
      return false;
    } finally {
      setProfileSaving(false);
    }
  }

  function selectStudentById(id: string) {
    setSelectedStudentId(id);
    setDetail(null);
    loadDetail(id);
  }

  async function saveEnrollment(values: {
    academicSessionId: string;
    classId: string;
    sectionId: string;
    rollNumber: string;
  }): Promise<boolean> {
    if (!selectedStudentId) return false;
    setEnrollmentSaving(true);
    setEnrollmentError(null);
    setEnrollmentMessage(null);
    try {
      const updated = await patch<StudentDetail>(
        `/api/principal/students/${selectedStudentId}/enrollment`,
        values
      );
      setDetail(updated);
      setEnrollmentMessage("Class assignment updated.");
      load();
      return true;
    } catch (e) {
      setEnrollmentError(getApiErrorMessage(e));
      return false;
    } finally {
      setEnrollmentSaving(false);
    }
  }

  function onWorkflowTabChange(next: WorkflowTab) {
    setTab(next);
    if (next !== "roster") closeStudentDetail();
  }

  const selectedRow = rows.find((r) => r.id === selectedStudentId) ?? null;

  const detailPanel = (embedded?: boolean) => (
    <StudentDetailPanel
      detail={detail}
      loading={detailLoading}
      embedded={embedded}
      allowEdit
      onSaveEdit={saveStudentProfile}
      saveEditState={{
        submitting: profileSaving,
        error: profileError,
        message: profileMessage,
      }}
      allowEnrollmentEdit
      enrollmentClasses={classes}
      enrollmentSessions={sessions}
      onSaveEnrollment={saveEnrollment}
      enrollmentSaveState={{
        submitting: enrollmentSaving,
        error: enrollmentError,
        message: enrollmentMessage,
      }}
      onClose={closeStudentDetail}
    />
  );

  return (
    <>
      <PanelAlerts error={error} />

      <PageHeader
        title={principalNavLabel("/principal/students")}
        description="Enrolled learners, class assignments, portal logins, and new admissions."
        actions={
          <Link href="/principal/bulk-import" className="btn-secondary shrink-0 text-sm">
            {principalNavLabel("/principal/bulk-import")}
          </Link>
        }
      />

      <section
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand-light px-5 py-6 text-white shadow-[var(--shadow-card)]"
        aria-label="Student roster summary"
      >
        <div className="pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-full bg-brand-gold/25 blur-2xl" />
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">Student roster</p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
          {listLoading ? "Loading…" : `${rows.length} enrolled`}
        </h2>
        <p className="mt-2 text-sm text-white/85">
          {classes.length} class{classes.length === 1 ? "" : "es"} · search, filter, and open a profile to edit enrollment or login details
        </p>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard label="Showing" value={listLoading ? "—" : rows.length} sub="After filters" />
        <StatCard label="Classes" value={classes.length} />
      </div>

      <nav
        className="flex gap-1 rounded-xl border border-border bg-surface p-1 shadow-[var(--shadow-card)]"
        aria-label="Student workflow"
      >
        {(
          [
            ["roster", "Student roster"],
            ["add", "Enroll student"],
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

      {enrollmentCredentials && (
        <div className="space-y-2">
          <StudentLoginCredentialsCard
            loginEmail={enrollmentCredentials.loginEmail}
            loginPassword={enrollmentCredentials.loginPassword}
            studentLoginId={enrollmentCredentials.studentId}
            admissionNumber={enrollmentCredentials.admissionNumber}
            rollNumber={enrollmentCredentials.rollNumber}
            note="Share these credentials with the student. They can sign in to the student portal immediately."
          />
          <button
            type="button"
            className="btn-secondary text-sm"
            onClick={() => setEnrollmentCredentials(null)}
          >
            Dismiss login card
          </button>
        </div>
      )}

      {tab === "roster" ? (
        <>
          <div className="card-panel form-shell">
            <PrincipalStudentsMobileFilters
              classes={classes}
              filterClassId={filterClassId}
              filterSectionId={filterSectionId}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onClassChange={(id) => {
                setFilterClassId(id);
                setFilterSectionId("");
              }}
              onSectionChange={setFilterSectionId}
              onClear={() => {
                setFilterClassId("");
                setFilterSectionId("");
                setSearchQuery("");
                closeStudentDetail();
              }}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div className={selectedStudentId ? "hidden lg:block" : ""}>
              <PrincipalStudentsMobileList
                rows={rows}
                loading={listLoading}
                selectedId={selectedStudentId}
                onSelect={(s) => selectStudentById(s.id)}
                layout="stack"
              />
            </div>

            <div className="hidden lg:block">
              {!selectedStudentId ? (
                <div className="empty-state lg:min-h-[20rem] lg:flex lg:flex-col lg:items-center lg:justify-center">
                  <p className="font-medium text-heading">Select a student</p>
                  <p className="mt-1 max-w-sm text-sm text-muted">
                    View profile, update enrollment, and manage portal access.
                  </p>
                </div>
              ) : isDesktop ? (
                detailPanel()
              ) : null}
            </div>
          </div>
        </>
      ) : (
        <StudentAdmissionRegistrationForm
          variant="principal"
          classes={classes}
          sessions={sessions}
          onEnrolled={(creds) => {
            setEnrollmentCredentials(creds);
            setTab("roster");
            load();
          }}
        />
      )}

      {!isDesktop && selectedStudentId && tab === "roster" && (
        <PrincipalStudentsMobileSheet
          open
          title={selectedRow ? studentDisplayName(selectedRow) : "Student profile"}
          onClose={closeStudentDetail}
        >
          {detailLoading && !detail ? (
            <p className="text-sm text-muted">Loading student…</p>
          ) : (
            detailPanel(true)
          )}
        </PrincipalStudentsMobileSheet>
      )}
    </>
  );
}
