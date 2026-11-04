import { SCHOOL_STATS } from "@/content/website/public-site";
import { RkpsCountValue } from "@/components/marketing/rkps/rkps-motion-sections";

export function RkpsHeroBridge() {
  return (
    <section aria-label="School at a glance" className="relative z-20 -mt-10 rkps-page-x sm:-mt-14 lg:-mt-16">
      <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-3 rounded-[1.75rem] border border-border/80 bg-white p-4 shadow-[0_24px_55px_rgba(96,0,0,0.12)] sm:grid-cols-4 sm:gap-4 sm:p-6 sm:rounded-[2rem] lg:p-8">
        {SCHOOL_STATS.map((stat) => (
          <div
            key={stat.label}
            className="relative rounded-2xl border border-border/60 bg-[var(--surface-elevated)] px-4 py-4 sm:px-5 sm:py-5"
          >
            <span
              className="absolute left-4 top-0 h-0.5 w-8 -translate-y-px rounded-full bg-[var(--brand-gold)] sm:left-5"
              aria-hidden
            />
            <dt className="text-2xl font-extrabold tracking-tight text-[var(--brand-maroon-dark)] tabular-nums sm:text-3xl lg:text-[2rem]">
              <RkpsCountValue value={stat.value} />
            </dt>
            <dd className="mt-1 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted sm:text-xs">
              {stat.label}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
