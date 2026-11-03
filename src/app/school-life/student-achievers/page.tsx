import { RkpsFontRoot } from "@/components/marketing/rkps/rkps-font-root";
import { RkpsStudentAchieversPage } from "@/components/marketing/rkps/rkps-student-achievers-page";

export const metadata = {
  title: "Student achievers | R.K Memorial Public School",
};

export default function Page() {
  return (
    <RkpsFontRoot>
      <RkpsStudentAchieversPage />
    </RkpsFontRoot>
  );
}
