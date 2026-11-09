"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { instagramPhoto } from "@/content/website/instagram-media";

/* -------------------------------------------------------------------------- */
/*  Shared scroll helpers                                                      */
/* -------------------------------------------------------------------------- */

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return reduced;
}

/** 0 → 1 as the element scrolls from its top hitting the viewport top to its bottom hitting the viewport bottom. */
function useScrollProgress(ref: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const next = travel <= 0 ? 0 : Math.min(1, Math.max(0, -rect.top / travel));
      setProgress(next);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [ref]);
  return progress;
}

/* -------------------------------------------------------------------------- */
/*  Page-level: reading progress bar + reveal-on-scroll                        */
/* -------------------------------------------------------------------------- */

/** Thin gold line under the header that fills as the page is read. */
export function RkpsScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max > 0 ? window.scrollY / max : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${value})`;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[120] h-[3px]" aria-hidden>
      <div ref={barRef} className="h-full origin-left scale-x-0 bg-[var(--brand-gold)]" />
    </div>
  );
}

/**
 * Fades and lifts the content of each homepage section once, the first time it scrolls into view.
 * Classes are only added from JS, so the page reads normally without it.
 */
export function RkpsScrollReveal({ skip = 1 }: { skip?: number }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section")).slice(skip);
    const targets = sections
      .filter((section) => !section.hasAttribute("data-scroll-scene"))
      .flatMap((section) => Array.from(section.children) as HTMLElement[])
      .filter((el) => el.getBoundingClientRect().top > window.innerHeight * 0.9);

    targets.forEach((el) => el.classList.add("rkps-sr"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("rkps-sr-in");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [skip]);
  return null;
}

/* -------------------------------------------------------------------------- */
/*  Campus moments — sticky photo, steps driven by scroll                      */
/*  Each step is named after what its photo actually shows.                    */
/* -------------------------------------------------------------------------- */

const MOMENT_PHOTO = (file: string, alt: string) => ({ src: `/marketing/school-day/${file}`, alt });

type Moment = {
  place: string;
  title: string;
  body: string;
  photo: { src: string; alt: string };
  extras?: { src: string; alt: string; caption: string }[];
};

const MOMENTS: Moment[] = [
  {
    place: "School hall",
    title: "Together in the hall",
    body: "Rows of students settle into the school hall for assembly, talks and special programmes — the one room where every class meets.",
    photo: { src: instagramPhoto("campus-23.jpg").src, alt: "Students seated in rows in the school hall" },
  },
  {
    place: "Chemistry lab",
    title: "Learning at the lab bench",
    body: "Senior students gather round the bench while the teacher walks through an experiment step by step — the apparatus, the method, and the questions to ask before trying it themselves.",
    photo: MOMENT_PHOTO("lab-lesson.jpg", "A teacher explaining an experiment to students in the chemistry laboratory"),
  },
  {
    place: "School grounds",
    title: "Friends under the trees",
    body: "Blazers, ties and big smiles. Time on the grounds is when friendships form across sections and classes.",
    photo: MOMENT_PHOTO("break-friends.webp", "Students in school blazers smiling together outdoors under the trees"),
  },
  {
    place: "Science centre & museum",
    title: "Learning beyond the classroom",
    body: "Field visits turn textbook chapters into things students can touch — a giant model of the human heart, a museum gallery, a demonstration room full of masks and history.",
    photo: MOMENT_PHOTO("science-centre-heart.webp", "A student using an interactive heart exhibit at a science centre"),
    extras: [
      { ...MOMENT_PHOTO("museum-visit.webp", "Primary students and teachers on a museum visit"), caption: "Museum visit" },
      { ...MOMENT_PHOTO("demonstration-room.webp", "Students with their teacher in a museum demonstration room"), caption: "Demonstration room" },
    ],
  },
  {
    place: "School hall",
    title: "One school family",
    body: "Students, teachers and staff together in one frame — the people who make the school what it is, every day of the year.",
    photo: { src: instagramPhoto("campus-15.jpg").src, alt: "Students and staff together in the school hall" },
  },
  {
    place: "Biology lab & sports ground",
    title: "Microscopes and medals",
    body: "One student leans into a microscope to study a slide; others stand on the podium at the DPSG Cup with medals and certificates. Curiosity and effort — in the lab and on the ground.",
    photo: MOMENT_PHOTO("microscope.jpg", "A student looking through a microscope in the biology laboratory"),
    extras: [
      { ...MOMENT_PHOTO("dpsg-cup-boys.jpg", "Boys with medals and certificates on the podium at the DPSG Cup"), caption: "DPSG Cup · boys" },
      { ...MOMENT_PHOTO("dpsg-cup-girls.jpg", "Girls with medals and certificates on the podium at the DPSG Cup"), caption: "DPSG Cup · girls" },
    ],
  },
];

const pad2 = (n: number) => String(n).padStart(2, "0");

export function RkpsSchoolDaySection() {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(trackRef);

  // The photo follows the step title the reader is looking at: the last title that has
  // scrolled above 55% of the viewport height is the active one.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.55;
      let next = 0;
      stepRefs.current.forEach((li, index) => {
        const heading = li?.querySelector("h3");
        if (heading && heading.getBoundingClientRect().top <= line) next = index;
      });
      setActive(next);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const step = MOMENTS[active];

  return (
    <section
      id="school-day"
      data-scroll-scene
      aria-labelledby="school-day-title"
      className="scroll-mt-28 bg-[var(--rkps-bg)] text-[var(--rkps-text-body)]"
    >
      <div className="mx-auto max-w-7xl rkps-page-x pt-16 sm:pt-20 lg:pt-24">
        <div className="max-w-3xl">
          <span className="rkps-rule" aria-hidden="true" />
          <p className="rkps-text-label mt-4 text-sm">Campus moments</p>
          <h2 id="school-day-title" className="rkps-display mt-2 text-[2.25rem] leading-[1.08] text-heading sm:text-5xl lg:text-[3.5rem]">
            Where our students learn, play and grow
          </h2>
          <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-muted sm:text-lg">
            Six moments from the school&rsquo;s own photographs — the assembly hall, the lab bench, the school grounds, field
            visits and the sports podium.
          </p>
        </div>
      </div>

      <div ref={trackRef} className="mx-auto grid max-w-7xl gap-8 rkps-page-x pb-16 pt-10 sm:pb-20 lg:grid-cols-12 lg:gap-12 lg:pb-24">
        {/* Sticky visual */}
        <div className="hidden lg:col-span-6 lg:block">
          <div className="sticky top-[calc(var(--rkps-sticky-top)+1rem)]">
            <div className="relative aspect-[4/5] max-h-[calc(100dvh-13rem)] w-full overflow-hidden rounded-2xl bg-[var(--surface-muted)]">
              {MOMENTS.map((item, index) => (
                <img
                  key={item.title}
                  src={item.photo.src}
                  alt={index === active ? item.photo.alt : ""}
                  aria-hidden={index !== active}
                  loading={index === 0 ? "eager" : "lazy"}
                  className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    index === active ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" aria-hidden />
              <span className="absolute left-5 top-5 rounded-full bg-black/45 px-3 py-1 font-mono text-sm tabular-nums text-white backdrop-blur-sm">
                {pad2(active + 1)} / {pad2(MOMENTS.length)}
              </span>
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8" aria-live="polite">
                <p className="text-sm text-[var(--brand-gold)]">{step.place}</p>
                <p className="rkps-display mt-2 text-3xl leading-tight [text-wrap:balance] xl:text-4xl">{step.title}</p>
              </div>
            </div>
            {/* Progress through the moments */}
            <div className="mt-4 h-1 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--rkps-text-body)_10%,transparent)]" aria-hidden>
              <div
                className="h-full origin-left rounded-full bg-[var(--brand-maroon)]"
                style={{ transform: `scaleX(${Math.max(0.04, progress)})` }}
              />
            </div>
            <div className="mt-2 flex justify-between font-mono text-xs tabular-nums text-muted" aria-hidden>
              <span>01</span>
              <span>{pad2(MOMENTS.length)}</span>
            </div>
          </div>
        </div>

        {/* Steps */}
        <ol className="relative lg:col-span-6">
          <span
            className="absolute bottom-0 left-[0.4375rem] top-0 w-px bg-[color-mix(in_srgb,var(--rkps-text-body)_12%,transparent)]"
            aria-hidden
          />
          {MOMENTS.map((item, index) => {
            const isActive = index === active;
            return (
              <li
                key={item.title}
                ref={(el) => {
                  stepRefs.current[index] = el;
                }}
                data-index={index}
                className="relative pb-12 pl-10 last:pb-0 lg:flex lg:min-h-[62vh] lg:flex-col lg:justify-center lg:pb-0"
              >
                <span
                  className={`absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 transition-colors duration-300 lg:top-[calc(50%-0.5rem)] ${
                    isActive
                      ? "border-[var(--brand-maroon)] bg-[var(--brand-maroon)]"
                      : "border-[color-mix(in_srgb,var(--rkps-text-body)_25%,transparent)] bg-[var(--rkps-bg)]"
                  }`}
                  aria-hidden
                />
                <div className={`transition-opacity duration-300 ${isActive ? "opacity-100" : "lg:opacity-40"}`}>
                  <img
                    src={item.photo.src}
                    alt={item.photo.alt}
                    loading="lazy"
                    className="mb-5 aspect-[16/10] w-full rounded-xl object-cover lg:hidden"
                  />
                  <p className="flex items-center gap-3 text-base">
                    <span className="font-mono tabular-nums text-brand">{pad2(index + 1)}</span>
                    <span className="h-px w-8 bg-[color-mix(in_srgb,var(--rkps-text-body)_20%,transparent)]" aria-hidden />
                    <span className="text-muted">{item.place}</span>
                  </p>
                  <h3 className="rkps-display mt-2 text-[1.875rem] leading-tight text-heading sm:text-4xl lg:text-[2.75rem]">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-lg text-base leading-relaxed text-muted sm:text-lg">{item.body}</p>
                  {item.extras ? (
                    <ul className="mt-5 grid max-w-lg grid-cols-2 gap-3">
                      {item.extras.map((extra) => (
                        <li key={extra.src}>
                          <figure>
                            <div className="aspect-[4/3] overflow-hidden rounded-xl bg-[var(--surface-muted)]">
                              <img src={extra.src} alt={extra.alt} loading="lazy" className="h-full w-full object-cover" />
                            </div>
                            <figcaption className="mt-2 text-sm text-muted">{extra.caption}</figcaption>
                          </figure>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  The school year — vertical scroll drives a horizontal strip               */
/* -------------------------------------------------------------------------- */

const SCHOOL_YEAR = [
  {
    label: "Term 1",
    title: "Festivals on campus",
    body: "Dussehra and the festive season bring performances, traditional dress and class programmes.",
    photo: instagramPhoto("campus-4.jpg"),
    href: "/school-life/events",
  },
  {
    label: "Term 1",
    title: "Stage and talent",
    body: "Dance, music and drama in the school hall, with every class on stage at least once.",
    photo: instagramPhoto("campus-5.jpg"),
    href: "/school-life/events",
  },
  {
    label: "Term 2",
    title: "Annual sports week",
    body: "House events, track races and team games on the school ground.",
    photo: instagramPhoto("campus-22.jpg"),
    href: "/school-life/events",
  },
  {
    label: "Term 2",
    title: "Science exhibition",
    body: "Working models and projects from the science and computer labs, presented by students.",
    photo: instagramPhoto("campus-19.jpg"),
    href: "/school-life/events",
  },
  {
    label: "Through the year",
    title: "Community work",
    body: "Health and hygiene drives with the Rotary Club and student volunteers.",
    photo: instagramPhoto("campus-36.jpg"),
    href: "/school-life/events",
  },
  {
    label: "Year end",
    title: "Recognition",
    body: "Students recognised for effort in academics, sport, the arts and service.",
    photo: instagramPhoto("campus-26.jpg"),
    href: "/school-life/student-achievers",
  },
] as const;

export function RkpsSchoolYearSection() {
  const sceneRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const reduced = usePrefersReducedMotion();
  const progress = useScrollProgress(sceneRef);
  const [pinned, setPinned] = useState(false);
  const [shift, setShift] = useState(0);

  // Pin only on wide screens with motion allowed; phones get a native swipe strip.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const measure = () => {
      const canPin = query.matches && !reduced;
      setPinned(canPin);
      const track = trackRef.current;
      if (track) setShift(Math.max(0, track.scrollWidth - track.clientWidth));
    };
    measure();
    query.addEventListener("change", measure);
    window.addEventListener("resize", measure);
    return () => {
      query.removeEventListener("change", measure);
      window.removeEventListener("resize", measure);
    };
  }, [reduced]);

  return (
    <section
      ref={sceneRef}
      id="school-year"
      data-scroll-scene
      aria-labelledby="school-year-title"
      className="relative scroll-mt-28 bg-[var(--rkps-primary)] text-white"
      style={pinned ? { height: `calc(100dvh + ${shift}px)` } : undefined}
    >
      <div className={pinned ? "sticky top-0 flex h-[100dvh] flex-col justify-center overflow-hidden pb-8 pt-[var(--rkps-sticky-top)]" : "py-16 sm:py-20"}>
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-end justify-between gap-6 rkps-page-x">
          <div className="max-w-xl">
            <span className="rkps-rule" aria-hidden="true" />
            <p className="mt-3 text-xs text-white/75">The school year</p>
            <h2 id="school-year-title" className="rkps-display mt-1 text-[1.75rem] leading-tight sm:text-4xl">
              What a year at RMPS looks like
            </h2>
          </div>
          <div className="flex items-center gap-3 font-mono text-sm tabular-nums text-white/75" aria-hidden>
            <span>{String(Math.min(SCHOOL_YEAR.length, Math.floor(progress * SCHOOL_YEAR.length) + 1)).padStart(2, "0")}</span>
            <span className="relative h-px w-24 bg-white/25">
              <span
                className="absolute inset-y-0 left-0 w-full origin-left bg-[var(--brand-gold)]"
                style={{ transform: `scaleX(${pinned ? progress : 1})` }}
              />
            </span>
            <span>{String(SCHOOL_YEAR.length).padStart(2, "0")}</span>
          </div>
        </div>

        <ul
          ref={trackRef}
          className={`mt-10 flex gap-4 rkps-page-x sm:gap-6 ${
            pinned
              ? "overflow-visible will-change-transform lg:pl-[max(var(--rkps-gutter-x),calc((100vw-80rem)/2+var(--rkps-gutter-x)))]"
              : "snap-x snap-mandatory scroll-px-[var(--rkps-gutter-x)] overflow-x-auto pb-4 [scrollbar-width:none]"
          }`}
          style={pinned ? { transform: `translate3d(${-progress * shift}px,0,0)` } : undefined}
        >
          {SCHOOL_YEAR.map((item, index) => (
            <li key={item.title} className="w-[78vw] shrink-0 snap-start sm:w-[22rem] lg:w-[24rem]">
              <Link href={item.href} className="group block focus-visible:outline-none">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white/10">
                  <img
                    src={item.photo.src}
                    alt={item.photo.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                  />
                  <span className="absolute left-4 top-4 font-mono text-xs tabular-nums text-white/90">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="mt-4 text-xs text-[var(--brand-gold)]">{item.label}</p>
                <h3 className="mt-1 text-lg font-medium text-white group-hover:underline group-focus-visible:underline">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-white/75">{item.body}</p>
              </Link>
            </li>
          ))}
          <li className="flex w-[60vw] shrink-0 snap-start items-center sm:w-[16rem]">
            <Link href="/school-life/events" className="rkps-btn-gold text-sm">
              See the events calendar
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
