const columns = [
  {
    title: "Shop",
    links: [
      { label: "Metal Prints", href: "/metal" },
      { label: "Frameless Canvas", href: "/shop" },
      { label: "New Works", href: "/shop" },
      { label: "Best Sellers", href: "/shop" },
    ],
  },
  {
    title: "Create",
    links: [
      { label: "Custom Prints", href: "/custom" },
      { label: "Restore Photo", href: "/custom?tool=restore" },
      { label: "Enhance Resolution", href: "/custom?tool=enhance" },
      { label: "Add Text", href: "/custom?tool=text" },
    ],
  },
  {
    title: "Help",
    links: ["Size Guide", "Shipping", "Returns", "FAQ", "Contact"].map((label) => ({
      label,
      href: "/shop",
    })),
  },
  {
    title: "About",
    links: [
      { label: "About photoX", href: "/about" },
      { label: "Materials", href: "/about" },
      { label: "Artists", href: "/shop" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="px-rule">
      <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <p className="px-label tracking-[0.3em] normal-case">photoX</p>
            <p className="px-meta mt-4 max-w-[24ch] text-muted-foreground">
              Metal prints, frameless canvas and custom wall art.
            </p>
          </div>

          {columns.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <h3 className="px-label">{c.title}</h3>
              <ul className="mt-5 space-y-2">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="px-meta px-underline text-muted-foreground">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="px-rule mt-16 flex flex-wrap items-center justify-between gap-6 pt-6">
          <ul className="flex gap-6">
            {["Instagram", "Pinterest", "Newsletter"].map((s) => (
              <li key={s}>
                <a href="/shop" className="px-meta px-underline">
                  {s}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-6">
            <p className="px-meta text-muted-foreground">Visa · Mastercard · Amex · PayPal</p>
            <p className="px-meta text-muted-foreground">United States (USD $)</p>
            <p className="px-meta text-muted-foreground">© {new Date().getFullYear()} photoX</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
