import { useState } from "react";
import sizeRoom from "@/assets/size-room.jpg";
import artNorthsea from "@/assets/art-northsea.jpg";
import { sizes } from "@/lib/photox-data";

const WALL_INCHES = 108;

export function SizeScene() {
  const [i, setI] = useState(3);
  const size = sizes[i] ?? sizes[3]!;
  const widthPct = (size.inches * 1.5 * 100) / WALL_INCHES;


  return (
    <section aria-label="Shop by size" className="mx-auto max-w-[1600px] px-6 pb-28 md:px-10 md:pb-40">
      <div className="px-rule flex flex-wrap items-baseline justify-between gap-4 pt-8">
        <h2 className="px-label">Select size</h2>
        <p className="px-meta text-muted-foreground">North Sea · Metal Print</p>
      </div>

      <div className="relative mt-10 overflow-hidden bg-secondary">
        <img
          src={sizeRoom}
          width={1600}
          height={1104}
          loading="lazy"
          alt="A walnut console against a plain wall in daylight, used to show print scale"
          className="h-full w-full object-cover"
        />
        <div
          className="absolute left-1/2 top-[16%] -translate-x-1/2 shadow-[0_10px_24px_-18px_rgba(0,0,0,0.7)] transition-[width] duration-[560ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
          style={{ width: `${widthPct}%` }}
        >
          <img
            src={artNorthsea}
            alt={`North Sea metal print shown at ${size.label}`}
            loading="lazy"
            className="block w-full"
            style={{ aspectRatio: "3 / 2", objectFit: "cover" }}
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

      <div className="mt-8 flex flex-wrap items-baseline justify-between gap-x-10 gap-y-6">
        <ul className="flex flex-wrap gap-x-7 gap-y-3">
          {sizes.map((s, idx) => (
            <li key={s.label}>
              <button
                type="button"
                onMouseEnter={() => setI(idx)}
                onFocus={() => setI(idx)}
                onClick={() => setI(idx)}
                aria-pressed={i === idx}
                className={[
                  "px-label px-underline transition-opacity duration-[420ms]",
                  i === idx ? "opacity-100" : "opacity-45 hover:opacity-100",
                ].join(" ")}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-baseline gap-8">
          <p className="px-meta">
            {size.label} · <span className="text-[0.95rem]">${size.price}</span>
          </p>
          <a href="#shop" className="px-label px-underline">
            Shop this size →
          </a>
        </div>
      </div>
    </section>
  );
}
