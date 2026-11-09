"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { RkpsFooter, RkpsHeader } from "@/components/marketing/rkps/rkps-shell";
import {
  RkpsQuickJumpNav,
} from "@/components/marketing/rkps/rkps-marketing-blocks";
import { RkpsStoryHero } from "@/components/marketing/rkps/rkps-motion-sections";
import { PictureRailGallery } from "@/components/ui/picture-rail-gallery";
import {
  INSTAGRAM_PROFILE,
  instagramPhoto,
  SCHOOL_EVENTS_CARD_PHOTOS,
  SCHOOL_EVENTS_GALLERY,
} from "@/content/website/instagram-media";
import { photosToPictureRailItems } from "@/content/website/rkps-picture-rail";
import { RkpsScrollProgress, RkpsScrollReveal } from "@/components/marketing/rkps/rkps-scroll-sections";

const EVENT_ROWS = [
  {
    filter: "Learning" as const,
    badge: "Learning & discovery",
    title: "Discovery & Making Day",
    kicker: "Hands-on inquiry and science",
    body: [
      "Classrooms turn into workshops for a day. Students build working models, run experiments in front of visitors and explain the thinking behind their projects — from simple machines in the primary years to circuits and coding in the senior classes.",
      "The point is not a polished display. It is a child standing next to something they made and answering questions about it, which is often the moment a subject clicks.",
    ],
    includes: [
      "Science and maths models from every section",
      "Computer lab demonstrations and coding projects",
      "Project tables explained by the students who built them",
      "Visits from parents and other classes through the day",
    ],
    when: "Once a year, in the second term",
    who: "Pre-primary to Class 12, by class",
    families: "Parents are invited to walk the exhibition",
    photo: SCHOOL_EVENTS_CARD_PHOTOS.learning,
    footnote: "Confirm this session's date with the school office or the portal circular.",
  },
  {
    filter: "Sports & play" as const,
    badge: "Athletics & games",
    title: "Inter-House Sports Meet",
    kicker: "Teamwork, energy and fair play",
    body: [
      "Every student belongs to a house, and the sports meet is where the houses compete — track and field, relays, cricket, kabaddi and team games on the school ground, with points counted towards the house trophy.",
      "Younger classes run fun races and drills so nobody sits on the sidelines. Older students captain teams, keep score and look after the juniors, which is as much a part of the day as the medals.",
    ],
    includes: [
      "Track events and relay championships",
      "Cricket, kabaddi and team games",
      "Fun races and drills for the youngest classes",
      "House points, medals and the closing ceremony",
    ],
    when: "Heats through the term, finals on sports day",
    who: "Every house and every class",
    families: "Parents welcome on finals day",
    photo: SCHOOL_EVENTS_CARD_PHOTOS.sports,
    footnote: "Ground schedules are published through portal circulars each term.",
  },
  {
    filter: "Arts & culture" as const,
    badge: "Performing arts & heritage",
    title: "Cultural Expressions & Annual Day",
    kicker: "Stage, music, dance and tradition",
    body: [
      "Festivals like Dussehra fill the hall with colour, costume and performances prepared by each class. Through the year, students rehearse dance, music, drama and speech for assemblies and special days.",
      "It all comes together at Annual Day — the biggest evening on the school calendar, where every class has a place on stage and families come to watch.",
    ],
    includes: [
      "Festival celebrations in traditional dress",
      "Dance, music and drama performances",
      "Speech, recitation and debate",
      "Annual Day programme with every class on stage",
    ],
    when: "Festivals through the year, Annual Day once a session",
    who: "All classes, with house and club groups",
    families: "Parent passes and invitations from the office",
    photo: {
      src: "/marketing/events/sanskriti-sangam-anchors.webp",
      alt: "Two teachers anchoring a cultural programme from the podium at Sanskriti Sangam",
    },
    footnote: "Invitations and parent passes are distributed by the school office.",
  },
  {
    filter: "Community" as const,
    badge: "Service & partnership",
    title: "Community & Outreach",
    kicker: "Learning that leaves the classroom",
    body: [
      "Some of the most useful lessons happen with people outside the school. Students take part in health and hygiene drives with the Rotary Club, awareness campaigns and gratitude ceremonies for the people who keep the community running.",
      "These programmes teach care in practice — planning a drive, speaking to visitors, and seeing what a small effort can change.",
    ],
    includes: [
      "Health and hygiene initiatives with the Rotary Club",
      "Awareness campaigns led by student volunteers",
      "Gratitude ceremonies with guests and staff",
      "Partnership events with local organisations",
    ],
    when: "Through the year, as programmes are announced",
    who: "Student volunteers and invited classes",
    families: "Updates shared on the portal and Instagram",
    photo: instagramPhoto("campus-36.jpg"),
    footnote: "Follow @r.k.m.p.s for photos from recent community programmes.",
  },
] as const;

const FILTERS = ["All events", "Learning", "Sports & play", "Arts & culture", "Community"] as const;

export function RkpsEventsPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All events");

  const visibleRows = useMemo(() => {
    if (filter === "All events") return EVENT_ROWS;
    return EVENT_ROWS.filter((row) => row.filter === filter);
  }, [filter]);

  const heroSlides = [instagramPhoto("campus-8.jpg"), instagramPhoto("campus-4.jpg"), instagramPhoto("campus-7.jpg")];
  const planAheadPhoto = instagramPhoto("campus-36.jpg");

  return (
    <>
      <RkpsScrollProgress />
      <RkpsScrollReveal skip={0} />
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
          { href: "#sanskriti-sangam", label: "Sanskriti Sangam" },
          { href: "#gallery", label: "Gallery" },
          { href: "#calendar", label: "Plan ahead" },
          { href: "/school-life/student-achievers", label: "Student achievers" },
          { href: "/#contact", label: "Contact", highlight: true },
        ]}
      />

      <main>
        <section id="highlights" className="scroll-mt-28 bg-[var(--rkps-bg)] py-16 text-[var(--rkps-text-body)] sm:py-20 lg:py-28">
          <div className="mx-auto max-w-7xl rkps-page-x">
            {/* Intro */}
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <span className="rkps-rule" aria-hidden="true" />
                <p className="rkps-text-label mt-4 text-xs">Event themes</p>
                <h2 className="rkps-display mt-2 text-[2.25rem] leading-[1.05] text-heading sm:text-5xl">What we gather for</h2>
              </div>
              <div className="space-y-4 text-[15px] leading-relaxed text-muted sm:text-base lg:col-span-7 lg:pt-10">
                <p>
                  A school year at RMPS is measured in more than terms and exams. It is the morning a class first presents a
                  science model, the afternoon a house wins the relay, the evening a shy student steps onto the Annual Day stage.
                </p>
                <p>
                  Our events fall into four themes — learning, sport, the arts and community. Each one gives students a different
                  way to show what they can do, and gives families a reason to come onto campus and see it for themselves.
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="mt-12 flex flex-col gap-4 border-b border-[color-mix(in_srgb,var(--rkps-text-body)_12%,transparent)] sm:flex-row sm:items-end sm:justify-between">
              <div role="tablist" aria-label="Filter events" className="-mb-px flex gap-6 overflow-x-auto [scrollbar-width:none]">
                {FILTERS.map((option) => {
                  const selected = filter === option;
                  const count =
                    option === "All events" ? EVENT_ROWS.length : EVENT_ROWS.filter((r) => r.filter === option).length;
                  return (
                    <button
                      key={option}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setFilter(option)}
                      className={`flex shrink-0 items-baseline gap-1.5 border-b-2 pb-3 text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rkps-primary)] focus-visible:ring-offset-4 ${
                        selected
                          ? "border-[var(--rkps-primary)] font-medium text-heading"
                          : "border-transparent text-muted hover:text-heading"
                      }`}
                    >
                      {option}
                      <span className="font-mono text-xs tabular-nums text-muted">{count}</span>
                    </button>
                  );
                })}
              </div>
              <p className="hidden pb-3 text-xs text-muted sm:block">
                Showing {visibleRows.length} theme{visibleRows.length === 1 ? "" : "s"}
              </p>
            </div>

            {/* Themes */}
            <div className="divide-y divide-[color-mix(in_srgb,var(--rkps-text-body)_10%,transparent)]">
              {visibleRows.map((row, index) => {
                const reverse = index % 2 === 1;
                const number = EVENT_ROWS.findIndex((r) => r.title === row.title) + 1;
                return (
                  <article key={row.title} className="grid gap-8 py-14 sm:py-16 lg:grid-cols-12 lg:items-center lg:gap-16 lg:py-20">
                    <figure className={`lg:col-span-6 ${reverse ? "lg:order-2" : ""}`}>
                      <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--surface-muted)]">
                        <img src={row.photo.src} alt={row.photo.alt} loading="lazy" className="h-full w-full object-cover" />
                      </div>
                      <figcaption className="mt-3 text-xs text-muted">{row.photo.alt}</figcaption>
                    </figure>

                    <div className={`lg:col-span-6 ${reverse ? "lg:order-1" : ""}`}>
                      <p className="flex items-center gap-3 text-xs">
                        <span className="font-mono tabular-nums text-brand">
                          {String(number).padStart(2, "0")} / {String(EVENT_ROWS.length).padStart(2, "0")}
                        </span>
                        <span className="h-px w-8 bg-[color-mix(in_srgb,var(--rkps-text-body)_20%,transparent)]" aria-hidden />
                        <span className="text-muted">{row.badge}</span>
                      </p>
                      <h3 className="rkps-display mt-3 text-[1.75rem] leading-tight text-heading sm:text-4xl">{row.title}</h3>
                      <p className="mt-2 text-sm font-medium text-[var(--rkps-primary-light)]">{row.kicker}</p>

                      <div className="mt-5 space-y-3 text-[15px] leading-relaxed text-muted">
                        {row.body.map((paragraph) => (
                          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                        ))}
                      </div>

                      <p className="mt-8 text-sm font-medium text-heading">What happens</p>
                      <ul className="mt-3 grid gap-x-6 sm:grid-cols-2">
                        {row.includes.map((item) => (
                          <li
                            key={item}
                            className="flex gap-3 border-t border-[color-mix(in_srgb,var(--rkps-text-body)_10%,transparent)] py-3 text-sm text-[var(--rkps-text-body)]"
                          >
                            <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                            {item}
                          </li>
                        ))}
                      </ul>

                      <dl className="mt-6 grid gap-4 border-y border-[color-mix(in_srgb,var(--rkps-text-body)_10%,transparent)] py-5 text-sm sm:grid-cols-3">
                        <div>
                          <dt className="text-xs text-muted">When</dt>
                          <dd className="mt-1 text-[var(--rkps-text-body)]">{row.when}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-muted">Who takes part</dt>
                          <dd className="mt-1 text-[var(--rkps-text-body)]">{row.who}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-muted">Families</dt>
                          <dd className="mt-1 text-[var(--rkps-text-body)]">{row.families}</dd>
                        </div>
                      </dl>

                      <p className="mt-4 text-xs leading-relaxed text-muted">{row.footnote}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="sanskriti-sangam"
          aria-labelledby="sanskriti-sangam-title"
          className="scroll-mt-28 bg-[var(--rkps-primary)] py-16 text-white sm:py-20 lg:py-28"
        >
          <div className="mx-auto grid max-w-7xl gap-10 rkps-page-x lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="lg:col-span-5">
              <span className="rkps-rule" aria-hidden="true" />
              <p className="mt-4 text-sm text-white/75">Featured event</p>
              <h2 id="sanskriti-sangam-title" className="rkps-display mt-2 text-[2.25rem] leading-[1.05] sm:text-5xl">
                Sanskriti Sangam
              </h2>
              <p className="mt-3 text-lg text-[var(--brand-gold)]" lang="hi">
                हमारी संस्कृति, हमारी पहचान
              </p>
              <p className="text-sm text-white/70">Our culture, our identity</p>

              <div className="mt-6 space-y-4 text-base leading-relaxed text-white/85">
                <p>
                  Sanskriti Sangam brought the school&rsquo;s culture and its sports achievements onto one stage. The evening
                  honoured students who represented RMPS on the field, alongside the traditions that shape the school.
                </p>
                <p>
                  It opened the way every important programme at RMPS does — with the lighting of the lamp before Goddess
                  Saraswati, then teachers at the podium guiding families and guests through the evening.
                </p>
              </div>

              <ol className="mt-8 border-t border-white/15">
                {[
                  { title: "Lighting of the lamp", body: "Guests and teachers light the diya to open the programme." },
                  { title: "Welcome from the podium", body: "Teachers anchor the evening and introduce each segment." },
                  { title: "Honouring sports achievement", body: "Students recognised for their results on the field." },
                ].map((item, index) => (
                  <li key={item.title} className="flex gap-4 border-b border-white/15 py-4">
                    <span className="font-mono text-sm tabular-nums text-[var(--brand-gold)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-base font-medium text-white">{item.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-white/70">{item.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-7">
              <figure className="col-span-2 sm:col-span-1 sm:row-span-2">
                <div className="aspect-square overflow-hidden rounded-2xl bg-white/10 sm:aspect-auto sm:h-full">
                  <img
                    src="/marketing/events/sanskriti-sangam-lamp.webp"
                    alt="Teachers and guests lighting the ceremonial lamp beside a garlanded idol of Saraswati"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="mt-2 text-sm text-white/70">Lighting of the lamp</figcaption>
              </figure>
              <figure>
                <div className="aspect-square overflow-hidden rounded-2xl bg-white/10">
                  <img
                    src="/marketing/events/sanskriti-sangam-anchors.webp"
                    alt="Two teachers anchoring the programme from the podium"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="mt-2 text-sm text-white/70">Anchors at the podium</figcaption>
              </figure>
              <figure>
                <div className="aspect-square overflow-hidden rounded-2xl bg-white/10">
                  <img
                    src="/marketing/events/sanskriti-sangam-guests.webp"
                    alt="Guests and teachers on stage in front of the Sanskriti Sangam Sports Achievement banner"
                    loading="lazy"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <figcaption className="mt-2 text-sm text-white/70">Guests on stage</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section id="gallery" className="relative isolate w-full scroll-mt-28 overflow-x-clip border-t border-[color-mix(in_srgb,var(--rkps-text-body)_8%,transparent)] bg-[var(--rkps-bg)] py-16 sm:py-20 lg:py-24">
          <PictureRailGallery
            className="!bg-transparent"
            items={photosToPictureRailItems(SCHOOL_EVENTS_GALLERY, {
              tag: "Festival",
              details: ["School events", "From @r.k.m.p.s", "R.K. Memorial Public School"],
              limit: 8,
            })}
            eyebrow="Campus gallery"
            heading="Recent celebrations & festivals"
            caption="Dussehra pageants, sports days, talent shows and outreach drives from the school's own feed. Brush along the rail to light a print, then lift it to see the back."
            autoplay
            labels={{
              front: "Front",
              back: "Back",
              close: "Close",
              open: "Lift to view the back",
            }}
            action={
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a href={INSTAGRAM_PROFILE} target="_blank" rel="noreferrer" className="rkps-btn-primary rkps-btn-sm">
                  Follow @r.k.m.p.s
                </a>
                <a
                  href="#calendar"
                  className="text-sm text-brand underline decoration-brand/25 underline-offset-4 transition-colors hover:decoration-brand"
                >
                  Plan ahead
                </a>
              </div>
            }
          />
        </section>

        <section id="calendar" className="scroll-mt-28 border-t border-[color-mix(in_srgb,var(--rkps-text-body)_8%,transparent)] bg-[var(--rkps-bg)] py-16 text-[var(--rkps-text-body)] sm:py-20 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 rkps-page-x lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="lg:col-span-6">
              <span className="rkps-rule" aria-hidden="true" />
              <p className="rkps-text-label mt-4 text-xs">Annual calendar</p>
              <h2 className="rkps-display mt-2 text-[2rem] leading-[1.1] text-heading sm:text-[2.5rem]">
                Confirmed schedules & session dates
              </h2>
              <p className="mt-3 text-sm font-medium text-[var(--rkps-primary-light)]">
                Structured planning for families and enrolled learners
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">
                Official circulars with exact dates, timings, dress codes and venue details are released through the
                student-parent portal. Before planning travel or appointments around a programme day, please confirm with the
                school office.
              </p>

              <ol className="mt-8">
                {[
                  { title: "Check the noticeboard", body: "Regular circulars appear on the homepage noticeboard." },
                  { title: "Log in to the portal", body: "Class-specific schedules and timings live in the school portal." },
                  { title: "Follow @r.k.m.p.s", body: "Photos and video highlights after each event." },
                ].map((step, index) => (
                  <li
                    key={step.title}
                    className="flex gap-4 border-t border-[color-mix(in_srgb,var(--rkps-text-body)_10%,transparent)] py-4 last:border-b"
                  >
                    <span className="font-mono text-xs tabular-nums text-brand">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="text-sm font-medium text-heading">{step.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="/#contact" className="rkps-btn-navy rkps-btn-sm">
                  Contact school office
                </Link>
                <a
                  href="#gallery"
                  className="text-sm text-brand underline decoration-brand/25 underline-offset-4 transition-colors hover:decoration-brand"
                >
                  Browse photo gallery
                </a>
              </div>
            </div>

            <figure className="lg:col-span-6">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--surface-muted)]">
                <img src={planAheadPhoto.src} alt={planAheadPhoto.alt} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <figcaption className="mt-3 text-xs text-muted">Community gatherings at RMPS</figcaption>
            </figure>
          </div>
        </section>

        <section id="explore-events" className="border-t border-[color-mix(in_srgb,var(--rkps-text-body)_8%,transparent)] bg-[var(--rkps-bg)] py-16 text-[var(--rkps-text-body)] sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl rkps-page-x">
            <span className="rkps-rule" aria-hidden="true" />
            <p className="rkps-text-label mt-4 text-xs">Explore further</p>
            <h2 className="rkps-display mt-2 text-[2rem] leading-[1.1] text-heading sm:text-[2.5rem]">
              Continue exploring RMPS
            </h2>
            <ul className="mt-10 border-t border-[color-mix(in_srgb,var(--rkps-text-body)_12%,transparent)]">
              {[
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
                  title: "Back to the homepage",
                  description: "Admissions, academics, the school day and the portal.",
                },
              ].map((item) => (
                <li key={item.href} className="border-b border-[color-mix(in_srgb,var(--rkps-text-body)_12%,transparent)]">
                  <Link
                    href={item.href}
                    className="group grid gap-1 py-6 transition-colors sm:grid-cols-12 sm:items-center sm:gap-6"
                  >
                    <span className="text-xs text-muted sm:col-span-2">{item.label}</span>
                    <span className="rkps-display text-2xl text-heading transition-colors group-hover:text-[var(--rkps-primary-light)] sm:col-span-4">
                      {item.title}
                    </span>
                    <span className="text-sm leading-relaxed text-muted sm:col-span-5">{item.description}</span>
                    <span className="hidden justify-self-end text-brand transition-transform duration-150 group-hover:translate-x-1 sm:col-span-1 sm:block" aria-hidden>
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
      <RkpsFooter />
    </>
  );
}
