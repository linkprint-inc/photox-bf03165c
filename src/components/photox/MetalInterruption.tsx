import { useEffect, useRef, useState } from "react";
import metalDetail from "@/assets/metal-detail.jpg";
import { sizes } from "@/lib/photox-data";
import { Shell } from "./Section";

export function MetalInterruption() {
  const ref = useRef<HTMLDivElement>(null);
  const [light, setLight] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const p = 1 - (r.top + r.height / 2) / window.innerHeight;
      setLight(Math.max(0, Math.min(1, p)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Shell id="metal" className="pb-28 md:pb-40">
      <div className="grid gap-10 md:grid-cols-12 md:gap-8">
        <div
          ref={ref}
          className="relative aspect-[4/3] overflow-hidden bg-secondary md:col-span-7 lg:col-span-8"
        >
          <img
            src={metalDetail}
            width={1440}
            height={1088}
            loading="lazy"
            alt="Close crop of a gloss aluminium metal print showing surface reflection and the thin rigid edge"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 transition-opacity duration-500"
            style={{
              opacity: 0.35 + light * 0.35,
              background: `linear-gradient(${100 + light * 26}deg, transparent ${18 + light * 22}%, rgba(255,255,255,0.22) ${34 + light * 22}%, transparent ${58 + light * 20}%)`,
            }}
          />
        </div>

        <div className="md:col-span-5 lg:col-span-4">
          <h2 className="px-serif text-[2.2rem] md:text-[2.8rem]">Why metal?</h2>

          <ul className="px-rule mt-8">
            {["Glossy surface", "Crisp detail", "Deep colour", "Thin rigid profile"].map((f) => (
              <li key={f} className="px-meta border-b border-hairline py-3">
                {f}
              </li>
            ))}
          </ul>

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

          <div className="mt-8 flex items-baseline justify-between gap-6">
            <p className="px-price">
              <span className="px-label mr-1 opacity-70">From</span>$79
            </p>
            <a href="#shop" className="px-label px-underline">
              Explore metal →
            </a>
          </div>
        </div>
      </div>
    </Shell>
  );
}
