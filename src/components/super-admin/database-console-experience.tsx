"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { PanelAlerts } from "@/components/panel-alerts";
import { PageHeader } from "@/components/page-header";
import { API_URL, apiFetch, getApiErrorMessage } from "@/lib/api";

type TableSummary = {
  name: string;
  columnCount: number;
  recordCount: number;
  readOnly: boolean;
  foreignKeyCount: number;
};

type ColumnMeta = {
  name: string;
  dataType: string;
  udtName: string;
  isNullable: boolean;
  columnDefault: string | null;
  isPrimaryKey: boolean;
  isSensitive: boolean;
  foreignKey: { table: string; column: string } | null;
};

type TableMeta = {
  name: string;
  columns: ColumnMeta[];
  primaryKey: string[];
  readOnly: boolean;
  foreignKeys: { column: string; referencesTable: string; referencesColumn: string }[];
};

type RowPage = {
  rows: Record<string, unknown>[];
  total: number;
  page: number;
  pageSize: number;
};

type ImportPreview = {
  headers: string[];
  columns: string[];
  preview: Record<string, unknown>[];
  validCount: number;
  errorCount: number;
  errors: { row: number; column?: string; message: string }[];
  totalRows: number;
};

type AuditLog = {
  id: string;
  action: string;
  entityId: string | null;
  createdAt: string;
  actor: { email: string } | null;
  metadata: unknown;
};

type Tab = "records" | "schema" | "import" | "audit";

function Metric({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="min-w-0 rounded-xl bg-white/10 px-3 py-3 ring-1 ring-white/15">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/70">{label}</p>
      <p className="mt-1 truncate text-lg font-bold tabular-nums sm:text-2xl">{value}</p>
      {hint ? <p className="mt-0.5 truncate text-xs text-white/75">{hint}</p> : null}
    </div>
  );
}

export function DatabaseConsoleExperience() {
  const { token } = useAuth();
  const [tables, setTables] = useState<TableSummary[]>([]);
  const [tableQuery, setTableQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [meta, setMeta] = useState<TableMeta | null>(null);
  const [rows, setRows] = useState<RowPage | null>(null);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<string>("");
  const [dir, setDir] = useState<"asc" | "desc">("desc");
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<Tab>("records");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editor, setEditor] = useState<{ mode: "create" | "edit"; values: Record<string, string>; pk?: Record<string, unknown> } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);
  const [audit, setAudit] = useState<AuditLog[]>([]);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [importing, setImporting] = useState(false);
  const [importDragOver, setImportDragOver] = useState(false);
  const importPreviewGen = useRef(0);
  const mappingRef = useRef<Record<string, string>>({});
  const lastAutoPreviewKey = useRef("");

  useEffect(() => {
    mappingRef.current = mapping;
  }, [mapping]);

  const loadTables = useCallback(() => {
    if (!token) return;
    setLoading(true);
    apiFetch<{ tables: TableSummary[] }>("/api/super-admin/database/tables", { token })
      .then((d) => setTables(d.tables))
      .catch((e) => setError(getApiErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [token]);

  const loadRows = useCallback(() => {
    if (!token || !selected) return;
    const params = new URLSearchParams({ page: String(page), pageSize: "25" });
    if (q.trim()) params.set("q", q.trim());
    if (sort) {
      params.set("sort", sort);
      params.set("dir", dir);
    }
    apiFetch<RowPage>(`/api/super-admin/database/tables/${encodeURIComponent(selected)}/rows?${params}`, { token })
      .then(setRows)
      .catch((e) => setError(getApiErrorMessage(e)));
  }, [token, selected, page, q, sort, dir]);

  useEffect(() => {
    loadTables();
  }, [loadTables]);

  useEffect(() => {
    if (!token || !selected) return;
    apiFetch<TableMeta>(`/api/super-admin/database/tables/${encodeURIComponent(selected)}`, { token })
      .then(setMeta)
      .catch((e) => setError(getApiErrorMessage(e)));
  }, [token, selected]);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  useEffect(() => {
    if (!token || tab !== "audit") return;
    apiFetch<{ logs: AuditLog[] }>("/api/super-admin/database/audit", { token })
      .then((d) => setAudit(d.logs))
      .catch((e) => setError(getApiErrorMessage(e)));
  }, [token, tab, message]);

  const visibleTables = useMemo(() => {
    const query = tableQuery.trim().toLowerCase();
    if (!query) return tables;
    return tables.filter((t) => t.name.toLowerCase().includes(query));
  }, [tables, tableQuery]);

  const writableColumns = meta?.columns.filter((c) => !c.isSensitive) ?? [];

  function openCreate() {
    const values: Record<string, string> = {};
    for (const col of writableColumns) {
      if (col.isPrimaryKey && col.columnDefault) continue;
      values[col.name] = "";
    }
    setEditor({ mode: "create", values });
  }

  function openEdit(row: Record<string, unknown>) {
    if (!meta) return;
    const values: Record<string, string> = {};
    const pk: Record<string, unknown> = {};
    for (const col of meta.columns) {
      if (col.isPrimaryKey) pk[col.name] = row[col.name];
      if (col.isSensitive) continue;
      const v = row[col.name];
      values[col.name] = v == null ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
    }
    setEditor({ mode: "edit", values, pk });
  }

  async function saveEditor() {
    if (!token || !selected || !editor || !meta) return;
    setSaving(true);
    setError(null);
    try {
      const data: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(editor.values)) {
        if (editor.mode === "edit" && meta.primaryKey.includes(key)) continue;
        data[key] = value;
      }
      if (editor.mode === "create") {
        await apiFetch(`/api/super-admin/database/tables/${encodeURIComponent(selected)}/rows`, {
          method: "POST",
          token,
          body: JSON.stringify({ data }),
        });
        setMessage(`Inserted a row into ${selected}.`);
      } else {
        await apiFetch(`/api/super-admin/database/tables/${encodeURIComponent(selected)}/rows`, {
          method: "PATCH",
          token,
          body: JSON.stringify({ pk: editor.pk, data }),
        });
        setMessage(`Updated a row in ${selected}.`);
      }
      setEditor(null);
      loadRows();
      loadTables();
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!token || !selected || !pendingDelete || !meta) return;
    const pk: Record<string, unknown> = {};
    for (const key of meta.primaryKey) pk[key] = pendingDelete[key];
    setSaving(true);
    setError(null);
    try {
      await apiFetch(`/api/super-admin/database/tables/${encodeURIComponent(selected)}/rows`, {
        method: "DELETE",
        token,
        body: JSON.stringify({ pk }),
      });
      setMessage(`Deleted a row from ${selected}.`);
      setPendingDelete(null);
      loadRows();
      loadTables();
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  async function exportCsv() {
    if (!token || !selected) return;
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    const res = await fetch(
      `${API_URL}/api/super-admin/database/tables/${encodeURIComponent(selected)}/export?${params}`,
      { headers: { Authorization: `Bearer ${token}` }, credentials: "include" }
    );
    if (!res.ok) {
      setError("Export failed");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selected}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const runPreview = useCallback(
    async (mappingOverride?: Record<string, string>): Promise<ImportPreview | null> => {
      if (!token || !selected || !importFile) return null;
      const gen = ++importPreviewGen.current;
      setImporting(true);
      setError(null);
      try {
        const activeMapping = mappingOverride ?? mappingRef.current;
        const form = new FormData();
        form.append("file", importFile);
        if (Object.keys(activeMapping).length) form.append("mapping", JSON.stringify(activeMapping));
        const res = await fetch(
          `${API_URL}/api/super-admin/database/tables/${encodeURIComponent(selected)}/import/preview`,
          { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form, credentials: "include" }
        );
        const data = (await res.json()) as ImportPreview & { error?: string };
        if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "Preview failed");
        if (gen !== importPreviewGen.current) return null;
        setPreview(data);
        const autoMap: Record<string, string> = { ...activeMapping };
        for (const header of data.headers) {
          if (!autoMap[header]) {
            const match = data.columns.find((c) => c.toLowerCase() === header.toLowerCase());
            autoMap[header] = match ?? "";
          }
        }
        mappingRef.current = autoMap;
        setMapping(autoMap);
        return data;
      } catch (e) {
        setError(getApiErrorMessage(e));
        return null;
      } finally {
        if (gen === importPreviewGen.current) setImporting(false);
      }
    },
    [token, selected, importFile]
  );

  const commitImport = useCallback(
    async (opts?: { skipConfirm?: boolean }) => {
      if (!token || !selected || !importFile) return;
      if (!opts?.skipConfirm && !window.confirm(`Import valid rows into ${selected}? Invalid rows will be skipped.`)) {
        return;
      }
      setImporting(true);
      setError(null);
      try {
        const form = new FormData();
        form.append("file", importFile);
        form.append("confirm", "yes");
        const activeMapping = mappingRef.current;
        if (Object.keys(activeMapping).length) form.append("mapping", JSON.stringify(activeMapping));
        const res = await fetch(
          `${API_URL}/api/super-admin/database/tables/${encodeURIComponent(selected)}/import/commit`,
          { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form, credentials: "include" }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "Import failed");
        setMessage(`Imported ${data.inserted} row(s) into ${selected}. Skipped ${data.skipped}.`);
        setPreview(null);
        setImportFile(null);
        mappingRef.current = {};
        setMapping({});
        setTab("records");
        loadRows();
        loadTables();
      } catch (e) {
        setError(getApiErrorMessage(e));
      } finally {
        setImporting(false);
      }
    },
    [token, selected, importFile, loadRows, loadTables]
  );

  const bulkImportNow = useCallback(async () => {
    if (!selected) {
      setError("Choose which table to import into.");
      return;
    }
    if (!importFile) {
      setError("Choose a CSV or Excel file to upload.");
      return;
    }
    const data = await runPreview();
    if (!data) return;
    if (data.validCount === 0) {
      setError("No valid rows to import. Check column mapping and fix errors below.");
      setTab("import");
      return;
    }
    const ok = window.confirm(
      `Add ${data.validCount} row(s) to ${selected}?` +
        (data.errorCount > 0 ? ` ${data.errorCount} row(s) with issues will be skipped.` : "")
    );
    if (!ok) return;
    await commitImport({ skipConfirm: true });
  }, [selected, importFile, runPreview, commitImport]);

  const downloadImportTemplate = useCallback(async () => {
    if (!token || !selected) return;
    setError(null);
    try {
      const tableMeta =
        meta?.name === selected
          ? meta
          : await apiFetch<TableMeta>(`/api/super-admin/database/tables/${encodeURIComponent(selected)}`, { token });
      const cols = tableMeta.columns.filter((c) => !c.isSensitive).map((c) => c.name);
      const esc = (s: string) => (/[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);
      const csv = `${cols.map(esc).join(",")}\n`;
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selected}-import-template.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  }, [token, selected, meta]);

  function onImportFileChosen(file: File | null) {
    lastAutoPreviewKey.current = "";
    mappingRef.current = {};
    setImportFile(file);
    setPreview(null);
    setMapping({});
    if (file && selected) setTab("import");
  }

  useEffect(() => {
    if (!importFile || !selected || !token) return;
    const summary = tables.find((t) => t.name === selected);
    if (summary?.readOnly) return;
    const key = `${selected}:${importFile.name}:${importFile.size}`;
    if (lastAutoPreviewKey.current === key) return;
    lastAutoPreviewKey.current = key;
    const timer = window.setTimeout(() => {
      void runPreview({});
    }, 400);
    return () => window.clearTimeout(timer);
  }, [importFile, selected, token, tables, runPreview]);

  const previewColumns = useMemo(() => {
    if (!preview) return [];
    const used = preview.columns.filter((col) =>
      preview.preview.some((row) => row[col] !== "" && row[col] != null)
    );
    return used.length ? used : preview.columns.slice(0, 8);
  }, [preview]);

  const totalRecords = tables.reduce((n, t) => n + t.recordCount, 0);
  const protectedCount = tables.filter((t) => t.readOnly).length;
  const visibleColumns = meta?.columns.filter((c) => !c.isSensitive) ?? [];

  function chooseTable(name: string, nextTab: Tab = "records") {
    lastAutoPreviewKey.current = "";
    setSelected(name);
    setPage(1);
    setSort("");
    setPreview(null);
    setTab(nextTab);
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <PanelAlerts error={error} message={message} messageTitle="Database updated" />
      <PageHeader
        title="Database management"
        description="Browse live tables, edit rows, and load many records from a single CSV or Excel file."
        actions={
          <Link href="/super-admin" className="btn-secondary shrink-0 text-sm">
            Platform home
          </Link>
        }
      />

      <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand-light px-5 py-6 text-white shadow-[var(--shadow-card)] sm:px-6">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">PostgreSQL</p>
        <h2 className="mt-1 text-xl font-bold sm:text-2xl">{loading ? "Reading schema…" : "Public schema"}</h2>
        <p className="mt-1 max-w-xl text-sm text-white/80">
          Password hashes stay hidden. Protected tables can be viewed and exported, not edited.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          <Metric label="Tables" value={loading ? "…" : tables.length} />
          <Metric label="Records" value={loading ? "…" : totalRecords.toLocaleString()} />
          <Metric label="Protected" value={loading ? "…" : protectedCount} hint="Read only" />
          <Metric label="Open table" value={selected ?? "None"} hint={selected ? "Selected" : "Choose from the list"} />
        </div>
      </section>

      <div className="grid items-start gap-4 md:grid-cols-[16.5rem_minmax(0,1fr)]">
        <aside className="card-panel p-3 sm:p-4 md:sticky md:top-4">
          <label className="block">
            <span className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted">Tables</span>
            <input
              className="input-field !mt-2"
              value={tableQuery}
              onChange={(e) => setTableQuery(e.target.value)}
              placeholder="Find a table…"
            />
          </label>
          <p className="mt-2 px-0.5 text-xs text-muted">
            {visibleTables.length} of {tables.length}
          </p>
          <ul className="mt-2 max-h-72 space-y-1 overflow-y-auto pr-1 md:max-h-[32rem]">
            {visibleTables.map((t) => (
              <li key={t.name}>
                <button
                  type="button"
                  onClick={() => chooseTable(t.name)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm ${
                    selected === t.name ? "bg-brand text-white" : "hover:bg-surface-muted"
                  }`}
                >
                  <span className="min-w-0 flex-1 truncate font-medium">{t.name}</span>
                  {t.readOnly ? (
                    <span className={`shrink-0 text-[0.625rem] font-semibold uppercase ${selected === t.name ? "text-white/80" : "text-muted"}`}>
                      Locked
                    </span>
                  ) : null}
                  <span className={`shrink-0 text-xs tabular-nums ${selected === t.name ? "text-white/80" : "text-muted"}`}>
                    {t.recordCount}
                  </span>
                </button>
              </li>
            ))}
            {!loading && visibleTables.length === 0 ? (
              <li className="px-2 py-6 text-center text-sm text-muted">No tables match that search.</li>
            ) : null}
          </ul>
        </aside>

        <div className="min-w-0 space-y-4">
          {!selected || !meta ? (
            <div className="card-panel px-6 py-12 text-center">
              <p className="text-base font-semibold text-heading">Select a table</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                Open a table to view rows, check the schema, or import a CSV or Excel file into it.
              </p>
            </div>
          ) : (
            <>
              <div className="card-panel flex flex-col gap-3 px-4 py-4 sm:px-5 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-bold text-heading">{meta.name}</h3>
                  <p className="mt-1 text-xs text-muted">
                    {meta.columns.length} columns · {meta.foreignKeys.length}{" "}
                    {meta.foreignKeys.length === 1 ? "relationship" : "relationships"}
                    {meta.readOnly ? " · protected" : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="btn-secondary text-sm" onClick={() => void exportCsv()}>
                    Export CSV
                  </button>
                  {!meta.readOnly && (
                    <>
                      <button type="button" className="btn-secondary text-sm" onClick={() => setTab("import")}>
                        Import file
                      </button>
                      <button type="button" className="btn-primary text-sm" onClick={openCreate}>
                        Add record
                      </button>
                    </>
                  )}
                </div>
              </div>

              <nav className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-surface p-1">
                {(
                  [
                    ["records", "Records"],
                    ["schema", "Schema"],
                    ["import", "Import"],
                    ["audit", "Audit"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTab(id)}
                    className={`min-w-[5.5rem] flex-1 rounded-lg px-3 py-2 text-sm font-medium ${
                      tab === id ? "bg-brand text-white" : "text-muted hover:bg-surface-muted"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </nav>

              {tab === "schema" && (
                <div className="card-panel overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-surface-muted text-[0.6875rem] uppercase tracking-wide text-muted">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Column</th>
                          <th className="px-4 py-3 font-semibold">Type</th>
                          <th className="px-4 py-3 font-semibold">Required</th>
                          <th className="px-4 py-3 font-semibold">Relationship</th>
                        </tr>
                      </thead>
                      <tbody>
                        {meta.columns.map((c) => (
                          <tr key={c.name} className="border-t border-border">
                            <td className="px-4 py-3">
                              <span className="font-mono text-xs text-heading">{c.name}</span>
                              <span className="ml-2 inline-flex gap-1">
                                {c.isPrimaryKey ? <span className="rounded bg-brand/10 px-1.5 py-0.5 text-[0.625rem] font-semibold text-brand">PK</span> : null}
                                {c.isSensitive ? <span className="rounded bg-surface-muted px-1.5 py-0.5 text-[0.625rem] font-semibold text-muted">Protected</span> : null}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-muted">{c.dataType}</td>
                            <td className="px-4 py-3">{c.isNullable || c.columnDefault ? "No" : "Yes"}</td>
                            <td className="px-4 py-3 text-xs text-muted">
                              {c.foreignKey ? `${c.foreignKey.table}.${c.foreignKey.column}` : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {tab === "records" && (
                <div className="card-panel overflow-hidden">
                  <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3">
                    <input
                      className="input-field !mt-0 max-w-sm flex-1"
                      value={q}
                      onChange={(e) => {
                        setQ(e.target.value);
                        setPage(1);
                      }}
                      placeholder="Search text columns…"
                    />
                    <p className="text-xs text-muted">{rows ? `${rows.total.toLocaleString()} rows` : "Loading…"}</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-surface-muted text-[0.6875rem] uppercase tracking-wide text-muted">
                        <tr>
                          {visibleColumns.map((c) => (
                            <th key={c.name} className="whitespace-nowrap px-4 py-3 font-semibold">
                              <button
                                type="button"
                                className="font-semibold"
                                onClick={() => {
                                  setSort(c.name);
                                  setDir(sort === c.name && dir === "asc" ? "desc" : "asc");
                                }}
                              >
                                {c.name}
                                {sort === c.name ? (dir === "asc" ? " ↑" : " ↓") : ""}
                              </button>
                            </th>
                          ))}
                          <th className="px-4 py-3 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(rows?.rows.length ?? 0) === 0 ? (
                          <tr>
                            <td colSpan={visibleColumns.length + 1} className="px-4 py-10 text-center text-sm text-muted">
                              {rows ? "No rows on this page." : "Loading records…"}
                            </td>
                          </tr>
                        ) : (
                          rows!.rows.map((row, i) => (
                            <tr key={i} className="border-t border-border/80 hover:bg-surface-muted/50">
                              {visibleColumns.map((c) => (
                                <td key={c.name} className="max-w-[16rem] truncate px-4 py-2.5 align-top text-heading">
                                  {row[c.name] == null || row[c.name] === "" ? "—" : String(row[c.name])}
                                </td>
                              ))}
                              <td className="whitespace-nowrap px-4 py-2.5">
                                {!meta.readOnly && (
                                  <div className="flex gap-3">
                                    <button type="button" className="text-xs font-semibold text-brand" onClick={() => openEdit(row)}>
                                      Edit
                                    </button>
                                    <button type="button" className="text-xs font-semibold text-red-700" onClick={() => setPendingDelete(row)}>
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-3 text-sm">
                    <p className="text-muted">Page {page}</p>
                    <div className="flex gap-2">
                      <button type="button" className="btn-secondary text-xs" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                        Previous
                      </button>
                      <button
                        type="button"
                        className="btn-secondary text-xs"
                        disabled={!rows || page * rows.pageSize >= rows.total}
                        onClick={() => setPage((p) => p + 1)}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {tab === "import" && (
                <div className="card-panel space-y-5 p-4 sm:p-5">
                  {meta.readOnly ? (
                    <p className="text-sm text-muted">This table is protected. Imports are turned off.</p>
                  ) : (
                    <>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base font-bold text-heading">Bulk import</h3>
                          <p className="mt-1 text-sm text-muted">
                            Upload one CSV or Excel file. Matching column names are mapped automatically. Invalid rows are skipped.
                          </p>
                        </div>
                        <button type="button" className="btn-secondary text-sm" onClick={() => void downloadImportTemplate()}>
                          Download template
                        </button>
                      </div>

                      <div
                        className={`rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
                          importDragOver ? "border-brand bg-brand/5" : "border-border bg-surface-muted/40"
                        }`}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setImportDragOver(true);
                        }}
                        onDragLeave={() => setImportDragOver(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setImportDragOver(false);
                          const file = e.dataTransfer.files?.[0];
                          if (file) onImportFileChosen(file);
                        }}
                      >
                        <p className="text-sm font-semibold text-heading">Drop a file here</p>
                        <p className="mt-1 text-xs text-muted">CSV, XLSX, or XLS · up to 8 MB</p>
                        <label className="mt-4 inline-flex cursor-pointer">
                          <span className="btn-secondary text-sm">Choose file</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept=".csv,.xlsx,.xls,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            onChange={(e) => onImportFileChosen(e.target.files?.[0] ?? null)}
                          />
                        </label>
                        {importFile ? (
                          <p className="mt-3 text-sm text-heading">
                            {importFile.name}
                            <button type="button" className="ml-3 text-xs font-semibold text-brand" onClick={() => onImportFileChosen(null)}>
                              Remove
                            </button>
                          </p>
                        ) : null}
                      </div>

                      {preview ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-2">
                            <div className="rounded-xl border border-border bg-surface-muted/40 px-3 py-2.5">
                              <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted">Rows</p>
                              <p className="mt-0.5 text-xl font-bold tabular-nums text-heading">{preview.totalRows}</p>
                            </div>
                            <div className="rounded-xl border border-border bg-surface-muted/40 px-3 py-2.5">
                              <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted">Ready</p>
                              <p className="mt-0.5 text-xl font-bold tabular-nums text-emerald-800">{preview.validCount}</p>
                            </div>
                            <div className="rounded-xl border border-border bg-surface-muted/40 px-3 py-2.5">
                              <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted">Issues</p>
                              <p className="mt-0.5 text-xl font-bold tabular-nums text-red-800">{preview.errorCount}</p>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-heading">Column mapping</p>
                            <p className="mt-1 text-xs text-muted">Point each file header at a database column, then re-check the file.</p>
                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                              {preview.headers.map((header) => (
                                <label key={header} className="block text-xs">
                                  <span className="font-medium text-muted">{header}</span>
                                  <select
                                    className="input-field"
                                    value={mapping[header] ?? ""}
                                    onChange={(e) => {
                                      const next = { ...mapping, [header]: e.target.value };
                                      mappingRef.current = next;
                                      setMapping(next);
                                    }}
                                  >
                                    <option value="">Skip</option>
                                    {preview.columns.map((c) => (
                                      <option key={c} value={c}>
                                        {c}
                                      </option>
                                    ))}
                                  </select>
                                </label>
                              ))}
                            </div>
                          </div>

                          {preview.preview.length > 0 && previewColumns.length > 0 ? (
                            <div className="overflow-hidden rounded-xl border border-border">
                              <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-xs">
                                  <thead className="bg-surface-muted text-muted">
                                    <tr>
                                      {previewColumns.map((col) => (
                                        <th key={col} className="whitespace-nowrap px-3 py-2 font-semibold">
                                          {col}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {preview.preview.slice(0, 5).map((row, i) => (
                                      <tr key={i} className="border-t border-border">
                                        {previewColumns.map((col) => (
                                          <td key={col} className="max-w-[12rem] truncate px-3 py-2">
                                            {row[col] == null || row[col] === "" ? "—" : String(row[col])}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              <p className="border-t border-border px-3 py-2 text-xs text-muted">First rows after mapping</p>
                            </div>
                          ) : null}

                          {preview.errors.length > 0 ? (
                            <ul className="max-h-40 space-y-1 overflow-y-auto rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                              {preview.errors.map((err, i) => (
                                <li key={i}>
                                  Row {err.row}
                                  {err.column ? ` · ${err.column}` : ""}: {err.message}
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ) : null}

                      <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-4">
                        <button
                          type="button"
                          className="btn-secondary text-sm"
                          disabled={!importFile || importing}
                          onClick={() => void runPreview()}
                        >
                          {importing ? "Checking…" : "Check file"}
                        </button>
                        <button
                          type="button"
                          className="btn-primary text-sm"
                          disabled={!importFile || importing || (preview != null && preview.validCount === 0)}
                          onClick={() => void bulkImportNow()}
                        >
                          {importing ? "Working…" : preview ? `Import ${preview.validCount} rows` : "Check and import"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {tab === "audit" && (
                <ul className="space-y-2">
                  {audit.length === 0 ? (
                    <li className="card-panel px-4 py-8 text-center text-sm text-muted">No database changes recorded yet.</li>
                  ) : (
                    audit.map((log) => (
                      <li key={log.id} className="card-panel px-4 py-3 text-sm">
                        <p className="font-semibold text-heading">
                          {log.action} · {log.entityId}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          {log.actor?.email ?? "system"} · {new Date(log.createdAt).toLocaleString("en-IN")}
                        </p>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </>
          )}
        </div>
      </div>

      {editor && meta && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-lg font-bold text-heading">{editor.mode === "create" ? "Add record" : "Edit record"}</h3>
              <p className="mt-1 text-xs text-muted">{meta.name}</p>
            </div>
            <div className="grid gap-3 overflow-y-auto px-5 py-4 sm:grid-cols-2">
              {Object.keys(editor.values).map((key) => {
                const col = meta.columns.find((c) => c.name === key);
                const locked = editor.mode === "edit" && meta.primaryKey.includes(key);
                return (
                  <label key={key} className="text-xs">
                    <span className="font-semibold text-muted">
                      {key}
                      {col && !col.isNullable && !col.columnDefault ? " *" : ""}
                    </span>
                    <input
                      className="input-field"
                      disabled={locked}
                      value={editor.values[key]}
                      onChange={(e) =>
                        setEditor((ed) => (ed ? { ...ed, values: { ...ed.values, [key]: e.target.value } } : ed))
                      }
                    />
                  </label>
                );
              })}
            </div>
            <div className="flex justify-end gap-2 border-t border-border px-5 py-3">
              <button type="button" className="btn-secondary text-sm" onClick={() => setEditor(null)}>
                Cancel
              </button>
              <button type="button" className="btn-primary text-sm" disabled={saving} onClick={() => void saveEditor()}>
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-5 shadow-xl">
            <h3 className="text-lg font-bold text-heading">Delete this record?</h3>
            <p className="mt-2 text-sm text-muted">
              This removes the row from {selected}. A related record can block the delete.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" className="btn-secondary text-sm" onClick={() => setPendingDelete(null)}>
                Cancel
              </button>
              <button type="button" className="btn-primary bg-red-700 text-sm hover:bg-red-800" disabled={saving} onClick={() => void confirmDelete()}>
                {saving ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
