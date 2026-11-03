"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { NavItem } from "@/components/panel-layout";
import { PanelNavIcon } from "@/components/panel-nav-icon";
import type { NavIconName } from "@/components/nav-icons";
import { isNavItemActive } from "@/lib/nav-utils";

function NavIcon({ name, className }: { name?: NavIconName; className?: string }) {
  return <PanelNavIcon name={name} className={className ?? "h-5 w-5"} />;
}

export function MobileBottomNav({ nav }: { nav: NavItem[] }) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const dockItems = nav.filter((n) => n.mobileDock);
  const moreItems = nav.filter((n) => !n.mobileDock);

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoreOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moreOpen]);

  const moreActive = moreItems.some((item) => isNavItemActive(pathname, item.href));

  return (
    <>
      {moreOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMoreOpen(false)}
        />
      )}

      <div
        className={`fixed inset-x-0 bottom-0 z-50 max-h-[min(70vh,480px)] overflow-hidden rounded-t-2xl border border-border bg-surface shadow-[0_-8px_30px_rgb(15_23_42/0.12)] transition-transform duration-300 ease-out lg:hidden ${
          moreOpen ? "translate-y-0" : "translate-y-full pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!moreOpen}
        aria-label="More navigation"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-semibold text-heading">More</p>
          <button
            type="button"
            onClick={() => setMoreOpen(false)}
            className="rounded-lg px-2 py-1 text-sm font-medium text-brand"
          >
            Done
          </button>
        </div>
        <nav className="grid grid-cols-3 gap-1 p-3 pb-6 sm:grid-cols-4" aria-label="More links">
          {moreItems.map((item) => {
            const active = isNavItemActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMoreOpen(false)}
                className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-center text-[0.6875rem] font-medium leading-tight ${
                  active ? "text-brand" : "text-muted"
                }`}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    active ? "bg-brand/10 text-brand" : "bg-surface-muted text-heading"
                  }`}
                >
                  <NavIcon name={item.icon} />
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-md lg:hidden"
        aria-label="Main navigation"
      >
        <div className="mx-auto flex max-w-lg items-stretch justify-around">
          {dockItems.map((item) => {
            const active = isNavItemActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-1 text-[0.625rem] font-medium ${
                  active ? "text-brand" : "text-muted"
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    active ? "bg-brand/10" : ""
                  }`}
                >
                  <NavIcon name={item.icon} className="h-[1.2rem] w-[1.2rem]" />
                </span>
                <span className="truncate max-w-full">{item.shortLabel ?? item.label}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreOpen((o) => !o)}
            className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-1 text-[0.625rem] font-medium ${
              moreActive || moreOpen ? "text-brand" : "text-muted"
            }`}
            aria-expanded={moreOpen}
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                moreActive || moreOpen ? "bg-brand/10" : ""
              }`}
            >
              <NavIcon name="grid" className="h-[1.2rem] w-[1.2rem]" />
            </span>
            More
          </button>
        </div>
      </nav>
    </>
  );
}
