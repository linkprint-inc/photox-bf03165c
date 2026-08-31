import { metalFrom } from "@/lib/metal-data";
import { Shell } from "../Section";

export function MetalCompare() {
  return (
    <Shell label="Metal Print" className="pb-16 md:pb-20">
      <div className="px-rule pt-6">
        <p className="px-label">Metal Print</p>
        <p className="px-serif mt-5 text-[1.5rem] leading-[1.5] md:text-[1.75rem]">
          Glossy · luminous · crisp · rigid
        </p>
        <p className="px-meta mt-8 max-w-[40ch] text-muted-foreground">
          Made for photography, vivid colour and high-detail artwork.
        </p>
        <div className="mt-10 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
          <p className="px-price">
            <span className="px-label mr-1 opacity-70">From</span>${metalFrom}
          </p>
          <a href="/custom" className="px-label px-underline">
            Create your print →
          </a>
        </div>
      </div>
    </Shell>
  );
}
