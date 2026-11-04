import Link from "next/link";
import { featuredAchievements } from "@/content/website/public-site";
import { AchievementCard } from "@/components/marketing/achievement-section";
import { RkpsPageSection } from "@/components/marketing/rkps/rkps-marketing-blocks";
import { RkpsInView } from "@/components/marketing/rkps/rkps-motion-sections";

const RECOGNITION_PILLARS = [
  { label: "Curiosity", body: "Learning that asks why — and keeps going with intellectual rigor" },
  { label: "Character", body: "Effort, integrity, empathy, and sportsmanship towards others" },
  { label: "Collective Growth", body: "Teams, teachers, and families collaborating behind every win" },
] as const;

export function RkpsRecognitionSection() {
  const items = featuredAchievements(3);
  const [spotlight, ...supporting] = items;

  return (
    <RkpsPageSection id="excellence" tone="paper">
      <RkpsInView>
        <div className="overflow-hidden rounded-[1.75rem] border border-border/80 bg-white shadow-[0_24px_60px_rgba(96,0,0,0.07)] sm:rounded-[2rem]">
          <div className="grid lg:grid-cols-12 lg:items-stretch">
            {/* Intro + pillars */}
            <aside className="order-2 flex flex-col border-b border-border/70 bg-[var(--surface-elevated)] p-6 sm:p-8 lg:order-1 lg:col-span-4 lg:border-b-0 lg:border-r lg:p-10">
              <span className="rkps-rule" aria-hidden="true" />
              <p className="rkps-text-label mt-4 text-xs">Recognition & Milestones</p>
              <h2 className="rkps-display mt-2 text-2xl font-bold tracking-tight text-heading [text-wrap:balance] sm:text-3xl">
                Student achievements in focus
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                Recent milestones from academic olympiads, athletic tournaments, robotics showcases, and creative arts.
              </p>

              <ol className="mt-8 space-y-0 divide-y divide-border/70 rounded-2xl border border-border/80 bg-white">
                {RECOGNITION_PILLARS.map((pillar, index) => (
                  <li key={pillar.label} className="flex gap-3.5 p-4 sm:p-5">
                    <span
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[var(--brand-maroon-dark)] text-xs font-extrabold text-[var(--brand-gold)]"
                      aria-hidden="true"
                    >
                      0{index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-heading">{pillar.label}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted">{pillar.body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-8 flex flex-col gap-2.5 sm:flex-row lg:flex-col">
                <Link href="/school-life/student-achievers" className="rkps-btn-navy rkps-btn-sm w-full justify-center text-center sm:text-sm">
                  Meet Student Achievers ↗
                </Link>
                <Link
                  href="/school-life/achievements"
                  className="rkps-btn-secondary rkps-btn-sm w-full justify-center text-center sm:text-sm"
                >
                  Full Archive
                </Link>
              </div>
            </aside>

            {/* Bento achievements */}
            <div className="order-1 bg-[var(--background)] p-6 sm:p-8 lg:order-2 lg:col-span-8 lg:p-8">
              <div className="mb-5 flex items-end justify-between gap-4 border-b border-border/60 pb-4">
                <div>
                  <p className="rkps-text-label-soft text-xs">Latest highlights</p>
                  <p className="mt-0.5 text-sm font-semibold text-heading">Three recent wins from across campus</p>
                </div>
                <span className="hidden shrink-0 rounded-full border border-[var(--brand-gold)]/40 bg-[var(--brand-gold)]/15 px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-wider text-[var(--brand-maroon-dark)] sm:inline-flex">
                  Session 2026–27
                </span>
              </div>

              <ul className="rkps-stagger grid gap-4 sm:gap-5 lg:grid-cols-12 lg:grid-rows-2 lg:items-stretch lg:gap-5">
                {spotlight ? (
                  <li className="min-h-0 lg:col-span-7 lg:row-span-2" style={{ ["--rkps-i" as string]: 0 }}>
                    <AchievementCard item={spotlight} featured panel photoIndex={0} className="lg:min-h-[28rem]" />
                  </li>
                ) : null}
                {supporting.map((item, index) => (
                  <li
                    key={item.id}
                    className="min-h-0 lg:col-span-5 lg:row-span-1"
                    style={{ ["--rkps-i" as string]: index + 1 }}
                  >
                    <AchievementCard item={item} photoIndex={index + 1} panel className="h-full" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </RkpsInView>
    </RkpsPageSection>
  );
}
