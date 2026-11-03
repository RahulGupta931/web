"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SchoolMonthCalendarCard } from "@/components/calendar/school-month-calendar-card";
import { useAuth } from "@/components/auth-provider";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import { teacherNavLabel } from "@/config/nav";
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
type AudienceFilter = "all" | "SCHOOL" | "TEACHERS";

const AUDIENCE_META: Record<string, { label: string; tone: string }> = {
  SCHOOL: { label: "Whole school", tone: "bg-brand/10 text-brand ring-brand/20" },
  TEACHERS: { label: "Staff only", tone: "bg-violet-500/12 text-violet-900 ring-violet-500/20" },
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
    <div className="rounded-xl border border-border bg-surface px-4 py-3 shadow-[var(--shadow-card)]">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-2xl font-bold tabular-nums text-heading">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-muted">{sub}</p> : null}
    </div>
  );
}

export function TeacherNoticesExperience() {
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
      get<Notice[]>("/api/teacher/notices"),
      get<Calendar>("/api/teacher/calendar"),
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
    const staffOnly = notices.filter((n) => n.audience === "TEACHERS").length;
    const now = Date.now();
    const upcomingEvents =
      calendar?.events.filter((e) => new Date(e.startsAt).getTime() >= now).length ?? 0;
    const holidays = calendar?.holidays.length ?? 0;
    return { total: notices.length, schoolWide, staffOnly, upcomingEvents, holidays };
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
        title={teacherNavLabel("/teacher/notices")}
        description="Announcements from the principal and your school calendar at a glance."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Announcements" value={loading ? "—" : stats.total} sub="School-wide and staff" />
        <StatCard label="Whole school" value={loading ? "—" : stats.schoolWide} />
        <StatCard label="Staff only" value={loading ? "—" : stats.staffOnly} />
        <StatCard
          label="Upcoming"
          value={loading ? "—" : stats.upcomingEvents}
          sub={stats.holidays ? `${stats.holidays} holidays on file` : "Events on calendar"}
        />
      </div>

      <nav
        className="mt-6 flex gap-1 rounded-xl border border-border bg-surface p-1 shadow-[var(--shadow-card)]"
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
        <div className="mt-6">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["all", "All"],
                  ["SCHOOL", "Whole school"],
                  ["TEACHERS", "Staff only"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setAudienceFilter(id);
                    setSelectedId(null);
                  }}
                  className={`rounded-full border px-3 py-1 text-sm font-medium ${
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
                    ? "No notices for staff right now."
                    : "No announcements match your search or filter."}
                </div>
              ) : (
                filteredNotices.map((n) => {
                  const active = n.id === selectedId;
                  const aud = AUDIENCE_META[n.audience] ?? {
                    label: n.audience,
                    tone: "bg-surface-muted text-muted",
                  };
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
                        className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide ring-1 ring-inset ${aud.tone}`}
                      >
                        {aud.label}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            <div className={!selected ? "hidden lg:block" : ""}>
              {!selected ? (
                <div className="empty-state lg:min-h-[16rem] lg:flex lg:flex-col lg:items-center lg:justify-center">
                  <p className="font-medium text-heading">Select an announcement</p>
                  <p className="mt-1 max-w-sm text-sm text-muted">Read the full message from the principal here.</p>
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
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-wide ring-1 ring-inset ${
                          (AUDIENCE_META[selected.audience] ?? AUDIENCE_META.SCHOOL).tone
                        }`}
                      >
                        {(AUDIENCE_META[selected.audience] ?? AUDIENCE_META.SCHOOL).label}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-muted">
                      {selected.publishedAt
                        ? `Published ${fmtDateTime(selected.publishedAt)}`
                        : `Posted ${fmtDateTime(selected.createdAt)}`}
                    </p>
                  </div>
                  <div className="form-shell">
                    <div className="rounded-xl border border-border bg-[color-mix(in_srgb,var(--surface-muted)_40%,transparent)] p-4 sm:p-5">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{selected.body}</p>
                    </div>
                  </div>
                </article>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          <SchoolMonthCalendarCard
            role="teacher"
            title="School calendar"
            layout="split"
            showHolidayLists={false}
          />

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
