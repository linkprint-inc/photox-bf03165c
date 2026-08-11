import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/photox/SiteNav";
import { SiteFooter } from "@/components/photox/SiteFooter";
import { ShopCatalog } from "@/components/photox/shop/ShopCatalog";
import { ShopSearchOverlay } from "@/components/photox/shop/ShopSearchOverlay";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop Wall Art — Metal Prints & Frameless Canvas | PhotoX" },
      {
        name: "description",
        content:
          "Browse 128 works on Metal Print and Frameless Canvas. Filter by style, size and price, and see every artwork in a real room.",
      },
      { property: "og:title", content: "Shop Wall Art — Metal Prints & Frameless Canvas | PhotoX" },
      {
        property: "og:description",
        content:
          "Browse 128 works on Metal Print and Frameless Canvas. Filter by style, size and price, and see every artwork in a real room.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const [search, setSearch] = useState(false);

  return (
    <div className="bg-background text-foreground">
      <SiteNav variant="light" onSearch={() => setSearch(true)} />
      <ShopSearchOverlay open={search} onClose={() => setSearch(false)} />
      <main>
        <ShopCatalog />
      </main>
      <SiteFooter />
    </div>
  );
}
