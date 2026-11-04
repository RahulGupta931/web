"use client";

import { FormEvent, useState } from "react";
import { CLASS_OPTIONS } from "@/content/website/rkps-copy";

export function RkpsEnquiryForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const parent = String(fd.get("parentName") ?? "").trim();
    const mobile = String(fd.get("mobile") ?? "").trim();
    const child = String(fd.get("childName") ?? "").trim();
    const classInterest = String(fd.get("classInterest") ?? "");
    const consent = fd.get("consent");

    if (!parent || !mobile || !child || !classInterest || !consent) {
      setError("Please complete all required fields and confirm consent.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 600);
  }

  if (sent) {
    return (
      <div className="flex h-full min-h-[22rem] flex-col justify-center rounded-3xl border border-brand/20 bg-gradient-to-br from-white to-[var(--surface-muted)] p-6 sm:p-10 text-center shadow-xl">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm">
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <span className="mt-4 inline-flex self-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
          Enquiry Received
        </span>
        <h3 className="rkps-display mt-2 text-2xl font-bold text-heading sm:text-3xl">Thank You for Reaching Out</h3>
        <p className="mx-auto mt-2.5 max-w-md text-xs sm:text-sm leading-relaxed text-muted">
          Our admissions coordinator will review your child&apos;s details and contact you within one working day with the relevant prospectus and campus tour options.
        </p>
        <div className="pt-6">
          <button
            type="button"
            onClick={() => setSent(false)}
            className="rkps-btn-navy rkps-btn-sm px-5"
          >
            Submit Another Query
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      id="enquiry"
      className="scroll-mt-28 flex h-full min-h-[28rem] flex-col rounded-2xl border border-border/70 bg-white p-5 sm:min-h-[32rem] sm:p-7 lg:p-8"
      onSubmit={onSubmit}
    >
      <div className="flex flex-1 flex-col">
        <p className="text-xs text-muted">Fields marked * are required</p>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            {error}
          </div>
        )}

        <div className="mt-5 grid flex-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-xs font-medium text-heading sm:col-span-1">
            <span>Parent / Guardian Name *</span>
            <input
              name="parentName"
              className="w-full rounded-xl border border-border bg-[var(--surface-elevated)] px-3.5 py-2.5 text-sm text-heading placeholder:text-muted/60 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 transition min-h-[44px]"
              required
              placeholder="e.g. Rajesh Sharma"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-heading sm:col-span-1">
            <span>Mobile Phone Number *</span>
            <input
              name="mobile"
              type="tel"
              className="w-full rounded-xl border border-border bg-[var(--surface-elevated)] px-3.5 py-2.5 text-sm text-heading placeholder:text-muted/60 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 transition min-h-[44px]"
              required
              placeholder="e.g. +91 98765 43210"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-heading sm:col-span-2">
            <span>Email Address</span>
            <input
              name="email"
              type="email"
              className="w-full rounded-xl border border-border bg-[var(--surface-elevated)] px-3.5 py-2.5 text-sm text-heading placeholder:text-muted/60 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 transition min-h-[44px]"
              placeholder="e.g. rajesh.sharma@example.com"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-heading sm:col-span-2">
            <span>Child&apos;s Full Name *</span>
            <input
              name="childName"
              className="w-full rounded-xl border border-border bg-[var(--surface-elevated)] px-3.5 py-2.5 text-sm text-heading placeholder:text-muted/60 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 transition min-h-[44px]"
              required
              placeholder="e.g. Aarav Sharma"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-heading sm:col-span-2">
            <span>Class / Grade of Interest *</span>
            <select
              name="classInterest"
              className="w-full rounded-xl border border-border bg-[var(--surface-elevated)] px-3.5 py-2.5 text-sm text-heading focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 transition min-h-[44px]"
              required
              defaultValue=""
            >
              <option value="" disabled>
                Select Grade / Program
              </option>
              {CLASS_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-heading sm:col-span-2">
            <span>Questions or Specific Requirements</span>
            <textarea
              name="message"
              className="w-full rounded-xl border border-border bg-[var(--surface-elevated)] px-3.5 py-2.5 text-sm text-heading placeholder:text-muted/60 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 transition min-h-[4.5rem] resize-y"
              placeholder="Tell us about sports, transportation, curriculum, or when you wish to visit…"
            />
          </label>

          <label className="flex items-start gap-2.5 text-xs text-muted sm:col-span-2 pt-1">
            <input
              name="consent"
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-border text-brand focus:ring-brand"
              required
            />
            <span>
              I consent to receive communication and information regarding admission from R.K. Memorial Public School.
            </span>
          </label>
        </div>
      </div>

      <div className="mt-6 border-t border-border/60 pt-5">
        <button
          type="submit"
          disabled={submitting}
          className="rkps-btn-navy w-full text-center text-sm"
        >
          {submitting ? "Sending enquiry…" : "Send admission enquiry"}
        </button>
      </div>
    </form>
  );
}
