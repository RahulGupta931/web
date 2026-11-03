"use client";

import type { ReactNode } from "react";
import { MobilePageHero } from "@/components/mobile/mobile-primitives";
import { SchoolMonthCalendarCard } from "@/components/calendar/school-month-calendar-card";

export function PanelMobileShell({
  role,
  kicker,
  title,
  subtitle,
  heroExtra,
  showCalendar = true,
  calendarTitle,
  attendanceRecords,
  selectedDate,
  onSelectDate,
  children,
}: {
  role: "student" | "teacher" | "principal";
  kicker: string;
  title: string;
  subtitle?: string;
  heroExtra?: ReactNode;
  showCalendar?: boolean;
  calendarTitle?: string;
  attendanceRecords?: { date: string; status: string }[];
  selectedDate?: string;
  onSelectDate?: (dateKey: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="space-y-4 pb-2">
      <MobilePageHero kicker={kicker} title={title} subtitle={subtitle}>
        {heroExtra}
      </MobilePageHero>
      {showCalendar && (
        <SchoolMonthCalendarCard
          role={role}
          attendanceRecords={attendanceRecords}
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
          title={calendarTitle}
        />
      )}
      {children}
    </div>
  );
}
