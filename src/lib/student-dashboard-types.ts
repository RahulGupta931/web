export type StudentDashboardData = {
  profile: { firstName: string; lastName: string; studentId: string; admissionNumber: string };
  school: { name: string };
  enrollment?: {
    rollNumber: string;
    class: { name: string };
    section: { name: string };
    academicSession?: { name: string };
  };
  today: string;
  todayLabel: string;
  todayDay: string;
  classLabel: string | null;
  todayTimetable: {
    period: { name: string; periodNo?: number; startTime?: string; endTime?: string };
    subject: { name: string };
    teacher?: { firstName: string; lastName: string } | null;
  }[];
  attendancePercentage: number | null;
  attendanceThisMonth: {
    present: number;
    absent: number;
    late: number;
    total: number;
    percentage: number | null;
  };
  upcomingExams: { id: string; name: string; startDate: string; endDate: string; status: string }[];
  pendingAssignments: number;
  recentNotices: { id: string; title: string; createdAt: string }[];
  insights: string[];
};
