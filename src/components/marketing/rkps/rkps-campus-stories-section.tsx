"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { instagramPhoto } from "@/content/website/instagram-media";
import { RkpsPageSection } from "@/components/marketing/rkps/rkps-marketing-blocks";
import { RkpsInView } from "@/components/marketing/rkps/rkps-motion-sections";

const STORY_FRAMES = [
  [instagramPhoto("campus-22.jpg"), instagramPhoto("campus-15.jpg"), instagramPhoto("campus-23.jpg")],
  [instagramPhoto("campus-26.jpg"), instagramPhoto("campus-32.jpg"), instagramPhoto("campus-33.jpg")],
  [instagramPhoto("campus-17.jpg"), instagramPhoto("campus-24.jpg"), instagramPhoto("campus-31.jpg")],
  [instagramPhoto("campus-9.jpg"), instagramPhoto("campus-10.jpg"), instagramPhoto("campus-11.jpg")],
  [instagramPhoto("campus-13.jpg"), instagramPhoto("campus-14.jpg"), instagramPhoto("campus-25.jpg")],
  [instagramPhoto("campus-35.jpg"), instagramPhoto("campus-36.jpg"), instagramPhoto("campus-37.jpg")],
] as const;

const STORIES = [
  {
    short: "Sports week",
    title: "Annual Sports Week & Athletics",
    body: "Inter-house track and field for grades 1–12 on our campus athletic grounds. Houses meet on the ground for sprints, relays, kabaddi, and field events, fostering healthy competition, leadership, and camaraderie.\n\nCricket, badminton, and gymnastics run through the academic year with dedicated sports periods on every student’s timetable.",
  },
  {
    short: "Parent meetings",
    title: "Parent–Teacher Conferences",
    body: "Collaborative conferences booked smoothly through the portal. Report cards, attendance metrics, and personalized teacher notes are accessible before parents sit down for meaningful dialogues.\n\nEvery meeting celebrates individual growth milestones, addresses learning gaps, and outlines supportive action plans.",
  },
  {
    short: "Science fair",
    title: "Science & Robotics Innovation Fair",
    body: "Student-built robotics projects, environmental sustainability models, and working laboratory experiments on exhibition. Learners explain their hypotheses and engineering decisions in their own confident words.\n\nFrom coding clubs to advanced physics and chemistry labs, hands-on experiential learning is woven into the curriculum.",
  },
  {
    short: "Well-being",
    title: "Sports & Physical Well-being",
    body: "Cricket, athletics, basketball, and yoga encourage active lifestyles. Indoor gaming halls and outdoor grounds share the campus, ensuring students develop physical resilience and sportsmanship.",
  },
  {
    short: "Arts & stage",
    title: "Cultural & Performing Arts",
    body: "Annual day galas, inter-house dance, music, theater, and debate competitions give every student a stage. Rehearsals cultivate creative self-expression and poise.",
  },
  {
    short: "Clubs & service",
    title: "Clubs & Community Outreach",
    body: "Eco Club, Robotics League, Literary Society, and social service initiatives empower students to lead impactful community drives and develop responsible citizenship.",
  },
] as const;

function StoryPhotoGrid({ photos }: { photos: readonly { src: string; alt: string }[] }) {
  const [lead, ...rest] = photos;
  if (!lead) return null;
  return (
    <div className="grid h-full min-h-[16rem] grid-rows-[minmax(0,1.55fr)_minmax(0,1fr)] gap-2 overflow-hidden sm:min-h-[18rem] lg:min-h-0 lg:h-full">
      <figure className="relative min-h-[10rem] overflow-hidden rounded-2xl border border-border/60 sm:min-h-[12rem] lg:min-h-0">
        <img
          src={lead.src}
          alt={lead.alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" aria-hidden />
      </figure>
      <div className="grid min-h-0 grid-cols-2 gap-2">
        {rest.map((photo) => (
          <figure key={photo.src} className="relative min-h-[5.5rem] overflow-hidden rounded-xl border border-border/60 sm:min-h-[6rem] lg:min-h-0">
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </figure>
        ))}
      </div>
    </div>
  );
}

function ProgrammePicker({
  activeIndex,
  onSelect,
  layout,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
  layout: "column" | "row";
}) {
  return (
    <div
      role="tablist"
      aria-label="Campus programmes"
      className={
        layout === "row"
          ? "flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          : "flex flex-col gap-1.5"
      }
    >
      {STORIES.map((story, index) => {
        const selected = index === activeIndex;
        return (
          <button
            key={story.title}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls="rkps-campus-story-panel"
            id={`rkps-campus-story-tab-${index}`}
            onClick={() => onSelect(index)}
            className={`shrink-0 rounded-xl border px-3.5 py-2.5 text-left text-sm transition sm:px-4 sm:py-3 ${
              layout === "row" ? "min-w-[9.5rem]" : "w-full"
            } ${
              selected
                ? "border-brand/35 bg-brand/5 font-medium text-heading shadow-sm"
                : "border-border/80 bg-white text-muted hover:border-brand/20 hover:bg-[var(--surface-muted)]"
            }`}
          >
            <span className="block text-[0.6875rem] tabular-nums rkps-text-label-soft">{String(index + 1).padStart(2, "0")}</span>
            <span className="mt-0.5 block leading-snug">{story.short}</span>
          </button>
        );
      })}
    </div>
  );
}

export function RkpsCampusStoriesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const story = STORIES[activeIndex] ?? STORIES[0];
  const photos = STORY_FRAMES[activeIndex] ?? STORY_FRAMES[0];

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i <= 0 ? STORIES.length - 1 : i - 1));
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i >= STORIES.length - 1 ? 0 : i + 1));
  }, []);

  return (
    <RkpsPageSection id="campus-programmes" tone="inset">
      <RkpsInView>
        <div className="overflow-hidden rounded-[1.75rem] border border-border/80 bg-white shadow-[0_24px_60px_rgba(96,0,0,0.07)] sm:rounded-[2rem]">
          <div className="grid lg:grid-cols-12 lg:items-stretch">
            <aside className="order-2 flex flex-col border-t border-border/70 bg-[var(--surface-elevated)] p-6 sm:p-8 lg:order-1 lg:col-span-4 lg:border-t-0 lg:border-r lg:p-10">
              <span className="rkps-rule" aria-hidden="true" />
              <p className="mt-4 rkps-text-label text-xs">Campus life</p>
              <h2
                id="rkps-stories-title"
                className="rkps-display mt-2 text-[1.75rem] leading-tight text-heading [text-wrap:balance] sm:text-3xl"
              >
                Your child’s day, told in programmes and people
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                From morning assembly to afternoon clubs — a rhythm of sport, stage, labs, and community that stays
                consistent through the year.
              </p>

              <div className="mt-8 hidden lg:block">
                <p className="rkps-text-label-soft text-xs">Programmes on campus</p>
                <div className="mt-3">
                  <ProgrammePicker activeIndex={activeIndex} onSelect={setActiveIndex} layout="column" />
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-2 sm:flex-row lg:mt-auto lg:flex-col lg:pt-8">
                <Link href="/school-life/events" className="rkps-btn-navy rkps-btn-sm w-full justify-center text-center sm:text-sm">
                  School events calendar
                </Link>
                <Link
                  href="/#gallery"
                  className="rkps-btn-secondary rkps-btn-sm w-full justify-center text-center sm:text-sm"
                >
                  Browse photo gallery
                </Link>
              </div>
            </aside>

            <div className="order-1 flex min-h-0 flex-col rkps-bg-inset-panel p-5 sm:p-7 lg:order-2 lg:col-span-8 lg:p-8">
              <div className="mb-4 flex items-end justify-between gap-3 border-b border-border/50 pb-4 lg:hidden">
                <p className="rkps-text-label-soft text-xs">Choose a programme</p>
              </div>
              <div className="mb-5 lg:hidden">
                <ProgrammePicker activeIndex={activeIndex} onSelect={setActiveIndex} layout="row" />
              </div>

              <div
                id="rkps-campus-story-panel"
                role="tabpanel"
                aria-labelledby={`rkps-campus-story-tab-${activeIndex}`}
                className="flex min-h-0 flex-1 flex-col gap-5 lg:gap-6"
              >
                <div className="lg:min-h-[22rem] lg:flex-1">
                  <StoryPhotoGrid photos={photos} />
                </div>

                <article className="rounded-2xl border border-border/80 bg-white p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="rkps-text-label-soft text-xs">
                        Programme {String(activeIndex + 1).padStart(2, "0")} of {String(STORIES.length).padStart(2, "0")}
                      </p>
                      <h3 className="rkps-display mt-1 text-xl text-heading sm:text-2xl">{story.title}</h3>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={goPrev}
                        className="rkps-btn-icon"
                        aria-label="Previous programme"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={goNext}
                        className="rkps-btn-icon"
                        aria-label="Next programme"
                      >
                        →
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3 border-t border-border/60 pt-4">
                    {story.body.split("\n\n").map((paragraph) => (
                      <p key={paragraph.slice(0, 48)} className="text-sm leading-relaxed text-muted sm:text-[0.9375rem]">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </RkpsInView>
    </RkpsPageSection>
  );
}

/** @deprecated Use RkpsCampusStoriesSection */
export const RkpsStoryRail = RkpsCampusStoriesSection;
