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
  { cat: "Academics" as const, title: "Asking. Exploring. Understanding.", body: "A place to recognise thoughtful inquiry and the commitment to keep learning." },
  { cat: "Sport" as const, title: "Playing with purpose.", body: "A place to celebrate practice, resilience and the teammate who lifts others up." },
  { cat: "Creativity" as const, title: "Making room for imagination.", body: "A place to honour an original idea and the care taken to bring it to life." },
  { cat: "Leadership" as const, title: "Helping others find their voice.", body: "A place to recognise listening, initiative and making space for everyone." },
  { cat: "Service" as const, title: "Kindness, made practical.", body: "A place to celebrate a thoughtful contribution to a shared community." },
  { cat: "Personal progress" as const, title: "A step further than yesterday.", body: "A place to notice persistence, growing confidence and a meaningful first attempt." },
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
  { label: "Character", value: "Effort, kindness and integrity" },
  { label: "Community", value: "We rise together" },
] as const;

const BANNER_MOSAIC = [
  instagramPhoto("campus-8.jpg"),
  instagramPhoto("campus-28.jpg"),
  instagramPhoto("campus-7.jpg"),
] as const;

const GALLERY_PREVIEW = 12;

const ACHIEVERS_FOOTER_LINE =
  "Every learner, their own kind of remarkable. Growth in class, on stage, on the field and in the community — honoured here without rankings. Curiosity, character, and the people we rise with.";

const ZIGZAG_STORIES = [
  {
    tag: "Featured · Instagram",
    title: "The confidence to keep asking “what if?”",
    kicker: "Curiosity & perseverance",
    body: "Photos from recent programmes at R.K Memorial Public School. Verified student stories — names, class and recognition details — will be added after confirmation and appropriate permissions.",
    photo: ACHIEVEMENT_THEME_PHOTOS.featuredStory,
  },
  {
    tag: "Culture & sport",
    title: "Room to perform, compete and celebrate",
    kicker: "Stage · field · festival",
    body: "From dance and drama to team games and house events — we notice effort, teamwork and the courage to step into the spotlight.",
    photo: ACHIEVEMENT_THEME_PHOTOS.arts,
  },
  {
    tag: "Community",
    title: "Wins we share as one school family",
    kicker: "Belonging & service",
    body: "Celebrations, traditions and everyday kindness — recognition here includes the moments that bring learners and staff together.",
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
    <article className="grid items-center lg:grid-cols-12">
      <figure
        className={`overflow-hidden rounded-[1.75rem] shadow-[var(--shadow-card)] lg:col-span-7 lg:row-start-1 ${
          reverse ? "lg:col-start-6" : "lg:col-start-1"
        }`}
      >
        <img
          src={story.photo.src}
          alt={story.photo.alt}
          className="aspect-[16/10] w-full object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03]"
          loading="lazy"
        />
      </figure>
      <div
        className={`relative z-10 mt-4 rounded-[1.5rem] border border-border/70 bg-white p-5 shadow-[var(--shadow-card-hover)] sm:mx-3 sm:-mt-12 sm:p-8 lg:col-span-6 lg:row-start-1 lg:mx-0 lg:mt-0 ${
          reverse ? "lg:col-start-1 lg:mr-[-6%]" : "lg:col-start-7 lg:ml-[-6%]"
        }`}
      >
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brand">{story.tag}</p>
        <h3 className="mt-3 text-xl font-bold leading-snug tracking-tight text-heading sm:text-2xl md:text-[1.75rem]">{story.title}</h3>
        <p className="mt-2 text-sm font-semibold text-[var(--brand-maroon)]">{story.kicker}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">{story.body}</p>
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
  return (
    <article
      className={`rkps-ease group relative flex h-full flex-col justify-between overflow-hidden rounded-[1.75rem] bg-[var(--brand-maroon-dark)] shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] ${
        featured ? "min-h-[20rem] sm:min-h-[26rem] md:min-h-[30rem]" : "min-h-[18rem] sm:min-h-[22rem]"
      }`}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-[var(--brand-maroon-dark)]/55" />
      <div className="relative flex items-start justify-between gap-3 p-5 sm:p-6">
        <span className="rounded-full bg-[var(--brand-gold)] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--brand-maroon-dark)]">
          {card.cat}
        </span>
        <span className="text-4xl font-black leading-none text-white/30" aria-hidden>
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="relative max-w-xl p-5 sm:p-6">
        <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{card.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/90">{card.body}</p>
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
      <RkpsHeader breadcrumb={[{ label: "Home", href: "/" }, { label: "School life" }, { label: "Student achievers" }]} />

      <RkpsStoryHero
        slides={[
          {
            photo: pageHero,
            kicker: "School life · Celebrating people, not rankings",
            title: "Student achievers",
            accent: "Every learner. Their own kind of remarkable.",
            body: "Growth in class, on stage, on the field and in the community — honoured here without rankings or comparisons.",
          },
          {
            photo: BANNER_MOSAIC[1],
            kicker: HIGHLIGHTS[0].label,
            title: HIGHLIGHTS[0].value,
            accent: "Questions that keep going.",
            body: "Names and details appear only after school confirmation. Photos are from our official Instagram.",
          },
          {
            photo: BANNER_MOSAIC[2],
            kicker: HIGHLIGHTS[2].label,
            title: "We rise together",
            accent: HIGHLIGHTS[2].value,
            body: "Stage, field and festival — effort is noticed without turning children into a ranking.",
          },
        ]}
        primary={{ href: "#recognition", label: "Explore recognition" }}
        secondary={{ href: INSTAGRAM_PROFILE, label: "@r.k.m.p.s on Instagram", external: true }}
      />
      <nav className="border-b border-border bg-surface" aria-label="On this page">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-3 py-2.5 scrollbar-none sm:px-4 sm:py-3 lg:px-5">
          {[
            { href: "#featured", label: "Stories" },
            { href: "#recognition", label: "Recognition" },
            { href: "#gallery", label: "Gallery" },
            { href: "/school-life/events", label: "School events" },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold text-brand hover:bg-brand/5">
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <main>
        <RkpsPageSection id="featured" tone="paper" className="border-b-0">
          <RkpsSectionIntro
            num="01 · Stories"
            title="Moments worth celebrating"
            description="Three glimpses from school life — image and story alternate as you scroll. More verified profiles coming soon."
          />
          <div className="mt-8 space-y-12 sm:mt-10 sm:space-y-16 md:space-y-20">
            {ZIGZAG_STORIES.map((story, index) => (
              <StoryPanel key={story.title} story={story} reverse={index % 2 === 1} />
            ))}
          </div>
          <p className="mt-12 max-w-xl text-sm text-muted">
            Source:{" "}
            <a href={INSTAGRAM_PROFILE} className="font-semibold text-brand hover:underline" target="_blank" rel="noreferrer">
              instagram.com/r.k.m.p.s
            </a>
          </p>
        </RkpsPageSection>

        <RkpsPageSection id="recognition">
          <RkpsSectionIntro
            num="02 · Recognition"
            title="Many talents. Many journeys."
            description="Filter by the kind of growth you want to explore. Names, class and dates are added only after the school confirms each story."
            action={
              <p className="text-sm font-semibold text-brand">
                {visible.length} {visible.length === 1 ? "area" : "areas"} shown
              </p>
            }
          />

          <div className="mt-8 rounded-[1.25rem] border border-border/80 bg-white p-3 shadow-[var(--shadow-card)] sm:p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <p className="shrink-0 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brand">Theme</p>
              <div
                className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-0.5 scrollbar-none sm:flex-wrap sm:overflow-visible sm:pb-0"
                role="tablist"
                aria-label="Recognition categories"
              >
                {FILTERS.map((f) => {
                  const active = filter === f;
                  return (
                    <button
                      key={f}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setFilter(f)}
                      className={`rkps-ease rkps-press shrink-0 rounded-full px-3.5 py-2 text-xs font-bold sm:px-4 ${
                        active
                          ? "bg-brand text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                          : "bg-[var(--rkps-paper)] text-muted hover:text-brand"
                      }`}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <ul className="rkps-stagger mt-6 grid gap-4 lg:grid-cols-12">
            {visible.map((c, i) => (
              <li key={c.title} className={recognitionGridClass(i, visible.length)} style={{ ["--rkps-i" as string]: i }}>
                <RecognitionCard card={c} index={i} featured={visible.length > 1 && (i % 6 === 0 || i % 6 === 3)} />
              </li>
            ))}
          </ul>
        </RkpsPageSection>

        <section className="bg-white" aria-label="School voices">
          <div className="mx-auto max-w-7xl px-3 pt-10 sm:px-4 sm:pt-12 lg:px-5">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Voices</p>
            <h2 className="mt-2 text-2xl font-bold leading-snug tracking-tight text-heading sm:text-3xl">From the school community</h2>
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

        <RkpsPageSection id="gallery" tone="paper">
          <RkpsSectionIntro
            num="03 · Gallery"
            title="Moments from @r.k.m.p.s"
            description="Programmes, performances and celebrations — a living album from our official Instagram."
            action={
              <a href={INSTAGRAM_PROFILE} target="_blank" rel="noreferrer" className="rkps-btn-ghost shrink-0 text-sm">
                Open Instagram ↗
              </a>
            }
          />

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {galleryPhotos.map((photo) => (
              <figure key={photo.src} className="rkps-ease group relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-[var(--brand-maroon-dark)] shadow-[var(--shadow-card)]">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </figure>
            ))}
          </div>

          {STUDENT_ACHIEVER_GALLERY.length > GALLERY_PREVIEW && (
            <div className="mt-8">
              <button
                type="button"
                onClick={() => setGalleryExpanded((v) => !v)}
                className="rkps-ease rkps-press rounded-xl border border-border/80 bg-surface px-6 py-2.5 text-sm font-semibold text-brand shadow-[var(--rkps-shadow-diffuse,var(--shadow-card))] hover:border-brand/30"
              >
                {galleryExpanded ? "Show fewer photos" : `Show all ${STUDENT_ACHIEVER_GALLERY.length} photos`}
              </button>
            </div>
          )}

          <p className="mt-8 max-w-2xl text-xs leading-relaxed text-muted">
            No rankings or comparisons. Personal details appear only after school confirmation and appropriate permissions.
          </p>
        </RkpsPageSection>

        <div className="mx-auto max-w-7xl px-3 py-12 sm:px-4 sm:py-16 lg:px-5">
        <section className="scroll-mt-28 relative min-h-[18rem] overflow-hidden rounded-2xl bg-[var(--brand-maroon-dark)] shadow-[var(--shadow-card)] sm:min-h-[22rem] sm:rounded-[1.75rem]">
          <img src={ctaPhoto.src} alt={ctaPhoto.alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-[var(--brand-maroon-dark)]/78 sm:bg-[var(--brand-maroon-dark)]/70" aria-hidden />
          <div className="relative flex min-h-[18rem] max-w-xl flex-col justify-end p-6 text-white sm:min-h-[22rem] sm:p-10 md:p-12">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[var(--brand-gold)]">Everyday wins matter</p>
            <h2 className="mt-3 text-2xl font-bold leading-snug tracking-tight text-white sm:text-3xl md:text-4xl">Not every achievement comes with a medal</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/90">First attempts. Quiet courage. Everyday progress — we make room for all of it.</p>
            <div className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-3">
              <Link href="/#contact" className="rkps-ease rkps-press inline-flex justify-center rounded-lg bg-[var(--brand-gold)] px-5 py-2.5 text-sm font-bold text-[var(--brand-maroon-dark)]">
                Contact the school office
              </Link>
              <Link href="/school-life/events" className="rkps-ease rkps-press inline-flex justify-center rounded-lg border border-white/40 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10">
                School events
              </Link>
            </div>
          </div>
        </section>

        <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4 pb-12 sm:pb-16">
          <Link href="/school-life/achievements" className="rkps-btn-ghost">
            School achievements ↗
          </Link>
          <Link href="/" className="rkps-btn-ghost">
            Back to home ↗
          </Link>
        </div>
        </div>
      </main>
      <RkpsFooter prefooter={ACHIEVERS_FOOTER_LINE} />
    </>
  );
}
