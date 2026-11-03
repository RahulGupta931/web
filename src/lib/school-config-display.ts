export type BellSlot = {
  periodNo: number;
  name: string;
  startTime: string;
  endTime: string;
  isBreak: boolean;
};

export function formatTime12(t: string): string {
  const [hStr, mStr] = t.split(":");
  const h = Number(hStr);
  const m = mStr ?? "00";
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m} ${suffix}`;
}

/** Compact range for bell schedule tables, e.g. 8:30–8:50 AM */
export function formatBellScheduleTimeRange(start: string, end: string): string {
  const startFmt = formatTime12(start);
  const endFmt = formatTime12(end);
  const startSuffix = startFmt.endsWith(" AM") ? " AM" : startFmt.endsWith(" PM") ? " PM" : "";
  const endSuffix = endFmt.endsWith(" AM") ? " AM" : endFmt.endsWith(" PM") ? " PM" : "";
  if (startSuffix && startSuffix === endSuffix) {
    return `${startFmt.replace(startSuffix, "")}–${endFmt}`;
  }
  return `${startFmt}–${endFmt}`;
}

export function formatTimeRange(start: string, end: string): string {
  return `${formatTime12(start)} – ${formatTime12(end)}`;
}

export function titleCaseDay(day: string): string {
  return day.charAt(0) + day.slice(1).toLowerCase();
}

/** Standard reference schedule (matches server defaults). */
export const STANDARD_BELL_SCHEDULE: BellSlot[] = [
  { periodNo: 1, name: "Prayer assembly", startTime: "08:30", endTime: "08:50", isBreak: true },
  { periodNo: 2, name: "Period 1", startTime: "08:50", endTime: "09:30", isBreak: false },
  { periodNo: 3, name: "Period 2", startTime: "09:30", endTime: "10:10", isBreak: false },
  { periodNo: 4, name: "Period 3", startTime: "10:10", endTime: "10:50", isBreak: false },
  { periodNo: 5, name: "Morning break", startTime: "10:50", endTime: "11:05", isBreak: true },
  { periodNo: 6, name: "Period 4", startTime: "11:05", endTime: "11:45", isBreak: false },
  { periodNo: 7, name: "Period 5", startTime: "11:45", endTime: "12:25", isBreak: false },
  {
    periodNo: 8,
    name: "Classwork / reading / transition",
    startTime: "12:25",
    endTime: "12:45",
    isBreak: true,
  },
  { periodNo: 9, name: "Lunch break", startTime: "12:45", endTime: "13:15", isBreak: true },
  { periodNo: 10, name: "Period 6", startTime: "13:15", endTime: "13:55", isBreak: false },
  { periodNo: 11, name: "Period 7", startTime: "13:55", endTime: "14:35", isBreak: false },
  { periodNo: 12, name: "Dispersal", startTime: "14:35", endTime: "14:45", isBreak: true },
];
