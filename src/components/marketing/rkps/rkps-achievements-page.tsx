import Link from "next/link";
import { RkpsFooter, RkpsHeader } from "@/components/marketing/rkps/rkps-shell";
import { RkpsPageSection, RkpsSectionIntro } from "@/components/marketing/rkps/rkps-marketing-blocks";
import { RkpsStoryHero } from "@/components/marketing/rkps/rkps-motion-sections";
import { ACHIEVEMENTS, featuredAchievements } from "@/content/website/public-site";
import { AchievementCard } from "@/components/marketing/achievement-section";
import { AchievementsArchiveSection } from "@/components/marketing/rkps/rkps-achievements-archive";
import { achievementListGridClass } from "@/lib/achievements-display";
import { BRAND } from "@/config/branding";
import {
  ACHIEVEMENT_THEME_PHOTOS,
  INSTAGRAM_PHOTOS,
  INSTAGRAM_PROFILE,
  instagramPhoto,
} from "@/content/website/instagram-media";

const SHINE_CATEGORIES = [
  { title: "Academic Curiosity", body: "Deep conceptual questions, science exhibitions, and sustained intellectual rigor.", photo: ACHIEVEMENT_THEME_PHOTOS.academic },
  { title: "Sport & Teamwork", body: "Physical resilience, fair play, tactical coordination, and shared team purpose.", photo: ACHIEVEMENT_THEME_PHOTOS.sport },
  { title: "Arts & Expression", body: "Original musical voices, stage presence, visual arts, and theatrical courage.", photo: ACHIEVEMENT_THEME_PHOTOS.arts },
  { title: "Community & Care", body: "Empathy, environmental sustainability initiatives, and social service drives.", photo: ACHIEVEMENT_THEME_PHOTOS.community },
] as const;

const VALUES = [
  {
    title: "Learning Before Labels",
    body: "We celebrate curiosity, questions, and the courage to iterate over superficial rankings or comparisons.",
  },
  {
    title: "Individual & Collective Effort",
    body: "Behind every personal achievement stands an encouraging teacher, a committed family, and supportive peers.",
  },
  {
    title: "Stories Shared with Integrity",
    body: "We publish verified milestones with appropriate permissions, honoring every child's dignity and effort.",
  },
] as const;

const HERO_THUMBS = [instagramPhoto("campus-28.jpg"), instagramPhoto("campus-7.jpg")] as const;
const CTA_PHOTO = instagramPhoto("campus-8.jpg");

function shineCategoryClass(index: number): string {
  if (index === 0) return "lg:col-span-7";
  if (index === 1) return "lg:col-span-5";
  if (index === 2) return "lg:col-span-5";
  return "lg:col-span-7";
}

function galleryTileClass(index: number): string {
  if (index === 0) return "col-span-2 row-span-2 sm:col-span-2 sm:row-span-2";
  if (index % 7 === 3) return "col-span-2 sm:col-span-1";
  if (index % 11 === 6) return "col-span-2 sm:col-span-2";
  return "";
}

export function RkpsAchievementsPage() {
  const featured = featuredAchievements(6);
  const hero = ACHIEVEMENT_THEME_PHOTOS.hero;
  const gallery = INSTAGRAM_PHOTOS.slice(0, 8);

  return (
    <>
      <RkpsHeader
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "School Life", href: "/school-life/student-achievers" },
          { label: "School Achievements" },
        ]}
      />

      <RkpsStoryHero
        slides={[
          {
            photo: hero,
            kicker: "Curiosity · Character · Collective Growth",
            title: "School Achievements",
            accent: "Growing together. Reaching further.",
            body: "Celebrating the academic rigor, creative courage, athletic passion, and teamwork that give achievement its true value — inside and outside the classroom.",
          },
          {
            photo: HERO_THUMBS[0],
            kicker: "School Life & Competitions",
            title: "Many Ways to Shine",
            accent: "Sport, arts, STEM, and community.",
            body: "Moments from our official school life feed. Verified award records and certificate announcements are published regularly.",
          },
          {
            photo: HERO_THUMBS[1],
            kicker: BRAND.motto,
            title: "Proud Milestones",
            accent: "Celebrated by the whole school family.",
            body: "Inter-school debates, science olympiads, athletic championships, and stage galas honoring dedicated effort.",
          },
        ]}
        primary={{ href: "#highlights", label: "Published Highlights" }}
        secondary={{ href: "#archive", label: "Full Achievement Archive" }}
      />

      {/* Sticky In-Page Navigation */}
      <nav className="border-b border-border bg-white sticky top-16 z-20 sm:top-[4.5rem]" aria-label="Page navigation">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto rkps-page-x py-2.5 scrollbar-none">
          <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-muted pr-1">Jump to:</span>
          {[
            { href: "#shine", label: "Ways to Shine" },
            { href: "#gallery", label: "Gallery" },
            { href: "#highlights", label: "Highlights" },
            { href: "#archive", label: "Archive" },
            { href: "#values", label: "Our Approach" },
            { href: "/school-life/student-achievers", label: "Student Achievers ↗" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full border border-border/80 bg-[var(--surface-elevated)] px-3.5 py-1 text-xs font-semibold text-muted transition hover:border-brand/40 hover:bg-brand hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <main>
        {/* Section 01: Many Ways to Shine */}
        <RkpsPageSection id="shine" tone="paper">
          <RkpsSectionIntro
            num="01 · Recognition Pillars"
            title="Many ways to shine"
            description="Excellence takes many shapes at RMPS — intellectual discovery, athletic stamina, creative expression, and community service."
          />
          <ul className="rkps-stagger mt-10 grid gap-5 lg:grid-cols-12">
            {SHINE_CATEGORIES.map(({ title, body, photo }, i) => (
              <li key={title} className={shineCategoryClass(i)} style={{ ["--rkps-i" as string]: i }}>
                <article className="group relative flex h-full min-h-[20rem] flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-[var(--brand-maroon-dark)] shadow-[0_16px_36px_rgba(96,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    loading="lazy"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5"
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/45 to-transparent sm:h-28"
                    aria-hidden
                  />
                  <p className="relative p-5 sm:p-6 text-4xl sm:text-5xl font-black text-white/30" aria-hidden="true">
                    0{i + 1}
                  </p>
                  <div className="relative p-5 sm:p-6 pt-0">
                    <span className="inline-flex rounded-full border border-[var(--brand-gold)]/50 bg-[var(--brand-gold)]/20 px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-wider text-[var(--brand-gold)] backdrop-blur-md">
                      Pillar of Excellence
                    </span>
                    <h3 className="mt-3 text-2xl font-bold tracking-tight text-white group-hover:text-[var(--brand-gold)] transition">
                      {title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/90">{body}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </RkpsPageSection>

        {/* Section 02: Moments Gallery */}
        <RkpsPageSection id="gallery" tone="inset">
          <RkpsSectionIntro
            num="02 · Campus Gallery"
            title="Moments from school life"
            description="Recent milestones, celebrations, and ceremonies shared by our students and staff."
            action={
              <a
                href={INSTAGRAM_PROFILE}
                target="_blank"
                rel="noreferrer"
                className="rkps-btn-gold text-xs sm:text-sm"
              >
                Follow @r.k.m.p.s ↗
              </a>
            }
          />
          <div className="mt-8 grid auto-rows-[minmax(9rem,auto)] grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {gallery.map((photo, i) => (
              <figure
                key={photo.src}
                className={`group relative overflow-hidden rounded-3xl border border-white/20 bg-slate-900 shadow-sm ${galleryTileClass(
                  i,
                )} ${i === 0 ? "min-h-[16rem] sm:min-h-[20rem]" : ""}`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className={`w-full object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${
                    i === 0 ? "absolute inset-0 h-full" : "aspect-[4/3]"
                  }`}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-85 group-hover:opacity-100 transition" />
              </figure>
            ))}
          </div>
        </RkpsPageSection>

        {/* Section 03: Published Highlights */}
        <RkpsPageSection id="highlights" tone="paper">
          <RkpsSectionIntro
            num="03 · Spotlight"
            title="Published achievement highlights"
            description="A curated showcase of recent competition distinctions, academic awards, and team recognitions."
            action={
              <a href="#archive" className="rkps-btn-navy text-xs sm:text-sm">
                Full Archive Below ↓
              </a>
            }
          />
          <ul className="rkps-stagger mt-8 grid gap-5 lg:grid-cols-12">
            {featured.map((a, i) => (
              <li key={a.id} className={achievementListGridClass(i)} style={{ ["--rkps-i" as string]: i }}>
                <AchievementCard item={a} featured={i % 6 === 0} photoIndex={i} />
              </li>
            ))}
          </ul>
        </RkpsPageSection>

        {/* Section 04: Full Archive */}
        <AchievementsArchiveSection items={ACHIEVEMENTS} />

        {/* Section 05: Our Values / Educational Philosophy */}
        <RkpsPageSection id="values" tone="paper" className="border-b-0">
          <RkpsSectionIntro
            num="05 · Our Educational Ethos"
            title="What matters to us"
            description="Behind every medal, cup, and certificate is a meaningful learning journey worth noticing."
          />
          <ul className="rkps-stagger mt-8 grid gap-5 lg:grid-cols-12">
            {VALUES.map((v, i) => (
              <li
                key={v.title}
                className={i === 0 ? "lg:col-span-7" : i === 1 ? "lg:col-span-5" : "lg:col-span-12"}
                style={{ ["--rkps-i" as string]: i }}
              >
                <article
                  className={`flex h-full flex-col justify-between rounded-3xl p-6 sm:p-8 transition duration-300 hover:-translate-y-1 ${
                    i === 0
                      ? "border border-[var(--brand-gold)]/40 bg-gradient-to-br from-[var(--brand-maroon-dark)] to-[var(--brand-maroon)] text-white shadow-xl"
                      : "border border-border/80 bg-[var(--surface-elevated)] text-heading shadow-sm hover:border-brand/30"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-black ${
                        i === 0 ? "bg-[var(--brand-gold)] text-[var(--brand-maroon-dark)]" : "bg-brand/10 text-brand"
                      }`}
                      aria-hidden="true"
                    >
                      0{i + 1}
                    </span>
                    <div>
                      <h3 className={`text-lg font-bold sm:text-xl ${i === 0 ? "text-white" : "text-heading"}`}>
                        {v.title}
                      </h3>
                      <p className={`mt-2 text-xs sm:text-sm leading-relaxed ${i === 0 ? "text-white/85" : "text-muted"}`}>
                        {v.body}
                      </p>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </RkpsPageSection>

        {/* Section 06: Share a Milestone CTA */}
        <div className="mx-auto max-w-7xl rkps-page-x py-14 sm:py-20 space-y-8">
          <RkpsSectionIntro
            num="06 · Share a Milestone"
            title="Every accomplishment tells a story of dedication"
            description="Have a student competition milestone, arts performance, or community project to celebrate? Connect with the school office."
          />

          <section className="relative min-h-[20rem] overflow-hidden rounded-3xl bg-[var(--brand-maroon-dark)] shadow-2xl sm:min-h-[24rem]">
            <img src={CTA_PHOTO.src} alt={CTA_PHOTO.alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-maroon-dark)] via-[var(--brand-maroon-dark)]/85 to-[var(--brand-maroon-dark)]/60" />
            <div className="relative flex min-h-[20rem] max-w-xl flex-col justify-center p-6 sm:p-10 lg:p-12 text-white space-y-3">
              <span className="inline-flex w-fit rounded-full border border-[var(--brand-gold)]/40 bg-[var(--brand-gold)]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--brand-gold)]">
                Share a Milestone
              </span>
              <h2 className="rkps-display text-2xl font-bold tracking-tight text-white sm:text-4xl">
                Everyday progress counts too
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed text-white/90">
                Have a student competition milestone, arts performance, or science project to share? Connect with our administration.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/#contact" className="rkps-btn-gold text-xs sm:text-sm">
                  Contact School Office
                </Link>
                <Link href="/school-life/student-achievers" className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white backdrop-blur-md hover:bg-white/20 transition">
                  Student Achievers ↗
                </Link>
              </div>
            </div>
          </section>

          {/* Quick links */}
          <section className="pt-6 space-y-4">
            <RkpsSectionIntro
              num="Next Steps"
              title="Continue exploring RMPS"
              description="Browse the school noticeboard, verify admissions guidelines, or visit the main campus portal."
            />
            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              <Link
                href="/"
                className="flex items-center justify-between rounded-2xl border border-border/80 bg-[var(--surface-elevated)] p-4 text-sm font-bold text-heading hover:border-brand hover:text-brand transition shadow-sm"
              >
                <span>Return to School Homepage</span>
                <span>→</span>
              </Link>
              <Link
                href="/#noticeboard"
                className="flex items-center justify-between rounded-2xl border border-border/80 bg-[var(--surface-elevated)] p-4 text-sm font-bold text-heading hover:border-brand hover:text-brand transition shadow-sm"
              >
                <span>View School News & Noticeboard</span>
                <span>→</span>
              </Link>
            </div>
          </section>
        </div>
      </main>
      <RkpsFooter />
    </>
  );
}
