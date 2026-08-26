import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/photox/SiteNav";
import { SiteFooter } from "@/components/photox/SiteFooter";
import { Shell } from "@/components/photox/Section";
import { sizeSteps, materialLabel } from "@/lib/shop-data";
import {
  useStore,
  productById,
  unitPrice,
  sizeLabel,
  materialName,
  finishLabel,
  type BagItem,
  type BagMaterial,
} from "@/lib/store";
import { usePreparedImage } from "@/lib/prepared-image";

export const Route = createFileRoute("/bag")({
  head: () => ({
    meta: [
      { title: "Bag — Review Your Prints | photoX" },
      {
        name: "description",
        content:
          "Review the metal prints and frameless canvas works in your photoX bag: material, size, finish and quantity before checkout.",
      },
      { property: "og:title", content: "Bag — Review Your Prints | photoX" },
      {
        property: "og:description",
        content:
          "Review the metal prints and frameless canvas works in your photoX bag before checkout.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BagPage,
});

function QuantitySelector({ qty, onChange }: { qty: number; onChange: (n: number) => void }) {
  return (
    <div className="inline-flex w-fit items-center justify-center gap-5 text-[0.9375rem] font-normal leading-none">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(1, qty - 1))}
        className="flex h-8 w-8 items-center justify-center opacity-60 transition-opacity hover:opacity-100"
      >
        −
      </button>
      <span className="flex h-8 w-[3ch] shrink-0 items-center justify-center tabular-nums">
        {qty}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(qty + 1)}
        className="flex h-8 w-8 items-center justify-center opacity-60 transition-opacity hover:opacity-100"
      >
        +
      </button>
    </div>
  );
}

function ProductInformation({
  name,
  material,
  size,
  finish,
  productHref,
  editing,
  onEdit,
}: {
  name: string;
  material: string;
  size: string;
  finish: string;
  productHref: string;
  editing: boolean;
  onEdit: () => void;
}) {
  return (
    <div className="min-w-0">
      <h2 className="px-label">
        <a href={productHref} className="px-underline">
          {name}
        </a>
      </h2>
      <p className="px-meta mt-1 text-muted-foreground">{material}</p>
      <p className="px-meta text-muted-foreground">{size}</p>
      <p className="px-meta text-muted-foreground">{finish}</p>
      <button
        type="button"
        onClick={onEdit}
        aria-expanded={editing}
        className="px-label px-underline mt-3 inline-block text-muted-foreground"
      >
        Edit →
      </button>
    </div>
  );
}

function BagRow({ item }: { item: BagItem }) {
  const { updateBag, removeFromBag } = useStore();
  const [editing, setEditing] = useState(false);
  const p = productById(item.productId);
  const { image: prepared } = usePreparedImage();
  const src =
    item.customization?.image.dataUrl ??
    (item.productId === "custom-print" && prepared ? prepared.dataUrl : p?.image);
  if (!p) return null;
  const productHref = item.productId === "custom-print" ? "/custom" : `/products/${p.id}`;

  const materials: BagMaterial[] =
    p.material === "both" ? ["metal", "canvas"] : [p.material as BagMaterial];

  return (
    <li className="border-b border-hairline py-10">
      <div className="flex gap-6 md:hidden">
        <a
          href={productHref}
          className="group relative block w-24 shrink-0 overflow-hidden sm:w-32"
          aria-label={`${p.name} — view artwork`}
        >
          <img
            src={src}
            alt={p.name}
            loading="lazy"
            className="aspect-square w-full object-cover"
          />
          <span className="px-reveal absolute inset-x-0 bottom-0 bg-paper/92 py-1.5 text-center text-[0.6rem] font-medium uppercase tracking-[0.14em] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            View →
          </span>
        </a>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
            <ProductInformation
              name={p.name}
              material={materialName[item.material]}
              size={sizeLabel(item.sizeIndex)}
              finish={finishLabel[item.material]}
              productHref={productHref}
              editing={editing}
              onEdit={() => setEditing((v) => !v)}
            />

            <div className="flex flex-col items-start gap-3 sm:items-end">
              <span className="px-label text-muted-foreground">Quantity</span>
              <QuantitySelector qty={item.qty} onChange={(n) => updateBag(item.key, { qty: n })} />
              <p className="px-price">${unitPrice(item.material, item.sizeIndex) * item.qty}</p>
              <button
                type="button"
                onClick={() => removeFromBag(item.key)}
                className="px-label px-underline text-muted-foreground"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:grid md:grid-cols-[120px_minmax(0,1fr)_96px_110px] md:items-start md:gap-x-6 lg:grid-cols-[140px_minmax(0,1fr)_120px_112px] xl:grid-cols-[minmax(160px,180px)_minmax(260px,1fr)_minmax(140px,180px)_minmax(120px,140px)] xl:gap-x-8 min-[1440px]:grid-cols-[180px_minmax(280px,1fr)_180px_140px]">
        <a
          href={productHref}
          className="group relative block w-full overflow-hidden"
          aria-label={`${p.name} — view artwork`}
        >
          <img
            src={src}
            alt={p.name}
            loading="lazy"
            className="aspect-square w-full object-cover"
          />
          <span className="px-reveal absolute inset-x-0 bottom-0 bg-paper/92 py-1.5 text-center text-[0.6rem] font-medium uppercase tracking-[0.14em] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            View →
          </span>
        </a>

        <ProductInformation
          name={p.name}
          material={materialName[item.material]}
          size={sizeLabel(item.sizeIndex)}
          finish={finishLabel[item.material]}
          productHref={productHref}
          editing={editing}
          onEdit={() => setEditing((v) => !v)}
        />

        <div className="flex flex-col items-center gap-7">
          <span className="px-label text-muted-foreground">Quantity</span>
          <QuantitySelector qty={item.qty} onChange={(n) => updateBag(item.key, { qty: n })} />
        </div>

        <div className="flex flex-col items-end gap-10 text-right">
          <p className="text-[1.125rem] font-medium leading-none tracking-normal">
            ${unitPrice(item.material, item.sizeIndex) * item.qty}
          </p>
          <button
            type="button"
            onClick={() => removeFromBag(item.key)}
            className="px-label px-underline text-muted-foreground"
          >
            Remove
          </button>
        </div>
      </div>

      {editing && (
        <div className="px-rule mt-6 grid gap-6 pt-5 md:grid-cols-2">
          <div>
            <p className="px-label text-muted-foreground">Size</p>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {sizeSteps.map((s, i) => (
                <li key={s.label}>
                  <button
                    type="button"
                    onClick={() => updateBag(item.key, { sizeIndex: i })}
                    className={[
                      "px-meta transition-opacity",
                      i === item.sizeIndex
                        ? "opacity-100 underline"
                        : "opacity-45 hover:opacity-100",
                    ].join(" ")}
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="px-label text-muted-foreground">Material / finish</p>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {materials.map((m) => (
                <li key={m}>
                  <button
                    type="button"
                    onClick={() => updateBag(item.key, { material: m })}
                    className={[
                      "px-meta transition-opacity",
                      m === item.material
                        ? "opacity-100 underline"
                        : "opacity-45 hover:opacity-100",
                    ].join(" ")}
                  >
                    {materialName[m]} · {finishLabel[m]}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
}

function OrderSummary({ subtotal }: { subtotal: number }) {
  return (
    <div>
      <h2 className="px-label">Order summary</h2>
      <dl className="mt-6">
        <div className="px-rule flex items-baseline justify-between py-3">
          <dt className="px-label text-muted-foreground">Subtotal</dt>
          <dd className="px-price">${subtotal}</dd>
        </div>
        <div className="px-rule flex items-baseline justify-between gap-4 py-3">
          <dt className="px-label text-muted-foreground">Shipping</dt>
          <dd className="px-meta text-right text-muted-foreground">Calculated at checkout</dd>
        </div>
        <div className="px-rule flex items-baseline justify-between gap-4 py-3">
          <dt className="px-label text-muted-foreground">Estimated tax</dt>
          <dd className="px-meta text-right text-muted-foreground">Calculated at checkout</dd>
        </div>
        <div className="px-rule flex items-baseline justify-between py-4">
          <dt className="px-label">Total</dt>
          <dd className="px-price">${subtotal}</dd>
        </div>
      </dl>

      <Link
        to="/checkout"
        className="mt-6 block w-full bg-ink px-6 py-4 text-center text-[0.7rem] font-medium uppercase tracking-[0.18em] text-paper transition-opacity hover:opacity-90"
      >
        Checkout
      </Link>
      <p className="px-meta mt-4 text-muted-foreground">Secure checkout.</p>
    </div>
  );
}

function EmptyBag() {
  const { saved } = useStore();
  const items = saved.map(productById).filter(Boolean).slice(0, 4);

  return (
    <div>
      <p className="px-serif text-[2.25rem] md:text-[2.75rem]">Your bag is empty.</p>
      <p className="px-meta mt-4 text-muted-foreground">Find something for your walls.</p>
      <Link to="/custom" className="px-label px-underline mt-8 inline-block">
        Start a new print →
      </Link>

      {items.length > 0 && (
        <section className="px-rule mt-20 pt-8">
          <h2 className="px-label">Saved for later</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
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
                <h3 className="px-label mt-4">{p!.name}</h3>
                <p className="px-meta mt-1 text-muted-foreground">{materialLabel[p!.material]}</p>
                <p className="px-price mt-2">
                  <span className="px-label mr-1 opacity-70">From</span>${p!.from}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function BagPage() {
  const { bag, bagCount, subtotal, hydrated } = useStore();
  const empty = !hydrated || bag.length === 0;

  return (
    <div className="bg-background text-foreground">
      <SiteNav variant="light" />
      <main>
        <Shell className="pb-28 pt-32 md:pt-40">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-5">
            <h1 className="px-serif text-[2.5rem] md:text-[3rem]">Bag</h1>
            {!empty && (
              <p className="px-label text-muted-foreground">
                {bagCount} {bagCount === 1 ? "item" : "items"}
              </p>
            )}
          </div>
          {empty ? (
            <div className="pt-16">
              <EmptyBag />
            </div>
          ) : (
            <div className="grid gap-y-14 pt-2 lg:grid-cols-[minmax(0,68fr)_minmax(280px,32fr)] lg:gap-x-12">
              <ul>
                {bag.map((item) => (
                  <BagRow key={item.key} item={item} />
                ))}
              </ul>
              <aside className="lg:pt-8">
                <OrderSummary subtotal={subtotal} />
              </aside>
            </div>
          )}
        </Shell>
      </main>

      {!empty && (
        <div className="px-rule sticky bottom-0 z-40 flex items-center justify-between gap-4 bg-paper/95 px-6 py-3 backdrop-blur-sm lg:hidden">
          <span className="px-price">Total ${subtotal}</span>
          <Link
            to="/checkout"
            className="bg-ink px-6 py-3 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-paper"
          >
            Checkout
          </Link>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
