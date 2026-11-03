"use client";

import { useCallback, useEffect, useState } from "react";
import { StudentDashboardExperience } from "@/components/student/student-dashboard-experience";
import { PanelAlerts } from "@/components/panel-alerts";
import { useAuth } from "@/components/auth-provider";
import type { StudentDashboardData } from "@/lib/student-dashboard-types";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

export default function StudentDashboard() {
  const { loading: authLoading } = useAuth();
  const { get, isReady } = useApi();
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!isReady) return;
    get<StudentDashboardData>("/api/student/dashboard")
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
    <>
      <PanelAlerts error={error} />
      <StudentDashboardExperience data={data} />
    </>
  );
}
