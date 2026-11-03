export function DataTable({
  columns,
  rows,
  columnClassNames,
  onRowClick,
  selectedRowIndex = null,
}: {
  columns: string[];
  rows: (string | number | null | undefined)[][];
  /** Per-column classes on `<th>` and `<td>` (e.g. `max-w-[12rem] truncate`) */
  columnClassNames?: string[];
  onRowClick?: (rowIndex: number) => void;
  selectedRowIndex?: number | null;
}) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-surface shadow-[var(--shadow-card)]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
              {columns.map((c, i) => (
                <th
                  key={c}
                  className={`px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted first:pl-4 sm:px-4 sm:py-3 ${columnClassNames?.[i] ?? ""}`}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-muted">
                  No records to show
                </td>
              </tr>
            )}
            {rows.map((row, i) => (
              <tr
                key={i}
                className={`border-b border-[var(--border)] last:border-b-0 ${
                  onRowClick ? "cursor-pointer transition hover:bg-[var(--surface-muted)]/80" : ""
                } ${selectedRowIndex === i ? "bg-brand/5 ring-1 ring-inset ring-brand/25" : ""}`}
                onClick={onRowClick ? () => onRowClick(i) : undefined}
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    title={typeof cell === "string" && cell.length > 40 ? cell : undefined}
                    className={`px-3 py-2.5 text-[0.8125rem] text-foreground first:pl-4 sm:px-4 sm:py-3 sm:text-sm ${columnClassNames?.[j] ?? ""}`}
                  >
                    {cell ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
