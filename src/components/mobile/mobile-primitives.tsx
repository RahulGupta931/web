"use client";

import type { ReactNode } from "react";

export function MobilePageHero({
  kicker,
  title,
  subtitle,
  children,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <section
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand-light px-4 py-5 text-white shadow-[var(--shadow-card)]"
    >
      <div className="pointer-events-none absolute -right-8 top-0 h-28 w-28 rounded-full bg-brand-gold/25 blur-2xl" />
      <div className="pointer-events-none absolute -left-6 bottom-0 h-20 w-20 rounded-full bg-white/10 blur-2xl" />
      <p className="relative text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">{kicker}</p>
      <h2 className="relative mt-1 text-xl font-bold leading-tight">{title}</h2>
      {subtitle && <p className="relative mt-1.5 text-sm text-white/85">{subtitle}</p>}
      {children && <div className="relative mt-4">{children}</div>}
    </section>
  );
}

export function MobileFilterChips<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.label}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition active:scale-95 ${
              active
                ? "bg-brand text-white shadow-sm"
                : "border border-border bg-surface text-muted"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/** 2×2 summary tiles (mockup-style maroon figures) */
export function MobileSummaryStats({
  items,
}: {
  items: { label: string; value: string | number }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-border bg-surface px-3 py-3.5 shadow-[var(--shadow-card)]"
        >
          <p className="text-2xl font-bold tabular-nums text-brand">{item.value}</p>
          <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-wide text-muted">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}

export function MobileEmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface/80 px-4 py-10 text-center">
      <p className="text-sm text-muted">{message}</p>
    </div>
  );
}

export function MobileBottomSheet({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <>
      <button
        type="button"
        aria-label="Close"
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] lg:hidden"
        onClick={onClose}
      />
      <div
        className="fixed inset-x-0 bottom-0 z-50 flex max-h-[min(92vh,900px)] flex-col rounded-t-3xl border-t border-border bg-surface shadow-[0_-16px_48px_rgb(15_23_42/0.15)] lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-[var(--border)]" aria-hidden />
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-base font-semibold text-heading">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-1.5 text-sm font-semibold text-brand">
            Close
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {children}
        </div>
      </div>
    </>
  );
}

export function statusTone(status: string): string {
  const s = status.toUpperCase();
  if (s === "PRESENT" || s === "APPROVED" || s === "ACTIVE") return "bg-emerald-500/15 text-emerald-800";
  if (s === "ABSENT" || s === "REJECTED") return "bg-red-500/15 text-red-800";
  if (s === "LATE" || s === "HALF_DAY" || s === "PENDING" || s === "RETURNED") {
    return "bg-brand-gold/20 text-brand-dark";
  }
  if (s === "LEAVE_APPROVED" || s === "CASUAL" || s === "SICK") return "bg-sky-500/15 text-sky-900";
  return "bg-surface-muted text-muted";
}
