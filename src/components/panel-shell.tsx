"use client";

import Link from "next/link";
import { SchoolBrand } from "./school-brand";
import { useAuth } from "./auth-provider";

export function PanelShell({
  title,
  children,
  fullWidth = false,
}: {
  title: string;
  children: React.ReactNode;
  /** Use full viewport width (no max-width column). */
  fullWidth?: boolean;
}) {
  const { user, logout } = useAuth();
  const headerInner = fullWidth
    ? "flex w-full flex-wrap items-center justify-between gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4"
    : "mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:py-4";
  const mainClass = fullWidth
    ? "page-content w-full max-w-none px-0 py-4 sm:py-6"
    : "page-content mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-8";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-[var(--border)] bg-gradient-to-r from-brand-dark via-brand to-brand-dark shadow-md">
        <div className={headerInner}>
          <div className="flex min-w-0 flex-wrap items-center gap-4 sm:gap-6">
            <SchoolBrand size="sm" href="/" showTagline={false} tone="onBrand" />
            <div className="hidden border-l border-white/25 pl-4 sm:block">
              <h1 className="text-lg font-semibold text-white">{title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm sm:gap-4">
            <span className="hidden max-w-[40vw] truncate text-white/85 sm:inline md:max-w-none">
              {user?.email}
            </span>
            <span className="badge-role !bg-white/15 !text-white">{user?.role}</span>
            <Link href="/" className="font-medium text-white/85 hover:text-brand-gold">Home</Link>
            <button
              type="button"
              onClick={() => logout()}
              className="rounded-lg border border-white/25 bg-white/10 px-2.5 py-1 text-sm text-white hover:bg-white/20 sm:px-3 sm:py-1.5"
            >
              Logout
            </button>
          </div>
        </div>
        <p className="border-t border-white/10 px-3 py-2 text-center text-sm font-medium text-white sm:px-4 sm:hidden">
          {title}
        </p>
      </header>
      <main className={mainClass}>{children}</main>
    </div>
  );
}
