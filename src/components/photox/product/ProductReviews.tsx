import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import type { ShopProduct } from "@/lib/shop-data";
import { productReviewData, type ProductReview } from "@/lib/product-reviews";
import { Shell } from "../Section";

const INITIAL_REVIEWS = 6;

export function RatingStars({ rating, label = true }: { rating: number; label?: boolean }) {
  return (
    <span
      aria-label={label ? `${rating} out of 5 stars` : undefined}
      className="inline-flex items-center gap-0.5 text-foreground"
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} size={15} strokeWidth={1.5} fill="currentColor" aria-hidden />
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
  const { rating, reviewCount, distribution, reviews } = productReviewData(product.id);
  const [shown, setShown] = useState(INITIAL_REVIEWS);
  const [imageReview, setImageReview] = useState<ProductReview | null>(null);

  useEffect(() => {
    setShown(INITIAL_REVIEWS);
    setImageReview(null);
  }, [product.id]);

  return (
    <>
      <Shell id="reviews" label="Reviews" className="scroll-mt-24 pt-20 md:pt-28">
        <div className="px-rule pt-6">
          <p className="px-label text-muted-foreground">Reviews</p>
          <div className="mt-8 grid gap-12 md:grid-cols-[0.42fr_0.58fr] md:items-end">
            <div>
              <p className="px-serif text-[3.5rem] leading-none md:text-[4.8rem]">
                {rating.toFixed(1)}
              </p>
              <p className="px-meta mt-2 text-muted-foreground">out of 5</p>
              <div className="mt-4">
                <RatingStars rating={rating} />
              </div>
              <p className="px-meta mt-3 text-muted-foreground">
                {reviewCount.toLocaleString()} reviews
              </p>
            </div>
            <dl className="space-y-2.5">
              {distribution.map((row) => (
                <div
                  key={row.stars}
                  className="grid grid-cols-[3.5rem_minmax(0,1fr)_2.5rem] items-center gap-3"
                >
                  <dt className="px-meta text-muted-foreground">{row.stars} stars</dt>
                  <dd className="h-px bg-hairline">
                    <span
                      className="block h-px bg-foreground"
                      style={{ width: `${row.percent}%` }}
                    />
                  </dd>
                  <span className="px-meta text-right text-muted-foreground">{row.percent}%</span>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-16 border-t border-hairline">
          {reviews.slice(0, shown).map((review) => (
            <ReviewRow key={review.id} review={review} onImageOpen={() => setImageReview(review)} />
          ))}
        </div>
        {shown < reviews.length ? (
          <button
            type="button"
            onClick={() => setShown(reviews.length)}
            className="px-label px-underline mt-8"
          >
            Load more reviews
          </button>
        ) : null}
      </Shell>
      {imageReview?.image ? (
        <ReviewImageLightbox review={imageReview} onClose={() => setImageReview(null)} />
      ) : null}
    </>
  );
}

function ReviewRow({ review, onImageOpen }: { review: ProductReview; onImageOpen: () => void }) {
  return (
    <article className="grid gap-6 border-b border-hairline py-8 md:grid-cols-[minmax(0,1fr)_120px] md:gap-10">
      <div>
        <RatingStars rating={review.rating} />
        <h3 className="px-label mt-4">{review.title}</h3>
        <p className="px-meta mt-3 max-w-[62ch] text-muted-foreground">“{review.body}”</p>
        <p className="px-meta mt-5">{review.name}</p>
        <p className="px-meta text-muted-foreground">
          {review.material} · {review.size} · Verified purchase
        </p>
      </div>
      {review.image ? (
        <button
          type="button"
          onClick={onImageOpen}
          aria-label={`View customer photo from ${review.name}`}
          className="group relative aspect-square w-28 overflow-hidden bg-secondary md:w-full"
        >
          <img
            src={review.image}
            alt={review.imageAlt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </button>
      ) : null}
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
