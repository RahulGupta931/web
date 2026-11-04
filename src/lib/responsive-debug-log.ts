type ResponsiveDebugPayload = {
  location: string;
  message: string;
  data?: Record<string, unknown>;
  hypothesisId?: string;
  runId?: string;
};

/** Debug-session logging for responsive layout (session 79a4e5). */
export function logResponsiveDebug(payload: ResponsiveDebugPayload) {
  if (typeof window === "undefined") return;
  // #region agent log
  fetch("http://127.0.0.1:7244/ingest/f4e89965-64dd-43d5-9540-4d95fb316ec9", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "79a4e5" },
    body: JSON.stringify({
      sessionId: "79a4e5",
      timestamp: Date.now(),
      ...payload,
    }),
  }).catch(() => {});
  // #endregion
}

export function readResponsiveSnapshot(pathname: string) {
  const doc = document.documentElement;
  const vw = doc.clientWidth;
  const scrollW = doc.scrollWidth;
  const sm = window.matchMedia("(min-width: 640px)").matches;
  const md = window.matchMedia("(min-width: 768px)").matches;
  const lg = window.matchMedia("(min-width: 1024px)").matches;
  const xl = window.matchMedia("(min-width: 1280px)").matches;

  let bucket: "mobile" | "sm" | "tablet" | "desktop" | "wide" = "mobile";
  if (xl) bucket = "wide";
  else if (lg) bucket = "desktop";
  else if (md) bucket = "tablet";
  else if (sm) bucket = "sm";

  const panelSidebarVisible = lg;
  const panelBottomNavVisible = !lg;
  const rkpsDesktopNav = Boolean(
    document.querySelector('nav[aria-label="Primary"]')?.className.includes("lg:flex")
  );

  const offenders: { tag: string; right: number; left: number }[] = [];
  document.querySelectorAll("main *, .rkps-site *, .page-content *").forEach((el) => {
    const node = el as HTMLElement;
    if (node.closest(".rkps-marquee, .rkps-moving-cards-wrap, [class*='marquee']")) return;
    const r = node.getBoundingClientRect();
    if (r.width < 8) return;
    if (r.right > vw + 4 || r.left < -4) {
      const cls = node.className && typeof node.className === "string" ? node.className.split(" ")[0] : "";
      offenders.push({
        tag: `${node.tagName.toLowerCase()}${cls ? `.${cls}` : ""}`,
        right: Math.round(r.right),
        left: Math.round(r.left),
      });
    }
  });
  offenders.sort((a, b) => b.right - a.right);

  return {
    pathname,
    bucket,
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    vw,
    scrollW,
    hasHorizontalOverflow: scrollW > vw + 1,
    breakpoints: { sm, md, lg, xl },
    panelSidebarVisible,
    panelBottomNavVisible,
    rkpsUsesMobileMenu: !lg,
    rkpsDesktopNavInDom: rkpsDesktopNav,
    overflowOffenders: offenders.slice(0, 5),
  };
}
