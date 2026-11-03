/** Seeded demo accounts — keep in sync with packages/database/prisma/seed.ts */

export const DEMO_SCHOOL_PASSWORD = "Demo@12345";
export const DEMO_SUPER_ADMIN_PASSWORD = "SuperAdmin@123";

export type DemoLoginEntry = {
  id: string;
  label: string;
  email: string;
  password: string;
};

export type DemoLoginGroup = {
  title: string;
  entries: DemoLoginEntry[];
};

export const DEMO_LOGIN_GROUPS: DemoLoginGroup[] = [
  {
    title: "Platform",
    entries: [
      {
        id: "super-admin",
        label: "Super Admin",
        email: "superadmin@schoolerp.local",
        password: DEMO_SUPER_ADMIN_PASSWORD,
      },
    ],
  },
  {
    title: "School",
    entries: [
      {
        id: "principal",
        label: "Principal",
        email: "principal@demo.school",
        password: DEMO_SCHOOL_PASSWORD,
      },
    ],
  },
  {
    title: "Teachers",
    entries: [
      {
        id: "teacher-anita",
        label: "Anita Sharma · Mathematics",
        email: "anita.sharma@demo.school",
        password: DEMO_SCHOOL_PASSWORD,
      },
      {
        id: "teacher-rahul",
        label: "Rahul Mehta · English",
        email: "rahul.mehta@demo.school",
        password: DEMO_SCHOOL_PASSWORD,
      },
      {
        id: "teacher-priya",
        label: "Priya Nair · Computer Science",
        email: "priya.nair@demo.school",
        password: DEMO_SCHOOL_PASSWORD,
      },
      {
        id: "teacher-sunil",
        label: "Sunil Verma · Physics",
        email: "sunil.verma@demo.school",
        password: DEMO_SCHOOL_PASSWORD,
      },
      {
        id: "teacher-kavita",
        label: "Kavita Joshi · Chemistry",
        email: "kavita.joshi@demo.school",
        password: DEMO_SCHOOL_PASSWORD,
      },
      {
        id: "teacher-deepak",
        label: "Deepak Rao · Biology",
        email: "deepak.rao@demo.school",
        password: DEMO_SCHOOL_PASSWORD,
      },
      {
        id: "teacher-meena",
        label: "Meena Desai · Hindi",
        email: "meena.desai@demo.school",
        password: DEMO_SCHOOL_PASSWORD,
      },
      {
        id: "teacher-rajesh",
        label: "Rajesh Kumar · Social Studies",
        email: "rajesh.kumar@demo.school",
        password: DEMO_SCHOOL_PASSWORD,
      },
      {
        id: "teacher-sunita",
        label: "Sunita Pillai · Science",
        email: "sunita.pillai@demo.school",
        password: DEMO_SCHOOL_PASSWORD,
      },
      {
        id: "teacher-lata",
        label: "Lata Iyer · EVS (Primary)",
        email: "lata.iyer@demo.school",
        password: DEMO_SCHOOL_PASSWORD,
      },
      {
        id: "teacher-amit",
        label: "Amit Singh · Sanskrit",
        email: "amit.singh@demo.school",
        password: DEMO_SCHOOL_PASSWORD,
      },
      {
        id: "teacher-neha",
        label: "Neha Gupta · Art & Craft",
        email: "neha.gupta@demo.school",
        password: DEMO_SCHOOL_PASSWORD,
      },
      {
        id: "teacher-vijay",
        label: "Vijay Malhotra · Physical Education",
        email: "vijay.malhotra@demo.school",
        password: DEMO_SCHOOL_PASSWORD,
      },
    ],
  },
  {
    title: "Students",
    entries: [
      {
        id: "student-arjun",
        label: "Arjun Patel · 10-A",
        email: "arjun.patel@demo.school",
        password: DEMO_SCHOOL_PASSWORD,
      },
      {
        id: "student-sneha",
        label: "Sneha Rao · 10-A",
        email: "sneha.rao@demo.school",
        password: DEMO_SCHOOL_PASSWORD,
      },
      {
        id: "student-vikram",
        label: "Vikram Singh · 10-A",
        email: "vikram.singh@demo.school",
        password: DEMO_SCHOOL_PASSWORD,
      },
      {
        id: "student-meera",
        label: "Meera Iyer · 10-A",
        email: "meera.iyer@demo.school",
        password: DEMO_SCHOOL_PASSWORD,
      },
      {
        id: "student-kabir",
        label: "Kabir Khan · 9-A",
        email: "kabir.khan@demo.school",
        password: DEMO_SCHOOL_PASSWORD,
      },
      {
        id: "student-diya",
        label: "Diya Gupta · 9-A",
        email: "diya.gupta@demo.school",
        password: DEMO_SCHOOL_PASSWORD,
      },
      {
        id: "student-rohan",
        label: "Rohan Desai · 9-B",
        email: "rohan.desai@demo.school",
        password: DEMO_SCHOOL_PASSWORD,
      },
      {
        id: "student-isha",
        label: "Isha Malhotra · 9-B",
        email: "isha.malhotra@demo.school",
        password: DEMO_SCHOOL_PASSWORD,
      },
      {
        id: "student-class1",
        label: "Class 1-A sample · student.class1.a1",
        email: "student.class1.a1@demo.school",
        password: DEMO_SCHOOL_PASSWORD,
      },
      {
        id: "student-class6",
        label: "Class 6-A sample · student.class6.a1",
        email: "student.class6.a1@demo.school",
        password: DEMO_SCHOOL_PASSWORD,
      },
      {
        id: "student-class12",
        label: "Class 12-A sample · student.class12.a1",
        email: "student.class12.a1@demo.school",
        password: DEMO_SCHOOL_PASSWORD,
      },
    ],
  },
];

export const DEMO_LOGIN_HINT =
  `School users: ${DEMO_SCHOOL_PASSWORD} · Super Admin: ${DEMO_SUPER_ADMIN_PASSWORD}`;
