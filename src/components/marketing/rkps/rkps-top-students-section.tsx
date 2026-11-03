import Link from "next/link";
import { RkpsSectionIntro } from "@/components/marketing/rkps/rkps-marketing-blocks";
import { TOP_STUDENTS_BY_CLASS, TOP_STUDENTS_DISCLAIMER } from "@/content/website/public-site";
import { rkpsUniformTripleClass } from "@/lib/rkps-layout";

function classShortLabel(className: string): string {
  if (className === "Nursery") return "N";
  if (className === "LKG") return "LKG";
  if (className === "UKG") return "UKG";
  const m = className.match(/Class (\d+)/);
  return m ? m[1] : className.slice(0, 3);
}

export function RkpsTopStudentsSection() {
  return (
    <section id="top-students" className="scroll-mt-28 border-b border-border bg-[var(--rkps-paper)] py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-5">
        <RkpsSectionIntro
          num="Honour roll"
          title="Top student in each class"
          description="One recognised learner per class for the current term — effort, growth and character alongside results."
          action={
            <Link href="/school-life/student-achievers" className="rkps-btn-ghost shrink-0 text-sm">
              Student achievers ↗
            </Link>
          }
        />

        <ul className="rkps-stagger mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-12">
          {TOP_STUDENTS_BY_CLASS.map((row, i) => (
            <li key={row.className} className={rkpsUniformTripleClass(i)} style={{ ["--rkps-i" as string]: i }}>
              <article className="rkps-ease flex h-full gap-3 rounded-[1.25rem] border border-border/80 bg-surface p-4 shadow-[var(--rkps-shadow-diffuse,var(--shadow-card))] transition hover:-translate-y-0.5 hover:border-brand/25">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-xs font-bold text-brand"
                  aria-hidden
                >
                  {classShortLabel(row.className)}
                </span>
                <div className="min-w-0">
                  <p className="text-[0.6875rem] font-bold uppercase tracking-wide text-muted">{row.className}</p>
                  <h3 className="mt-0.5 truncate font-semibold text-heading">{row.studentName}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-snug text-muted">{row.recognition}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-muted">{TOP_STUDENTS_DISCLAIMER}</p>
        <div className="mt-4 flex flex-wrap gap-4">
          <Link href="/school-life/achievements" className="rkps-btn-ghost text-sm">
            School achievements ↗
          </Link>
        </div>
      </div>
    </section>
  );
}
