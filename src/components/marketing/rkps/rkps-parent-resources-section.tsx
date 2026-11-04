import Link from "next/link";
import { INSTAGRAM_PROFILE } from "@/content/website/instagram-media";
import { RkpsPageSection, RkpsSectionIntro } from "@/components/marketing/rkps/rkps-marketing-blocks";

type Photo = { src: string; alt: string };

export type ResourceCardItem = {
  id: string;
  tag: string;
  title: string;
  body: string;
  cta: string;
  href: string;
};

function ParentResourceCard({
  item,
  photo,
  featured,
}: {
  item: ResourceCardItem;
  photo: Photo;
  featured?: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={`group flex h-full flex-col overflow-hidden rounded-3xl border transition duration-300 hover:-translate-y-1 ${
        featured
          ? "border-[var(--brand-gold)]/40 bg-gradient-to-br from-[var(--brand-maroon-dark)] to-[var(--brand-maroon)] text-white shadow-xl"
          : "border-border/80 bg-white text-heading shadow-sm hover:border-brand/40 hover:shadow-md"
      }`}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
        <img
          src={photo.src}
          alt={photo.alt}
          className="h-full w-full object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <span className={`absolute bottom-3 left-3 rounded-full px-2.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider ${
          featured ? "bg-[var(--brand-gold)] text-[var(--brand-maroon-dark)]" : "bg-white/90 text-brand backdrop-blur-md"
        }`}>
          {item.tag}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className={`rkps-display text-lg font-bold ${
          featured ? "text-white" : "text-heading group-hover:text-brand"
        }`}>
          {item.title}
        </h3>
        <p className={`mt-2 flex-1 text-xs sm:text-sm leading-relaxed ${
          featured ? "text-white/85" : "text-muted"
        }`}>
          {item.body}
        </p>
        <span className={`mt-4 inline-flex items-center gap-1 text-xs font-bold ${
          featured ? "text-[var(--brand-gold)]" : "text-brand"
        }`}>
          <span>{item.cta}</span>
          <span className="transition group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}

export function RkpsParentResourcesSection({
  id = "parent-resources",
  kicker,
  title,
  lead,
  aside,
  hints,
  resourceCards,
  photos,
}: {
  id?: string;
  kicker: string;
  title: string;
  lead: string;
  aside: string;
  hints: readonly string[];
  resourceCards: readonly ResourceCardItem[];
  photos: readonly Photo[];
}) {
  return (
    <RkpsPageSection id={id} tone="paper">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <RkpsSectionIntro num={kicker} title={title} description={lead} />
        <nav className="flex shrink-0 flex-wrap gap-2" aria-label="Parent resource shortcuts">
          <Link
            href="/#noticeboard"
            className="rounded-full border border-border/80 bg-white px-3.5 py-1.5 text-xs font-semibold text-brand hover:border-brand/40 hover:bg-brand/5 transition"
          >
            Noticeboard
          </Link>
          <Link
            href="/#faq"
            className="rounded-full border border-border/80 bg-white px-3.5 py-1.5 text-xs font-semibold text-brand hover:border-brand/40 hover:bg-brand/5 transition"
          >
            FAQ
          </Link>
          <Link
            href="/login"
            className="rkps-btn-navy text-xs px-4 py-1.5"
          >
            Portal Login
          </Link>
        </nav>
      </div>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Documents and links available from the school">
        {hints.map((hint, i) => (
          <li key={hint} className="rounded-2xl border border-border/80 bg-[var(--surface-elevated)] p-4 shadow-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand/10 text-xs font-extrabold text-brand">
              0{i + 1}
            </span>
            <p className="mt-2 text-xs sm:text-sm font-semibold leading-snug text-heading">{hint}</p>
          </li>
        ))}
      </ul>

      <div className="mt-8 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {resourceCards.map((item, index) => {
          const photo = photos[index] ?? photos[0];
          if (!photo) return null;
          return (
            <div key={item.id}>
              <ParentResourceCard item={item} photo={photo} featured={index === 0} />
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-border/70 pt-6">
        <p className="text-xs text-muted leading-relaxed">{aside}</p>
        <a
          href={INSTAGRAM_PROFILE}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 text-xs font-bold text-brand hover:underline"
        >
          Follow @r.k.m.p.s on Instagram ↗
        </a>
      </div>
    </RkpsPageSection>
  );
}
