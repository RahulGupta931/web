import Link from "next/link";
import type { ReactNode } from "react";
import { INSTAGRAM_PROFILE } from "@/content/website/instagram-media";
import { RkpsInView } from "@/components/marketing/rkps/rkps-motion-sections";

type Photo = { src: string; alt: string };

export function RkpsHeroShell({ children }: { children: ReactNode }) {
  return (
    <section className="rkps-hero-atmosphere border-b border-border/80 bg-[var(--surface-muted)]">
      <div className="bg-transparent">
        <div className="mx-auto max-w-7xl rkps-page-x pb-8 pt-6 sm:pb-10 sm:pt-8">{children}</div>
      </div>
    </section>
  );
}

export function RkpsEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-brand/20 bg-white/90 px-3.5 py-1 text-[0.6875rem] font-bold uppercase tracking-wider text-brand shadow-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-gold)]" />
      <span>{children}</span>
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
      <figure className="group relative min-h-0 overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-md sm:col-span-2 lg:col-span-7 lg:row-span-2">
        <div className="relative h-full min-h-[16rem] sm:min-h-[20rem] lg:min-h-full">
          <img src={main.src} alt={main.alt} className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
        </div>
        {main.caption ? <figcaption className="border-t border-border px-4 py-3 text-xs sm:text-sm text-muted">{main.caption}</figcaption> : null}
      </figure>
      {thumbs.map((photo, i) => (
        <figure
          key={photo.src}
          className={`group relative min-h-0 overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-md lg:col-span-5 ${
            i === 0 ? "lg:row-start-1" : "lg:row-start-2"
          }`}
        >
          <div className="relative aspect-[16/10] w-full lg:aspect-auto lg:h-full lg:min-h-[11rem]">
            <img src={photo.src} alt={photo.alt} className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" loading="lazy" />
          </div>
        </figure>
      ))}
      <div className="col-span-full flex flex-col gap-2 rounded-xl border border-dashed border-border/90 bg-surface/80 px-4 py-3 text-xs text-muted backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between lg:col-span-12">
        {footer ?? (
          <>
            <span>Photos from our official campus community</span>
            <a href={INSTAGRAM_PROFILE} target="_blank" rel="noreferrer" className="shrink-0 font-bold text-brand hover:underline">
              @r.k.m.p.s ↗
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
  dark = false,
  className = "",
}: {
  num?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <RkpsInView className={`flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between ${className}`}>
      <div className="max-w-2xl space-y-1.5">
        <span className="rkps-rule" aria-hidden="true" />
        {num ? (
          <p className={`text-xs ${dark ? "text-white/70" : "rkps-text-label"}`}>
            {num}
          </p>
        ) : null}
        <h2
          className={`rkps-display text-[1.75rem] leading-tight [text-wrap:balance] sm:text-4xl ${
            dark ? "text-white" : "text-heading"
          }`}
        >
          {title}
        </h2>
        {description ? (
          <p className={`max-w-[65ch] text-sm leading-relaxed sm:text-base ${dark ? "text-white/80" : "text-muted"}`}>
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0 pt-1 lg:pt-0">{action}</div> : null}
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
      className={`grid items-stretch gap-5 sm:gap-6 lg:grid-cols-2 lg:gap-8 ${
        reverse ? "[&>figure]:lg:order-2 [&>div]:lg:order-1" : ""
      }`}
    >
      <figure className="group relative h-full min-h-[16rem] sm:min-h-[20rem] overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-md">
        <img
          src={photo.src}
          alt={photo.alt}
          className="h-full w-full object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
      </figure>

      <div className={`flex h-full flex-col justify-center rounded-2xl border border-border/80 bg-white p-6 sm:p-8 shadow-md ${
        reverse ? "lg:pr-8" : "lg:pl-8"
      }`}>
        <span className="rkps-text-label-soft text-xs">{badge}</span>
        <h3 className="rkps-display mt-2 text-2xl leading-snug sm:text-3xl text-heading">
          {title}
        </h3>
        {kicker ? (
          <p className="mt-1.5 text-sm font-medium text-[var(--rkps-primary-light)]">
            {kicker}
          </p>
        ) : null}
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
          {body}
        </p>
        {footnote ? (
          <div className="mt-5 border-t border-border/70 pt-3 text-xs text-muted">
            {footnote}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function RkpsPathwayCards({
  id = "explore-rmps",
  heading,
  sub,
  items,
  notesTitle,
  notes,
}: {
  id?: string;
  heading: string;
  sub?: string;
  items: readonly {
    num: string;
    title: string;
    body?: string;
    cta: string;
    href: string;
    photo?: { src: string; alt: string };
  }[];
  notesTitle?: string;
  notes?: readonly { title: string; body: string }[];
}) {
  return (
    <div id={id} className="scroll-mt-28 border-t border-border bg-white">
      <div className="mx-auto max-w-7xl rkps-page-x py-14 sm:py-20 lg:py-24">
        <RkpsSectionIntro num="Where To Next" title={heading} description={sub} />
        <ul className="rkps-stagger mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-12 lg:grid-rows-2 lg:items-stretch">
          {items.map((c, i) => {
            const featured = i === 0;
            const layout = featured
              ? "sm:col-span-2 lg:col-span-7 lg:row-span-2"
              : i === 1
                ? "lg:col-span-5 lg:row-start-1"
                : "sm:col-span-2 lg:col-span-5 lg:row-start-2";
            return (
              <li key={c.num} className={`${layout} min-h-0`} style={{ ["--rkps-i" as string]: i }}>
                <Link
                  href={c.href}
                  className={`group relative isolate flex h-full min-h-[16rem] flex-col justify-between overflow-hidden rounded-2xl border p-6 sm:min-h-[18rem] sm:p-8 ${
                    c.photo
                      ? "border-white/20 text-white shadow-[0_16px_36px_rgba(96,0,0,0.2)] hover:shadow-xl"
                      : featured
                        ? "border-[var(--brand-gold)]/50 bg-[var(--brand-maroon-dark)] text-white shadow-[0_16px_36px_rgba(96,0,0,0.22)]"
                        : "border-border/80 bg-[var(--surface-elevated)] text-heading shadow-sm hover:border-brand/30 hover:shadow-md"
                  } ${featured && c.photo ? "lg:min-h-[22rem]" : ""}`}
                >
                  {c.photo ? (
                    <>
                      <img
                        src={c.photo.src}
                        alt=""
                        aria-hidden
                        loading={i === 0 ? "eager" : "lazy"}
                        className={`absolute inset-0 -z-20 h-full w-full object-cover ${
                          featured ? "rkps-ken" : ""
                        }`}
                      />
                      <div
                        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/35 to-black/10"
                        aria-hidden
                      />
                      <div
                        className="pointer-events-none absolute inset-x-0 top-0 h-20 -z-10 bg-gradient-to-b from-black/40 to-transparent"
                        aria-hidden
                      />
                    </>
                  ) : null}
                  <div className="relative z-10 flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-extrabold ${
                          c.photo || featured
                            ? "bg-[var(--brand-gold)] text-[var(--brand-on-gold)]"
                            : "bg-brand/10 text-brand"
                        }`}
                      >
                        {c.num}
                      </span>
                      <span
                        className={`text-sm font-bold transition group-hover:translate-x-1 ${
                          c.photo || featured ? "text-[var(--brand-gold)]" : "text-brand"
                        }`}
                      >
                        →
                      </span>
                    </div>
                    <h3
                      className={`rkps-display mt-4 font-bold tracking-tight [text-wrap:balance] ${
                        c.photo || featured
                          ? "text-xl text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.45)] sm:text-2xl lg:text-3xl"
                          : "text-xl text-heading group-hover:text-brand sm:text-2xl"
                      } ${featured && c.photo ? "lg:text-4xl" : ""}`}
                    >
                      {c.title}
                    </h3>
                    {c.body ? (
                      <p
                        className={`mt-2 text-sm leading-relaxed ${
                          c.photo || featured ? "text-white/88" : "text-muted"
                        }`}
                      >
                        {c.body}
                      </p>
                    ) : null}
                  </div>
                  <p
                    className={`mt-6 text-xs font-bold uppercase tracking-wider ${
                      c.photo || featured ? "text-[var(--brand-gold)]" : "text-brand"
                    }`}
                  >
                    {c.cta} ↗
                  </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        {notes && notes.length > 0 ? (
          <div className="mt-12 rounded-3xl border border-border/80 bg-[var(--surface-muted)] p-6 sm:p-8 lg:p-10">
            <p className="text-xs font-bold uppercase tracking-wider text-brand">{notesTitle ?? "Why Families Choose RMPS"}</p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {notes.map((note) => (
                <li key={note.title} className="rounded-2xl border border-white/80 bg-white/90 p-5 shadow-sm">
                  <span className="text-base text-brand font-bold">✓</span>
                  <p className="mt-2 text-sm font-bold text-heading">{note.title}</p>
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
      ? "border-y border-border/80 bg-white"
      : tone === "inset"
        ? "bg-[var(--surface-muted)]"
        : "bg-[var(--surface-elevated)]";
  return (
    <section id={id} className={`relative isolate scroll-mt-28 overflow-x-clip py-14 sm:py-20 lg:py-24 ${toneClass} ${className}`}>
      <div className="relative mx-auto max-w-7xl rkps-page-x">{children}</div>
    </section>
  );
}

/** Sticky split layout helper */
export function RkpsStickySplitLayout({
  aside,
  main,
  decoration,
  asideWrapperClassName = "",
}: {
  aside: ReactNode;
  main: ReactNode;
  decoration?: ReactNode;
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

/** Sticky in-page section shortcuts */
export function RkpsQuickJumpNav({
  links,
}: {
  links: readonly { href: string; label: string; highlight?: boolean }[];
}) {
  return (
    <nav
      className="sticky top-16 z-30 border-b border-border/70 bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(96,0,0,0.06)] sm:top-[4.5rem]"
      aria-label="Jump to section"
    >
      <div className="mx-auto max-w-7xl rkps-page-x py-3 sm:py-3.5">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-4">
          <p className="rkps-text-label shrink-0 text-xs">On this page</p>
          <div className="relative min-w-0 flex-1">
            <div className="flex gap-x-4 gap-y-2 overflow-x-auto pb-0.5 scrollbar-none sm:flex-wrap sm:overflow-visible">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`shrink-0 py-1 text-sm transition-colors ${
                    link.highlight
                      ? "text-[var(--brand-maroon)] underline decoration-[var(--brand-gold)] decoration-2 underline-offset-4"
                      : "text-[var(--rkps-text-body)] hover:text-[var(--rkps-primary-light)]"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

/** Theme / category filters — matches gallery & campus programme tabs */
export function RkpsFilterTabs<T extends string>({
  label,
  options,
  active,
  onSelect,
  trailing,
}: {
  label: string;
  options: readonly T[];
  active: T;
  onSelect: (value: T) => void;
  trailing?: ReactNode;
}) {
  return (
    <div className="mt-8 rounded-2xl border border-border/80 bg-white p-3 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label={label}
          className="flex min-w-0 flex-wrap gap-2"
        >
          {options.map((option) => {
            const selected = active === option;
            return (
              <button
                key={option}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => onSelect(option)}
                className={`rounded-xl border px-3.5 py-2 text-left text-sm transition sm:px-4 ${
                  selected
                    ? "border-brand/35 bg-brand/5 font-medium text-heading"
                    : "border-border/80 bg-[var(--surface-elevated)] text-muted hover:border-brand/25 hover:text-heading"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
        {trailing ? <div className="shrink-0 text-xs text-muted">{trailing}</div> : null}
      </div>
    </div>
  );
}

export function RkpsDestinationLinks({
  items,
}: {
  items: readonly { href: string; label: string; title: string; description: string }[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-white p-5 shadow-[0_12px_32px_rgb(143_1_3_/_0.05)] transition hover:border-brand/30"
        >
          <div>
            <p className="rkps-text-label-soft text-xs">{item.label}</p>
            <h3 className="rkps-display mt-2 text-lg text-heading group-hover:text-[var(--rkps-primary-light)]">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
          </div>
          <span className="mt-4 text-sm font-medium text-[var(--rkps-primary-light)]">Continue →</span>
        </Link>
      ))}
    </div>
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
      {tag ? (
        <span className="inline-flex w-fit items-center rounded-full border border-[var(--brand-gold)]/40 bg-[var(--brand-gold)]/15 px-3 py-0.5 text-[0.6875rem] font-bold uppercase tracking-wider text-brand">
          {tag}
        </span>
      ) : null}
      <h3 className="rkps-display mt-3 text-xl font-bold tracking-tight text-heading sm:text-2xl">{title}</h3>
      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted sm:text-base">{body}</p>
      {cta ? <p className="mt-5 text-sm font-bold text-brand">{cta} ↗</p> : null}
    </>
  );
  const className =
    "group flex h-full flex-col rounded-3xl border border-border/80 bg-white p-6 sm:p-8 shadow-sm transition hover:-translate-y-1 hover:border-brand/30 hover:shadow-md";
  if (href) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    );
  }
  return <article className={className}>{inner}</article>;
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
      <section id={vision.id} className="scroll-mt-28 relative isolate overflow-hidden bg-[var(--brand-maroon-dark)] text-white">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/marketing/vision-chalkboard-banner.png')" }}
          aria-hidden
        />
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[var(--brand-maroon-dark)] via-[var(--brand-maroon-dark)]/90 to-[var(--brand-maroon-dark)]/70" aria-hidden />

        <div className="relative z-[2] mx-auto max-w-7xl rkps-page-x py-16 sm:py-20 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex rounded-full border border-[var(--brand-gold)]/40 bg-[var(--brand-gold)]/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--brand-gold)]">
                Our Vision & Foundation
              </span>
              <p className="text-sm font-semibold text-[var(--brand-gold)] sm:text-base">{vision.kicker}</p>
              <h2 className="rkps-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {vision.title}
              </h2>
              <p className="text-lg font-bold text-white/95 sm:text-xl">{vision.subtitle}</p>
              <p className="max-w-[65ch] text-sm leading-relaxed text-white/85 sm:text-base">{vision.body}</p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href={vision.href}
                  className="rkps-btn-gold text-xs sm:text-sm"
                >
                  {vision.cta} ↗
                </Link>
                <Link
                  href="/#academics"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white backdrop-blur-md hover:bg-white/20 transition"
                >
                  Learning Journey ›
                </Link>
              </div>
            </div>

            <aside className="lg:col-span-5" aria-label="School at a glance">
              <div className="rounded-3xl border border-white/20 bg-white/10 p-6 sm:p-8 backdrop-blur-lg shadow-2xl space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-gold)]">{motto}</p>
                <p className="text-xl font-bold text-white">{schoolName}</p>
                <ul className="space-y-3.5 border-t border-white/15 pt-4 text-xs sm:text-sm text-white/90">
                  <li className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-gold)] text-[0.6875rem] font-black text-[var(--brand-maroon-dark)]">
                      01
                    </span>
                    <span>Curious learners nurtured through thoughtful questions and hands-on inquiry every day.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-gold)] text-[0.6875rem] font-black text-[var(--brand-maroon-dark)]">
                      02
                    </span>
                    <span>An inclusive environment where character, empathy, and integrity take center stage.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-gold)] text-[0.6875rem] font-black text-[var(--brand-maroon-dark)]">
                      03
                    </span>
                    <span>A dedicated educator team celebrating individual effort and meaningful progress.</span>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <RkpsPageSection id={values.id} tone="paper">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <RkpsSectionIntro
            num="Core Principles"
            title="Small moments. Meaningful beginnings."
            description="What guides every classroom, corridor, and conversation at RMPS."
          />
          <div className="flex shrink-0 flex-wrap gap-2.5">
            <Link href="/#academics" className="rkps-btn-navy text-xs sm:text-sm">
              Explore Academics
            </Link>
            <Link href="/#admissions" className="rkps-btn-gold text-xs sm:text-sm">
              Admission Enquiry
            </Link>
          </div>
        </div>

        <ol className="mt-8 grid gap-5 md:grid-cols-3">
          {values.items.map((v, i) => {
            const isFeatured = i === values.items.length - 1;
            return (
              <li key={v.title}>
                <article
                  className={`flex h-full flex-col justify-between rounded-3xl border p-6 sm:p-8 transition duration-300 hover:-translate-y-1 ${
                    isFeatured
                      ? "border-[var(--brand-gold)]/40 bg-gradient-to-br from-[var(--brand-maroon-dark)] to-[var(--brand-maroon)] text-white shadow-xl"
                      : "border-border/80 bg-[var(--surface-elevated)] text-heading shadow-sm hover:border-brand/30"
                  }`}
                >
                  <div>
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-black ${
                        isFeatured ? "bg-[var(--brand-gold)] text-[var(--brand-maroon-dark)]" : "bg-brand/10 text-brand"
                      }`}
                    >
                      0{i + 1}
                    </span>
                    <p className={`mt-4 text-xs font-bold uppercase tracking-wider ${
                      isFeatured ? "text-[var(--brand-gold)]" : "text-brand"
                    }`}>
                      {i === 0 ? "Inquiry" : i === 1 ? "Character" : "Growth"}
                    </p>
                    <h3 className={`rkps-display mt-1 text-xl font-bold tracking-tight ${
                      isFeatured ? "text-white" : "text-heading"
                    }`}>
                      {v.title}
                    </h3>
                    <p className={`mt-2.5 text-sm leading-relaxed ${
                      isFeatured ? "text-white/85" : "text-muted"
                    }`}>
                      {v.body}
                    </p>
                  </div>
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
        <RkpsSectionIntro num="Official Noticeboard" title={title} description={subtitle} />
        <nav className="flex shrink-0 flex-wrap gap-2" aria-label="Noticeboard shortcuts">
          <Link
            href="/login"
            className="rkps-btn-navy rkps-btn-sm"
          >
            Portal Login
          </Link>
          <Link
            href="/school-life/events"
            className="rkps-btn-secondary rkps-btn-sm"
          >
            Events calendar
          </Link>
        </nav>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:items-start">
        {featured ? (
          <article className="rounded-3xl border border-brand/20 bg-gradient-to-br from-white to-[#f4f8fe] p-6 sm:p-8 shadow-md lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-700">
                <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-ping" />
                Latest Circular
              </span>
              <time dateTime={featured.date} className="text-xs font-semibold text-muted">
                {formatNoticeDate(featured.date)}
              </time>
            </div>
            <h3 className="rkps-display text-xl font-bold tracking-tight text-heading sm:text-2xl">
              {featured.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted sm:text-base">
              {featured.excerpt}
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:underline"
              >
                <span>Read Full Document in Portal</span>
                <span>→</span>
              </Link>
            </div>
          </article>
        ) : null}

        <ul className={`space-y-3 ${featured ? "lg:col-span-5" : "lg:col-span-12"}`}>
          {rest.map((n) => (
            <li
              key={n.id}
              className="rounded-2xl border border-border/80 bg-white p-4 sm:p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand/30 hover:shadow"
            >
              <div className="flex items-center justify-between">
                <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-brand">Announcement</span>
                <time dateTime={n.date} className="text-xs text-muted">
                  {formatNoticeDate(n.date)}
                </time>
              </div>
              <p className="mt-1 font-bold text-heading text-sm sm:text-base">{n.title}</p>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{n.excerpt}</p>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-6 text-xs text-muted leading-relaxed">{emptyNote}</p>
    </RkpsPageSection>
  );
}
