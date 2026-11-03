"use client";

import { DataTable } from "@/components/data-table";
import { MobileSummaryStats } from "@/components/mobile/mobile-primitives";

export type StudentReportCardSummary = {
  examinationId: string;
  name: string;
  startDate: string | null;
  percentage: number | null;
  subjectsWithMarks: number;
};

export type StudentReportCardDetail = {
  school: { name: string; schoolCode: string } | null;
  examination: { name: string; sessionName: string; startDate: string | null; endDate: string | null };
  student: {
    name: string;
    studentId: string;
    admissionNumber: string;
    classLabel: string | null;
    rollNumber: string | null;
  };
  subjects: {
    name: string;
    maxMarks: number;
    marksObtained: number | null;
    grade: string | null;
    isPass: boolean | null;
  }[];
  summary: {
    totalObtained: number;
    totalMax: number;
    percentage: number | null;
    overallPass: boolean;
  };
  attendance: { percentage: number | null; daysRecorded: number };
};

export function formatExamDate(d: string | null) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function StudentExamPicker({
  summaries,
  selectedId,
  onSelect,
  layout = "scroll",
}: {
  summaries: StudentReportCardSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  layout?: "scroll" | "stack";
}) {
  if (layout === "stack") {
    return (
      <ul className="space-y-2">
        {summaries.map((s) => {
          const active = s.examinationId === selectedId;
          const dateLabel = formatExamDate(s.startDate);
          return (
            <li key={s.examinationId}>
              <button
                type="button"
                onClick={() => onSelect(s.examinationId)}
                className={`flex w-full flex-col gap-0.5 rounded-xl border px-4 py-3 text-left transition ${
                  active
                    ? "border-brand/40 bg-brand/5 ring-1 ring-brand/20"
                    : "border-border bg-surface hover:border-brand/25"
                }`}
              >
                <span className="font-medium text-heading">{s.name}</span>
                <span className="text-sm text-muted">
                  {s.percentage != null ? `${s.percentage}%` : "—"} · {s.subjectsWithMarks} subject
                  {s.subjectsWithMarks === 1 ? "" : "s"}
                </span>
                {dateLabel ? <span className="text-xs text-muted">{dateLabel}</span> : null}
              </button>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none">
      {summaries.map((s) => {
        const active = s.examinationId === selectedId;
        const dateLabel = formatExamDate(s.startDate);
        return (
          <button
            key={s.examinationId}
            type="button"
            onClick={() => onSelect(s.examinationId)}
            className={`shrink-0 min-w-[9rem] max-w-[11rem] rounded-2xl border px-3 py-2.5 text-left transition active:scale-[0.98] ${
              active
                ? "border-brand bg-brand/5 shadow-[var(--shadow-card)] ring-2 ring-brand/20"
                : "border-border bg-surface hover:border-brand/35"
            }`}
          >
            <p className="truncate text-sm font-semibold text-heading">{s.name}</p>
            <p className="mt-1 text-[0.65rem] text-muted">
              {s.percentage != null ? `${s.percentage}%` : "—"} · {s.subjectsWithMarks} subjects
            </p>
            {dateLabel && <p className="mt-0.5 text-[0.6rem] text-muted">{dateLabel}</p>}
          </button>
        );
      })}
    </div>
  );
}

export function StudentReportCardDetailView({ card }: { card: StudentReportCardDetail }) {
  return (
    <div className="space-y-4 print:shadow-none" id="report-card-print">
      <div className="rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/8 via-surface to-surface p-4 shadow-sm sm:p-5">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-brand">
          {card.school?.name ?? "School"}
        </p>
        <h3 className="mt-1 text-lg font-bold text-heading sm:text-xl">Report card</h3>
        <p className="text-sm text-muted">{card.examination.name}</p>
        <p className="text-xs text-muted">{card.examination.sessionName}</p>
        {(card.examination.startDate || card.examination.endDate) && (
          <p className="mt-1 text-[0.65rem] text-muted">
            {formatExamDate(card.examination.startDate)}
            {card.examination.endDate ? ` – ${formatExamDate(card.examination.endDate)}` : ""}
          </p>
        )}
      </div>

      <MobileSummaryStats
        items={[
          {
            label: "Overall %",
            value: card.summary.percentage != null ? `${card.summary.percentage}%` : "—",
          },
          {
            label: "Total marks",
            value: `${card.summary.totalObtained}/${card.summary.totalMax}`,
          },
          {
            label: "Attendance",
            value: card.attendance.percentage != null ? `${card.attendance.percentage}%` : "—",
          },
          { label: "Subjects", value: card.subjects.length },
        ]}
      />

      <div className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm shadow-[var(--shadow-card)]">
        <p className="font-semibold text-heading">{card.student.name}</p>
        <p className="mt-1 text-xs text-muted">
          {card.student.classLabel ?? "Class —"} · Roll {card.student.rollNumber ?? "—"}
        </p>
        <p className="text-xs text-muted">ID {card.student.studentId}</p>
        {card.attendance.daysRecorded > 0 && (
          <p className="mt-2 text-xs text-muted">
            Attendance during exam period: {card.attendance.percentage ?? "—"}% ({card.attendance.daysRecorded}{" "}
            days recorded)
          </p>
        )}
      </div>

      <div className="card-panel overflow-x-auto">
        <p className="form-section-title mb-3">Subject marks</p>
        <DataTable
          columns={["Subject", "Marks", "Max", "Grade", "Result"]}
          columnClassNames={[
            "min-w-[6.5rem] max-w-[9rem]",
            "tabular-nums whitespace-nowrap",
            "tabular-nums whitespace-nowrap",
            "whitespace-nowrap",
            "whitespace-nowrap",
          ]}
          rows={card.subjects.map((s) => [
            s.name,
            s.marksObtained != null ? String(s.marksObtained) : "—",
            String(s.maxMarks),
            s.grade ?? "—",
            s.isPass === true ? "Pass" : s.isPass === false ? "Fail" : "—",
          ])}
        />
      </div>

      <div className="rounded-2xl border border-border bg-surface-muted px-4 py-3 text-sm">
        <p className="font-semibold text-heading">
          Total: {card.summary.totalObtained} / {card.summary.totalMax}
          {card.summary.percentage != null ? ` (${card.summary.percentage}%)` : ""}
        </p>
        {card.summary.overallPass ? (
          <p className="mt-1 text-xs font-semibold text-emerald-700">Congratulations — overall pass</p>
        ) : null}
      </div>

      <button type="button" className="btn-secondary w-full text-sm print:hidden sm:w-auto" onClick={() => window.print()}>
        Print report card
      </button>
    </div>
  );
}
