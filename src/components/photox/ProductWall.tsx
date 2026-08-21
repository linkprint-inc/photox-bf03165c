import { useEffect, useRef, useState } from "react";
import { filterMap, filters, products, sizeRange, type Product } from "@/lib/photox-data";
import { Shell, SectionHead } from "./Section";

const detailSlugByProductId: Record<string, string> = {
  "concrete-light": "brutal-form",
  "red-field-no-2": "red-field-02",
};

function ProductCell({ product }: { product: Product }) {
  const isMetal = product.material === "Metal Print";
  const detailHref = `/products/${detailSlugByProductId[product.id] ?? product.id}`;

  return (
    <article>
      <a href={detailHref} className="group block">
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
  const [browseOpen, setBrowseOpen] = useState(false);
  const [categoriesFit, setCategoriesFit] = useState(false);
  const categoryFitRef = useRef<HTMLDivElement>(null);
  const categoryMeasureRef = useRef<HTMLUListElement>(null);
  const tag = filterMap[active];
  const shown = tag ? products.filter((p) => p.tags.includes(tag)) : products;

  useEffect(() => {
    const container = categoryFitRef.current?.parentElement;
    const measure = categoryMeasureRef.current;
    if (!container || !measure) return;

    const updateFit = () => {
      const availableWidth = container.clientWidth;
      const requiredWidth = measure.getBoundingClientRect().width;
      setCategoriesFit((fits) =>
        fits ? availableWidth >= requiredWidth + 8 : availableWidth >= requiredWidth + 24,
      );
    };

    const observer = new ResizeObserver(updateFit);
    observer.observe(container);
    updateFit();
    return () => observer.disconnect();
  }, []);

  const selectCategory = (category: string) => {
    setActive(category);
    setBrowseOpen(false);
  };

  return (
    <Shell id="shop" className="pb-24 md:pb-32">
      <SectionHead title="Shop the collection">
        <div ref={categoryFitRef} className="relative col-span-2 min-w-0 md:col-auto">
          <div aria-hidden className="pointer-events-none absolute h-0 w-0 overflow-hidden">
            <ul ref={categoryMeasureRef} className="flex w-max gap-x-6">
              {filters.map((f) => (
                <li key={f} className="px-label whitespace-nowrap">
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {categoriesFit ? (
            <nav aria-label="Collection categories">
              <ul className="flex items-center gap-x-6 whitespace-nowrap">
                {filters.map((f) => (
                  <li key={f}>
                    <button
                      type="button"
                      onClick={() => selectCategory(f)}
                      aria-pressed={active === f}
                      className={[
                        "px-label px-underline transition-opacity duration-[420ms]",
                        active === f
                          ? "opacity-100 after:scale-x-100"
                          : "opacity-45 hover:opacity-100",
                      ].join(" ")}
                    >
                      {f}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          ) : (
            <div className="w-full">
              <div className="flex items-center justify-between gap-4">
                <p className="px-label text-foreground">{active}</p>
                <button
                  type="button"
                  onClick={() => setBrowseOpen((open) => !open)}
                  aria-expanded={browseOpen}
                  aria-controls="collection-category-browse"
                  className="px-label text-muted-foreground transition-colors hover:text-foreground"
                >
                  Browse {browseOpen ? "×" : "+"}
                </button>
              </div>

              <div
                id="collection-category-browse"
                className={[
                  "grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out",
                  browseOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                ].join(" ")}
              >
                <ul className="mt-4 min-h-0 border-t border-hairline">
                  {filters.map((f) => {
                    const selected = active === f;
                    return (
                      <li key={f} className="border-b border-hairline">
                        <button
                          type="button"
                          onClick={() => selectCategory(f)}
                          aria-pressed={selected}
                          className={[
                            "px-label flex h-12 w-full items-center text-left transition-colors duration-200",
                            selected
                              ? "font-medium text-foreground"
                              : "font-normal text-muted-foreground hover:text-foreground",
                          ].join(" ")}
                        >
                          {f}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}
        </div>
      </SectionHead>

      <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 md:gap-x-8 lg:grid-cols-4">
        {shown.map((p) => (
          <ProductCell key={p.id} product={p} />
        ))}
      </div>
    </Shell>
  );
}
