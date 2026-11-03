"use client";

import { useEffect, useState } from "react";

export type AnimatedTestimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

export function AnimatedTestimonials({
  testimonials,
  autoplay = true,
}: {
  testimonials: readonly AnimatedTestimonial[];
  autoplay?: boolean;
}) {
  const [active, setActive] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const count = testimonials.length;

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (!autoplay || reduceMotion || count < 2) return;
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % count);
    }, 5000);
    return () => window.clearInterval(id);
  }, [autoplay, reduceMotion, count]);

  const previous = () => setActive((current) => (current - 1 + count) % count);
  const next = () => setActive((current) => (current + 1) % count);
  const current = testimonials[active];

  return (
    <div className="mx-auto grid max-w-5xl items-center gap-8 px-3 py-10 sm:px-4 sm:py-12 md:grid-cols-2 md:gap-10 md:py-16 lg:px-5">
      <div className="relative mx-auto h-64 w-full max-w-md sm:h-80">
        {testimonials.map((item, index) => {
          const isActive = index === active;
          const tilt = index % 2 === 0 ? -7 : 6;
          return (
            <img
              key={item.src}
              src={item.src}
              alt=""
              draggable={false}
              className="absolute inset-0 h-full w-full rounded-3xl object-cover shadow-[var(--shadow-card)] transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                zIndex: isActive ? 30 : 10 + index,
                opacity: isActive ? 1 : 0.55,
                transform: isActive ? "scale(1) rotate(0deg)" : `scale(0.94) rotate(${tilt}deg)`,
              }}
            />
          );
        })}
      </div>

      <div className="flex min-h-72 flex-col justify-between">
        <div key={current.name}>
          <h3 className="text-2xl font-bold tracking-tight text-heading">{current.name}</h3>
          <p className="mt-1 text-sm font-semibold text-brand">{current.designation}</p>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            {current.quote.split(" ").map((word, index) => (
              <span
                key={`${current.name}-${index}`}
                className={reduceMotion ? "inline" : "rkps-word inline-block"}
                style={reduceMotion ? undefined : { animationDelay: `${index * 0.02}s` }}
              >
                {word}&nbsp;
              </span>
            ))}
          </p>
        </div>
        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={previous}
            aria-label="Previous testimonial"
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-white text-heading transition hover:border-brand hover:text-brand"
          >
            ←
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next testimonial"
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-white text-heading transition hover:border-brand hover:text-brand"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
