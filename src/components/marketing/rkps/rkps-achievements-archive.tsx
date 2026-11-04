"use client";

import { useMemo, useState } from "react";
import type { Achievement, AchievementCategory } from "@/content/website/public-site";
import { AchievementsGrid } from "@/components/marketing/achievement-section";
import { RkpsPageSection, RkpsSectionIntro } from "@/components/marketing/rkps/rkps-marketing-blocks";
import {
  ACHIEVEMENT_CATEGORIES,
  achievementYears,
  filterAchievements,
} from "@/lib/achievements-display";

export function AchievementsArchiveSection({ items, id = "archive" }: { items: Achievement[]; id?: string }) {
  const [category, setCategory] = useState<AchievementCategory | "All">("All");
  const [year, setYear] = useState<number | "All">("All");
  const years = useMemo(() => achievementYears(items), [items]);
  const filtered = useMemo(() => filterAchievements(items, { category, year }), [items, category, year]);

  return (
    <RkpsPageSection id={id} tone="paper">
      <RkpsSectionIntro
        num="04 · Archive"
        title="Full achievement archive"
        description="Browse verified highlights by category and year. Details are updated when the school publishes them."
        action={
          <p className="text-sm font-semibold tabular-nums text-brand">
            {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
          </p>
        }
      />

      <div className="mt-8 flex flex-col gap-4 rounded-[1.5rem] border border-border/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(232,240,255,0.96))] p-4 shadow-[0_20px_42px_rgba(11,61,120,0.08)] sm:flex-row sm:flex-wrap sm:items-end sm:gap-6 sm:p-5">
        <label className="min-w-[10rem] flex-1 text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Category</span>
          <select
            className="input-field rkps-ease mt-2 w-full rounded-xl border border-border/80 bg-white/90 px-3.5 py-2.5 text-sm text-heading shadow-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value as AchievementCategory | "All")}
          >
            <option value="All">All categories</option>
            {ACHIEVEMENT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="min-w-[8rem] text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Year</span>
          <select
            className="input-field rkps-ease mt-2 w-full rounded-xl border border-border/80 bg-white/90 px-3.5 py-2.5 text-sm text-heading shadow-sm"
            value={year === "All" ? "All" : String(year)}
            onChange={(e) => setYear(e.target.value === "All" ? "All" : Number(e.target.value))}
          >
            <option value="All">All years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-8">
        <AchievementsGrid items={filtered} asymmetric />
      </div>
    </RkpsPageSection>
  );
}
