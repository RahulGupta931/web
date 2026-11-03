"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

export type ClassOption = {
  id: string;
  name: string;
  sections: { id: string; name: string }[];
};

export type ClassAssignment = {
  isClassTeacher: boolean;
  section: { id: string; name: string; class: { name: string } };
};

export function TeacherClassAssignmentForm({
  classes,
  current,
  submitting,
  onSubmit,
}: {
  classes: ClassOption[];
  current: ClassAssignment[];
  submitting?: boolean;
  onSubmit: (assignments: { sectionId: string; isClassTeacher: boolean }[]) => void | Promise<void>;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [classTeacherId, setClassTeacherId] = useState<string>("");

  useEffect(() => {
    setSelected(new Set(current.map((a) => a.section.id)));
    const ct = current.find((a) => a.isClassTeacher);
    setClassTeacherId(ct?.section.id ?? "");
  }, [current]);

  const selectedSorted = useMemo(() => {
    const labels = new Map<string, string>();
    for (const cls of classes) {
      for (const sec of cls.sections) {
        labels.set(sec.id, `${cls.name}-${sec.name}`);
      }
    }
    return [...selected].sort((a, b) => (labels.get(a) ?? "").localeCompare(labels.get(b) ?? ""));
  }, [selected, classes]);

  function toggle(sectionId: string, on: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (on) next.add(sectionId);
      else next.delete(sectionId);
      return next;
    });
    if (!on && classTeacherId === sectionId) setClassTeacherId("");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(
      selectedSorted.map((sectionId) => ({
        sectionId,
        isClassTeacher: classTeacherId === sectionId,
      }))
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-muted">
        Tick the classes this teacher is assigned to. Optionally mark one as homeroom (class teacher).
      </p>
      <div className="max-h-72 overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--surface-muted)]/40 p-3">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <div key={cls.id}>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-brand">Class {cls.name}</p>
              <ul className="space-y-1.5">
                {cls.sections.map((sec) => {
                  const id = sec.id;
                  const checked = selected.has(id);
                  return (
                    <li key={id}>
                      <label className="flex cursor-pointer items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          className="size-4 accent-[var(--brand-maroon)]"
                          checked={checked}
                          onChange={(e) => toggle(id, e.target.checked)}
                        />
                        Section {sec.name}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <label className="block max-w-sm text-sm">
        <span className="text-muted">Class teacher of</span>
        <select
          className="input-field"
          value={classTeacherId}
          onChange={(e) => setClassTeacherId(e.target.value)}
        >
          <option value="">None</option>
          {selectedSorted.map((id) => {
            const label = classes
              .flatMap((c) => c.sections.map((s) => ({ id: s.id, label: `${c.name}-${s.name}` })))
              .find((s) => s.id === id)?.label;
            return (
              <option key={id} value={id}>
                {label ?? id}
              </option>
            );
          })}
        </select>
      </label>
      <button type="submit" disabled={submitting} className="btn-primary text-sm disabled:opacity-50">
        {submitting ? "Saving…" : "Save assigned classes"}
      </button>
    </form>
  );
}
