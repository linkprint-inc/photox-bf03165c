import { Shell, SectionHead } from "./Section";
import { ShopProductCard } from "./shop/ShopProductCard";
import { shopProducts } from "@/lib/shop-data";

export function ProductWall() {
  return (
    <Shell id="inspiration" className="pb-24 md:pb-32">
      <SectionHead
        title="Start with an idea"
        note="A few ways your own photo could live on the wall."
      >
        <a href="/shop" className="px-label px-underline">
          See all ideas →
        </a>
      </SectionHead>
      <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 border-y border-hairline py-4">
        {["Pets", "Family", "Portraits", "Landscape"].map((category) => (
          <a
            key={category}
            href={`/shop?category=${category.toLowerCase()}`}
            className="px-label px-underline opacity-65 transition-opacity hover:opacity-100"
          >
            {category}
          </a>
        ))}
      </div>
      <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 md:gap-x-8 lg:grid-cols-4">
        {shopProducts.slice(0, 8).map((product) => (
          <ShopProductCard key={product.id} product={product} view="grid" />
        ))}
      </div>
    </Shell>
  );
}
