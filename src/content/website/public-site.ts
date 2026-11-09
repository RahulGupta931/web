/** Public school website content (Phase 1 — editable JSON-like module). */

import { BRAND } from "@/config/branding";

export type AchievementCategory =
  | "Academic"
  | "Sports"
  | "Arts"
  | "STEM"
  | "Leadership"
  | "Community";

export type Achievement = {
  id: string;
  studentName: string;
  classLabel: string;
  title: string;
  category: AchievementCategory;
  date: string;
  year: number;
  summary: string;
  featured?: boolean;
};

export const SCHOOL_STATS = [
  { label: "Years of excellence", value: "—" },
  { label: "Total students", value: "—" },
  { label: "Faculty members", value: "—" },
  { label: "Board examination results", value: "—" },
] as const;

export const SCHOOL_STATS_NOTE =
  "Figures to be confirmed by the school office. Placeholders are shown until official numbers are published.";

export const WHY_US = [
  {
    title: "Holistic education",
    body: "Academics balanced with sports, arts, and values education for every learner.",
  },
  {
    title: "Discipline & care",
    body: "Structured routines, pastoral support, and clear communication with families.",
  },
  {
    title: "Digital-ready campus",
    body: "Attendance, timetables, exams, and notices on one secure school portal.",
  },
  {
    title: "Strong academic results",
    body: "Board outcomes and competitive-exam support are confirmed by the office for each session — ask during your visit.",
  },
] as const;

export const ACADEMICS_BANDS = [
  {
    band: "Pre-Primary",
    points: ["Play, stories and early language", "Number sense through activity", "Care, routine and belonging"],
  },
  {
    band: "Primary (Classes 1–5)",
    points: ["Foundational literacy and numeracy", "Activity-based learning", "Life skills and EVS"],
  },
  {
    band: "Middle (Classes 6–8)",
    points: ["Subject specialists", "Science and computer labs", "Clubs and house system"],
  },
  {
    band: "Secondary (Classes 9–10)",
    points: ["Board-aligned curriculum", "Remedial and enrichment", "Career awareness"],
  },
  {
    band: "Senior secondary (11–12)",
    points: ["Science, Commerce, and Humanities streams", "Subject labs and project work", "Guidance confirmed with the office"],
  },
] as const;

export const STUDENT_LIFE = [
  { title: "Sports", body: "Games periods, house matches and the annual sports week on campus grounds." },
  { title: "Cultural programmes", body: "Music, dance, theatre and inter-house performances through the year." },
  { title: "Clubs", body: "Interest groups such as eco, debate and making — confirmed each session by the office." },
  { title: "Annual functions", body: "Stage programmes where classes present work, music and movement together." },
  { title: "School celebrations", body: "Festivals and assemblies that mark the calendar as a community." },
] as const;

export const ACADEMIC_STREAMS = [
  {
    title: "Science",
    body: "Laboratory work and science subjects in the senior years. Exact combinations are confirmed with the office.",
  },
  {
    title: "Commerce",
    body: "Commerce subjects for learners who choose this stream. Seat availability is session-specific.",
  },
  {
    title: "Humanities",
    body: "Humanities and related electives as offered each year. Ask the office for the current list.",
  },
] as const;

export const FACILITIES = [
  "Smart classrooms",
  "Science & computer labs",
  "Library & reading room",
  "Sports ground & indoor games",
  "Safe transport routes",
  "Counselling & first aid",
] as const;

export const PARENT_REVIEWS = [
  {
    quote:
      "The portal keeps us informed about attendance and exam schedules. We always know what is happening at school.",
    name: "Parent of a Class 10 student",
    title: "Parent",
  },
  {
    quote:
      "Sports day and house matches give our child something to look forward to every term. Practice is regular and the teachers stay with them.",
    name: "Parent of a Class 7 student",
    title: "Parent",
  },
  {
    quote:
      "Annual day and the inter-house programmes let quieter children find a stage. We saw our daughter grow more confident after the first performance.",
    name: "Parent of a Class 5 student",
    title: "Parent",
  },
  {
    quote:
      "When we have a question, the class teacher replies and the office follows up. We are not left guessing about homework or a missed day.",
    name: "Parent of a Class 8 student",
    title: "Parent",
  },
  {
    quote:
      "We visited before applying. The campus tour and the conversation about class and documents made the first step feel straightforward.",
    name: "Parent of a new student",
    title: "Parent",
  },
  {
    quote:
      "The library period is part of the week, not an extra. Our son comes home talking about the book he chose, which we did not see at his previous school.",
    name: "Parent of a Class 4 student",
    title: "Parent",
  },
  {
    quote:
      "The transport route is the same each morning. That routine has made the school run much calmer.",
    name: "Parent of a Class 6 student",
    title: "Parent",
  },
  {
    quote:
      "Circulars and the term calendar show up in one place. We stopped chasing paper notices in the school bag.",
    name: "Parent of a Class 9 student",
    title: "Parent",
  },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "The portal keeps us informed about attendance and exam schedules. We always know what is happening at school.",
    name: "Parent of Class 10 student",
    role: "Parent",
  },
  {
    quote:
      "Marking attendance and uploading materials in one place saves hours every week. Students know where to look.",
    name: "Senior teacher",
    role: "Faculty",
  },
  {
    quote: "I check my timetable and assignments on my phone every morning before school.",
    name: "Class 12 student",
    role: "Student",
  },
] as const;

export type NewsItem = {
  id: string;
  title: string;
  date: string;
  excerpt: string;
};

export const LATEST_NEWS: NewsItem[] = [
  {
    id: "n1",
    title: "Annual sports week begins",
    date: "2026-10-15",
    excerpt: "Inter-house track and field events for classes 6–12. Schedule on the school calendar.",
  },
  {
    id: "n2",
    title: "Parent–teacher meeting (Term 2)",
    date: "2026-10-08",
    excerpt: "Slot booking through the school office. Report cards available in the student portal after publication.",
  },
  {
    id: "n3",
    title: "Science exhibition on campus",
    date: "2026-09-28",
    excerpt: "Project displays from science classes. Confirm dates and class lists with the office.",
  },
];

export const ADMISSIONS = {
  title: "Admissions",
  intro:
    "We welcome enquiries for all classes subject to seat availability. Admissions follow school policy, interaction, and document verification.",
  steps: [
    { step: "1", title: "Enquire", body: "Call or email the admissions desk with the class you are seeking." },
    { step: "2", title: "Visit", body: "Campus tour and counselling session with the admissions team." },
    { step: "3", title: "Apply", body: "Submit the application form and required documents." },
    { step: "4", title: "Join", body: "Fee confirmation, uniform, and student portal credentials issued." },
  ],
  documents: [
    "Birth certificate",
    "Previous school transfer certificate (if applicable)",
    "Report card of last class attended",
    "Aadhaar / ID proof (student and parent)",
    "Passport-size photographs",
  ],
  contactEmail: "admissions@demo.school",
  contactPhone: "+91 98765 43210",
};

export const CONTACT = {
  address: "R.K. Memorial Public School, Main Campus Road, Demo City, State 110001",
  phone: ADMISSIONS.contactPhone,
  email: "office@demo.school",
  hours: "Mon–Sat, 8:00 AM – 2:00 PM (office); portal support via school IT",
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "a1",
    studentName: "Arjun Patel",
    classLabel: "10-A",
    title: "District science quiz — 1st place",
    category: "Academic",
    date: "2026-09-12",
    year: 2026,
    summary: "Team captain; scored highest in physics and chemistry rounds.",
    featured: true,
  },
  {
    id: "a2",
    studentName: "Sneha Rao",
    classLabel: "10-A",
    title: "State-level essay competition — Gold",
    category: "Academic",
    date: "2026-08-20",
    year: 2026,
    summary: "Essay on climate action selected among 500 entries statewide.",
    featured: true,
  },
  {
    id: "a3",
    studentName: "Priya Nair",
    classLabel: "Faculty",
    title: "Best ICT integration — regional award",
    category: "STEM",
    date: "2026-07-05",
    year: 2026,
    summary: "Recognized for leading the school’s digital attendance and timetable rollout.",
    featured: true,
  },
  {
    id: "a4",
    studentName: "Vikram Singh",
    classLabel: "10-A",
    title: "Inter-school cricket — Player of the tournament",
    category: "Sports",
    date: "2026-06-18",
    year: 2026,
    summary: "85 runs and 3 wickets in the final.",
    featured: true,
  },
  {
    id: "a5",
    studentName: "Meera Iyer",
    classLabel: "10-A",
    title: "Classical dance — zonal first prize",
    category: "Arts",
    date: "2026-05-22",
    year: 2026,
    summary: "Bharatanatyam solo category at the zonal youth festival.",
    featured: true,
  },
  {
    id: "a6",
    studentName: "Rahul Mehta",
    classLabel: "Faculty",
    title: "Debate coach — national finalist team",
    category: "Leadership",
    date: "2026-04-10",
    year: 2026,
    summary: "Mentored the senior English debate team to national finals.",
    featured: true,
  },
  {
    id: "a7",
    studentName: "Anita Sharma",
    classLabel: "Faculty",
    title: "Mathematics olympiad mentor",
    category: "Academic",
    date: "2025-12-01",
    year: 2025,
    summary: "Six students qualified for the regional mathematics olympiad.",
  },
  {
    id: "a8",
    studentName: "Deepak Rao",
    classLabel: "9-B",
    title: "Robotics challenge — 2nd place",
    category: "STEM",
    date: "2025-11-14",
    year: 2025,
    summary: "Line-follower and obstacle course at the inter-school tech fest.",
  },
  {
    id: "a9",
    studentName: "Kavita Joshi",
    classLabel: "Faculty",
    title: "Eco campus drive",
    category: "Community",
    date: "2025-10-02",
    year: 2025,
    summary: "Led student volunteers in tree plantation and waste segregation week.",
  },
  {
    id: "a10",
    studentName: "Sunil Verma",
    classLabel: "Faculty",
    title: "District athletics coach",
    category: "Sports",
    date: "2025-09-08",
    year: 2025,
    summary: "Four students qualified for district track events under school colours.",
  },
  {
    id: "a11",
    studentName: "Neha Gupta",
    classLabel: "11-Science",
    title: "Painting exhibition — jury special mention",
    category: "Arts",
    date: "2025-08-30",
    year: 2025,
    summary: "Oil on canvas series displayed at the city youth art show.",
  },
  {
    id: "a12",
    studentName: "Student council",
    classLabel: "School",
    title: "Blood donation awareness camp",
    category: "Community",
    date: "2025-07-19",
    year: 2025,
    summary: "Partnership with local hospital; 120 donors registered from senior classes.",
  },
];

export function featuredAchievements(limit = 6): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.featured).slice(0, limit);
}

/** Honour roll — one standout learner per class (marketing site; update each term). */
export type ClassTopStudent = {
  className: string;
  studentName: string;
  recognition: string;
};

export const TOP_STUDENTS_BY_CLASS: ClassTopStudent[] = [
  { className: "Nursery", studentName: "Aarav Mehta", recognition: "Curiosity & classroom participation" },
  { className: "LKG", studentName: "Diya Kapoor", recognition: "Early literacy & kindness" },
  { className: "UKG", studentName: "Reyansh Pillai", recognition: "Number skills & teamwork" },
  { className: "Class 1", studentName: "Isha Verma", recognition: "Reading progress & conduct" },
  { className: "Class 2", studentName: "Kabir Singh", recognition: "Creative work & attendance" },
  { className: "Class 3", studentName: "Ananya Desai", recognition: "Science inquiry & effort" },
  { className: "Class 4", studentName: "Rohan Khanna", recognition: "Mathematics & sports spirit" },
  { className: "Class 5", studentName: "Saanvi Reddy", recognition: "All-round primary excellence" },
  { className: "Class 6", studentName: "Aditya Nair", recognition: "Middle school academic lead" },
  { className: "Class 7", studentName: "Pooja Iyer", recognition: "Language arts & debate" },
  { className: "Class 8", studentName: "Harsh Malhotra", recognition: "STEM projects & discipline" },
  { className: "Class 9", studentName: "Deepak Rao", recognition: "Robotics & term aggregate" },
  { className: "Class 10", studentName: "Arjun Patel", recognition: "Board prep & science quiz" },
  { className: "Class 11", studentName: "Neha Gupta", recognition: "Senior science & arts balance" },
  { className: "Class 12", studentName: "Sneha Rao", recognition: "Leadership & academic consistency" },
];

export const TOP_STUDENTS_DISCLAIMER =
  "Selections reflect Term 2 overall performance and conduct at R.K Memorial Public School. The school office publishes the official honour roll each term.";

export const PUBLIC_NAV = [
  { href: "/#about-school", label: "About" },
  { href: "/#achievements", label: "Achievements" },
  { href: "/#academics", label: "Academics" },
  { href: "/#digital-school", label: "Digital school" },
  { href: "/admissions", label: "Admissions" },
  { href: "/achievements", label: "All achievements" },
] as const;

export const FOOTER_LEGAL = [
  ...PUBLIC_NAV,
  { href: "/login", label: "Portal login" },
  { href: "#privacy", label: "Privacy" },
  { href: "#terms", label: "Terms" },
] as const;

export const SITE_TAGLINE = `${BRAND.name} — ${BRAND.motto}`;
