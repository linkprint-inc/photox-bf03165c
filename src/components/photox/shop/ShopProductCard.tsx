import { useCallback, useEffect, useRef, useState } from "react";
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

  const cursorRef = useRef<HTMLDivElement | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);
  const [cursorOn, setCursorOn] = useState(false);

  const loop = useCallback(() => {
    const el = cursorRef.current;
    if (el) {
      pos.current.x += (target.current.x - pos.current.x) * 0.18;
      pos.current.y += (target.current.y - pos.current.y) * 0.18;
      el.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
    }
    raf.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    if (!cursorOn) return;
    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [cursorOn, loop]);

  return (
    <article className="group">
      <a href={link} className="block" aria-label={`${product.name} — view artwork`}>
        <div
          onMouseEnter={(e) => {
            if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
            const r = e.currentTarget.getBoundingClientRect();
            pos.current = { x: e.clientX - r.left, y: e.clientY - r.top };
            target.current = { ...pos.current };
            setCursorOn(true);
            if (cursorRef.current) cursorRef.current.style.opacity = "1";
          }}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            target.current = { x: e.clientX - r.left, y: e.clientY - r.top };
          }}
          onMouseLeave={() => {
            setCursorOn(false);
            if (cursorRef.current) cursorRef.current.style.opacity = "0";
          }}
          className={[
            "relative aspect-square w-full overflow-hidden bg-secondary md:cursor-none",
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
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[380ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:opacity-0 group-focus-within:opacity-0"
          />
          <img
            src={secondary}
            alt={`${product.name} shown as a physical ${materialLabel[product.material].toLowerCase()}`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-[380ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:opacity-100 group-focus-within:opacity-100"
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
            className={["absolute right-2 top-2 z-30 flex h-9 w-9 cursor-pointer items-center justify-center text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] transition-opacity duration-300 hover:opacity-100", saved ? "opacity-90" : "opacity-45 md:opacity-0 md:group-hover:opacity-70"].join(" ")}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={saved && action !== "remove" ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
            </svg>
          </button>

          {/* Desktop: follow-cursor VIEW label */}
          <div
            aria-hidden
            ref={cursorRef}
            className="pointer-events-none absolute left-0 top-0 z-20 hidden h-[56px] w-[56px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background text-[0.62rem] font-medium uppercase tracking-[0.12em] text-foreground opacity-0 transition-opacity duration-300 md:flex"
            style={{ willChange: "transform, opacity" }}
          >
            View
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
