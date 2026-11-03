"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { PrincipalDashboardExperience } from "@/components/principal/principal-dashboard-experience";
import { PanelAlerts } from "@/components/panel-alerts";
import type { PrincipalDashboardData } from "@/lib/principal-dashboard-types";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

export default function PrincipalDashboard() {
  const { loading: authLoading } = useAuth();
  const { get, isReady } = useApi();
  const [data, setData] = useState<PrincipalDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!isReady) return;
    get<PrincipalDashboardData>("/api/principal/dashboard")
      .then(setData)
      .catch((e) => {
        setData(null);
        setError(getApiErrorMessage(e));
      });
  }, [get, isReady]);

  useEffect(() => {
    if (authLoading) return;
    load();
  }, [authLoading, load]);

  return (
    <div className="space-y-6">
      <PanelAlerts error={error} />
      <PrincipalDashboardExperience data={data} />
    </div>
  );
}
