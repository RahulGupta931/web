/** Mirrors API `planStudentLoginEmail` for display before/after approval. */
export function planStudentLoginEmailFromApplication(app: {
  proposedEmail?: string | null;
  proposedLoginPhone?: string | null;
  fatherMobile?: string | null;
  phone?: string | null;
}): string {
  const email = app.proposedEmail?.trim();
  if (email) return email.toLowerCase();
  const phone = (app.proposedLoginPhone ?? app.fatherMobile ?? app.phone ?? "")
    .replace(/\D/g, "");
  if (phone.length >= 10) return `${phone}@students.local`;
  return "";
}
