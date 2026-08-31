import { useState } from "react";
import idxMetal from "@/assets/idx-metal.jpg";
import idxCustom from "@/assets/idx-custom.jpg";
import { Shell } from "./Section";

const entries = [
  {
    n: "01",
    title: "Choose metal",
    note: "Glossy · luminous · crisp",
    from: 79,
    cta: "Explore metal →",
    image: idxMetal,
    alt: "Angled gloss aluminium metal print showing its thin rigid edge and daylight reflection",
    href: "/metal",
  },
  {
    n: "02",
    title: "Start with your photo",
    note: "Your image, made physical",
    from: 79,
    cta: "Create your print →",
    image: idxCustom,
    alt: "A small photograph beside the same image finished as a large metal print",
    href: "/custom",
  },
];

export function CommerceIndex() {
  const [active, setActive] = useState(0);

  return (
    <Shell label="Product index" className="py-20 md:py-28">
      <div className="grid gap-12 md:grid-cols-12 md:items-start md:gap-8">
        <ul className="px-rule md:col-span-8">
          {entries.map((e, i) => (
            <li key={e.n} className="border-b border-hairline">
              <a
                href={e.href}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-2 py-7 md:grid-cols-[3.5rem_minmax(0,1.1fr)_minmax(0,1fr)_6rem_9rem] md:gap-x-8 md:gap-y-0"
              >
                <span className="px-meta text-muted-foreground">{e.n}</span>
                <span
                  className={[
                    "px-serif text-[1.6rem] transition-opacity duration-[480ms] md:text-[2rem]",
                    active === i ? "opacity-100" : "opacity-55",
                  ].join(" ")}
                >
                  {e.title}
                </span>
                <span className="px-meta col-start-2 text-muted-foreground md:col-start-3">
                  {e.note}
                </span>
                <span className="px-price col-start-2 whitespace-nowrap md:col-start-4">
                  <span className="px-label mr-1 opacity-70">From</span>${e.from}
                </span>
                <span className="px-label col-start-2 flex items-center gap-2 whitespace-nowrap md:col-start-5 md:justify-end">
                  {e.cta}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="relative aspect-square w-full overflow-hidden bg-secondary md:col-span-4">
          {entries.map((e, i) => (
            <img
              key={e.n}
              src={e.image}
              alt={e.alt}
              loading="lazy"
              width={1024}
              height={1024}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[560ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
              style={{ opacity: active === i ? 1 : 0 }}
            />
          ))}
        </div>
      </div>
    </Shell>
  );
}
