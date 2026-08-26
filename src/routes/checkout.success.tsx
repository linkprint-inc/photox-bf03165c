import { createFileRoute, Link } from "@tanstack/react-router";
import { materialName, productById, sizeLabel, unitPrice, useStore } from "@/lib/store";
import { usePreparedImage } from "@/lib/prepared-image";

export const Route = createFileRoute("/checkout/success")({
  validateSearch: (search: Record<string, unknown>) => ({
    order: typeof search["order"] === "string" ? search["order"] : "",
    email: typeof search["email"] === "string" ? search["email"] : "",
  }),
  head: () => ({ meta: [{ title: "Order received | photoX" }] }),
  component: CheckoutSuccess,
});

function CheckoutSuccess() {
  const { order: orderId, email } = Route.useSearch();
  const { orders } = useStore();
  const { image: prepared } = usePreparedImage();
  const order = orders.find((entry) => entry.id === orderId);

  if (!order) {
    return (
      <main className="min-h-screen bg-paper px-6 py-20 text-foreground md:px-10">
        <Link to="/" className="px-label px-underline">
          photoX
        </Link>
        <h1 className="px-serif mt-14 text-[2.5rem]">Order not found.</h1>
        <Link to="/shop" className="px-label px-underline mt-7 inline-block">
          Create another print →
        </Link>
      </main>
    );
  }

  const subtotal = order.items.reduce(
    (sum, item) => sum + unitPrice(item.material, item.sizeIndex) * item.qty,
    0,
  );
  return (
    <div className="min-h-screen bg-paper text-foreground">
      <header className="px-rule">
        <div className="mx-auto max-w-[1440px] px-6 py-5 md:px-10">
          <Link
            to="/"
            className="px-label px-underline text-[0.95rem] font-semibold tracking-[0.3em] normal-case"
          >
            photoX
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-[900px] px-6 py-16 md:px-10 md:py-24">
        <p className="px-label text-muted-foreground">Thank you.</p>
        <h1 className="px-serif mt-3 text-[2.5rem] md:text-[3.25rem]">
          Your order has been received.
        </h1>
        <p className="px-meta mt-5 text-muted-foreground">Order #{order.id}</p>
        <p className="px-meta mt-2 text-muted-foreground">
          A confirmation has been recorded for {email}.
        </p>
        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <section>
            <h2 className="px-label">Order summary</h2>
            <ul className="mt-5 border-t border-foreground/20">
              {order.items.map((item, index) => {
                const product = productById(item.productId);
                if (!product) return null;
                const src =
                  item.customization?.image.dataUrl ??
                  (item.productId === "custom-print" && prepared
                    ? prepared.dataUrl
                    : product.image);
                return (
                  <li
                    key={`${item.productId}-${index}`}
                    className="flex gap-4 border-b border-foreground/15 py-4"
                  >
                    <img src={src} alt={product.name} className="h-14 w-14 object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="px-label">{product.name}</p>
                      <p className="px-meta mt-1 text-muted-foreground">
                        {materialName[item.material]} · {sizeLabel(item.sizeIndex)} · Qty {item.qty}
                      </p>
                    </div>
                    <p className="px-price">
                      ${unitPrice(item.material, item.sizeIndex) * item.qty}
                    </p>
                  </li>
                );
              })}
            </ul>
            <div className="flex justify-between py-4">
              <span className="px-label">Order subtotal</span>
              <span className="px-price">${subtotal}</span>
            </div>
          </section>
          <section>
            <h2 className="px-label">Delivery address</h2>
            <address className="px-meta mt-5 not-italic text-muted-foreground">
              {order.shippingAddress.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </section>
        </div>
        <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4">
          <a href="/account?tab=Orders" className="px-label px-underline">
            View order →
          </a>
          <Link to="/shop" className="px-label px-underline">
            Create another print →
          </Link>
        </div>
      </main>
    </div>
  );
}
