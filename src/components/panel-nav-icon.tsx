"use client";

import { navIcons, type NavIconName } from "@/components/nav-icons";

export function PanelNavIcon({
  name,
  className,
}: {
  name?: NavIconName;
  className?: string;
}) {
  const Icon = name ? navIcons[name] : navIcons.grid;
  return <Icon className={className ?? "h-[1.125rem] w-[1.125rem]"} />;
}
