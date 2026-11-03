"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { MobileEmptyState } from "@/components/mobile/mobile-primitives";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import { studentNavLabel } from "@/config/nav";
import {
  StudentExamPicker,
  StudentReportCardDetail,
  StudentReportCardDetailView,
  StudentReportCardSummary,
} from "@/components/student/student-report-cards-shared";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";
import { useMediaQuery } from "@/lib/use-media-query";

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-2.5 shadow-[var(--shadow-card)] sm:px-4 sm:py-3">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-xl font-bold tabular-nums text-heading sm:text-2xl">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-muted">{sub}</p> : null}
    </div>
  );
}

function ReportCardsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-32 animate-pulse rounded-2xl bg-surface-muted" />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-surface-muted" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-2xl bg-surface-muted" />
    </div>
  );
}

export function StudentReportCardsExperience() {
  const { loading: authLoading } = useAuth();
  const { get, isReady } = useApi();
  const isWide = useMediaQuery("(min-width: 1024px)");

  const [summaries, setSummaries] = useState<StudentReportCardSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [card, setCard] = useState<StudentReportCardDetail | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingCard, setLoadingCard] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadList = useCallback(() => {
    if (!isReady) {
      setLoadingList(false);
      return;
    }
    setLoadingList(true);
    setError(null);
    get<StudentReportCardSummary[]>("/api/student/report-cards")
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setSummaries(list);
        setSelectedId((prev) =>
          prev && list.some((s) => s.examinationId === prev) ? prev : list[0]?.examinationId ?? null
        );
      })
      .catch((e) => {
        setSummaries([]);
        setError(getApiErrorMessage(e));
      })
      .finally(() => setLoadingList(false));
  }, [get, isReady]);

  useEffect(() => {
    if (authLoading) return;
    loadList();
  }, [authLoading, loadList]);

  useEffect(() => {
    if (!isReady || !selectedId) {
      setCard(null);
      return;
    }
    setLoadingCard(true);
    get<StudentReportCardDetail>(`/api/student/report-cards/${selectedId}`)
      .then(setCard)
      .catch((e) => {
        setCard(null);
        setError(getApiErrorMessage(e));
      })
      .finally(() => setLoadingCard(false));
  }, [get, isReady, selectedId]);

  const selectedSummary = useMemo(
    () => summaries.find((s) => s.examinationId === selectedId) ?? null,
    [summaries, selectedId]
  );

  const latestPct = summaries[0]?.percentage;
  const subjectsMarked = selectedSummary?.subjectsWithMarks ?? summaries[0]?.subjectsWithMarks ?? 0;

  return (
    <>
      <PanelAlerts error={error} />
      <PageHeader
        title={studentNavLabel("/student/report-cards")}
        description="Published examination results with attendance summary."
        actions={
          <Link href="/student" className="btn-secondary shrink-0 text-sm">
            Dashboard
          </Link>
        }
      />

      {loadingList && summaries.length === 0 ? (
        <ReportCardsSkeleton />
      ) : summaries.length === 0 ? (
        <MobileEmptyState message="No published report cards yet. Your class teacher will publish results after marks are finalized." />
      ) : (
        <div className="space-y-6">
          <section
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand-light px-5 py-6 text-white shadow-[var(--shadow-card)]"
            aria-label="Report cards summary"
          >
            <div className="pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-full bg-brand-gold/25 blur-2xl" />
            <div className="relative flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">
                  Published results
                </p>
                <h2 className="mt-0.5 text-xl font-bold tracking-tight sm:text-2xl">
                  {selectedSummary?.name ?? summaries[0]?.name ?? "Report cards"}
                </h2>
                <p className="mt-1 text-sm text-white/85">
                  {summaries.length} examination{summaries.length === 1 ? "" : "s"} available to view and print.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {card && !loadingCard && card.summary.overallPass && (
                  <span className="rounded-full bg-emerald-500/25 px-3 py-1 text-xs font-bold text-white">
                    Overall pass
                  </span>
                )}
                {(card?.summary.percentage ?? selectedSummary?.percentage ?? latestPct) != null && (
                  <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-bold tabular-nums">
                    {card?.summary.percentage ?? selectedSummary?.percentage ?? latestPct}% aggregate
                  </span>
                )}
              </div>
            </div>
          </section>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            <StatCard label="Published" value={summaries.length} sub="Examinations" />
            <StatCard
              label="Overall %"
              value={
                card?.summary.percentage != null
                  ? `${card.summary.percentage}%`
                  : selectedSummary?.percentage != null
                    ? `${selectedSummary.percentage}%`
                    : "—"
              }
              sub="Selected exam"
            />
            <StatCard label="Subjects" value={subjectsMarked} sub="With marks" />
            <StatCard
              label="Attendance"
              value={card?.attendance.percentage != null ? `${card.attendance.percentage}%` : "—"}
              sub={card?.attendance.daysRecorded ? `${card.attendance.daysRecorded} days` : "Exam period"}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,17rem)_1fr] lg:items-start">
            <section className="card-panel lg:sticky lg:top-4" aria-label="Published examinations">
              <p className="form-section-title mb-3">Examinations</p>
              {isWide ? (
                <StudentExamPicker
                  summaries={summaries}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  layout="stack"
                />
              ) : (
                <StudentExamPicker
                  summaries={summaries}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  layout="scroll"
                />
              )}
            </section>

            <section className="min-w-0" aria-label="Report card detail">
              {!selectedId ? (
                <p className="text-sm text-muted">Select an examination to view your report card.</p>
              ) : loadingCard ? (
                <p className="text-sm text-muted py-8 text-center">Loading report card…</p>
              ) : card ? (
                <StudentReportCardDetailView card={card} />
              ) : (
                <p className="text-sm text-muted">Could not load this report card.</p>
              )}
            </section>
          </div>
        </div>
      )}
    </>
  );
}
