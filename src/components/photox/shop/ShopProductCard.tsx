import { useState } from "react";
import {
  materialLabel,
  angleView,
  sizeRangeLong,
  sizeRangeShort,
  sizeSteps,
  type ShopProduct,
} from "@/lib/shop-data";

export function ShopProductCard({
  product,
  view,
}: {
  product: ShopProduct;
  view: "grid" | "room";
}) {
  const [size, setSize] = useState<number | null>(null);
  const isMetal = product.material !== "canvas";
  const primary = view === "room" ? product.room : product.image;
  const secondary = view === "room" ? product.image : angleView[product.material];
  const price = size !== null ? sizeSteps[size]!.price : product.from;

  return (
    <article className="group">
      <a href="#" className="block" aria-label={`${product.name} — view artwork`}>
        <div
          className={[
            "relative aspect-square w-full overflow-hidden bg-secondary",
            isMetal ? "px-gloss" : "px-weave",
            "group-hover:after:opacity-100 group-focus-within:after:opacity-100",
          ].join(" ")}
        >
          <img
            src={primary}
            alt={`${product.name} — ${materialLabel[product.material]}${
              view === "room" ? " installed in an interior" : ""
            }`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[560ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:opacity-0 group-focus-within:opacity-0"
          />
          <img
            src={secondary}
            alt={`${product.name} shown as a physical ${materialLabel[product.material].toLowerCase()}`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-[560ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:opacity-100 group-focus-within:opacity-100"
          />
          <span
            aria-hidden
            className={[
              isMetal ? "px-edge" : "px-canvas-edge",
              "group-hover:w-[6px] group-focus-within:w-[6px]",
            ].join(" ")}
          />

          <div className="px-reveal pointer-events-none absolute inset-x-0 bottom-0 hidden items-end justify-between p-3 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 md:flex">
            <span className="px-label bg-paper/90 px-2 py-1">View artwork →</span>
            <span className="px-label bg-paper/90 px-2 py-1">♡ Save</span>
          </div>
        </div>
      </a>

      <div className="mt-4">
        <h3 className="px-label">
          <a href="#" className="px-underline">
            {product.name}
          </a>
        </h3>
        <p className="px-meta mt-1 text-muted-foreground">{materialLabel[product.material]}</p>
        <p className="px-meta text-muted-foreground">
          <span className="hidden sm:inline">{sizeRangeLong}</span>
          <span className="sm:hidden">{sizeRangeShort}</span>
        </p>
        <p className="px-price mt-2">
          {size === null ? <span className="px-label mr-1 opacity-70">From</span> : null}${price}
          {size !== null ? (
            <span className="px-meta ml-2 text-muted-foreground">{sizeSteps[size]!.label}</span>
          ) : null}
        </p>

        <ul
          className="px-reveal mt-2 hidden gap-3 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 md:flex"
          onMouseLeave={() => setSize(null)}
        >
          {sizeSteps.map((s, i) => (
            <li key={s.label}>
              <button
                type="button"
                onMouseEnter={() => setSize(i)}
                onFocus={() => setSize(i)}
                aria-label={`${s.label} — $${s.price}`}
                className={[
                  "px-meta transition-opacity duration-300",
                  size === i ? "opacity-100" : "opacity-45 hover:opacity-100",
                ].join(" ")}
              >
                {s.label.replace(/\s/g, "").replace("×", "×")}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
