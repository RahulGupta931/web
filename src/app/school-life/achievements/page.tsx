import { RkpsFontRoot } from "@/components/marketing/rkps/rkps-font-root";
import { RkpsAchievementsPage } from "@/components/marketing/rkps/rkps-achievements-page";

export const metadata = {
  title: "School achievements | R.K Memorial Public School",
};

export default function Page() {
  return (
    <RkpsFontRoot>
      <RkpsAchievementsPage />
    </RkpsFontRoot>
  );
}
