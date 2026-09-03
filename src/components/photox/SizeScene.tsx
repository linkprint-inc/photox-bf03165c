import { useState } from "react";
import sizeRoom from "@/assets/size-room.jpg";
import artNorthsea from "@/assets/art-northsea.jpg";
import { sizes } from "@/lib/photox-data";
import { Shell, SectionHead } from "./Section";

const WALL_INCHES = 96;

export function SizeScene() {
  const [i, setI] = useState(3);
  const size = sizes[i] ?? sizes[3]!;
  const widthPct = (size.inches * 1.5 * 100) / WALL_INCHES;

  return (
    <Shell label="Choose a size" className="pb-28 md:pb-40">
      <SectionHead title="Choose a size" note="See your photo at home." />

      <div className="mt-6 grid gap-8 xl:mt-10 xl:grid-cols-12">
        <div className="relative aspect-[5/4] w-full overflow-hidden bg-secondary md:aspect-[4/3] xl:col-span-8 xl:aspect-auto">
          <img
            src={sizeRoom}
            width={1600}
            height={1104}
            loading="lazy"
            alt="A walnut console against a plain wall in daylight, used to show print scale"
            className="h-full w-full object-cover object-[61%_58%] md:object-center"
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

        <div className="min-w-0 xl:col-span-4">
          <p className="px-label text-muted-foreground">Select a size</p>

          <ul className="mt-4 w-full max-w-full min-w-0 border-t border-hairline md:grid md:grid-cols-5 md:gap-x-3 xl:mt-6 xl:block">
            {sizes.map((s, idx) => (
              <li key={s.label} className="border-b border-hairline md:border-b-0 xl:border-b">
                <button
                  type="button"
                  onClick={() => setI(idx)}
                  aria-pressed={i === idx}
                  className={[
                    "flex h-14 w-full items-center justify-between gap-3 whitespace-nowrap px-0 transition-colors duration-[420ms] md:h-auto md:items-baseline md:py-3",
                    i === idx
                      ? "font-medium text-foreground"
                      : "text-muted-foreground opacity-70 hover:opacity-100",
                  ].join(" ")}
                >
                  <span className="px-label">{s.label}</span>
                  <span className="px-price">${s.price}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-7 xl:px-rule xl:mt-8 xl:pt-6">
            <p className="px-label">North Sea</p>
            <p className="px-meta mt-1 text-muted-foreground">Metal Print</p>
            <p className="px-meta text-muted-foreground">{size.label}</p>
            <p className="px-price mt-2">${size.price}</p>
            <a
              href="/products/north-sea"
              className="px-label px-underline mt-5 inline-block xl:mt-6"
            >
              Create your print →
            </a>
          </div>
        </div>
      </div>
    </Shell>
  );
}
