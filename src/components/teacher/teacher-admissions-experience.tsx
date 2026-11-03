"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import { teacherNavLabel } from "@/config/nav";
import { StudentLoginCredentialsCard } from "@/components/student-login-credentials-card";
import { getApiErrorMessage } from "@/lib/api";
import { planStudentLoginEmailFromApplication } from "@/lib/student-login-preview";
import { useApi } from "@/lib/use-api";

export type TeacherAdmissionApplication = {
  id: string;
  firstName: string;
  lastName: string;
  status: string;
  proposedRollNumber?: string;
  proposedEmail?: string | null;
  proposedLoginPhone?: string | null;
  correctionMessage?: string;
  createdAt: string;
  generatedLoginEmail?: string | null;
  generatedStudentId?: string | null;
  generatedRollNumber?: string | null;
  generatedAdmissionNumber?: string | null;
  generatedTemporaryPassword?: string | null;
};

type StatusFilter = "all" | "PENDING" | "RETURNED" | "APPROVED" | "REJECTED";

const STATUS_META: Record<
  string,
  { label: string; tone: string; hint: string }
> = {
  PENDING: {
    label: "Pending",
    tone: "bg-amber-500/15 text-amber-950 ring-amber-500/25",
    hint: "Waiting for principal review",
  },
  RETURNED: {
    label: "Returned",
    tone: "bg-violet-500/12 text-violet-900 ring-violet-500/20",
    hint: "Principal requested corrections — update and resubmit",
  },
  APPROVED: {
    label: "Approved",
    tone: "bg-emerald-500/12 text-emerald-900 ring-emerald-500/20",
    hint: "Student enrolled — share portal login details",
  },
  REJECTED: {
    label: "Rejected",
    tone: "bg-red-500/12 text-red-900 ring-red-500/25",
    hint: "Not approved — contact the office",
  },
};

export function credentialsForAdmissionApp(a: TeacherAdmissionApplication) {
  if (a.status === "APPROVED" && a.generatedLoginEmail) {
    return {
      loginEmail: a.generatedLoginEmail,
      loginPassword: a.generatedTemporaryPassword,
      studentLoginId: a.generatedStudentId,
      rollNumber: a.generatedRollNumber,
      admissionNumber: a.generatedAdmissionNumber,
      pending: false as const,
    };
  }
  if (a.status === "PENDING" || a.status === "RETURNED") {
    const email = planStudentLoginEmailFromApplication(a);
    if (!email) return null;
    return { loginEmail: email, pending: true as const };
  }
  return null;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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

function studentInitials(first: string, last: string) {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

export function TeacherAdmissionsExperience() {
  const { get } = useApi();
  const [items, setItems] = useState<TeacherAdmissionApplication[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    get<TeacherAdmissionApplication[]>("/api/teacher/admissions")
      .then(setItems)
      .catch((e) => {
        setItems([]);
        setError(getApiErrorMessage(e));
      })
      .finally(() => setLoading(false));
  }, [get]);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => {
    const pending = items.filter((a) => a.status === "PENDING").length;
    const returned = items.filter((a) => a.status === "RETURNED").length;
    const approved = items.filter((a) => a.status === "APPROVED").length;
    return { total: items.length, pending, returned, approved };
  }, [items]);

  const filtered = useMemo(() => {
    let list = items;
    if (statusFilter !== "all") list = list.filter((a) => a.status === statusFilter);
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (a) =>
        `${a.firstName} ${a.lastName}`.toLowerCase().includes(q) ||
        (a.generatedLoginEmail ?? "").toLowerCase().includes(q) ||
        (a.proposedRollNumber ?? "").toLowerCase().includes(q)
    );
  }, [items, statusFilter, search]);

  const selected =
    filtered.find((a) => a.id === selectedId) ?? items.find((a) => a.id === selectedId) ?? null;
  const selectedCreds = selected ? credentialsForAdmissionApp(selected) : null;
  const selectedMeta = selected ? STATUS_META[selected.status] ?? STATUS_META.PENDING : null;

  const filters: { id: StatusFilter; label: string; count?: number }[] = [
    { id: "all", label: "All", count: stats.total },
    { id: "PENDING", label: "Pending", count: stats.pending },
    { id: "RETURNED", label: "Returned", count: stats.returned },
    { id: "APPROVED", label: "Approved", count: stats.approved },
  ];

  return (
    <>
      <PanelAlerts error={error} />
      <PageHeader
        title={teacherNavLabel("/teacher/admissions")}
        description="Register new students for principal approval. Approved applications include portal login details to share with families."
        actions={
          <Link href="/teacher/admissions/new" className="btn-primary text-sm shadow-sm">
            Add student
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <StatCard label="Applications" value={loading ? "—" : stats.total} />
        <StatCard
          label="Pending review"
          value={loading ? "—" : stats.pending}
          sub={stats.pending ? "With principal" : "None waiting"}
        />
        <StatCard label="Returned" value={loading ? "—" : stats.returned} sub="Needs your updates" />
        <StatCard label="Approved" value={loading ? "—" : stats.approved} sub="Enrolled students" />
      </div>

      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                setStatusFilter(f.id);
                setSelectedId(null);
              }}
              className={`rounded-full border px-3 py-1 text-sm font-medium ${
                statusFilter === f.id
                  ? "border-brand bg-brand text-white"
                  : "border-border text-muted hover:border-brand/30"
              }`}
            >
              {f.label}
              {f.count != null && f.count > 0 ? ` (${f.count})` : ""}
            </button>
          ))}
        </div>
        <input
          className="input-field w-full lg:max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, roll, or email…"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className={`space-y-2 ${selected ? "hidden lg:block" : ""}`}>
          {loading ? (
            <p className="empty-state">Loading applications…</p>
          ) : filtered.length === 0 ? (
            <div className="empty-state space-y-3">
              <p>
                {items.length === 0
                  ? "No applications yet."
                  : "No applications match your filter or search."}
              </p>
              {items.length === 0 && (
                <Link href="/teacher/admissions/new" className="btn-primary inline-flex text-sm">
                  Add student
                </Link>
              )}
            </div>
          ) : (
            filtered.map((a) => {
              const active = a.id === selectedId;
              const meta = STATUS_META[a.status] ?? STATUS_META.PENDING;
              const creds = credentialsForAdmissionApp(a);
              const roll = a.generatedRollNumber ?? a.proposedRollNumber ?? "—";
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setSelectedId(a.id)}
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
                    {studentInitials(a.firstName, a.lastName)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <span className="font-semibold text-heading">
                        {a.firstName} {a.lastName}
                      </span>
                      <span className="text-xs tabular-nums text-muted">{fmtDate(a.createdAt)}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted">
                      Roll {roll}
                      {creds?.loginEmail ? ` · ${creds.loginEmail}` : ""}
                    </p>
                    <span
                      className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide ring-1 ring-inset ${meta.tone}`}
                    >
                      {meta.label}
                    </span>
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className={!selected ? "hidden lg:block" : ""}>
          {!selected ? (
            <div className="empty-state lg:min-h-[18rem] lg:flex lg:flex-col lg:items-center lg:justify-center">
              <p className="font-medium text-heading">Select an application</p>
              <p className="mt-1 max-w-sm text-sm text-muted">
                View status, principal notes, and student login details when approved.
              </p>
              <Link href="/teacher/admissions/new" className="btn-primary mt-4 text-sm">
                Add student
              </Link>
            </div>
          ) : (
            <article className="card-panel overflow-hidden">
              <div className="border-b border-border bg-gradient-to-r from-brand/8 via-transparent to-transparent px-4 py-4 sm:px-5">
                <button
                  type="button"
                  className="mb-3 text-sm font-medium text-brand lg:hidden"
                  onClick={() => setSelectedId(null)}
                >
                  ← Back to list
                </button>
                <div className="flex gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
                    {studentInitials(selected.firstName, selected.lastName)}
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-heading">
                      {selected.firstName} {selected.lastName}
                    </h2>
                    <p className="mt-0.5 text-sm text-muted">Submitted {fmtDate(selected.createdAt)}</p>
                    {selectedMeta && (
                      <span
                        className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide ring-1 ring-inset ${selectedMeta.tone}`}
                      >
                        {selectedMeta.label}
                      </span>
                    )}
                  </div>
                </div>
                {selectedMeta && (
                  <p className="mt-3 text-sm text-muted">{selectedMeta.hint}</p>
                )}
              </div>

              <div className="form-shell space-y-4">
                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Proposed roll</dt>
                    <dd className="mt-0.5 font-medium text-heading">
                      {selected.generatedRollNumber ?? selected.proposedRollNumber ?? "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Status</dt>
                    <dd className="mt-0.5 font-medium text-heading">{selectedMeta?.label ?? selected.status}</dd>
                  </div>
                </dl>

                {selected.correctionMessage && (
                  <div className="rounded-xl border border-violet-500/25 bg-violet-500/8 p-4 text-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-violet-900">
                      Principal message
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-foreground">{selected.correctionMessage}</p>
                  </div>
                )}

                {selectedCreds ? (
                  <StudentLoginCredentialsCard
                    loginEmail={selectedCreds.loginEmail}
                    loginPassword={selectedCreds.loginPassword}
                    studentLoginId={selectedCreds.studentLoginId}
                    rollNumber={selectedCreds.rollNumber}
                    admissionNumber={selectedCreds.admissionNumber}
                    pendingApproval={selectedCreds.pending}
                  />
                ) : selected.status === "REJECTED" ? (
                  <p className="text-sm text-muted">This application was not approved. Contact the office for next steps.</p>
                ) : null}

                {(selected.status === "RETURNED" || selected.status === "PENDING") && (
                  <Link href="/teacher/admissions/new" className="btn-secondary inline-flex text-sm">
                    Submit another student
                  </Link>
                )}
              </div>
            </article>
          )}
        </div>
      </div>
    </>
  );
}
