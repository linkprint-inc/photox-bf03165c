import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { useSearchUI } from "@/lib/search-ui";
import photoxMark from "@/assets/photox-mark.png";

const center = [
  { label: "Shop", href: "/shop" },
  { label: "Metal", href: "/metal" },
  { label: "Custom", href: "/custom" },
  { label: "About", href: "/about" },
];

export function SiteNav({
  variant = "hero",
  onSearch,
}: {
  variant?: "hero" | "light";
  onSearch?: () => void;
}) {
  const [hidden, setHidden] = useState(false);
  const [overHero, setOverHero] = useState(variant === "hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const headerRef = useRef<HTMLElement>(null);
  const { bagCount, hydrated, openDrawer } = useStore();
  const { openSearch } = useSearchUI();
  const handleSearch = onSearch ?? openSearch;

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
  }, [variant]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("pointerdown", closeOnOutsidePointer);
    };
  }, [menuOpen]);

  const tone = menuOpen ? "text-ink" : overHero ? "text-white" : "text-ink";

  return (
    <header
      ref={headerRef}
      className={[
        "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,color] duration-[520ms] max-md:duration-[220ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]",
        hidden ? "-translate-y-full" : "translate-y-0",
        menuOpen ? "bg-paper" : overHero ? "bg-transparent" : "bg-paper/95",
        tone,
      ].join(" ")}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex w-full min-w-0 flex-nowrap max-w-[1440px] items-center justify-between gap-4 px-6 py-5 md:gap-6 md:px-10"
      >
        <a
          href="/"
          className="px-label px-underline px-wordmark flex shrink-0 items-center gap-2 text-[18px] font-bold tracking-[0.12em] normal-case"
        >
          <img
            src={photoxMark}
            alt=""
            aria-hidden
            className={`h-6 w-6 shrink-0 object-contain ${overHero ? "invert" : ""}`}
          />
          photoX
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

        <ul className="hidden shrink-0 items-center gap-5 whitespace-nowrap md:flex">
          <li>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                handleSearch();
              }}
              className="px-label px-underline opacity-90"
            >
              Search
            </button>
          </li>
          <li>
            <Link to="/account" className="px-label px-underline opacity-90">
              Account
            </Link>
          </li>
          <li>
            <button
              type="button"
              onClick={openDrawer}
              className="px-label px-underline whitespace-nowrap"
            >
              Bag ({hydrated ? bagCount : 0})
            </button>
          </li>
        </ul>

        <div className="ml-auto flex shrink-0 items-center gap-5 whitespace-nowrap md:hidden">
          <button
            type="button"
            onClick={openDrawer}
            className="px-label px-underline whitespace-nowrap"
          >
            Bag ({hydrated ? bagCount : 0})
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="px-label px-underline px-menu-trigger whitespace-nowrap"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </nav>
      {!overHero && !menuOpen && <div className="px-rule" />}
      {menuOpen ? (
        <nav
          id="mobile-navigation"
          aria-label="Mobile primary"
          className="bg-paper text-ink md:hidden"
        >
          <ul className="mx-auto grid max-w-[1440px] grid-cols-2 gap-x-6 gap-y-5 px-6 pb-7 pt-5">
            {center.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-label px-underline"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                to="/account"
                onClick={() => setMenuOpen(false)}
                className="px-label px-underline"
              >
                Account
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  handleSearch();
                }}
                className="px-label px-underline"
              >
                Search
              </button>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
