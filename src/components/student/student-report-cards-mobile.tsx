"use client";

import { PanelMobileShell } from "@/components/panel/panel-mobile-shell";
import { MobileEmptyState } from "@/components/mobile/mobile-primitives";
import {
  StudentExamPicker,
  StudentReportCardDetail,
  StudentReportCardDetailView,
  StudentReportCardSummary,
} from "@/components/student/student-report-cards-shared";

export type { StudentReportCardDetail, StudentReportCardSummary } from "@/components/student/student-report-cards-shared";

export function StudentReportCardsMobile({
  summaries,
  selectedId,
  onSelectExam,
  card,
  loadingCard,
}: {
  summaries: StudentReportCardSummary[];
  selectedId: string | null;
  onSelectExam: (id: string) => void;
  card: StudentReportCardDetail | null;
  loadingCard: boolean;
}) {
  const selectedSummary = summaries.find((s) => s.examinationId === selectedId);

  const heroExtra =
    card && !loadingCard ? (
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            card.summary.overallPass ? "bg-emerald-500/25 text-white" : "bg-white/20 text-white"
          }`}
        >
          {card.summary.overallPass ? "Overall pass" : "In progress"}
        </span>
        {card.summary.percentage != null && (
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold tabular-nums">
            {card.summary.percentage}% aggregate
          </span>
        )}
      </div>
    ) : selectedSummary?.percentage != null ? (
      <p className="text-sm font-semibold text-white/90 tabular-nums">{selectedSummary.percentage}% last published</p>
    ) : undefined;

  return (
    <PanelMobileShell
      role="student"
      kicker="Student"
      title="Report cards"
      subtitle="Published exam results for your class."
      showCalendar={false}
      heroExtra={heroExtra}
    >
      {summaries.length === 0 ? (
        <MobileEmptyState message="No published report cards yet. Your class teacher will publish results after marks are finalized." />
      ) : (
        <div className="space-y-4 -mt-1">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Examinations</p>
            <StudentExamPicker summaries={summaries} selectedId={selectedId} onSelect={onSelectExam} layout="scroll" />
          </div>

          {selectedId && loadingCard && <p className="text-center text-sm text-muted py-8">Loading report card…</p>}

          {selectedId && !loadingCard && card && <StudentReportCardDetailView card={card} />}
        </div>
      )}
    </PanelMobileShell>
  );
}
