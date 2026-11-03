"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@/lib/use-media-query";

export function FormSection({
  title,
  children,
  /** When true, sections collapse on viewports below lg (legacy). Default false = same fields on mobile and desktop. */
  collapsible = false,
  defaultOpenOnMobile = false,
}: {
  title: string;
  children: React.ReactNode;
  collapsible?: boolean;
  /** Only used when collapsible is true */
  defaultOpenOnMobile?: boolean;
}) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [open, setOpen] = useState(defaultOpenOnMobile);

  useEffect(() => {
    if (isDesktop) setOpen(true);
  }, [isDesktop]);

  const expanded = !collapsible || isDesktop || open;

  if (!collapsible) {
    return (
      <section className="border-b border-[var(--border)] py-1 last:border-b-0">
        <div className="form-section-title py-3">{title}</div>
        <div className="pb-4 pt-1">{children}</div>
      </section>
    );
  }

  return (
    <section className="border-b border-[var(--border)] py-1 last:border-b-0">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 rounded-lg py-3 text-left transition hover:bg-[var(--surface-muted)] lg:pointer-events-none lg:cursor-default lg:hover:bg-transparent"
        onClick={() => !isDesktop && setOpen((v) => !v)}
        aria-expanded={expanded}
      >
        <span className="form-section-title">{title}</span>
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-sm font-medium text-muted lg:hidden"
          aria-hidden
        >
          {expanded ? "−" : "+"}
        </span>
      </button>
      <div className={`pb-4 pt-1 ${expanded ? "" : "hidden"}`}>{children}</div>
    </section>
  );
}
