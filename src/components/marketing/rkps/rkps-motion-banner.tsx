"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RkpsSectionIntro } from "@/components/marketing/rkps/rkps-marketing-blocks";

const MOTION_SLIDES = [
  {
    id: "admissions",
    tag: "Admissions 2026–27 Open",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
    dotColor: "bg-emerald-400",
    title: "Step Into Tomorrow With Confidence & Character",
    accent: "Pre-Primary to Grade 12 Enrollment",
    description:
      "Join a legacy of academic rigor, holistic personality development, and individualized mentorship. Experience our world-class laboratories and activity centres.",
    image: "/marketing/rkps-promotional-banner.jpg",
    primaryCta: { label: "Start Admission Enquiry", href: "/#admissions" },
    secondaryCta: { label: "Book a Campus Tour", href: "/#contact" },
  },
  {
    id: "campus",
    tag: "25+ Years of Educational Trust",
    badgeColor: "bg-[var(--brand-gold)]/20 text-[var(--brand-gold)] border-[var(--brand-gold)]/40",
    dotColor: "bg-[var(--brand-gold)]",
    title: "Where Curiosity Meets Purposeful Learning",
    accent: "State-of-the-Art Campus Facilities",
    description:
      "Sprawling sports grounds, high-tech robotics and STEM labs, multimedia classrooms, and dedicated fine arts studios built for all-around growth.",
    image: "/marketing/rkps-school-banner.jpg",
    primaryCta: { label: "Explore Campus Facilities", href: "/#facilities" },
    secondaryCta: { label: "View Learning Journey", href: "/#academics" },
  },
  {
    id: "achievers",
    tag: "Student Achievers & Honor Roll",
    badgeColor: "bg-sky-500/20 text-sky-300 border-sky-400/40",
    dotColor: "bg-sky-400",
    title: "Nurturing Independence, Empathy & Leadership",
    accent: "Growth Celebrated Across Every Grade",
    description:
      "Celebrating academic Olympiad winners, state athletic champions, and everyday milestones without superficial comparisons or pressure.",
    image: "/marketing/instagram/campus-28.jpg",
    primaryCta: { label: "Meet Student Achievers", href: "/school-life/student-achievers" },
    secondaryCta: { label: "Browse Events Calendar", href: "/school-life/events" },
  },
] as const;

const TICKER_TOP = [
  { text: "Admissions Open for Session 2026–27" },
  { text: "98% CBSE Board Distinction & Honors" },
  { text: "Advanced STEM, Physics & Robotics Labs" },
  { text: "Multi-Sport Athletics & Cricket Grounds" },
  { text: "Creative Arts, Music & Theater Studios" },
  { text: "25+ Years of Educational Excellence" },
];

const TICKER_BOTTOM = [
  { text: "Pre-Primary Foundation to Grade 12" },
  { text: "1:15 Dedicated Teacher-to-Student Mentorship" },
  { text: "Safe GPS-Tracked Transportation Network" },
  { text: "Inquiry-Driven Experiential Curriculum" },
  { text: "Inter-House Academic & Sports Tournaments" },
  { text: "Visit Our Campus for Open Days" },
];

export function RkpsMotionBanner() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % MOTION_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [paused]);

  const slide = MOTION_SLIDES[active];

  return (
    <section
      id="motion-showcase"
      className="relative scroll-mt-28 overflow-hidden bg-[var(--brand-maroon-dark)] py-14 text-white sm:py-20 lg:py-24"
      aria-label="Campus Motion Showcase"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative mx-auto max-w-7xl rkps-page-x">
        <RkpsSectionIntro
          dark
          num="This year"
          title="Campus, admissions, and the year ahead"
          description="Photographs from the school, with the sessions and programmes families ask about."
        />
      </div>

      {/* Full-bleed carousel — no card frame */}
      <div className="relative mt-10 w-full">
        <div className="relative min-h-[24rem] w-full overflow-hidden sm:min-h-[28rem] lg:min-h-[32rem]">
          {MOTION_SLIDES.map((item, idx) => (
            <div
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                idx === active ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
              }`}
              aria-hidden={idx !== active}
            >
              <img
                src={item.image}
                alt={item.title}
                className={`h-full w-full object-cover ${idx === active ? "rkps-ken" : ""}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-maroon-dark)] via-[var(--brand-maroon-dark)]/80 to-transparent sm:bg-gradient-to-r sm:from-[var(--brand-maroon-dark)] sm:via-[var(--brand-maroon-dark)]/85 sm:to-transparent" />
            </div>
          ))}

          <div className="relative z-20 mx-auto flex min-h-[24rem] max-w-7xl flex-col justify-end rkps-page-x pb-6 pt-8 sm:min-h-[28rem] sm:pb-10 sm:pt-10 lg:min-h-[32rem] lg:pb-14 lg:pt-14">
            <div className="max-w-2xl space-y-3.5">
              <div className="space-y-3">
                <span className="rkps-rule" aria-hidden="true" />
                <p className="text-xs text-white/80">{slide.tag}</p>
              </div>

              <h3 className="rkps-display text-[1.75rem] leading-tight text-white sm:text-4xl lg:text-5xl">
                {slide.title}
              </h3>

              <p className="text-sm text-white/75 sm:text-base">{slide.accent}</p>

              <p className="max-w-xl text-xs leading-relaxed text-white/85 sm:text-sm">{slide.description}</p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link href={slide.primaryCta.href} className="rkps-btn-gold text-sm">
                  {slide.primaryCta.label}
                </Link>
                <Link
                  href={slide.secondaryCta.href}
                  className="inline-flex min-h-11 items-center text-sm text-white/90 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white"
                >
                  {slide.secondaryCta.label}
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 right-4 z-20 hidden items-center gap-2 sm:flex sm:right-6 lg:right-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]">
            <button
              type="button"
              onClick={() => setActive((prev) => (prev - 1 + MOTION_SLIDES.length) % MOTION_SLIDES.length)}
              aria-label="Previous slide"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-md transition hover:border-white hover:bg-white/20 active:scale-95"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => setActive((prev) => (prev + 1) % MOTION_SLIDES.length)}
              aria-label="Next slide"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-md transition hover:border-white hover:bg-white/20 active:scale-95"
            >
              →
            </button>
          </div>
        </div>

        <div className="grid w-full grid-cols-1 border-y border-white/15 bg-[var(--brand-maroon-dark)] sm:grid-cols-3">
          {MOTION_SLIDES.map((item, idx) => {
            const isCurrent = idx === active;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(idx)}
                className={`group relative flex flex-col p-4 text-left transition sm:px-6 lg:px-8 ${
                  isCurrent ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                } ${idx > 0 ? "border-t border-white/15 sm:border-l sm:border-t-0" : ""}`}
              >
                <span
                  className={`absolute inset-x-0 top-0 h-1 transition-all duration-300 ${
                    isCurrent ? "bg-[var(--brand-gold)]" : "bg-transparent group-hover:bg-white/20"
                  }`}
                />
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs tabular-nums text-white/50">
                    0{idx + 1}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs font-bold text-white sm:text-sm">{item.tag}</p>
                <p
                  className={`mt-0.5 text-xs leading-snug ${
                    isCurrent ? "line-clamp-3 font-semibold !text-white" : "line-clamp-2 text-white/80"
                  }`}
                >
                  {item.title}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative mx-auto mt-12 grid max-w-7xl gap-x-10 gap-y-2 rkps-page-x sm:grid-cols-2">
        {[...TICKER_TOP, ...TICKER_BOTTOM].map((item) => (
          <p key={item.text} className="border-t border-white/10 py-3 text-sm text-white/75">
            {item.text}
          </p>
        ))}
      </div>
    </section>
  );
}
