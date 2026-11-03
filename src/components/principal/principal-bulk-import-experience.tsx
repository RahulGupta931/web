"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import { principalNavLabel } from "@/config/nav";
import { downloadTextFile, parseCsvText, rowsToCsv } from "@/lib/csv-client";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

type Entity = "students" | "teachers";

type SchemaResponse = {
  students: { headers: string[]; required: string[]; notes: string };
  teachers: { headers: string[]; required: string[]; notes: string };
};

type ContextResponse = {
  classes: { id: string; name: string; sections: { id: string; name: string }[] }[];
  sessions: { id: string; name: string; isCurrent: boolean }[];
};

type ImportResult = {
  created: number;
  failed: number;
  results: { index: number; ok: boolean; label?: string; error?: string }[];
};

function emptyRow(headers: string[]): Record<string, string> {
  return Object.fromEntries(headers.map((h) => [h, ""]));
}

function exampleStudentRow(headers: string[]): Record<string, string> {
  const row = emptyRow(headers);
  row.email = "student1@demo.school";
  row.password = "Demo@12345";
  row.firstName = "Aarav";
  row.lastName = "Sharma";
  row.rollNumber = "1";
  row.className = "1";
  row.sectionName = "A";
  row.gender = "MALE";
  row.guardianPhone = "9876543210";
  return row;
}

function exampleTeacherRow(headers: string[]): Record<string, string> {
  const row = emptyRow(headers);
  row.email = "new.teacher@demo.school";
  row.firstName = "Priya";
  row.lastName = "Verma";
  row.phone = "9876543210";
  row.department = "Science";
  row.designation = "Teacher";
  return row;
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3 shadow-[var(--shadow-card)]">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-2xl font-bold tabular-nums text-heading">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-muted">{sub}</p> : null}
    </div>
  );
}

export function PrincipalBulkImportExperience() {
  const { get, post } = useApi();
  const [entity, setEntity] = useState<Entity>("students");
  const [schema, setSchema] = useState<SchemaResponse | null>(null);
  const [context, setContext] = useState<ContextResponse | null>(null);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [defaultPassword, setDefaultPassword] = useState("Demo@12345");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [lastResult, setLastResult] = useState<ImportResult | null>(null);

  const headers = useMemo(
    () => (entity === "students" ? schema?.students.headers : schema?.teachers.headers) ?? [],
    [entity, schema]
  );

  const required = useMemo(
    () => (entity === "students" ? schema?.students.required : schema?.teachers.required) ?? [],
    [entity, schema]
  );

  const loadMeta = useCallback(() => {
    get<SchemaResponse>("/api/principal/bulk-import/schema")
      .then(setSchema)
      .catch((e) => setError(getApiErrorMessage(e)));
    get<ContextResponse>("/api/principal/bulk-import/context")
      .then(setContext)
      .catch(() => setContext(null));
  }, [get]);

  useEffect(() => {
    loadMeta();
  }, [loadMeta]);

  useEffect(() => {
    if (headers.length === 0) return;
    setRows([entity === "students" ? exampleStudentRow(headers) : exampleTeacherRow(headers)]);
    setLastResult(null);
  }, [entity, headers]);

  function onCsvFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      const { headers: fileHeaders, rows: parsed } = parseCsvText(text);
      if (fileHeaders.length === 0) {
        setError("CSV file is empty.");
        return;
      }
      const normalized = parsed.map((r) => {
        const out = emptyRow(headers.length ? headers : fileHeaders);
        for (const h of fileHeaders) {
          if (h in out || headers.includes(h)) out[h] = r[h] ?? "";
        }
        return out;
      });
      setRows(normalized.length ? normalized : [emptyRow(headers)]);
      setMessage(`Loaded ${normalized.length} row(s) from CSV.`);
      setError(null);
    };
    reader.readAsText(file);
  }

  function updateCell(rowIndex: number, key: string, value: string) {
    setRows((prev) => prev.map((r, i) => (i === rowIndex ? { ...r, [key]: value } : r)));
  }

  function addRow() {
    setRows((prev) => [...prev, emptyRow(headers)]);
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  function downloadTemplate() {
    const sample = entity === "students" ? exampleStudentRow(headers) : exampleTeacherRow(headers);
    downloadTextFile(`${entity}-import-template.csv`, rowsToCsv(headers, [sample]));
  }

  function rowErrors(row: Record<string, string>): string[] {
    const errs: string[] = [];
    for (const key of required) {
      if (!String(row[key] ?? "").trim()) errs.push(`${key} is required`);
    }
    if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
      errs.push("invalid email");
    }
    return errs;
  }

  const rowValidation = rows.map((r) => ({ errors: rowErrors(r) }));
  const validCount = rowValidation.filter((v) => v.errors.length === 0).length;
  const invalidCount = rows.length - validCount;

  async function runImport() {
    const validRows = rows.filter((_, i) => rowValidation[i].errors.length === 0);
    if (validRows.length === 0) {
      setError("Fix validation errors before importing.");
      return;
    }
    setImporting(true);
    setError(null);
    setMessage(null);
    try {
      const path =
        entity === "students" ? "/api/principal/bulk-import/students" : "/api/principal/bulk-import/teachers";
      const body = entity === "students" ? { rows: validRows, defaultPassword } : { rows: validRows };
      const res = await post<ImportResult>(path, body);
      setLastResult(res);
      setMessage(`Import finished: ${res.created} created, ${res.failed} failed.`);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setImporting(false);
    }
  }

  const notes = entity === "students" ? schema?.students.notes : schema?.teachers.notes;

  return (
    <>
      <PanelAlerts error={error} message={message} messageTitle="Import" />

      <PageHeader
        title={principalNavLabel("/principal/bulk-import")}
        description="Add many students or teachers at once. Upload a CSV or edit rows below, then import."
        actions={
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link href="/principal/students" className="btn-secondary text-sm">
              Students
            </Link>
            <Link href="/principal/teachers" className="btn-secondary text-sm">
              Teachers
            </Link>
          </div>
        }
      />

      <section
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand-light px-5 py-6 text-white shadow-[var(--shadow-card)]"
        aria-label="Bulk import"
      >
        <div className="pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-full bg-brand-gold/25 blur-2xl" />
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">Bulk import</p>
        <h2 className="mt-1 text-xl font-bold tracking-tight capitalize sm:text-2xl">{entity}</h2>
        <p className="mt-2 text-sm text-white/85">
          {headers.length} columns · {required.length} required · up to 200 students or 100 teachers per run
        </p>
      </section>

      <div className="grid gap-3 sm:grid-cols-4">
        <StatCard label="Rows" value={rows.length} sub="In preview" />
        <StatCard label="Valid" value={validCount} sub="Ready to import" />
        <StatCard label="Needs fix" value={invalidCount} sub="Validation errors" />
        <StatCard
          label="Last run"
          value={lastResult ? lastResult.created : "—"}
          sub={lastResult ? `${lastResult.failed} failed` : "Not imported yet"}
        />
      </div>

      <nav
        className="flex gap-1 rounded-xl border border-border bg-surface p-1 shadow-[var(--shadow-card)]"
        aria-label="Import type"
      >
        {(["students", "teachers"] as Entity[]).map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => setEntity(e)}
            className={`flex flex-1 items-center justify-center rounded-lg px-3 py-2.5 text-sm font-medium capitalize transition-colors ${
              entity === e ? "bg-brand text-white shadow-sm" : "text-muted hover:bg-surface-muted hover:text-heading"
            }`}
          >
            {e}
          </button>
        ))}
      </nav>

      {notes && (
        <div className="card-panel form-shell text-sm text-muted">
          <p className="form-section-title text-heading">Column guide</p>
          <p className="mt-2">{notes}</p>
        </div>
      )}

      {context && entity === "students" && (
        <section className="card-panel overflow-hidden">
          <div className="border-b border-border px-4 py-3 sm:px-5">
            <p className="form-section-title">Class & section names</p>
            <p className="mt-1 text-sm text-muted">Use exact values in className and sectionName columns.</p>
          </div>
          <ul className="divide-y divide-border text-sm">
            {context.classes.map((c) => (
              <li key={c.id} className="px-4 py-3 sm:px-5">
                <span className="font-medium text-heading">Class {c.name}</span>
                <span className="text-muted"> — sections {c.sections.map((s) => s.name).join(", ") || "none"}</span>
              </li>
            ))}
          </ul>
          {context.sessions.length > 0 && (
            <p className="border-t border-border px-4 py-3 text-sm text-muted sm:px-5">
              Current session:{" "}
              <span className="font-medium text-heading">
                {context.sessions.find((s) => s.isCurrent)?.name ?? context.sessions[0].name}
              </span>
            </p>
          )}
        </section>
      )}

      <section className="card-panel form-shell space-y-4">
        <p className="form-section-title">CSV & rows</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-secondary text-sm" onClick={downloadTemplate}>
            Download template
          </button>
          <label className="btn-primary cursor-pointer text-sm">
            Upload CSV
            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onCsvFile(f);
                e.target.value = "";
              }}
            />
          </label>
          <button type="button" className="btn-secondary text-sm" onClick={addRow}>
            Add row
          </button>
        </div>
        {entity === "students" && (
          <label className="block max-w-md text-sm">
            <span className="text-muted">Default password (when CSV password is empty)</span>
            <input
              className="input-field mt-1 w-full"
              value={defaultPassword}
              onChange={(e) => setDefaultPassword(e.target.value)}
            />
          </label>
        )}
      </section>

      <section className="card-panel overflow-hidden">
        <div className="border-b border-border bg-gradient-to-r from-brand/8 via-transparent to-transparent px-4 py-3 sm:px-5">
          <p className="form-section-title">Preview — {rows.length} row(s)</p>
          <p className="mt-1 text-sm text-muted">Required columns marked with *</p>
        </div>
        <div className="overflow-x-auto p-2 sm:p-4">
          <table className="min-w-full text-left text-xs sm:text-sm">
            <thead className="bg-surface-muted">
              <tr>
                <th className="px-2 py-2">#</th>
                {headers.map((h) => (
                  <th key={h} className="px-2 py-2 font-semibold text-heading">
                    {h}
                    {required.includes(h) ? <span className="text-brand"> *</span> : null}
                  </th>
                ))}
                <th className="px-2 py-2" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => {
                const errs = rowValidation[ri].errors;
                return (
                  <tr key={ri} className={errs.length ? "bg-red-500/5" : "border-t border-border"}>
                    <td className="px-2 py-1 align-top text-muted">{ri + 1}</td>
                    {headers.map((h) => (
                      <td key={h} className="px-1 py-1 align-top">
                        <input
                          className="input-field !py-1 !text-xs min-w-[7rem]"
                          value={row[h] ?? ""}
                          onChange={(e) => updateCell(ri, h, e.target.value)}
                        />
                      </td>
                    ))}
                    <td className="px-2 py-1 align-top">
                      <button type="button" className="text-xs font-semibold text-red-700" onClick={() => removeRow(ri)}>
                        Remove
                      </button>
                      {errs.length > 0 && (
                        <p className="mt-1 max-w-[10rem] text-[0.65rem] text-red-700">{errs.join("; ")}</p>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="border-t border-border px-4 py-4 sm:px-5">
          <button
            type="button"
            disabled={importing || validCount === 0}
            onClick={runImport}
            className="btn-primary disabled:opacity-50"
          >
            {importing ? "Importing…" : `Import ${validCount} valid row(s)`}
          </button>
        </div>
      </section>

      {lastResult && (
        <section className="card-panel overflow-hidden">
          <div className="border-b border-border px-4 py-3 sm:px-5">
            <p className="form-section-title">Import results</p>
            <p className="mt-1 text-sm text-muted">
              {lastResult.created} created · {lastResult.failed} failed
            </p>
          </div>
          <ul className="max-h-64 divide-y divide-border overflow-y-auto text-sm">
            {lastResult.results.map((r) => (
              <li
                key={r.index}
                className={`px-4 py-2 sm:px-5 ${r.ok ? "text-emerald-800" : "text-red-700"}`}
              >
                Row {r.index + 1}: {r.ok ? `✓ ${r.label}` : `✗ ${r.error}`}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
