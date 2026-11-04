"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { RkpsFooter, RkpsHeader } from "@/components/marketing/rkps/rkps-shell";
import { RkpsSectionIntro, RkpsZigzagRow } from "@/components/marketing/rkps/rkps-marketing-blocks";
import { RkpsStoryHero } from "@/components/marketing/rkps/rkps-motion-sections";
import {
  INSTAGRAM_PROFILE,
  instagramPhoto,
  SCHOOL_EVENTS_CARD_PHOTOS,
  SCHOOL_EVENTS_GALLERY,
} from "@/content/website/instagram-media";

const EVENT_ROWS = [
  {
    filter: "Learning" as const,
    badge: "Learning & Discovery",
    title: "Discovery & Making Day",
    kicker: "Hands-on Inquiry & Science",
    body: "Interactive science experiments, robotics demonstrations, and project exhibitions that showcase student curiosity in full motion at R.K Memorial Public School.",
    photo: SCHOOL_EVENTS_CARD_PHOTOS.learning,
    footnote: "Annual celebration — confirm upcoming academic session dates with the school office.",
  },
  {
    filter: "Sports & play" as const,
    badge: "Athletics & Games",
    title: "Inter-House Sports Meet",
    kicker: "Teamwork, Energy & Sportsmanship",
    body: "Track and field, cricket tournaments, kabaddi, and relay championships celebrating physical fitness, active resilience, and healthy inter-house school spirit.",
    photo: SCHOOL_EVENTS_CARD_PHOTOS.sports,
    footnote: "Ground events held every term — schedules published via portal circulars.",
  },
  {
    filter: "Arts & culture" as const,
    badge: "Performing Arts & Heritage",
    title: "Cultural Expressions & Annual Day",
    kicker: "Stage · Music · Dance · Tradition",
    body: "Annual day stage galas, festive celebrations (Dussehra, Diwali), theatrical plays, and musical performances spotlighting our students' creative gifts.",
    photo: SCHOOL_EVENTS_CARD_PHOTOS.arts,
    footnote: "Community celebrations — parent passes and invitations distributed by the office.",
  },
] as const;

const FILTERS = ["All events", "Learning", "Sports & play", "Arts & culture", "Community"] as const;

const FILTER_ICONS: Record<(typeof FILTERS)[number], string> = {
  "All events": "✨",
  Learning: "🔬",
  "Sports & play": "⚽",
  "Arts & culture": "🎭",
  Community: "🤝",
};

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
            kicker: "School Life · Celebrations & Gatherings",
            title: "Campus Events & Galas",
            accent: "Coming together in vibrant celebration.",
            body: "Explore annual programmes, sports tournaments, and traditional cultural festivals at R.K Memorial Public School.",
          },
          {
            photo: heroSlides[1],
            kicker: "Festivals & Heritage",
            title: "Colour, Stage & Tradition",
            accent: "Shared moments that create lifelong memories.",
            body: "Celebrations from our official community feed. Verified event dates and circulars are shared through the school portal.",
          },
          {
            photo: heroSlides[2],
            kicker: "Performing Arts",
            title: "A Stage for Every Talent",
            accent: "Dance, drama, music, and debate.",
            body: "Browse through our event gallery, and contact the administrative office for visit passes and guest schedules.",
          },
        ]}
        primary={{ href: "#highlights", label: "Explore Event Highlights" }}
        secondary={{ href: INSTAGRAM_PROFILE, label: "@r.k.m.p.s on Instagram", external: true }}
      />

      {/* Quick In-Page Sticky Nav */}
      <nav className="border-b border-border bg-white sticky top-16 z-20 sm:top-[4.5rem]" aria-label="Page navigation">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto rkps-page-x py-2.5 scrollbar-none">
          <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-muted pr-1">Jump to:</span>
          {[
            { href: "#highlights", label: "Event Types" },
            { href: "#gallery", label: "Photo Gallery" },
            { href: "#calendar", label: "Plan Ahead" },
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

      <main className="mx-auto max-w-7xl rkps-page-x py-14 sm:py-20 lg:py-24 space-y-16 sm:space-y-24">
        {/* Section 01: Event Categories */}
        <section id="highlights" className="scroll-mt-28">
          <RkpsSectionIntro
            num="01 · Event Categories"
            title="What we gather for"
            description="Filter by theme to explore how our students learn, compete, create, and collaborate throughout the academic year."
          />

          {/* Filter Bar */}
          <div className="mt-8 rounded-3xl border border-border/80 bg-[var(--surface-elevated)] p-3 sm:p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none -mx-1 px-1">
                <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-muted pr-1">Filter:</span>
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
                          : "border border-border/80 bg-white text-heading hover:border-brand/40 hover:text-brand"
                      }`}
                    >
                      <span>{FILTER_ICONS[f]}</span>
                      <span>{f}</span>
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-semibold text-muted shrink-0 px-1">
                Showing {visibleRows.length} theme{visibleRows.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          {filter === "Community" ? (
            <div className="mt-8 rounded-2xl border border-dashed border-brand/30 bg-[var(--surface-muted)] p-5 text-sm text-muted">
              Community initiatives encompass learning, athletics, and cultural traditions. Browse all highlights below or follow{" "}
              <a href={INSTAGRAM_PROFILE} className="font-bold text-brand hover:underline" target="_blank" rel="noreferrer">
                @r.k.m.p.s on Instagram
              </a>{" "}
              for daily updates.
            </div>
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
        </section>

        {/* Section 02: Gallery */}
        <section id="gallery" className="scroll-mt-28 border-t border-border/80 pt-14 sm:pt-20">
          <RkpsSectionIntro
            num="02 · Campus Gallery"
            title="Recent celebrations & festivals"
            description="Dussehra pageants, sports tournaments, talent days, and outreach drives captured from our official school feed."
            action={
              <a
                href={INSTAGRAM_PROFILE}
                target="_blank"
                rel="noreferrer"
                className="rkps-btn-gold text-xs sm:text-sm"
              >
                Follow on Instagram ↗
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
                  className={`group relative overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-sm ${span} ${
                    i === 0 ? "min-h-[16rem] lg:min-h-[22rem]" : "min-h-[9rem] lg:min-h-[11rem]"
                  }`}
                  style={{ ["--rkps-i" as string]: i }}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-85 group-hover:opacity-100 transition" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-3 sm:p-4 text-xs font-semibold text-white">
                    <span className="line-clamp-2">{photo.alt}</span>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </section>

        {/* Section 03: Plan Ahead / Calendar Note */}
        <section id="calendar" className="scroll-mt-28 border-t border-border/80 pt-14 sm:pt-20 space-y-8">
          <RkpsSectionIntro
            num="03 · Annual Calendar & Schedules"
            title="Confirmed academic dates & seasonal programmes"
            description="Structured planning for families and enrolled learners. Confirm exact details with the school office."
          />
          <article className="grid overflow-hidden rounded-3xl border border-border/80 bg-white shadow-xl lg:grid-cols-12">
            <div className="flex flex-col justify-center p-6 sm:p-10 lg:col-span-7 lg:p-12 space-y-4">
              <span className="inline-flex w-fit rounded-full bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand">
                03 · Annual Calendar
              </span>
              <h2 className="rkps-display text-2xl font-bold tracking-tight text-heading sm:text-3xl">
                Confirmed schedules & session dates
              </h2>
              <p className="text-sm font-semibold text-brand">
                Structured planning for families and enrolled learners
              </p>
              <p className="text-sm leading-relaxed text-muted">
                Official circulars containing exact dates, timings, dress codes, and venue details are released directly through the student-parent portal. Before scheduling travel or appointments around programme days, please confirm with the school office.
              </p>

              <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-muted">
                <li className="flex items-center gap-2.5">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 shrink-0">✓</span>
                  <span>Check regular circulars on the homepage noticeboard</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 shrink-0">✓</span>
                  <span>Log in to the school portal for class-specific schedules</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 shrink-0">✓</span>
                  <span>Follow @r.k.m.p.s for photos and video highlights</span>
                </li>
              </ul>

              <div className="flex flex-wrap gap-3 pt-3">
                <Link href="/#contact" className="rkps-btn-navy text-xs sm:text-sm">
                  Contact School Office
                </Link>
                <a href="#gallery" className="rounded-full border border-border/80 bg-[var(--surface-elevated)] px-5 py-2.5 text-xs sm:text-sm font-semibold text-brand hover:border-brand/40 hover:bg-brand/5 transition">
                  Browse Photo Gallery ↑
                </a>
              </div>
            </div>

            <figure className="relative min-h-[16rem] overflow-hidden lg:col-span-5">
              <img
                src={planAheadPhoto.src}
                alt={planAheadPhoto.alt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-maroon-dark)]/80 via-transparent to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5 text-xs text-white/90">
                Community gathering & celebrations at RMPS
              </figcaption>
            </figure>
          </article>
        </section>

        {/* Bottom Destination Cards */}
        <section className="border-t border-border/80 pt-12 space-y-6">
          <RkpsSectionIntro
            num="Next Destinations"
            title="Continue exploring R.K Memorial Public School"
            description="Discover student achievements, read our verified honors, or return to the main portal."
          />
          <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/school-life/student-achievers"
            className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-[var(--surface-elevated)] p-5 shadow-sm hover:border-brand hover:shadow-md transition"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand">Next Exploration</span>
              <h3 className="mt-1 font-bold text-heading group-hover:text-brand transition">Student Achievers</h3>
              <p className="mt-1 text-xs text-muted">Celebrating growth without rankings or comparisons.</p>
            </div>
            <span className="mt-4 text-xs font-bold text-brand group-hover:translate-x-1 transition">Visit Page →</span>
          </Link>

          <Link
            href="/school-life/achievements"
            className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-[var(--surface-elevated)] p-5 shadow-sm hover:border-brand hover:shadow-md transition"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand">Archive</span>
              <h3 className="mt-1 font-bold text-heading group-hover:text-brand transition">School Achievements</h3>
              <p className="mt-1 text-xs text-muted">Verified competition records and milestones.</p>
            </div>
            <span className="mt-4 text-xs font-bold text-brand group-hover:translate-x-1 transition">View Archive →</span>
          </Link>

          <Link
            href="/"
            className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-[var(--surface-elevated)] p-5 shadow-sm hover:border-brand hover:shadow-md transition"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand">Navigation</span>
              <h3 className="mt-1 font-bold text-heading group-hover:text-brand transition">Home Portal</h3>
              <p className="mt-1 text-xs text-muted">Return to the main school landing page.</p>
            </div>
            <span className="mt-4 text-xs font-bold text-brand group-hover:translate-x-1 transition">Back to Home →</span>
          </Link>
        </div>
        </section>
      </main>
      <RkpsFooter />
    </>
  );
}
