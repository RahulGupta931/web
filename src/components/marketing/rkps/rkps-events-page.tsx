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
import { RkpsInView, RkpsStoryHero } from "@/components/marketing/rkps/rkps-motion-sections";
import {
  INSTAGRAM_PROFILE,
  instagramPhoto,
  SCHOOL_EVENTS_CARD_PHOTOS,
  SCHOOL_EVENTS_GALLERY,
} from "@/content/website/instagram-media";

const EVENT_ROWS = [
  {
    filter: "Learning" as const,
    badge: "Learning & discovery",
    title: "Discovery & Making Day",
    kicker: "Hands-on inquiry & science",
    body: "Interactive science experiments, robotics demonstrations, and project exhibitions that showcase student curiosity in full motion at R.K Memorial Public School.",
    photo: SCHOOL_EVENTS_CARD_PHOTOS.learning,
    footnote: "Annual celebration — confirm upcoming academic session dates with the school office.",
  },
  {
    filter: "Sports & play" as const,
    badge: "Athletics & games",
    title: "Inter-House Sports Meet",
    kicker: "Teamwork, energy & sportsmanship",
    body: "Track and field, cricket tournaments, kabaddi, and relay championships celebrating physical fitness, active resilience, and healthy inter-house school spirit.",
    photo: SCHOOL_EVENTS_CARD_PHOTOS.sports,
    footnote: "Ground events held every term — schedules published via portal circulars.",
  },
  {
    filter: "Arts & culture" as const,
    badge: "Performing arts & heritage",
    title: "Cultural Expressions & Annual Day",
    kicker: "Stage · music · dance · tradition",
    body: "Annual day stage galas, festive celebrations, theatrical plays, and musical performances spotlighting our students' creative gifts.",
    photo: SCHOOL_EVENTS_CARD_PHOTOS.arts,
    footnote: "Community celebrations — parent passes and invitations distributed by the office.",
  },
] as const;

const FILTERS = ["All events", "Learning", "Sports & play", "Arts & culture", "Community"] as const;

export function RkpsEventsPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All events");

  const visibleRows = useMemo(() => {
    if (filter === "All events" || filter === "Community") return EVENT_ROWS;
    return EVENT_ROWS.filter((row) => row.filter === filter);
  }, [filter]);

  const heroSlides = [instagramPhoto("campus-8.jpg"), instagramPhoto("campus-4.jpg"), instagramPhoto("campus-7.jpg")];
  const planAheadPhoto = instagramPhoto("campus-36.jpg");

  return (
    <>
      <RkpsHeader breadcrumb={[{ label: "Home", href: "/" }, { label: "School Life" }, { label: "Events & Calendar" }]} />

      <RkpsStoryHero
        slides={[
          {
            photo: heroSlides[0],
            kicker: "School life · Celebrations & gatherings",
            title: "Campus events & galas",
            accent: "Coming together in vibrant celebration.",
            body: "Explore annual programmes, sports tournaments, and traditional cultural festivals at R.K Memorial Public School.",
          },
          {
            photo: heroSlides[1],
            kicker: "Festivals & heritage",
            title: "Colour, stage & tradition",
            accent: "Shared moments that create lifelong memories.",
            body: "Celebrations from our official community feed. Verified event dates and circulars are shared through the school portal.",
          },
          {
            photo: heroSlides[2],
            kicker: "Performing arts",
            title: "A stage for every talent",
            accent: "Dance, drama, music, and debate.",
            body: "Browse through our event gallery, and contact the administrative office for visit passes and guest schedules.",
          },
        ]}
        primary={{ href: "#highlights", label: "Explore event highlights" }}
        secondary={{ href: INSTAGRAM_PROFILE, label: "@r.k.m.p.s on Instagram", external: true }}
      />

      <RkpsQuickJumpNav
        links={[
          { href: "#highlights", label: "Event themes" },
          { href: "#gallery", label: "Gallery" },
          { href: "#calendar", label: "Plan ahead" },
          { href: "/school-life/student-achievers", label: "Student achievers" },
          { href: "/#contact", label: "Contact", highlight: true },
        ]}
      />

      <main>
        <RkpsPageSection id="highlights" tone="inset">
          <RkpsSectionIntro
            num="Event themes"
            title="What we gather for"
            description="Filter by theme to explore how our students learn, compete, create, and collaborate throughout the academic year."
          />

          <RkpsFilterTabs
            label="Filter events"
            options={FILTERS}
            active={filter}
            onSelect={setFilter}
            trailing={`Showing ${visibleRows.length} theme${visibleRows.length === 1 ? "" : "s"}`}
          />

          {filter === "Community" ? (
            <p className="mt-6 rounded-2xl border border-dashed border-border/80 bg-white px-5 py-4 text-sm leading-relaxed text-muted">
              Community initiatives encompass learning, athletics, and cultural traditions. Browse all highlights below or follow{" "}
              <a href={INSTAGRAM_PROFILE} className="font-medium text-[var(--rkps-primary-light)] hover:underline" target="_blank" rel="noreferrer">
                @r.k.m.p.s on Instagram
              </a>{" "}
              for daily updates.
            </p>
          ) : null}

          <div className="mt-10 space-y-12 sm:space-y-16 lg:space-y-20">
            {visibleRows.map((row, index) => (
              <RkpsZigzagRow
                key={row.title}
                reverse={index % 2 === 1}
                photo={row.photo}
                badge={row.badge}
                title={row.title}
                kicker={row.kicker}
                body={row.body}
                footnote={row.footnote}
              />
            ))}
          </div>
        </RkpsPageSection>

        <RkpsPageSection id="gallery" tone="paper">
          <RkpsSectionIntro
            num="Campus gallery"
            title="Recent celebrations & festivals"
            description="Dussehra pageants, sports tournaments, talent days, and outreach drives captured from our official school feed."
            action={
              <a href={INSTAGRAM_PROFILE} target="_blank" rel="noreferrer" className="rkps-btn-gold rkps-btn-sm">
                Follow on Instagram
              </a>
            }
          />

          <div className="rkps-stagger mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12">
            {SCHOOL_EVENTS_GALLERY.map((photo, i) => {
              const span =
                i === 0
                  ? "col-span-2 lg:col-span-7 lg:row-span-2"
                  : i === 1 || i === 2
                    ? "col-span-1 lg:col-span-5"
                    : "col-span-1 lg:col-span-4";
              return (
                <figure
                  key={photo.src}
                  className={`group relative overflow-hidden rounded-2xl border border-border/80 bg-surface ${span} ${
                    i === 0 ? "min-h-[16rem] lg:min-h-[22rem]" : "min-h-[9rem] lg:min-h-[11rem]"
                  }`}
                  style={{ ["--rkps-i" as string]: i }}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:brightness-105"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-3 sm:p-4 text-xs leading-snug text-white sm:text-sm">
                    <span className="line-clamp-2">{photo.alt}</span>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </RkpsPageSection>

        <RkpsPageSection id="calendar" tone="inset">
          <RkpsInView>
            <div className="overflow-hidden rounded-[1.75rem] border border-border/80 bg-white shadow-[0_24px_60px_rgb(143_1_3_/_0.07)] sm:rounded-[2rem]">
              <div className="grid lg:grid-cols-12 lg:items-stretch">
                <div className="flex flex-col justify-center p-6 sm:p-10 lg:col-span-7 lg:p-12">
                  <span className="rkps-rule" aria-hidden="true" />
                  <p className="rkps-text-label mt-4 text-xs">Annual calendar</p>
                  <h2 className="rkps-display mt-2 text-2xl text-heading sm:text-3xl">Confirmed schedules & session dates</h2>
                  <p className="mt-3 text-sm font-medium text-[var(--rkps-primary-light)]">
                    Structured planning for families and enrolled learners
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    Official circulars containing exact dates, timings, dress codes, and venue details are released through the
                    student-parent portal. Before scheduling travel or appointments around programme days, please confirm with the
                    school office.
                  </p>
                  <ul className="mt-6 space-y-2.5 text-sm text-muted">
                    <li className="flex gap-2">
                      <span className="text-[var(--rkps-gold)]" aria-hidden>
                        ·
                      </span>
                      Check regular circulars on the homepage noticeboard
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[var(--rkps-gold)]" aria-hidden>
                        ·
                      </span>
                      Log in to the school portal for class-specific schedules
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[var(--rkps-gold)]" aria-hidden>
                        ·
                      </span>
                      Follow @r.k.m.p.s for photos and video highlights
                    </li>
                  </ul>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href="/#contact" className="rkps-btn-navy rkps-btn-sm">
                      Contact school office
                    </Link>
                    <a href="#gallery" className="rkps-btn-secondary rkps-btn-sm">
                      Browse photo gallery
                    </a>
                  </div>
                </div>
                <figure className="relative min-h-[16rem] lg:col-span-5 lg:min-h-full">
                  <img src={planAheadPhoto.src} alt={planAheadPhoto.alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-5 text-sm text-white/90">
                    Community gatherings at RMPS
                  </figcaption>
                </figure>
              </div>
            </div>
          </RkpsInView>
        </RkpsPageSection>

        <RkpsPageSection tone="paper">
          <RkpsSectionIntro
            num="Explore further"
            title="Continue exploring R.K Memorial Public School"
            description="Discover student achievements, read verified honours, or return to the main portal."
          />
          <RkpsDestinationLinks
            items={[
              {
                href: "/school-life/student-achievers",
                label: "School life",
                title: "Student achievers",
                description: "Celebrating growth without rankings or comparisons.",
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
        </RkpsPageSection>
      </main>
      <RkpsFooter />
    </>
  );
}
