import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/photox/SiteNav";
import { SiteFooter } from "@/components/photox/SiteFooter";
import { MetalHero } from "@/components/photox/metal/MetalHero";
import { MetalIndex } from "@/components/photox/metal/MetalIndex";
import { MetalLight } from "@/components/photox/metal/MetalLight";
import { MetalSize } from "@/components/photox/metal/MetalSize";
import { MetalSurface } from "@/components/photox/metal/MetalSurface";
import { MetalSpaces } from "@/components/photox/metal/MetalSpaces";
import { MetalMotion } from "@/components/photox/metal/MetalMotion";
import { MetalLarge } from "@/components/photox/metal/MetalLarge";
import { MetalArrives } from "@/components/photox/metal/MetalArrives";
import { MetalHelp } from "@/components/photox/metal/MetalHelp";

const title = "Metal Prints — Glossy, Luminous Wall Art | photoX";
const description =
  "Learn about photoX metal prints: glossy surface, crisp detail, luminous colour and a thin rigid profile. Then create a print from your own photo.";

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
  return (
    <div className="bg-background text-foreground">
      <SiteNav variant="hero" />
      <main>
        <MetalHero />
        <MetalIndex />

        <MetalLight />
        <MetalSize />
        <MetalSurface />
        <MetalMotion />
        <MetalSpaces />
        <MetalLarge />
        <MetalArrives />

        <MetalHelp />
      </main>
      <SiteFooter />
    </div>
  );
}
