import { useEffect, useRef, useState } from "react";
import { Star, X } from "lucide-react";
import type { ShopProduct } from "@/lib/shop-data";
import { productReviewData, type ProductReview } from "@/lib/product-reviews";
import { Shell } from "../Section";

const FEATURED_REVIEW_COUNT = 2;
const EXPANDED_REVIEW_COUNT = 6;

export function RatingStars({
  rating,
  label = true,
  size = 13,
}: {
  rating: number;
  label?: boolean;
  size?: number;
}) {
  return (
    <span
      aria-label={label ? `${rating} out of 5 stars` : undefined}
      className="inline-flex items-center gap-0.5 text-foreground"
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={size}
          strokeWidth={1.25}
          fill={index < Math.round(rating) ? "currentColor" : "none"}
          className={index < Math.round(rating) ? undefined : "text-foreground/25"}
          aria-hidden
        />
      ))}
    </span>
  );
}

export function RatingJump({ productId }: { productId: string }) {
  const { rating, reviewCount } = productReviewData(productId);
  const jumpToReviews = () => {
    const target = document.getElementById("reviews");
    if (!target) return;
    window.history.replaceState(null, "", "#reviews");
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - 92,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={jumpToReviews}
      className="mt-5 inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-left"
      aria-label={`Rated ${rating} out of 5 from ${reviewCount.toLocaleString()} reviews. Jump to reviews.`}
    >
      <RatingStars rating={rating} label={false} />
      <span className="px-meta text-foreground">{rating.toFixed(1)}</span>
      <span aria-hidden className="px-meta text-muted-foreground">
        ·
      </span>
      <span className="px-meta text-muted-foreground">{reviewCount.toLocaleString()} reviews</span>
    </button>
  );
}

export function ProductReviews({ product }: { product: ShopProduct }) {
  const { rating, reviewCount, reviews } = productReviewData(product.id);
  const [activeReviewIndex, setActiveReviewIndex] = useState<number | null>(null);
  const [shown, setShown] = useState(FEATURED_REVIEW_COUNT);
  const hasMoreReviews = shown < reviews.length;

  useEffect(() => {
    setActiveReviewIndex(null);
    setShown(FEATURED_REVIEW_COUNT);
  }, [product.id]);

  const showMoreReviews = () => {
    setShown((current) =>
      current < EXPANDED_REVIEW_COUNT
        ? Math.min(EXPANDED_REVIEW_COUNT, reviews.length)
        : reviews.length,
    );
  };

  return (
    <Shell id="reviews" label="Reviews" className="scroll-mt-24 pt-20 md:pt-24">
      <div className="border-t border-hairline pt-4">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 md:flex-nowrap">
          <p className="px-label">Reviews</p>
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 md:flex-nowrap">
            <RatingStars rating={rating} label={false} />
            <span className="px-meta text-foreground">{rating.toFixed(1)}</span>
            <span aria-hidden className="px-meta text-muted-foreground">
              ·
            </span>
            <span className="px-meta whitespace-nowrap text-muted-foreground">
              {reviewCount.toLocaleString()} reviews
            </span>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
        {reviews.slice(0, shown).map((review, index) => (
          <ReviewPreview
            key={review.id}
            review={review}
            number={index + 1}
            onImageOpen={() => setActiveReviewIndex(index)}
          />
        ))}
      </div>

      {hasMoreReviews ? (
        <button type="button" onClick={showMoreReviews} className="px-label px-underline mt-10">
          {shown < EXPANDED_REVIEW_COUNT ? "View all reviews →" : "Show more reviews →"}
        </button>
      ) : null}
      {activeReviewIndex !== null ? (
        <ReviewImageLightbox
          reviews={reviews}
          activeReviewIndex={activeReviewIndex}
          onReviewChange={setActiveReviewIndex}
          onClose={() => setActiveReviewIndex(null)}
        />
      ) : null}
    </Shell>
  );
}

function ReviewPreview({
  review,
  number,
  onImageOpen,
}: {
  review: ProductReview;
  number: number;
  onImageOpen: () => void;
}) {
  const previewImage = reviewImages(review)[0];
  return (
    <article className="grid gap-4 md:grid-cols-[150px_minmax(0,1fr)] md:gap-5">
      {previewImage ? (
        <button
          type="button"
          onClick={onImageOpen}
          aria-label={`View customer photo from ${review.name}`}
          className="group relative aspect-[16/10] w-full overflow-hidden bg-secondary md:aspect-[4/5]"
        >
          <img
            src={previewImage}
            alt={reviewImageAlt(review, 0)}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </button>
      ) : null}
      <div className="min-w-0">
        <p className="px-meta text-muted-foreground">{String(number).padStart(2, "0")}</p>
        <div className="mt-3">
          <RatingStars rating={review.rating} label={false} />
        </div>
        <h3 className="px-label mt-3">{review.title}</h3>
        <p className="px-serif mt-3 max-w-[31ch] text-[1.15rem] leading-[1.3] text-foreground md:text-[1.3rem]">
          “{review.body}”
        </p>
        <div className="mt-4">
          <p className="px-meta text-foreground">{review.name}</p>
          <p className="px-meta mt-1 text-muted-foreground">
            {review.material} · {review.size}
          </p>
          <p className="px-meta mt-1 text-muted-foreground">Verified purchase</p>
        </div>
      </div>
    </article>
  );
}

function reviewImages(review: ProductReview) {
  return review.images?.length ? review.images : review.image ? [review.image] : [];
}

function reviewImageAlt(review: ProductReview, imageIndex: number) {
  return review.imageAlts?.[imageIndex] ?? review.imageAlt ?? `Customer photo from ${review.name}`;
}

function ReviewImageLightbox({
  reviews,
  activeReviewIndex,
  onReviewChange,
  onClose,
}: {
  reviews: ProductReview[];
  activeReviewIndex: number;
  onReviewChange: (index: number) => void;
  onClose: () => void;
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const swipeStartX = useRef<number | null>(null);
  const review = reviews[activeReviewIndex]!;
  const images = reviewImages(review);
  const hasImage = images.length > 0;
  const canGoPrevious = activeReviewIndex > 0;
  const canGoNext = activeReviewIndex < reviews.length - 1;

  useEffect(() => {
    setActiveImageIndex(0);
  }, [review.id]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && canGoPrevious) onReviewChange(activeReviewIndex - 1);
      if (event.key === "ArrowRight" && canGoNext) onReviewChange(activeReviewIndex + 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeReviewIndex, canGoNext, canGoPrevious, onClose, onReviewChange]);

  const moveReview = (direction: -1 | 1) => {
    const next = activeReviewIndex + direction;
    if (next >= 0 && next < reviews.length) onReviewChange(next);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/45 p-4 backdrop-blur-[2px] md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`Review from ${review.name}`}
    >
      <button
        type="button"
        aria-label="Close review"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <div
        className="relative z-10 flex h-[calc(100dvh-2rem)] w-full max-w-[1360px] flex-col overflow-hidden bg-paper md:h-[76vh] md:max-h-[800px] md:w-[80vw]"
        onPointerDown={(event) => {
          swipeStartX.current = event.clientX;
        }}
        onPointerUp={(event) => {
          const startX = swipeStartX.current;
          swipeStartX.current = null;
          if (startX === null || Math.abs(event.clientX - startX) < 48) return;
          moveReview(event.clientX < startX ? 1 : -1);
        }}
        onPointerCancel={() => {
          swipeStartX.current = null;
        }}
      >
        <button
          type="button"
          aria-label="Close review"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center bg-paper/90 text-foreground transition-opacity hover:opacity-60"
        >
          <X aria-hidden size={20} strokeWidth={1.4} />
        </button>
        <div
          className={`min-h-0 flex-1 overflow-y-auto ${hasImage ? "lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] lg:overflow-hidden" : "lg:flex lg:items-center"}`}
        >
          {hasImage ? (
            <section className="relative flex min-h-[42dvh] items-center justify-center bg-secondary px-5 py-14 md:min-h-[52dvh] md:px-10 lg:min-h-0 lg:p-10">
              <img
                key={`${review.id}-${activeImageIndex}`}
                src={images[activeImageIndex]}
                alt={reviewImageAlt(review, activeImageIndex)}
                className="px-fade block max-h-[54dvh] max-w-full object-contain lg:max-h-full"
              />
              {images.length > 1 ? (
                <div className="absolute bottom-5 left-5 flex items-center gap-4 md:bottom-7 md:left-7">
                  <button
                    type="button"
                    disabled={activeImageIndex === 0}
                    onClick={() => setActiveImageIndex((current) => current - 1)}
                    className="px-label disabled:opacity-35"
                  >
                    ←
                  </button>
                  <span className="px-meta text-foreground/70">
                    {activeImageIndex + 1} / {images.length}
                  </span>
                  <button
                    type="button"
                    disabled={activeImageIndex === images.length - 1}
                    onClick={() => setActiveImageIndex((current) => current + 1)}
                    className="px-label disabled:opacity-35"
                  >
                    →
                  </button>
                </div>
              ) : null}
            </section>
          ) : null}
          <aside
            className={`min-h-0 p-7 md:p-10 ${hasImage ? "lg:overflow-y-auto" : "mx-auto w-full max-w-[46rem]"}`}
          >
            <div key={review.id} className="px-panel-transition">
              <p className="px-meta text-muted-foreground">
                {String(activeReviewIndex + 1).padStart(2, "0")} /{" "}
                {String(reviews.length).padStart(2, "0")}
              </p>
              <div className="mt-5">
                <RatingStars rating={review.rating} label={false} size={15} />
              </div>
              <h2 className="px-label mt-5">{review.title}</h2>
              <p className="px-serif mt-5 text-[1.25rem] leading-[1.35] text-foreground md:text-[1.45rem]">
                “{review.body}”
              </p>
              <div className="mt-7">
                <p className="px-meta text-foreground">{review.name}</p>
                <p className="px-meta mt-1 text-muted-foreground">
                  {review.material} · {review.size}
                </p>
                {review.verified !== false ? (
                  <p className="px-meta mt-1 text-muted-foreground">Verified purchase</p>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
        <nav
          className="flex h-[68px] shrink-0 items-center justify-between gap-6 border-t border-hairline bg-paper px-7 md:px-10"
          aria-label="Review navigation"
        >
          <button
            type="button"
            disabled={!canGoPrevious}
            onClick={() => moveReview(-1)}
            className="px-label disabled:opacity-35"
          >
            ← Previous
          </button>
          <button
            type="button"
            disabled={!canGoNext}
            onClick={() => moveReview(1)}
            className="px-label disabled:opacity-35"
          >
            Next →
          </button>
        </nav>
      </div>
    </div>
  );
}
