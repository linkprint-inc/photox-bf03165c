import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Shell } from "../Section";
import { ShopProductCard } from "./ShopProductCard";
import { ShopFilterPanel, emptyFilters, countFilters, type FilterState } from "./ShopFilterPanel";
import metalDetail from "@/assets/metal-detail.jpg";
import {
  materialLabel,
  priceBands,
  shopProducts,
  sizeLabelsFromSearch,
  sizeSearchValue,
  sortOptions,
  totalWorks,
  type ShopProduct,
  type SortOption,
} from "@/lib/shop-data";

const PAGE = 24;
const SHOP_STATE = "photox-shop-state-v1";

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

export function ShopCatalog({ query, size }: { query?: string; size?: string }) {
  const navigate = useNavigate();
  const requestedSizes = useMemo(() => sizeLabelsFromSearch(size), [size]);
  const restoredShopState = useRef(false);
  const [category, setCategory] = useState<string>("All");
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...emptyFilters,
    sizes: requestedSizes,
  }));
  const [panelOpen, setPanelOpen] = useState(false);
  const [view, setView] = useState<"grid" | "room">("grid");
  const [sort, setSort] = useState<SortOption>("Featured");
  const [sortOpen, setSortOpen] = useState(false);
  const [count, setCount] = useState(PAGE);
  const sortRef = useRef<HTMLDivElement>(null);
  const categoryFitRef = useRef<HTMLDivElement>(null);
  const categoryMeasureRef = useRef<HTMLUListElement>(null);
  const [categoryNavFits, setCategoryNavFits] = useState(false);

  // Preserve browsing state when returning from a product detail page.
  useEffect(() => {
    if (restoredShopState.current) return;
    restoredShopState.current = true;
    if (requestedSizes.length) return;
    try {
      const raw = sessionStorage.getItem(SHOP_STATE);
      if (!raw) return;
      const s = JSON.parse(raw) as {
        category: string;
        filters: FilterState;
        view: "grid" | "room";
        sort: SortOption;
        count: number;
        scroll: number;
      };
      setCategory(s.category);
      setFilters(s.filters);
      setView(s.view);
      setSort(s.sort);
      setCount(s.count);
      requestAnimationFrame(() => window.scrollTo({ top: s.scroll }));
    } catch {
      /* ignore */
    }
  }, [requestedSizes.length]);

  useEffect(() => {
    const save = () => {
      try {
        sessionStorage.setItem(
          SHOP_STATE,
          JSON.stringify({ category, filters, view, sort, count, scroll: window.scrollY }),
        );
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("pagehide", save);
    return () => {
      save();
      window.removeEventListener("pagehide", save);
    };
  }, [category, filters, view, sort, count]);

  useEffect(() => {
    if (!sortOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSortOpen(false);
    };
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!sortRef.current?.contains(event.target as Node)) setSortOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("pointerdown", closeOnOutsidePointer);
    };
  }, [sortOpen]);

  useEffect(() => {
    const container = categoryFitRef.current;
    const measure = categoryMeasureRef.current;
    if (!container || !measure) return;

    const updateCategoryFit = () => {
      const availableWidth = container.clientWidth;
      const requiredWidth = measure.getBoundingClientRect().width;

      setCategoryNavFits((fits) =>
        fits ? availableWidth >= requiredWidth + 8 : availableWidth >= requiredWidth + 32,
      );
    };

    const observer = new ResizeObserver(updateCategoryFit);
    observer.observe(container);
    updateCategoryFit();
    return () => observer.disconnect();
  }, []);

  const results = useMemo(() => {
    let list = shopProducts.filter((p) => matchesCategory(p, category));

    const term = (query ?? "").trim().toLowerCase();
    if (term) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          materialLabel[p.material].toLowerCase().includes(term) ||
          p.styles.some((s) => s.toLowerCase().includes(term)),
      );
    }

    if (filters.materials.length) {
      list = list.filter((p) =>
        filters.materials.some((m) => materialLabel[p.material] === m || p.material === "both"),
      );
    }
    if (filters.sizes.length) {
      list = list.filter((p) => filters.sizes.some((size) => p.availableSizes.includes(size)));
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
  }, [category, filters, sort, query]);

  const shown = results.slice(0, count);
  const active = countFilters(filters);
  const isFullCollection = category === "All" && !query?.trim() && active === 0;

  const renderCategory = (c: (typeof primaryCategories)[number]) => {
    const on = category === c.key;
    return (
      <li key={c.key}>
        <button
          type="button"
          onClick={() => {
            setCategory(c.key);
            setCount(PAGE);
          }}
          aria-pressed={on}
          className={[
            "whitespace-nowrap text-[0.95rem] leading-none transition-colors duration-300 max-md:px-underline max-md:outline-none max-md:focus:outline-none max-md:focus-visible:outline-none",
            on
              ? "font-medium text-foreground max-md:after:scale-x-100"
              : "font-normal text-muted-foreground hover:text-foreground",
          ].join(" ")}
        >
          {c.label}
        </button>
      </li>
    );
  };

  const syncSizeSearch = (sizes: string[]) => {
    navigate({
      to: "/shop",
      search: (previous) => {
        const { size: _size, ...rest } = previous;
        return sizes.length
          ? { ...rest, size: sizes.map((label) => sizeSearchValue(label)).join(",") }
          : rest;
      },
      replace: true,
    });
  };

  const toggle = (group: keyof FilterState, value: string) => {
    setCount(PAGE);
    const values = filters[group];
    const nextValues = values.includes(value)
      ? values.filter((entry) => entry !== value)
      : [...values, value];
    if (group === "sizes") syncSizeSearch(nextValues);
    setFilters((previous) => ({ ...previous, [group]: nextValues }));
  };

  const clearFilters = () => {
    setCount(PAGE);
    setFilters(emptyFilters);
    syncSizeSearch([]);
  };

  return (
    <>
      {/* 02 — intro */}
      <Shell label="Shop introduction" className="pt-28 md:pt-32">
        <div className="pb-16 md:pb-20">
          <h1 className="px-serif text-[2.2rem] md:text-[3.25rem]">Art for your walls.</h1>
          <p className="px-meta mt-3 max-w-[48ch] text-muted-foreground">
            Explore photography and artwork available on Metal Print and Frameless Canvas.
          </p>
        </div>
      </Shell>

      {/* 03 — category row */}
      <Shell label="Categories">
        <div ref={categoryFitRef} className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 h-0 w-0 overflow-hidden"
          >
            <ul ref={categoryMeasureRef} className="flex w-max items-baseline gap-x-12">
              {primaryCategories.map((item) => (
                <li
                  key={item.key}
                  className="whitespace-nowrap text-[0.95rem] font-medium leading-none"
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
          {categoryNavFits ? (
            <nav aria-label="Categories">
              <ul className="flex items-baseline gap-x-12">
                {primaryCategories.map(renderCategory)}
              </ul>
            </nav>
          ) : null}
        </div>
        {categoryNavFits ? <div className="mt-9 border-t border-hairline" /> : null}
      </Shell>

      {/* 04 — toolbar (secondary) */}
      <Shell label="Shop controls">
        <div className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-5 gap-y-3 py-3 md:flex md:flex-wrap md:justify-between md:gap-x-8">
          <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
            <button
              type="button"
              onClick={() => setPanelOpen((v) => !v)}
              className="text-[0.75rem] uppercase tracking-[0.06em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {active > 0 ? `Filter (${active})` : "Filter +"}
            </button>
            {filters.sizes.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => toggle("sizes", label)}
                aria-label={`Remove ${label} size filter`}
                className="px-label px-underline text-foreground"
              >
                {label} ×
              </button>
            ))}
          </div>

          <div className="flex items-center gap-x-5 text-[0.75rem] uppercase tracking-[0.06em] text-muted-foreground md:gap-x-6">
            <div className="flex items-center gap-x-3 md:gap-x-6">
              <span>{isFullCollection ? totalWorks : results.length} works</span>

              <div className="flex items-center gap-2 md:gap-2.5">
                {(["grid", "room"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setView(v)}
                    aria-pressed={view === v}
                    aria-label={v === "grid" ? "Grid view" : "Room view"}
                    className={[
                      "transition-opacity duration-300",
                      view === v
                        ? "opacity-100 text-foreground"
                        : "opacity-40 hover:opacity-100 text-foreground",
                    ].join(" ")}
                  >
                    {v === "grid" ? (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      >
                        <rect x="1.5" y="1.5" width="6" height="6" />
                        <rect x="10.5" y="1.5" width="6" height="6" />
                        <rect x="1.5" y="10.5" width="6" height="6" />
                        <rect x="10.5" y="10.5" width="6" height="6" />
                      </svg>
                    ) : (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      >
                        <rect x="1.5" y="3" width="15" height="12" />
                        <path d="M5 15V9h8v6" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div ref={sortRef} className="relative max-md:ml-1">
              <button
                type="button"
                onClick={() => setSortOpen((open) => !open)}
                aria-expanded={sortOpen}
                aria-controls="shop-sort-menu"
                className="flex items-center gap-1.5 text-[0.75rem] uppercase tracking-[0.06em] text-muted-foreground transition-colors hover:text-foreground"
              >
                Sort
                <span
                  aria-hidden
                  className={`inline-block text-[0.95rem] leading-none transition-transform duration-200 ${sortOpen ? "rotate-45" : "rotate-0"}`}
                >
                  +
                </span>
              </button>
              <div
                id="shop-sort-menu"
                role="menu"
                aria-label="Sort artwork"
                aria-hidden={!sortOpen}
                className={[
                  "absolute right-0 top-full z-30 mt-2 w-60 border border-hairline bg-paper px-4 py-1.5 shadow-[0_6px_18px_rgba(30,25,20,0.05)] transition-[opacity,transform] duration-200 ease-out",
                  sortOpen
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none -translate-y-1 opacity-0",
                ].join(" ")}
              >
                {sortOptions.map((option, index) => {
                  const selected = sort === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      role="menuitemradio"
                      aria-checked={selected}
                      tabIndex={sortOpen ? 0 : -1}
                      onClick={() => {
                        setSort(option);
                        setSortOpen(false);
                      }}
                      className={[
                        "flex h-10 w-full items-center text-left text-[0.8rem] uppercase tracking-[0.055em] transition-colors duration-150",
                        index > 0 ? "border-t border-hairline" : "",
                        selected
                          ? "font-medium text-foreground"
                          : "font-normal text-muted-foreground hover:text-foreground",
                      ].join(" ")}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Shell>

      {/* 05 + 06 — filters and grid */}
      <Shell label="Products" className="pb-24">
        <div
          className={
            panelOpen ? "grid gap-10 pt-6 md:grid-cols-[220px_minmax(0,1fr)]" : "grid gap-10 pt-6"
          }
        >
          <ShopFilterPanel
            open={panelOpen}
            filters={filters}
            results={results.length}
            onToggle={toggle}
            onClear={clearFilters}
            onClose={() => setPanelOpen(false)}
            {...(categoryNavFits ? {} : { categories: primaryCategories })}
            category={category}
            onCategoryChange={(nextCategory) => {
              setCategory(nextCategory);
              setCount(PAGE);
            }}
          />

          <div className="min-w-0 max-w-full">
            {shown.length === 0 ? (
              <div className="py-24 text-center">
                <h2 className="px-serif text-[2rem]">No works found.</h2>
                <p className="px-meta mt-3 text-muted-foreground">
                  Try removing a filter or exploring all artwork.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    clearFilters();
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
                    "grid w-full min-w-0 grid-cols-2 gap-x-6 gap-y-12 md:gap-x-8",
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
                      "mt-16 grid w-full min-w-0 grid-cols-2 gap-x-6 gap-y-12 md:gap-x-8",
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
                    Showing {shown.length} of {isFullCollection ? totalWorks : results.length}
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
