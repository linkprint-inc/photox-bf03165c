import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/photox/SiteNav";
import { SiteFooter } from "@/components/photox/SiteFooter";
import { Shell } from "@/components/photox/Section";
import { ShopProductCard } from "@/components/photox/shop/ShopProductCard";
import { shopProducts, materialLabel } from "@/lib/shop-data";
import { useStore, productById, unitPrice, sizeLabel, materialName, type Order } from "@/lib/store";

export const Route = createFileRoute("/account")({
  validateSearch: (search: Record<string, unknown>): { tab?: string } =>
    typeof search['tab'] === "string" ? { tab: search['tab'] } : {},
  head: () => ({
    meta: [
      { title: "Account — Orders, Saved Artwork & Profile | photoX" },
      {
        name: "description",
        content:
          "Sign in to your photoX account to follow orders, revisit saved artwork and manage your details.",
      },
      { property: "og:title", content: "Account — Orders, Saved Artwork & Profile | photoX" },
      {
        property: "og:description",
        content:
          "Sign in to your photoX account to follow orders, revisit saved artwork and manage your details.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AccountPage,
});

/* ---------- shared primitives ---------- */

function Field({
  label,
  type = "text",
  value,
  onChange,
  autoComplete,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="px-label text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 block h-11 w-full rounded-none border border-[color:var(--hairline)] bg-transparent px-3 text-[0.875rem] tracking-[0.02em] transition-colors focus:border-ink focus:outline-none"
      />
    </label>
  );
}

function DarkButton({
  children,
  type = "button",
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={[
        "inline-flex items-center justify-center bg-ink px-8 py-3 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-paper transition-opacity hover:opacity-90",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}

/* ---------- signed-out ---------- */

type AuthView = "signin" | "create" | "forgot";

function AuthScreen() {
  const { signIn } = useStore();
  const [view, setView] = useState<AuthView>("signin");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sent, setSent] = useState(false);

  const copy: Record<AuthView, { title: string; lead: string }> = {
    signin: {
      title: "Welcome back.",
      lead: "Sign in to view your orders, saved artwork and account details.",
    },
    create: {
      title: "Create an account.",
      lead: "Keep track of your orders and save the pieces you want to live with.",
    },
    forgot: {
      title: "Reset your password.",
      lead: "Enter your email and we'll send you instructions to reset your password.",
    },
  };

  return (
    <Shell className="pb-28 pt-32 md:pt-40">
      <div className="grid gap-14 md:grid-cols-[45fr_10fr_45fr]">
        <div>
          <p className="px-label text-muted-foreground">Account</p>
          <h1 className="px-serif mt-5 text-[2.75rem] md:text-[3.25rem]">{copy[view].title}</h1>
          <p className="px-meta mt-5 max-w-[34ch] text-muted-foreground">{copy[view].lead}</p>
        </div>

        <div className="hidden md:block" />

        <div>
          <form
            className="max-w-[420px]"
            onSubmit={(e) => {
              e.preventDefault();
              if (view === "forgot") {
                setSent(true);
                return;
              }
              signIn({
                firstName: first || email.split("@")[0]?.replace(/[^a-zA-Z]/g, "") || "Friend",
                lastName: last,
                email,
              });
            }}
          >
            {view === "create" && (
              <div className="grid gap-6 md:grid-cols-2">
                <Field
                  label="First name"
                  value={first}
                  onChange={setFirst}
                  autoComplete="given-name"
                />
                <Field
                  label="Last name"
                  value={last}
                  onChange={setLast}
                  autoComplete="family-name"
                />
              </div>
            )}

            <div className={view === "create" ? "mt-6" : ""}>
              <Field
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                autoComplete="email"
              />
            </div>

            {view !== "forgot" && (
              <div className="mt-6">
                <Field
                  label="Password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  autoComplete={view === "create" ? "new-password" : "current-password"}
                />
              </div>
            )}

            {view === "signin" && (
              <button
                type="button"
                onClick={() => {
                  setView("forgot");
                  setSent(false);
                }}
                className="px-label px-underline mt-5 inline-block text-muted-foreground"
              >
                Forgot password? →
              </button>
            )}

            <div className="mt-8">
              <DarkButton type="submit">
                {view === "signin"
                  ? "Sign in"
                  : view === "create"
                    ? "Create account"
                    : "Send reset link"}
              </DarkButton>
            </div>

            {view === "forgot" && sent && (
              <p className="px-meta mt-5 text-muted-foreground">
                If an account exists for {email || "that address"}, reset instructions are on their
                way.
              </p>
            )}
          </form>

          <div className="px-rule mt-12 max-w-[420px] pt-6">
            {view === "signin" && (
              <>
                <p className="px-label text-muted-foreground">New to photoX?</p>
                <button
                  type="button"
                  onClick={() => setView("create")}
                  className="px-label px-underline mt-3 inline-block"
                >
                  Create an account →
                </button>
              </>
            )}
            {view === "create" && (
              <>
                <p className="px-label text-muted-foreground">Already have an account?</p>
                <button
                  type="button"
                  onClick={() => setView("signin")}
                  className="px-label px-underline mt-3 inline-block"
                >
                  Sign in →
                </button>
              </>
            )}
            {view === "forgot" && (
              <button
                type="button"
                onClick={() => setView("signin")}
                className="px-label px-underline inline-block"
              >
                ← Back to sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}

/* ---------- signed-in ---------- */

const tabs = ["Overview", "Orders", "Saved artwork", "Profile"] as const;
type Tab = (typeof tabs)[number];

function isAccountTab(value: unknown): value is Tab {
  return typeof value === "string" && tabs.includes(value as Tab);
}

function orderTotal(order: Order) {
  return order.items.reduce((n, i) => n + unitPrice(i.material, i.sizeIndex) * i.qty, 0);
}

function ItemRow({
  productId,
  material,
  sizeIndex,
  qty,
}: {
  productId: string;
  material: "metal" | "canvas";
  sizeIndex: number;
  qty: number;
}) {
  const p = productById(productId);
  if (!p) return null;
  return (
    <div className="px-rule grid grid-cols-[72px_minmax(0,1fr)_auto] items-start gap-4 py-6 md:flex md:gap-7">
      <img
        src={p.image}
        alt={p.name}
        loading="lazy"
        className="aspect-square w-[72px] shrink-0 object-cover md:w-[84px]"
      />
      <div className="min-w-0 md:flex-1">
        <p className="px-label break-words">{p.name}</p>
        <p className="px-meta mt-1 text-muted-foreground">{materialName[material]}</p>
        <p className="px-meta text-muted-foreground">{sizeLabel(sizeIndex)}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="px-price">${unitPrice(material, sizeIndex) * qty}</p>
        {qty > 1 && <p className="px-meta mt-1 text-muted-foreground">Qty {qty}</p>}
      </div>
    </div>
  );
}

function SavedRow({ ids, limit }: { ids: string[]; limit: number }) {
  const items = ids.map(productById).filter(Boolean).slice(0, limit);
  return (
    <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-3">
      {items.map((p) => (
        <article key={p!.id}>
          <Link to="/products/$slug" params={{ slug: p!.id }} className="block">
            <img
              src={p!.image}
              alt={p!.name}
              loading="lazy"
              className="aspect-square w-full object-cover"
            />
          </Link>
          <h4 className="px-label mt-4">{p!.name}</h4>
          <p className="px-meta mt-1 text-muted-foreground">{materialLabel[p!.material]}</p>
          <p className="px-price mt-2">
            <span className="px-label mr-1 opacity-70">From</span>${p!.from}
          </p>
        </article>
      ))}
    </div>
  );
}

function EmptySaved() {
  const suggestions = ["blue-hour", "concrete-planes"]
    .map((id) => shopProducts.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <div className="mt-8 grid gap-12 md:grid-cols-[45fr_55fr] md:gap-16">
      <div>
        <p className="px-serif text-[1.5rem]">Nothing saved yet.</p>
        <p className="px-meta mt-2 max-w-[34ch] text-muted-foreground">
          Save pieces while you browse and they'll appear here.
        </p>
        <Link to="/shop" className="px-label px-underline mt-6 inline-block">
          Explore art →
        </Link>
      </div>

      <div>
        <p className="px-label text-muted-foreground">You might like</p>
        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
          {suggestions.map((p) => (
            <article key={p!.id}>
              <Link to="/products/$slug" params={{ slug: p!.id }} className="block">
                <img
                  src={p!.image}
                  alt={p!.name}
                  loading="lazy"
                  className="aspect-square w-full object-cover"
                />
              </Link>
              <h4 className="px-label mt-3">{p!.name}</h4>
              <p className="px-price mt-1">
                <span className="px-label mr-1 opacity-70">From</span>${p!.from}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function Overview({ onTab }: { onTab: (t: Tab) => void }) {
  const { orders, saved } = useStore();
  const recent = orders[0];

  return (
    <div>
      <section>
        <h2 className="px-label">Recent order</h2>
        {recent ? (
          <div className="mt-6">
            <div className="flex flex-col items-start gap-1 md:flex-row md:flex-wrap md:items-baseline md:justify-between md:gap-x-6">
              <p className="px-label">Order #{recent.id}</p>
              <p className="px-meta text-muted-foreground">Placed {recent.placed}</p>
            </div>
            {recent.items.map((i, idx) => (
              <ItemRow key={idx} {...i} />
            ))}
            <div className="px-rule flex flex-wrap items-baseline justify-between gap-4 py-5">
              <div>
                <p className="px-label text-muted-foreground">Status</p>
                <p className="px-meta mt-1">{recent.status}</p>
              </div>
              <button
                type="button"
                onClick={() => onTab("Orders")}
                className="px-label px-underline"
              >
                View order →
              </button>
            </div>
          </div>
        ) : (
          <p className="px-meta mt-4 text-muted-foreground">No orders yet.</p>
        )}
      </section>

      <section className="px-rule mt-16 pt-8">
        <h2 className="px-label">Saved artwork</h2>
        {saved.length ? (
          <>
            <SavedRow ids={saved} limit={3} />
            <button
              type="button"
              onClick={() => onTab("Saved artwork")}
              className="px-label px-underline mt-8 inline-block"
            >
              View saved artwork →
            </button>
          </>
        ) : (
          <EmptySaved />
        )}
      </section>
    </div>
  );
}

function Orders() {
  const { orders } = useStore();
  const [open, setOpen] = useState<string | null>(null);
  const order = orders.find((o) => o.id === open);

  if (order) {
    const subtotal = orderTotal(order);
    const shipping = 0;
    const tax = Math.round(subtotal * 0.08875);
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen(null)}
          className="px-label px-underline text-muted-foreground"
        >
          ← All orders
        </button>
        <h2 className="px-serif mt-6 text-[2rem]">Order #{order.id}</h2>

        <div className="px-rule mt-8 grid grid-cols-2 gap-6 pt-6 sm:grid-cols-3">
          <div>
            <p className="px-label text-muted-foreground">Status</p>
            <p className="px-meta mt-1">{order.status}</p>
          </div>
          <div>
            <p className="px-label text-muted-foreground">Ordered</p>
            <p className="px-meta mt-1">{order.placed}</p>
          </div>
          <div>
            <p className="px-label text-muted-foreground">Items</p>
            <p className="px-meta mt-1">{order.items.reduce((n, i) => n + i.qty, 0)}</p>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="px-label">Items</h3>
          {order.items.map((i, idx) => (
            <ItemRow key={idx} {...i} />
          ))}
        </div>

        <dl className="mt-10 max-w-[380px]">
          <div className="px-rule flex justify-between py-3">
            <dt className="px-label text-muted-foreground">Subtotal</dt>
            <dd className="px-price">${subtotal}</dd>
          </div>
          <div className="px-rule flex justify-between py-3">
            <dt className="px-label text-muted-foreground">Shipping</dt>
            <dd className="px-price">${shipping}</dd>
          </div>
          <div className="px-rule flex justify-between py-3">
            <dt className="px-label text-muted-foreground">Tax</dt>
            <dd className="px-price">${tax}</dd>
          </div>
          <div className="px-rule flex justify-between py-3">
            <dt className="px-label">Total</dt>
            <dd className="px-price">${subtotal + shipping + tax}</dd>
          </div>
        </dl>

        <div className="mt-12 grid gap-10 sm:grid-cols-2">
          <div>
            <h3 className="px-label">Shipping address</h3>
            <address className="px-meta mt-3 not-italic text-muted-foreground">
              {order.shippingAddress.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </address>
          </div>
          <div>
            <h3 className="px-label">Customer information</h3>
            <p className="px-meta mt-3 text-muted-foreground">
              Confirmation and production updates are sent to the email on this account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="px-serif text-[2rem]">Orders</h2>
      <p className="px-meta mt-3 text-muted-foreground">
        View your current and past photoX orders.
      </p>

      <div className="mt-10">
        {orders.length === 0 && <p className="px-meta text-muted-foreground">No orders yet.</p>}
        {orders.map((o) => (
          <div
            key={o.id}
            className="px-rule grid min-w-0 grid-cols-1 items-baseline gap-x-6 gap-y-2 py-6 md:grid-cols-[1.1fr_1fr_0.8fr_0.7fr_1fr_auto]"
          >
            <p className="px-label">Order #{o.id}</p>
            <p className="px-meta text-muted-foreground">{o.placed.toUpperCase()}</p>
            <p className="px-meta text-muted-foreground">
              {o.items.reduce((n, i) => n + i.qty, 0)} items
            </p>
            <p className="px-price">${orderTotal(o)}</p>
            <p className="px-meta text-muted-foreground">{o.status}</p>
            <button
              type="button"
              onClick={() => setOpen(o.id)}
              className="px-label px-underline justify-self-start md:justify-self-end"
            >
              View order →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SavedArtwork() {
  const { saved } = useStore();
  const items = saved.map((id) => shopProducts.find((p) => p.id === id)).filter(Boolean);

  return (
    <div>
      <h2 className="px-serif text-[2rem]">Saved artwork</h2>
      <p className="px-meta mt-3 text-muted-foreground">Pieces you've saved while browsing.</p>
      {items.length ? (
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-3">
          {items.map((p) => (
            <ShopProductCard key={p!.id} product={p!} view="grid" action="remove" />
          ))}
        </div>
      ) : (
        <EmptySaved />
      )}
    </div>
  );
}

function Profile() {
  const { account, updateAccount, updatePassword } = useStore();
  const [first, setFirst] = useState(account?.firstName ?? "");
  const [last, setLast] = useState(account?.lastName ?? "");
  const [email, setEmail] = useState(account?.email ?? "");
  const [address, setAddress] = useState(
    account?.shippingAddress ?? {
      firstName: "",
      lastName: "",
      address: "",
      apartment: "",
      city: "",
      region: "",
      postalCode: "",
      country: "",
    },
  );
  const [savedMsg, setSavedMsg] = useState(false);
  const [addressSaved, setAddressSaved] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  const setAddressField = (field: keyof typeof address, value: string) => {
    setAddress((current) => ({ ...current, [field]: value }));
    setAddressSaved(false);
  };

  const closePassword = () => {
    setPasswordOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };

  return (
    <div>
      <h2 className="px-serif text-[2rem]">Profile</h2>

      <section className="px-rule mt-10 pt-8">
        <h3 className="px-label">Personal details</h3>
        <form
          className="mt-6 max-w-[460px]"
          onSubmit={(e) => {
            e.preventDefault();
            updateAccount({ firstName: first, lastName: last, email });
            setSavedMsg(true);
          }}
        >
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="First name" value={first} onChange={setFirst} />
            <Field label="Last name" value={last} onChange={setLast} />
          </div>
          <div className="mt-6">
            <Field label="Email" type="email" value={email} onChange={setEmail} />
          </div>
          <div className="mt-8 flex items-center gap-5">
            <DarkButton type="submit">Save changes</DarkButton>
            {savedMsg && <span className="px-meta text-muted-foreground">Saved.</span>}
          </div>
        </form>
      </section>

      <section className="px-rule mt-12 pt-8">
        <h3 className="px-label">Default shipping address</h3>
        <form
          className="mt-6 max-w-[620px]"
          onSubmit={(e) => {
            e.preventDefault();
            updateAccount({ shippingAddress: address });
            setAddressSaved(true);
          }}
        >
          <div className="grid gap-6 md:grid-cols-2">
            <Field
              label="First name"
              value={address.firstName}
              onChange={(value) => setAddressField("firstName", value)}
              autoComplete="shipping given-name"
            />
            <Field
              label="Last name"
              value={address.lastName}
              onChange={(value) => setAddressField("lastName", value)}
              autoComplete="shipping family-name"
            />
          </div>
          <div className="mt-6">
            <Field
              label="Address"
              value={address.address}
              onChange={(value) => setAddressField("address", value)}
              autoComplete="shipping street-address"
            />
          </div>
          <div className="mt-6">
            <Field
              label="Apartment / suite · optional"
              value={address.apartment}
              onChange={(value) => setAddressField("apartment", value)}
              autoComplete="shipping address-line2"
            />
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Field
              label="City"
              value={address.city}
              onChange={(value) => setAddressField("city", value)}
              autoComplete="shipping address-level2"
            />
            <Field
              label="State / region"
              value={address.region}
              onChange={(value) => setAddressField("region", value)}
              autoComplete="shipping address-level1"
            />
            <Field
              label="Zip / postal code"
              value={address.postalCode}
              onChange={(value) => setAddressField("postalCode", value)}
              autoComplete="shipping postal-code"
            />
            <Field
              label="Country"
              value={address.country}
              onChange={(value) => setAddressField("country", value)}
              autoComplete="shipping country-name"
            />
          </div>
          <div className="mt-8 flex items-center gap-5">
            <DarkButton type="submit">Save address</DarkButton>
            {addressSaved && <span className="px-meta text-muted-foreground">Address saved.</span>}
          </div>
        </form>
      </section>

      <section className="px-rule mt-12 pt-8">
        <h3 className="px-label">Password</h3>
        <p className="px-meta mt-3 tracking-[0.3em] text-muted-foreground">••••••••</p>
        {!passwordOpen ? (
          <button
            type="button"
            onClick={() => {
              setPasswordOpen(true);
              setPasswordUpdated(false);
            }}
            className="px-label px-underline mt-5 inline-block"
          >
            Change password →
          </button>
        ) : (
          <form
            className="mt-6 max-w-[460px]"
            onSubmit={(e) => {
              e.preventDefault();
              if (!currentPassword || !newPassword || !confirmPassword) {
                setPasswordError("Complete all password fields.");
                return;
              }
              if (newPassword !== confirmPassword) {
                setPasswordError("Passwords do not match.");
                return;
              }
              if (!updatePassword(currentPassword, newPassword)) {
                setPasswordError("Unable to update password.");
                return;
              }
              closePassword();
              setPasswordUpdated(true);
            }}
          >
            <div className="space-y-6">
              <Field
                label="Current password"
                type="password"
                value={currentPassword}
                onChange={setCurrentPassword}
                autoComplete="current-password"
              />
              <Field
                label="New password"
                type="password"
                value={newPassword}
                onChange={setNewPassword}
                autoComplete="new-password"
              />
              <Field
                label="Confirm new password"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                autoComplete="new-password"
              />
            </div>
            {passwordError && <p className="px-meta mt-4 text-foreground">{passwordError}</p>}
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <DarkButton type="submit">Update password</DarkButton>
              <button
                type="button"
                onClick={closePassword}
                className="px-label px-underline text-muted-foreground"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        {passwordUpdated && <p className="px-meta mt-5 text-muted-foreground">Password updated.</p>}
      </section>
    </div>
  );
}

/* ---------- shell ---------- */

function AccountPage() {
  const { account, signOut, hydrated } = useStore();
  const { tab: requestedTab } = Route.useSearch();
  const [tab, setTab] = useState<Tab>(() =>
    isAccountTab(requestedTab) ? requestedTab : "Overview",
  );

  useEffect(() => {
    if (isAccountTab(requestedTab)) setTab(requestedTab);
  }, [requestedTab]);

  return (
    <div className="account-page w-full max-w-full min-w-0 overflow-x-clip bg-background text-foreground">
      <SiteNav variant="light" />
      <main className="w-full max-w-full min-w-0">
        {!hydrated || !account ? (
          <AuthScreen />
        ) : (
          <Shell className="pb-28 pt-[108px] md:pt-[132px]">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <div className="min-w-0">
                <p className="px-label text-muted-foreground">Account</p>
                <h1 className="px-serif mt-3 text-[2.15rem] md:text-[2.6rem]">
                  Welcome back, {account.firstName}.
                </h1>
              </div>
              <button
                type="button"
                onClick={signOut}
                className="px-label px-underline shrink-0 text-muted-foreground"
              >
                Sign out
              </button>
            </div>

            <div className="px-rule mt-10 grid gap-12 pt-10 lg:grid-cols-[23fr_77fr] lg:gap-16">
              <nav aria-label="Account sections">
                <ul className="-mx-6 flex gap-6 overflow-x-auto px-6 max-md:mx-0 max-md:grid max-md:grid-cols-2 max-md:gap-x-6 max-md:gap-y-4 max-md:overflow-visible max-md:px-0 lg:mx-0 lg:block lg:space-y-3 lg:overflow-visible lg:px-0">
                  {tabs.map((t) => (
                    <li key={t} className="shrink-0">
                      <button
                        type="button"
                        onClick={() => setTab(t)}
                        aria-current={tab === t ? "page" : undefined}
                        className={[
                          "px-label px-underline whitespace-nowrap transition-opacity duration-300",
                          tab === t
                            ? "opacity-100 after:scale-x-100"
                            : "opacity-45 hover:opacity-100",
                        ].join(" ")}
                      >
                        {t}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="min-w-0">
                {tab === "Overview" && <Overview onTab={setTab} />}
                {tab === "Orders" && <Orders />}
                {tab === "Saved artwork" && <SavedArtwork />}
                {tab === "Profile" && <Profile />}
              </div>
            </div>
          </Shell>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
