"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { AccountChangePasswordForm } from "@/components/account-change-password-form";
import { useAuth } from "@/components/auth-provider";
import { FormField } from "@/components/form-field";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import { principalNavLabel } from "@/config/nav";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

type ProfilePayload = {
  user: {
    id: string;
    email: string;
    role: string;
    status: string;
    lastLoginAt: string | null;
    lastLogoutAt: string | null;
    mustChangePassword: boolean;
    createdAt: string;
    updatedAt: string;
  };
  school: {
    id: string;
    schoolCode: string;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    logoUrl: string | null;
  };
};

type Tab = "profile" | "security";

function emailInitials(email: string) {
  const local = email.split("@")[0] ?? "";
  const parts = local.split(/[._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  }
  return local.slice(0, 2).toUpperCase() || "P";
}

function formatWhen(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "—";
  }
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3 shadow-[var(--shadow-card)]">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-sm font-bold leading-snug text-heading sm:text-base">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-muted">{sub}</p> : null}
    </div>
  );
}

export function PrincipalProfileExperience() {
  const { loading: authLoading, refresh } = useAuth();
  const { get, patch, isReady } = useApi();
  const [data, setData] = useState<ProfilePayload | null>(null);
  const [tab, setTab] = useState<Tab>("profile");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [emailDraft, setEmailDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!isReady) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    get<ProfilePayload>("/api/principal/profile")
      .then((payload) => {
        setData(payload);
        setEmailDraft(payload.user.email);
      })
      .catch((e) => {
        setData(null);
        setError(getApiErrorMessage(e));
      })
      .finally(() => setLoading(false));
  }, [get, isReady]);

  useEffect(() => {
    if (authLoading) return;
    load();
  }, [authLoading, load]);

  const user = data?.user;
  const school = data?.school;

  const locationLine = useMemo(() => {
    if (!school) return null;
    return [school.city, school.state, school.country].filter(Boolean).join(", ") || null;
  }, [school]);

  async function onSaveEmail(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaveMessage(null);
    setError(null);
    const trimmed = emailDraft.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Enter a valid email address.");
      return;
    }
    setSaving(true);
    try {
      const payload = await patch<ProfilePayload>("/api/principal/profile", { email: trimmed });
      setData(payload);
      setEmailDraft(payload.user.email);
      setEditing(false);
      setSaveMessage("Sign-in email updated.");
      await refresh();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  function cancelEdit() {
    setEditing(false);
    setEmailDraft(user?.email ?? "");
    setSaveMessage(null);
    setError(null);
  }

  return (
    <>
      <PanelAlerts error={error} message={saveMessage} />
      <PageHeader
        title={principalNavLabel("/principal/profile")}
        description="Your principal account, school affiliation, and portal password."
      />

      <section
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand-light px-5 py-6 text-white shadow-[var(--shadow-card)]"
        aria-label="Profile summary"
      >
        <div className="pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-full bg-brand-gold/25 blur-2xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
          <span
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-2xl font-bold"
            aria-hidden
          >
            {user ? emailInitials(user.email) : "P"}
          </span>
          <div className="min-w-0">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">
              Principal · {school?.name ?? "School"}
            </p>
            <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
              {user?.email ?? "Principal account"}
            </h2>
            {school && (
              <p className="mt-1 text-sm text-white/85">
                School code <span className="font-mono font-semibold">{school.schoolCode}</span>
              </p>
            )}
            {user && (
              <p className="mt-2 inline-flex max-w-full rounded-full bg-white/15 px-3 py-1 text-xs font-medium capitalize text-white">
                Account {user.status.toLowerCase()}
                {user.mustChangePassword ? " · password change required" : ""}
              </p>
            )}
          </div>
        </div>
      </section>

      {!loading && user && (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <StatCard label="Last sign-in" value={formatWhen(user.lastLoginAt)} />
          <StatCard label="Member since" value={formatWhen(user.createdAt)} sub="Portal account created" />
          <StatCard
            label="School"
            value={school?.name ?? "—"}
            sub={locationLine ?? undefined}
          />
        </div>
      )}

      <nav
        className="mt-6 flex gap-1 rounded-xl border border-border bg-surface p-1 shadow-[var(--shadow-card)]"
        aria-label="Profile sections"
      >
        {(
          [
            ["profile", "Account"],
            ["security", "Password"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex flex-1 items-center justify-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              tab === id ? "bg-brand text-white shadow-sm" : "text-muted hover:bg-surface-muted hover:text-heading"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {loading ? (
        <p className="mt-6 empty-state">Loading profile…</p>
      ) : tab === "profile" ? (
        <div className="mt-6 space-y-6">
          <section className="card-panel overflow-hidden">
            <div className="flex flex-col gap-2 border-b border-border bg-gradient-to-r from-brand/8 via-transparent to-transparent px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div>
                <p className="form-section-title">Sign-in details</p>
                <p className="mt-1 text-sm text-muted">Update the email you use to sign in to the principal office.</p>
              </div>
              {!editing && user && (
                <button type="button" className="btn-secondary shrink-0 text-sm" onClick={() => setEditing(true)}>
                  Edit email
                </button>
              )}
            </div>

            {editing ? (
              <form className="form-shell space-y-4" onSubmit={onSaveEmail}>
                <FormField label="Login email" htmlFor="principal-email">
                  <input
                    id="principal-email"
                    type="email"
                    className="input-field"
                    value={emailDraft}
                    onChange={(e) => setEmailDraft(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </FormField>
                <div className="flex flex-wrap gap-2">
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? "Saving…" : "Save changes"}
                  </button>
                  <button type="button" className="btn-secondary" onClick={cancelEdit} disabled={saving}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <dl className="form-shell grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Login email</dt>
                  <dd className="mt-1 font-mono text-sm font-medium text-heading break-all">{user?.email ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Role</dt>
                  <dd className="mt-1 text-sm font-medium capitalize text-heading">Principal</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Account status</dt>
                  <dd className="mt-1 text-sm font-medium capitalize text-heading">{user?.status.toLowerCase() ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Last updated</dt>
                  <dd className="mt-1 text-sm font-medium text-heading">{formatWhen(user?.updatedAt ?? null)}</dd>
                </div>
              </dl>
            )}
          </section>

          {school && (
            <section className="card-panel overflow-hidden">
              <div className="border-b border-border bg-gradient-to-r from-brand/8 via-transparent to-transparent px-4 py-3 sm:px-5">
                <p className="form-section-title">School affiliation</p>
                <p className="mt-1 text-sm text-muted">
                  Official school contact details are managed under{" "}
                  <span className="font-medium text-heading">School settings</span>.
                </p>
              </div>
              <dl className="form-shell grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted">School name</dt>
                  <dd className="mt-1 text-sm font-medium text-heading">{school.name}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted">School code</dt>
                  <dd className="mt-1 font-mono text-sm font-medium text-heading">{school.schoolCode}</dd>
                </div>
                {school.email && (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted">School email</dt>
                    <dd className="mt-1 text-sm font-medium text-heading break-all">{school.email}</dd>
                  </div>
                )}
                {school.phone && (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted">School phone</dt>
                    <dd className="mt-1 text-sm font-medium text-heading">{school.phone}</dd>
                  </div>
                )}
                {school.address && (
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Address</dt>
                    <dd className="mt-1 text-sm font-medium text-heading">
                      {school.address}
                      {locationLine ? ` · ${locationLine}` : ""}
                    </dd>
                  </div>
                )}
              </dl>
            </section>
          )}
        </div>
      ) : (
        <div className="mt-6 max-w-2xl">
          <section className="card-panel overflow-hidden">
            <div className="border-b border-border bg-gradient-to-r from-brand/8 via-transparent to-transparent px-4 py-3 sm:px-5">
              <p className="form-section-title">Security</p>
              <p className="mt-1 text-sm text-muted">Change your portal password. You will need your current password.</p>
            </div>
            <div className="form-shell">
              <AccountChangePasswordForm
                title=""
                description=""
                className="!rounded-none !border-0 !bg-transparent !p-0 !shadow-none"
              />
            </div>
          </section>
        </div>
      )}
    </>
  );
}
