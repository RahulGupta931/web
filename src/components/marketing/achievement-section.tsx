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

const CATEGORY_STYLES: Record<AchievementCategory, { badge: string; icon: string }> = {
  Academic: { badge: "border-sky-300/40 bg-sky-950/70 text-sky-200", icon: "📚" },
  STEM: { badge: "border-emerald-300/40 bg-emerald-950/70 text-emerald-200", icon: "🔬" },
  Sports: { badge: "border-amber-300/40 bg-amber-950/70 text-amber-200", icon: "🏅" },
  Arts: { badge: "border-purple-300/40 bg-purple-950/70 text-purple-200", icon: "🎭" },
  Community: { badge: "border-blue-300/40 bg-blue-950/70 text-blue-200", icon: "🤝" },
  Leadership: { badge: "border-[var(--brand-gold)]/50 bg-[#162744]/80 text-[var(--brand-gold)]", icon: "⭐" },
};

export function AchievementCard({
  item,
  featured,
  photoIndex = 0,
  panel = false,
  className = "",
}: {
  item: Achievement;
  compact?: boolean;
  featured?: boolean;
  photoIndex?: number;
  /** Frosted panel behind copy (homepage recognition layout) */
  panel?: boolean;
  className?: string;
}) {
  const photo = photoFor(item.category, photoIndex);
  const catStyle = CATEGORY_STYLES[item.category] ?? CATEGORY_STYLES.Academic;

  const copy = (
    <>
      <h3
        className={`font-bold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)] transition group-hover:text-[var(--brand-gold)] ${
          featured ? "text-xl sm:text-2xl lg:text-3xl" : "text-base sm:text-lg"
        }`}
      >
        {item.title}
      </h3>
      <p className="mt-2 text-xs sm:text-sm font-semibold text-[var(--brand-gold)]">
        <span>{item.studentName}</span>
        <span className="font-normal text-white/75"> · {item.classLabel}</span>
      </p>
      <p
        className={`mt-2 text-xs sm:text-sm leading-relaxed text-white/85 ${
          featured ? "max-w-xl line-clamp-3 sm:line-clamp-none" : "line-clamp-2"
        }`}
      >
        {item.summary}
      </p>
    </>
  );

  return (
    <article
      className={`group relative flex h-full min-h-0 flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-[var(--brand-maroon-dark)] shadow-[0_16px_36px_rgba(96,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:shadow-2xl ${
        featured ? "min-h-[22rem] sm:min-h-[26rem]" : "min-h-[14rem] sm:min-h-[16rem]"
      } ${className}`}
    >
      <img
        src={photo.src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        loading="lazy"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/45 to-transparent sm:h-28"
        aria-hidden
      />

      {/* Top Header Tags */}
      <div className="relative z-10 flex items-center justify-between gap-2 p-4 sm:p-5">
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-wider backdrop-blur-md sm:px-3 sm:text-[0.6875rem] ${catStyle.badge}`}>
          <span>{catStyle.icon}</span>
          <span>{item.category}</span>
        </span>
        <time
          className="rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[0.625rem] font-semibold text-white/90 backdrop-blur-md sm:px-3 sm:text-[0.6875rem]"
          dateTime={item.date}
        >
          {formatAchievementDate(item.date)}
        </time>
      </div>

      {/* Content Area */}
      <div className={`relative z-10 mt-auto ${panel ? "p-4 pt-0 sm:p-5" : "p-4 pt-0 sm:p-5 sm:pt-0"}`}>
        {panel ? (
          <div className="rounded-2xl border border-white/15 bg-black/45 p-4 backdrop-blur-md sm:p-5">{copy}</div>
        ) : (
          copy
        )}
      </div>
    </article>
  );
}

export function AchievementsGrid({ items, asymmetric }: { items: Achievement[]; asymmetric?: boolean }) {
  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border/90 bg-[var(--surface-elevated)] p-8 sm:p-12 text-center text-sm text-muted">
        <p className="font-bold text-heading">No achievements found</p>
        <p className="mt-1 text-xs">Try selecting a different category or academic year.</p>
      </div>
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
      <Link href="/school-life/achievements" className="rkps-btn-navy text-sm">
        View Full Achievements Archive ↗
      </Link>
    </div>
  );
}
