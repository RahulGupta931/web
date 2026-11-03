import type { NavItem } from "@/components/panel-layout";

/** Plain-language sidebar labels for the principal panel. */
export const principalNav: NavItem[] = [
  { href: "/principal", label: "Home", icon: "home", mobileDock: true, shortLabel: "Home" },
  { href: "/principal/students", label: "All students", icon: "users", mobileDock: true, shortLabel: "Students" },
  { href: "/principal/teachers", label: "All teachers", icon: "user", mobileDock: true, shortLabel: "Teachers" },
  {
    href: "/principal/admissions",
    label: "New admissions",
    icon: "clipboard",
    mobileDock: true,
    shortLabel: "Admit",
  },
  { href: "/principal/attendance", label: "Daily attendance", icon: "check", shortLabel: "Attendance" },
  { href: "/principal/staff-check-in", label: "Teacher sign-in", icon: "clock", shortLabel: "Sign-in" },
  { href: "/principal/leave", label: "Leave approvals", icon: "calendar", shortLabel: "Leave" },
  { href: "/principal/configuration", label: "School settings", icon: "settings", shortLabel: "Settings" },
  { href: "/principal/bulk-import", label: "Import from Excel", icon: "clipboard", shortLabel: "Import" },
  { href: "/principal/discipline", label: "Student incidents", icon: "clipboard", shortLabel: "Incidents" },
  { href: "/principal/calendar", label: "Holidays & events", icon: "calendar", shortLabel: "Calendar" },
  { href: "/principal/timetable", label: "Class timetable", icon: "book", shortLabel: "Schedule" },
  { href: "/principal/notices", label: "Announcements", icon: "bell", shortLabel: "Notices" },
  { href: "/principal/reports", label: "Reports & exports", icon: "chart", shortLabel: "Reports" },
  { href: "/principal/profile", label: "My profile", icon: "user", shortLabel: "Profile" },
];

export function principalNavLabel(href: string): string {
  return principalNav.find((item) => item.href === href)?.label ?? href;
}

/** Plain-language sidebar labels for the teacher panel. */
export const teacherNav: NavItem[] = [
  { href: "/teacher", label: "Home", icon: "home", mobileDock: true, shortLabel: "Home" },
  { href: "/teacher/students", label: "My students", icon: "users", mobileDock: true, shortLabel: "Students" },
  { href: "/teacher/attendance", label: "Mark attendance", icon: "check", mobileDock: true, shortLabel: "Attendance" },
  { href: "/teacher/check-in", label: "Daily sign-in", icon: "clock", mobileDock: true, shortLabel: "Sign-in" },
  { href: "/teacher/examinations", label: "Enter exam marks", icon: "file", mobileDock: true, shortLabel: "Marks" },
  { href: "/teacher/admissions", label: "New student form", icon: "clipboard", shortLabel: "Admit" },
  { href: "/teacher/timetable", label: "My schedule", icon: "calendar", shortLabel: "Schedule" },
  { href: "/teacher/account", label: "My account", icon: "user", shortLabel: "Account" },
  { href: "/teacher/configuration", label: "School info", icon: "settings", shortLabel: "Info" },
  { href: "/teacher/datesheets", label: "Exam schedules", icon: "file", shortLabel: "Dates" },
  { href: "/teacher/notices", label: "Announcements", icon: "bell", shortLabel: "News" },
  { href: "/teacher/leave", label: "Apply for leave", icon: "calendar", shortLabel: "Leave" },
  { href: "/teacher/queries", label: "Student questions", icon: "clipboard", shortLabel: "Messages" },
  { href: "/teacher/discipline", label: "Report incident", icon: "clipboard", shortLabel: "Incident" },
];

export function teacherNavLabel(href: string): string {
  return teacherNav.find((item) => item.href === href)?.label ?? href;
}

/** Plain-language sidebar labels for the student panel. */
export const studentNav: NavItem[] = [
  { href: "/student", label: "Home", icon: "home", mobileDock: true, shortLabel: "Home" },
  { href: "/student/timetable", label: "My schedule", icon: "calendar", mobileDock: true, shortLabel: "Schedule" },
  { href: "/student/configuration", label: "School info", icon: "settings", shortLabel: "Info" },
  { href: "/student/notices", label: "Announcements", icon: "bell", mobileDock: true, shortLabel: "News" },
  { href: "/student/profile", label: "My profile", icon: "user", shortLabel: "Profile" },
  { href: "/student/attendance", label: "My attendance", icon: "check", shortLabel: "Attendance" },
  { href: "/student/report-cards", label: "My results", icon: "file", shortLabel: "Results" },
  { href: "/student/queries", label: "Message teacher", icon: "clipboard", mobileDock: true, shortLabel: "Ask" },
  { href: "/student/discipline", label: "Discipline records", icon: "clipboard", shortLabel: "Records" },
  { href: "/student/datesheets", label: "Exam schedules", icon: "file", shortLabel: "Dates" },
];

export function studentNavLabel(href: string): string {
  return studentNav.find((item) => item.href === href)?.label ?? href;
}
