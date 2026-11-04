"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent as ReactFocusEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { RKPS_HERO } from "@/content/website/rkps-copy";
import { LATEST_NEWS } from "@/content/website/public-site";
import { INSTAGRAM_PHOTOS, instagramPhoto } from "@/content/website/instagram-media";

/* -------------------------------------------------------------------------- */
/*  Shared constants & helpers                                                 */
/* -------------------------------------------------------------------------- */

// Change this one value when a new admission session opens.
const SESSION = "2026–27";

const pad = (n: number) => String(n).padStart(2, "0");

const FOCUS_DARK =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand-maroon-dark)]";
const FOCUS_LIGHT =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";

const SLIDES = [
  {
    photo: INSTAGRAM_PHOTOS[0],
    kicker: RKPS_HERO.eyebrow,
    title: RKPS_HERO.line1,
    accent: RKPS_HERO.line2,
    body: RKPS_HERO.lead,
  },
  {
    photo: instagramPhoto("campus-7.jpg"),
    kicker: "School Life & Celebrations",
    title: "A place to belong.",
    accent: "Celebrations that stay with you.",
    body: "Festivals, sport and everyday kindness sit beside rigorous academic learning.",
  },
  {
    photo: instagramPhoto("campus-4.jpg"),
    kicker: `Admissions ${SESSION} Open`,
    title: "Your next chapter",
    accent: "starts with a warm hello.",
    body: "Visit our campus and talk to the admissions team about the learning journey you are exploring.",
  },
] as const;

const SPOTLIGHTS = [
  {
    figure: "25+",
    title: "Years of Excellence",
    body: "A trusted school that has nurtured generations of curious learners, from foundational years to senior secondary.",
  },
  {
    figure: "1,200+",
    title: "Students on Campus",
    body: "Learners from early childhood through grade 12, each known by name, supported in their unique growth.",
  },
  {
    figure: "80+",
    title: "Dedicated Faculty",
    body: "Experienced educators who foster curiosity, academic rigor, and the courage to think independently.",
  },
  {
    figure: "98%",
    title: "Board Pass Rate",
    body: "Consistent high-standard board performance with distinguished distinctions across science, commerce and humanities.",
  },
] as const;

const HIGHLIGHTS = [
  instagramPhoto("campus-8.jpg"),
  instagramPhoto("campus-28.jpg"),
  instagramPhoto("campus-5.jpg"),
  instagramPhoto("campus-19.jpg"),
  instagramPhoto("campus-22.jpg"),
  instagramPhoto("campus-6.jpg"),
] as const;

/* -------------------------------------------------------------------------- */
/*  Carousel hook: autoplay + swipe + pause (hover / keyboard focus / button)  */
/* -------------------------------------------------------------------------- */

function useCarousel(length: number, ms: number) {
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const playing = length > 1 && !reduced && !userPaused && !hovering && !focused;

  // A timeout (not an interval) so a manual slide change restarts the countdown.
  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => setIndex((current) => (current + 1) % length), ms);
    return () => window.clearTimeout(id);
  }, [playing, index, length, ms]);

  const go = useCallback(
    (target: number) => setIndex(((target % length) + length) % length),
    [length],
  );
  const next = useCallback(() => setIndex((current) => (current + 1) % length), [length]);
  const prev = useCallback(() => setIndex((current) => (current - 1 + length) % length), [length]);

  const handlers = {
    onTouchStart: (e: ReactTouchEvent<HTMLElement>) => {
      const t = e.touches[0];
      touchStart.current = t ? { x: t.clientX, y: t.clientY } : null;
    },
    onTouchEnd: (e: ReactTouchEvent<HTMLElement>) => {
      const start = touchStart.current;
      const t = e.changedTouches[0];
      touchStart.current = null;
      if (!start || !t) return;
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      // Only treat clearly horizontal swipes as navigation so vertical scroll still works.
      if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      if (dx < 0) next();
      else prev();
    },
    onPointerEnter: (e: ReactPointerEvent<HTMLElement>) => {
      if (e.pointerType === "mouse") setHovering(true);
    },
    onPointerLeave: () => setHovering(false),
    onFocus: (e: ReactFocusEvent<HTMLElement>) => {
      try {
        setFocused(e.target.matches(":focus-visible"));
      } catch {
        setFocused(true);
      }
    },
    onBlur: () => setFocused(false),
  };

  return {
    index,
    go,
    next,
    prev,
    playing,
    reduced,
    userPaused,
    togglePaused: () => setUserPaused((value) => !value),
    handlers,
  };
}

/* -------------------------------------------------------------------------- */
/*  Small shared UI pieces                                                     */
/* -------------------------------------------------------------------------- */

function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="max-w-2xl">
      <span className="rkps-rule" aria-hidden="true" />
      <p className="mt-3 text-xs text-brand">{eyebrow}</p>
      <h2
        id={id}
        className="rkps-display mt-1 text-[1.75rem] leading-tight text-heading [text-wrap:balance] sm:text-4xl"
      >
        {title}
      </h2>
      {intro ? (
        <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-muted sm:text-base">{intro}</p>
      ) : null}
    </div>
  );
}

function ArrowButton({
  direction,
  onClick,
  label,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`grid h-11 w-11 place-items-center rounded-full border border-border bg-white text-heading shadow-sm transition hover:border-brand hover:text-brand active:scale-95 ${FOCUS_LIGHT}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={direction === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
      </svg>
    </button>
  );
}

function PauseButton({
  paused,
  onToggle,
  tone,
}: {
  paused: boolean;
  onToggle: () => void;
  tone: "dark" | "light";
}) {
  const palette =
    tone === "dark"
      ? `border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 ${FOCUS_DARK}`
      : `border-border bg-white text-heading shadow-sm hover:border-brand hover:text-brand ${FOCUS_LIGHT}`;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={paused ? "Play slideshow" : "Pause slideshow"}
      className={`grid h-10 w-10 place-items-center rounded-full border transition active:scale-95 ${palette}`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        {paused ? (
          <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
        ) : (
          <>
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </>
        )}
      </svg>
    </button>
  );
}

function SlideDots({
  labels,
  index,
  onSelect,
}: {
  labels: readonly string[];
  index: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex items-center">
      {labels.map((label, i) => (
        <button
          key={`${label}-${i}`}
          type="button"
          aria-label={`Show slide ${i + 1}: ${label}`}
          aria-current={i === index ? "true" : undefined}
          onClick={() => onSelect(i)}
          className={`grid h-10 min-w-[1.5rem] place-items-center rounded-full ${FOCUS_DARK}`}
        >
          <span
            className={`block h-2 rounded-full transition-all duration-300 motion-reduce:transition-none ${
              i === index
                ? "w-7 bg-[var(--brand-gold)] shadow-[0_0_12px_rgba(244,200,106,0.6)]"
                : "w-2 bg-white/45"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Scroll reveal                                                              */
/* -------------------------------------------------------------------------- */

export function RkpsInView({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${shown ? "rkps-reveal-inview" : ""} ${className}`}>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Story hero (used on inner pages)                                           */
/* -------------------------------------------------------------------------- */

type StorySlide = {
  photo: { src: string; alt: string };
  kicker: string;
  title: string;
  accent: string;
  body: string;
};

export function RkpsStoryHero({
  slides,
  primary,
  secondary,
}: {
  slides: readonly StorySlide[];
  primary: { href: string; label: string };
  secondary?: { href: string; label: string; external?: boolean };
}) {
  const c = useCarousel(slides.length, 6000);
  const slide = slides[c.index] ?? slides[0];
  if (!slide) return null;

  return (
    <section
      className="relative isolate min-h-[28rem] overflow-hidden bg-[var(--rkps-burgundy)] text-white sm:min-h-[32rem] lg:min-h-[36rem]"
      role="region"
      aria-roledescription="carousel"
      aria-label={slide.title}
      {...c.handlers}
    >
      {slides.map((item, i) => (
        <div
          key={item.photo.src}
          className={`absolute inset-0 transition-opacity duration-1000 motion-reduce:transition-none ${
            i === c.index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={i !== c.index}
        >
          <img
            src={item.photo.src}
            alt={i === c.index ? item.photo.alt : ""}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            className={`h-full w-full object-cover ${i === c.index ? "rkps-ken" : ""}`}
          />
        </div>
      ))}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10 lg:bg-gradient-to-r lg:from-black/70 lg:via-black/35 lg:to-transparent"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-[28rem] max-w-7xl flex-col rkps-page-x pb-4 pt-14 sm:min-h-[32rem] sm:pt-20 lg:min-h-[36rem]">
        <div
          key={slide.photo.src}
          className="flex flex-1 flex-col justify-end space-y-3 sm:space-y-4 lg:max-w-3xl"
          aria-live={c.playing ? "off" : "polite"}
        >
          <div className="space-y-3">
            <span className="rkps-rule" aria-hidden="true" />
            <p className="max-w-xl truncate text-xs text-white/80">{slide.kicker}</p>
          </div>

          <h1 className="rkps-display max-w-[18ch] text-4xl leading-[1.05] text-white [text-wrap:balance] sm:text-6xl">
            {slide.title}
            <span className="mt-2 block text-white/80">{slide.accent}</span>
          </h1>

          <p className="rkps-reveal max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base lg:text-lg">
            {slide.body}
          </p>

          <div className="rkps-reveal flex flex-col gap-2.5 pt-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3.5">
            <a
              href={primary.href}
              className={`rkps-btn-gold inline-flex w-full items-center justify-center text-center text-sm sm:w-auto ${FOCUS_DARK}`}
            >
              {primary.label}
            </a>
            {secondary ? (
              <a
                href={secondary.href}
                target={secondary.external ? "_blank" : undefined}
                rel={secondary.external ? "noreferrer" : undefined}
                className={`inline-flex min-h-11 items-center text-sm text-white/90 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white ${FOCUS_DARK}`}
              >
                <span>{secondary.label}</span>
                {secondary.external ? <span className="text-xs">↗</span> : null}
              </a>
            ) : null}
          </div>
        </div>

        {slides.length > 1 ? (
          <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/15 pt-2">
            <div className="flex items-center gap-2">
              <SlideDots labels={slides.map((s) => s.title)} index={c.index} onSelect={c.go} />
              <span className="text-xs font-semibold tabular-nums text-white/65">
                {pad(c.index + 1)} / {pad(slides.length)}
              </span>
            </div>
            {!c.reduced ? <PauseButton tone="dark" paused={c.userPaused} onToggle={c.togglePaused} /> : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Notice marquee                                                             */
/* -------------------------------------------------------------------------- */

export function RkpsNewsMarquee() {
  const items = [
    { href: "/#admissions", label: `Admissions Open for Session ${SESSION} (Pre-Primary to Grade 12)` },
    ...LATEST_NEWS.map((item) => ({ href: "/#noticeboard", label: item.title })),
    { href: "/school-life/events", label: "Explore upcoming sports, arts, and cultural celebrations" },
    { href: "/school-life/student-achievers", label: "Celebrating remarkable growth & student accomplishments" },
  ];
  const loop = [...items, ...items];

  return (
    <div className="border-t border-white/10 bg-[var(--brand-maroon-dark)] text-white" role="region" aria-label="Latest notices">
      <div className="mx-auto flex max-w-7xl items-center gap-2 rkps-page-x">
        <div className="relative z-10 flex shrink-0 items-center gap-2 bg-[var(--brand-maroon-dark)] py-2 pr-4 text-xs text-[var(--brand-gold)]">
          <span className="rkps-rule w-4" aria-hidden="true" />
          <span>Notice</span>
        </div>
        <div className="rkps-marquee min-w-0 flex-1 overflow-hidden py-2.5 text-xs motion-reduce:overflow-x-auto sm:text-sm">
          <div className="rkps-marquee-track hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:![animation:none]">
            {loop.map((item, i) => {
              const isClone = i >= items.length;
              return (
                <Link
                  key={`${item.label}-${i}`}
                  href={item.href}
                  aria-hidden={isClone || undefined}
                  tabIndex={isClone ? -1 : undefined}
                  className={`inline-flex shrink-0 items-center gap-3 whitespace-nowrap px-5 py-0.5 font-medium text-white/90 transition hover:text-[var(--brand-gold)] focus-visible:text-[var(--brand-gold)] focus-visible:outline-none ${
                    isClone ? "motion-reduce:hidden" : ""
                  }`}
                >
                  <span className="h-1 w-1 rounded-full bg-[var(--brand-gold)]" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Home hero                                                                  */
/* -------------------------------------------------------------------------- */

export function RkpsCinematicHero() {
  const c = useCarousel(SLIDES.length, 6500);
  const slide = SLIDES[c.index];

  return (
    <section
      className="relative isolate min-h-[32rem] overflow-hidden bg-[var(--brand-maroon-dark)] text-white sm:min-h-[38rem] lg:min-h-[calc(100dvh-4.5rem)]"
      role="region"
      aria-roledescription="carousel"
      aria-label="R.K. Memorial highlights"
      {...c.handlers}
    >
      {SLIDES.map((item, i) => (
        <div
          key={item.title}
          className={`absolute inset-0 overflow-hidden transition-opacity duration-1000 motion-reduce:transition-none ${
            i === c.index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={i !== c.index}
        >
          <img
            src={item.photo.src}
            alt={i === c.index ? item.photo.alt : ""}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            className={`h-full w-full origin-center object-cover ${i === c.index ? "rkps-ken" : ""}`}
          />
        </div>
      ))}

      {/* Scrims: neutral (not maroon) so campus photos stay true; darken only where copy sits */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10 lg:bg-gradient-to-r lg:from-black/70 lg:via-black/30 lg:to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 to-transparent sm:h-36"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-[32rem] max-w-7xl flex-col rkps-page-x pb-4 pt-16 sm:min-h-[38rem] sm:pt-20 lg:min-h-[calc(100dvh-4.5rem)] lg:pb-6">
        <div
          key={slide.title}
          className="flex flex-1 flex-col justify-end space-y-4 lg:max-w-3xl lg:justify-center"
          aria-live={c.playing ? "off" : "polite"}
        >
          <div className="space-y-3">
            <span className="rkps-rule" aria-hidden="true" />
            <p className="max-w-xl truncate text-xs text-white/80">{slide.kicker}</p>
          </div>

          <h1 className="rkps-display max-w-[16ch] text-[2.25rem] leading-[1.05] text-white [text-wrap:balance] sm:text-5xl lg:text-[4.5rem]">
            {slide.title}
            <span className="mt-2 block text-white/80">{slide.accent}</span>
          </h1>

          <p className="rkps-reveal max-w-xl text-sm leading-7 text-white/80 sm:text-lg">
            {slide.body}
          </p>

          <div className="rkps-reveal flex flex-col items-start gap-3 pt-2 sm:flex-row sm:items-center">
            <Link
              href={RKPS_HERO.primary.href}
              className={`rkps-btn-gold w-full sm:w-auto ${FOCUS_DARK}`}
            >
              {RKPS_HERO.primary.label}
            </Link>
            <Link
              href={RKPS_HERO.secondary.href}
              className={`inline-flex min-h-11 items-center text-sm text-white/90 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white ${FOCUS_DARK}`}
            >
              {RKPS_HERO.secondary.label}
            </Link>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/15 pt-2">
          <div className="flex items-center gap-2">
            <SlideDots labels={SLIDES.map((s) => s.title)} index={c.index} onSelect={c.go} />
            <span className="text-xs font-semibold tabular-nums text-white/65">
              {pad(c.index + 1)} / {pad(SLIDES.length)}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-xs text-white/60 md:inline">Scroll</span>
            {!c.reduced ? <PauseButton tone="dark" paused={c.userPaused} onToggle={c.togglePaused} /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Count-up number                                                            */
/* -------------------------------------------------------------------------- */

function parseStat(value: string) {
  const match = value.match(/^(\D*)([\d,]+)(.*)$/);
  if (!match) return { prefix: "", target: 0, suffix: value };
  return { prefix: match[1], target: Number(match[2].replace(/,/g, "")), suffix: match[3] };
}

export function RkpsCountValue({ value }: { value: string }) {
  const { prefix, target, suffix } = parseStat(value);
  const [shown, setShown] = useState(0);
  const [node, setNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || target === 0) {
      setShown(target);
      return;
    }
    let frame = 0;
    let start = 0;
    const duration = 1400;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const tick = (now: number) => {
          if (!start) start = now;
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - (1 - progress) ** 3;
          setShown(Math.round(target * eased));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [node, target]);

  const formatted = target >= 1000 ? shown.toLocaleString("en-IN") : String(shown);
  return (
    <span ref={setNode}>
      {/* Screen readers get the final value, not every animation frame. */}
      <span aria-hidden="true">
        {prefix}
        {formatted}
        {suffix}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  School in numbers                                                          */
/*  All four stats are visible at once: 2×2 on phones, one row on desktop.     */
/* -------------------------------------------------------------------------- */

export function RkpsSpotlightCarousel() {
  return (
    <section
      className="border-y border-border/80 bg-[var(--rkps-bg-subtle)] py-10 sm:py-14 lg:py-16"
      aria-labelledby="rkps-spotlight-title"
    >
      <div className="mx-auto max-w-7xl rkps-page-x">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="rkps-spotlight-title"
            eyebrow="School in numbers"
            title="Every metric reflects a student’s journey"
            intro="Beyond numbers and figures, each milestone represents curious questions, faculty support, and family encouragement."
          />
          <Link
            href="#excellence"
            className={`rkps-btn-secondary rkps-btn-sm shrink-0 ${FOCUS_LIGHT}`}
          >
            <span>View all achievements</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {SPOTLIGHTS.map((item) => (
            <li
              key={item.title}
              className="flex flex-col rounded-2xl bg-gradient-to-br from-[var(--brand-maroon-dark)] to-[var(--brand-maroon)] p-4 text-white shadow-[0_12px_28px_rgba(96,0,0,0.16)] sm:p-6"
            >
              <p className="text-3xl font-extrabold tracking-tight text-[var(--brand-gold)] tabular-nums sm:text-5xl">
                <RkpsCountValue value={item.figure} />
              </p>
              <h3 className="mt-2 text-sm font-bold leading-snug text-white sm:mt-3 sm:text-lg">{item.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-white/75 sm:text-sm">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Photo reel                                                                 */
/* -------------------------------------------------------------------------- */

export function RkpsHighlightsReel() {
  const loop = [...HIGHLIGHTS, ...HIGHLIGHTS];
  return (
    <section
      className="w-full overflow-hidden bg-[color-mix(in_srgb,var(--rkps-highlight)_12%,var(--rkps-bg))] py-10 sm:py-14 lg:py-16"
      aria-labelledby="rkps-reel-title"
    >
      <div className="mx-auto max-w-7xl rkps-page-x">
        <SectionHeading id="rkps-reel-title" eyebrow="Campus gallery" title="Moments from around campus" />
      </div>
      <div className="rkps-marquee mt-6 w-full motion-reduce:overflow-x-auto sm:mt-8">
        <div className="rkps-marquee-track gap-4 px-4 hover:[animation-play-state:paused] motion-reduce:![animation:none]">
          {loop.map((photo, i) => {
            const isClone = i >= HIGHLIGHTS.length;
            return (
              <figure
                key={`${photo.src}-${i}`}
                aria-hidden={isClone || undefined}
                className={`relative h-52 w-[78vw] max-w-[22rem] shrink-0 overflow-hidden rounded-2xl shadow-md sm:h-64 sm:w-[28rem] sm:max-w-none ${
                  isClone ? "motion-reduce:hidden" : ""
                }`}
              >
                <img
                  src={photo.src}
                  alt={isClone ? "" : photo.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
                <figcaption className="absolute inset-x-0 bottom-0 line-clamp-2 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-4 pt-8 text-xs font-semibold text-white">
                  {photo.alt}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Highlight banner                                                           */
/* -------------------------------------------------------------------------- */

const BANNERS = [
  {
    photo: instagramPhoto("campus-28.jpg"),
    kicker: "School Life & Co-Curricular",
    title: "See learners in vibrant action",
    body: "Festivals, sports tournaments, and everyday classroom inquiry from the official school feed.",
    href: "/school-life/events",
  },
  {
    photo: instagramPhoto("campus-19.jpg"),
    kicker: "Academic Rigor",
    title: "A world to learn. A future to shape.",
    body: "From foundational early childhood education to senior secondary boards, with room for questions and critical thinking.",
    href: "/#academics",
  },
  {
    photo: instagramPhoto("campus-7.jpg"),
    kicker: `Admissions Open ${SESSION}`,
    title: "Your next chapter starts here",
    body: "Experience our state-of-the-art campus, speak with our faculty, and discover the right class for your child.",
    href: "/#admissions",
  },
] as const;

export function RkpsHighlightBanner() {
  const c = useCarousel(BANNERS.length, 5500);
  const banner = BANNERS[c.index];

  return (
    <section
      className="w-full bg-[var(--surface-elevated)] py-10 sm:py-14 lg:py-16"
      role="region"
      aria-roledescription="carousel"
      aria-labelledby="rkps-banner-title"
      {...c.handlers}
    >
      <div className="mx-auto max-w-7xl rkps-page-x">
        <SectionHeading id="rkps-banner-title" eyebrow="Highlights" title="United in spirit. Alive on campus." />
      </div>

      <div className="mt-6 w-full sm:mt-8">
        <Link
          href={banner.href}
          className={`group relative block min-h-[22rem] w-full overflow-hidden sm:min-h-[26rem] lg:min-h-[32rem] ${FOCUS_LIGHT}`}
        >
          {BANNERS.map((item, i) => (
            <img
              key={item.title}
              src={item.photo.src}
              alt={i === c.index ? item.photo.alt : ""}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 motion-reduce:transition-none ${
                i === c.index ? "rkps-ken opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10 lg:bg-gradient-to-r lg:from-black/70 lg:via-black/30 lg:to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 to-transparent sm:h-36"
            aria-hidden
          />
          <div
            key={banner.title}
            className="relative mx-auto flex min-h-[22rem] max-w-7xl flex-col justify-end rkps-page-x pb-8 pt-12 text-white sm:min-h-[26rem] sm:pb-10 lg:min-h-[32rem] lg:pb-14 lg:pt-16"
          >
            <div className="max-w-2xl">
              <span className="rkps-rule" aria-hidden="true" />
              <p className="mt-3 truncate text-xs text-white/75">{banner.kicker}</p>
              <h3 className="rkps-display mt-2 text-[1.75rem] leading-snug text-white [text-wrap:balance] sm:text-4xl">
                {banner.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/80 sm:text-base">{banner.body}</p>
              <span className="mt-4 inline-flex text-sm text-[var(--brand-gold)]">
                Explore this highlight
              </span>
            </div>
          </div>
        </Link>

        <div className="mx-auto mt-4 flex max-w-7xl items-center justify-between gap-3 rkps-page-x">
          <div className="flex items-center gap-3">
            {!c.reduced ? <PauseButton tone="light" paused={c.userPaused} onToggle={c.togglePaused} /> : null}
            <p className="text-xs font-bold uppercase tracking-wider text-muted tabular-nums">
              {pad(c.index + 1)} / {pad(BANNERS.length)}
            </p>
          </div>
          <div className="flex gap-2">
            <ArrowButton direction="prev" onClick={c.prev} label="Previous highlight" />
            <ArrowButton direction="next" onClick={c.next} label="Next highlight" />
          </div>
        </div>
      </div>
    </section>
  );
}
