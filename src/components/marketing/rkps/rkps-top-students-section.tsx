import Link from "next/link";
import { RkpsSectionIntro } from "@/components/marketing/rkps/rkps-marketing-blocks";
import { TOP_STUDENTS_BY_CLASS, TOP_STUDENTS_DISCLAIMER } from "@/content/website/public-site";
import { rkpsUniformTripleClass } from "@/lib/rkps-layout";

function nameHue(name: string): number {
  let hash = 0;
  for (const char of name) hash = (hash * 33 + char.charCodeAt(0)) >>> 0;
  return hash;
}

const SKIN = ["#f3d2bc", "#e7b892", "#d4956a", "#c47a45", "#8d5524"] as const;
const HAIR = ["#1a120c", "#3d2914", "#5a3820", "#111111", "#6a3b28"] as const;

function StudentDp({ name }: { name: string }) {
  const hash = nameHue(name);
  const skin = SKIN[hash % SKIN.length];
  const hair = HAIR[(hash >> 4) % HAIR.length];
  const style = hash % 4;
  const backdrop = hash % 2 === 0 ? "var(--surface-muted)" : "#fff3d4";

  return (
    <span
      className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-[var(--brand-gold)] shadow-md"
      role="img"
      aria-label={`${name}, profile photo`}
    >
      <svg viewBox="0 0 80 80" className="h-full w-full" aria-hidden>
        <rect width="80" height="80" fill={backdrop} />
        <ellipse cx="40" cy="86" rx="30" ry="24" fill="var(--brand-maroon)" />
        <path d="M22 52c4-8 12-12 18-12s14 4 18 12" fill="var(--brand-maroon)" />
        <circle cx="40" cy="34" r="15" fill={skin} />
        {style === 0 ? (
          <path d="M25 34c1-16 8-24 15-24s14 8 15 24c-2-6-8-9-15-9s-13 3-15 9z" fill={hair} />
        ) : null}
        {style === 1 ? (
          <path d="M24 36c0-18 7-26 16-26 10 0 16 10 16 22-4-8-10-12-16-12s-12 4-16 16z" fill={hair} />
        ) : null}
        {style === 2 ? (
          <path d="M22 38c2-20 10-28 18-28s16 8 18 24c-6-2-10 2-18 2s-14-4-18 2z" fill={hair} />
        ) : null}
        {style === 3 ? (
          <path d="M26 32c0-14 6-20 14-20s14 6 14 18c-2 4-6 2-8-2-2 6-8 8-12 6-4 2-8 0-8-2z" fill={hair} />
        ) : null}
        <circle cx="34" cy="34" r="1.4" fill="#1c2430" />
        <circle cx="46" cy="34" r="1.4" fill="#1c2430" />
        <path d="M36 40c2 2 6 2 8 0" fill="none" stroke="#a15c45" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function RkpsTopStudentsSection() {
  return (
    <section id="top-students" className="scroll-mt-28 border-b border-border bg-white py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl rkps-page-x">
        <RkpsSectionIntro
          num="Honour Roll"
          title="Top student in each class"
          description="Recognising academic curiosity, consistent effort, and leadership alongside outstanding term performance."
          action={
            <Link href="/school-life/student-achievers" className="rkps-btn-navy text-xs sm:text-sm">
              <span>Student Achievers</span>
              <span>↗</span>
            </Link>
          }
        />

        <ul className="rkps-stagger mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
          {TOP_STUDENTS_BY_CLASS.map((row, i) => (
            <li key={row.className} className={rkpsUniformTripleClass(i)} style={{ ["--rkps-i" as string]: i }}>
              <article className="group relative flex h-full items-center gap-3.5 rounded-2xl border border-border/80 bg-[var(--surface-elevated)] p-4 sm:p-5 shadow-sm transition hover:-translate-y-1 hover:border-brand/40 hover:bg-white hover:shadow-md">
                <StudentDp name={row.studentName} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider text-brand">
                      {row.className}
                    </span>
                    <span className="text-[0.625rem] font-bold text-[var(--brand-gold)]" title="Excellence">
                      ★ Top
                    </span>
                  </div>
                  <h3 className="mt-1 truncate font-bold text-heading text-sm sm:text-base group-hover:text-brand transition">
                    {row.studentName}
                  </h3>
                  <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-muted">
                    {row.recognition}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-border/70 pt-6">
          <p className="max-w-2xl text-xs leading-relaxed text-muted">{TOP_STUDENTS_DISCLAIMER}</p>
          <div className="flex shrink-0 flex-wrap gap-2.5">
            <Link href="/school-life/achievements" className="rounded-full border border-border/80 bg-surface px-4 py-2 text-xs font-semibold text-brand hover:border-brand/40 hover:bg-brand/5 transition">
              School Achievements Archive ↗
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
