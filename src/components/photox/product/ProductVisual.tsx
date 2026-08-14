import sizeRoom from "@/assets/size-room.jpg";
import { detailView } from "@/lib/product-detail";
import { materialName, type BagMaterial } from "@/lib/store";
import type { ShopProduct } from "@/lib/shop-data";

export type ViewMode = "artwork" | "detail" | "room";

const WALL_INCHES = 96;

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
  const isMetal = material === "metal";
  return (
    <div
      className={[
        "relative overflow-hidden bg-secondary",
        isMetal ? "px-gloss" : "px-weave",
        className,
      ].join(" ")}
    >
      <img
        src={product.image}
        alt={`${product.name} as a ${materialName[material].toLowerCase()}`}
        className="block h-full w-full object-cover"
      />
      <span aria-hidden className={isMetal ? "px-edge" : "px-canvas-edge"} />
    </div>
  );
}

/** One fixed interior; only the artwork changes physical scale. */
export function RoomScene({
  product,
  material,
  inches,
  sizeLabel,
}: {
  product: ShopProduct;
  material: BagMaterial;
  inches: number;
  sizeLabel: string;
}) {
  const widthPct = (inches * 1.5 * 100) / WALL_INCHES;
  return (
    <div className="relative overflow-hidden bg-secondary">
      <img
        src={sizeRoom}
        width={1600}
        height={1104}
        loading="lazy"
        alt="A walnut console against a plain wall in daylight, used to show print scale"
        className="block h-full w-full object-cover"
      />
      <div
        className="absolute left-1/2 top-[14%] -translate-x-1/2 shadow-[0_10px_24px_-18px_rgba(0,0,0,0.7)] transition-[width] duration-[560ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
        style={{ width: `${widthPct}%` }}
      >
        <img
          src={product.image}
          alt={`${product.name} shown on a wall at ${sizeLabel}`}
          loading="lazy"
          className="block w-full"
          style={{ aspectRatio: "3 / 2", objectFit: "cover" }}
        />
        {material === "metal" ? (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(108deg, transparent 34%, rgba(255,255,255,0.18) 46%, transparent 62%)",
            }}
          />
        ) : null}
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
}: {
  product: ShopProduct;
  material: BagMaterial;
  view: ViewMode;
  inches: number;
  sizeLabel: string;
}) {
  if (view === "room") {
    return (
      <RoomScene product={product} material={material} inches={inches} sizeLabel={sizeLabel} />
    );
  }

  if (view === "detail") {
    return (
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <img
          src={detailView[material]}
          alt={`Three-quarter physical view of a ${materialName[material].toLowerCase()}`}
          className="block h-full w-full object-cover"
        />
      </div>
    );
  }

  return <PrintFace product={product} material={material} className="aspect-[4/3]" />;
}
