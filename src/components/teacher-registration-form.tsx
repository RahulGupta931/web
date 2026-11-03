"use client";

import { FormEvent, useMemo, useState } from "react";
import { FormField } from "@/components/form-field";
import { FormSection } from "@/components/form-section";
import {
  ACCESS_LEVEL_OPTIONS,
  BLOOD_GROUP_OPTIONS,
  DESIGNATION_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  SOCIAL_CATEGORY_OPTIONS,
  emptyTeacherForm,
  generateTemporaryPassword,
  teacherFormToPayload,
  type TeacherFormState,
} from "@/config/teacher-form";
import { PRINCIPAL_FORM_SHELL_CLASS } from "@/components/principal/principal-roster-page-chrome";
import { PanelAlerts } from "@/components/panel-alerts";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

type SchoolClass = {
  id: string;
  name: string;
  sections: { id: string; name: string }[];
};

type Subject = { id: string; name: string };

type DocKey =
  | "profilePhoto"
  | "photoIdProof"
  | "educationCertificates"
  | "experienceLetters"
  | "panCard"
  | "medicalFitness"
  | "policeVerification";

const DOC_FIELD_MAP: Record<
  DocKey,
  { fileLabel: string; urlKey: keyof TeacherFormState; kind: string; required?: boolean }
> = {
  profilePhoto: { fileLabel: "Profile photo *", urlKey: "photoUrl", kind: "profilePhoto", required: true },
  photoIdProof: { fileLabel: "Photo ID proof *", urlKey: "docPhotoIdProofUrl", kind: "photoIdProof", required: true },
  educationCertificates: {
    fileLabel: "Educational certificates *",
    urlKey: "docEducationCertsUrl",
    kind: "educationCertificates",
    required: true,
  },
  experienceLetters: {
    fileLabel: "Experience letters",
    urlKey: "docExperienceLettersUrl",
    kind: "experienceLetters",
  },
  panCard: { fileLabel: "PAN card *", urlKey: "docPanCardUrl", kind: "panCard", required: true },
  medicalFitness: {
    fileLabel: "Medical fitness certificate",
    urlKey: "docMedicalFitnessUrl",
    kind: "medicalFitness",
  },
  policeVerification: {
    fileLabel: "Police verification",
    urlKey: "docPoliceVerificationUrl",
    kind: "policeVerification",
  },
};

export function TeacherRegistrationForm({
  classes,
  subjects,
  onCreated,
}: {
  classes: SchoolClass[];
  subjects: Subject[];
  onCreated?: () => void;
}) {
  const { post, postForm } = useApi();
  const [form, setForm] = useState<TeacherFormState>(emptyTeacherForm);
  const [files, setFiles] = useState<Partial<Record<DocKey, File>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const set = <K extends keyof TeacherFormState>(key: K, value: TeacherFormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const availableSections = useMemo(() => {
    return classes
      .filter((c) => form.classIds.includes(c.id))
      .flatMap((c) =>
        c.sections.map((s) => ({
          id: s.id,
          label: `${c.name}-${s.name}`,
        }))
      );
  }, [classes, form.classIds]);

  function toggleId(list: string[], id: string): string[] {
    return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
  }

  async function uploadFile(file: File, documentKind: string): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("documentKind", documentKind);
    const res = await postForm<{ url: string }>("/api/principal/teachers/documents", fd);
    return res.url;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const next = { ...form };
      for (const [key, meta] of Object.entries(DOC_FIELD_MAP) as [DocKey, (typeof DOC_FIELD_MAP)[DocKey]][]) {
        const file = files[key];
        if (file) {
          const url = await uploadFile(file, meta.kind);
          Object.assign(next, { [meta.urlKey]: url });
        } else if (meta.required && !next[meta.urlKey]) {
          throw new Error(`Please upload: ${meta.fileLabel.replace(" *", "")}`);
        }
      }

      const payload = teacherFormToPayload(next);
      const created = await post<{
        employeeId: string;
        temporaryPassword?: string;
      }>("/api/principal/teachers", payload);

      const pwdNote = created.temporaryPassword
        ? ` Temporary password: ${created.temporaryPassword} (teacher must change on first login).`
        : "";
      setSuccess(`Teacher ${created.employeeId} created.${pwdNote}`);
      setForm(emptyTeacherForm());
      setFiles({});
      onCreated?.();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  const showClassTeacherSections =
    form.accessLevel === "CLASS_TEACHER" || form.accessLevel === "BOTH";

  return (
    <form onSubmit={onSubmit} className={PRINCIPAL_FORM_SHELL_CLASS}>
      <PanelAlerts error={error} message={success} messageTitle="Teacher registered" />

      <FormSection title="Account (teacher login)">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Login email *">
            <input
              type="email"
              required
              className="input-field"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="teacher@school.edu"
            />
          </FormField>
          {!form.autoGeneratePassword ? (
            <FormField label="Initial password *">
              <input
                type="password"
                required
                minLength={8}
                className="input-field"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
              />
            </FormField>
          ) : (
            <FormField label="Initial password (auto-generated)">
              <div className="flex gap-2">
                <input readOnly className="input-field font-mono flex-1" value={form.password} />
                <button
                  type="button"
                  className="btn-secondary text-xs shrink-0"
                  onClick={() => set("password", generateTemporaryPassword())}
                >
                  Regenerate
                </button>
              </div>
            </FormField>
          )}
        </div>
        <label className="mt-3 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.autoGeneratePassword}
            onChange={(e) => {
              const on = e.target.checked;
              setForm((f) => ({
                ...f,
                autoGeneratePassword: on,
                password: on ? generateTemporaryPassword() : f.password,
              }));
            }}
          />
          Auto-generate temporary password (teacher should change on first login)
        </label>
      </FormSection>

      <FormSection title="A — Personal information">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormField label="First name *">
            <input required className="input-field" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
          </FormField>
          <FormField label="Middle name">
            <input className="input-field" value={form.middleName} onChange={(e) => set("middleName", e.target.value)} />
          </FormField>
          <FormField label="Last name *">
            <input required className="input-field" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
          </FormField>
          <FormField label="Date of birth *">
            <input required type="date" className="input-field" value={form.dateOfBirth} onChange={(e) => set("dateOfBirth", e.target.value)} />
          </FormField>
          <FormField label="Gender *">
            <select required className="input-field" value={form.gender} onChange={(e) => set("gender", e.target.value)}>
              {GENDER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Blood group">
            <select className="input-field" value={form.bloodGroup} onChange={(e) => set("bloodGroup", e.target.value)}>
              <option value="">—</option>
              {BLOOD_GROUP_OPTIONS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Nationality *">
            <input required className="input-field" value={form.nationality} onChange={(e) => set("nationality", e.target.value)} />
          </FormField>
          <FormField label="Religion">
            <input className="input-field" value={form.religion} onChange={(e) => set("religion", e.target.value)} />
          </FormField>
          <FormField label="Category">
            <select className="input-field" value={form.socialCategory} onChange={(e) => set("socialCategory", e.target.value)}>
              {SOCIAL_CATEGORY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Marital status">
            <select className="input-field" value={form.maritalStatus} onChange={(e) => set("maritalStatus", e.target.value)}>
              {MARITAL_STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Aadhaar / national ID *">
            <input
              required
              inputMode="numeric"
              pattern="\d{12}"
              maxLength={12}
              className="input-field font-mono"
              value={form.aadharNumber}
              onChange={(e) => set("aadharNumber", e.target.value.replace(/\D/g, "").slice(0, 12))}
            />
          </FormField>
          <FormField label="Profile photo * (JPG/PNG, max 2 MB)">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="input-field text-sm"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setFiles((prev) => ({ ...prev, profilePhoto: f }));
              }}
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="B — Contact details">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormField label="Mobile number *">
            <input
              required
              type="tel"
              inputMode="numeric"
              pattern="\d{10}"
              maxLength={10}
              className="input-field"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
            />
          </FormField>
          <FormField label="Alternate mobile">
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              className="input-field"
              value={form.alternatePhone}
              onChange={(e) => set("alternatePhone", e.target.value.replace(/\D/g, "").slice(0, 10))}
            />
          </FormField>
          <FormField label="Current address *" className="sm:col-span-2 lg:col-span-3">
            <textarea required rows={2} className="input-field" value={form.address} onChange={(e) => set("address", e.target.value)} />
          </FormField>
          <FormField label="City *">
            <input required className="input-field" value={form.city} onChange={(e) => set("city", e.target.value)} />
          </FormField>
          <FormField label="State *">
            <input required className="input-field" value={form.state} onChange={(e) => set("state", e.target.value)} />
          </FormField>
          <FormField label="PIN *">
            <input required className="input-field" value={form.postalCode} onChange={(e) => set("postalCode", e.target.value)} />
          </FormField>
          <label className="flex items-center gap-2 text-sm sm:col-span-2 lg:col-span-3">
            <input
              type="checkbox"
              checked={form.sameAsCurrentAddress}
              onChange={(e) => set("sameAsCurrentAddress", e.target.checked)}
            />
            Permanent address same as current
          </label>
          {!form.sameAsCurrentAddress && (
            <>
              <FormField label="Permanent address *" className="sm:col-span-2 lg:col-span-3">
                <textarea required rows={2} className="input-field" value={form.permanentAddress} onChange={(e) => set("permanentAddress", e.target.value)} />
              </FormField>
              <FormField label="Permanent city *">
                <input required className="input-field" value={form.permanentCity} onChange={(e) => set("permanentCity", e.target.value)} />
              </FormField>
              <FormField label="Permanent state *">
                <input required className="input-field" value={form.permanentState} onChange={(e) => set("permanentState", e.target.value)} />
              </FormField>
              <FormField label="Permanent PIN *">
                <input required className="input-field" value={form.permanentPostalCode} onChange={(e) => set("permanentPostalCode", e.target.value)} />
              </FormField>
            </>
          )}
        </div>
      </FormSection>

      <FormSection title="C — Educational qualifications">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormField label="Highest qualification *">
            <input required className="input-field" placeholder="B.Ed, M.A., Ph.D." value={form.qualification} onChange={(e) => set("qualification", e.target.value)} />
          </FormField>
          <FormField label="University / board *">
            <input required className="input-field" value={form.university} onChange={(e) => set("university", e.target.value)} />
          </FormField>
          <FormField label="Year of passing *">
            <input required type="number" min={1950} max={2100} className="input-field" value={form.yearOfPassing} onChange={(e) => set("yearOfPassing", e.target.value)} />
          </FormField>
          <FormField label="Percentage / grade *">
            <input required className="input-field" value={form.percentageOrGrade} onChange={(e) => set("percentageOrGrade", e.target.value)} />
          </FormField>
          <FormField label="Specialisation / subject *">
            <input required className="input-field" value={form.specialization} onChange={(e) => set("specialization", e.target.value)} />
          </FormField>
          <FormField label="Additional certificates" className="sm:col-span-2 lg:col-span-3">
            <textarea rows={2} className="input-field" value={form.additionalCertificates} onChange={(e) => set("additionalCertificates", e.target.value)} />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="D — Professional details">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormField label="Department *">
            <input required className="input-field" placeholder="Science, Commerce…" value={form.department} onChange={(e) => set("department", e.target.value)} />
          </FormField>
          <FormField label="Designation *">
            <select required className="input-field" value={form.designation} onChange={(e) => set("designation", e.target.value)}>
              {DESIGNATION_OPTIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Employment type *">
            <select required className="input-field" value={form.employmentType} onChange={(e) => set("employmentType", e.target.value)}>
              {EMPLOYMENT_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Total experience (years) *">
            <input required type="number" min={0} max={60} step={0.5} className="input-field" value={form.experienceYears} onChange={(e) => set("experienceYears", e.target.value)} />
          </FormField>
          <FormField label="Experience in this school (months)">
            <input type="number" min={0} className="input-field" value={form.experienceInSchoolMonths} onChange={(e) => set("experienceInSchoolMonths", e.target.value)} />
          </FormField>
          <FormField label="Previous school name">
            <input className="input-field" value={form.previousSchoolName} onChange={(e) => set("previousSchoolName", e.target.value)} />
          </FormField>
          <FormField label="Previous school address" className="sm:col-span-2">
            <input className="input-field" value={form.previousSchoolAddress} onChange={(e) => set("previousSchoolAddress", e.target.value)} />
          </FormField>
        </div>
        <div className="mt-4 space-y-3">
          <p className="text-sm text-muted">Subjects to teach *</p>
          <div className="flex flex-wrap gap-2">
            {subjects.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`rounded-full border px-3 py-1 text-xs ${form.subjectIds.includes(s.id) ? "border-primary text-primary" : "text-muted"}`}
                onClick={() => set("subjectIds", toggleId(form.subjectIds, s.id))}
              >
                {s.name}
              </button>
            ))}
            {subjects.length === 0 && <span className="text-sm text-muted">No subjects configured for this school.</span>}
          </div>
          <p className="text-sm text-muted">Classes to handle *</p>
          <div className="flex flex-wrap gap-2">
            {classes.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`rounded-full border px-3 py-1 text-xs ${form.classIds.includes(c.id) ? "border-primary text-primary" : "text-muted"}`}
                onClick={() => {
                  const nextClassIds = toggleId(form.classIds, c.id);
                  setForm((f) => {
                    const sectionPool = classes
                      .filter((cl) => nextClassIds.includes(cl.id))
                      .flatMap((cl) => cl.sections.map((sec) => sec.id));
                    return {
                      ...f,
                      classIds: nextClassIds,
                      sectionIds: f.sectionIds.filter((id) => sectionPool.includes(id)),
                      classTeacherSectionIds: f.classTeacherSectionIds.filter((id) => sectionPool.includes(id)),
                    };
                  });
                }}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </FormSection>

      <FormSection title="E — System access & assignments">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormField label="Employee ID">
            <input readOnly className="input-field bg-[var(--surface-muted)]" value="Auto-generated on save (e.g. TCH-2026-001)" />
          </FormField>
          <FormField label="Date of joining *">
            <input required type="date" className="input-field" value={form.joinDate} onChange={(e) => set("joinDate", e.target.value)} />
          </FormField>
          <FormField label="Access level *">
            <select required className="input-field" value={form.accessLevel} onChange={(e) => set("accessLevel", e.target.value)}>
              {ACCESS_LEVEL_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </FormField>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.canMarkAttendance} onChange={(e) => set("canMarkAttendance", e.target.checked)} />
            Can mark attendance
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.canEnterMarks} onChange={(e) => set("canEnterMarks", e.target.checked)} />
            Can enter marks
          </label>
        </div>
        {availableSections.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted">Assigned section(s)</p>
            <div className="flex flex-wrap gap-2">
              {availableSections.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`rounded-full border px-3 py-1 text-xs ${form.sectionIds.includes(s.id) ? "border-primary text-primary" : "text-muted"}`}
                  onClick={() => set("sectionIds", toggleId(form.sectionIds, s.id))}
                >
                  {s.label}
                </button>
              ))}
            </div>
            {showClassTeacherSections && form.sectionIds.length > 0 && (
              <>
                <p className="text-sm text-muted">Class teacher for section(s)</p>
                <div className="flex flex-wrap gap-2">
                  {availableSections
                    .filter((s) => form.sectionIds.includes(s.id))
                    .map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className={`rounded-full border px-3 py-1 text-xs ${form.classTeacherSectionIds.includes(s.id) ? "border-amber-500 text-amber-700 dark:text-amber-300" : "text-muted"}`}
                        onClick={() => set("classTeacherSectionIds", toggleId(form.classTeacherSectionIds, s.id))}
                      >
                        {s.label}
                      </button>
                    ))}
                </div>
              </>
            )}
          </div>
        )}
      </FormSection>

      <FormSection title="F — Salary & bank details">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormField label="Salary grade *">
            <input required className="input-field" value={form.salaryGrade} onChange={(e) => set("salaryGrade", e.target.value)} />
          </FormField>
          <FormField label="Basic salary (₹) *">
            <input required type="number" min={0} className="input-field" value={form.basicSalary} onChange={(e) => set("basicSalary", e.target.value)} />
          </FormField>
          <FormField label="Account holder name *">
            <input required className="input-field" value={form.accountHolderName} onChange={(e) => set("accountHolderName", e.target.value)} />
          </FormField>
          <FormField label="Bank name *">
            <input required className="input-field" value={form.bankName} onChange={(e) => set("bankName", e.target.value)} />
          </FormField>
          <FormField label="Account number *">
            <input required className="input-field font-mono" value={form.accountNumber} onChange={(e) => set("accountNumber", e.target.value)} />
          </FormField>
          <FormField label="IFSC code *">
            <input required className="input-field font-mono uppercase" value={form.ifscCode} onChange={(e) => set("ifscCode", e.target.value.toUpperCase())} />
          </FormField>
          <FormField label="PAN number *">
            <input required className="input-field font-mono uppercase" maxLength={10} value={form.panNumber} onChange={(e) => set("panNumber", e.target.value.toUpperCase())} />
          </FormField>
          <FormField label="PF / ESI number">
            <input className="input-field" value={form.pfEsiNumber} onChange={(e) => set("pfEsiNumber", e.target.value)} />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="G — Emergency contact">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormField label="Contact name *">
            <input required className="input-field" value={form.emergencyContactName} onChange={(e) => set("emergencyContactName", e.target.value)} />
          </FormField>
          <FormField label="Relationship *">
            <input required className="input-field" placeholder="Spouse, parent…" value={form.emergencyContactRelation} onChange={(e) => set("emergencyContactRelation", e.target.value)} />
          </FormField>
          <FormField label="Mobile number *">
            <input required type="tel" maxLength={10} className="input-field" value={form.emergencyContactPhone} onChange={(e) => set("emergencyContactPhone", e.target.value.replace(/\D/g, "").slice(0, 10))} />
          </FormField>
          <FormField label="Alternate number">
            <input type="tel" maxLength={10} className="input-field" value={form.emergencyContactAlternatePhone} onChange={(e) => set("emergencyContactAlternatePhone", e.target.value.replace(/\D/g, "").slice(0, 10))} />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="H — Documents upload">
        <div className="grid gap-4 sm:grid-cols-2">
          {(Object.entries(DOC_FIELD_MAP) as [DocKey, (typeof DOC_FIELD_MAP)[DocKey]][])
            .filter(([key]) => key !== "profilePhoto")
            .map(([key, meta]) => (
              <FormField key={key} label={meta.fileLabel}>
                <input
                  type="file"
                  accept={key === "panCard" || key === "photoIdProof" ? "image/*,application/pdf" : "image/*,application/pdf"}
                  className="input-field text-sm"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setFiles((prev) => ({ ...prev, [key]: f }));
                  }}
                />
              </FormField>
            ))}
        </div>
      </FormSection>

      <FormSection title="Internal notes">
        <FormField label="Notes">
          <textarea rows={2} className="input-field" value={form.internalNotes} onChange={(e) => set("internalNotes", e.target.value)} />
        </FormField>
      </FormSection>

      <div className="sticky bottom-0 z-10 -mx-1 mt-4 border-t border-border bg-surface/95 px-1 py-3 backdrop-blur-sm lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0">
        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50 lg:w-auto">
          {submitting ? "Creating teacher…" : "Create teacher account"}
        </button>
      </div>
    </form>
  );
}
