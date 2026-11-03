/** Student-facing profile fields mapped from `StudentProfile` (excludes staff-only `internalNotes`). */

export type StudentProfileRecord = {
  studentId: string;
  admissionNumber: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  phone?: string | null;
  alternatePhone?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  bloodGroup?: string | null;
  photoUrl?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  admissionDate?: string | null;
  admissionType?: string | null;
  previousSchool?: string | null;
  nationality?: string | null;
  category?: string | null;
  aadharNumber?: string | null;
  fatherName?: string | null;
  motherName?: string | null;
  guardianName?: string | null;
  guardianPhone?: string | null;
  guardianAlternatePhone?: string | null;
  guardianEmail?: string | null;
  guardianRelation?: string | null;
  guardianOccupation?: string | null;
  guardianAddress?: string | null;
  medicalConditions?: string | null;
  allergies?: string | null;
  transportRoute?: string | null;
  academicNotes?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type ProfileFieldDef = {
  key: keyof StudentProfileRecord;
  label: string;
  mono?: boolean;
  multiline?: boolean;
  href?: (value: string) => string;
};

export type ProfileSectionDef = {
  id: string;
  title: string;
  fields: ProfileFieldDef[];
};

export const STUDENT_PROFILE_SECTIONS: ProfileSectionDef[] = [
  {
    id: "identity",
    title: "Identity & IDs",
    fields: [
      { key: "studentId", label: "Student ID", mono: true },
      { key: "admissionNumber", label: "Admission number", mono: true },
      { key: "firstName", label: "First name" },
      { key: "middleName", label: "Middle name" },
      { key: "lastName", label: "Last name" },
      { key: "gender", label: "Gender" },
      { key: "dateOfBirth", label: "Date of birth" },
      { key: "bloodGroup", label: "Blood group" },
      { key: "nationality", label: "Nationality" },
      { key: "category", label: "Category" },
      { key: "aadharNumber", label: "Aadhaar / ID number", mono: true },
    ],
  },
  {
    id: "contact",
    title: "Contact & address",
    fields: [
      { key: "phone", label: "Phone", href: (v) => `tel:${v}` },
      { key: "alternatePhone", label: "Alternate phone", href: (v) => `tel:${v}` },
      { key: "address", label: "Address", multiline: true },
      { key: "city", label: "City" },
      { key: "state", label: "State" },
      { key: "postalCode", label: "PIN / postal code", mono: true },
    ],
  },
  {
    id: "admission",
    title: "Admission",
    fields: [
      { key: "admissionDate", label: "Admission date" },
      { key: "admissionType", label: "Admission type" },
      { key: "previousSchool", label: "Previous school" },
    ],
  },
  {
    id: "family",
    title: "Parents & guardian",
    fields: [
      { key: "fatherName", label: "Father's name" },
      { key: "motherName", label: "Mother's name" },
      { key: "guardianName", label: "Guardian name" },
      { key: "guardianRelation", label: "Guardian relation" },
      { key: "guardianOccupation", label: "Guardian occupation" },
      { key: "guardianPhone", label: "Guardian phone", href: (v) => `tel:${v}` },
      { key: "guardianAlternatePhone", label: "Guardian alternate phone", href: (v) => `tel:${v}` },
      { key: "guardianEmail", label: "Guardian email", href: (v) => `mailto:${v}` },
      { key: "guardianAddress", label: "Guardian address", multiline: true },
    ],
  },
  {
    id: "medical",
    title: "Medical & transport",
    fields: [
      { key: "medicalConditions", label: "Medical conditions", multiline: true },
      { key: "allergies", label: "Allergies", multiline: true },
      { key: "transportRoute", label: "Transport route" },
    ],
  },
  {
    id: "notes",
    title: "Academic notes",
    fields: [{ key: "academicNotes", label: "Notes", multiline: true }],
  },
  {
    id: "record",
    title: "Record timestamps",
    fields: [
      { key: "createdAt", label: "Profile created" },
      { key: "updatedAt", label: "Last updated" },
    ],
  },
];

function formatEnumLabel(value: string): string {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatProfileFieldValue(
  key: keyof StudentProfileRecord,
  raw: unknown
): string {
  if (raw === null || raw === undefined || raw === "") return "—";
  if (key === "dateOfBirth" || key === "admissionDate") {
    const d = new Date(String(raw));
    if (Number.isNaN(d.getTime())) return String(raw);
    return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  }
  if (key === "createdAt" || key === "updatedAt") {
    const d = new Date(String(raw));
    if (Number.isNaN(d.getTime())) return String(raw);
    return d.toLocaleString();
  }
  if (key === "gender" || key === "admissionType") {
    return formatEnumLabel(String(raw));
  }
  return String(raw);
}
