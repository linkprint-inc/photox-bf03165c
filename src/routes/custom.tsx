import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import customOriginal from "@/assets/custom-original.jpg";
import customPrint from "@/assets/custom-print.jpg";
import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/photox/SiteNav";
import { SiteFooter } from "@/components/photox/SiteFooter";
import { Shell } from "@/components/photox/Section";
import { CustomBuilder } from "@/components/photox/custom/CustomBuilder";
import { CustomExtras } from "@/components/photox/custom/CustomExtras";
import type { ToolId } from "@/lib/image-tools";

const toolIds: ToolId[] = ["restore", "enhance", "text"];

const title = "Custom Prints — Your Image on Metal or Canvas | photoX";
const description =
  "Upload your photograph or artwork and make it a Metal Print or Frameless Canvas. Choose a size from 12 × 18\" to 30 × 40\", preview it in a room and add it to your bag. From $69.";

export const Route = createFileRoute("/custom")({
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
  validateSearch: (search: Record<string, unknown>): { tool?: ToolId } =>
    toolIds.includes(search["tool"] as ToolId) ? { tool: search["tool"] as ToolId } : {},
  component: CustomPage,
});



function CustomIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(46);

  const move = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.max(6, Math.min(94, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <Shell label="Custom prints" className="pt-[132px] pb-14 md:pt-[148px] md:pb-16">
      <div className="grid gap-10 md:grid-cols-12 md:items-end md:gap-8">
        <div className="md:col-span-5">
          <p className="px-label text-muted-foreground">Custom Prints</p>
          <h1 className="px-serif mt-4 text-[2.4rem] leading-[1.06] md:text-[3.25rem]">
            Your image.
            <br />
            Made for the wall.
          </h1>
          <p className="px-meta mt-5 max-w-[40ch] text-muted-foreground">
            Turn your photography, artwork or favourite image into a Metal Print or Frameless
            Canvas.
          </p>
          <p className="px-price mt-6">
            <span className="px-label mr-1 opacity-70">From</span>$69
          </p>
          <a href="#builder" className="px-label px-underline mt-8 inline-block">
            Start with your image ↓
          </a>
        </div>

        <div
          ref={ref}
          onMouseMove={(e) => move(e.clientX)}
          onTouchMove={(e) => move(e.touches[0]!.clientX)}
          className="relative aspect-[16/10] w-full touch-pan-y select-none overflow-hidden bg-secondary md:col-span-7"
        >
          <img
            src={customOriginal}
            alt="An original digital photograph before printing"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
            <img
              src={customPrint}
              alt="The same photograph finished as a physical print on a wall"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <span
            aria-hidden
            className="absolute inset-y-0 w-px bg-white/85"
            style={{ left: `${pos}%` }}
          />
          <span className="px-label absolute left-5 top-5 text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
            Digital image
          </span>
          <span className="px-label absolute right-5 top-5 text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
            Physical print
          </span>
        </div>
      </div>
    </Shell>
  );
}

function CustomPage() {
  const { tool } = Route.useSearch();
  return (
    <div className="bg-background text-foreground">
      <SiteNav variant="light" />
      <main>
        <CustomIntro />
        <CustomBuilder initialTool={tool} />
        <CustomExtras />
        <Shell className="pb-24">
          <p className="px-meta text-muted-foreground">
            Prefer to start from ready-made artwork?{" "}
            <Link to="/shop" className="px-underline text-foreground">
              Shop the collection →
            </Link>
          </p>
        </Shell>
      </main>
      <SiteFooter />
    </div>
  );
}
