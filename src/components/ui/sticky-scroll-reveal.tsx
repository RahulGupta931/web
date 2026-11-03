"use client";

import { useRef, useState, type ReactNode } from "react";

export type StickyScrollItem = {
  title: string;
  description: string;
  content?: ReactNode;
};

/** Text scrolls inside the panel while the active photo stays pinned (desktop). Stacked on tablet and phone. */
export function StickyScroll({ content }: { content: readonly StickyScrollItem[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function onScroll() {
    const root = scroller.current;
    if (!root) return;
    const cards = [...root.querySelectorAll<HTMLElement>("[data-sticky-card]")];
    const ratio = window.matchMedia("(min-width: 1024px)").matches ? 0.32 : 0.22;
    const edge = root.getBoundingClientRect().top + root.clientHeight * ratio;
    let next = 0;
    cards.forEach((card, index) => {
      if (card.getBoundingClientRect().top <= edge) next = index;
    });
    setActive((current) => (current === next ? current : next));
  }

  return (
    <div className="relative flex flex-col gap-4 overflow-hidden rounded-[1.75rem] bg-[var(--rkps-paper)] sm:gap-5 lg:block lg:h-[46rem] lg:gap-0">
      <div
        className="relative z-10 aspect-[4/3] shrink-0 overflow-hidden rounded-[1.25rem] bg-[var(--brand-maroon-dark)] shadow-[var(--shadow-card)] sm:aspect-[16/10] sm:max-h-[18rem] md:max-h-[20rem] lg:pointer-events-none lg:absolute lg:inset-y-5 lg:right-5 lg:mt-0 lg:aspect-auto lg:max-h-none lg:h-auto lg:w-[calc(50%-2.25rem)]"
        aria-live="polite"
        aria-atomic
      >
        {content[active]?.content}
      </div>

      <div
        ref={scroller}
        onScroll={onScroll}
        className="max-h-[min(28rem,58vh)] overflow-y-auto overscroll-y-contain px-5 pb-6 pt-4 [-webkit-overflow-scrolling:touch] sm:px-8 md:max-h-[min(32rem,52vh)] lg:h-full lg:max-h-none lg:w-1/2 lg:px-10 lg:pb-12 lg:pt-10"
      >
        {content.map((item, index) => {
          const current = index === active;
          return (
            <article
              key={item.title}
              data-sticky-card
              className={`mb-10 transition duration-300 last:mb-6 sm:mb-12 lg:mb-16 lg:last:mb-10 ${current ? "opacity-100" : "opacity-35"}`}
            >
              <h3 className="text-2xl font-bold tracking-tight text-heading sm:text-3xl lg:text-4xl">{item.title}</h3>
              {item.description.split(/\n\n+/).map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="mt-3 text-base leading-relaxed text-muted sm:mt-4 sm:text-lg">
                  {paragraph}
                </p>
              ))}
            </article>
          );
        })}
        <div className="h-20 sm:h-24 lg:h-[62%]" aria-hidden />
      </div>
    </div>
  );
}
