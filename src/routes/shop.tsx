import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/photox/SiteNav";
import { SiteFooter } from "@/components/photox/SiteFooter";
import { ShopCatalog } from "@/components/photox/shop/ShopCatalog";
import { sizeLabelsFromSearch } from "@/lib/shop-data";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop Wall Art — Metal Prints & Frameless Canvas | photoX" },
      {
        name: "description",
        content:
          "Browse 128 works on Metal Print and Frameless Canvas. Filter by style, size and price, and see every artwork in a real room.",
      },
      { property: "og:title", content: "Shop Wall Art — Metal Prints & Frameless Canvas | photoX" },
      {
        property: "og:description",
        content:
          "Browse 128 works on Metal Print and Frameless Canvas. Filter by style, size and price, and see every artwork in a real room.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { q?: string; size?: string } => {
    const q = typeof search["q"] === "string" && search["q"] ? (search["q"] as string) : undefined;
    const size =
      typeof search["size"] === "string" && sizeLabelsFromSearch(search["size"] as string).length
        ? (search["size"] as string)
        : undefined;
    return { ...(q ? { q } : {}), ...(size ? { size } : {}) };
  },

  component: ShopPage,
});

function ShopPage() {
  const { q, size } = Route.useSearch();

  return (
    <div className="min-w-0 max-w-full bg-background text-foreground">
      <SiteNav variant="light" />
      <main className="min-w-0 max-w-full">
        <ShopCatalog query={q ?? ""} size={size} />
      </main>
      <SiteFooter />
    </div>
  );
}
