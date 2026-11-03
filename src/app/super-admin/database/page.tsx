"use client";

import { DatabaseConsoleExperience } from "@/components/super-admin/database-console-experience";
import { PanelShell } from "@/components/panel-shell";
import { RequireAuth } from "@/components/require-auth";

export default function SuperAdminDatabasePage() {
  return (
    <RequireAuth roles={["SUPER_ADMIN"]}>
      <PanelShell title="Database" fullWidth>
        <DatabaseConsoleExperience />
      </PanelShell>
    </RequireAuth>
  );
}
