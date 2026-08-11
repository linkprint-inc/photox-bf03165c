import { useCallback, useRef, useState } from "react";
import customOriginal from "@/assets/custom-original.jpg";
import customPrint from "@/assets/custom-print.jpg";

export function CustomSection() {
  const [pos, setPos] = useState(45);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const move = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.max(4, Math.min(96, ((clientX - r.left) / r.width) * 100)));
  }, []);

  return (
    <section id="custom" className="mx-auto max-w-[1600px] px-6 pb-28 md:px-10 md:pb-40">
      <div className="grid gap-10 md:grid-cols-[1fr_20rem] md:items-end md:gap-16">
        <div
          ref={ref}
          className="relative aspect-[7/5] w-full touch-pan-y select-none overflow-hidden bg-secondary"
          onMouseMove={(e) => dragging.current && move(e.clientX)}
          onMouseDown={(e) => {
            dragging.current = true;
            move(e.clientX);
          }}
          onMouseUp={() => (dragging.current = false)}
          onMouseLeave={() => (dragging.current = false)}
          onTouchStart={(e) => move(e.touches[0]!.clientX)}
          onTouchMove={(e) => move(e.touches[0]!.clientX)}
        >
          <img
            src={customOriginal}
            alt="An original digital photograph of two walkers on a dune ridge"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
          >
            <img
              src={customPrint}
              alt="The same photograph finished as a gloss metal print hanging on a wall"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div
            className="absolute inset-y-0 w-px bg-white/85"
            style={{ left: `${pos}%` }}
            aria-hidden
          />

          <label className="sr-only" htmlFor="custom-reveal">
            Reveal the finished print
          </label>
          <input
            id="custom-reveal"
            type="range"
            min={4}
            max={96}
            value={Math.round(pos)}
            onChange={(e) => setPos(Number(e.target.value))}
            className="absolute inset-x-0 bottom-4 mx-auto w-[70%] cursor-ew-resize appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-px [&::-webkit-slider-runnable-track]:bg-white/60 [&::-webkit-slider-thumb]:mt-[-7px] [&::-webkit-slider-thumb]:h-[15px] [&::-webkit-slider-thumb]:w-[15px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white"
          />

          <span className="px-label absolute left-5 top-5 text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
            Your image
          </span>
          <span className="px-label absolute right-5 top-5 text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
            Metal print
          </span>
        </div>

        <div className="pb-2">
          <h2 className="px-serif text-[2.2rem] md:text-[2.9rem]">
            Your image.
            <br />
            Made for the wall.
          </h2>
          <p className="px-meta mt-6 max-w-[34ch] text-muted-foreground">
            Print your photography, artwork or favourite image on metal or frameless canvas.
          </p>
          <p className="px-meta mt-8">Custom prints from $89</p>
          <a href="#tools" className="px-label px-underline mt-6 inline-block">
            Upload your image →
          </a>
        </div>
      </div>
    </section>
  );
}
