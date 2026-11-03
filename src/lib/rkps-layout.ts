import { achievementListGridClass } from "@/lib/achievements-display";

/** Shared 12-column bento spans for RKPS marketing sections (always sums to 12 per row group). */

/** Standard 1–3 card rows, then cycles achievementListGridClass for longer lists. */
export function rkpsCardGridClass(index: number, total: number): string {
  if (total <= 1) return "lg:col-span-12";
  if (total === 2) {
    return index === 0 ? "lg:col-span-7" : "lg:col-span-5";
  }
  if (total === 3) {
    if (index === 0) return "lg:col-span-7";
    if (index === 1) return "lg:col-span-5";
    return "lg:col-span-12";
  }
  return achievementListGridClass(index);
}

/** Three equal columns (4+4+4) for dense card strips — e.g. honour roll. */
export function rkpsUniformTripleClass(_index: number): string {
  return "lg:col-span-4";
}

/** Gallery mosaic beside sticky sidebar: hero 7×2, two 5s, then 4+4+4 rows. */
export function rkpsGalleryTileClass(index: number): string {
  const mobileHero =
    index === 0 ? "col-span-2 row-span-2 sm:col-span-2 sm:row-span-2" : "";
  if (index === 0) return `${mobileHero} lg:col-span-7 lg:row-span-2`;
  if (index === 1) return "lg:col-span-5";
  if (index === 2) return "lg:col-span-5";
  return rkpsUniformTripleClass(index - 3);
}
