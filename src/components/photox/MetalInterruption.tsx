import { useEffect, useRef, useState } from "react";
import metalDetail from "@/assets/metal-detail.jpg";

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
    <section id="metal" className="mx-auto max-w-[1600px] px-6 pb-28 md:px-10 md:pb-40">
      <div className="grid gap-10 md:grid-cols-[1.9fr_1fr] md:items-end md:gap-16">
        <div ref={ref} className="relative overflow-hidden bg-secondary">
          <img
            src={metalDetail}
            width={1440}
            height={1088}
            loading="lazy"
            alt="Close crop of a gloss aluminium metal print showing surface reflection and the thin rigid edge"
            className="h-full w-full object-cover"
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

        <div className="pb-2">
          <h2 className="px-serif text-[2.2rem] md:text-[2.8rem]">Why metal?</h2>
          <p className="px-meta mt-4 max-w-[30ch] text-muted-foreground">
            Light becomes part of the image.
          </p>

          <ul className="px-rule mt-10">
            {["Glossy surface", "Crisp detail", "Deep colour", "Rigid profile"].map((f) => (
              <li key={f} className="px-meta border-b border-hairline py-3">
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex items-center justify-between gap-6">
            <p className="px-meta">From $119</p>
            <a href="#shop" className="px-label px-underline">
              Explore metal →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
