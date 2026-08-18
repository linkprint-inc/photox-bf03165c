import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useStore, productById, unitPrice, sizeLabel, materialName } from "@/lib/store";
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
          "absolute right-0 top-0 flex h-full w-full flex-col bg-paper transition-transform duration-[560ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] md:w-[60vw] lg:w-[410px]",
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
                const productHref =
                  item.productId === "custom-print" ? "/custom" : `/products/${p.id}`;
                const lineTotal = unitPrice(item.material, item.sizeIndex) * item.qty;
                return (
                  <li
                    key={item.key}
                    className="px-rule grid grid-cols-[4rem_minmax(0,1fr)_2.25rem] items-start gap-4 py-7 first:border-t-0"
                  >
                    <a href={productHref} onClick={closeDrawer} className="block w-16 shrink-0">
                      <img
                        src={
                          item.productId === "custom-print" && prepared ? prepared.dataUrl : p.image
                        }
                        alt={p.name}
                        className="aspect-square w-16 object-cover"
                        loading="lazy"
                      />
                    </a>
                    <div className="min-w-0 flex-1">
                      <a href={productHref} onClick={closeDrawer} className="px-label px-underline">
                        {p.name}
                      </a>
                      <p className="px-meta mt-1 text-muted-foreground">
                        {materialName[item.material]} · {sizeLabel(item.sizeIndex)}
                      </p>
                      <div className="mt-3 flex items-center">
                        <div className="flex items-center gap-0">
                          <button
                            type="button"
                            aria-label={`Decrease ${p.name} quantity`}
                            onClick={() => updateBag(item.key, { qty: Math.max(1, item.qty - 1) })}
                            className="px-label flex h-9 w-9 items-center justify-center text-base leading-none text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                          >
                            −
                          </button>
                          <span className="px-price w-6 text-center">{item.qty}</span>
                          <button
                            type="button"
                            aria-label={`Increase ${p.name} quantity`}
                            onClick={() => updateBag(item.key, { qty: item.qty + 1 })}
                            className="px-label flex h-9 w-9 items-center justify-center text-base leading-none text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex self-stretch flex-col items-end justify-between">
                      <button
                        type="button"
                        aria-label={`Remove ${p.name} from bag`}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          removeFromBag(item.key);
                        }}
                        className="flex h-9 w-9 shrink-0 items-center justify-center text-base font-light leading-none text-muted-foreground transition-colors hover:text-foreground"
                      >
                        ×
                      </button>
                      <p className="px-price whitespace-nowrap">${lineTotal}</p>
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
