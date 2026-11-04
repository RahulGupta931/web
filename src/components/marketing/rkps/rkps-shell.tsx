"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { BRAND } from "@/config/branding";
import { RKPS_CONTACT, RKPS_FOOTER, RKPS_HEADER_CTA, RKPS_NAV_MORE, RKPS_NAV_PRIMARY } from "@/content/website/rkps-copy";
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
    "relative whitespace-nowrap rounded-full px-3 py-1.5 text-[0.8125rem] font-semibold transition-all duration-200",
    active
      ? "bg-white/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] ring-1 ring-white/30"
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
        <span>Explore</span>
        <svg
          className={`h-3.5 w-3.5 text-white/70 transition-transform duration-200 ${open ? "rotate-180 text-[var(--brand-gold)]" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-labelledby={triggerId}
          className={`absolute top-full z-[100] mt-2.5 min-w-[15rem] overflow-hidden rounded-2xl border border-white/15 bg-[var(--brand-maroon-dark)] p-2 text-white shadow-[0_20px_45px_rgba(0,0,0,0.45)] backdrop-blur-xl ${
            panelAlign === "left" ? "left-0" : "right-0"
          }`}
        >
          <div className="px-3 py-2 border-b border-white/10">
            <p className="text-[0.625rem] font-bold uppercase tracking-wider text-[var(--brand-gold)]">Quick Destinations</p>
          </div>
          <div className="py-1 space-y-0.5">
            {RKPS_NAV_MORE.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                role="menuitem"
                className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-white/90 transition hover:bg-white/10 hover:text-[var(--brand-gold)]"
                onClick={() => setOpen(false)}
              >
                <span>{item.label}</span>
                <span className="text-white/40 text-[0.7rem]">↗</span>
              </Link>
            ))}
          </div>
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
    <>
      <header className="sticky top-0 z-40 overflow-visible border-b border-white/10 bg-[var(--brand-maroon-dark)]/95 text-white backdrop-blur-md shadow-[0_8px_30px_rgba(96,0,0,0.22)]">
        <div className="mx-auto max-w-7xl rkps-page-x">
          <div className="flex h-16 items-center justify-between gap-3 sm:h-[4.5rem]">
            {/* Logo + School Info */}
            <Link
              href="/"
              className="group flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3 lg:flex-none"
              aria-label="R.K. Memorial Public School Home"
            >
              <div className="relative shrink-0 overflow-hidden rounded-xl bg-white/10 p-1 ring-1 ring-white/20 transition group-hover:scale-105 group-hover:ring-[var(--brand-gold)]">
                <Image
                  src={BRAND.logoSrc}
                  alt=""
                  width={64}
                  height={54}
                  className="h-10 w-auto object-contain sm:h-12"
                  priority
                />
              </div>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-sm font-bold tracking-tight text-white sm:text-base">
                  <span className="sm:hidden">{BRAND.shortName}</span>
                  <span className="hidden sm:inline lg:hidden xl:inline">{BRAND.name}</span>
                  <span className="hidden lg:inline xl:hidden">{BRAND.shortName}</span>
                </p>
                <p className="hidden truncate text-[0.6875rem] font-medium text-[var(--brand-gold)]/90 sm:block">
                  {BRAND.motto}
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav
              className="hidden min-w-0 flex-1 items-center justify-center gap-1 overflow-visible lg:flex xl:gap-1.5"
              aria-label="Primary Navigation"
            >
              <div className="flex max-w-full items-center gap-1 overflow-x-auto scrollbar-none rounded-full bg-white/5 p-1 border border-white/10">
                {RKPS_NAV_PRIMARY.map((item) => {
                  const active = routeNavIsActive(pathname, item.href);
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={navLinkClass(active, "text-[0.8rem] xl:text-[0.825rem]")}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <MoreNavDropdown panelAlign="right" />
              </div>
            </nav>

            {/* Right CTAs */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
              {/* Phone quick call on mobile header */}
              <a
                href={`tel:${RKPS_CONTACT.phone.replace(/\s/g, "")}`}
                aria-label={`Call office at ${RKPS_CONTACT.phone}`}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/10 text-[var(--brand-gold)] transition hover:bg-white/20 sm:hidden"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </a>

              <Link
                href={RKPS_HEADER_CTA.login.href}
                className="hidden items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20 hover:border-white/30 md:inline-flex"
              >
                <svg className="h-3.5 w-3.5 text-[var(--brand-gold)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                {RKPS_HEADER_CTA.login.label}
              </Link>

              <Link
                href={RKPS_HEADER_CTA.enquire.href}
                className="rkps-btn-gold text-xs sm:text-sm px-3.5 py-1.5 sm:px-4 sm:py-2 min-h-[38px] sm:min-h-[42px]"
              >
                <span>{RKPS_HEADER_CTA.enquire.label}</span>
                <span className="hidden sm:inline">↗</span>
              </Link>

              {/* Mobile menu toggle button */}
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-xl border border-white/25 bg-white/10 text-white transition hover:bg-white/20 lg:hidden"
                aria-expanded={mobileOpen}
                aria-controls="rkps-mobile-nav"
                aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
                onClick={() => setMobileOpen((v) => !v)}
              >
                {mobileOpen ? (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <line x1="4" x2="20" y1="12" y2="12" />
                    <line x1="4" x2="20" y1="6" y2="6" />
                    <line x1="4" x2="20" y1="18" y2="18" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Drawer */}
          {mobileOpen ? (
            <nav
              id="rkps-mobile-nav"
              className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-white/15 py-4 pb-6 lg:hidden"
              aria-label="Mobile Navigation"
            >
              <div className="space-y-4">
                {/* Main sections */}
                <div>
                  <p className="px-3 pb-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-[var(--brand-gold)]">
                    Main Pages
                  </p>
                  <ul className="flex flex-col gap-1">
                    {RKPS_NAV_PRIMARY.map((item) => {
                      const active = routeNavIsActive(pathname, item.href);
                      return (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                              active
                                ? "bg-white/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                                : "text-white/85 hover:bg-white/10 hover:text-white"
                            }`}
                            onClick={() => setMobileOpen(false)}
                          >
                            <span>{item.label}</span>
                            <span className="text-white/40">›</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* More destinations */}
                <div className="border-t border-white/10 pt-3">
                  <p className="px-3 pb-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-[var(--brand-gold)]">
                    Explore & Campus Life
                  </p>
                  <ul className="flex flex-col gap-1">
                    {RKPS_NAV_MORE.map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className="flex items-center justify-between rounded-xl px-3.5 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
                          onClick={() => setMobileOpen(false)}
                        >
                          <span>{item.label}</span>
                          <span className="text-white/40 text-xs">↗</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quick actions box */}
                <div className="rounded-2xl border border-white/15 bg-white/5 p-3.5 space-y-2.5">
                  <p className="text-[0.65rem] font-bold uppercase tracking-wider text-white/60">Help & Portal</p>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${RKPS_CONTACT.phone.replace(/\s/g, "")}`}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 py-2.5 text-xs font-semibold text-white hover:bg-white/20"
                    >
                      <svg className="h-3.5 w-3.5 text-[var(--brand-gold)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      Call Office
                    </a>
                    <Link
                      href={RKPS_HEADER_CTA.login.href}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 py-2.5 text-xs font-semibold text-white hover:bg-white/20"
                      onClick={() => setMobileOpen(false)}
                    >
                      <svg className="h-3.5 w-3.5 text-[var(--brand-gold)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      Portal Sign In
                    </Link>
                  </div>
                  <Link
                    href={RKPS_HEADER_CTA.enquire.href}
                    className="rkps-btn-gold w-full text-center py-2.5 text-xs"
                    onClick={() => setMobileOpen(false)}
                  >
                    Start Admission Enquiry ↗
                  </Link>
                </div>
              </div>
            </nav>
          ) : null}

          {/* Breadcrumb strip */}
          {breadcrumb && breadcrumb.length > 0 ? (
            <div className="border-t border-white/10 py-2 sm:py-2.5">
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 overflow-x-auto text-xs text-white/70 scrollbar-none">
                <Link href="/" className="inline-flex items-center gap-1 hover:text-[var(--brand-gold)] transition">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <span className="sr-only sm:not-sr-only">Home</span>
                </Link>
                {breadcrumb.slice(1).map((b, i) => (
                  <span key={`${b.label}-${i}`} className="inline-flex items-center gap-1.5">
                    <span className="text-white/35">/</span>
                    {b.href ? (
                      <Link href={b.href} className="hover:text-[var(--brand-gold)] transition font-medium">
                        {b.label}
                      </Link>
                    ) : (
                      <span className="font-semibold text-white rounded-md bg-white/10 px-2 py-0.5">
                        {b.label}
                      </span>
                    )}
                  </span>
                ))}
              </nav>
            </div>
          ) : null}
        </div>

        <RkpsNewsMarquee />
      </header>

      {/* Floating Bottom Quick Action Bar on Mobile Screens */}
      <RkpsMobileBottomBar />
    </>
  );
}

/** Sticky floating bottom navigation for mobile phones */
function RkpsMobileBottomBar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed bottom-0 inset-x-0 z-30 lg:hidden border-t border-white/15 bg-[var(--brand-maroon-dark)]/95 p-2 px-3 backdrop-blur-lg shadow-[0_-8px_25px_rgba(0,0,0,0.35)]"
      aria-label="Mobile quick actions"
    >
      <div className="mx-auto flex max-w-md items-center justify-around gap-1">
        <Link
          href="/"
          className={`flex flex-col items-center gap-0.5 rounded-lg px-2.5 py-1 text-[0.6875rem] font-semibold transition ${
            pathname === "/" ? "text-[var(--brand-gold)]" : "text-white/75 hover:text-white"
          }`}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
          <span>Home</span>
        </Link>

        <Link
          href="/school-life/events"
          className={`flex flex-col items-center gap-0.5 rounded-lg px-2.5 py-1 text-[0.6875rem] font-semibold transition ${
            pathname.startsWith("/school-life/events") ? "text-[var(--brand-gold)]" : "text-white/75 hover:text-white"
          }`}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          <span>Events</span>
        </Link>

        <Link
          href="/school-life/student-achievers"
          className={`flex flex-col items-center gap-0.5 rounded-lg px-2.5 py-1 text-[0.6875rem] font-semibold transition ${
            pathname.startsWith("/school-life/student-achievers") || pathname.startsWith("/school-life/achievements")
              ? "text-[var(--brand-gold)]"
              : "text-white/75 hover:text-white"
          }`}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.45 1-1 1H7v2h10v-2h-2c-.55 0-1-.45-1-1v-2.34" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
          </svg>
          <span>Achievers</span>
        </Link>

        <Link
          href="/#admissions"
          className="flex flex-col items-center gap-0.5 rounded-xl bg-[var(--brand-gold)] px-3 py-1 text-[0.6875rem] font-bold text-[var(--brand-maroon-dark)] shadow-md transition active:scale-95"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
          </svg>
          <span>Enquire</span>
        </Link>

        <a
          href={`tel:${RKPS_CONTACT.phone.replace(/\s/g, "")}`}
          className="flex flex-col items-center gap-0.5 rounded-lg px-2.5 py-1 text-[0.6875rem] font-semibold text-white/75 hover:text-white transition"
          aria-label="Call school office"
        >
          <svg className="h-4 w-4 text-[var(--brand-gold)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span>Call</span>
        </a>
      </div>
    </aside>
  );
}

function FooterLinkColumn({ title, links }: { title: string; links: readonly { label: string; href: string }[] }) {
  return (
    <div className="min-w-0">
      <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[var(--brand-gold)]">{title}</p>
      <ul className="mt-3 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            {l.href.startsWith("http") ? (
              <a
                href={l.href}
                className="group inline-flex max-w-full items-center gap-1.5 text-sm text-white/80 transition hover:text-white"
                target="_blank"
                rel="noreferrer"
              >
                <span className="truncate">{l.label}</span>
                <span className="shrink-0 text-[0.65rem] text-white/35 transition group-hover:text-[var(--brand-gold)]">↗</span>
              </a>
            ) : (
              <Link
                href={l.href}
                className="inline-block text-sm text-white/80 transition hover:translate-x-0.5 hover:text-white"
              >
                {l.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RkpsFooter({ prefooter }: { prefooter?: string }) {
  const telHref = `tel:${RKPS_CONTACT.phone.replace(/\s/g, "")}`;
  const { discover, families, more, stay } = RKPS_FOOTER.columns;

  return (
    <footer className="border-t-4 border-[var(--brand-gold)] bg-[var(--brand-maroon-dark)] text-white">
      {prefooter ? (
        <div className="border-b border-white/10 bg-[var(--brand-maroon)]">
          <div className="mx-auto max-w-3xl rkps-page-x py-8 text-center sm:py-10">
            <span aria-hidden className="mx-auto mb-3 block h-1 w-10 rounded-full bg-[var(--brand-gold)]" />
            <p className="text-base font-medium italic leading-relaxed text-white/95 sm:text-lg">{prefooter}</p>
          </div>
        </div>
      ) : null}

      <div className="relative mx-auto max-w-7xl rkps-page-x pb-[calc(5rem+env(safe-area-inset-bottom,0px))] pt-10 sm:pt-12 lg:pb-12">
        {/* Brand band */}
        <div className="rounded-[1.75rem] border border-white/12 bg-white/[0.05] p-6 sm:rounded-[2rem] sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="shrink-0 rounded-2xl border border-white/15 bg-white/10 p-2 sm:p-2.5">
                <Image
                  src={BRAND.crestSrc}
                  alt=""
                  width={72}
                  height={72}
                  className="h-14 w-14 object-contain sm:h-16 sm:w-16"
                />
              </div>
              <div className="min-w-0 pt-0.5">
                <p className="text-lg font-bold leading-snug tracking-tight text-white sm:text-xl lg:text-2xl">{BRAND.name}</p>
                <p className="mt-1 text-sm font-semibold italic text-[var(--brand-gold)]">{BRAND.motto}</p>
                <p className="mt-3 hidden max-w-md text-sm leading-relaxed text-white/75 sm:block">{RKPS_FOOTER.tagline}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap lg:max-w-sm lg:flex-col lg:items-stretch">
              <Link href={RKPS_HEADER_CTA.enquire.href} className="rkps-btn-gold w-full justify-center text-center text-xs sm:w-auto sm:text-sm">
                {RKPS_HEADER_CTA.enquire.label} ↗
              </Link>
              <div className="flex flex-wrap gap-2.5">
                <Link
                  href={RKPS_HEADER_CTA.login.href}
                  className="inline-flex flex-1 items-center justify-center rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/15 sm:flex-none sm:text-sm"
                >
                  {RKPS_HEADER_CTA.login.label}
                </Link>
                <a
                  href={telHref}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-xs font-semibold text-white/90 transition hover:border-[var(--brand-gold)]/50 hover:text-[var(--brand-gold)] sm:flex-none sm:text-sm"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  Call office
                </a>
              </div>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-white/75 sm:hidden">{RKPS_FOOTER.tagline}</p>
        </div>

        {/* Links + contact */}
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <div className="h-full rounded-2xl border border-white/12 bg-[var(--brand-maroon)]/40 p-5 sm:p-6">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-[var(--brand-gold)]">Visit & contact</p>
              <ul className="mt-4 space-y-3.5 text-sm">
                <li>
                  <a href={telHref} className="block font-semibold tabular-nums text-white transition hover:text-[var(--brand-gold)]">
                    {RKPS_CONTACT.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${RKPS_CONTACT.email}`}
                    className="block break-all text-white/85 transition hover:text-[var(--brand-gold)]"
                  >
                    {RKPS_CONTACT.email}
                  </a>
                </li>
                <li className="leading-relaxed text-white/75">{RKPS_CONTACT.visit}</li>
              </ul>
              <p className="mt-4 border-t border-white/10 pt-4 text-xs leading-relaxed text-white/60">
                <span className="font-semibold text-white/80">Office hours:</span> {RKPS_CONTACT.hours}
              </p>
              <Link
                href="/#contact"
                className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-[var(--brand-gold)]/40 bg-[var(--brand-gold)]/10 px-4 py-2.5 text-xs font-bold text-[var(--brand-gold)] transition hover:bg-[var(--brand-gold)]/20"
              >
                Plan a visit →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-9 sm:gap-x-8 lg:col-span-8 lg:grid-cols-4 lg:gap-y-8">
            <FooterLinkColumn title="Discover" links={discover} />
            <FooterLinkColumn title="For families" links={families} />
            <FooterLinkColumn title="School life" links={more} />
            <FooterLinkColumn title="Stay informed" links={stay} />
          </div>
        </div>

        <figure className="mt-10 rounded-2xl border border-[var(--brand-gold)]/25 bg-[var(--brand-gold)]/[0.08] px-6 py-7 text-center sm:px-10 sm:py-8">
          <blockquote className="mx-auto max-w-2xl text-base font-semibold italic leading-relaxed text-[var(--brand-gold)] sm:text-lg">
            &ldquo;{RKPS_FOOTER.closing}&rdquo;
          </blockquote>
        </figure>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="#privacy" className="transition hover:text-white/85">
              Privacy
            </Link>
            <Link href="#accessibility" className="transition hover:text-white/85">
              Accessibility
            </Link>
            <a
              href="https://www.instagram.com/r.k.m.p.s/"
              className="transition hover:text-[var(--brand-gold)]"
              target="_blank"
              rel="noreferrer"
            >
              Instagram ↗
            </a>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="font-semibold text-white/80 transition hover:text-[var(--brand-gold)]"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
