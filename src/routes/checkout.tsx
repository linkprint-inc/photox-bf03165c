import { useEffect, useState } from "react";
import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { productById, materialName, orientedSizeLabel, unitPrice, useStore } from "@/lib/store";
import { usePreparedImage } from "@/lib/prepared-image";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout | photoX" }] }),
  component: CheckoutPage,
});

type CheckoutFields = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
};

const emptyFields: CheckoutFields = {
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  apartment: "",
  city: "",
  region: "",
  postalCode: "",
  country: "",
};

function CheckoutHeader() {
  return (
    <header className="px-rule bg-paper">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 md:px-10">
        <Link
          to="/"
          className="px-label px-underline text-[0.95rem] font-semibold tracking-[0.3em] normal-case"
        >
          photoX
        </Link>
        <div className="flex items-center gap-6">
          <Link
            to="/bag"
            className="px-label px-underline text-muted-foreground hover:text-foreground"
          >
            ← Return to bag
          </Link>
          <span className="px-label text-muted-foreground">Secure checkout</span>
        </div>
      </div>
    </header>
  );
}

function Field({
  label,
  value,
  error,
  optional = false,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  error?: string | undefined;
  optional?: boolean;
  type?: "email" | "text";
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="px-label text-muted-foreground">
        {label}
        {optional ? " · optional" : ""}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-none border border-foreground/20 bg-transparent px-3 text-[0.95rem] outline-none transition-colors focus:border-foreground"
      />
      {error ? <span className="px-meta mt-2 block text-foreground">{error}</span> : null}
    </label>
  );
}

function CheckoutSummary() {
  const { bag, subtotal } = useStore();
  const { image: prepared } = usePreparedImage();

  return (
    <aside className="lg:sticky lg:top-8">
      <h2 className="px-label">Order summary</h2>
      <ul className="mt-5 border-t border-foreground/20">
        {bag.map((item) => {
          const product = productById(item.productId);
          if (!product) return null;
          const src =
            item.customization?.image.dataUrl ??
            (item.productId === "custom-print" && prepared ? prepared.dataUrl : product.image);
          const total = unitPrice(item.material, item.sizeIndex) * item.qty;
          return (
            <li key={item.key} className="flex gap-4 border-b border-foreground/15 py-4">
              <img src={src} alt={product.name} loading="lazy" className="h-16 w-16 object-cover" />
              <div className="min-w-0 flex-1">
                <p className="px-label">{product.name}</p>
                <p className="px-meta mt-1 text-muted-foreground">
                  {materialName[item.material]} ·{" "}
                  {orientedSizeLabel(item.sizeIndex, item.orientation)}
                </p>
                <p className="px-meta text-muted-foreground">Qty {item.qty}</p>
              </div>
              <p className="px-price whitespace-nowrap">${total}</p>
            </li>
          );
        })}
      </ul>
      <dl className="border-b border-foreground/20">
        <div className="flex items-baseline justify-between py-4">
          <dt className="px-label text-muted-foreground">Subtotal</dt>
          <dd className="px-price">${subtotal}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-5 border-t border-foreground/15 py-4">
          <dt className="px-label text-muted-foreground">Shipping</dt>
          <dd className="px-meta text-right text-muted-foreground">Not configured</dd>
        </div>
        <div className="flex items-baseline justify-between gap-5 border-t border-foreground/15 py-4">
          <dt className="px-label text-muted-foreground">Tax</dt>
          <dd className="px-meta text-right text-muted-foreground">Not configured</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-foreground/15 py-4">
          <dt className="px-label">Total</dt>
          <dd className="px-meta text-muted-foreground">Calculated when configured</dd>
        </div>
      </dl>
    </aside>
  );
}

function CheckoutPage() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { bag, account, hydrated, placeOrder } = useStore();
  const [fields, setFields] = useState<CheckoutFields>({
    ...emptyFields,
    email: account?.email ?? "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFields, string>>>({});

  useEffect(() => {
    if (!account) return;
    const savedAddress = account.shippingAddress;
    setFields((current) => ({
      ...current,
      email: current.email || account.email,
      firstName: current.firstName || savedAddress?.firstName || "",
      lastName: current.lastName || savedAddress?.lastName || "",
      address: current.address || savedAddress?.address || "",
      apartment: current.apartment || savedAddress?.apartment || "",
      city: current.city || savedAddress?.city || "",
      region: current.region || savedAddress?.region || "",
      postalCode: current.postalCode || savedAddress?.postalCode || "",
      country: current.country || savedAddress?.country || "",
    }));
  }, [account]);

  if (pathname === "/checkout/success") return <Outlet />;

  const setField = (field: keyof CheckoutFields, value: string) => {
    setFields((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Partial<Record<keyof CheckoutFields, string>> = {};
    if (!/^\S+@\S+\.\S+$/.test(fields.email)) next.email = "Please enter a valid email.";
    (
      ["firstName", "lastName", "address", "city", "region", "postalCode", "country"] as const
    ).forEach((field) => {
      if (!fields[field].trim()) next[field] = "This field is required.";
    });
    if (!bag.length) next.email = "Your bag is empty.";
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }

    const order = placeOrder({
      email: fields.email,
      shippingAddress: [
        `${fields.firstName} ${fields.lastName}`,
        fields.address,
        fields.apartment,
        `${fields.city}, ${fields.region} ${fields.postalCode}`,
        fields.country,
      ].filter(Boolean),
    });
    navigate({ to: "/checkout/success", search: { order: order.id, email: fields.email } });
  };

  if (hydrated && !bag.length) {
    return (
      <div className="min-h-screen bg-paper text-foreground">
        <CheckoutHeader />
        <main className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-28">
          <h1 className="px-serif text-[2.5rem]">Your bag is empty.</h1>
          <Link to="/custom" className="px-label px-underline mt-7 inline-block">
            Start a new print →
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-foreground">
      <CheckoutHeader />
      <main className="mx-auto max-w-[1440px] px-6 py-12 md:px-10 md:py-16">
        <h1 className="px-serif text-[2.5rem] md:text-[3rem]">Checkout</h1>
        <div className="mt-10 grid gap-14 lg:grid-cols-[60fr_40fr] lg:gap-20">
          <form onSubmit={submit} noValidate>
            <section>
              <p className="px-label text-muted-foreground">01</p>
              <h2 className="px-label mt-2">Contact</h2>
              <div className="mt-5 max-w-xl">
                <Field
                  label="Email"
                  type="email"
                  value={fields.email}
                  error={errors.email}
                  onChange={(value) => setField("email", value)}
                />
              </div>
            </section>

            <section className="px-rule mt-10 pt-8">
              <p className="px-label text-muted-foreground">02</p>
              <h2 className="px-label mt-2">Delivery</h2>
              <div className="mt-5 grid max-w-xl gap-5 md:grid-cols-2">
                <Field
                  label="First name"
                  value={fields.firstName}
                  error={errors.firstName}
                  onChange={(value) => setField("firstName", value)}
                />
                <Field
                  label="Last name"
                  value={fields.lastName}
                  error={errors.lastName}
                  onChange={(value) => setField("lastName", value)}
                />
                <div className="sm:col-span-2">
                  <Field
                    label="Address"
                    value={fields.address}
                    error={errors.address}
                    onChange={(value) => setField("address", value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Field
                    label="Apartment / suite"
                    optional
                    value={fields.apartment}
                    onChange={(value) => setField("apartment", value)}
                  />
                </div>
                <Field
                  label="City"
                  value={fields.city}
                  error={errors.city}
                  onChange={(value) => setField("city", value)}
                />
                <Field
                  label="State / region"
                  value={fields.region}
                  error={errors.region}
                  onChange={(value) => setField("region", value)}
                />
                <Field
                  label="Zip / postal code"
                  value={fields.postalCode}
                  error={errors.postalCode}
                  onChange={(value) => setField("postalCode", value)}
                />
                <Field
                  label="Country"
                  value={fields.country}
                  error={errors.country}
                  onChange={(value) => setField("country", value)}
                />
              </div>
              <div className="mt-7 max-w-xl border-t border-foreground/15 pt-5">
                <h3 className="px-label">Shipping method</h3>
                <p className="px-meta mt-2 text-muted-foreground">
                  Live shipping rates are not configured in this demo.
                </p>
              </div>
            </section>

            <section className="px-rule mt-10 pt-8">
              <p className="px-label text-muted-foreground">03</p>
              <h2 className="px-label mt-2">Payment</h2>
              <p className="px-meta mt-5 max-w-xl text-muted-foreground">
                Payment processing is not configured. Placing this order records it locally without
                charging a card.
              </p>
            </section>

            <div className="mt-10 lg:hidden">
              <CheckoutSummary />
            </div>
            <div className="px-rule mt-10 pt-8">
              <button
                type="submit"
                disabled={!hydrated || !bag.length}
                className="w-full bg-ink px-6 py-4 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-paper transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
              >
                Place order
              </button>
              <p className="px-meta mt-4 text-muted-foreground">
                By placing this demo order, you acknowledge that no payment is processed.
              </p>
            </div>
          </form>
          <div className="hidden lg:block">
            <CheckoutSummary />
          </div>
        </div>
      </main>
    </div>
  );
}
