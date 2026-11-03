"use client";

import { useCallback, useEffect, useState } from "react";
import { TeacherDashboardExperience } from "@/components/teacher/teacher-dashboard-experience";
import { PanelAlerts } from "@/components/panel-alerts";
import { useAuth } from "@/components/auth-provider";
import type { TeacherDashboardData } from "@/lib/teacher-dashboard-types";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

export default function TeacherDashboard() {
  const { loading: authLoading } = useAuth();
  const { get, isReady } = useApi();
  const [data, setData] = useState<TeacherDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!isReady) return;
    get<TeacherDashboardData>("/api/teacher/dashboard")
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
      <TeacherDashboardExperience data={data} />
    </div>
  );
}
