"use client";

import { useEffect, useSyncExternalStore } from "react";
import { logResponsiveDebug } from "@/lib/responsive-debug-log";

function subscribe(query: string, onStoreChange: () => void) {
  const mq = window.matchMedia(query);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getServerSnapshot() {
  return false;
}

export function useMediaQuery(query: string): boolean {
  const matches = useSyncExternalStore(
    (onStoreChange) => subscribe(query, onStoreChange),
    () => window.matchMedia(query).matches,
    getServerSnapshot
  );

  useEffect(() => {
    // #region agent log
    logResponsiveDebug({
      location: "use-media-query.ts:sync",
      message: "media-query-snapshot",
      hypothesisId: "A",
      data: { query, matches, innerWidth: window.innerWidth },
    });
    // #endregion
  }, [query, matches]);

  return matches;
}
