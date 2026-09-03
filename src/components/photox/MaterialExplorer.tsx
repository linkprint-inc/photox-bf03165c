import { useState } from "react";
import materialMetal from "@/assets/material-metal.jpg";
import { sizeList } from "@/lib/photox-data";

const metal = {
  image: materialMetal,
  alt: "Macro of a gloss aluminium print surface catching directional light",
  lines: ["Gloss finish", "Crisp detail", "Rich colour"],
  from: 79,
  cta: "Create your print →",
} as const;

const details = [
  {
    label: "Finish",
    body: "Metal is printed onto coated aluminium with a high-gloss seal.",
  },
  {
    label: "Edge",
    body: "Metal sits 15mm off the wall on a hidden aluminium subframe.",
  },
  {
    label: "Detail",
    body: "Metal holds fine detail and deep blacks.",
  },
  {
    label: "Care",
    body: "Wipe metal with a dry microfibre cloth and keep it out of continuous direct sunlight.",
  },
];

export function MaterialExplorer() {
  const [open, setOpen] = useState<string | null>(null);
  const s = metal;

  return (
    <section id="surface" className="bg-ink text-paper">
      <div className="mx-auto max-w-[1440px] px-6 py-24 md:px-10 md:py-36">
        <h2 className="px-serif max-w-[14ch] text-[2.4rem] md:text-[3.4rem]">The Metal Print.</h2>

        <div className="mt-12 grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40 md:col-span-7">
            <img
              src={s.image}
              alt={s.alt}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div className="md:col-span-5">
            <p className="px-label">Metal Print</p>
            <ul className="mt-5 space-y-2">
              {s.lines.map((l) => (
                <li key={l} className="px-meta opacity-80">
                  {l}
                </li>
              ))}
            </ul>

            <p className="px-label mt-8 opacity-60">Available sizes</p>
            <p className="px-meta mt-2 opacity-85">{sizeList.join(" / ")}</p>

            <div className="mt-8 flex items-baseline justify-between gap-6">
              <p className="px-price">
                <span className="px-label mr-1 opacity-70">From</span>${s.from}
              </p>
              <a href="/products/north-sea" className="px-label px-underline">
                {s.cta}
              </a>
            </div>

            <ul className="mt-12 border-t border-paper/20">
              {details.map((d) => {
                const isOpen = open === d.label;
                return (
                  <li key={d.label} className="border-b border-paper/20">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : d.label)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between py-4 text-left"
                    >
                      <span className="px-label">{d.label}</span>
                      <span className="px-meta">{isOpen ? "–" : "+"}</span>
                    </button>
                    <div
                      className="grid transition-[grid-template-rows] duration-[480ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
                      style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <p className="px-meta max-w-[46ch] pb-5 opacity-75">{d.body}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
