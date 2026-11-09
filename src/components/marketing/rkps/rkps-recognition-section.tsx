import Link from "next/link";
import { instagramPhoto } from "@/content/website/instagram-media";
import { RkpsPageSection } from "@/components/marketing/rkps/rkps-marketing-blocks";
import { RkpsInView } from "@/components/marketing/rkps/rkps-motion-sections";

const AREAS = [
  {
    cat: "Academic achievements",
    title: "Asking. Exploring. Understanding.",
    body: "A place to recognise thoughtful inquiry, reading, and the work of understanding — records are confirmed by the office.",
    photo: instagramPhoto("campus-12.jpg"),
  },
  {
    cat: "Sports achievements",
    title: "Playing with purpose.",
    body: "Practice, house matches and sports week. Named results stay with the school until published.",
    photo: instagramPhoto("campus-22.jpg"),
  },
  {
    cat: "Olympiads",
    title: "Tests of curiosity.",
    body: "Subject olympiads and quizzes as offered each year. Ask the office for the current session’s participation.",
    photo: instagramPhoto("campus-19.jpg"),
  },
  {
    cat: "Cultural achievements",
    title: "Making room for imagination.",
    body: "Stage, music and festival programmes where learners present work together.",
    photo: instagramPhoto("campus-7.jpg"),
  },
  {
    cat: "Awards and recognitions",
    title: "Effort noticed, not ranked.",
    body: "Certificates and honours are issued by the school. This site does not invent winner lists.",
    photo: instagramPhoto("campus-26.jpg"),
  },
] as const;

export function RkpsRecognitionSection() {
  const [featured, ...rest] = AREAS;

  return (
    <RkpsPageSection id="excellence" tone="paper">
      <RkpsInView>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="rkps-rule" aria-hidden="true" />
            <p className="rkps-text-label mt-3 text-xs">Student achievements</p>
            <h2 className="rkps-display mt-2 text-[1.75rem] leading-tight text-heading sm:text-4xl">
              Many talents. Many journeys.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
              Academics, sport, olympiads, culture and awards — we notice effort and character. Named records are held
              by the office, not invented here.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2.5">
            <Link href="/school-life/student-achievers" className="rkps-btn-navy rkps-btn-sm">
              Student achievers
            </Link>
            <Link href="/school-life/achievements" className="rkps-btn-secondary rkps-btn-sm">
              Achievements archive
            </Link>
          </div>
        </div>

        {/* Featured card with two stacked beside it, then two half-width cards — every row adds up to 12. */}
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-12">

          {featured ? (
            <li className="sm:col-span-2 lg:col-span-7 lg:row-span-2">
              <article className="group relative min-h-[18rem] overflow-hidden rounded-[1.25rem] border border-border/80 bg-[var(--rkps-charcoal)] sm:min-h-[22rem] lg:h-full lg:min-h-[28rem]">
                <img
                  src={featured.photo.src}
                  alt={featured.photo.alt}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" aria-hidden />
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5 sm:p-7">
                  <p className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-[var(--brand-gold)]">
                    {featured.cat}
                  </p>
                  <h3 className="rkps-display text-2xl leading-snug text-white sm:text-3xl">{featured.title}</h3>
                  <p className="max-w-xl text-sm leading-relaxed text-white/85">{featured.body}</p>
                </div>
              </article>
            </li>
          ) : null}
          {rest.map((area, index) => (
            <li key={area.cat} className={index < 2 ? "lg:col-span-5" : "lg:col-span-6"}>
              <article className="flex h-full overflow-hidden rounded-[1.25rem] border border-border/80 bg-white shadow-sm">
                <div className="relative w-[42%] min-h-[8.5rem] shrink-0">
                  <img src={area.photo.src} alt={area.photo.alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center p-4 sm:p-5">
                  <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-[var(--brand-gold)]">
                    {area.cat}
                  </p>
                  <h3 className="rkps-display mt-1 text-lg text-heading">{area.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted sm:text-sm">{area.body}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </RkpsInView>
    </RkpsPageSection>
  );
}
