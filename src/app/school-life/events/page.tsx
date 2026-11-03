import { RkpsFontRoot } from "@/components/marketing/rkps/rkps-font-root";
import { RkpsEventsPage } from "@/components/marketing/rkps/rkps-events-page";

export const metadata = {
  title: "Events & calendar | R.K Memorial Public School",
};

export default function Page() {
  return (
    <RkpsFontRoot>
      <RkpsEventsPage />
    </RkpsFontRoot>
  );
}
