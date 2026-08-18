import { largeWorks } from "@/lib/photox-data";
import { Shell, SectionHead } from "./Section";

export function LargeFormat() {
  return (
    <Shell label="Large format favourites" className="pb-28 md:pb-40">
      <SectionHead title="Large format favourites" note='Statement scale, 24" and above' />

      <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 md:gap-x-8 lg:grid-cols-4">
        {largeWorks.map((w) => (
          <article key={w.id}>
            <a href={`/products/${w.id}`} className="group block">
              <div className="relative aspect-square w-full overflow-hidden bg-secondary">
                <img
                  src={w.image}
                  alt={`${w.name} — ${w.material}`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[600ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:opacity-0 group-focus-visible:opacity-0"
                />
                <img
                  src={w.room}
                  alt={`${w.name} installed in a real interior`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-[600ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:opacity-100 group-focus-visible:opacity-100"
                />
              </div>

              <div className="mt-4">
                <h3 className="px-label">{w.name}</h3>
                <p className="px-meta mt-1 text-muted-foreground">{w.material}</p>
                <p className="px-meta text-muted-foreground">{w.size}</p>
                <p className="px-price mt-2">${w.price}</p>
              </div>
            </a>
          </article>
        ))}
      </div>
    </Shell>
  );
}
