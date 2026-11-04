"use client";

import { useMemo, useState } from "react";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/site-chrome";
import { AchievementsGrid } from "@/components/marketing/achievement-section";
import { ACHIEVEMENTS, type AchievementCategory } from "@/content/website/public-site";
import {
  ACHIEVEMENT_CATEGORIES,
  achievementYears,
  filterAchievements,
} from "@/lib/achievements-display";
import { BRAND } from "@/config/branding";

export function AchievementsPageExperience() {
  const [category, setCategory] = useState<AchievementCategory | "All">("All");
  const [year, setYear] = useState<number | "All">("All");
  const years = useMemo(() => achievementYears(ACHIEVEMENTS), []);

  const filtered = useMemo(
    () => filterAchievements(ACHIEVEMENTS, { category, year }),
    [category, year]
  );

  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <span aria-hidden className="mb-3 block h-1 w-10 rounded-full bg-[var(--brand-gold)]" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Student & faculty highlights</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-heading sm:text-3xl">Achievements</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          Celebrating academic, sports, arts, and community success at {BRAND.name}. Names appear with school consent;
          photos may be added in a future update.
        </p>

        <div className="mt-8 space-y-3">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setCategory("All")} className={`rounded-full px-4 py-1.5 text-xs font-bold ${category === "All" ? "bg-brand text-white" : "border border-border bg-surface text-brand"}`}>All</button>
            {ACHIEVEMENT_CATEGORIES.map((item) => (
              <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-full px-4 py-1.5 text-xs font-bold ${category === item ? "bg-brand text-white" : "border border-border bg-surface text-brand"}`}>{item}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setYear("All")} className={`rounded-full px-4 py-1.5 text-xs font-bold ${year === "All" ? "bg-brand text-white" : "border border-border bg-surface text-brand"}`}>All years</button>
            {years.map((item) => (
              <button key={item} type="button" onClick={() => setYear(item)} className={`rounded-full px-4 py-1.5 text-xs font-bold ${year === item ? "bg-brand text-white" : "border border-border bg-surface text-brand"}`}>{item}</button>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <AchievementsGrid items={filtered} />
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
