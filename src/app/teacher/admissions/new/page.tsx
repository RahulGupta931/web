"use client";

import { useRouter } from "next/navigation";
import { PanelMobileShell } from "@/components/panel/panel-mobile-shell";
import { PanelResponsive } from "@/components/panel/panel-responsive";
import { useNavigationLoading } from "@/components/navigation-loading-provider";
import { PageHeader } from "@/components/page-header";
import { StudentAdmissionRegistrationForm } from "@/components/student-admission-registration-form";

export default function RegisterStudentPage() {
  const router = useRouter();
  const { startNavigation } = useNavigationLoading();

  const onSubmitted = () => {
    startNavigation();
    router.push("/teacher/admissions");
  };

  const form = (
    <StudentAdmissionRegistrationForm onSubmitted={onSubmitted} />
  );

  return (
    <PanelResponsive
      desktop={
        <div className="mx-auto max-w-4xl space-y-6">
          <PageHeader
            title="Student admission form"
            description="Complete all sections. The application is sent to the Principal for approval before the student is enrolled."
          />
          {form}
        </div>
      }
      mobile={
        <PanelMobileShell
          role="teacher"
          kicker="Teacher"
          title="New admission"
          subtitle="Complete all sections — principal approves before enrollment."
          showCalendar={false}
        >
          <div className="-mx-1 rounded-2xl border border-border bg-surface p-3 shadow-sm sm:p-4">
            {form}
          </div>
        </PanelMobileShell>
      }
    />
  );
}
