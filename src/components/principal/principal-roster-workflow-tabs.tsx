"use client";

export type PrincipalRosterTab = "roster" | "add";

export function PrincipalRosterWorkflowTabs({
  value,
  onChange,
  rosterTitle,
  rosterHint,
  addTitle,
  addHint,
  className = "",
}: {
  value: PrincipalRosterTab;
  onChange: (tab: PrincipalRosterTab) => void;
  rosterTitle: string;
  rosterHint: string;
  addTitle: string;
  addHint: string;
  className?: string;
}) {
  const tabs: { id: PrincipalRosterTab; title: string; hint: string }[] = [
    { id: "roster", title: rosterTitle, hint: rosterHint },
    { id: "add", title: addTitle, hint: addHint },
  ];

  return (
    <div
      className={`grid grid-cols-1 gap-2 min-[480px]:grid-cols-2 ${className}`}
      role="tablist"
      aria-label="Roster workflow"
    >
      {tabs.map((tab) => {
        const active = value === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={`rounded-2xl border px-4 py-3 text-left transition shadow-sm ${
              active
                ? "border-brand bg-gradient-to-br from-brand/10 to-brand/5 ring-2 ring-brand/25"
                : "border-border bg-surface hover:border-brand/30"
            }`}
          >
            <p className={`text-sm font-semibold ${active ? "text-brand" : "text-heading"}`}>{tab.title}</p>
            <p className="mt-0.5 text-xs text-muted">{tab.hint}</p>
          </button>
        );
      })}
    </div>
  );
}

export function PrincipalRosterStatStrip({
  label,
  count,
  loading,
  detail,
}: {
  label: string;
  count: number;
  loading: boolean;
  detail?: string;
}) {
  return (
    <div className="rounded-2xl border border-brand/15 bg-gradient-to-br from-brand/[0.04] to-surface px-4 py-3 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-brand">{loading ? "—" : count}</p>
      {detail && <p className="mt-0.5 text-xs text-muted">{detail}</p>}
    </div>
  );
}
