"use client";

type Props = {
  title?: string;
  loginEmail: string;
  loginPassword?: string | null;
  studentLoginId?: string | null;
  rollNumber?: string | null;
  admissionNumber?: string | null;
  pendingApproval?: boolean;
  note?: string;
};

export function StudentLoginCredentialsCard({
  title = "Student portal login",
  loginEmail,
  loginPassword,
  studentLoginId,
  rollNumber,
  admissionNumber,
  pendingApproval,
  note,
}: Props) {
  return (
    <div className="rounded-xl border border-brand/25 bg-brand/5 px-4 py-3 text-sm">
      <p className="font-semibold text-heading">{title}</p>
      {pendingApproval && (
        <p className="mt-1 text-xs text-muted">
          Waiting for principal approval — password is saved and will work once approved.
        </p>
      )}
      <dl className="mt-3 grid gap-2 sm:grid-cols-2">
        <div>
          <dt className="text-xs text-muted">Login email</dt>
          <dd className="font-mono text-sm font-medium text-foreground break-all">{loginEmail}</dd>
        </div>
        {loginPassword && (
          <div>
            <dt className="text-xs text-muted">Password</dt>
            <dd className="font-mono text-sm font-medium text-foreground">{loginPassword}</dd>
          </div>
        )}
        {studentLoginId && (
          <div>
            <dt className="text-xs text-muted">Student ID</dt>
            <dd className="font-medium">{studentLoginId}</dd>
          </div>
        )}
        {rollNumber && (
          <div>
            <dt className="text-xs text-muted">Roll number</dt>
            <dd className="font-medium">{rollNumber}</dd>
          </div>
        )}
        {admissionNumber && (
          <div>
            <dt className="text-xs text-muted">Admission no.</dt>
            <dd className="font-medium">{admissionNumber}</dd>
          </div>
        )}
      </dl>
      {note && <p className="mt-3 text-xs text-muted">{note}</p>}
      <p className="mt-2 text-xs text-muted">
        Student signs in at the portal with this email and password. Ask them to change the password after first login if required.
      </p>
    </div>
  );
}
