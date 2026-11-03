/** Marketing copy for the public landing page — aligned with implemented portal features. */

import { BRAND } from "@/config/branding";

export const LANDING_NAV = [
  { href: "#about-school", label: "About" },
  { href: "#achievements", label: "Achievements" },
  { href: "#academics", label: "Academics" },
  { href: "#digital-school", label: "Digital school" },
  { href: "/admissions", label: "Admissions" },
] as const;

export const HERO = {
  kicker: BRAND.name,
  title: "The Future Begins Here",
  lead:
    "R.K. Memorial Public School combines strong academics, sports, and values with a modern digital campus. Explore our achievements, facilities, and admissions — then sign in to the student, teacher, or principal portal for daily school life.",
  primaryCta: "Apply for admission",
  primaryHref: "/admissions",
  secondaryCta: "Portal login",
  secondaryHref: "/login",
};

export const ABOUT_SCHOOL = {
  id: "about-school",
  title: "About our school",
  paragraphs: [
    "R.K. Memorial Public School is committed to nurturing curious, confident learners from primary through senior secondary. Our faculty, facilities, and house culture support every child’s growth — in the classroom, on the field, and in the community.",
    "We run a structured academic calendar with board-aligned curriculum, regular assessments, and enrichment through clubs and competitions. Parents stay connected through the school office and, where enabled, the student portal for notices, timetables, and published results.",
    "The same platform powers daily operations for our staff: attendance, timetables, examinations, and announcements — so information stays accurate and secure in one place.",
  ],
};

export const ROLES = {
  id: "roles",
  title: "User roles",
  intro:
    "Three primary panels support school operations. Each role has a focused dashboard and menu — users cannot access functions outside their permissions.",
  items: [
    {
      role: "Principal",
      summary:
        "School-wide oversight: configure academic structure, manage staff and students, approve leave, publish notices and timetables, run examinations, and review reports.",
      href: "/login",
    },
    {
      role: "Teacher",
      summary:
        "Classroom delivery: view assigned sections, mark attendance, enter examination marks, share study materials and assignments, respond to student messages, and request leave.",
      href: "/login",
    },
    {
      role: "Student",
      summary:
        "Personal academic view: timetable, attendance summary, published results and report cards, homework, materials, notices, and structured messages to teachers.",
      href: "/login",
    },
  ],
};

export const FEATURE_SECTIONS = [
  {
    id: "principal",
    title: "Principal management",
    body:
      "The principal panel is the control centre for the school. From one dashboard you can see student and teacher counts, today’s timetable context, and items that need attention.",
    bullets: [
      "School dashboard with operational overview and quick links to key tasks",
      "Teacher registration and profiles, including subject and class assignments",
      "Student records, enrolment, admissions workflow, and class or section placement",
      "Student and staff attendance recording with calendar-aware school days",
      "Leave request review — approve or reject teacher applications with a clear audit trail",
      "Notices and school calendar entries for holidays, events, and announcements",
      "Timetable building, validation, and publication for all classes and sections",
      "Substitute teacher planning when staff are absent",
      "Examination setup, mark oversight, and results publication to students",
      "Reports and analytics drawn from live attendance and academic data",
      "School configuration: working week, bell schedule, and attendance rules",
    ],
  },
  {
    id: "teacher",
    title: "Teacher management",
    body:
      "Teachers work inside the boundaries of their assignments. The portal shows only the students, subjects, and sections linked to their profile.",
    bullets: [
      "Dashboard with today’s teaching periods and class context",
      "Student lists and detailed profiles for assigned classes",
      "Daily attendance marking with statuses such as present, absent, late, half-day, and approved leave",
      "Examination marks entry per subject, exam, and class section",
      "Published report card data flows from examinations configured by the school",
      "Assignments: create tasks, set due dates, and record submission grades where used",
      "Study materials: share titles, subjects, and links or files with classes",
      "Personal weekly timetable aligned to the school bell schedule",
      "Exam date sheets for class sections where the teacher is class teacher",
      "School notices targeted to teachers or the whole school",
      "Leave requests submitted to the principal for approval",
      "Student messages (queries) from learners in their classes",
    ],
  },
  {
    id: "student",
    title: "Student portal",
    body:
      "Students sign in with credentials issued by the school. Every screen is scoped to their own profile and active enrolment.",
    bullets: [
      "Profile with admission details, class, section, and roll number",
      "Attendance history and session-wise percentage based on school rules",
      "Published examination results when the school releases them",
      "Report cards tied to formal examinations",
      "Weekly timetable with subjects, periods, and teachers (no room clutter on mobile views)",
      "Assignments with due dates and submission status",
      "Study materials shared by teachers",
      "Notices for the student, their class, or the whole school",
      "Structured requests to class or subject teachers",
      "Exam date sheets when uploaded for their section",
      "School configuration view: timings, working days, and bell schedule",
    ],
  },
  {
    id: "attendance",
    title: "Attendance management",
    body:
      "Attendance connects teachers, principals, and students to the same daily record. The school defines which statuses count as a full day, half day, or absence.",
    bullets: [
      "Teachers mark section attendance by date; principals can record staff attendance",
      "Statuses include present, absent, late, half-day, and approved leave where configured",
      "Students view their own percentage and history — not other learners’ records",
      "Calendar integration highlights working days, holidays, and events",
      "Attendance rules are documented in the configuration area for transparency",
    ],
  },
  {
    id: "examinations",
    title: "Examination and results",
    body:
      "Examinations are created at school level, assigned to subjects, and marked by teachers for their classes. Publication controls when students see outcomes.",
    bullets: [
      "Principals define examinations, subjects, maximum marks, and publication state",
      "Teachers enter marks only for students in sections they teach for that subject",
      "Students access results and report cards after publication",
      "Exam date sheets can be uploaded for sections as image-based schedules",
      "Grades and pass or fail logic follow each exam subject’s configured thresholds",
    ],
  },
  {
    id: "timetable",
    title: "Timetable management",
    body:
      "Timetables respect the school’s standard bell schedule: teaching periods, breaks, assembly, and dispersal. Principals apply class templates and resolve conflicts before publishing.",
    bullets: [
      "Monday–Saturday weekly grids with seven teaching periods per day",
      "Class and section views for principals; teacher and student personal schedules",
      "Subject and teacher assignment per slot with validation to reduce double-booking",
      "Substitute assignments when teachers are unavailable",
      "Shared school timings visible under Configuration for all roles",
    ],
  },
  {
    id: "notices",
    title: "Notices and communication",
    body:
      "Notices replace ad-hoc circulars with targeted, timestamped announcements inside the portal.",
    bullets: [
      "Audience options such as the whole school, teachers only, or class or section groups",
      "Students and teachers see notices relevant to them on dashboard and notice pages",
      "School calendar complements notices with dated holidays and events",
    ],
  },
  {
    id: "leave",
    title: "Leave and request management",
    body:
      "Leave and messaging workflows keep requests traceable instead of lost in informal channels.",
    bullets: [
      "Teachers submit leave with type, dates, and reason; principals approve or reject",
      "Students send queries to teachers with subject lines and status tracking",
      "Teachers respond from their panel; history remains tied to the academic session",
    ],
  },
  {
    id: "reports",
    title: "Reports and analytics",
    body:
      "Reporting surfaces information already captured in the system — it does not replace official board reporting unless your school configures it that way.",
    bullets: [
      "Principal reports for attendance, academics, and operational summaries",
      "Class-wise and student-wise views where data exists in the database",
      "Staff-oriented views such as timetable load and substitute coverage",
      "Filters by session, class, section, and date range where supported in the UI",
    ],
  },
] as const;

export const SECURITY = {
  id: "security",
  title: "Security and permissions",
  paragraphs: [
    "Access is protected by secure sign-in. Each account is linked to a role and a school scope so users only query data they are allowed to see.",
    "Students cannot open other students’ marks or attendance. Teachers cannot edit classes they are not assigned to. Principals manage school-wide configuration but still operate within role-based API checks on the server — not only in the browser.",
    "Sensitive actions such as publishing timetables, releasing examination results, and approving leave are limited to authorized roles. Activity can be recorded in audit logs for accountability where the feature is enabled.",
    "Passwords are stored using industry-standard hashing. Session tokens expire according to server configuration. Schools should issue individual accounts and discourage password sharing.",
  ],
};

export const BENEFITS = {
  id: "benefits",
  title: "Benefits for your school",
  items: [
    {
      title: "Less paperwork",
      body: "Registers, notice copies, and duplicate mark sheets give way to structured digital records.",
    },
    {
      title: "Centralized records",
      body: "One source for enrolment, attendance, timetables, and results tied to the active academic session.",
    },
    {
      title: "Clear communication",
      body: "Notices and calendar entries reach the right audience inside the same portal students and staff already use.",
    },
    {
      title: "Time saved for staff",
      body: "Teachers enter marks and attendance once; principals publish once; students check outcomes without office queues.",
    },
    {
      title: "Better administration",
      body: "Dashboards and reports help leaders spot gaps — missing marks, pending leave, or unpublished timetables — before they become crises.",
    },
  ],
};

export const FAQ = {
  id: "faq",
  title: "Frequently asked questions",
  items: [
    {
      q: "How do I get a user account?",
      a: "Accounts are created by the school — typically through the principal or admissions office for students, and through principal or HR workflows for teachers. Use the email and password you were given on the sign-in page.",
    },
    {
      q: "Who can see my child’s attendance and marks?",
      a: "Students see their own data. Teachers see students in their assigned classes. Principals can view school-wide records for administration. Other students and unauthorized staff cannot access private profiles.",
    },
    {
      q: "When do examination results appear for students?",
      a: "Results show only after the school publishes the examination. Until then, teachers may enter marks internally, but students will not see unpublished outcomes.",
    },
    {
      q: "Is my data secure?",
      a: "The system uses authenticated APIs, role checks, and hashed passwords. Always sign out on shared devices and contact the school office if you suspect unauthorized access.",
    },
    {
      q: "Can parents sign in?",
      a: "This deployment focuses on principal, teacher, and student panels. Family communication may still use notices and materials visible to the student account, or processes defined by your school office.",
    },
    {
      q: "What if I forget my password?",
      a: "Password reset is handled by your school’s administrators. Contact the school office — self-service reset is only available if your school enables it.",
    },
    {
      q: "Does the portal work on mobile phones?",
      a: "Yes. The web portal is responsive, with mobile-friendly layouts for timetables, attendance, notices, and other common tasks.",
    },
  ],
};

export const CTA = {
  id: "contact",
  title: "Ready to use the portal?",
  body:
    "If you are a student, teacher, or principal at a school using this system, sign in with your school email. If you represent a school exploring the platform, contact your implementation team or school IT lead to arrange access and onboarding.",
  primary: "Sign in",
  primaryHref: "/login",
  secondary: "Contact school administration",
  secondaryHref: "#footer-contact",
};

export const FOOTER = {
  support:
    "For login help, timetable questions, or data corrections, contact your school administration office. Technical issues should be reported to the person or team who manages your school’s deployment.",
  quickLinks: [
    { href: "/#about-school", label: "About" },
    { href: "/achievements", label: "Achievements" },
    { href: "/admissions", label: "Admissions" },
    { href: "#digital-school", label: "Digital school" },
    { href: "/login", label: "Portal login" },
    { href: "#privacy", label: "Privacy policy" },
    { href: "#terms", label: "Terms of use" },
  ],
};

export const PRIVACY_SUMMARY = {
  id: "privacy",
  title: "Privacy policy (summary)",
  body:
    "The school is the data controller for student and staff information entered in this system. Data is used to run academic and administrative processes — attendance, examinations, communication, and enrolment. Access is limited by role. The school should provide a full privacy notice aligned with applicable law; this summary does not replace legal advice or a formal policy document.",
};

export const TERMS_SUMMARY = {
  id: "terms",
  title: "Terms of use (summary)",
  body:
    "Use of this portal is restricted to authorized school users. You must keep credentials confidential, use the system only for legitimate school purposes, and follow policies set by your school. The school may suspend accounts that misuse the platform. Full terms should be issued by the school or platform operator governing your deployment.",
};
