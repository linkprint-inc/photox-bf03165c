import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { useSearchUI } from "@/lib/search-ui";
import photoxMark from "@/assets/photox-mark.png";

const center = [
  { label: "Metal", href: "/metal" },
  { label: "Community", href: "/community" },
  { label: "About", href: "/about" },
];

const createLinks = [
  { label: "Landscape", href: "/products/north-sea" },
  { label: "Portraits", href: "/products/study-in-olive" },
  { label: "Pets", href: "/products/canopy" },
  { label: "Family", href: "/shop?category=family" },
];

const landscapeHref = "/products/north-sea";

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
  const [createOpen, setCreateOpen] = useState(false);
  const lastY = useRef(0);
  const createOpenTimer = useRef<number | undefined>(undefined);
  const createCloseTimer = useRef<number | undefined>(undefined);
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
    if (!menuOpen && !createOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setCreateOpen(false);
      }
    };
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
        setCreateOpen(false);
      }
    };
    if (menuOpen) document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => {
      if (menuOpen) document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("pointerdown", closeOnOutsidePointer);
    };
  }, [menuOpen, createOpen]);

  useEffect(
    () => () => {
      if (createOpenTimer.current !== undefined) window.clearTimeout(createOpenTimer.current);
      if (createCloseTimer.current !== undefined) window.clearTimeout(createCloseTimer.current);
    },
    [],
  );

  const openCreateMenu = () => {
    if (createCloseTimer.current !== undefined) window.clearTimeout(createCloseTimer.current);
    if (createOpen) return;
    if (createOpenTimer.current !== undefined) window.clearTimeout(createOpenTimer.current);
    createOpenTimer.current = window.setTimeout(() => {
      createOpenTimer.current = undefined;
      setCreateOpen(true);
    }, 120);
  };

  const closeCreateMenu = () => {
    if (createOpenTimer.current !== undefined) window.clearTimeout(createOpenTimer.current);
    if (createCloseTimer.current !== undefined) window.clearTimeout(createCloseTimer.current);
    createCloseTimer.current = window.setTimeout(() => {
      createCloseTimer.current = undefined;
      setCreateOpen(false);
    }, 210);
  };

  const tone = menuOpen || createOpen ? "text-ink" : overHero ? "text-white" : "text-ink";

  return (
    <header
      ref={headerRef}
      className={[
        "fixed inset-x-0 top-0 z-50 border-b border-hairline transition-[transform,background-color,color] duration-[520ms] max-md:duration-[220ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]",
        hidden ? "-translate-y-full" : "translate-y-0",
        menuOpen || createOpen ? "bg-paper" : overHero ? "bg-transparent" : "bg-paper/95",
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
            className={`h-6 w-6 shrink-0 object-contain ${overHero && !menuOpen && !createOpen ? "invert" : ""}`}
          />
          photoX
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          <li className="relative" onPointerEnter={openCreateMenu} onPointerLeave={closeCreateMenu}>
            <a
              href={landscapeHref}
              aria-controls="create-navigation"
              className="px-label px-underline opacity-90"
            >
              Create
            </a>
            <div
              id="create-navigation"
              className={[
                "absolute left-0 top-[calc(100%+26px)] w-[328px] text-ink transition-[opacity,transform] duration-200 before:absolute before:bottom-full before:left-0 before:h-[27px] before:w-full before:content-['']",
                createOpen
                  ? "pointer-events-auto translate-y-0 opacity-100"
                  : "pointer-events-none -translate-y-1 opacity-0",
              ].join(" ")}
            >
              <ul className="border border-foreground/20 bg-paper shadow-[0_4px_10px_rgba(30,25,20,0.018)]">
                {createLinks.map((item) => (
                  <li key={item.label} className="border-b border-foreground/10 last:border-b-0">
                    <a
                      href={item.href}
                      onClick={() => setCreateOpen(false)}
                      className="group flex h-[52px] items-center justify-between px-5"
                    >
                      <span className="px-label transition-transform duration-200 group-hover:translate-x-[5px] group-focus-visible:translate-x-[5px]">
                        {item.label}
                      </span>
                      <span
                        aria-hidden
                        className="px-label transition-transform duration-200 group-hover:translate-x-[3px] group-focus-visible:translate-x-[3px]"
                      >
                        →
                      </span>
                    </a>
                  </li>
                ))}
                <li className="border-t border-foreground/10 px-5 py-4">
                  <a
                    href="/custom"
                    onClick={() => setCreateOpen(false)}
                    className="px-meta px-underline text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Start with your photo →
                  </a>
                </li>
              </ul>
            </div>
          </li>
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
      {(!overHero || createOpen) && !menuOpen && <div className="px-rule" />}
      {menuOpen ? (
        <nav
          id="mobile-navigation"
          aria-label="Mobile primary"
          className="bg-paper text-ink md:hidden"
        >
          <ul className="mx-auto grid max-w-[1440px] grid-cols-2 gap-x-6 gap-y-5 px-6 pb-7 pt-5">
            <li>
              <a
                href={landscapeHref}
                onClick={() => setMenuOpen(false)}
                className="px-label px-underline"
              >
                Create
              </a>
            </li>
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
            <li className="col-span-2 border-t border-hairline pt-4">
              <p className="px-label text-muted-foreground">Create directions</p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-3">
                {createLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="px-meta px-underline"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
              <a
                href="/custom"
                onClick={() => setMenuOpen(false)}
                className="px-meta px-underline mt-4 inline-block text-muted-foreground"
              >
                Start with your photo →
              </a>
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
