"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import { teacherNavLabel } from "@/config/nav";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

type Tab = "report" | "mine" | "class";

type SectionRow = { id: string; name: string; class: { id: string; name: string } };
type StudentRow = {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  enrollments: { rollNumber: string; class: { name: string }; section: { name: string } }[];
};
type ComplaintRow = {
  id: string;
  complaintNumber: string;
  incidentDate: string;
  incidentTime: string | null;
  category: string;
  severity: string;
  status: string;
  description: string;
  classTeacherComment: string | null;
  student: { firstName: string; lastName: string; studentId: string };
  section: { name: string; class: { name: string } };
  reportingTeacher: { firstName: string; lastName: string; employeeId: string };
};

const CATEGORIES = [
  { id: "CLASSROOM_MISCONDUCT", label: "Classroom misconduct", hint: "Disruption, defiance, incomplete work" },
  { id: "BULLYING", label: "Bullying", hint: "Harassment or targeted behaviour" },
  { id: "FIGHTING", label: "Fighting", hint: "Physical altercation" },
  { id: "PROPERTY_DAMAGE", label: "Property damage", hint: "School or personal property" },
  { id: "DISRUPTION", label: "Disruption", hint: "Assembly, corridor, or event" },
  { id: "OTHER", label: "Other", hint: "Describe clearly in notes" },
] as const;

const SEVERITIES = [
  { id: "LOW", label: "Low", tone: "bg-emerald-500/15 text-emerald-800 ring-emerald-500/25" },
  { id: "MEDIUM", label: "Medium", tone: "bg-amber-500/15 text-amber-900 ring-amber-500/30" },
  { id: "HIGH", label: "High", tone: "bg-orange-500/15 text-orange-900 ring-orange-500/30" },
  { id: "CRITICAL", label: "Critical", tone: "bg-red-500/15 text-red-900 ring-red-500/35" },
] as const;

const OPEN_STATUSES = new Set(["SUBMITTED", "UNDER_REVIEW", "ACTION_REQUIRED"]);

function labelCategory(c: string) {
  return CATEGORIES.find((x) => x.id === c)?.label ?? c.replace(/_/g, " ");
}

function formatStatus(s: string) {
  return s.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (x) => x.toUpperCase());
}

function statusTone(status: string): string {
  switch (status) {
    case "SUBMITTED":
      return "bg-sky-500/12 text-sky-900";
    case "UNDER_REVIEW":
      return "bg-violet-500/12 text-violet-900";
    case "ACTION_REQUIRED":
      return "bg-amber-500/15 text-amber-950";
    case "RESOLVED":
      return "bg-emerald-500/12 text-emerald-900";
    case "CLOSED":
      return "bg-slate-500/12 text-slate-700";
    default:
      return "bg-surface-muted text-muted";
  }
}

function severityTone(sev: string): string {
  return SEVERITIES.find((s) => s.id === sev)?.tone ?? "bg-surface-muted text-muted";
}

function studentInitials(first: string, last: string) {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

function StatCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3 shadow-[var(--shadow-card)]">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-2xl font-bold tabular-nums text-heading">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-muted">{sub}</p> : null}
    </div>
  );
}

export function TeacherDisciplineExperience() {
  const { get, post, patch } = useApi();
  const [tab, setTab] = useState<Tab>("report");
  const [sections, setSections] = useState<SectionRow[]>([]);
  const [sectionId, setSectionId] = useState("");
  const [studentQuery, setStudentQuery] = useState("");
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [studentProfileId, setStudentProfileId] = useState("");
  const [incidentDate, setIncidentDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [incidentTime, setIncidentTime] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]["id"]>("CLASSROOM_MISCONDUCT");
  const [severity, setSeverity] = useState<(typeof SEVERITIES)[number]["id"]>("MEDIUM");
  const [description, setDescription] = useState("");
  const [witnessInfo, setWitnessInfo] = useState("");
  const [rows, setRows] = useState<ComplaintRow[]>([]);
  const [classRows, setClassRows] = useState<ComplaintRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [listFilter, setListFilter] = useState("");
  const [classComment, setClassComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const loadLists = useCallback(() => {
    get<ComplaintRow[]>("/api/teacher/discipline")
      .then(setRows)
      .catch(() => setRows([]));
    get<ComplaintRow[]>("/api/teacher/discipline?scope=class-teacher")
      .then(setClassRows)
      .catch(() => setClassRows([]));
  }, [get]);

  useEffect(() => {
    get<SectionRow[]>("/api/teacher/discipline/sections")
      .then((s) => {
        setSections(s);
        if (s[0]) setSectionId((prev) => prev || s[0].id);
      })
      .catch((e) => setError(getApiErrorMessage(e)));
    loadLists();
  }, [get, loadLists]);

  useEffect(() => {
    if (!sectionId) {
      setStudents([]);
      return;
    }
    const q = studentQuery.trim();
    setLoadingStudents(true);
    const url = `/api/teacher/students?scope=teaching&sectionId=${sectionId}${q ? `&q=${encodeURIComponent(q)}` : ""}`;
    get<StudentRow[]>(url)
      .then(setStudents)
      .catch(() => setStudents([]))
      .finally(() => setLoadingStudents(false));
  }, [get, sectionId, studentQuery]);

  const selectedStudent = useMemo(
    () => students.find((s) => s.id === studentProfileId) ?? null,
    [students, studentProfileId]
  );

  const stats = useMemo(() => {
    const openMine = rows.filter((r) => OPEN_STATUSES.has(r.status)).length;
    const openClass = classRows.filter((r) => OPEN_STATUSES.has(r.status)).length;
    return {
      mine: rows.length,
      openMine,
      classInbox: classRows.length,
      openClass,
    };
  }, [rows, classRows]);

  const list = tab === "mine" ? rows : tab === "class" ? classRows : [];
  const filteredList = useMemo(() => {
    const q = listFilter.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (c) =>
        c.complaintNumber.toLowerCase().includes(q) ||
        `${c.student.firstName} ${c.student.lastName}`.toLowerCase().includes(q) ||
        c.student.studentId.toLowerCase().includes(q)
    );
  }, [list, listFilter]);

  const selectedComplaint = filteredList.find((r) => r.id === selectedId) ?? list.find((r) => r.id === selectedId) ?? null;

  useEffect(() => {
    if (selectedComplaint) setClassComment(selectedComplaint.classTeacherComment ?? "");
  }, [selectedComplaint]);

  useEffect(() => {
    setSelectedId(null);
    setListFilter("");
  }, [tab]);

  async function submitIncident() {
    if (!sectionId || !studentProfileId) {
      setError("Choose a class section and student before submitting.");
      return;
    }
    if (description.trim().length < 10) {
      setError("Please add a clear description (at least 10 characters).");
      return;
    }
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await post("/api/teacher/discipline", {
        sectionId,
        studentProfileId,
        incidentDate,
        incidentTime: incidentTime || undefined,
        category,
        severity,
        description,
        witnessInfo: witnessInfo || undefined,
      });
      setMessage("Incident submitted. The principal and class teacher can review it.");
      setDescription("");
      setWitnessInfo("");
      setStudentProfileId("");
      loadLists();
      setTab("mine");
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  async function saveClassComment() {
    if (!selectedId) return;
    setSaving(true);
    setError(null);
    try {
      await patch(`/api/teacher/discipline/${selectedId}/class-teacher`, {
        classTeacherComment: classComment,
      });
      setMessage("Class teacher note saved.");
      loadLists();
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: "report", label: "New report" },
    { id: "mine", label: "My reports", badge: stats.openMine || undefined },
    { id: "class", label: "Class inbox", badge: stats.openClass || undefined },
  ];

  return (
    <>
      <PanelAlerts error={error} message={message} messageTitle="Saved" />
      <PageHeader
        title={teacherNavLabel("/teacher/discipline")}
        description="Document incidents accurately. Reports are visible to the class teacher, principal, and the student concerned."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Reports filed by you" value={stats.mine} sub={stats.openMine ? `${stats.openMine} open` : "All resolved or closed"} />
        <StatCard label="Class teacher inbox" value={stats.classInbox} sub={classRows.length ? "Cases in your homeroom" : "No homeroom cases"} />
        <StatCard label="Sections you can report" value={sections.length} sub="Based on your teaching assignments" />
      </div>

      <nav
        className="mt-6 flex gap-1 rounded-xl border border-border bg-surface p-1 shadow-[var(--shadow-card)]"
        aria-label="Discipline views"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-sm font-medium transition-colors sm:px-4 ${
              tab === t.id
                ? "bg-brand text-white shadow-sm"
                : "text-muted hover:bg-surface-muted hover:text-heading"
            }`}
          >
            <span className="truncate">{t.label}</span>
            {t.badge != null && t.badge > 0 ? (
              <span
                className={`min-w-[1.25rem] rounded-full px-1.5 py-0.5 text-[0.625rem] font-bold tabular-nums ${
                  tab === t.id ? "bg-white/25 text-white" : "bg-brand/10 text-brand"
                }`}
              >
                {t.badge}
              </span>
            ) : null}
          </button>
        ))}
      </nav>

      {tab === "report" ? (
        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          <section className="space-y-5">
            <div className="card-panel overflow-hidden">
              <div className="border-b border-border bg-gradient-to-r from-brand/8 via-brand/4 to-transparent px-4 py-3 sm:px-5">
                <p className="form-section-title">Step 1 — Student</p>
                <p className="mt-1 text-sm text-muted">Select the class, then pick the student involved.</p>
              </div>
              <div className="form-shell space-y-4">
                <div>
                  <span className="mb-2 block text-sm font-medium text-heading">Class section</span>
                  <div className="flex flex-wrap gap-2">
                    {sections.length === 0 ? (
                      <p className="text-sm text-muted">No sections assigned for reporting.</p>
                    ) : (
                      sections.map((s) => {
                        const active = s.id === sectionId;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => {
                              setSectionId(s.id);
                              setStudentProfileId("");
                            }}
                            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                              active
                                ? "border-brand bg-brand text-white"
                                : "border-border bg-surface text-foreground hover:border-brand/40"
                            }`}
                          >
                            {s.class.name} · {s.name}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
                <label className="block text-sm">
                  <span className="font-medium text-heading">Search by name, ID, or roll</span>
                  <input
                    className="input-field mt-1.5 w-full"
                    value={studentQuery}
                    onChange={(e) => setStudentQuery(e.target.value)}
                    placeholder="Type to filter the list…"
                    disabled={!sectionId}
                  />
                </label>
                <div className="max-h-[min(22rem,50vh)] space-y-2 overflow-y-auto rounded-xl border border-border bg-[color-mix(in_srgb,var(--surface-muted)_35%,transparent)] p-2">
                  {loadingStudents ? (
                    <p className="py-8 text-center text-sm text-muted">Loading students…</p>
                  ) : students.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted">
                      {sectionId ? "No students match your search." : "Select a section first."}
                    </p>
                  ) : (
                    students.map((st) => {
                      const en = st.enrollments[0];
                      const active = st.id === studentProfileId;
                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => setStudentProfileId(st.id)}
                          className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                            active
                              ? "border-brand/50 bg-brand/5 ring-1 ring-brand/20"
                              : "border-transparent bg-surface hover:border-border"
                          }`}
                        >
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                              active ? "bg-brand text-white" : "bg-brand/10 text-brand"
                            }`}
                          >
                            {studentInitials(st.firstName, st.lastName)}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-medium text-heading">
                              {st.firstName} {st.lastName}
                            </span>
                            <span className="block truncate text-xs text-muted">
                              ID {st.studentId}
                              {en ? ` · Roll ${en.rollNumber}` : ""}
                            </span>
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {selectedStudent && (
              <div className="card-panel flex items-center gap-3 border-brand/20 bg-brand/[0.03] p-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
                  {studentInitials(selectedStudent.firstName, selectedStudent.lastName)}
                </span>
                <div>
                  <p className="font-semibold text-heading">
                    Reporting for {selectedStudent.firstName} {selectedStudent.lastName}
                  </p>
                  <p className="text-sm text-muted">ID {selectedStudent.studentId}</p>
                </div>
              </div>
            )}
          </section>

          <section className="card-panel overflow-hidden">
            <div className="border-b border-border bg-gradient-to-r from-brand/8 via-transparent to-transparent px-4 py-3 sm:px-5">
              <p className="form-section-title">Step 2 — Incident details</p>
              <p className="mt-1 text-sm text-muted">Use factual, specific language. Witness notes are optional.</p>
            </div>
            <div className="form-shell space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="font-medium text-heading">Date of incident</span>
                  <input
                    type="date"
                    className="input-field mt-1.5 w-full"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-heading">Time (optional)</span>
                  <input
                    type="time"
                    className="input-field mt-1.5 w-full"
                    value={incidentTime}
                    onChange={(e) => setIncidentTime(e.target.value)}
                  />
                </label>
              </div>

              <div>
                <span className="mb-2 block text-sm font-medium text-heading">Category</span>
                <div className="grid gap-2 sm:grid-cols-2">
                  {CATEGORIES.map((c) => {
                    const active = category === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCategory(c.id)}
                        className={`rounded-xl border px-3 py-2.5 text-left transition-colors ${
                          active
                            ? "border-brand bg-brand/5 ring-1 ring-brand/25"
                            : "border-border hover:border-brand/30"
                        }`}
                      >
                        <span className="block text-sm font-medium text-heading">{c.label}</span>
                        <span className="mt-0.5 block text-xs text-muted">{c.hint}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="mb-2 block text-sm font-medium text-heading">Severity</span>
                <div className="flex flex-wrap gap-2">
                  {SEVERITIES.map((s) => {
                    const active = severity === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSeverity(s.id)}
                        className={`rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ring-inset transition-transform ${
                          s.tone
                        } ${active ? "scale-[1.02] ring-2" : "opacity-80 hover:opacity-100"}`}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="block text-sm">
                <span className="font-medium text-heading">What happened?</span>
                <textarea
                  className="input-field mt-1.5 w-full min-h-[7rem]"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Include location, what you observed, and any immediate action taken…"
                />
                <span className="mt-1 block text-xs text-muted">{description.length} characters (min. 10)</span>
              </label>

              <label className="block text-sm">
                <span className="font-medium text-heading">Witnesses (optional)</span>
                <textarea
                  className="input-field mt-1.5 w-full"
                  rows={2}
                  value={witnessInfo}
                  onChange={(e) => setWitnessInfo(e.target.value)}
                  placeholder="Names or brief notes — follow school safeguarding policy"
                />
              </label>

              <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted">
                  Submitting records your name and the server time. Students cannot edit this record.
                </p>
                <button
                  type="button"
                  className="btn-primary shrink-0 px-6"
                  disabled={saving || !studentProfileId}
                  onClick={submitIncident}
                >
                  {saving ? "Submitting…" : "Submit incident report"}
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="mt-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">
              {tab === "mine"
                ? "Track status of reports you filed."
                : "Review incidents for students in your homeroom sections."}
            </p>
            <input
              className="input-field w-full sm:max-w-xs"
              value={listFilter}
              onChange={(e) => setListFilter(e.target.value)}
              placeholder="Search reference or student…"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div className={`space-y-2 ${selectedId && selectedComplaint ? "hidden lg:block" : ""}`}>
              {filteredList.length === 0 ? (
                <div className="empty-state">
                  {list.length === 0 ? "No complaints in this view yet." : "No matches for your search."}
                </div>
              ) : (
                filteredList.map((c) => {
                  const active = c.id === selectedId;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedId(c.id)}
                      className={`w-full rounded-xl border px-4 py-3 text-left transition-shadow ${
                        active
                          ? "border-brand/45 bg-brand/[0.04] shadow-[var(--shadow-card-hover)]"
                          : "border-border bg-surface hover:border-brand/25 hover:shadow-[var(--shadow-card)]"
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <span className="font-mono text-sm font-semibold text-brand">{c.complaintNumber}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide ${statusTone(c.status)}`}>
                          {formatStatus(c.status)}
                        </span>
                      </div>
                      <p className="mt-1.5 font-medium text-heading">
                        {c.student.firstName} {c.student.lastName}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">
                        {c.section.class.name}-{c.section.name} · {labelCategory(c.category)} ·{" "}
                        {c.incidentDate.slice(0, 10)}
                      </p>
                      <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[0.625rem] font-semibold ring-1 ring-inset ${severityTone(c.severity)}`}>
                        {c.severity}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            <div className={!selectedComplaint ? "hidden lg:block" : ""}>
              {!selectedComplaint ? (
                <div className="empty-state lg:min-h-[16rem] lg:flex lg:items-center lg:justify-center">
                  Select a report to read details
                  {tab === "class" ? " and add a class teacher note" : ""}.
                </div>
              ) : (
                <article className="card-panel overflow-hidden">
                  <div className="border-b border-border bg-surface-muted/50 px-4 py-4 sm:px-5">
                    <button
                      type="button"
                      className="mb-3 text-sm font-medium text-brand lg:hidden"
                      onClick={() => setSelectedId(null)}
                    >
                      ← Back to list
                    </button>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-lg font-bold text-brand">{selectedComplaint.complaintNumber}</p>
                        <p className="mt-1 text-sm text-muted">
                          Filed {new Date(selectedComplaint.incidentDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                          {selectedComplaint.incidentTime ? ` at ${selectedComplaint.incidentTime}` : ""}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusTone(selectedComplaint.status)}`}>
                          {formatStatus(selectedComplaint.status)}
                        </span>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${severityTone(selectedComplaint.severity)}`}>
                          {selectedComplaint.severity}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="form-shell space-y-4 text-sm">
                    <dl className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Student</dt>
                        <dd className="mt-0.5 font-medium text-heading">
                          {selectedComplaint.student.firstName} {selectedComplaint.student.lastName}
                          <span className="block text-xs font-normal text-muted">{selectedComplaint.student.studentId}</span>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Class</dt>
                        <dd className="mt-0.5 font-medium text-heading">
                          {selectedComplaint.section.class.name}-{selectedComplaint.section.name}
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Category</dt>
                        <dd className="mt-0.5 text-heading">{labelCategory(selectedComplaint.category)}</dd>
                      </div>
                    </dl>

                    <div className="rounded-xl border border-border bg-[color-mix(in_srgb,var(--surface-muted)_40%,transparent)] p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted">Incident description</p>
                      <p className="mt-2 whitespace-pre-wrap leading-relaxed text-foreground">
                        {selectedComplaint.description}
                      </p>
                    </div>

                    <p className="text-xs text-muted">
                      Reported by {selectedComplaint.reportingTeacher.firstName}{" "}
                      {selectedComplaint.reportingTeacher.lastName} ({selectedComplaint.reportingTeacher.employeeId})
                    </p>

                    {selectedComplaint.classTeacherComment && tab === "mine" && (
                      <div className="rounded-xl border border-brand/15 bg-brand/[0.03] p-4">
                        <p className="text-xs font-semibold text-brand">Class teacher note</p>
                        <p className="mt-1 whitespace-pre-wrap">{selectedComplaint.classTeacherComment}</p>
                      </div>
                    )}

                    {tab === "class" && (
                      <div className="space-y-3 border-t border-border pt-4">
                        <label className="block text-sm">
                          <span className="font-medium text-heading">Class teacher comment</span>
                          <textarea
                            className="input-field mt-1.5 w-full"
                            rows={4}
                            value={classComment}
                            onChange={(e) => setClassComment(e.target.value)}
                            placeholder="Add context visible to the principal and student where policy allows…"
                          />
                        </label>
                        <button
                          type="button"
                          className="btn-primary"
                          disabled={saving || !classComment.trim()}
                          onClick={saveClassComment}
                        >
                          {saving ? "Saving…" : "Save class teacher note"}
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
