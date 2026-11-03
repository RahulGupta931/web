"use client";

import { FormEvent, useEffect, useState } from "react";
import { FormField } from "@/components/form-field";
import type { StudentDetail } from "@/components/student-detail-panel";
import { sectionPickerLabel } from "@/lib/class-section-display";

export type ClassOption = {
  id: string;
  name: string;
  sections: { id: string; name: string }[];
};

export type SessionOption = { id: string; name: string; isCurrent?: boolean };

export type EnrollmentFormValues = {
  academicSessionId: string;
  classId: string;
  sectionId: string;
  rollNumber: string;
};

export function StudentEnrollmentForm({
  activeEnrollment,
  classes,
  sessions,
  submitting,
  onSubmit,
  onCancel,
}: {
  activeEnrollment: StudentDetail["activeEnrollment"];
  classes: ClassOption[];
  sessions: SessionOption[];
  submitting?: boolean;
  onSubmit: (values: EnrollmentFormValues) => void | Promise<void>;
  onCancel?: () => void;
}) {
  const [values, setValues] = useState<EnrollmentFormValues>({
    academicSessionId: "",
    classId: "",
    sectionId: "",
    rollNumber: "",
  });

  useEffect(() => {
    const en = activeEnrollment;
    const currentSession = sessions.find((s) => s.isCurrent) ?? sessions[0];
    setValues({
      academicSessionId: en?.academicSessionId ?? en?.academicSession?.id ?? currentSession?.id ?? "",
      classId: en?.classId ?? en?.class?.id ?? classes[0]?.id ?? "",
      sectionId: en?.sectionId ?? en?.section?.id ?? classes[0]?.sections[0]?.id ?? "",
      rollNumber: en?.rollNumber ?? "",
    });
  }, [activeEnrollment, classes, sessions]);

  const selectedClass = classes.find((c) => c.id === values.classId);
  const sections = selectedClass?.sections ?? [];
  const sectionLabel = sectionPickerLabel(selectedClass?.name);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="card-panel form-shell space-y-4 border border-brand/15">
      <p className="text-sm font-semibold text-heading">Assign class & section</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FormField label="Academic session *">
          <select
            required
            className="input-field"
            value={values.academicSessionId}
            onChange={(e) => setValues((v) => ({ ...v, academicSessionId: e.target.value }))}
          >
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Class *">
          <select
            required
            className="input-field"
            value={values.classId}
            onChange={(e) => {
              const cid = e.target.value;
              const sec = classes.find((c) => c.id === cid)?.sections[0]?.id ?? "";
              setValues((v) => ({ ...v, classId: cid, sectionId: sec }));
            }}
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </FormField>
        <FormField label={`${sectionLabel} *`}>
          <select
            required
            className="input-field"
            value={values.sectionId}
            onChange={(e) => setValues((v) => ({ ...v, sectionId: e.target.value }))}
          >
            {sections.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Roll number *">
          <input
            required
            className="input-field"
            value={values.rollNumber}
            onChange={(e) => setValues((v) => ({ ...v, rollNumber: e.target.value }))}
          />
        </FormField>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={submitting} className="btn-primary text-sm disabled:opacity-50">
          {submitting ? "Saving…" : "Update class assignment"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary text-sm">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
