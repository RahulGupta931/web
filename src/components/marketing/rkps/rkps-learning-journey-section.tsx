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
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <RkpsSectionIntro num="Academics" title={title} description={subtitle} />
        <div className="flex shrink-0 flex-wrap gap-3">
          <Link href="/#contact" className="btn-primary rkps-ease rkps-press px-6 py-2.5">
            {cta}
          </Link>
          <Link href="/#admissions" className="btn-secondary rkps-ease rkps-press px-6 py-2.5">
            Admission enquiry
          </Link>
        </div>
      </div>
      <ul className="rkps-stagger mt-8 grid gap-4 lg:grid-cols-3">
        {phases.map((phase, index) => {
          const photo = PHASE_PHOTOS[index] ?? PHASE_PHOTOS[0];
          return (
            <li key={phase.title} style={{ ["--rkps-i" as string]: index }}>
              <Link
                href="#contact"
                className="rkps-ease rkps-press group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-border/80 bg-surface shadow-[var(--shadow-card)] hover:-translate-y-0.5 hover:border-brand/25"
              >
                <img src={photo.src} alt={photo.alt} className="aspect-[16/10] w-full object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" loading="lazy" />
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-brand">
                    {String(index + 1).padStart(2, "0")} · {phase.tags}
                  </p>
                  <h3 className="rkps-display mt-2 text-lg font-semibold text-heading group-hover:text-brand">{phase.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{phase.body}</p>
                  <p className="mt-4 text-sm font-semibold text-brand">{phase.link} ↗</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-8 border-t border-border/80 pt-8">
        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-brand">Classes we teach</p>
        <h3 className="rkps-display mt-1 text-xl font-semibold text-heading">From primary years to senior secondary</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {ACADEMICS_BANDS.map((band) => (
            <li key={band.band} className="rounded-2xl border border-border/80 bg-surface p-4">
              <p className="text-sm font-semibold text-heading">{band.band}</p>
              <ul className="mt-2 space-y-1">
                {band.points.map((point) => (
                  <li key={point} className="text-sm leading-snug text-muted">
                    {point}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-5 max-w-3xl text-xs leading-relaxed text-muted">{footnote}</p>
    </RkpsPageSection>
  );
}
