export type PrincipalDashboardData = {
  school: { name: string; schoolCode: string };
  academicSession: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
  } | null;
  today: string;
  todayLabel: string;
  stats: {
    students: number;
    teachers: number;
    classes: number;
    sections: number;
    enrolledActive: number;
  };
  attendanceToday: {
    students: AttendanceBreakdown & {
      unmarked: number;
      presentRate: number | null;
      presentRateVsEnrollment: number | null;
    };
    teachers: AttendanceBreakdown & {
      unmarked: number;
      presentRate: number | null;
      presentRateVsStaff: number | null;
    };
  };
  attendanceTrend: {
    date: string;
    studentPresentRate: number | null;
    teacherPresentRate: number | null;
    studentsMarked: number;
    teachersMarked: number;
  }[];
  classStrength: {
    sectionId: string;
    label: string;
    className: string;
    sectionName: string;
    students: number;
  }[];
  absentStaff: {
    status: string;
    teacher: {
      firstName: string;
      lastName: string;
      employeeId: string;
      department: string | null;
    };
  }[];
  pendingLeave: number;
  pendingAdmissions: number;
  pendingDisciplineComplaints: number;
  newStudentsThisMonth: number;
  recentNotices: { id: string; title: string; createdAt: string; audience: string }[];
  upcomingEvents: {
    id: string;
    title: string;
    startsAt: string;
    endsAt: string;
    location: string | null;
  }[];
  insights: string[];
};

type AttendanceBreakdown = {
  PRESENT: number;
  ABSENT: number;
  LATE: number;
  HALF_DAY: number;
  LEAVE_APPROVED: number;
  marked: number;
};

export function formatPct(value: number | null | undefined): string {
  if (value == null) return "—";
  return `${value}%`;
}
