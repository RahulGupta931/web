"use client";

import { FormEvent, useEffect, useState } from "react";
import { FormField } from "@/components/form-field";
import { FormSection } from "@/components/form-section";
import {
  ADMISSION_TYPE_OPTIONS,
  GENDER_OPTIONS,
  studentEditFormToPayload,
  studentProfileToEditForm,
  type StudentEditFormState,
} from "@/config/student-form";
import type { StudentDetail } from "@/components/student-detail-panel";

export function StudentEditForm({
  profile,
  submitting,
  onSubmit,
  onCancel,
}: {
  profile: StudentDetail["profile"];
  submitting?: boolean;
  onSubmit: (payload: ReturnType<typeof studentEditFormToPayload>) => void | Promise<void>;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<StudentEditFormState>(() => studentProfileToEditForm(profile));

  useEffect(() => {
    setForm(studentProfileToEditForm(profile));
  }, [profile]);

  const set = (key: keyof StudentEditFormState, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(studentEditFormToPayload(form));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-1 border-b border-[var(--border)] pb-6">
      <FormSection title="Edit student details">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormField label="Login email">
            <input
              type="email"
              className="input-field"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </FormField>
          <FormField label="First name *">
            <input required className="input-field" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
          </FormField>
          <FormField label="Middle name">
            <input className="input-field" value={form.middleName} onChange={(e) => set("middleName", e.target.value)} />
          </FormField>
          <FormField label="Last name *">
            <input required className="input-field" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
          </FormField>
          <FormField label="Gender">
            <select className="input-field" value={form.gender} onChange={(e) => set("gender", e.target.value)}>
              {GENDER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Date of birth">
            <input type="date" className="input-field" value={form.dateOfBirth} onChange={(e) => set("dateOfBirth", e.target.value)} />
          </FormField>
          <FormField label="Blood group">
            <input className="input-field" value={form.bloodGroup} onChange={(e) => set("bloodGroup", e.target.value)} />
          </FormField>
          <FormField label="Student phone">
            <input type="tel" className="input-field" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </FormField>
          <FormField label="Alternate phone">
            <input type="tel" className="input-field" value={form.alternatePhone} onChange={(e) => set("alternatePhone", e.target.value)} />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Guardian & parents">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormField label="Father name">
            <input className="input-field" value={form.fatherName} onChange={(e) => set("fatherName", e.target.value)} />
          </FormField>
          <FormField label="Mother name">
            <input className="input-field" value={form.motherName} onChange={(e) => set("motherName", e.target.value)} />
          </FormField>
          <FormField label="Guardian name">
            <input className="input-field" value={form.guardianName} onChange={(e) => set("guardianName", e.target.value)} />
          </FormField>
          <FormField label="Guardian phone">
            <input type="tel" className="input-field" value={form.guardianPhone} onChange={(e) => set("guardianPhone", e.target.value)} />
          </FormField>
          <FormField label="Guardian email">
            <input type="email" className="input-field" value={form.guardianEmail} onChange={(e) => set("guardianEmail", e.target.value)} />
          </FormField>
          <FormField label="Relation">
            <input className="input-field" value={form.guardianRelation} onChange={(e) => set("guardianRelation", e.target.value)} />
          </FormField>
          <FormField label="Guardian address" className="sm:col-span-2 lg:col-span-3">
            <textarea rows={2} className="input-field" value={form.guardianAddress} onChange={(e) => set("guardianAddress", e.target.value)} />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Address">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormField label="Street" className="sm:col-span-2 lg:col-span-3">
            <textarea rows={2} className="input-field" value={form.address} onChange={(e) => set("address", e.target.value)} />
          </FormField>
          <FormField label="City">
            <input className="input-field" value={form.city} onChange={(e) => set("city", e.target.value)} />
          </FormField>
          <FormField label="State">
            <input className="input-field" value={form.state} onChange={(e) => set("state", e.target.value)} />
          </FormField>
          <FormField label="PIN">
            <input className="input-field" value={form.postalCode} onChange={(e) => set("postalCode", e.target.value)} />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Health & notes">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Medical conditions">
            <textarea rows={2} className="input-field" value={form.medicalConditions} onChange={(e) => set("medicalConditions", e.target.value)} />
          </FormField>
          <FormField label="Allergies">
            <textarea rows={2} className="input-field" value={form.allergies} onChange={(e) => set("allergies", e.target.value)} />
          </FormField>
          <FormField label="Academic notes">
            <textarea rows={2} className="input-field" value={form.academicNotes} onChange={(e) => set("academicNotes", e.target.value)} />
          </FormField>
          <FormField label="Admission type">
            <select className="input-field" value={form.admissionType} onChange={(e) => set("admissionType", e.target.value)}>
              {ADMISSION_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </FormField>
        </div>
      </FormSection>

      <div className="flex flex-wrap gap-2 pt-2">
        <button type="submit" disabled={submitting} className="btn-primary text-sm disabled:opacity-50">
          {submitting ? "Saving…" : "Save changes"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary text-sm">
            Cancel edit
          </button>
        )}
      </div>
    </form>
  );
}
