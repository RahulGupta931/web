import type { PictureRailItem } from "@/components/ui/picture-rail-gallery";

const CREST = "/marketing/instagram/campus-2.jpg";

type Photo = { src: string; alt: string };

export const GALLERY_CATEGORIES = ["All", "Learning", "Sports", "Arts and Culture", "Events"] as const;
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];
export type PictureRailCategory = Exclude<GalleryCategory, "All">;

const PRINTS: Array<{
  src: string;
  title: string;
  year: string;
  aspect: number;
  frame: PictureRailItem["frame"];
  mat?: boolean;
  drop: number;
  tag: string;
  category: PictureRailCategory;
  details: string[];
}> = [
  {
    src: "/marketing/instagram/campus-12.jpg",
    title: "Assembly Hour",
    year: "2025–26",
    aspect: 1,
    frame: "white",
    mat: true,
    drop: 0,
    tag: "Learning",
    category: "Learning",
    details: ["Morning assembly", "Session 2025–26", "Everyday campus"],
  },
  {
    src: "/marketing/instagram/campus-8.jpg",
    title: "Together in the Hall",
    year: "2024–25",
    aspect: 0.8,
    frame: "black",
    mat: true,
    drop: 0.04,
    tag: "Learning",
    category: "Learning",
    details: ["School assembly", "Students and teachers", "R.K. Memorial Public School"],
  },
  {
    src: "/marketing/instagram/campus-22.jpg",
    title: "Sports Week on the Ground",
    year: "2025–26",
    aspect: 1.5,
    frame: "oak",
    drop: 0.08,
    tag: "Sports",
    category: "Sports",
    details: ["Annual sports week", "House matches", "Campus grounds"],
  },
  {
    src: "/marketing/instagram/campus-19.jpg",
    title: "Team and Track",
    year: "2025–26",
    aspect: 0.8,
    frame: "black",
    mat: true,
    drop: 0.12,
    tag: "Sports",
    category: "Sports",
    details: ["Athletics and games", "Session 2025–26", "From @r.k.m.p.s"],
  },
  {
    src: "/marketing/instagram/campus-4.jpg",
    title: "Dussehra Dress",
    year: "2024–25",
    aspect: 0.75,
    frame: "oak",
    drop: 0.12,
    tag: "Festival",
    category: "Arts and Culture",
    details: ["Festival celebration", "Traditional dress", "School hall"],
  },
  {
    src: "/marketing/instagram/campus-5.jpg",
    title: "Stage Light, Dussehra",
    year: "2024–25",
    aspect: 4 / 3,
    frame: "white",
    mat: true,
    drop: -0.02,
    tag: "Performance",
    category: "Arts and Culture",
    details: ["Cultural programme", "Student performance", "Session 2024–25"],
  },
  {
    src: "/marketing/instagram/campus-25.jpg",
    title: "Dance in the Hall",
    year: "2024–25",
    aspect: 0.8,
    frame: "black",
    mat: true,
    drop: 0.16,
    tag: "Arts",
    category: "Arts and Culture",
    details: ["Dance", "Annual programme", "Campus gallery"],
  },
  {
    src: "/marketing/instagram/campus-21.jpg",
    title: "A Cultural Morning",
    year: "2025–26",
    aspect: 1.5,
    frame: "oak",
    drop: 0.06,
    tag: "Events",
    category: "Events",
    details: ["School celebration", "Student life", "From @r.k.m.p.s"],
  },
  {
    src: "/marketing/instagram/campus-26.jpg",
    title: "Recognition Day",
    year: "2025–26",
    aspect: 1.5,
    frame: "black",
    drop: 0.1,
    tag: "Events",
    category: "Events",
    details: ["Awards assembly", "Student recognition", "School event"],
  },
  {
    src: "/marketing/instagram/campus-17.jpg",
    title: "Talent on Stage",
    year: "2025–26",
    aspect: 1,
    frame: "oak",
    mat: true,
    drop: 0.03,
    tag: "Arts",
    category: "Arts and Culture",
    details: ["Talent programme", "Student performance", "From the school Instagram"],
  },
];

export function rkpsPictureRailItems(
  photos: readonly Photo[] = [],
  category: GalleryCategory = "All",
): PictureRailItem[] {
  const bySrc = new Map(photos.map((photo) => [photo.src, photo]));
  return PRINTS.filter((print) => print.src !== CREST)
    .filter((print) => category === "All" || print.category === category)
    .map((print) => {
      const photo = bySrc.get(print.src);
      return {
        id: print.src.replace(/\W+/g, "-"),
        title: print.title,
        artist: "R.K. Memorial Public School",
        year: print.year,
        image: photo?.src ?? print.src,
        aspect: print.aspect,
        frame: print.frame,
        mat: print.mat,
        drop: print.drop,
        tag: print.tag,
        details: print.details,
      };
    });
}

const FRAMES: PictureRailItem["frame"][] = ["black", "oak", "white"];
const ASPECTS = [0.8, 0.75, 4 / 3, 1, 1.5, 0.8, 1.5, 1];
const DROPS = [0.04, 0.12, -0.02, 0.16, 0.06, 0, 0.1, 0.03];

/** Map campus photos onto hanging prints (Events / Achievers rails). */
export function photosToPictureRailItems(
  photos: readonly Photo[],
  options: { tag: string; details?: string[]; limit?: number },
): PictureRailItem[] {
  const limit = options.limit ?? 8;
  return photos
    .filter((photo) => photo.src !== CREST)
    .slice(0, limit)
    .map((photo, i) => ({
      id: photo.src.replace(/\W+/g, "-"),
      title: photo.alt,
      artist: "R.K. Memorial Public School",
      image: photo.src,
      aspect: ASPECTS[i % ASPECTS.length],
      frame: FRAMES[i % FRAMES.length],
      mat: i % 2 === 0,
      drop: DROPS[i % DROPS.length],
      tag: options.tag,
      details: options.details ?? ["Campus gallery", "From @r.k.m.p.s"],
    }));
}
