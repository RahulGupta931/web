import Link from "next/link";
import { featuredAchievements } from "@/content/website/public-site";
import { AchievementCard } from "@/components/marketing/achievement-section";
import { RkpsPageSection, RkpsSectionIntro } from "@/components/marketing/rkps/rkps-marketing-blocks";

const RECOGNITION_PILLARS = [
  { label: "Curiosity", body: "Learning that asks why — and keeps going" },
  { label: "Character", body: "Effort, integrity and respect for others" },
  { label: "Collective growth", body: "Teams, teachers and families behind every win" },
] as const;

export function RkpsRecognitionSection() {
  const items = featuredAchievements(3);

  return (
    <RkpsPageSection id="excellence">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <RkpsSectionIntro
          num="Recognition"
          title="Student achievements"
          description="Recent highlights from competitions, programmes and school life."
        />
        <div className="flex shrink-0 flex-wrap gap-3">
          <Link href="/school-life/student-achievers" className="btn-primary rkps-ease rkps-press px-6 py-2.5">
            Meet student achievers
          </Link>
          <Link href="/school-life/achievements" className="btn-secondary rkps-ease rkps-press px-6 py-2.5">
            Full archive
          </Link>
        </div>
      </div>
      <ol className="mt-8 flex flex-col divide-y divide-border overflow-hidden rounded-[1.25rem] border border-border/80 bg-white sm:flex-row sm:divide-x sm:divide-y-0">
        {RECOGNITION_PILLARS.map((pillar, index) => (
          <li key={pillar.label} className="flex flex-1 gap-3 px-4 py-4">
            <span className="text-2xl font-black leading-none text-[var(--brand-gold)]" aria-hidden>
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="text-sm font-bold text-heading">{pillar.label}</p>
              <p className="mt-1 text-sm leading-snug text-muted">{pillar.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <ul className="rkps-stagger mt-4 grid gap-4 lg:grid-cols-12">
        {items.map((item, index) => (
          <li
            key={item.id}
            className={index === 0 ? "lg:col-span-7" : index === 1 ? "lg:col-span-5" : "lg:col-span-12"}
            style={{ ["--rkps-i" as string]: index }}
          >
            <AchievementCard item={item} featured={index === 0} photoIndex={index} />
          </li>
        ))}
      </ul>
    </RkpsPageSection>
  );
}
