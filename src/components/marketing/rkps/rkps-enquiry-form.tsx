"use client";

import { FormEvent, useState } from "react";
import { CLASS_OPTIONS } from "@/content/website/rkps-copy";

export function RkpsEnquiryForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rkps-card rkps-feature-surface rounded-[1.25rem] p-6 sm:p-8">
        <p className="rkps-tag">Admission enquiry</p>
        <p className="rkps-display mt-3 text-xl font-semibold text-heading">Thank you for your enquiry.</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          The school office will review your message and contact you. This form does not guarantee admission.
        </p>
      </div>
    );
  }

  return (
    <form id="enquiry" className="rkps-card rkps-feature-surface rkps-reveal scroll-mt-28 rounded-[1.25rem] border border-border/80 p-6 sm:p-8 lg:p-10" onSubmit={onSubmit}>
      <p className="rkps-tag">Admission enquiry</p>
      <p className="rkps-display mt-3 text-2xl font-semibold tracking-tight sm:text-[1.75rem]">Let&apos;s start a conversation.</p>
      <p className="mt-2 text-sm text-muted">Send your details to request admission information. Fields marked * are required.</p>
      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm sm:col-span-1">
          <span className="font-medium text-heading">Parent / guardian name *</span>
          <input name="parentName" className="input-field" required placeholder="Your full name" />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-heading">Mobile number *</span>
          <input name="mobile" type="tel" className="input-field" required placeholder="Your mobile number" />
        </label>
        <label className="flex flex-col gap-2 text-sm sm:col-span-2">
          <span className="font-medium text-heading">Email address</span>
          <input name="email" type="email" className="input-field" placeholder="Your email address" />
        </label>
        <label className="flex flex-col gap-2 text-sm sm:col-span-2">
          <span className="font-medium text-heading">Child&apos;s name *</span>
          <input name="childName" className="input-field" required placeholder="Child's full name" />
        </label>
        <label className="flex flex-col gap-2 text-sm sm:col-span-2">
          <span className="font-medium text-heading">How can we help?</span>
          <textarea name="message" className="input-field min-h-[5rem]" placeholder="Tell us a little about your enquiry…" />
        </label>
        <label className="flex flex-col gap-2 text-sm sm:col-span-2">
          <span className="font-medium text-heading">Class interested in *</span>
          <select name="classInterest" className="input-field" required defaultValue="">
            <option value="" disabled>
              Select class
            </option>
            {CLASS_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="flex gap-2 text-xs leading-relaxed text-muted sm:col-span-2">
          <input name="consent" type="checkbox" className="mt-1" required />
          <span>
            I agree to be contacted by the school about this enquiry. My information will only be used to respond to my
            request.
          </span>
        </label>
      </div>
      <button type="submit" className="rkps-btn-primary rkps-ease rkps-press mt-6">
        Send enquiry
      </button>
    </form>
  );
}
