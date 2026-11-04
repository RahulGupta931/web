"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { Achievement, AchievementCategory } from "@/content/website/public-site";
import { AchievementsGrid } from "@/components/marketing/achievement-section";
import { RkpsPageSection, RkpsSectionIntro } from "@/components/marketing/rkps/rkps-marketing-blocks";
import {
  ACHIEVEMENT_CATEGORIES,
  achievementYears,
  filterAchievements,
} from "@/lib/achievements-display";

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rkps-pill-tab shrink-0 ${
        active
          ? "bg-[var(--brand-maroon-dark)] text-white shadow-md ring-1 ring-[var(--brand-gold)]/40"
          : "border border-border/80 bg-white text-heading hover:border-brand/40 hover:text-brand"
      }`}
    >
      {children}
    </button>
  );
}

export function AchievementsArchiveSection({ items, id = "archive" }: { items: Achievement[]; id?: string }) {
  const [category, setCategory] = useState<AchievementCategory | "All">("All");
  const [year, setYear] = useState<number | "All">("All");
  const years = useMemo(() => achievementYears(items), [items]);
  const filtered = useMemo(() => filterAchievements(items, { category, year }), [items, category, year]);

  return (
    <RkpsPageSection id={id} tone="paper">
      <RkpsSectionIntro
        num="04 · Comprehensive Archive"
        title="Full school achievement archive"
        description="Browse through verified student and team milestones categorized by discipline and academic session."
        action={
          <span className="rounded-full bg-brand/10 px-3.5 py-1 text-xs font-bold text-brand">
            {filtered.length} {filtered.length === 1 ? "entry" : "entries"} found
          </span>
        }
      />

      {/* Filter Toolbar Card */}
      <div className="mt-8 rounded-3xl border border-border/80 bg-[var(--surface-elevated)] p-4 sm:p-6 shadow-sm space-y-4">
        {/* Category Filters */}
        <div className="space-y-1.5">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">Discipline / Category</p>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1" role="group" aria-label="Filter by category">
            <FilterPill active={category === "All"} onClick={() => setCategory("All")}>
              <span>✨</span>
              <span>All Disciplines</span>
            </FilterPill>
            {ACHIEVEMENT_CATEGORIES.map((item) => (
              <FilterPill key={item} active={category === item} onClick={() => setCategory(item)}>
                <span>{item}</span>
              </FilterPill>
            ))}
          </div>
        </div>

        {/* Academic Year Filters */}
        <div className="space-y-1.5 border-t border-border/60 pt-3">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">Academic Session</p>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1" role="group" aria-label="Filter by year">
            <FilterPill active={year === "All"} onClick={() => setYear("All")}>
              <span>All Years</span>
            </FilterPill>
            {years.map((item) => (
              <FilterPill key={item} active={year === item} onClick={() => setYear(item)}>
                <span>Session {item}</span>
              </FilterPill>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Results */}
      <div className="mt-8">
        <AchievementsGrid items={filtered} asymmetric />
      </div>
    </RkpsPageSection>
  );
}
