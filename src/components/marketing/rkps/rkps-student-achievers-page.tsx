"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { RkpsFooter, RkpsHeader } from "@/components/marketing/rkps/rkps-shell";
import {
  RkpsQuickJumpNav,
} from "@/components/marketing/rkps/rkps-marketing-blocks";
import { RkpsScrollProgress, RkpsScrollReveal } from "@/components/marketing/rkps/rkps-scroll-sections";
import { PictureRailGallery } from "@/components/ui/picture-rail-gallery";
import { TESTIMONIALS } from "@/content/website/public-site";
import { RkpsStoryHero } from "@/components/marketing/rkps/rkps-motion-sections";
import {
  ACHIEVEMENT_THEME_PHOTOS,
  INSTAGRAM_PROFILE,
  instagramPhoto,
  STUDENT_ACHIEVER_CARD_PHOTOS,
  STUDENT_ACHIEVER_GALLERY,
} from "@/content/website/instagram-media";
import { photosToPictureRailItems } from "@/content/website/rkps-picture-rail";

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

const ACHIEVERS_FOOTER_LINE =
  "Every learner, their own kind of remarkable. Growth in class, on stage, on the field and in the community — honoured here without comparisons.";

const FEATURED_STORIES = [
  {
    short: "Curiosity",
    tag: "Curiosity & inquiry",
    title: "The confidence to keep asking “what if?”",
    kicker: "Perseverance & innovation",
    body: "From building first working circuits to conducting environmental surveys — our classrooms foster students who dare to test hypotheses, learn from initial trials, and think critically.",
    photos: [ACHIEVEMENT_THEME_PHOTOS.featuredStory, instagramPhoto("campus-19.jpg"), instagramPhoto("campus-24.jpg")],
  },
  {
    short: "Stage",
    tag: "Athletics & performing arts",
    title: "Room to perform, compete & celebrate",
    kicker: "Stage · track · festival",
    body: "From inter-house sports tournaments to annual theatre productions — we notice courage, teamwork, and the quiet dedication behind every rehearsal and practice drill.",
    photos: [ACHIEVEMENT_THEME_PHOTOS.arts, instagramPhoto("campus-28.jpg"), instagramPhoto("campus-5.jpg")],
  },
  {
    short: "Belonging",
    tag: "Kindness & citizenship",
    title: "Wins we share as one united family",
    kicker: "Belonging & service",
    body: "Peer mentoring, green campus initiatives, and everyday gestures of empathy — recognition at RMPS shines equally bright on the small moments that make our community warm.",
    photos: [ACHIEVEMENT_THEME_PHOTOS.community, instagramPhoto("campus-36.jpg"), instagramPhoto("campus-9.jpg")],
  },
] as const;

const VOICE_PHOTOS = [instagramPhoto("campus-8.jpg"), instagramPhoto("campus-19.jpg"), instagramPhoto("campus-22.jpg")] as const;

const DESTINATIONS = [
  {
    href: "/school-life/events",
    label: "Calendar",
    title: "Events & galas",
    description: "Programmes, festivals, and sports across the year.",
  },
  {
    href: "/school-life/achievements",
    label: "Archive",
    title: "School achievements",
    description: "Verified competition records and milestones.",
  },
  {
    href: "/",
    label: "Home",
    title: "Main portal",
    description: "Return to the school landing page.",
  },
] as const;

const SECTION = "scroll-mt-28 bg-[var(--rkps-bg)] py-16 text-[var(--rkps-text-body)] sm:py-20 lg:py-28";
const DIVIDER = "border-t border-[color-mix(in_srgb,var(--rkps-text-body)_8%,transparent)]";
const TEXT_LINK =
  "text-sm text-brand underline decoration-brand/25 underline-offset-4 transition-colors hover:decoration-brand";

function StoryPhotoGrid({ photos }: { photos: readonly { src: string; alt: string }[] }) {
  const [lead, ...rest] = photos;
  if (!lead) return null;
  return (
    <div className="grid h-full min-h-[16rem] grid-rows-[minmax(0,1.55fr)_minmax(0,1fr)] gap-2 overflow-hidden sm:min-h-[18rem] lg:min-h-0 lg:h-full">
      <figure className="relative min-h-[10rem] overflow-hidden rounded-2xl border border-border/60 sm:min-h-[12rem] lg:min-h-0">
        <img src={lead.src} alt={lead.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" aria-hidden />
      </figure>
      <div className="grid min-h-0 grid-cols-2 gap-2">
        {rest.map((photo) => (
          <figure key={photo.src} className="relative min-h-[5.5rem] overflow-hidden rounded-xl border border-border/60 sm:min-h-[6rem] lg:min-h-0">
            <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
          </figure>
        ))}
      </div>
    </div>
  );
}

function StoryPicker({
  activeIndex,
  onSelect,
  layout,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
  layout: "column" | "row";
}) {
  return (
    <div
      role="tablist"
      aria-label="Stories worth celebrating"
      className={
        layout === "row"
          ? "flex gap-6 overflow-x-auto border-b border-[color-mix(in_srgb,var(--rkps-text-body)_12%,transparent)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          : "flex flex-col border-t border-[color-mix(in_srgb,var(--rkps-text-body)_12%,transparent)]"
      }
    >
      {FEATURED_STORIES.map((story, index) => {
        const selected = index === activeIndex;
        return (
          <button
            key={story.title}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls="rkps-achiever-story-panel"
            id={`rkps-achiever-story-tab-${layout}-${index}`}
            onClick={() => onSelect(index)}
            className={`flex shrink-0 items-baseline gap-3 text-left text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rkps-primary)] ${
              layout === "row"
                ? `-mb-px border-b-2 pb-3 ${selected ? "border-[var(--rkps-primary)]" : "border-transparent"}`
                : "w-full border-b border-[color-mix(in_srgb,var(--rkps-text-body)_12%,transparent)] py-4"
            } ${selected ? "font-medium text-heading" : "text-muted hover:text-heading"}`}
          >
            <span className={`font-mono text-xs tabular-nums ${selected ? "text-brand" : "text-muted"}`}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="leading-snug">{story.short}</span>
            {layout === "column" && selected ? (
              <span className="ml-auto text-brand" aria-hidden>
                →
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function recognitionCellClass(index: number, total: number, featured: boolean): string {
  if (featured) {
    if (total === 1) return "lg:col-span-12 lg:row-span-2";
    return "lg:col-span-7 lg:row-span-2";
  }
  if (total === 2) return "lg:col-span-5";
  if (index <= 2) return "lg:col-span-5";
  return "lg:col-span-4";
}

function RecognitionCard({
  card,
  index,
  featured,
}: {
  card: (typeof CARDS)[number];
  index: number;
  featured?: boolean;
}) {
  const photo = STUDENT_ACHIEVER_CARD_PHOTOS[card.cat];
  const n = String(index + 1).padStart(2, "0");

  if (featured) {
    return (
      <article className="group relative min-h-[18rem] overflow-hidden rounded-[1.25rem] border border-border/80 bg-[var(--rkps-charcoal)] sm:min-h-[22rem] lg:h-full lg:min-h-[28rem]">
        <img src={photo.src} alt={photo.alt} className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]" loading="lazy" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-[var(--brand-gold)]">{card.cat}</p>
            <span className="font-mono text-sm tabular-nums text-[var(--brand-gold)]">{n}</span>
          </div>
          <h3 className="rkps-display text-2xl leading-snug text-white sm:text-3xl">{card.title}</h3>
          <p className="max-w-[42ch] text-sm leading-relaxed text-white/80 sm:text-[0.9375rem]">{card.body}</p>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative flex min-h-[11rem] overflow-hidden rounded-2xl border border-border/80 bg-[var(--rkps-charcoal)] lg:h-full">
      <img src={photo.src} alt={photo.alt} className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]" loading="lazy" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" aria-hidden />
      <div className="relative mt-auto flex w-full flex-col gap-1 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[0.625rem] font-medium uppercase tracking-[0.18em] text-[var(--brand-gold)]">{card.cat}</p>
          <span className="font-mono text-xs tabular-nums text-[var(--brand-gold)]">{n}</span>
        </div>
        <h3 className="rkps-display text-lg leading-snug text-white sm:text-xl">{card.title}</h3>
        <p className="line-clamp-2 text-xs leading-relaxed text-white/75 sm:text-sm">{card.body}</p>
      </div>
    </article>
  );
}

function CommunityVoices({
  voices,
}: {
  voices: readonly { quote: string; name: string; role: string; src: string; alt: string }[];
}) {
  const [active, setActive] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const count = voices.length;
  const current = voices[active] ?? voices[0];

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduceMotion || count < 2) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % count), 6000);
    return () => window.clearInterval(id);
  }, [reduceMotion, count]);

  const previous = () => setActive((i) => (i - 1 + count) % count);
  const next = () => setActive((i) => (i + 1) % count);

  if (!current) return null;

  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-16">
      <article className="lg:col-span-7">
        <div className="grid gap-6 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] sm:gap-8">
          <figure className="aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--surface-muted)]">
            <img src={current.src} alt={current.alt} className="h-full w-full object-cover" />
          </figure>
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-xs text-brand">Featured voice</p>
              <blockquote className="rkps-display mt-4 text-2xl leading-snug text-heading [text-wrap:balance] sm:text-[1.875rem]">
                “{current.quote}”
              </blockquote>
              <p className="mt-6 text-sm font-medium text-heading">{current.name}</p>
              <p className="text-xs text-muted">{current.role}</p>
            </div>
            <div className="mt-6 flex gap-2">
              <button type="button" className="rkps-btn-icon" aria-label="Previous voice" onClick={previous}>
                ←
              </button>
              <button type="button" className="rkps-btn-icon" aria-label="Next voice" onClick={next}>
                →
              </button>
            </div>
          </div>
        </div>
      </article>

      <ul className="flex flex-col border-t border-[color-mix(in_srgb,var(--rkps-text-body)_12%,transparent)] lg:col-span-5">
        {voices.map((voice, index) => {
          const selected = index === active;
          return (
            <li key={voice.name} className="border-b border-[color-mix(in_srgb,var(--rkps-text-body)_12%,transparent)]">
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-pressed={selected}
                className={`relative w-full py-5 pl-5 text-left transition-colors duration-150 before:absolute before:inset-y-5 before:left-0 before:w-0.5 before:rounded-full ${
                  selected ? "before:bg-[var(--rkps-primary)]" : "opacity-70 before:bg-transparent hover:opacity-100"
                }`}
              >
                <p className="text-sm font-medium text-heading">{voice.name}</p>
                <p className="rkps-text-label-soft mt-0.5 text-[0.6875rem]">{voice.role}</p>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{voice.quote}</p>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function RkpsStudentAchieversPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All recognition");
  const [storyIndex, setStoryIndex] = useState(0);
  const cat = FILTER_TO_CAT[filter];
  const visible = cat ? CARDS.filter((c) => c.cat === cat) : CARDS;
  const pageHero = ACHIEVEMENT_THEME_PHOTOS.hero;
  const ctaPhoto = instagramPhoto("campus-28.jpg");
  const story = FEATURED_STORIES[storyIndex] ?? FEATURED_STORIES[0];
  const galleryPrints = useMemo(
    () =>
      photosToPictureRailItems(STUDENT_ACHIEVER_GALLERY, {
        tag: "Achievers",
        details: ["Student life", "From @r.k.m.p.s", "R.K. Memorial Public School"],
        limit: 8,
      }),
    [],
  );
  const voices = useMemo(
    () =>
      TESTIMONIALS.map((item, index) => ({
        quote: item.quote,
        name: item.name,
        role: item.role,
        src: VOICE_PHOTOS[index]?.src ?? VOICE_PHOTOS[0].src,
        alt: VOICE_PHOTOS[index]?.alt ?? "",
      })),
    [],
  );

  const goPrev = useCallback(() => {
    setStoryIndex((i) => (i <= 0 ? FEATURED_STORIES.length - 1 : i - 1));
  }, []);
  const goNext = useCallback(() => {
    setStoryIndex((i) => (i >= FEATURED_STORIES.length - 1 ? 0 : i + 1));
  }, []);

  return (
    <>
      <RkpsScrollProgress />
      <RkpsScrollReveal skip={0} />
      <RkpsHeader breadcrumb={[{ label: "Home", href: "/" }, { label: "School Life" }, { label: "Student Achievers" }]} />

      <RkpsStoryHero
        slides={[
          {
            photo: pageHero,
            kicker: "School life · Celebrating growth without rankings",
            title: "Student achievers",
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
            title: "We rise and thrive together",
            accent: HIGHLIGHTS[2].value,
            body: "Effort, collaboration, and sportsmanship celebrated across every grade without comparisons or labels.",
          },
        ]}
        primary={{ href: "#recognition", label: "Explore recognition areas" }}
        secondary={{ href: INSTAGRAM_PROFILE, label: "@r.k.m.p.s on Instagram", external: true }}
      />

      <RkpsQuickJumpNav
        links={[
          { href: "#featured", label: "Stories" },
          { href: "#recognition", label: "Recognition" },
          { href: "#voices", label: "Voices" },
          { href: "#gallery", label: "Gallery" },
          { href: "/school-life/events", label: "Events" },
          { href: "/#contact", label: "Contact", highlight: true },
        ]}
      />

      <main>
        <section id="featured" className={SECTION}>
          <div className="mx-auto grid max-w-7xl gap-10 rkps-page-x lg:grid-cols-12 lg:gap-16">
            <aside className="flex flex-col lg:col-span-4">
              <span className="rkps-rule" aria-hidden="true" />
              <p className="rkps-text-label mt-4 text-xs">Inspiring moments</p>
              <h2 className="rkps-display mt-2 text-[2rem] leading-[1.1] text-heading [text-wrap:balance] sm:text-[2.5rem]">
                Stories worth celebrating
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">
                Moments from daily school life highlighting perseverance, creative courage, and community empathy.
              </p>

              <div className="mt-10 hidden lg:block">
                <StoryPicker activeIndex={storyIndex} onSelect={setStoryIndex} layout="column" />
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a href="#gallery" className="rkps-btn-navy rkps-btn-sm">
                  Browse photo gallery
                </a>
                <Link href="/school-life/events" className={TEXT_LINK}>
                  School events calendar
                </Link>
              </div>
            </aside>

            <div className="flex min-h-0 flex-col lg:col-span-8">
              <div className="mb-6 lg:hidden">
                <StoryPicker activeIndex={storyIndex} onSelect={setStoryIndex} layout="row" />
              </div>

              <div
                id="rkps-achiever-story-panel"
                role="tabpanel"
                aria-labelledby={`rkps-achiever-story-tab-column-${storyIndex} rkps-achiever-story-tab-row-${storyIndex}`}
                className="flex min-h-0 flex-1 flex-col gap-6"
              >
                <div className="lg:min-h-[26rem] lg:flex-1">
                  <StoryPhotoGrid photos={story.photos} />
                </div>
                <article>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-3 text-xs">
                        <span className="font-mono tabular-nums text-brand">
                          {String(storyIndex + 1).padStart(2, "0")} / {String(FEATURED_STORIES.length).padStart(2, "0")}
                        </span>
                        <span className="h-px w-8 bg-[color-mix(in_srgb,var(--rkps-text-body)_20%,transparent)]" aria-hidden />
                        <span className="text-muted">{story.tag}</span>
                      </p>
                      <h3 className="rkps-display mt-3 text-2xl leading-tight text-heading sm:text-3xl">{story.title}</h3>
                      <p className="mt-2 text-sm font-medium text-[var(--rkps-primary-light)]">{story.kicker}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button type="button" onClick={goPrev} className="rkps-btn-icon" aria-label="Previous story">
                        ←
                      </button>
                      <button type="button" onClick={goNext} className="rkps-btn-icon" aria-label="Next story">
                        →
                      </button>
                    </div>
                  </div>
                  <p className="mt-4 max-w-[68ch] text-[15px] leading-relaxed text-muted">{story.body}</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section id="recognition" className={`${SECTION} ${DIVIDER}`}>
          <div className="mx-auto max-w-7xl rkps-page-x">
            <div className="grid gap-6 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <span className="rkps-rule" aria-hidden="true" />
                <p className="rkps-text-label mt-4 text-xs">Recognition areas</p>
                <h2 className="rkps-display mt-2 text-[2rem] leading-[1.1] text-heading sm:text-[2.5rem]">
                  Many talents. Many journeys.
                </h2>
              </div>
              <p className="text-[15px] leading-relaxed text-muted lg:col-span-7 lg:pt-10">
                Filter by area of growth. We honour effort, creativity, teamwork, leadership, and personal bests — the things a
                ranking never shows.
              </p>
            </div>

            <div className="mt-10 flex flex-col gap-4 border-b border-[color-mix(in_srgb,var(--rkps-text-body)_12%,transparent)] sm:flex-row sm:items-end sm:justify-between">
              <div role="tablist" aria-label="Recognition area" className="-mb-px flex gap-6 overflow-x-auto [scrollbar-width:none]">
                {FILTERS.map((option) => {
                  const selected = filter === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setFilter(option)}
                      className={`shrink-0 border-b-2 pb-3 text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rkps-primary)] focus-visible:ring-offset-4 ${
                        selected
                          ? "border-[var(--rkps-primary)] font-medium text-heading"
                          : "border-transparent text-muted hover:text-heading"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              <p className="hidden shrink-0 pb-3 text-xs text-muted sm:block">
                {visible.length} {visible.length === 1 ? "area" : "areas"} shown
              </p>
            </div>

            <ul className="rkps-stagger mt-8 grid gap-3 sm:gap-4 lg:grid-cols-12 lg:grid-rows-[minmax(11rem,auto)_minmax(11rem,auto)_minmax(11rem,auto)]">
              {visible.map((c, i) => (
                <li
                  key={c.title}
                  className={recognitionCellClass(i, visible.length, i === 0)}
                  style={{ ["--rkps-i" as string]: i }}
                >
                  <RecognitionCard card={c} index={i} featured={i === 0} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="voices" className={`${SECTION} ${DIVIDER}`}>
          <div className="mx-auto max-w-7xl rkps-page-x">
            <span className="rkps-rule" aria-hidden="true" />
            <p className="rkps-text-label mt-4 text-xs">Community voices</p>
            <h2 className="rkps-display mt-2 text-[2rem] leading-[1.1] text-heading sm:text-[2.5rem]">
              From our students, faculty & families
            </h2>
            <p className="mt-4 max-w-[60ch] text-[15px] leading-relaxed text-muted">
              Reflections on curiosity, sportsmanship, and growth from members of the RMPS community.
            </p>
            <CommunityVoices voices={voices} />
          </div>
        </section>

        <section id="gallery" className={`relative isolate w-full overflow-x-clip ${SECTION} ${DIVIDER}`}>
          <PictureRailGallery
            className="!bg-transparent"
            items={galleryPrints}
            eyebrow="Photo gallery"
            heading="Moments from @r.k.m.p.s"
            caption="Celebrations, performances, project presentations and awards from the school's living album. Brush along the rail to light a print, then lift it to see the back."
            autoplay
            labels={{
              front: "Front",
              back: "Back",
              close: "Close",
              open: "Lift to view the back",
            }}
            action={
              <a href={INSTAGRAM_PROFILE} target="_blank" rel="noreferrer" className="rkps-btn-primary rkps-btn-sm">
                Open Instagram
              </a>
            }
          />
        </section>

        <section aria-label="Everyday progress" className="relative isolate overflow-hidden bg-[var(--rkps-primary)] text-white">
          <img src={ctaPhoto.src} alt="" aria-hidden className="absolute inset-0 -z-20 h-full w-full object-cover" loading="lazy" />
          <div
            className="absolute inset-0 -z-10 bg-gradient-to-r from-[var(--rkps-primary)] via-[var(--rkps-primary)]/85 to-[var(--rkps-primary)]/20"
            aria-hidden
          />
          <div className="mx-auto flex min-h-[26rem] max-w-7xl flex-col justify-center rkps-page-x py-16 sm:py-20">
            <div className="max-w-xl">
              <span className="rkps-rule" aria-hidden="true" />
              <p className="mt-4 text-xs text-white/75">Everyday progress</p>
              <h2 className="rkps-display mt-2 text-[2rem] leading-[1.1] sm:text-[2.75rem]">Not every achievement comes with a medal</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-white/80">
                First attempts, quiet courage, curiosity, and kindness — we celebrate every meaningful step our students take.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="/#contact" className="rkps-btn-gold rkps-btn-sm">
                  Contact school office
                </Link>
                <Link
                  href="/school-life/events"
                  className="text-sm text-white/90 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white"
                >
                  School events calendar
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="explore-achievers" className={SECTION}>
          <div className="mx-auto max-w-7xl rkps-page-x">
            <span className="rkps-rule" aria-hidden="true" />
            <p className="rkps-text-label mt-4 text-xs">Explore further</p>
            <h2 className="rkps-display mt-2 text-[2rem] leading-[1.1] text-heading sm:text-[2.5rem]">More from school life</h2>
            <ul className="mt-10 border-t border-[color-mix(in_srgb,var(--rkps-text-body)_12%,transparent)]">
              {DESTINATIONS.map((item) => (
                <li key={item.href} className="border-b border-[color-mix(in_srgb,var(--rkps-text-body)_12%,transparent)]">
                  <Link href={item.href} className="group grid gap-1 py-6 sm:grid-cols-12 sm:items-center sm:gap-6">
                    <span className="text-xs text-muted sm:col-span-2">{item.label}</span>
                    <span className="rkps-display text-2xl text-heading transition-colors group-hover:text-[var(--rkps-primary-light)] sm:col-span-4">
                      {item.title}
                    </span>
                    <span className="text-sm leading-relaxed text-muted sm:col-span-5">{item.description}</span>
                    <span
                      className="hidden justify-self-end text-brand transition-transform duration-150 group-hover:translate-x-1 sm:col-span-1 sm:block"
                      aria-hidden
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <RkpsFooter prefooter={ACHIEVERS_FOOTER_LINE} />
    </>
  );
}
