"use client";

export type TeacherExamWorkflowTab = "subject" | "class";

export function TeacherExamWorkflowTabs({
  value,
  onChange,
  showClassTeacherTab,
  className = "",
}: {
  value: TeacherExamWorkflowTab;
  onChange: (tab: TeacherExamWorkflowTab) => void;
  showClassTeacherTab: boolean;
  className?: string;
}) {
  if (!showClassTeacherTab) return null;

  const tabs: { id: TeacherExamWorkflowTab; label: string; hint: string }[] = [
    { id: "subject", label: "My papers", hint: "Subjects you teach" },
    { id: "class", label: "Report cards", hint: "Full class grid" },
  ];

  return (
    <nav
      className={`flex gap-1 rounded-xl border border-border bg-surface p-1 shadow-[var(--shadow-card)] ${className}`}
      role="tablist"
      aria-label="Examination workflow"
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
            className={`flex flex-1 flex-col items-center rounded-lg px-2 py-2.5 transition-colors sm:px-4 ${
              active
                ? "bg-brand text-white shadow-sm"
                : "text-muted hover:bg-surface-muted hover:text-heading"
            }`}
          >
            <span className="text-sm font-semibold">{tab.label}</span>
            <span
              className={`mt-0.5 hidden text-[0.625rem] sm:block ${
                active ? "text-white/80" : "text-muted"
              }`}
            >
              {tab.hint}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
