"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { RkpsPageSection, RkpsSectionIntro } from "@/components/marketing/rkps/rkps-marketing-blocks";
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

/** Mosaic spans inside a 12-column gallery grid (desktop). */
function galleryMosaicClass(index: number): string {
  if (index === 0) return "col-span-2 row-span-2 sm:col-span-2 sm:row-span-2 lg:col-span-7 lg:row-span-2 lg:col-start-1 lg:row-start-1";
  if (index === 1) return "lg:col-span-5 lg:col-start-8 lg:row-start-1";
  if (index === 2) return "lg:col-span-5 lg:col-start-8 lg:row-start-2";
  if (index === 3) return "lg:col-span-4 lg:col-start-1 lg:row-start-3";
  if (index === 4) return "lg:col-span-4 lg:col-start-5 lg:row-start-3";
  if (index === 5) return "lg:col-span-4 lg:col-start-9 lg:row-start-3";
  if (index === 6) return "lg:col-span-4 lg:col-start-1 lg:row-start-4";
  if (index === 7) return "lg:col-span-4 lg:col-start-5 lg:row-start-4";
  if (index === 8) return "lg:col-span-4 lg:col-start-9 lg:row-start-4";
  return "lg:col-span-4";
}

function GalleryTile({ photo, index, priority }: { photo: Photo; index: number; priority?: boolean }) {
  const isHero = index === 0;
  return (
    <figure
      className={`group relative overflow-hidden rounded-[1rem] border border-border/80 bg-surface shadow-[var(--rkps-shadow-diffuse,var(--shadow-card))] ${galleryMosaicClass(index)} ${
        isHero ? "min-h-[12rem] lg:min-h-[20rem]" : "min-h-[7.5rem] lg:min-h-[9.75rem]"
      }`}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        className={`absolute inset-0 h-full w-full object-cover transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] ${isHero ? "rkps-ken" : ""}`}
        loading={priority ? "eager" : "lazy"}
      />
      <div className="pointer-events-none absolute inset-0 bg-black/50 opacity-80 lg:opacity-0 lg:transition-opacity lg:duration-300 lg:group-hover:opacity-100" />
      <figcaption className="absolute inset-x-0 bottom-0 p-3 text-xs leading-snug text-white lg:translate-y-1 lg:opacity-0 lg:transition lg:duration-300 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
        <span className="line-clamp-2">{photo.alt}</span>
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
  accentPhoto: _unusedAccentPhoto,
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
  void _unusedAccentPhoto;
  const [activeTab, setActiveTab] = useState(tabs[0] ?? "All moments");
  const filtered = useMemo(
    () => photos.filter((p) => photoMatchesTab(p.alt, activeTab)),
    [photos, activeTab],
  );
  const pool = filtered.length > 0 ? filtered : photos;
  const visible = pool.slice(0, GALLERY_VISIBLE);

  return (
    <RkpsPageSection id={id} tone="paper">
      <RkpsSectionIntro
        num="School life · Gallery"
        title={title}
        description={`${subtitle} Follow @r.k.m.p.s for the full feed.`}
        action={
          <Link href={ctaHref} className="rkps-btn-ghost shrink-0 text-sm">
            {cta} ↗
          </Link>
        }
      />

      <div className="mt-8 flex flex-col gap-4 border-b border-border/80 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Browse by theme</p>
          <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="Gallery themes">
            {tabs.map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(tab)}
                  className={`rkps-ease rkps-press rounded-full px-4 py-2 text-xs font-bold ${
                    active
                      ? "bg-brand text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                      : "border border-border/80 bg-surface text-muted hover:border-brand/35 hover:text-brand"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
        <p className="text-xs tabular-nums text-muted">
          Showing {visible.length} of {pool.length} {pool.length === 1 ? "moment" : "moments"}
        </p>
      </div>

      <div className="rkps-stagger mt-8 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-12 lg:gap-3">
        {visible.map((photo, i) => (
          <GalleryTile key={`${photo.src}-${activeTab}`} photo={photo} index={i} priority={i === 0} />
        ))}
      </div>

      <p className="mt-6 max-w-2xl text-xs leading-relaxed text-muted">{disclaimer}</p>

      <div className="mt-8 flex flex-col gap-4 rounded-[1.25rem] border border-dashed border-border/90 bg-surface/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-heading">More on Instagram</p>
          <p className="mt-1 text-sm text-muted">Daily photos from programmes, festivals and campus life.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={INSTAGRAM_PROFILE}
            target="_blank"
            rel="noreferrer"
            className="btn-primary rkps-ease rkps-press px-5 py-2 text-sm"
          >
            @r.k.m.p.s
          </a>
          <Link href="/school-life/student-achievers" className="btn-secondary rkps-ease rkps-press px-5 py-2 text-sm">
            Student achievers
          </Link>
        </div>
      </div>
    </RkpsPageSection>
  );
}
