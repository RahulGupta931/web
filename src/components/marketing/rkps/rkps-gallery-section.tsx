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

function galleryMosaicClass(index: number): string {
  if (index === 0) return "col-span-2 row-span-2 sm:col-span-2 sm:row-span-2 lg:col-span-7 lg:row-span-2 lg:col-start-1 lg:row-start-1";
  if (index === 1) return "col-span-1 lg:col-span-5 lg:col-start-8 lg:row-start-1";
  if (index === 2) return "col-span-1 lg:col-span-5 lg:col-start-8 lg:row-start-2";
  if (index === 3) return "col-span-1 lg:col-span-4 lg:col-start-1 lg:row-start-3";
  if (index === 4) return "col-span-1 lg:col-span-4 lg:col-start-5 lg:row-start-3";
  if (index === 5) return "col-span-2 sm:col-span-1 lg:col-span-4 lg:col-start-9 lg:row-start-3";
  if (index === 6) return "col-span-1 lg:col-span-4 lg:col-start-1 lg:row-start-4";
  if (index === 7) return "col-span-1 lg:col-span-4 lg:col-start-5 lg:row-start-4";
  if (index === 8) return "col-span-2 sm:col-span-1 lg:col-span-4 lg:col-start-9 lg:row-start-4";
  return "lg:col-span-4";
}

function GalleryTile({ photo, index, priority }: { photo: Photo; index: number; priority?: boolean }) {
  const isHero = index === 0;
  return (
    <figure
      className={`group relative overflow-hidden rounded-2xl border border-border/70 bg-surface shadow-sm lg:rounded-3xl ${galleryMosaicClass(index)} ${
        isHero ? "min-h-[14rem] sm:min-h-[18rem] lg:min-h-[22rem]" : "min-h-[8.5rem] sm:min-h-[10rem] lg:min-h-[11rem]"
      }`}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        className={`absolute inset-0 h-full w-full object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${
          isHero ? "rkps-ken" : ""
        }`}
        loading={priority ? "eager" : "lazy"}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-85 transition duration-300 group-hover:opacity-100"
        aria-hidden
      />
      <figcaption className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
        {isHero ? (
          <div className="rounded-xl border border-white/15 bg-black/45 p-3 backdrop-blur-md sm:p-3.5">
            <p className="text-xs font-semibold leading-snug text-white sm:text-sm">
              <span className="line-clamp-3">{photo.alt}</span>
            </p>
          </div>
        ) : (
          <p className="text-[0.6875rem] font-medium leading-snug text-white/95 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] sm:text-xs">
            <span className="line-clamp-2">{photo.alt}</span>
          </p>
        )}
      </figcaption>
    </figure>
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

  return (
    <RkpsPageSection id={id} tone="inset">
      <RkpsInView>
        <div className="overflow-hidden rounded-[1.75rem] border border-border/80 bg-white shadow-[0_24px_60px_rgba(96,0,0,0.07)] sm:rounded-[2rem]">
          <div className="grid lg:grid-cols-12 lg:items-stretch">
            <aside className="flex flex-col border-b border-border/70 bg-[var(--surface-elevated)] p-6 sm:p-8 lg:col-span-4 lg:border-b-0 lg:border-r lg:p-10">
              <span className="block h-1.5 w-12 rounded-full bg-[var(--brand-gold)]" aria-hidden="true" />
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-brand">Campus Life · Gallery</p>
              <h2 className="rkps-display mt-2 text-2xl font-bold tracking-tight text-heading [text-wrap:balance] sm:text-3xl">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                {subtitle} Follow{" "}
                <a href={INSTAGRAM_PROFILE} target="_blank" rel="noreferrer" className="font-semibold text-brand hover:underline">
                  @r.k.m.p.s
                </a>{" "}
                for live stories and daily highlights.
              </p>

              <figure className="relative mt-6 hidden overflow-hidden rounded-2xl border border-border/80 shadow-md lg:block">
                <img src={accentPhoto.src} alt={accentPhoto.alt} className="aspect-[4/3] w-full object-cover" loading="lazy" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" aria-hidden />
                <figcaption className="absolute inset-x-0 bottom-0 p-3 text-[0.6875rem] font-medium leading-snug text-white">
                  <span className="line-clamp-2">{accentPhoto.alt}</span>
                </figcaption>
              </figure>

              <div className="mt-8">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-muted">Browse by theme</p>
                  <p className="text-[0.6875rem] font-semibold tabular-nums text-muted">
                    {visible.length}/{pool.length}
                  </p>
                </div>
                <div
                  role="tablist"
                  aria-label="Gallery themes"
                  className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:gap-1.5"
                >
                  {tabs.map((tab) => {
                    const active = activeTab === tab;
                    return (
                      <button
                        key={tab}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setActiveTab(tab)}
                        className={`rkps-pill-tab w-full shrink-0 justify-start text-left lg:rounded-xl lg:px-4 lg:py-2.5 ${
                          active
                            ? "border-transparent bg-[var(--brand-maroon-dark)] text-white shadow-md"
                            : "border border-border/80 bg-white text-heading hover:border-brand/40 hover:text-brand"
                        }`}
                      >
                        <span>{tab}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-2.5 sm:flex-row lg:flex-col">
                <Link href={ctaHref} className="rkps-btn-navy w-full justify-center text-center text-xs sm:text-sm">
                  {cta} ↗
                </Link>
                <a
                  href={INSTAGRAM_PROFILE}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-full border border-border/80 bg-white px-4 py-2.5 text-xs font-semibold text-brand transition hover:border-brand/40 hover:bg-brand/5 sm:text-sm"
                >
                  @r.k.m.p.s on Instagram
                </a>
              </div>

              <p className="mt-6 text-xs leading-relaxed text-muted lg:mt-auto lg:pt-6">{disclaimer}</p>
            </aside>

            <div className="min-w-0 bg-[var(--background)] p-6 sm:p-8 lg:col-span-8 lg:p-8">
              <div className="mb-5 flex flex-col gap-1 border-b border-border/60 pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-muted">Campus mosaic</p>
                  <p className="mt-0.5 text-sm font-semibold text-heading">
                    {activeTab === "All moments" ? "A snapshot of life at RMPS" : activeTab}
                  </p>
                </div>
                <Link
                  href="/school-life/student-achievers"
                  className="text-xs font-semibold text-brand transition hover:text-[var(--brand-maroon-dark)]"
                >
                  Student achievers →
                </Link>
              </div>

              <div
                className="rkps-stagger grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12 lg:gap-4"
                role="tabpanel"
                aria-label={`Gallery: ${activeTab}`}
              >
                {visible.map((photo, i) => (
                  <GalleryTile key={`${photo.src}-${activeTab}`} photo={photo} index={i} priority={i === 0} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </RkpsInView>
    </RkpsPageSection>
  );
}
