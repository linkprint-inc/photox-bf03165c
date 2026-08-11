import { useState } from "react";
import idxMetal from "@/assets/idx-metal.jpg";
import idxCanvas from "@/assets/idx-canvas.jpg";
import idxCustom from "@/assets/idx-custom.jpg";

const entries = [
  {
    n: "01",
    title: "Metal Prints",
    note: "Gloss / luminous / crisp",
    from: 119,
    image: idxMetal,
    alt: "Angled gloss aluminium metal print showing its thin rigid edge and daylight reflection",
    href: "#metal",
  },
  {
    n: "02",
    title: "Frameless Canvas",
    note: "Matte / textured / soft",
    from: 99,
    image: idxCanvas,
    alt: "Macro of a gallery-wrapped canvas corner with visible woven texture",
    href: "#surface",
  },
  {
    n: "03",
    title: "Custom Prints",
    note: "Your image, made physical",
    from: 89,
    image: idxCustom,
    alt: "A small photograph beside the same image finished as a large metal print",
    href: "#custom",
  },
];

export function CommerceIndex() {
  const [active, setActive] = useState(0);

  return (
    <section aria-label="Product index" className="mx-auto max-w-[1600px] px-6 py-20 md:px-10 md:py-28">
      <div className="grid gap-12 md:grid-cols-[1fr_20rem] md:items-start md:gap-16">
        <ul className="px-rule">
          {entries.map((e, i) => (
            <li key={e.n} className="border-b border-hairline">
              <a
                href={e.href}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-7 md:grid-cols-[3.5rem_1fr_1fr_auto] md:gap-8"
              >
                <span className="px-meta text-muted-foreground">{e.n}</span>
                <span
                  className={[
                    "px-serif text-[1.6rem] transition-[opacity,letter-spacing] duration-[480ms] md:text-[2.1rem]",
                    active === i ? "opacity-100" : "opacity-55",
                  ].join(" ")}
                >
                  {e.title}
                </span>
                <span className="px-meta col-span-2 text-muted-foreground md:col-span-1">
                  {e.note}
                </span>
                <span className="px-meta flex items-center gap-6 whitespace-nowrap">
                  From ${e.from}
                  <span className="transition-transform duration-[480ms] group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="relative aspect-[4/5] w-full overflow-hidden bg-secondary">
          {entries.map((e, i) => (
            <img
              key={e.n}
              src={e.image}
              alt={e.alt}
              loading="lazy"
              width={1024}
              height={1280}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[560ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
              style={{ opacity: active === i ? 1 : 0 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
