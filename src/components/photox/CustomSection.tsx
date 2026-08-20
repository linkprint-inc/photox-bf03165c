import { useCallback, useRef, useState } from "react";
import { customPrintExample, sizes } from "@/lib/photox-data";
import { Shell } from "./Section";

export function CustomSection() {
  const [pos, setPos] = useState(45);
  const ref = useRef<HTMLDivElement>(null);
  const dragPointer = useRef<number | null>(null);

  const move = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.max(4, Math.min(96, ((clientX - r.left) / r.width) * 100)));
  }, []);

  const endDrag = (pointerId: number) => {
    if (dragPointer.current === pointerId) dragPointer.current = null;
  };

  return (
    <Shell id="custom" className="pb-28 md:pb-40">
      <div className="grid gap-10 md:grid-cols-12 md:gap-8">
        <div
          ref={ref}
          className="relative aspect-[4/3] w-full touch-pan-y select-none overflow-hidden bg-secondary md:col-span-6"
          onPointerDown={(e) => {
            if (e.pointerType === "mouse" && e.button !== 0) return;
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
        >
          <img
            src={customPrintExample.sourceImage}
            alt={customPrintExample.sourceAlt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
          >
            <img
              src={customPrintExample.metalPrintImage}
              alt={customPrintExample.metalPrintAlt}
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

        <div className="md:col-span-6">
          <h2 className="px-serif text-[2.2rem] md:text-[2.9rem]">
            Your image.
            <br />
            Made for the wall.
          </h2>
          <p className="px-meta mt-6 max-w-[38ch] text-muted-foreground">
            Turn your photography, artwork or favourite image into a physical print.
          </p>

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            <div className="px-rule pt-4">
              <p className="px-label">Metal Prints</p>
              <p className="px-price mt-2">
                <span className="px-label mr-1 opacity-70">From</span>$79
              </p>
            </div>
            <div className="px-rule pt-4">
              <p className="px-label">Frameless Canvas</p>
              <p className="px-price mt-2">
                <span className="px-label mr-1 opacity-70">From</span>$69
              </p>
            </div>
          </div>

          <p className="px-label mt-10 text-muted-foreground">Available sizes</p>
          <ul className="mt-4 border-t border-hairline">
            {sizes.map((s) => (
              <li
                key={s.label}
                className="flex items-baseline justify-between border-b border-hairline py-3"
              >
                <span className="px-meta">{s.label}</span>
                <span className="px-price">${s.price}</span>
              </li>
            ))}
          </ul>

          <a href="/custom" className="px-label px-underline mt-8 inline-block">
            Upload your image →
          </a>
        </div>
      </div>
    </Shell>
  );
}
