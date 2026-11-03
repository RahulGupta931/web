/** Copy and structure from RKPS landing page PDF. */

import { BRAND } from "@/config/branding";
import { CONTACT as SITE_CONTACT } from "@/content/website/public-site";

export const RKPS_NAV_PRIMARY = [
  { href: "/#about", label: "About" },
  { href: "/#academics", label: "Academics" },
  { href: "/school-life/student-achievers", label: "Student achievers" },
  { href: "/school-life/events", label: "Events" },
  { href: "/#admissions", label: "Admissions" },
  { href: "/#contact", label: "Contact" },
] as const;

export const RKPS_NAV_MORE = [
  { href: "/school-life/achievements", label: "School achievements" },
  { href: "/#parent-resources", label: "Parent resources" },
  { href: "/#noticeboard", label: "Noticeboard" },
  { href: "/#contact", label: "Plan a visit" },
] as const;

export const RKPS_HEADER_CTA = {
  login: { label: "Login", href: "/login" },
  enquire: { label: "Enquire", href: "/#enquiry" },
} as const;

/** @deprecated Use RKPS_NAV_PRIMARY + RKPS_NAV_MORE */
export const RKPS_NAV = [
  ...RKPS_NAV_PRIMARY,
  ...RKPS_NAV_MORE.map((item) => ({ ...item, external: item.label === "Plan a visit" })),
] as const;

export const RKPS_HERO = {
  eyebrow: `Welcome to ${BRAND.name.replace("R.K. ", "R.K ")}`,
  line1: "Little discoveries.",
  line2: "Limitless possibilities.",
  lead:
    "A place to ask big questions, find new passions and grow into who you're meant to be.",
  primary: { label: "Discover RMPS", href: "/#about" },
  secondary: { label: "Explore admissions", href: "/#admissions" },
};

export const RKPS_HERO_CARDS = [
  {
    num: "01",
    title: "A love of learning",
    body: "From early years to senior secondary, classrooms make room for questions, practice and the confidence to think for yourself.",
    cta: "Explore our approach",
    href: "/#academics",
  },
  {
    num: "02",
    title: "A place to belong",
    body: "Sport, arts, houses and everyday kindness sit beside academics, so every learner has more than one way to be known.",
    cta: "Discover school life",
    href: "/school-life/student-achievers",
  },
  {
    num: "03",
    title: "Your next chapter",
    body: "Tell us about your child, visit the campus and confirm classes, documents and timelines with the school office.",
    cta: "Start an admission enquiry",
    href: "/#enquiry",
  },
] as const;

export const RKPS_VISION = {
  id: "about",
  kicker: "Rooted in values. Open to possibility.",
  title: "More than a school.",
  subtitle: "A foundation for life.",
  body:
    "At R.K Memorial Public School, education begins with a simple belief: every child deserves the space to be curious, the encouragement to try and the confidence to grow. Our vision brings purposeful learning together with kindness, creativity and character — so children can discover not only what they know, but who they can become.",
  cta: "Get to know RMPS",
  href: "/#values",
};

export const RKPS_VALUES = {
  id: "values",
  kicker: "Small moments. Meaningful beginnings. RMPS",
  items: [
    {
      title: "Curiosity first",
      body: "Making room for questions, exploration and the joy of discovery.",
    },
    {
      title: "Character always",
      body: "Growing with empathy, respect and a sense of responsibility.",
    },
    {
      title: "Every child, encouraged",
      body: "Recognising individual strengths and celebrating personal progress.",
    },
  ],
};

export const RKPS_LEARNING = {
  id: "academics",
  title: "The learning journey",
  subtitle: "A world to learn. A future to shape.",
  cta: "Explore academics",
  phases: [
    {
      tags: "Wonder • Play • Explore",
      title: "Foundational learning",
      body: "A joyful start through stories, creative play and the building blocks of language and numbers.",
      link: "Our learning approach",
    },
    {
      tags: "Question • Connect • Create",
      title: "Growing understanding",
      body: "Connecting ideas with everyday life, building strong foundations and learning to work together.",
      link: "Our learning approach",
    },
    {
      tags: "Discover • Reflect • Aspire",
      title: "Independent thinking",
      body: "Deeper exploration, thoughtful discussion and the confidence to take the next step in learning.",
      link: "Our learning approach",
    },
  ],
  footnote:
    "For available classes, curriculum details and subject choices, please contact the school office.",
};

export const RKPS_DISCOVER = {
  id: "facilities",
  title: "Space to discover",
  subtitle: "Learning doesn't stop at the classroom door.",
  lead:
    "The best school days bring ideas to life. Explore the spaces and experiences that support reading, making, movement and discovery on your campus visit.",
  spaces: [
    { title: "Reading & reflection", body: "Stories that open up new worlds." },
    { title: "Science & technology", body: 'From "what if?" to hands-on understanding.' },
    { title: "Sport & creative expression", body: "Room to move, make and find a passion." },
  ],
  cta: "Plan a campus visit",
};

export const RKPS_GALLERY = {
  id: "gallery",
  title: "Life beyond lessons",
  subtitle: "Where memories become part of you.",
  tabs: ["All moments", "Learning", "Sports & play", "Arts & culture"],
  cta: "Explore the gallery",
  disclaimer: "Illustrative school-life imagery. Explore the campus in person to get to know RMPS.",
};

export const RKPS_NOTICE = {
  id: "noticeboard",
  title: "The school noticeboard",
  subtitle: "Stay connected. Stay informed.",
  cta: "All news & notices",
  empty: "School updates will appear here when published. Please confirm current notices and schedules with the office.",
};

export const RKPS_PARENT = {
  id: "parent-resources",
  kicker: "Parent resources",
  title: "Everything families need, in one place",
  lead: "Official documents live with the school office and student portal — start here for the right next step.",
  aside: "Published notices appear on the noticeboard when available. Confirm dates and documents with the office.",
  hints: [
    "Term calendar and holiday list",
    "Circulars and class notices",
    "Book lists and uniform guidance",
    "Portal access for enrolled families",
  ],
} as const;

export const RKPS_RESOURCE_CARDS = [
  {
    id: "admissions",
    tag: "Admissions",
    title: "Thinking about joining the RMPS family?",
    body: "Start with an enquiry. Ask the school office about classes, availability and the next steps.",
    cta: "Make an enquiry",
    href: "/#enquiry",
  },
  {
    id: "visits",
    tag: "Campus visits",
    title: "Get a feel for a school day.",
    body: "Request a visit to explore the campus, discuss your child's needs and ask your questions.",
    cta: "Request a visit",
    href: "/#contact",
  },
  {
    id: "parent-resources",
    tag: "Parent resources",
    title: "The information you need, in one place.",
    body: "Contact the school for the current calendar, circulars, book lists and parent guidance.",
    cta: "Contact the office",
    href: "/#contact",
  },
] as const;

export const RKPS_JOURNEY = {
  id: "admissions",
  title: "Your journey starts here",
  subtitle: "A new beginning, a world of possibility.",
  lead:
    "Choosing a school is a big step. Let's make the first conversation simple, personal and helpful.",
  steps: [
    { num: "01", title: "Tell us about your child", body: "Share your interests and the class you're exploring." },
    { num: "02", title: "Get to know the school", body: "Request a visit and discuss learning, school life and your questions." },
    { num: "03", title: "Plan the next step", body: "Confirm eligibility, documents, fees and the application process with the office." },
  ],
  disclaimer:
    "Admission requirements, class availability and timelines are to be confirmed by the school. An enquiry is not an admission offer.",
};

export const RKPS_FAQ = [
  {
    q: "How do I enquire about admission?",
    a: "Use the enquiry form above to share your child's details and the class you're interested in. Contact the school office to confirm availability and the application requirements.",
  },
  {
    q: "Can we visit the school before applying?",
    a: "Yes. Request a campus visit through the contact section or call the office to arrange a convenient time.",
  },
  {
    q: "Where can I find fee and curriculum details?",
    a: "Fee structure and curriculum documents are available from the school office. The portal shares timetables and notices for enrolled families.",
  },
  {
    q: "What documents are needed for admission?",
    a: "Typically birth certificate, previous school records, ID proof and photographs. The office will confirm the exact list for your child's class.",
  },
  {
    q: "How can parents receive school updates?",
    a: "Published notices appear on this noticeboard and in the student portal when enabled. Circulars may also be shared by the office.",
  },
];

export const RKPS_CONTACT = {
  id: "contact",
  title: "Come say hello",
  subtitle: "Your child's next chapter starts with a hello.",
  lead: "We'd love to hear what matters to your family — whether you are exploring a class, planning a visit or following up after admission.",
  detail:
    "The school office is the first stop for admissions, documents, fee questions and portal access. Share your child's name and the class you are asking about so the team can reply with the right next step.",
  visitBlurb:
    "Arrange a campus tour, see classrooms and the grounds, and talk to the admissions desk about learning, school life and availability.",
  visit: SITE_CONTACT.address,
  phone: SITE_CONTACT.phone,
  email: SITE_CONTACT.email,
  hours: SITE_CONTACT.hours,
  hoursNote:
    "Please confirm visiting hours with the school before you travel. Timings may change on holidays, exam days and special events.",
  reachOut: [
    {
      title: "Admissions & enquiries",
      body: "Ask about seat availability, the application process and documents. An enquiry is not an admission offer — the office will confirm policy and timelines.",
    },
    {
      title: "Campus visits",
      body: "Request a convenient time to visit. Bring your questions about class, transport and what a typical week looks like for your child.",
    },
    {
      title: "Enrolled families",
      body: "Circulars, calendars and day-to-day questions go through the office and the student portal when it is enabled for your class.",
    },
  ],
} as const;

export const RKPS_FOOTER = {
  tagline: "Nurturing curious minds, caring hearts and the confidence to make a difference.",
  closing: "A good beginning changes everything.",
  columns: {
    discover: [
      { label: "Our school", href: "/#about" },
      { label: "Admissions", href: "/#admissions" },
      { label: "Vision & values", href: "/#values" },
      { label: "Enquiry form", href: "/#enquiry" },
    ],
    families: [
      { label: "Learning approach", href: "/#academics" },
      { label: "Plan a visit", href: "/#contact" },
      { label: "Facilities", href: "/#facilities" },
      { label: "FAQ", href: "/#faq" },
    ],
    more: [
      { label: "Campus gallery", href: "/#gallery" },
      { label: "Contact the school", href: "/#contact" },
      { label: "School achievements", href: "/school-life/achievements" },
      { label: "Student achievers", href: "/school-life/student-achievers" },
    ],
    stay: [
      { label: "News & notices", href: "/#noticeboard" },
      { label: "Events & calendar", href: "/school-life/events" },
      { label: "Parent resources", href: "/#parent-resources" },
      { label: "Portal login", href: "/login" },
      { label: "Instagram", href: "https://www.instagram.com/r.k.m.p.s/" },
    ],
  },
};

export const CLASS_OPTIONS = [
  "Nursery",
  "LKG",
  "UKG",
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
  "Not sure yet",
];
