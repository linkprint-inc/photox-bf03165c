import { ArrowUpRight } from "lucide-react";
import { materialLabel, type ShopProduct } from "@/lib/shop-data";
import type { InspirationCategory } from "./ShopCatalog";

const styleNotes: Record<Exclude<InspirationCategory, "all">, string> = {
  pets: "Natural, close-to-home feeling",
  family: "Warm documentary feeling",
  portraits: "Soft, considered portraiture",
  landscape: "Expansive light and colour",
};

export function ShopProductCard({
  product,
  view,
  href,
  inspirationCategory = "all",
  action: _action,
}: {
  product: ShopProduct;
  view: "grid" | "room";
  href?: string;
  inspirationCategory?: InspirationCategory;
  action?: "save" | "remove";
}) {
  const link = href ?? `/products/${product.id}`;
  const isMetal = product.material !== "canvas";
  const primary = view === "room" ? product.room : product.image;
  const secondary = view === "room" ? product.image : product.room;
  const note =
    inspirationCategory === "all"
      ? "A starting point for your photo"
      : styleNotes[inspirationCategory];

  return (
    <article className="group min-w-0 max-w-full">
      <a href={link} className="block" aria-label={`${product.name} — view artwork`}>
        <div
          className={[
            "relative aspect-square w-full overflow-hidden bg-secondary",
            isMetal ? "px-gloss" : "px-weave",
          ].join(" ")}
        >
          <img
            src={primary}
            alt={`${product.name} as inspiration for a custom ${materialLabel[product.material].toLowerCase()}`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[380ms] group-hover:opacity-0 group-focus-within:opacity-0"
          />
          <img
            src={secondary}
            alt=""
            aria-hidden
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-[380ms] group-hover:opacity-100 group-focus-within:opacity-100"
          />
          <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-paper/90 text-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
            <ArrowUpRight size={19} strokeWidth={1.5} />
          </span>
        </div>
        <div className="mt-4">
          <p className="px-label">
            {inspirationCategory === "all" ? product.name : inspirationCategory}
          </p>
          <p className="px-meta mt-1 text-muted-foreground">{note}</p>
          <p className="px-label px-underline mt-3 inline-block">Use this style →</p>
        </div>
      </a>
    </article>
  );
}
