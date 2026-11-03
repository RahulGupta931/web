"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "@/components/auth-provider";

const STORAGE_KEY = "erp.superAdmin.panel";

type StoredPanel = {
  schoolId: string | null;
  schoolName: string | null;
  teacherProfileId: string | null;
  teacherLabel: string | null;
};

type PanelContextValue = {
  isSuperAdmin: boolean;
  schoolId: string | null;
  schoolName: string | null;
  teacherProfileId: string | null;
  teacherLabel: string | null;
  setSchool: (id: string | null, name?: string | null) => void;
  setTeacher: (id: string | null, label?: string | null) => void;
  clearTeacher: () => void;
  clearAll: () => void;
  panelHeaders: Record<string, string> | undefined;
};

export const PanelContext = createContext<PanelContextValue | null>(null);

function readStored(): StoredPanel {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { schoolId: null, schoolName: null, teacherProfileId: null, teacherLabel: null };
    }
    const p = JSON.parse(raw) as StoredPanel;
    return {
      schoolId: p.schoolId ?? null,
      schoolName: p.schoolName ?? null,
      teacherProfileId: p.teacherProfileId ?? null,
      teacherLabel: p.teacherLabel ?? null,
    };
  } catch {
    return { schoolId: null, schoolName: null, teacherProfileId: null, teacherLabel: null };
  }
}

export function PanelContextProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [schoolName, setSchoolName] = useState<string | null>(null);
  const [teacherProfileId, setTeacherProfileId] = useState<string | null>(null);
  const [teacherLabel, setTeacherLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!isSuperAdmin) {
      setSchoolId(null);
      setSchoolName(null);
      setTeacherProfileId(null);
      setTeacherLabel(null);
      return;
    }
    const stored = readStored();
    setSchoolId(stored.schoolId);
    setSchoolName(stored.schoolName);
    setTeacherProfileId(stored.teacherProfileId);
    setTeacherLabel(stored.teacherLabel);
  }, [isSuperAdmin]);

  const persist = useCallback(
    (next: StoredPanel) => {
      if (!isSuperAdmin) return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    },
    [isSuperAdmin]
  );

  const setSchool = useCallback(
    (id: string | null, name?: string | null) => {
      setSchoolId(id);
      setSchoolName(name ?? null);
      setTeacherProfileId(null);
      setTeacherLabel(null);
      persist({
        schoolId: id,
        schoolName: name ?? null,
        teacherProfileId: null,
        teacherLabel: null,
      });
    },
    [persist]
  );

  const setTeacher = useCallback(
    (id: string | null, label?: string | null) => {
      setTeacherProfileId(id);
      setTeacherLabel(label ?? null);
      persist({
        schoolId,
        schoolName,
        teacherProfileId: id,
        teacherLabel: label ?? null,
      });
    },
    [persist, schoolId, schoolName]
  );

  const clearTeacher = useCallback(() => {
    setTeacherProfileId(null);
    setTeacherLabel(null);
    persist({
      schoolId,
      schoolName,
      teacherProfileId: null,
      teacherLabel: null,
    });
  }, [persist, schoolId, schoolName]);

  const clearAll = useCallback(() => {
    setSchoolId(null);
    setSchoolName(null);
    setTeacherProfileId(null);
    setTeacherLabel(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const panelHeaders = useMemo(() => {
    if (!isSuperAdmin) return undefined;
    const headers: Record<string, string> = {};
    if (schoolId) headers["X-School-Id"] = schoolId;
    if (teacherProfileId) headers["X-Teacher-Profile-Id"] = teacherProfileId;
    return headers;
  }, [isSuperAdmin, schoolId, teacherProfileId]);

  const value = useMemo(
    () => ({
      isSuperAdmin,
      schoolId,
      schoolName,
      teacherProfileId,
      teacherLabel,
      setSchool,
      setTeacher,
      clearTeacher,
      clearAll,
      panelHeaders,
    }),
    [
      isSuperAdmin,
      schoolId,
      schoolName,
      teacherProfileId,
      teacherLabel,
      setSchool,
      setTeacher,
      clearTeacher,
      clearAll,
      panelHeaders,
    ]
  );

  return <PanelContext.Provider value={value}>{children}</PanelContext.Provider>;
}

export function usePanelContext() {
  const ctx = useContext(PanelContext);
  if (!ctx) {
    throw new Error("usePanelContext must be used within PanelContextProvider");
  }
  return ctx;
}

export function useOptionalPanelContext() {
  return useContext(PanelContext);
}
