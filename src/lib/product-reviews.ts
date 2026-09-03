import roomLiving from "@/assets/room-living.jpg";
import roomLivingArchitectural from "@/assets/room-living-architectural.jpg";
import roomWorkspace from "@/assets/room-workspace.jpg";
import roomDining from "@/assets/room-dining.jpg";
import metalDetail from "@/assets/metal-detail.jpg";
import metalEdge from "@/assets/metal-edge.jpg";
import metalSurface from "@/assets/metal-surface.jpg";
import type { Orientation, ShopProduct, ShopStyle } from "@/lib/shop-data";

export type ProductReview = {
  id: string;
  rating: number;
  title: string;
  body: string;
  name: string;
  material: string;
  size: string;
  image?: string;
  imageAlt?: string;
  imageRatio?: string;
  images?: string[];
  imageAlts?: string[];
  verified?: boolean;
  styles?: ShopStyle[];
  orientation?: Orientation;
};

export type ProductReviewData = {
  rating: number;
  reviewCount: number;
  distribution: Array<{ stars: number; percent: number }>;
  reviews: ProductReview[];
};

const sharedReviews: ProductReview[] = [
  {
    id: "sarah",
    rating: 5,
    title: "Great print quality",
    body: "The metal finish gives the photo much more depth than I expected. It feels substantial without being heavy on the wall.",
    name: "Sarah M.",
    material: "Metal Print",
    size: '24 × 36"',
    image: roomLiving,
    imageAlt: "A metal print in a softly lit living room",
    imageRatio: "4 / 5",
    styles: ["Photography", "Landscape", "Black & White"],
    orientation: "Landscape",
  },
  {
    id: "jordan",
    rating: 5,
    title: "Every detail held up",
    body: "I was worried about the fine detail in the original, but it came through beautifully. The colour is exactly what I hoped for.",
    name: "Jordan R.",
    material: "Metal Print",
    size: '20 × 30"',
    image: metalDetail,
    imageAlt: "Close detail of a customer's glossy metal print surface",
    imageRatio: "4 / 3",
    styles: ["Architecture", "Abstract"],
    orientation: "Landscape",
  },
  {
    id: "mei",
    rating: 5,
    title: "Better in person",
    body: "The image has a quiet glow in the afternoon light. It changed the feel of the whole room.",
    name: "Mei L.",
    material: "Metal Print",
    size: '16 × 24"',
    image: roomDining,
    imageAlt: "A finished print in a dining room",
    imageRatio: "4 / 5",
    styles: ["Landscape", "Nature"],
    orientation: "Landscape",
  },
  {
    id: "avery",
    rating: 4,
    title: "Simple to order",
    body: "The size comparison made the decision easy, and the finished print arrived ready to hang.",
    name: "Avery K.",
    material: "Metal Print",
    size: '30 × 40"',
    styles: ["Photography", "Landscape"],
    orientation: "Landscape",
  },
  {
    id: "riley",
    rating: 5,
    title: "Lovely surface",
    body: "The finish catches light gently and still looks crisp from across the room.",
    name: "Riley T.",
    material: "Metal Print",
    size: '12 × 18"',
    image: metalSurface,
    imageAlt: "A glossy metal print catching natural daylight",
    imageRatio: "3 / 4",
    styles: ["Photography", "Landscape"],
    orientation: "Landscape",
  },
  {
    id: "morgan",
    rating: 5,
    title: "A meaningful gift",
    body: "It made an ordinary phone photo feel intentional. The recipient loved it.",
    name: "Morgan S.",
    material: "Metal Print",
    size: '20 × 30"',
    image: roomWorkspace,
    imageAlt: "A metal print displayed above a workspace",
    imageRatio: "3 / 4",
    styles: ["Figurative", "Photography"],
    orientation: "Portrait",
  },
  {
    id: "camille",
    rating: 5,
    title: "True colour",
    body: "The print is rich, clear and looks exactly right in our space.",
    name: "Camille D.",
    material: "Metal Print",
    size: '24 × 36"',
    image: roomLivingArchitectural,
    imageAlt: "A metal print in an architectural living room",
    imageRatio: "4 / 5",
    styles: ["Architecture", "Urban"],
    orientation: "Portrait",
  },
  {
    id: "noah",
    rating: 4,
    title: "Made for the wall",
    body: "A clean, well-made print that feels much more considered than a standard framed photo.",
    name: "Noah P.",
    material: "Metal Print",
    size: '16 × 24"',
    image: metalEdge,
    imageAlt: "The thin edge of a finished metal print",
    imageRatio: "4 / 3",
    styles: ["Abstract"],
    orientation: "Square",
  },
];

const ratings: Record<string, Pick<ProductReviewData, "rating" | "reviewCount">> = {
  "north-sea": { rating: 4.8, reviewCount: 2140 },
  "study-in-olive": { rating: 4.9, reviewCount: 1864 },
  canopy: { rating: 4.9, reviewCount: 1732 },
  "blue-hour": { rating: 4.8, reviewCount: 1928 },
  "salt-mirror": { rating: 4.7, reviewCount: 1468 },
};

const distribution = [
  { stars: 5, percent: 82 },
  { stars: 4, percent: 13 },
  { stars: 3, percent: 3 },
  { stars: 2, percent: 1 },
  { stars: 1, percent: 1 },
];

function relevanceScore(review: ProductReview, product?: ShopProduct) {
  if (!product) return review.image ? 1 : 0;
  const sharedStyles = review.styles?.filter((style) => product.styles.includes(style)).length ?? 0;
  return (
    sharedStyles * 10 +
    (review.orientation === product.orientation ? 4 : 0) +
    (review.image ? 2 : 0)
  );
}

export function productReviewData(productId: string, product?: ShopProduct): ProductReviewData {
  const rating = ratings[productId] ?? { rating: 4.8, reviewCount: 2140 };
  const reviews = [...sharedReviews].sort(
    (a, b) => relevanceScore(b, product) - relevanceScore(a, product),
  );
  return { ...rating, distribution, reviews };
}
