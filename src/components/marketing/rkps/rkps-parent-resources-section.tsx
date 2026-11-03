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
      className={`rkps-ease rkps-press group flex h-full flex-col overflow-hidden rounded-[1.25rem] border shadow-[var(--shadow-card)] hover:-translate-y-0.5 ${
        featured
          ? "border-brand/30 bg-brand text-white"
          : "border-border/80 bg-surface hover:border-brand/25"
      }`}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--brand-maroon-dark)]">
        <img
          src={photo.src}
          alt={photo.alt}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className={`text-[0.6875rem] font-bold uppercase tracking-[0.12em] ${featured ? "text-[var(--brand-gold)]" : "text-brand"}`}>
          {item.tag}
        </p>
        <h3 className={`rkps-display mt-2 text-lg font-semibold ${featured ? "text-white" : "text-heading group-hover:text-brand"}`}>
          {item.title}
        </h3>
        <p className={`mt-2 flex-1 text-sm leading-relaxed ${featured ? "text-white/90" : "text-muted"}`}>{item.body}</p>
        <p className={`mt-4 text-sm font-semibold ${featured ? "text-[var(--brand-gold)]" : "text-brand"}`}>{item.cta} ↗</p>
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
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <RkpsSectionIntro num={kicker} title={title} description={lead} />
        <nav className="flex shrink-0 flex-wrap gap-2" aria-label="Parent resource shortcuts">
          <Link
            href="/#noticeboard"
            className="rkps-ease rounded-full border border-border/80 bg-surface px-4 py-1.5 text-xs font-semibold text-brand hover:border-brand/30 hover:bg-brand/5"
          >
            Noticeboard
          </Link>
          <Link
            href="/#faq"
            className="rkps-ease rounded-full border border-border/80 bg-surface px-4 py-1.5 text-xs font-semibold text-brand hover:border-brand/30 hover:bg-brand/5"
          >
            FAQ
          </Link>
          <Link
            href="/login"
            className="rkps-ease rkps-press rounded-full bg-brand px-4 py-1.5 text-xs font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] hover:brightness-105"
          >
            Portal login
          </Link>
        </nav>
      </div>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Documents and links available from the school">
        {hints.map((hint, i) => (
          <li key={hint} className="rounded-xl border border-border/80 bg-surface px-4 py-3">
            <p className="text-[0.6875rem] font-bold tabular-nums text-brand">{String(i + 1).padStart(2, "0")}</p>
            <p className="mt-1 text-sm font-medium leading-snug text-heading">{hint}</p>
          </li>
        ))}
      </ul>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {resourceCards.map((item, index) => {
          const photo = photos[index] ?? photos[0];
          if (!photo) return null;
          return <ParentResourceCard key={item.id} item={item} photo={photo} featured={index === resourceCards.length - 1} />;
        })}
      </div>
      <p className="mt-5 text-xs leading-relaxed text-muted">
        {aside}{" "}
        <a href={INSTAGRAM_PROFILE} target="_blank" rel="noreferrer" className="font-semibold text-brand hover:underline">
          @r.k.m.p.s ↗
        </a>
      </p>
    </RkpsPageSection>
  );
}
