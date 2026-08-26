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
import { CreatorReel } from "@/components/photox/video/CreatorReel";
import { CustomSection } from "@/components/photox/CustomSection";
import { PhotoTools } from "@/components/photox/PhotoTools";
import { HelpTopics } from "@/components/photox/HelpTopics";
import { FinalMoment } from "@/components/photox/FinalMoment";
import { SiteFooter } from "@/components/photox/SiteFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "photoX — Custom Prints from Your Photos" },
      {
        name: "description",
        content:
          "Turn your photos, artwork and personal moments into premium metal prints and frameless canvas, with simple tools to prepare, preview and order.",
      },
      { property: "og:title", content: "photoX — Custom Prints from Your Photos" },
      {
        property: "og:description",
        content:
          "Turn your photos, artwork and personal moments into premium metal prints and frameless canvas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="homepage w-full max-w-full min-w-0 overflow-x-clip bg-background text-foreground">
      <SiteNav />
      <main className="w-full max-w-full min-w-0">
        <Hero />
        <CommerceIndex />
        <ProductWall />
        <MetalInterruption />
        <SizeScene />
        <LargeFormat />
        <MaterialExplorer />
        <RoomSection />
        <CreatorReel />
        <CustomSection />
        <PhotoTools />
        <HelpTopics />
        <FinalMoment />
      </main>
      <SiteFooter />
    </div>
  );
}
