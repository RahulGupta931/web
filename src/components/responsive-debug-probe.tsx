"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { logResponsiveDebug, readResponsiveSnapshot } from "@/lib/responsive-debug-log";

/**
 * Captures viewport + overflow signals on route change and resize (debug session 79a4e5).
 */
export function ResponsiveDebugProbe() {
  const pathname = usePathname();
  const lastKey = useRef("");

  useEffect(() => {
    const emit = (reason: string, hypothesisId: string) => {
      const snapshot = readResponsiveSnapshot(pathname);
      const key = `${pathname}|${snapshot.vw}|${snapshot.bucket}|${snapshot.hasHorizontalOverflow}`;
      if (key === lastKey.current && reason === "resize") return;
      lastKey.current = key;
      logResponsiveDebug({
        location: "responsive-debug-probe.tsx:emit",
        message: reason,
        hypothesisId,
        data: snapshot,
      });
    };

    emit("route-or-mount", "C");
    const onResize = () => emit("resize", "C");
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [pathname]);

  return null;
}
