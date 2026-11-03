"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { MobileEmptyState } from "@/components/mobile/mobile-primitives";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import { studentNavLabel } from "@/config/nav";
import { formatClassSection } from "@/lib/class-section-display";
import { getApiErrorMessage, resolveApiAssetUrl } from "@/lib/api";
import { useApi } from "@/lib/use-api";
import { useMediaQuery } from "@/lib/use-media-query";

export type StudentDatesheetRow = {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: string;
  examination: { name: string } | null;
  section: { name: string; class: { name: string } };
  teacher: { firstName: string; lastName: string };
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-2.5 shadow-[var(--shadow-card)] sm:px-4 sm:py-3">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-xl font-bold tabular-nums text-heading sm:text-2xl">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-muted">{sub}</p> : null}
    </div>
  );
}

function DatesheetsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-28 animate-pulse rounded-2xl bg-surface-muted" />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-surface-muted" />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-2xl bg-surface-muted" />
    </div>
  );
}

function DatesheetPicker({
  rows,
  selectedId,
  onSelect,
  layout,
}: {
  rows: StudentDatesheetRow[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  layout: "stack" | "scroll";
}) {
  if (layout === "stack") {
    return (
      <ul className="space-y-2">
        {rows.map((r) => {
          const active = r.id === selectedId;
          return (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => onSelect(r.id)}
                className={`flex w-full flex-col gap-0.5 rounded-xl border px-4 py-3 text-left transition ${
                  active
                    ? "border-brand/40 bg-brand/5 ring-1 ring-brand/20"
                    : "border-border bg-surface hover:border-brand/25"
                }`}
              >
                <span className="font-medium text-heading">{r.title}</span>
                <span className="text-xs text-muted">
                  {r.examination?.name ?? "Exam schedule"} · {fmtDate(r.createdAt)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none">
      {rows.map((r) => {
        const active = r.id === selectedId;
        return (
          <button
            key={r.id}
            type="button"
            onClick={() => onSelect(r.id)}
            className={`shrink-0 min-w-[9rem] max-w-[12rem] rounded-2xl border px-3 py-2.5 text-left transition active:scale-[0.98] ${
              active
                ? "border-brand bg-brand/5 shadow-[var(--shadow-card)] ring-2 ring-brand/20"
                : "border-border bg-surface hover:border-brand/35"
            }`}
          >
            <p className="line-clamp-2 text-sm font-semibold text-heading">{r.title}</p>
            <p className="mt-1 text-[0.65rem] text-muted">{r.examination?.name ?? "Schedule"}</p>
          </button>
        );
      })}
    </div>
  );
}

function DatesheetPreview({ row }: { row: StudentDatesheetRow }) {
  const classLabel = formatClassSection(row.section.class.name, row.section.name);
  const imageSrc = resolveApiAssetUrl(row.imageUrl);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-brand/15 bg-gradient-to-br from-brand/8 via-surface to-surface p-4 shadow-sm">
        <h2 className="text-lg font-bold text-heading">{row.title}</h2>
        <p className="mt-1 text-sm text-muted">
          Class {classLabel}
          {row.examination ? ` · ${row.examination.name}` : ""}
        </p>
        <p className="mt-1 text-xs text-muted">
          Uploaded {fmtDate(row.createdAt)} by {row.teacher.firstName} {row.teacher.lastName}
        </p>
        <a
          href={imageSrc}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex text-sm font-semibold text-brand hover:underline"
        >
          Open full image →
        </a>
      </div>
      <div className="card-panel overflow-hidden p-2 sm:p-3">
        <a href={imageSrc} target="_blank" rel="noreferrer" className="block">
          <img
            src={imageSrc}
            alt={row.title}
            className="mx-auto max-h-[min(70vh,32rem)] w-full rounded-lg object-contain"
          />
        </a>
      </div>
    </div>
  );
}

export function StudentDatesheetsExperience() {
  const { loading: authLoading } = useAuth();
  const { get, isReady } = useApi();
  const isWide = useMediaQuery("(min-width: 1024px)");

  const [rows, setRows] = useState<StudentDatesheetRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [examFilter, setExamFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!isReady) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    get<StudentDatesheetRow[]>("/api/student/datesheets")
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setRows(list);
        setSelectedId((prev) =>
          prev && list.some((r) => r.id === prev) ? prev : list[0]?.id ?? null
        );
      })
      .catch((e) => {
        setRows([]);
        setError(getApiErrorMessage(e));
      })
      .finally(() => setLoading(false));
  }, [get, isReady]);

  useEffect(() => {
    if (authLoading) return;
    load();
  }, [authLoading, load]);

  const examOptions = useMemo(() => {
    const names = new Set<string>();
    for (const r of rows) {
      if (r.examination?.name) names.add(r.examination.name);
    }
    return Array.from(names).sort();
  }, [rows]);

  const filteredRows = useMemo(() => {
    if (examFilter === "all") return rows;
    return rows.filter((r) => r.examination?.name === examFilter);
  }, [rows, examFilter]);

  useEffect(() => {
    if (filteredRows.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !filteredRows.some((r) => r.id === selectedId)) {
      setSelectedId(filteredRows[0].id);
    }
  }, [filteredRows, selectedId]);

  const selected = filteredRows.find((r) => r.id === selectedId) ?? null;

  const latest = rows[0]?.createdAt;
  const classLabel =
    rows[0] ? formatClassSection(rows[0].section.class.name, rows[0].section.name) : null;

  return (
    <>
      <PanelAlerts error={error} />
      <PageHeader
        title={studentNavLabel("/student/datesheets")}
        description="Date sheets uploaded by your class teacher for your section only."
        actions={
          <Link href="/student" className="btn-secondary shrink-0 text-sm">
            Dashboard
          </Link>
        }
      />

      {loading && rows.length === 0 && !error ? (
        <DatesheetsSkeleton />
      ) : rows.length === 0 ? (
        <MobileEmptyState message="No date sheets available for your class yet. Your teacher will upload schedules before exams." />
      ) : (
        <div className="space-y-6">
          <section
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand-light px-5 py-6 text-white shadow-[var(--shadow-card)]"
            aria-label="Date sheets summary"
          >
            <div className="pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-full bg-brand-gold/25 blur-2xl" />
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">
              Exam schedules
            </p>
            <h2 className="mt-0.5 text-xl font-bold tracking-tight sm:text-2xl">
              {selected?.title ?? `${rows.length} date sheet${rows.length === 1 ? "" : "s"}`}
            </h2>
            <p className="mt-2 text-sm text-white/85">
              {classLabel ? `For class ${classLabel}` : "For your section"}
              {latest ? ` · Latest upload ${fmtDate(latest)}` : ""}
            </p>
          </section>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
            <StatCard label="Available" value={rows.length} sub="In your section" />
            <StatCard label="Examinations" value={examOptions.length || "—"} sub="Linked schedules" />
            <StatCard
              label="Selected"
              value={selected?.examination?.name ?? "General"}
              sub={selected ? fmtDate(selected.createdAt) : "Pick a sheet"}
            />
          </div>

          {examOptions.length > 1 && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setExamFilter("all")}
                className={`rounded-full border px-3 py-1 text-xs font-medium sm:text-sm ${
                  examFilter === "all"
                    ? "border-brand bg-brand text-white"
                    : "border-border text-muted hover:border-brand/30"
                }`}
              >
                All exams
              </button>
              {examOptions.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setExamFilter(name)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium sm:text-sm ${
                    examFilter === name
                      ? "border-brand bg-brand text-white"
                      : "border-border text-muted hover:border-brand/30"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[minmax(0,17rem)_1fr] lg:items-start">
            <section className="card-panel lg:sticky lg:top-4" aria-label="Available date sheets">
              <p className="form-section-title mb-3">Available</p>
              <DatesheetPicker
                rows={filteredRows}
                selectedId={selectedId}
                onSelect={setSelectedId}
                layout={isWide ? "stack" : "scroll"}
              />
            </section>

            <section className="min-w-0" aria-label="Date sheet preview">
              {!selected ? (
                <p className="text-sm text-muted">Select a date sheet to preview.</p>
              ) : (
                <DatesheetPreview row={selected} />
              )}
            </section>
          </div>
        </div>
      )}
    </>
  );
}
