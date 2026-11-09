"use client";

import PictureRailGallery from "@/components/ui/picture-rail-gallery";
import type { PictureRailItem } from "@/components/ui/picture-rail-gallery";

const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

export const PICTURE_RAIL_PRINTS: PictureRailItem[] = [
  {
    id: "ochre-curve",
    title: "Ochre Curve",
    artist: "Ines Varga",
    year: "2023",
    image: unsplash("photo-1579783902614-a3da3919cdf1"),
    aspect: 0.75,
    frame: "black",
    mat: true,
    drop: 0.04,
    tag: "$280",
    details: ["Edition 12/50", "30 × 40 cm", "Archival pigment print", "Signed on the back"],
  },
  {
    id: "spiral-study",
    title: "Spiral Study",
    artist: "Tomas Reyhill",
    year: "2021",
    image: unsplash("photo-1549887534-1541e9326642"),
    aspect: 4 / 3,
    frame: "white",
    mat: true,
    drop: 0.12,
    tag: "$360",
    details: ["Edition 7/30", "40 × 30 cm", "Silver gelatin print", "Signed on the back"],
  },
  {
    id: "dune-field",
    title: "Dune Field",
    artist: "Ada Lindqvist",
    year: "2024",
    image: unsplash("photo-1506905925346-21bda4d32df4"),
    aspect: 0.75,
    frame: "oak",
    drop: -0.02,
    tag: "$190",
    details: ["Edition 18/75", "30 × 40 cm", "Archival pigment print", "Oak frame, museum glass"],
  },
  {
    id: "rain-study",
    title: "Rain Study No. 4",
    artist: "Elio Brandt",
    year: "2022",
    image: unsplash("photo-1470071459604-3b5ec3a7fe05"),
    aspect: 1,
    frame: "black",
    mat: true,
    drop: 0.16,
    tag: "$140",
    details: ["Edition 25/100", "30 × 30 cm", "Archival pigment print", "Unsigned open study"],
  },
  {
    id: "still-lake",
    title: "Still Lake",
    artist: "Saga Morel",
    year: "2024",
    image: unsplash("photo-1439066615861-d1af74d74000"),
    aspect: 1.5,
    frame: "oak",
    drop: 0.06,
    tag: "$420",
    details: ["Edition 5/40", "60 × 40 cm", "Archival pigment print", "Signed on the back"],
  },
  {
    id: "concrete-choir",
    title: "Concrete Choir",
    artist: "Pavel Oduya",
    year: "2020",
    image: unsplash("photo-1487958449943-2429e8be8625"),
    aspect: 0.8,
    frame: "white",
    mat: true,
    drop: 0,
    tag: "$240",
    details: ["Edition 9/50", "40 × 50 cm", "Archival pigment print", "Signed on the back"],
  },
  {
    id: "north-light",
    title: "North Light",
    artist: "Ada Lindqvist",
    year: "2024",
    image: unsplash("photo-1494438639946-1ebd1d20bf85"),
    aspect: 1.5,
    frame: "black",
    drop: 0.1,
    tag: "$620",
    details: ["Edition 3/25", "90 × 60 cm", "Archival pigment print", "Signed and numbered"],
  },
  {
    id: "tide-line",
    title: "Tide Line",
    artist: "Noor Halvorsen",
    year: "2023",
    image: unsplash("photo-1518837695005-2083093ee35b"),
    aspect: 1,
    frame: "oak",
    mat: true,
    drop: 0.03,
    tag: "$310",
    details: ["Edition 14/60", "50 × 50 cm", "Archival pigment print", "Signed on the back"],
  },
];

export default function PictureRailGalleryDemo({ autoplay = true }: { autoplay?: boolean }) {
  return (
    <div data-picture-demo className="flex min-h-svh w-full items-center justify-center bg-background text-foreground">
      <PictureRailGallery
        items={PICTURE_RAIL_PRINTS}
        eyebrow="Print shop · New editions"
        heading="A gallery wall you can rearrange, right on the page."
        caption="Brush along the rail to light a print, slide it, lift it to see the back."
        autoplay={autoplay}
        action={
          <button
            type="button"
            className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-sm outline-none transition-[transform,box-shadow] hover:-translate-y-px hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
          >
            Browse prints
          </button>
        }
      />
    </div>
  );
}
