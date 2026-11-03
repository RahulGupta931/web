import {
  GENDER_OPTIONS,
  TEACHER_SOCIAL_CATEGORY_OPTIONS as SOCIAL_CATEGORY_OPTIONS,
} from "@/config/schema-enums";

export { GENDER_OPTIONS, SOCIAL_CATEGORY_OPTIONS };

export const BLOOD_GROUP_OPTIONS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] as const;

export const MARITAL_STATUS_OPTIONS = [
  { value: "SINGLE", label: "Single" },
  { value: "MARRIED", label: "Married" },
  { value: "DIVORCED", label: "Divorced" },
  { value: "WIDOWED", label: "Widowed" },
] as const;

export const EMPLOYMENT_TYPE_OPTIONS = [
  { value: "FULL_TIME", label: "Full-Time" },
  { value: "PART_TIME", label: "Part-Time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "TEMPORARY", label: "Temporary" },
  { value: "GUEST", label: "Guest" },
] as const;

export const DESIGNATION_OPTIONS = [
  "Teacher",
  "Senior Teacher",
  "HOD",
  "Coordinator",
] as const;

export const ACCESS_LEVEL_OPTIONS = [
  { value: "CLASS_TEACHER", label: "Class Teacher" },
  { value: "SUBJECT_TEACHER", label: "Subject Teacher" },
  { value: "BOTH", label: "Both" },
] as const;

export type TeacherFormState = {
  email: string;
  password: string;
  autoGeneratePassword: boolean;
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  alternatePhone: string;
  gender: string;
  dateOfBirth: string;
  bloodGroup: string;
  nationality: string;
  religion: string;
  socialCategory: string;
  maritalStatus: string;
  aadharNumber: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  sameAsCurrentAddress: boolean;
  permanentAddress: string;
  permanentCity: string;
  permanentState: string;
  permanentPostalCode: string;
  qualification: string;
  university: string;
  yearOfPassing: string;
  percentageOrGrade: string;
  specialization: string;
  additionalCertificates: string;
  department: string;
  designation: string;
  employmentType: string;
  experienceYears: string;
  experienceInSchoolMonths: string;
  previousSchoolName: string;
  previousSchoolAddress: string;
  joinDate: string;
  accessLevel: string;
  subjectIds: string[];
  classIds: string[];
  sectionIds: string[];
  classTeacherSectionIds: string[];
  canMarkAttendance: boolean;
  canEnterMarks: boolean;
  salaryGrade: string;
  basicSalary: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  panNumber: string;
  pfEsiNumber: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactAlternatePhone: string;
  emergencyContactRelation: string;
  internalNotes: string;
  photoUrl: string;
  docPhotoIdProofUrl: string;
  docEducationCertsUrl: string;
  docExperienceLettersUrl: string;
  docPanCardUrl: string;
  docMedicalFitnessUrl: string;
  docPoliceVerificationUrl: string;
};

export function generateTemporaryPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let s = "";
  for (let i = 0; i < 10; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `${s}!9`;
}

export const emptyTeacherForm = (): TeacherFormState => ({
  email: "",
  password: generateTemporaryPassword(),
  autoGeneratePassword: true,
  firstName: "",
  middleName: "",
  lastName: "",
  phone: "",
  alternatePhone: "",
  gender: "MALE",
  dateOfBirth: "",
  bloodGroup: "",
  nationality: "Indian",
  religion: "",
  socialCategory: "GENERAL",
  maritalStatus: "SINGLE",
  aadharNumber: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  sameAsCurrentAddress: true,
  permanentAddress: "",
  permanentCity: "",
  permanentState: "",
  permanentPostalCode: "",
  qualification: "",
  university: "",
  yearOfPassing: "",
  percentageOrGrade: "",
  specialization: "",
  additionalCertificates: "",
  department: "",
  designation: "Teacher",
  employmentType: "FULL_TIME",
  experienceYears: "",
  experienceInSchoolMonths: "",
  previousSchoolName: "",
  previousSchoolAddress: "",
  joinDate: new Date().toISOString().slice(0, 10),
  accessLevel: "BOTH",
  subjectIds: [],
  classIds: [],
  sectionIds: [],
  classTeacherSectionIds: [],
  canMarkAttendance: true,
  canEnterMarks: true,
  salaryGrade: "",
  basicSalary: "",
  accountHolderName: "",
  bankName: "",
  accountNumber: "",
  ifscCode: "",
  panNumber: "",
  pfEsiNumber: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  emergencyContactAlternatePhone: "",
  emergencyContactRelation: "",
  internalNotes: "",
  photoUrl: "",
  docPhotoIdProofUrl: "",
  docEducationCertsUrl: "",
  docExperienceLettersUrl: "",
  docPanCardUrl: "",
  docMedicalFitnessUrl: "",
  docPoliceVerificationUrl: "",
});

export function teacherFormToPayload(form: TeacherFormState) {
  const exp = form.experienceYears.trim();
  const expSchool = form.experienceInSchoolMonths.trim();
  const year = form.yearOfPassing.trim();
  const salary = form.basicSalary.trim();

  const sectionAssignments = form.sectionIds.map((sectionId) => ({
    sectionId,
    isClassTeacher: form.classTeacherSectionIds.includes(sectionId),
  }));

  return {
    email: form.email,
    password: form.password,
    autoGeneratePassword: form.autoGeneratePassword,
    requirePasswordChangeOnFirstLogin: true,
    returnGeneratedPassword: form.autoGeneratePassword,
    firstName: form.firstName,
    middleName: form.middleName || undefined,
    lastName: form.lastName,
    phone: form.phone,
    alternatePhone: form.alternatePhone || undefined,
    personalEmail: form.email,
    gender: form.gender,
    dateOfBirth: form.dateOfBirth,
    bloodGroup: form.bloodGroup || undefined,
    nationality: form.nationality,
    religion: form.religion || undefined,
    socialCategory: form.socialCategory || undefined,
    maritalStatus: form.maritalStatus || undefined,
    aadharNumber: form.aadharNumber,
    photoUrl: form.photoUrl,
    address: form.address,
    city: form.city,
    state: form.state,
    postalCode: form.postalCode,
    sameAsCurrentAddress: form.sameAsCurrentAddress,
    permanentAddress: form.permanentAddress || undefined,
    permanentCity: form.permanentCity || undefined,
    permanentState: form.permanentState || undefined,
    permanentPostalCode: form.permanentPostalCode || undefined,
    qualification: form.qualification,
    university: form.university,
    yearOfPassing: year ? Number(year) : undefined,
    percentageOrGrade: form.percentageOrGrade,
    specialization: form.specialization,
    additionalCertificates: form.additionalCertificates || undefined,
    department: form.department,
    designation: form.designation,
    employmentType: form.employmentType,
    experienceYears: exp ? Number(exp) : undefined,
    experienceInSchoolMonths: expSchool ? Number(expSchool) : undefined,
    previousSchoolName: form.previousSchoolName || undefined,
    previousSchoolAddress: form.previousSchoolAddress || undefined,
    joinDate: form.joinDate,
    accessLevel: form.accessLevel,
    subjectIds: form.subjectIds,
    classIds: form.classIds,
    sectionAssignments: sectionAssignments.length ? sectionAssignments : undefined,
    canMarkAttendance: form.canMarkAttendance,
    canEnterMarks: form.canEnterMarks,
    salaryGrade: form.salaryGrade,
    basicSalary: salary ? Number(salary) : undefined,
    accountHolderName: form.accountHolderName,
    bankName: form.bankName,
    accountNumber: form.accountNumber,
    ifscCode: form.ifscCode,
    panNumber: form.panNumber,
    pfEsiNumber: form.pfEsiNumber || undefined,
    emergencyContactName: form.emergencyContactName,
    emergencyContactPhone: form.emergencyContactPhone,
    emergencyContactAlternatePhone: form.emergencyContactAlternatePhone || undefined,
    emergencyContactRelation: form.emergencyContactRelation,
    docPhotoIdProofUrl: form.docPhotoIdProofUrl,
    docEducationCertsUrl: form.docEducationCertsUrl,
    docExperienceLettersUrl: form.docExperienceLettersUrl || undefined,
    docPanCardUrl: form.docPanCardUrl,
    docMedicalFitnessUrl: form.docMedicalFitnessUrl || undefined,
    docPoliceVerificationUrl: form.docPoliceVerificationUrl || undefined,
    internalNotes: form.internalNotes || undefined,
  };
}
