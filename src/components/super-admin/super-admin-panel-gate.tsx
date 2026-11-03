"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { usePanelContext } from "@/components/panel-context";
import { apiFetch, getApiErrorMessage } from "@/lib/api";

type SchoolRow = {
  id: string;
  name: string;
  schoolCode: string;
  isActive: boolean;
};

type TeacherRow = {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  user: { email: string; status: string };
};

export function SuperAdminPanelGate({
  panel,
  children,
}: {
  panel: "principal" | "teacher";
  children: React.ReactNode;
}) {
  const { user, token } = useAuth();
  const {
    isSuperAdmin,
    schoolId,
    schoolName,
    teacherProfileId,
    teacherLabel,
    setSchool,
    setTeacher,
    clearAll,
  } = usePanelContext();

  const [schools, setSchools] = useState<SchoolRow[]>([]);
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSchools = useCallback(() => {
    if (!token || !isSuperAdmin) return;
    setLoading(true);
    apiFetch<SchoolRow[]>("/api/super-admin/schools", { token })
      .then(setSchools)
      .catch((e) => setError(getApiErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [token, isSuperAdmin]);

  useEffect(() => {
    if (!isSuperAdmin) return;
    loadSchools();
  }, [isSuperAdmin, loadSchools]);

  useEffect(() => {
    if (!token || !isSuperAdmin || !schoolId) {
      setTeachers([]);
      return;
    }
    apiFetch<TeacherRow[]>(`/api/super-admin/schools/${encodeURIComponent(schoolId)}/teachers`, {
      token,
    })
      .then(setTeachers)
      .catch(() => setTeachers([]));
  }, [token, isSuperAdmin, schoolId]);

  if (!user || user.role !== "SUPER_ADMIN") {
    return <>{children}</>;
  }

  if (!schoolId) {
    return (
      <div className="mx-auto max-w-lg space-y-4 py-8">
        <div className="card-panel p-5">
          <p className="form-section-title">Super admin · Choose school</p>
          <p className="mt-2 text-sm text-muted">
            Pick a school to open the {panel === "principal" ? "principal office" : "teacher workspace"} with full
            edit access.
          </p>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          {loading ? (
            <p className="mt-4 text-sm text-muted">Loading schools…</p>
          ) : (
            <ul className="mt-4 max-h-80 space-y-2 overflow-y-auto">
              {schools.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-left text-sm transition hover:border-brand/40 hover:bg-brand/[0.04]"
                    onClick={() => setSchool(s.id, s.name)}
                  >
                    <span>
                      <span className="font-semibold text-heading">{s.name}</span>
                      <span className="mt-0.5 block font-mono text-xs text-muted">{s.schoolCode}</span>
                    </span>
                    {!s.isActive && (
                      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[0.625rem] font-bold uppercase text-amber-900">
                        Inactive
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <Link href="/super-admin" className="mt-4 inline-block text-sm font-semibold text-brand">
            ← Back to super admin home
          </Link>
        </div>
      </div>
    );
  }

  if (panel === "teacher" && !teacherProfileId) {
    return (
      <div className="mx-auto max-w-lg space-y-4 py-8">
        <div className="card-panel p-5">
          <p className="form-section-title">Super admin · Choose teacher</p>
          <p className="mt-2 text-sm text-muted">
            Acting on <span className="font-semibold text-heading">{schoolName ?? "school"}</span>. Select which teacher
            account to edit as.
          </p>
          <ul className="mt-4 max-h-80 space-y-2 overflow-y-auto">
            {teachers.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  className="flex w-full flex-col rounded-xl border border-border bg-surface px-4 py-3 text-left text-sm transition hover:border-brand/40 hover:bg-brand/[0.04]"
                  onClick={() =>
                    setTeacher(t.id, `${t.firstName} ${t.lastName} (${t.employeeId})`)
                  }
                >
                  <span className="font-semibold text-heading">{t.firstName} {t.lastName}</span>
                  <span className="text-xs text-muted">{t.user.email} · {t.employeeId}</span>
                </button>
              </li>
            ))}
          </ul>
          {teachers.length === 0 && (
            <p className="mt-4 text-sm text-muted">No teachers in this school yet.</p>
          )}
          <button type="button" className="mt-4 text-sm font-semibold text-brand" onClick={() => setSchool(null)}>
            Change school
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm"
        role="status"
      >
        <p className="text-heading">
          <span className="font-bold text-amber-900">Super admin edit mode</span>
          <span className="text-muted"> · </span>
          {schoolName ?? "School"}
          {panel === "teacher" && teacherLabel ? (
            <>
              <span className="text-muted"> · </span>
              <span>{teacherLabel}</span>
            </>
          ) : null}
        </p>
        <div className="flex flex-wrap gap-2">
          {panel === "teacher" && (
            <button type="button" className="btn-secondary text-xs" onClick={() => setTeacher(null)}>
              Switch teacher
            </button>
          )}
          <button type="button" className="btn-secondary text-xs" onClick={() => setSchool(null)}>
            Change school
          </button>
          <Link href="/super-admin" className="btn-secondary text-xs">
            Super admin home
          </Link>
          <button type="button" className="text-xs font-semibold text-amber-900 underline" onClick={clearAll}>
            Exit edit mode
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}
