"use client";

import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/config/branding";
import { formatPortalRole } from "@/lib/nav-utils";

type PanelTopbarProps = {
  panelTitle: string;
  pageTitle: string;
  role?: string | null;
  onLogout: () => void;
};

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

export function PanelTopbar({ panelTitle, pageTitle, role, onLogout }: PanelTopbarProps) {
  const roleLabel = formatPortalRole(role);

  return (
    <header className="panel-topbar sticky top-0 z-20 border-b border-border">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-5 lg:h-[3.25rem] lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center rounded-lg p-0.5 transition hover:bg-surface-muted lg:hidden"
          aria-label="Home"
        >
          <Image
            src={BRAND.crestSrc}
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.6875rem] font-medium text-muted lg:text-xs">{panelTitle}</p>
          <h1 className="truncate text-base font-semibold tracking-tight text-heading lg:text-lg">
            {pageTitle}
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="badge-role hidden sm:inline-flex lg:hidden">{roleLabel}</span>

          <button
            type="button"
            onClick={() => onLogout()}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-muted transition hover:border-brand/30 hover:bg-brand/5 hover:text-brand lg:hidden"
            aria-label="Sign out"
          >
            <LogoutIcon className="h-[1.125rem] w-[1.125rem]" />
          </button>
        </div>
      </div>
    </header>
  );
}
