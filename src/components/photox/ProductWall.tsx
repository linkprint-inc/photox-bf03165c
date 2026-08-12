import { useState } from "react";
import { filterMap, filters, products, sizeRange, type Product } from "@/lib/photox-data";
import { Shell, SectionHead } from "./Section";

function ProductCell({ product }: { product: Product }) {
  const isMetal = product.material === "Metal Print";

  return (
    <article>
      <a href="/shop" className="group block">
        <div
          className={[
            "relative aspect-square w-full overflow-hidden bg-secondary",
            isMetal ? "px-gloss" : "px-weave",
            "group-hover:after:opacity-100 group-focus-visible:after:opacity-100",
          ].join(" ")}
        >
          <img
            src={product.image}
            alt={`${product.name} — ${product.material}`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[620ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:opacity-0 group-focus-visible:opacity-0"
          />
          <img
            src={product.hover}
            alt={`${product.name} shown as a finished ${product.material.toLowerCase()} on a wall`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-[620ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:opacity-100 group-focus-visible:opacity-100"
          />
          <span
            aria-hidden
            className={[
              isMetal ? "px-edge" : "px-canvas-edge",
              "group-hover:w-[7px] group-focus-visible:w-[7px]",
            ].join(" ")}
          />
        </div>

        <div className="mt-4">
          <h3 className="px-label">{product.name}</h3>
          <p className="px-meta mt-1 text-muted-foreground">{product.material}</p>
          <p className="px-meta text-muted-foreground">{sizeRange}</p>
          <p className="px-price mt-2">
            <span className="px-label mr-1 opacity-70">From</span>${product.from}
          </p>
        </div>
      </a>
    </article>
  );
}

export function ProductWall() {
  const [active, setActive] = useState<string>("All");
  const tag = filterMap[active];
  const shown = tag ? products.filter((p) => p.tags.includes(tag)) : products;

  return (
    <Shell id="shop" className="pb-24 md:pb-32">
      <SectionHead title="Shop the collection">
        <ul className="col-span-2 flex flex-wrap gap-x-6 gap-y-2 md:col-auto">
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
      </SectionHead>

      <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 md:gap-x-8 lg:grid-cols-4">
        {shown.map((p) => (
          <ProductCell key={p.id} product={p} />
        ))}
      </div>
    </Shell>
  );
}
