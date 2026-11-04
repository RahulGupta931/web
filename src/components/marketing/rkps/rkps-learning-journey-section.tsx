import Link from "next/link";
import { RKPS_LEARNING } from "@/content/website/rkps-copy";
import { ACADEMICS_BANDS } from "@/content/website/public-site";
import { RkpsPageSection, RkpsSectionIntro } from "@/components/marketing/rkps/rkps-marketing-blocks";
import { instagramPhoto } from "@/content/website/instagram-media";

const PHASE_PHOTOS = [
  instagramPhoto("campus-4.jpg"),
  instagramPhoto("campus-19.jpg"),
  instagramPhoto("campus-30.jpg"),
] as const;

export function RkpsLearningJourneySection() {
  const { id, title, subtitle, footnote, phases, cta } = RKPS_LEARNING;

  return (
    <RkpsPageSection id={id} tone="paper">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <RkpsSectionIntro num="Academic Curriculum" title={title} description={subtitle} />
        <div className="flex shrink-0 flex-wrap gap-2.5">
          <Link href="/#contact" className="rkps-btn-navy text-xs sm:text-sm">
            {cta} ↗
          </Link>
          <Link href="/#admissions" className="rkps-btn-gold text-xs sm:text-sm">
            Admission Enquiry
          </Link>
        </div>
      </div>

      <ul className="rkps-stagger mt-8 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {phases.map((phase, index) => {
          const photo = PHASE_PHOTOS[index] ?? PHASE_PHOTOS[0];
          return (
            <li key={phase.title} style={{ ["--rkps-i" as string]: index }}>
              <Link
                href="#contact"
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/80 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-md"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="h-full w-full object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-[var(--brand-gold)] px-2.5 py-0.5 text-[0.625rem] font-extrabold uppercase tracking-wider text-[var(--brand-maroon-dark)] shadow">
                    Phase 0{index + 1}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <p className="text-[0.6875rem] font-bold uppercase tracking-wider text-brand">
                    {phase.tags}
                  </p>
                  <h3 className="rkps-display mt-1 text-lg font-bold text-heading group-hover:text-brand transition">
                    {phase.title}
                  </h3>
                  <p className="mt-2 flex-1 text-xs sm:text-sm leading-relaxed text-muted">
                    {phase.body}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-brand group-hover:translate-x-1 transition">
                    <span>{phase.link}</span>
                    <span>→</span>
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Classes We Teach Grid */}
      <div className="mt-12 rounded-3xl border border-border/80 bg-[var(--surface-muted)] p-6 sm:p-8 lg:p-10">
        <p className="text-xs font-bold uppercase tracking-wider text-brand">Educational Framework</p>
        <h3 className="rkps-display mt-1 text-xl font-bold text-heading sm:text-2xl">
          From Primary Foundation to Senior Secondary
        </h3>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {ACADEMICS_BANDS.map((band) => (
            <li key={band.band} className="rounded-2xl border border-white/80 bg-white/95 p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-lg bg-brand/10 text-xs font-bold text-brand">
                  ★
                </span>
                <p className="text-sm font-bold text-heading">{band.band}</p>
              </div>
              <ul className="mt-3 space-y-1.5 border-t border-border/60 pt-3">
                {band.points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-xs leading-relaxed text-muted sm:text-sm">
                    <span className="text-brand font-bold">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-6 max-w-3xl text-xs leading-relaxed text-muted">{footnote}</p>
    </RkpsPageSection>
  );
}
