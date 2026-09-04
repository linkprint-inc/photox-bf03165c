import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Shell, SectionHead } from "../Section";
import { ShopProductCard } from "../shop/ShopProductCard";
import { ProductReviews, RatingJump } from "./ProductReviews";
import { ProductUploadModal } from "./ProductUploadModal";
import {
  MainVisual,
  MediaThumbnail,
  PrintFace,
  RoomScene,
  type GalleryMediaItem,
  type ViewMode,
} from "./ProductVisual";
import {
  categoryLabel,
  closeUps,
  productInfo,
  relatedProducts,
} from "@/lib/product-detail";
import { mediaForProduct, type PdpMediaItem } from "@/lib/product-media";
import { acceptedTypes, readImageFile, type PreparedImage } from "@/lib/prepared-image";
import { sizeSteps, type ShopProduct } from "@/lib/shop-data";
import {
  materialName,
  orientedSizeLabel,
  unitPrice,
  useStore,
  type BagMaterial,
  type PrintOrientation,
} from "@/lib/store";

const views: { key: ViewMode; label: string }[] = [
  { key: "artwork", label: "Artwork" },
  { key: "detail", label: "Detail" },
  { key: "room", label: "In a room" },
];

type ProductMediaItem = GalleryMediaItem & { id: string; label: string };
type GalleryCarouselItem = ProductMediaItem & { groupIndex: number; view: ViewMode };
type ProductMedia = {
  artworkSource: string;
  items: PdpMediaItem[];
  carousel: GalleryCarouselItem[];
};

/** Curated, per-product gallery media defined once in src/lib/product-media.ts. */
function productMedia(product: ShopProduct): ProductMedia {
  const { gallery: items } = mediaForProduct(product);
  const carousel = items.map((item, index) => ({
    ...item,
    groupIndex: index,
    view: item.view,
  }));
  return {
    artworkSource: product.image,
    items,
    carousel,
  };
}


function parsePhysicalSize(size: (typeof sizeSteps)[number]) {
  const match = size.label.match(/(\d+)\s*×\s*(\d+)/);
  if (!match) {
    return { width: size.inches * 1.5, height: size.inches };
  }
  const a = parseInt(match[1]!, 10);
  const b = parseInt(match[2]!, 10);
  return { width: Math.max(a, b), height: Math.min(a, b) };
}

function SizePrint({
  product,
  material,
  size,
  orientation,
}: {
  product: ShopProduct;
  material: BagMaterial;
  size: (typeof sizeSteps)[number];
  orientation: PrintOrientation;
}) {
  const { width, height } = parsePhysicalSize(size);
  const aspectRatio =
    orientation === "landscape" ? width / height : orientation === "square" ? 1 : height / width;
  return (
    <div
      className={["relative w-full overflow-hidden bg-secondary shadow-sm", "px-gloss"].join(" ")}
      style={{ aspectRatio }}
    >
      <img
        src={product.image}
        alt={`${product.name} shown at ${size.label}`}
        loading="lazy"
        className="block h-full w-full object-cover"
      />
      <span aria-hidden className="px-edge" />
    </div>
  );
}

function MediaRail({
  product,
  items,
  activeIndex,
  onSelect,
  orientation,
  inches,
  sizeLabel,
  artworkSource,
  layout,
}: {
  product: ShopProduct;
  items: GalleryCarouselItem[];
  activeIndex: number;
  onSelect: (item: GalleryCarouselItem) => void;
  orientation: PrintOrientation;
  inches: number;
  sizeLabel: string;
  artworkSource: string;
  layout: "vertical" | "horizontal";
}) {
  const isVertical = layout === "vertical";
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const railRef = useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  useEffect(() => {
    if (!isVertical) return;

    const rail = railRef.current;
    if (!rail) return;

    const updateScrollControls = () => {
      const maxScroll = Math.max(0, rail.scrollHeight - rail.clientHeight);
      setCanScrollUp(rail.scrollTop > 1);
      setCanScrollDown(rail.scrollTop < maxScroll - 1);
    };

    const frame = window.requestAnimationFrame(updateScrollControls);
    const resizeObserver = new ResizeObserver(updateScrollControls);
    resizeObserver.observe(rail);
    rail.addEventListener("scroll", updateScrollControls, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      rail.removeEventListener("scroll", updateScrollControls);
    };
  }, [isVertical, items.length]);

  useEffect(() => {
    if (!isVertical) return;
    itemRefs.current[activeIndex]?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: "smooth",
    });
  }, [activeIndex, isVertical]);

  const scrollRail = (direction: -1 | 1) => {
    railRef.current?.scrollBy({ top: direction * 88, behavior: "smooth" });
  };

  const mediaButtons = items.map((item, index) => {
    const selected = index === activeIndex;
    return (
      <button
        key={item.id}
        ref={(element) => {
          itemRefs.current[index] = element;
        }}
        type="button"
          onClick={() => onSelect(item)}
        aria-label={item.label}
        aria-pressed={selected}
        className={[
          "aspect-square shrink-0 overflow-hidden border transition-[border-color,opacity] duration-200 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-foreground/65",
          isVertical ? "w-[76px]" : "w-[72px]",
          selected
            ? "border-foreground opacity-100"
            : "border-hairline opacity-65 hover:opacity-100",
        ].join(" ")}
        role="listitem"
      >
        <MediaThumbnail
          product={product}
          view={item.view}
          mediaIndex={item.groupIndex}
          orientation={orientation}
          inches={inches}
          sizeLabel={sizeLabel}
          artworkSource={artworkSource}
          media={item}
        />
      </button>
    );
  });

  if (!isVertical) {
    return (
      <div
        className="mt-3 flex gap-3 overflow-x-auto pb-px md:hidden"
        aria-label="Product media"
        role="list"
      >
        {mediaButtons}
      </div>
    );
  }

  return (
    <div className="relative hidden h-full min-h-0 w-[76px] overflow-hidden md:block">
      <div
        ref={railRef}
        className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto overscroll-contain pr-px [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Product media"
        role="list"
      >
        {mediaButtons}
      </div>
      <button
        type="button"
        onClick={() => scrollRail(-1)}
        disabled={!canScrollUp}
        aria-label="Scroll gallery thumbnails up"
        className="px-label absolute left-1/2 top-2 z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center bg-[rgba(250,249,246,0.82)] text-foreground/70 opacity-85 backdrop-blur-[2px] transition-[color,opacity] duration-200 hover:text-foreground hover:opacity-100 disabled:pointer-events-none disabled:opacity-20 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-foreground/65"
      >
        ↑
      </button>
      <button
        type="button"
        onClick={() => scrollRail(1)}
        disabled={!canScrollDown}
        aria-label="Scroll gallery thumbnails down"
        className="px-label absolute bottom-2 left-1/2 z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center bg-[rgba(250,249,246,0.82)] text-foreground/70 opacity-85 backdrop-blur-[2px] transition-[color,opacity] duration-200 hover:text-foreground hover:opacity-100 disabled:pointer-events-none disabled:opacity-20 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-foreground/65"
      >
        ↓
      </button>
    </div>
  );
}

export function ProductDetail({ product }: { product: ShopProduct }) {
  const material: BagMaterial = "metal";
  const featureDetails = mediaForProduct(product).featureDetails;
  const [sizeIndex, setSizeIndex] = useState(2);
  const [orientation, setOrientation] = useState<PrintOrientation>(
    product.orientation === "Portrait"
      ? "portrait"
      : product.orientation === "Square"
        ? "square"
        : "landscape",
  );
  const [mediaPosition, setMediaPosition] = useState(0);
  const [carouselDirection, setCarouselDirection] = useState<-1 | 1>(1);
  const [customizationEntry, setCustomizationEntry] = useState<"idle" | "editing">("idle");
  const [selectedImage, setSelectedImage] = useState<PreparedImage | null>(null);
  const [imagePickerError, setImagePickerError] = useState<string | null>(null);
  const [openInfo, setOpenInfo] = useState<string | null>(null);
  const [mainCtaVisible, setMainCtaVisible] = useState<boolean | null>(null);
  const mainCtaRef = useRef<HTMLButtonElement>(null);
  const imagePickerRef = useRef<HTMLInputElement>(null);
  const mediaSwipeStartRef = useRef<number | null>(null);
  const { toggleSaved, isSaved, hydrated } = useStore();

  useEffect(() => {
    setSizeIndex(2);
    setOrientation(
      product.orientation === "Portrait"
        ? "portrait"
        : product.orientation === "Square"
          ? "square"
          : "landscape",
    );
    setMediaPosition(0);
  }, [product.id, product.orientation]);

  useEffect(() => {
    const mainCta = mainCtaRef.current;
    const mobile = window.matchMedia("(max-width: 767px)");
    if (!mainCta) return;

    let observer: IntersectionObserver | undefined;
    const observe = () => {
      observer?.disconnect();

      if (!mobile.matches) {
        setMainCtaVisible(null);
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          const ratio = entry?.intersectionRatio ?? 0;

          if (ratio >= 0.85) {
            setMainCtaVisible(true);
          } else if (ratio <= 0.7) {
            setMainCtaVisible(false);
          } else {
            setMainCtaVisible((visible) => visible ?? false);
          }
        },
        {
          threshold: [0, 0.7, 0.85],
        },
      );
      observer.observe(mainCta);
    };

    observe();
    mobile.addEventListener("change", observe);
    return () => {
      observer?.disconnect();
      mobile.removeEventListener("change", observe);
    };
  }, [product.id]);

  const size = sizeSteps[sizeIndex]!;
  const sizeLabel = orientedSizeLabel(sizeIndex, orientation);
  const price = unitPrice(material, sizeIndex);
  const saved = hydrated && isSaved(product.id);
  const related = useMemo(() => relatedProducts(product), [product]);
  const gallery = useMemo(() => productMedia(product), [product]);
  const currentMedia = gallery.carousel[mediaPosition]!;
  const currentView = currentMedia.view;
  const currentGroupIndex = currentMedia.groupIndex;
  const changeMedia = (nextPosition: number) => {
    const total = gallery.carousel.length;
    const next = (nextPosition + total) % total;
    setCarouselDirection(nextPosition > mediaPosition ? 1 : -1);
    setMediaPosition(next);
  };
  const visibleMedia = gallery.carousel;
  const visibleMediaPosition = mediaPosition;
  const selectMediaItem = (item: GalleryCarouselItem) => {
    const nextPosition = gallery.carousel.findIndex((candidate) => candidate.id === item.id);
    if (nextPosition >= 0) changeMedia(nextPosition);
  };
  const moveMedia = (direction: -1 | 1) => {
    setCarouselDirection(direction);
    setMediaPosition((position) => {
      const total = gallery.carousel.length;
      return (position + direction + total) % total;
    });
  };
  let groupStart = mediaPosition;
  while (groupStart > 0 && gallery.carousel[groupStart]?.view !== "artwork") groupStart -= 1;
  const nextGroupStart = gallery.carousel.findIndex(
    (item, index) => index > groupStart && item.view === "artwork",
  );
  const groupEnd = nextGroupStart < 0 ? gallery.carousel.length : nextGroupStart;
  const currentGroupItems = gallery.carousel.slice(groupStart, groupEnd);
  const availableViews = new Set(currentGroupItems.map((item) => item.view));
  /** Switch media type without leaving the currently selected artwork group. */
  const selectView = (nextView: ViewMode) => {
    const item = currentGroupItems.find((candidate) => candidate.view === nextView);
    if (!item) return;
    const index = gallery.carousel.findIndex((candidate) => candidate.id === item.id);
    if (index >= 0) changeMedia(index);
  };
  const openNativeImagePicker = () => {
    setImagePickerError(null);
    if (imagePickerRef.current) {
      imagePickerRef.current.value = "";
      imagePickerRef.current.click();
    }
  };
  const selectCustomizationImage = async (file: File | undefined) => {
    if (!file) return;
    if (!acceptedTypes.split(",").includes(file.type)) {
      setImagePickerError("Choose a JPG, PNG or WebP image.");
      return;
    }
    try {
      const image = await readImageFile(file);
      setSelectedImage(image);
      setCustomizationEntry("editing");
    } catch (reason) {
      setImagePickerError(reason instanceof Error ? reason.message : "Could not read that image.");
    }
  };

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        !desktop.matches ||
        event.defaultPrevented ||
        target?.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(target?.tagName ?? "")
      ) {
        return;
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        const direction = event.key === "ArrowLeft" ? -1 : 1;
        moveMedia(direction);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentMedia.id, gallery.carousel, visibleMedia, visibleMediaPosition]);

  return (
    <>
      {/* ---------- First screen: product + purchase ---------- */}
      <Shell className="pt-[calc(var(--site-header-height)+1.5rem)]">
        <nav className="px-meta text-muted-foreground">
          <Link to="/shop" className="px-underline">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span>{product.name}</span>
        </nav>

        <div className="mt-5 grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* LEFT — product visual */}
          <div className="lg:col-span-7">
            <div className="grid min-w-0 md:grid-cols-[76px_minmax(0,1fr)] md:gap-x-4">
              <div className="relative hidden min-h-0 overflow-hidden [contain:size] md:block">
                <MediaRail
                  product={product}
                   items={visibleMedia}
                   activeIndex={visibleMediaPosition}
                   onSelect={selectMediaItem}
                  orientation={orientation}
                  inches={size.inches}
                  sizeLabel={sizeLabel}
                  artworkSource={gallery.artworkSource}
                  layout="vertical"
                />
              </div>
              <div
                className="group relative min-w-0"
                onPointerDown={(event) => {
                  mediaSwipeStartRef.current = event.clientX;
                }}
                onPointerUp={(event) => {
                  const start = mediaSwipeStartRef.current;
                  mediaSwipeStartRef.current = null;
                  if (start === null || Math.abs(event.clientX - start) < 48) return;
                  moveMedia(event.clientX < start ? 1 : -1);
                }}
                onPointerCancel={() => {
                  mediaSwipeStartRef.current = null;
                }}
              >
                <div
                  key={mediaPosition}
                  className={carouselDirection === 1 ? "px-carousel-next" : "px-carousel-previous"}
                >
                  <MainVisual
                    product={product}
                    material={material}
                    view={currentView}
                    inches={size.inches}
                    sizeLabel={sizeLabel}
                    orientation={orientation}
                    mediaIndex={currentGroupIndex}
                    artworkSource={gallery.artworkSource}
                    media={currentMedia}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => moveMedia(-1)}
                  aria-label="Previous product image"
                  className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-foreground/15 bg-paper/85 text-foreground/80 opacity-60 transition-opacity group-hover:opacity-90 hover:opacity-100 focus-visible:opacity-100"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => moveMedia(1)}
                  aria-label="Next product image"
                  className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-foreground/15 bg-paper/85 text-foreground/80 opacity-60 transition-opacity group-hover:opacity-90 hover:opacity-100 focus-visible:opacity-100"
                >
                  →
                </button>
              </div>
              <div aria-hidden className="hidden md:block" />
              <div className="min-w-0 md:col-start-2">
                <MediaRail
                  product={product}
                   items={visibleMedia}
                   activeIndex={visibleMediaPosition}
                   onSelect={selectMediaItem}
                  orientation={orientation}
                  inches={size.inches}
                  sizeLabel={sizeLabel}
                  artworkSource={gallery.artworkSource}
                  layout="horizontal"
                />
                <ul className="mt-4 flex gap-6">
                  {views.map((v) => {
                    const available = availableViews.has(v.key);
                    return (
                      <li key={v.key}>
                        <button
                          type="button"
                          onClick={() => selectView(v.key)}
                          disabled={!available}
                          aria-pressed={currentView === v.key}
                          className={[
                            "px-label px-underline transition-opacity duration-[420ms]",
                            !available
                              ? "cursor-not-allowed opacity-25"
                              : currentView === v.key
                                ? "opacity-100 after:scale-x-100"
                                : "opacity-45 hover:opacity-100",
                          ].join(" ")}
                        >
                          {v.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT — purchase configuration */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <p className="px-meta text-muted-foreground">{categoryLabel(product)}</p>
              <div className="mt-2 flex items-center justify-between gap-4">
                <h1 className="px-serif text-[2rem] leading-[1.05] md:text-[2.6rem]">
                  {product.name}
                </h1>
                <button
                  type="button"
                  onClick={() => toggleSaved(product.id)}
                  aria-label={
                    saved ? `Remove ${product.name} from saved artwork` : `Save ${product.name}`
                  }
                  aria-pressed={saved}
                  className="flex h-9 w-9 shrink-0 items-center justify-center text-foreground/75 transition-colors hover:text-foreground"
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill={saved ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
                  </svg>
                </button>
              </div>
              <p className="px-meta mt-2 text-muted-foreground">
                {product.orientation} · Metal Print
              </p>
              <RatingJump productId={product.id} />

              <p className="px-price mt-6">From ${product.from}</p>

              <button
                ref={mainCtaRef}
                type="button"
                onClick={openNativeImagePicker}
                className="px-label mt-6 flex h-[54px] w-full items-center justify-center border border-foreground text-center transition-colors duration-300 hover:bg-foreground hover:text-background"
              >
                Customize your print
              </button>
            </div>
          </div>
        </div>
      </Shell>

      <ProductInformationSection
        product={product}
        openInfo={openInfo}
        onOpenInfoChange={setOpenInfo}
      />

      {/* ---------- Product image sequence ---------- */}
      <Shell className="pt-20 md:pt-28">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              n: "01",
              label: "Front",
              node: <PrintFace product={product} material={material} className="aspect-square" />,
            },
            {
              n: "02",
              label: "Surface / Edge",
              node: (
                <div className="aspect-square overflow-hidden bg-secondary">
                  <img
                    src={featureDetails.surfaceEdge.source}
                    alt={featureDetails.surfaceEdge.alt}
                    loading="lazy"
                    className={`h-full w-full object-cover ${featureDetails.surfaceEdge.crop ?? ""}`}
                  />
                </div>
              ),
            },
            {
              n: "03",
              label: "In a room",
              node: (
                <div className="aspect-square overflow-hidden bg-secondary">
                  {featureDetails.room.source ? (
                    <img
                      src={featureDetails.room.source}
                      alt={featureDetails.room.alt}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <RoomScene
                      product={product}
                      material={material}
                      inches={20}
                      sizeLabel={orientedSizeLabel(sizeIndex, orientation)}
                      orientation={orientation}
                      background={featureDetails.room.roomBackground}
                    />
                  )}
                </div>
              ),
            },
          ].map((item) => (
            <figure key={item.n}>
              {item.node}
              <figcaption className="mt-3 flex items-baseline gap-3">
                <span className="px-meta text-muted-foreground">{item.n}</span>
                <span className="px-label">{item.label}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Shell>

      <ProductReviews product={product} />

      {/* ---------- See the difference in size ---------- */}
      <Shell className="pt-20 md:pt-28">
        <SectionHead
          title="See the difference in size"
          note="Compare every available format at a glance."
        />
        <div className="mt-10 rounded-sm bg-secondary/20 p-6 md:p-10">
          {/* Desktop */}
          <div
            className="hidden md:grid md:items-end gap-x-6 border-b border-hairline pb-6"
            style={{
              gridTemplateColumns: sizeSteps
                .map((s) => {
                  const { width } = parsePhysicalSize(s);
                  return `minmax(0, ${width}fr)`;
                })
                .join(" "),
            }}
          >
            {sizeSteps.map((s) => (
              <div key={s.label} className="flex flex-col items-center">
                <SizePrint
                  product={product}
                  material={material}
                  size={s}
                  orientation={orientation}
                />
              </div>
            ))}
          </div>
          <div
            className="mt-5 hidden md:grid gap-x-6"
            style={{
              gridTemplateColumns: sizeSteps
                .map((s) => {
                  const { width } = parsePhysicalSize(s);
                  return `minmax(0, ${width}fr)`;
                })
                .join(" "),
            }}
          >
            {sizeSteps.map((s, i) => {
              const selected = sizeIndex === i;
              return (
                <div key={`${s.label}-label`} className="text-center">
                  <span
                    className={[
                      "px-label relative inline-block",
                      selected ? "text-foreground" : "text-muted-foreground",
                      selected
                        ? "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-foreground"
                        : "",
                    ].join(" ")}
                  >
                    {orientedSizeLabel(i, orientation)}
                  </span>
                  <p
                    className={[
                      "px-price mt-1",
                      selected ? "text-foreground" : "text-muted-foreground",
                    ].join(" ")}
                  >
                    ${unitPrice(material, i)}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-end gap-6 overflow-x-auto border-b border-hairline pb-6">
            {sizeSteps.map((s, i) => {
              const selected = sizeIndex === i;
              const { width } = parsePhysicalSize(s);
              return (
                <div
                  key={s.label}
                  className="flex flex-shrink-0 flex-col items-center"
                  style={{ width: `${width * 7}px` }}
                >
                  <SizePrint
                    product={product}
                    material={material}
                    size={s}
                    orientation={orientation}
                  />
                  <div className="mt-4 text-center">
                    <span
                      className={[
                        "px-label relative inline-block",
                        selected ? "text-foreground" : "text-muted-foreground",
                        selected
                          ? "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-foreground"
                          : "",
                      ].join(" ")}
                    >
                      {orientedSizeLabel(i, orientation)}
                    </span>
                    <p
                      className={[
                        "px-price mt-1",
                        selected ? "text-foreground" : "text-muted-foreground",
                      ].join(" ")}
                    >
                      ${unitPrice(material, i)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Shell>

      {/* ---------- Material up close ---------- */}
      <Shell className="pt-20 md:pt-28">
        <SectionHead title={`${materialName[material]}, up close`} />
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {closeUps[material].map((c) => (
            <figure key={c.title}>
              <div className="aspect-square overflow-hidden bg-secondary">
                <img
                  src={c.image}
                  alt={c.alt}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="mt-3">
                <span className="px-label block">{c.title}</span>
                <span className="px-meta text-muted-foreground">{c.caption}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Shell>

      {/* ---------- You may also like ---------- */}
      <Shell className="pt-20 pb-28 md:pt-28 md:pb-36">
        <SectionHead title="You may also like" />
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4 md:gap-x-8">
          {related.map((r) => (
            <ShopProductCard key={r.id} product={r} view="grid" href={`/products/${r.id}`} />
          ))}
        </div>
      </Shell>

      {/* ---------- Mobile sticky commerce bar ---------- */}
      <div
        aria-hidden={mainCtaVisible !== false}
        className={`sticky bottom-0 z-30 border-t border-hairline bg-paper/95 backdrop-blur-sm transition-[opacity,transform] duration-[250ms] ease-in-out motion-reduce:transition-none md:hidden ${
          mainCtaVisible === false
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-full opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-6 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <span className="px-meta text-muted-foreground">From ${product.from}</span>
          <button
            type="button"
            onClick={openNativeImagePicker}
            tabIndex={mainCtaVisible === false ? 0 : -1}
            className="px-label border border-foreground px-5 py-3"
          >
            Customize
          </button>
        </div>
      </div>
      {customizationEntry === "editing" && selectedImage ? (
        <ProductUploadModal
          product={product}
          material={material}
          sizeIndex={sizeIndex}
          sizeLabel={sizeLabel}
          price={price}
          initialImage={selectedImage}
          onSizeChange={setSizeIndex}
          orientation={orientation}
          onOrientationChange={setOrientation}
          onClose={() => {
            setSelectedImage(null);
            setCustomizationEntry("idle");
          }}
        />
      ) : null}
      <input
        ref={imagePickerRef}
        type="file"
        accept={acceptedTypes}
        className="sr-only"
        onChange={(event) => void selectCustomizationImage(event.target.files?.[0])}
      />
      {imagePickerError ? (
        <p
          role="alert"
          className="px-meta fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 border border-foreground/15 bg-paper px-4 py-3 text-destructive shadow-sm"
        >
          {imagePickerError}
        </p>
      ) : null}
    </>
  );
}

function ProductInformationSection({
  product,
  openInfo,
  onOpenInfoChange,
}: {
  product: ShopProduct;
  openInfo: string | null;
  onOpenInfoChange: (title: string | null) => void;
}) {
  return (
    <Shell className="pt-16 md:pt-20">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <h2 className="px-label text-muted-foreground">About the work</h2>
          <dl className="mt-6 border-t border-hairline">
            <div className="flex justify-between gap-6 border-b border-hairline py-3">
              <dt className="px-meta text-muted-foreground">Title</dt>
              <dd className="px-label">{product.name}</dd>
            </div>
            <div className="flex justify-between gap-6 border-b border-hairline py-3">
              <dt className="px-meta text-muted-foreground">Category</dt>
              <dd className="px-label">{categoryLabel(product)}</dd>
            </div>
            <div className="flex justify-between gap-6 border-b border-hairline py-3">
              <dt className="px-meta text-muted-foreground">Orientation</dt>
              <dd className="px-label">{product.orientation}</dd>
            </div>
            <div className="flex justify-between gap-6 border-b border-hairline py-3">
              <dt className="px-meta text-muted-foreground">Materials</dt>
              <dd className="px-label">Metal Print</dd>
            </div>
          </dl>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <h2 className="px-label text-muted-foreground">Product information</h2>
          <ul className="mt-6 border-t border-hairline">
            {productInfo.map((row) => {
              const open = openInfo === row.title;
              const accordionId = `product-information-${row.title.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`;
              return (
                <li key={row.title} className="border-b border-hairline">
                  <button
                    type="button"
                    onClick={() => onOpenInfoChange(open ? null : row.title)}
                    aria-expanded={open}
                    aria-controls={accordionId}
                    className="flex w-full items-center justify-between gap-6 py-4 text-left"
                  >
                    <span className="px-label">{row.title}</span>
                    <span
                      aria-hidden
                      className={[
                        "text-lg leading-none transition-transform ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                        open ? "duration-[360ms]" : "duration-[300ms]",
                        open ? "rotate-45" : "",
                      ].join(" ")}
                    >
                      +
                    </span>
                  </button>
                  <div
                    id={accordionId}
                    role="region"
                    aria-label={row.title}
                    className={[
                      "grid transition-[grid-template-rows] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                      open
                        ? "grid-rows-[1fr] duration-[360ms]"
                        : "grid-rows-[0fr] duration-[300ms]",
                    ].join(" ")}
                  >
                    <div className="min-h-0 overflow-hidden" aria-hidden={!open} inert={!open}>
                      <p
                        className={[
                          "px-meta max-w-prose pb-5 text-muted-foreground transition-[opacity,transform] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                          open
                            ? "translate-y-0 opacity-100 duration-[360ms]"
                            : "-translate-y-1.5 opacity-0 duration-[300ms]",
                        ].join(" ")}
                      >
                        {row.body}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Shell>
  );
}
