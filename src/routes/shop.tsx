import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/photox/SiteNav";
import { SiteFooter } from "@/components/photox/SiteFooter";
import { ShopCatalog } from "@/components/photox/shop/ShopCatalog";

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
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? (search["q"] as string) : undefined,
  }),
  component: ShopPage,
});

function ShopPage() {
  const { q } = Route.useSearch();

  return (
    <div className="bg-background text-foreground">
      <SiteNav variant="light" />
      <main>
        <ShopCatalog query={q} />
      </main>
      <SiteFooter />
    </div>
  );
}
