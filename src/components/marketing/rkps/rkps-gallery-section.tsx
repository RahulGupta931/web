"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { RkpsPageSection } from "@/components/marketing/rkps/rkps-marketing-blocks";
import { RkpsInView } from "@/components/marketing/rkps/rkps-motion-sections";
import { INSTAGRAM_PROFILE } from "@/content/website/instagram-media";

type Photo = { src: string; alt: string };

const GALLERY_VISIBLE = 9;

function photoMatchesTab(alt: string, tab: string): boolean {
  if (tab === "All moments") return true;
  const a = alt.toLowerCase();
  if (tab === "Arts & culture") {
    return /dance|dussehra|cultural|traditional|performance|celebration|programme|stage|costume|function|festival/.test(a);
  }
  if (tab === "Sports & play") {
    return /sport|cricket|athletic|field|team game|playground|match|tournament/.test(a);
  }
  if (tab === "Learning") {
    return /learning|class|science|read|study|quiz|lab|lesson|assembly|hall|together|teachers/.test(a);
  }
  return true;
}

/** Mosaic cell placement on a 12×4 grid (desktop). */
function mosaicCellClass(index: number): string {
  const base = "relative min-h-0 overflow-hidden rounded-2xl border border-border/60 bg-[var(--surface-muted)] lg:rounded-[1.25rem]";
  const mobile =
    index === 0
      ? "col-span-2 row-span-2 min-h-[15rem] sm:min-h-[18rem]"
      : "min-h-[9rem] sm:min-h-[10.5rem]";
  const desktop = (() => {
    switch (index) {
      case 0:
        return "lg:col-span-7 lg:row-span-2 lg:col-start-1 lg:row-start-1 lg:min-h-0 lg:h-full";
      case 1:
        return "lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:min-h-0 lg:h-full";
      case 2:
        return "lg:col-span-5 lg:col-start-8 lg:row-start-2 lg:min-h-0 lg:h-full";
      case 3:
        return "lg:col-span-4 lg:col-start-1 lg:row-start-3 lg:min-h-0 lg:h-full";
      case 4:
        return "lg:col-span-4 lg:col-start-5 lg:row-start-3 lg:min-h-0 lg:h-full";
      case 5:
        return "lg:col-span-4 lg:col-start-9 lg:row-start-3 lg:min-h-0 lg:h-full";
      case 6:
        return "lg:col-span-4 lg:col-start-1 lg:row-start-4 lg:min-h-0 lg:h-full";
      case 7:
        return "lg:col-span-4 lg:col-start-5 lg:row-start-4 lg:min-h-0 lg:h-full";
      case 8:
        return "lg:col-span-4 lg:col-start-9 lg:row-start-4 lg:min-h-0 lg:h-full";
      default:
        return "lg:col-span-4 lg:min-h-0 lg:h-full";
    }
  })();
  return `${base} ${mobile} ${desktop}`;
}

function GalleryTile({
  photo,
  index,
  priority,
}: {
  photo: Photo;
  index: number;
  priority?: boolean;
}) {
  const featured = index === 0;
  return (
    <figure className={`group ${mosaicCellClass(index)}`} style={{ ["--rkps-i" as string]: index }}>
      <img
        src={photo.src}
        alt={photo.alt}
        className="absolute inset-0 h-full w-full object-cover transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:brightness-105"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/5"
        aria-hidden
      />
      <figcaption
        className={`absolute inset-x-0 bottom-0 text-white ${
          featured ? "p-4 sm:p-5" : "p-3 sm:p-3.5"
        }`}
      >
        {featured ? (
          <div className="max-w-md rounded-xl border border-white/10 bg-black/40 px-3.5 py-3 backdrop-blur-sm sm:px-4 sm:py-3.5">
            <p className="text-sm leading-snug sm:text-base">
              <span className="line-clamp-3">{photo.alt}</span>
            </p>
          </div>
        ) : (
          <p className="text-xs leading-snug text-white/90 sm:text-[0.8125rem]">
            <span className="line-clamp-2">{photo.alt}</span>
          </p>
        )}
      </figcaption>
    </figure>
  );
}

function ThemeTabs({
  tabs,
  activeTab,
  onSelect,
  className = "",
  layout = "column",
}: {
  tabs: readonly string[];
  activeTab: string;
  onSelect: (tab: string) => void;
  className?: string;
  layout?: "column" | "row";
}) {
  return (
    <div
      role="tablist"
      aria-label="Gallery themes"
      className={
        layout === "row"
          ? `flex gap-2 overflow-x-auto pb-1 scrollbar-none ${className}`
          : `flex flex-col gap-1 ${className}`
      }
    >
      {tabs.map((tab) => {
        const active = activeTab === tab;
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(tab)}
            className={
              layout === "row"
                ? `shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${
                    active
                      ? "bg-[var(--brand-maroon-dark)] text-white"
                      : "border border-border/80 bg-white text-heading hover:border-brand/30"
                  }`
                : `w-full rounded-xl px-4 py-2.5 text-left text-sm transition-colors ${
                    active
                      ? "bg-white font-medium text-heading shadow-sm ring-1 ring-border/80"
                      : "text-muted hover:bg-white/80 hover:text-heading"
                  }`
            }
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}

export function RkpsGallerySection({
  id,
  title,
  subtitle,
  tabs,
  cta,
  ctaHref,
  disclaimer,
  photos,
  accentPhoto,
}: {
  id: string;
  title: string;
  subtitle: string;
  tabs: readonly string[];
  cta: string;
  ctaHref: string;
  disclaimer: string;
  photos: readonly Photo[];
  accentPhoto: Photo;
}) {
  const [activeTab, setActiveTab] = useState(tabs[0] ?? "All moments");
  const filtered = useMemo(
    () => photos.filter((p) => photoMatchesTab(p.alt, activeTab)),
    [photos, activeTab],
  );
  const pool = filtered.length > 0 ? filtered : photos;
  const visible = pool.slice(0, GALLERY_VISIBLE);
  const themeLabel = activeTab === "All moments" ? "Everyday campus life" : activeTab;

  const accentStrip = useMemo(() => {
    const rest = photos.filter((p) => p.src !== accentPhoto.src).slice(0, 2);
    return [accentPhoto, ...rest];
  }, [photos, accentPhoto]);

  return (
    <RkpsPageSection id={id} tone="inset">
      <RkpsInView>
        <div className="overflow-hidden rounded-[1.75rem] border border-border/80 bg-white shadow-[0_24px_60px_rgba(96,0,0,0.07)] sm:rounded-[2rem]">
          <div className="grid lg:grid-cols-12 lg:items-stretch">
            {/* Mosaic — photos first on small screens */}
            <div className="order-1 min-w-0 rkps-bg-inset-panel p-5 sm:p-7 lg:order-2 lg:col-span-8 lg:p-8">
              <div className="mb-5 flex flex-col gap-4 border-b border-border/50 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <p className="rkps-text-label-soft text-xs">
                    {themeLabel}
                    <span className="mx-2 text-border">·</span>
                    <span className="tabular-nums">{visible.length} of {pool.length}</span>
                  </p>
                  <p className="rkps-display mt-1 text-xl text-heading sm:text-2xl">Campus gallery</p>
                </div>
                <Link
                  href="/school-life/student-achievers"
                  className="shrink-0 text-sm text-brand underline decoration-brand/25 underline-offset-4 transition-colors hover:decoration-brand"
                >
                  Student achievers
                </Link>
              </div>

              <ThemeTabs
                tabs={tabs}
                activeTab={activeTab}
                onSelect={setActiveTab}
                layout="row"
                className="mb-4 lg:hidden"
              />

              <div
                className="rkps-stagger grid grid-cols-2 gap-2.5 sm:gap-3 lg:h-[40rem] lg:grid-cols-12 lg:grid-rows-4 lg:gap-3"
                role="tabpanel"
                aria-label={`Gallery: ${activeTab}`}
              >
                {visible.map((photo, i) => (
                  <GalleryTile key={`${photo.src}-${activeTab}`} photo={photo} index={i} priority={i === 0} />
                ))}
              </div>
            </div>

            {/* Intro + filters */}
            <aside className="order-2 flex flex-col border-t border-border/70 bg-[var(--surface-elevated)] p-6 sm:p-8 lg:order-1 lg:col-span-4 lg:border-t-0 lg:border-r lg:p-10">
              <span className="rkps-rule" aria-hidden="true" />
              <p className="rkps-text-label mt-4 text-xs">Campus Life · Gallery</p>
              <h2 className="rkps-display mt-2 text-[1.75rem] leading-tight text-heading [text-wrap:balance] sm:text-3xl">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{subtitle}</p>
              <p className="mt-2 text-sm text-muted">
                Follow{" "}
                <a
                  href={INSTAGRAM_PROFILE}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-brand hover:underline"
                >
                  @r.k.m.p.s
                </a>{" "}
                for live stories from campus.
              </p>

              <div className="mt-8 hidden lg:grid lg:grid-cols-3 lg:gap-2">
                {accentStrip.map((photo) => (
                  <figure
                    key={photo.src}
                    className="relative aspect-square overflow-hidden rounded-xl border border-border/70 bg-white"
                  >
                    <img src={photo.src} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" aria-hidden />
                  </figure>
                ))}
              </div>
              <p className="mt-2 hidden text-[0.6875rem] leading-snug text-muted lg:block">
                <span className="line-clamp-2">{accentPhoto.alt}</span>
              </p>

              <div className="mt-8 hidden lg:block">
                <p className="rkps-text-label-soft text-xs">Browse by theme</p>
                <div className="mt-3 overflow-hidden rounded-2xl border border-border/80 bg-[var(--surface-muted)] p-1.5">
                  <ThemeTabs tabs={tabs} activeTab={activeTab} onSelect={setActiveTab} layout="column" />
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link href={ctaHref} className="rkps-btn-navy rkps-btn-sm w-full justify-center text-center">
                  {cta}
                </Link>
                <a
                  href={INSTAGRAM_PROFILE}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center py-2.5 text-sm text-brand underline decoration-brand/25 underline-offset-4 transition-colors hover:decoration-brand"
                >
                  @r.k.m.p.s on Instagram
                </a>
              </div>

              <p className="mt-6 text-xs leading-relaxed text-muted lg:mt-auto lg:pt-8">{disclaimer}</p>
            </aside>
          </div>
        </div>
      </RkpsInView>
    </RkpsPageSection>
  );
}
