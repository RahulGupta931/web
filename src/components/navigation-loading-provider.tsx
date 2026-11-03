"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { SchoolLoadingScreen } from "@/components/school-loading-screen";

type NavigationLoadingContextValue = {
  startNavigation: () => void;
};

const NavigationLoadingContext = createContext<NavigationLoadingContextValue | null>(null);

function isInternalNavHref(href: string, pathname: string): boolean {
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }
  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    const currentSearch = window.location.search;
    if (url.pathname === pathname && url.search === currentSearch) return false;
    return true;
  } catch {
    return false;
  }
}

export function NavigationLoadingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [navigating, setNavigating] = useState(false);
  const pathnameRef = useRef(pathname);

  const startNavigation = useCallback(() => {
    setNavigating(true);
  }, []);

  useEffect(() => {
    pathnameRef.current = pathname;
    setNavigating(false);
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const href = anchor.getAttribute("href");
      if (!href || !isInternalNavHref(href, pathnameRef.current)) return;
      setNavigating(true);
    };

    const onPopState = () => setNavigating(true);

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  useEffect(() => {
    if (!navigating) return;
    const timeout = window.setTimeout(() => setNavigating(false), 20000);
    return () => window.clearTimeout(timeout);
  }, [navigating]);

  return (
    <NavigationLoadingContext.Provider value={{ startNavigation }}>
      {children}
      {navigating && <SchoolLoadingScreen message="Loading page…" />}
    </NavigationLoadingContext.Provider>
  );
}

export function useNavigationLoading() {
  const ctx = useContext(NavigationLoadingContext);
  if (!ctx) {
    return { startNavigation: () => {} };
  }
  return ctx;
}
