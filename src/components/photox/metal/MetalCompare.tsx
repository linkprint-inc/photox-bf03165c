import { canvasFrom, metalFrom } from "@/lib/metal-data";
import { Shell } from "../Section";

const columns = [
  {
    title: "Metal",
    qualities: ["Glossy", "Luminous", "Crisp", "Rigid"],
    best: "Photography, vivid color, high-detail artwork",
    from: metalFrom,
    cta: { label: "Create your print →", href: "/custom" },
  },
  {
    title: "Frameless Canvas",
    qualities: ["Matte", "Textured", "Soft", "Tactile"],
    best: "Portraits, painterly artwork, softer interiors",
    from: canvasFrom,
    cta: { label: "Create your print →", href: "/custom" },
  },
];

export function MetalCompare() {
  return (
    <Shell label="Metal or canvas" className="pb-16 md:pb-20">
      <h2 className="px-serif text-[2rem] md:text-[2.6rem]">Metal or canvas?</h2>

      <div className="mt-8 grid gap-12 md:grid-cols-2 md:gap-16">
        {columns.map((c) => (
          <div key={c.title} className="px-rule pt-6">
            <p className="px-label">{c.title}</p>
            <p className="px-serif mt-5 text-[1.5rem] leading-[1.5] md:text-[1.75rem]">
              {c.qualities.join(" · ")}
            </p>
            <p className="px-meta mt-8 max-w-[40ch] text-muted-foreground">
              <span className="px-label mr-2 text-foreground">Best for</span>
              {c.best}
            </p>
            <div className="mt-10 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
              <p className="px-price">
                <span className="px-label mr-1 opacity-70">From</span>${c.from}
              </p>
              <a href={c.cta.href} className="px-label px-underline">
                {c.cta.label}
              </a>
            </div>
          </div>
        ))}
      </div>
    </Shell>
  );
}
