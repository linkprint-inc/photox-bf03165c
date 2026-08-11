import { useMemo, useState } from "react";
import { Shell } from "../Section";
import { ShopProductCard } from "./ShopProductCard";
import {
  ShopFilterPanel,
  emptyFilters,
  countFilters,
  type FilterState,
} from "./ShopFilterPanel";
import metalDetail from "@/assets/metal-detail.jpg";
import {
  materialLabel,
  priceBands,
  shopProducts,
  sortOptions,
  totalWorks,
  type ShopProduct,
  type SortOption,
} from "@/lib/shop-data";

const PAGE = 24;

const primaryCategories = [
  { key: "All", label: "All Art" },
  { key: "Photography", label: "Photography" },
  { key: "Abstract", label: "Abstract" },
  { key: "Landscape", label: "Landscape" },
  { key: "Architecture", label: "Architecture" },
] as const;

function matchesCategory(p: ShopProduct, cat: string) {
  if (cat === "All") return true;
  return (p.styles as string[]).includes(cat);
}

export function ShopCatalog() {
  const [category, setCategory] = useState<string>("All");
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [panelOpen, setPanelOpen] = useState(false);
  const [view, setView] = useState<"grid" | "room">("grid");
  const [sort, setSort] = useState<SortOption>("Featured");
  const [count, setCount] = useState(PAGE);

  const results = useMemo(() => {
    let list = shopProducts.filter((p) => matchesCategory(p, category));

    if (filters.materials.length) {
      list = list.filter((p) =>
        filters.materials.some((m) => materialLabel[p.material] === m || p.material === "both"),
      );
    }
    if (filters.orientations.length) {
      list = list.filter((p) => filters.orientations.includes(p.orientation));
    }
    if (filters.styles.length) {
      list = list.filter((p) => p.styles.some((s) => filters.styles.includes(s)));
    }
    if (filters.prices.length) {
      list = list.filter((p) =>
        filters.prices.some((label) => {
          const band = priceBands.find((b) => b.label === label);
          return band ? p.from >= band.min && p.from <= band.max : true;
        }),
      );
    }

    const sorted = [...list];
    if (sort === "Price: Low to High") sorted.sort((a, b) => a.from - b.from);
    if (sort === "Price: High to Low") sorted.sort((a, b) => b.from - a.from);
    if (sort === "New Arrivals")
      sorted.sort((a, b) => Number(b.badges.includes("new")) - Number(a.badges.includes("new")));
    if (sort === "Best Selling")
      sorted.sort((a, b) => Number(b.badges.includes("best")) - Number(a.badges.includes("best")));
    return sorted;
  }, [category, filters, sort]);

  const shown = results.slice(0, count);
  const active = countFilters(filters);

  const toggle = (group: keyof FilterState, value: string) => {
    setCount(PAGE);
    setFilters((prev) => {
      const arr = prev[group];
      return {
        ...prev,
        [group]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  return (
    <>
      {/* 02 — intro */}
      <Shell label="Shop introduction" className="pt-28 md:pt-32">
        <div className="pb-14 md:pb-16">
          <p className="px-label text-muted-foreground">Shop</p>
          <h1 className="px-serif mt-4 text-[2.6rem] md:text-[4rem]">Art for your walls.</h1>
          <p className="px-meta mt-4 max-w-[46ch] text-muted-foreground">
            Explore photography and artwork available on Metal Print and Frameless Canvas.
          </p>
        </div>
      </Shell>

      {/* 03 — category navigation */}
      <Shell label="Categories">
        <nav aria-label="Categories" className="overflow-x-auto">
          <ul className="flex min-w-max gap-10 md:gap-14">
            {primaryCategories.map((c) => (
              <li key={c.key}>
                <button
                  type="button"
                  onClick={() => {
                    setCategory(c.key);
                    setCount(PAGE);
                  }}
                  aria-pressed={category === c.key}
                  className={[
                    "relative whitespace-nowrap pb-2 text-[0.8125rem] font-medium uppercase tracking-[0.08em] transition-colors duration-300",
                    "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-foreground after:transition-transform after:duration-300 after:origin-left",
                    category === c.key
                      ? "text-foreground after:scale-x-100"
                      : "text-muted-foreground hover:text-foreground after:scale-x-0 hover:after:scale-x-100",
                  ].join(" ")}
                >
                  {c.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </Shell>

      {/* 04 — toolbar */}
      <Shell label="Shop controls" className="pt-8 md:pt-10">
        <div className="px-rule flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-3">
          <button
            type="button"
            onClick={() => setPanelOpen((v) => !v)}
            className="px-underline text-[0.75rem] uppercase tracking-[0.1em]"
          >
            {active > 0 ? `Filter (${active})` : "Filter +"}
          </button>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.75rem] uppercase tracking-[0.1em]">
            <span className="text-muted-foreground">
              {results.length === shopProducts.length ? totalWorks : results.length} works
            </span>

            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">View</span>
              {(["grid", "room"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  aria-pressed={view === v}
                  aria-label={v === "grid" ? "Grid view" : "Room view"}
                  className={[
                    "px-underline transition-opacity duration-300",
                    view === v ? "opacity-100" : "opacity-45 hover:opacity-100",
                  ].join(" ")}
                >
                  {v}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2">
              <span className="text-muted-foreground">Sort</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="cursor-pointer appearance-none bg-transparent pr-4 text-[0.75rem] uppercase tracking-[0.1em] outline-none"
              >
                {sortOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </Shell>


      {/* 05 + 06 — filters and grid */}
      <Shell label="Products" className="pb-24">
        <div
          className={
            panelOpen
              ? "grid gap-10 pt-10 md:grid-cols-[220px_minmax(0,1fr)]"
              : "grid gap-10 pt-10"
          }
        >
          <ShopFilterPanel
            open={panelOpen}
            filters={filters}
            results={results.length}
            onToggle={toggle}
            onClear={() => setFilters(emptyFilters)}
            onClose={() => setPanelOpen(false)}
          />

          <div>
            {shown.length === 0 ? (
              <div className="py-24 text-center">
                <h2 className="px-serif text-[2rem]">No works found.</h2>
                <p className="px-meta mt-3 text-muted-foreground">
                  Try removing a filter or exploring all artwork.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFilters(emptyFilters);
                    setCategory("All");
                  }}
                  className="px-label px-underline mt-6"
                >
                  Clear filters →
                </button>
              </div>
            ) : (
              <>
                <div
                  className={[
                    "grid grid-cols-2 gap-x-6 gap-y-12 md:gap-x-8",
                    panelOpen ? "lg:grid-cols-3" : "md:grid-cols-3 lg:grid-cols-4",
                  ].join(" ")}
                >
                  {shown.slice(0, 12).map((p) => (
                    <ShopProductCard key={p.id} product={p} view={view} />
                  ))}
                </div>

                {/* 13 — one restrained material interruption */}
                {shown.length > 12 ? (
                  <div className="px-rule mt-16 grid gap-8 border-b border-hairline py-10 md:grid-cols-2 md:items-center">
                    <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
                      <img
                        src={metalDetail}
                        alt="Close view of a gloss metal print catching natural reflected light"
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="px-serif text-[2rem]">See it in metal.</h2>
                      <p className="px-meta mt-3 max-w-[36ch] text-muted-foreground">
                        Glossy surface. Crisp detail. Made to catch the light.
                      </p>
                      <p className="px-price mt-4">
                        <span className="px-label mr-1 opacity-70">Metal prints from</span>$79
                      </p>
                      <a href="/#metal" className="px-label px-underline mt-5 inline-block">
                        Explore metal →
                      </a>
                    </div>
                  </div>
                ) : null}

                {shown.length > 12 ? (
                  <div
                    className={[
                      "mt-16 grid grid-cols-2 gap-x-6 gap-y-12 md:gap-x-8",
                      panelOpen ? "lg:grid-cols-3" : "md:grid-cols-3 lg:grid-cols-4",
                    ].join(" ")}
                  >
                    {shown.slice(12).map((p) => (
                      <ShopProductCard key={p.id} product={p} view={view} />
                    ))}
                  </div>
                ) : null}

                {/* 16 — load more */}
                <div className="mt-20 text-center">
                  <p className="px-meta text-muted-foreground">
                    Showing {shown.length} of {results.length === shopProducts.length ? totalWorks : results.length}
                  </p>
                  {count < results.length ? (
                    <button
                      type="button"
                      onClick={() => setCount((c) => c + PAGE)}
                      className="px-label px-underline mt-4"
                    >
                      Load more
                    </button>
                  ) : null}
                </div>
              </>
            )}
          </div>
        </div>
      </Shell>
    </>
  );
}
