import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
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
  const heartRef = useRef<HTMLButtonElement | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);
  const lastFrame = useRef(0);
  const finePointer = useRef(false);
  const reducedMotion = useRef(false);
  const magnetAttachedRef = useRef(false);
  const [cursorOn, setCursorOn] = useState(false);
  const [magnetStrength, setMagnetStrength] = useState(0);
  const [magnetAttached, setMagnetAttached] = useState(false);

  const loop = useCallback((time: number) => {
    const el = cursorRef.current;
    if (el) {
      const delta = Math.min((time - lastFrame.current) / 1000 || 1 / 60, 0.05);
      const followRate = magnetAttachedRef.current ? 15 : 13;
      const easing = 1 - Math.exp(-followRate * delta);
      pos.current.x += (target.current.x - pos.current.x) * easing;
      pos.current.y += (target.current.y - pos.current.y) * easing;
      el.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
    }
    lastFrame.current = time;
    raf.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    if (!cursorOn) return;
    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [cursorOn, loop]);

  const updateCursor = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!finePointer.current) return;

    const imageBounds = event.currentTarget.getBoundingClientRect();
    const pointer = { x: event.clientX - imageBounds.left, y: event.clientY - imageBounds.top };
    const heartBounds = heartRef.current?.getBoundingClientRect();

    if (!heartBounds) {
      target.current = pointer;
      return;
    }

    const heart = {
      x: heartBounds.left + heartBounds.width / 2 - imageBounds.left,
      y: heartBounds.top + heartBounds.height / 2 - imageBounds.top,
    };
    const distance = Math.hypot(pointer.x - heart.x, pointer.y - heart.y);
    const radius = 58;
    const attachRadius = 22;
    const attached = distance <= attachRadius;
    const proximity = Math.max(0, Math.min(1, (radius - distance) / (radius - attachRadius)));
    const strength = proximity * (2 - proximity);

    magnetAttachedRef.current = attached;
    setMagnetAttached(attached);
    setMagnetStrength(strength);

    if (reducedMotion.current && attached) {
      pos.current = heart;
      target.current = heart;
      return;
    }

    target.current = {
      x: pointer.x + (heart.x - pointer.x) * strength,
      y: pointer.y + (heart.y - pointer.y) * strength,
    };
  }, []);

  return (
    <article className="group">
      <a href={link} className="block" aria-label={`${product.name} — view artwork`}>
        <div
          onPointerEnter={(e) => {
            finePointer.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
            reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            if (!finePointer.current) return;
            const r = e.currentTarget.getBoundingClientRect();
            pos.current = { x: e.clientX - r.left, y: e.clientY - r.top };
            target.current = { ...pos.current };
            lastFrame.current = performance.now();
            setCursorOn(true);
            if (cursorRef.current) cursorRef.current.style.opacity = "1";
            updateCursor(e);
          }}
          onPointerMove={updateCursor}
          onPointerLeave={() => {
            finePointer.current = false;
            magnetAttachedRef.current = false;
            setCursorOn(false);
            setMagnetAttached(false);
            setMagnetStrength(0);
            if (cursorRef.current) cursorRef.current.style.opacity = "0";
          }}
          onClick={(e) => {
            if (!magnetAttachedRef.current) return;
            e.preventDefault();
            e.stopPropagation();
            toggleSaved(product.id);
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

          <button
            ref={heartRef}
            type="button"
            aria-label={action === "remove" ? "Remove from saved" : saved ? "Saved" : "Save"}
            aria-pressed={saved}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleSaved(product.id);
            }}
            className={[
              "absolute right-2 top-2 z-30 flex h-9 w-9 cursor-pointer items-center justify-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] transition-[opacity,color,transform] duration-[160ms] md:cursor-none hover:opacity-100",
              magnetAttached ? "scale-[1.08] text-foreground !opacity-100" : "text-white",
              saved ? "opacity-90" : "opacity-45 lg:opacity-0 lg:group-hover:opacity-70",
            ].join(" ")}
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

          <div
            aria-hidden
            ref={cursorRef}
            className={[
              "pointer-events-none absolute left-0 top-0 z-20 hidden items-center justify-center rounded-full bg-white/90 text-foreground md:flex",
              "transition-[transform,opacity,width,height] duration-[180ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]",
              cursorOn ? "scale-100 opacity-100" : "scale-75 opacity-0",
            ].join(" ")}
            style={{
              width: magnetAttached ? 46 : 52,
              height: magnetAttached ? 46 : 52,
              willChange: "transform, opacity, width, height",
            }}
          >
            <ArrowUpRight
              size={21}
              strokeWidth={1.6}
              className="m-0 p-0 transition-opacity duration-[160ms]"
              style={{ opacity: 1 - magnetStrength }}
            />
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
          className="px-reveal mt-2 hidden gap-x-3 gap-y-1 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 md:flex md:flex-wrap"
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
