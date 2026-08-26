import { useEffect, useRef, useState } from "react";
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

type CommunityPost = {
  id: string;
  image: string;
  alt: string;
  ratio: string;
  label: string;
  meta?: string;
  review?: { quote: string; name: string; detail: string };
  video?: { src: string; poster: string };
};

const posts: CommunityPost[] = [
  {
    id: "morning-room",
    image: roomLiving,
    alt: "A metal print in a softly lit living room",
    ratio: "4 / 5",
    label: "At home",
    meta: 'Metal Print · 30 × 40"',
    review: {
      quote: "The colors came out better than I expected.",
      name: "Sarah M.",
      detail: 'Metal Print · 24 × 36"',
    },
  },
  {
    id: "coastal-memory",
    image: artNorthsea,
    alt: "A coastal photograph prepared for print",
    ratio: "4 / 3",
    label: "Travel memory",
    meta: 'Metal Print · 20 × 30"',
  },
  {
    id: "unboxing",
    image: creatorUnboxingPoster,
    alt: "A customer unboxing a metal print",
    ratio: "4 / 5",
    label: "Unboxed",
    meta: "Metal Print",
    video: { src: unboxingVideo.url, poster: creatorUnboxingPoster },
  },
  {
    id: "portrait-wall",
    image: artFigure,
    alt: "A portrait print in warm natural light",
    ratio: "3 / 4",
    label: "Portrait",
    meta: 'Frameless Canvas · 16 × 24"',
  },
  {
    id: "dining-light",
    image: roomDining,
    alt: "A customer print in a dining room",
    ratio: "4 / 5",
    label: "Evening light",
    meta: 'Metal Print · 24 × 36"',
  },
  {
    id: "before",
    image: customOriginal,
    alt: "A personal source photograph before printing",
    ratio: "1 / 1",
    label: "Before the wall",
    meta: "From phone photo to print",
  },
  {
    id: "print-close",
    image: metalDetailCrop,
    alt: "Close detail of a finished metal print",
    ratio: "4 / 3",
    label: "Up close",
    meta: "Gloss metal surface",
  },
  {
    id: "canopy",
    image: artCanopy,
    alt: "A nature photograph used as a print inspiration",
    ratio: "1 / 1",
    label: "Pet portrait",
    meta: 'Metal Print · 20 × 30"',
    review: {
      quote: "It still feels like him, just larger than life.",
      name: "Jordan R.",
      detail: 'Metal Print · 20 × 30"',
    },
  },
  {
    id: "home-video",
    image: creatorHomePoster,
    alt: "A customer metal print in their living room",
    ratio: "16 / 10",
    label: "Real room, real light",
    meta: "Metal Print",
    video: { src: homeVideo.url, poster: creatorHomePoster },
  },
  {
    id: "bedroom",
    image: roomBedroom,
    alt: "A framed canvas over a bed",
    ratio: "4 / 5",
    label: "Quiet corner",
    meta: 'Frameless Canvas · 24 × 36"',
  },
  {
    id: "finished",
    image: customPrint,
    alt: "A finished photoX print beside its original image",
    ratio: "4 / 3",
    label: "Made from a moment",
    meta: 'Metal Print · 16 × 24"',
  },
  {
    id: "rain",
    image: artRain,
    alt: "A night city image printed for a home",
    ratio: "3 / 4",
    label: "City after rain",
    meta: 'Metal Print · 20 × 30"',
  },
  {
    id: "workspace",
    image: roomWorkspace,
    alt: "A personal print in a workspace",
    ratio: "4 / 5",
    label: "Workspace wall",
    meta: 'Metal Print · 20 × 30"',
    review: {
      quote: "The whole room feels more like ours now.",
      name: "Mei L.",
      detail: 'Metal Print · 20 × 30"',
    },
  },
  {
    id: "canvas",
    image: materialCanvas,
    alt: "Close detail of a woven canvas surface",
    ratio: "1 / 1",
    label: "Soft texture",
    meta: "Frameless Canvas",
  },
  {
    id: "light-video",
    image: creatorLightPoster,
    alt: "Light moving across a customer's metal print",
    ratio: "16 / 9",
    label: "Light moves too",
    meta: "Metal Print",
    video: { src: lightVideo.url, poster: creatorLightPoster },
  },
  {
    id: "architectural-room",
    image: roomLivingArchitectural,
    alt: "A large print in a customer living room",
    ratio: "5 / 4",
    label: "A wall made personal",
    meta: 'Metal Print · 30 × 40"',
  },
  {
    id: "arrives",
    image: metalArrives,
    alt: "A newly arrived metal print",
    ratio: "4 / 5",
    label: "Just arrived",
    meta: "Metal Print",
  },
  {
    id: "packed",
    image: metalPack,
    alt: "Print packaging ready to be opened",
    ratio: "4 / 3",
    label: "On its way home",
    meta: "Made to order",
  },
  {
    id: "detail",
    image: metalDetail,
    alt: "A glossy metal print catching daylight",
    ratio: "1 / 1",
    label: "The finish",
    meta: "Metal Print",
  },
  {
    id: "family-room",
    image: roomLivingArchitectural,
    alt: "A family print in a lived-in room",
    ratio: "4 / 5",
    label: "Family memory",
    meta: 'Frameless Canvas · 24 × 36"',
    review: {
      quote: "A photo we loved finally has the space it deserved.",
      name: "Avery & Sam",
      detail: 'Frameless Canvas · 24 × 36"',
    },
  },
  {
    id: "weekend-view",
    image: artNorthsea,
    alt: "A landscape photo prepared as wall art",
    ratio: "3 / 4",
    label: "Weekend away",
    meta: 'Metal Print · 16 × 24"',
  },
  {
    id: "portrait-detail",
    image: artFigure,
    alt: "A softly lit portrait image",
    ratio: "4 / 5",
    label: "People we love",
    meta: 'Frameless Canvas · 16 × 24"',
  },
  {
    id: "wall-light",
    image: creatorHomePoster,
    alt: "A print in natural afternoon light",
    ratio: "4 / 3",
    label: "Afternoon at home",
    meta: "Metal Print",
  },
  {
    id: "city-memory",
    image: artRain,
    alt: "An urban photograph ready to print",
    ratio: "1 / 1",
    label: "From the camera roll",
    meta: 'Metal Print · 12 × 18"',
  },
];

const INITIAL_BATCH = 12;
const BATCH_SIZE = 8;

export function CommunityFeed() {
  const [count, setCount] = useState(INITIAL_BATCH);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState<CommunityPost | null>(null);
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
        {shown.map((post) => (
          <CommunityCard key={post.id} post={post} onOpen={() => setActive(post)} />
        ))}
        {loading ? <Skeletons /> : null}
      </div>
      <div ref={sentinelRef} aria-hidden className="h-px" />
      {active ? <CommunityLightbox post={active} onClose={() => setActive(null)} /> : null}
    </>
  );
}

function CommunityCard({ post, onOpen }: { post: CommunityPost; onOpen: () => void }) {
  return (
    <article className="group mb-3 break-inside-avoid md:mb-5 xl:mb-6">
      <button type="button" onClick={onOpen} className="block w-full text-left">
        <div className="relative overflow-hidden bg-secondary" style={{ aspectRatio: post.ratio }}>
          <img
            src={post.image}
            alt={post.alt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.015]"
          />
          {post.video ? (
            <span className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-[0.65rem] text-foreground">
              ▶
            </span>
          ) : null}
          <div className="pointer-events-none absolute inset-x-3 bottom-3 hidden md:block md:translate-y-1 md:opacity-0 md:transition-[opacity,transform] md:duration-300 md:group-hover:translate-y-0 md:group-hover:opacity-100">
            <span className="inline-block bg-paper/88 px-2.5 py-2 backdrop-blur-sm">
              <span className="px-label block">{post.label}</span>
              {post.meta ? (
                <span className="px-meta mt-1 block text-muted-foreground">{post.meta}</span>
              ) : null}
            </span>
          </div>
        </div>
        {post.review ? (
          <div className="border-x border-b border-hairline bg-paper px-4 py-4">
            <p className="px-label tracking-[0.14em]">★★★★★</p>
            <p className="px-meta mt-2 leading-relaxed">“{post.review.quote}”</p>
            <p className="px-meta mt-3 text-muted-foreground">
              {post.review.name} · {post.review.detail}
            </p>
          </div>
        ) : null}
      </button>
    </article>
  );
}

function Skeletons() {
  return (
    <>
      {["4 / 5", "1 / 1", "4 / 3", "3 / 4"].map((ratio, index) => (
        <div
          key={ratio}
          className="mb-3 break-inside-avoid bg-secondary/60 md:mb-5 xl:mb-6"
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
      aria-label={`${post.label} from the photoX community`}
    >
      <button
        type="button"
        aria-label="Close detail"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <div className="relative z-10 grid max-h-full w-full max-w-5xl overflow-y-auto bg-paper md:grid-cols-[minmax(0,1.45fr)_minmax(230px,0.55fr)]">
        <div className="relative bg-secondary">
          {post.video ? (
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
            className="ml-auto -mr-2 -mt-2 flex h-9 w-9 items-center justify-center text-xl text-muted-foreground transition-colors hover:text-foreground"
          >
            ×
          </button>
          <p className="px-label mt-8 text-muted-foreground">{post.label}</p>
          {post.review ? (
            <>
              <p className="px-label mt-6 tracking-[0.14em]">★★★★★</p>
              <p className="px-serif mt-3 text-[1.6rem] leading-[1.2]">“{post.review.quote}”</p>
              <p className="px-meta mt-4 text-muted-foreground">{post.review.name}</p>
              <p className="px-meta text-muted-foreground">{post.review.detail}</p>
            </>
          ) : (
            <p className="px-meta mt-4 text-muted-foreground">
              {post.meta ?? "A real photoX print, made from a personal image."}
            </p>
          )}
          <a href="/custom" className="px-label mt-auto pt-12">
            Start yours →
          </a>
        </div>
      </div>
    </div>
  );
}
