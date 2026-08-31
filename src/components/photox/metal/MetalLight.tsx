import { useRef, useState } from "react";
import metalLight from "@/assets/metal-light.jpg";
import { Shell } from "../Section";

export function MetalLight() {
  const ref = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(0.35);

  const onMove = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setX(Math.max(0, Math.min(1, (clientX - r.left) / r.width)));
  };

  const pos = 12 + x * 70;

  return (
    <Shell label="The light test" className="pb-20 md:pb-28">
      <div className="grid gap-8 md:grid-cols-12 md:items-end">
        <div className="md:order-2 md:col-span-4">
          <h2 className="px-serif text-[2rem] md:text-[2.6rem]">See what light does.</h2>
          <p className="px-meta mt-5 max-w-[40ch] text-muted-foreground">
            A glossy surface responds to the room around it, changing subtly as daylight moves
            across the print.
          </p>
          <p className="px-label mt-8 text-muted-foreground">
            <span className="hidden md:inline">Move to see the finish</span>
            <span className="md:hidden">Swipe to see the finish</span>
          </p>
        </div>

        <div
          ref={ref}
          onMouseMove={(e) => onMove(e.clientX)}
          onTouchMove={(e) => onMove(e.touches[0]!.clientX)}
          className="relative aspect-[16/11] w-full touch-pan-y overflow-hidden bg-secondary md:order-1 md:col-span-8"
        >
          <img
            src={metalLight}
            width={1600}
            height={1104}
            loading="lazy"
            alt="Close-up of a glossy metal print with soft window light reflecting across its surface"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 motion-safe:transition-[background] motion-safe:duration-300"
            style={{
              background: `linear-gradient(102deg, transparent ${pos - 16}%, rgba(255,255,255,0.20) ${pos}%, rgba(255,255,255,0.05) ${pos + 8}%, transparent ${pos + 22}%)`,
            }}
          />
        </div>
      </div>
    </Shell>
  );
}
