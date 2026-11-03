"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ClassTeacherReportCards } from "@/components/class-teacher-report-cards";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import { teacherNavLabel } from "@/config/nav";
import { useAuth } from "@/components/auth-provider";
import { getApiErrorMessage } from "@/lib/api";
import { examMarksSummary } from "@/lib/exam-marks-summary";
import { useMediaQuery } from "@/lib/use-media-query";
import { useApi } from "@/lib/use-api";
import {
  TeacherExamWorkflowTabs,
  type TeacherExamWorkflowTab,
} from "@/components/teacher/teacher-exam-workflow-tabs";
import {
  TeacherSubjectMarksWorkspace,
  type TeacherExamRow,
} from "@/components/teacher/teacher-subject-marks-workspace";

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  studentId: string;
};

type SectionOption = {
  sectionId: string;
  label: string;
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

export function TeacherExaminationsExperience() {
  const { loading: authLoading } = useAuth();
  const { get, post, isReady } = useApi();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const [rows, setRows] = useState<TeacherExamRow[]>([]);
  const [sections, setSections] = useState<SectionOption[]>([]);
  const [sectionId, setSectionId] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [examId, setExamId] = useState("");
  const [examSubjectId, setExamSubjectId] = useState("");
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [workflowTab, setWorkflowTab] = useState<TeacherExamWorkflowTab>("subject");
  const [hasClassTeacherRole, setHasClassTeacherRole] = useState(false);

  const load = useCallback(() => {
    if (!isReady) return;
    get<TeacherExamRow[]>("/api/teacher/examinations")
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch((e) => {
        setRows([]);
        setError(getApiErrorMessage(e));
      });
  }, [get, isReady]);

  useEffect(() => {
    if (authLoading) return;
    load();
  }, [authLoading, load]);

  const classTeacherTabDefaulted = useRef(false);

  useEffect(() => {
    if (!isReady) return;
    get<{ sectionId: string }[]>("/api/teacher/class-teacher/sections")
      .then((data) => {
        const isClassTeacher = Array.isArray(data) && data.length > 0;
        setHasClassTeacherRole(isClassTeacher);
        if (isClassTeacher && !classTeacherTabDefaulted.current) {
          classTeacherTabDefaulted.current = true;
          setWorkflowTab("class");
        }
      })
      .catch(() => setHasClassTeacherRole(false));
  }, [get, isReady]);

  const teachableExams = useMemo(() => rows.filter((e) => e.subjects.length > 0), [rows]);

  const paperCount = useMemo(
    () => teachableExams.reduce((n, e) => n + e.subjects.length, 0),
    [teachableExams]
  );

  useEffect(() => {
    if (teachableExams.length === 0) return;
    if (!examId || !teachableExams.some((r) => r.id === examId)) {
      const first = teachableExams[0];
      setExamId(first.id);
      setExamSubjectId(first.subjects[0]?.id ?? "");
    }
  }, [teachableExams, examId]);

  const selectedSubject = useMemo(() => {
    const exam = teachableExams.find((e) => e.id === examId);
    return exam?.subjects.find((s) => s.id === examSubjectId);
  }, [teachableExams, examId, examSubjectId]);

  const subjects = useMemo(() => {
    const exam = teachableExams.find((e) => e.id === examId);
    return exam?.subjects ?? [];
  }, [teachableExams, examId]);

  useEffect(() => {
    if (subjects.length > 0 && !subjects.some((s) => s.id === examSubjectId)) {
      setExamSubjectId(subjects[0].id);
    }
  }, [examId, subjects, examSubjectId]);

  useEffect(() => {
    if (!isReady || !selectedSubject?.subjectId) {
      setSections([]);
      setSectionId("");
      return;
    }
    get<SectionOption[]>(`/api/teacher/sections?subjectId=${selectedSubject.subjectId}`)
      .then((opts) => {
        const list = Array.isArray(opts) ? opts : [];
        setSections(list);
        setSectionId((prev) =>
          prev && list.some((o) => o.sectionId === prev) ? prev : list[0]?.sectionId ?? ""
        );
      })
      .catch(() => {
        setSections([]);
        setSectionId("");
      });
  }, [get, isReady, selectedSubject?.subjectId]);

  useEffect(() => {
    if (!isReady || !sectionId) {
      setStudents([]);
      setMarks({});
      return;
    }
    setLoadingStudents(true);
    get<Student[]>(`/api/teacher/students?scope=teaching&sectionId=${sectionId}`)
      .then((s) => setStudents(Array.isArray(s) ? s : []))
      .catch((e) => {
        setStudents([]);
        setError(getApiErrorMessage(e));
      })
      .finally(() => setLoadingStudents(false));
  }, [get, isReady, sectionId]);

  useEffect(() => {
    if (!isReady || !examId || !examSubjectId || !sectionId || students.length === 0) {
      setMarks({});
      return;
    }
    get<{ studentProfileId: string; marksObtained: unknown }[]>(
      `/api/teacher/examinations/${examId}/subjects/${examSubjectId}/marks?sectionId=${sectionId}`
    )
      .then((data) => {
        const next: Record<string, string> = {};
        if (Array.isArray(data)) {
          for (const m of data) {
            next[m.studentProfileId] = String(m.marksObtained);
          }
        }
        setMarks(next);
      })
      .catch(() => setMarks({}));
  }, [get, isReady, examId, examSubjectId, sectionId, students]);

  const markStats = useMemo(() => {
    const maxMarks = selectedSubject?.maxMarks != null ? Number(selectedSubject.maxMarks) : null;
    const passingMarks =
      selectedSubject?.passingMarks != null ? Number(selectedSubject.passingMarks) : null;
    return examMarksSummary({
      studentIds: students.map((s) => s.id),
      marks,
      maxMarks,
      passingMarks,
    });
  }, [students, marks, selectedSubject]);

  async function onSaveMarks(e: FormEvent) {
    e.preventDefault();
    if (!examId || !examSubjectId || !sectionId) return;
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      const payload = students
        .filter((s) => marks[s.id] !== undefined && marks[s.id] !== "")
        .map((s) => ({
          studentProfileId: s.id,
          marksObtained: Number(marks[s.id]),
        }));
      if (payload.length === 0) {
        setError("Enter marks for at least one student.");
        return;
      }
      await post(`/api/teacher/examinations/${examId}/subjects/${examSubjectId}/marks`, {
        marks: payload,
      });
      setMessage("Marks saved successfully.");
      const refreshed = await get<{ studentProfileId: string; marksObtained: unknown }[]>(
        `/api/teacher/examinations/${examId}/subjects/${examSubjectId}/marks?sectionId=${sectionId}`
      );
      const next: Record<string, string> = {};
      if (Array.isArray(refreshed)) {
        for (const m of refreshed) {
          next[m.studentProfileId] = String(m.marksObtained);
        }
      }
      setMarks(next);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  const workspaceProps = {
    exams: teachableExams,
    examId,
    onExamChange: setExamId,
    examSubjectId,
    onSubjectChange: setExamSubjectId,
    sectionId,
    onSectionChange: setSectionId,
    sections,
    students,
    marks,
    onMarkChange: (id: string, value: string) => setMarks((m) => ({ ...m, [id]: value })),
    loadingStudents,
    submitting,
    onSubmit: onSaveMarks,
  };

  const showReportCards = workflowTab === "class" && hasClassTeacherRole;
  const selectedExam = teachableExams.find((e) => e.id === examId);

  return (
    <>
      <PanelAlerts error={error} message={message} messageTitle="Marks saved" />
      <PageHeader
        title={teacherNavLabel("/teacher/examinations")}
        description="Enter marks for your subject papers. Class teachers compile full report cards for their section."
      />

      <section
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand-light px-5 py-6 text-white shadow-[var(--shadow-card)]"
        aria-label="Examinations summary"
      >
        <div className="pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-full bg-brand-gold/25 blur-2xl" />
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">
          {showReportCards ? "Class teacher" : "Subject teacher"}
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
          {showReportCards
            ? "Report cards for your class"
            : selectedExam?.name ?? (teachableExams.length ? "Mark entry" : "No exams published")}
        </h2>
        <p className="mt-2 text-sm text-white/85">
          {teachableExams.length > 0
            ? `${teachableExams.length} exam${teachableExams.length === 1 ? "" : "s"} · ${paperCount} paper${paperCount === 1 ? "" : "s"} you can mark`
            : "Exams appear here when the principal publishes schedules that include your subjects."}
          {hasClassTeacherRole ? " · You can switch to report cards for your homeroom." : ""}
        </p>
      </section>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <StatCard label="Exams" value={teachableExams.length} sub="With your subjects" />
        <StatCard label="Your papers" value={paperCount} />
        {workflowTab === "subject" && students.length > 0 ? (
          <>
            <StatCard
              label="Marks entered"
              value={`${markStats.entered}/${markStats.total}`}
              sub={markStats.pending ? `${markStats.pending} pending` : "Roster complete"}
            />
            <StatCard label="Class average" value={markStats.average} />
          </>
        ) : (
          <>
            <StatCard
              label="Class teacher"
              value={hasClassTeacherRole ? "Yes" : "—"}
              sub={hasClassTeacherRole ? "Report card access" : "Subject papers only"}
            />
            <StatCard
              label="Current exam"
              value={selectedExam?.status ?? "—"}
              sub={selectedExam ? "Publication status" : undefined}
            />
          </>
        )}
      </div>

      <TeacherExamWorkflowTabs
        className="mt-6"
        value={workflowTab}
        onChange={setWorkflowTab}
        showClassTeacherTab={hasClassTeacherRole}
      />

      <div className="mt-6">
        {showReportCards ? (
          <section className="card-panel overflow-hidden p-3 sm:p-4">
            <p className="form-section-title mb-4 px-1">Class report cards</p>
            <ClassTeacherReportCards embedded />
          </section>
        ) : (
          <section className="card-panel overflow-hidden p-3 sm:p-5">
            <p className="form-section-title mb-4">Subject mark entry</p>
            <TeacherSubjectMarksWorkspace
              layout={isDesktop ? "desktop" : "mobile"}
              embedded
              {...workspaceProps}
            />
          </section>
        )}
      </div>
    </>
  );
}
