"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useMediaQuery } from "@/lib/use-media-query";

/** Desktop (lg+) vs mobile panel layouts — mounts one branch after hydration to avoid duplicate forms/state. */
export function PanelResponsive({
  desktop,
  mobile,
}: {
  desktop: ReactNode;
  mobile: ReactNode;
}) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <>
        <div className="hidden space-y-6 lg:block">{desktop}</div>
        <div className="space-y-4 lg:hidden">{mobile}</div>
      </>
    );
  }

  if (isDesktop) {
    return <div className="space-y-6">{desktop}</div>;
  }
  return <div className="space-y-4">{mobile}</div>;
}
