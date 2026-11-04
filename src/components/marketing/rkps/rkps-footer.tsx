"use client";

import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/config/branding";
import { RKPS_CONTACT, RKPS_FOOTER, RKPS_HEADER_CTA } from "@/content/website/rkps-copy";
import { INSTAGRAM_PROFILE } from "@/content/website/instagram-media";

function FooterLinks({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <nav aria-label={title} className="min-w-0 py-6 lg:px-6 lg:first:pl-0 lg:last:pr-0">
      <p className="text-xs text-white/55">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map((l) =>
          l.href.startsWith("http") ? (
            <li key={l.href}>
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-white/85 transition-colors hover:text-[var(--brand-gold)]"
              >
                {l.label}
              </a>
            </li>
          ) : (
            <li key={l.href}>
              <Link href={l.href} className="text-sm text-white/85 transition-colors hover:text-[var(--brand-gold)]">
                {l.label}
              </Link>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}

export function RkpsFooter({ prefooter }: { prefooter?: string }) {
  const telHref = `tel:${RKPS_CONTACT.phone.replace(/\s/g, "")}`;
  const mailHref = `mailto:${RKPS_CONTACT.email}`;
  const { discover, families, more, stay } = RKPS_FOOTER.columns;
  const year = new Date().getFullYear();

  const facts = [
    { label: "Phone", value: RKPS_CONTACT.phone, href: telHref },
    { label: "Email", value: RKPS_CONTACT.email, href: mailHref },
    { label: "Campus", value: RKPS_CONTACT.visit },
    { label: "Office hours", value: RKPS_CONTACT.hours },
  ] as const;

  return (
    <footer className="bg-[var(--brand-maroon-dark)] text-white">
      <div className="h-0.5 bg-[var(--brand-gold)]" aria-hidden />

      {prefooter ? (
        <p className="mx-auto max-w-7xl rkps-page-x border-b border-white/10 py-6 text-sm leading-6 text-white/80">
          {prefooter}
        </p>
      ) : null}

      <div className="mx-auto max-w-7xl rkps-page-x pb-[calc(5rem+env(safe-area-inset-bottom,0px))] pt-10 lg:pb-10 lg:pt-12">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <Image src={BRAND.crestSrc} alt="" width={64} height={64} className="h-14 w-14 shrink-0 object-contain" />
            <div className="min-w-0">
              <p className="text-base font-medium leading-snug">{BRAND.name}</p>
              <p className="mt-1 text-sm text-[var(--brand-gold)]">{BRAND.motto}</p>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/65">{RKPS_FOOTER.tagline}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <Link href={RKPS_HEADER_CTA.enquire.href} className="rkps-btn-gold rkps-btn-sm">
              {RKPS_HEADER_CTA.enquire.label}
            </Link>
            <Link
              href={RKPS_HEADER_CTA.login.href}
              className="text-sm text-white/75 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
            >
              {RKPS_HEADER_CTA.login.label}
            </Link>
          </div>
        </div>

        <p className="rkps-display border-b border-white/10 py-6 text-2xl leading-tight text-white sm:text-[28px]">
          {RKPS_FOOTER.closing}
        </p>

        <div className="grid border-b border-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label} className="border-t border-white/10 py-5 sm:border-t-0 lg:border-l lg:px-6 lg:first:border-l-0 lg:first:pl-0">
              <p className="text-xs text-white/55">{fact.label}</p>
              {"href" in fact && fact.href ? (
                <a href={fact.href} className="mt-2 block text-sm leading-6 text-white transition-colors hover:text-[var(--brand-gold)]">
                  {fact.value}
                </a>
              ) : (
                <p className="mt-2 text-sm leading-6 text-white/85">{fact.value}</p>
              )}
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
          <FooterLinks title="Discover" links={discover} />
          <FooterLinks title="Families" links={families} />
          <FooterLinks title="School life" links={more} />
          <FooterLinks title="Stay informed" links={stay} />
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {BRAND.name}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="#privacy" className="transition-colors hover:text-white">
              Privacy
            </Link>
            <Link href="#accessibility" className="transition-colors hover:text-white">
              Accessibility
            </Link>
            <a href={INSTAGRAM_PROFILE} target="_blank" rel="noreferrer" className="transition-colors hover:text-[var(--brand-gold)]">
              Instagram
            </a>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-white/70 transition-colors hover:text-[var(--brand-gold)]"
            >
              Back to top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
