import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  useStore,
  productById,
  unitPrice,
  sizeLabel,
  materialName,
} from "@/lib/store";

export function BagDrawer() {
  const { drawerOpen, closeDrawer, bag, subtotal, bagCount } = useStore();

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen, closeDrawer]);

  return (
    <div
      aria-hidden={!drawerOpen}
      className={[
        "fixed inset-0 z-[70]",
        drawerOpen ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
    >
      <button
        type="button"
        tabIndex={drawerOpen ? 0 : -1}
        aria-label="Close bag"
        onClick={closeDrawer}
        className={[
          "absolute inset-0 bg-ink/25 transition-opacity duration-[520ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]",
          drawerOpen ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />

      <aside
        aria-label="Your bag"
        className={[
          "absolute right-0 top-0 flex h-full w-full flex-col bg-paper transition-transform duration-[560ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] sm:w-[410px]",
          drawerOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="px-label">Your bag</h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close"
            className="px-label text-base leading-none opacity-60 transition-opacity hover:opacity-100"
          >
            ×
          </button>
        </div>
        <div className="px-rule" />

        <div className="flex-1 overflow-y-auto px-6">
          {bag.length === 0 ? (
            <div className="py-12">
              <p className="px-serif text-[1.5rem]">Your bag is empty.</p>
              <p className="px-meta mt-2 text-muted-foreground">Find something for your walls.</p>
              <Link
                to="/shop"
                onClick={closeDrawer}
                className="px-label px-underline mt-6 inline-block"
              >
                Shop art →
              </Link>
            </div>
          ) : (
            <ul>
              {bag.map((item) => {
                const p = productById(item.productId);
                if (!p) return null;
                return (
                  <li key={item.key} className="px-rule flex gap-4 py-5 first:border-t-0">
                    <Link to="/shop" onClick={closeDrawer} className="block w-16 shrink-0">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="aspect-square w-16 object-cover"
                        loading="lazy"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <p className="px-label">{p.name}</p>
                      <p className="px-meta mt-1 text-muted-foreground">
                        {materialName[item.material]} · {sizeLabel(item.sizeIndex)}
                      </p>
                      <p className="px-price mt-2">
                        {item.qty} × ${unitPrice(item.material, item.sizeIndex)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {bag.length > 0 && (
          <div className="px-rule px-6 py-5">
            <div className="flex items-baseline justify-between">
              <span className="px-label">Subtotal</span>
              <span className="px-price">${subtotal}</span>
            </div>
            <button
              type="button"
              className="mt-5 block w-full bg-ink px-6 py-3.5 text-center text-[0.7rem] font-medium uppercase tracking-[0.18em] text-paper transition-opacity hover:opacity-90"
            >
              Checkout
            </button>
            <Link
              to="/bag"
              onClick={closeDrawer}
              className="px-label px-underline mt-4 inline-block"
            >
              View bag ({bagCount}) →
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
