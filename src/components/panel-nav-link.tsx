"use client";

import Link from "next/link";
import { PanelNavIcon } from "@/components/panel-nav-icon";
import type { NavIconName } from "@/components/nav-icons";

type PanelNavLinkProps = {
  href: string;
  label: string;
  icon?: NavIconName;
  active: boolean;
};

export function PanelNavLink({ href, label, icon, active }: PanelNavLinkProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "bg-white/12 text-white"
          : "text-white/65 hover:bg-white/6 hover:text-white/90"
      }`}
    >
      <PanelNavIcon
        name={icon}
        className={`h-[1.125rem] w-[1.125rem] shrink-0 ${active ? "text-brand-gold" : "text-white/50"}`}
      />
      <span className="min-w-0 truncate">{label}</span>
    </Link>
  );
}
