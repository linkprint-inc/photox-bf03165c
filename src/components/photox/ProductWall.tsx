import { useState } from "react";
import { filterMap, filters, products, type Product } from "@/lib/photox-data";

function ProductCell({ product, className }: { product: Product; className?: string }) {
  const isMetal = product.material === "Metal Print";

  return (
    <article className={className}>
      <a href={`#shop`} className="group block">
        <div
          className={[
            "relative w-full overflow-hidden bg-secondary",
            isMetal ? "px-gloss" : "px-weave",
            "group-hover:after:opacity-100 group-focus-visible:after:opacity-100",
          ].join(" ")}
          style={{ aspectRatio: product.ratio }}
        >
          <img
            src={product.image}
            alt={`${product.name} — ${product.material}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[620ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.012]"
          />
          <span
            aria-hidden
            className={[
              isMetal ? "px-edge" : "px-canvas-edge",
              "group-hover:w-[7px] group-focus-visible:w-[7px]",
            ].join(" ")}
          />
          <span className="px-label absolute bottom-3 right-4 text-white mix-blend-difference px-reveal group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100">
            View artwork →
          </span>
        </div>

        <div className="mt-3 flex items-baseline justify-between gap-4">
          <div>
            <h3 className="px-label">{product.name}</h3>
            <p className="px-meta text-muted-foreground">{product.material}</p>
          </div>
          <p className="px-meta whitespace-nowrap">From ${product.from}</p>
        </div>
      </a>
    </article>
  );
}

export function ProductWall() {
  const [active, setActive] = useState<string>("All");
  const tag = filterMap[active];
  const shown = tag ? products.filter((p) => p.tags.includes(tag)) : products;

  const spanFor = (p: Product) => {
    if (p.span === "feature") return "md:col-span-6";
    if (p.span === "wide") return "md:col-span-4";
    if (p.span === "square") return "md:col-span-3";
    return "md:col-span-3";
  };

  return (
    <section id="shop" className="mx-auto max-w-[1600px] px-6 pb-24 md:px-10 md:pb-32">
      <div className="px-rule flex flex-wrap items-baseline justify-between gap-6 pt-8">
        <h2 className="px-label">Shop the collection</h2>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {filters.map((f) => (
            <li key={f}>
              <button
                type="button"
                onClick={() => setActive(f)}
                aria-pressed={active === f}
                className={[
                  "px-label px-underline transition-opacity duration-[420ms]",
                  active === f ? "opacity-100 after:scale-x-100" : "opacity-45 hover:opacity-100",
                ].join(" ")}
              >
                {f}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-12 md:gap-x-8">
        {shown.map((p) => (
          <ProductCell key={p.id} product={p} className={spanFor(p)} />
        ))}
      </div>
    </section>
  );
}
