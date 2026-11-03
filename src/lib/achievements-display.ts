import type { Achievement, AchievementCategory } from "@/content/website/public-site";

export const ACHIEVEMENT_CATEGORIES: AchievementCategory[] = [
  "Academic",
  "Sports",
  "Arts",
  "STEM",
  "Leadership",
  "Community",
];

/** Asymmetric 12-col spans for marketing achievement lists (variance 8). */
export function achievementListGridClass(index: number): string {
  const mod = index % 6;
  if (mod === 0) return "lg:col-span-7";
  if (mod === 1) return "lg:col-span-5";
  if (mod === 2) return "lg:col-span-5";
  if (mod === 3) return "lg:col-span-7";
  if (mod === 4) return "lg:col-span-8";
  return "lg:col-span-4";
}

export function filterAchievements(
  items: Achievement[],
  opts: { category?: AchievementCategory | "All"; year?: number | "All" }
): Achievement[] {
  return items.filter((a) => {
    if (opts.category && opts.category !== "All" && a.category !== opts.category) return false;
    if (opts.year && opts.year !== "All" && a.year !== opts.year) return false;
    return true;
  });
}

export function achievementYears(items: Achievement[]): number[] {
  return [...new Set(items.map((a) => a.year))].sort((a, b) => b - a);
}

export function formatAchievementDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function categoryBadgeClass(category: AchievementCategory): string {
  const map: Record<AchievementCategory, string> = {
    Academic: "bg-brand/10 text-brand",
    Sports: "bg-emerald-500/15 text-emerald-900",
    Arts: "bg-violet-500/15 text-violet-900",
    STEM: "bg-sky-500/15 text-sky-900",
    Leadership: "bg-amber-500/15 text-amber-900",
    Community: "bg-teal-500/15 text-teal-900",
  };
  return map[category];
}
