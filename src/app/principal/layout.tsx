"use client";

import { PanelLayout } from "@/components/panel-layout";
import { RequireAuth } from "@/components/require-auth";
import { SuperAdminPanelGate } from "@/components/super-admin/super-admin-panel-gate";
import { principalNav } from "@/config/nav";

export default function PrincipalLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth roles={["PRINCIPAL", "SUPER_ADMIN"]}>
      <SuperAdminPanelGate panel="principal">
        <PanelLayout title="Principal office" nav={principalNav}>{children}</PanelLayout>
      </SuperAdminPanelGate>
    </RequireAuth>
  );
}
