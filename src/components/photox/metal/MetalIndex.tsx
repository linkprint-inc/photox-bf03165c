import { useState } from "react";
import metalMacro from "@/assets/metal-macro.jpg";
import { Shell } from "../Section";

const attributes = [
  { key: "gloss", title: "Gloss", note: "Luminous surface", origin: "20% 40%" },
  { key: "detail", title: "Detail", note: "Crisp and precise", origin: "45% 55%" },
  { key: "color", title: "Color", note: "Deep and vivid", origin: "30% 75%" },
  { key: "profile", title: "Profile", note: "Thin and rigid", origin: "88% 50%" },
];

export function MetalIndex() {
  const [active, setActive] = useState(0);
  const a = attributes[active]!;

  return (
    <Shell label="Made on metal" className="py-16 md:py-24">
      <h2 className="px-serif text-[2rem] md:text-[2.6rem]">Made on metal.</h2>

      <div className="mt-10 grid gap-8 md:grid-cols-12 md:items-start">
        <ul className="px-rule md:col-span-5">
          {attributes.map((attr, i) => (
            <li key={attr.key} className="border-b border-hairline">
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                className={[
                  "flex w-full items-baseline justify-between gap-6 py-5 text-left transition-opacity duration-[420ms]",
                  active === i ? "opacity-100" : "opacity-50 hover:opacity-100",
                ].join(" ")}
              >
                <span className="px-label">{attr.title}</span>
                <span className="px-meta text-muted-foreground">{attr.note}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary md:col-span-7">
          <img
            src={metalMacro}
            width={1920}
            height={1088}
            loading="lazy"
            alt="Macro sequence across a glossy metal print: reflective surface, fine detail, deep colour and the thin rigid edge"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[720ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
            style={{ transform: "scale(1.14)", transformOrigin: a.origin }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 transition-opacity duration-[620ms]"
            style={{
              background: `radial-gradient(38% 46% at ${a.origin}, transparent 0%, rgba(255,255,255,0.55) 100%)`,
              opacity: 0.5,
            }}
          />
          <p className="px-label absolute bottom-4 left-4 text-foreground/70">{a.title}</p>
        </div>
      </div>
    </Shell>
  );
}
