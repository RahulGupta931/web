"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import { teacherNavLabel } from "@/config/nav";
import { getApiErrorMessage, resolveApiAssetUrl } from "@/lib/api";
import { useApi } from "@/lib/use-api";

export type TeacherDatesheetRow = {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: string;
  examination: { name: string } | null;
  section: { name: string; class: { name: string } };
};

type SectionOption = { sectionId: string; label: string };
type ExamOption = { id: string; name: string };
type Tab = "upload" | "gallery";

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function sectionLabel(r: TeacherDatesheetRow) {
  return `${r.section.class.name}-${r.section.name}`;
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

export function TeacherDatesheetsExperience() {
  const { loading: authLoading } = useAuth();
  const { get, postForm, isReady } = useApi();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [rows, setRows] = useState<TeacherDatesheetRow[]>([]);
  const [sections, setSections] = useState<SectionOption[]>([]);
  const [exams, setExams] = useState<ExamOption[]>([]);
  const [tab, setTab] = useState<Tab>("upload");
  const [sectionId, setSectionId] = useState("");
  const [examinationId, setExaminationId] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [galleryFilter, setGalleryFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(() => {
    if (!isReady) {
      setLoading(false);
      return;
    }
    setLoading(true);
    get<TeacherDatesheetRow[]>("/api/teacher/datesheets")
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch((e) => {
        setRows([]);
        setError(getApiErrorMessage(e));
      })
      .finally(() => setLoading(false));
  }, [get, isReady]);

  useEffect(() => {
    if (authLoading || !isReady) return;
    load();
    get<SectionOption[]>("/api/teacher/datesheets/class-sections")
      .then((opts) => {
        const list = Array.isArray(opts) ? opts : [];
        setSections(list);
        if (list[0]) setSectionId((prev) => prev || list[0].sectionId);
      })
      .catch(() => setSections([]));
    get<ExamOption[]>("/api/teacher/examinations")
      .then((ex) => setExams(Array.isArray(ex) ? ex : []))
      .catch(() => setExams([]));
  }, [authLoading, get, isReady, load]);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const stats = useMemo(() => {
    const linked = rows.filter((r) => r.examination).length;
    const bySection = new Set(rows.map((r) => sectionLabel(r))).size;
    return {
      uploads: rows.length,
      sections: sections.length,
      linked,
      classesWithSheets: bySection,
    };
  }, [rows, sections]);

  const galleryRows = useMemo(() => {
    if (galleryFilter === "all") return rows;
    return rows.filter((r) => r.section.class.name + "-" + r.section.name === galleryFilter);
  }, [rows, galleryFilter]);

  const sectionFilters = useMemo(() => {
    const labels = [...new Set(rows.map(sectionLabel))].sort();
    return labels;
  }, [rows]);

  const selected = galleryRows.find((r) => r.id === selectedId) ?? rows.find((r) => r.id === selectedId) ?? null;

  function onPickFile(f: File | null) {
    setFile(f);
    setError(null);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!sectionId || !file) {
      setError("Select a class section and choose an image.");
      return;
    }
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      const form = new FormData();
      form.append("sectionId", sectionId);
      if (examinationId) form.append("examinationId", examinationId);
      form.append("title", title.trim() || "Exam date sheet");
      form.append("image", file);
      const created = await postForm<TeacherDatesheetRow>("/api/teacher/datesheets", form);
      setMessage("Date sheet uploaded. Students in this class can view it.");
      setTitle("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (created?.id) {
        setSelectedId(created.id);
        setTab("gallery");
      }
      load();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  const canUpload = sections.length > 0;

  return (
    <>
      <PanelAlerts error={error} message={message} messageTitle="Uploaded" />
      <PageHeader
        title={teacherNavLabel("/teacher/datesheets")}
        description="Class teachers upload schedule images for their section. Students see only sheets for their class."
      />

      {!canUpload && !loading && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/8 px-4 py-3 text-sm text-amber-950">
          You are not assigned as <strong>class teacher</strong> for any section. Ask the principal to assign you
          before uploading date sheets.
        </div>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <StatCard label="Your uploads" value={loading ? "—" : stats.uploads} />
        <StatCard label="Class sections" value={loading ? "—" : stats.sections} sub="Where you can upload" />
        <StatCard label="Linked to exams" value={loading ? "—" : stats.linked} />
        <StatCard
          label="Classes covered"
          value={loading ? "—" : stats.classesWithSheets}
          sub="Sections with at least one sheet"
        />
      </div>

      <nav
        className="mt-6 flex gap-1 rounded-xl border border-border bg-surface p-1 shadow-[var(--shadow-card)]"
        aria-label="Date sheet views"
      >
        {(
          [
            ["upload", "Upload"],
            ["gallery", "Gallery", rows.length],
          ] as const
        ).map(([id, label, badge]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              tab === id ? "bg-brand text-white shadow-sm" : "text-muted hover:bg-surface-muted hover:text-heading"
            }`}
          >
            {label}
            {id === "gallery" && badge != null && badge > 0 ? (
              <span
                className={`min-w-[1.25rem] rounded-full px-1.5 py-0.5 text-[0.625rem] font-bold tabular-nums ${
                  tab === id ? "bg-white/25 text-white" : "bg-brand/10 text-brand"
                }`}
              >
                {badge}
              </span>
            ) : null}
          </button>
        ))}
      </nav>

      {tab === "upload" ? (
        <form onSubmit={onSubmit} className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <section className="card-panel overflow-hidden">
            <div className="border-b border-border bg-gradient-to-r from-brand/8 via-transparent to-transparent px-4 py-3 sm:px-5">
              <p className="form-section-title">Class & exam</p>
              <p className="mt-1 text-sm text-muted">Pick the section this schedule applies to.</p>
            </div>
            <div className="form-shell space-y-4">
              <div>
                <span className="mb-2 block text-sm font-medium text-heading">Class section *</span>
                {sections.length === 0 ? (
                  <p className="text-sm text-muted">No class-teacher sections available.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {sections.map((s) => {
                      const active = s.sectionId === sectionId;
                      return (
                        <button
                          key={s.sectionId}
                          type="button"
                          onClick={() => setSectionId(s.sectionId)}
                          className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
                            active
                              ? "border-brand bg-brand text-white"
                              : "border-border hover:border-brand/40"
                          }`}
                        >
                          {s.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <label className="block text-sm">
                <span className="font-medium text-heading">Examination (optional)</span>
                <select
                  className="input-field mt-1.5 w-full"
                  value={examinationId}
                  onChange={(e) => setExaminationId(e.target.value)}
                >
                  <option value="">General — not linked to an exam</option>
                  {exams.map((ex) => (
                    <option key={ex.id} value={ex.id}>{ex.name}</option>
                  ))}
                </select>
              </label>

              <label className="block text-sm">
                <span className="font-medium text-heading">Title</span>
                <input
                  className="input-field mt-1.5 w-full"
                  placeholder="e.g. Term 1 date sheet"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>
            </div>
          </section>

          <section className="card-panel overflow-hidden">
            <div className="border-b border-border bg-gradient-to-r from-brand/8 via-transparent to-transparent px-4 py-3 sm:px-5">
              <p className="form-section-title">Schedule image</p>
              <p className="mt-1 text-sm text-muted">JPEG, PNG, WebP, or GIF — max 5 MB.</p>
            </div>
            <div className="form-shell space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPT}
                className="sr-only"
                onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
              />
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (!canUpload) return;
                  const f = e.dataTransfer.files?.[0];
                  if (f && f.type.startsWith("image/")) onPickFile(f);
                }}
                onClick={() => canUpload && fileInputRef.current?.click()}
                className={`flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 transition-colors ${
                  file
                    ? "border-brand/40 bg-brand/[0.03]"
                    : "border-border hover:border-brand/35 hover:bg-surface-muted/50"
                } ${!canUpload ? "cursor-not-allowed opacity-50" : ""}`}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-56 w-full rounded-lg object-contain"
                  />
                ) : (
                  <>
                    <span className="text-sm font-semibold text-heading">Tap to choose an image</span>
                    <span className="mt-1 text-xs text-muted">Or drag a file here on desktop</span>
                  </>
                )}
              </div>
              {file && (
                <p className="text-center text-xs text-muted">
                  {file.name} · {(file.size / 1024).toFixed(0)} KB
                  <button
                    type="button"
                    className="ml-2 font-semibold text-brand"
                    onClick={() => {
                      onPickFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  >
                    Remove
                  </button>
                </p>
              )}

              <div className="border-t border-border pt-4">
                <button
                  type="submit"
                  disabled={submitting || !sectionId || !file || !canUpload}
                  className="btn-primary w-full sm:w-auto disabled:opacity-50"
                >
                  {submitting ? "Uploading…" : "Upload date sheet"}
                </button>
              </div>
            </div>
          </section>
        </form>
      ) : (
        <div className="mt-6">
          {sectionFilters.length > 1 && (
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setGalleryFilter("all");
                  setSelectedId(null);
                }}
                className={`rounded-full border px-3 py-1 text-sm font-medium ${
                  galleryFilter === "all"
                    ? "border-brand bg-brand text-white"
                    : "border-border text-muted"
                }`}
              >
                All classes
              </button>
              {sectionFilters.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setGalleryFilter(label);
                    setSelectedId(null);
                  }}
                  className={`rounded-full border px-3 py-1 text-sm font-medium ${
                    galleryFilter === label
                      ? "border-brand bg-brand text-white"
                      : "border-border text-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className={`space-y-2 ${selected ? "hidden lg:block" : ""}`}>
              {loading ? (
                <p className="empty-state">Loading date sheets…</p>
              ) : galleryRows.length === 0 ? (
                <div className="empty-state">
                  {rows.length === 0
                    ? "No date sheets yet. Upload one from the Upload tab."
                    : "No sheets for this class filter."}
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {galleryRows.map((r) => {
                    const active = r.id === selectedId;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSelectedId(r.id)}
                        className={`overflow-hidden rounded-xl border text-left transition-shadow ${
                          active
                            ? "border-brand/45 shadow-[var(--shadow-card-hover)] ring-2 ring-brand/20"
                            : "border-border bg-surface hover:border-brand/25 hover:shadow-[var(--shadow-card)]"
                        }`}
                      >
                        <img
                          src={resolveApiAssetUrl(r.imageUrl)}
                          alt=""
                          className="aspect-[4/3] w-full object-cover bg-surface-muted"
                        />
                        <div className="p-3">
                          <p className="line-clamp-1 font-semibold text-heading">{r.title}</p>
                          <p className="mt-0.5 text-xs text-muted">
                            {sectionLabel(r)}
                            {r.examination ? ` · ${r.examination.name}` : ""}
                          </p>
                          <p className="mt-1 text-[0.625rem] text-muted">{fmtDate(r.createdAt)}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className={!selected ? "hidden lg:block" : ""}>
              {!selected ? (
                <div className="empty-state lg:min-h-[20rem] lg:flex lg:flex-col lg:items-center lg:justify-center">
                  <p className="font-medium text-heading">Select a date sheet</p>
                  <p className="mt-1 max-w-sm text-sm text-muted">View the full image and details.</p>
                </div>
              ) : (
                <article className="card-panel overflow-hidden">
                  <div className="border-b border-border px-4 py-3 sm:px-5">
                    <button
                      type="button"
                      className="mb-2 text-sm font-medium text-brand lg:hidden"
                      onClick={() => setSelectedId(null)}
                    >
                      ← Back to gallery
                    </button>
                    <h2 className="text-lg font-bold text-heading">{selected.title}</h2>
                    <p className="mt-1 text-sm text-muted">
                      {sectionLabel(selected)}
                      {selected.examination ? ` · ${selected.examination.name}` : ""}
                    </p>
                    <p className="text-xs text-muted">Uploaded {fmtDate(selected.createdAt)}</p>
                  </div>
                  <div className="bg-surface-muted/30 p-3 sm:p-4">
                    <img
                      src={resolveApiAssetUrl(selected.imageUrl)}
                      alt={selected.title}
                      className="mx-auto max-h-[min(70vh,32rem)] w-full rounded-lg object-contain"
                    />
                  </div>
                  <div className="form-shell border-t border-border">
                    <a
                      href={resolveApiAssetUrl(selected.imageUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-sm"
                    >
                      Open full image
                    </a>
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
