"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { FormField } from "@/components/form-field";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import { principalNavLabel } from "@/config/nav";
import { StudentLoginCredentialsCard } from "@/components/student-login-credentials-card";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

export type PrincipalAdmissionApplication = {
  id: string;
  firstName: string;
  lastName: string;
  status: string;
  phone?: string | null;
  guardianName?: string | null;
  guardianPhone?: string | null;
  guardianEmail?: string | null;
  fatherName?: string | null;
  motherName?: string | null;
  proposedRollNumber?: string | null;
  proposedEmail?: string | null;
  previousSchool?: string | null;
  rejectionReason?: string | null;
  correctionMessage?: string | null;
  createdAt: string;
  submittedBy?: { firstName: string; lastName: string; employeeId: string };
  documents?: { title: string; documentType?: string | null; fileUrl: string }[];
};

type StatusFilter = "all" | "PENDING" | "RETURNED" | "APPROVED" | "REJECTED";

const STATUS_META: Record<string, { label: string; tone: string; hint: string }> = {
  PENDING: {
    label: "Pending",
    tone: "bg-amber-500/15 text-amber-950 ring-amber-500/25",
    hint: "Review details, assign roll number, then approve or return to teacher",
  },
  RETURNED: {
    label: "Returned",
    tone: "bg-violet-500/12 text-violet-900 ring-violet-500/20",
    hint: "Waiting for teacher corrections — you can still approve when ready",
  },
  APPROVED: {
    label: "Approved",
    tone: "bg-emerald-500/12 text-emerald-900 ring-emerald-500/20",
    hint: "Student enrolled — credentials were issued at approval",
  },
  REJECTED: {
    label: "Rejected",
    tone: "bg-red-500/12 text-red-900 ring-red-500/25",
    hint: "Application was not approved",
  },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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

export function PrincipalAdmissionsExperience() {
  const { loading: authLoading } = useAuth();
  const { get, post, isReady } = useApi();

  const [items, setItems] = useState<PrincipalAdmissionApplication[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("PENDING");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [rollNumber, setRollNumber] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [returnMessage, setReturnMessage] = useState("");
  const [approvedCredentials, setApprovedCredentials] = useState<{
    loginEmail: string;
    loginPassword?: string;
    studentLoginId?: string;
    rollNumber?: string;
    admissionNumber?: string;
  } | null>(null);

  const load = useCallback(() => {
    if (!isReady) {
      setItems([]);
      setListLoading(false);
      return;
    }
    setListLoading(true);
    setError(null);
    get<PrincipalAdmissionApplication[]>("/api/principal/admissions")
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((e) => {
        setItems([]);
        setError(getApiErrorMessage(e));
      })
      .finally(() => setListLoading(false));
  }, [get, isReady]);

  useEffect(() => {
    if (authLoading) return;
    load();
  }, [authLoading, load]);

  const stats = useMemo(() => {
    const pending = items.filter((a) => a.status === "PENDING").length;
    const returned = items.filter((a) => a.status === "RETURNED").length;
    const approved = items.filter((a) => a.status === "APPROVED").length;
    const rejected = items.filter((a) => a.status === "REJECTED").length;
    return { total: items.length, pending, returned, approved, rejected };
  }, [items]);

  const filtered = useMemo(() => {
    let list = items;
    if (statusFilter !== "all") list = list.filter((a) => a.status === statusFilter);
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((a) => {
      const hay = [
        a.firstName,
        a.lastName,
        a.guardianName,
        a.guardianPhone,
        a.phone,
        a.proposedRollNumber,
        a.proposedEmail,
        a.submittedBy?.firstName,
        a.submittedBy?.lastName,
        a.submittedBy?.employeeId,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [items, statusFilter, search]);

  const selected =
    filtered.find((a) => a.id === selectedId) ?? items.find((a) => a.id === selectedId) ?? null;

  useEffect(() => {
    if (!selected) {
      setRollNumber("");
      setRejectReason("");
      setReturnMessage("");
      return;
    }
    setRollNumber(selected.proposedRollNumber ?? "");
    setRejectReason("");
    setReturnMessage("");
  }, [selected?.id]);

  const actionable =
    selected && (selected.status === "PENDING" || selected.status === "RETURNED");

  const selectedMeta = selected ? STATUS_META[selected.status] ?? STATUS_META.PENDING : null;

  const filters: { id: StatusFilter; label: string; count?: number }[] = [
    { id: "PENDING", label: "Pending", count: stats.pending },
    { id: "RETURNED", label: "Returned", count: stats.returned },
    { id: "APPROVED", label: "Approved", count: stats.approved },
    { id: "REJECTED", label: "Rejected", count: stats.rejected },
    { id: "all", label: "All", count: stats.total },
  ];

  async function approve() {
    if (!selected) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await post<{
        loginEmail: string;
        studentLoginId?: string;
        admissionNumber?: string;
        rollNumber?: string;
        temporaryPassword?: string;
      }>(`/api/principal/admissions/${selected.id}/approve`, {
        rollNumber: rollNumber.trim() || undefined,
      });
      setApprovedCredentials({
        loginEmail: res.loginEmail,
        loginPassword: res.temporaryPassword,
        studentLoginId: res.studentLoginId,
        rollNumber: res.rollNumber,
        admissionNumber: res.admissionNumber,
      });
      setMessage("Student enrolled. Share the portal login below with the family.");
      setSelectedId(null);
      load();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function reject(e: FormEvent) {
    e.preventDefault();
    if (!selected || rejectReason.trim().length < 3) {
      setError("Enter a rejection reason (at least 3 characters).");
      return;
    }
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await post(`/api/principal/admissions/${selected.id}/reject`, {
        reason: rejectReason.trim(),
      });
      setMessage("Application rejected.");
      setSelectedId(null);
      load();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function returnForCorrection(e: FormEvent) {
    e.preventDefault();
    if (!selected || !returnMessage.trim()) {
      setError("Enter what the teacher should correct.");
      return;
    }
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await post(`/api/principal/admissions/${selected.id}/return`, {
        message: returnMessage.trim(),
      });
      setMessage("Returned to teacher for correction.");
      setSelectedId(null);
      load();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  const reviewPanel = selected ? (
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
            <p className="mt-0.5 text-sm text-muted">
              Submitted {fmtDate(selected.createdAt)}
              {selected.submittedBy &&
                ` · ${selected.submittedBy.firstName} ${selected.submittedBy.lastName} (${selected.submittedBy.employeeId})`}
            </p>
            {selectedMeta && (
              <span
                className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide ring-1 ring-inset ${selectedMeta.tone}`}
              >
                {selectedMeta.label}
              </span>
            )}
          </div>
        </div>
        {selectedMeta && <p className="mt-3 text-sm text-muted">{selectedMeta.hint}</p>}
      </div>

      <div className="form-shell space-y-4">
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Proposed email</dt>
            <dd className="mt-0.5 font-medium text-heading">{selected.proposedEmail ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Proposed roll</dt>
            <dd className="mt-0.5 font-medium text-heading">{selected.proposedRollNumber ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Father</dt>
            <dd className="mt-0.5 font-medium text-heading">{selected.fatherName ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Mother</dt>
            <dd className="mt-0.5 font-medium text-heading">{selected.motherName ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Guardian</dt>
            <dd className="mt-0.5 font-medium text-heading">{selected.guardianName ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Guardian phone</dt>
            <dd className="mt-0.5 font-medium text-heading">{selected.guardianPhone ?? selected.phone ?? "—"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Previous school</dt>
            <dd className="mt-0.5 font-medium text-heading">{selected.previousSchool ?? "—"}</dd>
          </div>
        </dl>

        {selected.correctionMessage && (
          <div className="rounded-xl border border-violet-500/25 bg-violet-500/8 p-4 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-900">Earlier return note</p>
            <p className="mt-2 whitespace-pre-wrap text-foreground">{selected.correctionMessage}</p>
          </div>
        )}
        {selected.rejectionReason && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/8 p-4 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-red-900">Rejection reason</p>
            <p className="mt-2 whitespace-pre-wrap text-foreground">{selected.rejectionReason}</p>
          </div>
        )}
        {(selected.documents?.length ?? 0) > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Documents</p>
            <ul className="mt-2 space-y-1 text-sm text-heading">
              {selected.documents!.map((d, i) => (
                <li key={i}>
                  {d.title}
                  {d.documentType ? ` (${d.documentType})` : ""}
                </li>
              ))}
            </ul>
          </div>
        )}

        {actionable && (
          <div className="space-y-4 border-t border-border pt-4">
            <FormField label="Roll number for enrollment">
              <input
                className="input-field max-w-xs"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="Required to approve"
              />
            </FormField>
            <button
              type="button"
              disabled={busy || !rollNumber.trim()}
              onClick={approve}
              className="btn-primary text-sm disabled:opacity-50"
            >
              {busy ? "Working…" : "Approve & enroll"}
            </button>
            <form onSubmit={returnForCorrection} className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <FormField label="Return for correction" className="flex-1">
                <input
                  className="input-field"
                  value={returnMessage}
                  onChange={(e) => setReturnMessage(e.target.value)}
                  placeholder="What should the teacher fix?"
                />
              </FormField>
              <button type="submit" disabled={busy} className="btn-secondary text-sm disabled:opacity-50">
                Return
              </button>
            </form>
            <form onSubmit={reject} className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <FormField label="Reject with reason" className="flex-1">
                <input
                  className="input-field"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Reason (min 3 characters)"
                />
              </FormField>
              <button type="submit" disabled={busy} className="btn-secondary text-sm disabled:opacity-50">
                Reject
              </button>
            </form>
          </div>
        )}
      </div>
    </article>
  ) : null;

  return (
    <>
      <PanelAlerts error={error} message={message} messageTitle="Admissions" />

      {approvedCredentials && (
        <StudentLoginCredentialsCard
          loginEmail={approvedCredentials.loginEmail}
          loginPassword={approvedCredentials.loginPassword}
          studentLoginId={approvedCredentials.studentLoginId}
          rollNumber={approvedCredentials.rollNumber}
          admissionNumber={approvedCredentials.admissionNumber}
          note="Give these details to the submitting teacher and the student."
        />
      )}

      <PageHeader
        title={principalNavLabel("/principal/admissions")}
        description="Review teacher-submitted applications, enroll students, and issue portal logins."
      />

      <section
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand-light px-5 py-6 text-white shadow-[var(--shadow-card)]"
        aria-label="Admissions summary"
      >
        <div className="pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-full bg-brand-gold/25 blur-2xl" />
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">Admissions queue</p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
          {listLoading ? "Loading…" : `${stats.pending} pending review`}
        </h2>
        <p className="mt-2 text-sm text-white/85">
          Teachers submit from Teacher → Admissions · assign roll number before you approve
        </p>
      </section>

      <div className="grid gap-3 sm:grid-cols-4">
        <StatCard label="Pending" value={listLoading ? "—" : stats.pending} sub="Needs your decision" />
        <StatCard label="Returned" value={listLoading ? "—" : stats.returned} sub="With teachers" />
        <StatCard label="Approved" value={listLoading ? "—" : stats.approved} sub="Enrolled" />
        <StatCard label="Rejected" value={listLoading ? "—" : stats.rejected} />
      </div>

      <div className="card-panel form-shell space-y-4">
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
          type="search"
          className="input-field w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search student, guardian, teacher, roll…"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className={`space-y-2 ${selected ? "hidden lg:block" : ""}`}>
          {listLoading ? (
            <p className="empty-state">Loading applications…</p>
          ) : filtered.length === 0 ? (
            <p className="empty-state">
              {statusFilter === "PENDING"
                ? "No pending admissions. Teachers submit applications from Teacher → Admissions."
                : "No applications match your filter or search."}
            </p>
          ) : (
            filtered.map((a) => {
              const active = a.id === selectedId;
              const meta = STATUS_META[a.status] ?? STATUS_META.PENDING;
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
                      {a.submittedBy
                        ? `${a.submittedBy.firstName} ${a.submittedBy.lastName}`
                        : "—"}
                      {a.proposedRollNumber ? ` · Roll ${a.proposedRollNumber}` : ""}
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
                Review guardian details, documents, and approve, return, or reject.
              </p>
            </div>
          ) : (
            reviewPanel
          )}
        </div>
      </div>
    </>
  );
}
