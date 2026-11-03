"use client";

import type { FormEvent } from "react";
import {
  MobileEmptyState,
  MobileFilterChips,
  MobilePageHero,
  statusTone,
} from "@/components/mobile/mobile-primitives";

export type AdmissionApplication = {
  id: string;
  firstName: string;
  lastName: string;
  status: string;
  phone?: string | null;
  guardianName?: string | null;
  guardianPhone?: string | null;
  proposedRollNumber?: string | null;
  createdAt: string;
  submittedBy?: { firstName: string; lastName: string; employeeId: string };
};

const FILTERS = [
  { value: "PENDING", label: "Pending" },
  { value: "RETURNED", label: "Returned" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "", label: "All" },
] as const;

export function PrincipalAdmissionsMobile({
  filter,
  onFilterChange,
  items,
  loading,
  selected,
  onSelect,
  rollNumber,
  onRollChange,
  rejectReason,
  onRejectReasonChange,
  returnMessage,
  onReturnMessageChange,
  busy,
  onApprove,
  onReject,
  onReturn,
}: {
  filter: string;
  onFilterChange: (v: string) => void;
  items: AdmissionApplication[];
  loading: boolean;
  selected: AdmissionApplication | null;
  onSelect: (app: AdmissionApplication | null) => void;
  rollNumber: string;
  onRollChange: (v: string) => void;
  rejectReason: string;
  onRejectReasonChange: (v: string) => void;
  returnMessage: string;
  onReturnMessageChange: (v: string) => void;
  busy: boolean;
  onApprove: () => void;
  onReject: (e: FormEvent) => void;
  onReturn: (e: FormEvent) => void;
}) {
  const pendingCount = filter === "PENDING" ? items.length : null;
  const actionable =
    selected && (selected.status === "PENDING" || selected.status === "RETURNED");

  return (
    <div className="space-y-4">
      <MobilePageHero
        kicker="Principal"
        title="Admissions"
        subtitle={
          loading
            ? "Loading applications…"
            : pendingCount != null
              ? `${pendingCount} pending to review`
              : `${items.length} application${items.length === 1 ? "" : "s"}`
        }
      />

      <MobileFilterChips
        options={FILTERS.map((f) => ({ value: f.value, label: f.label }))}
        value={filter}
        onChange={onFilterChange}
      />

      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : items.length === 0 ? (
        <MobileEmptyState
          message={
            filter === "PENDING"
              ? "No pending admissions. Teachers submit from Teacher → Admissions."
              : "No applications in this filter."
          }
        />
      ) : (
        <ul className="space-y-2">
          {items.map((a) => {
            const active = selected?.id === a.id;
            return (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => onSelect(active ? null : a)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left shadow-sm transition ${
                    active ? "border-brand bg-brand/5 ring-2 ring-brand/20" : "border-border bg-surface"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-heading">{a.firstName} {a.lastName}</p>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold ${statusTone(a.status)}`}>
                      {a.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {a.submittedBy
                      ? `By ${a.submittedBy.firstName} ${a.submittedBy.lastName}`
                      : "—"}
                    {a.guardianPhone || a.phone ? ` · ${a.guardianPhone ?? a.phone}` : ""}
                  </p>
                  {a.proposedRollNumber && (
                    <p className="mt-1 text-xs text-brand">Proposed roll {a.proposedRollNumber}</p>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {selected && (
        <section className="rounded-2xl border border-border bg-surface p-4 shadow-sm space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-heading">
              {selected.firstName} {selected.lastName}
            </h3>
            <p className="text-xs text-muted">
              Submitted {new Date(selected.createdAt).toLocaleString()}
            </p>
          </div>

          {actionable && (
            <div className="space-y-3 border-t border-border pt-3">
              <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
                Roll number
                <input
                  className="input-field mt-1"
                  value={rollNumber}
                  onChange={(e) => onRollChange(e.target.value)}
                  placeholder="Required to approve"
                />
              </label>
              <button
                type="button"
                disabled={busy || !rollNumber.trim()}
                onClick={onApprove}
                className="btn-primary w-full !rounded-xl disabled:opacity-50"
              >
                {busy ? "Working…" : "Approve & enroll"}
              </button>
              <form onSubmit={onReturn} className="space-y-2">
                <input
                  className="input-field"
                  value={returnMessage}
                  onChange={(e) => onReturnMessageChange(e.target.value)}
                  placeholder="Return note for teacher"
                />
                <button type="submit" disabled={busy} className="btn-secondary w-full !rounded-xl text-sm">
                  Return for correction
                </button>
              </form>
              <form onSubmit={onReject} className="space-y-2">
                <input
                  className="input-field"
                  value={rejectReason}
                  onChange={(e) => onRejectReasonChange(e.target.value)}
                  placeholder="Rejection reason"
                />
                <button type="submit" disabled={busy} className="btn-secondary w-full !rounded-xl text-sm">
                  Reject
                </button>
              </form>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
