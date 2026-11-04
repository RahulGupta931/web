import Link from "next/link";
import type { ReactNode } from "react";
import {
  RKPS_CONTACT,
  RKPS_DISCOVER,
  RKPS_FAQ,
  RKPS_GALLERY,
  RKPS_HERO_CARDS,
  RKPS_JOURNEY,
  RKPS_NOTICE,
  RKPS_PARENT,
  RKPS_RESOURCE_CARDS,
  RKPS_VALUES,
  RKPS_VISION,
} from "@/content/website/rkps-copy";
import { FACILITIES, LATEST_NEWS, SCHOOL_STATS, STUDENT_LIFE, WHY_US } from "@/content/website/public-site";
import { INSTAGRAM_PHOTOS, INSTAGRAM_PROFILE, INSTAGRAM_REELS, instagramPhoto } from "@/content/website/instagram-media";
import { BRAND } from "@/config/branding";
import { RkpsEnquiryForm } from "@/components/marketing/rkps/rkps-enquiry-form";
import { RkpsGallerySection } from "@/components/marketing/rkps/rkps-gallery-section";
import { RkpsLearningJourneySection } from "@/components/marketing/rkps/rkps-learning-journey-section";
import { RkpsRecognitionSection } from "@/components/marketing/rkps/rkps-recognition-section";
import { RkpsParentResourcesSection } from "@/components/marketing/rkps/rkps-parent-resources-section";
import { RkpsParentReviews } from "@/components/marketing/rkps/rkps-parent-reviews";
import { RkpsTopStudentsSection } from "@/components/marketing/rkps/rkps-top-students-section";
import { RkpsFooter, RkpsHeader } from "@/components/marketing/rkps/rkps-shell";
import { RkpsCinematicHero, RkpsCountValue, RkpsHighlightBanner, RkpsSpotlightCarousel, RkpsStoryRail } from "@/components/marketing/rkps/rkps-motion-sections";
import {
  RkpsAboutSection,
  RkpsAdmissionsSection,
  RkpsContactSection,
  RkpsNoticeboardSection,
  RkpsPathwayCards,
  RkpsQuickJumpNav,
} from "@/components/marketing/rkps/rkps-marketing-blocks";

/* -------------------------------------------------------------------------- */
/*  Design tokens                                                             */
/*  Page rhythm: dark maroon (hero) → warm tint ↔ rose tint → dark (campus)   */
/*  → gold (visit banner) → tints → dark (portal). White is reserved for      */
/*  cards and panels so it reads as a surface, not as the page itself.        */
/*  Tints are mixed from the brand tokens, so they follow any palette change. */
/* -------------------------------------------------------------------------- */

type Tone = "warm" | "rose" | "dark";

const TONE_CLASS: Record<Tone, string> = {
  warm: "bg-[linear-gradient(180deg,#edf5ff_0%,#f8fbff_100%)] text-heading",
  rose: "bg-[linear-gradient(180deg,#f8fbff_0%,#edf4ff_100%)] text-heading",
  dark: "bg-[linear-gradient(180deg,#081f3b_0%,#0d2c52_100%)] text-white",
};

const FOCUS_GOLD = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-gold)]";
const FOCUS_MAROON = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-maroon-dark)]";
const BTN_BASE = "rkps-ease rkps-press inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold";

const BTN_GOLD = `${BTN_BASE} ${FOCUS_GOLD} bg-[var(--brand-gold)] text-[var(--brand-maroon-dark)] hover:brightness-105`;
const BTN_MAROON = `${BTN_BASE} ${FOCUS_MAROON} bg-[var(--brand-maroon-dark)] text-white hover:brightness-125`;
const BTN_OUTLINE_MAROON = `${BTN_BASE} ${FOCUS_MAROON} border-2 border-[var(--brand-maroon-dark)]/40 text-[var(--brand-maroon-dark)] hover:bg-[var(--brand-maroon-dark)]/10`;

type Photo = { src: string; alt?: string };

/* -------------------------------------------------------------------------- */
/*  Icons (inline, no extra dependency)                                       */
/* -------------------------------------------------------------------------- */

type IconName = "arrow" | "check" | "instagram" | "cap" | "lock" | "attendance" | "clock" | "exam" | "bell";

const ICONS: Record<IconName, ReactNode> = {
  arrow: (
    <>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  instagram: (
    <>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <path d="M17.5 6.5h.01" />
    </>
  ),
  cap: (
    <>
      <path d="M22 10v6" />
      <path d="M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </>
  ),
  lock: (
    <>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ),
  attendance: (
    <>
      <path d="m9 11 3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </>
  ),
  exam: (
    <>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </>
  ),
  bell: (
    <>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </>
  ),
};

function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {ICONS[name]}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Layout helpers                                                            */
/* -------------------------------------------------------------------------- */

/** Full-width coloured band with a consistent content container. */
function Band({ id, tone, children }: { id?: string; tone: Tone; children: ReactNode }) {
  return (
    <section id={id} className={`scroll-mt-24 ${TONE_CLASS[tone]}`}>
      <div className="mx-auto max-w-7xl px-3 py-12 sm:px-4 sm:py-16 lg:py-20">{children}</div>
    </section>
  );
}

/**
 * Tints the page behind an existing block. It shows wherever the block does not
 * paint its own background — see the note about rkps-marketing-blocks.
 */
function Tint({ tone, children }: { tone: Exclude<Tone, "dark">; children: ReactNode }) {
  return <div className={TONE_CLASS[tone]}>{children}</div>;
}

function SectionHead({
  title,
  description,
  action,
  dark = false,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  dark?: boolean;
}) {
  return (
    <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <h2 className={`text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl ${dark ? "text-white" : "text-heading"}`}>
          {title}
        </h2>
        <span aria-hidden className="mt-4 block h-1 w-12 rounded-full bg-[var(--brand-gold)]" />
        {description ? (
          <p className={`mt-4 max-w-[60ch] text-base leading-relaxed ${dark ? "text-white/75" : "text-muted"}`}>{description}</p>
        ) : null}
      </div>
      {action}
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero + stats                                                              */
/* -------------------------------------------------------------------------- */

/** One continuous panel that overlaps the hero, instead of a row of separate cards. */
function StatsPanel() {
  return (
    <section aria-label="School at a glance" className="relative z-10 -mt-6 px-3 sm:-mt-8 sm:px-4">
      <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-3 rounded-[1.5rem] bg-white/60 p-2 shadow-[0_20px_44px_rgba(11,61,120,0.12)] backdrop-blur-sm lg:grid-cols-4">
        {SCHOOL_STATS.map((stat) => (
          <div key={stat.label} className="rounded-[1rem] border border-[rgba(11,61,120,0.08)] bg-[linear-gradient(180deg,#ffffff_0%,#f5f9ff_100%)] px-3 py-4 shadow-[0_12px_22px_rgba(11,61,120,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_26px_rgba(11,61,120,0.08)] sm:px-6 sm:py-6 md:px-8 md:py-7">
            <dt className="text-2xl font-bold tracking-tight text-brand tabular-nums sm:text-3xl md:text-4xl">
              <RkpsCountValue value={stat.value} />
            </dt>
            <dd className="mt-1 text-xs font-medium leading-snug text-muted sm:text-sm">{stat.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  School life                                                               */
/* -------------------------------------------------------------------------- */

function FeatureCard({
  href,
  photo,
  badge,
  title,
  kicker,
  body,
  cta,
  className = "",
}: {
  href: string;
  photo: Photo;
  badge: string;
  title: string;
  kicker: string;
  body: string;
  cta: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group relative isolate flex min-h-[24rem] flex-col justify-between overflow-hidden rounded-2xl p-6 text-white sm:min-h-[28rem] sm:p-8 ${FOCUS_MAROON} ${className}`}
    >
      <img
        src={photo.src}
        alt={photo.alt ?? ""}
        loading="lazy"
        className="absolute inset-0 -z-10 h-full w-full object-cover duration-700 motion-safe:transition-transform motion-safe:group-hover:scale-105"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[var(--brand-maroon-dark)]/70"
      />
      <span className="self-start rounded-full bg-[var(--brand-gold)] px-3 py-1 text-xs font-bold text-[var(--brand-maroon-dark)]">{badge}</span>
      <div>
        <h3 className="text-2xl font-bold leading-tight tracking-tight sm:text-[1.75rem]">{title}</h3>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/85">
          <span className="font-semibold text-[var(--brand-gold)]">{kicker}.</span> {body}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-gold)]">
          {cta}
          <Icon name="arrow" className="h-4 w-4 duration-200 motion-safe:transition-transform motion-safe:group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

function SchoolLifeSection() {
  return (
    <Band id="school-life" tone="warm">
      <SectionHead
        title="See learners in action"
        description="Stories and celebrations from @r.k.m.p.s. Confirm details with the school office."
      />
      <div className="mt-10 grid gap-5 lg:grid-cols-12">
        <FeatureCard
          className="lg:col-span-7"
          href="/school-life/student-achievers"
          photo={instagramPhoto("campus-28.jpg")}
          badge="Student achievers"
          title="Every learner, their own kind of remarkable"
          kicker="Recognition without rankings"
          body="Explore growth in academics, sport, creativity and service. Galleries and stories are added after school confirmation."
          cta="Visit student achievers"
        />
        <FeatureCard
          className="lg:col-span-5"
          href="/school-life/events"
          photo={instagramPhoto("campus-5.jpg")}
          badge="Events & calendar"
          title="Programmes, festivals and celebrations"
          kicker="Together in different ways"
          body="Browse highlights from learning days, sports and cultural events. This site mirrors Instagram, not a live calendar."
          cta="Browse events"
        />
      </div>
      <ul className="mt-5 grid gap-5 rounded-[1.5rem] border border-brand/10 bg-[linear-gradient(180deg,#ffffff_0%,#f3f8ff_100%)] p-5 shadow-[0_22px_45px_rgba(11,61,120,0.08)] sm:grid-cols-3 sm:p-8">
        {STUDENT_LIFE.map((item) => (
          <li key={item.title} className="rounded-[1.1rem] border border-[rgba(11,61,120,0.08)] bg-white/80 p-4 shadow-[0_10px_22px_rgba(11,61,120,0.04)]">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--brand-gold)]/20 text-[var(--brand-maroon-dark)]">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-gold)]" aria-hidden />
              </span>
              <p className="text-base font-semibold text-heading">{item.title}</p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
          </li>
        ))}
      </ul>
    </Band>
  );
}

/* -------------------------------------------------------------------------- */
/*  Campus                                                                    */
/* -------------------------------------------------------------------------- */

function CampusSection() {
  const photos: Photo[] = INSTAGRAM_PHOTOS.slice(1, 4);

  return (
    <Band id={RKPS_DISCOVER.id} tone="dark">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <SectionHead dark title={RKPS_DISCOVER.title} description={`${RKPS_DISCOVER.subtitle} ${RKPS_DISCOVER.lead}`} />
          <ul className="mt-8 grid gap-x-8 sm:grid-cols-2">
            {FACILITIES.map((item) => (
              <li key={item} className="flex items-center gap-3 border-t border-white/15 py-3 text-sm font-medium text-white/90">
                <Icon name="check" className="h-4 w-4 shrink-0 text-[var(--brand-gold)]" />
                {item}
              </li>
            ))}
          </ul>
          <Link href="/#contact" className={`${BTN_GOLD} mt-8`}>
            {RKPS_DISCOVER.cta}
          </Link>
        </div>

        <div className="rkps-stagger grid h-[32rem] grid-cols-2 grid-rows-2 gap-3 sm:h-[36rem] lg:col-span-7">
          {photos.map((photo, i) => (
            <figure
              key={photo.src}
              className={`group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.18)] ${i === 0 ? "row-span-2" : ""}`}
              style={{ ["--rkps-i" as string]: i }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,31,59,0.04),rgba(8,31,59,0.56))] opacity-80 transition duration-500 group-hover:opacity-100" aria-hidden />
              <img src={photo.src} alt={photo.alt ?? ""} loading="lazy" className="h-full w-full object-cover transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent_0%,rgba(8,31,59,0.9)_100%)] p-4 pt-14">
                <p className="text-sm font-bold text-[var(--brand-gold)]">{RKPS_DISCOVER.spaces[i]?.title}</p>
                <p className="mt-0.5 line-clamp-2 text-sm leading-snug text-white/90">{RKPS_DISCOVER.spaces[i]?.body ?? photo.alt}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </Band>
  );
}

/* -------------------------------------------------------------------------- */
/*  Visit banner                                                              */
/* -------------------------------------------------------------------------- */

function VisitBanner() {
  return (
    <section aria-label="Visit RMPS" className="relative overflow-hidden bg-[linear-gradient(135deg,#f3c867_0%,#e7b94a_40%,#d9a741_100%)] text-[var(--brand-maroon-dark)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.45),transparent_26%)]" aria-hidden />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-3 py-10 sm:px-4 sm:py-12 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">See RMPS for yourself</h2>
          <p className="mt-2 text-base leading-relaxed text-[var(--brand-maroon-dark)]/80">
            Walk the campus, meet the team and ask your questions. Send an enquiry or get in touch with the school office.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/#admissions" className={`${BTN_MAROON} shadow-[0_14px_30px_rgba(8,31,59,0.25)]`}>
            Start an enquiry
          </Link>
          <Link href="/#contact" className={`${BTN_OUTLINE_MAROON} bg-white/25 backdrop-blur-sm`}>
            Plan a visit
          </Link>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Instagram                                                                 */
/* -------------------------------------------------------------------------- */

function InstagramSection() {
  return (
    <Band id="instagram" tone="rose">
      <div className="grid gap-8 lg:grid-cols-12">
        <aside className="self-start rounded-2xl bg-[var(--brand-maroon-dark)] p-7 text-white lg:sticky lg:top-24 lg:col-span-4">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--brand-gold)] text-[var(--brand-maroon-dark)]">
            <Icon name="instagram" className="h-6 w-6" />
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight">From our Instagram</h2>
          <span aria-hidden className="mt-4 block h-1 w-12 rounded-full bg-[var(--brand-gold)]" />
          <p className="mt-4 text-sm leading-relaxed text-white/75">Recent reels from @r.k.m.p.s. Video plays on Instagram’s embed.</p>
          <a href={INSTAGRAM_PROFILE} target="_blank" rel="noreferrer" className={`${BTN_GOLD} mt-6 w-full`}>
            Open profile
          </a>
        </aside>

        <div className="grid gap-5 sm:grid-cols-2 lg:col-span-8">
          {INSTAGRAM_REELS.map((reel) => (
            <figure key={reel.id} className="overflow-hidden rounded-xl border border-brand/15 bg-white">
              <iframe
                title={reel.title}
                src={`https://www.instagram.com/reel/${reel.id}/embed`}
                className="min-h-[22rem] w-full bg-white sm:min-h-[26rem]"
                loading="lazy"
                allow="encrypted-media"
              />
              <figcaption className="flex items-center justify-between gap-3 border-t border-brand/10 px-4 py-3">
                <p className="text-sm font-semibold text-heading">{reel.title}</p>
                <a href={INSTAGRAM_PROFILE} target="_blank" rel="noreferrer" className="shrink-0 text-xs font-semibold text-brand hover:underline">
                  Watch on Instagram
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </Band>
  );
}

/* -------------------------------------------------------------------------- */
/*  Portal                                                                    */
/* -------------------------------------------------------------------------- */

const PORTAL_FEATURES: { icon: IconName; label: string; body: string }[] = [
  {
    icon: "attendance",
    label: "Attendance",
    body: "Teachers mark each section present, absent, late, half-day or on leave. Students open their own record. The principal can see the school for the day.",
  },
  {
    icon: "clock",
    label: "Timetables",
    body: "Class timetables run Monday to Saturday. After the principal publishes one, students and teachers see the periods for their own class.",
  },
  {
    icon: "exam",
    label: "Exams",
    body: "The school sets the exam and teachers enter marks for their subjects. Students read results and report cards once they are published.",
  },
  {
    icon: "bell",
    label: "Notices",
    body: "Announcements can go to the whole school, a chosen class, teachers or students. Each person sees only the notices meant for them.",
  },
];

function PortalSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--brand-maroon-dark)] text-white">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/marketing/portal-section-bg.jpg')" }}
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10 bg-[var(--brand-maroon-dark)]/88"
        aria-hidden
      />
      <div className="mx-auto grid max-w-7xl items-stretch gap-10 px-3 py-14 sm:px-4 sm:py-20 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <SectionHead
            dark
            title="Your RMPS account, one secure sign-in"
            description="Students, teachers and principals use the portal for attendance, timetables, exams and notices."
          />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {PORTAL_FEATURES.map((feature) => (
              <li key={feature.label} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--brand-gold)] text-[var(--brand-maroon-dark)]">
                  <Icon name={feature.icon} className="h-[1.125rem] w-[1.125rem]" />
                </span>
                <p className="mt-3 text-sm font-bold">{feature.label}</p>
                <p className="mt-1 text-sm leading-relaxed text-white/80">{feature.body}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex w-full max-w-md lg:col-span-5 lg:max-w-none lg:justify-self-end">
          <div className="flex h-full w-full flex-col rounded-2xl bg-white p-7 text-heading shadow-2xl shadow-black/30 sm:p-8">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-brand text-[var(--brand-gold)]">
              <Icon name="lock" />
            </span>
            <h3 className="mt-4 text-xl font-bold tracking-tight sm:text-2xl">Sign in to the portal</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
              One login for students, teachers and principals. The school issues your username and password — use them here, not on the public website forms.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
              Open attendance, your class timetable, exam marks and report cards when they are published, and notices meant for you. Teachers mark sections and upload materials; students read their own records; the principal oversees the school from the same system.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
              If you cannot sign in, contact the school office or IT — they can reset access for enrolled families and staff.
            </p>
            <div className="mt-auto pt-6 sm:pt-8">
              <Link href="/login" className={`${BTN_BASE} ${FOCUS_MAROON} w-full bg-brand text-white hover:brightness-110`}>
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export function RkpsHomePage() {
  return (
    <>
      <RkpsHeader />
      <main>
        <RkpsCinematicHero />

        <div className={TONE_CLASS.warm}>
          <StatsPanel />
          <RkpsQuickJumpNav
            links={[
              { href: "#about", label: "About" },
              { href: "#values", label: "Values" },
              { href: "#excellence", label: "Achievements" },
              { href: "#top-students", label: "Honour roll" },
              { href: "#school-life", label: "School life" },
              { href: "#academics", label: "Academics" },
              { href: "#facilities", label: "Campus" },
              { href: "#admissions", label: "Admissions" },
              { href: "#parent-reviews", label: "Reviews" },
              { href: "#contact", label: "Contact" },
            ]}
          />
        </div>

        <RkpsSpotlightCarousel />

        <RkpsHighlightBanner />

        <RkpsStoryRail />

        <Tint tone="warm">
          <RkpsPathwayCards
            heading="Explore R.K Memorial Public School"
            sub="Three starting points for families, learners and visitors."
            items={RKPS_HERO_CARDS}
            notesTitle="Why families choose RMPS"
            notes={WHY_US}
          />
        </Tint>

        <Tint tone="rose">
          <RkpsAboutSection vision={RKPS_VISION} values={RKPS_VALUES} motto={BRAND.motto} schoolName={BRAND.name} />
        </Tint>

        <Tint tone="warm">
          <RkpsRecognitionSection />
        </Tint>

        <Tint tone="rose">
          <RkpsTopStudentsSection />
        </Tint>

        <SchoolLifeSection />

        <Tint tone="rose">
          <RkpsLearningJourneySection />
        </Tint>

        <CampusSection />

        <Tint tone="warm">
          <RkpsGallerySection
            id={RKPS_GALLERY.id}
            title={RKPS_GALLERY.title}
            subtitle={RKPS_GALLERY.subtitle}
            tabs={RKPS_GALLERY.tabs}
            cta={RKPS_GALLERY.cta}
            ctaHref="/school-life/events"
            disclaimer={RKPS_GALLERY.disclaimer}
            photos={INSTAGRAM_PHOTOS}
            accentPhoto={instagramPhoto("campus-21.jpg")}
          />
        </Tint>

        <VisitBanner />

        <InstagramSection />

        <Tint tone="warm">
          <RkpsNoticeboardSection
            id={RKPS_NOTICE.id}
            title={RKPS_NOTICE.title}
            subtitle={RKPS_NOTICE.subtitle}
            emptyNote={RKPS_NOTICE.empty}
            notices={LATEST_NEWS}
          />
        </Tint>

        <RkpsParentReviews />

        <Tint tone="rose">
          <RkpsParentResourcesSection
            id={RKPS_PARENT.id}
            kicker={RKPS_PARENT.kicker}
            title={RKPS_PARENT.title}
            lead={RKPS_PARENT.lead}
            aside={RKPS_PARENT.aside}
            hints={RKPS_PARENT.hints}
            resourceCards={RKPS_RESOURCE_CARDS}
            photos={[instagramPhoto("campus-5.jpg"), instagramPhoto("campus-8.jpg"), instagramPhoto("campus-19.jpg")]}
          />
        </Tint>

        <Tint tone="warm">
          <RkpsAdmissionsSection
            id={RKPS_JOURNEY.id}
            title={RKPS_JOURNEY.title}
            subtitle={RKPS_JOURNEY.subtitle}
            lead={RKPS_JOURNEY.lead}
            steps={RKPS_JOURNEY.steps}
            disclaimer={RKPS_JOURNEY.disclaimer}
            faq={RKPS_FAQ}
            accentPhoto={instagramPhoto("campus-7.jpg")}
            form={<RkpsEnquiryForm />}
          />
        </Tint>

        <Tint tone="rose">
          <RkpsContactSection
            id={RKPS_CONTACT.id}
            title={RKPS_CONTACT.title}
            subtitle={RKPS_CONTACT.subtitle}
            lead={RKPS_CONTACT.lead}
            detail={RKPS_CONTACT.detail}
            visitBlurb={RKPS_CONTACT.visitBlurb}
            visit={RKPS_CONTACT.visit}
            phone={RKPS_CONTACT.phone}
            email={RKPS_CONTACT.email}
            hours={RKPS_CONTACT.hours}
            hoursNote={RKPS_CONTACT.hoursNote}
            reachOut={RKPS_CONTACT.reachOut}
            campusPhoto={instagramPhoto("campus-8.jpg")}
          />
        </Tint>

        <PortalSection />
      </main>
      <RkpsFooter />
    </>
  );
}