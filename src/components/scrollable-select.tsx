"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";

export type ScrollableSelectOption = { value: string; label: string };

export function ScrollableSelect({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = "Choose…",
  className = "",
}: {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: ScrollableSelectOption[];
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [menuRect, setMenuRect] = useState<{ top: number; left: number; width: number; maxHeight: number } | null>(
    null
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  const selected = options.find((o) => o.value === value);
  const display = selected?.label ?? (value === "" ? placeholder : value);

  const updateMenuPosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const r = trigger.getBoundingClientRect();
    const gap = 4;
    const margin = 12;
    const spaceBelow = window.innerHeight - r.bottom - margin;
    const spaceAbove = r.top - margin;
    const preferred = Math.min(256, Math.max(spaceBelow, spaceAbove) - gap);
    const maxHeight = Math.max(120, preferred);
    const openAbove = spaceBelow < 160 && spaceAbove > spaceBelow;
    const top = openAbove ? Math.max(margin, r.top - maxHeight - gap) : r.bottom + gap;
    setMenuRect({ top, left: r.left, width: r.width, maxHeight });
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setMenuRect(null);
      return;
    }
    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);
    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [open, updateMenuPosition, options.length]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent | TouchEvent) {
      const root = rootRef.current;
      const target = e.target as Node;
      if (root?.contains(target)) return;
      const menu = document.getElementById(listId);
      if (menu?.contains(target)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, listId]);

  return (
    <div ref={rootRef} className={className}>
      {label ? (
        <span id={id ? `${id}-label` : undefined} className="text-muted">
          {label}
        </span>
      ) : null}
      <button
        ref={triggerRef}
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        className="input-field mt-1 flex w-full items-center justify-between gap-2 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="min-w-0 truncate">{display}</span>
        <span className="shrink-0 text-xs text-muted" aria-hidden>▼</span>
      </button>

      {open && menuRect && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-transparent"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <ul
            role="listbox"
            id={listId}
            className="fixed z-[70] overflow-y-auto overscroll-contain rounded-lg border border-border bg-surface py-1 shadow-lg"
            style={{
              top: menuRect.top,
              left: menuRect.left,
              width: menuRect.width,
              maxHeight: menuRect.maxHeight,
            }}
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <li key={opt.value || "__empty"} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`block w-full px-3 py-2.5 text-left text-sm leading-snug ${
                      isSelected
                        ? "bg-brand/10 font-semibold text-brand"
                        : "text-heading hover:bg-surface-muted active:bg-surface-muted"
                    }`}
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                  >
                    {opt.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
