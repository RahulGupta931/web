import Link from "next/link";
import type { Achievement, AchievementCategory } from "@/content/website/public-site";
import { instagramPhoto } from "@/content/website/instagram-media";
import { achievementListGridClass, formatAchievementDate } from "@/lib/achievements-display";

const ACHIEVEMENT_PHOTO_POOLS: Record<AchievementCategory, ReturnType<typeof instagramPhoto>[]> = {
  Academic: [
    instagramPhoto("campus-19.jpg"),
    instagramPhoto("campus-18.jpg"),
    instagramPhoto("campus-27.jpg"),
    instagramPhoto("campus-12.jpg"),
  ],
  STEM: [instagramPhoto("campus-21.jpg"), instagramPhoto("campus-34.jpg"), instagramPhoto("campus-38.jpg")],
  Sports: [instagramPhoto("campus-39.jpg"), instagramPhoto("campus-40.jpg"), instagramPhoto("campus-41.jpg")],
  Arts: [instagramPhoto("campus-7.jpg"), instagramPhoto("campus-5.jpg"), instagramPhoto("campus-28.jpg"), instagramPhoto("campus-42.jpg")],
  Community: [instagramPhoto("campus-6.jpg"), instagramPhoto("campus-20.jpg"), instagramPhoto("campus-16.jpg")],
  Leadership: [instagramPhoto("campus-30.jpg"), instagramPhoto("campus-8.jpg"), instagramPhoto("campus-29.jpg")],
};

function photoFor(category: AchievementCategory, index: number) {
  const pool = ACHIEVEMENT_PHOTO_POOLS[category] ?? ACHIEVEMENT_PHOTO_POOLS.Academic;
  return pool[index % pool.length];
}

export function AchievementCard({
  item,
  featured,
  photoIndex = 0,
}: {
  item: Achievement;
  compact?: boolean;
  featured?: boolean;
  photoIndex?: number;
}) {
  const photo = photoFor(item.category, photoIndex);
  return (
    <article
      className={`rkps-ease group relative flex h-full flex-col justify-between overflow-hidden rounded-[1.85rem] border border-white/10 bg-[#081f3b] shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-2 hover:shadow-[var(--shadow-card-hover)] ${
        featured ? "min-h-[26rem]" : "min-h-[18rem]"
      }`}
    >
      <img
        src={photo.src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-[var(--brand-maroon-dark)]/72" />
      <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />

      <div className="relative z-10 flex items-start justify-between gap-3 p-5 sm:p-6">
        <span className="rounded-full border border-[var(--brand-gold)]/50 bg-[color-mix(in_srgb,var(--brand-gold)_18%,transparent)] px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[var(--brand-gold)] backdrop-blur-sm">
          {item.category}
        </span>
        <time className="rounded-full border border-white/15 bg-black/20 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white/80" dateTime={item.date}>
          {formatAchievementDate(item.date)}
        </time>
      </div>

      <div className="relative z-10 p-5 pt-0 sm:p-6 sm:pt-0">
        <p className="text-[0.66rem] font-bold uppercase tracking-[0.22em] text-[var(--brand-gold)]">Achievement</p>
        <h3 className={`mt-3 font-bold tracking-[-0.03em] text-white ${featured ? "text-2xl sm:text-3xl" : "text-xl sm:text-[1.35rem]"}`}>{item.title}</h3>
        <p className="mt-3 text-sm font-semibold text-[var(--brand-gold)]">
          {item.studentName}
          <span className="font-normal text-white/80"> · {item.classLabel}</span>
        </p>
        <p className={`mt-3 text-sm leading-relaxed text-white/85 ${featured ? "max-w-xl" : "line-clamp-2"}`}>{item.summary}</p>
      </div>
    </article>
  );
}

export function AchievementsGrid({ items, asymmetric }: { items: Achievement[]; asymmetric?: boolean }) {
  if (items.length === 0) {
    return (
      <p className="rounded-[1.25rem] border border-dashed border-border/90 bg-surface/60 px-6 py-10 text-center text-sm text-muted">
        No achievements match your filters.
      </p>
    );
  }
  return (
    <ul className={`rkps-stagger grid gap-5 ${asymmetric ? "lg:grid-cols-12" : "sm:grid-cols-2 xl:grid-cols-3"}`}>
      {items.map((item, i) => (
        <li
          key={item.id}
          className={asymmetric ? achievementListGridClass(i) : undefined}
          style={{ ["--rkps-i" as string]: i }}
        >
          <AchievementCard item={item} featured={asymmetric && i % 6 === 0} photoIndex={i} />
        </li>
      ))}
    </ul>
  );
}

export function ViewAllAchievementsLink() {
  return (
    <div className="mt-8 text-center">
      <Link href="/achievements" className="btn-primary text-sm">
        View all achievements
      </Link>
    </div>
  );
}
