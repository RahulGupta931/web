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
              maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
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
            className="w-[22rem] max-w-[80vw] shrink-0 rounded-[1.25rem] border border-border/80 bg-white px-6 py-6 shadow-[var(--shadow-card)] sm:w-[28rem]"
          >
            <blockquote>
              <p className="text-base leading-relaxed text-heading">“{item.quote}”</p>
              <footer className="mt-6">
                <cite className="not-italic">
                  <span className="block text-sm font-bold text-heading">{item.name}</span>
                  <span className="mt-1 block text-sm font-semibold text-brand">{item.title}</span>
                </cite>
              </footer>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
}
