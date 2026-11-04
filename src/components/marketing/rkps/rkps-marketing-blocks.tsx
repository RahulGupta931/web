import Link from "next/link";
import type { ReactNode } from "react";
import { INSTAGRAM_PROFILE } from "@/content/website/instagram-media";
import { RkpsInView } from "@/components/marketing/rkps/rkps-motion-sections";

type Photo = { src: string; alt: string };

export function RkpsHeroShell({ children }: { children: ReactNode }) {
  return (
    <section className="rkps-hero-atmosphere border-b border-border/80 bg-[linear-gradient(180deg,#edf5ff_0%,#f8fbff_44%,#edf4ff_100%)]">
      <div className="bg-transparent">
        <div className="mx-auto max-w-7xl px-3 pb-8 pt-6 sm:px-4 sm:pb-10 sm:pt-8">{children}</div>
      </div>
    </section>
  );
}

export function RkpsEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="inline-flex max-w-full rounded-full border border-border bg-surface px-3 py-1 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-brand shadow-sm">
      {children}
    </p>
  );
}

export function RkpsPhotoCollage({
  main,
  thumbs,
  footer,
}: {
  main: Photo & { caption?: ReactNode };
  thumbs: Photo[];
  footer?: ReactNode;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:grid-rows-2 lg:items-stretch lg:gap-4">
      <figure className="rkps-ease rkps-feature-surface overflow-hidden rounded-2xl border border-border/80 bg-surface sm:col-span-2 lg:col-span-7 lg:row-span-2">
        <div className="relative h-full min-h-[14rem] sm:min-h-[16rem] lg:min-h-[22rem]">
          <img src={main.src} alt={main.alt} className="absolute inset-0 h-full w-full object-cover" />
        </div>
        {main.caption ? <figcaption className="border-t border-border px-4 py-3 text-sm text-muted">{main.caption}</figcaption> : null}
      </figure>
      {thumbs.map((photo, i) => (
        <figure
          key={photo.src}
          className="rkps-ease rkps-feature-surface overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-sm lg:col-span-5"
        >
          <div className={`relative w-full ${i === 0 ? "aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[10.5rem]" : "aspect-[4/3] lg:aspect-auto lg:min-h-[10.5rem]"}`}>
            <img src={photo.src} alt={photo.alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          </div>
        </figure>
      ))}
      <div className="col-span-full flex flex-col gap-2 rounded-xl border border-dashed border-border/90 bg-surface/70 px-4 py-3 text-xs text-muted backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between lg:col-span-12">
        {footer ?? (
          <>
            <span>Photos from our official Instagram</span>
            <a href={INSTAGRAM_PROFILE} target="_blank" rel="noreferrer" className="shrink-0 font-semibold text-brand hover:underline">
              @r.k.m.p.s
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export function RkpsSectionIntro({
  num,
  title,
  description,
  action,
  className = "",
}: {
  num?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <RkpsInView className={`flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between ${className}`}>
      <div className="max-w-2xl">
        <span className="mb-3 block h-1 w-10 rounded-full bg-[var(--brand-gold)]" aria-hidden />
        {num ? <p className="rkps-section-num">{num}</p> : null}
        <h2 className="rkps-display mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
        {description ? <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-muted">{description}</p> : null}
      </div>
      {action}
    </RkpsInView>
  );
}

export function RkpsZigzagRow({
  reverse,
  photo,
  badge,
  title,
  kicker,
  body,
  footnote,
}: {
  reverse?: boolean;
  photo: Photo;
  badge: string;
  title: string;
  kicker?: string;
  body: string;
  footnote?: ReactNode;
}) {
  return (
    <article
      className={`grid items-center gap-5 lg:grid-cols-2 lg:gap-8 ${reverse ? "[&>figure]:lg:order-2 [&>div]:lg:order-1" : ""}`}
    >
      <figure className="rkps-ease overflow-hidden rounded-[1.6rem] border border-border/80 bg-surface shadow-[var(--shadow-card)] ring-1 ring-[rgba(18,51,94,0.06)]">
        <img
          src={photo.src}
          alt={photo.alt}
          className="aspect-[16/10] w-full object-cover transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.025]"
          loading="lazy"
        />
      </figure>
      <div className={`rounded-[1.45rem] border border-border/80 bg-[rgba(255,255,255,0.72)] p-5 shadow-[0_18px_36px_rgba(13,35,65,0.08)] backdrop-blur-sm sm:p-6 ${reverse ? "lg:pr-5" : "lg:pl-5"}`}>
        <span className="inline-flex items-center rounded-full border border-[var(--brand-maroon)]/15 bg-[color-mix(in_srgb,var(--brand-gold)_18%,white)] px-2.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-[var(--brand-maroon-dark)]">
          {badge}
        </span>
        <h3 className="rkps-display mt-4 text-2xl font-semibold leading-snug sm:text-[1.65rem]">{title}</h3>
        {kicker ? <p className="mt-2 text-sm font-semibold text-[var(--brand-maroon-light)]">{kicker}</p> : null}
        <p className="mt-4 text-sm leading-relaxed text-muted">{body}</p>
        {footnote ? <div className="mt-4 text-sm text-muted">{footnote}</div> : null}
      </div>
    </article>
  );
}

export function RkpsPathwayCards({
  heading,
  sub,
  items,
  notesTitle,
  notes,
}: {
  heading: string;
  sub?: string;
  items: readonly { num: string; title: string; body?: string; cta: string; href: string }[];
  notesTitle?: string;
  notes?: readonly { title: string; body: string }[];
}) {
  return (
    <div className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-3 py-10 sm:px-4 sm:py-14">
        <RkpsSectionIntro num="Where to next" title={heading} description={sub} />
        <ul className="rkps-stagger mt-8 grid gap-4 md:grid-cols-3">
          {items.map((c, i) => {
            const featured = i === 0;
            return (
              <li key={c.num} style={{ ["--rkps-i" as string]: i }}>
                <Link
                  href={c.href}
                  className={`rkps-ease rkps-press group flex h-full flex-col rounded-[1.25rem] border p-5 shadow-[var(--rkps-shadow-diffuse,var(--shadow-card))] hover:-translate-y-0.5 sm:p-6 ${
                    featured
                      ? "border-brand/30 bg-brand text-white hover:shadow-[var(--shadow-card-hover)]"
                      : "border-border/80 bg-[var(--background)] hover:border-brand/25 hover:shadow-[var(--shadow-card-hover)]"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold ${
                      featured ? "bg-[var(--brand-gold)] text-[var(--brand-maroon-dark)]" : "bg-brand/10 text-brand"
                    }`}
                  >
                    {c.num}
                  </span>
                  <h3 className={`rkps-display mt-4 text-lg font-semibold ${featured ? "text-white" : "text-heading group-hover:text-brand"}`}>
                    {c.title}
                  </h3>
                  {c.body ? (
                    <p className={`mt-2 flex-1 text-sm leading-relaxed ${featured ? "text-white/90" : "text-muted"}`}>{c.body}</p>
                  ) : null}
                  <p className={`mt-5 text-sm font-semibold ${featured ? "text-[var(--brand-gold)]" : "text-brand"}`}>{c.cta} ↗</p>
                </Link>
              </li>
            );
          })}
        </ul>
        {notes && notes.length > 0 ? (
          <div className="mt-8 border-t border-border/80 pt-8">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-brand">{notesTitle ?? "At a glance"}</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {notes.map((note) => (
                <li key={note.title} className="rounded-xl border border-border/80 bg-[var(--background)] px-4 py-3">
                  <p className="text-sm font-semibold text-heading">{note.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{note.body}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}

type PageSectionTone = "plain" | "paper" | "inset";

export function RkpsPageSection({
  id,
  tone = "plain",
  className = "",
  children,
}: {
  id?: string;
  tone?: PageSectionTone;
  className?: string;
  children: ReactNode;
}) {
  const toneClass =
    tone === "paper"
      ? "border-y border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(237,244,255,0.92))]"
      : tone === "inset"
        ? "bg-[linear-gradient(180deg,#edf5ff_0%,#f8fbff_100%)]"
        : "bg-[linear-gradient(180deg,#f8fbff_0%,#edf4ff_100%)]";
  return (
    <section id={id} className={`relative isolate scroll-mt-28 overflow-hidden py-12 sm:py-16 ${toneClass} ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,200,106,0.09),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(11,61,120,0.08),transparent_28%)]" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-3 sm:px-4 lg:px-5">{children}</div>
    </section>
  );
}

/** Left intro pins while the right column scrolls; releases when the section ends. */
export function RkpsStickySplitLayout({
  aside,
  main,
  decoration,
  asideWrapperClassName = "",
}: {
  aside: ReactNode;
  main: ReactNode;
  decoration?: ReactNode;
  /** Extra classes on the sticky aside inner wrapper (e.g. viewport vertical centering). */
  asideWrapperClassName?: string;
}) {
  return (
    <div className="relative">
      {decoration}
      <div className="grid items-start gap-10 lg:grid-cols-12 lg:items-stretch lg:gap-x-14 lg:gap-y-8">
        <div className="flex lg:col-span-5 lg:items-center lg:justify-center">
          <div className={`rkps-split-aside w-full ${asideWrapperClassName}`.trim()}>{aside}</div>
        </div>
        <div className="min-w-0 lg:col-span-7">{main}</div>
      </div>
    </div>
  );
}

export function RkpsSectionGlow({ children }: { children: ReactNode }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {children}
    </div>
  );
}

export function RkpsQuickJumpNav({ links }: { links: readonly { href: string; label: string }[] }) {
  return (
    <nav
      className="sticky top-[4.25rem] z-30 hidden border-b border-border bg-surface/95 backdrop-blur-md lg:top-[4.5rem] lg:block"
      aria-label="Jump to section"
    >
      <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-3 py-2.5 scrollbar-none sm:px-4 lg:px-5">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold text-muted transition hover:bg-brand/10 hover:text-brand"
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export function RkpsStatStrip({ stats }: { stats: readonly { label: string; value: string }[] }) {
  return (
    <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-12">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`bg-surface/90 px-4 py-4 text-left ${
            i === 0 ? "sm:col-span-7" : i === 1 ? "sm:col-span-5" : i === 2 ? "sm:col-span-5" : "sm:col-span-7"
          }`}
        >
          <dt className="sr-only">{stat.label}</dt>
          <dd className="text-2xl font-bold tracking-tight text-brand tabular-nums">{stat.value}</dd>
          <p className="mt-1 text-[0.625rem] font-semibold uppercase tracking-wide text-muted">{stat.label}</p>
        </div>
      ))}
    </dl>
  );
}

export function RkpsFeatureCard({
  tag,
  title,
  body,
  href,
  cta,
}: {
  tag?: string;
  title: string;
  body: string;
  href?: string;
  cta?: string;
}) {
  const inner = (
    <>
      {tag ? <p className="rkps-tag">{tag}</p> : null}
      <h3 className="rkps-display mt-3 text-lg font-semibold text-heading">{title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{body}</p>
      {cta ? <p className="rkps-btn-ghost mt-4 text-sm">{cta} ↗</p> : null}
    </>
  );
  const className =
    "rkps-ease rkps-press rkps-feature-surface flex h-full flex-col rounded-[1.25rem] border border-border/80 bg-surface p-6 shadow-[var(--shadow-card)] hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-[var(--shadow-card-hover)]";
  if (href) {
    return (
      <Link href={href} className={`group ${className}`}>
        {inner}
      </Link>
    );
  }
  return <article className={className}>{inner}</article>;
}

export function RkpsContactSection({
  id,
  title,
  subtitle,
  lead,
  detail,
  visitBlurb,
  visit,
  phone,
  email,
  hours,
  hoursNote,
  reachOut,
  campusPhoto,
}: {
  id: string;
  title: string;
  subtitle: string;
  lead: string;
  detail: string;
  visitBlurb: string;
  visit: string;
  phone: string;
  email: string;
  hours: string;
  hoursNote: string;
  reachOut: readonly { title: string; body: string }[];
  campusPhoto: Photo;
}) {
  const telHref = `tel:${phone.replace(/\s/g, "")}`;
  const mailHref = `mailto:${email}`;

  return (
    <RkpsPageSection id={id} tone="paper">
      <RkpsSectionIntro num="Contact" title={title} description={`${subtitle} ${lead}`} />
      <p className="mt-4 max-w-none text-base leading-relaxed text-muted">{detail}</p>

      <div className="mt-8 grid items-stretch gap-6 lg:grid-cols-12 lg:gap-8">
        <figure className="relative min-h-[20rem] overflow-hidden rounded-[1.6rem] border border-white/10 shadow-[0_30px_55px_rgba(11,61,120,0.12)] sm:min-h-[24rem] lg:col-span-8 lg:min-h-[32rem]">
          <img src={campusPhoto.src} alt={campusPhoto.alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,31,59,0.2)_0%,rgba(8,31,59,0.62)_100%)]" aria-hidden />
          <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8 lg:p-10">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-[var(--brand-gold)]">Visit the campus</p>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/92 sm:text-lg">{visitBlurb}</p>
            <p className="mt-4 text-sm font-semibold leading-relaxed text-white sm:text-base">{visit}</p>
            <p className="mt-3 text-sm text-white/85">{hours}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/75">{hoursNote}</p>
          </figcaption>
        </figure>

        <div className="flex flex-col gap-4 lg:col-span-4 lg:min-h-[32rem]">
          <a
            href={telHref}
            className="rkps-ease rkps-press group flex flex-1 flex-col rounded-[1.4rem] border border-border/80 bg-[rgba(255,255,255,0.82)] p-6 shadow-[0_18px_38px_rgba(11,61,120,0.08)] backdrop-blur-sm hover:-translate-y-0.5 hover:border-brand/30"
          >
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-brand">Call the office</p>
            <p className="mt-3 text-xl font-semibold text-heading sm:text-2xl">{phone}</p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted sm:text-base">
              Admissions, campus visits, fee structure questions and day-to-day matters. If no one answers, leave a message and the office will call back during school hours.
            </p>
            <span className="mt-4 inline-flex text-sm font-semibold text-brand">Call now ↗</span>
          </a>
          <a
            href={mailHref}
            className="rkps-ease rkps-press group flex flex-1 flex-col rounded-[1.4rem] border border-border/80 bg-[rgba(255,255,255,0.82)] p-6 shadow-[0_18px_38px_rgba(11,61,120,0.08)] backdrop-blur-sm hover:-translate-y-0.5 hover:border-brand/30"
          >
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-brand">Write to us</p>
            <p className="mt-3 break-all text-lg font-semibold text-heading sm:break-normal sm:text-xl">{email}</p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted sm:text-base">
              Email works well for documents, visit requests and questions that need a written reply. Include your phone number if you would like a call.
            </p>
            <span className="mt-4 inline-flex text-sm font-semibold text-brand">Send email ↗</span>
          </a>
          <div className="flex flex-col gap-4 rounded-[1.4rem] border border-brand/25 bg-[linear-gradient(135deg,#081f3b_0%,#0d2f5d_100%)] p-6 text-white shadow-[0_24px_44px_rgba(8,31,59,0.2)] sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-sm">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-[var(--brand-gold)]">Plan a visit</p>
              <p className="mt-2 text-sm leading-relaxed text-white/90 sm:text-base">
                Prefer a form? Tell us your child&apos;s class, your questions and when you might visit — the admissions team will follow up.
              </p>
            </div>
            <Link
              href="/#enquiry"
              className="rkps-ease rkps-press inline-flex shrink-0 justify-center rounded-lg bg-[var(--brand-gold)] px-5 py-2.5 text-sm font-bold text-[var(--brand-maroon-dark)] hover:brightness-105"
            >
              Send an enquiry
            </Link>
          </div>
        </div>
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-3">
        {reachOut.map((item) => (
          <li key={item.title} className="rounded-[1.25rem] border border-border/80 bg-[rgba(255,255,255,0.82)] p-5 shadow-[0_18px_35px_rgba(11,61,120,0.06)] backdrop-blur-sm sm:p-6">
            <p className="text-sm font-bold text-heading">{item.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">{item.body}</p>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-sm text-muted">
        Day-to-day moments are on{" "}
        <a href={INSTAGRAM_PROFILE} target="_blank" rel="noreferrer" className="font-semibold text-brand hover:underline">
          @r.k.m.p.s
        </a>
        . For official dates and documents, always confirm with the school office.
      </p>
    </RkpsPageSection>
  );
}

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
    <RkpsPageSection id={id} tone="paper">
      <RkpsSectionIntro num="Admissions" title={title} description={`${subtitle} ${lead}`} />
      <nav className="mt-6 flex flex-wrap gap-2" aria-label="Admissions shortcuts">
        <a
          href="#enquiry"
          className="rkps-ease rounded-full bg-[linear-gradient(135deg,#0b3d78,#1a5bb4)] px-4 py-1.5 text-xs font-bold text-white shadow-[0_12px_22px_rgba(11,61,120,0.18)] hover:brightness-105"
        >
          Start enquiry
        </a>
        <a
          href="#faq"
          className="rkps-ease rounded-full border border-border/80 bg-[rgba(255,255,255,0.7)] px-4 py-1.5 text-xs font-semibold text-brand hover:border-brand/30 hover:bg-brand/5"
        >
          FAQ
        </a>
        <Link
          href="/#contact"
          className="rkps-ease rounded-full border border-dashed border-border px-4 py-1.5 text-xs font-semibold text-heading hover:border-brand/30 hover:text-brand"
        >
          Plan a visit ↗
        </Link>
      </nav>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <ol className="rkps-stagger relative space-y-0">
            {steps.map((s, i) => (
              <li
                key={s.num}
                className={`relative pb-10 pl-14 last:pb-0 ${i === 1 ? "lg:pl-16" : i === 2 ? "lg:pl-12" : ""}`}
                style={{ ["--rkps-i" as string]: i }}
              >
                {i < steps.length - 1 ? (
                  <span className="absolute left-[1.0625rem] top-10 h-[calc(100%-1.5rem)] w-px bg-border" aria-hidden />
                ) : null}
                <span className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-brand/30 bg-[rgba(255,255,255,0.8)] text-[0.6875rem] font-bold text-brand shadow-sm">
                  {s.num}
                </span>
                <p className="rkps-display text-base font-semibold text-heading">{s.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>

          <figure className="rkps-ease mt-10 overflow-hidden rounded-[1.5rem] border border-white/10 shadow-[0_24px_44px_rgba(11,61,120,0.12)]">
            <div className="relative aspect-[16/9] min-h-[9rem]">
              <img src={accentPhoto.src} alt={accentPhoto.alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,31,59,0.2)_0%,rgba(8,31,59,0.7)_100%)]" aria-hidden />
              <figcaption className="absolute inset-0 flex flex-col justify-end p-5 text-white sm:p-6">
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-[var(--brand-gold)]">School life</p>
                <p className="mt-1 text-sm font-semibold leading-snug">See the campus before you decide.</p>
              </figcaption>
            </div>
          </figure>

          <p className="mt-6 text-xs leading-relaxed text-muted">{disclaimer}</p>

          <div id="faq" className="scroll-mt-28 mt-10">
            <h3 className="text-base font-semibold text-heading">Here to help</h3>
            <p className="mt-1 text-sm text-muted">Big decisions. Little questions.</p>
            <div className="mt-4 overflow-hidden rounded-[1.25rem] border border-border/80 bg-[rgba(255,255,255,0.82)] divide-y divide-border">
              {faq.map((item) => (
                <details key={item.q} className="group rkps-ease">
                  <summary className="cursor-pointer list-none px-4 py-3.5 text-sm font-semibold text-heading transition hover:bg-[rgba(11,61,120,0.03)] [&::-webkit-details-marker]:hidden">
                    {item.q}
                  </summary>
                  <p className="border-t border-border px-4 pb-4 pt-2 text-sm leading-relaxed text-muted">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>

        <div className="rkps-split-aside lg:col-span-7">{form}</div>
      </div>
    </RkpsPageSection>
  );
}

type AboutValue = { title: string; body: string };

export function RkpsAboutSection({
  vision,
  values,
  motto,
  schoolName,
}: {
  vision: {
    id: string;
    kicker: string;
    title: string;
    subtitle: string;
    body: string;
    cta: string;
    href: string;
  };
  values: { id: string; kicker: string; items: readonly AboutValue[] };
  motto: string;
  schoolName: string;
}) {
  return (
    <>
      <section id={vision.id} className="scroll-mt-28 relative isolate overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/marketing/vision-chalkboard-banner.png')" }}
          aria-hidden
        />
        <div
          className="absolute inset-0 z-[1] bg-black/55 lg:bg-black/45"
          aria-hidden
        />
        <div className="relative z-[2] mx-auto max-w-7xl px-3 py-12 sm:px-4 sm:py-14">
          <div className="rkps-stagger grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-14">
            <div className="lg:col-span-7" style={{ ["--rkps-i" as string]: 0 }}>
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[var(--brand-gold)]">About</p>
              <p className="mt-4 text-lg font-semibold tracking-tight text-white sm:text-xl">{vision.kicker}</p>
              <h2 className="mt-3 text-3xl font-bold leading-none tracking-tighter text-white sm:text-4xl lg:text-[2.5rem]">
                {vision.title}
              </h2>
              <p className="mt-3 text-xl font-bold tracking-tight text-[var(--brand-gold)] sm:text-2xl">{vision.subtitle}</p>
              <p className="mt-6 max-w-[65ch] text-base leading-relaxed text-white/92">{vision.body}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={vision.href}
                  className="rkps-ease rkps-press inline-flex items-center rounded-lg bg-[var(--brand-gold)] px-6 py-2.5 text-sm font-bold text-[var(--brand-maroon-dark)] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] hover:brightness-105"
                >
                  {vision.cta} ↗
                </Link>
                <Link
                  href="/#academics"
                  className="rkps-ease inline-flex items-center rounded-lg border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/15"
                >
                  Learning journey
                </Link>
              </div>
              <nav className="mt-8 flex flex-wrap gap-2" aria-label="About shortcuts">
                <a
                  href={`#${values.id}`}
                  className="rkps-ease rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-sm hover:bg-white/15"
                >
                  Our values
                </a>
                <Link
                  href="/school-life/student-achievers"
                  className="rkps-ease rounded-full border border-dashed border-white/25 px-3.5 py-1.5 text-xs font-semibold text-white/90 hover:border-white/40 hover:text-white"
                >
                  School life ↗
                </Link>
                <Link
                  href="/#gallery"
                  className="rkps-ease rounded-full border border-dashed border-white/25 px-3.5 py-1.5 text-xs font-semibold text-white/90 hover:border-white/40 hover:text-white"
                >
                  Campus gallery ↗
                </Link>
              </nav>
            </div>

            <aside
              className="lg:col-span-5 lg:pb-2"
              style={{ ["--rkps-i" as string]: 1 }}
              aria-label="School at a glance"
            >
              <div className="rkps-ease rounded-[1.25rem] border border-white/15 bg-white/10 p-6 shadow-[0_24px_48px_-20px_rgba(0,0,0,0.45)] backdrop-blur-md sm:p-8">
                <p className="text-sm font-semibold italic text-[var(--brand-gold)]">{motto}</p>
                <p className="mt-2 text-lg font-bold tracking-tight text-white">{schoolName}</p>
                <ul className="mt-6 space-y-4 border-t border-white/15 pt-6 text-sm text-white/88">
                  <li className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-gold)]/20 text-[0.625rem] font-bold text-[var(--brand-gold)]">
                      01
                    </span>
                    <span>Curious learners who ask thoughtful questions every day.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-gold)]/20 text-[0.625rem] font-bold text-[var(--brand-gold)]">
                      02
                    </span>
                    <span>Warm corridors where character and kindness matter.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-gold)]/20 text-[0.625rem] font-bold text-[var(--brand-gold)]">
                      03
                    </span>
                    <span>A community that celebrates effort — not comparison.</span>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <RkpsPageSection id={values.id} tone="paper">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <RkpsSectionIntro
            num="Our values"
            title="Small moments. Meaningful beginnings."
            description="What guides every classroom, corridor and conversation at RMPS."
          />
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href="/#academics" className="btn-primary rkps-ease rkps-press px-6 py-2.5">
              Explore academics
            </Link>
            <Link href="/#admissions" className="btn-secondary rkps-ease rkps-press px-6 py-2.5">
              Admission enquiry
            </Link>
          </div>
        </div>
        <p className="mt-5 max-w-xl border-l-2 border-[var(--brand-gold)] pl-4 text-sm font-semibold italic leading-snug text-brand">
          {values.kicker}
        </p>
        <ol className="rkps-stagger mt-8 grid gap-4 md:grid-cols-3">
          {values.items.map((v, i) => {
            const isFeatured = i === values.items.length - 1;
            return (
              <li key={v.title} style={{ ["--rkps-i" as string]: i }}>
                <article
                  className={`flex h-full flex-col rounded-[1.25rem] border p-5 sm:p-6 ${
                    isFeatured
                      ? "border-brand/30 bg-brand text-white"
                      : "border-border/80 bg-surface"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${
                      isFeatured ? "bg-[var(--brand-gold)] text-[var(--brand-maroon-dark)]" : "bg-brand/10 text-brand"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className={`mt-4 text-[0.6875rem] font-bold uppercase tracking-[0.12em] ${isFeatured ? "text-[var(--brand-gold)]" : "text-brand"}`}>
                    {i === 0 ? "Curiosity" : i === 1 ? "Character" : "Every child"}
                  </p>
                  <h3 className={`rkps-display mt-2 text-xl font-semibold ${isFeatured ? "text-white" : "text-heading"}`}>{v.title}</h3>
                  <p className={`mt-3 flex-1 text-sm leading-relaxed ${isFeatured ? "text-white/90" : "text-muted"}`}>{v.body}</p>
                </article>
              </li>
            );
          })}
        </ol>
      </RkpsPageSection>
    </>
  );
}

type NoticeItem = { id: string; title: string; date: string; excerpt: string };

function formatNoticeDate(iso: string): string {
  const parsed = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return iso;
  return parsed.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function RkpsNoticeboardSection({
  id,
  title,
  subtitle,
  emptyNote,
  notices,
}: {
  id: string;
  title: string;
  subtitle: string;
  emptyNote: string;
  notices: readonly NoticeItem[];
}) {
  const [featured, ...rest] = notices;

  return (
    <RkpsPageSection id={id} tone="paper">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <RkpsSectionIntro num="Noticeboard" title={title} description={subtitle} />
        <nav className="flex shrink-0 flex-wrap gap-2" aria-label="Noticeboard shortcuts">
          <Link
            href="/login"
            className="rkps-ease rkps-press rounded-full bg-brand px-4 py-1.5 text-xs font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] hover:brightness-105"
          >
            Portal login
          </Link>
          <Link
            href="/school-life/events"
            className="rkps-ease rounded-full border border-border/80 bg-surface px-4 py-1.5 text-xs font-semibold text-brand hover:border-brand/30 hover:bg-brand/5"
          >
            Events ↗
          </Link>
          <Link
            href="/#contact"
            className="rkps-ease rounded-full border border-dashed border-border px-4 py-1.5 text-xs font-semibold text-heading hover:border-brand/30 hover:text-brand"
          >
            Call the office ↗
          </Link>
        </nav>
      </div>
      <p className="mt-4 max-w-3xl text-xs leading-relaxed text-muted">{emptyNote}</p>
      <div className="rkps-stagger mt-6 grid gap-4 lg:grid-cols-12 lg:items-start">
          {featured ? (
            <article
              className="rkps-ease rkps-feature-surface rounded-[1.25rem] border border-brand/20 bg-surface p-6 shadow-[var(--rkps-shadow-diffuse,var(--shadow-card))] lg:col-span-7 lg:p-8"
              style={{ ["--rkps-i" as string]: 0 }}
            >
              <p className="text-[0.6875rem] font-bold uppercase tracking-wide text-brand">Latest update</p>
              <time dateTime={featured.date} className="mt-3 block text-xs tabular-nums text-muted">
                {formatNoticeDate(featured.date)}
              </time>
              <h3 className="rkps-display mt-2 text-xl font-semibold leading-snug text-heading sm:text-2xl">{featured.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{featured.excerpt}</p>
            </article>
          ) : null}

          <ul
            className={`grid gap-3 ${featured ? "lg:col-span-5 lg:col-start-8 lg:row-start-1" : "lg:col-span-12"}`}
          >
            {rest.map((n, i) => (
              <li
                key={n.id}
                className="rkps-ease rounded-[1.25rem] border border-border/80 bg-surface/90 px-5 py-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-[var(--shadow-card)]"
                style={{ ["--rkps-i" as string]: i + 1 }}
              >
                <time dateTime={n.date} className="text-xs tabular-nums text-muted">
                  {formatNoticeDate(n.date)}
                </time>
                <p className="mt-1 font-semibold text-heading">{n.title}</p>
                <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">{n.excerpt}</p>
              </li>
            ))}
          </ul>
      </div>
    </RkpsPageSection>
  );
}
