import { useState } from "react";
import { Link } from "@tanstack/react-router";
import sizeRoom from "@/assets/size-room.jpg";
import artNorthsea from "@/assets/art-northsea.jpg";
import { sizes } from "@/lib/photox-data";
import { sizeSearchValue } from "@/lib/shop-data";
import { Shell, SectionHead } from "./Section";

const WALL_INCHES = 96;

export function SizeScene() {
  const [i, setI] = useState(3);
  const size = sizes[i] ?? sizes[3]!;
  const widthPct = (size.inches * 1.5 * 100) / WALL_INCHES;

  return (
    <Shell label="Shop by size" className="pb-28 md:pb-40">
      <SectionHead title="Shop by size" note="North Sea · Metal Print" />

      <div className="mt-10 grid gap-8 md:grid-cols-12">
        <div className="relative overflow-hidden bg-secondary md:col-span-8">
          <img
            src={sizeRoom}
            width={1600}
            height={1104}
            loading="lazy"
            alt="A walnut console against a plain wall in daylight, used to show print scale"
            className="h-full w-full object-cover"
          />
          <div
            className="absolute left-1/2 top-[14%] -translate-x-1/2 shadow-[0_10px_24px_-18px_rgba(0,0,0,0.7)] transition-[width] duration-[560ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
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

        <div className="md:col-span-4">
          <p className="px-label text-muted-foreground">Select a size</p>

          <ul className="mt-4 flex gap-3 overflow-x-auto pb-2 md:mt-6 md:block md:gap-0 md:overflow-visible md:border-t md:border-hairline md:pb-0">
            {sizes.map((s, idx) => (
              <li key={s.label} className="shrink-0 md:border-b md:border-hairline">
                <button
                  type="button"
                  onClick={() => setI(idx)}
                  aria-pressed={i === idx}
                  className={[
                    "flex w-full items-baseline justify-between gap-6 whitespace-nowrap border border-hairline px-4 py-3 transition-opacity duration-[420ms] md:border-0 md:px-0",
                    i === idx ? "opacity-100" : "opacity-50 hover:opacity-100",
                  ].join(" ")}
                >
                  <span className="px-label">{s.label}</span>
                  <span className="px-price">${s.price}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="px-rule mt-8 pt-6">
            <p className="px-label">North Sea</p>
            <p className="px-meta mt-1 text-muted-foreground">Metal Print</p>
            <p className="px-meta text-muted-foreground">{size.label}</p>
            <p className="px-price mt-2">${size.price}</p>
            <Link
              to="/shop"
              search={{ size: sizeSearchValue(size.label) }}
              className="px-label px-underline mt-6 inline-block"
            >
              Shop this size →
            </Link>
          </div>
        </div>
      </div>
    </Shell>
  );
}
