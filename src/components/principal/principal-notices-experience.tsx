"use client";

import { type ComponentProps, FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import { principalNavLabel } from "@/config/nav";
import {
  NOTICE_AUDIENCE_OPTIONS,
  type NoticeAudience,
  noticeAudienceLabel,
} from "@/config/schema-enums";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

type ClassRow = {
  id: string;
  name: string;
  sections: { id: string; name: string }[];
};

type Notice = {
  id: string;
  title: string;
  body: string;
  audience: NoticeAudience;
  classId: string | null;
  sectionId: string | null;
  class?: { name: string } | null;
  section?: { name: string; class?: { name: string } } | null;
  createdAt: string;
  publishedAt: string | null;
};

type AudienceFilter = "ALL" | NoticeAudience;
type ViewTab = "compose" | "published";

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function noticeTargetLine(notice: Notice): string | null {
  if (notice.audience === "CLASS" && notice.class?.name) {
    return `Class ${notice.class.name}`;
  }
  if (notice.audience === "SECTION" && notice.section) {
    const cls = notice.section.class?.name;
    return cls ? `${cls}-${notice.section.name}` : notice.section.name;
  }
  return null;
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

function NoticeCard({ notice }: { notice: Notice }) {
  const when = notice.publishedAt ?? notice.createdAt;
  const target = noticeTargetLine(notice);
  return (
    <article className="card-panel overflow-hidden p-0">
      <div className="border-b border-border bg-gradient-to-r from-brand/8 via-transparent to-brand-gold/10 px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-base font-semibold leading-snug text-heading">{notice.title}</h3>
          <span className="shrink-0 rounded-full bg-brand/12 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-brand">
            {noticeAudienceLabel(notice.audience)}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted">
          {fmtDateTime(when)}
          {target ? ` · ${target}` : ""}
        </p>
      </div>
      <p className="whitespace-pre-wrap px-4 py-4 text-sm leading-relaxed text-foreground sm:px-5">
        {notice.body}
      </p>
    </article>
  );
}

function AudiencePicker({
  value,
  onChange,
  compact,
}: {
  value: NoticeAudience;
  onChange: (a: NoticeAudience) => void;
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? "flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          : "grid gap-2 sm:grid-cols-2"
      }
      role="radiogroup"
      aria-label="Audience"
    >
      {NOTICE_AUDIENCE_OPTIONS.map((opt) => {
        const a = opt.value;
        const selected = value === a;
        return (
          <button
            key={a}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(a)}
            className={
              compact
                ? `shrink-0 rounded-xl border px-3 py-2 text-left text-xs transition ${
                    selected
                      ? "border-brand bg-brand/10 text-brand shadow-sm"
                      : "border-border bg-surface text-muted"
                  }`
                : `rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                    selected
                      ? "border-brand bg-brand/10 ring-1 ring-brand/25"
                      : "border-border bg-surface hover:border-brand/30"
                  }`
            }
          >
            <span className="font-semibold text-heading">{opt.label}</span>
            {!compact && <span className="mt-0.5 block text-xs text-muted">{opt.hint}</span>}
          </button>
        );
      })}
    </div>
  );
}

function PublishForm({
  title,
  body,
  audience,
  classId,
  sectionId,
  classes,
  submitting,
  onTitle,
  onBody,
  onAudience,
  onClassId,
  onSectionId,
  onSubmit,
  idPrefix = "",
  compactAudience,
}: {
  title: string;
  body: string;
  audience: NoticeAudience;
  classId: string;
  sectionId: string;
  classes: ClassRow[];
  submitting: boolean;
  onTitle: (v: string) => void;
  onBody: (v: string) => void;
  onAudience: (a: NoticeAudience) => void;
  onClassId: (v: string) => void;
  onSectionId: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
  idPrefix?: string;
  compactAudience?: boolean;
}) {
  const sectionOptions = useMemo(() => {
    const list: { id: string; label: string }[] = [];
    for (const cls of classes) {
      for (const sec of cls.sections) {
        list.push({ id: sec.id, label: `${cls.name}-${sec.name}` });
      }
    }
    return list.sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }));
  }, [classes]);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block text-sm" htmlFor={`${idPrefix}notice-title`}>
        <span className="text-muted">Headline</span>
        <input
          id={`${idPrefix}notice-title`}
          required
          placeholder="e.g. PTM for Classes 9–10"
          className="input-field mt-1 w-full"
          value={title}
          onChange={(e) => onTitle(e.target.value)}
        />
      </label>
      <label className="block text-sm" htmlFor={`${idPrefix}notice-body`}>
        <span className="text-muted">Message</span>
        <textarea
          id={`${idPrefix}notice-body`}
          required
          rows={5}
          placeholder="Write the full announcement…"
          className="input-field mt-1 min-h-[7rem] w-full resize-y"
          value={body}
          onChange={(e) => onBody(e.target.value)}
        />
      </label>
      <div>
        <p className="mb-2 text-sm text-muted">Who should see this?</p>
        <AudiencePicker value={audience} onChange={onAudience} compact={compactAudience} />
      </div>
      {audience === "CLASS" && (
        <label className="block text-sm" htmlFor={`${idPrefix}notice-class`}>
          <span className="text-muted">Class *</span>
          <select
            id={`${idPrefix}notice-class`}
            required
            className="input-field mt-1 w-full"
            value={classId}
            onChange={(e) => onClassId(e.target.value)}
          >
            <option value="">Select class</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
      )}
      {audience === "SECTION" && (
        <label className="block text-sm" htmlFor={`${idPrefix}notice-section`}>
          <span className="text-muted">Section *</span>
          <select
            id={`${idPrefix}notice-section`}
            required
            className="input-field mt-1 w-full"
            value={sectionId}
            onChange={(e) => onSectionId(e.target.value)}
          >
            <option value="">Select section</option>
            {sectionOptions.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </label>
      )}
      <button type="submit" disabled={submitting} className="btn-primary w-full text-sm disabled:opacity-50">
        {submitting ? "Publishing…" : "Publish notice"}
      </button>
    </form>
  );
}

function ComposePanel({
  formProps,
  compactAudience,
}: {
  formProps: ComponentProps<typeof PublishForm>;
  compactAudience?: boolean;
}) {
  return (
    <aside className="card-panel overflow-hidden border-t-4 border-t-brand">
      <div className="border-b border-border bg-gradient-to-r from-brand/8 via-transparent to-transparent px-4 py-3 sm:px-5">
        <p className="form-section-title">Compose</p>
        <p className="mt-1 text-sm text-muted">Notices go live as soon as you publish.</p>
      </div>
      <div className="form-shell">
        <PublishForm {...formProps} compactAudience={compactAudience} />
      </div>
    </aside>
  );
}

function PublishedPanel({
  loading,
  filtered,
  filter,
  filterChips,
  onFilter,
  search,
  onSearch,
}: {
  loading: boolean;
  filtered: Notice[];
  filter: AudienceFilter;
  filterChips: { id: AudienceFilter; label: string }[];
  onFilter: (id: AudienceFilter) => void;
  search: string;
  onSearch: (v: string) => void;
}) {
  return (
    <section className="min-w-0 space-y-4">
      <div className="card-panel form-shell space-y-4">
        <p className="form-section-title">Published notices</p>
        <input
          type="search"
          className="input-field w-full"
          placeholder="Search title or message…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
        <div className="flex flex-wrap gap-1.5">
          {filterChips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => onFilter(chip.id)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                filter === chip.id
                  ? "border-brand bg-brand text-white"
                  : "border-border text-muted hover:border-brand/30"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="empty-state">Loading notices…</p>
      ) : filtered.length === 0 ? (
        <div className="card-panel py-12 text-center">
          <p className="text-sm font-medium text-heading">No notices yet</p>
          <p className="mt-1 text-sm text-muted">
            {filter === "ALL"
              ? "Your first announcement will appear here."
              : "Nothing for this audience. Try another filter."}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((n) => (
            <li key={n.id}>
              <NoticeCard notice={n} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function PrincipalNoticesExperience() {
  const { get, post } = useApi();
  const [rows, setRows] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState<NoticeAudience>("SCHOOL");
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<AudienceFilter>("ALL");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<ViewTab>("published");

  const load = useCallback(() => {
    setLoading(true);
    get<Notice[]>("/api/principal/notices")
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch((e) => {
        setRows([]);
        setError(getApiErrorMessage(e));
      })
      .finally(() => setLoading(false));
  }, [get]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    get<ClassRow[]>("/api/principal/classes")
      .then((data) => setClasses(Array.isArray(data) ? data : []))
      .catch(() => setClasses([]));
  }, [get]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      const payload: {
        title: string;
        body: string;
        audience: NoticeAudience;
        classId?: string;
        sectionId?: string;
      } = { title, body, audience };
      if (audience === "CLASS") payload.classId = classId;
      if (audience === "SECTION") payload.sectionId = sectionId;
      await post("/api/principal/notices", payload);
      setClassId("");
      setSectionId("");
      setTitle("");
      setBody("");
      setMessage("Notice published.");
      setTab("published");
      load();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  const stats = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const thisWeek = rows.filter((n) => new Date(n.createdAt).getTime() >= weekAgo).length;
    return {
      total: rows.length,
      thisWeek,
      school: rows.filter((n) => n.audience === "SCHOOL").length,
      staff: rows.filter((n) => n.audience === "TEACHERS").length,
    };
  }, [rows]);

  const filtered = useMemo(() => {
    let list = rows;
    if (filter !== "ALL") list = list.filter((n) => n.audience === filter);
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)
    );
  }, [rows, filter, search]);

  const filterChips: { id: AudienceFilter; label: string }[] = [
    { id: "ALL", label: "All" },
    ...NOTICE_AUDIENCE_OPTIONS.map((o) => ({ id: o.value as AudienceFilter, label: o.label })),
  ];

  function handleAudienceChange(next: NoticeAudience) {
    setAudience(next);
    if (next !== "CLASS") setClassId("");
    if (next !== "SECTION") setSectionId("");
  }

  const formProps = {
    title,
    body,
    audience,
    classId,
    sectionId,
    classes,
    submitting,
    onTitle: setTitle,
    onBody: setBody,
    onAudience: handleAudienceChange,
    onClassId: setClassId,
    onSectionId: setSectionId,
    onSubmit,
    idPrefix: "principal-",
  };

  const publishedPanel = (
    <PublishedPanel
      loading={loading}
      filtered={filtered}
      filter={filter}
      filterChips={filterChips}
      onFilter={setFilter}
      search={search}
      onSearch={setSearch}
    />
  );

  return (
    <>
      <PanelAlerts error={error} message={message} messageTitle="Published" />

      <PageHeader
        title={principalNavLabel("/principal/notices")}
        description="Publish announcements instantly. Recipients see notices in their panel."
      />

      <section
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand-light px-5 py-6 text-white shadow-[var(--shadow-card)]"
        aria-label="Notices summary"
      >
        <div className="pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-full bg-brand-gold/25 blur-2xl" />
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">Announcements</p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
          {loading ? "Loading…" : `${stats.total} published`}
        </h2>
        <p className="mt-2 text-sm text-white/85">
          {stats.thisWeek} in the last 7 days · school-wide, staff, class, and section audiences
        </p>
      </section>

      <div className="grid gap-3 sm:grid-cols-4">
        <StatCard label="Total" value={loading ? "—" : stats.total} />
        <StatCard label="Last 7 days" value={loading ? "—" : stats.thisWeek} />
        <StatCard label="Whole school" value={loading ? "—" : stats.school} />
        <StatCard label="Staff only" value={loading ? "—" : stats.staff} />
      </div>

      <nav
        className="flex gap-1 rounded-xl border border-border bg-surface p-1 shadow-[var(--shadow-card)] lg:hidden"
        aria-label="Notices sections"
      >
        {(
          [
            ["compose", "Compose"],
            ["published", `Published (${stats.total})`],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex flex-1 items-center justify-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              tab === id ? "bg-brand text-white shadow-sm" : "text-muted hover:bg-surface-muted hover:text-heading"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="hidden lg:grid lg:items-start lg:gap-6 xl:grid-cols-[minmax(300px,360px)_1fr]">
        <ComposePanel formProps={formProps} />
        {publishedPanel}
      </div>

      <div className="space-y-6 lg:hidden">
        {tab === "compose" ? <ComposePanel formProps={formProps} compactAudience /> : publishedPanel}
      </div>
    </>
  );
}
