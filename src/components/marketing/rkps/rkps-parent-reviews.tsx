import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { PARENT_REVIEWS } from "@/content/website/public-site";
import { RkpsSectionIntro } from "@/components/marketing/rkps/rkps-marketing-blocks";

export function RkpsParentReviews() {
  return (
    <section id="parent-reviews" className="overflow-hidden bg-white py-16 sm:py-20 lg:py-28" aria-label="Parent reviews">
      <div className="mx-auto max-w-7xl rkps-page-x">
        <RkpsSectionIntro
          num="Parent reviews"
          title="In a parent’s words"
          description="Families on attendance, school life, and how the campus feels day to day."
        />
      </div>
      <div className="mt-8">
        <InfiniteMovingCards items={PARENT_REVIEWS} direction="right" speed="slow" />
      </div>
    </section>
  );
}
