"use client";

import Image from "next/image";
import { BRAND } from "@/config/branding";

type SchoolLoadingScreenProps = {
  message?: string;
  /** Full viewport overlay vs inline block */
  variant?: "fullscreen" | "inline";
};

export function SchoolLoadingScreen({
  message = "Loading…",
  variant = "fullscreen",
}: SchoolLoadingScreenProps) {
  const isFullscreen = variant === "fullscreen";

  return (
    <div
      className={
        isFullscreen
          ? "fixed inset-0 z-[200] flex flex-col items-center justify-center bg-brand-dark/55 backdrop-blur-[6px]"
          : "relative flex min-h-[50vh] flex-col items-center justify-center py-16"
      }
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={message}
    >
      {isFullscreen && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute left-1/2 top-1/2 h-[min(90vw,22rem)] w-[min(90vw,22rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/30 blur-3xl" />
          <div className="absolute -right-8 top-12 h-40 w-40 rounded-full bg-brand-gold/15 blur-3xl" />
        </div>
      )}

      <div className="relative flex flex-col items-center">
        <div className="relative animate-[login-float_4s_ease-in-out_infinite]">
          <div
            className="pointer-events-none absolute inset-0 scale-110 animate-[crest-glow_2.5s_ease-in-out_infinite] rounded-full bg-brand-gold/20 blur-2xl"
            aria-hidden
          />
          <Image
            src={BRAND.crestSrc}
            alt={BRAND.name}
            width={200}
            height={240}
            className={`relative object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.45)] ${
              isFullscreen ? "h-[min(42vw,11rem)] w-[min(50vw,13rem)]" : "h-28 w-32"
            }`}
            priority
          />
        </div>

        <p
          className={`mt-8 text-sm font-semibold tracking-wide ${
            isFullscreen ? "text-white drop-shadow-sm" : "text-heading"
          }`}
        >
          {message}
        </p>
        <div className="mt-4 flex gap-2" aria-hidden>
          <span
            className={`h-2 w-2 animate-bounce rounded-full [animation-delay:0ms] ${
              isFullscreen ? "bg-brand-gold" : "bg-brand"
            }`}
          />
          <span
            className={`h-2 w-2 animate-bounce rounded-full [animation-delay:150ms] ${
              isFullscreen ? "bg-brand-gold" : "bg-brand"
            }`}
          />
          <span
            className={`h-2 w-2 animate-bounce rounded-full [animation-delay:300ms] ${
              isFullscreen ? "bg-brand-gold" : "bg-brand"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
