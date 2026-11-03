/** Panel home routes — match exactly, not as a prefix of deeper paths */
export const PANEL_HOME_HREFS = new Set(["/principal", "/teacher", "/student"]);

export function isNavItemActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  if (PANEL_HOME_HREFS.has(href)) return false;
  return pathname.startsWith(`${href}/`);
}

export function formatPortalRole(role?: string | null): string {
  if (!role) return "User";
  return role
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function userInitialsFromEmail(email?: string | null): string {
  if (!email) return "?";
  const local = email.split("@")[0] ?? "";
  const parts = local.split(/[._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
  }
  return local.slice(0, 2).toUpperCase() || "?";
}
