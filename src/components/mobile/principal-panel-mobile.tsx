"use client";

import type { ReactNode } from "react";
import { PanelListPageMobile } from "@/components/mobile/panel-list-page-mobile";

export function PrincipalTimetableListMobile({
  list,
}: {
  list: { id: string; name: string; status: string; _count: { slots: number } }[];
}) {
  return (
    <PanelListPageMobile
      role="principal"
      kicker="Principal"
      title="Timetables"
      subtitle="Generate and publish class schedules."
      showCalendar={false}
      items={list.map((t) => ({
        id: t.id,
        title: t.name,
        badge: t.status,
        meta: `${t._count.slots} periods`,
      }))}
      emptyMessage="No timetables yet."
    />
  );
}

export function PrincipalNoticesListMobile({
  rows,
  children,
}: {
  rows: { title: string; audience: string; createdAt: string }[];
  children?: ReactNode;
}) {
  return (
    <PanelListPageMobile
      role="principal"
      kicker="Principal"
      title="Notices"
      subtitle="Broadcast announcements to school audiences."
      showCalendar={false}
      items={rows.map((n, i) => ({
        id: String(i),
        title: n.title,
        badge: n.audience,
        meta: new Date(n.createdAt).toLocaleDateString(),
      }))}
      emptyMessage="No notices published."
    >
      {children}
    </PanelListPageMobile>
  );
}
