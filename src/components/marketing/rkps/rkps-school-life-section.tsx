import Link from "next/link";
import { STUDENT_LIFE } from "@/content/website/public-site";
import { instagramPhoto } from "@/content/website/instagram-media";
import { RkpsPageSection } from "@/components/marketing/rkps/rkps-marketing-blocks";
import { RkpsInView } from "@/components/marketing/rkps/rkps-motion-sections";

type Photo = { src: string; alt?: string };

function ArrowIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function CampusStoryCard({
  href,
  photo,
  badge,
  title,
  kicker,
  body,
  cta,
  featured = false,
  className = "",
}: {
  href: string;
  photo: Photo;
  badge: string;
  title: string;
  kicker: string;
  body: string;
  cta: string;
  featured?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group relative isolate flex h-full min-h-[14rem] flex-col justify-between overflow-hidden rounded-3xl border border-white/15 shadow-[0_16px_36px_rgba(96,0,0,0.12)] transition duration-300 hover:-translate-y-0.5 hover:shadow-2xl sm:min-h-[16rem] ${
        featured ? "min-h-[22rem] sm:min-h-[26rem] lg:min-h-[28rem]" : ""
      } ${className}`}
    >
      <img
        src={photo.src}
        alt={photo.alt ?? ""}
        loading="lazy"
        className="absolute inset-0 -z-10 h-full w-full object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/30 to-black/5"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 -z-10 bg-gradient-to-b from-black/45 to-transparent sm:h-28"
      />

      <span className="relative z-10 m-4 inline-flex w-fit max-w-[calc(100%-2rem)] items-center rounded-full border border-[var(--brand-gold)]/40 bg-[var(--brand-gold)]/20 px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-wider text-[var(--brand-gold)] backdrop-blur-md sm:m-5">
        {badge}
      </span>

      <div className="relative z-10 mt-auto p-4 pt-0 sm:p-5">
        <div className="rounded-2xl border border-white/15 bg-black/45 p-4 backdrop-blur-md sm:p-5">
          <h3
            className={`font-bold leading-snug tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)] ${
              featured ? "text-xl sm:text-2xl lg:text-3xl" : "text-lg sm:text-xl"
            }`}
          >
            {title}
          </h3>
          <p className={`mt-2 text-xs leading-relaxed text-white/90 sm:text-sm ${featured ? "line-clamp-3 sm:line-clamp-none" : "line-clamp-2"}`}>
            <span className="font-semibold text-[var(--brand-gold)]">{kicker}.</span> {body}
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-gold)] transition group-hover:translate-x-1.5">
            <span>{cta}</span>
            <ArrowIcon />
          </span>
        </div>
      </div>
    </Link>
  );
}

const GALLERY_TEASE = [
  instagramPhoto("campus-39.jpg"),
  instagramPhoto("campus-5.jpg"),
  instagramPhoto("campus-7.jpg"),
] as const;

export function RkpsSchoolLifeSection() {
  return (
    <RkpsPageSection id="school-life" tone="inset">
      <RkpsInView>
        <div className="overflow-hidden rounded-[1.75rem] border border-border/80 bg-white shadow-[0_24px_60px_rgba(96,0,0,0.07)] sm:rounded-[2rem]">
          <div className="grid lg:grid-cols-12 lg:items-stretch">
            <aside className="flex flex-col border-b border-border/70 bg-[var(--surface-elevated)] p-6 sm:p-8 lg:col-span-4 lg:border-b-0 lg:border-r lg:p-10">
              <span className="block h-1.5 w-12 rounded-full bg-[var(--brand-gold)]" aria-hidden="true" />
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-brand">Campus Life & Culture</p>
              <h2 className="rkps-display mt-2 text-2xl font-bold tracking-tight text-heading [text-wrap:balance] sm:text-3xl">
                See learners in vibrant action
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                Inspiring celebrations, cultural galas, and day-to-day school moments from our vibrant campus.
              </p>

              <div className="mt-8">
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-muted">Daily rhythms</p>
                <ul className="mt-3 divide-y divide-border/70 overflow-hidden rounded-2xl border border-border/80 bg-white">
                  {STUDENT_LIFE.map((item) => (
                    <li key={item.title} className="flex gap-3 p-4 sm:p-5">
                      <span
                        className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand"
                        aria-hidden
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5}>
                          <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-heading">{item.title}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-muted">{item.body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex flex-col gap-2.5 sm:flex-row lg:flex-col">
                <Link href="/school-life/events" className="rkps-btn-navy w-full justify-center text-center text-xs sm:text-sm">
                  Explore All Events ↗
                </Link>
                <Link
                  href="/school-life/student-achievers"
                  className="inline-flex w-full items-center justify-center rounded-full border border-border/80 bg-white px-4 py-2.5 text-xs font-semibold text-brand transition hover:border-brand/40 hover:bg-brand/5 sm:text-sm"
                >
                  Student Achievers
                </Link>
              </div>
            </aside>

            <div className="bg-[var(--background)] p-6 sm:p-8 lg:col-span-8 lg:p-8">
              <div className="mb-5 flex items-end justify-between gap-4 border-b border-border/60 pb-4">
                <div>
                  <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-muted">On campus this term</p>
                  <p className="mt-0.5 text-sm font-semibold text-heading">Stories, events, and community wins</p>
                </div>
                <span className="hidden shrink-0 rounded-full border border-brand/20 bg-brand/5 px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-wider text-brand sm:inline-flex">
                  Co-curricular
                </span>
              </div>

              <div className="rkps-stagger grid gap-4 sm:gap-5 lg:grid-cols-12 lg:grid-rows-2 lg:gap-5">
                <div className="lg:col-span-7 lg:row-span-2" style={{ ["--rkps-i" as string]: 0 }}>
                  <CampusStoryCard
                    featured
                    href="/school-life/student-achievers"
                    photo={instagramPhoto("campus-28.jpg")}
                    badge="Student Achievers"
                    title="Every learner, their own kind of remarkable"
                    kicker="Recognition without comparisons"
                    body="Explore growth in academics, athletics, creativity, and leadership. Celebrations are updated regularly."
                    cta="Visit student achievers"
                    className="h-full"
                  />
                </div>
                <div className="lg:col-span-5 lg:row-span-1" style={{ ["--rkps-i" as string]: 1 }}>
                  <CampusStoryCard
                    href="/school-life/events"
                    photo={instagramPhoto("campus-5.jpg")}
                    badge="Events & Calendar"
                    title="Programmes, festivals & sports"
                    kicker="Together in different ways"
                    body="Browse highlights from experiential learning days, sports tournaments, and stage galas."
                    cta="Browse school events"
                    className="h-full"
                  />
                </div>
                <Link
                  href="/#gallery"
                  className="group relative flex min-h-[14rem] flex-col overflow-hidden rounded-3xl border border-border/80 bg-[var(--brand-maroon-dark)] shadow-md transition hover:-translate-y-0.5 hover:shadow-xl lg:col-span-5 lg:row-span-1 lg:min-h-0"
                  style={{ ["--rkps-i" as string]: 2 }}
                >
                  <div className="grid h-full min-h-[10rem] flex-1 grid-cols-3 gap-0.5 p-1">
                    {GALLERY_TEASE.map((photo) => (
                      <div key={photo.src} className="relative overflow-hidden rounded-2xl">
                        <img
                          src={photo.src}
                          alt=""
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3.5 text-white sm:px-5">
                    <div>
                      <p className="text-[0.6875rem] font-bold uppercase tracking-wider text-[var(--brand-gold)]">Campus gallery</p>
                      <p className="text-sm font-semibold">More moments from school life</p>
                    </div>
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-[var(--brand-gold)] transition group-hover:bg-white/15">
                      <ArrowIcon className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </RkpsInView>
    </RkpsPageSection>
  );
}
