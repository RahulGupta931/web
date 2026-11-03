/**
 * UI options aligned with `packages/database/prisma/schema.prisma` enums.
 * Keep values in sync when the schema changes.
 */

export const GENDER_OPTIONS = [
  { value: "UNSPECIFIED", label: "Not specified" },
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
  { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
] as const;

export type Gender = (typeof GENDER_OPTIONS)[number]["value"];

export const NOTICE_AUDIENCE_OPTIONS = [
  { value: "SCHOOL", label: "Whole school", hint: "Teachers & students" },
  { value: "TEACHERS", label: "Staff", hint: "All teachers" },
  { value: "STUDENTS", label: "Students", hint: "All students" },
  { value: "CLASS", label: "One class", hint: "All sections in a class" },
  { value: "SECTION", label: "One section", hint: "Single class section" },
] as const;

export type NoticeAudience = (typeof NOTICE_AUDIENCE_OPTIONS)[number]["value"];

export const STUDENT_ADMISSION_TYPE_OPTIONS = [
  { value: "NEW_ADMISSION", label: "New admission" },
  { value: "TRANSFER", label: "Transfer" },
  { value: "RE_ADMISSION", label: "Re-admission" },
] as const;

export const STUDENT_ACADEMIC_STREAM_OPTIONS = [
  { value: "SCIENCE", label: "Science" },
  { value: "COMMERCE", label: "Commerce" },
  { value: "ARTS", label: "Arts / Humanities" },
  { value: "VOCATIONAL", label: "Vocational" },
] as const;

export const MEDIUM_OF_INSTRUCTION_OPTIONS = [
  { value: "ENGLISH", label: "English" },
  { value: "HINDI", label: "Hindi" },
  { value: "REGIONAL", label: "Regional language" },
] as const;

export const SCHOOL_BOARD_OPTIONS = [
  { value: "CBSE", label: "CBSE" },
  { value: "ICSE", label: "ICSE" },
  { value: "STATE_BOARD", label: "State board" },
  { value: "IB", label: "IB" },
  { value: "OTHER", label: "Other" },
] as const;

export const TEACHER_SOCIAL_CATEGORY_OPTIONS = [
  { value: "GENERAL", label: "General" },
  { value: "OBC", label: "OBC" },
  { value: "SC", label: "SC" },
  { value: "ST", label: "ST" },
  { value: "EWS", label: "EWS" },
] as const;

export const ATTENDANCE_STATUS_OPTIONS = [
  { value: "PRESENT", label: "Present" },
  { value: "ABSENT", label: "Absent" },
  { value: "LATE", label: "Late" },
  { value: "HALF_DAY", label: "Half day" },
  { value: "LEAVE_APPROVED", label: "Approved leave" },
] as const;

export const EXAM_STATUS_OPTIONS = [
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "ONGOING", label: "Ongoing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
] as const;

export const PUBLICATION_STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
] as const;

export const ADMISSION_APPLICATION_STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "RETURNED", label: "Returned" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
] as const;

export function labelForEnumOption<T extends { value: string; label: string }>(
  options: readonly T[],
  value: string | null | undefined
): string {
  if (!value) return "—";
  return options.find((o) => o.value === value)?.label ?? value.replace(/_/g, " ");
}

export function noticeAudienceLabel(audience: string): string {
  return labelForEnumOption(NOTICE_AUDIENCE_OPTIONS, audience);
}
