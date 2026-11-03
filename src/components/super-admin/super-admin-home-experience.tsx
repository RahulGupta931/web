"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { usePanelContext } from "@/components/panel-context";
import { apiFetch, getApiErrorMessage } from "@/lib/api";
import { useAuth } from "@/components/auth-provider";

type Dashboard = {
  stats: {
    schools: number;
    activeSchools: number;
    principals: number;
    teachers: number;
    students: number;
  };
};

type SchoolRow = {
  id: string;
  name: string;
  schoolCode: string;
  isActive: boolean;
  email: string | null;
  teacherCount?: number;
  studentCount?: number;
};

type PrincipalUser = {
  id: string;
  email: string;
  status: string;
};

export function SuperAdminHomeExperience() {
  const router = useRouter();
  const { token } = useAuth();
  const { setSchool, schoolId, schoolName } = usePanelContext();
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [schools, setSchools] = useState<SchoolRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [expandedSchool, setExpandedSchool] = useState<string | null>(null);
  const [principals, setPrincipals] = useState<PrincipalUser[]>([]);
  const [editPrincipal, setEditPrincipal] = useState<PrincipalUser | null>(null);
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    if (!token) return;
    setError(null);
    Promise.all([
      apiFetch<Dashboard>("/api/super-admin/dashboard", { token }),
      apiFetch<SchoolRow[]>("/api/super-admin/schools", { token }),
    ])
      .then(([d, s]) => {
        setDashboard(d);
        setSchools(s);
      })
      .catch((e) => setError(getApiErrorMessage(e)));
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!token || !expandedSchool) {
      setPrincipals([]);
      return;
    }
    apiFetch<PrincipalUser[]>(`/api/super-admin/schools/${encodeURIComponent(expandedSchool)}/principals`, {
      token,
    })
      .then(setPrincipals)
      .catch(() => setPrincipals([]));
  }, [token, expandedSchool]);

  async function savePrincipal(e: FormEvent) {
    e.preventDefault();
    if (!token || !editPrincipal) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const body: { email?: string; password?: string } = {};
      if (editEmail.trim()) body.email = editEmail.trim();
      if (editPassword.trim()) body.password = editPassword.trim();
      await apiFetch(`/api/super-admin/users/${editPrincipal.id}`, {
        method: "PATCH",
        token,
        body: JSON.stringify(body),
      });
      setMessage("Principal account updated.");
      setEditPassword("");
      if (expandedSchool) {
        const list = await apiFetch<PrincipalUser[]>(
          `/api/super-admin/schools/${encodeURIComponent(expandedSchool)}/principals`,
          { token }
        );
        setPrincipals(list);
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  const s = dashboard?.stats;

  return (
    <div className="space-y-8">
      {error && <p className="alert-error">{error}</p>}
      {message && <p className="alert-success">{message}</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["Schools", s?.schools],
          ["Active schools", s?.activeSchools],
          ["Principals", s?.principals],
          ["Teachers", s?.teachers],
          ["Students", s?.students],
        ].map(([label, value]) => (
          <div key={String(label)} className="card-panel p-5">
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums">{value ?? "—"}</p>
          </div>
        ))}
      </div>

      <section className="card-panel overflow-hidden">
        <div className="border-b border-border px-4 py-3 sm:px-5">
          <p className="form-section-title">School panels · full edit access</p>
          <p className="mt-1 text-sm text-muted">
            Open any school in principal or teacher mode. Changes use the same APIs as school staff — all actions are
            audited.
          </p>
          {schoolId && schoolName && (
            <p className="mt-2 text-xs text-muted">
              Current context: <span className="font-semibold text-heading">{schoolName}</span>
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 p-4 sm:p-5">
          <Link href="/principal" className="btn-primary text-sm">Open principal office</Link>
          <Link href="/teacher" className="btn-secondary text-sm">Open teacher workspace</Link>
          <Link href="/super-admin/database" className="btn-secondary text-sm">Database console</Link>
        </div>
      </section>

      <section className="card-panel overflow-hidden">
        <div className="border-b border-border px-4 py-3 sm:px-5">
          <p className="form-section-title">Schools</p>
        </div>
        <ul className="divide-y divide-border">
          {schools.map((school) => (
            <li key={school.id} className="px-4 py-4 sm:px-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold text-heading">{school.name}</p>
                  <p className="font-mono text-xs text-muted">{school.schoolCode}</p>
                  <p className="mt-1 text-xs text-muted">
                    {school.teacherCount ?? "—"} teachers · {school.studentCount ?? "—"} students
                    {!school.isActive && " · Inactive"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn-primary text-sm"
                    onClick={() => {
                      setSchool(school.id, school.name);
                      router.push("/principal");
                    }}
                  >
                    Edit as principal
                  </button>
                  <button
                    type="button"
                    className="btn-secondary text-sm"
                    onClick={() => {
                      setSchool(school.id, school.name);
                      router.push("/teacher");
                    }}
                  >
                    Edit as teacher
                  </button>
                  <button
                    type="button"
                    className="btn-secondary text-sm"
                    onClick={() => setExpandedSchool(expandedSchool === school.id ? null : school.id)}
                  >
                    Principal accounts
                  </button>
                </div>
              </div>
              {expandedSchool === school.id && (
                <div className="mt-4 rounded-xl border border-border bg-surface-muted/50 p-4">
                  {principals.length === 0 ? (
                    <p className="text-sm text-muted">No principal login for this school yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {principals.map((p) => (
                        <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                          <span>
                            <span className="font-mono">{p.email}</span>
                            <span className="ml-2 text-xs capitalize text-muted">{p.status.toLowerCase()}</span>
                          </span>
                          <button
                            type="button"
                            className="text-xs font-semibold text-brand"
                            onClick={() => {
                              setEditPrincipal(p);
                              setEditEmail(p.email);
                              setEditPassword("");
                            }}
                          >
                            Edit login
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      {editPrincipal && (
        <section className="card-panel form-shell max-w-md space-y-3">
          <p className="form-section-title">Edit principal login</p>
          <form className="space-y-3" onSubmit={savePrincipal}>
            <label className="block text-sm">
              <span className="text-muted">Email</span>
              <input
                className="input-field mt-1 w-full"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                required
              />
            </label>
            <label className="block text-sm">
              <span className="text-muted">New password (optional)</span>
              <input
                className="input-field mt-1 w-full"
                type="password"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                minLength={8}
                placeholder="Leave blank to keep current"
              />
            </label>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </button>
              <button type="button" className="btn-secondary" onClick={() => setEditPrincipal(null)}>
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
