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
  { title: "Academic curiosity", body: "Questions, ideas and learning that goes deeper.", photo: ACHIEVEMENT_THEME_PHOTOS.academic },
  { title: "Sport & teamwork", body: "Determination, fair play and shared purpose.", photo: ACHIEVEMENT_THEME_PHOTOS.sport },
  { title: "Arts & expression", body: "Original voices and the courage to create.", photo: ACHIEVEMENT_THEME_PHOTOS.arts },
  { title: "Community & care", body: "Small acts that make a meaningful difference.", photo: ACHIEVEMENT_THEME_PHOTOS.community },
] as const;

const VALUES = [
  {
    title: "Learning before labels",
    body: "Recognise curiosity, thoughtful questions and the willingness to try again.",
  },
  {
    title: "Individual and collective effort",
    body: "Make space for the learner, the team and the community behind the work.",
  },
  {
    title: "Stories shared with care",
    body: "Publish verified details and appropriate permissions; celebrate without comparing children.",
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
          { label: "School life", href: "/school-life/student-achievers" },
          { label: "School achievements" },
        ]}
      />

      <RkpsStoryHero
        slides={[
          {
            photo: hero,
            kicker: "Curiosity · Character · Collective growth",
            title: "School achievements",
            accent: "Growing together. Going further.",
            body: "Celebrating the learning, teamwork and care that give achievement its meaning — in the classroom and far beyond it.",
          },
          {
            photo: HERO_THUMBS[0],
            kicker: "School life",
            title: "Many ways to shine",
            accent: "Sport, art and community.",
            body: "Photos from our official Instagram. Names and recognition details appear after school confirmation.",
          },
          {
            photo: HERO_THUMBS[1],
            kicker: BRAND.motto,
            title: "Proud moments",
            accent: "Shared by the whole school.",
            body: "Programmes, performances and the everyday effort behind every celebration.",
          },
        ]}
        primary={{ href: "#highlights", label: "Published highlights" }}
        secondary={{ href: "#archive", label: "Full archive" }}
      />
      <nav className="border-b border-border bg-surface" aria-label="On this page">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 scrollbar-none sm:px-6">
          {[
            { href: "#shine", label: "Many ways to shine" },
            { href: "#gallery", label: "Gallery" },
            { href: "#highlights", label: "Highlights" },
            { href: "#archive", label: "Archive" },
            { href: "/school-life/student-achievers", label: "Student achievers" },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold text-brand hover:bg-brand/5">
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <main>
        <RkpsPageSection id="shine">
          <RkpsSectionIntro
            num="01 · Recognition"
            title="Many ways to shine"
            description="Achievement has more than one shape — academic, creative, athletic and community-minded."
          />
          <ul className="rkps-stagger mt-10 grid gap-4 lg:grid-cols-12">
            {SHINE_CATEGORIES.map(({ title, body, photo }, i) => (
              <li key={title} className={shineCategoryClass(i)} style={{ ["--rkps-i" as string]: i }}>
                <article className="rkps-ease group relative flex h-full min-h-[20rem] flex-col justify-between overflow-hidden rounded-[1.75rem] bg-[var(--brand-maroon-dark)] shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[var(--brand-maroon-dark)]/55" />
                  <p className="relative p-5 text-4xl font-black leading-none text-white/30" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <div className="relative p-5 sm:p-6">
                    <h3 className="text-2xl font-bold tracking-tight text-white">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/90">{body}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </RkpsPageSection>

        <RkpsPageSection id="gallery" tone="paper">
          <RkpsSectionIntro
            num="02 · Gallery"
            title="Moments from school life"
            description="Recent celebrations and performances shared on Instagram."
            action={
              <a href={INSTAGRAM_PROFILE} target="_blank" rel="noreferrer" className="rkps-btn-ghost shrink-0 text-sm">
                Open @r.k.m.p.s ↗
              </a>
            }
          />
          <div className="mt-8 grid auto-rows-[minmax(8rem,auto)] grid-cols-2 gap-3 sm:grid-cols-4">
            {gallery.map((photo, i) => (
              <figure
                key={photo.src}
                className={`rkps-ease group relative overflow-hidden rounded-[1.25rem] bg-[var(--brand-maroon-dark)] shadow-[var(--shadow-card)] ${galleryTileClass(i)} ${i === 0 ? "min-h-[16rem]" : ""}`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className={`w-full object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${i === 0 ? "absolute inset-0 h-full" : "aspect-[4/3]"}`}
                  loading="lazy"
                />
              </figure>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-xs leading-relaxed text-muted">
            Names, recognition details and event schedules will be published after school confirmation. Source:{" "}
            <a href={INSTAGRAM_PROFILE} className="font-semibold text-brand hover:underline" target="_blank" rel="noreferrer">
              instagram.com/r.k.m.p.s
            </a>
          </p>
        </RkpsPageSection>

        <RkpsPageSection id="highlights">
          <RkpsSectionIntro
            num="03 · Highlights"
            title="Published highlights"
            description="A snapshot of recent school-wide recognition — filter the full archive below for every entry."
            action={
              <a href="#archive" className="rkps-btn-ghost shrink-0 text-sm">
                Full archive ↗
              </a>
            }
          />
          <ul className="rkps-stagger mt-8 grid gap-4 lg:grid-cols-12">
            {featured.map((a, i) => (
              <li key={a.id} className={achievementListGridClass(i)} style={{ ["--rkps-i" as string]: i }}>
                <AchievementCard item={a} featured={i % 6 === 0} photoIndex={i} />
              </li>
            ))}
          </ul>
        </RkpsPageSection>

        <AchievementsArchiveSection items={ACHIEVEMENTS} />

        <RkpsPageSection id="values" tone="paper" className="border-b-0">
          <RkpsSectionIntro
            num="05 · Our approach"
            title="What matters to us"
            description="Behind every milestone, a journey worth noticing."
          />
          <ul className="rkps-stagger mt-10 grid gap-4 lg:grid-cols-12">
            {VALUES.map((v, i) => (
              <li
                key={v.title}
                className={i === 0 ? "lg:col-span-7" : i === 1 ? "lg:col-span-5 lg:mt-10" : "lg:col-span-12 lg:max-w-3xl"}
                style={{ ["--rkps-i" as string]: i }}
              >
                <article
                  className={`rkps-ease flex h-full gap-5 rounded-[1.5rem] p-6 shadow-[var(--shadow-card)] transition hover:-translate-y-1 lg:p-8 ${
                    i === 0 ? "bg-[var(--brand-maroon-dark)] text-white" : "border border-border/80 bg-white"
                  }`}
                >
                  <span className="text-3xl font-black leading-none text-[var(--brand-gold)]" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className={`text-lg font-bold ${i === 0 ? "text-white" : "text-heading"}`}>{v.title}</h3>
                    <p className={`mt-3 text-sm leading-relaxed ${i === 0 ? "text-white/85" : "text-muted"}`}>{v.body}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </RkpsPageSection>

        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <section className="scroll-mt-28 relative min-h-[22rem] overflow-hidden rounded-[1.75rem] bg-[var(--brand-maroon-dark)] shadow-[var(--shadow-card)]">
            <img src={CTA_PHOTO.src} alt={CTA_PHOTO.alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-[var(--brand-maroon-dark)]/70" aria-hidden />
            <div className="relative flex min-h-[22rem] max-w-xl flex-col justify-end p-8 text-white sm:p-12">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[var(--brand-gold)]">Share a story</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Everyday progress counts too</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/90">
                Have a celebration to share or a question about recognition? The school office is the best place to start.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/#contact" className="rkps-ease rkps-press inline-flex rounded-lg bg-[var(--brand-gold)] px-5 py-2.5 text-sm font-bold text-[var(--brand-maroon-dark)]">
                  Contact the school
                </Link>
                <Link href="/school-life/student-achievers" className="rkps-ease rkps-press inline-flex rounded-lg border border-white/40 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10">
                  Student achievers
                </Link>
              </div>
            </div>
          </section>

          <div className="mt-10 flex flex-wrap gap-4 pb-4">
            <Link href="/" className="rkps-btn-ghost">
              Back to home ↗
            </Link>
            <Link href="/#noticeboard" className="rkps-btn-ghost">
              News & notices ↗
            </Link>
          </div>
        </div>
      </main>
      <RkpsFooter />
    </>
  );
}
