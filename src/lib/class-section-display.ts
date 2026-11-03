import { isSeniorSecondaryClass } from "@/config/admission-form";

/** Label for the section/stream picker (classes 11–12 use streams). */
export function sectionPickerLabel(className: string | undefined): string {
  return className && isSeniorSecondaryClass(className) ? "Stream" : "Section";
}

/** Roster / filter label, e.g. `10-A` or `11-Science`. */
export function formatClassSection(className: string, sectionName: string): string {
  if (isSeniorSecondaryClass(className)) {
    return `${className}-${sectionName}`;
  }
  return `${className}-${sectionName}`;
}

/** Map stream section name → admission `StudentAcademicStream` enum value. */
export function academicStreamFromSectionName(sectionName: string): string | undefined {
  const key = sectionName.trim().toLowerCase();
  if (key === "science") return "SCIENCE";
  if (key === "commerce") return "COMMERCE";
  if (key === "arts" || key === "art" || key === "humanities") return "ARTS";
  return undefined;
}
