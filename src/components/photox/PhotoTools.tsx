import { useState } from "react";
import { Shell } from "./Section";
import customOriginal from "@/assets/custom-original.jpg";
import customPrint from "@/assets/custom-print.jpg";

const tools = [
  {
    label: "Restore old photo",
    body: "Repair fading, scratches and age-related damage before printing.",
  },
  {
    label: "Enhance resolution",
    body: "Prepare smaller images for larger print sizes while preserving detail.",
  },
  {
    label: "Add text",
    body: "Add a name, date, caption or personal message before printing.",
  },
];

export function PhotoTools() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <Shell id="tools" className="pb-28 md:pb-36">
      <div className="px-rule grid gap-y-3 pt-6 md:grid-cols-12 md:items-baseline">
        <h2 className="px-serif text-[1.9rem] leading-[1.1] md:col-span-5 md:text-[2.4rem]">
          Before you print
        </h2>
        <p className="px-meta max-w-[46ch] text-muted-foreground md:col-span-6 md:col-start-7">
          Need a little help with your image? Prepare it before turning it into wall art.
        </p>
      </div>

      <ul className="mt-10 border-t border-hairline">
        {tools.map((t) => {
          const isOpen = open === t.label;
          return (
            <li key={t.label} className="border-b border-hairline">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : t.label)}
                aria-expanded={isOpen}
                className="group flex w-full items-center justify-between gap-6 py-7 text-left md:py-9"
              >
                <span
                  className={[
                    "px-label text-[0.95rem] tracking-[0.14em] transition-colors duration-[420ms] md:text-[1.05rem]",
                    isOpen ? "text-foreground" : "text-foreground/70 group-hover:text-foreground",
                  ].join(" ")}
                >
                  {t.label}
                </span>
                <span
                  aria-hidden
                  className={[
                    "shrink-0 text-[1.15rem] leading-none transition-transform duration-[420ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]",
                    isOpen
                      ? "rotate-45 text-foreground"
                      : "text-foreground/50 group-hover:text-foreground",
                  ].join(" ")}
                >
                  +
                </span>
              </button>

              <div
                className="grid transition-[grid-template-rows] duration-[480ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <div className="grid gap-6 pb-8 md:grid-cols-12 md:items-start">
                    <p className="px-meta max-w-[52ch] text-muted-foreground md:col-span-6">
                      {t.body}
                    </p>
                    <div className="flex items-center gap-3 md:col-span-4 md:col-start-9 md:justify-end">
                      <figure className="w-[92px]">
                        <img
                          src={customOriginal}
                          alt=""
                          loading="lazy"
                          className="aspect-square w-full object-cover"
                        />
                        <figcaption className="px-meta mt-2 text-muted-foreground">Before</figcaption>
                      </figure>
                      <figure className="w-[92px]">
                        <img
                          src={customPrint}
                          alt=""
                          loading="lazy"
                          className="aspect-square w-full object-cover"
                        />
                        <figcaption className="px-meta mt-2 text-muted-foreground">After</figcaption>
                      </figure>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Shell>
  );
}
