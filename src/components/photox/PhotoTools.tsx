import { useState } from "react";
import artRain from "@/assets/art-rain.jpg";
import artBrutal from "@/assets/art-brutal.jpg";
import artFigure from "@/assets/art-figure.jpg";

const tools = [
  {
    label: "Restore old photo",
    body: "Repair fading, scratches and age-related damage before printing.",
    image: artFigure,
    alt: "A restored portrait prepared for printing",
  },
  {
    label: "Enhance resolution",
    body: "Prepare smaller images for larger print sizes.",
    image: artBrutal,
    alt: "A detailed architectural image prepared for a large print",
  },
  {
    label: "Add text",
    body: "Add a date, name, caption or personal message.",
    image: artRain,
    alt: "A photograph with a small caption added",
  },
];

export function PhotoTools() {
  const [open, setOpen] = useState<string | null>(tools[0]!.label);
  const active = tools.find((t) => t.label === open);

  return (
    <section id="tools" className="mx-auto max-w-[1600px] px-6 pb-28 md:px-10 md:pb-36">
      <div className="px-rule grid gap-10 pt-8 md:grid-cols-[1fr_16rem] md:gap-16">
        <div>
          <h2 className="px-label">Before you print</h2>
          <p className="px-meta mt-3 text-muted-foreground">
            Need a little help with your image?
          </p>

          <ul className="mt-10 border-t border-hairline">
            {tools.map((t) => {
              const isOpen = open === t.label;
              return (
                <li key={t.label} className="border-b border-hairline">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : t.label)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between py-5 text-left transition-opacity duration-[420ms] hover:opacity-60"
                  >
                    <span className="px-label">{t.label}</span>
                    <span className="px-meta">{isOpen ? "–" : "+"}</span>
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-[480ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-meta max-w-[52ch] pb-6 text-muted-foreground">{t.body}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="hidden aspect-[4/5] w-full overflow-hidden bg-secondary md:block">
          {active && (
            <img
              src={active.image}
              alt={active.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-opacity duration-[520ms]"
            />
          )}
        </div>
      </div>
    </section>
  );
}
