import { canvasFrom, metalFrom } from "@/lib/metal-data";
import { Shell } from "../Section";

const columns = [
  {
    title: "Metal",
    qualities: ["Glossy", "Crisp", "Luminous", "Rigid", "Modern"],
    best: "Photography, vivid color, high-detail artwork",
    from: metalFrom,
    cta: { label: "Shop metal →", href: "#metal-shop" },
  },
  {
    title: "Frameless Canvas",
    qualities: ["Matte", "Textured", "Soft", "Tactile", "Gallery-wrapped"],
    best: "Portraits, painterly artwork, softer interiors",
    from: canvasFrom,
    cta: { label: "Explore canvas in shop →", href: "/shop?q=canvas" },
  },
];

export function MetalCompare() {
  return (
    <Shell label="Metal or canvas" className="pb-20 md:pb-28">
      <h2 className="px-serif text-[2rem] md:text-[2.6rem]">Metal or canvas?</h2>

      <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-8">
        {columns.map((c) => (
          <div key={c.title} className="px-rule pt-6">
            <p className="px-label">{c.title}</p>
            <ul className="mt-5">
              {c.qualities.map((q) => (
                <li key={q} className="px-meta border-b border-hairline py-3 text-muted-foreground">
                  {q}
                </li>
              ))}
            </ul>
            <p className="px-meta mt-6 max-w-[40ch] text-muted-foreground">
              <span className="px-label mr-2 text-foreground">Best for</span>
              {c.best}
            </p>
            <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
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
