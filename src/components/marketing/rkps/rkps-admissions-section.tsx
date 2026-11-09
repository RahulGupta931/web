"use client";

import type { ReactNode } from "react";
import { RkpsPageSection } from "@/components/marketing/rkps/rkps-marketing-blocks";
import { RkpsInView } from "@/components/marketing/rkps/rkps-motion-sections";
import { RKPS_CONTACT } from "@/content/website/rkps-copy";

const ENQUIRY_NEXT = [
  { title: "Send the form", body: "Parent details, your child's name and the class you are asking about." },
  { title: "The office calls you", body: "Usually within one working day, to answer questions and share the prospectus." },
  { title: "Visit the campus", body: "See classrooms and labs, meet the admissions desk and confirm seats and documents." },
] as const;

const ENQUIRY_PHOTO = {
  src: "/marketing/instagram/campus-21.jpg",
  alt: "Young students holding certificates at a school ceremony",
};

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
    <>
      <RkpsPageSection id={id} tone="paper">
        <RkpsInView>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <span className="rkps-rule" aria-hidden="true" />
              <p className="rkps-text-label mt-4 text-xs">Admission process</p>
              <h2 className="rkps-display mt-2 text-[1.75rem] leading-tight text-heading sm:text-4xl">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{subtitle}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{lead}</p>
              <ol className="mt-8 divide-y divide-border/70 overflow-hidden rounded-2xl border border-border/80 bg-white">
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
              <p className="mt-4 text-xs leading-relaxed text-muted">{disclaimer}</p>
            </div>
            <figure className="relative min-h-[16rem] overflow-hidden rounded-[1.5rem] border border-border/80 lg:col-span-5 lg:min-h-[22rem]">
              <img src={accentPhoto.src} alt={accentPhoto.alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" aria-hidden />
              <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="text-xs text-white/75">Submit enquiry · Visit · Complete admission</p>
                <p className="mt-1 text-sm font-medium">The office confirms seats, documents and timelines.</p>
              </figcaption>
            </figure>
          </div>
        </RkpsInView>
      </RkpsPageSection>

      <section
        id="enquiry"
        aria-labelledby="enquiry-title"
        className="relative isolate scroll-mt-28 overflow-hidden py-16 text-white sm:py-20 lg:py-28"
      >
        <div className="mx-auto max-w-7xl rkps-page-x">
          <RkpsInView>
            {/* Header */}
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-16">
              <div className="lg:col-span-7">
                <span className="rkps-rule" aria-hidden="true" />
                <p className="mt-4 text-sm text-[var(--brand-gold)]">Admission enquiry form · Session 2026–27</p>
                <h2 id="enquiry-title" className="rkps-display mt-2 text-[2.25rem] leading-[1.05] sm:text-5xl lg:text-[3.5rem]">
                  Tell us about your child
                </h2>
              </div>
              <p className="max-w-md text-base leading-relaxed text-white/80 sm:text-lg lg:col-span-5">
                Two minutes now, and the admissions office takes it from there — with a call, the prospectus and a time to visit.
              </p>
            </div>

            {/* Steps across the width */}
            <ol className="mt-12 grid gap-6 border-t border-white/15 pt-8 sm:grid-cols-3 sm:gap-8">
              {ENQUIRY_NEXT.map((item, index) => (
                <li key={item.title} className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--brand-gold)] font-mono text-sm tabular-nums text-[var(--rkps-primary-dark)]">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-base font-medium text-white">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-white/70">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            {/* Form + side panel */}
            <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="rounded-[1.5rem] bg-white p-6 text-[var(--rkps-text-body)] shadow-[0_32px_80px_-24px_rgba(0,0,0,0.45)] sm:p-10 lg:col-span-8">
                {form}
              </div>

              <aside className="flex flex-col gap-6 lg:col-span-4">
                <figure className="relative min-h-[18rem] overflow-hidden rounded-[1.5rem] bg-white/10 sm:min-h-[22rem] lg:min-h-0 lg:flex-1">
                  <img
                    src={ENQUIRY_PHOTO.src}
                    alt={ENQUIRY_PHOTO.alt}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" aria-hidden />
                  <figcaption className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-sm text-[var(--brand-gold)]">Pre-primary to Class 12</p>
                    <p className="rkps-display mt-1 text-2xl leading-tight text-white">Every class begins with one enquiry</p>
                  </figcaption>
                </figure>

                <div className="rounded-[1.5rem] border border-white/15 bg-white/[0.06] p-6">
                  <p className="text-sm text-white/70">Prefer to talk</p>
                  <div className="mt-4 space-y-3 text-base">
                    <a
                      href={`tel:${RKPS_CONTACT.phone.replace(/[^+\d]/g, "")}`}
                      className="flex items-center gap-3 text-white transition-colors hover:text-[var(--brand-gold)]"
                    >
                      <svg className="h-5 w-5 text-[var(--brand-gold)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <span className="font-mono tabular-nums">{RKPS_CONTACT.phone}</span>
                    </a>
                    <a
                      href={`mailto:${RKPS_CONTACT.email}`}
                      className="flex items-center gap-3 break-all text-white transition-colors hover:text-[var(--brand-gold)]"
                    >
                      <svg className="h-5 w-5 shrink-0 text-[var(--brand-gold)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                      <span>{RKPS_CONTACT.email}</span>
                    </a>
                    <p className="flex items-center gap-3 text-white/75">
                      <svg className="h-5 w-5 shrink-0 text-[var(--brand-gold)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                      <span>{RKPS_CONTACT.hours.split(";")[0]}</span>
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </RkpsInView>
        </div>
      </section>

      <RkpsPageSection id="faq" tone="paper">
        <RkpsInView>
          <span className="rkps-rule" aria-hidden="true" />
          <p className="rkps-text-label mt-4 text-xs">FAQs</p>
          <h2 className="rkps-display mt-2 text-[1.75rem] leading-tight text-heading sm:text-3xl">
            Admission, fees, documents and visits
          </h2>
          <div className="mt-6 space-y-2">
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
        </RkpsInView>
      </RkpsPageSection>
    </>
  );
}
