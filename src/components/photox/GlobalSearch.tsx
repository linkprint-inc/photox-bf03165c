import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { shopProducts, materialLabel, styleOptions } from "@/lib/shop-data";
import { useSearchUI } from "@/lib/search-ui";

const popularTerms = ["Landscape", "Abstract", "Black & White", "Architecture", "Coastal"];
const MAX_RESULTS = 6;

export function GlobalSearch() {
  const { open, closeSearch } = useSearchUI();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    const body = document.body;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", onKey);

    const t = window.setTimeout(() => inputRef.current?.focus(), 30);

    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      window.scrollTo(0, scrollY);
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open, closeSearch]);

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const term = q.trim().toLowerCase();

  const matches = useMemo(() => {
    if (!term) return [];
    return shopProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        materialLabel[p.material].toLowerCase().includes(term) ||
        p.styles.some((s) => s.toLowerCase().includes(term)),
    );
  }, [term]);

  const categoryHits = useMemo(
    () => (term ? styleOptions.filter((s) => s.toLowerCase().includes(term)) : []),
    [term],
  );

  const popularArtwork = useMemo(() => shopProducts.slice(0, 4), []);

  if (!open) return null;

  const goToShop = (query: string) => {
    closeSearch();
    navigate({ to: "/shop", search: query ? { q: query } : {} });
  };

  const results = matches.slice(0, MAX_RESULTS);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col">
      <button
        type="button"
        aria-label="Close search"
        onClick={closeSearch}
        className="absolute inset-0 h-full w-full cursor-default bg-foreground/10"
      />

      <div className="relative max-h-full w-full overflow-y-auto bg-paper">
        <div className="mx-auto max-w-[1440px] px-6 pb-14 pt-6 md:px-10 md:pb-20 md:pt-8">
          <div className="flex items-center justify-between">
            <span className="px-label">Search</span>
            <button
              type="button"
              onClick={closeSearch}
              aria-label="Close search"
              className="px-label px-underline text-[1.1rem] leading-none"
            >
              ×
            </button>
          </div>

          <form
            className="mt-6 border-b border-foreground/25 md:mt-8"
            onSubmit={(e) => {
              e.preventDefault();
              if (term) goToShop(q.trim());
            }}
          >
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search artwork, styles or collections"
              aria-label="Search artwork, styles or collections"
              className="px-serif w-full bg-transparent py-4 text-[1.5rem] outline-none placeholder:opacity-35 md:text-[2.1rem]"
            />
          </form>

          {!term ? (
            <div className="mt-10 grid gap-12 md:mt-14 md:grid-cols-[1fr_2fr] md:gap-16">
              <div>
                <p className="px-label text-muted-foreground">Popular searches</p>
                <ul className="mt-5 space-y-3">
                  {popularTerms.map((t) => (
                    <li key={t}>
                      <button
                        type="button"
                        onClick={() => setQ(t)}
                        className="px-serif text-[1.15rem] transition-opacity hover:opacity-60"
                      >
                        {t}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="px-label text-muted-foreground">Popular artwork</p>
                <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
                  {popularArtwork.map((p) => (
                    <li key={p.id}>
                      <ResultCard product={p} onSelect={() => goToShop(p.name)} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : results.length === 0 && categoryHits.length === 0 ? (
            <div className="mt-12 md:mt-16">
              <p className="px-serif text-[1.4rem]">No results for “{q.trim()}”</p>
              <p className="px-meta mt-2 text-muted-foreground">
                Try another search or browse all artwork.
              </p>
              <button
                type="button"
                onClick={() => goToShop("")}
                className="px-label px-underline mt-6 inline-block"
              >
                Shop all art →
              </button>
            </div>
          ) : (
            <div className="mt-10 space-y-12 md:mt-14">
              {results.length > 0 && (
                <div>
                  <p className="px-label text-muted-foreground">Artwork</p>
                  <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                    {results.map((p) => (
                      <li key={p.id}>
                        <ResultCard product={p} onSelect={() => goToShop(p.name)} />
                      </li>
                    ))}
                  </ul>
                  {matches.length > results.length && (
                    <button
                      type="button"
                      onClick={() => goToShop(q.trim())}
                      className="px-label px-underline mt-8 inline-block"
                    >
                      View all results →
                    </button>
                  )}
                </div>
              )}

              {categoryHits.length > 0 && (
                <div>
                  <p className="px-label text-muted-foreground">Categories</p>
                  <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
                    {categoryHits.map((c) => (
                      <li key={c}>
                        <button
                          type="button"
                          onClick={() => goToShop(c)}
                          className="px-serif text-[1.05rem] transition-opacity hover:opacity-60"
                        >
                          {c}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultCard({
  product,
  onSelect,
}: {
  product: (typeof shopProducts)[number];
  onSelect: () => void;
}) {
  return (
    <button type="button" onClick={onSelect} className="group block w-full text-left">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </div>
      <p className="px-label mt-3">{product.name}</p>
      <p className="px-meta text-muted-foreground">{materialLabel[product.material]}</p>
      <p className="px-price mt-1">
        <span className="px-label mr-1 opacity-70">From</span>${product.from}
      </p>
    </button>
  );
}
