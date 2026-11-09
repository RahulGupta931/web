"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { BRAND } from "@/config/branding";
import { RKPS_CONTACT, RKPS_HEADER_CTA, RKPS_NAV_MORE, RKPS_NAV_PRIMARY } from "@/content/website/rkps-copy";
import { RkpsNewsMarquee } from "@/components/marketing/rkps/rkps-motion-sections";

function routeNavIsActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
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
    "relative whitespace-nowrap px-3 py-1.5 text-sm font-medium transition-colors duration-150",
    active
      ? "text-white after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-[var(--brand-gold)]"
      : "text-white/75 hover:text-white",
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

  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    // Close when keyboard focus leaves the panel (Tab past the last link).
    function onFocusIn(e: FocusEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [open]);

  return (
    <div className="relative shrink-0" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        id={triggerId}
        onClick={() => setOpen((v) => !v)}
        className={`${navLinkClass(open)} flex shrink-0 items-center gap-1.5`}
        aria-expanded={open}
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
          aria-labelledby={triggerId}
          className={`rkps-dropdown-in absolute top-full z-[100] mt-3 w-80 overflow-hidden rounded-2xl border border-black/5 bg-white p-2 text-[var(--rkps-text-body)] shadow-[0_24px_60px_-12px_rgba(41,51,61,0.35)] ${
            panelAlign === "left" ? "left-0" : "right-0"
          }`}
        >
          <p className="px-3 pb-1 pt-2 text-xs text-muted">More from the school</p>
          <ul className="space-y-0.5">
            {RKPS_NAV_MORE.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150 hover:bg-[var(--surface-muted)] focus-visible:bg-[var(--surface-muted)] focus-visible:outline-none"
                  onClick={() => setOpen(false)}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-heading">{item.label}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-muted">{item.description}</span>
                  </span>
                  <span
                    className="mt-0.5 text-brand opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
                    aria-hidden
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
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
      <header className="sticky top-0 z-40 overflow-visible border-b border-[color-mix(in_srgb,var(--rkps-gold)_35%,transparent)] bg-[var(--rkps-burgundy)]/95 text-[var(--rkps-text-on-primary)] backdrop-blur-md shadow-[0_8px_30px_rgb(143_1_3_/_0.18)]">
        <div className="mx-auto max-w-7xl rkps-page-x">
          <div className="flex h-16 items-center justify-between gap-3 sm:h-[4.5rem]">
            {/* Logo + School Info */}
            <Link
              href="/"
              className="group flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3 lg:flex-none"
              aria-label="R.K. Memorial Public School Home"
            >
              <Image
                src={BRAND.logoSrc}
                alt=""
                width={72}
                height={60}
                className="h-10 w-auto shrink-0 object-contain sm:h-12"
                priority
              />
              <div className="min-w-0 leading-tight">
                <p className="truncate text-base font-medium tracking-tight text-white">
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
              <div className="flex max-w-full items-center gap-1 overflow-x-auto scrollbar-none">
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
              </div>
              {/* Kept outside the scrolling row: overflow-x-auto also clips vertically, which hid the panel. */}
              <MoreNavDropdown panelAlign="right" />
            </nav>

            {/* Right CTAs */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
              {/* Phone quick call on mobile header */}
              <a
                href={`tel:${RKPS_CONTACT.phone.replace(/\s/g, "")}`}
                aria-label={`Call office at ${RKPS_CONTACT.phone}`}
                className="grid h-9 w-9 place-items-center rounded-[10px] text-white/80 transition-colors hover:text-white sm:hidden"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </a>

              <Link
                href={RKPS_HEADER_CTA.login.href}
                className="hidden text-sm text-white/75 transition-colors hover:text-white md:inline"
              >
                <span className="xl:hidden">Portal login</span>
                <span className="hidden xl:inline">{RKPS_HEADER_CTA.login.label}</span>
              </Link>

              <Link
                href={RKPS_HEADER_CTA.enquire.href}
                className="rkps-btn-gold rkps-btn-sm"
              >
                {RKPS_HEADER_CTA.enquire.label}
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
                  <p className="px-3 pb-2 text-xs text-white/55">
                    Main pages
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
                  <p className="px-3 pb-2 text-xs text-white/55">
                    Explore and campus life
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
                          <span className="text-white/40">›</span>
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
                    className="rkps-btn-gold rkps-btn-sm w-full justify-center text-center"
                    onClick={() => setMobileOpen(false)}
                  >
                    Start admission enquiry
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
      className="fixed bottom-0 inset-x-0 z-30 lg:hidden border-t border-[color-mix(in_srgb,var(--rkps-gold)_30%,transparent)] bg-[var(--rkps-burgundy)]/95 p-2 px-3 backdrop-blur-lg shadow-[0_-8px_25px_rgb(143_1_3_/_0.25)]"
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

export { RkpsFooter } from "@/components/marketing/rkps/rkps-footer";
