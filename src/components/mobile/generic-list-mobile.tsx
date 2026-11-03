"use client";

import { MobileEmptyState } from "@/components/mobile/mobile-primitives";

export function MobileRecordCards({
  items,
  emptyMessage = "Nothing to show yet.",
  onItemClick,
  selectedItemId,
}: {
  items: { id?: string; title: string; subtitle?: string; meta?: string; badge?: string }[];
  emptyMessage?: string;
  onItemClick?: (id: string) => void;
  selectedItemId?: string | null;
}) {
  if (items.length === 0) return <MobileEmptyState message={emptyMessage} />;
  return (
    <ul className="space-y-2">
      {items.map((item, i) => {
        const active = item.id != null && selectedItemId === item.id;
        return (
        <li
          key={item.id ?? i}
          className={`rounded-2xl border bg-surface px-4 py-3 shadow-sm ${
            onItemClick ? "cursor-pointer transition active:scale-[0.99]" : ""
          } ${active ? "border-brand ring-2 ring-brand/20" : "border-border"}`}
          onClick={item.id && onItemClick ? () => onItemClick(item.id!) : undefined}
          onKeyDown={
            item.id && onItemClick
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onItemClick(item.id!);
                  }
                }
              : undefined
          }
          role={onItemClick && item.id ? "button" : undefined}
          tabIndex={onItemClick && item.id ? 0 : undefined}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-heading">{item.title}</p>
            {item.badge && (
              <span className="shrink-0 rounded-full bg-brand/10 px-2 py-0.5 text-[0.65rem] font-semibold text-brand">
                {item.badge}
              </span>
            )}
          </div>
          {item.subtitle && <p className="mt-1 text-sm text-muted">{item.subtitle}</p>}
          {item.meta && <p className="mt-1 text-xs text-muted">{item.meta}</p>}
        </li>
        );
      })}
    </ul>
  );
}
