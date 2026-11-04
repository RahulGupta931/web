"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { RkpsFooter, RkpsHeader } from "@/components/marketing/rkps/rkps-shell";
import {
  RkpsDestinationLinks,
  RkpsFilterTabs,
  RkpsPageSection,
  RkpsQuickJumpNav,
  RkpsSectionIntro,
  RkpsZigzagRow,
} from "@/components/marketing/rkps/rkps-marketing-blocks";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { TESTIMONIALS } from "@/content/website/public-site";
import { RkpsInView, RkpsStoryHero } from "@/components/marketing/rkps/rkps-motion-sections";
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
  "Every learner, their own kind of remarkable. Growth in class, on stage, on the field and in the community — honoured here without comparisons.";

const ZIGZAG_STORIES = [
  {
    tag: "Curiosity & inquiry",
    title: "The confidence to keep asking “what if?”",
    kicker: "Perseverance & innovation",
    body: "From building first working circuits to conducting environmental surveys — our classrooms foster students who dare to test hypotheses, learn from initial trials, and think critically.",
    photo: ACHIEVEMENT_THEME_PHOTOS.featuredStory,
  },
  {
    tag: "Athletics & performing arts",
    title: "Room to perform, compete & celebrate",
    kicker: "Stage · track · festival",
    body: "From inter-house sports tournaments to annual theatre productions — we notice courage, teamwork, and the quiet dedication behind every rehearsal and practice drill.",
    photo: ACHIEVEMENT_THEME_PHOTOS.arts,
  },
  {
    tag: "Kindness & citizenship",
    title: "Wins we share as one united family",
    kicker: "Belonging & service",
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

function RecognitionCard({
  card,
  index,
}: {
  card: (typeof CARDS)[number];
  index: number;
}) {
  const photo = STUDENT_ACHIEVER_CARD_PHOTOS[card.cat];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-white shadow-[0_12px_32px_rgb(143_1_3_/_0.06)]">
      <figure className="relative aspect-[16/10] overflow-hidden">
        <img src={photo.src} alt={photo.alt} className="h-full w-full object-cover" loading="lazy" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
          <p className="text-xs font-medium text-white/90">{card.cat}</p>
          <span className="text-lg font-medium tabular-nums text-white/40" aria-hidden>
            {String(index + 1).padStart(2, "0")}
          </span>
        </figcaption>
      </figure>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="rkps-display text-lg leading-snug text-heading sm:text-xl">{card.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{card.body}</p>
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
        <RkpsPageSection id="featured" tone="paper">
          <RkpsSectionIntro
            num="Inspiring moments"
            title="Stories worth celebrating"
            description="Moments from daily school life highlighting perseverance, creative courage, and community empathy."
          />
          <div className="mt-8 space-y-12 sm:space-y-16 lg:space-y-20">
            {ZIGZAG_STORIES.map((story, index) => (
              <RkpsZigzagRow
                key={story.title}
                reverse={index % 2 === 1}
                photo={story.photo}
                badge={story.tag}
                title={story.title}
                kicker={story.kicker}
                body={story.body}
              />
            ))}
          </div>
        </RkpsPageSection>

        <RkpsPageSection id="recognition" tone="inset">
          <RkpsInView>
            <div className="overflow-hidden rounded-[1.75rem] border border-border/80 bg-white shadow-[0_24px_60px_rgb(143_1_3_/_0.07)] sm:rounded-[2rem]">
              <div className="p-6 sm:p-8 lg:p-10">
                <RkpsSectionIntro
                  num="Recognition areas"
                  title="Many talents. Many journeys."
                  description="Filter by area of growth. We honour effort, creativity, teamwork, leadership, and personal bests."
                  action={
                    <span className="rkps-text-label-soft text-xs">
                      {visible.length} {visible.length === 1 ? "area" : "areas"} shown
                    </span>
                  }
                />

                <RkpsFilterTabs label="Recognition area" options={FILTERS} active={filter} onSelect={setFilter} />

                <ul className="rkps-stagger mt-8 grid gap-5 lg:grid-cols-12">
                  {visible.map((c, i) => (
                    <li key={c.title} className={recognitionGridClass(i, visible.length)} style={{ ["--rkps-i" as string]: i }}>
                      <RecognitionCard card={c} index={i} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </RkpsInView>
        </RkpsPageSection>

        <section id="voices" className="scroll-mt-28 border-y border-border/80 bg-[var(--rkps-ivory)] py-14 sm:py-20" aria-label="School voices">
          <div className="mx-auto max-w-7xl rkps-page-x mb-8">
            <RkpsSectionIntro
              num="Community voices"
              title="From our students, faculty & families"
              description="Reflections on curiosity, sportsmanship, and growth from members of the RMPS community."
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

        <RkpsPageSection id="gallery" tone="paper">
          <RkpsSectionIntro
            num="Photo gallery"
            title="Moments from @r.k.m.p.s"
            description="Celebrations, performances, project presentations, and awards captured in our living album."
            action={
              <a href={INSTAGRAM_PROFILE} target="_blank" rel="noreferrer" className="rkps-btn-gold rkps-btn-sm">
                Open Instagram
              </a>
            }
          />

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {galleryPhotos.map((photo) => (
              <figure
                key={photo.src}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/80 bg-[var(--rkps-taupe)]"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="h-full w-full object-cover transition duration-500 group-hover:brightness-105"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-3 text-xs leading-snug text-white">
                  <span className="line-clamp-2">{photo.alt}</span>
                </figcaption>
              </figure>
            ))}
          </div>

          {STUDENT_ACHIEVER_GALLERY.length > GALLERY_PREVIEW ? (
            <div className="mt-8 text-center">
              <button type="button" onClick={() => setGalleryExpanded((v) => !v)} className="rkps-btn-navy rkps-btn-sm">
                {galleryExpanded ? "Show fewer photos" : `Show all ${STUDENT_ACHIEVER_GALLERY.length} photos`}
              </button>
            </div>
          ) : null}
        </RkpsPageSection>

        <RkpsPageSection tone="inset">
          <RkpsInView>
            <div className="overflow-hidden rounded-[1.75rem] border border-border/80 bg-white shadow-[0_24px_60px_rgb(143_1_3_/_0.07)] sm:rounded-[2rem]">
              <div className="grid lg:grid-cols-12">
                <div className="relative min-h-[14rem] lg:col-span-5 lg:min-h-[20rem]">
                  <img src={ctaPhoto.src} alt={ctaPhoto.alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-black/60 lg:to-transparent" />
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-10 lg:col-span-7 lg:p-12">
                  <span className="rkps-rule" aria-hidden="true" />
                  <p className="rkps-text-label mt-4 text-xs">Everyday progress</p>
                  <h2 className="rkps-display mt-2 text-2xl text-heading sm:text-3xl">Not every achievement comes with a medal</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    First attempts, quiet courage, curiosity, and kindness — we celebrate every meaningful step our students take.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href="/#contact" className="rkps-btn-gold rkps-btn-sm">
                      Contact school office
                    </Link>
                    <Link href="/school-life/events" className="rkps-btn-secondary rkps-btn-sm">
                      School events calendar
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </RkpsInView>

          <div className="mt-14 sm:mt-16">
            <RkpsSectionIntro
              num="Explore further"
              title="More from school life"
              description="Discover our events calendar, verified competitive records, and main campus gateway."
            />
            <RkpsDestinationLinks
              items={[
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
              ]}
            />
          </div>
        </RkpsPageSection>
      </main>
      <RkpsFooter prefooter={ACHIEVERS_FOOTER_LINE} />
    </>
  );
}
