"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { BRAND } from "@/config/branding";
import { RKPS_FOOTER, RKPS_HEADER_CTA, RKPS_NAV_MORE, RKPS_NAV_PRIMARY } from "@/content/website/rkps-copy";
import { RkpsNewsMarquee } from "@/components/marketing/rkps/rkps-motion-sections";

function routeNavIsActive(pathname: string, href: string): boolean {
  if (href.startsWith("/#")) {
    return false;
  }
  if (href === "/school-life/student-achievers") {
    return pathname.startsWith("/school-life") && !pathname.startsWith("/school-life/events");
  }
  if (href.startsWith("/school-life/")) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }
  return pathname === href;
}

function navLinkClass(active: boolean, className = "") {
  return [
    "whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[0.8125rem] font-medium transition-colors",
    active
      ? "bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
      : "text-white/85 hover:bg-white/10 hover:text-white",
    className,
  ].join(" ");
}

function MoreNavDropdown({ panelAlign = "right" }: { panelAlign?: "left" | "right" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerId = useId();
  const menuId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        id={triggerId}
        onClick={() => setOpen((v) => !v)}
        className={`${navLinkClass(open)} flex shrink-0 items-center gap-1.5`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
      >
        More
        <span
          className={`inline-block text-[0.625rem] text-white/70 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          ▾
        </span>
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-labelledby={triggerId}
          className={`absolute top-full z-[100] mt-2 min-w-[13rem] overflow-hidden rounded-xl border border-border bg-surface py-1.5 text-heading shadow-[var(--shadow-card-hover)] ${
            panelAlign === "left" ? "left-0" : "right-0"
          }`}
        >
          <p className="px-4 pb-1 pt-2 text-[0.625rem] font-bold uppercase tracking-wider text-muted">More links</p>
          {RKPS_NAV_MORE.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              role="menuitem"
              className="block px-4 py-2.5 text-sm text-heading transition hover:bg-surface-muted hover:text-brand"
              onClick={() => setOpen(false)}
            >
              {item.label}
              {item.label === "Plan a visit" ? " ↗" : ""}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function RkpsHeader({ breadcrumb }: { breadcrumb?: { label: string; href?: string }[] }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-40 overflow-visible border-b border-white/10 bg-brand text-white shadow-[0_4px_24px_rgba(74,4,4,0.25)]">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-5">
        <div className="flex h-[4.25rem] items-center justify-between gap-2 sm:gap-3 lg:h-[4.5rem] lg:gap-4">
          <Link href="/" className="flex min-w-0 flex-1 items-center gap-2 sm:gap-2.5 lg:flex-none">
            <Image
              src={BRAND.logoSrc}
              alt=""
              width={80}
              height={68}
              className="h-12 w-auto shrink-0 object-contain sm:h-14"
              priority
            />
            <div className="min-w-0 leading-tight sm:max-w-[12rem] md:max-w-[14rem] lg:max-w-[11rem] xl:max-w-none">
              <p className="text-[0.8125rem] font-bold leading-snug tracking-tight text-white sm:truncate sm:text-[0.8125rem] md:text-[0.9375rem]">
                <span className="sm:hidden">{BRAND.shortName}</span>
                <span className="hidden sm:inline">{BRAND.name}</span>
              </p>
              <p className="hidden truncate text-[0.6875rem] text-white/70 lg:block xl:max-w-[18rem]">{BRAND.motto}</p>
            </div>
          </Link>

          <nav
            className="hidden min-w-0 flex-1 items-center justify-center gap-1 overflow-visible lg:flex xl:gap-1.5"
            aria-label="Primary"
          >
            <div className="flex max-w-full min-w-0 items-center gap-0.5 overflow-x-auto scrollbar-none xl:gap-1">
              {RKPS_NAV_PRIMARY.map((item) => {
                const active = routeNavIsActive(pathname, item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={navLinkClass(active, "shrink-0 lg:px-2 lg:text-[0.75rem] xl:px-2.5 xl:text-[0.8125rem]")}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <MoreNavDropdown panelAlign="right" />
          </nav>

          <div className="flex shrink-0 items-center gap-1 sm:gap-1.5 md:gap-2">
            <Link
              href={RKPS_HEADER_CTA.login.href}
              className="hidden rounded-lg px-2.5 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10 hover:text-white md:inline-flex lg:px-3"
            >
              {RKPS_HEADER_CTA.login.label}
            </Link>
            <Link
              href={RKPS_HEADER_CTA.enquire.href}
              className="rkps-ease rkps-press inline-flex shrink-0 items-center whitespace-nowrap rounded-lg bg-[var(--brand-gold)] px-2.5 py-2 text-xs font-bold text-[var(--brand-maroon-dark)] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] hover:brightness-105 sm:px-3 sm:text-sm md:px-4"
            >
              {RKPS_HEADER_CTA.enquire.label}
            </Link>
            <button
              type="button"
              className="inline-flex rounded-lg border border-white/25 bg-white/10 px-2.5 py-2 text-xs font-semibold text-white sm:px-3 sm:text-sm lg:hidden"
              aria-expanded={mobileOpen}
              aria-controls="rkps-mobile-nav"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <nav
            id="rkps-mobile-nav"
            className="max-h-[min(70dvh,calc(100dvh-4.25rem))] overflow-y-auto border-t border-white/15 py-3 lg:hidden"
            aria-label="Mobile"
          >
            <p className="px-3 pb-1 text-[0.625rem] font-bold uppercase tracking-wider text-white/55">Explore</p>
            <ul className="flex flex-col gap-0.5">
              {RKPS_NAV_PRIMARY.map((item) => {
                const active = routeNavIsActive(pathname, item.href);
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${
                        active ? "bg-white/15 text-white" : "text-white/90 hover:bg-white/10"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 px-3 pb-1 text-[0.625rem] font-bold uppercase tracking-wider text-white/55">More</p>
            <ul className="flex flex-col gap-0.5">
              {RKPS_NAV_MORE.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                    {item.label === "Plan a visit" ? " ↗" : ""}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 space-y-1 border-t border-white/15 pt-3">
              <Link
                href={RKPS_HEADER_CTA.login.href}
                className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-[var(--brand-gold)] hover:bg-white/10"
                onClick={() => setMobileOpen(false)}
              >
                {RKPS_HEADER_CTA.login.label}
              </Link>
              <Link
                href={RKPS_HEADER_CTA.enquire.href}
                className="mx-3 block rounded-lg bg-[var(--brand-gold)] px-3 py-2.5 text-center text-sm font-bold text-[var(--brand-maroon-dark)] sm:hidden"
                onClick={() => setMobileOpen(false)}
              >
                {RKPS_HEADER_CTA.enquire.label}
              </Link>
            </div>
          </nav>
        ) : null}

        {breadcrumb && breadcrumb.length > 0 ? (
          <p className="border-t border-white/10 py-2 text-[0.6875rem] leading-relaxed text-white/65 sm:py-2.5 sm:text-xs">
            {breadcrumb.map((b, i) => (
              <span key={`${b.label}-${i}`}>
                {i > 0 && " / "}
                {b.href ? (
                  <Link href={b.href} className="font-medium text-white/90 hover:text-[var(--brand-gold)]">
                    {b.label}
                  </Link>
                ) : (
                  <span className="font-medium text-white">{b.label}</span>
                )}
              </span>
            ))}
          </p>
        ) : null}
      </div>
      <RkpsNewsMarquee />
    </header>
  );
}

export function RkpsFooter({ prefooter }: { prefooter?: string }) {
  return (
    <footer className="border-t border-border">
      {prefooter ? (
        <div className="border-b border-border/80 bg-[var(--rkps-paper)] text-heading">
          <div className="mx-auto max-w-3xl px-3 py-10 text-center sm:px-4 sm:py-12 lg:px-5">
            <span aria-hidden className="mx-auto mb-4 block h-1 w-12 rounded-full bg-[var(--brand-gold)]" />
            <p className="text-base font-semibold leading-relaxed sm:text-lg">{prefooter}</p>
          </div>
        </div>
      ) : null}
      <div className="bg-brand-dark text-white">
      <div className="mx-auto max-w-7xl px-3 py-14 sm:px-4 lg:px-5">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-xs italic text-brand-gold">{BRAND.motto}</p>
            <p className="mt-2 text-lg font-semibold">{BRAND.shortName}</p>
            <p className="text-xs text-white/55">{BRAND.name}</p>
            <p className="mt-4 text-sm leading-relaxed text-white/75">{RKPS_FOOTER.tagline}</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-brand-gold/90">Discover RMPS</p>
              <ul className="mt-3 space-y-2 text-sm text-white/75">
                {RKPS_FOOTER.columns.discover.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-white hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-brand-gold/90">For families</p>
              <ul className="mt-3 space-y-2 text-sm text-white/75">
                {RKPS_FOOTER.columns.families.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-white hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-brand-gold/90">School life</p>
              <ul className="mt-3 space-y-2 text-sm text-white/75">
                {RKPS_FOOTER.columns.more.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-white hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-brand-gold/90">Stay informed</p>
              <ul className="mt-3 space-y-2 text-sm text-white/75">
                {RKPS_FOOTER.columns.stay.map((l) => (
                  <li key={l.href}>
                    {l.href.startsWith("http") ? (
                      <a href={l.href} className="hover:text-white hover:underline" target="_blank" rel="noreferrer">
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className="hover:text-white hover:underline">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-12 text-center text-sm font-semibold text-brand-gold">{RKPS_FOOTER.closing}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 border-t border-white/10 pt-8 text-xs text-white/45">
          <span>© {new Date().getFullYear()} R.K Memorial Public School. All rights reserved.</span>
          <Link href="#privacy" className="hover:text-white/70">
            Privacy policy
          </Link>
          <Link href="#accessibility" className="hover:text-white/70">
            Accessibility
          </Link>
          <a href="#" className="hover:text-white/70">
            Back to top ↑
          </a>
        </div>
      </div>
      </div>
    </footer>
  );
}
