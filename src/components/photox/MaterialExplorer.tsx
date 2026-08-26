import { useState } from "react";
import materialMetal from "@/assets/material-metal.jpg";
import materialCanvas from "@/assets/material-canvas.jpg";
import { sizeList } from "@/lib/photox-data";

const surfaces = {
  METAL: {
    image: materialMetal,
    alt: "Macro of a gloss aluminium print surface catching directional light",
    lines: ["Gloss finish", "Crisp detail", "Rich colour"],
    from: 79,
    cta: "Create your print →",
  },
  CANVAS: {
    image: materialCanvas,
    alt: "Macro of a matte gallery-wrapped canvas showing woven texture and wrapped edge",
    lines: ["Matte woven finish", "Soft texture", "Gallery-wrapped edge"],
    from: 69,
    cta: "Create your print →",
  },
} as const;

const details = [
  {
    label: "Finish",
    body: "Metal is printed onto coated aluminium with a high-gloss seal. Canvas is a matte poly-cotton weave with a protective satin coat.",
  },
  {
    label: "Edge",
    body: "Metal sits 15mm off the wall on a hidden aluminium subframe. Canvas is stretched over a 38mm kiln-dried bar, image wrapped around the sides.",
  },
  {
    label: "Detail",
    body: "Metal holds fine detail and deep blacks. Canvas softens micro-detail slightly and diffuses reflections, which suits painterly work.",
  },
  {
    label: "Care",
    body: "Wipe metal with a dry microfibre cloth. Dust canvas lightly. Keep both out of continuous direct sunlight.",
  },
];

export function MaterialExplorer() {
  const [surface, setSurface] = useState<keyof typeof surfaces>("METAL");
  const [open, setOpen] = useState<string | null>(null);
  const s = surfaces[surface];

  return (
    <section id="surface" className="bg-ink text-paper">
      <div className="mx-auto max-w-[1440px] px-6 py-24 md:px-10 md:py-36">
        <h2 className="px-serif max-w-[14ch] text-[2.4rem] md:text-[3.4rem]">
          Choose your surface.
        </h2>

        <div className="mt-12 flex gap-10">
          {(Object.keys(surfaces) as Array<keyof typeof surfaces>).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setSurface(key)}
              aria-pressed={surface === key}
              className={[
                "px-label px-underline transition-opacity duration-[420ms]",
                surface === key ? "opacity-100" : "opacity-40 hover:opacity-80",
              ].join(" ")}
            >
              {key}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40 md:col-span-7">
            {(Object.keys(surfaces) as Array<keyof typeof surfaces>).map((key) => (
              <img
                key={key}
                src={surfaces[key].image}
                alt={surfaces[key].alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[560ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
                style={{ opacity: surface === key ? 1 : 0 }}
              />
            ))}
          </div>

          <div className="md:col-span-5">
            <p className="px-label">{surface}</p>
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
              <a href="/custom" className="px-label px-underline">
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
