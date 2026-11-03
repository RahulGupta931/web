"use client";

import { FormEvent, useState } from "react";
import { FormField } from "@/components/form-field";
import { PanelAlerts } from "@/components/panel-alerts";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

export function AccountChangePasswordForm({
  title = "Change password",
  description = "Use your current password, then choose a new one (at least 8 characters).",
  className = "",
}: {
  title?: string;
  description?: string;
  className?: string;
}) {
  const { post } = useApi();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await post("/api/auth/change-password", {
        currentPassword,
        newPassword,
      });
      setMessage("Your password has been updated. Use it the next time you sign in.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      className={`rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-5 ${className}`}
      aria-labelledby={title ? "change-password-heading" : undefined}
    >
      {title ? (
        <h2 id="change-password-heading" className="text-base font-semibold text-heading">
          {title}
        </h2>
      ) : null}
      {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}

      <div className="mt-4">
        <PanelAlerts error={error} message={message} messageTitle="Password updated" />
      </div>

      <form onSubmit={onSubmit} className="mt-4 space-y-4 max-w-md">
        <FormField label="Current password">
          <input
            type="password"
            required
            autoComplete="current-password"
            className="input-field"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </FormField>
        <FormField label="New password">
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="input-field"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </FormField>
        <FormField label="Confirm new password">
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="input-field"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </FormField>
        <button type="submit" disabled={submitting} className="btn-primary text-sm disabled:opacity-50">
          {submitting ? "Updating…" : "Update password"}
        </button>
      </form>
    </section>
  );
}
