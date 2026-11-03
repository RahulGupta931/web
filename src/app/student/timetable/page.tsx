"use client";

import { useCallback, useEffect, useState } from "react";
import type { TimetableSubstituteRow } from "@/components/mobile/student-timetable-mobile";
import { StudentTimetableExperience } from "@/components/student/student-timetable-experience";
import { useAuth } from "@/components/auth-provider";
import type { TimetableSlotRow } from "@/components/timetable-week-grid";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

type StudentTimetableResponse = {
  slots: TimetableSlotRow[];
  substitutes?: TimetableSubstituteRow[];
  section: {
    label: string;
    className: string;
    sectionName: string;
    rollNumber: string | null;
  } | null;
  timetable: { name: string; status: string } | null;
  message?: string;
};

export default function StudentTimetablePage() {
  const { loading: authLoading } = useAuth();
  const { get, isReady } = useApi();
  const [slots, setSlots] = useState<TimetableSlotRow[]>([]);
  const [section, setSection] = useState<StudentTimetableResponse["section"]>(null);
  const [timetableName, setTimetableName] = useState<string | null>(null);
  const [substitutes, setSubstitutes] = useState<TimetableSubstituteRow[]>([]);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    if (!isReady) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    get<StudentTimetableResponse>("/api/student/timetable")
      .then((d) => {
        setSlots(Array.isArray(d.slots) ? d.slots : []);
        setSection(d.section ?? null);
        setTimetableName(d.timetable?.name ?? null);
        setSubstitutes(d.substitutes ?? []);
        setInfoMessage(d.message ?? null);
      })
      .catch((e) => {
        setSlots([]);
        setSection(null);
        setTimetableName(null);
        setSubstitutes([]);
        setInfoMessage(null);
        setError(getApiErrorMessage(e));
      })
      .finally(() => setLoading(false));
  }, [get, isReady]);

  useEffect(() => {
    if (authLoading) return;
    load();
  }, [authLoading, load]);

  return (
    <StudentTimetableExperience
      loading={loading}
      error={error}
      slots={slots}
      substitutes={substitutes}
      section={section}
      timetableName={timetableName}
      infoMessage={infoMessage}
    />
  );
}
