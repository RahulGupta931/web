"use client";

import type { ReactNode } from "react";
import { PageHeader } from "@/components/page-header";
import { useIsDesktopPanel } from "@/components/principal-students-mobile";
import { PanelMobileShell } from "@/components/panel/panel-mobile-shell";

/** One child tree for roster/add forms — avoids duplicating forms across breakpoints. */
export function PrincipalRosterPageChrome({
  title,
  description,
  mobileTitle,
  mobileSubtitle,
  workflowTabs,
  children,
}: {
  title: string;
  description: string;
  mobileTitle: string;
  mobileSubtitle: string;
  /** Roster / Enroll tabs — rendered below the mobile hero (not inside it) for readability. */
  workflowTabs?: ReactNode;
  children: ReactNode;
}) {
  const isDesktop = useIsDesktopPanel();

  if (isDesktop) {
    return (
      <div className="space-y-6">
        <PageHeader title={title} description={description} />
        {workflowTabs}
        {children}
      </div>
    );
  }

  return (
    <PanelMobileShell
      role="principal"
      kicker="Principal"
      title={mobileTitle}
      subtitle={mobileSubtitle}
      showCalendar={false}
    >
      <div className="min-w-0 space-y-4">
        {workflowTabs}
        {children}
      </div>
    </PanelMobileShell>
  );
}

/** Shared shell for long principal enrollment / registration forms */
export const PRINCIPAL_FORM_SHELL_CLASS =
  "card-panel form-shell min-w-0 max-w-full space-y-1 rounded-2xl border border-border bg-surface shadow-sm";
