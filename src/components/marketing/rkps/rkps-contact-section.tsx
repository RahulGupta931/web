import Link from "next/link";
import { RkpsPageSection } from "@/components/marketing/rkps/rkps-marketing-blocks";
import { RkpsInView } from "@/components/marketing/rkps/rkps-motion-sections";

type Photo = { src: string; alt: string };

export function RkpsContactSection({
  id,
  title,
  subtitle,
  lead,
  detail,
  visitBlurb,
  visit,
  phone,
  email,
  hours,
  hoursNote,
  reachOut,
  campusPhoto,
}: {
  id: string;
  title: string;
  subtitle: string;
  lead: string;
  detail: string;
  visitBlurb: string;
  visit: string;
  phone: string;
  email: string;
  hours: string;
  hoursNote: string;
  reachOut: readonly { title: string; body: string }[];
  campusPhoto: Photo;
}) {
  const telHref = `tel:${phone.replace(/\s/g, "")}`;
  const mailHref = `mailto:${email}`;

  return (
    <RkpsPageSection id={id} tone="inset">
      <RkpsInView>
        <div className="overflow-hidden rounded-[1.75rem] border border-border/80 bg-white shadow-[0_24px_60px_rgba(96,0,0,0.07)] sm:rounded-[2rem]">
          <div className="grid lg:grid-cols-12 lg:items-stretch">
            <aside className="order-2 flex flex-col border-b border-border/70 bg-[var(--surface-elevated)] p-6 sm:p-8 lg:order-1 lg:col-span-4 lg:border-b-0 lg:border-r lg:p-10">
              <span className="rkps-rule" aria-hidden="true" />
              <p className="rkps-text-label mt-4 text-xs">Contact & Location</p>
              <h2 className="rkps-display mt-2 text-2xl font-bold tracking-tight text-heading [text-wrap:balance] sm:text-3xl">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                {subtitle} {lead}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted">{detail}</p>

              <ul className="mt-8 divide-y divide-border/70 overflow-hidden rounded-2xl border border-border/80 bg-white">
                {reachOut.map((item) => (
                  <li key={item.title} className="p-4 sm:p-5">
                    <p className="text-sm font-bold text-heading">{item.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted sm:text-sm">{item.body}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-2.5 sm:flex-row lg:flex-col">
                <Link href="/#admissions" className="rkps-btn-navy rkps-btn-sm w-full justify-center text-center sm:text-sm">
                  Start an Enquiry ↗
                </Link>
                <a
                  href={telHref}
                  className="rkps-btn-secondary rkps-btn-sm w-full justify-center text-center sm:text-sm"
                >
                  Call the office
                </a>
              </div>

              <p className="mt-6 text-xs leading-relaxed text-muted lg:mt-auto lg:pt-4">{hoursNote}</p>
            </aside>

            <div className="order-1 flex flex-col gap-5 bg-[var(--background)] p-6 sm:gap-6 sm:p-8 lg:order-2 lg:col-span-8 lg:p-8">
              <figure className="relative min-h-[16rem] flex-1 overflow-hidden rounded-3xl border border-border/70 shadow-[0_16px_40px_rgba(0,0,0,0.12)] sm:min-h-[20rem] lg:min-h-[22rem]">
                <img
                  src={campusPhoto.src}
                  alt={campusPhoto.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/5"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent sm:h-28"
                  aria-hidden
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-4 sm:p-6 lg:p-8">
                  <div className="max-w-xl rounded-2xl border border-white/15 bg-black/45 p-4 backdrop-blur-md sm:p-5">
                    <span className="inline-flex rounded-full border border-[var(--brand-gold)]/50 bg-[var(--brand-gold)]/20 px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-wider text-[var(--brand-gold)]">
                      Campus visit
                    </span>
                    <p className="mt-3 text-sm font-semibold leading-relaxed text-white sm:text-base">{visitBlurb}</p>
                    <p className="mt-3 text-xs leading-relaxed text-white/90 sm:text-sm">
                      <span className="font-semibold text-[var(--brand-gold)]">Address.</span> {visit}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-white/85 sm:text-sm">
                      <span className="font-semibold text-[var(--brand-gold)]">Office hours.</span> {hours}
                    </p>
                  </div>
                </figcaption>
              </figure>

              <div className="grid gap-4 sm:grid-cols-2">
                <a
                  href={telHref}
                  className="group flex flex-col rounded-2xl border border-border/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md sm:p-6"
                >
                  <span className="rkps-text-label text-xs">Call admissions</span>
                  <p className="mt-2 text-xl font-bold tabular-nums text-heading sm:text-2xl">{phone}</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    Admissions assistance, visit scheduling, and fee guidance during school hours.
                  </p>
                  <span className="mt-4 text-xs font-bold text-brand transition group-hover:translate-x-0.5">Dial now →</span>
                </a>

                <a
                  href={mailHref}
                  className="group flex flex-col rounded-2xl border border-border/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md sm:p-6"
                >
                  <span className="rkps-text-label text-xs">Email inquiries</span>
                  <p className="mt-2 break-all text-base font-bold text-heading sm:text-lg">{email}</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    Documentation, transcript queries, or detailed questions for the administrative office.
                  </p>
                  <span className="mt-4 text-xs font-bold text-brand transition group-hover:translate-x-0.5">Send email →</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </RkpsInView>
    </RkpsPageSection>
  );
}
