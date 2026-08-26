import sizeRoom from "@/assets/size-room.jpg";
import { detailFor } from "@/lib/product-detail";
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
  className = "",
}: {
  product: ShopProduct;
  material: BagMaterial;
  inches: number;
  sizeLabel: string;
  className?: string;
}) {
  const widthPct = (inches * 1.5 * 100) / WALL_INCHES;
  return (
    <div className={["relative h-full w-full overflow-hidden bg-secondary", className].join(" ")}>
      <img
        src={sizeRoom}
        width={1600}
        height={1104}
        loading="lazy"
        alt="A walnut console against a plain wall in daylight, used to show print scale"
        className="block h-full w-full object-cover"
      />
      <div
        className="absolute left-1/2 top-[14%] -translate-x-1/2 shadow-[0_10px_24px_-18px_rgba(0,0,0,0.7)] transition-[width] duration-300 ease-out"
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
  const frame = (active: boolean) =>
    [
      "absolute inset-0 transition-[opacity,transform] duration-300 ease-out",
      active ? "z-10 scale-100 opacity-100" : "pointer-events-none scale-[0.995] opacity-0",
    ].join(" ");

  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
      <div className={frame(view === "artwork")}>
        <PrintFace product={product} material={material} className="h-full w-full" />
      </div>
      <div className={frame(view === "detail")}>
        <div className="relative h-full w-full overflow-hidden bg-secondary">
          <img
            src={detailFor(product, material)}
            alt={`${product.name} as a ${materialName[material].toLowerCase()}, seen at an angle`}
            className="block h-full w-full object-cover"
          />
        </div>
      </div>
      <div className={frame(view === "room")}>
        <RoomScene product={product} material={material} inches={inches} sizeLabel={sizeLabel} />
      </div>
    </div>
  );
}
