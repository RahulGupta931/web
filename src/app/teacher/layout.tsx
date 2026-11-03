"use client";

import { PanelLayout } from "@/components/panel-layout";
import { RequireAuth } from "@/components/require-auth";
import { SuperAdminPanelGate } from "@/components/super-admin/super-admin-panel-gate";
import { teacherNav } from "@/config/nav";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth roles={["TEACHER", "SUPER_ADMIN"]}>
      <SuperAdminPanelGate panel="teacher">
        <PanelLayout title="Teacher workspace" nav={teacherNav}>{children}</PanelLayout>
      </SuperAdminPanelGate>
    </RequireAuth>
  );
}
