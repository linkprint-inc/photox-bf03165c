import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useStore, productById, unitPrice, orientedSizeLabel, materialName } from "@/lib/store";
import { usePreparedImage } from "@/lib/prepared-image";

export function BagDrawer() {
  const { drawerOpen, closeDrawer, bag, subtotal, updateBag, removeFromBag } = useStore();
  const { image: prepared } = usePreparedImage();

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
          "cart-drawer absolute right-0 top-0 flex h-full w-full flex-col bg-paper transition-transform duration-[560ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] md:w-[60vw] lg:w-[410px]",
          drawerOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="px-label">Your bag</h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close"
            className="flex h-11 w-11 items-center justify-center text-[1.375rem] font-light leading-none text-muted-foreground transition-colors hover:text-foreground"
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
                to="/products/north-sea"
                onClick={closeDrawer}
                className="px-label px-underline mt-6 inline-block"
              >
                Start a new print →
              </Link>
            </div>
          ) : (
            <ul>
              {bag.map((item) => {
                const p = productById(item.productId);
                if (!p) return null;
                const productHref =
                  item.productId === "custom-print" ? "/products/north-sea" : `/products/${p.id}`;
                const lineTotal = unitPrice(item.material, item.sizeIndex) * item.qty;
                return (
                  <li
                    key={item.key}
                    className="px-rule grid grid-cols-[3.5rem_minmax(0,1fr)_auto] grid-rows-[auto_auto] items-start gap-x-4 gap-y-7 py-8 first:border-t-0 sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:gap-x-6"
                  >
                    <a
                      href={productHref}
                      onClick={closeDrawer}
                      className="row-span-2 block w-14 shrink-0 sm:w-16"
                    >
                      <img
                        src={
                          item.customization?.image.dataUrl ??
                          (item.productId === "custom-print" && prepared
                            ? prepared.dataUrl
                            : p.image)
                        }
                        alt={p.name}
                        className="aspect-square w-full object-cover"
                        loading="lazy"
                      />
                    </a>

                    <div className="min-w-0">
                      <a href={productHref} onClick={closeDrawer} className="px-label px-underline">
                        {p.name}
                      </a>
                      <p className="px-meta mt-2 text-muted-foreground">
                        {materialName[item.material]} ·{" "}
                        {orientedSizeLabel(item.sizeIndex, item.orientation)}
                      </p>
                    </div>

                    <button
                      type="button"
                      aria-label={`Remove ${p.name} from bag`}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        removeFromBag(item.key);
                      }}
                      className="flex h-4 w-4 shrink-0 items-center justify-center justify-self-end text-base font-light leading-none text-muted-foreground transition-colors hover:text-foreground"
                    >
                      ×
                    </button>

                    <div className="col-span-2 col-start-2 flex items-center justify-between">
                      <div className="inline-flex items-center gap-6 text-base font-normal leading-none">
                        <button
                          type="button"
                          aria-label={`Decrease ${p.name} quantity`}
                          onClick={() => updateBag(item.key, { qty: Math.max(1, item.qty - 1) })}
                          className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                        >
                          −
                        </button>
                        <span className="cart-drawer-quantity-value flex h-8 w-[3ch] shrink-0 items-center justify-center tabular-nums">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          aria-label={`Increase ${p.name} quantity`}
                          onClick={() => updateBag(item.key, { qty: item.qty + 1 })}
                          className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                        >
                          +
                        </button>
                      </div>
                      <p className="shrink-0 text-base font-medium leading-none tracking-[0.06em]">
                        ${lineTotal}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {bag.length > 0 && (
          <div className="px-rule shrink-0 px-6 py-5">
            <div className="flex items-baseline justify-between">
              <span className="px-label">Subtotal</span>
              <span className="px-price">${subtotal}</span>
            </div>
            <p className="px-meta mt-2 text-muted-foreground">
              Shipping and taxes calculated at checkout.
            </p>
            <Link
              to="/checkout"
              onClick={closeDrawer}
              className="mt-5 block w-full bg-ink px-6 py-3.5 text-center text-[0.7rem] font-medium uppercase tracking-[0.18em] text-paper transition-opacity hover:opacity-90"
            >
              Checkout
            </Link>
            <Link
              to="/bag"
              onClick={closeDrawer}
              className="px-label px-underline mt-4 inline-block"
            >
              View bag →
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
