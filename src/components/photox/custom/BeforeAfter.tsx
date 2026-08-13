import { useRef, useState } from "react";

export function BeforeAfter({ before, after }: { before: string; after: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);

  const move = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.max(4, Math.min(96, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div
      ref={ref}
      onMouseMove={(e) => move(e.clientX)}
      onTouchMove={(e) => move(e.touches[0]!.clientX)}
      className="relative aspect-[4/3] w-full touch-pan-y select-none overflow-hidden bg-secondary"
    >
      <img src={before} alt="Before" className="absolute inset-0 h-full w-full object-contain" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
        <img src={after} alt="After" className="absolute inset-0 h-full w-full object-contain" />
      </div>
      <span aria-hidden className="absolute inset-y-0 w-px bg-white/85" style={{ left: `${pos}%` }} />
      <span className="px-label absolute left-4 top-4 text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]">
        Before
      </span>
      <span className="px-label absolute right-4 top-4 text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]">
        After
      </span>
      <label className="sr-only" htmlFor="ba-range">
        Compare before and after
      </label>
      <input
        id="ba-range"
        type="range"
        min={4}
        max={96}
        value={Math.round(pos)}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-x-0 bottom-4 mx-auto w-[70%] cursor-ew-resize appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-px [&::-webkit-slider-runnable-track]:bg-white/60 [&::-webkit-slider-thumb]:mt-[-7px] [&::-webkit-slider-thumb]:h-[15px] [&::-webkit-slider-thumb]:w-[15px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white"
      />
    </div>
  );
}
