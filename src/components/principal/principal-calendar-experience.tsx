"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { SchoolMonthCalendarCard } from "@/components/calendar/school-month-calendar-card";
import { useAuth } from "@/components/auth-provider";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import { principalNavLabel } from "@/config/nav";
import { WorkingDaysPills } from "@/components/principal-configuration-mobile";
import { titleCaseDay } from "@/lib/school-config-display";
import { apiFetch, getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

const CATEGORIES = [
  "PUBLIC_HOLIDAY",
  "SCHOOL_HOLIDAY",
  "VACATION_TERM_BREAK",
  "EXAMINATION_DAY",
  "EVENT_ACTIVITY",
  "STAFF_TRAINING",
  "SPECIAL_WORKING_SATURDAY",
  "REGIONAL_HOLIDAY",
  "PARTIAL_CLOSURE",
  "SPECIAL_SCHEDULE",
] as const;

const ROLES = ["PRINCIPAL", "TEACHER", "STUDENT"] as const;

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

type CalendarTab = "overview" | "entries" | "create" | "override";

type CalendarEntry = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  startDate: string;
  endDate: string | null;
  isFullDay: boolean;
  partialStartTime: string | null;
  partialEndTime: string | null;
  blocksTimetable: boolean;
  blocksExams: boolean;
  publicationStatus: string;
  applicableClassIds: string[];
  visibleToRoles: string[];
};

type CalendarResponse = {
  workingDays: { day: string; isWorking: boolean }[];
  entries: CalendarEntry[];
  classes: { id: string; name: string }[];
};

function formatCategory(c: string) {
  return c.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (x) => x.toUpperCase());
}

function formatDateRange(e: CalendarEntry) {
  const start = new Date(e.startDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  if (!e.endDate) return start;
  const end = new Date(e.endDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return start === end ? start : `${start} – ${end}`;
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3 shadow-[var(--shadow-card)]">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-2xl font-bold tabular-nums text-heading">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-muted">{sub}</p> : null}
    </div>
  );
}

export function PrincipalCalendarExperience() {
  const { get, post } = useApi();
  const { token } = useAuth();
  const [data, setData] = useState<CalendarResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab] = useState<CalendarTab>("overview");
  const [entryFilter, setEntryFilter] = useState<"all" | "PUBLISHED" | "DRAFT">("all");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("PUBLIC_HOLIDAY");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFullDay, setIsFullDay] = useState(true);
  const [partialStartTime, setPartialStartTime] = useState("");
  const [partialEndTime, setPartialEndTime] = useState("");
  const [blocksTimetable, setBlocksTimetable] = useState(true);
  const [blocksExams, setBlocksExams] = useState(true);
  const [visibleToRoles, setVisibleToRoles] = useState<string[]>([...ROLES]);
  const [applicableClassIds, setApplicableClassIds] = useState<string[]>([]);

  const [overrideDate, setOverrideDate] = useState("");
  const [overrideReason, setOverrideReason] = useState("");
  const [overrideTimetable, setOverrideTimetable] = useState(true);
  const [overrideExams, setOverrideExams] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 10);
    const to = new Date(now.getFullYear(), now.getMonth() + 6, 0).toISOString().slice(0, 10);
    get<CalendarResponse>(`/api/principal/calendar?from=${from}&to=${to}`)
      .then(setData)
      .catch((e) => {
        setData(null);
        setError(getApiErrorMessage(e));
      })
      .finally(() => setLoading(false));
  }, [get]);

  useEffect(() => {
    load();
  }, [load]);

  const entries = data?.entries ?? [];

  const stats = useMemo(() => {
    const published = entries.filter((e) => e.publicationStatus === "PUBLISHED").length;
    const drafts = entries.filter((e) => e.publicationStatus !== "PUBLISHED").length;
    const working =
      data?.workingDays?.filter((d) => d.isWorking).length ??
      DAYS.filter((d) => d !== "SUNDAY").length;
    return { total: entries.length, published, drafts, working };
  }, [entries, data?.workingDays]);

  const filteredEntries = useMemo(() => {
    if (entryFilter === "all") return entries;
    if (entryFilter === "PUBLISHED") return entries.filter((e) => e.publicationStatus === "PUBLISHED");
    return entries.filter((e) => e.publicationStatus !== "PUBLISHED");
  }, [entries, entryFilter]);

  const workingDayLabels = useMemo(() => {
    const list = data?.workingDays?.filter((d) => d.isWorking).map((d) => titleCaseDay(d.day)) ?? [];
    return list.length ? list : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  }, [data?.workingDays]);

  async function toggleWorkingDay(day: string) {
    if (!data) return;
    const byDay = new Map(data.workingDays.map((d) => [d.day, d.isWorking]));
    const current = byDay.get(day) ?? day !== "SUNDAY";
    byDay.set(day, !current);
    const next = DAYS.map((d) => ({ day: d, isWorking: byDay.get(d) ?? d !== "SUNDAY" }));
    setError(null);
    try {
      const res = await apiFetch<{ workingDays: CalendarResponse["workingDays"] }>(
        "/api/principal/calendar/working-days",
        {
          method: "PUT",
          token,
          body: JSON.stringify({ days: next }),
        }
      );
      setData({ ...data, workingDays: res.workingDays });
      setMessage("Working days updated.");
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  }

  async function onCreateEntry(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      await post("/api/principal/calendar/entries", {
        title,
        description: description || undefined,
        category,
        startDate,
        endDate: endDate || undefined,
        isFullDay,
        partialStartTime: !isFullDay && partialStartTime ? partialStartTime : undefined,
        partialEndTime: !isFullDay && partialEndTime ? partialEndTime : undefined,
        blocksTimetable,
        blocksExams,
        visibleToRoles,
        applicableClassIds,
      });
      setTitle("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setMessage("Calendar entry saved as draft.");
      setTab("entries");
      load();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function publishEntry(id: string) {
    setError(null);
    try {
      await post(`/api/principal/calendar/entries/${id}/publish`, {});
      setMessage("Entry published. Affected users will be notified.");
      load();
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  }

  async function deleteEntry(id: string) {
    if (!confirm("Delete this calendar entry?")) return;
    setError(null);
    try {
      await apiFetch(`/api/principal/calendar/entries/${id}`, { method: "DELETE", token });
      setMessage("Entry deleted.");
      load();
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  }

  async function onOverride(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await post("/api/principal/calendar/overrides", {
        date: overrideDate,
        reason: overrideReason,
        allowsTimetable: overrideTimetable,
        allowsExams: overrideExams,
      });
      setOverrideReason("");
      setMessage("Generation override recorded (audit logged).");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  function toggleRole(role: string) {
    setVisibleToRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  }

  function toggleClass(classId: string) {
    setApplicableClassIds((prev) =>
      prev.includes(classId) ? prev.filter((id) => id !== classId) : [...prev, classId]
    );
  }

  const tabs: { id: CalendarTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "entries", label: `Entries (${entries.length})` },
    { id: "create", label: "Add entry" },
    { id: "override", label: "Override" },
  ];

  return (
    <>
      <PanelAlerts error={error} message={message} messageTitle="Calendar" />

      <PageHeader
        title={principalNavLabel("/principal/calendar")}
        description="Working days, holidays, vacations, exams, and events. Published entries block timetable and exam generation unless an override is recorded."
        actions={
          <Link href="/principal/timetable" className="btn-secondary shrink-0 text-sm">
            Timetable
          </Link>
        }
      />

      <section
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand-light px-5 py-6 text-white shadow-[var(--shadow-card)]"
        aria-label="Calendar summary"
      >
        <div className="pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-full bg-brand-gold/25 blur-2xl" />
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">School calendar</p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
          {loading ? "Loading…" : `${stats.published} published events`}
        </h2>
        <p className="mt-2 text-sm text-white/85">
          {stats.working} working weekdays · {stats.drafts} draft{stats.drafts === 1 ? "" : "s"} in range
        </p>
      </section>

      <div className="grid gap-3 sm:grid-cols-4">
        <StatCard label="In range" value={loading ? "—" : stats.total} sub="Loaded entries" />
        <StatCard label="Published" value={loading ? "—" : stats.published} />
        <StatCard label="Drafts" value={loading ? "—" : stats.drafts} sub="Awaiting publish" />
        <StatCard label="Working days" value={loading ? "—" : stats.working} sub="Per week" />
      </div>

      <nav
        className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-surface p-1 shadow-[var(--shadow-card)]"
        aria-label="Calendar sections"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`shrink-0 flex-1 rounded-lg px-2 py-2.5 text-sm font-medium transition-colors sm:px-3 ${
              tab === t.id ? "bg-brand text-white shadow-sm" : "text-muted hover:bg-surface-muted hover:text-heading"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "overview" && (
        <div className="space-y-6">
          <SchoolMonthCalendarCard role="principal" title="Month overview" layout="split" manageHref={undefined} />

          <section className="card-panel overflow-hidden">
            <div className="border-b border-border bg-gradient-to-r from-brand/8 via-transparent to-transparent px-4 py-3 sm:px-5">
              <p className="form-section-title">Working days of the week</p>
              <p className="mt-1 text-sm text-muted">Tap a day to toggle whether school operates that weekday.</p>
            </div>
            <div className="form-shell space-y-4">
              <div className="flex flex-wrap gap-2">
                {DAYS.map((day) => {
                  const row = data?.workingDays?.find((d) => d.day === day);
                  const isWorking = row?.isWorking ?? day !== "SUNDAY";
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleWorkingDay(day)}
                      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                        isWorking ? "border-brand bg-brand/10 text-brand" : "border-border text-muted"
                      }`}
                    >
                      {titleCaseDay(day)}
                    </button>
                  );
                })}
              </div>
              <WorkingDaysPills days={workingDayLabels} />
            </div>
          </section>
        </div>
      )}

      {tab === "entries" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["all", "All"],
                ["PUBLISHED", "Published"],
                ["DRAFT", "Drafts"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setEntryFilter(id)}
                className={`rounded-full border px-3 py-1 text-sm font-medium ${
                  entryFilter === id
                    ? "border-brand bg-brand text-white"
                    : "border-border text-muted hover:border-brand/30"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="empty-state">Loading entries…</p>
          ) : filteredEntries.length === 0 ? (
            <p className="empty-state">No entries in this range or filter.</p>
          ) : (
            <ul className="space-y-3">
              {filteredEntries.map((entry) => (
                <li key={entry.id} className="card-panel overflow-hidden text-sm">
                  <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border px-4 py-3 sm:px-5">
                    <div className="min-w-0">
                      <p className="font-semibold text-heading">{entry.title}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        {formatCategory(entry.category)} · {formatDateRange(entry)}
                        {!entry.isFullDay && entry.partialStartTime && entry.partialEndTime
                          ? ` · ${entry.partialStartTime}–${entry.partialEndTime}`
                          : ""}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide ${
                        entry.publicationStatus === "PUBLISHED"
                          ? "bg-emerald-500/12 text-emerald-900"
                          : "bg-amber-500/15 text-amber-950"
                      }`}
                    >
                      {entry.publicationStatus}
                    </span>
                  </div>
                  <div className="space-y-2 px-4 py-3 sm:px-5">
                    {entry.description ? <p className="text-muted">{entry.description}</p> : null}
                    <p className="text-xs text-muted">
                      Visible: {entry.visibleToRoles.join(", ")}
                      {entry.blocksTimetable || entry.blocksExams
                        ? ` · Blocks ${[entry.blocksTimetable && "timetable", entry.blocksExams && "exams"].filter(Boolean).join(", ")}`
                        : ""}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {entry.publicationStatus !== "PUBLISHED" && (
                        <button type="button" className="btn-primary text-xs" onClick={() => publishEntry(entry.id)}>
                          Publish
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn-secondary text-xs text-red-700"
                        onClick={() => deleteEntry(entry.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === "create" && (
        <form onSubmit={onCreateEntry} className="card-panel form-shell space-y-4">
          <p className="form-section-title">New calendar entry</p>
          <label className="block text-sm">
            <span className="text-muted">Title</span>
            <input required className="input-field mt-1 w-full" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label className="block text-sm">
            <span className="text-muted">Category</span>
            <select
              className="input-field mt-1 w-full"
              value={category}
              onChange={(e) => setCategory(e.target.value as (typeof CATEGORIES)[number])}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{formatCategory(c)}</option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="text-muted">Start date</span>
              <input
                required
                type="date"
                className="input-field mt-1 w-full"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>
            <label className="block text-sm">
              <span className="text-muted">End date (optional)</span>
              <input
                type="date"
                className="input-field mt-1 w-full"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isFullDay} onChange={(e) => setIsFullDay(e.target.checked)} />
            Full-day closure / event
          </label>
          {!isFullDay && (
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm">
                <span className="text-muted">Partial from</span>
                <input
                  type="time"
                  className="input-field mt-1 w-full"
                  value={partialStartTime}
                  onChange={(e) => setPartialStartTime(e.target.value)}
                />
              </label>
              <label className="block text-sm">
                <span className="text-muted">Partial until</span>
                <input
                  type="time"
                  className="input-field mt-1 w-full"
                  value={partialEndTime}
                  onChange={(e) => setPartialEndTime(e.target.value)}
                />
              </label>
            </div>
          )}
          <label className="block text-sm">
            <span className="text-muted">Description</span>
            <textarea
              rows={2}
              className="input-field mt-1 w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <div className="flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={blocksTimetable} onChange={(e) => setBlocksTimetable(e.target.checked)} />
              Blocks timetable generation
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={blocksExams} onChange={(e) => setBlocksExams(e.target.checked)} />
              Blocks exam scheduling
            </label>
          </div>
          <div>
            <p className="mb-2 text-sm text-muted">Visible to roles</p>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => toggleRole(r)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${
                    visibleToRoles.includes(r) ? "border-brand bg-brand/10 text-brand" : "border-border text-muted"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          {data?.classes?.length ? (
            <div>
              <p className="mb-2 text-sm text-muted">Applicable classes (empty = whole school)</p>
              <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto">
                {data.classes.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleClass(c.id)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${
                      applicableClassIds.includes(c.id) ? "border-brand bg-brand/10 text-brand" : "border-border text-muted"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          <button type="submit" disabled={submitting} className="btn-primary text-sm disabled:opacity-50">
            {submitting ? "Saving…" : "Save as draft"}
          </button>
        </form>
      )}

      {tab === "override" && (
        <form onSubmit={onOverride} className="card-panel form-shell space-y-4">
          <p className="form-section-title">Authorized override</p>
          <p className="text-sm text-muted">
            Allow timetable or exam generation on a blocked date. Logged in the audit trail.
          </p>
          <label className="block text-sm">
            <span className="text-muted">Date</span>
            <input
              required
              type="date"
              className="input-field mt-1 w-full"
              value={overrideDate}
              onChange={(e) => setOverrideDate(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="text-muted">Reason</span>
            <input
              required
              minLength={3}
              className="input-field mt-1 w-full"
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
            />
          </label>
          <div className="flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={overrideTimetable}
                onChange={(e) => setOverrideTimetable(e.target.checked)}
              />
              Allow timetable
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={overrideExams} onChange={(e) => setOverrideExams(e.target.checked)} />
              Allow exams
            </label>
          </div>
          <button type="submit" disabled={submitting} className="btn-secondary text-sm disabled:opacity-50">
            Record override
          </button>
        </form>
      )}
    </>
  );
}
