"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { RkpsFooter, RkpsHeader } from "@/components/marketing/rkps/rkps-shell";
import { RkpsPageSection, RkpsSectionIntro } from "@/components/marketing/rkps/rkps-marketing-blocks";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { TESTIMONIALS } from "@/content/website/public-site";
import { RkpsStoryHero } from "@/components/marketing/rkps/rkps-motion-sections";
import {
  ACHIEVEMENT_THEME_PHOTOS,
  INSTAGRAM_PROFILE,
  instagramPhoto,
  STUDENT_ACHIEVER_CARD_PHOTOS,
  STUDENT_ACHIEVER_GALLERY,
} from "@/content/website/instagram-media";

const FILTERS = ["All recognition", "Academics", "Sport", "Creativity", "Leadership", "Service", "Personal progress"] as const;

const CARDS = [
  { cat: "Academics" as const, title: "Asking. Exploring. Understanding.", body: "A place to recognise thoughtful inquiry, love for reading, and the commitment to deep intellectual exploration." },
  { cat: "Sport" as const, title: "Playing with purpose.", body: "A place to celebrate consistent practice, resilience, teamwork, and the athlete who lifts everyone up." },
  { cat: "Creativity" as const, title: "Making room for imagination.", body: "A place to honour original artistic ideas, musical expressions, stage performances, and creative storytelling." },
  { cat: "Leadership" as const, title: "Helping others find their voice.", body: "A place to recognise active listening, initiative, empathy, and making inclusive space for peers." },
  { cat: "Service" as const, title: "Kindness made practical.", body: "A place to celebrate environmental stewardship, community care, and selfless contributions to school life." },
  { cat: "Personal progress" as const, title: "A step further than yesterday.", body: "A place to notice persistence, growing confidence, overcoming hurdles, and a courageous first attempt." },
];

const FILTER_TO_CAT: Record<string, (typeof CARDS)[number]["cat"] | null> = {
  "All recognition": null,
  Academics: "Academics",
  Sport: "Sport",
  Creativity: "Creativity",
  Leadership: "Leadership",
  Service: "Service",
  "Personal progress": "Personal progress",
};

const CATEGORY_META: Record<(typeof CARDS)[number]["cat"], { icon: string; badge: string }> = {
  Academics: { icon: "📚", badge: "border-sky-300/40 bg-sky-950/70 text-sky-200" },
  Sport: { icon: "⚽", badge: "border-amber-300/40 bg-amber-950/70 text-amber-200" },
  Creativity: { icon: "🎨", badge: "border-purple-300/40 bg-purple-950/70 text-purple-200" },
  Leadership: { icon: "⭐", badge: "border-[var(--brand-gold)]/50 bg-[#162744]/80 text-[var(--brand-gold)]" },
  Service: { icon: "🌱", badge: "border-emerald-300/40 bg-emerald-950/70 text-emerald-200" },
  "Personal progress": { icon: "🚀", badge: "border-rose-300/40 bg-rose-950/70 text-rose-200" },
};

const HIGHLIGHTS = [
  { label: "Curiosity", value: "Questions that keep learning alive" },
  { label: "Character", value: "Effort, kindness, and integrity" },
  { label: "Community", value: "We rise and thrive together" },
] as const;

const BANNER_MOSAIC = [
  instagramPhoto("campus-8.jpg"),
  instagramPhoto("campus-28.jpg"),
  instagramPhoto("campus-7.jpg"),
] as const;

const GALLERY_PREVIEW = 12;

const ACHIEVERS_FOOTER_LINE =
  "Every learner, their own kind of remarkable. Growth in class, on stage, on the field and in the community — honoured here without comparisons. Curiosity, character, and the people we rise with.";

const ZIGZAG_STORIES = [
  {
    tag: "Curiosity & Inquiry",
    title: "The confidence to keep asking “what if?”",
    kicker: "Perseverance & Innovation",
    body: "From building first working circuits to conducting environmental surveys — our classrooms foster students who dare to test hypotheses, learn from initial trials, and think critically.",
    photo: ACHIEVEMENT_THEME_PHOTOS.featuredStory,
  },
  {
    tag: "Athletics & Performing Arts",
    title: "Room to perform, compete & celebrate",
    kicker: "Stage · Track · Festival",
    body: "From inter-house sports tournaments to annual theatre productions — we notice courage, teamwork, and the quiet dedication behind every rehearsal and practice drill.",
    photo: ACHIEVEMENT_THEME_PHOTOS.arts,
  },
  {
    tag: "Kindness & Citizenship",
    title: "Wins we share as one united family",
    kicker: "Belonging & Service",
    body: "Peer mentoring, green campus initiatives, and everyday gestures of empathy — recognition at RMPS shines equally bright on the small moments that make our community warm.",
    photo: ACHIEVEMENT_THEME_PHOTOS.community,
  },
] as const;

function recognitionGridClass(index: number, total: number): string {
  if (total === 1) return "lg:col-span-12";
  if (total === 2) return index === 0 ? "lg:col-span-7" : "lg:col-span-5";
  const mod = index % 6;
  if (mod === 0) return "lg:col-span-7";
  if (mod === 1) return "lg:col-span-5";
  if (mod === 2) return "lg:col-span-5";
  if (mod === 3) return "lg:col-span-7";
  if (mod === 4) return "lg:col-span-8";
  return "lg:col-span-4";
}

function StoryPanel({
  story,
  reverse,
}: {
  story: (typeof ZIGZAG_STORIES)[number];
  reverse?: boolean;
}) {
  return (
    <article className="grid items-center gap-6 lg:grid-cols-12 lg:gap-8">
      <figure
        className={`overflow-hidden rounded-3xl border border-white/20 shadow-xl lg:col-span-7 ${
          reverse ? "lg:order-2" : "lg:order-1"
        }`}
      >
        <img
          src={story.photo.src}
          alt={story.photo.alt}
          className="aspect-[16/10] w-full object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105"
          loading="lazy"
        />
      </figure>
      <div
        className={`rounded-3xl border border-border/80 bg-white/95 p-6 sm:p-8 lg:p-10 shadow-md backdrop-blur-md lg:col-span-5 ${
          reverse ? "lg:order-1" : "lg:order-2"
        }`}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand">
          <span>★</span>
          <span>{story.tag}</span>
        </span>
        <h3 className="rkps-display mt-3 text-2xl font-bold leading-snug tracking-tight text-heading sm:text-3xl">
          {story.title}
        </h3>
        <p className="mt-1 text-sm font-semibold text-[var(--brand-maroon)]">{story.kicker}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{story.body}</p>
      </div>
    </article>
  );
}

function RecognitionCard({
  card,
  index,
  featured,
}: {
  card: (typeof CARDS)[number];
  index: number;
  featured: boolean;
}) {
  const photo = STUDENT_ACHIEVER_CARD_PHOTOS[card.cat];
  const meta = CATEGORY_META[card.cat];

  return (
    <article
      className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-[var(--brand-maroon-dark)] shadow-[0_16px_36px_rgba(96,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        featured ? "min-h-[22rem] sm:min-h-[26rem] lg:min-h-[30rem]" : "min-h-[18rem] sm:min-h-[22rem]"
      }`}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/45 to-transparent sm:h-28"
        aria-hidden
      />

      {/* Card Header */}
      <div className="relative z-10 flex items-start justify-between gap-3 p-5 sm:p-6">
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md ${meta.badge}`}>
          <span>{meta.icon}</span>
          <span>{card.cat}</span>
        </span>
        <span className="text-3xl sm:text-4xl font-black text-white/30" aria-hidden="true">
          0{index + 1}
        </span>
      </div>

      {/* Card Footer Content */}
      <div className="relative z-10 max-w-xl p-5 sm:p-6 pt-0">
        <h3 className="text-xl font-bold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)] sm:text-2xl lg:text-3xl group-hover:text-[var(--brand-gold)] transition">
          {card.title}
        </h3>
        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/90">
          {card.body}
        </p>
      </div>
    </article>
  );
}

export function RkpsStudentAchieversPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All recognition");
  const [galleryExpanded, setGalleryExpanded] = useState(false);
  const cat = FILTER_TO_CAT[filter];
  const visible = cat ? CARDS.filter((c) => c.cat === cat) : CARDS;
  const pageHero = ACHIEVEMENT_THEME_PHOTOS.hero;
  const ctaPhoto = instagramPhoto("campus-28.jpg");

  const galleryPhotos = useMemo(
    () => (galleryExpanded ? STUDENT_ACHIEVER_GALLERY : STUDENT_ACHIEVER_GALLERY.slice(0, GALLERY_PREVIEW)),
    [galleryExpanded],
  );

  return (
    <>
      <RkpsHeader breadcrumb={[{ label: "Home", href: "/" }, { label: "School Life" }, { label: "Student Achievers" }]} />

      <RkpsStoryHero
        slides={[
          {
            photo: pageHero,
            kicker: "School Life · Celebrating Growth Without Rankings",
            title: "Student Achievers",
            accent: "Every learner, their own kind of remarkable.",
            body: "Growth in classrooms, on stage, in sports arenas, and throughout our community — honoured here with respect, encouragement, and genuine joy.",
          },
          {
            photo: BANNER_MOSAIC[1],
            kicker: HIGHLIGHTS[0].label,
            title: HIGHLIGHTS[0].value,
            accent: "Questions that inspire lifelong discovery.",
            body: "Everyday inquiry, hands-on experiments, and the curiosity to look deeper into the world around us.",
          },
          {
            photo: BANNER_MOSAIC[2],
            kicker: HIGHLIGHTS[2].label,
            title: "We Rise and Thrive Together",
            accent: HIGHLIGHTS[2].value,
            body: "Effort, collaboration, and sportsmanship celebrated across every grade without comparisons or labels.",
          },
        ]}
        primary={{ href: "#recognition", label: "Explore Recognition Areas" }}
        secondary={{ href: INSTAGRAM_PROFILE, label: "@r.k.m.p.s on Instagram", external: true }}
      />

      {/* Sticky Quick Nav */}
      <nav className="border-b border-border bg-white sticky top-16 z-20 sm:top-[4.5rem]" aria-label="Page navigation">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto rkps-page-x py-2.5 scrollbar-none">
          <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-muted pr-1">Jump to:</span>
          {[
            { href: "#featured", label: "Stories" },
            { href: "#recognition", label: "Recognition Areas" },
            { href: "#voices", label: "Voices" },
            { href: "#gallery", label: "Gallery" },
            { href: "/school-life/events", label: "School Events ↗" },
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
        {/* Section 01: Featured Stories */}
        <RkpsPageSection id="featured" tone="paper">
          <RkpsSectionIntro
            num="01 · Inspiring Moments"
            title="Stories worth celebrating"
            description="Moments from daily school life highlighting perseverance, creative courage, and community empathy."
          />
          <div className="mt-8 space-y-12 sm:space-y-16 lg:space-y-20">
            {ZIGZAG_STORIES.map((story, index) => (
              <StoryPanel key={story.title} story={story} reverse={index % 2 === 1} />
            ))}
          </div>
        </RkpsPageSection>

        {/* Section 02: Recognition Categories */}
        <RkpsPageSection id="recognition" tone="inset">
          <RkpsSectionIntro
            num="02 · Recognition Areas"
            title="Many talents. Many journeys."
            description="Filter by area of growth. We honour effort, creativity, teamwork, leadership, and personal bests."
            action={
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">
                {visible.length} {visible.length === 1 ? "area" : "areas"} displayed
              </span>
            }
          />

          {/* Filter Pills */}
          <div className="mt-8 rounded-3xl border border-border/80 bg-white p-3 sm:p-4 shadow-sm">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none -mx-1 px-1">
              <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-muted pr-1">Area:</span>
              {FILTERS.map((f) => {
                const active = filter === f;
                return (
                  <button
                    key={f}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(f)}
                    className={`rkps-pill-tab shrink-0 ${
                      active
                        ? "bg-[var(--brand-maroon-dark)] text-white shadow-md"
                        : "border border-border/80 bg-[var(--surface-elevated)] text-heading hover:border-brand/40 hover:text-brand"
                    }`}
                  >
                    <span>{f}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cards Grid */}
          <ul className="rkps-stagger mt-8 grid gap-5 lg:grid-cols-12">
            {visible.map((c, i) => (
              <li key={c.title} className={recognitionGridClass(i, visible.length)} style={{ ["--rkps-i" as string]: i }}>
                <RecognitionCard card={c} index={i} featured={visible.length > 1 && (i % 6 === 0 || i % 6 === 3)} />
              </li>
            ))}
          </ul>
        </RkpsPageSection>

        {/* Section 03: School Voices */}
        <section id="voices" className="bg-white py-14 sm:py-20 scroll-mt-28 border-b border-border/80" aria-label="School voices">
          <div className="mx-auto max-w-7xl rkps-page-x mb-8">
            <RkpsSectionIntro
              num="03 · Community Voices"
              title="From our students, faculty & community"
              description="Reflections on curiosity, sportsmanship, and growth from members of the RMPS family."
            />
          </div>
          <AnimatedTestimonials
            testimonials={TESTIMONIALS.map((item, index) => ({
              quote: item.quote,
              name: item.name,
              designation: item.role,
              src: [instagramPhoto("campus-8.jpg"), instagramPhoto("campus-19.jpg"), instagramPhoto("campus-22.jpg")][index].src,
            }))}
          />
        </section>

        {/* Section 04: Photo Gallery */}
        <RkpsPageSection id="gallery" tone="paper">
          <RkpsSectionIntro
            num="04 · Photo Gallery"
            title="Moments from @r.k.m.p.s"
            description="Celebrations, performances, project presentations, and awards captured in our living album."
            action={
              <a
                href={INSTAGRAM_PROFILE}
                target="_blank"
                rel="noreferrer"
                className="rkps-btn-gold text-xs sm:text-sm"
              >
                Open Instagram ↗
              </a>
            }
          />

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {galleryPhotos.map((photo) => (
              <figure key={photo.src} className="group relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-900 shadow-md">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="h-full w-full object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-85 group-hover:opacity-100 transition" />
                <figcaption className="absolute inset-x-0 bottom-0 p-3 text-xs font-medium text-white line-clamp-2">
                  {photo.alt}
                </figcaption>
              </figure>
            ))}
          </div>

          {STUDENT_ACHIEVER_GALLERY.length > GALLERY_PREVIEW && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setGalleryExpanded((v) => !v)}
                className="rkps-btn-navy text-xs sm:text-sm"
              >
                {galleryExpanded ? "Show Fewer Photos ↑" : `Show All ${STUDENT_ACHIEVER_GALLERY.length} Photos ↓`}
              </button>
            </div>
          )}
        </RkpsPageSection>

        {/* Section 05: Call to action block */}
        <div className="mx-auto max-w-7xl rkps-page-x py-14 sm:py-20 space-y-8">
          <RkpsSectionIntro
            num="05 · Growth Beyond Medals"
            title="Celebrating every child's courage and daily effort"
            description="Everyday wins matter. First attempts and quiet progress are celebrated here without ranking or comparisons."
          />

          <section className="relative min-h-[20rem] overflow-hidden rounded-3xl bg-[var(--brand-maroon-dark)] shadow-2xl sm:min-h-[24rem]">
            <img src={ctaPhoto.src} alt={ctaPhoto.alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-maroon-dark)] via-[var(--brand-maroon-dark)]/85 to-[var(--brand-maroon-dark)]/60" />
            <div className="relative flex min-h-[20rem] max-w-xl flex-col justify-center p-6 sm:p-10 lg:p-12 text-white space-y-3">
              <span className="inline-flex w-fit rounded-full border border-[var(--brand-gold)]/40 bg-[var(--brand-gold)]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--brand-gold)]">
                Everyday Progress Counts
              </span>
              <h2 className="rkps-display text-2xl font-bold tracking-tight text-white sm:text-4xl">
                Not every achievement comes with a medal
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed text-white/90">
                First attempts, quiet courage, curiosity, and kindness — we celebrate every meaningful step our students take.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/#contact" className="rkps-btn-gold text-xs sm:text-sm">
                  Contact School Office
                </Link>
                <Link href="/school-life/events" className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white backdrop-blur-md hover:bg-white/20 transition">
                  School Events Calendar ↗
                </Link>
              </div>
            </div>
          </section>

          {/* Quick links footer */}
          <section className="pt-6 space-y-4">
            <RkpsSectionIntro
              num="More Resources"
              title="Explore deeper into school life"
              description="Discover our full events calendar, verified competitive records, and main campus gateway."
            />
            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              <Link
                href="/school-life/achievements"
                className="flex items-center justify-between rounded-2xl border border-border/80 bg-[var(--surface-elevated)] p-4 text-sm font-bold text-heading hover:border-brand hover:text-brand transition shadow-sm"
              >
                <span>Explore School Achievements Archive</span>
                <span>→</span>
              </Link>
              <Link
                href="/"
                className="flex items-center justify-between rounded-2xl border border-border/80 bg-[var(--surface-elevated)] p-4 text-sm font-bold text-heading hover:border-brand hover:text-brand transition shadow-sm"
              >
                <span>Return to School Homepage</span>
                <span>→</span>
              </Link>
            </div>
          </section>
        </div>
      </main>
      <RkpsFooter prefooter={ACHIEVERS_FOOTER_LINE} />
    </>
  );
}
