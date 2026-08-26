import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/photox/SiteNav";
import { SiteFooter } from "@/components/photox/SiteFooter";
import {
  ShopCatalog,
  inspirationCategories,
  type InspirationCategory,
} from "@/components/photox/shop/ShopCatalog";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Custom Print Inspiration — photoX" },
      {
        name: "description",
        content:
          "Explore a curated set of custom print ideas, then upload your own photo to make it yours.",
      },
      { property: "og:title", content: "Custom Print Inspiration — photoX" },
      {
        property: "og:description",
        content:
          "Explore a curated set of custom print ideas, then upload your own photo to make it yours.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  validateSearch: (
    search: Record<string, unknown>,
  ): { q?: string; category?: InspirationCategory } => {
    const q = typeof search["q"] === "string" && search["q"] ? (search["q"] as string) : undefined;
    const category =
      typeof search["category"] === "string" &&
      inspirationCategories.some((item) => item.key === search["category"])
        ? (search["category"] as InspirationCategory)
        : undefined;
    return { ...(q ? { q } : {}), ...(category ? { category } : {}) };
  },

  component: ShopPage,
});

function ShopPage() {
  const { q, category } = Route.useSearch();

  return (
    <div className="min-w-0 max-w-full bg-background text-foreground">
      <SiteNav variant="light" />
      <main className="min-w-0 max-w-full">
        <ShopCatalog query={q ?? ""} category={category} />
      </main>
      <SiteFooter />
    </div>
  );
}
