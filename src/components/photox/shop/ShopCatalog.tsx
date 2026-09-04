import { useEffect, useMemo, useState } from "react";
import { Shell } from "../Section";
import { ShopProductCard } from "./ShopProductCard";
import { shopProducts, type ShopProduct } from "@/lib/shop-data";

export const inspirationCategories = [
  { key: "all", label: "All" },
  { key: "pets", label: "Pets" },
  { key: "family", label: "Family" },
  { key: "portraits", label: "Portraits" },
  { key: "landscape", label: "Landscape" },
] as const;

export type InspirationCategory = (typeof inspirationCategories)[number]["key"];

function matchesCategory(product: ShopProduct, category: InspirationCategory) {
  if (category === "all") return true;
  if (category === "pets") return product.styles.includes("Nature");
  if (category === "family")
    return product.styles.includes("Photography") || product.styles.includes("Figurative");
  if (category === "portraits")
    return product.orientation === "Portrait" || product.styles.includes("Figurative");
  return product.styles.includes("Landscape") || product.styles.includes("Nature");
}

function categoryForQuery(query?: string): InspirationCategory | undefined {
  const normalized = query?.toLowerCase().trim();
  return inspirationCategories.some((category) => category.key === normalized)
    ? (normalized as InspirationCategory)
    : undefined;
}

export function ShopCatalog({
  query,
  category: initialCategory,
}: {
  query?: string;
  category?: InspirationCategory | undefined;
}) {
  const [selected, setSelected] = useState<InspirationCategory>(
    initialCategory ?? categoryForQuery(query) ?? "all",
  );

  useEffect(() => {
    const requested = initialCategory ?? categoryForQuery(query);
    if (requested) setSelected(requested);
  }, [initialCategory, query]);

  const examples = useMemo(() => {
    const term = query?.trim().toLowerCase();
    return shopProducts.filter((product) => {
      if (!matchesCategory(product, selected)) return false;
      if (!term || categoryForQuery(term)) return true;
      return [product.name, ...product.styles, product.orientation].some((value) =>
        value.toLowerCase().includes(term),
      );
    });
  }, [query, selected]);

  return (
    <>
      <Shell label="Inspiration introduction" className="pt-28 md:pt-32">
        <div className="max-w-[60ch] pb-12 md:pb-16">
          <p className="px-label text-muted-foreground">Start with an idea</p>
          <h1 className="px-serif mt-4 text-[2.35rem] leading-[1.05] md:text-[3.35rem]">
            See what your photo could become.
          </h1>
          <p className="px-meta mt-5 max-w-[48ch] text-muted-foreground">
            A small collection of looks, rooms and materials to help you imagine your own image on
            the wall. Every example starts the same custom print process.
          </p>
          <a
            href="/custom"
            className="px-label mt-7 inline-block border border-foreground px-6 py-3.5 transition-colors hover:bg-foreground hover:text-background"
          >
            Start with your photo →
          </a>
        </div>
      </Shell>

      <Shell label="Inspiration categories" className="pb-8">
        <nav aria-label="Inspiration categories" className="border-y border-hairline py-4">
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {inspirationCategories.map((category) => {
              const active = selected === category.key;
              return (
                <li key={category.key}>
                  <button
                    type="button"
                    onClick={() => setSelected(category.key)}
                    aria-pressed={active}
                    className={[
                      "px-label px-underline transition-opacity duration-300",
                      active ? "after:scale-x-100 opacity-100" : "opacity-50 hover:opacity-100",
                    ].join(" ")}
                  >
                    {category.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </Shell>

      <Shell label="Custom print examples" className="pb-24 md:pb-32">
        {examples.length ? (
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 md:gap-x-8 lg:grid-cols-4">
            {examples.map((product) => (
              <ShopProductCard
                key={product.id}
                product={product}
                view="grid"
                inspirationCategory={selected}
              />
            ))}
          </div>
        ) : (
          <div className="py-20">
            <h2 className="px-serif text-[2rem]">No examples match that search.</h2>
            <p className="px-meta mt-3 text-muted-foreground">
              Try another idea, or start directly with your photo.
            </p>
            <a href="/custom" className="px-label px-underline mt-6 inline-block">
              Start with your photo →
            </a>
          </div>
        )}
      </Shell>
    </>
  );
}
