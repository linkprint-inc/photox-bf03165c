import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchUI } from "@/lib/search-ui";

type QuickFindItem = { label: string; detail: string; href: string; terms: string[] };

const quickFindItems: QuickFindItem[] = [
  {
    label: "Create your print",
    detail: "Start with your own photo",
    href: "/products/north-sea",
    terms: ["create", "custom", "upload", "print", "your photo"],
  },
  {
    label: "Landscape",
    detail: "A landscape artwork to customize",
    href: "/products/north-sea",
    terms: ["landscape", "scenery", "nature"],
  },
  {
    label: "Portraits",
    detail: "Portrait artwork and inspiration",
    href: "/products/study-in-olive",
    terms: ["portrait", "portraits", "people"],
  },
  {
    label: "Pets",
    detail: "Pet print inspiration",
    href: "/products/canopy",
    terms: ["pet", "pets", "dog", "cat"],
  },
  {
    label: "Family",
    detail: "Family print inspiration",
    href: "/shop?category=family",
    terms: ["family", "gift", "people"],
  },
  {
    label: "Metal prints",
    detail: "Material, finish and how metal prints are made",
    href: "/metal",
    terms: ["metal", "metal print", "finish", "surface", "gloss", "materials"],
  },
  {
    label: "Size guide",
    detail: "Compare print sizes in a room",
    href: "/metal#metal-size",
    terms: [
      "size",
      "size guide",
      "dimensions",
      "12 x 18",
      "16 x 24",
      "20 x 30",
      "24 x 36",
      "30 x 40",
    ],
  },
  {
    label: "Shipping & delivery",
    detail: "Production, delivery and tracking",
    href: "/shipping-policy",
    terms: ["shipping", "delivery", "ship", "track order"],
  },
  {
    label: "Returns",
    detail: "Refund and return policy",
    href: "/refund-policy",
    terms: ["return", "returns", "refund", "exchange"],
  },
  {
    label: "FAQ",
    detail: "Answers about prints, files and ordering",
    href: "/#help",
    terms: ["faq", "help", "question", "questions"],
  },
  {
    label: "Community",
    detail: "Customer stories and real homes",
    href: "/community",
    terms: ["community", "stories", "customer", "reviews"],
  },
  {
    label: "Reviews",
    detail: "Customer reviews for a photoX print",
    href: "/products/north-sea#reviews",
    terms: ["reviews", "review", "rating", "ratings"],
  },
  {
    label: "About photoX",
    detail: "Our print experience and approach",
    href: "/about",
    terms: ["about", "photox", "photo x", "company"],
  },
  {
    label: "Materials",
    detail: "The metal print material and finish",
    href: "/about#material-matters",
    terms: ["material", "materials", "metal", "finish", "surface"],
  },
  {
    label: "Print process",
    detail: "Prepare and make your print",
    href: "/products/north-sea",
    terms: ["process", "print process", "production", "how it works"],
  },
  {
    label: "Restore old photo",
    detail: "Prepare a faded or damaged image",
    href: "/products/north-sea",
    terms: ["restore", "restoration", "old photo", "repair"],
  },
  {
    label: "Enhance resolution",
    detail: "Prepare an image for a larger print",
    href: "/products/north-sea",
    terms: ["enhance", "resolution", "quality", "upscale"],
  },
  {
    label: "Add text",
    detail: "Add a name, date or caption to a print",
    href: "/products/north-sea",
    terms: ["text", "caption", "date", "typography", "add text"],
  },
];

const quickLinks = [
  "Create your print",
  "Landscape",
  "Portraits",
  "Pets",
  "Family",
  "Metal prints",
  "Size guide",
  "Shipping & delivery",
  "Returns",
  "Community",
];

function searchableText(item: QuickFindItem) {
  return [item.label, item.detail, ...item.terms].join(" ").toLowerCase().replaceAll("×", "x");
}

export function GlobalSearch() {
  const { open, closeSearch } = useSearchUI();
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    const body = document.body;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && closeSearch();
    window.addEventListener("keydown", onKeyDown);
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => {
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      body.style.overflow = previous.overflow;
      window.scrollTo(0, scrollY);
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(timer);
    };
  }, [open, closeSearch]);

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const term = q.trim().toLowerCase().replaceAll("×", "x");
  const matches = useMemo(() => {
    if (!term) return [];
    const tokens = term.split(/\s+/).filter(Boolean);
    return quickFindItems.filter((item) => {
      const text = searchableText(item);
      return text.includes(term) || tokens.every((token) => text.includes(token));
    });
  }, [term]);
  const links = quickLinks.map((label) => quickFindItems.find((item) => item.label === label)!);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-paper">
      <div className="mx-auto min-h-screen max-w-[980px] px-6 pb-12 pt-5 md:px-10 md:pb-16 md:pt-6">
        <div className="flex items-center justify-between">
          <span className="px-label">Search</span>
          <button
            type="button"
            onClick={closeSearch}
            aria-label="Close search"
            className="-mr-3 flex h-11 w-11 items-center justify-center text-[1.1rem] leading-none transition-opacity hover:opacity-60"
          >
            ×
          </button>
        </div>
        <p className="px-meta mt-8 text-muted-foreground">What are you looking for?</p>
        <form
          className={`mt-3 border-b transition-colors duration-300 ${focused ? "border-foreground/70" : "border-foreground/25"}`}
          onSubmit={(event) => {
            event.preventDefault();
            if (matches[0]) window.location.assign(matches[0].href);
          }}
        >
          <input
            ref={inputRef}
            value={q}
            onChange={(event) => setQ(event.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search photoX..."
            aria-label="Search photoX"
            className="px-serif w-full bg-transparent py-3 text-[1.25rem] text-foreground outline-none placeholder:text-foreground/40 placeholder:transition-colors placeholder:duration-300 focus:placeholder:text-foreground/75 md:text-[1.7rem]"
          />
        </form>
        <div key={term || "quick-links"} className="px-fade mt-12 md:mt-16">
          {term ? (
            <section aria-label="Search results">
              <p className="px-label text-muted-foreground">Matching pages</p>
              {matches.length ? (
                <ul className="mt-5 border-t border-hairline">
                  {matches.map((item) => (
                    <li key={item.label} className="border-b border-hairline">
                      <a
                        href={item.href}
                        onClick={closeSearch}
                        className="group flex items-baseline justify-between gap-6 py-4"
                      >
                        <span>
                          <span className="px-label block">{item.label}</span>
                          <span className="px-meta mt-1 block text-muted-foreground">
                            {item.detail}
                          </span>
                        </span>
                        <span
                          aria-hidden
                          className="px-label shrink-0 transition-transform group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-meta mt-5 text-muted-foreground">
                  No quick links match “{q.trim()}”. Try a material, size, topic or tool.
                </p>
              )}
            </section>
          ) : (
            <section aria-label="Quick links">
              <p className="px-label text-muted-foreground">Quick links</p>
              <ul className="mt-5 grid gap-x-8 border-t border-hairline sm:grid-cols-2">
                {links.map((item) => (
                  <li key={item.label} className="border-b border-hairline">
                    <a
                      href={item.href}
                      onClick={closeSearch}
                      className="group flex items-center justify-between gap-5 py-3.5"
                    >
                      <span className="px-label">{item.label}</span>
                      <span
                        aria-hidden
                        className="px-label text-muted-foreground transition-transform group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
