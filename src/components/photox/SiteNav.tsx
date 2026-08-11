import { useEffect, useRef, useState } from "react";

const center = [
  { label: "Shop", href: "#shop" },
  { label: "Metal", href: "#metal" },
  { label: "Canvas", href: "#surface" },
  { label: "Custom", href: "#custom" },
  { label: "Photo Tools", href: "#tools" },
];

export function SiteNav({ variant = "hero" }: { variant?: "hero" | "light" }) {
  const [hidden, setHidden] = useState(false);
  const [overHero, setOverHero] = useState(variant === "hero");
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const hero = document.getElementById("hero");
      const heroBottom = hero ? hero.offsetHeight - 80 : 600;
      setOverHero(variant === "hero" && y < heroBottom);
      setHidden(y > lastY.current && y > 120);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tone = overHero ? "text-white" : "text-ink";

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,color] duration-[520ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]",
        hidden ? "-translate-y-full" : "translate-y-0",
        overHero ? "bg-transparent" : "bg-paper/95",
        tone,
      ].join(" ")}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-6 py-5 md:px-10"
      >
        <a href="#hero" className="px-label px-underline text-[0.8rem] tracking-[0.3em]">
          PHOTX
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {center.map((item) => (
            <li key={item.label}>
              <a href={item.href} className="px-label px-underline opacity-90">
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <ul className="flex items-center gap-5">
          <li className="hidden sm:block">
            <button type="button" className="px-label px-underline opacity-90">
              Search
            </button>
          </li>
          <li className="hidden sm:block">
            <button type="button" className="px-label px-underline opacity-90">
              Account
            </button>
          </li>
          <li>
            <button type="button" className="px-label px-underline">
              Bag (0)
            </button>
          </li>
        </ul>
      </nav>
      {!overHero && <div className="px-rule" />}
    </header>
  );
}
