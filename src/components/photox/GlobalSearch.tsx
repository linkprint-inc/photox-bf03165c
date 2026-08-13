import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { shopProducts, materialLabel, styleOptions } from "@/lib/shop-data";
import { useSearchUI } from "@/lib/search-ui";

const popularTerms = ["Landscape", "Abstract", "Black & White", "Architecture", "Coastal"];
const MAX_RESULTS = 6;

export function GlobalSearch() {
  const { open, closeSearch } = useSearchUI();
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
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
  const empty = term && results.length === 0 && categoryHits.length === 0;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-foreground/10">
      <button
        type="button"
        aria-label="Close search"
        onClick={closeSearch}
        className="fixed inset-0 h-full w-full cursor-default"
      />

      <div className="relative min-h-screen w-full bg-paper">
        <div className="mx-auto max-w-[1440px] px-6 pb-12 pt-5 md:px-10 md:pb-16 md:pt-6">
          <div className="flex items-center justify-between">
            <span className="px-label">Search</span>
            <button
              type="button"
              onClick={closeSearch}
              aria-label="Close search"
              className="-mr-3 flex h-11 w-11 items-center justify-center text-[1.1rem] leading-none transition-opacity hover:opacity-60"
            >
              ×
            </button>
          </div>

          <form
            className={[
              "mt-4 border-b transition-colors duration-300 md:mt-5",
              focused ? "border-foreground/85" : "border-foreground/30",
            ].join(" ")}
            onSubmit={(e) => {
              e.preventDefault();
              if (term) goToShop(q.trim());
            }}
          >
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Search artwork, styles or collections"
              aria-label="Search artwork, styles or collections"
              className="px-serif w-full bg-transparent py-3 text-[1.25rem] text-foreground outline-none placeholder:text-foreground/45 placeholder:transition-colors placeholder:duration-300 focus:placeholder:text-foreground/70 md:text-[1.7rem]"
            />
          </form>

          {term ? (
            <p className="px-meta mt-3 text-muted-foreground">
              {matches.length} {matches.length === 1 ? "result" : "results"} for “{q.trim()}”
            </p>
          ) : null}

          <div key={term ? "results" : "discovery"} className="px-fade">
            {empty ? (
              <div className="mt-10 md:mt-12">
                <p className="px-serif text-[1.3rem]">No results for “{q.trim()}”</p>
                <p className="px-meta mt-2 text-muted-foreground">
                  Try another search or explore all artwork.
                </p>
                <button
                  type="button"
                  onClick={() => goToShop("")}
                  className="px-label px-underline mt-5 inline-block"
                >
                  Shop all art →
                </button>
              </div>
            ) : (
              <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-[1fr_2.75fr] md:gap-10">
                <div>
                  <p className="px-label text-muted-foreground">
                    {term ? "Related" : "Popular searches"}
                  </p>
                  <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
                    {(term ? categoryHits : popularTerms).map((t) => (
                      <li key={t}>
                        <button
                          type="button"
                          onClick={() => (term ? goToShop(t) : setQ(t))}
                          className="px-serif px-underline text-left text-[1rem] transition-opacity hover:opacity-60"
                        >
                          {t}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="px-label text-muted-foreground">
                    {term ? "Results" : "Popular artwork"}
                  </p>
                  <ul className="mt-4 flex flex-col gap-4 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-4">
                    {(term ? results : popularArtwork).map((p) => (
                      <li key={p.id}>
                        <ResultCard product={p} onSelect={() => goToShop(p.name)} />
                      </li>
                    ))}
                  </ul>
                  {term && matches.length > results.length && (
                    <button
                      type="button"
                      onClick={() => goToShop(q.trim())}
                      className="px-label px-underline mt-7 inline-block"
                    >
                      View all results →
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
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
    <button
      type="button"
      onClick={onSelect}
      className="group flex w-full items-center gap-4 text-left sm:block"
    >
      <div className="relative aspect-[5/4] w-16 shrink-0 overflow-hidden bg-secondary sm:w-full">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-85"
        />
      </div>
      <div className="min-w-0 sm:mt-2.5">
        <p className="px-label">{product.name}</p>
        <p className="px-meta text-muted-foreground">{materialLabel[product.material]}</p>
        <p className="px-price mt-0.5">
          <span className="px-label mr-1 opacity-70">From</span>${product.from}
        </p>
      </div>
    </button>
  );
}
