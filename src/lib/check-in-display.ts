export type CheckInRecord = {
  date: string;
  checkInAt: string | null;
  checkOutAt: string | null;
  durationMinutes: number | null;
  status: string | null;
};

export function formatCheckDate(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatCheckTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDuration(minutes: number | null): string {
  if (minutes == null) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function checkInStateLabel(record: CheckInRecord | null): string {
  if (!record?.checkInAt) return "Not checked in";
  if (!record.checkOutAt) return "Checked in";
  return "Checked out";
}
