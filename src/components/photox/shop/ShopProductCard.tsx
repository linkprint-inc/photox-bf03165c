import { useState } from "react";
import {
  materialLabel,
  angleView,
  sizeRangeLong,
  sizeRangeShort,
  sizeSteps,
  type ShopProduct,
} from "@/lib/shop-data";
import { useStore } from "@/lib/store";

export function ShopProductCard({
  product,
  view,
  action = "save",
  href,
}: {
  product: ShopProduct;
  view: "grid" | "room";
  action?: "save" | "remove";
  href?: string;
}) {
  const link = href ?? `/products/${product.id}`;
  const [size, setSize] = useState<number | null>(null);
  const { isSaved, toggleSaved, hydrated, addToBag } = useStore();
  const saved = hydrated && isSaved(product.id);
  const isMetal = product.material !== "canvas";
  const primary = view === "room" ? product.room : product.image;
  const secondary = view === "room" ? product.image : angleView[product.material];
  const price = size !== null ? sizeSteps[size]!.price : product.from;

  return (
    <article className="group">
      <a href={link} className="block" aria-label={`${product.name} — view artwork`}>
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

          {/* Mobile: small standalone heart in lower-right */}
          <button
            type="button"
            aria-label={action === "remove" ? "Remove from saved" : saved ? "Saved" : "Save"}
            aria-pressed={saved}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleSaved(product.id);
            }}
            className="absolute bottom-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center text-foreground/80 transition-colors hover:text-foreground md:hidden"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={saved ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
            </svg>
          </button>

          {/* Desktop: minimal actions embedded in the photography */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-28 bg-gradient-to-t from-black/28 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 md:block"
          />
          <div className="pointer-events-none absolute inset-x-5 bottom-5 z-10 hidden items-center justify-between md:flex">
            <span className="px-reveal flex items-center whitespace-nowrap text-[0.75rem] font-medium uppercase tracking-[0.08em] text-white duration-[260ms] group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
              View
              <svg
                className="ml-1.5 transition-transform duration-300 ease-out group-hover:translate-x-[3px]"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              >
                <path d="M1 7h11M8 3l4 4-4 4" />
              </svg>
            </span>
            <button
              type="button"
              aria-label={action === "remove" ? "Remove from saved" : saved ? "Saved" : "Save"}
              aria-pressed={saved}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSaved(product.id);
              }}
              className="px-reveal pointer-events-auto text-white duration-[260ms] group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
            >
              <svg
                className="transition-all duration-300 hover:fill-white"
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill={saved && action === "save" ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
              </svg>
            </button>
          </div>

        </div>
      </a>

      <div className="mt-4">
        <h3 className="px-label">
          <a href={link} className="px-underline">
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
                onClick={() =>
                  addToBag({
                    productId: product.id,
                    material: product.material === "canvas" ? "canvas" : "metal",
                    sizeIndex: i,
                    qty: 1,
                  })
                }
                aria-label={`Add ${product.name} ${s.label} to bag — $${s.price}`}
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
