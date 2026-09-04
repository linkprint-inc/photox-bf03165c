import sizeRoom from "@/assets/size-room.jpg";
import { materialName, type BagMaterial, type PrintOrientation } from "@/lib/store";
import type { ShopProduct } from "@/lib/shop-data";

export type ViewMode = "artwork" | "detail" | "room";
export type GalleryMediaPresentation =
  "original" | "front" | "room-image" | "detail-image" | "room";

export type GalleryMediaItem = {
  presentation: GalleryMediaPresentation;
  source?: string | undefined;
  /** Optional object-fit crop classes used for artwork / detail framing. */
  crop?: string | undefined;
  /** Optional interior background for composited room views. */
  roomBackground?: string | undefined;
};

const WALL_INCHES = 96;

function aspectRatioFromLabel(sizeLabel: string) {
  const match = sizeLabel.match(/(\d+)\s*×\s*(\d+)/);
  return match ? Number(match[1]) / Number(match[2]) : 1.5;
}

/** Clean physical front view of the print, with material surface treatment. */
export function PrintFace({
  product,
  material,
  className = "",
}: {
  product: ShopProduct;
  material: BagMaterial;
  className?: string;
}) {
  return (
    <div className={["relative overflow-hidden bg-secondary", "px-gloss", className].join(" ")}>
      <img
        src={product.image}
        alt={`${product.name} as a ${materialName[material].toLowerCase()}`}
        className="block h-full w-full object-cover"
      />
      <span aria-hidden className="px-edge" />
    </div>
  );
}

/** One fixed interior; only the artwork changes physical scale. */
export function RoomScene({
  product,
  material,
  inches,
  sizeLabel,
  orientation,
  mediaIndex = 0,
  artworkSource = product.image,
  background = sizeRoom,
  className = "",
}: {
  product: ShopProduct;
  material: BagMaterial;
  inches: number;
  sizeLabel: string;
  orientation: PrintOrientation;
  mediaIndex?: number;
  artworkSource?: string;
  background?: string | undefined;
  className?: string;
}) {
  const roomScale = [1, 0.8, 1.12][mediaIndex % 3]!;
  const widthPct =
    (((orientation === "landscape" ? inches * 1.5 : inches) * 100) / WALL_INCHES) * roomScale;
  const portrait = orientation === "portrait";
  return (
    <div className={["relative h-full w-full overflow-hidden bg-secondary", className].join(" ")}>
      <img
        src={background}
        width={1600}
        height={1104}
        loading="lazy"
        alt="A walnut console against a plain wall in daylight, used to show print scale"
        className="block h-full w-full object-cover"
      />
      <div
        className={`absolute left-1/2 -translate-x-1/2 shadow-[0_10px_24px_-18px_rgba(0,0,0,0.7)] transition-[top,transform,width] duration-300 ease-out ${portrait ? "-translate-y-1/2" : ""}`}
        style={{
          width: `${widthPct}%`,
          // Portrait prints grow around this wall anchor. At the largest size
          // this raises the print roughly 10% of the room above the cabinet,
          // while landscape retains its approved top-edge placement.
          top: portrait ? "32%" : "14%",
        }}
      >
        <img
          src={artworkSource}
          alt={`${product.name} shown on a wall at ${sizeLabel}`}
          loading="lazy"
          className="block w-full"
          style={{ aspectRatio: aspectRatioFromLabel(sizeLabel), objectFit: "cover" }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(108deg, transparent 34%, rgba(255,255,255,0.18) 46%, transparent 62%)",
          }}
        />
      </div>
    </div>
  );
}

export function MainVisual({
  product,
  material,
  view,
  inches,
  sizeLabel,
  orientation,
  mediaIndex = 0,
  artworkSource = product.image,
  media,
}: {
  product: ShopProduct;
  material: BagMaterial;
  view: ViewMode;
  inches: number;
  sizeLabel: string;
  orientation: PrintOrientation;
  mediaIndex?: number;
  artworkSource?: string;
  media?: GalleryMediaItem | undefined;
}) {
  const frame = (active: boolean) =>
    [
      "absolute inset-0 transition-[opacity,transform] duration-300 ease-out",
      active ? "z-10 scale-100 opacity-100" : "pointer-events-none scale-[0.995] opacity-0",
    ].join(" ");

  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
      <div className={frame(view === "artwork")}>
        <div key={`artwork-${mediaIndex}`} className="px-media-fade h-full w-full">
          <ArtworkMedia
            product={product}
            material={material}
            sizeLabel={sizeLabel}
            mediaIndex={mediaIndex}
            artworkSource={artworkSource}
            media={media}
          />
        </div>
      </div>
      <div className={frame(view === "detail")}>
        <div key={`detail-${mediaIndex}`} className="px-media-fade h-full w-full">
          <DetailMedia
            product={product}
            sizeLabel={sizeLabel}
            mediaIndex={mediaIndex}
            artworkSource={artworkSource}
            media={media}
          />
        </div>
      </div>
      <div className={frame(view === "room")}>
        <div key={`room-${mediaIndex}`} className="px-media-fade h-full w-full">
          {media?.presentation === "room-image" && media.source ? (
            <StaticGalleryImage source={media.source} alt={`${product.name} in a room`} />
          ) : (
            <RoomScene
              product={product}
              material={material}
              inches={inches}
              sizeLabel={sizeLabel}
              orientation={orientation}
              mediaIndex={mediaIndex}
              artworkSource={artworkSource}
              background={media?.roomBackground}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ArtworkMedia({
  product,
  material,
  sizeLabel,
  mediaIndex,
  artworkSource,
  media,
}: {
  product: ShopProduct;
  material: BagMaterial;
  sizeLabel: string;
  mediaIndex: number;
  artworkSource: string;
  media?: GalleryMediaItem | undefined;
}) {
  if (media?.presentation === "original") {
    return (
      <StaticGalleryImage
        source={media.source ?? artworkSource}
        alt={`${product.name} original artwork`}
        fit="contain"
      />
    );
  }
  if (
    (media?.presentation === "room-image" || media?.presentation === "detail-image") &&
    media.source
  ) {
    return <StaticGalleryImage source={media.source} alt={`${product.name} as a metal print`} />;
  }
  const cropClass =
    media?.crop ??
    (media?.presentation === "front"
      ? "scale-100"
      : ["scale-100", "scale-[1.16] object-[50%_42%]", "scale-[1.34] object-[56%_50%]"][
          mediaIndex % 3
        ]!);
  return (
    <div className="flex h-full w-full items-center justify-center bg-secondary p-6 md:p-8">
      <div
        className="max-h-full max-w-full overflow-hidden shadow-sm"
        style={{ aspectRatio: aspectRatioFromLabel(sizeLabel) }}
      >
        <div className="relative h-full w-full overflow-hidden bg-secondary px-gloss">
          <img
            src={artworkSource}
            alt={`${product.name} as a ${materialName[material].toLowerCase()}`}
            className={`block h-full w-full object-cover transition-transform duration-200 ${cropClass}`}
          />
          <span aria-hidden className="px-edge" />
        </div>
      </div>
    </div>
  );
}

function DetailMedia({
  product,
  sizeLabel,
  mediaIndex,
  artworkSource,
  media,
}: {
  product: ShopProduct;
  sizeLabel: string;
  mediaIndex: number;
  artworkSource: string;
  media?: GalleryMediaItem | undefined;
}) {
  if (media?.presentation === "detail-image" && media.source) {
    return <StaticGalleryImage source={media.source} alt={`${product.name} metal print detail`} />;
  }
  const cropClass =
    media?.crop ??
    [
      "scale-[1.38] object-[48%_50%]",
      "scale-[1.62] object-[70%_45%]",
      "scale-[1.48] object-[35%_60%]",
    ][mediaIndex % 3]!;
  return (
    <div className="flex h-full w-full items-center justify-center bg-secondary p-6 md:p-8">
      <div
        className="relative max-h-full max-w-full overflow-hidden bg-secondary shadow-sm px-gloss"
        style={{ aspectRatio: aspectRatioFromLabel(sizeLabel) }}
      >
        <img
          src={artworkSource}
          alt={`${product.name} close-up on metal`}
          className={`block h-full w-full object-cover transition-transform duration-200 ${cropClass}`}
        />
        <span aria-hidden className="px-edge" />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(112deg, transparent 28%, rgba(255,255,255,0.28) 44%, rgba(255,255,255,0.04) 59%, transparent 73%)",
          }}
        />
      </div>
    </div>
  );
}

export function MediaThumbnail({
  product,
  view,
  mediaIndex,
  inches = 20,
  sizeLabel = '20 × 30"',
  orientation = product.orientation === "Portrait"
    ? "portrait"
    : product.orientation === "Square"
      ? "square"
      : "landscape",
  artworkSource = product.image,
  media,
}: {
  product: ShopProduct;
  view: ViewMode;
  mediaIndex: number;
  inches?: number;
  sizeLabel?: string;
  orientation?: PrintOrientation;
  artworkSource?: string;
  media?: GalleryMediaItem | undefined;
}) {
  if (media?.presentation === "room-image" && media.source) {
    return <StaticGalleryImage source={media.source} alt="" />;
  }
  if (view === "room") {
    return (
      <RoomScene
        product={product}
        material="metal"
        inches={inches}
        sizeLabel={sizeLabel}
        orientation={orientation}
        mediaIndex={mediaIndex}
        artworkSource={artworkSource}
        background={media?.roomBackground}
      />
    );
  }
  if (media?.presentation === "original") {
    return <StaticGalleryImage source={media.source ?? artworkSource} alt="" fit="contain" />;
  }
  if (media?.presentation === "detail-image" && media.source) {
    return <StaticGalleryImage source={media.source} alt="" />;
  }
  const cropClass =
    media?.crop ??
    (view === "detail"
      ? ["scale-[1.35]", "scale-[1.6] object-[70%_45%]", "scale-[1.48] object-[35%_60%]"][
          mediaIndex % 3
        ]!
      : ["scale-100", "scale-[1.16] object-[50%_42%]", "scale-[1.34] object-[56%_50%]"][
          mediaIndex % 3
        ]!);
  return (
    <div className="relative h-full w-full overflow-hidden bg-secondary px-gloss">
      <img
        src={artworkSource}
        alt=""
        aria-hidden
        className={`h-full w-full object-cover ${cropClass}`}
      />
      <span aria-hidden className="px-edge" />
    </div>
  );
}

function StaticGalleryImage({
  source,
  alt,
  fit = "cover",
}: {
  source: string;
  alt: string;
  fit?: "contain" | "cover";
}) {
  return (
    <div className="h-full w-full bg-secondary">
      <img
        src={source}
        alt={alt}
        className={`block h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
      />
    </div>
  );
}
