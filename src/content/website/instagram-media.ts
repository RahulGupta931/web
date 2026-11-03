/** Photos saved from the public Instagram profile @r.k.m.p.s (school-owned posts). */

export const INSTAGRAM_PROFILE = "https://www.instagram.com/r.k.m.p.s/";

export const INSTAGRAM_PHOTOS = [
  {
    src: "/marketing/instagram/campus-8.jpg",
    alt: "Students and teachers of R.K Memorial Public School together in the hall",
  },
  {
    src: "/marketing/instagram/campus-4.jpg",
    alt: "Dussehra celebration with students in traditional dress",
  },
  {
    src: "/marketing/instagram/campus-5.jpg",
    alt: "Student performance during Dussehra at R.K Memorial Public School",
  },
  {
    src: "/marketing/instagram/campus-6.jpg",
    alt: "Students posing after a Dussehra cultural programme",
  },
  {
    src: "/marketing/instagram/campus-7.jpg",
    alt: "Dance performance in the school hall",
  },
  {
    src: "/marketing/instagram/campus-2.jpg",
    alt: "R.K Memorial Public School crest",
  },
  {
    src: "/marketing/instagram/campus-9.jpg",
    alt: "Students gathered for a school celebration",
  },
  {
    src: "/marketing/instagram/campus-10.jpg",
    alt: "Students taking part in a school programme",
  },
  {
    src: "/marketing/instagram/campus-11.jpg",
    alt: "School event with students participating together",
  },
  {
    src: "/marketing/instagram/campus-12.jpg",
    alt: "Students at a school assembly or programme",
  },
  {
    src: "/marketing/instagram/campus-13.jpg",
    alt: "School celebration with students on stage",
  },
  {
    src: "/marketing/instagram/campus-14.jpg",
    alt: "Students performing at a school event",
  },
  {
    src: "/marketing/instagram/campus-15.jpg",
    alt: "Group photo from a school programme",
  },
  {
    src: "/marketing/instagram/campus-16.jpg",
    alt: "Students taking part in a cultural activity",
  },
  {
    src: "/marketing/instagram/campus-17.jpg",
    alt: "Learners engaged in a school event",
  },
  {
    src: "/marketing/instagram/campus-18.jpg",
    alt: "Students celebrating together at school",
  },
  {
    src: "/marketing/instagram/campus-19.jpg",
    alt: "School programme with student participants",
  },
  {
    src: "/marketing/instagram/campus-20.jpg",
    alt: "Students in traditional dress at a school function",
  },
  {
    src: "/marketing/instagram/campus-21.jpg",
    alt: "Cultural celebration with R.K Memorial Public School students",
  },
  {
    src: "/marketing/instagram/campus-22.jpg",
    alt: "Students lined up for a school event",
  },
  {
    src: "/marketing/instagram/campus-23.jpg",
    alt: "School activity with students and staff",
  },
  {
    src: "/marketing/instagram/campus-24.jpg",
    alt: "Students participating in a school gathering",
  },
  {
    src: "/marketing/instagram/campus-25.jpg",
    alt: "Stage performance by students at school",
  },
  {
    src: "/marketing/instagram/campus-26.jpg",
    alt: "Students receiving recognition at a school event",
  },
  {
    src: "/marketing/instagram/campus-27.jpg",
    alt: "Recent moment from R.K Memorial Public School life",
  },
  {
    src: "/marketing/instagram/campus-28.jpg",
    alt: "Student talent show performance at R.K Memorial Public School",
  },
  {
    src: "/marketing/instagram/campus-29.jpg",
    alt: "Cultural performance during a school talent programme",
  },
  {
    src: "/marketing/instagram/campus-30.jpg",
    alt: "Student creativity on stage at a school event",
  },
  {
    src: "/marketing/instagram/campus-31.jpg",
    alt: "Talent show moment with student performers",
  },
  {
    src: "/marketing/instagram/campus-32.jpg",
    alt: "Students recognised at a school programme",
  },
  {
    src: "/marketing/instagram/campus-33.jpg",
    alt: "School event with student participants and staff",
  },
  {
    src: "/marketing/instagram/campus-34.jpg",
    alt: "Festival celebration with students at school",
  },
  {
    src: "/marketing/instagram/campus-35.jpg",
    alt: "Community initiative involving R.K Memorial Public School students",
  },
  {
    src: "/marketing/instagram/campus-36.jpg",
    alt: "Rotary Club health and hygiene initiative at the school",
  },
  {
    src: "/marketing/instagram/campus-37.jpg",
    alt: "Students at a school community programme",
  },
  {
    src: "/marketing/instagram/campus-38.jpg",
    alt: "Learners taking part in a community event",
  },
  {
    src: "/marketing/instagram/campus-39.jpg",
    alt: "Gratitude ceremony with students and guests",
  },
  {
    src: "/marketing/instagram/campus-40.jpg",
    alt: "School initiative with student volunteers",
  },
  {
    src: "/marketing/instagram/campus-41.jpg",
    alt: "Community partnership event at R.K Memorial Public School",
  },
  {
    src: "/marketing/instagram/campus-42.jpg",
    alt: "School festival with students in celebration",
  },
] as const;

/** Resolve a downloaded file under public/marketing/instagram (array order ≠ campus number). */
export function instagramPhoto(file: `campus-${number}.jpg`) {
  const src = `/marketing/instagram/${file}`;
  const photo = INSTAGRAM_PHOTOS.find((p) => p.src === src);
  if (!photo) {
    throw new Error(`Missing Instagram photo: ${src}`);
  }
  return photo;
}

/** Extra photos for the student achievers page gallery (excludes logo-only crest). */
export const STUDENT_ACHIEVER_GALLERY = INSTAGRAM_PHOTOS.filter((p) => p.src !== "/marketing/instagram/campus-2.jpg");

/** Celebrations, performances and community events — for the events page. */
export const SCHOOL_EVENTS_GALLERY = [
  instagramPhoto("campus-4.jpg"),
  instagramPhoto("campus-5.jpg"),
  instagramPhoto("campus-6.jpg"),
  instagramPhoto("campus-7.jpg"),
  instagramPhoto("campus-15.jpg"),
  instagramPhoto("campus-16.jpg"),
  instagramPhoto("campus-25.jpg"),
  instagramPhoto("campus-28.jpg"),
  instagramPhoto("campus-29.jpg"),
  instagramPhoto("campus-30.jpg"),
  instagramPhoto("campus-35.jpg"),
  instagramPhoto("campus-36.jpg"),
  instagramPhoto("campus-37.jpg"),
  instagramPhoto("campus-38.jpg"),
  instagramPhoto("campus-39.jpg"),
  instagramPhoto("campus-40.jpg"),
  instagramPhoto("campus-41.jpg"),
  instagramPhoto("campus-42.jpg"),
] as const;

export const SCHOOL_EVENTS_CARD_PHOTOS = {
  learning: instagramPhoto("campus-19.jpg"),
  sports: instagramPhoto("campus-22.jpg"),
  arts: instagramPhoto("campus-28.jpg"),
} as const;

/** Photos mapped to achievement themes for school-life pages. */
export const ACHIEVEMENT_THEME_PHOTOS = {
  hero: instagramPhoto("campus-8.jpg"),
  academic: instagramPhoto("campus-19.jpg"),
  sport: instagramPhoto("campus-22.jpg"),
  arts: instagramPhoto("campus-7.jpg"),
  community: instagramPhoto("campus-6.jpg"),
  featuredStory: instagramPhoto("campus-30.jpg"),
} as const;

export const STUDENT_ACHIEVER_CARD_PHOTOS: Record<
  "Academics" | "Sport" | "Creativity" | "Leadership" | "Service" | "Personal progress",
  (typeof INSTAGRAM_PHOTOS)[number]
> = {
  Academics: instagramPhoto("campus-19.jpg"),
  Sport: instagramPhoto("campus-22.jpg"),
  Creativity: instagramPhoto("campus-29.jpg"),
  Leadership: instagramPhoto("campus-8.jpg"),
  Service: instagramPhoto("campus-36.jpg"),
  "Personal progress": instagramPhoto("campus-24.jpg"),
};

/** Reels stay on Instagram (video files are not publicly downloadable). Embedded on the site. */
export const INSTAGRAM_REELS = [
  { id: "De_c9IbBAiQ", title: "School reel" },
  { id: "De3Y3Z7BRzx", title: "School update" },
] as const;
