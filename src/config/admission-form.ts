import { BLOOD_GROUP_OPTIONS, SOCIAL_CATEGORY_OPTIONS } from "@/config/teacher-form";
import {
  GENDER_OPTIONS,
  MEDIUM_OF_INSTRUCTION_OPTIONS,
  SCHOOL_BOARD_OPTIONS,
  STUDENT_ACADEMIC_STREAM_OPTIONS,
  STUDENT_ADMISSION_TYPE_OPTIONS,
} from "@/config/schema-enums";

export { BLOOD_GROUP_OPTIONS, SOCIAL_CATEGORY_OPTIONS, GENDER_OPTIONS };

export const MEDIUM_OPTIONS = MEDIUM_OF_INSTRUCTION_OPTIONS;
export const STREAM_OPTIONS = STUDENT_ACADEMIC_STREAM_OPTIONS;
export const BOARD_OPTIONS = SCHOOL_BOARD_OPTIONS;
export const ADMISSION_TYPE_OPTIONS = STUDENT_ADMISSION_TYPE_OPTIONS;

export const DOC_TYPES = {
  BIRTH_CERTIFICATE: "Birth certificate",
  TRANSFER_CERTIFICATE: "Transfer certificate",
  AADHAR: "Aadhaar (student)",
  MARKSHEET: "Previous marksheet",
  CASTE_CERTIFICATE: "Caste / category certificate",
  ADDRESS_PROOF: "Address proof",
  PASSPORT_PHOTOS: "Passport-size photos",
  MEDICAL_CERTIFICATE: "Medical certificate",
} as const;

export type AdmissionDocType = keyof typeof DOC_TYPES;

export type AdmissionFormState = {
  academicSessionId: string;
  classId: string;
  sectionId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  nationality: string;
  religion: string;
  socialCategory: string;
  motherTongue: string;
  identificationMark1: string;
  identificationMark2: string;
  aadharNumber: string;
  specialNeeds: string;
  admissionDate: string;
  admissionType: string;
  academicStream: string;
  mediumOfInstruction: string;
  previousSchool: string;
  previousSchoolAddress: string;
  previousClass: string;
  boardAffiliation: string;
  reasonForLeaving: string;
  tcNumber: string;
  tcDate: string;
  lastResultGrade: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  sameAsCurrentAddress: boolean;
  permanentAddress: string;
  permanentCity: string;
  permanentState: string;
  permanentPostalCode: string;
  phone: string;
  proposedEmail: string;
  proposedStudentLoginPassword: string;
  fatherName: string;
  fatherOccupation: string;
  fatherMobile: string;
  fatherEmail: string;
  fatherAadhar: string;
  fatherAnnualIncome: string;
  motherName: string;
  motherOccupation: string;
  motherMobile: string;
  motherEmail: string;
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  guardianEmail: string;
  guardianAddress: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  medicalConditions: string;
  allergies: string;
  currentMedications: string;
  doctorName: string;
  doctorContact: string;
  photoUrl: string;
};

export function calcAgeFromDob(dob: string): string {
  if (!dob) return "";
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return "";
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age >= 0 ? String(age) : "";
}

export function isSeniorSecondaryClass(className: string): boolean {
  const n = parseInt(className.replace(/\D/g, ""), 10);
  return n === 11 || n === 12;
}

export const emptyAdmissionForm = (): AdmissionFormState => ({
  academicSessionId: "",
  classId: "",
  sectionId: "",
  firstName: "",
  middleName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "MALE",
  bloodGroup: "",
  nationality: "Indian",
  religion: "",
  socialCategory: "GENERAL",
  motherTongue: "",
  identificationMark1: "",
  identificationMark2: "",
  aadharNumber: "",
  specialNeeds: "",
  admissionDate: new Date().toISOString().slice(0, 10),
  admissionType: "NEW_ADMISSION",
  academicStream: "",
  mediumOfInstruction: "ENGLISH",
  previousSchool: "",
  previousSchoolAddress: "",
  previousClass: "",
  boardAffiliation: "",
  reasonForLeaving: "",
  tcNumber: "",
  tcDate: "",
  lastResultGrade: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  sameAsCurrentAddress: true,
  permanentAddress: "",
  permanentCity: "",
  permanentState: "",
  permanentPostalCode: "",
  phone: "",
  proposedEmail: "",
  proposedStudentLoginPassword: "",
  fatherName: "",
  fatherOccupation: "",
  fatherMobile: "",
  fatherEmail: "",
  fatherAadhar: "",
  fatherAnnualIncome: "",
  motherName: "",
  motherOccupation: "",
  motherMobile: "",
  motherEmail: "",
  guardianName: "",
  guardianRelation: "",
  guardianPhone: "",
  guardianEmail: "",
  guardianAddress: "",
  emergencyContactName: "",
  emergencyContactRelation: "",
  emergencyContactPhone: "",
  medicalConditions: "",
  allergies: "",
  currentMedications: "",
  doctorName: "",
  doctorContact: "",
  photoUrl: "",
});

export function admissionFormToPayload(
  form: AdmissionFormState,
  documents: { title: string; documentType: string; fileUrl: string }[]
) {
  const isTransfer = Boolean(form.previousSchool.trim()) || form.admissionType === "TRANSFER";
  return {
    academicSessionId: form.academicSessionId,
    classId: form.classId,
    sectionId: form.sectionId,
    firstName: form.firstName,
    middleName: form.middleName || undefined,
    lastName: form.lastName,
    dateOfBirth: form.dateOfBirth,
    gender: form.gender,
    bloodGroup: form.bloodGroup || undefined,
    photoUrl: form.photoUrl,
    nationality: form.nationality,
    religion: form.religion || undefined,
    socialCategory: form.socialCategory,
    motherTongue: form.motherTongue || undefined,
    identificationMark1: form.identificationMark1 || undefined,
    identificationMark2: form.identificationMark2 || undefined,
    aadharNumber: form.aadharNumber || undefined,
    specialNeeds: form.specialNeeds || undefined,
    admissionDate: form.admissionDate,
    admissionType: isTransfer ? "TRANSFER" : "NEW_ADMISSION",
    academicStream: form.academicStream || undefined, // set from stream section when class is 11–12
    mediumOfInstruction: form.mediumOfInstruction,
    previousSchool: form.previousSchool || undefined,
    previousSchoolAddress: form.previousSchoolAddress || undefined,
    previousClass: form.previousClass || undefined,
    boardAffiliation: form.boardAffiliation || undefined,
    reasonForLeaving: form.reasonForLeaving || undefined,
    tcNumber: form.tcNumber || undefined,
    tcDate: form.tcDate || undefined,
    lastResultGrade: form.lastResultGrade || undefined,
    address: form.address,
    city: form.city,
    state: form.state,
    postalCode: form.postalCode,
    sameAsCurrentAddress: form.sameAsCurrentAddress,
    permanentAddress: form.permanentAddress || undefined,
    permanentCity: form.permanentCity || undefined,
    permanentState: form.permanentState || undefined,
    permanentPostalCode: form.permanentPostalCode || undefined,
    phone: form.phone || undefined,
    proposedEmail: form.proposedEmail || undefined,
    proposedLoginPhone: form.fatherMobile,
    proposedStudentLoginPassword: form.proposedStudentLoginPassword.trim() || undefined,
    fatherName: form.fatherName,
    fatherOccupation: form.fatherOccupation,
    fatherMobile: form.fatherMobile,
    fatherEmail: form.fatherEmail || undefined,
    fatherAadhar: form.fatherAadhar || undefined,
    fatherAnnualIncome: form.fatherAnnualIncome || undefined,
    motherName: form.motherName,
    motherOccupation: form.motherOccupation || undefined,
    motherMobile: form.motherMobile,
    motherEmail: form.motherEmail || undefined,
    guardianName: form.guardianName || undefined,
    guardianRelation: form.guardianRelation || undefined,
    guardianPhone: form.guardianPhone || undefined,
    guardianEmail: form.guardianEmail || undefined,
    guardianAddress: form.guardianAddress || undefined,
    emergencyContactName: form.emergencyContactName,
    emergencyContactRelation: form.emergencyContactRelation,
    emergencyContactPhone: form.emergencyContactPhone,
    medicalConditions: form.medicalConditions || undefined,
    allergies: form.allergies || undefined,
    currentMedications: form.currentMedications || undefined,
    doctorName: form.doctorName || undefined,
    doctorContact: form.doctorContact || undefined,
    documents,
  };
}

function admissionSupplementalNotes(form: AdmissionFormState): string | undefined {
  const lines: string[] = [];
  if (form.religion.trim()) lines.push(`Religion: ${form.religion.trim()}`);
  if (form.motherTongue.trim()) lines.push(`Mother tongue: ${form.motherTongue.trim()}`);
  if (form.identificationMark1.trim()) lines.push(`ID mark 1: ${form.identificationMark1.trim()}`);
  if (form.identificationMark2.trim()) lines.push(`ID mark 2: ${form.identificationMark2.trim()}`);
  if (form.specialNeeds.trim()) lines.push(`Special needs: ${form.specialNeeds.trim()}`);
  if (form.mediumOfInstruction) lines.push(`Medium: ${form.mediumOfInstruction}`);
  if (form.academicStream) lines.push(`Stream: ${form.academicStream}`);
  if (form.emergencyContactName.trim()) {
    lines.push(
      `Emergency: ${form.emergencyContactName.trim()} (${form.emergencyContactRelation.trim()}) ${form.emergencyContactPhone.trim()}`
    );
  }
  if (form.currentMedications.trim()) lines.push(`Medications: ${form.currentMedications.trim()}`);
  if (form.doctorName.trim()) {
    lines.push(`Doctor: ${form.doctorName.trim()}${form.doctorContact.trim() ? ` — ${form.doctorContact.trim()}` : ""}`);
  }
  return lines.length ? lines.join("\n") : undefined;
}

/** Maps the shared admission UI to principal direct-enroll API (`POST /api/principal/students`). */
export function admissionFormToPrincipalStudentPayload(form: AdmissionFormState, rollNumber: string) {
  const isTransfer = Boolean(form.previousSchool.trim()) || form.admissionType === "TRANSFER";
  const fatherMobile = form.fatherMobile.replace(/\D/g, "");
  const email =
    form.proposedEmail.trim().toLowerCase() ||
    (fatherMobile.length >= 10 ? `${fatherMobile.slice(-10)}@students.local` : "");
  const password = form.proposedStudentLoginPassword.trim();
  const guardianName = form.guardianName.trim() || form.fatherName.trim();
  const guardianPhone = form.guardianPhone.replace(/\D/g, "") || fatherMobile;
  const prevSchoolNotes = [
    form.previousSchoolAddress.trim() ? `Prev. school address: ${form.previousSchoolAddress.trim()}` : "",
    form.previousClass.trim() ? `Last class: ${form.previousClass.trim()}` : "",
    form.boardAffiliation ? `Board: ${form.boardAffiliation}` : "",
    form.reasonForLeaving.trim() ? `Reason for leaving: ${form.reasonForLeaving.trim()}` : "",
    form.tcNumber.trim() ? `TC: ${form.tcNumber.trim()}` : "",
    form.tcDate ? `TC date: ${form.tcDate}` : "",
    form.lastResultGrade.trim() ? `Last result: ${form.lastResultGrade.trim()}` : "",
  ].filter(Boolean);

  const academicNotes = [admissionSupplementalNotes(form), prevSchoolNotes.join("\n")]
    .filter(Boolean)
    .join("\n\n");

  return {
    email,
    password,
    classId: form.classId,
    sectionId: form.sectionId,
    academicSessionId: form.academicSessionId,
    rollNumber: rollNumber.trim(),
    firstName: form.firstName.trim(),
    middleName: form.middleName.trim() || undefined,
    lastName: form.lastName.trim(),
    phone: form.phone.trim() || undefined,
    gender: form.gender,
    dateOfBirth: form.dateOfBirth || undefined,
    bloodGroup: form.bloodGroup || undefined,
    photoUrl: form.photoUrl || undefined,
    address: form.address.trim(),
    city: form.city.trim(),
    state: form.state.trim(),
    postalCode: form.postalCode.trim(),
    admissionDate: form.admissionDate || undefined,
    admissionType: isTransfer ? "TRANSFER" : "NEW_ADMISSION",
    previousSchool: form.previousSchool.trim() || undefined,
    nationality: form.nationality.trim(),
    category: form.socialCategory || undefined,
    aadharNumber: form.aadharNumber || undefined,
    fatherName: form.fatherName.trim() || undefined,
    motherName: form.motherName.trim() || undefined,
    guardianName: guardianName || undefined,
    guardianPhone: guardianPhone || undefined,
    guardianEmail: form.guardianEmail.trim() || form.fatherEmail.trim() || undefined,
    guardianRelation: form.guardianRelation.trim() || "Parent",
    guardianOccupation: form.fatherOccupation.trim() || form.motherOccupation.trim() || undefined,
    guardianAddress: form.guardianAddress.trim() || undefined,
    medicalConditions: form.medicalConditions.trim() || undefined,
    allergies: form.allergies.trim() || undefined,
    academicNotes: academicNotes || undefined,
  };
}

const PHONE_10 = /^\d{10}$/;
const PIN_6 = /^\d{6}$/;
const AADHAR_12 = /^\d{12}$/;

function emailOk(value: string): boolean {
  const v = value.trim();
  if (!v) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export type AdmissionDocFileKey = AdmissionDocType | "studentPhoto" | "fatherPhoto";

/** Client-side checks before upload/submit (shows one combined message). */
export type AdmissionFormValidateOptions = {
  variant?: "teacher" | "principal";
  rollNumber?: string;
};

export function validateAdmissionForm(
  form: AdmissionFormState,
  files: Partial<Record<AdmissionDocFileKey, File>>,
  options?: AdmissionFormValidateOptions
): string | null {
  const variant = options?.variant ?? "teacher";
  const missing: string[] = [];

  if (!form.academicSessionId || !form.classId || !form.sectionId) {
    missing.push("Select class and section (section B).");
  }
  if (variant === "principal" && !options?.rollNumber?.trim()) {
    missing.push("Roll number (section B).");
  }
  if (!form.firstName.trim() || !form.lastName.trim()) missing.push("Student first and last name (section A).");
  if (!form.dateOfBirth) missing.push("Date of birth (section A).");
  if (!form.nationality.trim()) missing.push("Nationality (section A).");
  if (!files.studentPhoto && !form.photoUrl) missing.push("Student photo (section A).");
  if (!form.admissionDate) missing.push("Admission date (section B).");
  if (!form.mediumOfInstruction) missing.push("Medium of instruction (section B).");
  if (!form.address.trim() || !form.city.trim() || !form.state.trim()) {
    missing.push("Current address, city, and state (section D).");
  }
  if (!PIN_6.test(form.postalCode)) missing.push("6-digit PIN code (section D).");
  if (!form.sameAsCurrentAddress) {
    if (!form.permanentAddress.trim() || !form.permanentCity.trim() || !form.permanentState.trim()) {
      missing.push("Permanent address details (section D).");
    }
    if (!PIN_6.test(form.permanentPostalCode)) missing.push("Permanent PIN code (section D).");
  }
  if (!form.fatherName.trim() || !form.fatherOccupation.trim()) missing.push("Father name and occupation (section E).");
  if (!PHONE_10.test(form.fatherMobile)) missing.push("Father 10-digit mobile (section E).");
  if (!form.motherName.trim()) missing.push("Mother name (section E).");
  if (!PHONE_10.test(form.motherMobile)) missing.push("Mother 10-digit mobile (section E).");
  if (!form.emergencyContactName.trim() || !form.emergencyContactRelation.trim()) {
    missing.push("Emergency contact name and relationship (section F).");
  }
  if (!PHONE_10.test(form.emergencyContactPhone)) missing.push("Emergency 10-digit mobile (section F).");

  if (form.aadharNumber && !AADHAR_12.test(form.aadharNumber)) {
    return "Student Aadhaar must be 12 digits (section A).";
  }
  if (form.fatherAadhar && !AADHAR_12.test(form.fatherAadhar)) {
    return "Father Aadhaar must be 12 digits (section E).";
  }
  if (!emailOk(form.fatherEmail)) return "Enter a valid father email or leave it blank (section E).";
  if (!emailOk(form.motherEmail)) return "Enter a valid mother email or leave it blank (section E).";
  if (!emailOk(form.proposedEmail)) return "Enter a valid login email or leave it blank (section H).";
  const pwd = form.proposedStudentLoginPassword.trim();
  if (variant === "principal") {
    if (!emailOk(form.proposedEmail) && !PHONE_10.test(form.fatherMobile)) {
      return "Enter a login email or a valid father mobile for the portal account (sections E & H).";
    }
    if (!pwd || pwd.length < 8) {
      return "Portal password is required (min 8 characters) in section H.";
    }
  } else if (pwd && pwd.length < 8) {
    return "Portal password must be at least 8 characters, or leave it blank (section H).";
  }
  if (form.guardianPhone && !PHONE_10.test(form.guardianPhone)) {
    return "Guardian mobile must be 10 digits (section E).";
  }
  if (form.guardianName.trim() && !PHONE_10.test(form.guardianPhone)) {
    return "Guardian mobile is required when guardian name is set (section E).";
  }

  if (!files.BIRTH_CERTIFICATE) missing.push("Birth certificate upload (section G).");
  if (!files.ADDRESS_PROOF) missing.push("Address proof upload (section G).");

  const isTransfer = Boolean(form.previousSchool.trim()) || form.admissionType === "TRANSFER";
  if (isTransfer) {
    if (!form.previousSchool.trim()) missing.push("Previous school name (section C).");
    if (!files.TRANSFER_CERTIFICATE) missing.push("Transfer certificate (section G).");
  }

  const needsCaste = ["OBC", "SC", "ST", "EWS"].includes(form.socialCategory);
  if (needsCaste && !files.CASTE_CERTIFICATE) {
    missing.push("Caste/category certificate for selected category (section G).");
  }

  if (missing.length > 0) {
    return `Please complete: ${missing.slice(0, 4).join(" ")}${missing.length > 4 ? ` (+${missing.length - 4} more)` : ""}`;
  }
  return null;
}
