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
    badge: "Learning · Instagram",
    title: "Discovery & making day",
    kicker: "Hands-on inquiry",
    body: "Activities, questions and projects — the kind of days that show learning in motion at R.K Memorial Public School.",
    photo: SCHOOL_EVENTS_CARD_PHOTOS.learning,
    footnote: "Date, time & venue — confirm with the school office.",
  },
  {
    filter: "Sports & play" as const,
    badge: "Sports & play · Instagram",
    title: "A day of movement",
    kicker: "Teamwork & energy",
    body: "Participation, practice and school spirit — gatherings that celebrate giving something a go together.",
    photo: SCHOOL_EVENTS_CARD_PHOTOS.sports,
    footnote: "Date, time & venue — confirm with the school office.",
  },
  {
    filter: "Arts & culture" as const,
    badge: "Arts & culture · Instagram",
    title: "Creative expressions",
    kicker: "Stage · colour · tradition",
    body: "Performances, festivals and cultural programmes — talent and tradition from our Instagram feed.",
    photo: SCHOOL_EVENTS_CARD_PHOTOS.arts,
    footnote: "Date, time & venue — confirm with the school office.",
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
      <RkpsHeader breadcrumb={[{ label: "Home", href: "/" }, { label: "School life" }, { label: "Events" }]} />

      <RkpsStoryHero
        slides={[
          {
            photo: heroSlides[0],
            kicker: "School life · Events & celebrations",
            title: "School events",
            accent: "Coming together, in different ways.",
            body: "Programmes and celebrations from R.K Memorial Public School. Confirm dates with the school office before making plans.",
          },
          {
            photo: heroSlides[1],
            kicker: "Festivals",
            title: "Colour, stage and tradition",
            accent: "Moments the whole school shares.",
            body: "Photos from @r.k.m.p.s. This page is a highlight reel, not a live calendar.",
          },
          {
            photo: heroSlides[2],
            kicker: "Performances",
            title: "A day to be seen",
            accent: "Dance, drama and celebration.",
            body: "Browse the gallery, then talk to the office for times and venues.",
          },
        ]}
        primary={{ href: "#highlights", label: "Browse highlights" }}
        secondary={{ href: INSTAGRAM_PROFILE, label: "@r.k.m.p.s on Instagram", external: true }}
      />

      <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <section id="highlights" className="scroll-mt-28">
          <RkpsSectionIntro
            num="01 · Event types"
            title="What we gather for"
            description="Filter by theme — each row alternates image and story. Details are added when the school confirms them."
          />

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Filter by theme</p>
            <div className="flex min-w-0 flex-1 flex-wrap gap-2 rounded-full border border-border/80 bg-[rgba(255,255,255,0.7)] p-2 shadow-[0_12px_24px_rgba(11,61,120,0.05)]" role="tablist" aria-label="Event categories">
              {FILTERS.map((f) => {
                const active = filter === f;
                return (
                  <button
                    key={f}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(f)}
                    className={`rkps-ease rkps-press rounded-full px-4 py-2 text-xs font-bold ${
                      active
                        ? "bg-[linear-gradient(135deg,#0b3d78,#1a5bb4)] text-white shadow-[0_12px_22px_rgba(11,61,120,0.18)]"
                        : "border border-transparent bg-transparent text-muted hover:border-brand/30 hover:text-brand"
                    }`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>

          {filter === "Community" ? (
            <>
              <p className="mt-8 max-w-2xl text-sm text-muted">
                Community shows up across learning, sport and arts — all highlights below. Follow{" "}
                <a href={INSTAGRAM_PROFILE} className="font-semibold text-brand hover:underline" target="_blank" rel="noreferrer">
                  @r.k.m.p.s
                </a>{" "}
                for the latest posts.
              </p>
              <div className="mt-10 space-y-16 sm:space-y-20 lg:space-y-24">
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
            </>
          ) : (
            <div className="mt-12 space-y-16 sm:space-y-20 lg:space-y-24">
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
          )}
        </section>

        <section id="gallery" className="mt-16 scroll-mt-28 border-t border-border pt-16 sm:mt-20">
          <RkpsSectionIntro
            num="02 · Gallery"
            title="Recent celebrations & programmes"
            description="Dussehra, talent shows, community initiatives and more — from our official Instagram."
            action={
              <a href={INSTAGRAM_PROFILE} target="_blank" rel="noreferrer" className="rkps-btn-ghost shrink-0 text-sm">
                Open Instagram ↗
              </a>
            }
          />
          <div className="rkps-stagger mt-8 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-12">
            {SCHOOL_EVENTS_GALLERY.map((photo, i) => {
              const span =
                i === 0
                  ? "col-span-2 lg:col-span-7 lg:row-span-2"
                  : i === 1 || i === 2
                    ? "lg:col-span-5"
                    : "lg:col-span-4";
              return (
                <div
                  key={photo.src}
                  className={`rkps-ease group overflow-hidden rounded-xl border border-border/80 bg-surface shadow-sm ${span} ${i === 0 ? "min-h-[12rem] lg:min-h-[18rem]" : ""}`}
                  style={{ ["--rkps-i" as string]: i }}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className={`w-full object-cover transition duration-500 group-hover:scale-[1.03] ${i === 0 ? "h-full min-h-[12rem] object-cover lg:min-h-[18rem]" : "aspect-[4/3]"}`}
                    loading="lazy"
                  />
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-16 scroll-mt-28 border-t border-border pt-16 sm:mt-20">
          <article className="grid overflow-hidden rounded-2xl border border-border bg-[var(--rkps-paper)] shadow-[var(--shadow-card)] lg:grid-cols-2">
            <div className="flex flex-col justify-center border-b border-border bg-[var(--background)] p-8 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
              <p className="rkps-section-num">03 · Plan ahead</p>
              <h2 className="rkps-display mt-3 text-2xl font-semibold sm:text-[1.75rem]">A calendar is on the way</h2>
              <p className="mt-2 text-sm font-semibold text-brand">One place for confirmed dates</p>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                School events will be listed here once the office publishes them. Until then, please call or write before booking travel or leave around
                programme days.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-muted">
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
                  Check notices on the home page noticeboard
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
                  Follow @r.k.m.p.s for photos from recent programmes
                </li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/#contact" className="btn-primary px-6 py-2.5">
                  Contact the school
                </Link>
                <a href="#gallery" className="btn-secondary px-6 py-2.5">
                  Browse photo gallery
                </a>
              </div>
            </div>
            <figure className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-[var(--shadow-card)]">
                <img
                  src={planAheadPhoto.src}
                  alt={planAheadPhoto.alt}
                  className="aspect-[4/3] w-full object-cover lg:aspect-[5/4]"
                  loading="lazy"
                />
              </div>
              <figcaption className="mt-3 text-xs leading-relaxed text-muted">
                Community and outreach programmes — more moments from school life on{" "}
                <a href={INSTAGRAM_PROFILE} className="font-semibold text-brand hover:underline" target="_blank" rel="noreferrer">
                  Instagram
                </a>
                .
              </figcaption>
            </figure>
          </article>
        </section>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/school-life/student-achievers" className="rkps-btn-ghost">
            Student achievers ↗
          </Link>
          <Link href="/school-life/achievements" className="rkps-btn-ghost">
            School achievements ↗
          </Link>
          <Link href="/" className="rkps-btn-ghost">
            Back to home ↗
          </Link>
        </div>
      </main>
      <RkpsFooter />
    </>
  );
}
