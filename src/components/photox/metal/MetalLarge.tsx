import metalLarge from "@/assets/metal-large.jpg";
import { largeFormatPrice, largeFormatSize } from "@/lib/metal-data";
import { Shell } from "../Section";

export function MetalLarge() {
  return (
    <Shell label="Large format" className="pb-16 md:pb-20">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary md:aspect-[21/9]">
        <img
          src={metalLarge}
          width={1920}
          height={912}
          loading="lazy"
          alt="A very large metal print of a blue-hour cityscape on a long wall in a modern apartment"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div className="px-rule mt-6 grid gap-6 pt-6 md:grid-cols-12 md:items-baseline">
        <h2 className="px-serif text-[2rem] md:col-span-4 md:text-[2.6rem]">Go big.</h2>
        <p className="px-meta max-w-[46ch] text-muted-foreground md:col-span-4">
          Metal’s rigid surface keeps large-format artwork clean, crisp and visually light on the
          wall.
        </p>
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 md:col-span-4">
          <p className="px-price">
            <span className="px-label mr-3 opacity-70">Metal Print</span>
            {largeFormatSize}
            <span className="px-label ml-3 mr-1 opacity-70">From</span>${largeFormatPrice}
          </p>
          <a href="/shop?q=metal" className="px-label px-underline">
            Shop large format →
          </a>
        </div>
      </div>
    </Shell>
  );
}
