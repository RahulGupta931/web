import Link from "next/link";
import { RKPS_LEARNING } from "@/content/website/rkps-copy";
import { ACADEMIC_STREAMS, ACADEMICS_BANDS } from "@/content/website/public-site";
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
          <Link href="/#contact" className="rkps-btn-navy rkps-btn-sm">
            {cta}
          </Link>
          <Link href="/#admissions" className="rkps-btn-gold rkps-btn-sm">
            Admission enquiry
          </Link>
        </div>
      </div>

      {/* Learning phases — three equal columns */}
      <ul className="rkps-stagger mt-8 grid items-stretch gap-5 md:grid-cols-3">
        {phases.map((phase, index) => {
          const photo = PHASE_PHOTOS[index] ?? PHASE_PHOTOS[0];
          return (
            <li key={phase.title} style={{ ["--rkps-i" as string]: index }}>
              <Link
                href="#contact"
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-white shadow-sm transition-[border-color,box-shadow] duration-150 hover:border-brand/40 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-[var(--brand-gold)] px-2.5 py-0.5 font-mono text-xs tabular-nums text-[var(--brand-maroon-dark)]">
                    Phase 0{index + 1}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <p className="text-xs font-medium text-brand">{phase.tags}</p>
                  <h3 className="rkps-display mt-1 text-xl text-heading transition-colors group-hover:text-brand">
                    {phase.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{phase.body}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand">
                    <span>{phase.link}</span>
                    <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Educational framework — five stages in one row */}
      <div className="mt-12 rounded-2xl border border-border/80 bg-[var(--surface-muted)] p-6 sm:p-8 lg:p-10">
        <p className="text-xs font-medium text-brand">Educational Framework</p>
        <h3 className="rkps-display mt-1 text-2xl text-heading sm:text-3xl">Pre-Primary through Senior Secondary</h3>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {ACADEMICS_BANDS.map((band, index) => (
            <li
              key={band.band}
              className={`flex flex-col rounded-xl border border-white/80 bg-white/95 p-5 shadow-sm ${
                index === ACADEMICS_BANDS.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <span className="font-mono text-xs tabular-nums text-brand">{String(index + 1).padStart(2, "0")}</span>
              <p className="mt-1 text-base font-medium text-heading">{band.band}</p>
              <ul className="mt-3 space-y-1.5 border-t border-border/60 pt-3">
                {band.points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm leading-relaxed text-muted">
                    <span className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-brand" aria-hidden />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>

      {/* Senior secondary streams — three equal columns */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {ACADEMIC_STREAMS.map((stream) => (
          <article key={stream.title} className="flex flex-col rounded-xl border border-border/80 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-xs font-medium text-[var(--rkps-highlight-muted)]">Senior secondary stream</p>
            <h3 className="rkps-display mt-1 text-xl text-heading">{stream.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{stream.body}</p>
          </article>
        ))}
      </div>

      <p className="mt-6 max-w-3xl text-xs leading-relaxed text-muted">{footnote}</p>
    </RkpsPageSection>
  );
}
