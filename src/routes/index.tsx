import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/photox/SiteNav";
import { Hero } from "@/components/photox/Hero";
import { CommerceIndex } from "@/components/photox/CommerceIndex";
import { ProductWall } from "@/components/photox/ProductWall";
import { MetalInterruption } from "@/components/photox/MetalInterruption";
import { SizeScene } from "@/components/photox/SizeScene";
import { LargeFormat } from "@/components/photox/LargeFormat";
import { MaterialExplorer } from "@/components/photox/MaterialExplorer";
import { RoomSection } from "@/components/photox/RoomSection";
import { CustomSection } from "@/components/photox/CustomSection";
import { PhotoTools } from "@/components/photox/PhotoTools";
import { FinalMoment } from "@/components/photox/FinalMoment";
import { SiteFooter } from "@/components/photox/SiteFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PhotoX — Metal Prints & Frameless Canvas Wall Art" },
      {
        name: "description",
        content:
          "Premium metal prints, frameless canvas and custom wall art. Shop by artwork, material and size, or print your own image.",
      },
      { property: "og:title", content: "PhotoX — Metal Prints & Frameless Canvas Wall Art" },
      {
        property: "og:description",
        content:
          "Premium metal prints, frameless canvas and custom wall art. Shop by artwork, material and size, or print your own image.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="bg-background text-foreground">
      <SiteNav />
      <main>
        <Hero />
        <CommerceIndex />
        <ProductWall />
        <MetalInterruption />
        <SizeScene />
        <LargeFormat />
        <MaterialExplorer />
        <RoomSection />
        <CustomSection />
        <PhotoTools />
        <FinalMoment />
      </main>
      <SiteFooter />
    </div>
  );
}
