"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { FormField } from "@/components/form-field";
import { FormSection } from "@/components/form-section";
import {
  BOARD_OPTIONS,
  DOC_TYPES,
  GENDER_OPTIONS,
  MEDIUM_OPTIONS,
  STREAM_OPTIONS,
  admissionFormToPayload,
  admissionFormToPrincipalStudentPayload,
  calcAgeFromDob,
  emptyAdmissionForm,
  isSeniorSecondaryClass,
  validateAdmissionForm,
  type AdmissionDocType,
  type AdmissionFormState,
  BLOOD_GROUP_OPTIONS,
  SOCIAL_CATEGORY_OPTIONS,
} from "@/config/admission-form";
import { PanelAlerts } from "@/components/panel-alerts";
import { StudentLoginCredentialsCard } from "@/components/student-login-credentials-card";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";
import { academicStreamFromSectionName, sectionPickerLabel } from "@/lib/class-section-display";

type SectionOption = {
  id: string;
  name: string;
  classId: string;
  class: { id: string; name: string };
};

type Options = {
  academicSession: { id: string; name: string } | null;
  assignedSections: SectionOption[];
};

type PrincipalClassRow = {
  id: string;
  name: string;
  sections: { id: string; name: string }[];
};

type DocFileKey = AdmissionDocType | "studentPhoto" | "fatherPhoto";

type TeacherFormProps = {
  variant?: "teacher";
  onSubmitted?: () => void;
};

type PrincipalFormProps = {
  variant: "principal";
  classes: PrincipalClassRow[];
  sessions: { id: string; name: string; isCurrent: boolean }[];
  onEnrolled?: (creds: {
    loginEmail: string;
    loginPassword: string;
    studentId: string;
    admissionNumber: string;
    rollNumber?: string;
  }) => void;
};

export type StudentAdmissionRegistrationFormProps = TeacherFormProps | PrincipalFormProps;

const UPLOAD_KIND: Record<DocFileKey, string> = {
  studentPhoto: "studentPhoto",
  fatherPhoto: "fatherPhoto",
  BIRTH_CERTIFICATE: "birthCertificate",
  TRANSFER_CERTIFICATE: "transferCertificate",
  AADHAR: "aadhar",
  MARKSHEET: "marksheet",
  CASTE_CERTIFICATE: "casteCertificate",
  ADDRESS_PROOF: "addressProof",
  PASSPORT_PHOTOS: "passportPhotos",
  MEDICAL_CERTIFICATE: "medicalCertificate",
};

export function StudentAdmissionRegistrationForm(props: StudentAdmissionRegistrationFormProps) {
  const variant = props.variant ?? "teacher";
  const { get, post, postForm, isReady } = useApi();
  const [options, setOptions] = useState<Options | null>(null);
  const [form, setForm] = useState<AdmissionFormState>(emptyAdmissionForm);
  const [rollNumber, setRollNumber] = useState("");
  const [files, setFiles] = useState<Partial<Record<DocFileKey, File>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitHint, setSubmitHint] = useState<string | null>(null);
  const [submittedLogin, setSubmittedLogin] = useState<{
    plannedLoginEmail: string | null;
    hasCustomPassword: boolean;
    customPassword?: string;
  } | null>(null);
  const [principalCredentials, setPrincipalCredentials] = useState<{
    loginEmail: string;
    loginPassword: string;
    studentId: string;
    admissionNumber: string;
    rollNumber?: string;
  } | null>(null);

  const principalOptions = useMemo((): Options | null => {
    if (variant !== "principal") return null;
    const p = props as PrincipalFormProps;
    const session = p.sessions.find((s) => s.isCurrent) ?? p.sessions[0] ?? null;
    const assignedSections: SectionOption[] = p.classes.flatMap((c) =>
      c.sections.map((sec) => ({
        id: sec.id,
        name: sec.name,
        classId: c.id,
        class: { id: c.id, name: c.name },
      }))
    );
    return { academicSession: session, assignedSections };
  }, [variant, props]);

  useEffect(() => {
    if (variant === "principal") {
      const o = principalOptions;
      setOptions(o);
      if (o?.assignedSections[0]) {
        setForm((f) => ({
          ...f,
          academicSessionId: o.academicSession?.id ?? "",
          sectionId: o.assignedSections[0].id,
          classId: o.assignedSections[0].classId,
        }));
      }
      return;
    }
    get<Options>("/api/teacher/admissions/options")
      .then((o) => {
        setOptions(o);
        setForm((f) => ({
          ...f,
          academicSessionId: o.academicSession?.id ?? "",
          sectionId: o.assignedSections[0]?.id ?? "",
          classId: o.assignedSections[0]?.classId ?? "",
        }));
      })
      .catch(() => setOptions(null));
  }, [get, variant, principalOptions]);

  const selectedSection = options?.assignedSections.find((s) => s.id === form.sectionId);
  const className = selectedSection?.class.name ?? "";

  const plannedLoginEmail = useMemo(() => {
    const email = form.proposedEmail.trim();
    if (email) return email.toLowerCase();
    const phone = form.fatherMobile.replace(/\D/g, "");
    if (phone.length >= 10) return `${phone}@students.local`;
    return "";
  }, [form.proposedEmail, form.fatherMobile]);
  const showStream = isSeniorSecondaryClass(className);
  const streamFromSection = selectedSection
    ? academicStreamFromSectionName(selectedSection.name)
    : undefined;
  const showStreamDropdown = showStream && !streamFromSection;
  const age = calcAgeFromDob(form.dateOfBirth);

  const classOptions = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of options?.assignedSections ?? []) {
      map.set(s.classId, s.class.name);
    }
    return [...map.entries()].map(([id, name]) => ({ id, name }));
  }, [options]);

  const sectionsForClass = useMemo(
    () => (options?.assignedSections ?? []).filter((s) => s.classId === form.classId),
    [options, form.classId]
  );

  const set = <K extends keyof AdmissionFormState>(key: K, value: AdmissionFormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const documentsUploadPath =
    variant === "principal"
      ? "/api/principal/students/enrollment-documents"
      : "/api/teacher/admissions/documents";

  async function upload(file: File, documentKind: string) {
    const fd = new FormData();
    fd.append("documentKind", documentKind);
    fd.append("file", file);
    const res = await postForm<{ url: string }>(documentsUploadPath, fd);
    return res.url;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitHint(null);
    if (!isReady) {
      setError("Your session is still loading. Wait a moment and try again.");
      return;
    }
    if (!options?.assignedSections?.length) {
      setError(
        variant === "principal"
          ? "Add at least one class and section before enrolling students."
          : "You have no assigned class sections. Ask the principal to assign you as class teacher."
      );
      return;
    }
    const validationError = validateAdmissionForm(form, files, {
      variant,
      rollNumber: variant === "principal" ? rollNumber : undefined,
    });
    if (validationError) {
      setError(validationError);
      document.getElementById("admission-submit-anchor")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const next = { ...form };
      if (files.studentPhoto) {
        next.photoUrl = await upload(files.studentPhoto, UPLOAD_KIND.studentPhoto);
      }
      if (!next.photoUrl) throw new Error("Student photo is required");

      if (variant === "principal") {
        if (!next.academicStream && streamFromSection) {
          next.academicStream = streamFromSection;
        }
        const payload = admissionFormToPrincipalStudentPayload(next, rollNumber);
        const res = await post<{
          loginEmail: string;
          loginPassword: string;
          studentId: string;
          admissionNumber: string;
        }>("/api/principal/students", payload);
        const creds = {
          loginEmail: res.loginEmail,
          loginPassword: res.loginPassword,
          studentId: res.studentId,
          admissionNumber: res.admissionNumber,
          rollNumber: rollNumber.trim(),
        };
        setPrincipalCredentials(creds);
        setSubmitHint("Student enrolled. Share portal login details with the family.");
        (props as PrincipalFormProps).onEnrolled?.(creds);
        return;
      }

      const documents: { title: string; documentType: string; fileUrl: string }[] = [];
      for (const [type, label] of Object.entries(DOC_TYPES) as [AdmissionDocType, string][]) {
        const file = files[type];
        if (file) {
          const url = await upload(file, UPLOAD_KIND[type]);
          documents.push({ title: label, documentType: type, fileUrl: url });
        }
      }

      if (!next.academicStream && streamFromSection) {
        next.academicStream = streamFromSection;
      }
      const payload = admissionFormToPayload(next, documents);
      const res = await post<{
        loginPreview?: {
          plannedLoginEmail: string | null;
          hasCustomPassword?: boolean;
          message?: string;
        };
      }>("/api/teacher/admissions", payload);
      setSubmittedLogin({
        plannedLoginEmail:
          (res.loginPreview?.plannedLoginEmail ?? plannedLoginEmail) || null,
        hasCustomPassword: Boolean(res.loginPreview?.hasCustomPassword),
        customPassword: next.proposedStudentLoginPassword.trim() || undefined,
      });
      setSubmitHint("Application submitted for principal approval.");
    } catch (err) {
      setError(getApiErrorMessage(err));
      document.getElementById("admission-submit-anchor")?.scrollIntoView({ behavior: "smooth", block: "center" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form noValidate onSubmit={onSubmit} className="card-panel form-shell space-y-1">
      <PanelAlerts error={error} />
      {submitHint && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">
          {submitHint}
        </p>
      )}
      {submittedLogin?.plannedLoginEmail && (
        <StudentLoginCredentialsCard
          loginEmail={submittedLogin.plannedLoginEmail}
          loginPassword={
            submittedLogin.hasCustomPassword ? submittedLogin.customPassword : undefined
          }
          pendingApproval
          note={
            submittedLogin.hasCustomPassword
              ? "Share this password with the student now. It will work after principal approval."
              : "A temporary password will appear on your admissions list after the principal approves."
          }
        />
      )}
      {principalCredentials && (
        <StudentLoginCredentialsCard
          loginEmail={principalCredentials.loginEmail}
          loginPassword={principalCredentials.loginPassword}
          studentLoginId={principalCredentials.studentId}
          admissionNumber={principalCredentials.admissionNumber}
          rollNumber={principalCredentials.rollNumber}
          note="Share these credentials with the student. They can sign in to the student portal immediately."
        />
      )}
      {variant === "teacher" && submittedLogin && (props as TeacherFormProps).onSubmitted && (
        <button
          type="button"
          className="btn-secondary text-sm"
          onClick={() => (props as TeacherFormProps).onSubmitted?.()}
        >
          Back to admissions list
        </button>
      )}
      {!submittedLogin && !principalCredentials && (
        <p className="text-sm text-muted pb-2">
          {variant === "principal"
            ? "Same registration form as class teachers use. The student is enrolled immediately with portal access."
            : "Submitted to the Principal for approval. Login details below are prepared for the student portal."}
        </p>
      )}

      <FormSection title="A — Student personal information" collapsible defaultOpenOnMobile>
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
          <FormField label="Age (auto)">
            <input readOnly className="input-field bg-[var(--surface-muted)]" value={age ? `${age} years` : "—"} />
          </FormField>
          <FormField label="Gender *">
            <select required className="input-field" value={form.gender} onChange={(e) => set("gender", e.target.value)}>
              {GENDER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </FormField>
          <FormField label="Blood group">
            <select className="input-field" value={form.bloodGroup} onChange={(e) => set("bloodGroup", e.target.value)}>
              <option value="">—</option>
              {BLOOD_GROUP_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </FormField>
          <FormField label="Nationality *">
            <input required className="input-field" value={form.nationality} onChange={(e) => set("nationality", e.target.value)} />
          </FormField>
          <FormField label="Religion">
            <input className="input-field" value={form.religion} onChange={(e) => set("religion", e.target.value)} />
          </FormField>
          <FormField label="Category *">
            <select required className="input-field" value={form.socialCategory} onChange={(e) => set("socialCategory", e.target.value)}>
              {SOCIAL_CATEGORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </FormField>
          <FormField label="Mother tongue">
            <input className="input-field" value={form.motherTongue} onChange={(e) => set("motherTongue", e.target.value)} />
          </FormField>
          <FormField label="Identification mark 1">
            <input className="input-field" value={form.identificationMark1} onChange={(e) => set("identificationMark1", e.target.value)} />
          </FormField>
          <FormField label="Identification mark 2">
            <input className="input-field" value={form.identificationMark2} onChange={(e) => set("identificationMark2", e.target.value)} />
          </FormField>
          <FormField label="Aadhaar / ID">
            <input className="input-field font-mono" maxLength={12} value={form.aadharNumber} onChange={(e) => set("aadharNumber", e.target.value.replace(/\D/g, "").slice(0, 12))} />
          </FormField>
          <FormField label="Student photo *">
            <input type="file" accept="image/jpeg,image/png,image/webp" className="input-field text-sm" onChange={(e) => { const f = e.target.files?.[0]; if (f) setFiles((p) => ({ ...p, studentPhoto: f })); }} />
          </FormField>
          <FormField label="Special needs / disability" className="sm:col-span-2 lg:col-span-3">
            <textarea rows={2} className="input-field" value={form.specialNeeds} onChange={(e) => set("specialNeeds", e.target.value)} />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="B — Admission details" collapsible>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormField label="Admission date *">
            <input required type="date" className="input-field" value={form.admissionDate} onChange={(e) => set("admissionDate", e.target.value)} />
          </FormField>
          <FormField label="Academic year *">
            <input readOnly className="input-field bg-[var(--surface-muted)]" value={options?.academicSession?.name ?? "—"} />
          </FormField>
          <FormField label="Class applying for *">
            <select
              required
              className="input-field"
              value={form.classId}
              onChange={(e) => {
                const classId = e.target.value;
                const first = (options?.assignedSections ?? []).find((s) => s.classId === classId);
                setForm((f) => ({ ...f, classId, sectionId: first?.id ?? "" }));
              }}
            >
              {classOptions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </FormField>
          <FormField label={`${sectionPickerLabel(className)} *`}>
            <select
              required
              className="input-field"
              value={form.sectionId}
              onChange={(e) => {
                const sectionId = e.target.value;
                const sec = sectionsForClass.find((s) => s.id === sectionId);
                const stream = sec ? academicStreamFromSectionName(sec.name) : undefined;
                setForm((f) => ({
                  ...f,
                  sectionId,
                  academicStream: stream ?? f.academicStream,
                }));
              }}
            >
              {sectionsForClass.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </FormField>
          <FormField label="Medium of instruction *">
            <select required className="input-field" value={form.mediumOfInstruction} onChange={(e) => set("mediumOfInstruction", e.target.value)}>
              {MEDIUM_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </FormField>
          {showStreamDropdown && (
            <FormField label="Stream (11–12)">
              <select className="input-field" value={form.academicStream} onChange={(e) => set("academicStream", e.target.value)}>
                <option value="">—</option>
                {STREAM_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </FormField>
          )}
          {variant === "principal" ? (
            <FormField label="Roll number *">
              <input
                required
                className="input-field"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="e.g. 01"
              />
            </FormField>
          ) : null}
          <FormField label="Admission number">
            <input
              readOnly
              className="input-field bg-[var(--surface-muted)]"
              value={variant === "principal" ? "Assigned on enroll" : "After principal approval"}
            />
          </FormField>
          <FormField label="Student ID">
            <input
              readOnly
              className="input-field bg-[var(--surface-muted)]"
              value={variant === "principal" ? "Assigned on enroll" : "After principal approval"}
            />
          </FormField>
          {variant === "teacher" ? (
            <FormField label="Roll number">
              <input readOnly className="input-field bg-[var(--surface-muted)]" value="Auto-assigned on approval" />
            </FormField>
          ) : null}
        </div>
      </FormSection>

      <FormSection title="C — Previous school" collapsible>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormField label="Previous school name">
            <input className="input-field" value={form.previousSchool} onChange={(e) => set("previousSchool", e.target.value)} />
          </FormField>
          <FormField label="Previous school address" className="sm:col-span-2">
            <input className="input-field" value={form.previousSchoolAddress} onChange={(e) => set("previousSchoolAddress", e.target.value)} />
          </FormField>
          <FormField label="Board / affiliation">
            <select className="input-field" value={form.boardAffiliation} onChange={(e) => set("boardAffiliation", e.target.value)}>
              <option value="">—</option>
              {BOARD_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </FormField>
          <FormField label="Last class attended">
            <input className="input-field" value={form.previousClass} onChange={(e) => set("previousClass", e.target.value)} />
          </FormField>
          <FormField label="Reason for leaving">
            <input className="input-field" value={form.reasonForLeaving} onChange={(e) => set("reasonForLeaving", e.target.value)} />
          </FormField>
          <FormField label="TC number">
            <input className="input-field" value={form.tcNumber} onChange={(e) => set("tcNumber", e.target.value)} />
          </FormField>
          <FormField label="TC date">
            <input type="date" className="input-field" value={form.tcDate} onChange={(e) => set("tcDate", e.target.value)} />
          </FormField>
          <FormField label="Last result / grade">
            <input className="input-field" value={form.lastResultGrade} onChange={(e) => set("lastResultGrade", e.target.value)} />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="D — Address & contact" collapsible>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormField label="Current address *" className="sm:col-span-2 lg:col-span-3">
            <textarea required rows={2} className="input-field" value={form.address} onChange={(e) => set("address", e.target.value)} />
          </FormField>
          <FormField label="City *">
            <input required className="input-field" value={form.city} onChange={(e) => set("city", e.target.value)} />
          </FormField>
          <FormField label="State *">
            <input required className="input-field" value={form.state} onChange={(e) => set("state", e.target.value)} />
          </FormField>
          <FormField label="PIN code *">
            <input required pattern="\d{6}" maxLength={6} className="input-field" value={form.postalCode} onChange={(e) => set("postalCode", e.target.value.replace(/\D/g, "").slice(0, 6))} />
          </FormField>
          <FormField label="Phone (residence)">
            <input className="input-field" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </FormField>
          <label className="flex items-center gap-2 text-sm sm:col-span-2 lg:col-span-3">
            <input type="checkbox" checked={form.sameAsCurrentAddress} onChange={(e) => set("sameAsCurrentAddress", e.target.checked)} />
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
                <input required maxLength={6} className="input-field" value={form.permanentPostalCode} onChange={(e) => set("permanentPostalCode", e.target.value.replace(/\D/g, "").slice(0, 6))} />
              </FormField>
            </>
          )}
        </div>
      </FormSection>

      <FormSection title="E — Parent / guardian" collapsible>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormField label="Father's full name *">
            <input required className="input-field" value={form.fatherName} onChange={(e) => set("fatherName", e.target.value)} />
          </FormField>
          <FormField label="Father's occupation *">
            <input required className="input-field" value={form.fatherOccupation} onChange={(e) => set("fatherOccupation", e.target.value)} />
          </FormField>
          <FormField label="Father's mobile *">
            <input required maxLength={10} className="input-field" value={form.fatherMobile} onChange={(e) => set("fatherMobile", e.target.value.replace(/\D/g, "").slice(0, 10))} />
          </FormField>
          <FormField label="Father's email">
            <input type="email" className="input-field" value={form.fatherEmail} onChange={(e) => set("fatherEmail", e.target.value)} />
          </FormField>
          <FormField label="Father's Aadhaar">
            <input className="input-field font-mono" maxLength={12} value={form.fatherAadhar} onChange={(e) => set("fatherAadhar", e.target.value.replace(/\D/g, "").slice(0, 12))} />
          </FormField>
          <FormField label="Father's annual income">
            <input className="input-field" value={form.fatherAnnualIncome} onChange={(e) => set("fatherAnnualIncome", e.target.value)} />
          </FormField>
          <FormField label="Mother's full name *">
            <input required className="input-field" value={form.motherName} onChange={(e) => set("motherName", e.target.value)} />
          </FormField>
          <FormField label="Mother's occupation">
            <input className="input-field" value={form.motherOccupation} onChange={(e) => set("motherOccupation", e.target.value)} />
          </FormField>
          <FormField label="Mother's mobile *">
            <input required maxLength={10} className="input-field" value={form.motherMobile} onChange={(e) => set("motherMobile", e.target.value.replace(/\D/g, "").slice(0, 10))} />
          </FormField>
          <FormField label="Mother's email">
            <input type="email" className="input-field" value={form.motherEmail} onChange={(e) => set("motherEmail", e.target.value)} />
          </FormField>
          <FormField label="Guardian name">
            <input className="input-field" value={form.guardianName} onChange={(e) => set("guardianName", e.target.value)} />
          </FormField>
          <FormField label="Guardian relationship">
            <input className="input-field" value={form.guardianRelation} onChange={(e) => set("guardianRelation", e.target.value)} />
          </FormField>
          <FormField label="Guardian mobile">
            <input maxLength={10} className="input-field" value={form.guardianPhone} onChange={(e) => set("guardianPhone", e.target.value.replace(/\D/g, "").slice(0, 10))} />
          </FormField>
          <FormField label="Guardian address" className="sm:col-span-2">
            <input className="input-field" value={form.guardianAddress} onChange={(e) => set("guardianAddress", e.target.value)} />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="F — Emergency & medical" collapsible>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormField label="Emergency contact name *">
            <input required className="input-field" value={form.emergencyContactName} onChange={(e) => set("emergencyContactName", e.target.value)} />
          </FormField>
          <FormField label="Relationship *">
            <input required className="input-field" value={form.emergencyContactRelation} onChange={(e) => set("emergencyContactRelation", e.target.value)} />
          </FormField>
          <FormField label="Emergency mobile *">
            <input required maxLength={10} className="input-field" value={form.emergencyContactPhone} onChange={(e) => set("emergencyContactPhone", e.target.value.replace(/\D/g, "").slice(0, 10))} />
          </FormField>
          <FormField label="Medical conditions">
            <input className="input-field" value={form.medicalConditions} onChange={(e) => set("medicalConditions", e.target.value)} />
          </FormField>
          <FormField label="Allergies">
            <input className="input-field" value={form.allergies} onChange={(e) => set("allergies", e.target.value)} />
          </FormField>
          <FormField label="Current medications">
            <input className="input-field" value={form.currentMedications} onChange={(e) => set("currentMedications", e.target.value)} />
          </FormField>
          <FormField label="Doctor name">
            <input className="input-field" value={form.doctorName} onChange={(e) => set("doctorName", e.target.value)} />
          </FormField>
          <FormField label="Doctor contact">
            <input className="input-field" value={form.doctorContact} onChange={(e) => set("doctorContact", e.target.value)} />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="G — Documents checklist" collapsible>
        <div className="grid gap-4 sm:grid-cols-2">
          {(Object.entries(DOC_TYPES) as [AdmissionDocType, string][]).map(([type, label]) => (
            <FormField key={type} label={`${label}${type === "BIRTH_CERTIFICATE" || type === "ADDRESS_PROOF" ? " *" : type === "TRANSFER_CERTIFICATE" ? " * (transfer)" : type === "CASTE_CERTIFICATE" ? " * (if OBC/SC/ST/EWS)" : ""}`}>
              <input
                type="file"
                accept="image/*,application/pdf"
                className="input-field text-sm"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setFiles((p) => ({ ...p, [type]: f }));
                }}
              />
            </FormField>
          ))}
        </div>
      </FormSection>

      <FormSection title="H — Student portal login" collapsible defaultOpenOnMobile>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label={variant === "principal" ? "Login email *" : "Login email (optional)"}>
            <input
              type="email"
              required={variant === "principal"}
              className="input-field"
              value={form.proposedEmail}
              onChange={(e) => set("proposedEmail", e.target.value)}
              placeholder={plannedLoginEmail || "Uses father mobile @students.local"}
            />
          </FormField>
          <FormField
            label={
              variant === "principal"
                ? "Portal password * (min 8 characters)"
                : "Portal password (optional, min 8 characters)"
            }
          >
            <input
              type="text"
              minLength={8}
              required={variant === "principal"}
              autoComplete="new-password"
              className="input-field"
              value={form.proposedStudentLoginPassword}
              onChange={(e) => set("proposedStudentLoginPassword", e.target.value)}
              placeholder={
                variant === "principal" ? "Initial student portal password" : "Leave blank to auto-generate on approval"
              }
            />
          </FormField>
        </div>
        {plannedLoginEmail && (
          <p className="mt-2 text-sm text-muted">
            Planned login email: <span className="font-mono text-foreground">{plannedLoginEmail}</span>
          </p>
        )}
      </FormSection>

      <div id="admission-submit-anchor" className="mt-4 space-y-2">
        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting || !isReady || Boolean(submittedLogin) || Boolean(principalCredentials)}
          className="btn-primary w-full sm:w-auto disabled:opacity-50"
        >
          {submitting
            ? variant === "principal"
              ? "Uploading photo & enrolling…"
              : "Uploading documents & submitting…"
            : variant === "principal"
              ? "Enroll student"
              : "Submit for principal approval"}
        </button>
        <p className="text-xs text-muted">
          {variant === "principal"
            ? "Required: student photo, birth certificate, address proof, roll number, portal password, and all starred fields."
            : "Required: student photo, birth certificate, address proof, and all starred fields. Errors appear above this button and in a popup."}
        </p>
      </div>
    </form>
  );
}
