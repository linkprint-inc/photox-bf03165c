import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/photox/SiteNav";
import { SiteFooter } from "@/components/photox/SiteFooter";
import { Shell, SectionHead } from "@/components/photox/Section";
import { ShopProductCard } from "@/components/photox/shop/ShopProductCard";
import { MetalHero } from "@/components/photox/metal/MetalHero";
import { MetalIndex } from "@/components/photox/metal/MetalIndex";
import { MetalLight } from "@/components/photox/metal/MetalLight";
import { MetalSize } from "@/components/photox/metal/MetalSize";
import { MetalSurface } from "@/components/photox/metal/MetalSurface";
import { MetalSpaces } from "@/components/photox/metal/MetalSpaces";
import { MetalLarge } from "@/components/photox/metal/MetalLarge";
import { MetalCompare } from "@/components/photox/metal/MetalCompare";
import { MetalArrives } from "@/components/photox/metal/MetalArrives";
import { MetalHelp } from "@/components/photox/metal/MetalHelp";
import { metalProducts } from "@/lib/metal-data";

const title = "Metal Prints — Glossy, Luminous Wall Art | photoX";
const description =
  "Metal prints from photoX: glossy, luminous and exceptionally crisp. See the finish, compare sizes from 12 × 18\" to 30 × 40\", and shop metal artwork from $79.";

export const Route = createFileRoute("/metal")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MetalPage,
});

function MetalPage() {
  const first = metalProducts.slice(0, 8);

  return (
    <div className="bg-background text-foreground">
      <SiteNav variant="hero" />
      <main>
        <MetalHero />
        <MetalIndex />

        <Shell id="metal-shop" label="Shop metal art" className="pb-20 md:pb-28">
          <SectionHead title="Shop metal art">
            <a href="/shop?q=metal" className="px-label px-underline">
              View all →
            </a>
          </SectionHead>
          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:gap-x-8 lg:grid-cols-4">
            {first.map((p) => (
              <ShopProductCard key={p.id} product={p} view="grid" />
            ))}
          </div>
        </Shell>

        <MetalLight />
        <MetalSize />
        <MetalSurface />
        <MetalSpaces />
        <MetalLarge />
        <MetalCompare />
        <MetalArrives />


        <MetalHelp />
      </main>
      <SiteFooter />
    </div>
  );
}
