"use client";

import { type ReactNode, useEffect } from "react";

export type CenterDialogVariant = "success" | "error";

export function CenterDialog({
  open,
  title,
  children,
  onClose,
  confirmLabel = "OK",
  variant = "success",
}: {
  open: boolean;
  title: string;
  children?: ReactNode;
  onClose: () => void;
  confirmLabel?: string;
  variant?: CenterDialogVariant;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const isError = variant === "error";
  const iconWrap = isError ? "bg-red-500/15 text-red-700" : "bg-emerald-500/15 text-emerald-700";

  return (
    <>
      <button
        type="button"
        aria-label="Close dialog"
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        className="fixed left-1/2 top-1/2 z-[101] w-[min(100%-2rem,22rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-surface p-6 shadow-[0_24px_48px_rgb(15_23_42/0.18)]"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="center-dialog-title"
        aria-describedby={children ? "center-dialog-desc" : undefined}
      >
        <div
          className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${iconWrap}`}
          aria-hidden
        >
          {isError ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <h2 id="center-dialog-title" className="text-center text-lg font-semibold text-heading">
          {title}
        </h2>
        {children ? (
          <div id="center-dialog-desc" className="mt-2 text-center text-sm text-muted">{children}</div>
        ) : null}
        <button type="button" onClick={onClose} className="btn-primary mt-6 w-full text-sm">
          {confirmLabel}
        </button>
      </div>
    </>
  );
}
