import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import homeVideo from "@/assets/creator-home.mp4.asset.json";
import unboxingVideo from "@/assets/creator-unboxing.mp4.asset.json";
import lightVideo from "@/assets/creator-light.mp4.asset.json";
import roomLiving from "@/assets/room-living.jpg";
import roomLivingArchitectural from "@/assets/room-living-architectural.jpg";
import roomBedroom from "@/assets/room-bedroom.jpg";
import roomWorkspace from "@/assets/room-workspace.jpg";
import roomDining from "@/assets/room-dining.jpg";
import customOriginal from "@/assets/custom-original.jpg";
import customPrint from "@/assets/custom-print.jpg";
import metalDetail from "@/assets/metal-detail.jpg";
import metalDetailCrop from "@/assets/metal-detail-crop.jpg";
import metalArrives from "@/assets/metal-arrives-print.jpg";
import metalPack from "@/assets/metal-arrives-pack.jpg";
import materialCanvas from "@/assets/material-canvas.jpg";
import artCanopy from "@/assets/art-canopy.jpg";
import artFigure from "@/assets/art-figure.jpg";
import artNorthsea from "@/assets/art-northsea.jpg";
import artRain from "@/assets/art-rain.jpg";
import creatorHomePoster from "@/assets/creator-home-poster.jpg";
import creatorUnboxingPoster from "@/assets/creator-unboxing-poster.jpg";
import creatorLightPoster from "@/assets/creator-light-poster.jpg";

type StoryType = "photo" | "text" | "video" | "creator" | "beforeAfter" | "unboxing";

type CommunityPost = {
  id: string;
  type: StoryType;
  quote: string;
  author: string;
  detail: string;
  rating?: number;
  verified?: boolean;
  image?: string;
  alt?: string;
  ratio?: string;
  video?: { src: string; poster: string };
  beforeAfter?: { before: string; after: string; beforeAlt: string; afterAlt: string };
};

const posts: CommunityPost[] = [
  {
    id: "morning-room",
    type: "photo",
    image: roomLiving,
    alt: "A metal print in a softly lit living room",
    ratio: "4 / 5",
    rating: 5,
    quote:
      "The colors came out better than I expected. The finish catches the afternoon light beautifully.",
    author: "Sarah M.",
    detail: 'Metal Print · 30 × 40"',
    verified: true,
  },
  {
    id: "scale-change",
    type: "text",
    rating: 5,
    quote:
      "It looked good on screen, but seeing it printed at this size completely changed the photograph.",
    author: "Daniel R.",
    detail: 'Metal Print · 30 × 40"',
    verified: true,
  },
  {
    id: "light-creator",
    type: "creator",
    image: creatorLightPoster,
    alt: "Light moving across a creator's metal print",
    ratio: "16 / 9",
    video: { src: lightVideo.url, poster: creatorLightPoster },
    quote: "The metal finish has much more depth in normal daylight than I expected.",
    author: "Mara K. · Creator review",
    detail: "Metal Print",
  },
  {
    id: "dining-light",
    type: "photo",
    image: roomDining,
    alt: "A customer print in a dining room",
    ratio: "4 / 5",
    rating: 5,
    quote: "The image has a quiet glow in the evening. It made the room feel finished.",
    author: "Mei L.",
    detail: 'Metal Print · 24 × 36"',
    verified: true,
  },
  {
    id: "old-photo",
    type: "beforeAfter",
    rating: 5,
    quote:
      "I uploaded an old photo I wasn't sure would print well. The restored version came out much cleaner than I expected.",
    author: "Emily T.",
    detail: 'Metal Print · 20 × 30"',
    verified: true,
    beforeAfter: {
      before: customOriginal,
      after: customPrint,
      beforeAlt: "The original personal photograph before printing",
      afterAlt: "The same photograph prepared as a finished print",
    },
  },
  {
    id: "unboxing",
    type: "unboxing",
    image: creatorUnboxingPoster,
    alt: "A customer unboxing a metal print",
    ratio: "4 / 5",
    rating: 5,
    video: { src: unboxingVideo.url, poster: creatorUnboxingPoster },
    quote: "The packaging was much sturdier than I expected. Everything arrived completely clean.",
    author: "Chris M.",
    detail: 'Metal Print · 24 × 36"',
    verified: true,
  },
  {
    id: "canopy",
    type: "photo",
    image: artCanopy,
    alt: "A pet portrait used as a metal print",
    ratio: "1 / 1",
    rating: 5,
    quote: "It still feels like him, just larger than life.",
    author: "Jordan R.",
    detail: 'Metal Print · 20 × 30"',
    verified: true,
  },
  {
    id: "detail-held",
    type: "text",
    rating: 5,
    quote: "I was worried about the fine detail in the original, but it came through beautifully.",
    author: "Avery K.",
    detail: 'Frameless Canvas · 16 × 24"',
    verified: true,
  },
  {
    id: "home-video",
    type: "video",
    image: creatorHomePoster,
    alt: "A customer metal print in their living room",
    ratio: "16 / 10",
    rating: 5,
    video: { src: homeVideo.url, poster: creatorHomePoster },
    quote: "I wanted to show what it actually looks like when the light moves across the surface.",
    author: "Michael R.",
    detail: 'Metal Print · 24 × 36"',
    verified: true,
  },
  {
    id: "portrait-wall",
    type: "photo",
    image: artFigure,
    alt: "A portrait print in warm natural light",
    ratio: "3 / 4",
    rating: 5,
    quote: "The color is soft but still incredibly clear. It looks more like us on the wall.",
    author: "Nora C.",
    detail: 'Frameless Canvas · 16 × 24"',
    verified: true,
  },
  {
    id: "finish",
    type: "photo",
    image: metalDetailCrop,
    alt: "Close detail of a finished metal print",
    ratio: "4 / 3",
    rating: 5,
    quote: "The finish catches light gently and still looks crisp from across the room.",
    author: "Riley T.",
    detail: 'Metal Print · 12 × 18"',
    verified: true,
  },
  {
    id: "meaningful-gift",
    type: "text",
    rating: 5,
    quote: "It made an ordinary phone photo feel intentional. The recipient loved it.",
    author: "Morgan S.",
    detail: 'Frameless Canvas · 20 × 30"',
    verified: true,
  },
  {
    id: "bedroom",
    type: "photo",
    image: roomBedroom,
    alt: "A frameless canvas print over a bed",
    ratio: "4 / 5",
    rating: 5,
    quote: "It changed the whole corner without making it feel overdone.",
    author: "Camille D.",
    detail: 'Frameless Canvas · 24 × 36"',
    verified: true,
  },
  {
    id: "coastal-memory",
    type: "photo",
    image: artNorthsea,
    alt: "A coastal photograph prepared for print",
    ratio: "4 / 3",
    rating: 5,
    quote: "A small travel memory finally feels like part of our home.",
    author: "Elena P.",
    detail: 'Metal Print · 20 × 30"',
    verified: true,
  },
  {
    id: "workspace",
    type: "photo",
    image: roomWorkspace,
    alt: "A personal print in a workspace",
    ratio: "4 / 5",
    rating: 5,
    quote: "The whole room feels more like ours now.",
    author: "Mei L.",
    detail: 'Metal Print · 20 × 30"',
    verified: true,
  },
  {
    id: "surface-creator",
    type: "creator",
    image: metalDetail,
    alt: "A glossy metal print catching daylight",
    ratio: "1 / 1",
    video: { src: lightVideo.url, poster: creatorLightPoster },
    quote: "The surface gives a simple image a surprising amount of dimension.",
    author: "Theo V. · Creator review",
    detail: "Metal Print",
  },
  {
    id: "family-room",
    type: "photo",
    image: roomLivingArchitectural,
    alt: "A family print in a lived-in room",
    ratio: "4 / 5",
    rating: 5,
    quote: "A photo we loved finally has the space it deserved.",
    author: "Avery & Sam",
    detail: 'Frameless Canvas · 24 × 36"',
    verified: true,
  },
  {
    id: "ready-to-hang",
    type: "text",
    rating: 4,
    quote: "The size comparison made the decision easy, and the print arrived ready to hang.",
    author: "Noah P.",
    detail: 'Metal Print · 30 × 40"',
    verified: true,
  },
  {
    id: "city-memory",
    type: "photo",
    image: artRain,
    alt: "An urban photograph printed for a home",
    ratio: "3 / 4",
    rating: 5,
    quote: "The blacks stayed rich without losing the small lights in the image.",
    author: "Harper J.",
    detail: 'Metal Print · 20 × 30"',
    verified: true,
  },
  {
    id: "arrival-detail",
    type: "photo",
    image: metalArrives,
    alt: "A newly arrived metal print",
    ratio: "4 / 5",
    rating: 5,
    quote: "It felt carefully made from the moment I opened the box.",
    author: "Ari W.",
    detail: 'Metal Print · 16 × 24"',
    verified: true,
  },
  {
    id: "protected-delivery",
    type: "unboxing",
    image: metalPack,
    alt: "Print packaging ready to be opened",
    ratio: "4 / 3",
    rating: 5,
    video: { src: unboxingVideo.url, poster: creatorUnboxingPoster },
    quote: "The corners and surface were protected all the way through delivery.",
    author: "Olivia N.",
    detail: 'Metal Print · 16 × 24"',
    verified: true,
  },
  {
    id: "soft-texture",
    type: "photo",
    image: materialCanvas,
    alt: "Close detail of a woven canvas surface",
    ratio: "1 / 1",
    rating: 5,
    quote: "The canvas texture made this older photo feel gentler and more tactile.",
    author: "Sofia G.",
    detail: 'Frameless Canvas · 20 × 30"',
    verified: true,
  },
];

const INITIAL_BATCH = 12;
const BATCH_SIZE = 8;

export function CommunityFeed() {
  const [count, setCount] = useState(INITIAL_BATCH);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState<CommunityPost | null>(null);
  const canHover = useFinePointer();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const shown = posts.slice(0, count);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || count >= posts.length) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || loading) return;
        setLoading(true);
        window.setTimeout(() => {
          setCount((current) => Math.min(current + BATCH_SIZE, posts.length));
          setLoading(false);
        }, 420);
      },
      { rootMargin: "520px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [count, loading]);

  useEffect(() => {
    if (!active) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [active]);

  return (
    <>
      <div className="columns-2 gap-x-3 md:columns-3 md:gap-x-5 xl:columns-4 xl:gap-x-6">
        {shown.map((post, index) => (
          <CommunityCard
            key={post.id}
            post={post}
            number={index + 1}
            canHover={canHover}
            onOpen={() => setActive(post)}
          />
        ))}
        {loading ? <Skeletons /> : null}
      </div>
      <div ref={sentinelRef} aria-hidden className="h-px" />
      {active ? <CommunityLightbox post={active} onClose={() => setActive(null)} /> : null}
    </>
  );
}

function useFinePointer() {
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return canHover;
}

function StoryStars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <span className={`inline-flex gap-px ${className}`} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} size={12} strokeWidth={1.25} fill="currentColor" aria-hidden />
      ))}
    </span>
  );
}

function StoryDetails({
  post,
  expanded = false,
  truncate = false,
}: {
  post: CommunityPost;
  expanded?: boolean;
  truncate?: boolean;
}) {
  return (
    <div className={expanded ? "pt-0" : "pt-4 md:pt-5"}>
      {post.rating ? (
        <StoryStars rating={post.rating} className="text-foreground" />
      ) : (
        <p className="px-label">Creator review</p>
      )}
      <p
        className={`px-serif mt-2.5 leading-[1.25] text-foreground ${
          expanded ? "text-[1.55rem] md:text-[1.85rem]" : "text-[1.2rem] md:text-[1.3rem]"
        } ${truncate ? "line-clamp-3" : ""}`}
      >
        “{post.quote}”
      </p>
      <p className="px-meta mt-3 text-foreground md:mt-4">{post.author}</p>
      <p className="px-meta mt-1 text-muted-foreground">
        {post.detail}
        {post.verified ? " · Verified purchase" : ""}
      </p>
    </div>
  );
}

function OverlayStoryDetails({ post }: { post: CommunityPost }) {
  return (
    <div className="pointer-events-none absolute inset-x-6 bottom-6 z-20 translate-y-2 text-paper opacity-0 transition-[opacity,transform] duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
      {post.rating ? (
        <StoryStars rating={post.rating} className="text-paper" />
      ) : (
        <p className="px-label text-paper">Creator review</p>
      )}
      <p className="px-serif mt-2.5 line-clamp-3 text-[1.2rem] leading-[1.25] text-paper md:text-[1.3rem]">
        “{post.quote}”
      </p>
      <p className="px-meta mt-3 text-paper">{post.author}</p>
      <p className="px-meta mt-1 text-paper/80">{post.detail}</p>
    </div>
  );
}

function VideoOverlayStoryDetails({ post }: { post: CommunityPost }) {
  return (
    <div className="pointer-events-none absolute inset-x-6 bottom-6 z-20 translate-y-2 text-paper opacity-0 transition-[opacity,transform] duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
      {post.rating ? <StoryStars rating={post.rating} className="text-paper" /> : null}
      <p className="px-serif mt-2 line-clamp-2 text-[1.15rem] leading-[1.22] text-paper md:text-[1.25rem]">
        “{post.quote}”
      </p>
      <p className="px-meta mt-2 text-paper/90">
        {post.author} · {post.detail}
      </p>
    </div>
  );
}

function isShortVideo(post: CommunityPost) {
  if (!post.ratio) return true;
  const [width, height] = post.ratio.split("/").map((value) => Number(value.trim()));
  return !width || !height || width / height >= 1.2;
}

function CommunityCard({
  post,
  number,
  canHover,
  onOpen,
}: {
  post: CommunityPost;
  number: number;
  canHover: boolean;
  onOpen: () => void;
}) {
  const isTextOnly = post.type === "text";
  const isVideo = Boolean(post.video);
  const videoOverlay = canHover && isVideo && !isShortVideo(post);
  const showDetailsBelow = isTextOnly || !canHover || (isVideo && !videoOverlay);

  return (
    <article
      className={`mb-10 break-inside-avoid ${isTextOnly ? "border border-hairline p-7 md:p-9" : ""}`}
    >
      {isTextOnly ? (
        <p className="px-meta text-muted-foreground">{String(number).padStart(2, "0")}</p>
      ) : null}
      {isTextOnly ? null : (
        <button
          type="button"
          onClick={onOpen}
          aria-label={`Open customer story from ${post.author}`}
          className="group relative block w-full overflow-hidden text-left"
        >
          {post.beforeAfter ? (
            <div className="grid grid-cols-2 gap-px overflow-hidden bg-hairline">
              <figure className="relative aspect-[4/5] overflow-hidden bg-secondary">
                <img
                  src={post.beforeAfter.before}
                  alt={post.beforeAfter.beforeAlt}
                  className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.015]"
                />
                <figcaption className="px-label absolute bottom-2 left-2 bg-paper/90 px-2 py-1">
                  Before
                </figcaption>
              </figure>
              <figure className="relative aspect-[4/5] overflow-hidden bg-secondary">
                <img
                  src={post.beforeAfter.after}
                  alt={post.beforeAfter.afterAlt}
                  className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.015]"
                />
                <figcaption className="px-label absolute bottom-2 left-2 bg-paper/90 px-2 py-1">
                  After
                </figcaption>
              </figure>
            </div>
          ) : (
            <div
              className="relative overflow-hidden bg-secondary"
              style={{ aspectRatio: post.ratio }}
            >
              <img
                src={post.image}
                alt={post.alt}
                loading="lazy"
                className={`absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out ${
                  isVideo ? "group-hover:scale-[1.01]" : "group-hover:scale-[1.015]"
                }`}
              />
              {post.video ? (
                <span className="absolute left-1/2 top-1/2 z-30 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 pl-0.5 text-[0.7rem] text-foreground transition-transform duration-300 ease-out group-hover:scale-105 group-focus-visible:scale-105">
                  ▶
                </span>
              ) : null}
              {post.type === "creator" || post.type === "unboxing" ? (
                <span className="px-label absolute left-3 top-3 z-30 bg-paper/90 px-2 py-1.5">
                  {post.type === "creator" ? "Creator review" : "Unboxing"}
                </span>
              ) : null}
            </div>
          )}
          {canHover && !isVideo ? (
            <>
              <span className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-visible:opacity-100" />
              <OverlayStoryDetails post={post} />
            </>
          ) : null}
          {videoOverlay ? (
            <>
              <span className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[38%] bg-gradient-to-t from-ink/60 via-ink/20 to-transparent opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-visible:opacity-100" />
              <VideoOverlayStoryDetails post={post} />
            </>
          ) : null}
        </button>
      )}
      {showDetailsBelow ? <StoryDetails post={post} truncate={!isTextOnly} /> : null}
    </article>
  );
}

function Skeletons() {
  return (
    <>
      {["4 / 5", "1 / 1", "4 / 3", "3 / 4"].map((ratio, index) => (
        <div
          key={ratio}
          className="mb-10 break-inside-avoid bg-secondary/60"
          style={{ aspectRatio: ratio, opacity: 1 - index * 0.12 }}
        />
      ))}
    </>
  );
}

function CommunityLightbox({ post, onClose }: { post: CommunityPost; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/45 p-4 backdrop-blur-[2px] md:p-10"
      role="dialog"
      aria-modal="true"
      aria-label={`Customer story from ${post.author}`}
    >
      <button
        type="button"
        aria-label="Close detail"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <div className="relative z-10 grid max-h-full w-full max-w-5xl overflow-y-auto bg-paper md:grid-cols-[minmax(0,1.45fr)_minmax(230px,0.55fr)]">
        <div className="relative bg-secondary">
          {post.beforeAfter ? (
            <div className="grid min-h-[45vh] grid-cols-2 gap-px bg-hairline">
              <img
                src={post.beforeAfter.before}
                alt={post.beforeAfter.beforeAlt}
                className="h-full w-full object-cover"
              />
              <img
                src={post.beforeAfter.after}
                alt={post.beforeAfter.afterAlt}
                className="h-full w-full object-cover"
              />
            </div>
          ) : post.video ? (
            <video
              src={post.video.src}
              poster={post.video.poster}
              controls
              autoPlay
              playsInline
              className="block max-h-[72vh] w-full object-contain"
            />
          ) : (
            <img
              src={post.image}
              alt={post.alt}
              className="block max-h-[72vh] w-full object-contain"
            />
          )}
        </div>
        <div className="flex min-h-full flex-col p-6 md:p-8">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close detail"
            className="px-label px-underline self-end"
          >
            Close
          </button>
          <div className="my-auto py-12">
            <StoryDetails post={post} expanded />
            <a href="/custom" className="px-label px-underline mt-8 inline-block">
              Start yours →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
