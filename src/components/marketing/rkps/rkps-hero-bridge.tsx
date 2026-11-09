import { SCHOOL_STATS, SCHOOL_STATS_NOTE } from "@/content/website/public-site";
import { RkpsCountValue } from "@/components/marketing/rkps/rkps-motion-sections";

export function RkpsHeroBridge() {
  // Figures are filled in by the office; until then a row of dashes reads as broken, so hide the strip.
  if (SCHOOL_STATS.every((stat) => !/\d/.test(String(stat.value)))) return null;
  return (
    <section id="statistics" aria-label="School at a glance" className="relative z-20 scroll-mt-28 rkps-page-x">
      <div className="mx-auto max-w-7xl border-y border-[color-mix(in_srgb,var(--rkps-text-body)_8%,transparent)] bg-[var(--rkps-bg)]">
        <div className="flex flex-wrap items-end justify-between gap-3 px-5 pt-5 sm:px-6">
          <div>
            <span className="rkps-rule" aria-hidden="true" />
            <p className="rkps-text-label mt-3 text-xs">School statistics</p>
            <h2 className="rkps-display mt-1 text-xl text-heading sm:text-2xl">At a glance</h2>
          </div>
          <p className="max-w-md text-xs leading-relaxed text-muted sm:text-sm">{SCHOOL_STATS_NOTE}</p>
        </div>
        <dl className="grid grid-cols-2 sm:grid-cols-4">
          {SCHOOL_STATS.map((stat) => (
            <div
              key={stat.label}
              className="border-[rgba(31,27,22,0.08)] px-5 py-5 sm:border-l sm:px-6 sm:py-6 sm:first:border-l-0"
            >
              <dt className="rkps-text-label-soft text-[12px] leading-4">{stat.label}</dt>
              <dd className="mt-2 text-[28px] font-medium leading-none tabular-nums text-[var(--rkps-text-body)] sm:text-[32px]">
                <RkpsCountValue value={stat.value} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
