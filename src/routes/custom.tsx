import { useRef, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/photox/SiteNav";
import { SiteFooter } from "@/components/photox/SiteFooter";
import { Shell } from "@/components/photox/Section";
import { CustomBuilder } from "@/components/photox/custom/CustomBuilder";
import { CustomExtras } from "@/components/photox/custom/CustomExtras";
import type { ToolId } from "@/lib/image-tools";
import { customPrintExample } from "@/lib/photox-data";
import { productBySlug } from "@/lib/product-detail";
import { sizeSteps } from "@/lib/shop-data";
import type { BagMaterial } from "@/lib/store";

const toolIds: ToolId[] = ["restore", "enhance", "text"];

const title = "Custom Prints — Your Image on Metal | photoX";
const description =
  'Upload your photograph or artwork to make a Metal Print. Choose a size from 12 × 18" to 30 × 40", preview it in a room and add it to your bag. From $79.';

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
  validateSearch: (
    search: Record<string, unknown>,
  ): {
    tool?: ToolId;
    inspiration?: string;
    material?: BagMaterial;
    size?: number;
    prepare?: boolean;
  } => {
    const size = Number(search["size"]);
    return {
      ...(toolIds.includes(search["tool"] as ToolId) ? { tool: search["tool"] as ToolId } : {}),
      ...(typeof search["inspiration"] === "string" ? { inspiration: search["inspiration"] } : {}),
      ...(search["material"] === "metal" ? { material: "metal" as const } : {}),
      ...(Number.isInteger(size) && size >= 0 && size < sizeSteps.length ? { size } : {}),
      ...(search["prepare"] === true || search["prepare"] === "true" ? { prepare: true } : {}),
    };
  },
  component: CustomPage,
});

function CustomIntro({ inspiration }: { inspiration?: string | undefined }) {
  const ref = useRef<HTMLDivElement>(null);
  const dragPointer = useRef<number | null>(null);
  const [pos, setPos] = useState(50);
  const [interacted, setInteracted] = useState(false);

  const move = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.max(6, Math.min(94, ((clientX - r.left) / r.width) * 100)));
  };

  const adjust = (amount: number) =>
    setPos((current) => Math.max(6, Math.min(94, current + amount)));

  const endDrag = (pointerId: number) => {
    if (dragPointer.current === pointerId) dragPointer.current = null;
  };

  return (
    <Shell label="Custom prints" className="pt-[108px] pb-10 md:pt-[118px] md:pb-12">
      <div className="grid gap-10 md:grid-cols-12 md:items-end md:gap-8">
        <div className="md:col-span-5">
          <p className="px-label text-muted-foreground">
            {inspiration ? "Your starting point is ready" : "Custom Prints"}
          </p>
          <h1 className="px-serif mt-4 text-[2.4rem] leading-[1.06] md:text-[3.25rem]">
            Your image.
            <br />
            Made for the wall.
          </h1>
          <p className="px-meta mt-5 max-w-[40ch] text-muted-foreground">
            {inspiration
              ? "Use this look as a visual reference, then upload your own photo to make it personal."
              : "Turn your photography, artwork or favourite image into a Metal Print."}
          </p>
          <p className="px-price mt-6">
            <span className="px-label mr-1 opacity-70">From</span>$79
          </p>
          <a href="#builder" className="px-label px-underline mt-8 inline-block">
            Start with your image ↓
          </a>
        </div>

        <div
          ref={ref}
          onPointerEnter={() => setInteracted(true)}
          onPointerDown={(e) => {
            if (e.pointerType === "mouse" && e.button !== 0) return;
            setInteracted(true);
            dragPointer.current = e.pointerId;
            e.currentTarget.setPointerCapture(e.pointerId);
            move(e.clientX);
          }}
          onPointerMove={(e) => {
            if (dragPointer.current === e.pointerId) move(e.clientX);
          }}
          onPointerUp={(e) => endDrag(e.pointerId)}
          onPointerCancel={(e) => endDrag(e.pointerId)}
          onLostPointerCapture={(e) => endDrag(e.pointerId)}
          className="relative aspect-[16/10] w-full cursor-ew-resize touch-pan-y select-none overflow-hidden bg-secondary md:col-span-7"
        >
          <img
            src={customPrintExample.sourceImage}
            alt={customPrintExample.sourceAlt}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
            <img
              src={customPrintExample.metalPrintImage}
              alt={customPrintExample.metalPrintAlt}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <span
            aria-hidden
            className="absolute inset-y-0 w-px bg-white/85"
            style={{ left: `${pos}%` }}
          />
          <button
            type="button"
            role="slider"
            aria-label="Drag to compare digital image and physical print"
            aria-valuemin={6}
            aria-valuemax={94}
            aria-valuenow={Math.round(pos)}
            aria-valuetext={`${Math.round(pos)} percent digital image visible`}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                setInteracted(true);
                adjust(-2);
              }
              if (event.key === "ArrowRight") {
                event.preventDefault();
                setInteracted(true);
                adjust(2);
              }
              if (event.key === "Home") {
                event.preventDefault();
                setInteracted(true);
                setPos(6);
              }
              if (event.key === "End") {
                event.preventDefault();
                setInteracted(true);
                setPos(94);
              }
            }}
            className="absolute top-1/2 z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-foreground/15 bg-paper/90 text-foreground shadow-[0_2px_10px_rgba(30,25,20,0.08)] outline-none transition-transform duration-200 focus-visible:ring-1 focus-visible:ring-foreground cursor-ew-resize"
            style={{ left: `${pos}%` }}
          >
            <ArrowLeftRight
              aria-hidden
              size={19}
              strokeWidth={1.5}
              className={!interacted ? "px-drag-hint motion-reduce:animate-none" : ""}
            />
          </button>
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
  const { tool, inspiration, material, size, prepare } = Route.useSearch();
  const startingPoint = inspiration ? productBySlug(inspiration)?.name : undefined;
  return (
    <div className="bg-background text-foreground">
      <SiteNav variant="light" />
      <main>
        <CustomIntro inspiration={inspiration} />
        <CustomBuilder
          initialTool={tool}
          initialConfiguration={{ material, sizeIndex: size, startingPoint }}
          startInEditor={prepare}
        />
        <CustomExtras />
      </main>
      <SiteFooter />
    </div>
  );
}
