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
import { FACILITIES, LATEST_NEWS, WHY_US } from "@/content/website/public-site";
import { INSTAGRAM_PHOTOS, INSTAGRAM_PROFILE, INSTAGRAM_REELS, instagramPhoto } from "@/content/website/instagram-media";
import { BRAND } from "@/config/branding";
import { RkpsEnquiryForm } from "@/components/marketing/rkps/rkps-enquiry-form";
import { RkpsGallerySection } from "@/components/marketing/rkps/rkps-gallery-section";
import { RkpsLearningJourneySection } from "@/components/marketing/rkps/rkps-learning-journey-section";
import { RkpsRecognitionSection } from "@/components/marketing/rkps/rkps-recognition-section";
import { RkpsContactSection } from "@/components/marketing/rkps/rkps-contact-section";
import { RkpsSchoolLifeSection } from "@/components/marketing/rkps/rkps-school-life-section";
import { RkpsParentResourcesSection } from "@/components/marketing/rkps/rkps-parent-resources-section";
import { RkpsParentReviews } from "@/components/marketing/rkps/rkps-parent-reviews";
import { RkpsFooter, RkpsHeader } from "@/components/marketing/rkps/rkps-shell";
import { RkpsMotionBanner } from "@/components/marketing/rkps/rkps-motion-banner";
import { RkpsCinematicHero, RkpsHighlightBanner, RkpsSpotlightCarousel } from "@/components/marketing/rkps/rkps-motion-sections";
import { RkpsCampusStoriesSection } from "@/components/marketing/rkps/rkps-campus-stories-section";
import { RkpsAdmissionsSection } from "@/components/marketing/rkps/rkps-admissions-section";
import {
  RkpsAboutSection,
  RkpsNoticeboardSection,
  RkpsPathwayCards,
  RkpsQuickJumpNav,
  RkpsSectionIntro,
} from "@/components/marketing/rkps/rkps-marketing-blocks";
import { RkpsHeroBridge } from "@/components/marketing/rkps/rkps-hero-bridge";

type Tone = "warm" | "rose" | "dark";

const TONE_CLASS: Record<Tone, string> = {
  warm: "bg-[var(--surface-muted)] text-heading",
  rose: "bg-[var(--surface-elevated)] text-heading",
  dark: "bg-[var(--brand-maroon-dark)] text-white",
};

type Photo = { src: string; alt?: string };

const EXPLORE_PATHWAY_PHOTOS: Photo[] = [
  instagramPhoto("campus-4.jpg"),
  instagramPhoto("campus-28.jpg"),
  instagramPhoto("campus-7.jpg"),
];

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

function Band({ id, tone, children }: { id?: string; tone: Tone; children: ReactNode }) {
  return (
    <section id={id} className={`scroll-mt-28 ${TONE_CLASS[tone]}`}>
      <div className="mx-auto max-w-7xl rkps-page-x py-14 sm:py-20 lg:py-24">{children}</div>
    </section>
  );
}

function Tint({ tone, children }: { tone: Exclude<Tone, "dark">; children: ReactNode }) {
  return <div className={TONE_CLASS[tone]}>{children}</div>;
}

function CampusSection() {
  const photos: Photo[] = INSTAGRAM_PHOTOS.slice(1, 4);

  return (
    <Band id={RKPS_DISCOVER.id} tone="dark">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
        <div className="lg:col-span-5 space-y-4">
          <RkpsSectionIntro
            dark
            num="World-Class Infrastructure"
            title={RKPS_DISCOVER.title}
            description={`${RKPS_DISCOVER.subtitle} ${RKPS_DISCOVER.lead}`}
          />
          <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2 pt-2">
            {FACILITIES.map((item) => (
              <li key={item} className="flex items-center gap-2.5 border-t border-white/10 py-2.5 text-xs sm:text-sm font-medium text-white/90">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--brand-gold)]/20 text-[var(--brand-gold)] shrink-0">
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="pt-2">
            <Link href="/#contact" className="rkps-btn-gold text-xs sm:text-sm">
              {RKPS_DISCOVER.cta} ↗
            </Link>
          </div>
        </div>

        <div className="grid min-h-[28rem] grid-cols-2 grid-rows-2 gap-3 sm:min-h-[34rem] sm:h-[34rem] lg:col-span-7">
          {photos.map((photo, i) => (
            <figure
              key={photo.src}
              className={`group relative min-h-0 overflow-hidden rounded-3xl border border-white/15 bg-white/5 shadow-2xl ${
                i === 0 ? "row-span-2" : ""
              }`}
            >
              <img
                src={photo.src}
                alt={photo.alt ?? ""}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" aria-hidden />
              <figcaption className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <p className="text-sm font-bold text-[var(--brand-gold)]">{RKPS_DISCOVER.spaces[i]?.title}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-snug text-white/90">{RKPS_DISCOVER.spaces[i]?.body ?? photo.alt}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </Band>
  );
}

function VisitBanner() {
  return (
    <section aria-label="Visit RMPS" className="bg-[#f7f4ee] py-16 text-[#1f1b16] sm:py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 rkps-page-x md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-3">
          <span className="rkps-rule" aria-hidden="true" />
          <p className="text-xs text-[#5e554a]">Visit the campus</p>
          <h2 className="rkps-display text-[1.75rem] leading-tight sm:text-4xl">
            See RMPS for yourself
          </h2>
          <p className="max-w-xl text-sm leading-6 text-[#5e554a] sm:text-base">
            Walk the corridors, see the laboratories, meet the faculty, and ask the admissions questions in person.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/#admissions" className="rkps-btn-navy text-sm">
            Start an enquiry
          </Link>
          <Link
            href="/#contact"
            className="text-sm text-[#1f1b16] underline decoration-[rgba(31,27,22,0.25)] underline-offset-4 transition-colors hover:decoration-[#1f1b16]"
          >
            Plan a visit
          </Link>
        </div>
      </div>
    </section>
  );
}

function InstagramSection() {
  return (
    <Band id="instagram" tone="rose">
      <RkpsSectionIntro
        num="Social Community & Live Feed"
        title="Live moments from our Instagram community"
        description="Watch recent video reels, festival celebrations, and student spotlights straight from @r.k.m.p.s."
        action={
          <a
            href={INSTAGRAM_PROFILE}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-white px-4 py-2 text-xs font-bold text-brand shadow-sm transition hover:bg-brand hover:text-white"
          >
            <span>View Instagram Profile</span>
            <span>↗</span>
          </a>
        }
      />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:items-stretch">
        <aside className="flex min-h-[22rem] flex-col justify-between rounded-3xl bg-[var(--brand-maroon-dark)] p-6 text-white shadow-xl sm:col-span-2 sm:p-8 lg:col-span-1">
          <div>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--brand-gold)] text-[var(--brand-maroon-dark)] shadow-md">
              <Icon name="instagram" className="h-6 w-6" />
            </span>
            <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">From Our Instagram</h2>
            <span aria-hidden className="rkps-rule mt-3" />
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              Watch recent video reels and photo stories from @r.k.m.p.s capturing life in full swing on our campus.
            </p>
          </div>
          <div className="pt-6">
            <a
              href={INSTAGRAM_PROFILE}
              target="_blank"
              rel="noreferrer"
              className="rkps-btn-gold w-full text-center text-xs sm:text-sm"
            >
              Follow @r.k.m.p.s ↗
            </a>
          </div>
        </aside>

        {INSTAGRAM_REELS.map((reel) => (
          <figure
            key={reel.id}
            className="flex min-h-[22rem] flex-col overflow-hidden rounded-3xl border border-border/80 bg-white shadow-sm sm:min-h-0 lg:h-full"
          >
            <div className="relative min-h-[20rem] flex-1 sm:min-h-[22rem] lg:min-h-0">
              <iframe
                title={reel.title}
                src={`https://www.instagram.com/reel/${reel.id}/embed`}
                className="absolute inset-0 h-full w-full bg-white"
                loading="lazy"
                allow="encrypted-media"
              />
            </div>
            <figcaption className="flex shrink-0 items-center justify-between gap-3 border-t border-border/70 p-4">
              <p className="text-xs font-bold text-heading sm:text-sm">{reel.title}</p>
              <a
                href={INSTAGRAM_PROFILE}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 text-xs font-bold text-brand hover:underline"
              >
                Watch ↗
              </a>
            </figcaption>
          </figure>
        ))}
      </div>
    </Band>
  );
}

const PORTAL_FEATURES: { icon: IconName; label: string; body: string }[] = [
  {
    icon: "attendance",
    label: "Daily Attendance Tracker",
    body: "Teachers record class check-ins. Students and parents view real-time monthly attendance metrics anytime.",
  },
  {
    icon: "clock",
    label: "Timetables & Periods",
    body: "Weekly schedules from Monday to Saturday, keeping subjects, lab sessions, and activity periods structured.",
  },
  {
    icon: "exam",
    label: "Examinations & Marks",
    body: "Assessment schedules, term marks, and official digital report cards published securely for enrolled families.",
  },
  {
    icon: "bell",
    label: "Personalized Notices",
    body: "Important announcements delivered directly to classes, faculty, or students without clutter.",
  },
];

function PortalSection() {
  return (
    <section
      id="portal"
      className="relative isolate scroll-mt-28 overflow-hidden bg-[var(--brand-maroon-dark)] py-16 text-white sm:py-20 lg:py-24"
    >
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url('/marketing/portal-section-bg.jpg')" }}
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[var(--brand-maroon-dark)] via-[var(--brand-maroon-dark)]/90 to-[var(--brand-maroon-dark)]/80" aria-hidden />

      <div className="mx-auto grid max-w-7xl items-stretch gap-10 rkps-page-x lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7 space-y-6">
          <RkpsSectionIntro
            dark
            num="Unified Digital Gateway"
            title="Your RMPS Account, One Unified Sign-In"
            description="Students, teachers, and principals use our secure portal for daily attendance, academic timetables, exam results, and circulars."
          />
          <ul className="grid gap-3.5 sm:grid-cols-2 pt-2">
            {PORTAL_FEATURES.map((feature) => (
              <li key={feature.label} className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--brand-gold)] text-[var(--brand-maroon-dark)] shadow">
                  <Icon name={feature.icon} className="h-5 w-5" />
                </span>
                <p className="mt-3 text-base font-bold text-white">{feature.label}</p>
                <p className="mt-1 text-xs sm:text-sm leading-relaxed text-white/80">{feature.body}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex w-full lg:col-span-5">
          <div className="flex h-full w-full flex-col justify-between rounded-3xl border border-white/80 bg-white p-7 text-heading shadow-2xl sm:p-9">
            <div className="space-y-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-[var(--brand-gold)] shadow-md">
                <Icon name="lock" className="h-6 w-6" />
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-heading">Sign In to School Portal</h3>
              <p className="text-xs sm:text-sm leading-relaxed text-muted">
                Official credentials issued by the school administration for students, parents, teachers, and leadership.
              </p>
              <div className="rounded-2xl bg-[var(--surface-muted)] p-4 text-xs text-muted space-y-2 border border-border/70">
                <p className="font-bold text-heading">Portal Access Includes:</p>
                <p className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
                  <span>Student attendance and subject timetables</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
                  <span>Digital examination results & term report cards</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
                  <span>Official school administrative circulars</span>
                </p>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/login"
                className="rkps-btn-navy w-full text-center text-sm"
              >
                Launch Portal Login ↗
              </Link>
              <p className="mt-2.5 text-center text-xs text-muted">
                Need credential assistance? Contact the school IT helpdesk.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function RkpsHomePage() {
  return (
    <>
      <RkpsHeader />
      <main>
        <RkpsCinematicHero />

        <div className={TONE_CLASS.warm}>
          <RkpsHeroBridge />
          <RkpsQuickJumpNav
            links={[
              { href: "#explore-rmps", label: "Explore RMPS" },
              { href: "#about", label: "About" },
              { href: "#values", label: "Values" },
              { href: "#excellence", label: "Achievements" },
              { href: "#school-life", label: "School Life" },
              { href: "#academics", label: "Academics" },
              { href: "#facilities", label: "Campus" },
              { href: "#portal", label: "Portal" },
              { href: "#admissions", label: "Admissions", highlight: true },
              { href: "#parent-reviews", label: "Reviews" },
              { href: "#contact", label: "Contact" },
            ]}
          />
        </div>

        <Tint tone="warm">
          <RkpsPathwayCards
            heading="Explore R.K Memorial Public School"
            sub="Three starting points for families, prospective learners, and campus visitors."
            items={RKPS_HERO_CARDS.map((card, index) => ({
              ...card,
              photo: {
                src: EXPLORE_PATHWAY_PHOTOS[index]?.src ?? EXPLORE_PATHWAY_PHOTOS[0].src,
                alt: EXPLORE_PATHWAY_PHOTOS[index]?.alt ?? card.title,
              },
            }))}
            notesTitle="Why Families Choose RMPS"
            notes={WHY_US}
          />
        </Tint>

        {/* Dynamic Motion Banner with dual scrolling ribbons & interactive slide showcase */}
        <RkpsMotionBanner />

        <RkpsSpotlightCarousel />

        <RkpsHighlightBanner />

        <RkpsCampusStoriesSection />

        <Tint tone="rose">
          <RkpsAboutSection vision={RKPS_VISION} values={RKPS_VALUES} motto={BRAND.motto} schoolName={BRAND.name} />
        </Tint>

        <Tint tone="warm">
          <RkpsRecognitionSection />
        </Tint>

        <RkpsSchoolLifeSection />

        <Tint tone="rose">
          <RkpsLearningJourneySection />
        </Tint>

        <CampusSection />

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

        <VisitBanner />

        <PortalSection />

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
      </main>
      <RkpsFooter />
    </>
  );
}
