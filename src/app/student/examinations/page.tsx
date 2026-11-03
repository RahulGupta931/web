"use client";

import { useEffect, useState } from "react";
import { StudentExamsMobile } from "@/components/mobile/student-portal-mobile";
import { DataTable } from "@/components/data-table";
import { PageHeader, PageSection } from "@/components/page-header";
import { useApi } from "@/lib/use-api";

export default function StudentExamsPage() {
  const { get } = useApi();
  const [rows, setRows] = useState<
    { name: string; subjects: { subject: { name: string }; marks: { marksObtained: unknown; grade: string | null }[] }[] }[]
  >([]);

  useEffect(() => {
    get<typeof rows>("/api/student/examinations").then(setRows).catch(() => []);
  }, [get]);

  const flat = rows.flatMap((e) =>
    e.subjects.flatMap((s) =>
      s.marks.map((m) => [e.name, s.subject.name, String(m.marksObtained ?? "—"), m.grade ?? "—"])
    )
  );

  return (
    <>
      <div className="hidden lg:block">
        <PageHeader title="Examinations & results" description="Published marks and grades." />
        <PageSection title="Mark sheet">
          {flat.length === 0 ? (
            <p className="empty-state">No published results yet.</p>
          ) : (
            <DataTable columns={["Exam", "Subject", "Marks", "Grade"]} rows={flat} />
          )}
        </PageSection>
      </div>
      <div className="lg:hidden">
        <StudentExamsMobile rows={rows} />
      </div>
    </>
  );
}
