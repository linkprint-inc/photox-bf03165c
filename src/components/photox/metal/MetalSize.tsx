import { useState } from "react";
import metalRoom from "@/assets/metal-size-room.jpg";
import { metalSizes, metalById } from "@/lib/metal-data";
import { Shell, SectionHead } from "../Section";

const WALL_INCHES = 108;
const work = metalById("north-sea");

export function MetalSize() {
  const [i, setI] = useState(3);
  const size = metalSizes[i]!;
  const widthPct = (size.inches * 1.5 * 100) / WALL_INCHES;

  const selectSize = (index: number, target: HTMLButtonElement) => {
    setI(index);
    if (window.matchMedia("(max-width: 767px)").matches) {
      target.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    }
  };

  return (
    <Shell id="metal-size" label="Find your size" className="pb-20 md:pb-28">
      <SectionHead title="Find your size" note={`${work.name} · Metal Print`} />

      <div className="mt-8 grid gap-8 md:grid-cols-12">
        <div className="relative min-w-0 overflow-hidden bg-secondary md:col-span-8">
          <img
            src={metalRoom}
            width={1600}
            height={1104}
            loading="lazy"
            alt="A plaster wall with a low dark wood console to one side, used as a fixed reference for print scale"
            className="block h-auto w-full"
          />
          <div
            className="absolute left-[58%] top-[20%] -translate-x-1/2 shadow-[0_10px_24px_-18px_rgba(0,0,0,0.7)] transition-[width] duration-[560ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
            style={{ width: `${widthPct}%` }}
          >
            <img
              src={work.image}
              alt={`${work.name} metal print shown at ${size.label}`}
              loading="lazy"
              className="block w-full"
              style={{ aspectRatio: "3 / 2", objectFit: "cover" }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(104deg, transparent 32%, rgba(255,255,255,0.20) 46%, transparent 62%)",
              }}
            />
          </div>
        </div>

        <div className="min-w-0 md:col-span-4">
          <p className="px-label text-muted-foreground">Select a size</p>

          <ul className="px-scrollbar-hidden mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 md:mt-6 md:block md:snap-none md:gap-0 md:overflow-visible md:border-t md:border-hairline md:pb-0">
            {metalSizes.map((s, idx) => (
              <li
                key={s.label}
                className="w-[42%] shrink-0 snap-start md:w-auto md:border-b md:border-hairline"
              >
                <button
                  type="button"
                  onClick={(event) => selectSize(idx, event.currentTarget)}
                  aria-pressed={i === idx}
                  className={[
                    "flex w-full items-baseline justify-between gap-6 whitespace-nowrap border border-hairline px-4 py-3 transition-opacity duration-[420ms] max-md:gap-3 max-md:border-x-0 max-md:border-t-0 max-md:border-b-2 max-md:border-transparent max-md:px-0 max-md:text-muted-foreground max-md:transition-[border-color,color] md:border-0 md:px-0",
                    i === idx
                      ? "opacity-100 max-md:border-foreground max-md:text-foreground"
                      : "opacity-50 hover:opacity-100 max-md:text-muted-foreground",
                  ].join(" ")}
                >
                  <span className="px-label">{s.label}</span>
                  <span className="px-price">${s.price}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="px-rule mt-8 pt-6">
            <p className="px-label">{work.name}</p>
            <p className="px-meta mt-1 text-muted-foreground">Metal Print</p>
            <p className="px-meta text-muted-foreground">{size.label}</p>
            <p className="px-price mt-2">${size.price}</p>
            <a
              href={`/shop?q=${encodeURIComponent(work.name)}`}
              className="px-label px-underline mt-6 inline-block"
            >
              Shop this size →
            </a>
          </div>
        </div>
      </div>
    </Shell>
  );
}
