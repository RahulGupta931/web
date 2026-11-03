"use client";

import { PanelLayout } from "@/components/panel-layout";
import { RequireAuth } from "@/components/require-auth";
import { studentNav } from "@/config/nav";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth roles={["STUDENT"]}>
      <PanelLayout title="Student portal" nav={studentNav}>{children}</PanelLayout>
    </RequireAuth>
  );
}
