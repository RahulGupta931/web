"use client";

import { useEffect, useState, type CSSProperties } from "react";

export type InfiniteMovingCard = {
  quote: string;
  name: string;
  title: string;
};

export function InfiniteMovingCards({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
}: {
  items: readonly InfiniteMovingCard[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
}) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const duration = speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s";
  const animationDirection = direction === "left" ? "forwards" : "reverse";
  const scrolling = !reduceMotion && items.length > 1;
  const loop = scrolling ? [...items, ...items] : items;

  return (
    <div
      className={`relative overflow-hidden ${pauseOnHover && scrolling ? "rkps-moving-cards-wrap" : ""}`}
      style={
        scrolling
          ? {
              maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
            }
          : undefined
      }
    >
      <ul
        className={`flex w-max gap-4 py-4 ${scrolling ? "rkps-moving-cards" : "mx-auto px-4"}`}
        style={
          {
            "--rkps-move-duration": duration,
            "--rkps-move-direction": animationDirection,
          } as CSSProperties
        }
      >
        {loop.map((item, index) => (
          <li
            key={`${item.name}-${index}`}
            aria-hidden={index >= items.length ? true : undefined}
            className="w-[20rem] max-w-[85vw] shrink-0 rounded-3xl border border-border/80 bg-white p-6 shadow-sm transition hover:shadow-md sm:w-[26rem]"
          >
            <blockquote>
              <div className="flex items-center gap-1 text-[var(--brand-gold)] text-sm mb-3">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-[0.625rem] font-bold text-emerald-700">
                  Verified Parent
                </span>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-heading font-medium">“{item.quote}”</p>
              <footer className="mt-5 border-t border-border/60 pt-4 flex items-center justify-between">
                <cite className="not-italic">
                  <span className="block text-sm font-bold text-heading">{item.name}</span>
                  <span className="block text-xs font-semibold text-brand mt-0.5">{item.title}</span>
                </cite>
                <span className="text-xl opacity-30 font-serif">❝</span>
              </footer>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
}
