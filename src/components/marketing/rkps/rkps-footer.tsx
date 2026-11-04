"use client";

import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/config/branding";
import { RKPS_CONTACT, RKPS_FOOTER, RKPS_HEADER_CTA } from "@/content/website/rkps-copy";
import { INSTAGRAM_PROFILE } from "@/content/website/instagram-media";

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <nav aria-label={title} className="min-w-0">
      <p className="rkps-text-label-soft text-xs">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            {l.href.startsWith("http") ? (
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-[var(--rkps-charcoal)] transition-colors hover:text-[var(--rkps-primary)]"
              >
                {l.label}
              </a>
            ) : (
              <Link
                href={l.href}
                className="text-sm text-[var(--rkps-charcoal)] transition-colors hover:text-[var(--rkps-primary)]"
              >
                {l.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function RkpsFooter({ prefooter }: { prefooter?: string }) {
  const telHref = `tel:${RKPS_CONTACT.phone.replace(/\s/g, "")}`;
  const mailHref = `mailto:${RKPS_CONTACT.email}`;
  const { discover, families, more, stay } = RKPS_FOOTER.columns;
  const year = new Date().getFullYear();

  const contactCells = [
    { label: "Phone", value: RKPS_CONTACT.phone, href: telHref },
    { label: "Email", value: RKPS_CONTACT.email, href: mailHref },
    { label: "Campus", value: RKPS_CONTACT.visit },
    { label: "Office hours", value: RKPS_CONTACT.hours },
  ] as const;

  const linkColumns = [
    { title: "Discover", links: discover },
    { title: "Families", links: families },
    { title: "School life", links: more },
    { title: "Stay informed", links: stay },
  ] as const;

  return (
    <footer className="border-t border-[var(--rkps-divider)] bg-[var(--rkps-ivory)] text-[var(--rkps-charcoal)]">
      <div className="h-1 bg-[var(--rkps-burgundy)]" aria-hidden />
      <div className="h-0.5 bg-[var(--rkps-gold)]" aria-hidden />

      <div className="mx-auto max-w-7xl rkps-page-x pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] pt-10 lg:pb-12 lg:pt-14">
        {prefooter ? (
          <p className="mb-8 max-w-3xl text-sm leading-relaxed text-muted">{prefooter}</p>
        ) : null}

        <div className="overflow-hidden rounded-[1.75rem] border border-[var(--rkps-divider)] bg-[var(--rkps-taupe)] shadow-[0_20px_50px_rgb(143_1_3_/_0.06)] sm:rounded-[2rem]">
          <div className="grid lg:grid-cols-12 lg:items-start">
            {/* Brand + CTAs */}
            <div className="border-b border-[var(--rkps-divider)] p-6 sm:p-8 lg:col-span-5 lg:border-b-0 lg:border-r lg:p-10">
              <div className="flex items-start gap-4">
                <Image
                  src={BRAND.crestSrc}
                  alt=""
                  width={72}
                  height={72}
                  className="h-16 w-16 shrink-0 object-contain sm:h-[4.5rem] sm:w-[4.5rem]"
                />
                <div className="min-w-0">
                  <span className="rkps-rule" aria-hidden="true" />
                  <p className="rkps-display mt-3 text-xl leading-snug text-heading sm:text-2xl">{BRAND.name}</p>
                  <p className="mt-1 text-sm font-medium text-[var(--rkps-gold)]">{BRAND.motto}</p>
                </div>
              </div>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">{RKPS_FOOTER.tagline}</p>
              <blockquote className="rkps-display mt-6 border-l-2 border-[var(--rkps-gold)] pl-4 text-lg leading-snug text-heading sm:text-xl">
                {RKPS_FOOTER.closing}
              </blockquote>
              <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                <Link href={RKPS_HEADER_CTA.enquire.href} className="rkps-btn-gold rkps-btn-sm w-full justify-center sm:w-auto">
                  {RKPS_HEADER_CTA.enquire.label}
                </Link>
                <Link href={RKPS_HEADER_CTA.login.href} className="rkps-btn-secondary rkps-btn-sm w-full justify-center sm:w-auto">
                  {RKPS_HEADER_CTA.login.label}
                </Link>
                <a
                  href={INSTAGRAM_PROFILE}
                  target="_blank"
                  rel="noreferrer"
                  className="rkps-btn-secondary rkps-btn-sm w-full justify-center sm:w-auto"
                >
                  Instagram
                </a>
              </div>
            </div>

            {/* Link grid */}
            <div className="bg-[color-mix(in_srgb,var(--rkps-ivory)_55%,var(--rkps-taupe))] p-6 sm:p-8 lg:col-span-7 lg:p-10">
              <p className="rkps-text-label text-xs">Explore the site</p>
              <div className="mt-5 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                {linkColumns.map((col) => (
                  <FooterLinkColumn key={col.title} title={col.title} links={col.links} />
                ))}
              </div>
            </div>
          </div>

          {/* Contact strip */}
          <div className="border-t border-[var(--rkps-divider)] bg-[var(--rkps-ivory)] p-4 sm:p-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
              {contactCells.map((cell) => (
                <div
                  key={cell.label}
                  className="rounded-xl border border-[var(--rkps-divider)] bg-white px-4 py-3.5 sm:px-5 sm:py-4"
                >
                  <p className="rkps-text-label-soft text-[0.6875rem] uppercase tracking-wide">{cell.label}</p>
                  {"href" in cell && cell.href ? (
                    <a
                      href={cell.href}
                      className="mt-1.5 block text-sm leading-snug text-[var(--rkps-charcoal)] transition-colors hover:text-[var(--rkps-primary)]"
                    >
                      {cell.value}
                    </a>
                  ) : (
                    <p className="mt-1.5 text-sm leading-snug text-[var(--rkps-charcoal)]">{cell.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legal row */}
        <div className="mt-6 flex flex-col gap-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {BRAND.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="#privacy" className="transition-colors hover:text-[var(--rkps-primary)]">
              Privacy
            </Link>
            <Link href="#accessibility" className="transition-colors hover:text-[var(--rkps-primary)]">
              Accessibility
            </Link>
            <Link href="/#contact" className="transition-colors hover:text-[var(--rkps-primary)]">
              Contact
            </Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-1.5 font-medium text-[var(--rkps-charcoal)] transition-colors hover:text-[var(--rkps-gold)]"
            >
              Back to top
              <span aria-hidden="true">↑</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
