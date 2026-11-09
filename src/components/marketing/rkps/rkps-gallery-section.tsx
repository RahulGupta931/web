import Link from "next/link";
import { RkpsInView } from "@/components/marketing/rkps/rkps-motion-sections";
import { PictureRailGallery } from "@/components/ui/picture-rail-gallery";
import { INSTAGRAM_PROFILE } from "@/content/website/instagram-media";
import { rkpsPictureRailItems } from "@/content/website/rkps-picture-rail";

type Photo = { src: string; alt: string };

export function RkpsGallerySection({
  id,
  title,
  subtitle,
  cta,
  ctaHref,
  disclaimer,
  photos,
}: {
  id: string;
  title: string;
  subtitle: string;
  tabs?: readonly string[];
  cta: string;
  ctaHref: string;
  disclaimer: string;
  photos: readonly Photo[];
  accentPhoto?: Photo;
}) {
  const items = rkpsPictureRailItems(photos, "All");

  return (
    <section id={id} className="relative isolate w-full scroll-mt-28 overflow-x-clip bg-[var(--rkps-bg)] py-14 sm:py-20 lg:py-24">
      <RkpsInView>
        <PictureRailGallery
            className="!bg-transparent"
            items={items}
            eyebrow="Interactive campus gallery"
            heading={title}
            caption={subtitle}
            autoplay
            labels={{
              front: "Front",
              back: "Back",
              close: "Close",
              open: "Lift to view the back",
            }}
            action={
              <div className="flex flex-col items-center gap-3">
                <p className="max-w-md text-sm text-muted-foreground">
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
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a href={INSTAGRAM_PROFILE} target="_blank" rel="noreferrer" className="rkps-btn-primary rkps-btn-sm">
                    {cta}
                  </a>
                  <Link
                    href={ctaHref}
                    className="text-sm text-brand underline decoration-brand/25 underline-offset-4 transition-colors hover:decoration-brand"
                  >
                    School events
                  </Link>
                </div>
                <p className="max-w-lg text-xs leading-relaxed text-muted-foreground">{disclaimer}</p>
              </div>
            }
          />
      </RkpsInView>
    </section>
  );
}
