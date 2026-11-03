"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { RKPS_HERO } from "@/content/website/rkps-copy";
import { LATEST_NEWS } from "@/content/website/public-site";
import { INSTAGRAM_PHOTOS, instagramPhoto } from "@/content/website/instagram-media";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";

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
    kicker: "School life",
    title: "A place to belong.",
    accent: "Celebrations that stay with you.",
    body: "Festivals, sport and everyday kindness sit beside the classroom.",
  },
  {
    photo: instagramPhoto("campus-4.jpg"),
    kicker: "Admissions",
    title: "Your next chapter",
    accent: "starts with a hello.",
    body: "Visit the campus and talk to the office about the class you are exploring.",
  },
] as const;

const SPOTLIGHTS = [
  {
    figure: "25+",
    title: "Years of excellence",
    body: "A school that has grown with its families, from the first classrooms to a full campus.",
  },
  {
    figure: "1,200+",
    title: "Students on campus",
    body: "Learners from the early years through senior secondary, each with a place to be known.",
  },
  {
    figure: "80+",
    title: "Faculty",
    body: "Teachers who make room for questions, practice and the confidence to try again.",
  },
  {
    figure: "98%",
    title: "Board pass rate",
    body: "Consistent board performance, with the office confirming the latest published results.",
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

function useAutoAdvance(length: number, ms: number) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((current) => (current + 1) % length), ms);
    return () => window.clearInterval(id);
  }, [length, ms]);
  return [index, setIndex] as const;
}

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
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${shown ? "rkps-reveal" : "motion-safe:opacity-0"} ${className}`}>
      {children}
    </div>
  );
}

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
  const [index, setIndex] = useAutoAdvance(slides.length, 6000);
  const slide = slides[index] ?? slides[0];
  if (!slide) return null;

  return (
    <section className="relative isolate min-h-[28rem] overflow-hidden bg-[var(--brand-maroon-dark)] text-white sm:min-h-[32rem]" aria-roledescription="carousel" aria-label={slide.title}>
      {slides.map((item, i) => (
        <div key={item.photo.src} className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden={i !== index}>
          <img src={item.photo.src} alt={i === index ? item.photo.alt : ""} className={`h-full w-full object-cover ${i === index ? "rkps-ken" : ""}`} />
          <div className="absolute inset-0 bg-[var(--brand-maroon-dark)]/72" />
        </div>
      ))}
      <div className="relative z-10 mx-auto flex min-h-[28rem] max-w-7xl flex-col justify-end px-3 pb-10 pt-12 sm:min-h-[32rem] sm:px-4 sm:pb-16 sm:pt-14">
        <div key={slide.photo.src} className="max-w-3xl">
          <p className="rkps-reveal text-xs font-bold uppercase tracking-[0.16em] text-[var(--brand-gold)] sm:text-sm">{slide.kicker}</p>
          <h1 className="rkps-reveal mt-2 text-3xl font-bold leading-[1.05] tracking-tight sm:mt-3 sm:text-5xl md:text-6xl">
            {slide.title}
            <span className="mt-1 block text-[var(--brand-gold)]">{slide.accent}</span>
          </h1>
          <p className="rkps-reveal mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">{slide.body}</p>
          <div className="rkps-reveal mt-6 flex flex-col gap-2.5 sm:mt-7 sm:flex-row sm:flex-wrap sm:gap-3">
            <a href={primary.href} className="rkps-ease rkps-press inline-flex justify-center rounded-full bg-[var(--brand-gold)] px-5 py-2.5 text-sm font-bold text-[var(--brand-maroon-dark)] hover:brightness-105 sm:px-6 sm:py-3">
              {primary.label}
            </a>
            {secondary ? (
              <a href={secondary.href} target={secondary.external ? "_blank" : undefined} rel={secondary.external ? "noreferrer" : undefined} className="rkps-ease rkps-press inline-flex justify-center rounded-full border border-white/40 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10 sm:px-6 sm:py-3">
                {secondary.label}
              </a>
            ) : null}
          </div>
        </div>
        {slides.length > 1 ? (
          <div className="mt-8 flex items-center gap-3">
            {slides.map((item, i) => (
              <button
                key={item.photo.src}
                type="button"
                aria-label={`Show slide ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => setIndex(i)}
                className={`h-2.5 rounded-full transition-all ${i === index ? "w-8 bg-[var(--brand-gold)]" : "w-2.5 bg-white/50 hover:bg-white"}`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function RkpsNewsMarquee() {
  const items = [
    { href: "/#admissions", label: "Admissions enquiries are open. Talk to the school office." },
    ...LATEST_NEWS.map((item) => ({ href: "/#noticeboard", label: item.title })),
    { href: "/school-life/events", label: "See festivals, sports and school programmes." },
  ];
  const loop = [...items, ...items];

  return (
    <div className="rkps-marquee overflow-hidden bg-[var(--brand-maroon-dark)] text-white">
      <div className="rkps-marquee-track">
        {loop.map((item, i) => (
          <Link
            key={`${item.label}-${i}`}
            href={item.href}
            className="inline-flex items-center gap-4 px-6 py-2.5 text-sm font-semibold tracking-wide hover:text-[var(--brand-gold)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-gold)]" aria-hidden />
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function RkpsCinematicHero() {
  const [index, setIndex] = useAutoAdvance(SLIDES.length, 6500);
  const slide = SLIDES[index];

  return (
    <section className="relative isolate min-h-[28rem] overflow-hidden bg-[var(--brand-maroon-dark)] text-white sm:min-h-[34rem] lg:min-h-[42rem]" aria-roledescription="carousel" aria-label="School highlights">
      {SLIDES.map((item, i) => (
        <div key={item.title} className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden={i !== index}>
          <img src={item.photo.src} alt={i === index ? item.photo.alt : ""} className={`h-full w-full object-cover ${i === index ? "rkps-ken" : ""}`} />
          <div className="absolute inset-0 bg-[var(--brand-maroon-dark)]/70" />
        </div>
      ))}

      <div className="relative z-10 mx-auto flex min-h-[28rem] max-w-7xl flex-col justify-end px-3 pb-12 pt-14 sm:min-h-[34rem] sm:px-4 sm:pb-16 sm:pt-16 lg:min-h-[42rem] lg:justify-center lg:pb-16">
        <div key={slide.title} className="max-w-3xl">
          <p className="rkps-reveal text-xs font-bold uppercase tracking-[0.16em] text-[var(--brand-gold)] sm:text-sm">{slide.kicker}</p>
          <h1 className="rkps-reveal mt-2 text-3xl font-bold leading-[1.05] tracking-tight sm:mt-3 sm:text-5xl lg:text-7xl">
            {slide.title}
            <span className="mt-1 block text-[var(--brand-gold)]">{slide.accent}</span>
          </h1>
          <p className="rkps-reveal mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:mt-5 sm:text-base lg:text-lg">{slide.body}</p>
          <div className="rkps-reveal mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-3">
            <Link href={RKPS_HERO.primary.href} className="rkps-ease rkps-press inline-flex justify-center rounded-full bg-[var(--brand-gold)] px-5 py-2.5 text-sm font-bold text-[var(--brand-maroon-dark)] hover:brightness-105 sm:px-6 sm:py-3">
              {RKPS_HERO.primary.label}
            </Link>
            <Link href={RKPS_HERO.secondary.href} className="rkps-ease rkps-press inline-flex justify-center rounded-full border border-white/40 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10 sm:px-6 sm:py-3">
              {RKPS_HERO.secondary.label}
            </Link>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3 sm:mt-10">
          {SLIDES.map((item, i) => (
            <button
              key={item.title}
              type="button"
              aria-label={`Show slide ${i + 1}: ${item.title}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => setIndex(i)}
              className={`h-2.5 rounded-full transition-all ${i === index ? "w-8 bg-[var(--brand-gold)]" : "w-2.5 bg-white/50 hover:bg-white"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

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
      { threshold: 0.4 },
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
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

export function RkpsSpotlightCarousel() {
  const [index, setIndex] = useState(0);
  const item = SPOTLIGHTS[index];
  const previous = () => setIndex((current) => (current - 1 + SPOTLIGHTS.length) % SPOTLIGHTS.length);
  const next = () => setIndex((current) => (current + 1) % SPOTLIGHTS.length);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((current) => (current + 1) % SPOTLIGHTS.length), 4500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="bg-white" aria-roledescription="carousel" aria-label="School in numbers">
      <div className="mx-auto max-w-7xl px-3 py-8 sm:px-4 sm:py-12 md:py-14 lg:grid lg:grid-cols-12 lg:items-center lg:gap-8 lg:py-16">
        <Link
          href="#excellence"
          className="mx-auto grid h-24 w-24 shrink-0 place-items-center rounded-full bg-[var(--brand-gold)] px-3 text-center text-[0.625rem] font-bold leading-snug text-[var(--brand-maroon-dark)] shadow-lg transition hover:scale-105 sm:h-28 sm:w-28 sm:text-xs lg:col-span-3 lg:mx-0 lg:h-36 lg:w-36 lg:px-4 lg:text-sm"
        >
          Explore achievements
        </Link>

        <div key={`${item.title}-${item.figure}`} className="mt-5 text-center lg:col-span-5 lg:mt-0 lg:text-left">
          <p className="rkps-reveal text-4xl font-black leading-none tracking-tighter text-brand tabular-nums sm:text-5xl lg:hidden">
            {item.figure}
          </p>
          <h2 className="rkps-reveal mt-3 text-xl font-bold tracking-tight text-heading sm:mt-4 sm:text-2xl md:text-3xl lg:mt-0">
            {item.title}
          </h2>
          <p className="rkps-reveal mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base lg:mx-0">{item.body}</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:mt-6 lg:justify-start">
            <button
              type="button"
              onClick={previous}
              aria-label="Previous highlight"
              className="grid h-10 w-10 place-items-center rounded-full border border-border text-base text-heading transition hover:border-brand hover:text-brand sm:h-11 sm:w-11 sm:text-lg"
            >
              ←
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next highlight"
              className="grid h-10 w-10 place-items-center rounded-full border border-border text-base text-heading transition hover:border-brand hover:text-brand sm:h-11 sm:w-11 sm:text-lg"
            >
              →
            </button>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              {index + 1} / {SPOTLIGHTS.length}
            </p>
          </div>
        </div>

        <p
          key={item.figure}
          className="rkps-reveal hidden text-7xl font-black leading-none tracking-tighter text-heading md:text-8xl lg:col-span-4 lg:block lg:text-9xl"
        >
          {item.figure}
        </p>
      </div>
    </section>
  );
}

export function RkpsHighlightsReel() {
  const loop = [...HIGHLIGHTS, ...HIGHLIGHTS];
  return (
    <section className="w-full overflow-hidden bg-[#fdf6e8] py-12 sm:py-16" aria-label="Campus highlights">
      <div className="w-full px-3 sm:px-4 lg:px-5">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Highlights</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-heading sm:text-4xl lg:text-5xl">United in spirit. Alive on campus.</h2>
        <span aria-hidden className="mt-4 block h-1.5 w-16 rounded-full bg-[var(--brand-gold)]" />
      </div>
      <div className="rkps-marquee mt-8 w-full">
        <div className="rkps-marquee-track gap-4 px-4">
          {loop.map((photo, i) => (
            <figure key={`${photo.src}-${i}`} className="relative h-52 w-80 shrink-0 overflow-hidden rounded-2xl sm:h-64 sm:w-[28rem]">
              <img src={photo.src} alt={photo.alt} className="h-full w-full object-cover" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-black/75 p-4 text-sm font-semibold text-white">
                {photo.alt}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

const BANNERS = [
  {
    photo: instagramPhoto("campus-28.jpg"),
    kicker: "School life",
    title: "See learners in action",
    body: "Festivals, sports and classrooms from the official school feed.",
    href: "/school-life/events",
  },
  {
    photo: instagramPhoto("campus-19.jpg"),
    kicker: "Academics",
    title: "A world to learn. A future to shape.",
    body: "From early years to senior secondary, with room for questions and practice.",
    href: "/#academics",
  },
  {
    photo: instagramPhoto("campus-7.jpg"),
    kicker: "Admissions",
    title: "Your next chapter starts here",
    body: "Visit the campus and talk to the office about the class you are exploring.",
    href: "/#admissions",
  },
] as const;

/** Wide sliding banner, the same pattern as LPU’s Highlights block. */
export function RkpsHighlightBanner() {
  const [index, setIndex] = useAutoAdvance(BANNERS.length, 5500);
  const banner = BANNERS[index];
  const previous = () => setIndex((current) => (current - 1 + BANNERS.length) % BANNERS.length);
  const next = () => setIndex((current) => (current + 1) % BANNERS.length);

  return (
    <section className="w-full bg-[#fdf6e8] py-10 sm:py-16" aria-roledescription="carousel" aria-label="Highlights">
      <div className="flex w-full flex-col gap-4 px-3 sm:gap-6 sm:px-4 lg:flex-row lg:items-end lg:justify-between lg:px-5">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Highlights</p>
          <h2 className="mt-2 text-2xl font-bold leading-snug tracking-tight text-heading sm:text-3xl md:text-4xl lg:text-5xl">
            United in spirit. Alive on campus.
          </h2>
          <span aria-hidden className="mt-3 block h-1.5 w-12 rounded-full bg-[var(--brand-gold)] sm:mt-4 sm:w-16" />
        </div>
        <div className="hidden shrink-0 gap-3 lg:flex">
          <button type="button" onClick={previous} aria-label="Previous highlight" className="grid h-12 w-12 place-items-center rounded-full border border-border bg-white text-xl text-heading hover:border-brand">
            ←
          </button>
          <button type="button" onClick={next} aria-label="Next highlight" className="grid h-12 w-12 place-items-center rounded-full border border-border bg-white text-xl text-heading hover:border-brand">
            →
          </button>
        </div>
      </div>
      <div className="relative mt-6 w-full px-3 sm:mt-8 sm:px-4 lg:px-5">
        <Link
          href={banner.href}
          className="relative block min-h-[18rem] w-full overflow-hidden rounded-2xl sm:min-h-[24rem] lg:min-h-[min(42vh,28rem)] lg:rounded-none xl:min-h-[32rem]"
        >
          {BANNERS.map((item, i) => (
            <img
              key={item.title}
              src={item.photo.src}
              alt={i === index ? item.photo.alt : ""}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"} ${i === index ? "rkps-ken" : ""}`}
            />
          ))}
          <div className="absolute inset-0 bg-[var(--brand-maroon-dark)]/82 sm:bg-[var(--brand-maroon-dark)]/70" />
          <div key={banner.title} className="relative flex min-h-[18rem] max-w-xl flex-col justify-end px-4 py-7 text-white sm:min-h-[24rem] sm:px-6 sm:py-10 lg:min-h-[min(42vh,28rem)] lg:px-10 xl:min-h-[32rem] xl:px-14">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--brand-gold)]">{banner.kicker}</p>
            <h3 className="mt-2 text-2xl font-bold leading-snug tracking-tight sm:text-3xl md:text-4xl">{banner.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/90 sm:text-base">{banner.body}</p>
          </div>
        </Link>
        <div className="mt-4 flex items-center justify-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={previous}
            aria-label="Previous highlight"
            className="grid h-11 w-11 place-items-center rounded-full border border-border bg-white text-lg text-heading hover:border-brand"
          >
            ←
          </button>
          <p className="min-w-[3rem] text-center text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            {index + 1} / {BANNERS.length}
          </p>
          <button
            type="button"
            onClick={next}
            aria-label="Next highlight"
            className="grid h-11 w-11 place-items-center rounded-full border border-border bg-white text-lg text-heading hover:border-brand"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}

const STORY_FRAMES = [
  [instagramPhoto("campus-22.jpg"), instagramPhoto("campus-15.jpg"), instagramPhoto("campus-23.jpg")],
  [instagramPhoto("campus-26.jpg"), instagramPhoto("campus-32.jpg"), instagramPhoto("campus-33.jpg")],
  [instagramPhoto("campus-17.jpg"), instagramPhoto("campus-24.jpg"), instagramPhoto("campus-31.jpg")],
  [instagramPhoto("campus-9.jpg"), instagramPhoto("campus-10.jpg"), instagramPhoto("campus-11.jpg")],
  [instagramPhoto("campus-13.jpg"), instagramPhoto("campus-14.jpg"), instagramPhoto("campus-25.jpg")],
  [instagramPhoto("campus-35.jpg"), instagramPhoto("campus-36.jpg"), instagramPhoto("campus-37.jpg")],
] as const;

function StoryFrame({ photos }: { photos: readonly { src: string; alt: string }[] }) {
  const [lead, ...rest] = photos;
  return (
    <>
      <div className="relative h-full w-full lg:hidden">
        <img src={lead.src} alt={lead.alt} className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className="hidden h-full min-h-0 grid-rows-[minmax(0,1.65fr)_minmax(0,1fr)] gap-2 overflow-hidden lg:grid">
        <div className="relative min-h-0 overflow-hidden">
          <img src={lead.src} alt={lead.alt} className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="grid min-h-0 grid-cols-2 gap-2">
          {rest.map((photo) => (
            <div key={photo.src} className="relative min-h-0 overflow-hidden">
              <img src={photo.src} alt={photo.alt} className="absolute inset-0 h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/** Sticky story scroll: the photo stays put while each programme comes into view. */
const STORY_COPY = [
  {
    title: "Annual sports week begins",
    body: "Inter-house track and field for classes 6–12 is on the school calendar. Houses meet on the ground for sprints, relays and field events, and families can read the full schedule before the first whistle.\n\nCricket, athletics and kabaddi run through the year beside that week. Annual sports day brings every class onto the field, with practice kept on the timetable rather than squeezed in after it.",
  },
  {
    title: "Parent–teacher meeting (Term 2)",
    body: "Meeting slots are booked through the school office. Once report cards are published, they sit in the student portal so a family can read attendance, marks and remarks before they sit down with the teacher.\n\nThe meeting is for the term just lived and the one ahead: classwork, a missed day, and what to watch next. When a question needs more than the slot, the class teacher and the office follow it up.",
  },
  {
    title: "Science exhibition winners",
    body: "Senior projects on sustainability and robotics are in the achievements gallery. Students walk visitors from the first sketch to the model on the table, in their own words.\n\nThose projects start in the science and computer labs and in the robotics club. Exhibition day is when the rest of the school gets to move through the work, one table at a time.",
  },
  {
    title: "Sports & fitness",
    body: "Cricket, athletics, kabaddi and annual sports day give every house a season on the ground. The sports ground and the indoor games share the campus with the classrooms, so a games period does not mean leaving school.\n\nTeams practise in house groups. Sports day is the shared finish: classes line the field, and the calendar lists every event.",
  },
  {
    title: "Cultural programs",
    body: "Annual day, inter-house competitions, music and dance fill the second half of the year. A class that spends the morning in lessons can spend the afternoon on a stage.\n\nRehearsals are part of the week, not a single show. Families are invited when the programme is ready, and the date goes on the noticeboard.",
  },
  {
    title: "Clubs & service",
    body: "Eco club, robotics, debate and community outreach meet through the week. In the middle school, clubs sit with the house system. Seniors carry the same habits into exhibition projects and outreach.\n\nA club is a smaller room inside a large school. Students stay with a debate, a garden or a robot long enough for the work to show.",
  },
] as const;

export function RkpsStoryRail() {
  const stories = STORY_COPY;

  return (
    <section className="bg-white py-12 sm:py-16" aria-label="School stories">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-5">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Campus stories</p>
        <h2 className="mt-2 max-w-3xl text-2xl font-bold leading-snug tracking-tight text-heading sm:text-3xl md:text-4xl">
          Your child’s day, told in programmes and people
        </h2>
        <div className="mt-8">
          <StickyScroll
            content={stories.map((story, index) => ({
              title: story.title,
              description: story.body,
              content: <StoryFrame photos={STORY_FRAMES[index]} />,
            }))}
          />
        </div>
      </div>
    </section>
  );
}
