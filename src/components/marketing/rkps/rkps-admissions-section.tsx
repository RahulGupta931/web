"use client";

import type { ReactNode } from "react";
import { RkpsPageSection } from "@/components/marketing/rkps/rkps-marketing-blocks";
import { RkpsInView } from "@/components/marketing/rkps/rkps-motion-sections";

type Photo = { src: string; alt: string };
type JourneyStep = { num: string; title: string; body: string };
type FaqItem = { q: string; a: string };

export function RkpsAdmissionsSection({
  id,
  title,
  subtitle,
  lead,
  steps,
  disclaimer,
  faq,
  form,
  accentPhoto,
}: {
  id: string;
  title: string;
  subtitle: string;
  lead: string;
  steps: readonly JourneyStep[];
  disclaimer: string;
  faq: readonly FaqItem[];
  form: ReactNode;
  accentPhoto: Photo;
}) {
  return (
    <RkpsPageSection id={id} tone="inset">
      <RkpsInView>
        <div className="overflow-hidden rounded-[1.75rem] border border-border/80 bg-white shadow-[0_24px_60px_rgba(96,0,0,0.07)] sm:rounded-[2rem]">
          <div className="grid lg:grid-cols-12 lg:items-stretch">
            {/* Enquiry — first on small screens */}
            <div className="order-1 flex min-h-0 flex-col rkps-bg-inset-panel p-5 sm:p-7 lg:order-2 lg:col-span-7 lg:p-8">
              <div className="mb-5 border-b border-border/50 pb-5">
                <p className="rkps-text-label-soft text-xs">Session 2026–27 · Pre-Primary to Grade 12</p>
                <p className="rkps-display mt-1 text-xl text-heading sm:text-2xl">Admission enquiry</p>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                  Share your details and the office will follow up with availability, documents and visit options.
                </p>
              </div>
              <div className="min-h-0 flex-1 lg:flex lg:flex-col">{form}</div>
            </div>

            {/* Journey + FAQ */}
            <aside className="order-2 flex flex-col border-t border-border/70 bg-[var(--surface-elevated)] p-6 sm:p-8 lg:order-1 lg:col-span-5 lg:border-t-0 lg:border-r lg:p-10">
              <span className="rkps-rule" aria-hidden="true" />
              <p className="rkps-text-label mt-4 text-xs">Admissions 2026–27</p>
              <h2 className="rkps-display mt-2 text-[1.75rem] leading-tight text-heading [text-wrap:balance] sm:text-3xl">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{subtitle}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{lead}</p>

              <div className="mt-8">
                <p className="rkps-text-label-soft text-xs">How it works</p>
                <ol className="mt-3 divide-y divide-border/70 overflow-hidden rounded-2xl border border-border/80 bg-white">
                  {steps.map((step) => (
                    <li key={step.num} className="flex gap-3.5 p-4 sm:p-5">
                      <span
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[var(--brand-maroon-dark)] text-xs font-semibold tabular-nums text-[var(--brand-gold)]"
                        aria-hidden
                      >
                        {step.num}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-heading">{step.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-muted sm:text-sm">{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <figure className="relative mt-8 min-h-[11rem] overflow-hidden rounded-2xl border border-border/70 sm:min-h-[12rem]">
                <img
                  src={accentPhoto.src}
                  alt={accentPhoto.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"
                  aria-hidden
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <p className="text-xs text-white/75">Campus visit</p>
                  <p className="mt-1 text-sm leading-snug text-white">
                    Meet the community and see classrooms before you decide.
                  </p>
                </figcaption>
              </figure>

              <div id="faq" className="mt-8 scroll-mt-28">
                <p className="rkps-text-label-soft text-xs">Common questions</p>
                <div className="mt-3 space-y-2">
                  {faq.map((item) => (
                    <details
                      key={item.q}
                      className="group rounded-xl border border-border/80 bg-white px-4 py-3 transition open:shadow-sm"
                    >
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-sm font-medium text-heading [&::-webkit-details-marker]:hidden">
                        <span>{item.q}</span>
                        <span className="shrink-0 text-xs text-muted transition group-open:rotate-180" aria-hidden>
                          ▼
                        </span>
                      </summary>
                      <p className="mt-3 border-t border-border/60 pt-3 text-xs leading-relaxed text-muted sm:text-sm">
                        {item.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>

              <p className="mt-6 text-xs leading-relaxed text-muted lg:mt-auto lg:pt-6">{disclaimer}</p>
            </aside>
          </div>
        </div>
      </RkpsInView>
    </RkpsPageSection>
  );
}
