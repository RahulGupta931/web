import Link from "next/link";
import type { NavIconName } from "@/components/nav-icons";
import { navIcons } from "@/components/nav-icons";

export function DashboardHero({
  greeting,
  title,
  subtitle,
  accent = "student",
}: {
  greeting: string;
  title: string;
  subtitle?: string;
  accent?: "student" | "teacher" | "principal";
}) {
  const gradient =
    accent === "teacher"
      ? "from-brand via-brand-light to-brand-dark"
      : accent === "principal"
        ? "from-brand-dark via-brand to-brand-light"
        : "from-brand-light via-brand to-brand-dark";

  return (
    <section
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-5 text-white shadow-[var(--shadow-card)] sm:p-6`}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-gold/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 left-1/3 h-24 w-24 rounded-full bg-white/10 blur-xl" />
      <p className="text-xs font-medium uppercase tracking-widest text-brand-gold/95">{greeting}</p>
      <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
      {subtitle && <p className="mt-2 text-sm text-white/85">{subtitle}</p>}
    </section>
  );
}

export function QuickActionGrid({
  actions,
}: {
  actions: { href: string; label: string; icon: NavIconName; hint?: string }[];
}) {
  return (
    <section aria-label="Quick actions">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Quick actions</h3>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {actions.map((a) => {
          const Icon = navIcons[a.icon];
          return (
            <Link
              key={a.href}
              href={a.href}
              className="group flex flex-col gap-2 rounded-xl border border-border bg-surface p-3 shadow-[var(--shadow-card)] transition hover:border-brand/30 hover:shadow-[var(--shadow-card-hover)]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand transition group-hover:bg-brand group-hover:text-white">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold text-heading">{a.label}</span>
              {a.hint && <span className="text-[0.65rem] text-muted">{a.hint}</span>}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function NoticeFeed({
  title = "Recent notices",
  items,
  href,
}: {
  title?: string;
  items: { title: string; createdAt?: string }[];
  href: string;
}) {
  return (
    <section className="card-panel overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-heading">{title}</h3>
        <Link href={href} className="text-xs font-medium text-brand">View all</Link>
      </div>
      <ul className="divide-y divide-border">
        {items.length === 0 ? (
          <li className="px-4 py-6 text-center text-sm text-muted">Nothing new right now.</li>
        ) : (
          items.slice(0, 4).map((n, i) => (
            <li key={i} className="flex gap-3 px-4 py-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-gold" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-heading">{n.title}</p>
                {n.createdAt && (
                  <p className="text-xs text-muted">{new Date(n.createdAt).toLocaleDateString()}</p>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

export function ScheduleTimeline({
  title,
  items,
  empty,
}: {
  title: string;
  items: { primary: string; secondary?: string; meta?: string }[];
  empty: string;
}) {
  return (
    <section className="card-panel p-4 sm:p-5">
      <h3 className="text-sm font-semibold text-heading">{title}</h3>
      <ul className="mt-4 space-y-0">
        {items.length === 0 ? (
          <li className="empty-state !py-6">{empty}</li>
        ) : (
          items.map((item, i) => (
            <li key={i} className="relative flex gap-3 pb-4 last:pb-0">
              {i < items.length - 1 && (
                <span className="absolute left-[0.4rem] top-6 bottom-0 w-px bg-border" aria-hidden />
              )}
              <span className="relative z-[1] mt-1 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-brand bg-surface" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-heading">{item.primary}</p>
                {item.secondary && <p className="text-sm text-muted">{item.secondary}</p>}
                {item.meta && <p className="mt-0.5 text-xs text-muted">{item.meta}</p>}
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

export function StatRing({
  label,
  value,
  tone = "brand",
}: {
  label: string;
  value: string | number;
  tone?: "brand" | "gold" | "muted";
}) {
  const ring =
    tone === "gold" ? "border-brand-gold text-brand-gold" : tone === "muted" ? "border-border text-muted" : "border-brand text-brand";
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface p-3 text-center shadow-[var(--shadow-card)]">
      <div className={`flex h-14 w-14 items-center justify-center rounded-full border-[3px] ${ring}`}>
        <span className="text-lg font-bold tabular-nums text-heading">{value}</span>
      </div>
      <p className="text-[0.65rem] font-medium uppercase tracking-wide text-muted">{label}</p>
    </div>
  );
}

export function timeGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
