"use client";

import { useEffect, useState } from "react";
import { StudentMaterialsMobile } from "@/components/mobile/student-content-mobile";
import { PanelResponsive } from "@/components/panel/panel-responsive";
import { DataTable } from "@/components/data-table";
import { PageHeader, PageSection } from "@/components/page-header";
import { useApi } from "@/lib/use-api";

type MaterialRow = { title: string; subject: { name: string }; fileUrl: string };
type DocRow = { title: string; category: string | null; fileUrl: string };

export default function StudentMaterialsPage() {
  const { get } = useApi();
  const [rows, setRows] = useState<MaterialRow[]>([]);
  const [documents, setDocuments] = useState<DocRow[]>([]);

  useEffect(() => {
    get<{ materials: MaterialRow[]; documents: DocRow[] }>("/api/student/materials")
      .then((data) => {
        setRows(Array.isArray(data.materials) ? data.materials : []);
        setDocuments(Array.isArray(data.documents) ? data.documents : []);
      })
      .catch(() => {
        setRows([]);
        setDocuments([]);
      });
  }, [get]);

  return (
    <PanelResponsive
      desktop={
        <>
          <PageHeader title="Study materials" description="Notes and files shared by your teachers." />
          <PageSection title="Subject materials">
            {rows.length === 0 ? (
              <p className="empty-state">No subject materials yet.</p>
            ) : (
              <DataTable
                columns={["Title", "Subject", "File"]}
                rows={rows.map((m) => [m.title, m.subject.name, m.fileUrl])}
              />
            )}
          </PageSection>
          <PageSection title="Class documents">
            {documents.length === 0 ? (
              <p className="empty-state">No class documents yet.</p>
            ) : (
              <DataTable
                columns={["Title", "Category", "File"]}
                rows={documents.map((d) => [d.title, d.category ?? "—", d.fileUrl])}
              />
            )}
          </PageSection>
        </>
      }
      mobile={<StudentMaterialsMobile rows={rows} />}
    />
  );
}
