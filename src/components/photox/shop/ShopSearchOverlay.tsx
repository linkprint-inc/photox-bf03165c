import { useMemo, useState } from "react";
import { shopProducts, materialLabel } from "@/lib/shop-data";

export function ShopSearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");

  const hits = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return shopProducts
      .filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.styles.some((s) => s.toLowerCase().includes(term)),
      )
      .slice(0, 6);
  }, [q]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-paper/98">
      <div className="mx-auto max-w-[1440px] px-6 pt-8 md:px-10">
        <div className="flex items-center justify-between gap-6">
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search artworks, collections or styles"
            className="px-serif w-full bg-transparent py-4 text-[1.6rem] outline-none placeholder:opacity-40 md:text-[2.2rem]"
          />
          <button type="button" onClick={onClose} className="px-label px-underline">
            Close
          </button>
        </div>
        <div className="px-rule pt-6">
          {hits.length === 0 ? (
            <p className="px-meta text-muted-foreground">
              {q ? "No works found." : "Start typing to search the catalog."}
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3 lg:grid-cols-6">
              {hits.map((p) => (
                <li key={p.id}>
                  <a href="#" className="group block">
                    <div className="relative aspect-square overflow-hidden bg-secondary">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                    <p className="px-label mt-3">{p.name}</p>
                    <p className="px-meta text-muted-foreground">{materialLabel[p.material]}</p>
                    <p className="px-price mt-1">
                      <span className="px-label mr-1 opacity-70">From</span>${p.from}
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
