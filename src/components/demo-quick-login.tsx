"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useNavigationLoading } from "@/components/navigation-loading-provider";
import { PanelAlerts } from "@/components/panel-alerts";
import { DEMO_LOGIN_GROUPS, DEMO_LOGIN_HINT } from "@/config/demo-logins";
import { getApiErrorMessage } from "@/lib/api";

type DemoQuickLoginProps = {
  variant?: "card" | "section";
  /** Collapsed by default — keeps login form primary on small screens */
  collapsible?: boolean;
  disabled?: boolean;
};

export function DemoQuickLogin({
  variant = "card",
  collapsible = false,
  disabled = false,
}: DemoQuickLoginProps) {
  const { login } = useAuth();
  const { startNavigation } = useNavigationLoading();
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function quickSignIn(id: string, email: string, password: string) {
    setError(null);
    setBusyId(id);
    try {
      const redirectTo = await login(email, password);
      startNavigation();
      router.push(redirectTo);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  const isSection = variant === "section";
  const isBusy = disabled || busyId !== null;

  const groups = (
    <div className={isSection ? "mt-5 space-y-5 sm:mt-6 sm:space-y-6" : "mt-3 space-y-4"}>
      {DEMO_LOGIN_GROUPS.map((group) => (
        <div key={group.title}>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">{group.title}</p>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {group.entries.map((entry) => (
              <button
                key={entry.id}
                type="button"
                disabled={isBusy}
                onClick={() => quickSignIn(entry.id, entry.email, entry.password)}
                className="rounded-xl border border-[var(--border)] bg-surface px-3 py-2.5 text-left text-xs leading-snug text-foreground shadow-sm transition hover:border-brand hover:bg-[var(--surface-muted)] disabled:opacity-50 sm:text-sm"
              >
                {busyId === entry.id ? "Signing in…" : entry.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  if (collapsible) {
    return (
      <details
        id="demo-login"
        className="mt-6 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/35 open:bg-surface"
      >
        <summary
          className="cursor-pointer list-none px-4 py-3.5 text-sm font-semibold text-heading [&::-webkit-details-marker]:hidden"
        >
          <span className="flex items-center justify-between gap-2">
            Demo quick sign-in
            <span className="shrink-0 text-xs font-normal text-muted">Expand</span>
          </span>
        </summary>
        <div className="border-t border-[var(--border)] px-4 pb-4 pt-2">
          <p className="text-xs text-muted">{DEMO_LOGIN_HINT}</p>
          <PanelAlerts error={error} errorTitle="Demo sign-in failed" />
          <div className="max-h-[min(42vh,16rem)] overflow-y-auto pr-1 lg:max-h-[min(50vh,20rem)]">
            {groups}
          </div>
        </div>
      </details>
    );
  }

  return (
    <div
      id="demo-login"
      className={
        isSection
          ? "card-panel form-shell"
          : "mt-6 border-t border-[var(--border)] pt-6 sm:mt-8"
      }
    >
      <h2 className={isSection ? "text-xl font-semibold text-heading" : "text-sm font-semibold text-foreground"}>
        Demo quick sign-in
      </h2>
      <p className="mt-1 text-xs text-muted">{DEMO_LOGIN_HINT}</p>
      <PanelAlerts error={error} errorTitle="Demo sign-in failed" />
      {groups}
    </div>
  );
}
