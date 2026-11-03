"use client";

import type { ReactNode } from "react";
import { PanelMobileShell } from "@/components/panel/panel-mobile-shell";
import { MobileRecordCards } from "@/components/mobile/generic-list-mobile";

export function PanelListPageMobile({
  role,
  kicker,
  title,
  subtitle,
  showCalendar = true,
  calendarTitle = "School calendar",
  items,
  emptyMessage,
  onItemClick,
  selectedItemId,
  children,
}: {
  role: "student" | "teacher" | "principal";
  kicker: string;
  title: string;
  subtitle?: string;
  showCalendar?: boolean;
  calendarTitle?: string;
  items: { id?: string; title: string; subtitle?: string; meta?: string; badge?: string }[];
  emptyMessage?: string;
  onItemClick?: (id: string) => void;
  selectedItemId?: string | null;
  children?: ReactNode;
}) {
  return (
    <PanelMobileShell
      role={role}
      kicker={kicker}
      title={title}
      subtitle={subtitle}
      showCalendar={showCalendar}
      calendarTitle={calendarTitle}
    >
      {children}
      <MobileRecordCards
        items={items}
        emptyMessage={emptyMessage}
        onItemClick={onItemClick}
        selectedItemId={selectedItemId}
      />
    </PanelMobileShell>
  );
}
