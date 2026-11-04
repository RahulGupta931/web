"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useEffect } from "react";
import { BRAND } from "@/config/branding";
import { useAuth } from "./auth-provider";
import { MobileBottomNav } from "./mobile-bottom-nav";
import type { NavIconName } from "./nav-icons";
import { PanelNavLink } from "./panel-nav-link";
import { PanelTopbar } from "./panel-topbar";
import { formatPortalRole, isNavItemActive, userInitialsFromEmail } from "@/lib/nav-utils";
import { logResponsiveDebug } from "@/lib/responsive-debug-log";

export type NavItem = {
  href: string;
  label: string;
  /** Shorter label for mobile dock */
  shortLabel?: string;
  icon?: NavIconName;
  /** Show in mobile bottom dock (up to 4 recommended) */
  mobileDock?: boolean;
};

export function PanelLayout({
  title,
  nav,
  children,
}: {
  title: string;
  nav: NavItem[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const activePageTitle = useMemo(() => {
    const match = nav.find((item) => isNavItemActive(pathname, item.href));
    return match?.label ?? "Dashboard";
  }, [nav, pathname]);

  const initials = userInitialsFromEmail(user?.email);

  useEffect(() => {
    const lg = window.matchMedia("(min-width: 1024px)").matches;
    // #region agent log
    logResponsiveDebug({
      location: "panel-layout.tsx:render",
      message: "panel-layout-chrome",
      hypothesisId: "B",
      data: {
        pathname,
        lg,
        sidebarCss: "hidden lg:flex",
        bottomNavCss: "lg:hidden",
        mainPadding: "pb-[4.75rem] lg:pb-0",
      },
    });
    // #endregion
  }, [pathname]);

  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground lg:pl-64">
      <aside
        className="panel-sidebar hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:h-screen lg:w-64 lg:flex-col lg:border-r lg:border-black/20"
        aria-label="School portal navigation"
      >
        <div className="shrink-0 border-b border-white/10 px-4 py-4">
          <Link href="/" className="flex items-center gap-3 rounded-xl transition hover:opacity-95">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
              <Image
                src={BRAND.crestSrc}
                alt=""
                width={36}
                height={36}
                className="h-8 w-8 object-contain"
              />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold leading-tight text-white">{BRAND.shortName}</p>
              <p className="truncate text-xs text-white/55">{title}</p>
            </div>
          </Link>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-3" aria-label="Panel navigation">
          {nav.map((item) => (
            <PanelNavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={isNavItemActive(pathname, item.href)}
            />
          ))}
        </nav>

        <div className="shrink-0 border-t border-white/10 p-3">
          <div className="flex items-center gap-2.5 rounded-xl px-2 py-2">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gold/90 text-xs font-bold text-brand-dark"
              aria-hidden
            >
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-white/90">{user?.email}</p>
              <p className="text-[0.65rem] text-white/50">{formatPortalRole(user?.role)}</p>
            </div>
          </div>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <Link
              href="/"
              className="rounded-lg border border-white/12 py-2 text-center text-xs font-medium text-white/80 transition hover:bg-white/8 hover:text-white"
            >
              Home
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="rounded-lg bg-white/12 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      <MobileBottomNav nav={nav} />

      <div className="flex min-h-screen min-w-0 flex-col pb-[4.75rem] lg:pb-0">
        <PanelTopbar
          panelTitle={title}
          pageTitle={activePageTitle}
          role={user?.role}
          onLogout={logout}
        />
        <main className="panel-main flex-1 px-4 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
          <div className="page-content mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
