export type TeacherDashboardData = {
  profile: {
    firstName: string;
    lastName: string;
    employeeId: string;
    designation?: string | null;
    classAssignments: {
      isClassTeacher: boolean;
      section: { name: string; class: { name: string } };
    }[];
    subjectAssignments: { subject: { name: string } }[];
  };
  school: { name: string };
  today: string;
  todayLabel: string;
  todayDay: string;
  studentCount: number;
  classTeacherSections: string[];
  subjects: string[];
  todayTimetable: {
    id: string;
    period: { name: string; periodNo?: number; startTime?: string; endTime?: string };
    subject: { name: string };
    section: { class: { name: string }; name: string };
    classroom?: { name: string } | null;
  }[];
  substituteAssignments: {
    id: string;
    slot: {
      subject: { name: string };
      section: { class: { name: string }; name: string };
      period?: {
        name: string;
        periodNo?: number;
        startTime?: string;
        endTime?: string;
      };
      classroom?: { name: string } | null;
    };
  }[];
  pendingAssignments: number;
  pendingAdmissions: number;
  recentNotices: { id: string; title: string; createdAt: string }[];
  notifications: { id: string; title: string; body?: string | null; createdAt: string }[];
  insights: string[];
};
