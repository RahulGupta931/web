"use client";

import {
  formatProfileFieldValue,
  STUDENT_PROFILE_SECTIONS,
  type StudentProfileRecord,
} from "@/lib/student-profile-display";

function FieldRow({
  label,
  value,
  mono,
  multiline,
  href,
  variant,
}: {
  label: string;
  value: string;
  mono?: boolean;
  multiline?: boolean;
  href?: string;
  variant: "mobile" | "desktop";
}) {
  const display = value === "—" ? <span className="text-muted">—</span> : (
    href && value !== "—" ? (
      <a href={href} className="font-medium text-brand break-all hover:underline">
        {value}
      </a>
    ) : (
      <span className={`font-medium text-heading ${mono ? "font-mono text-sm" : ""} ${multiline ? "whitespace-pre-wrap" : ""}`}>
        {value}
      </span>
    )
  );

  if (variant === "mobile") {
    return (
      <div className="flex flex-col gap-0.5 border-b border-border/80 py-2.5 last:border-0">
        <dt className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted">{label}</dt>
        <dd className="text-sm">{display}</dd>
      </div>
    );
  }

  return (
    <div className="card-panel">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-1 text-sm">{display}</dd>
    </div>
  );
}

export function StudentProfileSections({
  profile,
  variant = "mobile",
}: {
  profile: StudentProfileRecord;
  variant?: "mobile" | "desktop";
}) {
  return (
    <div className={variant === "desktop" ? "space-y-8" : "space-y-4"}>
      {STUDENT_PROFILE_SECTIONS.map((section) => (
        <section
          key={section.id}
          className={
            variant === "mobile"
              ? "overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)]"
              : undefined
          }
          aria-labelledby={`profile-section-${section.id}`}
        >
          <h2
            id={`profile-section-${section.id}`}
            className={
              variant === "mobile"
                ? "border-b border-border bg-gradient-to-r from-brand/5 to-transparent px-4 py-3 text-sm font-semibold text-heading"
                : "mb-3 text-sm font-semibold text-heading"
            }
          >
            {section.title}
          </h2>
          {variant === "mobile" ? (
            <dl className="px-4 py-1">
              {section.fields.map((field) => {
                const raw = profile[field.key];
                const value = formatProfileFieldValue(field.key, raw);
                const href =
                  field.href && raw && String(raw).trim()
                    ? field.href(String(raw))
                    : undefined;
                return (
                  <FieldRow
                    key={field.key}
                    label={field.label}
                    value={value}
                    mono={field.mono}
                    multiline={field.multiline}
                    href={href}
                    variant="mobile"
                  />
                );
              })}
            </dl>
          ) : (
            <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {section.fields.map((field) => {
                const raw = profile[field.key];
                const value = formatProfileFieldValue(field.key, raw);
                const href =
                  field.href && raw && String(raw).trim()
                    ? field.href(String(raw))
                    : undefined;
                return (
                  <FieldRow
                    key={field.key}
                    label={field.label}
                    value={value}
                    mono={field.mono}
                    multiline={field.multiline}
                    href={href}
                    variant="desktop"
                  />
                );
              })}
            </dl>
          )}
        </section>
      ))}
    </div>
  );
}
