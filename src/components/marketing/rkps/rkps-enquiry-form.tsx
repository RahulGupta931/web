"use client";

import { type FormEvent, type ReactNode, useState } from "react";
import { CLASS_OPTIONS } from "@/content/website/rkps-copy";

type FieldName = "parentName" | "mobile" | "email" | "childName" | "classInterest" | "consent";
type Errors = Partial<Record<FieldName, string>>;

const CLASS_GROUPS: { label: string; options: readonly string[] }[] = [
  { label: "Pre-primary", options: CLASS_OPTIONS.filter((c) => ["Nursery", "LKG", "UKG"].includes(c)) },
  { label: "Primary · 1–5", options: CLASS_OPTIONS.filter((c) => /^Class [1-5]$/.test(c)) },
  { label: "Middle · 6–8", options: CLASS_OPTIONS.filter((c) => /^Class [6-8]$/.test(c)) },
  { label: "Secondary · 9–12", options: CLASS_OPTIONS.filter((c) => /^Class (9|1[0-2])$/.test(c)) },
];

const INPUT =
  "peer w-full min-h-12 rounded-xl border border-[color-mix(in_srgb,var(--rkps-text-body)_14%,transparent)] bg-white px-4 text-[15px] text-[var(--rkps-text-body)] placeholder:text-[color-mix(in_srgb,var(--rkps-text-body)_38%,transparent)] transition-[border-color,box-shadow] duration-150 hover:border-[color-mix(in_srgb,var(--rkps-text-body)_28%,transparent)] focus:border-[var(--rkps-primary)] focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--rkps-primary)_12%,transparent)] aria-[invalid=true]:border-[#b42318]";

function Field({
  label,
  hint,
  error,
  optional,
  className = "",
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="flex items-baseline justify-between gap-2 text-sm font-medium text-[var(--rkps-text-body)]">
        {label}
        {optional ? <span className="text-xs font-normal text-muted">Optional</span> : null}
      </span>
      {children}
      {error ? (
        <span className="text-xs text-[#b42318]" role="alert">
          {error}
        </span>
      ) : hint ? (
        <span className="text-xs text-muted">{hint}</span>
      ) : null}
    </label>
  );
}

function GroupHeading({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs tabular-nums text-brand">{num}</span>
      <h3 className="text-base font-medium text-heading">{title}</h3>
      <span className="h-px flex-1 bg-[color-mix(in_srgb,var(--rkps-text-body)_10%,transparent)]" aria-hidden />
    </div>
  );
}

export function RkpsEnquiryForm() {
  const [sent, setSent] = useState<{ parent: string; child: string; cls: string } | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [classInterest, setClassInterest] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parent = String(fd.get("parentName") ?? "").trim();
    const mobile = String(fd.get("mobile") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const child = String(fd.get("childName") ?? "").trim();

    const next: Errors = {};
    if (!parent) next.parentName = "Enter the parent or guardian's name";
    if (mobile.replace(/\D/g, "").length < 10) next.mobile = "Enter a 10-digit mobile number";
    if (email && !/^\S+@\S+\.\S+$/.test(email)) next.email = "Check the email address";
    if (!child) next.childName = "Enter your child's name";
    if (!classInterest) next.classInterest = "Choose a class";
    if (!fd.get("consent")) next.consent = "Please allow the office to contact you";
    setErrors(next);

    if (Object.keys(next).length > 0) {
      const first = e.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`);
      first?.focus();
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSent({ parent, child, cls: classInterest });
    }, 600);
  }

  const clear = (name: FieldName) => () => {
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  if (sent) {
    return (
      <div className="flex h-full min-h-[28rem] flex-col justify-center" aria-live="polite">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--rkps-success-soft)] text-[var(--rkps-success)]">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <h3 className="rkps-display mt-6 text-3xl leading-tight text-heading">Enquiry received</h3>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
          Thank you, {sent.parent}. The admissions office will call you about {sent.child} for {sent.cls} within one
          working day, with prospectus and campus visit options.
        </p>
        <dl className="mt-8 grid max-w-md grid-cols-2 gap-px overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--rkps-text-body)_10%,transparent)] bg-[color-mix(in_srgb,var(--rkps-text-body)_10%,transparent)] text-sm">
          <div className="bg-white p-4">
            <dt className="text-xs text-muted">Child</dt>
            <dd className="mt-1 font-medium text-heading">{sent.child}</dd>
          </div>
          <div className="bg-white p-4">
            <dt className="text-xs text-muted">Class</dt>
            <dd className="mt-1 font-medium text-heading">{sent.cls}</dd>
          </div>
        </dl>
        <div className="mt-8">
          <button
            type="button"
            onClick={() => {
              setSent(null);
              setClassInterest("");
            }}
            className="text-sm font-medium text-brand underline decoration-[color-mix(in_srgb,var(--rkps-primary)_30%,transparent)] underline-offset-4 transition-colors hover:decoration-[var(--rkps-primary)]"
          >
            Send another enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="flex h-full flex-col" onSubmit={onSubmit} noValidate>
      <div className="space-y-10">
        {/* Parent */}
        <fieldset>
          <legend className="mb-6 w-full">
            <GroupHeading num="01" title="Parent or guardian" />
          </legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" error={errors.parentName}>
              <input
                name="parentName"
                autoComplete="name"
                className={INPUT}
                placeholder="Rajesh Sharma"
                aria-invalid={!!errors.parentName}
                onInput={clear("parentName")}
              />
            </Field>
            <Field label="Mobile number" error={errors.mobile} hint="The office calls this number">
              <div className="flex">
                <span className="grid min-h-12 place-items-center rounded-l-xl border border-r-0 border-[color-mix(in_srgb,var(--rkps-text-body)_14%,transparent)] bg-[var(--surface-muted)] px-3 font-mono text-sm text-muted">
                  +91
                </span>
                <input
                  name="mobile"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={14}
                  className={`${INPUT} rounded-l-none font-mono tabular-nums`}
                  placeholder="98765 43210"
                  aria-invalid={!!errors.mobile}
                  onInput={clear("mobile")}
                />
              </div>
            </Field>
            <Field label="Email" optional error={errors.email} className="sm:col-span-2">
              <input
                name="email"
                type="email"
                autoComplete="email"
                className={INPUT}
                placeholder="rajesh.sharma@example.com"
                aria-invalid={!!errors.email}
                onInput={clear("email")}
              />
            </Field>
          </div>
        </fieldset>

        {/* Child */}
        <fieldset>
          <legend className="mb-6 w-full">
            <GroupHeading num="02" title="Your child" />
          </legend>
          <div className="space-y-6">
          <Field label="Child's full name" error={errors.childName}>
            <input
              name="childName"
              className={INPUT}
              placeholder="Aarav Sharma"
              aria-invalid={!!errors.childName}
              onInput={clear("childName")}
            />
          </Field>

          <div role="radiogroup" aria-labelledby="class-interest-label" className="space-y-3">
            <p id="class-interest-label" className="text-sm font-medium text-[var(--rkps-text-body)]">
              Class for 2026–27
            </p>
            {CLASS_GROUPS.map((group) => (
              <div key={group.label} className="grid gap-2 sm:grid-cols-[8.5rem_1fr] sm:items-center">
                <span className="text-xs text-muted">{group.label}</span>
                <div className="flex flex-wrap gap-2">
                  {group.options.map((option) => {
                    const checked = classInterest === option;
                    return (
                      <label
                        key={option}
                        className={`relative cursor-pointer rounded-lg border px-3 py-2 text-sm transition-colors duration-150 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-[color-mix(in_srgb,var(--rkps-primary)_15%,transparent)] ${
                          checked
                            ? "border-[var(--rkps-primary)] bg-[var(--rkps-primary)] text-white"
                            : "border-[color-mix(in_srgb,var(--rkps-text-body)_14%,transparent)] bg-white text-[var(--rkps-text-body)] hover:border-[var(--rkps-primary)]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="classInterest"
                          value={option}
                          checked={checked}
                          onChange={() => {
                            setClassInterest(option);
                            setErrors((prev) => ({ ...prev, classInterest: undefined }));
                          }}
                          className="sr-only"
                        />
                        {option.replace("Class ", "")}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="grid gap-2 sm:grid-cols-[8.5rem_1fr] sm:items-center">
              <span className="hidden sm:block" />
              <label
                className={`w-fit cursor-pointer rounded-lg border px-3 py-2 text-sm transition-colors duration-150 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-[color-mix(in_srgb,var(--rkps-primary)_15%,transparent)] ${
                  classInterest === "Not sure yet"
                    ? "border-[var(--rkps-primary)] bg-[var(--rkps-primary)] text-white"
                    : "border-dashed border-[color-mix(in_srgb,var(--rkps-text-body)_22%,transparent)] text-muted hover:border-[var(--rkps-primary)]"
                }`}
              >
                <input
                  type="radio"
                  name="classInterest"
                  value="Not sure yet"
                  checked={classInterest === "Not sure yet"}
                  onChange={() => {
                    setClassInterest("Not sure yet");
                    setErrors((prev) => ({ ...prev, classInterest: undefined }));
                  }}
                  className="sr-only"
                />
                Not sure yet — help me choose
              </label>
            </div>
            {errors.classInterest ? (
              <p className="text-xs text-[#b42318]" role="alert">
                {errors.classInterest}
              </p>
            ) : null}
          </div>

          <Field label="Anything we should know" optional>
            <textarea
              name="message"
              rows={3}
              className={`${INPUT} min-h-24 resize-y py-3`}
              placeholder="Transport, a sibling at the school, a good day to visit…"
            />
          </Field>
          </div>
        </fieldset>
      </div>

      <div className="mt-10 border-t border-[color-mix(in_srgb,var(--rkps-text-body)_10%,transparent)] pt-6">
        <label className="flex items-start gap-3 text-sm leading-relaxed text-muted">
          <input
            name="consent"
            type="checkbox"
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[var(--rkps-primary)]"
            onChange={clear("consent")}
          />
          <span>The school office may call, message or email me about this admission enquiry.</span>
        </label>
        {errors.consent ? (
          <p className="mt-2 pl-8 text-xs text-[#b42318]" role="alert">
            {errors.consent}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">An enquiry is not an admission offer</p>
          <button type="submit" disabled={submitting} className="rkps-btn-navy group gap-2 px-6 text-sm sm:min-w-[14rem]">
            {submitting ? "Sending…" : "Send enquiry"}
            {!submitting ? (
              <svg className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            ) : null}
          </button>
        </div>
      </div>
    </form>
  );
}
