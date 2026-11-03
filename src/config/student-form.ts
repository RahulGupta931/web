import { GENDER_OPTIONS } from "@/config/teacher-form";
import { STUDENT_ADMISSION_TYPE_OPTIONS as ADMISSION_TYPE_OPTIONS } from "@/config/schema-enums";

export { ADMISSION_TYPE_OPTIONS };

export type StudentFormState = {
  email: string;
  password: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  alternatePhone: string;
  gender: string;
  dateOfBirth: string;
  bloodGroup: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  admissionDate: string;
  admissionType: string;
  previousSchool: string;
  nationality: string;
  category: string;
  aadharNumber: string;
  fatherName: string;
  motherName: string;
  guardianName: string;
  guardianPhone: string;
  guardianAlternatePhone: string;
  guardianEmail: string;
  guardianRelation: string;
  guardianOccupation: string;
  guardianAddress: string;
  medicalConditions: string;
  allergies: string;
  transportRoute: string;
  academicNotes: string;
  internalNotes: string;
  classId: string;
  sectionId: string;
  academicSessionId: string;
  rollNumber: string;
};

export const emptyStudentForm = (): StudentFormState => ({
  email: "",
  password: "Demo@12345",
  firstName: "",
  middleName: "",
  lastName: "",
  phone: "",
  alternatePhone: "",
  gender: "UNSPECIFIED",
  dateOfBirth: "",
  bloodGroup: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  admissionDate: new Date().toISOString().slice(0, 10),
  admissionType: "NEW_ADMISSION",
  previousSchool: "",
  nationality: "Indian",
  category: "",
  aadharNumber: "",
  fatherName: "",
  motherName: "",
  guardianName: "",
  guardianPhone: "",
  guardianAlternatePhone: "",
  guardianEmail: "",
  guardianRelation: "",
  guardianOccupation: "",
  guardianAddress: "",
  medicalConditions: "",
  allergies: "",
  transportRoute: "",
  academicNotes: "",
  internalNotes: "",
  classId: "",
  sectionId: "",
  academicSessionId: "",
  rollNumber: "",
});

export function studentFormToPayload(form: StudentFormState) {
  const opt = (v: string) => v.trim() || undefined;
  return {
    email: form.email,
    password: form.password,
    firstName: form.firstName,
    middleName: opt(form.middleName),
    lastName: form.lastName,
    phone: opt(form.phone),
    alternatePhone: opt(form.alternatePhone),
    gender: form.gender,
    dateOfBirth: opt(form.dateOfBirth),
    bloodGroup: opt(form.bloodGroup),
    address: opt(form.address),
    city: opt(form.city),
    state: opt(form.state),
    postalCode: opt(form.postalCode),
    admissionDate: opt(form.admissionDate),
    admissionType: form.admissionType,
    previousSchool: opt(form.previousSchool),
    nationality: opt(form.nationality),
    category: opt(form.category),
    aadharNumber: opt(form.aadharNumber),
    fatherName: opt(form.fatherName),
    motherName: opt(form.motherName),
    guardianName: opt(form.guardianName),
    guardianPhone: opt(form.guardianPhone),
    guardianAlternatePhone: opt(form.guardianAlternatePhone),
    guardianEmail: opt(form.guardianEmail),
    guardianRelation: opt(form.guardianRelation),
    guardianOccupation: opt(form.guardianOccupation),
    guardianAddress: opt(form.guardianAddress),
    medicalConditions: opt(form.medicalConditions),
    allergies: opt(form.allergies),
    transportRoute: opt(form.transportRoute),
    academicNotes: opt(form.academicNotes),
    internalNotes: opt(form.internalNotes),
    classId: form.classId,
    sectionId: form.sectionId,
    academicSessionId: form.academicSessionId,
    rollNumber: form.rollNumber,
  };
}

export type StudentEditFormState = Omit<
  StudentFormState,
  "password" | "classId" | "sectionId" | "academicSessionId" | "rollNumber"
>;

type StudentCreatePayload = ReturnType<typeof studentFormToPayload>;

function stripEnrollmentFromPayload(payload: StudentCreatePayload): Omit<
  StudentCreatePayload,
  "password" | "classId" | "sectionId" | "academicSessionId" | "rollNumber"
> {
  const {
    password,
    classId,
    sectionId,
    academicSessionId,
    rollNumber,
    ...update
  } = payload;
  void password;
  void classId;
  void sectionId;
  void academicSessionId;
  void rollNumber;
  return update;
}

export function emptyStudentEditForm(): StudentEditFormState {
  const { password, classId, sectionId, academicSessionId, rollNumber, ...rest } = emptyStudentForm();
  void password;
  void classId;
  void sectionId;
  void academicSessionId;
  void rollNumber;
  return rest;
}

export function studentProfileToEditForm(
  p: {
    user?: { email: string } | null;
    firstName: string;
    middleName?: string | null;
    lastName: string;
    phone?: string | null;
    alternatePhone?: string | null;
    gender?: string;
    dateOfBirth?: string | null;
    bloodGroup?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    admissionDate?: string | null;
    admissionType?: string;
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
    internalNotes?: string | null;
  }
): StudentEditFormState {
  const fmt = (d: string | null | undefined) =>
    d ? new Date(d).toISOString().slice(0, 10) : "";
  return {
    email: p.user?.email ?? "",
    firstName: p.firstName,
    middleName: p.middleName ?? "",
    lastName: p.lastName,
    phone: p.phone ?? "",
    alternatePhone: p.alternatePhone ?? "",
    gender: p.gender ?? "UNSPECIFIED",
    dateOfBirth: fmt(p.dateOfBirth),
    bloodGroup: p.bloodGroup ?? "",
    address: p.address ?? "",
    city: p.city ?? "",
    state: p.state ?? "",
    postalCode: p.postalCode ?? "",
    admissionDate: fmt(p.admissionDate),
    admissionType: p.admissionType ?? "NEW_ADMISSION",
    previousSchool: p.previousSchool ?? "",
    nationality: p.nationality ?? "",
    category: p.category ?? "",
    aadharNumber: p.aadharNumber ?? "",
    fatherName: p.fatherName ?? "",
    motherName: p.motherName ?? "",
    guardianName: p.guardianName ?? "",
    guardianPhone: p.guardianPhone ?? "",
    guardianAlternatePhone: p.guardianAlternatePhone ?? "",
    guardianEmail: p.guardianEmail ?? "",
    guardianRelation: p.guardianRelation ?? "",
    guardianOccupation: p.guardianOccupation ?? "",
    guardianAddress: p.guardianAddress ?? "",
    medicalConditions: p.medicalConditions ?? "",
    allergies: p.allergies ?? "",
    transportRoute: p.transportRoute ?? "",
    academicNotes: p.academicNotes ?? "",
    internalNotes: p.internalNotes ?? "",
  };
}

export function studentEditFormToPayload(form: StudentEditFormState) {
  const full = { ...emptyStudentForm(), ...form, password: "", classId: "", sectionId: "", academicSessionId: "", rollNumber: "" };
  return stripEnrollmentFromPayload(studentFormToPayload(full));
}

export { GENDER_OPTIONS };
