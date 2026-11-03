export function examMarksSummary(params: {
  studentIds: string[];
  marks: Record<string, string>;
  maxMarks?: number | null;
  passingMarks?: number | null;
}) {
  const { studentIds, marks, maxMarks, passingMarks } = params;
  const total = studentIds.length;
  const numeric: number[] = [];
  for (const id of studentIds) {
    const raw = marks[id];
    if (raw === undefined || raw === "") continue;
    const n = Number(raw);
    if (Number.isFinite(n)) numeric.push(n);
  }
  const entered = numeric.length;
  const pending = Math.max(0, total - entered);
  const passThreshold =
    passingMarks != null && Number.isFinite(Number(passingMarks))
      ? Number(passingMarks)
      : maxMarks != null && Number.isFinite(Number(maxMarks))
        ? Number(maxMarks) * 0.33
        : null;
  let passed = 0;
  let failed = 0;
  if (passThreshold != null) {
    for (const n of numeric) {
      if (n >= passThreshold) passed += 1;
      else failed += 1;
    }
  }
  const average =
    numeric.length > 0
      ? (numeric.reduce((a, b) => a + b, 0) / numeric.length).toFixed(1)
      : "—";

  return { total, entered, pending, passed, failed, average };
}
