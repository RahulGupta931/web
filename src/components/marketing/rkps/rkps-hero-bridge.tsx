import { SCHOOL_STATS } from "@/content/website/public-site";
import { RkpsCountValue } from "@/components/marketing/rkps/rkps-motion-sections";

export function RkpsHeroBridge() {
  return (
    <section aria-label="School at a glance" className="relative z-20 rkps-page-x">
      <div className="mx-auto max-w-7xl border-y border-[color-mix(in_srgb,var(--rkps-text-body)_8%,transparent)] bg-[var(--rkps-bg)]">
        <span className="rkps-rule ml-5 mt-5 sm:ml-6" aria-hidden="true" />
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
