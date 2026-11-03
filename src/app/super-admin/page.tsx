"use client";

import { PanelShell } from "@/components/panel-shell";
import { RequireAuth } from "@/components/require-auth";
import { SuperAdminHomeExperience } from "@/components/super-admin/super-admin-home-experience";

export default function SuperAdminPage() {
  return (
    <RequireAuth roles={["SUPER_ADMIN"]}>
      <PanelShell title="Super Admin Dashboard" fullWidth>
        <SuperAdminHomeExperience />
      </PanelShell>
    </RequireAuth>
  );
}
