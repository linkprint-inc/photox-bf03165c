import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FooterLink = { label: string; href: string };
type FooterColumn = { title: string; links: FooterLink[] };

const columns: FooterColumn[] = [
  {
    title: "Inspiration",
    links: [
      { label: "Metal Prints", href: "/metal" },
      { label: "Pets", href: "/shop?category=pets" },
      { label: "Family", href: "/shop?category=family" },
      { label: "Portraits", href: "/shop?category=portraits" },
      { label: "Landscape", href: "/shop?category=landscape" },
      { label: "Community", href: "/community" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Size Guide", href: "/metal" },
      { label: "FAQ", href: "/" },
      { label: "Contact", href: "mailto:hello@photox.com" },
      { label: "Track Order", href: "/account?tab=orders" },
      { label: "Shipping & Delivery", href: "/shipping-policy" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "About photoX", href: "/about" },
      { label: "Materials", href: "/about" },
      { label: "Print Process", href: "/metal" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Refund Policy", href: "/refund-policy" },
      { label: "Shipping Policy", href: "/shipping-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
    ],
  },
];

function FooterLinks({ links, tabIndex }: { links: FooterLink[]; tabIndex?: number }) {
  return (
    <ul className="mt-5 space-y-2">
      {links.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            tabIndex={tabIndex}
            className="px-meta px-underline text-muted-foreground"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function SiteFooter() {
  const [openMobileColumn, setOpenMobileColumn] = useState<string | null>(null);

  return (
    <footer className="px-rule">
      <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <p className="px-label tracking-[0.3em] normal-case">photoX</p>
            <p className="px-meta mt-4 max-w-[24ch] text-muted-foreground">
              Your photos, made physical.
            </p>
          </div>

          <div className="col-span-2 border-y border-hairline lg:hidden">
            {columns.map((column) => {
              const isOpen = openMobileColumn === column.title;
              const contentId = `footer-${column.title.toLowerCase()}`;

              return (
                <section key={column.title} className="border-b border-hairline last:border-b-0">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                    onClick={() => setOpenMobileColumn(isOpen ? null : column.title)}
                    className="flex w-full items-center justify-between py-4 text-left"
                  >
                    <span className="px-label">{column.title}</span>
                    <ChevronDown
                      aria-hidden="true"
                      className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    id={contentId}
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden pb-5">
                      <FooterLinks links={column.links} tabIndex={isOpen ? 0 : -1} />
                    </div>
                  </div>
                </section>
              );
            })}
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="hidden lg:block">
              <h3 className="px-label">{column.title}</h3>
              <FooterLinks links={column.links} />
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
