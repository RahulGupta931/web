"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SchoolMonthCalendarCard } from "@/components/calendar/school-month-calendar-card";
import { useAuth } from "@/components/auth-provider";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import { studentNavLabel } from "@/config/nav";
import { noticeAudienceLabel } from "@/config/schema-enums";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

type Notice = {
  id: string;
  title: string;
  body: string;
  audience: string;
  createdAt: string;
  publishedAt: string | null;
};

type Calendar = {
  holidays: { title: string; date: string }[];
  events: { title: string; startsAt: string; endsAt?: string | null }[];
};

type Tab = "notices" | "calendar";
type AudienceFilter = "all" | "SCHOOL" | "STUDENTS" | "CLASS" | "SECTION";

const AUDIENCE_TONE: Record<string, string> = {
  SCHOOL: "bg-brand/10 text-brand ring-brand/20",
  STUDENTS: "bg-sky-500/12 text-sky-900 ring-sky-500/20",
  CLASS: "bg-emerald-500/12 text-emerald-900 ring-emerald-500/20",
  SECTION: "bg-violet-500/12 text-violet-900 ring-violet-500/20",
};

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function fmtDateTime(d: string) {
  return new Date(d).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function noticeTimestamp(n: Notice) {
  return n.publishedAt ?? n.createdAt;
}

function StatCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-2.5 shadow-[var(--shadow-card)] sm:px-4 sm:py-3">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-xl font-bold tabular-nums text-heading sm:text-2xl">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-muted">{sub}</p> : null}
    </div>
  );
}

function audienceTone(audience: string) {
  return AUDIENCE_TONE[audience] ?? "bg-surface-muted text-muted ring-border";
}

export function StudentNoticesExperience() {
  const { loading: authLoading } = useAuth();
  const { get, isReady } = useApi();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [calendar, setCalendar] = useState<Calendar | null>(null);
  const [tab, setTab] = useState<Tab>("notices");
  const [audienceFilter, setAudienceFilter] = useState<AudienceFilter>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!isReady) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    Promise.all([
      get<Notice[]>("/api/student/notices"),
      get<Calendar>("/api/student/calendar"),
    ])
      .then(([n, c]) => {
        setNotices(Array.isArray(n) ? n : []);
        setCalendar(c);
      })
      .catch((e) => {
        setNotices([]);
        setCalendar(null);
        setError(getApiErrorMessage(e));
      })
      .finally(() => setLoading(false));
  }, [get, isReady]);

  useEffect(() => {
    if (authLoading) return;
    load();
  }, [authLoading, load]);

  const stats = useMemo(() => {
    const schoolWide = notices.filter((n) => n.audience === "SCHOOL").length;
    const forStudents = notices.filter((n) => n.audience === "STUDENTS").length;
    const classSection = notices.filter((n) => n.audience === "CLASS" || n.audience === "SECTION").length;
    const now = Date.now();
    const upcomingEvents =
      calendar?.events.filter((e) => new Date(e.startsAt).getTime() >= now).length ?? 0;
    const holidays = calendar?.holidays.length ?? 0;
    return { total: notices.length, schoolWide, forStudents, classSection, upcomingEvents, holidays };
  }, [notices, calendar]);

  const filteredNotices = useMemo(() => {
    let list = notices;
    if (audienceFilter !== "all") {
      list = list.filter((n) => n.audience === audienceFilter);
    }
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)
    );
  }, [notices, audienceFilter, search]);

  const selected =
    filteredNotices.find((n) => n.id === selectedId) ?? notices.find((n) => n.id === selectedId) ?? null;

  const upcomingEvents = useMemo(() => {
    if (!calendar) return [];
    const now = Date.now();
    return calendar.events
      .filter((e) => new Date(e.startsAt).getTime() >= now)
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
      .slice(0, 8);
  }, [calendar]);

  const upcomingHolidays = useMemo(() => {
    if (!calendar) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return calendar.holidays
      .filter((h) => new Date(h.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 8);
  }, [calendar]);

  return (
    <>
      <PanelAlerts error={error} />
      <PageHeader
        title={studentNavLabel("/student/notices")}
        description="Announcements for you and your class, plus school holidays and events."
        actions={
          <Link href="/student" className="btn-secondary shrink-0 text-sm">
            Dashboard
          </Link>
        }
      />

      <section
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand-light px-5 py-6 text-white shadow-[var(--shadow-card)]"
        aria-label="Notices summary"
      >
        <div className="pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-full bg-brand-gold/25 blur-2xl" />
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">
          School announcements
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
          {loading ? "Loading…" : `${stats.total} notice${stats.total === 1 ? "" : "s"} for you`}
        </h2>
        <p className="mt-2 text-sm text-white/85">
          {stats.upcomingEvents > 0
            ? `${stats.upcomingEvents} upcoming event${stats.upcomingEvents === 1 ? "" : "s"} on the calendar`
            : "Check the calendar for holidays and events"}
        </p>
      </section>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        <StatCard label="Notices" value={loading ? "—" : stats.total} sub="Visible to you" />
        <StatCard label="Whole school" value={loading ? "—" : stats.schoolWide} />
        <StatCard label="All students" value={loading ? "—" : stats.forStudents} />
        <StatCard
          label="Calendar"
          value={loading ? "—" : stats.upcomingEvents}
          sub={stats.holidays ? `${stats.holidays} holidays` : "Events"}
        />
      </div>

      <nav
        className="flex gap-1 rounded-xl border border-border bg-surface p-1 shadow-[var(--shadow-card)]"
        aria-label="Notices views"
      >
        {(
          [
            ["notices", "Announcements"],
            ["calendar", "Calendar"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setTab(id);
              setSelectedId(null);
            }}
            className={`flex flex-1 items-center justify-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              tab === id ? "bg-brand text-white shadow-sm" : "text-muted hover:bg-surface-muted hover:text-heading"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {tab === "notices" ? (
        <div>
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["all", "All"],
                  ["SCHOOL", "School"],
                  ["STUDENTS", "Students"],
                  ["CLASS", "My class"],
                  ["SECTION", "My section"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setAudienceFilter(id);
                    setSelectedId(null);
                  }}
                  className={`rounded-full border px-3 py-1 text-xs font-medium sm:text-sm ${
                    audienceFilter === id
                      ? "border-brand bg-brand text-white"
                      : "border-border text-muted hover:border-brand/30"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <input
              className="input-field w-full lg:max-w-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title or message…"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div className={`space-y-2 ${selected ? "hidden lg:block" : ""}`}>
              {loading ? (
                <p className="empty-state">Loading announcements…</p>
              ) : filteredNotices.length === 0 ? (
                <div className="empty-state">
                  {notices.length === 0
                    ? "No notices right now."
                    : "No announcements match your search or filter."}
                </div>
              ) : (
                filteredNotices.map((n) => {
                  const active = n.id === selectedId;
                  const preview = n.body.length > 140 ? `${n.body.slice(0, 140)}…` : n.body;
                  return (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => setSelectedId(n.id)}
                      className={`w-full rounded-xl border px-4 py-3 text-left transition-shadow ${
                        active
                          ? "border-brand/45 bg-brand/[0.04] shadow-[var(--shadow-card-hover)]"
                          : "border-border bg-surface hover:border-brand/25 hover:shadow-[var(--shadow-card)]"
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <span className="line-clamp-2 font-semibold text-heading">{n.title}</span>
                        <span className="shrink-0 text-xs tabular-nums text-muted">
                          {fmtDate(noticeTimestamp(n))}
                        </span>
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-sm text-foreground/90">{preview}</p>
                      <span
                        className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide ring-1 ring-inset ${audienceTone(n.audience)}`}
                      >
                        {noticeAudienceLabel(n.audience)}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            <div className={!selected ? "hidden lg:block" : ""}>
              {!selected ? (
                <div className="empty-state lg:min-h-[16rem] lg:flex lg:flex-col lg:items-center lg:justify-center">
                  <p className="font-medium text-heading">Select a notice</p>
                  <p className="mt-1 max-w-sm text-sm text-muted">Read the full message from your school here.</p>
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
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h2 className="text-lg font-bold leading-snug text-heading">{selected.title}</h2>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-wide ring-1 ring-inset ${audienceTone(selected.audience)}`}
                      >
                        {noticeAudienceLabel(selected.audience)}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-muted">
                      {selected.publishedAt
                        ? `Published ${fmtDateTime(selected.publishedAt)}`
                        : `Posted ${fmtDateTime(selected.createdAt)}`}
                    </p>
                  </div>
                  <div className="form-shell">
                    <div className="rounded-xl border border-border bg-surface-muted/40 p-4 sm:p-5">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{selected.body}</p>
                    </div>
                  </div>
                </article>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <SchoolMonthCalendarCard role="student" title="School calendar" layout="split" showHolidayLists={false} />

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="card-panel overflow-hidden">
              <div className="border-b border-border px-4 py-3 sm:px-5">
                <p className="form-section-title">Upcoming holidays</p>
              </div>
              <div className="p-4 sm:p-5">
                {loading ? (
                  <p className="text-sm text-muted">Loading…</p>
                ) : upcomingHolidays.length === 0 ? (
                  <p className="text-sm text-muted">No upcoming holidays listed.</p>
                ) : (
                  <ul className="space-y-3">
                    {upcomingHolidays.map((h, i) => (
                      <li
                        key={`${h.date}-${i}`}
                        className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3 py-2.5"
                      >
                        <span className="text-sm font-medium text-heading">{h.title}</span>
                        <span className="shrink-0 text-xs font-semibold tabular-nums text-brand">
                          {fmtDate(h.date)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            <section className="card-panel overflow-hidden">
              <div className="border-b border-border px-4 py-3 sm:px-5">
                <p className="form-section-title">Upcoming events</p>
              </div>
              <div className="p-4 sm:p-5">
                {loading ? (
                  <p className="text-sm text-muted">Loading…</p>
                ) : upcomingEvents.length === 0 ? (
                  <p className="text-sm text-muted">No upcoming events scheduled.</p>
                ) : (
                  <ul className="space-y-3">
                    {upcomingEvents.map((e, i) => (
                      <li
                        key={`${e.startsAt}-${i}`}
                        className="rounded-lg border border-border bg-surface px-3 py-2.5"
                      >
                        <p className="text-sm font-medium text-heading">{e.title}</p>
                        <p className="mt-0.5 text-xs text-muted">{fmtDateTime(e.startsAt)}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </>
  );
}
