import { useEffect, useState } from "react";
import { Star } from "lucide-react";
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
        <Star key={index} size={size} strokeWidth={1.25} fill="currentColor" aria-hidden />
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
  const [imageReview, setImageReview] = useState<ProductReview | null>(null);
  const [shown, setShown] = useState(FEATURED_REVIEW_COUNT);
  const hasMoreReviews = shown < reviews.length;

  useEffect(() => {
    setImageReview(null);
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
            onImageOpen={() => setImageReview(review)}
          />
        ))}
      </div>

      {hasMoreReviews ? (
        <button type="button" onClick={showMoreReviews} className="px-label px-underline mt-10">
          {shown < EXPANDED_REVIEW_COUNT ? "View all reviews →" : "Show more reviews →"}
        </button>
      ) : null}
      {imageReview?.image ? (
        <ReviewImageLightbox review={imageReview} onClose={() => setImageReview(null)} />
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
  return (
    <article className="grid gap-4 md:grid-cols-[150px_minmax(0,1fr)] md:gap-5">
      {review.image ? (
        <button
          type="button"
          onClick={onImageOpen}
          aria-label={`View customer photo from ${review.name}`}
          className="group relative aspect-[16/10] w-full overflow-hidden bg-secondary md:aspect-[4/5]"
        >
          <img
            src={review.image}
            alt={review.imageAlt}
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

function ReviewImageLightbox({ review, onClose }: { review: ProductReview; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/45 p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Customer photo from ${review.name}`}
    >
      <button
        type="button"
        aria-label="Close customer photo"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <div className="relative z-10 max-h-full max-w-3xl bg-paper p-3">
        <img
          src={review.image}
          alt={review.imageAlt}
          className="block max-h-[78vh] max-w-full object-contain"
        />
        <button type="button" onClick={onClose} className="px-label px-underline mt-3">
          Close
        </button>
      </div>
    </div>
  );
}
