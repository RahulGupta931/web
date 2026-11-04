import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/config/branding";
import { CONTACT, FOOTER_LEGAL, PUBLIC_NAV } from "@/content/website/public-site";
import { PRIVACY_SUMMARY, TERMS_SUMMARY } from "@/content/school-landing-content";

export function MarketingTopBar() {
  const items = [
    "Admissions open",
    CONTACT.phone,
    CONTACT.email,
    "Talk to the school office before you visit",
  ];
  const loop = [...items, ...items];
  return (
    <div className="rkps-marquee overflow-hidden border-b border-white/10 bg-brand-dark text-xs text-white/90">
      <div className="rkps-marquee-track">
        {loop.map((item, i) => (
          <span key={`${item}-${i}`} className="inline-flex items-center gap-3 px-5 py-2 font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" aria-hidden />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[color-mix(in_srgb,var(--rkps-gold)_35%,transparent)] bg-[var(--rkps-burgundy)] text-[var(--rkps-text-on-primary)] shadow-[0_8px_28px_rgb(143_1_3_/_0.16)]">
      <MarketingTopBar />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-5">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <Image src={BRAND.crestSrc} alt="" width={36} height={36} className="h-9 w-9 object-contain" priority />
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold text-white">{BRAND.shortName}</p>
            <p className="hidden text-[0.65rem] text-white/70 sm:block">{BRAND.motto}</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Site">
          {PUBLIC_NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-2.5 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <Link href="/#admissions" className="rkps-btn-ghost rkps-btn-inverse rkps-btn-sm hidden sm:inline-flex">
            Enquire
          </Link>
          <Link href="/login" className="rkps-btn-primary rkps-btn-inverse rkps-btn-sm">
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/10 bg-brand-dark text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div id="footer-contact" className="scroll-mt-24 lg:col-span-2">
            <Image src={BRAND.crestSrc} alt="" width={56} height={64} className="h-12 w-auto object-contain" />
            <p className="mt-4 font-semibold text-brand-gold">{BRAND.name}</p>
            <p className="mt-1 text-sm italic text-white/80">{BRAND.motto}</p>
            <p className="mt-4 text-sm leading-relaxed text-white/75">{CONTACT.address}</p>
            <p className="mt-2 text-sm text-white/75">
              {CONTACT.phone} ·{" "}
              <a href={`mailto:${CONTACT.email}`} className="text-brand-gold hover:underline">
                {CONTACT.email}
              </a>
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold/90">Explore</p>
            <ul className="mt-3 space-y-2 text-sm">
              {FOOTER_LEGAL.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/80 hover:text-white hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold/90">Portal</p>
            <p className="mt-3 text-sm text-white/75">{BRAND.tagline}</p>
            <p className="mt-3 text-sm">
              <Link href="/login" className="font-semibold text-brand-gold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
        <div className="mt-10 grid gap-6 border-t border-white/10 pt-10 md:grid-cols-2">
          <div id={PRIVACY_SUMMARY.id}>
            <h3 className="text-sm font-semibold text-white">{PRIVACY_SUMMARY.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-white/65">{PRIVACY_SUMMARY.body}</p>
          </div>
          <div id={TERMS_SUMMARY.id}>
            <h3 className="text-sm font-semibold text-white">{TERMS_SUMMARY.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-white/65">{TERMS_SUMMARY.body}</p>
          </div>
        </div>
        <p className="mt-10 text-center text-xs text-white/45">
          © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
