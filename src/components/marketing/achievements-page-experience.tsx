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
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Student & faculty highlights</p>
        <h1 className="mt-2 page-title">Achievements</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          Celebrating academic, sports, arts, and community success at {BRAND.name}. Names appear with school consent;
          photos may be added in a future update.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <label className="text-sm">
            <span className="text-muted">Category</span>
            <select
              className="input-field mt-1 min-w-[10rem]"
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
          <label className="text-sm">
            <span className="text-muted">Year</span>
            <select
              className="input-field mt-1 min-w-[8rem]"
              value={year === "All" ? "All" : String(year)}
              onChange={(e) => {
                const v = e.target.value;
                setYear(v === "All" ? "All" : Number(v));
              }}
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

        <div className="mt-10">
          <AchievementsGrid items={filtered} />
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
