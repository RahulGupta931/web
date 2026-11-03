import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { PARENT_REVIEWS } from "@/content/website/public-site";

export function RkpsParentReviews() {
  if (PARENT_REVIEWS.length === 0) return null;

  return (
    <section id="parent-reviews" className="overflow-hidden bg-white py-12 sm:py-16" aria-label="Parent reviews">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-5">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Parent reviews</p>
        <h2 className="mt-2 max-w-3xl text-2xl font-bold leading-snug tracking-tight text-heading sm:text-3xl md:text-4xl">
          In a parent’s words
        </h2>
      </div>
      <div className="mt-8">
        <InfiniteMovingCards items={PARENT_REVIEWS} direction="right" speed="slow" />
      </div>
    </section>
  );
}
